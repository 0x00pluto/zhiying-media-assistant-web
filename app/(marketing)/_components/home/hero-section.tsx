import { Download } from "lucide-react";

import { HeroDemoSimulator } from "@/app/(marketing)/_components/home/hero-demo-simulator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PLATFORMS } from "@/app/(marketing)/_config/marketing-content";
import { SITE_CONFIG } from "@/lib/site-config";
import { cn } from "@/lib/utils";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-32">
      <div className="container relative mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
          <div className="space-y-8 text-center lg:col-span-6 lg:text-left">
            <Badge
              variant="outline"
              className="inline-flex items-center gap-2 border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-semibold tracking-wide text-emerald-700 dark:text-emerald-300"
            >
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
              </span>
              小红书网页版专属高级数据采集插件
            </Badge>

            <h1 className="text-4xl leading-[1.15] font-black tracking-tight text-foreground sm:text-5xl lg:text-4xl xl:text-5xl 2xl:text-6xl">
              <span className="block lg:whitespace-nowrap">
                一键采集小红书爆款数据
              </span>
              <span className="block text-emerald-600 lg:whitespace-nowrap dark:text-emerald-400">
                无缝同步飞书多维表格
              </span>
            </h1>

            <p className="mx-auto max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg md:text-xl lg:mx-0">
              专为博主运营、品牌商家、数据分析师打造。支持一键导出 CSV
              报表与批量下载图片、无水印视频素材。把原本繁琐的手工整理缩短至 2
              秒内！
            </p>

            <div className="flex flex-col items-center justify-center gap-4 pt-2 sm:flex-row lg:justify-start">
              <Button
                asChild
                size="lg"
                className="h-auto w-full px-8 py-4 text-base font-bold shadow-lg shadow-emerald-900/10 hover:-translate-y-0.5 dark:shadow-emerald-950/20 sm:w-auto"
              >
                <a
                  href={SITE_CONFIG.chromeStoreUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Download className="size-5" strokeWidth={2.5} />
                  获取 Chrome 扩展
                </a>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="h-auto w-full px-8 py-4 text-base font-semibold sm:w-auto"
              >
                <a href="#how-it-works">查看视频演示 / 快速上手</a>
              </Button>
            </div>

            <div className="border-t border-border/60 pt-6">
              <p className="mb-3 text-xs font-medium text-muted-foreground">
                支持的平台及状态
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4 lg:justify-start">
                {PLATFORMS.map((platform) => (
                  <span
                    key={platform.name}
                    className="flex items-center rounded-lg border bg-card px-3 py-1.5 text-xs"
                  >
                    <span
                      className={cn(
                        "mr-2 size-2 rounded-full",
                        platform.status === "active"
                          ? "bg-red-500"
                          : "bg-gray-400",
                      )}
                    />
                    <span
                      className={
                        platform.status === "active"
                          ? "text-foreground"
                          : "text-muted-foreground"
                      }
                    >
                      {platform.name} ({platform.label})
                    </span>
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="relative flex h-[450px] w-full items-center justify-center sm:h-[500px] lg:col-span-6">
            <HeroDemoSimulator />
          </div>
        </div>
      </div>
    </section>
  );
}
