import { describe, expect, it } from "vitest";

import {
  addDays,
  isBetaEnrollmentOpen,
  parseBetaEnrollmentEndsAt,
  parseBetaProDurationDays,
} from "@/lib/account/beta-enrollment";

describe("beta-enrollment", () => {
  it("treats missing endsAt as open", () => {
    expect(isBetaEnrollmentOpen(null)).toBe(true);
    expect(isBetaEnrollmentOpen(undefined)).toBe(true);
  });

  it("opens when now is before endsAt", () => {
    const now = new Date("2026-06-01T00:00:00Z");
    expect(isBetaEnrollmentOpen("2026-12-31T23:59:59Z", now)).toBe(true);
  });

  it("closes when now is after endsAt", () => {
    const now = new Date("2027-01-01T00:00:00Z");
    expect(isBetaEnrollmentOpen("2026-12-31T23:59:59Z", now)).toBe(false);
  });

  it("treats invalid endsAt as open", () => {
    expect(isBetaEnrollmentOpen("not-a-date")).toBe(true);
  });

  it("parses endsAt string", () => {
    expect(parseBetaEnrollmentEndsAt("2026-12-31T23:59:59Z")).toBe(
      "2026-12-31T23:59:59Z",
    );
    expect(parseBetaEnrollmentEndsAt("")).toBeNull();
    expect(parseBetaEnrollmentEndsAt(123)).toBeNull();
  });

  it("parses duration days with fallback", () => {
    expect(parseBetaProDurationDays(90)).toBe(90);
    expect(parseBetaProDurationDays("60")).toBe(60);
    expect(parseBetaProDurationDays(-1)).toBe(90);
    expect(parseBetaProDurationDays("invalid")).toBe(90);
  });

  it("adds days in UTC", () => {
    const base = new Date("2026-06-22T00:00:00Z");
    const result = addDays(base, 90);
    expect(result.toISOString()).toBe("2026-09-20T00:00:00.000Z");
  });
});
