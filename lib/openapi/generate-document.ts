import {
  OpenAPIRegistry,
  OpenApiGeneratorV3,
} from "@asteasolutions/zod-to-openapi";

import { registerAccountPaths } from "@/lib/openapi/schemas/account";
import { registerAuthPaths } from "@/lib/openapi/schemas/auth";
import "@/lib/openapi/zod-openapi";

const OPENAPI_VERSION = "0.2.0";

function createRegistry() {
  const registry = new OpenAPIRegistry();

  registry.registerComponent("securitySchemes", "sessionCookie", {
    type: "apiKey",
    in: "cookie",
    name: "qm_access_token",
    description:
      "官网 HttpOnly 会话 Cookie（qm_access_token、qm_refresh_token）",
  });

  registerAuthPaths(registry);
  registerAccountPaths(registry);

  return registry;
}

export function buildWebBffOpenApiDocument() {
  const registry = createRegistry();
  const generator = new OpenApiGeneratorV3(registry.definitions);

  return generator.generateDocument({
    openapi: "3.0.3",
    info: {
      title: "智赢媒体助手 Web BFF API",
      version: OPENAPI_VERSION,
      description:
        "官网前端 BFF 接口：认证（`/api/web/auth/*`）与账号（`/api/web/account`）。登录成功后由 BFF 写入 HttpOnly Cookie（`qm_access_token`、`qm_refresh_token`），SameSite=Lax，生产环境 Secure。",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "本地开发",
      },
    ],
    tags: [
      {
        name: "Web Auth",
        description: "手机号 OTP 登录与会话管理",
      },
      {
        name: "Web Account",
        description: "账号中心与会员权益",
      },
    ],
  });
}

export type WebBffOpenApiDocument = ReturnType<typeof buildWebBffOpenApiDocument>;
