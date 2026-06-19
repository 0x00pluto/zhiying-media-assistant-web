import { checkCooldown, markSent } from "@/lib/auth/cooldown";
import { createAuthClient } from "@/lib/auth/cookies";
import { authError, authOk } from "@/lib/auth/errors";
import { mapSupabaseAuthError } from "@/lib/auth/supabase-errors";
import { parseChinaMobileToE164 } from "@/lib/phone";

type SignInBody = {
  phone?: string;
};

export async function POST(request: Request) {
  let body: SignInBody;

  try {
    body = (await request.json()) as SignInBody;
  } catch {
    return authError(400, "INVALID_REQUEST", "请求格式不正确");
  }

  const phoneE164 = parseChinaMobileToE164(body.phone ?? "");
  if (!phoneE164) {
    return authError(400, "INVALID_PHONE", "请输入有效的中国大陆手机号");
  }

  const cooldown = checkCooldown(phoneE164);
  if (!cooldown.ok) {
    return authError(
      429,
      "RATE_LIMITED",
      `请 ${cooldown.retryAfter} 秒后再试`,
      cooldown.retryAfter,
    );
  }

  try {
    const supabase = createAuthClient();
    const { error } = await supabase.auth.signInWithOtp({ phone: phoneE164 });

    if (error) {
      const mapped = mapSupabaseAuthError(error);
      return authError(mapped.status, mapped.code, mapped.message, mapped.retryAfter);
    }

    markSent(phoneE164);
    return authOk({});
  } catch {
    return authError(500, "SERVER_ERROR", "发送验证码失败，请稍后重试");
  }
}
