"use client";

import { Check, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PRICING_PLANS, SITE_CONFIG } from "@/lib/site-config";
import { cn } from "@/lib/utils";

export function PricingSection() {
  return (
    <section id="pricing" className="bg-background py-20">
      <div className="container mx-auto px-4 md:px-8">
        <div className="mx-auto mb-16 max-w-3xl space-y-4 text-center">
          <h2 className="text-xs font-bold tracking-widest text-primary uppercase">
            极其亲民的价格方案
          </h2>
          <p className="text-3xl font-black text-foreground sm:text-4xl">
            选择最适合你的效率套餐
          </p>
          <p className="text-sm text-muted-foreground">
            目前处于产品公测体验期，所有高级专业功能限时免费开放！
          </p>
        </div>

        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 pt-4 md:grid-cols-3 md:items-center">
          {PRICING_PLANS.map((plan) => (
            <Card
              key={plan.id}
              className={cn(
                "relative flex flex-col justify-between py-8 transition-shadow hover:shadow-lg",
                plan.highlighted &&
                  "z-10 scale-105 overflow-visible border-2 border-emerald-500 shadow-xl",
              )}
            >
              {plan.highlighted && "badge" in plan && (
                <span className="absolute top-0 right-1/2 z-20 -translate-y-1/2 translate-x-1/2 rounded-full bg-primary px-3 py-1 text-[10px] font-black tracking-wider whitespace-nowrap text-primary-foreground uppercase">
                  {plan.badge}
                </span>
              )}

              <CardContent className="flex flex-1 flex-col">
                <span
                  className={cn(
                    "mb-2 block text-xs font-bold tracking-wide uppercase",
                    plan.highlighted
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-muted-foreground",
                  )}
                >
                  {plan.name}
                </span>

                <div className="mb-4">
                  {plan.highlighted && "originalPrice" in plan ? (
                    <div className="flex flex-col">
                      <div className="flex items-baseline">
                        <span className="mr-2 text-xl text-muted-foreground line-through">
                          {plan.originalPrice}
                        </span>
                        <span className="text-4xl font-extrabold text-foreground">
                          {plan.price}
                        </span>
                        <span className="ml-2 text-xs text-muted-foreground">
                          {plan.period}
                        </span>
                      </div>
                      {"promo" in plan && (
                        <span className="mt-1.5 w-max rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                          {plan.promo}
                        </span>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-baseline">
                      <span
                        className={cn(
                          "font-extrabold text-foreground",
                          plan.id === "enterprise" ? "text-3xl" : "text-4xl",
                        )}
                      >
                        {plan.price}
                      </span>
                      <span className="ml-2 text-xs text-muted-foreground">
                        {plan.period}
                      </span>
                    </div>
                  )}
                </div>

                <p className="mb-6 text-xs text-muted-foreground">
                  {plan.description}
                </p>

                <ul className="mb-8 flex-1 space-y-3 text-xs text-foreground">
                  {plan.features.map((feature) => (
                    <li key={feature.text} className="flex items-center">
                      {feature.included ? (
                        <Check className="mr-2 size-4 shrink-0 text-emerald-500" />
                      ) : (
                        <X className="mr-2 size-4 shrink-0 text-muted-foreground" />
                      )}
                      <span className={cn(!feature.included && "opacity-40")}>
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>

                {plan.id === "pro" ? (
                  <Button
                    className="w-full font-bold"
                    onClick={() =>
                      alert(
                        "感谢支持！我们目前免费开放公测专业版所有功能。您下载并安装扩展后即可在侧栏无限制直接使用。",
                      )
                    }
                  >
                    {plan.cta}
                  </Button>
                ) : "isEnterprise" in plan && plan.isEnterprise ? (
                  <Button
                    variant="outline"
                    className="w-full font-semibold"
                    onClick={() =>
                      alert(
                        `需要预约企业定制版？请邮件联系: ${SITE_CONFIG.supportEmail}`,
                      )
                    }
                  >
                    {plan.cta}
                  </Button>
                ) : (
                  <Button variant="outline" className="w-full font-semibold" asChild>
                    <a
                      href={SITE_CONFIG.chromeStoreUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {plan.cta}
                    </a>
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
