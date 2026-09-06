"use client";

import { useMemo, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import {
  LANDING_CATEGORIES,
  LANDING_TOOLS,
  searchLandingTools,
  type LandingToolCategoryId,
} from "@/config/landing-tools";
import { LandingToolCard } from "./landing-tool-card";
import { Reveal, RevealGroup, RevealItem, StaggerGrid } from "./reveal";
import { cn } from "@/lib/utils";

const FILTER_OPTIONS: { id: LandingToolCategoryId | "all"; label: string }[] = [
  { id: "all", label: "All" },
  ...LANDING_CATEGORIES.map((c) => ({ id: c.id, label: c.label })),
];

interface ToolDirectoryProps {
  searchInputRef?: React.RefObject<HTMLInputElement | null>;
}

function CategorySection({
  cat,
  tools,
}: {
  cat: (typeof LANDING_CATEGORIES)[0];
  tools: typeof LANDING_TOOLS;
}) {
  return (
    <div id={cat.id} className="scroll-mt-28">
      <RevealGroup>
        <RevealItem index={0}>
          <p className="kp-label text-[var(--kp-accent)] mb-2">{cat.label}</p>
        </RevealItem>
        <RevealItem index={1}>
          <h3 className="text-xl font-semibold tracking-tight text-[var(--kp-text)] mb-1.5">
            {cat.heading}
          </h3>
        </RevealItem>
        <RevealItem index={2}>
          <p className="text-sm text-[var(--kp-text-muted)] mb-6 max-w-2xl">{cat.description}</p>
        </RevealItem>
      </RevealGroup>
      <StaggerGrid staggerMs={35} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {tools.map((tool) => (
          <LandingToolCard key={tool.id} tool={tool} />
        ))}
      </StaggerGrid>
    </div>
  );
}

export function ToolDirectory({ searchInputRef }: ToolDirectoryProps) {
  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<LandingToolCategoryId | "all">("all");
  const [searchFocused, setSearchFocused] = useState(false);
  const internalRef = useRef<HTMLInputElement>(null);
  const inputRef = searchInputRef ?? internalRef;

  const filteredTools = useMemo(
    () => searchLandingTools(query, categoryFilter),
    [query, categoryFilter]
  );

  const groupedResults = useMemo(() => {
    if (categoryFilter !== "all" || query) return null;
    return LANDING_CATEGORIES.map((cat) => ({
      ...cat,
      tools: LANDING_TOOLS.filter((t) => t.category === cat.id),
    }));
  }, [categoryFilter, query]);

  const resultCount = filteredTools.length;
  const isFiltering = Boolean(query) || categoryFilter !== "all";

  const clearSearch = () => {
    setQuery("");
    inputRef.current?.focus();
  };

  return (
    <section id="tools" className="py-20 sm:py-24 bg-[var(--kp-surface)] relative">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--kp-border)] to-transparent" aria-hidden="true" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal blur>
          <div className="max-w-2xl mb-12">
            <h2 className="kp-heading text-[var(--kp-text)] mb-3">
              Everything you need to work with PDFs
            </h2>
            <p className="kp-body-lg">
              One simple toolbox for documents, pages, images, security, and more.
            </p>
          </div>
        </Reveal>

        {/* Search bar — sticky */}
        <div className="sticky top-16 z-40 -mx-4 px-4 sm:mx-0 sm:px-0 py-4 mb-10 bg-[var(--kp-surface)]/95 backdrop-blur-md">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div
              className={cn(
                "relative flex-1 max-w-lg transition-shadow duration-200 rounded-lg",
                searchFocused && "shadow-[var(--kp-shadow-sm)]"
              )}
            >
              <Search
                className={cn(
                  "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none transition-colors duration-200",
                  searchFocused ? "text-[var(--kp-accent)]" : "text-[var(--kp-text-muted)]"
                )}
                aria-hidden="true"
              />
              <input
                ref={inputRef}
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                placeholder="Search PDF tools…"
                aria-label="Search PDF tools"
                className="w-full pl-10 pr-16 py-2.5 text-sm border border-[var(--kp-border)] rounded-lg bg-[var(--kp-bg)] focus:outline-none focus:ring-2 focus:ring-[var(--kp-accent)]/25 focus:border-[var(--kp-accent)] transition-all duration-200"
              />
              {!query && !searchFocused && (
                <kbd className="hidden sm:inline-flex absolute right-3 top-1/2 -translate-y-1/2 items-center px-1.5 py-0.5 text-[10px] font-mono text-[var(--kp-text-muted)] bg-[var(--kp-surface)] border border-[var(--kp-border)] rounded pointer-events-none">
                  /
                </kbd>
              )}
              {query && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 text-[var(--kp-text-muted)] hover:text-[var(--kp-text)] rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--kp-accent)]"
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <p className="text-sm text-[var(--kp-text-muted)] shrink-0 tabular-nums">
              {isFiltering ? (
                <>
                  <span className="font-medium text-[var(--kp-text)]">{resultCount}</span>{" "}
                  {resultCount === 1 ? "tool found" : "tools found"}
                </>
              ) : (
                <>
                  <span className="font-medium text-[var(--kp-text)]">100</span> tools
                </>
              )}
            </p>
          </div>

          <div className="flex flex-wrap gap-2 mt-3" role="group" aria-label="Filter by category">
            {FILTER_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setCategoryFilter(opt.id)}
                aria-pressed={categoryFilter === opt.id}
                className={cn(
                  "px-3 py-1.5 text-xs font-medium rounded-full border transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--kp-accent)]",
                  categoryFilter === opt.id
                    ? "border-[var(--kp-accent)] bg-[var(--kp-accent-soft)] text-[var(--kp-accent)] shadow-[var(--kp-shadow-xs)]"
                    : "border-[var(--kp-border)] text-[var(--kp-text-muted)] hover:border-[var(--kp-border-hover)] hover:text-[var(--kp-text)]"
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {groupedResults ? (
          <div className="space-y-16 sm:space-y-20">
            {groupedResults.map((cat) => (
              <CategorySection key={cat.id} cat={cat} tools={cat.tools} />
            ))}
          </div>
        ) : filteredTools.length > 0 ? (
          <StaggerGrid className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {filteredTools.map((tool) => (
              <LandingToolCard key={tool.id} tool={tool} />
            ))}
          </StaggerGrid>
        ) : (
          <Reveal>
            <div className="text-center py-20 px-4">
              <p className="text-[var(--kp-text-muted)] mb-1">No tools match your search.</p>
              <p className="text-sm text-[var(--kp-text-muted)] mb-4">
                Try a different keyword or category.
              </p>
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setCategoryFilter("all");
                }}
                className="text-sm font-medium text-[var(--kp-accent)] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--kp-accent)] rounded px-2 py-1"
              >
                Clear filters
              </button>
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}
