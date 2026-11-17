import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { posts } from "@/content/blog";
import { guides } from "@/content/guides";
import { PostCard } from "@/components/blog/post-card";

/**
 * Server component: latest posts and popular guides. Rendered on the landing
 * page so it gets crawlable links into the content without shipping that
 * content in the client bundle.
 */
const POPULAR_GUIDES = [
  "how-to-merge-pdf-files",
  "how-to-view-pdf-in-full-screen",
  "how-to-make-a-photo-album-pdf",
  "how-to-duplicate-pages-in-pdf",
  "how-to-add-text-to-pdf",
  "how-to-remove-metadata-from-pdf",
];

export function FromTheBlog() {
  // One post per category so the landing page shows the breadth of the blog.
  const latest = (["Comparisons", "How-To", "Open Source", "Explainers"] as const)
    .map((c) => posts.find((p) => p.category === c))
    .filter((p) => p !== undefined)
    .slice(0, 3);
  const popular = POPULAR_GUIDES.map((s) => guides.find((g) => g.slug === s)).filter((g) => g !== undefined);
  if (latest.length === 0 && popular.length === 0) return null;

  return (
    <section className="relative bg-white py-24 sm:py-28">
      <div className="absolute inset-x-0 top-0 h-px bg-[var(--kp-border)]" aria-hidden="true" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-2xl">
            <p className="kp-label mb-3 text-[var(--kp-accent)]">Learn</p>
            <h2 className="kp-heading text-[var(--kp-text)]">
              Guides and <em>honest</em> comparisons.
            </h2>
          </div>
          <Link href="/blog" className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--kp-text)] hover:text-[var(--kp-accent-hover)]">
            All articles <ArrowRight size={15} />
          </Link>
        </div>

        {latest.length > 0 && (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {latest.map((p) => (
              <PostCard key={p.slug} post={p} />
            ))}
          </div>
        )}

        {popular.length > 0 && (
          <div className="mt-12 rounded-2xl border border-[var(--kp-border)] bg-[var(--kp-bg)] p-6 sm:p-8">
            <div className="mb-4 flex items-center justify-between gap-4">
              <h3 className="font-serif text-2xl text-[var(--kp-text)]">Popular how-to guides</h3>
              <Link href="/guides" className="text-sm font-semibold text-[var(--kp-accent-hover)] hover:underline">
                All guides →
              </Link>
            </div>
            <ul className="grid gap-x-8 gap-y-2.5 sm:grid-cols-2 lg:grid-cols-3">
              {popular.map((g) => (
                <li key={g.slug}>
                  <Link href={`/guides/${g.slug}`} className="text-[15px] text-[var(--kp-text-secondary)] hover:text-[var(--kp-text)] hover:underline">
                    {g.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
