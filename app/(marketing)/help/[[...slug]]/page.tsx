import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
} from "fumadocs-ui/layouts/docs/page";
import { createRelativeLink } from "fumadocs-ui/mdx";

import { getMDXComponents } from "@/mdx-components";
import { helpSource } from "@/lib/help-source";
import { SITE_CONFIG } from "@/lib/site-config";

export default async function HelpPage(props: PageProps<"/help/[[...slug]]">) {
  const params = await props.params;
  const page = helpSource.getPage(params.slug);

  if (!page) {
    notFound();
  }

  const MDX = page.data.body;

  return (
    <DocsPage toc={page.data.toc} full={page.data.full}>
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription>{page.data.description}</DocsDescription>
      <DocsBody>
        <MDX
          components={getMDXComponents({
            a: createRelativeLink(helpSource, page),
          })}
        />
      </DocsBody>
    </DocsPage>
  );
}

export function generateStaticParams() {
  return helpSource.generateParams();
}

export async function generateMetadata(
  props: PageProps<"/help/[[...slug]]">,
): Promise<Metadata> {
  const params = await props.params;
  const page = helpSource.getPage(params.slug);

  if (!page) {
    notFound();
  }

  const title = page.data.title;
  const description = page.data.description;

  return {
    title,
    description,
    alternates: {
      canonical: page.url,
    },
    openGraph: {
      title: `${title} | ${SITE_CONFIG.name}`,
      description,
      url: page.url,
    },
  };
}
