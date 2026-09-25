import { notFound } from "next/navigation";
import { tools } from "@/config/tools";
import { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { ShieldCheck } from "lucide-react";
import { PdfToJpgTool } from "@/features/pdf/components/PdfToJpgTool";
import { JpgToPdfTool } from "@/features/pdf/components/JpgToPdfTool";
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

  const jsonLdHowTo = toolConfig.howTo ? {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": toolConfig.howTo.name,
    "description": toolConfig.howTo.description,
    "step": toolConfig.howTo.steps.map((s, i) => ({
      "@type": "HowToStep",
      "position": i + 1,
      "name": s.name,
      "text": s.text,
    }))
  } : null;

  const jsonLdFaq = toolConfig.faqs && toolConfig.faqs.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": toolConfig.faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  } : null;

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
      {jsonLdHowTo && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdHowTo) }}
        />
      )}
      {jsonLdFaq && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }}
        />
      )}

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
          {toolConfig.seoH1 || toolConfig.name}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-2xl">
          {toolConfig.description}
        </p>
      </div>

      {/* Intro Paragraph */}
      {toolConfig.introParagraph && (
        <div className="prose prose-sm prose-slate max-w-none">
          <p>{toolConfig.introParagraph}</p>
        </div>
      )}

      {/* Tool Canvas Container */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 sm:p-8 shadow-2xs">
        {toolConfig.id === "pdf-to-jpg" ? (
          <PdfToJpgTool />
        ) : toolConfig.id === "jpg-to-pdf" ? (
          <JpgToPdfTool />
        ) : (
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-md space-y-4 text-center">
            <p className="text-sm font-medium text-slate-700">This feature needs to be developed.</p>
          </div>
        )}
      </div>

      {/* Server-Rendered Static SEO Content Sections */}
      <article className="space-y-8 pt-4 border-t border-slate-200 text-slate-800">
        
        {/* How-To Section */}
        {toolConfig.howTo && (
          <section className="space-y-4">
            <h2 className="text-xl font-bold">{toolConfig.howTo.name}</h2>
            <div className="space-y-3">
              {toolConfig.howTo.steps.map((step, i) => (
                <div key={i} className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                    {i + 1}
                  </div>
                  <div>
                    <h3 className="font-semibold">{step.name}</h3>
                    <p className="text-sm text-slate-600">{step.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* FAQs Section */}
        {toolConfig.faqs && toolConfig.faqs.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-xl font-bold">{toolConfig.seoH2s?.[0] || `Frequently Asked Questions about ${toolConfig.name}`}</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {toolConfig.faqs.map((faq, i) => (
                <div key={i} className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                  <h3 className="font-semibold mb-2">{faq.question}</h3>
                  <p className="text-sm text-slate-600">{faq.answer}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Internal Links Section */}
        {toolConfig.relatedTools && toolConfig.relatedTools.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-xl font-bold">{toolConfig.seoH2s?.[1] || "Related Tools"}</h2>
            <div className="flex flex-wrap gap-2">
              {toolConfig.relatedTools.map(relatedId => {
                const related = tools.find(t => t.id === relatedId);
                if (!related) return null;
                return (
                  <a
                    key={related.id}
                    href={related.href}
                    className="inline-flex items-center px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-sm font-medium transition-colors"
                  >
                    {related.name}
                  </a>
                );
              })}
            </div>
          </section>
        )}

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
