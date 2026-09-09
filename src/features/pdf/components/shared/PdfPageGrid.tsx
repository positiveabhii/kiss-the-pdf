"use client";

import { useEffect, useRef, useCallback } from "react";
import { RotateCw, RotateCcw, Check } from "lucide-react";

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
    <div ref={ref} className="relative group flex flex-col items-center">
      <button
        type="button"
        onClick={selectable ? onToggle : undefined}
        disabled={!selectable}
        aria-pressed={selected}
        aria-label={`Page ${pageNumber}${selected ? ", selected" : ""}`}
        className={`relative w-full aspect-[3/4] bg-white rounded-md border transition-all overflow-hidden ${
          selected
            ? "border-orange-600 ring-2 ring-orange-500/20 shadow-xs"
            : "border-slate-200 hover:border-slate-300"
        } ${selectable ? "cursor-pointer" : "cursor-default"}`}
      >
        <div
          className="w-full h-full bg-slate-50/50 flex items-center justify-center p-1.5"
          style={{ transform: `rotate(${rotation}deg)`, transition: "transform 0.2s ease" }}
        >
          {thumbnail ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={thumbnail}
              alt=""
              className="max-w-full max-h-full object-contain shadow-2xs bg-white"
              draggable={false}
            />
          ) : (
            <div className="w-full h-full bg-slate-100/80 animate-pulse rounded-xs" />
          )}
        </div>

        {/* Selected Check Indicator */}
        {selected && (
          <div className="absolute top-1.5 left-1.5 w-5 h-5 bg-orange-600 text-white rounded-full flex items-center justify-center shadow-xs">
            <Check size={12} strokeWidth={3} />
          </div>
        )}
      </button>

      {/* Page Number Badge */}
      <div className="mt-1.5 flex items-center justify-center">
        <span
          className={`px-1.5 py-0.5 text-[10px] font-mono font-medium rounded ${
            selected
              ? "bg-orange-600 text-white"
              : "bg-slate-100 text-slate-600 border border-slate-200/80"
          }`}
        >
          P. {pageNumber}
        </span>
      </div>

      {/* Rotate controls on hover */}
      {onRotatePage && (
        <div className="absolute top-1.5 right-1.5 flex gap-1 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity z-10">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onRotatePage("cw");
            }}
            aria-label={`Rotate page ${pageNumber} clockwise`}
            className="p-1 bg-white/95 hover:bg-white border border-slate-200 rounded shadow-2xs text-slate-700 hover:text-slate-900"
          >
            <RotateCw className="w-3 h-3" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onRotatePage("ccw");
            }}
            aria-label={`Rotate page ${pageNumber} counter-clockwise`}
            className="p-1 bg-white/95 hover:bg-white border border-slate-200 rounded shadow-2xs text-slate-700 hover:text-slate-900"
          >
            <RotateCcw className="w-3 h-3" />
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
        <p className="text-xs font-mono text-slate-500 mb-3 bg-slate-50 px-2.5 py-1 rounded border border-slate-200/60 inline-block">
          Document has {pageCount} pages. Thumbnails load dynamically.
        </p>
      )}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 w-full min-w-0">
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
