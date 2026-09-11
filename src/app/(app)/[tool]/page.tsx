import { notFound } from "next/navigation";
import { tools } from "@/config/tools";
import { Metadata } from "next";
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
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-md space-y-4 text-center">
          <p className="text-sm font-medium text-slate-700">This feature needs to be developed.</p>
        </div>
      </div>

      {/* Server-Rendered Static SEO Content Sections */}
      <article className="space-y-8 pt-4 border-t border-slate-200 text-slate-800">
        {/* Section 5: Link to Technical Docs */}
        <div className="pt-2 mt-auto text-xs text-slate-500 flex items-center justify-between border-t border-slate-100">
          <span>Need technical specifications or developer guides for this tool?</span>
          <a
            href={`/docs/tools/${toolConfig.id}`}
            className="font-semibold text-orange-600 hover:underline flex items-center gap-1"
          >
            <span>View {toolConfig.name} Specs in Docs →</span>
          </a>
        </div>
      </article>
    </div>
  );
}
