import { siteConfig } from "@/config/site";

export async function GET() {
  const content = `# KissThePDF

Free, open-source, privacy-first PDF toolkit running 100% locally in your browser via WebAssembly and client-side JavaScript. No server file uploads, no accounts required, no file size caps.

## About
- **Name**: ${siteConfig.name} (${siteConfig.shortName})
- **Tagline**: ${siteConfig.tagline}
- **Description**: ${siteConfig.description}
- **Architecture**: 100% Client-side browser execution (PDF.js, pdf-lib, WebAssembly)
- **License**: ${siteConfig.license} Open Source License

## Product
KissThePDF provides 100 free online PDF tools categorized across 8 primary domain groups: Organization, Pages, Convert, Edit, Security, Forms, Enhancement, and Reading. All PDF manipulation tasks execute inside the user's local web browser environment.

## Tools
- **Tool Directory**: ${siteConfig.url}/tools
- **Featured Tools**:
  - Merge PDF: ${siteConfig.url}/merge-pdf
  - Split PDF: ${siteConfig.url}/split-pdf
  - Compress PDF: ${siteConfig.url}/compress-pdf
  - Rotate PDF: ${siteConfig.url}/rotate-pdf
  - Delete PDF Pages: ${siteConfig.url}/delete-pdf-pages
  - Extract PDF Pages: ${siteConfig.url}/extract-pdf-pages
  - PDF to JPG: ${siteConfig.url}/pdf-to-jpg
  - PDF to PNG: ${siteConfig.url}/pdf-to-png
  - PDF to WebP: ${siteConfig.url}/pdf-to-webp

## Open Source
- **Repository**: ${siteConfig.githubUrl}
- **Open Source Page**: ${siteConfig.url}/open-source

## Documentation
- **Full Machine-Readable Index**: ${siteConfig.url}/llms-full.txt
- **Repository README**: ${siteConfig.githubUrl}#readme

## Architecture
- **Framework**: Next.js (App Router), TypeScript, Tailwind CSS v4
- **Engine**: Client-Side WASM & JavaScript PDF Engines (pdf-lib, pdfjs-dist)
- **Data Model**: Zero server state, memory-only local file buffer processing

## Contributing
- **Issues & Requests**: ${siteConfig.issuesUrl}
- **Contribution Guide**: ${siteConfig.contributingUrl}

## Security
- **Security Policy**: ${siteConfig.securityUrl}
- **Well-Known Security Info**: ${siteConfig.url}/.well-known/security.txt

## Privacy
- 100% Privacy Preserved: Files are never uploaded to any remote server or cloud service.
- Local Storage: Processing runs entirely within the isolated browser tab context.

## License
- **MIT License**: ${siteConfig.licenseUrl}

## Important Pages
- Homepage: ${siteConfig.url}/
- Tool Directory: ${siteConfig.url}/tools
- Open Source Page: ${siteConfig.url}/open-source
`;

  return new Response(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  });
}
