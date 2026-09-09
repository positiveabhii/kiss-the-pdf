import { notFound } from "next/navigation";
import Link from "next/link";
import { tools } from "@/config/tools";
import { Metadata } from "next";

import { MergePdfTool } from "@/features/pdf/components/MergePdfTool";
import { SplitPdfTool } from "@/features/pdf/components/SplitPdfTool";
import { RotatePdfTool } from "@/features/pdf/components/RotatePdfTool";
import { DeletePdfPagesTool } from "@/features/pdf/components/DeletePdfPagesTool";
import { ExtractPdfPagesTool } from "@/features/pdf/components/ExtractPdfPagesTool";
import { CompressPdfTool } from "@/features/pdf/components/CompressPdfTool";
import { PdfToJpgTool } from "@/features/pdf/components/PdfToJpgTool";
import { PdfToPngTool } from "@/features/pdf/components/PdfToPngTool";
import { PdfToWebpTool } from "@/features/pdf/components/PdfToWebpTool";

import { PageOperationsTool } from "@/features/pdf/components/PageOperationsTool";
import { ImageConversionTool } from "@/features/pdf/components/ImageConversionTool";
import { PdfViewerTool } from "@/features/pdf/components/PdfViewerTool";
import { PdfEditorTool } from "@/features/pdf/components/PdfEditorTool";
import { PdfSecurityTool } from "@/features/pdf/components/PdfSecurityTool";
import { PdfFormTool } from "@/features/pdf/components/PdfFormTool";
import { PdfEnhanceTool } from "@/features/pdf/components/PdfEnhanceTool";

import { siteConfig } from "@/config/site";
import { ShieldCheck, ArrowRight, BookOpen, Layers } from "lucide-react";

interface Props {
  params: Promise<{
    tool: string;
  }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const toolConfig = tools.find((t) => t.id === resolvedParams.tool);
  if (!toolConfig) {
    return {
      title: `Tool Not Found | ${siteConfig.name}`,
    };
  }

  const canonicalUrl = `${siteConfig.url}${toolConfig.href}`;

