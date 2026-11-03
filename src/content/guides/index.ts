import type { Guide } from "./types";
import { organizationGuides } from "./organization";
import { pagesGuides } from "./pages";
import { pagesLayoutGuides } from "./pages-layout";
import { convertGuides } from "./convert";
import { convertExportGuides } from "./convert-export";
import { editGuides } from "./edit";
import { editAnnotateGuides } from "./edit-annotate";
import { securityGuides } from "./security";
import { formsGuides } from "./forms";
import { enhancementGuides } from "./enhancement";
import { readingGuides } from "./reading";

export type { Guide, GuideBlock, GuideSection } from "./types";

export const guides: Guide[] = [
  ...organizationGuides,
  ...pagesGuides,
  ...pagesLayoutGuides,
  ...convertGuides,
  ...convertExportGuides,
  ...editGuides,
  ...editAnnotateGuides,
  ...securityGuides,
  ...formsGuides,
  ...enhancementGuides,
  ...readingGuides,
];

const bySlug = new Map(guides.map((g) => [g.slug, g]));
const byTool = new Map(guides.map((g) => [g.toolId, g]));

export function getGuide(slug: string): Guide | undefined {
  return bySlug.get(slug);
}

export function getGuideForTool(toolId: string): Guide | undefined {
  return byTool.get(toolId);
}

/** Rough reading time at ~220 words per minute. */
export function readingMinutes(guide: Guide): number {
  const text = [
    guide.summary,
    ...guide.sections.flatMap((s) =>
      s.blocks.flatMap((b) =>
        b.type === "steps" ? b.items.flatMap((i) => [i.title, i.text]) : b.type === "list" ? b.items : [b.text]
      )
    ),
    ...guide.faqs.flatMap((f) => [f.question, f.answer]),
  ].join(" ");
  return Math.max(2, Math.round(text.split(/\s+/).length / 220));
}
