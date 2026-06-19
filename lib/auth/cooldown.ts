import { COOLDOWN_SECONDS } from "@/lib/auth/constants";

const sentAtByPhone = new Map<string, number>();

export function checkCooldown(phoneE164: string): { ok: true } | { ok: false; retryAfter: number } {
  const sentAt = sentAtByPhone.get(phoneE164);
  if (sentAt === undefined) {
    return { ok: true };
  }

  const elapsedSeconds = Math.floor((Date.now() - sentAt) / 1000);
  const remaining = COOLDOWN_SECONDS - elapsedSeconds;
  if (remaining > 0) {
    return { ok: false, retryAfter: remaining };
  }

  return { ok: true };
}

export function markSent(phoneE164: string): void {
  sentAtByPhone.set(phoneE164, Date.now());
}
