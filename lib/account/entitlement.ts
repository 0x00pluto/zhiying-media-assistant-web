import {
  addDays,
  isBetaEnrollmentOpen,
  parseBetaProDurationDays,
} from "@/lib/account/beta-enrollment";
import type {
  BetaConfig,
  EntitlementSnapshot,
  EntitlementStatus,
  Plan,
  UserProfileRow,
} from "@/lib/account/types";

const PLAN_LABELS: Record<
  Plan,
  Record<"active" | "expired", string> & { revoked?: string }
> = {
  free: {
    active: "免费基础版",
    expired: "免费基础版",
  },
  pro: {
    active: "Pro 会员",
    expired: "Pro 已到期",
  },
  enterprise: {
    active: "企业版",
    expired: "企业版已到期",
  },
};

export function resolveInitialEntitlement(
  config: BetaConfig,
  now: Date = new Date(),
): { plan: Plan; expiresAt: Date | null } {
  if (!isBetaEnrollmentOpen(config.endsAt, now)) {
    return { plan: "free", expiresAt: null };
  }

  const durationDays = parseBetaProDurationDays(config.durationDays);
  return {
    plan: "pro",
    expiresAt: addDays(now, durationDays),
  };
}

export function resolveEntitlementStatus(
  profile: Pick<UserProfileRow, "plan" | "entitlement_status" | "expires_at">,
  now: Date = new Date(),
): EntitlementStatus {
  if (profile.entitlement_status === "revoked") {
    return "revoked";
  }

  if (
    (profile.plan === "pro" || profile.plan === "enterprise") &&
    profile.expires_at
  ) {
    const expiresAtMs = Date.parse(profile.expires_at);
    if (!Number.isNaN(expiresAtMs) && expiresAtMs < now.getTime()) {
      return "expired";
    }
  }

  return "active";
}

export function getPlanLabel(plan: Plan, status: EntitlementStatus): string {
  if (status === "revoked") {
    return `${PLAN_LABELS[plan].active}（已撤销）`;
  }

  if (status === "expired") {
    return PLAN_LABELS[plan].expired;
  }

  return PLAN_LABELS[plan].active;
}

export function toEntitlementSnapshot(
  profile: UserProfileRow,
  now: Date = new Date(),
): EntitlementSnapshot {
  const status = resolveEntitlementStatus(profile, now);

  return {
    plan: profile.plan,
    planLabel: getPlanLabel(profile.plan, status),
    status,
    expiresAt: profile.expires_at,
    enrolledAt: profile.enrolled_at,
  };
}
