<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# 智赢媒体助手官网（quammediaweb）

本仓库是 Chrome 扩展「智赢媒体助手」的**官方营销官网**，不是浏览器扩展本体。站点面向中文用户，主打小红书素材采集与飞书多维表格同步能力展示、安装引导与合规文档。

## 技术栈

| 类别 | 选型 |
|------|------|
| 框架 | Next.js 16（App Router）+ React 19 + TypeScript |
| 样式 | Tailwind CSS v4（`@import "tailwindcss"`）+ `tw-animate-css` |
| 组件库 | shadcn/ui（`radix-vega` 风格，`components.json` 配置） |
| 图标 | lucide-react |
| 主题 | next-themes（`class` 策略，支持 system / light / dark） |
| 包管理 | pnpm（存在 `pnpm-lock.yaml`） |

## 常用命令

```bash
pnpm dev      # 本地开发 http://localhost:3000
pnpm build    # 生产构建
pnpm start    # 启动生产服务
pnpm lint     # ESLint 检查
```

数据库迁移（需本机安装 [Supabase CLI](https://supabase.com/docs/guides/cli) 并完成 `supabase link`）：

```bash
pnpm run db:migration:new -- <name>   # 新建迁移文件（UTC 时间戳前缀）
pnpm db:migration:list                # 查看本地/远端迁移对齐
pnpm db:migration:sync-remote         # 仅补齐远端独有迁移（branch merge）
pnpm db:migrate                       # 推送到当前 link 的远端（= supabase db push）
```

新增 shadcn 组件：`npx shadcn@latest add <component>`（遵循 `components.json` 别名）。

## 目录结构

```
app/
├── layout.tsx              # 根布局：字体、ThemeProvider、全局 metadata
├── globals.css             # Tailwind v4 + shadcn 主题变量
├── robots.ts               # robots.txt（含 AI 爬虫放行规则）
├── sitemap.ts              # 站点地图
├── not-found.tsx
└── (marketing)/            # 营销页路由组（URL 不含组名）
    ├── layout.tsx          # SiteHeader + main + SiteFooter
    ├── page.tsx            # 首页（各 section 组合）
    ├── _config/
    │   └── marketing-content.ts   # 首页文案、导航、定价、FAQ 等
    ├── _components/
    │   ├── layout/         # header、footer、theme-toggle
    │   ├── home/           # 首页各区块组件
    │   ├── legal/          # 法律文档通用布局
    │   └── seo/            # JSON-LD 注入
    ├── privacy/            # page.tsx + _content.ts
    ├── terms/
    ├── compliance/
    └── changelog/

components/
├── brand/                  # BrandLogo 等品牌组件
├── providers/              # ThemeProvider 等
└── ui/                     # shadcn 基础组件（勿手改生成逻辑）

lib/
├── site-config.ts          # 站点名、版本、Chrome 商店链接、组织信息
├── geo-config.ts           # Schema.org JSON-LD 构建
└── utils.ts                # cn() 等工具

content/geo/
└── enterprise-base.json    # GEO 企业实体数据（JSON-LD 来源）

supabase/
├── config.toml             # Supabase CLI 配置
└── migrations/             # 数据库 DDL 单一事实源（版本化 .sql）

scripts/
├── db-migration-new.mjs    # 创建空迁移（UTC 时间戳）
└── db-migration-sync-remote.mjs  # 安全同步远端独有迁移

specs/
├── prds/                   # PRD 文档（/team:product-manager 落盘）
│   └── prd-wiki-index.md   # PRD 索引
└── features/               # Feature Spec（/team:po-explorer 落盘）

public/
├── brand/                  # 图标与浏览器 logo（icon-*.png、chrome.png、edge.png）
├── llms.txt                # AI 爬虫摘要
└── llms-full.txt           # AI 爬虫完整说明
```

路径别名：`@/*` 映射项目根目录（见 `tsconfig.json`）。

## 页面与路由

| 路径 | 说明 |
|------|------|
| `/` | 营销首页（锚点：features、how-it-works、feishu-sync、pricing、faq） |
| `/privacy` | 隐私政策 |
| `/terms` | 用户协议 |
| `/compliance` | 合规声明 |
| `/changelog` | 版本更新日志 |

## 内容修改指南

改文案时优先找**内容文件**，避免在 JSX 里硬编码大段文字：

| 改什么 | 改哪里 |
|--------|--------|
| 产品名、版本、商店链接、支持邮箱 | `lib/site-config.ts` |
| 导航、功能点、定价、FAQ、统计数据 | `app/(marketing)/_config/marketing-content.ts` |
| 隐私 / 协议 / 合规正文 | 各页面目录下的 `_content.ts` |
| 更新日志 | `app/(marketing)/changelog/_content.ts` |
| 企业 GEO 实体信息 | `content/geo/enterprise-base.json` |
| 新增页面到 sitemap | `app/sitemap.ts`（同步更新 `lastModified`） |

修改定价或 FAQ 后，首页 JSON-LD（`lib/geo-config.ts`）会自动从 `marketing-content.ts` 派生，一般无需重复维护。

## 组件与代码约定

1. **默认 Server Component**；仅在需要交互、浏览器 API 或 hooks 时加 `"use client"`（如 `site-header`、`theme-toggle`、`hero-demo-simulator`、部分 shadcn 组件）。
2. **样式**：Tailwind 工具类为主；设计 token 在 `globals.css` 的 CSS 变量中，深色模式通过 `.dark` 类切换。
3. **中文优先**：`lang="zh-CN"`，文案与 metadata 使用简体中文；字体为 Inter + Noto Sans SC。
4. **图片**：品牌资源放 `public/brand/`，组件内用 `next/image`。
5. **法律页**：共用 `LegalDocument`，各页 `_content.ts` 导出 `sections` 结构。
6. **变更范围**：保持 diff 最小；应用层当前仍为静态营销站。数据库结构变更须经 `supabase/migrations/` 管理；暂不接入 Supabase 客户端 SDK，连库与业务 API 在后续 PR 落地。

## Supabase / 数据库迁移

- **单一事实源**：所有 DDL（建表、改表、索引、RLS policy 等）只进 `supabase/migrations/`；禁止在生产 Dashboard 手工改表且不落库。
- **日常流程**：`db:migration:new` → 编写 SQL → 在开发库验证 → `db:migrate` → 提交 Git。
- **推送前确认**：`db:migrate` 等价于 `supabase db push`，会应用到**当前 `supabase link` 的项目**；执行前确认 project ref 指向目标环境（开发/生产）。
- **远端对齐**：若出现 `Remote migration versions not found in local migrations directory`，使用 `pnpm db:migration:sync-remote`；**不要**裸跑 `supabase migration fetch --linked --yes`（会批量改写已入库迁移文件）。
- **不可变历史**：已合并、已上线的 migration 文件不可改写；修复与纠偏用**新 migration** 前滚。
- **环境变量**：模板见 [`.env.example`](.env.example)（`SUPABASE_URL`、`SUPABASE_PUBLISHABLE_KEY`、`SUPABASE_SECRET_KEY`、`SUPABASE_JWKS_URL`）。本地：`cp .env.example .env.local` 后从 Dashboard → API 填入；Vercel 已连 Supabase 时可 `vercel env pull .env.local`。
- **密钥**：`SUPABASE_SECRET_KEY` 仅服务端使用，不得加 `NEXT_PUBLIC_` 前缀；migration 文件中禁止写密钥。
- **前置**：本机安装 Supabase CLI → `supabase login` → `supabase link --project-ref <ref>`。

## SEO / GEO

- 根 `metadata` 在 `app/layout.tsx`，各页在对应 `page.tsx` 导出 `metadata`。
- 首页注入 Schema.org JSON-LD（`HomeJsonLd` → `buildHomeJsonLd()`）。
- `robots.ts` 对 GPTBot、ClaudeBot 等 AI 爬虫显式 `allow`。
- 修改 `ORG_CONFIG.siteOrigin`（`lib/site-config.ts`）会影响 canonical、OG、sitemap、JSON-LD 中的绝对 URL，部署前确认域名正确。

## 与 Chrome 扩展的关系

- 扩展 ID 与商店链接定义在 `lib/site-config.ts` 的 `CHROME_EXTENSION_ID`。
- 本仓库**不包含**扩展源码；根级 `/features/` 目录在 `.gitignore` 中（Chrome 扩展本体），勿在此仓库实现扩展逻辑。`specs/features/` 为 Feature Spec 规格区，与扩展源码无关。
- 版本号：`SITE_CONFIG.version` 应与扩展发版及 `changelog/_content.ts` 保持一致。

## Agent 注意事项

- 写 Next.js 相关代码前，查阅 `node_modules/next/dist/docs/`，勿依赖旧版 Next.js 经验。
- 不要执行 `pnpm install` / `pnpm add`（由用户在本地终端执行）；需要新依赖时只给出命令。
- 不要提交 `.env*`、`.next/`、`node_modules/`。
- 新增营销区块：在 `_components/home/` 建组件，在 `page.tsx` 组装，长文案放入 `marketing-content.ts`。
- 保持 `pnpm lint` 与 `pnpm build` 可通过。

## 团队 Cursor 命令

团队命令安装于 `.cursor/commands/team/`（本地 `.gitignore` 忽略，不入库）：

| 命令 | 职责 |
|------|------|
| `/team:po-explorer <topic>` | 需求探索，落盘 `specs/features/feat-NNNNN-<slug>.md` |
| `/team:product-manager <feature-slug>` | 撰写 PRD，落盘 `specs/prds/prd-NNNNN-<slug>.md` |
| `/team:front-enginer <task>` | 前端实现 |
| `/team:prd-accept <prd-ref>` | 对照代码验收，回写 PRD 文末「工程验收状态」 |

探索收敛后可由 `/team:product-manager` 将 Feature Spec 对齐为正式 PRD。

PRD 索引：[`specs/prds/prd-wiki-index.md`](specs/prds/prd-wiki-index.md)
