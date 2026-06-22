# 技术文档

与 `specs/` 产品规格区并列的工程与 API 文档。

| 目录 | 用途 |
|------|------|
| `api/` | Web BFF API 契约（Markdown） |
| `openapi/` | OpenAPI 3.0 JSON（**由 Zod 生成**，`pnpm openapi:emit`；dev 亦可通过 `/api/openapi.json` 实时获取） |
