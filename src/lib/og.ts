import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

/**
 * Open Graph fields shared by every page. Next replaces (does not merge) a
 * parent's `openGraph` when a child sets its own, so spread this into any
 * page-level `openGraph` to keep the image, site name and type.
 *
 * `url: "./"` resolves against the route's own path, so og:url always matches
 * the page's canonical URL instead of inheriting a parent's.
 */
export const baseOpenGraph: NonNullable<Metadata["openGraph"]> = {
  url: "./",
  siteName: siteConfig.name,
  images: [
    {
      url: siteConfig.ogImage,
      width: 1200,
      height: 630,
      alt: `${siteConfig.name} — Free Open-Source PDF Toolkit`,
    },
  ],
  locale: "en_US",
  type: "website",
};
