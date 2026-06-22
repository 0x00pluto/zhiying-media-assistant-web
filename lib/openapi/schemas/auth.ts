import {
  OpenAPIRegistry,
} from "@asteasolutions/zod-to-openapi";

import { z } from "@/lib/openapi/zod-openapi";

import {
  authErrorSchema,
  authOkSchema,
  chinaMobileSchema,
  otpTokenSchema,
} from "@/lib/openapi/schemas/common";

export const signInPhoneRequestSchema = z
  .object({
    phone: chinaMobileSchema,
  })
  .strict()
  .openapi("SignInPhoneRequest");

export const verifyOtpRequestSchema = z
  .object({
    phone: chinaMobileSchema,
    token: otpTokenSchema,
  })
  .strict()
  .openapi("VerifyOtpRequest");

export const meLoggedOutSchema = z
  .object({
    loggedIn: z.literal(false),
  })
  .strict()
  .openapi("MeLoggedOut");

export const meLoggedInSchema = z
  .object({
    loggedIn: z.literal(true),
    userId: z.string().uuid(),
    phoneMasked: z.string().openapi({
      description: "脱敏手机号，如 138****5678",
      example: "138****5678",
    }),
  })
  .strict()
  .openapi("MeLoggedIn");

export const meResponseSchema = z
  .discriminatedUnion("loggedIn", [meLoggedOutSchema, meLoggedInSchema])
  .openapi("MeResponse");

export type MeResponse = z.infer<typeof meResponseSchema>;
export type MeLoggedIn = z.infer<typeof meLoggedInSchema>;
export type MeLoggedOut = z.infer<typeof meLoggedOutSchema>;

export function registerAuthPaths(registry: OpenAPIRegistry) {
  registry.registerPath({
    method: "post",
    path: "/api/web/auth/sign-in/phone",
    tags: ["Web Auth"],
    summary: "发送短信验证码",
    description:
      "触发 Supabase signInWithOtp，经 Send SMS Hook 发送 6 位短信验证码。同号 BFF 层 30s 内重复请求返回 429。",
    operationId: "signInPhone",
    request: {
      body: {
        content: {
          "application/json": {
            schema: signInPhoneRequestSchema,
          },
        },
      },
    },
    responses: {
      200: {
        description: "验证码已发送",
        content: {
          "application/json": {
            schema: authOkSchema,
          },
        },
      },
      400: {
        description: "请求非法或手机号格式错误",
        content: {
          "application/json": {
            schema: authErrorSchema,
          },
        },
      },
      429: {
        description: "发码过于频繁",
        content: {
          "application/json": {
            schema: authErrorSchema,
          },
        },
      },
      500: {
        description: "服务异常",
        content: {
          "application/json": {
            schema: authErrorSchema,
          },
        },
      },
    },
  });

  registry.registerPath({
    method: "post",
    path: "/api/web/auth/sign-in/phone/verify",
    tags: ["Web Auth"],
    summary: "校验 OTP 并登录",
    description:
      "校验 6 位 OTP 并建立官网会话。成功响应头含 Set-Cookie（access + refresh token）。验证成功后服务端幂等创建 user profile（公测期授予 Pro）。",
    operationId: "verifyPhoneOtp",
    request: {
      body: {
        content: {
          "application/json": {
            schema: verifyOtpRequestSchema,
          },
        },
      },
    },
    responses: {
      200: {
        description: "登录成功，响应头含 Set-Cookie",
        headers: {
          "Set-Cookie": {
            description: "qm_access_token 与 qm_refresh_token",
            schema: {
              type: "string",
            },
          },
        },
        content: {
          "application/json": {
            schema: authOkSchema,
          },
        },
      },
      400: {
        description: "请求非法、手机号错误或验证码无效",
        content: {
          "application/json": {
            schema: authErrorSchema,
          },
        },
      },
      500: {
        description: "服务异常",
        content: {
          "application/json": {
            schema: authErrorSchema,
          },
        },
      },
    },
  });

  registry.registerPath({
    method: "get",
    path: "/api/web/auth/me",
    tags: ["Web Auth"],
    summary: "读取当前登录态",
    description:
      "携带官网会话 Cookie。服务端会在 access token 即将过期时自动 refreshSession 并回写 Cookie；刷新失败时清除 Cookie 并返回 loggedIn: false。",
    operationId: "getMe",
    security: [{ sessionCookie: [] }],
    responses: {
      200: {
        description: "当前登录态",
        content: {
          "application/json": {
            schema: meResponseSchema,
          },
        },
      },
    },
  });

  registry.registerPath({
    method: "post",
    path: "/api/web/auth/logout",
    tags: ["Web Auth"],
    summary: "退出登录",
    description: "清除官网会话 Cookie；best-effort 调用 Supabase signOut。",
    operationId: "logout",
    security: [{ sessionCookie: [] }],
    responses: {
      200: {
        description: "已退出",
        content: {
          "application/json": {
            schema: authOkSchema,
          },
        },
      },
    },
  });
}
