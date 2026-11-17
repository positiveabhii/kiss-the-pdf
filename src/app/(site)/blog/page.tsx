import type { Metadata } from "next";
import Link from "next/link";

import { siteConfig } from "@/config/site";
import { BLOG_CATEGORIES, allTags, posts, tagLabel } from "@/content/blog";
import { PostCard } from "@/components/blog/post-card";

const title = "PDF Blog: Open Source Tools, Comparisons & Guides";
const description =
  "Honest comparisons of PDF editors, open-source PDF tools, privacy explainers and step-by-step tutorials from the team behind KissThePDF.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: `${siteConfig.url}/blog` },
  openGraph: { title, description, url: `${siteConfig.url}/blog`, siteName: siteConfig.name, type: "website" },
};

export default function BlogIndex() {
  const [featured, ...rest] = posts;
  const tags = allTags();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: `${siteConfig.name} Blog`,
    description,
    url: `${siteConfig.url}/blog`,
    blogPost: posts.map((p) => ({
      "@type": "BlogPosting",
      headline: p.title,
      url: `${siteConfig.url}/blog/${p.slug}`,
      datePublished: p.published,
      image: `${siteConfig.url}/blog/${p.slug}/cover.png`,
    })),
  };

  return (
    <div className="mx-auto w-full max-w-6xl space-y-14 pb-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <header className="max-w-2xl space-y-3 pt-2">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--kp-accent)]">The KissThePDF blog</p>
        <h1 className="font-serif text-4xl leading-[1.1] tracking-tight text-slate-900 sm:text-5xl">
          Notes on working with PDFs, privately.
        </h1>
        <p className="text-lg leading-relaxed text-slate-600">
          Fair comparisons, open-source picks and plain-English explainers. We say when another tool is the better choice.
        </p>
      </header>

      {posts.length === 0 && <p className="text-slate-600">Posts are on their way.</p>}

      {featured && (
        <Link
          href={`/blog/${featured.slug}`}
          className="group grid overflow-hidden rounded-3xl border border-[var(--kp-border)] bg-white transition-shadow hover:shadow-[var(--kp-shadow-md)] md:grid-cols-[1.25fr_1fr]"
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- generated static cover */}
          <img src={`/blog/${featured.slug}/cover.png`} alt="" width={1200} height={630} className="aspect-[1200/630] h-full w-full object-cover" />
          <div className="flex flex-col justify-center gap-3 p-6 sm:p-8">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--kp-accent)]">Latest · {featured.category}</p>
            <h2 className="font-serif text-3xl leading-tight text-slate-900 group-hover:text-[var(--kp-accent-hover)]">{featured.title}</h2>
            <p className="leading-relaxed text-slate-600">{featured.description}</p>
          </div>
        </Link>
      )}

      {BLOG_CATEGORIES.map((category) => {
        const items = rest.filter((p) => p.category === category);
        if (items.length === 0) return null;
        return (
          <section key={category} className="space-y-5">
            <h2 className="font-serif text-3xl text-slate-900">{category}</h2>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((p) => (
                <PostCard key={p.slug} post={p} />
              ))}
            </div>
          </section>
        );
      })}

      {tags.length > 0 && (
        <section className="space-y-4 border-t border-[var(--kp-border)] pt-10">
          <h2 className="font-serif text-2xl text-slate-900">Browse by topic</h2>
          <div className="flex flex-wrap gap-2">
            {tags.map(({ tag, count }) => (
              <Link
                key={tag}
                href={`/blog/tag/${tag}`}
                className="rounded-full border border-[var(--kp-border)] bg-white px-3 py-1.5 text-sm text-slate-700 transition-colors hover:border-[var(--kp-accent)] hover:text-[var(--kp-accent-hover)]"
              >
                #{tagLabel(tag).replace(/\s+/g, "")} <span className="text-slate-400">{count}</span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
