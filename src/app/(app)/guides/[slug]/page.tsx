import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, BookOpen, Clock, ShieldCheck } from "lucide-react";

import { siteConfig } from "@/config/site";
import { tools } from "@/config/tools";
import { getGuide, guides, readingMinutes, type GuideBlock } from "@/content/guides";
import { GuideText, guidePlainText } from "@/components/guides/guide-text";

interface Props {
  params: Promise<{ slug: string }>;
}

const anchor = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const formatDate = (iso: string) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric", timeZone: "UTC" });

export function generateStaticParams() {
  return guides.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) return { title: "Guide Not Found" };
  const url = `${siteConfig.url}/guides/${guide.slug}`;
  const image = siteConfig.ogImage.startsWith("http") ? siteConfig.ogImage : `${siteConfig.url}${siteConfig.ogImage}`;
  return {
    title: guide.seoTitle,
    description: guide.description,
    alternates: { canonical: url },
    openGraph: {
      title: guide.title,
      description: guide.description,
      url,
      siteName: siteConfig.name,
      type: "article",
      publishedTime: guide.published,
      modifiedTime: guide.updated ?? guide.published,
      images: [{ url: image, width: 1200, height: 630, alt: guide.title }],
    },
    twitter: { card: "summary_large_image", title: guide.title, description: guide.description, images: [image] },
  };
}

function Block({ block }: { block: GuideBlock }) {
  switch (block.type) {
    case "p":
      return (
        <p className="leading-relaxed text-slate-700">
          <GuideText text={block.text} />
        </p>
      );
    case "list":
      return (
        <ul className="list-disc space-y-2 pl-5 leading-relaxed text-slate-700 marker:text-slate-400">
          {block.items.map((item, i) => (
            <li key={i}>
              <GuideText text={item} />
            </li>
          ))}
        </ul>
      );
    case "tip":
      return (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-relaxed text-amber-900">
          <GuideText text={block.text} />
        </div>
      );
    case "steps":
      return (
        <ol className="space-y-4">
          {block.items.map((step, i) => (
            <li key={i} className="flex gap-4">
              <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-700">
                {i + 1}
              </span>
              <div className="space-y-1 pt-1">
                <h3 className="font-semibold text-slate-900">{step.title}</h3>
                <p className="leading-relaxed text-slate-700">
                  <GuideText text={step.text} />
                </p>
              </div>
            </li>
          ))}
        </ol>
      );
  }
}

