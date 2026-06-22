import { beforeEach, describe, expect, it, vi } from "vitest";

import type { UserProfileRow } from "@/lib/account/types";

const mockFrom = vi.fn();
const mockCreateServiceClient = vi.fn(() => ({
  from: mockFrom,
}));

vi.mock("@/lib/auth/service-client", () => ({
  createServiceClient: () => mockCreateServiceClient(),
}));

const { ensureProfile } = await import("@/lib/account/ensure-profile");

function createProfile(overrides: Partial<UserProfileRow> = {}): UserProfileRow {
  return {
    user_id: "user-1",
    phone_e164: "+8613812345678",
    plan: "pro",
    entitlement_status: "active",
    expires_at: "2026-09-20T02:00:00.000Z",
    enrolled_at: "2026-06-22T02:00:00.000Z",
    created_at: "2026-06-22T02:00:00.000Z",
    updated_at: "2026-06-22T02:00:00.000Z",
    ...overrides,
  };
}

function mockSelectChain(result: { data: UserProfileRow | null; error: null }) {
  return {
    select: vi.fn().mockReturnValue({
      eq: vi.fn().mockReturnValue({
        maybeSingle: vi.fn().mockResolvedValue(result),
      }),
    }),
  };
}

describe("ensureProfile", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns existing profile without insert", async () => {
    const existing = createProfile();
    mockFrom.mockReturnValue(mockSelectChain({ data: existing, error: null }));

    const result = await ensureProfile({
      userId: "user-1",
      phoneE164: "+8613812345678",
    });

    expect(result).toEqual(existing);
    expect(mockFrom).toHaveBeenCalledTimes(1);
  });

  it("inserts profile once when missing and returns created row", async () => {
    const created = createProfile();
    const insert = vi.fn().mockResolvedValue({ error: null });

    mockFrom
      .mockReturnValueOnce(mockSelectChain({ data: null, error: null }))
      .mockReturnValueOnce({
        insert,
      })
      .mockReturnValueOnce(mockSelectChain({ data: created, error: null }))
      .mockReturnValueOnce({
        select: vi.fn().mockReturnValue({
          in: vi.fn().mockResolvedValue({
            data: [
              { key: "beta_enrollment_ends_at", value: "2026-12-31T23:59:59Z" },
              { key: "beta_pro_duration_days", value: 90 },
            ],
            error: null,
          }),
        }),
      });

    // readBetaConfig runs before second select - reorder mocks
    mockFrom.mockReset();
    mockFrom
      .mockReturnValueOnce(mockSelectChain({ data: null, error: null }))
      .mockReturnValueOnce({
        select: vi.fn().mockReturnValue({
          in: vi.fn().mockResolvedValue({
            data: [
              { key: "beta_enrollment_ends_at", value: "2026-12-31T23:59:59Z" },
              { key: "beta_pro_duration_days", value: 90 },
            ],
            error: null,
          }),
        }),
      })
      .mockReturnValueOnce({ insert })
      .mockReturnValueOnce(mockSelectChain({ data: created, error: null }));

    const result = await ensureProfile({
      userId: "user-1",
      phoneE164: "+8613812345678",
    });

    expect(insert).toHaveBeenCalledTimes(1);
    expect(result.plan).toBe("pro");
  });

  it("is idempotent on duplicate insert conflict", async () => {
    const existing = createProfile({ plan: "free", expires_at: null });
    const insert = vi.fn().mockResolvedValue({ error: { code: "23505" } });

    mockFrom
      .mockReturnValueOnce(mockSelectChain({ data: null, error: null }))
      .mockReturnValueOnce({
        select: vi.fn().mockReturnValue({
          in: vi.fn().mockResolvedValue({
            data: [
              { key: "beta_enrollment_ends_at", value: "2020-01-01T00:00:00Z" },
              { key: "beta_pro_duration_days", value: 90 },
            ],
            error: null,
          }),
        }),
      })
      .mockReturnValueOnce({ insert })
      .mockReturnValueOnce(mockSelectChain({ data: existing, error: null }));

    const result = await ensureProfile({
      userId: "user-1",
      phoneE164: "+8613812345678",
    });

    expect(insert).toHaveBeenCalledTimes(1);
    expect(result.plan).toBe("free");
  });
});
