"use client";

import { useCallback, useImperativeHandle, useMemo, useState, type Ref } from "react";
import type { PDFDocumentProxy, PageViewport } from "pdfjs-dist";
import { Loader2, PanelLeft } from "lucide-react";

import { ContinuousView, type ContinuousViewHandle } from "./ContinuousView";
import { ThumbnailList } from "./Thumbnails";
import { OpenAnotherButton } from "./ViewerShell";
import { PageInput, ZoomControls, nextZoom, scaleFor, toolBtn, type ZoomMode } from "./Toolbar";
import { useElementSize, usePageSizes } from "./hooks";

/**
 * The full reader: toolbar (sidebar, page, zoom, open another), a sidebar
 * (thumbnails by default, or the caller's panel), and the virtualised
 * continuous page view with selectable text.
 */

export interface ReaderHandle {
  goToPage: (n: number, opts?: { pdfX?: number; pdfY?: number; smooth?: boolean }) => void;
}

export function ReaderView({
  doc,
  fileName,
  openAnother,
  overlay,
  sidebar,
  sidebarLabel = "Pages",
  handleRef,
  heightClass = "h-[78vh] min-h-[480px]",
  sidebarClass = "w-40 sm:w-44",
}: {
  doc: PDFDocumentProxy;
  fileName: string;
  openAnother: () => void;
  overlay?: (pageNumber: number, viewport: PageViewport) => React.ReactNode;
  /** Replaces the thumbnails sidebar. Receives the go-to-page function. */
  sidebar?: (goTo: ReaderHandle["goToPage"]) => React.ReactNode;
  sidebarLabel?: string;
  handleRef?: Ref<ReaderHandle>;
  heightClass?: string;
  sidebarClass?: string;
}) {
  const sizes = usePageSizes(doc);
  const [page, setPage] = useState(1);
  const [zoom, setZoom] = useState<ZoomMode>("fit-width");
  const [showSidebar, setShowSidebar] = useState(() => !!sidebar || typeof window === "undefined" || window.innerWidth >= 640);
  const [areaEl, setAreaEl] = useState<HTMLDivElement | null>(null);
  const area = useElementSize(areaEl);
  const [view, setView] = useState<ContinuousViewHandle | null>(null);

  // Fit to the largest page so the zoom doesn't jump while scrolling mixed page sizes.
  const fitSize = useMemo(
    () =>
      sizes?.length
        ? { width: Math.max(...sizes.map((s) => s.width)), height: Math.max(...sizes.map((s) => s.height)) }
        : { width: 612, height: 792 },
    [sizes]
  );
  const scale = area.width ? scaleFor(zoom, area, fitSize) : 1;

  const goTo = useCallback<ReaderHandle["goToPage"]>((n, opts) => {
    const p = Math.min(Math.max(1, n), doc.numPages);
    setPage(p);
    view?.scrollToPage(p, opts);
  }, [doc.numPages, view]);

  useImperativeHandle(handleRef, () => ({ goToPage: goTo }), [goTo]);

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    switch (e.key) {
      case "ArrowRight":
      case "n":
        e.preventDefault();
        goTo(page + 1);
        break;
      case "ArrowLeft":
      case "p":
        e.preventDefault();
        goTo(page - 1);
        break;
      case "Home":
        e.preventDefault();
        goTo(1);
        break;
      case "End":
        e.preventDefault();
        goTo(doc.numPages);
        break;
      case "+":
      case "=":
        e.preventDefault();
        setZoom(nextZoom(scale, 1));
        break;
      case "-":
        e.preventDefault();
        setZoom(nextZoom(scale, -1));
        break;
      case "0":
        e.preventDefault();
        setZoom("fit-width");
        break;
    }
  };

  return (
    <div className={`flex flex-col w-full border border-slate-200 rounded-lg overflow-hidden bg-white ${heightClass}`}>
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 px-2 py-1.5 border-b border-slate-200 bg-white">
        <button
          type="button"
          className={toolBtn}
          aria-label={showSidebar ? `Hide ${sidebarLabel.toLowerCase()}` : `Show ${sidebarLabel.toLowerCase()}`}
          aria-pressed={showSidebar}
          onClick={() => setShowSidebar((s) => !s)}
        >
          <PanelLeft size={16} />
        </button>
        <PageInput page={page} pageCount={doc.numPages} onGo={goTo} />
        <div className="h-5 w-px bg-slate-200 hidden sm:block" />
        <ZoomControls mode={zoom} effective={scale} onChange={setZoom} />
        <span className="flex-1 min-w-0 truncate text-xs text-slate-500 text-right hidden md:block" title={fileName}>
          {fileName}
        </span>
        <OpenAnotherButton onClick={openAnother} compact />
      </div>
      <div className="relative flex flex-1 min-h-0">
        {showSidebar && (
          <div className={`${sidebarClass} shrink-0 border-r border-slate-200 bg-slate-50 flex flex-col min-h-0 max-sm:absolute max-sm:inset-y-0 max-sm:left-0 max-sm:z-10 max-sm:shadow-lg`}>
            {sidebar ? (
              sidebar(goTo)
            ) : sizes ? (
              <ThumbnailList doc={doc} sizes={sizes} current={page} onSelect={goTo} className="flex-1" />
            ) : null}
          </div>
        )}
        <div ref={setAreaEl} className="relative flex-1 min-w-0 min-h-0">
          {sizes && area.width > 0 ? (
            <ContinuousView
              ref={setView}
              doc={doc}
              sizes={sizes}
              scale={scale}
              textLayer
              overlay={overlay}
              onPageChange={setPage}
              onKeyDown={onKeyDown}
              className="absolute inset-0"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-slate-400">
              <Loader2 className="w-5 h-5 animate-spin" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
