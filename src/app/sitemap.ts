import { MetadataRoute } from "next";
import { tools } from "@/config/tools";
import { siteConfig } from "@/config/site";
import { CATEGORY_DETAILS } from "@/config/docs";
import { toolVariants } from "@/config/tool-variants";
import { guides } from "@/content/guides";
import { allTags, posts } from "@/content/blog";

export default function sitemap(): MetadataRoute.Sitemap {
  const toolRoutes = tools.map((tool) => ({
    url: `${siteConfig.url}${tool.href}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const variantRoutes = toolVariants.map((v) => ({
    url: `${siteConfig.url}/${v.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const guideRoutes = [
    {
      url: `${siteConfig.url}/guides`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.85,
    },
    ...guides.map((g) => ({
      url: `${siteConfig.url}/guides/${g.slug}`,
      lastModified: new Date(g.updated ?? g.published),
      changeFrequency: "monthly" as const,
      priority: 0.75,
    })),
  ];

  const blogRoutes = [
    { url: `${siteConfig.url}/blog`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.85 },
    ...posts.map((p) => ({
      url: `${siteConfig.url}/blog/${p.slug}`,
      lastModified: new Date(p.updated ?? p.published),
      changeFrequency: "monthly" as const,
      priority: 0.75,
      images: [`${siteConfig.url}/blog/${p.slug}/cover.png`],
    })),
    // Only tag pages with enough posts to be indexable (see blog/tag/[tag]/page.tsx).
    ...allTags()
      .filter((t) => t.count >= 3)
      .map(({ tag }) => ({ url: `${siteConfig.url}/blog/tag/${tag}`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.5 })),
  ];

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

  const competitorRoutes = [
    "ilovepdf", "smallpdf", "pdf24", "sejda", "adobe-acrobat", "stirling-pdf"
  ].map((comp) => ({
    url: `${siteConfig.url}/${comp}-alternative`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...staticDocsRoutes, ...categoryDocRoutes, ...toolDocRoutes, ...toolRoutes, ...variantRoutes, ...guideRoutes, ...blogRoutes, ...competitorRoutes];
}
