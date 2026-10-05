"use client";

import { useState } from "react";
import { ArrowDown, ArrowUp, FileText, GripVertical, X } from "lucide-react";

import { formatFileSize } from "@/features/pdf/utils/format-file-size";

import { FileDropZone } from "../core/FileDropZone";
import { outputName } from "../core/pdf-io";
import { Notice, PrimaryButton } from "../core/ui";
import { openPdfFile, type OpenedPdf } from "./components/open-pdf";
import { useToolRun } from "./components/useToolRun";
import { moveItems, nudge } from "./ops/list";
import { mergePdfs } from "./ops/merge";
import { tryParsePages } from "./ops/ranges";

interface Entry extends OpenedPdf {
  range: string;
}

const DRAG_TYPE = "application/x-kissthepdf-file";

function entryPages(e: Entry): { count: number; error: string | null } {
  if (!e.range.trim()) return { count: e.pageCount, error: null };
  const { pages, error } = tryParsePages(e.range, e.pageCount);
  return { count: pages.length, error };
}

/** Combine several PDFs, in an order you choose, each optionally limited to a page range. */
export default function MergePdf() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [rejected, setRejected] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [dragId, setDragId] = useState<string | null>(null);
  const [dropAt, setDropAt] = useState<number | null>(null);
  // Rows are only draggable while the grip is held, so text in the range field stays selectable.
  const [armed, setArmed] = useState<string | null>(null);
  const { view, execute, error } = useToolRun({
    processingMessage: "Merging PDFs…",
    onStartOver: () => {
      setEntries([]);
      setRejected([]);
    },
  });

  const addFiles = async (files: File[]) => {
    setLoading(true);
    const problems: string[] = [];
    const added: Entry[] = [];
    for (const f of files) {
      try {
        added.push({ ...(await openPdfFile(f)), range: "" });
      } catch (err) {
        problems.push(err instanceof Error ? err.message : `"${f.name}" couldn't be opened.`);
      }
    }
    setEntries((prev) => [...prev, ...added]);
    setRejected(problems);
    setLoading(false);
  };

  if (view) return view;

  const stats = entries.map(entryPages);
  const total = stats.reduce((n, s) => n + s.count, 0);
  const anyRangeError = stats.some((s) => s.error);
  const blocked =
    entries.length < 2
      ? "Add at least two PDFs to merge."
      : anyRangeError
        ? "Fix the highlighted page ranges."
        : total === 0
          ? "The merged PDF would have no pages."
          : null;

  const merge = () =>
    execute(async ({ onProgress, signal }) => {
      const { data, pageCount } = await mergePdfs(
        entries.map((e) => ({ bytes: e.bytes, name: e.file.name, range: e.range })),
        { onProgress, signal }
      );
      return {
        kind: "file",
        data,
        fileName: outputName(entries[0].file, "merged"),
        title: "PDFs merged",
        summary: `${entries.length} files combined into ${pageCount} pages.`,
      };
    });

  return (
    <div className="w-full min-w-0 max-w-3xl mx-auto space-y-5">
      {entries.length === 0 ? (
        <FileDropZone
          multiple
          accept="application/pdf,.pdf"
          title={loading ? "Opening…" : "Select PDF files to merge"}
          formatsLabel="PDF · Processed locally in your browser"
          disabled={loading}
          onFiles={(f) => void addFiles(f)}
          onRejected={(bad) => setRejected(bad.map((f) => `"${f.name}" isn't a PDF.`))}
        />
      ) : (
        <>
          <div className="flex items-baseline justify-between gap-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Files, in merge order
            </h3>
            <span className="text-[11px] font-mono text-slate-500">
              {entries.length} files · {total} pages
            </span>
          </div>
          <ol
            className="space-y-2"
            aria-label="Files to merge"
            onDragOver={(e) => {
              if (dragId && e.dataTransfer.types.includes(DRAG_TYPE)) e.preventDefault();
            }}
            onDrop={(e) => {
              if (!dragId || !e.dataTransfer.types.includes(DRAG_TYPE)) return;
              e.preventDefault();
              e.stopPropagation();
              if (dropAt !== null) setEntries((prev) => moveItems(prev, [dragId], dropAt));
              setDragId(null);
              setDropAt(null);
            }}
          >
            {entries.map((entry, i) => {
              const s = stats[i];
              const rangeId = `merge-range-${entry.id}`;
              return (
                <li
                  key={entry.id}
                  draggable={armed === entry.id}
                  onDragStart={(e) => {
                    setDragId(entry.id);
                    e.dataTransfer.effectAllowed = "move";
                    e.dataTransfer.setData(DRAG_TYPE, entry.id);
                  }}
                  onDragEnd={() => {
                    setDragId(null);
                    setDropAt(null);
                    setArmed(null);
                  }}
                  onDragOver={(e) => {
                    if (!dragId || !e.dataTransfer.types.includes(DRAG_TYPE)) return;
                    e.preventDefault();
                    const r = e.currentTarget.getBoundingClientRect();
                    setDropAt(e.clientY < r.top + r.height / 2 ? i : i + 1);
                  }}
                  className={`relative flex flex-wrap items-center gap-x-3 gap-y-2 p-3 bg-white border rounded-md shadow-2xs ${
                    dragId === entry.id ? "opacity-40" : ""
                  } ${s.error ? "border-red-200" : "border-slate-200"}`}
                >
                  {dropAt === i && dragId && (
                    <span aria-hidden="true" className="absolute -top-1.5 left-2 right-2 h-0.5 rounded bg-orange-500" />
                  )}
                  {dropAt === entries.length && i === entries.length - 1 && dragId && (
                    <span aria-hidden="true" className="absolute -bottom-1.5 left-2 right-2 h-0.5 rounded bg-orange-500" />
                  )}
                  <span
                    onPointerDown={() => setArmed(entry.id)}
                    onPointerUp={() => setArmed(null)}
                    title="Drag to reorder"
                    className="p-0.5 -m-0.5 text-slate-300 hover:text-slate-500 cursor-grab active:cursor-grabbing shrink-0"
                  >
                    <GripVertical size={16} aria-hidden="true" />
                  </span>
                  <span className="w-5 text-xs font-mono text-slate-400 shrink-0">{i + 1}</span>
                  <FileText size={16} className="text-slate-500 shrink-0" aria-hidden="true" />
                  <div className="flex-1 min-w-[140px]">
                    <p className="text-xs font-semibold text-slate-900 truncate" title={entry.file.name}>
                      {entry.file.name}
                    </p>
                    <p className="text-[11px] font-mono text-slate-500">
                      {formatFileSize(entry.file.size)} · {entry.pageCount} page{entry.pageCount === 1 ? "" : "s"}
                      {entry.range.trim() && !s.error && ` · using ${s.count}`}
                    </p>
                  </div>
                  <div className="w-full sm:w-44 order-last sm:order-none">
                    <label htmlFor={rangeId} className="sr-only">
                      Pages to include from {entry.file.name}
                    </label>
                    <input
                      id={rangeId}
                      type="text"
                      value={entry.range}
                      onChange={(e) => {
                        const range = e.target.value;
                        setEntries((prev) => prev.map((x) => (x.id === entry.id ? { ...x, range } : x)));
                      }}
                      placeholder={`All pages (1-${entry.pageCount})`}
                      aria-invalid={!!s.error}
                      aria-describedby={s.error ? `${rangeId}-err` : undefined}
                      className={`w-full px-2.5 py-1.5 text-xs font-mono bg-white border rounded-md placeholder:font-sans placeholder:text-slate-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 ${
                        s.error ? "border-red-300" : "border-slate-200"
                      }`}
                    />
                    {s.error && (
                      <p id={`${rangeId}-err`} className="mt-1 text-[11px] text-red-600">
                        {s.error}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-0.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => setEntries((prev) => nudge(prev, entry.id, -1))}
                      disabled={i === 0}
                      aria-label={`Move ${entry.file.name} up`}
                      className="p-1.5 rounded text-slate-500 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
                    >
                      <ArrowUp size={14} aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setEntries((prev) => nudge(prev, entry.id, 1))}
                      disabled={i === entries.length - 1}
                      aria-label={`Move ${entry.file.name} down`}
                      className="p-1.5 rounded text-slate-500 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
                    >
                      <ArrowDown size={14} aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setEntries((prev) => prev.filter((x) => x.id !== entry.id))}
                      aria-label={`Remove ${entry.file.name}`}
                      className="p-1.5 rounded text-slate-500 hover:text-red-700 hover:bg-red-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
                    >
                      <X size={14} aria-hidden="true" />
                    </button>
                  </div>
                </li>
              );
            })}
          </ol>
          <p className="text-[11px] text-slate-500">
            Drag files or use the arrows to change the order. Page ranges like <span className="font-mono">1-3, 5, 8-</span>; leave blank for all pages.
          </p>
          <FileDropZone
            compact
            multiple
            accept="application/pdf,.pdf"
            title={loading ? "Opening…" : "Add more PDFs"}
            disabled={loading}
            onFiles={(f) => void addFiles(f)}
            onRejected={(bad) => setRejected(bad.map((f) => `"${f.name}" isn't a PDF.`))}
          />
        </>
      )}

      {rejected.length > 0 && (
        <Notice tone="error">
          {rejected.length === 1 ? (
            rejected[0]
          ) : (
            <ul className="list-disc pl-4 space-y-0.5">
              {rejected.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          )}
        </Notice>
      )}

      {entries.length > 0 && (
        <>
          <PrimaryButton onClick={() => void merge()} disabled={!!blocked || loading}>
            Merge {entries.length} PDFs
          </PrimaryButton>
          {blocked && <p className="text-[11px] text-slate-500 text-center -mt-2">{blocked}</p>}
        </>
      )}
      {error && <Notice tone="error">{error}</Notice>}
    </div>
  );
}
