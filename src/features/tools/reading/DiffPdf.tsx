"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown, ChevronUp, Copy, Download, FileText, Loader2, Sparkles, X } from "lucide-react";

import { downloadBlob } from "@/features/pdf/utils/download-utils";
import { FileDropZone } from "../core/FileDropZone";
import { openPdfJs } from "../core/pdfjs";
import { outputName, readFileBytes, UserFacingError } from "../core/pdf-io";
import { Checkbox, Notice } from "../core/ui";
import { diffDocuments, pageRef, textReport, type Change, type DiffOptions, type DiffResult, type DocText, type Seg } from "./ops/diff";

/**
 * Compare the text of two PDFs, word by word, entirely in the browser.
 * Deterministic and free: no AI and no network (for meaning-level comparison
 * there is the AI Compare PDFs tool).
 */

interface LoadedDoc extends DocText {
  pageCount: number;
  emptyPages: number;
  words: number;
}

/** Rebuild reading lines from pdf.js text items: a new line when the baseline moves. */
async function extractText(file: File, onProgress: (done: number, total: number) => void): Promise<LoadedDoc> {
  const bytes = await readFileBytes(file);
  let doc;
  try {
    doc = await openPdfJs(bytes);
  } catch (e) {
    if (e instanceof Error && e.name === "PasswordException") {
      throw new UserFacingError("This PDF is password-protected. Remove the password first with the Remove PDF Password tool.");
    }
    throw new UserFacingError("This file couldn't be read as a PDF.");
  }
  const pages: string[][] = [];
  let emptyPages = 0;
  let wordCount = 0;
  try {
    for (let p = 1; p <= doc.numPages; p++) {
      const content = await (await doc.getPage(p)).getTextContent();
      const lines: string[] = [];
      let line = "";
      let lastY: number | null = null;
      let lastEnd = 0;
      for (const item of content.items) {
        if (!("str" in item)) continue;
        const [, , , d, x, y] = item.transform as number[];
        const h = item.height || Math.abs(d) || 10;
        if (lastY !== null && Math.abs(y - lastY) > h * 0.5) {
          lines.push(line);
          line = "";
        } else if (line && !/\s$/.test(line) && !/^\s/.test(item.str) && x - lastEnd > h * 0.15) {
          line += " ";
        }
        line += item.str;
        lastEnd = x + item.width;
        lastY = y;
        if (item.hasEOL) {
          lines.push(line);
          line = "";
          lastY = null;
        }
      }
      if (line) lines.push(line);
      const clean = lines.map((l) => l.replace(/\s+/g, " ").trim()).filter(Boolean);
      if (clean.length === 0) emptyPages++;
      wordCount += clean.reduce((n, l) => n + l.split(" ").length, 0);
      pages.push(clean);
      if (p % 5 === 0 || p === doc.numPages) onProgress(p, doc.numPages);
    }
  } finally {
    void doc.loadingTask.destroy();
  }
  return { name: file.name, pages, pageCount: pages.length, emptyPages, words: wordCount };
}

function Segs({ segs, show }: { segs: Seg[]; show: "a" | "b" | "both" }) {
  return (
    <>
      {segs.map((s, i) => {
        if (s.kind === "equal") return <span key={i}>{s.text} </span>;
        if (s.kind === "del" && show !== "b") {
          return (
            <span key={i}>
              <del className="rounded-sm bg-red-100 px-0.5 text-red-800 decoration-red-500">{s.text}</del>{" "}
            </span>
          );
        }
        if (s.kind === "ins" && show !== "a") {
          return (
            <span key={i}>
              <ins className="rounded-sm bg-emerald-100 px-0.5 text-emerald-900 no-underline">{s.text}</ins>{" "}
            </span>
          );
        }
        return null;
      })}
    </>
  );
}

const KIND_LABEL: Record<Change["kind"], string> = { added: "Added", removed: "Removed", changed: "Changed", formatting: "Line breaks / spacing" };
const KIND_STYLE: Record<Change["kind"], string> = {
  added: "bg-emerald-50 text-emerald-700",
  removed: "bg-red-50 text-red-700",
  changed: "bg-amber-50 text-amber-800",
  formatting: "bg-slate-100 text-slate-600",
};

