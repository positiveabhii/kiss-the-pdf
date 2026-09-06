import { useState, useCallback, useMemo } from "react";
import { parsePageRange } from "../utils/page-range-parser";

export type PageScope = "all" | "selected" | "range" | "odd" | "even";

export function usePageSelection(pageCount: number) {
  const [scope, setScope] = useState<PageScope>("all");
  const [selectedPages, setSelectedPages] = useState<Set<number>>(new Set());
  const [rangeInput, setRangeInput] = useState("");

  const togglePage = useCallback((page: number) => {
    setSelectedPages((prev) => {
      const next = new Set(prev);
      if (next.has(page)) next.delete(page);
      else next.add(page);
      return next;
    });
    setScope("selected");
  }, []);

  const selectAll = useCallback(() => {
    const all = new Set<number>();
    for (let i = 1; i <= pageCount; i++) all.add(i);
    setSelectedPages(all);
    setScope("all");
  }, [pageCount]);

  const clearSelection = useCallback(() => {
    setSelectedPages(new Set());
    setScope("selected");
  }, []);

  const resolvedPages = useMemo((): number[] => {
    if (pageCount === 0) return [];

    switch (scope) {
      case "all":
        return Array.from({ length: pageCount }, (_, i) => i + 1);
      case "selected":
        return Array.from(selectedPages).sort((a, b) => a - b);
      case "range": {
        if (!rangeInput.trim()) return [];
        try {
          return parsePageRange(rangeInput, pageCount);
        } catch {
          return [];
        }
      }
      case "odd":
        return Array.from({ length: pageCount }, (_, i) => i + 1).filter((p) => p % 2 === 1);
      case "even":
        return Array.from({ length: pageCount }, (_, i) => i + 1).filter((p) => p % 2 === 0);
      default:
        return [];
    }
  }, [scope, selectedPages, rangeInput, pageCount]);

  const reset = useCallback(() => {
    setScope("all");
    setSelectedPages(new Set());
    setRangeInput("");
  }, []);

  return {
    scope,
    setScope,
    selectedPages,
    togglePage,
    selectAll,
    clearSelection,
    rangeInput,
    setRangeInput,
    resolvedPages,
    reset,
  };
}
