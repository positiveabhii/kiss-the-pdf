import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Clock } from "lucide-react";

import { siteConfig } from "@/config/site";
import { tools } from "@/config/tools";
import { getPost, isIndexableTag, posts, readingMinutes, tagLabel } from "@/content/blog";
import { BlogBlock } from "@/components/blog/blog-block";
import { PostCard, formatDate } from "@/components/blog/post-card";
import { GuideText, guidePlainText } from "@/components/guides/guide-text";
import type { ToolDefinition } from "@/types";

interface Props {
  params: Promise<{ slug: string }>;
}

const anchor = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return { title: "Post Not Found" };
  const url = `${siteConfig.url}/blog/${post.slug}`;
  const image = `${siteConfig.url}/blog/${post.slug}/cover.png`;
  return {
    title: post.seoTitle,
    description: post.description,
    alternates: { canonical: url },
    openGraph: {
      title: post.title,
      description: post.description,
      url,
      siteName: siteConfig.name,
      type: "article",
      publishedTime: post.published,
      modifiedTime: post.updated ?? post.published,
      section: post.category,
      tags: post.tags.map(tagLabel),
      images: [{ url: image, width: 1200, height: 630, alt: post.title }],
    },
    twitter: { card: "summary_large_image", title: post.title, description: post.description, images: [image] },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const url = `${siteConfig.url}/blog/${post.slug}`;
  const cover = `/blog/${post.slug}/cover.png`;
  const minutes = readingMinutes(post);
  const relatedTools = post.relatedTools
    .map((id) => tools.find((t) => t.id === id))
    .filter((t): t is ToolDefinition => t !== undefined);
  // Fill related posts up to three with same-category posts so every page links onward.
  const related = [
    ...post.relatedPosts.map(getPost),
    ...posts.filter((p) => p.category === post.category),
  ]
    .filter((p, i, all) => p !== undefined && p.slug !== post.slug && all.findIndex((q) => q?.slug === p.slug) === i)
    .slice(0, 3) as typeof posts;

  const shareText = encodeURIComponent(post.title);
  const shareTags = post.tags.map((t) => t.replace(/-/g, "")).join(",");

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: post.title,
      description: post.description,
      image: `${siteConfig.url}${cover}`,
      datePublished: post.published,
      dateModified: post.updated ?? post.published,
      mainEntityOfPage: url,
      articleSection: post.category,
      keywords: post.keywords.join(", "),
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
        { "@type": "ListItem", position: 2, name: "Blog", item: `${siteConfig.url}/blog` },
        { "@type": "ListItem", position: 3, name: post.title, item: url },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: post.faqs.map((f) => ({
        "@type": "Question",
        name: f.question,
        acceptedAnswer: { "@type": "Answer", text: guidePlainText(f.answer) },
      })),
    },
  ];

  return (
    <div className="mx-auto w-full max-w-3xl space-y-10 pb-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <header className="space-y-5">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-slate-500">
          <Link href="/" className="hover:text-slate-900">Home</Link>
          <span>/</span>
          <Link href="/blog" className="hover:text-slate-900">Blog</Link>
          <span>/</span>
          <span>{post.category}</span>
        </nav>
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--kp-accent)]">{post.category}</p>
        <h1 className="font-serif text-4xl leading-[1.1] tracking-tight text-slate-900 sm:text-5xl">{post.title}</h1>
        <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-500">
          <span>
            By <a href={siteConfig.author.url} className="font-medium text-slate-700 hover:underline">{siteConfig.author.name}</a>
          </span>
          <span aria-hidden="true">·</span>
          <time dateTime={post.updated ?? post.published}>Updated {formatDate(post.updated ?? post.published)}</time>
          <span aria-hidden="true">·</span>
          <span className="flex items-center gap-1"><Clock size={13} /> {minutes} min read</span>
        </p>
        {/* eslint-disable-next-line @next/next/no-img-element -- generated static cover */}
        <img
          src={cover}
          alt={`${post.title}: ${post.coverLine}`}
          width={1200}
          height={630}
          fetchPriority="high"
          className="aspect-[1200/630] w-full rounded-2xl border border-[var(--kp-border)] object-cover"
        />
        <div className="rounded-2xl border border-[var(--kp-border)] bg-[var(--kp-bg)] px-6 py-5">
          <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">In brief</p>
          <p className="text-[17px] leading-relaxed text-slate-800">
            <GuideText text={post.summary} />
          </p>
        </div>
      </header>

      {post.sections.length >= 4 && (
        <nav aria-label="Contents" className="rounded-2xl border border-[var(--kp-border)] bg-white px-6 py-5">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">In this article</p>
          <ol className="list-decimal space-y-1.5 pl-5 text-sm marker:text-slate-400">
            {post.sections.map((s) => (
              <li key={s.heading}>
                <a href={`#${anchor(s.heading)}`} className="text-slate-700 hover:text-[var(--kp-accent-hover)] hover:underline">{s.heading}</a>
              </li>
            ))}
            <li>
              <a href="#faq" className="text-slate-700 hover:text-[var(--kp-accent-hover)] hover:underline">Frequently asked questions</a>
            </li>
          </ol>
        </nav>
      )}

      <article className="space-y-12">
        {post.sections.map((s) => (
          <section key={s.heading} id={anchor(s.heading)} className="scroll-mt-20 space-y-5">
            <h2 className="font-serif text-[28px] leading-tight text-slate-900">{s.heading}</h2>
            {s.blocks.map((b, i) => (
              <BlogBlock key={i} block={b} />
            ))}
          </section>
        ))}

        <section id="faq" className="scroll-mt-20 space-y-5">
          <h2 className="font-serif text-[28px] leading-tight text-slate-900">Frequently asked questions</h2>
          <div className="divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white">
            {post.faqs.map((f) => (
              <div key={f.question} className="space-y-1.5 px-6 py-5">
                <h3 className="font-semibold text-slate-900">{f.question}</h3>
                <p className="leading-relaxed text-slate-700"><GuideText text={f.answer} /></p>
              </div>
            ))}
          </div>
        </section>
      </article>

      <footer className="space-y-4 border-t border-[var(--kp-border)] pt-8">
        <div className="flex flex-wrap items-center gap-2">
          {post.tags.map((t) =>
            // Only link tag pages that are indexable; thin ones render as plain labels.
            isIndexableTag(t) ? (
              <Link
                key={t}
                href={`/blog/tag/${t}`}
                className="rounded-full border border-[var(--kp-border)] bg-white px-3 py-1 text-sm text-slate-700 transition-colors hover:border-[var(--kp-accent)] hover:text-[var(--kp-accent-hover)]"
              >
                #{tagLabel(t).replace(/\s+/g, "")}
              </Link>
            ) : (
              <span key={t} className="rounded-full border border-[var(--kp-border)] bg-white px-3 py-1 text-sm text-slate-500">
                #{tagLabel(t).replace(/\s+/g, "")}
              </span>
            )
          )}
        </div>
        <p className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
          Share:
          <a
            href={`https://x.com/intent/post?text=${shareText}&url=${encodeURIComponent(url)}&hashtags=${shareTags}`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-slate-700 hover:underline"
          >
            X
          </a>
          <a
            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-slate-700 hover:underline"
          >
            LinkedIn
          </a>
          <a
            href={`https://www.reddit.com/submit?url=${encodeURIComponent(url)}&title=${shareText}`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-slate-700 hover:underline"
          >
            Reddit
          </a>
        </p>
      </footer>

      {relatedTools.length > 0 && (
        <section className="space-y-4 rounded-2xl bg-[var(--kp-text)] p-6 text-white sm:p-8">
          <h2 className="font-serif text-2xl">Try it free, without uploading anything</h2>
          <p className="text-sm text-white/70">These tools run in your browser. No account, no watermark.</p>
          <div className="grid gap-2 sm:grid-cols-2">
            {relatedTools.map((t) => (
              <Link
                key={t.id}
                href={t.href}
                className="group flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium transition-colors hover:bg-white/10"
              >
                {t.name}
                <ArrowRight size={16} className="text-white/60 transition-transform group-hover:translate-x-0.5" />
              </Link>
            ))}
          </div>
        </section>
      )}

      {related.length > 0 && (
        <section className="space-y-4">
          <h2 className="font-serif text-2xl text-slate-900">Keep reading</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {related.map((p) => (
              <PostCard key={p.slug} post={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
