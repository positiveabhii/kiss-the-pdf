"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { PDFDocumentProxy, PageViewport } from "pdfjs-dist";
import { Loader2, Search, X } from "lucide-react";

import { Checkbox, Notice } from "../core/ui";
import { isTextItem, quadBounds, searchPage, type SearchMatch, type SearchTextItem } from "./ops/search";
import { ReaderView, type ReaderHandle } from "./viewer/ReaderView";
import { ViewerShell } from "./viewer/ViewerShell";

/** Text items per page, read once per document. */
class TextCache {
  private cache = new Map<number, Promise<SearchTextItem[]>>();
  constructor(private doc: PDFDocumentProxy) {}
  get(page: number): Promise<SearchTextItem[]> {
    let p = this.cache.get(page);
    if (!p) {
      p = this.doc
        .getPage(page)
        .then((pg) => pg.getTextContent())
        .then((tc) => tc.items.filter(isTextItem) as SearchTextItem[]);
      this.cache.set(page, p);
    }
    return p;
  }
}

interface SearchState {
  key: string;
  matches: SearchMatch[];
  scanned: number;
  done: boolean;
  /** Pages with no text at all (likely scanned). */
  emptyPages: number;
}

function SearchReader({ doc, fileName, openAnother }: { doc: PDFDocumentProxy; fileName: string; openAnother: () => void }) {
  const [query, setQuery] = useState("");
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [wholeWord, setWholeWord] = useState(false);
  const [state, setState] = useState<SearchState | null>(null);
  const [active, setActive] = useState<number>(-1);
  const reader = useRef<ReaderHandle>(null);
  const texts = useMemo(() => new TextCache(doc), [doc]);
  const n = doc.numPages;

  const q = query.trim();
  const key = `${q}|${caseSensitive}|${wholeWord}`;

  // Search all pages progressively; a new query cancels the old one.
  useEffect(() => {
    if (!q) return;
    let cancelled = false;
    const timer = window.setTimeout(async () => {
      const matches: SearchMatch[] = [];
      let empty = 0;
      for (let p = 1; p <= n; p++) {
        if (cancelled) return;
        const items = await texts.get(p).catch(() => [] as SearchTextItem[]);
        if (!items.some((i) => i.str.trim())) empty++;
        matches.push(...searchPage(p, items, q, { caseSensitive, wholeWord }));
        if (p % 10 === 0 || p === n) {
          if (cancelled) return;
          setState({ key, matches: [...matches], scanned: p, done: p === n, emptyPages: empty });
        }
      }
    }, 250);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [q, caseSensitive, wholeWord, key, n, texts]);

  const current = state && state.key === key && q ? state : null;
  const matches = useMemo(() => current?.matches ?? [], [current]);
  const byPage = useMemo(() => {
    const m = new Map<number, { match: SearchMatch; global: number }[]>();
    matches.forEach((match, global) => m.set(match.page, [...(m.get(match.page) ?? []), { match, global }]));
    return m;
  }, [matches]);

  const jump = (i: number) => {
    const m = matches[i];
    if (!m) return;
    setActive(i);
    const b = quadBounds(m.quads[0]);
    reader.current?.goToPage(m.page, { pdfX: (b.x0 + b.x1) / 2, pdfY: (b.y0 + b.y1) / 2 });
  };

  const overlay = (page: number, vp: PageViewport) => {
    const list = byPage.get(page);
    if (!list) return null;
    return (
      <svg width={vp.width} height={vp.height} className="absolute inset-0" aria-hidden="true">
        {list.flatMap(({ match, global }) =>
          match.quads.map((quad, k) => (
            <polygon
              key={`${global}-${k}`}
              points={quad.map(([x, y]) => vp.convertToViewportPoint(x, y).join(",")).join(" ")}
              fill={global === active ? "rgba(234,88,12,0.45)" : "rgba(250,204,21,0.45)"}
              stroke={global === active ? "rgb(234,88,12)" : "none"}
              strokeWidth={1}
              style={{ mixBlendMode: "multiply" }}
            />
          ))
        )}
      </svg>
    );
  };

  const sidebar = () => (
    <div className="flex flex-col min-h-0 h-full">
      <div className="p-2 space-y-2 border-b border-slate-200 bg-white">
        <div className="relative">
          <Search size={14} className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            aria-label="Search text"
            placeholder="Search…"
            autoFocus
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActive(-1);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && matches.length) {
                e.preventDefault();
                jump(e.shiftKey ? (active - 1 + matches.length) % matches.length : (active + 1) % matches.length);
              }
            }}
            className="w-full pl-7 pr-7 py-1.5 text-sm text-slate-900 border border-slate-200 rounded-md focus:outline-none focus:border-slate-400"
          />
          {query && (
            <button
              type="button"
              aria-label="Clear search"
              onClick={() => setQuery("")}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-slate-700"
            >
              <X size={14} />
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-x-3 gap-y-1 [&_label]:text-xs">
          <Checkbox id="s-case" checked={caseSensitive} onChange={setCaseSensitive} label="Match case" />
          <Checkbox id="s-word" checked={wholeWord} onChange={setWholeWord} label="Whole words" />
        </div>
        <div className="flex items-center justify-between text-[11px] text-slate-500 min-h-5">
          {!q ? (
            <span>Type to search all {n} pages.</span>
          ) : !current ? (
            <span className="flex items-center gap-1">
              <Loader2 size={12} className="animate-spin" /> Searching…
            </span>
          ) : (
            <span className="flex items-center gap-1">
              {!current.done && <Loader2 size={12} className="animate-spin" />}
              {matches.length} match{matches.length === 1 ? "" : "es"}
              {!current.done && ` (page ${current.scanned}/${n})`}
            </span>
          )}
          {matches.length > 0 && (
            <span className="flex gap-1">
              <button type="button" className="px-1.5 border border-slate-200 rounded hover:bg-slate-100" onClick={() => jump((active - 1 + matches.length) % matches.length)} aria-label="Previous match">
                ↑
              </button>
              <button type="button" className="px-1.5 border border-slate-200 rounded hover:bg-slate-100" onClick={() => jump((active + 1) % matches.length)} aria-label="Next match">
                ↓
              </button>
            </span>
          )}
        </div>
      </div>
      <ul className="flex-1 min-h-0 overflow-y-auto divide-y divide-slate-100">
        {matches.slice(0, 2000).map((m, i) => (
          <li key={i}>
            <button
              type="button"
              onClick={() => jump(i)}
              className={`w-full text-left px-2.5 py-2 text-xs ${i === active ? "bg-amber-50" : "hover:bg-white"}`}
            >
              <span className="block text-[10px] font-semibold text-slate-500 mb-0.5">Page {m.page}</span>
              <span className="text-slate-600 break-words">
                {m.before && "…"}
                {m.before}
                <mark className="bg-amber-200 text-slate-900 rounded-sm px-0.5">{m.text}</mark>
                {m.after}
                {m.after && "…"}
              </span>
            </button>
          </li>
        ))}
        {matches.length > 2000 && <li className="px-2.5 py-2 text-[11px] text-slate-500">Showing the first 2000 matches.</li>}
        {current?.done && q && matches.length === 0 && (
          <li className="px-2.5 py-3 text-xs text-slate-500">
            No matches.
            {current.emptyPages === n
              ? " This PDF has no searchable text — it's probably scanned. Run OCR first."
              : current.emptyPages > 0
                ? ` ${current.emptyPages} page${current.emptyPages === 1 ? " has" : "s have"} no text (scanned?) and couldn't be searched.`
                : ""}
          </li>
        )}
      </ul>
    </div>
  );

  return (
    <ReaderView
      doc={doc}
      fileName={fileName}
      openAnother={openAnother}
      overlay={overlay}
      sidebar={sidebar}
      sidebarLabel="Search"
      sidebarClass="w-64 sm:w-72"
      handleRef={reader}
    />
  );
}

export default function PdfSearch() {
  return (
    <ViewerShell
      title="Select a PDF to search"
      intro={<Notice>Finds every match on every page and highlights it. Scanned pages without a text layer can&apos;t be searched.</Notice>}
    >
      {({ doc, file, openAnother }) => <SearchReader doc={doc} fileName={file.name} openAnother={openAnother} />}
    </ViewerShell>
  );
}
