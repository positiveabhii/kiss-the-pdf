import type { Metadata } from "next";
import { LandingPage } from "@/components/landing/landing-page";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: `${siteConfig.name} — ${siteConfig.tagline}`,
  description: siteConfig.description,
  alternates: {
    canonical: siteConfig.url,
  },
  openGraph: {
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: `${siteConfig.name} — Free Open-Source PDF Toolkit`,
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
  },
};

export default function Home() {
  return <LandingPage />;
}
