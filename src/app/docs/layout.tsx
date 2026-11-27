import type { Metadata } from "next";
import { DocsLayout } from "@/components/docs/docs-layout";
import { siteConfig } from "@/config/site";
import { baseOpenGraph } from "@/lib/og";

export const metadata: Metadata = {
  title: {
    template: `%s | ${siteConfig.name} Docs`,
    default: `Documentation — ${siteConfig.name}`,
  },
  description:
    "Documentation for KissThePDF: how the browser-based PDF engine works, a reference for every tool, the architecture, and how to contribute.",
  openGraph: {
    ...baseOpenGraph,
    title: `Documentation — ${siteConfig.name}`,
    description: "Official developer & product documentation for KissThePDF.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <DocsLayout>{children}</DocsLayout>;
}
