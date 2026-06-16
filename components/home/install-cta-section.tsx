import Image from "next/image";

import { Button } from "@/components/ui/button";
import { SITE_CONFIG } from "@/lib/site-config";

function BrowserIcon({
  src,
  alt,
}: {
  src: string;
  alt: string;
}) {
  return (
    <Image
      src={src}
      alt={alt}
      width={20}
      height={20}
      className="size-5 shrink-0"
    />
  );
}

export function InstallCtaSection() {
  return (
    <section
      id="install"
      className="relative overflow-hidden bg-gradient-to-t from-emerald-950 to-neutral-900 py-20 text-white"
    >
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.15),transparent)]" />

      <div className="container mx-auto max-w-4xl space-y-8 px-4 text-center md:px-8">
        <h2 className="text-3xl leading-tight font-black tracking-tight sm:text-5xl">
          立即武装你的浏览器
          <br />
          开始无感爆款采集之旅
        </h2>
        <p className="mx-auto max-w-lg text-sm leading-relaxed text-zinc-300 sm:text-base">
          只需几秒安装配置，告别机械繁杂的人工表格登记与零散素材存取。将飞书自动化能力发挥到极致！
        </p>

        <div className="flex flex-col items-center justify-center gap-4 pt-4 sm:flex-row">
          <Button
            asChild
            size="lg"
            className="h-auto w-full bg-emerald-600 px-8 py-4 text-sm font-bold shadow-lg hover:bg-emerald-500 sm:w-auto"
          >
            <a
              href={SITE_CONFIG.chromeStoreUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <BrowserIcon src="/brand/chrome.png" alt="Google Chrome" />
              从 Chrome Web Store 安装
            </a>
          </Button>

          <Button
            size="lg"
            disabled
            className="h-auto w-full border border-zinc-700 bg-zinc-800 px-8 py-4 text-sm font-bold hover:bg-zinc-700 sm:w-auto"
          >
            <BrowserIcon src="/brand/edge.png" alt="Microsoft Edge" />
            从 Edge Add-ons 安装（即将上线）
          </Button>
        </div>

        <div className="flex flex-wrap justify-center gap-6 border-t border-zinc-800 pt-8 text-xs text-zinc-400">
          <span>✅ 已通过谷歌安全沙盒检测</span>
          <span>🛡️ 无痕本地运行无后台数据泄露风险</span>
          <span>🚀 完美支持 Chrome & Edge 最新内核</span>
        </div>
      </div>
    </section>
  );
}
