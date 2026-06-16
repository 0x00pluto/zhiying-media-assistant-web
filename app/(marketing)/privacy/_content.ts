import type { LegalSection } from "@/app/(marketing)/_components/legal/legal-document";

export const privacyContent = {
  title: "隐私权政策保护说明",
  lastUpdated: "2026-06-16",
  description:
    "了解智赢媒体助手如何收集、使用与保护你的信息，以及浏览器本地存储与飞书配置的处理方式。",
  sections: [
    {
      heading: "1. 适用范围",
      paragraphs: [
        "本政策适用于你通过官方网站、浏览器扩展及相关支持渠道使用「智赢媒体助手」产品与服务的情形。",
        "使用本产品即表示你已阅读并理解本政策的要点。正式法务版本发布前，本文档为框架性说明。",
      ],
    },
    {
      heading: "2. 我们收集的信息",
      paragraphs: [
        "扩展主要在你本地浏览器中运行，读取你当前访问页面中公开可访问的内容，用于采集、导出与同步。",
        "飞书 App ID、App Secret、目标表格路径等配置信息默认存储于浏览器本地 LocalStorage，不上传至智赢官方服务器。",
        "官网访问可能产生常规 Web 日志（如访问时间、浏览器类型），用于安全与运维分析。",
      ],
    },
    {
      heading: "3. 信息使用方式",
      paragraphs: [
        "本地采集的数据仅用于你主动发起的导出、下载或飞书同步操作。",
        "我们不会将你的私密配置或采集内容用于广告投放或未经授权的第三方共享。",
      ],
    },
    {
      heading: "4. 你的权利",
      paragraphs: [
        "你可随时在浏览器中卸载扩展并清除本地存储的配置与缓存数据。",
        "如对本政策有疑问，请通过官网公布的 support@xds365.com 联系我们。",
      ],
    },
  ] satisfies LegalSection[],
};
