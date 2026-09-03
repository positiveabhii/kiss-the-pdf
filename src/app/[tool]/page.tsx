import { notFound } from "next/navigation";
import { tools } from "@/config/tools";
import { Metadata } from "next";

import { MergePdfTool } from "@/features/pdf/components/MergePdfTool";
import { SplitPdfTool } from "@/features/pdf/components/SplitPdfTool";
import { RotatePdfTool } from "@/features/pdf/components/RotatePdfTool";
import { DeletePdfPagesTool } from "@/features/pdf/components/DeletePdfPagesTool";
import { ExtractPdfPagesTool } from "@/features/pdf/components/ExtractPdfPagesTool";

interface Props {
  params: Promise<{
    tool: string;
  }>;
}

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://kissthepdf.space";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const toolConfig = tools.find((t) => t.id === resolvedParams.tool);
  if (!toolConfig) {
    return {
      title: "Tool Not Found | Kiss the PDF",
    };
  }

  return {
    title: toolConfig.seoTitle,
    description: toolConfig.seoDescription,
    keywords: toolConfig.keywords?.join(", "),
    alternates: {
      canonical: `${BASE_URL}${toolConfig.href}`,
    },
    openGraph: {
      title: toolConfig.seoTitle,
      description: toolConfig.seoDescription,
      url: `${BASE_URL}${toolConfig.href}`,
      siteName: "Kiss the PDF",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: toolConfig.seoTitle,
      description: toolConfig.seoDescription,
    },
  };
}

export function generateStaticParams() {
  return tools.map((tool) => ({
    tool: tool.id,
  }));
}

const ToolComponents: Record<string, React.FC> = {
  "merge-pdf": MergePdfTool,
  "split-pdf": SplitPdfTool,
  "rotate-pdf": RotatePdfTool,
  "delete-pdf-pages": DeletePdfPagesTool,
  "extract-pdf-pages": ExtractPdfPagesTool,
};

export default async function ToolPage({ params }: Props) {
  const resolvedParams = await params;
  const toolConfig = tools.find((t) => t.id === resolvedParams.tool);

  if (!toolConfig) {
    notFound();
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": toolConfig.name,
    "description": toolConfig.seoDescription,
    "url": `${BASE_URL}${toolConfig.href}`,
    "applicationCategory": "Utility",
    "operatingSystem": "All",
    "browserRequirements": "Requires JavaScript. WebAssembly supported browser for optimal performance.",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    }
  };

  const ActiveToolComponent = ToolComponents[toolConfig.id];

  return (
    <div className="flex flex-col max-w-4xl mx-auto py-12 px-4 sm:px-6">
      {/* Inject Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="mb-10 text-center">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
          {toolConfig.name}
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          {toolConfig.description}
        </p>
      </div>

      {toolConfig.status === "planned" || !ActiveToolComponent ? (
        <div className="flex flex-col items-center justify-center p-12 sm:p-20 border border-slate-200 rounded-2xl bg-white shadow-sm text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-6">
            <span className="text-2xl">⏳</span>
          </div>
          <h2 className="text-xl font-semibold text-slate-900 mb-2">Coming Soon</h2>
          <p className="text-slate-500 max-w-md">
            We are currently building the local, privacy-first processing engine for this tool.
            Check back soon or contribute on GitHub!
          </p>
        </div>
      ) : (
        <ActiveToolComponent />
      )}
    </div>
  );
}
