const CHROME_EXTENSION_ID = "iobjekoppljaiophplhgmagmjfgaaoed";

export const ORG_CONFIG = {
  legalName: "北京互远未来科技有限公司",
  brandName: "互远AI",
  siteOrigin: "https://smzs.t.xds365.com",
} as const;

export const SITE_CONFIG = {
  name: "智赢媒体助手",
  version: "v0.3.2",
  title: "智赢媒体助手 - 小红书素材一键采集与飞书无缝同步工具",
  description:
    "专为博主运营、品牌商家、数据分析师打造。支持一键导出 CSV 报表与批量下载图片、无水印视频素材，无缝同步飞书多维表格。",
  chromeStoreUrl: `https://chromewebstore.google.com/detail/${CHROME_EXTENSION_ID}?utm_source=official-website&utm_medium=referral&utm_campaign=homepage`,
  edgeStoreUrl: "",
  supportEmail: "support@xds365.com",
} as const;
