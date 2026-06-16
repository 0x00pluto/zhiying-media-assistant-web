import { Pencil, Shield, SlidersHorizontal } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { TRUST_ITEMS } from "@/lib/site-config";

const ICON_MAP: Record<(typeof TRUST_ITEMS)[number]["icon"], LucideIcon> = {
  shield: Shield,
  sliders: SlidersHorizontal,
  pencil: Pencil,
};

export function TrustSection() {
  return (
    <section className="border-y bg-muted/40 py-20">
      <div className="container mx-auto px-4 md:px-8">
        <div className="mx-auto mb-16 max-w-3xl space-y-4 text-center">
          <h2 className="text-xs font-bold tracking-widest text-emerald-600 uppercase dark:text-emerald-400">
            本地、合规、更安全
          </h2>
          <p className="text-3xl font-black text-foreground sm:text-4xl">
            为企业级商业数据保驾护航
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {TRUST_ITEMS.map((item) => {
            const Icon = ICON_MAP[item.icon];
            return (
              <div key={item.title} className="flex space-x-4">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-primary">
                  <Icon className="size-5" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-foreground">
                    {item.title}
                  </h4>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
