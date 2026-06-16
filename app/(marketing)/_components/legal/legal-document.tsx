import type { ReactNode } from "react";

export type LegalContentBlock =
  | { type: "paragraph"; text: string }
  | { type: "list"; items: string[] };

export type LegalSection = {
  heading: string;
  paragraphs?: string[];
  listItems?: string[];
  blocks?: LegalContentBlock[];
  subsections?: LegalSection[];
};

type LegalDocumentProps = {
  title: string;
  lastUpdated: string;
  effectiveDate?: string;
  applicableProduct?: string;
  intro?: string[];
  footerNote?: string;
  sections: LegalSection[];
};

const INLINE_PATTERN =
  /(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\(mailto:[^)]+\))/g;

function renderInlineText(text: string): ReactNode[] {
  const parts = text.split(INLINE_PATTERN).filter(Boolean);

  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={index}>{part.slice(2, -2)}</strong>;
    }

    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code
          key={index}
          className="rounded bg-muted px-1 py-0.5 font-mono text-[0.9em] text-foreground"
        >
          {part.slice(1, -1)}
        </code>
      );
    }

    const mailtoMatch = part.match(/^\[([^\]]+)\]\((mailto:[^)]+)\)$/);
    if (mailtoMatch) {
      const [, label, href] = mailtoMatch;
      return (
        <a
          key={index}
          href={href}
          className="text-primary underline-offset-4 hover:underline"
        >
          {label}
        </a>
      );
    }

    return part;
  });
}

function LegalSectionBlock({
  section,
  headingLevel,
}: {
  section: LegalSection;
  headingLevel: "h2" | "h3";
}) {
  const HeadingTag = headingLevel;
  const hasBlocks = (section.blocks?.length ?? 0) > 0;

  return (
    <section className="space-y-4">
      <HeadingTag
        className={
          headingLevel === "h2"
            ? "text-xl font-semibold text-foreground"
            : "text-lg font-medium text-foreground"
        }
      >
        {section.heading}
      </HeadingTag>

      {hasBlocks ? (
        <div className="space-y-3 text-sm leading-relaxed text-muted-foreground">
          {section.blocks?.map((block, index) => {
            if (block.type === "paragraph") {
              return (
                <p key={`${block.text}-${index}`}>
                  {renderInlineText(block.text)}
                </p>
              );
            }

            return (
              <ul
                key={`list-${index}`}
                className="list-disc space-y-2 pl-5"
              >
                {block.items.map((item) => (
                  <li key={item}>{renderInlineText(item)}</li>
                ))}
              </ul>
            );
          })}
        </div>
      ) : (
        <>
          {(section.paragraphs?.length ?? 0) > 0 && (
            <div className="space-y-3 text-sm leading-relaxed text-muted-foreground">
              {section.paragraphs?.map((paragraph) => (
                <p key={paragraph}>{renderInlineText(paragraph)}</p>
              ))}
            </div>
          )}

          {(section.listItems?.length ?? 0) > 0 && (
            <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-muted-foreground">
              {section.listItems?.map((item) => (
                <li key={item}>{renderInlineText(item)}</li>
              ))}
            </ul>
          )}
        </>
      )}

      {(section.subsections?.length ?? 0) > 0 && (
        <div className="space-y-8">
          {section.subsections?.map((subsection) => (
            <LegalSectionBlock
              key={subsection.heading}
              section={subsection}
              headingLevel="h3"
            />
          ))}
        </div>
      )}
    </section>
  );
}

export function LegalDocument({
  title,
  lastUpdated,
  effectiveDate,
  applicableProduct,
  intro,
  footerNote,
  sections,
}: LegalDocumentProps) {
  return (
    <article className="container mx-auto max-w-3xl px-4 py-16 md:px-8">
      <header className="mb-10 space-y-3 border-b pb-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          {title}
        </h1>
        <p className="text-sm text-muted-foreground">
          {effectiveDate ? `生效日期：${effectiveDate} · ` : ""}
          最近更新：{lastUpdated}
        </p>
        {applicableProduct ? (
          <p className="text-sm text-muted-foreground">
            适用产品：{applicableProduct}
          </p>
        ) : null}
      </header>

      {(intro?.length ?? 0) > 0 ? (
        <div className="mb-10 space-y-3 text-sm leading-relaxed text-muted-foreground">
          {intro?.map((paragraph) => (
            <p key={paragraph}>{renderInlineText(paragraph)}</p>
          ))}
        </div>
      ) : null}

      <div className="space-y-10">
        {sections.map((section) => (
          <LegalSectionBlock
            key={section.heading}
            section={section}
            headingLevel="h2"
          />
        ))}
      </div>

      {footerNote ? (
        <footer className="mt-12 border-t pt-8 text-sm text-muted-foreground">
          <p>{footerNote}</p>
        </footer>
      ) : null}
    </article>
  );
}
