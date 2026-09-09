import { MetadataRoute } from "next";
import { tools } from "@/config/tools";
import { siteConfig } from "@/config/site";
import { CATEGORY_DETAILS } from "@/config/docs";

export default function sitemap(): MetadataRoute.Sitemap {
  const toolRoutes = tools.map((tool) => ({
    url: `${siteConfig.url}${tool.href}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const toolDocRoutes = tools.map((tool) => ({
    url: `${siteConfig.url}/docs/tools/${tool.id}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const categoryDocRoutes = Object.values(CATEGORY_DETAILS).map((cat) => ({
    url: `${siteConfig.url}/docs/tools/${cat.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const staticDocsRoutes = [
    "/docs",
    "/docs/getting-started",
    "/docs/tools",
    "/docs/how-it-works",
    "/docs/privacy",
    "/docs/architecture",
    "/docs/development",
    "/docs/contributing",
    "/docs/security",
    "/docs/faq",
    "/docs/changelog",
  ].map((route) => ({
    url: `${siteConfig.url}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.85,
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

  return [...staticRoutes, ...staticDocsRoutes, ...categoryDocRoutes, ...toolDocRoutes, ...toolRoutes];
}
