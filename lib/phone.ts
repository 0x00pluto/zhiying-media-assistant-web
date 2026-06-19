const CHINA_MOBILE_PATTERN = /^1[3-9]\d{9}$/;

/** 11 位中国大陆手机号是否合法 */
export function isValidChinaMobile(phone: string): boolean {
  return CHINA_MOBILE_PATTERN.test(phone.replace(/\s/g, ""));
}

/** 11 位大陆号 → E.164（+86...）；非法返回 null */
export function parseChinaMobileToE164(input: string): string | null {
  const normalized = input.replace(/\s/g, "");
  if (!CHINA_MOBILE_PATTERN.test(normalized)) {
    return null;
  }
  return `+86${normalized}`;
}

/** 脱敏展示，如 138****5678（支持 11 位或 +86 前缀） */
export function maskChinaMobile(phone: string): string {
  const digits = phone.replace(/\s/g, "").replace(/^\+86/, "");
  if (digits.length !== 11) {
    return phone;
  }
  return `${digits.slice(0, 3)}****${digits.slice(7)}`;
}
