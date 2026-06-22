import type {
  EntitlementStatus,
  Plan,
} from "@/lib/openapi/schemas/account";

export type {
  AccountResponse,
  EntitlementSnapshot,
  EntitlementStatus,
  Plan,
} from "@/lib/openapi/schemas/account";

export type UserProfileRow = {
  user_id: string;
  phone_e164: string;
  plan: Plan;
  entitlement_status: EntitlementStatus;
  expires_at: string | null;
  enrolled_at: string;
  created_at: string;
  updated_at: string;
};

export type BetaConfig = {
  endsAt: string | null;
  durationDays: number;
};
