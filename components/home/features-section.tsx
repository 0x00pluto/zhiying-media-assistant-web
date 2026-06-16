import {
  Archive,
  ArrowRight,
  List,
  MessageCircle,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { FEATURES } from "@/lib/site-config";

const ICON_MAP: Record<(typeof FEATURES)[number]["icon"], LucideIcon> = {
  archive: Archive,
  list: List,
  users: Users,
  "message-circle": MessageCircle,
};

export function FeaturesSection() {
  return (
    <section id="features" className="relative bg-background py-20">
      <div className="container mx-auto px-4 md:px-8">
        <div className="mx-auto mb-16 max-w-3xl space-y-4 text-center">
          <h2 className="text-xs font-bold tracking-widest text-primary uppercase">
            多场景覆盖
          </h2>
          <p className="text-3xl font-black text-foreground sm:text-4xl">
            全网最顺手的小红书爆款捕手
          </p>
          <p className="mx-auto max-w-xl text-sm text-muted-foreground sm:text-base">
            专为提效而生，摒弃多余操作。只要你身处相关网页，侧边栏便随时化身为你的数据整理中枢。
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((feature) => {
            const Icon = ICON_MAP[feature.icon];
            return (
              <Card
                key={feature.title}
                className="group flex flex-col justify-between py-6 shadow-sm transition-all hover:border-emerald-500/30 hover:shadow-md"
              >
                <CardContent className="space-y-4">
                  <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="size-6" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
                <div className="mt-6 border-t border-border/60 px-6 pt-4">
                  <span className="flex items-center text-[11px] font-semibold text-primary">
                    {feature.footer}
                    <ArrowRight className="ml-1 size-3.5 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
