import type { Metadata } from "next";

import { LegalDocument } from "@/app/(marketing)/_components/legal/legal-document";

import { privacyContent } from "./_content";

export const metadata: Metadata = {
  title: privacyContent.title,
  description: privacyContent.description,
  alternates: {
    canonical: "/privacy",
  },
  openGraph: {
    title: privacyContent.title,
    description: privacyContent.description,
    url: "/privacy",
  },
};

export default function PrivacyPage() {
  return (
    <LegalDocument
      title={privacyContent.title}
      lastUpdated={privacyContent.lastUpdated}
      sections={privacyContent.sections}
    />
  );
}
