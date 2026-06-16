import { STATS } from "@/app/(marketing)/_config/marketing-content";

export function StatsBar() {
  return (
    <section className="relative z-10 border-y bg-card/60 py-8">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-2 gap-8 divide-y text-center md:grid-cols-4 md:divide-x md:divide-y-0">
          {STATS.map((stat) => (
            <div key={stat.label} className="pt-4 md:pt-0">
              <p className="text-3xl font-extrabold text-primary md:text-4xl">
                {stat.value}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
