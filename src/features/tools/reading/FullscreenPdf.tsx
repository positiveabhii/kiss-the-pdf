"use client";

import { useCallback, useEffect, useState } from "react";
import type { PDFDocumentProxy } from "pdfjs-dist";
import { ChevronLeft, ChevronRight, Maximize, Minimize } from "lucide-react";

import { Notice } from "../core/ui";
import { SlideStage } from "./viewer/SlideStage";
import { OpenAnotherButton, ViewerShell } from "./viewer/ViewerShell";
import { PageInput } from "./viewer/Toolbar";
import { isTypingTarget, useFullscreen, useSwipe } from "./viewer/hooks";

function FullscreenReader({ doc, fileName, openAnother }: { doc: PDFDocumentProxy; fileName: string; openAnother: () => void }) {
  const [page, setPage] = useState(1);
  const [root, setRoot] = useState<HTMLDivElement | null>(null);
  const fs = useFullscreen(root);
  const n = doc.numPages;

  const go = useCallback((p: number) => setPage(Math.min(n, Math.max(1, p))), [n]);
  const step = useCallback((d: -1 | 1) => setPage((p) => Math.min(n, Math.max(1, p + d))), [n]);
  useSwipe(root, step);

  useEffect(() => {
    root?.focus({ preventScroll: true });
  }, [root]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (isTypingTarget(e.target) || e.metaKey || e.ctrlKey || e.altKey) return;
    const k = e.key;
    if (k === "f" || k === "F") fs.toggle();
    else if (k === "ArrowRight" || k === "ArrowDown" || k === "PageDown" || (k === " " && !e.shiftKey)) step(1);
    else if (k === "ArrowLeft" || k === "ArrowUp" || k === "PageUp" || (k === " " && e.shiftKey)) step(-1);
    else if (k === "Home") go(1);
    else if (k === "End") go(n);
    else return;
    e.preventDefault();
  };

  const full = fs.active;
  return (
    <div
      ref={setRoot}
      tabIndex={0}
      onKeyDown={onKeyDown}
      className={`ktp-viewer flex flex-col focus:outline-none ${
        full ? "bg-neutral-900 w-full h-full" : "bg-slate-100 border border-slate-200 rounded-lg h-[78vh] min-h-[420px]"
      } ${fs.pseudo ? "fixed inset-0 z-[100]" : ""}`}
    >
      <SlideStage
        doc={doc}
        page={page}
        className="flex-1 min-h-0 m-2 sm:m-4 cursor-pointer select-none"
        onClick={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          step(e.clientX - r.left < r.width / 3 ? -1 : 1);
        }}
      />
      <div className={`relative ${full ? "text-white" : ""}`}>
        <div className={`h-1 ${full ? "bg-white/10" : "bg-slate-200"}`}>
          <div
            className={`h-full transition-[width] duration-200 ${full ? "bg-white/70" : "bg-slate-900"}`}
            style={{ width: `${(page / n) * 100}%` }}
            role="progressbar"
            aria-valuemin={1}
            aria-valuemax={n}
            aria-valuenow={page}
            aria-label="Reading progress"
          />
        </div>
        <div className={`flex items-center gap-2 px-2 py-1.5 ${full ? "bg-neutral-900" : "bg-white rounded-b-lg"}`}>
          {full ? (
            <div className="flex items-center gap-1">
              <button type="button" aria-label="Previous page" onClick={() => step(-1)} className="p-1.5 rounded hover:bg-white/10 disabled:opacity-30" disabled={page <= 1}>
                <ChevronLeft size={18} />
              </button>
              <span className="text-xs tabular-nums text-white/80 min-w-16 text-center">
                {page} / {n}
              </span>
              <button type="button" aria-label="Next page" onClick={() => step(1)} className="p-1.5 rounded hover:bg-white/10 disabled:opacity-30" disabled={page >= n}>
                <ChevronRight size={18} />
              </button>
            </div>
          ) : (
            <PageInput page={page} pageCount={n} onGo={go} />
          )}
          <span className={`flex-1 min-w-0 truncate text-xs text-center ${full ? "text-white/50" : "text-slate-500"}`}>
            {fileName}
          </span>
          {!full && <OpenAnotherButton onClick={openAnother} compact />}
          <button
            type="button"
            onClick={() => void fs.toggle()}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-md ${
              full ? "text-white hover:bg-white/10" : "text-white bg-slate-900 hover:bg-slate-800"
            }`}
          >
            {full ? <Minimize size={14} /> : <Maximize size={14} />}
            {full ? "Exit" : "Full screen"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function FullscreenPdf() {
  return (
    <ViewerShell
      intro={
        <Notice>
          One page at a time, fitted to your screen. F for full screen, ← → or Space to turn pages, Esc to leave. On
          touch screens, swipe.
        </Notice>
      }
    >
      {({ doc, file, openAnother }) => <FullscreenReader doc={doc} fileName={file.name} openAnother={openAnother} />}
    </ViewerShell>
  );
}
