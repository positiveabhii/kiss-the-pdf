import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { siteConfig } from "@/config/site";
import { allTags, postsWithTag, tagLabel } from "@/content/blog";
import { PostCard } from "@/components/blog/post-card";

interface Props {
  params: Promise<{ tag: string }>;
}

export function generateStaticParams() {
  return allTags().map(({ tag }) => ({ tag }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tag } = await params;
  const items = postsWithTag(tag);
  if (items.length === 0) return { title: "Topic Not Found" };
  const label = tagLabel(tag);
  const url = `${siteConfig.url}/blog/tag/${tag}`;
  return {
    title: `${label} PDF Articles`,
    description: `${items.length} articles about ${label.toLowerCase()} and PDFs: comparisons, explainers and step-by-step tutorials from KissThePDF.`,
    alternates: { canonical: url },
    // Thin tag pages compete with the posts they list; let them pass link equity without being indexed.
    robots: items.length < 3 ? { index: false, follow: true } : undefined,
  };
}

export default async function TagPage({ params }: Props) {
  const { tag } = await params;
  const items = postsWithTag(tag);
  if (items.length === 0) notFound();

  return (
    <div className="mx-auto w-full max-w-6xl space-y-10 pb-10">
      <header className="space-y-3">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-slate-500">
          <Link href="/blog" className="hover:text-slate-900">Blog</Link>
          <span>/</span>
          <span>Topics</span>
        </nav>
        <h1 className="font-serif text-4xl tracking-tight text-slate-900">#{tagLabel(tag).replace(/\s+/g, "")}</h1>
        <p className="text-slate-600">
          {items.length} {items.length === 1 ? "article" : "articles"} about {tagLabel(tag).toLowerCase()}.
        </p>
      </header>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((p) => (
          <PostCard key={p.slug} post={p} />
        ))}
      </div>
    </div>
  );
}
