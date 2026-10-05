"use client";

import { useCallback, useState } from "react";

import { PageScopeSelector } from "@/features/pdf/components/shared/PageScopeSelector";
import { PdfPageGrid } from "@/features/pdf/components/shared/PdfPageGrid";
import type { PageScope } from "@/features/pdf/hooks/use-page-selection";
import { parsePageRange } from "@/features/pdf/utils/page-range-parser";

import type { LoadedPdf } from "../../core/SimplePdfTool";
import { useThumbnails } from "./useThumbnails";

/**
 * Which pages a tool applies to: all / selected (click thumbnails) / range /
 * odd / even. Same vocabulary and UI as `usePageSelection` + `PageScopeSelector`,
 * but the state is independent of the page count so it can live in the tool
 * component (SimplePdfTool only knows the page count after a file loads).
 */
export interface ScopeState {
  scope: PageScope;
  /** 1-based page numbers picked on the thumbnail grid. */
  selected: Set<number>;
  range: string;
}

export const INITIAL_SCOPE: ScopeState = { scope: "all", selected: new Set(), range: "" };

export function useScope() {
  const [scope, setScope] = useState<ScopeState>(INITIAL_SCOPE);
  const reset = useCallback(() => setScope(INITIAL_SCOPE), []);
  return [scope, setScope, reset] as const;
}

/** 0-based page indices the scope covers, or an error to show. */
export function resolveScope(
  s: ScopeState,
  pageCount: number
): { pages: number[]; error: string | null } {
  const all = Array.from({ length: pageCount }, (_, i) => i);
  switch (s.scope) {
    case "all":
      return { pages: all, error: null };
    case "odd":
      return { pages: all.filter((i) => i % 2 === 0), error: null };
    case "even": {
      const pages = all.filter((i) => i % 2 === 1);
      return { pages, error: pages.length ? null : "This PDF has no even pages." };
    }
    case "selected": {
      const pages = [...s.selected].filter((p) => p >= 1 && p <= pageCount).sort((a, b) => a - b);
      return {
        pages: pages.map((p) => p - 1),
        error: pages.length ? null : "Click the pages you want on the thumbnails.",
      };
    }
    case "range": {
      if (!s.range.trim()) return { pages: [], error: "Enter the pages, e.g. 1-3, 5." };
      try {
        return { pages: parsePageRange(s.range, pageCount).map((p) => p - 1), error: null };
      } catch (e) {
        return {
          pages: [],
          error: `${e instanceof Error ? e.message : "Invalid page range"} (this PDF has ${pageCount} pages).`,
        };
      }
    }
    default:
      return { pages: all, error: null };
  }
}

export function ScopePicker({
  doc,
  value,
  onChange,
  alwaysShowGrid = false,
}: {
  doc: LoadedPdf;
  value: ScopeState;
  onChange: (s: ScopeState) => void;
  alwaysShowGrid?: boolean;
}) {
  const { thumbnails, loadThumbnail } = useThumbnails(doc.pdfjs);
  const { pages } = resolveScope(value, doc.pageCount);
  const highlighted = new Set(pages.map((i) => i + 1));
  if (doc.pageCount < 2) return null;
  const showGrid = alwaysShowGrid || value.scope === "selected";

  return (
    <div className="space-y-3">
      <PageScopeSelector
        scope={value.scope}
        onScopeChange={(scope) => onChange({ ...value, scope })}
        rangeInput={value.range}
        onRangeInputChange={(range) => onChange({ ...value, range })}
        pageCount={doc.pageCount}
        selectedCount={value.selected.size}
      />
      {showGrid && doc.pdfjs && (
        <PdfPageGrid
          key={doc.file.name + doc.file.size}
          pageCount={doc.pageCount}
          thumbnails={thumbnails}
          selectedPages={highlighted}
          onTogglePage={(p) => {
            const selected = new Set(value.scope === "selected" ? value.selected : highlighted);
            if (selected.has(p)) selected.delete(p);
            else selected.add(p);
            onChange({ ...value, scope: "selected", selected });
          }}
          onLoadThumbnail={loadThumbnail}
        />
      )}
    </div>
  );
}
