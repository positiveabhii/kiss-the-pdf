import type { Metadata } from "next";
import { DocsLayout } from "@/components/docs/docs-layout";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: {
    template: `%s | ${siteConfig.name} Documentation`,
    default: `Documentation — ${siteConfig.name}`,
  },
  description:
    "Official developer and user documentation for KissThePDF. Learn how the browser-first PDF engine works, explore 100 tools, inspect the technical architecture, or contribute to the open-source project.",
  openGraph: {
    title: `Documentation — ${siteConfig.name}`,
    description: "Official developer & product documentation for KissThePDF.",
    url: `${siteConfig.url}/docs`,
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <DocsLayout>{children}</DocsLayout>;
}
