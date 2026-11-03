import { notFound } from "next/navigation";
import { tools } from "@/config/tools";
import { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { ToolRenderer } from "@/features/tools/ToolRenderer";
import { getToolVariant, toolVariants, type ToolVariant } from "@/config/tool-variants";
import { getGuideForTool } from "@/content/guides";
import { GuideText, guidePlainText } from "@/components/guides/guide-text";
import type { ToolDefinition } from "@/types";
import Link from "next/link";
import { BookOpen } from "lucide-react";

interface Props {
  params: Promise<{
    tool: string;
  }>;
}

/**
 * A route is either a tool (/merge-pdf) or a preset variant of one
 * (/compress-pdf-to-100kb), which renders the base tool with preset props.
 */
function resolve(slug: string):
  | { toolConfig: ToolDefinition; baseId: string; variant?: ToolVariant }
  | undefined {
  const tool = tools.find((t) => t.id === slug);
  if (tool) return { toolConfig: tool, baseId: tool.id };
  const variant = getToolVariant(slug);
  const base = variant && tools.find((t) => t.id === variant.baseToolId);
  if (!variant || !base) return undefined;
  return {
    toolConfig: { ...base, ...variant.definition, id: variant.slug, href: `/${variant.slug}`, seoH2s: undefined },
    baseId: base.id,
    variant,
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const toolConfig = resolve(resolvedParams.tool)?.toolConfig;
  if (!toolConfig) {
    return {
      title: `Tool Not Found | ${siteConfig.name}`,
    };
  }

  const canonicalUrl = `${siteConfig.url}${toolConfig.href}`;

  return {
    title: toolConfig.seoTitle,
    description: toolConfig.seoDescription,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${toolConfig.seoTitle} | ${siteConfig.name}`,
      description: toolConfig.seoDescription,
      url: canonicalUrl,
      siteName: siteConfig.name,
      images: [
        {
          url: siteConfig.ogImage.startsWith("http") ? siteConfig.ogImage : `${siteConfig.url}${siteConfig.ogImage}`,
          width: 1200,
          height: 630,
          alt: `${toolConfig.seoTitle} | ${siteConfig.name}`,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${toolConfig.seoTitle} | ${siteConfig.name}`,
      description: toolConfig.seoDescription,
      images: [siteConfig.ogImage.startsWith("http") ? siteConfig.ogImage : `${siteConfig.url}${siteConfig.ogImage}`],
    },
  };
}

export function generateStaticParams() {
  return [...tools.map((tool) => ({ tool: tool.id })), ...toolVariants.map((v) => ({ tool: v.slug }))];
}

export default async function ToolPage({ params }: Props) {
  const resolvedParams = await params;
  const resolved = resolve(resolvedParams.tool);

  if (!resolved) {
    notFound();
  }
  const { toolConfig, baseId, variant } = resolved;
  const guide = getGuideForTool(baseId);
  const siblingVariants = variant ? toolVariants.filter((v) => v.baseToolId === variant.baseToolId) : [];

  const canonicalUrl = `${siteConfig.url}${toolConfig.href}`;

  const jsonLdApp = {
    "@context": "https://schema.org",
    "@type": ["SoftwareApplication", "WebApplication"],
    "name": `${toolConfig.name} - ${siteConfig.name}`,
    "description": toolConfig.seoDescription,
    "url": canonicalUrl,
    "applicationCategory": "UtilityApplication",
    "operatingSystem": "All (Modern Web Browsers)",
    "browserRequirements": "Requires JavaScript and WebAssembly enabled.",
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
        "text": guidePlainText(faq.answer)
      }
    }))
  } : null;

  return (
    <div className="flex flex-col max-w-5xl mx-auto w-full space-y-4">
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

      {/* Compact title (kept as the single H1 for SEO), editor directly below */}
      <h1 className="text-lg sm:text-xl font-semibold text-slate-900 tracking-tight">
        {toolConfig.seoH1 || toolConfig.name}
      </h1>

      {/* Tool Canvas Container */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 sm:p-8 shadow-2xs">
        <ToolRenderer toolId={baseId} toolProps={variant?.toolProps} />
      </div>

      {guide && (
        <Link
          href={`/guides/${guide.slug}`}
          className="flex items-center gap-2 self-start text-sm font-medium text-blue-700 hover:text-blue-900 hover:underline"
        >
          <BookOpen size={15} />
          Step-by-step guide: {guide.title}
        </Link>
      )}

      {siblingVariants.length > 0 && (
        <nav aria-label="Other target sizes" className="flex flex-wrap items-center gap-2 text-sm">
          <span className="text-slate-500">Other sizes:</span>
          {siblingVariants.map((v) =>
            v.slug === variant?.slug ? (
              <span key={v.slug} className="rounded-full bg-slate-900 px-3 py-1 font-medium text-white">{v.label}</span>
            ) : (
              <Link key={v.slug} href={`/${v.slug}`} className="rounded-full bg-slate-100 px-3 py-1 font-medium hover:bg-slate-200">
                {v.label}
              </Link>
            )
          )}
          <Link href={`/${baseId}`} className="rounded-full bg-slate-100 px-3 py-1 font-medium hover:bg-slate-200">
            Any size
          </Link>
        </nav>
      )}

      {/* Server-Rendered Static SEO Content Sections */}
      <article className="space-y-8 mt-6 pt-8 border-t border-slate-200 text-slate-800">
        
        {/* About Section (intro copy lives below the editor) */}
        {toolConfig.introParagraph && (
          <section className="space-y-3">
            <h2 className="text-xl font-bold">About {toolConfig.name}</h2>
            <p className="text-sm leading-relaxed text-slate-600">{toolConfig.introParagraph}</p>
          </section>
        )}

        {/* How-To Section */}
        {toolConfig.howTo && (
          <section className="space-y-4">
            <h2 className="text-xl font-bold">{toolConfig.seoH2s?.[0] || toolConfig.howTo.name}</h2>
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
            <h2 className="text-xl font-bold">{toolConfig.seoH2s?.[1] || `Frequently Asked Questions about ${toolConfig.name}`}</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {toolConfig.faqs.map((faq, i) => (
                <div key={i} className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                  <h3 className="font-semibold mb-2">{faq.question}</h3>
                  <p className="text-sm text-slate-600"><GuideText text={faq.answer} /></p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Internal Links Section */}
        {toolConfig.relatedTools && toolConfig.relatedTools.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-xl font-bold">{toolConfig.seoH2s?.[2] || "Related Tools"}</h2>
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
            href={`/docs/tools/${baseId}`}
            className="font-semibold text-orange-600 hover:underline flex items-center gap-1"
          >
            <span>View {toolConfig.name} Specs in Docs →</span>
          </a>
        </div>
      </article>
    </div>
  );
}
