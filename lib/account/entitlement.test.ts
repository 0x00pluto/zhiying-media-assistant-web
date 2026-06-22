import { describe, expect, it } from "vitest";

import {
  getPlanLabel,
  resolveEntitlementStatus,
  resolveInitialEntitlement,
  toEntitlementSnapshot,
} from "@/lib/account/entitlement";
import type { UserProfileRow } from "@/lib/account/types";

const baseProfile: UserProfileRow = {
  user_id: "user-1",
  phone_e164: "+8613812345678",
  plan: "pro",
  entitlement_status: "active",
  expires_at: "2026-12-31T23:59:59Z",
  enrolled_at: "2026-06-22T02:00:00.000Z",
  created_at: "2026-06-22T02:00:00.000Z",
  updated_at: "2026-06-22T02:00:00.000Z",
};

describe("entitlement", () => {
  it("grants pro with expiry during open beta", () => {
    const now = new Date("2026-06-22T02:00:00.000Z");
    const result = resolveInitialEntitlement(
      { endsAt: "2026-12-31T23:59:59Z", durationDays: 90 },
      now,
    );

    expect(result.plan).toBe("pro");
    expect(result.expiresAt?.toISOString()).toBe("2026-09-20T02:00:00.000Z");
  });

  it("grants free when beta is closed", () => {
    const now = new Date("2027-01-01T00:00:00Z");
    const result = resolveInitialEntitlement(
      { endsAt: "2026-12-31T23:59:59Z", durationDays: 90 },
      now,
    );

    expect(result.plan).toBe("free");
    expect(result.expiresAt).toBeNull();
  });

  it("returns active when pro is not expired", () => {
    const status = resolveEntitlementStatus(baseProfile, new Date("2026-07-01T00:00:00Z"));
    expect(status).toBe("active");
  });

  it("returns expired when pro expires_at is in the past", () => {
    const status = resolveEntitlementStatus(baseProfile, new Date("2027-01-01T00:00:00Z"));
    expect(status).toBe("expired");
  });

  it("keeps revoked from db", () => {
    const status = resolveEntitlementStatus(
      { ...baseProfile, entitlement_status: "revoked" },
      new Date("2026-07-01T00:00:00Z"),
    );
    expect(status).toBe("revoked");
  });

  it("maps plan labels", () => {
    expect(getPlanLabel("pro", "active")).toBe("Pro 会员");
    expect(getPlanLabel("pro", "expired")).toBe("Pro 已到期");
    expect(getPlanLabel("free", "active")).toBe("免费基础版");
  });

  it("builds entitlement snapshot", () => {
    const snapshot = toEntitlementSnapshot(baseProfile, new Date("2026-07-01T00:00:00Z"));
    expect(snapshot.plan).toBe("pro");
    expect(snapshot.planLabel).toBe("Pro 会员");
    expect(snapshot.status).toBe("active");
  });
});
