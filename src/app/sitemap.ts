import { MetadataRoute } from "next";
import { tools } from "@/config/tools";
import { siteConfig } from "@/config/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const toolRoutes = tools.map((tool) => ({
    url: `${siteConfig.url}${tool.href}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const staticRoutes = [
    {
      url: siteConfig.url,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1.0,
    },
    {
      url: `${siteConfig.url}/tools`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.9,
    },
    {
      url: `${siteConfig.url}/open-source`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
  ];

  return [...staticRoutes, ...toolRoutes];
}

