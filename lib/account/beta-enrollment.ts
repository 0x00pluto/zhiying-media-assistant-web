const DEFAULT_PRO_DURATION_DAYS = 90;

export function isBetaEnrollmentOpen(
  endsAt: string | null | undefined,
  now: Date = new Date(),
): boolean {
  if (!endsAt) {
    return true;
  }

  const endsAtMs = Date.parse(endsAt);
  if (Number.isNaN(endsAtMs)) {
    return true;
  }

  return now.getTime() <= endsAtMs;
}

export function parseBetaEnrollmentEndsAt(value: unknown): string | null {
  if (typeof value !== "string" || !value.trim()) {
    return null;
  }

  return value;
}

export function parseBetaProDurationDays(value: unknown): number {
  if (typeof value === "number" && Number.isFinite(value) && value > 0) {
    return Math.floor(value);
  }

  if (typeof value === "string") {
    const parsed = Number.parseInt(value, 10);
    if (Number.isFinite(parsed) && parsed > 0) {
      return parsed;
    }
  }

  return DEFAULT_PRO_DURATION_DAYS;
}

export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setUTCDate(result.getUTCDate() + days);
  return result;
}

export { DEFAULT_PRO_DURATION_DAYS };
