import type { Metadata } from "next";

import { changelogContent } from "./_content";

export const metadata: Metadata = {
  title: changelogContent.title,
  description: changelogContent.description,
  alternates: {
    canonical: "/changelog",
  },
  openGraph: {
    title: changelogContent.title,
    description: changelogContent.description,
    url: "/changelog",
  },
};

export default function ChangelogPage() {
  return (
    <article className="container mx-auto max-w-3xl px-4 py-16 md:px-8">
      <header className="mb-10 space-y-3 border-b pb-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          {changelogContent.title}
        </h1>
        <p className="text-sm text-muted-foreground">
          最后更新：{changelogContent.lastUpdated}
        </p>
      </header>

      <div className="space-y-10">
        {changelogContent.entries.map((entry) => (
          <section
            key={entry.version}
            className="space-y-4 rounded-lg border bg-card p-6"
          >
            <div className="flex flex-wrap items-baseline gap-3">
              <h2 className="text-lg font-semibold text-foreground">
                {entry.version}
              </h2>
              <time
                dateTime={entry.date}
                className="text-sm text-muted-foreground"
              >
                {entry.date}
              </time>
            </div>
            <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-muted-foreground">
              {entry.changes.map((change) => (
                <li key={change}>{change}</li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </article>
  );
}
