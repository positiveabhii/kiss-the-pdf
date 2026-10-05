"use client";

import { useCallback, useEffect, useState } from "react";
import type { PDFDocumentProxy } from "pdfjs-dist";
import { Grid3x3, Play, Timer, X } from "lucide-react";

import { Checkbox, Notice } from "../core/ui";
import { SlideStage } from "./viewer/SlideStage";
import { Thumbnail } from "./viewer/Thumbnails";
import { OpenAnotherButton, ViewerShell } from "./viewer/ViewerShell";
import { PageInput } from "./viewer/Toolbar";
import { isTypingTarget, useFullscreen, usePageSizes, useSwipe } from "./viewer/hooks";

const PRELOAD = [1, 2, -1];

function formatTime(ms: number): string {
  const s = Math.floor(ms / 1000);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  const mm = String(m).padStart(h ? 2 : 1, "0");
  return `${h ? `${h}:` : ""}${mm}:${String(sec).padStart(2, "0")}`;
}

function useElapsed(running: boolean, startedAt: number | null) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => setNow(Date.now()), 500);
    return () => window.clearInterval(id);
  }, [running]);
  return startedAt ? Math.max(0, now - startedAt) : 0;
}

function Presenter({ doc, fileName, openAnother }: { doc: PDFDocumentProxy; fileName: string; openAnother: () => void }) {
  const n = doc.numPages;
  const [page, setPage] = useState(1);
  const [root, setRoot] = useState<HTMLDivElement | null>(null);
  const [black, setBlack] = useState(false);
  const [grid, setGrid] = useState(false);
  const [gridRoot, setGridRoot] = useState<HTMLDivElement | null>(null);
  const [showTimer, setShowTimer] = useState(true);
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [hud, setHud] = useState(true);
  const sizes = usePageSizes(doc);
  const fs = useFullscreen(root);
  const elapsed = useElapsed(showTimer && startedAt !== null, startedAt);

  const go = useCallback((p: number) => {
    setBlack(false);
    setPage(Math.min(n, Math.max(1, p)));
  }, [n]);
  const step = useCallback(
    (d: -1 | 1) => {
      setBlack(false);
      setPage((p) => Math.min(n, Math.max(1, p + d)));
    },
    [n]
  );
  useSwipe(grid ? null : root, step);

  const start = async () => {
    setStartedAt(Date.now());
    setGrid(false);
    setBlack(false);
    await fs.enter();
    root?.focus({ preventScroll: true });
  };

  // Show the counter briefly after each change in full screen.
  useEffect(() => {
    if (!fs.active) return;
    const showId = window.setTimeout(() => setHud(true), 0);
    const hideId = window.setTimeout(() => setHud(false), 2500);
    return () => {
      window.clearTimeout(showId);
      window.clearTimeout(hideId);
    };
  }, [page, fs.active]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (isTypingTarget(e.target) || e.metaKey || e.ctrlKey || e.altKey) return;
    const k = e.key;
    if (grid) {
      if (k === "Escape" || k === "g" || k === "G") {
        setGrid(false);
        e.preventDefault();
      }
      return;
    }
    if (k === "ArrowRight" || k === "ArrowDown" || k === "PageDown" || k === "Enter" || (k === " " && !e.shiftKey)) step(1);
    else if (k === "ArrowLeft" || k === "ArrowUp" || k === "PageUp" || k === "Backspace" || (k === " " && e.shiftKey)) step(-1);
    else if (k === "Home") go(1);
    else if (k === "End") go(n);
    else if (k === "b" || k === "B" || k === ".") setBlack((b) => !b);
    else if (k === "g" || k === "G") setGrid(true);
    else if (k === "t" || k === "T") setShowTimer((t) => !t);
    else if (k === "f" || k === "F") void (fs.active ? fs.exit() : start());
    else if (k === "Escape" && black) setBlack(false);
    else return;
    e.preventDefault();
  };

  const full = fs.active;
  return (
    <div className="space-y-3">
      <div
        ref={setRoot}
        tabIndex={0}
        onKeyDown={onKeyDown}
        onMouseMove={() => full && setHud(true)}
        className={`ktp-viewer relative flex flex-col bg-black focus:outline-none ${
          full ? "w-full h-full" : "rounded-lg overflow-hidden aspect-video max-h-[75vh] w-full"
        } ${fs.pseudo ? "fixed inset-0 z-[100] !max-h-none !aspect-auto rounded-none" : ""}`}
      >
        <SlideStage
          doc={doc}
          page={page}
          preload={PRELOAD}
          className={`flex-1 min-h-0 select-none cursor-pointer ${black ? "invisible" : ""}`}
          onClick={(e) => {
            const r = e.currentTarget.getBoundingClientRect();
            step(e.clientX - r.left < r.width / 4 ? -1 : 1);
          }}
        />
        {black && (
          <button
            type="button"
            aria-label="Screen is blacked out. Press B or click to continue."
            onClick={() => setBlack(false)}
            className="absolute inset-0 bg-black"
          />
        )}
        {/* Slide counter + timer */}
        <div
          className={`pointer-events-none absolute bottom-3 right-3 flex items-center gap-3 px-2.5 py-1 rounded-md bg-black/60 text-white text-xs tabular-nums transition-opacity duration-300 ${
            !full || hud ? "opacity-100" : "opacity-0"
          }`}
        >
          {showTimer && startedAt !== null && (
            <span className="flex items-center gap-1">
              <Timer size={12} /> {formatTime(elapsed)}
            </span>
          )}
          <span>
            {page} / {n}
          </span>
        </div>
        {full && (
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/10 pointer-events-none">
            <div className="h-full bg-white/50" style={{ width: `${(page / n) * 100}%` }} />
          </div>
        )}
        {grid && sizes && (
          <div className="absolute inset-0 z-10 bg-neutral-900/95 flex flex-col">
            <div className="flex items-center justify-between px-4 py-2 text-white">
              <span className="text-sm font-semibold">All slides</span>
              <button type="button" aria-label="Close overview" onClick={() => setGrid(false)} className="p-1.5 rounded hover:bg-white/10">
                <X size={16} />
              </button>
            </div>
            <div ref={setGridRoot} className="relative flex-1 overflow-y-auto px-4 pb-4">
              {gridRoot && (
                <div className="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-3 [&_span]:text-white/70">
                  {sizes.map((s, i) => (
                    <Thumbnail
                      key={i}
                      doc={doc}
                      pageNumber={i + 1}
                      size={s}
                      width={150}
                      root={gridRoot}
                      active={page === i + 1}
                      onClick={() => {
                        go(i + 1);
                        setGrid(false);
                        root?.focus({ preventScroll: true });
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {!full && (
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => void start()}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-semibold bg-slate-900 hover:bg-slate-800 text-white"
          >
            <Play size={14} /> {startedAt ? "Resume presentation" : "Start presentation"}
          </button>
          <PageInput page={page} pageCount={n} onGo={go} />
          <button
            type="button"
            onClick={() => {
              setGrid(true);
              root?.focus({ preventScroll: true });
            }}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-md hover:bg-slate-50"
          >
            <Grid3x3 size={14} /> Overview
          </button>
          <Checkbox id="pres-timer" checked={showTimer} onChange={setShowTimer} label="Timer" />
          {startedAt !== null && (
            <button type="button" className="text-xs text-slate-500 underline" onClick={() => setStartedAt(Date.now())}>
              Reset timer
            </button>
          )}
          <span className="flex-1" />
          <span className="text-xs text-slate-500 truncate max-w-[40%]" title={fileName}>
            {fileName}
          </span>
          <OpenAnotherButton onClick={openAnother} compact />
        </div>
      )}
      {!full && (
        <p className="text-[11px] text-slate-500">
          Keys: → / Space / click next · ← previous · Home / End first / last · B black screen · G all slides · T timer ·
          F full screen · Esc leave.
        </p>
      )}
    </div>
  );
}

export default function PdfPresentation() {
  return (
    <ViewerShell
      title="Select a PDF to present"
      intro={<Notice>Present any PDF as slides, full screen, right from your browser. Nothing is uploaded.</Notice>}
    >
      {({ doc, file, openAnother }) => <Presenter doc={doc} fileName={file.name} openAnother={openAnother} />}
    </ViewerShell>
  );
}
