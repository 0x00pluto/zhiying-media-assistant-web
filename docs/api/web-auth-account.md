# Web BFF 账号 API 契约

官网前端仅调用本文档定义的 `/api/web/account` 接口获取账号与会员权益；不直连 Supabase。

**OpenAPI（开发环境）**：与 Auth 共用 Zod 生成链路（见 [`lib/openapi/schemas/`](../lib/openapi/schemas/)）；`pnpm openapi:emit` 更新 [`web-auth.openapi.json`](../openapi/web-auth.openapi.json)。

## 通用约定

- **Content-Type**：`application/json`
- **Cookie**：须携带官网 HttpOnly 会话 Cookie（`qm_access_token`、`qm_refresh_token`），与 [`web-auth-me.md`](web-auth-me.md) 一致
- **未登录语义**：与 `GET /api/web/auth/me` 对齐，返回 `200` + `{ "loggedIn": false }`（非 401）
- **错误体（503）**：`{ "ok": false, "code": "SERVICE_UNAVAILABLE", "error": string }`

### 方案档位（plan）

| plan | 说明 |
|------|------|
| `free` | 免费基础版 |
| `pro` | Pro 会员（公测期新用户默认授予，含到期时间） |
| `enterprise` | 企业版（MVP 预留，不自动授予） |

### 权益状态（status）

| status | 说明 |
|--------|------|
| `active` | 有效 |
| `expired` | 已过期（读时派生：`plan` 为 `pro`/`enterprise` 且 `expires_at < now()`；DB 中 `plan` 不变） |
| `revoked` | 已撤销（以 DB `entitlement_status` 为准） |

### 公测配置（运维）

存储于 Supabase `public.app_config`，BFF 使用 `SUPABASE_SECRET_KEY` 读取：

| key | 说明 |
|-----|------|
| `beta_enrollment_ends_at` | 公测注册截止日（ISO 8601）；未配置或 `now <= ends_at` 视为公测开放 |
| `beta_pro_duration_days` | 公测期新用户 Pro 时长（天），默认 `90` |

公测开放时，**首次**创建 profile 授予 `plan = pro`，`expires_at = enrolled_at + beta_pro_duration_days`；公测关闭后新用户为 `free`。已存在 profile 只读，不升级/降级。

---

## GET `/api/web/account`

读取当前用户账号信息与权益快照。若 profile 不存在（边缘路径），服务端幂等创建。

**请求**：无 body；携带官网会话 Cookie。

**未登录** `200`

```json
{ "loggedIn": false }
```

**已登录** `200`

```json
{
  "loggedIn": true,
  "userId": "550e8400-e29b-41d4-a716-446655440000",
  "phoneMasked": "138****5678",
  "registeredAt": "2026-06-22T02:00:00.000Z",
  "entitlement": {
    "plan": "pro",
    "planLabel": "Pro 会员",
    "status": "active",
    "expiresAt": "2026-09-20T02:00:00.000Z",
    "enrolledAt": "2026-06-22T02:00:00.000Z"
  }
}
```

**服务不可用** `503`

```json
{
  "ok": false,
  "code": "SERVICE_UNAVAILABLE",
  "error": "账号信息暂时无法加载，请稍后重试"
}
```

### 与 verify 的关系

- **主路径**：`POST /api/web/auth/sign-in/phone/verify` 成功后同步幂等 upsert profile（失败不阻断登录）
- **边缘补建**：仅调用 `GET /account` 时若 profile 缺失，同样幂等创建

### 与 `GET /api/web/auth/me` 的关系

- `/me` 保持轻量（Header 登录态），**不含** entitlement
- `/account` 专供账号中心页，含完整权益快照

---

## 相关页面

| 路径 | 说明 |
|------|------|
| `/account` | 账号中心（需登录；未登录 redirect `/login?next=/account`） |
| `/login?next=/account` | 登录后回跳账号中心 |
