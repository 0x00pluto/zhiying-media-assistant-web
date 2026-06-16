import { buildHomeJsonLd } from "@/lib/geo-config";

export function HomeJsonLd() {
  const jsonLd = buildHomeJsonLd();

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
