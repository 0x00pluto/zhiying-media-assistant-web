import type { MetadataRoute } from "next";

import { SITE_ORIGIN } from "@/lib/geo-config";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_ORIGIN,
      lastModified: new Date("2026-06-16"),
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}
