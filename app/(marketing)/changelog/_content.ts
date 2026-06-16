import { SITE_CONFIG } from "@/lib/site-config";

export type ChangelogEntry = {
  version: string;
  date: string;
  changes: string[];
};

export const changelogContent = {
  title: "更新变更日志",
  lastUpdated: "2026-06-16",
  description: `${SITE_CONFIG.name} 版本更新记录与功能变更说明。`,
  entries: [
    {
      version: "v0.3.2",
      date: "2026-06-16",
      changes: [
        "官网架构升级为多页路由，新增隐私政策、用户协议、合规声明与 Changelog 页面。",
        "优化导航链接，支持从子页面跳转回首页锚点区块。",
      ],
    },
    {
      version: "v0.3.1",
      date: "2026-05-01",
      changes: [
        "飞书多维表格同步支持合并与追加双模式。",
        "批量采集新增平滑延迟队列，降低风控触发概率。",
      ],
    },
    {
      version: "v0.3.0",
      date: "2026-04-01",
      changes: [
        "首发公测版本，支持小红书笔记、评论、博主列表采集与 CSV 导出。",
        "支持飞书自建应用对接与多维表格写入。",
      ],
    },
  ] satisfies ChangelogEntry[],
};
