import type { BlogBlock, BlogCategory, BlogPost } from "./types";
import { openSourcePosts } from "./open-source";
import { comparisonsPosts } from "./comparisons";
import { howToPosts } from "./how-to";
import { explainersPosts } from "./explainers";

export type { BlogBlock, BlogCategory, BlogPost, BlogSection } from "./types";
export { BLOG_CATEGORIES } from "./types";

/** Newest first; ties keep authoring order. */
export const posts: BlogPost[] = [...openSourcePosts, ...comparisonsPosts, ...howToPosts, ...explainersPosts]
  .map((p, i) => ({ p, i }))
  .sort((a, b) => (b.p.updated ?? b.p.published).localeCompare(a.p.updated ?? a.p.published) || a.i - b.i)
  .map(({ p }) => p);

const bySlug = new Map(posts.map((p) => [p.slug, p]));

export function getPost(slug: string): BlogPost | undefined {
  return bySlug.get(slug);
}

/** Display names for tag slugs. Tags not listed fall back to title case. */
const TAG_LABELS: Record<string, string> = {
  "open-source": "Open Source",
  "pdf-editor": "PDF Editor",
  "free-tools": "Free Tools",
  "e-signature": "E-Signature",
  "pdf-basics": "PDF Basics",
  "self-hosting": "Self-Hosting",
  ai: "AI",
  mac: "Mac",
};

export function tagLabel(tag: string): string {
  return TAG_LABELS[tag] ?? tag.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

/** Tags with their post counts, most used first. */
export function allTags(): { tag: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const p of posts) for (const t of p.tags) counts.set(t, (counts.get(t) ?? 0) + 1);
  return [...counts].map(([tag, count]) => ({ tag, count })).sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}

/**
 * A tag page is indexed (and linked) only once it lists enough posts to be a
 * useful hub. Thinner tag pages stay reachable but are noindex and unlinked,
 * so crawlers don't spend time on near-duplicate list pages.
 */
export const MIN_TAG_POSTS = 3;

export function isIndexableTag(tag: string): boolean {
  return postsWithTag(tag).length >= MIN_TAG_POSTS;
}

export function postsWithTag(tag: string): BlogPost[] {
  return posts.filter((p) => p.tags.includes(tag));
}

function blockText(b: BlogBlock): string[] {
  switch (b.type) {
    case "steps":
      return b.items.flatMap((i) => [i.title, i.text]);
    case "list":
      return b.items;
    case "table":
      return [...b.headers, ...b.rows.flat()];
    case "proscons":
      return [b.title, ...b.pros, ...b.cons];
    default:
      return [b.text];
  }
}

/** Rough reading time at ~220 words per minute. */
export function readingMinutes(post: BlogPost): number {
  const text = [
    post.summary,
    ...post.sections.flatMap((s) => s.blocks.flatMap(blockText)),
    ...post.faqs.flatMap((f) => [f.question, f.answer]),
  ].join(" ");
  return Math.max(3, Math.round(text.split(/\s+/).length / 220));
}

/** Visual identity per category, shared by cards, the post header and the generated cover. */
export const CATEGORY_STYLE: Record<BlogCategory, { from: string; to: string; ink: string; glyph: string }> = {
  "Open Source": { from: "#1f3b2d", to: "#2f5a43", ink: "#d9f2e1", glyph: "{ }" },
  Comparisons: { from: "#2b2240", to: "#4a3a6b", ink: "#e7defb", glyph: "A vs B" },
  "How-To": { from: "#8a2f1e", to: "#ef553b", ink: "#ffe4dc", glyph: "1 · 2 · 3" },
  Explainers: { from: "#1d2f47", to: "#2f4c73", ink: "#dbe7f7", glyph: "¶" },
};
