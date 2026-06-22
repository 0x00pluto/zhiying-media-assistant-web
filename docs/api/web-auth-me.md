# Web BFF 认证 API 契约

官网前端仅调用本文档定义的 `/api/web/auth/*` 接口；不直连 Supabase。

**OpenAPI（开发环境）**：由 [`lib/openapi/schemas/`](../lib/openapi/schemas/) 的 Zod schema **自动生成**；落盘文件 [`docs/openapi/web-auth.openapi.json`](../openapi/web-auth.openapi.json) 仅供 diff/外部工具，**请勿手改**（改 schema 后执行 `pnpm openapi:emit`）。本地 `pnpm dev` 后访问 `http://localhost:3000/api/openapi.json` 可获取实时规范。生产环境上述端点返回 404。

## 通用约定

- **Content-Type**：`application/json`
- **Cookie**：登录成功后由 BFF 写入 HttpOnly Cookie（`qm_access_token`、`qm_refresh_token`），`SameSite=Lax`，生产环境 `Secure`
- **错误体**：`{ "ok": false, "code": string, "error": string, "retryAfter?": number }`
- **成功体（写操作）**：`{ "ok": true }`

### 错误码

| code | HTTP | 说明 |
|------|------|------|
| `INVALID_PHONE` | 400 | 手机号格式非法 |
| `INVALID_OTP` | 400 | 验证码错误或过期 |
| `INVALID_REQUEST` | 400 | 请求体非法 |
| `RATE_LIMITED` | 429 | 发码过于频繁；`retryAfter` 为秒数 |
| `SERVER_ERROR` | 500 | 服务异常 |

---

## POST `/api/web/auth/sign-in/phone`

触发 Supabase `signInWithOtp`，经 Send SMS Hook 发送 6 位短信验证码。

**请求体**

```json
{ "phone": "13812345678" }
```

- `phone`：11 位中国大陆手机号（不含 +86）

**成功响应** `200`

```json
{ "ok": true }
```

**节流**：同号 BFF 层 30s 内重复请求返回 `429`，含 `retryAfter`。

---

## POST `/api/web/auth/sign-in/phone/verify`

校验 OTP 并建立官网会话。

**请求体**

```json
{ "phone": "13812345678", "token": "123456" }
```

**成功响应** `200`

```json
{ "ok": true }
```

响应头含 `Set-Cookie`（access + refresh token）。

---

## GET `/api/web/auth/me`

读取当前登录态；服务端会在 access token 即将过期时自动 `refreshSession` 并回写 Cookie。

**请求**：无 body；携带官网会话 Cookie。

**未登录** `200`

```json
{ "loggedIn": false }
```

**已登录** `200`

```json
{
  "loggedIn": true,
  "userId": "uuid",
  "phoneMasked": "138****5678"
}
```

刷新失败时清除 Cookie 并返回 `{ "loggedIn": false }`。

---

## POST `/api/web/auth/logout`

清除官网会话 Cookie；best-effort 调用 Supabase `signOut`。

**成功响应** `200`

```json
{ "ok": true }
```

---

## POST `/api/hooks/supabase/send-sms`（服务端）

Supabase Send SMS Hook 专用，非前端调用。验签后透传 OTP 至阿里云 `SendSmsVerifyCode`。

成功：`200` + `{}`

---

## 修订记录

| 日期 | 说明 |
|------|------|
| 2026-06-22 | 新增 OpenAPI 3.0 JSON 规范（`docs/openapi/web-auth.openapi.json`），dev 专用 `/api/openapi.json` |
| 2026-06-19 | R1 初版：四端点契约、错误码、Cookie 与 `/me` 刷新语义 |
