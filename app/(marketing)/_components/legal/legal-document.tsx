export type LegalSection = {
  heading: string;
  paragraphs: string[];
};

type LegalDocumentProps = {
  title: string;
  lastUpdated: string;
  sections: LegalSection[];
};

export function LegalDocument({
  title,
  lastUpdated,
  sections,
}: LegalDocumentProps) {
  return (
    <article className="container mx-auto max-w-3xl px-4 py-16 md:px-8">
      <header className="mb-10 space-y-3 border-b pb-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          {title}
        </h1>
        <p className="text-sm text-muted-foreground">最后更新：{lastUpdated}</p>
      </header>

      <div className="space-y-10">
        {sections.map((section) => (
          <section key={section.heading} className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">
              {section.heading}
            </h2>
            <div className="space-y-3 text-sm leading-relaxed text-muted-foreground">
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </section>
        ))}
      </div>
    </article>
  );
}
