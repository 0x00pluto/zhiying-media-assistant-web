import type { MetadataRoute } from "next";

import { SITE_ORIGIN } from "@/lib/geo-config";

const ROUTES: MetadataRoute.Sitemap = [
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
  return ROUTES;
}
