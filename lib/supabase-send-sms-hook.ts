import { Webhook } from "standardwebhooks";

export type SendSmsHookPayload = {
  user: {
    id: string;
    phone: string;
  };
  sms: {
    otp: string;
  };
};

/** Supabase SendSMS hook body after verify (may include metadata, sms.phone, etc.). */
type RawSendSmsHookPayload = {
  user?: {
    id?: string;
    phone?: string | null;
    /** Present during phone change before user.phone is updated. */
    phone_change?: string | null;
  };
  sms?: {
    otp?: string | number | null;
    phone?: string | null;
    sms_type?: string;
  };
  metadata?: unknown;
};

function pickE164Phone(
  ...candidates: (string | null | undefined)[]
): string | null {
  for (const value of candidates) {
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }
  return null;
}

/**
 * Normalize Supabase Send SMS hook payload.
 * Real Auth requests often put the target number on sms.phone (or user.phone_change)
 * while user.phone is still empty — simulate tools that only set user.phone still work.
 */
export function parseSendSmsHookPayload(
  raw: RawSendSmsHookPayload,
): SendSmsHookPayload {
  const phone = pickE164Phone(
    raw.user?.phone,
    raw.sms?.phone,
    raw.user?.phone_change,
  );
  const otp =
    raw.sms?.otp !== undefined && raw.sms?.otp !== null
      ? String(raw.sms.otp).trim()
      : "";

  if (!phone || !otp) {
    throw new Error("Invalid hook payload");
  }

  return {
    user: {
      id: typeof raw.user?.id === "string" ? raw.user.id : "",
      phone,
    },
    sms: { otp },
  };
}

export function normalizeHookSecret(secret: string): string {
  return secret.replace(/^v1,whsec_/, "");
}

function getHookSecretRaw(): string {
  const secret =
    process.env.SEND_SMS_HOOK_SECRET?.trim() ||
    process.env.SEND_SMS_HOOK_SECRETS?.trim();
  if (!secret) {
    throw new Error("Missing SEND_SMS_HOOK_SECRET");
  }
  return normalizeHookSecret(secret);
}

export function verifySendSmsHook(
  rawBody: string,
  headers: Record<string, string>,
): SendSmsHookPayload {
  const wh = new Webhook(getHookSecretRaw());
  const verified = wh.verify(rawBody, headers) as RawSendSmsHookPayload;
  return parseSendSmsHookPayload(verified);
}