export default async function GuidePage({ params }: Props) {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) notFound();

  const tool = tools.find((t) => t.id === guide.toolId);
  const url = `${siteConfig.url}/guides/${guide.slug}`;
  const minutes = readingMinutes(guide);
  const related = guide.relatedGuides.map(getGuide).filter((g) => g !== undefined);
  const sameCategoryTools = tool
    ? tools.filter((t) => t.category === tool.category && t.id !== tool.id && t.id !== "bookmarks").slice(0, 8)
    : [];

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: guide.title,
      description: guide.description,
      datePublished: guide.published,
      dateModified: guide.updated ?? guide.published,
      mainEntityOfPage: url,
      image: `${siteConfig.url}${siteConfig.ogImage}`,
      author: { "@type": "Person", name: siteConfig.author.name, url: siteConfig.author.url },
      publisher: {
        "@type": "Organization",
        name: siteConfig.name,
        logo: { "@type": "ImageObject", url: `${siteConfig.url}${siteConfig.logo}` },
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.url },
        { "@type": "ListItem", position: 2, name: "Guides", item: `${siteConfig.url}/guides` },
        { "@type": "ListItem", position: 3, name: guide.title, item: url },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: guide.faqs.map((f) => ({
        "@type": "Question",
        name: f.question,
        acceptedAnswer: { "@type": "Answer", text: guidePlainText(f.answer) },
      })),
    },
  ];

  const toolCta = tool && (
    <Link
      href={tool.href}
      className="group flex items-center justify-between gap-4 rounded-lg border border-slate-900 bg-slate-900 px-5 py-4 text-white transition-colors hover:bg-slate-800"
    >
      <span className="space-y-0.5">
        <span className="block font-semibold">Open the {tool.name} tool</span>
        <span className="flex items-center gap-1.5 text-xs text-slate-300">
          <ShieldCheck size={12} /> Free · No upload · No sign-up
        </span>
      </span>
      <ArrowRight size={18} className="flex-shrink-0 transition-transform group-hover:translate-x-0.5" />
    </Link>
  );

  return (
    <div className="mx-auto w-full max-w-3xl space-y-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <header className="space-y-4">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-slate-500">
          <Link href="/" className="hover:text-slate-900">Home</Link>
          <span>/</span>
          <Link href="/guides" className="hover:text-slate-900">Guides</Link>
          {tool && (
            <>
              <span>/</span>
              <span>{tool.category}</span>
            </>
          )}
        </nav>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">{guide.title}</h1>
        <p className="flex items-center gap-3 text-xs text-slate-500">
          <span>Updated {formatDate(guide.updated ?? guide.published)}</span>
          <span className="flex items-center gap-1">
            <Clock size={12} /> {minutes} min read
          </span>
        </p>
        <div className="rounded-lg border border-blue-100 bg-blue-50/60 px-5 py-4">
          <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-blue-700">Quick answer</p>
          <p className="leading-relaxed text-slate-800">
            <GuideText text={guide.summary} />
          </p>
        </div>
        {toolCta}
      </header>

      {guide.sections.length >= 4 && (
        <nav aria-label="Contents" className="rounded-lg border border-slate-200 bg-white px-5 py-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">In this guide</p>
          <ol className="list-decimal space-y-1 pl-5 text-sm">
            {guide.sections.map((s) => (
              <li key={s.heading}>
                <a href={`#${anchor(s.heading)}`} className="text-slate-700 hover:text-blue-700 hover:underline">
                  {s.heading}
                </a>
              </li>
            ))}
            <li>
              <a href="#faq" className="text-slate-700 hover:text-blue-700 hover:underline">Frequently asked questions</a>
            </li>
          </ol>
        </nav>
      )}

      <article className="space-y-10">
        {guide.sections.map((s) => (
          <section key={s.heading} id={anchor(s.heading)} className="scroll-mt-20 space-y-4">
            <h2 className="text-xl font-bold text-slate-900">{s.heading}</h2>
            {s.blocks.map((b, i) => (
              <Block key={i} block={b} />
            ))}
          </section>
        ))}

        <section id="faq" className="scroll-mt-20 space-y-4">
          <h2 className="text-xl font-bold text-slate-900">Frequently asked questions</h2>
          <div className="divide-y divide-slate-200 rounded-lg border border-slate-200 bg-white">
            {guide.faqs.map((f) => (
              <div key={f.question} className="space-y-1.5 px-5 py-4">
                <h3 className="font-semibold text-slate-900">{f.question}</h3>
                <p className="text-sm leading-relaxed text-slate-700">
                  <GuideText text={f.answer} />
                </p>
              </div>
            ))}
          </div>
        </section>
      </article>

      {toolCta}

      {related.length > 0 && (
        <section className="space-y-3 border-t border-slate-200 pt-8">
          <h2 className="text-lg font-bold text-slate-900">Related guides</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {related.map((g) => (
              <Link
                key={g.slug}
                href={`/guides/${g.slug}`}
                className="flex items-start gap-2.5 rounded-lg border border-slate-200 bg-white p-4 text-sm font-medium text-slate-800 transition-colors hover:border-slate-300 hover:bg-slate-50"
              >
                <BookOpen size={16} className="mt-0.5 flex-shrink-0 text-slate-400" />
                {g.title}
              </Link>
            ))}
          </div>
        </section>
      )}

      {sameCategoryTools.length > 0 && tool && (
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900">More {tool.category.toLowerCase()} tools</h2>
          <div className="flex flex-wrap gap-2">
            {sameCategoryTools.map((t) => (
              <Link
                key={t.id}
                href={t.href}
                className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1.5 text-sm font-medium transition-colors hover:bg-slate-200"
              >
                {t.name}
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
