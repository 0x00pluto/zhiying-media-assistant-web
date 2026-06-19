import { AuthError } from "@supabase/supabase-js";

import type { AuthErrorCode } from "@/lib/auth/errors";

export function mapSupabaseAuthError(error: AuthError): {
  status: number;
  code: AuthErrorCode;
  message: string;
  retryAfter?: number;
} {
  const message = error.message.toLowerCase();

  if (
    message.includes("rate") ||
    message.includes("too many") ||
    error.status === 429
  ) {
    return {
      status: 429,
      code: "RATE_LIMITED",
      message: "发送过于频繁，请稍后再试",
      retryAfter: 30,
    };
  }

  if (
    message.includes("invalid") &&
    (message.includes("otp") ||
      message.includes("token") ||
      message.includes("code"))
  ) {
    return {
      status: 400,
      code: "INVALID_OTP",
      message: "验证码错误或已过期，请重新输入",
    };
  }

  if (message.includes("phone")) {
    return {
      status: 400,
      code: "INVALID_PHONE",
      message: "手机号格式不正确",
    };
  }

  return {
    status: 500,
    code: "SERVER_ERROR",
    message: "服务暂时不可用，请稍后重试",
  };
}
