import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";

import { z } from "@/lib/openapi/zod-openapi";

export const planSchema = z
  .enum(["free", "pro", "enterprise"])
  .openapi("Plan");

export const entitlementStatusSchema = z
  .enum(["active", "expired", "revoked"])
  .openapi("EntitlementStatus");

export const entitlementSnapshotSchema = z
  .object({
    plan: planSchema,
    planLabel: z.string().openapi({ example: "Pro 会员" }),
    status: entitlementStatusSchema,
    expiresAt: z
      .string()
      .datetime()
      .nullable()
      .openapi({ description: "Pro/Enterprise 到期时间；free 为 null" }),
    enrolledAt: z.string().datetime(),
  })
  .strict()
  .openapi("EntitlementSnapshot");

export const accountLoggedOutSchema = z
  .object({
    loggedIn: z.literal(false),
  })
  .strict()
  .openapi("AccountLoggedOut");

export const accountLoggedInSchema = z
  .object({
    loggedIn: z.literal(true),
    userId: z.string().uuid(),
    phoneMasked: z.string().openapi({ example: "138****5678" }),
    registeredAt: z.string().datetime(),
    entitlement: entitlementSnapshotSchema,
  })
  .strict()
  .openapi("AccountLoggedIn");

export const accountResponseSchema = z
  .discriminatedUnion("loggedIn", [accountLoggedOutSchema, accountLoggedInSchema])
  .openapi("AccountResponse");

export const accountErrorCodeSchema = z
  .enum(["SERVICE_UNAVAILABLE", "SERVER_ERROR"])
  .openapi("AccountErrorCode");

export const accountErrorSchema = z
  .object({
    ok: z.literal(false),
    code: accountErrorCodeSchema,
    error: z.string(),
  })
  .strict()
  .openapi("AccountError");

export type Plan = z.infer<typeof planSchema>;
export type EntitlementStatus = z.infer<typeof entitlementStatusSchema>;
export type EntitlementSnapshot = z.infer<typeof entitlementSnapshotSchema>;
export type AccountResponse = z.infer<typeof accountResponseSchema>;
export type AccountError = z.infer<typeof accountErrorSchema>;

export function registerAccountPaths(registry: OpenAPIRegistry) {
  registry.registerPath({
    method: "get",
    path: "/api/web/account",
    tags: ["Web Account"],
    summary: "读取账号与会员权益",
    description:
      "携带官网会话 Cookie。若 profile 不存在则幂等创建。status 在 expires_at 过期时对 pro/enterprise 读时派生为 expired。",
    operationId: "getAccount",
    security: [{ sessionCookie: [] }],
    responses: {
      200: {
        description: "账号信息或未登录",
        content: {
          "application/json": {
            schema: accountResponseSchema,
          },
        },
      },
      503: {
        description: "数据库或服务不可用",
        content: {
          "application/json": {
            schema: accountErrorSchema,
          },
        },
      },
    },
  });
}
