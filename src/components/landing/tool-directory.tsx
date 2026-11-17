"use client";

import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import {
  ArrowUpRight,
  FileStack,
  FilePen,
  Files,
  ImageIcon,
  LayoutTemplate,
  MonitorPlay,
  Search,
  ShieldCheck,
  Sparkles,
  X,
  type LucideIcon,
} from "lucide-react";
import {
  LANDING_CATEGORIES,
  LANDING_TOOLS,
  searchLandingTools,
  type LandingToolCategoryId,
} from "@/config/landing-tools";
import { Reveal } from "./reveal";
import { cn } from "@/lib/utils";

const CATEGORY_ICON: Record<LandingToolCategoryId, LucideIcon> = {
  organization: Files,
  "page-manipulation": LayoutTemplate,
  convert: ImageIcon,
  editing: FilePen,
  security: ShieldCheck,
  "forms-signatures": FileStack,
  enhancement: Sparkles,
  reading: MonitorPlay,
};

const FILTERS: { id: LandingToolCategoryId | "all"; label: string }[] = [
  { id: "all", label: "All" },
  ...LANDING_CATEGORIES.map((c) => ({ id: c.id, label: c.label })),
];

interface ToolDirectoryProps {
  searchInputRef?: React.RefObject<HTMLInputElement | null>;
}

/**
 * The full tool index. Default view is an editorial index: every category as a
 * column of plain links (compact, and every tool is one crawlable link).
 * Searching or filtering switches to a list of matching tools with descriptions.
 */
export function ToolDirectory({ searchInputRef }: ToolDirectoryProps) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<LandingToolCategoryId | "all">("all");
  const internalRef = useRef<HTMLInputElement>(null);
  const inputRef = searchInputRef ?? internalRef;

  const results = useMemo(() => searchLandingTools(query, filter), [query, filter]);
  const isFiltering = Boolean(query.trim()) || filter !== "all";

  return (
    <section id="tools" className="relative scroll-mt-16 bg-white py-24 sm:py-28">
      <div className="absolute inset-x-0 top-0 h-px bg-[var(--kp-border)]" aria-hidden="true" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-2xl">
              <p className="kp-label mb-3 text-[var(--kp-accent)]">The toolbox</p>
              <h2 className="kp-heading text-[var(--kp-text)]">
                Every PDF tool, <em>one</em> page.
              </h2>
              <p className="mt-3 text-[var(--kp-text-secondary)]">
                {LANDING_TOOLS.length} tools for pages, conversion, editing, forms and security. Pick one and drop in your file.
              </p>
            </div>
            <div className="relative w-full max-w-sm">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--kp-text-muted)]" aria-hidden="true" />
              <input
                ref={inputRef}
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search tools, e.g. “compress”"
                aria-label="Search PDF tools"
                className="w-full rounded-xl border border-[var(--kp-border)] bg-[var(--kp-bg)] py-3 pl-10 pr-10 text-sm transition-colors focus:border-[var(--kp-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--kp-accent)]/20"
              />
              {query ? (
                <button
                  type="button"
                  onClick={() => {
                    setQuery("");
                    inputRef.current?.focus();
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-0.5 text-[var(--kp-text-muted)] hover:text-[var(--kp-text)]"
                  aria-label="Clear search"
                >
                  <X className="h-4 w-4" />
                </button>
              ) : (
                <kbd className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 rounded border border-[var(--kp-border)] bg-white px-1.5 font-mono text-[10px] text-[var(--kp-text-muted)] sm:block">
                  /
                </kbd>
              )}
            </div>
          </div>
        </Reveal>

        <div className="mt-8 flex flex-wrap gap-2" role="group" aria-label="Filter by category">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilter(f.id)}
              aria-pressed={filter === f.id}
              className={cn(
                "rounded-full border px-3.5 py-1.5 text-[13px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--kp-accent)]",
                filter === f.id
                  ? "border-[var(--kp-text)] bg-[var(--kp-text)] text-white"
                  : "border-[var(--kp-border)] text-[var(--kp-text-secondary)] hover:border-[var(--kp-border-hover)] hover:text-[var(--kp-text)]"
              )}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="mt-10" aria-live="polite">
          {!isFiltering ? (
            <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
              {LANDING_CATEGORIES.map((cat) => {
                const Icon = CATEGORY_ICON[cat.id];
                const items = LANDING_TOOLS.filter((t) => t.category === cat.id);
                return (
                  <div key={cat.id} id={cat.id} className="scroll-mt-24">
                    <div className="mb-4 flex items-center gap-2.5 border-b border-[var(--kp-border)] pb-3">
                      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--kp-accent-soft)] text-[var(--kp-accent)]">
                        <Icon size={15} strokeWidth={1.9} aria-hidden="true" />
                      </span>
                      <h3 className="text-sm font-semibold text-[var(--kp-text)]">{cat.heading}</h3>
                      <span className="ml-auto text-xs tabular-nums text-[var(--kp-text-muted)]">{items.length}</span>
                    </div>
                    <ul className="space-y-0.5">
                      {items.map((t) => (
                        <li key={t.id}>
                          <Link
                            href={t.route ?? "#"}
                            title={t.description}
                            className="group -mx-2 flex items-center justify-between rounded-md px-2 py-1.5 text-[14px] text-[var(--kp-text-secondary)] transition-colors hover:bg-[var(--kp-bg)] hover:text-[var(--kp-text)]"
                          >
                            {t.name}
                            <ArrowUpRight size={13} className="text-[var(--kp-accent)] opacity-0 transition-opacity group-hover:opacity-100" aria-hidden="true" />
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          ) : results.length > 0 ? (
            <>
              <p className="mb-4 text-sm text-[var(--kp-text-muted)]">
                <span className="font-medium text-[var(--kp-text)]">{results.length}</span> {results.length === 1 ? "tool" : "tools"}
              </p>
              <ul className="grid gap-px overflow-hidden rounded-2xl border border-[var(--kp-border)] bg-[var(--kp-border)] sm:grid-cols-2 lg:grid-cols-3">
                {results.map((t) => {
                  const Icon = CATEGORY_ICON[t.category];
                  return (
                    <li key={t.id} className="bg-white">
                      <Link href={t.route ?? "#"} className="group flex h-full gap-3.5 p-4 transition-colors hover:bg-[var(--kp-bg)]">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--kp-accent-soft)] text-[var(--kp-accent)] transition-colors group-hover:bg-[var(--kp-accent)] group-hover:text-white">
                          <Icon size={17} strokeWidth={1.8} aria-hidden="true" />
                        </span>
                        <span className="min-w-0">
                          <span className="block text-sm font-semibold text-[var(--kp-text)]">{t.name}</span>
                          <span className="mt-0.5 line-clamp-2 block text-[13px] leading-relaxed text-[var(--kp-text-muted)]">{t.description}</span>
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </>
          ) : (
            <div className="rounded-2xl border border-dashed border-[var(--kp-border)] px-4 py-16 text-center">
              <p className="text-[var(--kp-text)]">No tools match “{query}”.</p>
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setFilter("all");
                }}
                className="mt-3 text-sm font-semibold text-[var(--kp-accent-hover)] hover:underline"
              >
                Clear search
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
