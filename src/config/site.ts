export const siteConfig = {
  name: "KissThePDF",
  shortName: "KissPDF",
  tagline: "Free, Open-Source, Privacy-First PDF Toolkit",
  description:
    "Free, open-source, privacy-first PDF tools. Merge, split, compress, edit, convert, organize, and secure PDF files 100% locally in your browser.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://kissthepdf.space",
  githubUrl: "https://github.com/positiveabhii/kiss-the-pdf",
  issuesUrl: "https://github.com/positiveabhii/kiss-the-pdf/issues",
  newIssueUrl: "https://github.com/positiveabhii/kiss-the-pdf/issues/new",
  securityUrl: "https://github.com/positiveabhii/kiss-the-pdf/blob/main/SECURITY.md",
  licenseUrl: "https://github.com/positiveabhii/kiss-the-pdf/blob/main/LICENSE",
  contributingUrl: "https://github.com/positiveabhii/kiss-the-pdf/blob/main/CONTRIBUTING.md",
  author: {
    name: "Abhi",
    url: "https://github.com/positiveabhii",
  },
  logo: "/PDF.png",
  ogImage: "/og.png",
  license: "MIT",
  keywords: [
    "KissThePDF",
    "pdf tools",
    "free pdf editor",
    "merge pdf",
    "split pdf",
    "compress pdf",
    "pdf to jpg",
    "privacy-first pdf",
    "client-side pdf processing",
    "open-source pdf tools",
  ],
};

export type SiteConfig = typeof siteConfig;
