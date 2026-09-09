import { notFound } from "next/navigation";
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

  return {
    title: toolConfig.seoTitle,
    description: toolConfig.seoDescription,
    keywords: toolConfig.keywords?.join(", "),
    alternates: {
      canonical: `${siteConfig.url}${toolConfig.href}`,
    },
    openGraph: {
      title: toolConfig.seoTitle,
      description: toolConfig.seoDescription,
      url: `${siteConfig.url}${toolConfig.href}`,
      siteName: siteConfig.name,
      images: [
        {
          url: siteConfig.ogImage,
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
      images: [siteConfig.ogImage],
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

  const jsonLdApp = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": toolConfig.name,
    "description": toolConfig.seoDescription,
    "url": `${siteConfig.url}${toolConfig.href}`,
    "applicationCategory": "Utility",
    "operatingSystem": "All",
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
        "item": `${siteConfig.url}${toolConfig.href}`
      }
    ]
  };

  const DedicatedComponent = DedicatedToolComponents[toolConfig.id];

  return (
    <div className="flex flex-col max-w-5xl mx-auto w-full space-y-6">
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
          <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-1.5 py-0.2 rounded">
            Client-Side Engine
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
    </div>
  );
}
