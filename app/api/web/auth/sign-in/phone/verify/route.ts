import {
  createAuthClient,
  setSessionCookies,
} from "@/lib/auth/cookies";
import { authError, authOk } from "@/lib/auth/errors";
import { mapSupabaseAuthError } from "@/lib/auth/supabase-errors";
import { parseChinaMobileToE164 } from "@/lib/phone";

type VerifyBody = {
  phone?: string;
  token?: string;
};

export async function POST(request: Request) {
  let body: VerifyBody;

  try {
    body = (await request.json()) as VerifyBody;
  } catch {
    return authError(400, "INVALID_REQUEST", "请求格式不正确");
  }

  const phoneE164 = parseChinaMobileToE164(body.phone ?? "");
  const token = body.token?.trim();

  if (!phoneE164) {
    return authError(400, "INVALID_PHONE", "请输入有效的中国大陆手机号");
  }

  if (!token || !/^\d{6}$/.test(token)) {
    return authError(400, "INVALID_OTP", "请输入 6 位数字验证码");
  }

  try {
    const supabase = createAuthClient();
    const { data, error } = await supabase.auth.verifyOtp({
      phone: phoneE164,
      token,
      type: "sms",
    });

    if (error) {
      const mapped = mapSupabaseAuthError(error);
      return authError(mapped.status, mapped.code, mapped.message, mapped.retryAfter);
    }

    if (!data.session) {
      return authError(400, "INVALID_OTP", "验证码错误或已过期，请重新输入");
    }

    await setSessionCookies(data.session);
    return authOk({});
  } catch {
    return authError(500, "SERVER_ERROR", "登录失败，请稍后重试");
  }
}
