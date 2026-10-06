import type { MetadataRoute } from "next";
import { areas } from "@/content/areas";
import { siteConfig } from "@/lib/site-config";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${siteConfig.siteUrl}/`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${siteConfig.siteUrl}/focus/`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${siteConfig.siteUrl}/chat/`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    ...areas.map((area) => ({
      url: `${siteConfig.siteUrl}/${area.slug}/`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    {
      url: `${siteConfig.siteUrl}/privacidade/`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}