  return {
    title: toolConfig.seoTitle,
    description: toolConfig.seoDescription,
    keywords: toolConfig.keywords?.join(", "),
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: toolConfig.seoTitle,
      description: toolConfig.seoDescription,
      url: canonicalUrl,
      siteName: siteConfig.name,
      images: [
        {
          url: siteConfig.ogImage.startsWith("http") ? siteConfig.ogImage : `${siteConfig.url}${siteConfig.ogImage}`,
          width: 1200,
          height: 630,
          alt: toolConfig.seoTitle,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: toolConfig.seoTitle,
      description: toolConfig.seoDescription,
      images: [siteConfig.ogImage.startsWith("http") ? siteConfig.ogImage : `${siteConfig.url}${siteConfig.ogImage}`],
    },
  };
}

export function generateStaticParams() {
  return tools.map((tool) => ({
    tool: tool.id,
  }));
}

const DedicatedToolComponents: Record<string, React.FC> = {
  "merge-pdf": MergePdfTool,
  "split-pdf": SplitPdfTool,
  "rotate-pdf": RotatePdfTool,
  "delete-pdf-pages": DeletePdfPagesTool,
  "extract-pdf-pages": ExtractPdfPagesTool,
  "compress-pdf": CompressPdfTool,
  "pdf-to-jpg": PdfToJpgTool,
  "pdf-to-png": PdfToPngTool,
  "pdf-to-webp": PdfToWebpTool,
};

export default async function ToolPage({ params }: Props) {
  const resolvedParams = await params;
  const toolConfig = tools.find((t) => t.id === resolvedParams.tool);

  if (!toolConfig) {
    notFound();
  }

  const canonicalUrl = `${siteConfig.url}${toolConfig.href}`;

  const jsonLdApp = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": toolConfig.name,
    "description": toolConfig.seoDescription,
    "url": canonicalUrl,
    "applicationCategory": "UtilityApplication",
    "operatingSystem": "All (Browser-Based)",
    "browserRequirements": "Requires JavaScript. WebAssembly & Client-Side PDF engine enabled.",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    }
  };

  const jsonLdBreadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": siteConfig.url
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Tools",
        "item": `${siteConfig.url}/tools`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": toolConfig.name,
        "item": canonicalUrl
      }
    ]
  };

  const DedicatedComponent = DedicatedToolComponents[toolConfig.id];

  // Find related tools in the same category
  const relatedTools = tools
    .filter((t) => t.category === toolConfig.category && t.id !== toolConfig.id)
    .slice(0, 4);

  return (
    <div className="flex flex-col max-w-5xl mx-auto w-full space-y-8">
      {/* Inject Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdApp) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumbs) }}
      />

      {/* Application Tool Title Header */}
      <div className="space-y-1 pb-2 border-b border-slate-200/60">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            {toolConfig.category}
          </span>
          <span className="text-slate-300">•</span>
          <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-1.5 py-0.2 rounded flex items-center gap-1">
            <ShieldCheck size={11} /> 100% Client-Side Engine
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          {toolConfig.name}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-2xl">
          {toolConfig.description}
        </p>
      </div>

      {/* Tool Canvas Container */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 sm:p-8 shadow-2xs">
        {DedicatedComponent ? (
          <DedicatedComponent />
        ) : toolConfig.category === "Organization" || toolConfig.category === "Pages" ? (
          <PageOperationsTool toolId={toolConfig.id} toolName={toolConfig.name} />
        ) : toolConfig.category === "Convert" ? (
          <ImageConversionTool toolId={toolConfig.id} toolName={toolConfig.name} />
        ) : toolConfig.category === "Edit" ? (
          <PdfEditorTool toolId={toolConfig.id} toolName={toolConfig.name} />
        ) : toolConfig.category === "Security" ? (
          <PdfSecurityTool toolId={toolConfig.id} toolName={toolConfig.name} />
        ) : toolConfig.category === "Forms" ? (
          <PdfFormTool toolId={toolConfig.id} toolName={toolConfig.name} />
        ) : toolConfig.category === "Enhancement" ? (
          <PdfEnhanceTool toolId={toolConfig.id} toolName={toolConfig.name} />
        ) : toolConfig.category === "Reading" ? (
          <PdfViewerTool toolId={toolConfig.id} toolName={toolConfig.name} />
        ) : (
          <PageOperationsTool toolId={toolConfig.id} toolName={toolConfig.name} />
        )}
      </div>

      {/* Server-Rendered Static SEO Content Sections */}
      <article className="space-y-8 pt-4 border-t border-slate-200 text-slate-800">
        {/* Section 1: What is this tool? */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            What is {toolConfig.name}?
          </h2>
          <p className="text-sm text-slate-700 leading-relaxed">
            KissThePDF&apos;s <strong>{toolConfig.name}</strong> allows you to {toolConfig.description.toLowerCase()} directly inside your web browser. Unlike conventional online PDF services that upload your confidential documents to external cloud servers, KissThePDF executes all processing in local browser RAM using client-side JavaScript and WebAssembly (WASM). Your files never leave your computer.
          </p>
        </section>

        {/* Section 2: How to use */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            How to Use {toolConfig.name}
          </h2>
          <ol className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <li className="p-3.5 rounded-lg border border-slate-200 bg-white space-y-1">
              <span className="w-5 h-5 rounded-full bg-orange-500 text-white font-bold text-[10px] flex items-center justify-center mb-1">1</span>
              <span className="font-bold text-slate-900 block">Select Files</span>
              <span className="text-slate-600 block">Drag & drop your PDF file or click to browse. Files load instantly into browser memory.</span>
            </li>
            <li className="p-3.5 rounded-lg border border-slate-200 bg-white space-y-1">
              <span className="w-5 h-5 rounded-full bg-orange-500 text-white font-bold text-[10px] flex items-center justify-center mb-1">2</span>
              <span className="font-bold text-slate-900 block">Configure Settings</span>
              <span className="text-slate-600 block">Adjust settings tailored for {toolConfig.name.toLowerCase()} using visual preview controls.</span>
            </li>
            <li className="p-3.5 rounded-lg border border-slate-200 bg-white space-y-1">
              <span className="w-5 h-5 rounded-full bg-orange-500 text-white font-bold text-[10px] flex items-center justify-center mb-1">3</span>
              <span className="font-bold text-slate-900 block">Instant Download</span>
              <span className="text-slate-600 block">Click process to generate your modified file locally and download it to your device.</span>
            </li>
          </ol>
        </section>

        {/* Section 3: Privacy & Security Features */}
        <section className="p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 space-y-2">
          <div className="flex items-center gap-1.5 font-bold text-emerald-900 text-sm">
            <ShieldCheck size={16} className="text-emerald-700" />
            <span>100% Privacy & Zero-Upload Guarantee</span>
          </div>
          <p className="leading-relaxed">
            Your document privacy is protected by design. Processing runs completely within your isolated browser tab context. No server uploads, no data retention, no user registration, and no tracking cookies.
          </p>
        </section>

        {/* Section 4: Related Tools */}
        {relatedTools.length > 0 && (
          <section className="space-y-3 pt-2">
            <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Layers size={16} className="text-blue-500" />
              <span>Related {toolConfig.category} Tools</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {relatedTools.map((rel) => (
                <Link
                  key={rel.id}
                  href={rel.href}
                  className="p-3.5 rounded-lg border border-slate-200 bg-white hover:border-orange-300 hover:shadow-2xs transition-all space-y-1 group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 group-hover:text-orange-600 transition-colors">
                      {rel.name}
                    </span>
                    <ArrowRight size={13} className="text-slate-400 group-hover:text-orange-500 group-hover:translate-x-0.5 transition-all" />
                  </div>
                  <p className="text-[11px] text-slate-500 line-clamp-1">{rel.description}</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Section 5: Link to Technical Docs */}
        <div className="pt-2 text-xs text-slate-500 flex items-center justify-between border-t border-slate-100">
          <span>Need technical specifications or developer guides for this tool?</span>
          <Link
            href={`/docs/tools/${toolConfig.id}`}
            className="font-semibold text-orange-600 hover:underline flex items-center gap-1"
          >
            <BookOpen size={13} />
            <span>View {toolConfig.name} Specs in Docs →</span>
          </Link>
        </div>
      </article>
    </div>
  );
}
