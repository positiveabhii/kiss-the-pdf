import { parsePageRange } from "@/features/pdf/utils/page-range-parser";

import { UserFacingError } from "../../core/pdf-io";

/**
 * Page-range text helpers shared by the organization tools. All page numbers
 * here are 1-based, as the user types them.
 */

/** "7-" → "7-<max>", "-3" → "1-3" so open-ended ranges work everywhere. */
function expandOpenEnds(input: string, max: number): string {
  return input
    .split(",")
    .map((part) => {
      const p = part.trim();
      if (/^\d+\s*-$/.test(p)) return `${p.replace(/\s*-$/, "")}-${max}`;
      if (/^-\s*\d+$/.test(p)) return `1-${p.replace(/^-\s*/, "")}`;
      return p;
    })
    .join(",");
}

/**
 * Parse a list like "1-3, 5, 8-" into sorted unique page numbers.
 * Blank input → []. Invalid input throws a UserFacingError naming the bad part.
 */
export function parsePages(input: string, pageCount: number): number[] {
  if (!input.trim()) return [];
  try {
    return parsePageRange(expandOpenEnds(input, pageCount), pageCount);
  } catch (err) {
    const what = err instanceof Error ? err.message.replace(/^Invalid page (range|number): /, "") : input;
    throw new UserFacingError(
      `"${what}" isn't a valid page or range for a ${pageCount}-page PDF. Use numbers between 1 and ${pageCount}, like 1-3, 5, 8-.`
    );
  }
}

/** Like parsePages but returns an error message instead of throwing (for live validation). */
export function tryParsePages(
  input: string,
  pageCount: number
): { pages: number[]; error: string | null } {
  try {
    return { pages: parsePages(input, pageCount), error: null };
  } catch (err) {
    return { pages: [], error: err instanceof Error ? err.message : String(err) };
  }
}

export interface RangeGroup {
  start: number;
  end: number;
}

/**
 * Parse "1-3, 4-6, 7-" into ordered groups, one per comma-separated part.
 * Each part is a page ("5"), a range ("1-3") or open-ended ("7-" = to the end).
 * Order is kept as typed; overlaps are allowed (each group becomes its own file).
 */
export function parseRangeGroups(input: string, pageCount: number): RangeGroup[] {
  const parts = input
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  if (parts.length === 0) throw new UserFacingError("Enter at least one page range, like 1-3, 4-6, 7-.");
  return parts.map((part) => {
    const m = /^(\d+)?\s*(-)?\s*(\d+)?$/.exec(part);
    let group: RangeGroup | null = null;
    if (m && (m[1] || m[3])) {
      if (!m[2]) group = m[1] && !m[3] ? { start: +m[1], end: +m[1] } : null;
      else group = { start: m[1] ? +m[1] : 1, end: m[3] ? +m[3] : pageCount };
    }
    if (!group || group.start < 1 || group.end > pageCount || group.start > group.end) {
      throw new UserFacingError(
        `"${part}" isn't a valid range for a ${pageCount}-page PDF. Use numbers between 1 and ${pageCount}, like 1-3, 4-6, 7-.`
      );
    }
    return group;
  });
}

/** [1,2,3,5,8,9] → "1-3, 5, 8-9" */
export function formatPageList(pages: Iterable<number>): string {
  const sorted = Array.from(new Set(pages)).sort((a, b) => a - b);
  const parts: string[] = [];
  let i = 0;
  while (i < sorted.length) {
    let j = i;
    while (j + 1 < sorted.length && sorted[j + 1] === sorted[j] + 1) j++;
    parts.push(i === j ? `${sorted[i]}` : `${sorted[i]}-${sorted[j]}`);
    i = j + 1;
  }
  return parts.join(", ");
}

/** "p1-3" / "p5" for file names. */
export function rangeLabel({ start, end }: RangeGroup): string {
  return start === end ? `p${start}` : `p${start}-${end}`;
}
