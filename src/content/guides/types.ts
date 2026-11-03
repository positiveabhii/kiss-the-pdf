/**
 * Long-form "how to" guides. One guide per tool, each targeting the
 * informational ("how do I …") search for that task, while the tool page
 * itself targets the transactional ("… online free") search.
 *
 * Inline text supports two tiny bits of markup, rendered by GuideText:
 *   [link text](/some-path)   internal or external link
 *   **bold**
 */

export type GuideBlock =
  | { type: "p"; text: string }
  /** Numbered steps. */
  | { type: "steps"; items: { title: string; text: string }[] }
  /** Bulleted list. */
  | { type: "list"; items: string[] }
  /** Highlighted callout. */
  | { type: "tip"; text: string };

export type GuideSection = {
  /** Rendered as an H2. Phrase it the way people search. */
  heading: string;
  blocks: GuideBlock[];
};

export type Guide = {
  /** URL slug under /guides, e.g. "how-to-duplicate-pages-in-pdf". */
  slug: string;
  /** Tool id from src/config/tools.ts this guide teaches. */
  toolId: string;
  /** Page H1. */
  title: string;
  /** <title>, 60 characters or fewer, without the site name. */
  seoTitle: string;
  /** Meta description, 120–158 characters. */
  description: string;
  /** 40–60 word direct answer shown at the top (featured-snippet target). */
  summary: string;
  /** ISO date (YYYY-MM-DD). */
  published: string;
  updated?: string;
  sections: GuideSection[];
  faqs: { question: string; answer: string }[];
  /** Slugs of other guides to link at the bottom. */
  relatedGuides: string[];
};
