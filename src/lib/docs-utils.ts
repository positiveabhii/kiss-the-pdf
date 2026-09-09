import { tools } from "@/config/tools";
import { ToolDefinition } from "@/types";
import { CATEGORY_DETAILS, DOCS_NAV_GROUPS } from "@/config/docs";

export interface SearchResultItem {
  type: "doc" | "tool" | "category";
  title: string;
  category?: string;
  excerpt: string;
  href: string;
  icon?: string;
  status?: string;
}

export interface TocItem {
  id: string;
  title: string;
  level: number;
}

export function slugifyCategory(categoryName: string): string {
  return categoryName.toLowerCase().trim().replace(/\s+/g, "-");
}

export function findCategoryBySlug(slug: string) {
  const normalized = slug.toLowerCase().trim();
  return Object.values(CATEGORY_DETAILS).find(
    (cat) => cat.slug === normalized || cat.name.toLowerCase() === normalized
  );
}

export function getDocSearchResults(query: string): SearchResultItem[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const results: SearchResultItem[] = [];

  // Search static documentation pages
  DOCS_NAV_GROUPS.forEach((group) => {
    group.items.forEach((item) => {
      if (
        item.title.toLowerCase().includes(q) ||
        (item.description && item.description.toLowerCase().includes(q))
      ) {
        results.push({
          type: item.isCategory ? "category" : "doc",
          title: item.title,
          category: group.groupName,
          excerpt: item.description || `Documentation guide for ${item.title}`,
          href: item.href,
        });
      }
    });
  });

  // Search 100 tools
  tools.forEach((tool) => {
    const keywords = tool.keywords || [];
    if (
      tool.name.toLowerCase().includes(q) ||
      tool.description.toLowerCase().includes(q) ||
      tool.category.toLowerCase().includes(q) ||
      keywords.some((k) => k.toLowerCase().includes(q))
    ) {
      results.push({
        type: "tool",
        title: tool.name,
        category: tool.category,
        excerpt: tool.description,
        href: `/docs/tools/${tool.id}`,
        icon: tool.icon,
        status: tool.status,
      });
    }
  });

  // Remove duplicates by href
  const seen = new Set<string>();
  return results.filter((item) => {
    if (seen.has(item.href)) return false;
    seen.add(item.href);
    return true;
  });
}

export function getToolDocDetails(tool: ToolDefinition) {
  const categorySlug = slugifyCategory(tool.category);
  const categoryInfo = findCategoryBySlug(categorySlug);

  const relatedTools = tools
    .filter((t) => t.category === tool.category && t.id !== tool.id)
    .slice(0, 4);

  return {
    tool,
    categoryInfo,
    relatedTools,
    steps: [
      `Navigate to the ${tool.name} tool page or upload your PDF file directly into the designated drop zone.`,
      `Configure settings, select specific page ranges, or customize options tailored for ${tool.name.toLowerCase()}.`,
      `Click the action button to process your document instantly in your browser.`,
      `Preview your output and click Download to save the result directly to your local device.`,
    ],
    privacy:
      "100% Client-Side Processing. Files processed with this tool never leave your local device. Execution happens entirely inside your browser's local memory buffer via JavaScript/WebAssembly.",
    limitations:
      tool.status === "implemented"
        ? "Processing speed depends on your device's memory and processor. Extremely large PDF files (500MB+) may require additional browser memory."
        : "Implementation placeholder — this tool definition is registered in the core registry, but full client-side execution is currently under active development.",
  };
}
