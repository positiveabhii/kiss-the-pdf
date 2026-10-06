import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Free PDF Tools Directory (All 100+ Tools)",
  description:
    "Explore all 100+ free browser-local PDF tools. Merge, split, compress, edit, convert, organize, and secure PDF documents 100% client-side with KissThePDF.",
  alternates: {
    canonical: `${siteConfig.url}/tools`,
  },
  openGraph: {
    title: `Free PDF Tools Directory (All 100+ Tools) | ${siteConfig.name}`,
    description:
      "Explore all 100+ free browser-local PDF tools. Merge, split, compress, edit, convert, organize, and secure PDF documents 100% client-side with KissThePDF.",
    url: `${siteConfig.url}/tools`,
    siteName: siteConfig.name,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `Free PDF Tools Directory (All 100+ Tools) | ${siteConfig.name}`,
    description:
      "Explore all 100+ free browser-local PDF tools. Merge, split, compress, edit, convert, organize, and secure PDF documents 100% client-side with KissThePDF.",
  },
};

export default function ToolsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
