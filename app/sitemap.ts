import type { MetadataRoute } from "next";

import { SITE_ORIGIN } from "@/lib/geo-config";
import { helpSource } from "@/lib/help-source";

const STATIC_ROUTES: MetadataRoute.Sitemap = [
  {
    url: SITE_ORIGIN,
    lastModified: new Date("2026-06-16"),
    changeFrequency: "weekly",
    priority: 1,
  },
  {
    url: `${SITE_ORIGIN}/privacy`,
    lastModified: new Date("2026-06-16"),
    changeFrequency: "monthly",
    priority: 0.5,
  },
  {
    url: `${SITE_ORIGIN}/terms`,
    lastModified: new Date("2026-06-16"),
    changeFrequency: "monthly",
    priority: 0.5,
  },
  {
    url: `${SITE_ORIGIN}/compliance`,
    lastModified: new Date("2026-06-16"),
    changeFrequency: "monthly",
    priority: 0.5,
  },
  {
    url: `${SITE_ORIGIN}/changelog`,
    lastModified: new Date("2026-06-16"),
    changeFrequency: "weekly",
    priority: 0.6,
  },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const helpRoutes: MetadataRoute.Sitemap = helpSource.getPages().map((page) => ({
    url: `${SITE_ORIGIN}${page.url}`,
    lastModified: new Date("2026-06-22"),
    changeFrequency: "weekly",
    priority: page.url === "/help" ? 0.8 : 0.7,
  }));

  return [...STATIC_ROUTES, ...helpRoutes];
}
