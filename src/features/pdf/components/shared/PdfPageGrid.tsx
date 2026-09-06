"use client";

import { useEffect, useRef, useCallback } from "react";
import { RotateCw, RotateCcw } from "lucide-react";

interface PdfPageGridProps {
  pageCount: number;
  thumbnails: Map<number, string>;
  selectedPages: Set<number>;
  pageRotations?: Map<number, number>;
  onTogglePage: (page: number) => void;
  onLoadThumbnail: (page: number) => void;
  onRotatePage?: (page: number, direction: "cw" | "ccw") => void;
  selectable?: boolean;
}

function PageTile({
  pageNumber,
  thumbnail,
  selected,
  rotation,
  onToggle,
  onLoadThumbnail,
  onRotatePage,
  selectable,
}: {
  pageNumber: number;
  thumbnail?: string;
  selected: boolean;
  rotation: number;
  onToggle: () => void;
  onLoadThumbnail: () => void;
  onRotatePage?: (direction: "cw" | "ccw") => void;
  selectable: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const loaded = useRef(false);

  useEffect(() => {
    if (loaded.current) return;
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          loaded.current = true;
          onLoadThumbnail();
          observer.disconnect();
        }
      },
      { rootMargin: "100px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [onLoadThumbnail]);

  return (
    <div ref={ref} className="relative group">
      <button
        type="button"
        onClick={selectable ? onToggle : undefined}
        disabled={!selectable}
        aria-pressed={selected}
        aria-label={`Page ${pageNumber}${selected ? ", selected" : ""}`}
        className={`w-full aspect-[3/4] rounded-lg border-2 overflow-hidden transition-all ${
          selected
            ? "border-blue-600 ring-2 ring-blue-600/20"
            : "border-slate-200 hover:border-slate-300"
        } ${selectable ? "cursor-pointer" : "cursor-default"}`}
      >
        <div
          className="w-full h-full bg-white flex items-center justify-center"
          style={{ transform: `rotate(${rotation}deg)`, transition: "transform 0.2s ease" }}
        >
          {thumbnail ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={thumbnail}
              alt=""
              className="max-w-full max-h-full object-contain"
              draggable={false}
            />
          ) : (
            <div className="w-full h-full bg-slate-100 animate-pulse" />
          )}
        </div>
      </button>

      <span
        className={`absolute bottom-1.5 left-1/2 -translate-x-1/2 px-2 py-0.5 text-xs font-medium rounded ${
          selected ? "bg-blue-600 text-white" : "bg-slate-800/75 text-white"
        }`}
      >
        {pageNumber}
      </span>

      {onRotatePage && (
        <div className="absolute top-1.5 right-1.5 flex gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100 transition-opacity">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onRotatePage("cw");
            }}
            aria-label={`Rotate page ${pageNumber} clockwise`}
            className="p-1 bg-white/90 hover:bg-white border border-slate-200 rounded shadow-sm text-slate-700"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onRotatePage("ccw");
            }}
            aria-label={`Rotate page ${pageNumber} counter-clockwise`}
            className="p-1 bg-white/90 hover:bg-white border border-slate-200 rounded shadow-sm text-slate-700"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}

export function PdfPageGrid({
  pageCount,
  thumbnails,
  selectedPages,
  pageRotations,
  onTogglePage,
  onLoadThumbnail,
  onRotatePage,
  selectable = true,
}: PdfPageGridProps) {
  const handleLoad = useCallback(
    (page: number) => () => onLoadThumbnail(page),
    [onLoadThumbnail]
  );

  if (pageCount === 0) return null;

  const showLargeDocNote = pageCount > 50;

  return (
    <div className="w-full min-w-0">
      {showLargeDocNote && (
        <p className="text-xs text-slate-500 mb-3">
          Large document ({pageCount} pages). Thumbnails load as you scroll.
        </p>
      )}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 w-full min-w-0">
        {Array.from({ length: pageCount }, (_, i) => i + 1).map((page) => (
          <PageTile
            key={page}
            pageNumber={page}
            thumbnail={thumbnails.get(page)}
            selected={selectedPages.has(page)}
            rotation={pageRotations?.get(page) ?? 0}
            onToggle={() => onTogglePage(page)}
            onLoadThumbnail={handleLoad(page)}
            onRotatePage={
              onRotatePage ? (dir) => onRotatePage(page, dir) : undefined
            }
            selectable={selectable}
          />
        ))}
      </div>
    </div>
  );
}
