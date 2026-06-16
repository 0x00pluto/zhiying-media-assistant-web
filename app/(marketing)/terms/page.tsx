import type { Metadata } from "next";

import { LegalDocument } from "@/app/(marketing)/_components/legal/legal-document";

import { termsContent } from "./_content";

export const metadata: Metadata = {
  title: termsContent.title,
  description: termsContent.description,
  alternates: {
    canonical: "/terms",
  },
  openGraph: {
    title: termsContent.title,
    description: termsContent.description,
    url: "/terms",
  },
};

export default function TermsPage() {
  return (
    <LegalDocument
      title={termsContent.title}
      lastUpdated={termsContent.lastUpdated}
      sections={termsContent.sections}
    />
  );
}