export default function DiffPdf() {
  const [docs, setDocs] = useState<(LoadedDoc | null)[]>([null, null]);
  const [loading, setLoading] = useState<{ slot: number; text: string } | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [options, setOptions] = useState<DiffOptions>({ ignoreCase: false, ignoreWhitespace: true, ignorePunctuation: false });
  const [result, setResult] = useState<{ key: string; data: DiffResult } | null>(null);
  const [diffError, setDiffError] = useState<{ key: string; message: string } | null>(null);
  const [progress, setProgress] = useState<string | null>(null);
  const [view, setView] = useState<"changes" | "side">("changes");
  const [active, setActive] = useState(0);
  const [copied, setCopied] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef(new Map<number, HTMLElement>());

  const [docA, docB] = docs;
  const runKey = docA && docB ? `${docA.name}|${docA.words}|${docB.name}|${docB.words}|${JSON.stringify(options)}` : "";

  // Re-run the diff whenever both documents are loaded or an option changes.
  useEffect(() => {
    if (!docA || !docB) return;
    let cancelled = false;
    const key = runKey;
    const t = window.setTimeout(() => {
      setProgress("Comparing…");
      diffDocuments(docA, docB, options, {
        isCancelled: () => cancelled,
        onProgress: (done, total) => !cancelled && total > 80 && setProgress(`Comparing… ${Math.round((done / total) * 100)}%`),
      })
        .then((data) => {
          if (cancelled || !data) return;
          setResult({ key, data });
          setActive(0);
        })
        .catch((e) => !cancelled && setDiffError({ key, message: e instanceof Error ? e.message : String(e) }))
        .finally(() => !cancelled && setProgress(null));
    }, 0);
    return () => {
      cancelled = true;
      window.clearTimeout(t);
    };
  }, [docA, docB, options, runKey]);

  const current = result && result.key === runKey ? result.data : null;
  const currentError = diffError && diffError.key === runKey ? diffError.message : null;
  const changes = current?.changes ?? [];
  const report = useMemo(() => (current && docA && docB ? textReport(docA.name, docB.name, current, options) : ""), [current, docA, docB, options]);
  const scanned = docs.filter((d): d is LoadedDoc => d !== null && d.words === 0);

  async function addFile(slot: number, file: File) {
    setFileError(null);
    setLoading({ slot, text: "Reading PDF…" });
    try {
      const doc = await extractText(file, (done, total) => setLoading({ slot, text: `Reading page ${done} of ${total}…` }));
      setDocs((d) => d.map((x, i) => (i === slot ? doc : x)));
    } catch (e) {
      setFileError(e instanceof UserFacingError ? e.message : "This PDF couldn't be read.");
    } finally {
      setLoading(null);
    }
  }

  function goTo(index: number) {
    if (!changes.length) return;
    const i = (index + changes.length) % changes.length;
    setActive(i);
    const el = itemRefs.current.get(i);
    const panel = panelRef.current;
    if (el && panel) panel.scrollTo({ top: el.offsetTop - 12, behavior: "smooth" });
  }

  const copyReport = async () => {
    await navigator.clipboard?.writeText(report);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };
  const downloadReport = () =>
    downloadBlob(new TextEncoder().encode(report), outputName(docA?.name ?? "comparison.pdf", "comparison", "txt"), "text/plain;charset=utf-8");

  return (
    <div className="flex flex-col gap-3 lg:h-[calc(100dvh-300px)] lg:min-h-[520px]">
      {/* Files */}
      <div className="grid shrink-0 gap-3 sm:grid-cols-2">
        {docs.map((doc, slot) => {
          const label = slot === 0 ? "A · Original" : "B · Revised";
          if (doc) {
            return (
              <div key={slot} className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 py-2.5">
                <FileText size={17} className="shrink-0 text-slate-400" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-slate-900">
                    <span className="mr-1.5 text-slate-400">{slot === 0 ? "A" : "B"}</span>
                    {doc.name}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    {doc.pageCount} pages · {doc.words.toLocaleString()} words
                    {doc.emptyPages > 0 && doc.words > 0 && ` · ${doc.emptyPages} pages without text skipped`}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setDocs((d) => d.map((x, i) => (i === slot ? null : x)))}
                  className="rounded p-1 text-slate-400 hover:text-slate-900"
                  aria-label={`Remove ${doc.name}`}
                >
                  <X size={15} />
                </button>
              </div>
            );
          }
          if (loading?.slot === slot) {
            return (
              <div key={slot} className="flex items-center justify-center gap-2 rounded-lg border border-dashed border-slate-300 py-6 text-sm text-slate-500">
                <Loader2 size={15} className="animate-spin" /> {loading.text}
              </div>
            );
          }
          return (
            <FileDropZone
              key={slot}
              accept="application/pdf,.pdf"
              onFiles={(f) => f[0] && addFile(slot, f[0])}
              title={`Select PDF ${label}`}
              subtitle="Drag and drop, or click to browse"
              formatsLabel="PDF · compared locally in your browser"
              compact
              disabled={loading !== null}
            />
          );
        })}
      </div>
      {fileError && <Notice tone="error">{fileError}</Notice>}

      {/* Options + toolbar */}
      {docA && docB && (
        <div className="flex shrink-0 flex-wrap items-center justify-between gap-x-6 gap-y-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5">
            <Checkbox id="diff-case" checked={options.ignoreCase} onChange={(v) => setOptions((o) => ({ ...o, ignoreCase: v }))} label="Ignore case" />
            <Checkbox id="diff-space" checked={options.ignoreWhitespace} onChange={(v) => setOptions((o) => ({ ...o, ignoreWhitespace: v }))} label="Ignore spacing and line breaks" />
            <Checkbox id="diff-punct" checked={options.ignorePunctuation} onChange={(v) => setOptions((o) => ({ ...o, ignorePunctuation: v }))} label="Ignore punctuation" />
          </div>
          <div className="flex items-center gap-1 rounded-md bg-slate-100 p-1" role="radiogroup" aria-label="View">
            {(
              [
                ["changes", "Changes only"],
                ["side", "Side by side"],
              ] as const
            ).map(([v, label]) => (
              <button
                key={v}
                type="button"
                role="radio"
                aria-checked={view === v}
                onClick={() => setView(v)}
                className={`rounded px-2.5 py-1 text-xs font-medium ${view === v ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-900"}`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      )}

      {current && (
        <div className="flex shrink-0 flex-wrap items-center justify-between gap-3">
          <dl className="flex flex-wrap items-center gap-x-5 gap-y-1 text-sm" aria-label="Comparison summary">
            <div className="flex items-baseline gap-1.5">
              <dt className="text-slate-500">Similarity</dt>
              <dd className="font-semibold text-slate-900">{current.stats.similarity}%</dd>
            </div>
            <div className="flex items-baseline gap-1.5">
              <dt className="text-slate-500">Changed sections</dt>
              <dd className="font-semibold text-slate-900">{current.stats.changedSections}</dd>
            </div>
            <div className="flex items-baseline gap-1.5">
              <dt className="text-slate-500">Words added</dt>
              <dd className="font-semibold text-emerald-700">+{current.stats.added.toLocaleString()}</dd>
            </div>
            <div className="flex items-baseline gap-1.5">
              <dt className="text-slate-500">Words removed</dt>
              <dd className="font-semibold text-red-700">−{current.stats.removed.toLocaleString()}</dd>
            </div>
          </dl>
          <div className="flex items-center gap-1.5">
            {changes.length > 0 && (
              <>
                <span className="mr-1 text-xs tabular-nums text-slate-500" aria-live="polite">
                  Change {active + 1} of {changes.length}
                </span>
                <button type="button" onClick={() => goTo(active - 1)} className="rounded-md border border-slate-200 p-1.5 text-slate-600 hover:bg-slate-50" aria-label="Previous change">
                  <ChevronUp size={15} />
                </button>
                <button type="button" onClick={() => goTo(active + 1)} className="rounded-md border border-slate-200 p-1.5 text-slate-600 hover:bg-slate-50" aria-label="Next change">
                  <ChevronDown size={15} />
                </button>
              </>
            )}
            <button type="button" onClick={copyReport} className="ml-1 flex items-center gap-1.5 rounded-md border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50">
              <Copy size={13} /> {copied ? "Copied" : "Copy report"}
            </button>
            <button type="button" onClick={downloadReport} className="flex items-center gap-1.5 rounded-md bg-slate-900 px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-slate-800">
              <Download size={13} /> Download report
            </button>
          </div>
        </div>
      )}

      {/* Results panel: scrolls on its own so the page doesn't grow */}
      <div ref={panelRef} className="relative min-h-[320px] flex-1 overflow-y-auto rounded-lg border border-slate-200 bg-white lg:min-h-0" aria-label="Differences">
        {!docA || !docB ? (
          <div className="flex h-full flex-col items-center justify-center gap-2 p-8 text-center">
            <p className="text-sm font-medium text-slate-700">Add the original (A) and revised (B) PDFs above.</p>
            <p className="max-w-md text-xs leading-relaxed text-slate-500">
              Every added and removed word is marked, with page numbers in both files. Nothing is uploaded: the comparison runs in your browser.
            </p>
          </div>
        ) : scanned.length > 0 ? (
          <div className="p-6">
            <Notice tone="warning">
              {scanned.map((d) => d.name).join(" and ")} {scanned.length > 1 ? "have" : "has"} no text layer (likely scanned), so there is no text to compare. Use{" "}
              <Link href="/compare-pdf" className="font-semibold underline">
                AI Compare PDFs
              </Link>{" "}
              with Claude or Gemini, which can read scanned pages.
            </Notice>
          </div>
        ) : currentError ? (
          <div className="p-6">
            <Notice tone="error">{currentError}</Notice>
          </div>
        ) : !current ? (
          <div className="flex h-full items-center justify-center gap-2 text-sm text-slate-500">
            <Loader2 size={15} className="animate-spin" /> {progress ?? "Comparing…"}
          </div>
        ) : changes.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-1 p-8 text-center">
            <p className="text-sm font-semibold text-slate-900">No differences found</p>
            <p className="text-xs text-slate-500">The text of both PDFs is the same with the current options.</p>
          </div>
        ) : view === "changes" ? (
          <ol className="divide-y divide-slate-100">
            {changes.map((c, i) => (
              <li
                key={c.id}
                ref={(el) => {
                  if (el) itemRefs.current.set(i, el);
                  else itemRefs.current.delete(i);
                }}
                onClick={() => setActive(i)}
                className={`space-y-2 px-5 py-4 ${i === active ? "bg-amber-50/40 ring-1 ring-inset ring-amber-200" : ""}`}
              >
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="font-semibold text-slate-900">#{i + 1}</span>
                  <span className={`rounded px-1.5 py-0.5 font-medium ${KIND_STYLE[c.kind]}`}>{KIND_LABEL[c.kind]}</span>
                  <span className="text-slate-500">
                    A {pageRef(c.aPages)} → B {pageRef(c.bPages)}
                  </span>
                  <span className="ml-auto tabular-nums text-slate-400">
                    {c.added > 0 && <span className="text-emerald-700">+{c.added} </span>}
                    {c.removed > 0 && <span className="text-red-700">−{c.removed}</span>}
                  </span>
                </div>
                {c.before.length > 0 && <p className="truncate text-xs text-slate-400">… {c.before.join(" ")}</p>}
                <p className="text-sm leading-relaxed text-slate-800">
                  <Segs segs={c.merged} show="both" />
                </p>
                {c.after.length > 0 && <p className="truncate text-xs text-slate-400">{c.after.join(" ")} …</p>}
              </li>
            ))}
          </ol>
        ) : (
          <div>
            <div className="sticky top-0 z-10 grid grid-cols-2 border-b border-slate-200 bg-slate-50 text-xs font-semibold text-slate-600">
              <p className="truncate px-4 py-2">A · {docA.name}</p>
              <p className="truncate border-l border-slate-200 px-4 py-2">B · {docB.name}</p>
            </div>
            {changes.map((c, i) => (
              <div
                key={c.id}
                ref={(el) => {
                  if (el) itemRefs.current.set(i, el);
                  else itemRefs.current.delete(i);
                }}
                onClick={() => setActive(i)}
                className={`border-b border-slate-100 ${i === active ? "bg-amber-50/40 ring-1 ring-inset ring-amber-200" : ""}`}
              >
                {c.before.length > 0 && (
                  <div className="grid grid-cols-2 text-xs text-slate-400">
                    <p className="truncate px-4 pt-3">… {c.before.join(" ")}</p>
                    <p className="truncate border-l border-slate-100 px-4 pt-3">… {c.before.join(" ")}</p>
                  </div>
                )}
                <div className="grid grid-cols-2 text-sm leading-relaxed text-slate-800">
                  <div className="space-y-1 px-4 py-3">
                    <p className="text-[11px] text-slate-400">
                      #{i + 1} · A {pageRef(c.aPages)}
                    </p>
                    <p>{c.a.length ? <Segs segs={c.a} show="a" /> : <span className="text-xs italic text-slate-400">(not in A)</span>}</p>
                  </div>
                  <div className="space-y-1 border-l border-slate-100 px-4 py-3">
                    <p className="text-[11px] text-slate-400">B {pageRef(c.bPages)}</p>
                    <p>{c.b.length ? <Segs segs={c.b} show="b" /> : <span className="text-xs italic text-slate-400">(removed in B)</span>}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <p className="flex shrink-0 items-center gap-1.5 text-[11px] text-slate-500">
        <Sparkles size={12} />
        Need a meaning-level comparison instead of word-by-word?{" "}
        <Link href="/compare-pdf" className="font-medium text-blue-700 hover:underline">
          Try AI Compare PDFs
        </Link>
      </p>
    </div>
  );
}
