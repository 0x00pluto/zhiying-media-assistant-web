export const NAV_LINKS = [
  { href: "/#features", label: "核心功能" },
  { href: "/#how-it-works", label: "快速上手" },
  { href: "/#feishu-sync", label: "飞书联动" },
  { href: "/#pricing", label: "方案定价" },
  { href: "/#faq", label: "常见问题" },
] as const;

export const STATS = [
  { value: "99.9%", label: "素材精准无水印率" },
  { value: "< 3 秒", label: "单博主数据极速爬取" },
  { value: "0 成本配置", label: "飞书官方免审自建对接" },
  { value: "100%", label: "本地处理，隐私零外传" },
] as const;

export const PLATFORMS = [
  { name: "小红书", status: "active", label: "已完美支持" },
  { name: "抖音", status: "pending", label: "开发中" },
  { name: "哔哩哔哩", status: "planned", label: "规划中" },
] as const;

export const FEATURES = [
  {
    icon: "archive" as const,
    title: "笔记详情与素材捕获",
    description:
      "打开详情页即可识别原图、无水印视频链接。支持一键打包下载原件，按照作者、标题等结构化文件夹，文件管理优雅顺手。",
    footer: "支持下载高清原图 & 视频",
  },
  {
    icon: "list" as const,
    title: "页面批量列表抓取",
    description:
      "在发现页、搜索结果、博主主页，只需点击采集本页笔记，就能拉取全列表笔记并深入调出各笔记互动量数据，无需逐一点击。",
    footer: "一键合并当前屏幕所有内容",
  },
  {
    icon: "users" as const,
    title: "关键词精准找博主",
    description:
      "切换至搜索页「用户」Tab，快速拉取对应品类的博主库。提取其获赞藏总数、粉丝、简介，大幅提升投放对接团队、竞品监控团队效率。",
    footer: "按行业/标签快速检索博主",
  },
  {
    icon: "message-circle" as const,
    title: "一键捕获千万级评论",
    description:
      "从详情页一键切至评论提取面板。不仅可以获取一级回复，还能配置穿透挖掘多级子评论，提取评论包含的图片附件、IP 地址及发布时间。",
    footer: "舆情监控与社群需求挖掘",
  },
] as const;

export const FEISHU_FEATURES = [
  {
    title: "合并与追加双模式：",
    description: "根据主键自动去重覆盖，或只添加新增数据。",
  },
  {
    title: "多入口独立记忆：",
    description: "每个采集模块独立记住上次的目标表格，支持快捷一键同步。",
  },
  {
    title: "图片智能转存：",
    description:
      "解决外链无法预览难题，将封面无缝同步到多维表格自带的附件。",
  },
] as const;

export const HOW_IT_WORKS_STEPS = [
  {
    step: 1,
    title: "一键安装与唤醒",
    description:
      "在 Chrome 或 Edge 浏览器装入扩展，打开小红书网页版。按下快捷键 Alt + C 即可呼出全功能侧边栏。",
    hasKbd: true,
  },
  {
    step: 2,
    title: "配置飞书自建应用 (可选)",
    description:
      "点击侧边栏右上角的齿轮设置。在「飞书配置」中填入你自建应用的 App ID 及 App Secret 并保存，即可获得完整写入权限。",
    hasKbd: false,
  },
  {
    step: 3,
    title: "享受极速一键导出/同步",
    description:
      "浏览任意小红书笔记或搜索用户。在页面点击浮动的专属工具条按钮，即刻自动捕获并在侧栏一键生成标准 CSV 文件，或精准秒级同步至飞书多维表。",
    hasKbd: false,
  },
] as const;

export const TRUST_ITEMS = [
  {
    icon: "shield" as const,
    title: "绝对不涉及隐私",
    description:
      "扩展仅读取页面公开可访问的信息。你的飞书 App 密钥、目标表格路径及个人小红书凭证，一律存储于你的浏览器本地 LocalStorage 中，智赢官方数据库从不接收或保存任何私密配置。",
  },
  {
    icon: "sliders" as const,
    title: "智能平滑限频，阻隔风控",
    description:
      "为了避免调用请求过快导致触发小红书的 300011 异常，我们为批量采集贴心引入了平滑延迟队列（可在「采集设置」中按需调整间隔），贴心保障账号平稳安全。",
  },
  {
    icon: "pencil" as const,
    title: "灵活自定义，无用字段可剔除",
    description:
      "支持深度自定义字段导出配置。你可以在保存前对内容排错：是否过滤话题标签、是否在提取标题时移除特殊文本等，保证最终导出的表格优雅洁净。",
  },
] as const;

