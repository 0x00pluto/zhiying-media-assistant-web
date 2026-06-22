import {
  DEFAULT_PRO_DURATION_DAYS,
  parseBetaEnrollmentEndsAt,
  parseBetaProDurationDays,
} from "@/lib/account/beta-enrollment";
import { resolveInitialEntitlement } from "@/lib/account/entitlement";
import type { BetaConfig, UserProfileRow } from "@/lib/account/types";
import { createServiceClient } from "@/lib/auth/service-client";

const BETA_ENROLLMENT_KEY = "beta_enrollment_ends_at";
const BETA_PRO_DURATION_KEY = "beta_pro_duration_days";

export async function readBetaConfig(): Promise<BetaConfig> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("app_config")
    .select("key, value")
    .in("key", [BETA_ENROLLMENT_KEY, BETA_PRO_DURATION_KEY]);

  if (error) {
    throw error;
  }

  const configMap = new Map(
    (data ?? []).map((row) => [row.key, row.value as unknown]),
  );

  return {
    endsAt: parseBetaEnrollmentEndsAt(configMap.get(BETA_ENROLLMENT_KEY)),
    durationDays: parseBetaProDurationDays(
      configMap.get(BETA_PRO_DURATION_KEY) ?? DEFAULT_PRO_DURATION_DAYS,
    ),
  };
}

async function selectProfile(userId: string): Promise<UserProfileRow | null> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data as UserProfileRow | null;
}

export async function ensureProfile({
  userId,
  phoneE164,
}: {
  userId: string;
  phoneE164: string;
}): Promise<UserProfileRow> {
  const existing = await selectProfile(userId);
  if (existing) {
    return existing;
  }

  const config = await readBetaConfig();
  const now = new Date();
  const { plan, expiresAt } = resolveInitialEntitlement(config, now);
  const enrolledAt = now.toISOString();

  const supabase = createServiceClient();
  const { error: insertError } = await supabase.from("user_profiles").insert({
    user_id: userId,
    phone_e164: phoneE164,
    plan,
    entitlement_status: "active",
    expires_at: expiresAt?.toISOString() ?? null,
    enrolled_at: enrolledAt,
  });

  if (insertError && insertError.code !== "23505") {
    throw insertError;
  }

  const profile = await selectProfile(userId);
  if (!profile) {
    throw new Error("创建用户 profile 失败");
  }

  return profile;
}

export async function getProfile(userId: string): Promise<UserProfileRow | null> {
  return selectProfile(userId);
}
