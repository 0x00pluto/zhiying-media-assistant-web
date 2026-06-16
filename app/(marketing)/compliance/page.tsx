import type { Metadata } from "next";

import { LegalDocument } from "@/app/(marketing)/_components/legal/legal-document";

import { complianceContent } from "./_content";

export const metadata: Metadata = {
  title: complianceContent.title,
  description: complianceContent.description,
  alternates: {
    canonical: "/compliance",
  },
  openGraph: {
    title: complianceContent.title,
    description: complianceContent.description,
    url: "/compliance",
  },
};

export default function CompliancePage() {
  return (
    <LegalDocument
      title={complianceContent.title}
      lastUpdated={complianceContent.lastUpdated}
      sections={complianceContent.sections}
    />
  );
}
