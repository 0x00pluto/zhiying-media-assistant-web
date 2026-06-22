import { z } from "@/lib/openapi/zod-openapi";

export const chinaMobileSchema = z
  .string()
  .regex(/^1[3-9]\d{9}$/, "请输入有效的中国大陆手机号")
  .openapi({
    description: "11 位中国大陆手机号（不含 +86）",
    example: "13812345678",
  });

export const otpTokenSchema = z
  .string()
  .regex(/^\d{6}$/, "请输入 6 位数字验证码")
  .openapi({
    description: "6 位短信验证码",
    example: "123456",
  });

export const authOkSchema = z
  .object({
    ok: z.literal(true),
  })
  .strict()
  .openapi("AuthOk");

export const authErrorCodeSchema = z
  .enum([
    "INVALID_PHONE",
    "INVALID_OTP",
    "INVALID_REQUEST",
    "RATE_LIMITED",
    "SERVER_ERROR",
  ])
  .openapi("AuthErrorCode");

export const authErrorSchema = z
  .object({
    ok: z.literal(false),
    code: authErrorCodeSchema,
    error: z.string(),
    retryAfter: z
      .number()
      .int()
      .optional()
      .openapi({ description: "RATE_LIMITED 时剩余等待秒数" }),
  })
  .strict()
  .openapi("AuthError");

export type AuthOk = z.infer<typeof authOkSchema>;
export type AuthError = z.infer<typeof authErrorSchema>;
export type AuthErrorCode = z.infer<typeof authErrorCodeSchema>;
