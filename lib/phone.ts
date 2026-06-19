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

/** 从 Supabase / E.164 等格式提取 11 位大陆手机号 */
function toChinaMobile11(phone: string): string | null {
  const trimmed = phone.replace(/\s/g, "");
  const digits = trimmed.replace(/\D/g, "");

  if (digits.length === 11 && CHINA_MOBILE_PATTERN.test(digits)) {
    return digits;
  }

  if (digits.length === 13 && digits.startsWith("86")) {
    const mobile = digits.slice(2);
    return CHINA_MOBILE_PATTERN.test(mobile) ? mobile : null;
  }

  return null;
}

/** 脱敏展示，如 158****9819（支持 11 位、+86、86 前缀） */
export function maskChinaMobile(phone: string): string {
  const mobile = toChinaMobile11(phone);
  if (!mobile) {
    return phone;
  }
  return `${mobile.slice(0, 3)}****${mobile.slice(7)}`;
}
