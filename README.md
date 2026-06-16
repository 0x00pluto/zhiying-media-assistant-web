# 智赢媒体助手官网

Chrome 扩展「智赢媒体助手」的官方营销站点：产品展示、安装引导、隐私/协议/合规文档与更新日志。

**线上地址：** https://smzs.t.xds365.com

## 技术栈

Next.js 16 · React 19 · TypeScript · Tailwind CSS v4 · shadcn/ui · pnpm

## 开发

```bash
pnpm install   # 首次克隆后
pnpm dev       # http://localhost:3000
pnpm build
pnpm lint
```

## 常用文件

| 用途 | 路径 |
|------|------|
| 站点名、版本、商店链接 | `lib/site-config.ts` |
| 首页文案、定价、FAQ | `app/(marketing)/_config/marketing-content.ts` |
| 法律页正文 | 各法律页目录下的 `_content.ts` |
| 更新日志 | `app/(marketing)/changelog/_content.ts` |

## 说明

- 本仓库是官网，**不是**浏览器扩展源码（扩展代码在独立仓库）。
- Agent 协作约定见 [AGENTS.md](./AGENTS.md)。
