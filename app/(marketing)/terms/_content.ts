import type { LegalSection } from "@/app/(marketing)/_components/legal/legal-document";

export const termsContent = {
  title: "用户服务许可使用协议",
  lastUpdated: "2026-06-16",
  description:
    "智赢媒体助手用户服务许可协议，约定软件使用范围、授权方式与用户义务。",
  sections: [
    {
      heading: "1. 协议接受",
      paragraphs: [
        "安装或使用「智赢媒体助手」浏览器扩展及相关服务，即视为你同意本协议条款。",
        "如不同意本协议，请停止使用并卸载扩展。",
      ],
    },
    {
      heading: "2. 许可范围",
      paragraphs: [
        "我们授予你在遵守本协议及适用法律法规的前提下，非独占、不可转让地使用本产品的权利。",
        "你不得对扩展进行逆向工程、破解、再分发或用于任何违法用途。",
      ],
    },
    {
      heading: "3. 用户义务",
      paragraphs: [
        "你应确保采集、导出与同步的数据来源合法，并具备相应的使用授权。",
        "你应合理控制采集频率，遵守目标平台的服务条款与社区规范。",
        "你须妥善保管飞书自建应用凭证，因本地配置泄露导致的后果由你自行承担。",
      ],
    },
    {
      heading: "4. 免责声明",
      paragraphs: [
        "本产品按「现状」提供，我们不对因平台规则变更、网络故障或第三方服务中断导致的损失承担责任。",
        "正式法务版本发布前，本文档为框架性说明，具体条款以届时公布的完整协议为准。",
      ],
    },
  ] satisfies LegalSection[],
};
