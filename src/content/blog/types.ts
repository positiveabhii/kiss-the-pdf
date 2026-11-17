/**
 * Blog posts: comparisons, explainers and broader how-tos that are not tied to
 * a single tool (those live in src/content/guides). Rendered at /blog/[slug].
 *
 * Inline text supports the same markup as guides, rendered by GuideText:
 *   [link text](/some-path)   internal or external link
 *   **bold**
 */

export type BlogBlock =
  | { type: "p"; text: string }
  /** Sub-heading inside a section, rendered as an H3. */
  | { type: "h3"; text: string }
  /** Numbered steps. */
  | { type: "steps"; items: { title: string; text: string }[] }
  /** Bulleted list. */
  | { type: "list"; items: string[] }
  /** Highlighted callout. */
  | { type: "tip"; text: string }
  /** Comparison or reference table. First column is the row label. */
  | { type: "table"; caption?: string; headers: string[]; rows: string[][] }
  /** Pros and cons for one product in a comparison. */
  | { type: "proscons"; title: string; pros: string[]; cons: string[] };

export type BlogSection = {
  /** Rendered as an H2. Phrase it the way people search. */
  heading: string;
  blocks: BlogBlock[];
};

export const BLOG_CATEGORIES = ["Open Source", "Comparisons", "How-To", "Explainers"] as const;
export type BlogCategory = (typeof BLOG_CATEGORIES)[number];

export type BlogPost = {
  /** URL slug under /blog. Lowercase, hyphenated, keyword-first. */
  slug: string;
  category: BlogCategory;
  /** Page H1. */
  title: string;
  /** <title>, 60 characters or fewer, without the site name. */
  seoTitle: string;
  /** Meta description, 110–160 characters. */
  description: string;
  /** 40–70 word direct answer shown at the top (featured-snippet target). */
  summary: string;
  /** Short line printed on the generated cover image (max ~60 chars). */
  coverLine: string;
  /** Lowercase kebab-case topic tags, 3–6. Each gets a /blog/tag/[tag] page. */
  tags: string[];
  /** Primary and secondary search phrases this post targets. Not rendered as meta keywords. */
  keywords: string[];
  /** ISO date (YYYY-MM-DD). */
  published: string;
  updated?: string;
  sections: BlogSection[];
  faqs: { question: string; answer: string }[];
  /** Tool ids from src/config/tools.ts to feature at the end. */
  relatedTools: string[];
  /** Slugs of other blog posts. */
  relatedPosts: string[];
};
