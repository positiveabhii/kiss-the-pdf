import { MetadataRoute } from "next";
import { tools } from "@/config/tools";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://kissthepdf.space";

export default function sitemap(): MetadataRoute.Sitemap {
  const toolRoutes = tools.map((tool) => ({
    url: `${BASE_URL}${tool.href}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    ...toolRoutes,
  ];
}