export const PRICING_PLANS = [
  {
    id: "free",
    name: "免费基础版",
    price: "¥ 0",
    period: "/ 永久免费",
    description:
      "适合偶尔需要提取个别笔记内容、采集轻量评论分析的个人博主运营。",
    features: [
      { text: "小红书单篇笔记详情素材下载（原图/视频）", included: true },
      { text: "单次提取最多 10 条评论（CSV 导出）", included: true },
      { text: "飞书多维表格基础同步操作（不含附件转存）", included: true },
      { text: "全网页笔记批量采集极速模式", included: false },
    ],
    cta: "直接安装体验",
    ctaVariant: "outline" as const,
    highlighted: false,
  },
  {
    id: "pro",
    name: "专业个人版",
    price: "¥ 0",
    originalPrice: "¥ 39.9",
    period: "/ 体验期免费",
    badge: "主推 · 公测限时免费",
    promo: "🎁 公测期注册终身享受优先升级",
    description:
      "适合自媒体独立创作者、小型工作室，需要频繁批量导出数据及监控竞品博主。",
    features: [
      { text: "无限单篇笔记/视频原件批量打包下载", included: true },
      { text: "发现页、搜索结果、博主主页无上限列表采集", included: true },
      { text: "飞书多维表格「合并模式」+「追加模式」", included: true },
      { text: "一键云附件转存：智能同步素材封面为飞书附件", included: true },
      { text: "多模块历史目标表格自动记忆与快捷切换", included: true },
    ],
    cta: "公测期免授权码直接用",
    ctaVariant: "default" as const,
    highlighted: true,
  },
  {
    id: "enterprise",
    name: "MCN/品牌企业版",
    price: "价格待定",
    period: "/ 方案设计中",
    description:
      "适合有多位媒介采购主管、社群投放总监的大中型矩阵运营团队。",
    features: [
      { text: "包含专业版全部数据采集、多维同步特权", included: true },
      { text: "支持多账号一键绑定与协同配置同步", included: true },
      { text: "企业级数据高并发稳定导出通道", included: true },
      { text: "提供一对一专属技术专家协助部署服务", included: true },
    ],
    cta: "联系客服登记需求",
    ctaVariant: "outline" as const,
    highlighted: false,
    isEnterprise: true,
  },
] as const;

export const FAQ_ITEMS = [
  {
    question: "打开小红书网页版后，侧边栏没有出现采集按钮？",
    answer:
      "请确认已打开小红书网页版并且刷新页面。如果是首次安装，需要确保浏览器已经授权了该插件在所有网站上的读取权限，避免部分 SPA（单页面应用）前端框架深度跳转后页面无法侦测加载。",
  },
  {
    question: "配置飞书同步总是失败，有什么排查路径？",
    answer: `请按照以下三步排查：
1. 检查是否在飞书开放平台为该自建应用开通了「多维表格」读写权限，以及相应的「通讯录」等辅助查询功能；
2. 确认你填写的 App ID 和 App Secret 正确，且应用已在飞书后台正式「发布版本」上线；
3. 如果表格配置无误，可以在控制台 chrome://extensions 点击 Service Worker 的 Inspect 查看后台的具体返回，定位字段映射问题。`,
  },
  {
    question: "批量采集时会不会触发平台风控（例如 300011 错误）？",
    answer:
      "当短时间内请求详情接口过于频繁时，平台有几率会下发验证码。智赢助手已经内置了「模拟真人浏览行为延迟间隔设置」。如果发现高频被截流，请在齿轮「设置」 -> 「采集设置」中调慢请求速率，单次提取尽量控制在 50 条以下。",
  },
  {
    question: "部分视频的下载链接为什么会显示为空？",
    answer:
      "在详情页中素材抓取率是最完美的。但在小红书某些列表页批量拉取时，列表接口本身的 API 并未下发完整无水印视频流数据。若检测到视频空链接，请点击打开该笔记详情重新加载，或者检查 URL 是否包含防盗刷的 xsec_token 校验标记。",
  },
] as const;

export const FOOTER_LINKS = {
  product: [
    { href: "/#how-it-works", label: "如何连接飞书云多维表" },
    { href: "/#features", label: "如何避免采集速率风控" },
    { href: "/#faq", label: "常见常见问题自检清单" },
    { href: "/changelog", label: "更新变更日志记录 (Changelog)" },
  ],
  legal: [
    { href: "/privacy", label: "隐私权政策保护说明" },
    { href: "/terms", label: "用户服务许可使用协议" },
    { href: "/compliance", label: "数据合规采集自律宣言" },
  ],
} as const;
