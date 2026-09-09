import { siteConfig } from "@/config/site";
import { tools } from "@/config/tools";
import { CATEGORY_DETAILS } from "@/config/docs";

export async function GET() {
  const toolEntries = tools
    .map(
      (tool) => `### ${tool.name} (${tool.id})
- **Category**: ${tool.category}
- **App URL**: ${siteConfig.url}${tool.href}
- **Documentation URL**: ${siteConfig.url}/docs/tools/${tool.id}
- **Description**: ${tool.description}
- **Status**: ${tool.status}
- **SEO Title**: ${tool.seoTitle}
- **SEO Description**: ${tool.seoDescription}
- **Keywords**: ${tool.keywords?.join(", ") || "N/A"}
`
    )
    .join("\n");

  const docCategoryEntries = Object.values(CATEGORY_DETAILS)
    .map(
      (cat) => `### ${cat.name} Category Documentation
- **URL**: ${siteConfig.url}/docs/tools/${cat.slug}
- **Description**: ${cat.description}
- **Summary**: ${cat.summary}
`
    )
    .join("\n");

  const content = `# KissThePDF — Full Capabilities, Documentation & Tool Catalogue Index

This document provides a comprehensive, machine-readable specification of the KissThePDF open-source toolkit, its technical architecture, documentation portal (/docs), and its full catalogue of 100 browser-local PDF processing utilities.

---

## Technical Overview & Architecture

- **Project Name**: ${siteConfig.name} (${siteConfig.shortName})
- **Website URL**: ${siteConfig.url}
- **Documentation Portal**: ${siteConfig.url}/docs
- **GitHub Repository**: ${siteConfig.githubUrl}
- **License**: ${siteConfig.license} License (${siteConfig.licenseUrl})
- **Rendering & Framework**: Next.js (App Router), React, TypeScript, Tailwind CSS v4
- **Execution Model**: 100% Client-Side Web Browsing Environment. Zero backend server storage.
- **Core Libraries**: WebAssembly, pdf-lib, PDF.js (pdfjs-dist), Canvas API, Web Workers.

---

## Complete Documentation Index (/docs)

- **Documentation Portal Hub**: ${siteConfig.url}/docs
- **Getting Started Guide**: ${siteConfig.url}/docs/getting-started
- **100 Tools Documentation Directory**: ${siteConfig.url}/docs/tools
- **How It Works (Local Engine & WASM)**: ${siteConfig.url}/docs/how-it-works
- **Privacy Model & Guarantee**: ${siteConfig.url}/docs/privacy
- **Technical Architecture Reference**: ${siteConfig.url}/docs/architecture
- **Development Setup Guide**: ${siteConfig.url}/docs/development
- **Contributing Guide**: ${siteConfig.url}/docs/contributing
- **Security Policy & Vulnerability Reporting**: ${siteConfig.url}/docs/security
- **Frequently Asked Questions (FAQ)**: ${siteConfig.url}/docs/faq
- **Changelog & Release Notes**: ${siteConfig.url}/docs/changelog

### Category Documentation Pages
${docCategoryEntries}

---

## Security & Privacy Model

1. **Local File Memory Processing**: PDF files uploaded by the user are loaded exclusively into local browser RAM.
2. **Zero Network Transmission**: Documents are processed via client-side JavaScript / WASM routines. No file bytes are sent to remote APIs or servers.
3. **No Account Requirement**: All tools operate frictionlessly without sign-in, cookies tracking, or usage limits.
4. **Security Policy**: ${siteConfig.url}/docs/security
5. **Security Contact Endpoint**: ${siteConfig.url}/.well-known/security.txt

---

## 100 PDF Tools Catalogue & Documentation

Total Registered Tools: ${tools.length}

${toolEntries}

---

## Project Links & Discovery

- **Homepage**: ${siteConfig.url}/
- **Documentation Hub**: ${siteConfig.url}/docs
- **Tool Directory**: ${siteConfig.url}/tools
- **Open Source Page**: ${siteConfig.url}/open-source
- **GitHub Repository**: ${siteConfig.githubUrl}
- **Report Bug / Request Feature**: ${siteConfig.issuesUrl}
- **Sitemap**: ${siteConfig.url}/sitemap.xml
- **Robots Directives**: ${siteConfig.url}/robots.txt
- **LLM Summary (llms.txt)**: ${siteConfig.url}/llms.txt
- **LLM Full Catalogue (llms-full.txt)**: ${siteConfig.url}/llms-full.txt
`;

  return new Response(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  });
}
