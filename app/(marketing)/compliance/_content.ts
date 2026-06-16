import type { LegalSection } from "@/app/(marketing)/_components/legal/legal-document";

export const complianceContent = {
  title: "数据合规采集自律宣言",
  lastUpdated: "2026-06-16",
  description:
    "智赢媒体助手关于公开数据采集、隐私保护与合规使用的自律承诺与使用边界说明。",
  sections: [
    {
      heading: "1. 采集边界",
      paragraphs: [
        "本产品仅协助用户整理其有权访问的公开页面信息，不鼓励、不支持绕过平台安全机制或获取非公开数据。",
        "用户应确保采集行为符合目标平台规则、著作权法、个人信息保护法及相关行业规范。",
      ],
    },
    {
      heading: "2. 隐私保护",
      paragraphs: [
        "敏感配置（如飞书凭证）默认仅存于用户本地浏览器，不上传至智赢官方服务器。",
        "我们持续优化限频与延迟策略，降低对平台与用户账号的不当影响。",
      ],
    },
    {
      heading: "3. 自律承诺",
      paragraphs: [
        "我们将持续完善产品说明、风险提示与合规指引，帮助用户正确理解工具边界。",
        "如发现产品被用于明显违法违规场景，我们有权在合理范围内限制或终止相关使用。",
        "正式法务版本发布前，本文档为框架性说明。",
      ],
    },
  ] satisfies LegalSection[],
};
