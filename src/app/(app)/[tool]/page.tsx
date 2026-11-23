import { notFound } from "next/navigation";
import { tools } from "@/config/tools";
import { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { ToolRenderer } from "@/features/tools/ToolRenderer";
import { getToolVariant, toolVariants, type ToolVariant } from "@/config/tool-variants";
import { getGuideForTool } from "@/content/guides";
import type { ToolDefinition } from "@/types";
import Link from "next/link";
import { BookOpen } from "lucide-react";
import { GuideText, guidePlainText } from "@/components/guides/guide-text";
import { ToolInfoDrawer } from "@/components/tools/tool-info-drawer";

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

  // Indexable copy. The editor is client-only, so without this the HTML is just
  // the H1. It lives in a drawer so the editor page itself never scrolls.
  const aboutText = toolConfig.introParagraph ?? guide?.summary ?? toolConfig.seoDescription;
  const faqs = toolConfig.faqs?.length ? toolConfig.faqs : (guide?.faqs ?? []);
  const relatedTools = (
    toolConfig.relatedTools?.length
      ? toolConfig.relatedTools.map((id) => tools.find((t) => t.id === id))
      : tools.filter((t) => t.category === toolConfig.category && t.id !== baseId).slice(0, 8)
  ).filter((t): t is ToolDefinition => t !== undefined);

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

  const jsonLdFaq = faqs.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map((faq) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": { "@type": "Answer", "text": guidePlainText(faq.answer) },
    })),
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
      {jsonLdFaq && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }} />
      )}
      {/* Compact title (kept as the single H1 for SEO), editor directly below */}
      <div className="space-y-0.5">
        <h1 className="text-lg sm:text-xl font-semibold text-slate-900 tracking-tight">
          {toolConfig.seoH1 || toolConfig.name}
        </h1>
        <p className="text-sm text-slate-500">{toolConfig.description}</p>
      </div>

      {/* Tool Canvas Container */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 sm:p-8 shadow-2xs">
        <ToolRenderer toolId={baseId} toolProps={variant?.toolProps} />
      </div>

      <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
        {guide && (
          <Link
            href={`/guides/${guide.slug}`}
            className="flex items-center gap-2 text-sm font-medium text-blue-700 hover:text-blue-900 hover:underline"
          >
            <BookOpen size={15} />
            Step-by-step guide: {guide.title}
          </Link>
        )}
        <ToolInfoDrawer title={`About ${toolConfig.name}`}>
          <article className="space-y-8 text-slate-800">
            <section className="space-y-2">
              <h2 className="text-lg font-bold">About {toolConfig.name}</h2>
              <p className="text-sm leading-relaxed text-slate-600"><GuideText text={aboutText} /></p>
            </section>

            {toolConfig.howTo && (
              <section className="space-y-3">
                <h2 className="text-lg font-bold">{toolConfig.seoH2s?.[0] || toolConfig.howTo.name}</h2>
                <ol className="space-y-3">
                  {toolConfig.howTo.steps.map((step, i) => (
                    <li key={i} className="flex gap-3">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">{i + 1}</span>
                      <div>
                        <h3 className="text-sm font-semibold">{step.name}</h3>
                        <p className="text-sm text-slate-600">{step.text}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </section>
            )}

            {faqs.length > 0 && (
              <section className="space-y-3">
                <h2 className="text-lg font-bold">{toolConfig.seoH2s?.[1] || "Frequently asked questions"}</h2>
                <div className="divide-y divide-slate-100">
                  {faqs.map((faq) => (
                    <div key={faq.question} className="py-3">
                      <h3 className="text-sm font-semibold">{faq.question}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-slate-600"><GuideText text={faq.answer} /></p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {relatedTools.length > 0 && (
              <section className="space-y-3">
                <h2 className="text-lg font-bold">{toolConfig.seoH2s?.[2] || "Related tools"}</h2>
                <div className="flex flex-wrap gap-2">
                  {relatedTools.map((t) => (
                    <Link key={t.id} href={t.href} className="rounded-full bg-slate-100 px-3 py-1.5 text-sm font-medium hover:bg-slate-200">
                      {t.name}
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </article>
        </ToolInfoDrawer>
      </div>
    </div>
  );
}
