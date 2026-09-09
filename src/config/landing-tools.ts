import { tools } from "./tools";
import type { ToolDefinition } from "@/types";

export type LandingToolCategoryId =
  | "organization"
  | "page-manipulation"
  | "convert"
  | "editing"
  | "security"
  | "forms-signatures"
  | "enhancement"
  | "reading";

export interface LandingToolCategory {
  id: LandingToolCategoryId;
  label: string;
  heading: string;
  description: string;
}

export interface LandingTool {
  id: string;
  name: string;
  description: string;
  category: LandingToolCategoryId;
  icon: string;
  route?: string;
  keywords?: string[];
}

export const LANDING_CATEGORIES: LandingToolCategory[] = [
  {
    id: "organization",
    label: "Organization",
    heading: "PDF Organization",
    description: "Combine, split, rearrange, and manage pages across documents.",
  },
  {
    id: "page-manipulation",
    label: "Pages",
    heading: "Page Manipulation",
    description: "Rotate, crop, resize, and fine-tune individual pages.",
  },
  {
    id: "convert",
    label: "Convert",
    heading: "Image ↔ PDF Conversion",
    description: "Convert between PDFs and popular image formats.",
  },
  {
    id: "editing",
    label: "Edit",
    heading: "PDF Editing",
    description: "Annotate, mark up, and modify document content.",
  },
  {
    id: "security",
    label: "Security",
    heading: "Security & Privacy",
    description: "Protect, encrypt, and control access to your documents.",
  },
  {
    id: "forms-signatures",
    label: "Forms",
    heading: "Forms & Signatures",
    description: "Fill forms, add fields, and sign documents.",
  },
  {
    id: "enhancement",
    label: "Enhance",
    heading: "Document Enhancement",
    description: "Add page numbers, watermarks, bookmarks, and navigation.",
  },
  {
    id: "reading",
    label: "Read",
    heading: "Reading & Presentation",
    description: "View, search, and present PDFs in the browser.",
  },
];

const CATEGORY_MAP: Record<string, LandingToolCategoryId> = {
  Organization: "organization",
  Pages: "page-manipulation",
  Convert: "convert",
  Edit: "editing",
  Security: "security",
  Forms: "forms-signatures",
  Enhancement: "enhancement",
  Reading: "reading",
};

export const LANDING_TOOLS: LandingTool[] = tools.map((t: ToolDefinition) => ({
  id: t.id,
  name: t.name,
  description: t.description,
  category: CATEGORY_MAP[t.category] || "organization",
  icon: t.icon,
  route: t.href,
  keywords: t.keywords,
}));

export function getToolsByLandingCategory(categoryId: LandingToolCategoryId): LandingTool[] {
  return LANDING_TOOLS.filter((t) => t.category === categoryId);
}

export function searchLandingTools(query: string, categoryFilter?: LandingToolCategoryId | "all"): LandingTool[] {
  const q = query.trim().toLowerCase();
  return LANDING_TOOLS.filter((tool) => {
    if (categoryFilter && categoryFilter !== "all" && tool.category !== categoryFilter) return false;
    if (!q) return true;
    return (
      tool.name.toLowerCase().includes(q) ||
      tool.description.toLowerCase().includes(q) ||
      tool.keywords?.some((k) => k.includes(q))
    );
  });
}
