import { Card, CardContent } from "@/components/ui/card";
import { HOW_IT_WORKS_STEPS } from "@/lib/site-config";

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="bg-background py-20">
      <div className="container mx-auto px-4 md:px-8">
        <div className="mx-auto mb-16 max-w-3xl space-y-4 text-center">
          <h2 className="text-xs font-bold tracking-widest text-primary uppercase">
            极其简单的极速配置
          </h2>
          <p className="text-3xl font-black text-foreground sm:text-4xl">
            只需三步，即刻步入敏捷采集时代
          </p>
          <p className="mx-auto max-w-lg text-sm text-muted-foreground">
            无需复杂的二次开发和代理服务器，真正的零门槛部署。
          </p>
        </div>

        <div className="relative grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="absolute top-1/3 right-[15%] left-[15%] -z-10 hidden h-0.5 bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-emerald-500/20 md:block" />

          {HOW_IT_WORKS_STEPS.map((step) => (
            <Card
              key={step.step}
              id={`how-it-works-step-${step.step}`}
              className="relative py-8 shadow-sm transition-shadow hover:shadow"
            >
              <span className="absolute top-4 left-4 text-3xl font-black text-emerald-500/20">
                {String(step.step).padStart(2, "0")}
              </span>
              <CardContent className="space-y-4 pt-4 text-center">
                <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-primary/10 text-lg font-bold text-primary">
                  {step.step}
                </div>
                <h3 className="text-lg font-bold text-foreground">
                  {step.title}
                </h3>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  {step.hasKbd ? (
                    <>
                      在 Chrome 或 Edge 浏览器装入扩展，打开小红书网页版。按下快捷键{" "}
                      <kbd className="rounded border bg-muted px-1.5 py-0.5 font-mono text-[10px]">
                        Alt + C
                      </kbd>{" "}
                      即可呼出全功能侧边栏。
                    </>
                  ) : step.step === 2 ? (
                    <>
                      点击侧边栏右上角的齿轮设置。在「飞书配置」中填入你自建应用的{" "}
                      <code className="text-primary">App ID</code> 及{" "}
                      <code className="text-primary">App Secret</code>{" "}
                      并保存，即可获得完整写入权限。
                    </>
                  ) : (
                    step.description
                  )}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
