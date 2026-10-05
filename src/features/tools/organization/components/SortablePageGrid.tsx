"use client";

import { useEffect, useEffectEvent, useRef, useState } from "react";
import { Check, ChevronLeft, ChevronRight, GripVertical } from "lucide-react";

import { fitInTile, type Thumb } from "./usePageThumbnails";

/**
 * Thumbnail grid whose tiles can be rearranged — the shared core of
 * reorder-pages, organize-pdf and move-pages-between-pdfs.
 *
 *  - Drag and drop (HTML5). Dragging a selected tile drags the whole selection.
 *  - Keyboard / button alternative: each tile has "move left/right" buttons, and
 *    Alt+← / Alt+→ on a focused tile moves it (focus follows the tile).
 *  - Optional selection: click toggles, Shift+click selects a run.
 *  - Thumbnails load lazily (IntersectionObserver → `onVisible`).
 */

export interface SortableTile {
  id: string;
  /** Short accessible name, e.g. "Page 3" or "Blank page". */
  label: string;
  /** Small caption under the position number, e.g. "orig. p. 3". */
  caption?: string;
  thumb?: Thumb;
  /** A blank page (rendered as a white sheet of this shape). */
  blank?: { width: number; height: number };
  /** Extra clockwise rotation shown with CSS. */
  rotation?: number;
  /** Ask for the thumbnail (called once, when the tile nears the viewport). */
  onVisible?: () => void;
}

const nudgeClass =
  "p-0.5 rounded text-slate-500 hover:text-slate-900 hover:bg-slate-100 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 [@media(hover:none)]:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500";

const DRAG_TYPE = "application/x-kissthepdf-page";

export function SortablePageGrid({
  tiles,
  onMove,
  selected,
  onSelectionChange,
  ariaLabel,
  columnsClassName = "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5",
  tone = "default",
}: {
  tiles: SortableTile[];
  /** Move `ids` so they sit before index `insertBefore` of the current list. */
  onMove: (ids: string[], insertBefore: number) => void;
  selected?: Set<string>;
  onSelectionChange?: (next: Set<string>) => void;
  ariaLabel: string;
  columnsClassName?: string;
  /** "danger" marks selected tiles in red (e.g. pages about to be removed). */
  tone?: "default" | "danger";
}) {
  const selectable = !!selected && !!onSelectionChange;
  const [dragIds, setDragIds] = useState<string[] | null>(null);
  const [dropAt, setDropAt] = useState<number | null>(null);
  const anchor = useRef<string | null>(null);
  const focusAfterMove = useRef<string | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  // A moved tile's DOM node is re-inserted, which drops focus — put it back.
  useEffect(() => {
    const id = focusAfterMove.current;
    if (!id) return;
    focusAfterMove.current = null;
    const el = gridRef.current?.querySelector<HTMLElement>(`[data-tile-main="${CSS.escape(id)}"]`);
    el?.focus();
  }, [tiles]);

  const moveOne = (id: string, delta: -1 | 1) => {
    const i = tiles.findIndex((t) => t.id === id);
    const target = i + delta;
    if (i < 0 || target < 0 || target >= tiles.length) return;
    focusAfterMove.current = id;
    onMove([id], delta < 0 ? target : target + 1);
  };

  const toggle = (id: string, shift: boolean) => {
    if (!selectable) return;
    const next = new Set(selected);
    if (shift && anchor.current && tiles.some((t) => t.id === anchor.current)) {
      const a = tiles.findIndex((t) => t.id === anchor.current);
      const b = tiles.findIndex((t) => t.id === id);
      const [lo, hi] = a < b ? [a, b] : [b, a];
      for (let i = lo; i <= hi; i++) next.add(tiles[i].id);
    } else {
      if (next.has(id)) next.delete(id);
      else next.add(id);
      anchor.current = id;
    }
    onSelectionChange!(next);
  };

  const endDrag = () => {
    setDragIds(null);
    setDropAt(null);
  };

  const accepts = (e: React.DragEvent) => !!dragIds && e.dataTransfer.types.includes(DRAG_TYPE);

  return (
    <div className="w-full min-w-0">
      {tiles.length > 50 && (
        <p className="text-xs font-mono text-slate-500 mb-3 bg-slate-50 px-2.5 py-1 rounded border border-slate-200/60 inline-block">
          {tiles.length} pages. Thumbnails load as you scroll.
        </p>
      )}
      <div
        ref={gridRef}
        role="list"
        aria-label={ariaLabel}
        className={`grid ${columnsClassName} gap-x-3 gap-y-4 w-full min-w-0`}
        onDragOver={(e) => {
          if (!accepts(e)) return;
          e.preventDefault();
          e.dataTransfer.dropEffect = "move";
        }}
        onDrop={(e) => {
          if (!accepts(e)) return;
          e.preventDefault();
          if (dragIds && dropAt !== null) onMove(dragIds, dropAt);
          endDrag();
        }}
      >
        {tiles.map((tile, i) => {
          const isSelected = selectable && selected!.has(tile.id);
          const dragging = !!dragIds?.includes(tile.id);
          return (
            <Tile
              key={tile.id}
              tile={tile}
              position={i + 1}
              total={tiles.length}
              selected={isSelected}
              selectable={selectable}
              dragging={dragging}
              tone={tone}
              showDropBefore={dropAt === i}
              showDropAfter={dropAt === tiles.length && i === tiles.length - 1}
              onToggle={(shift) => toggle(tile.id, shift)}
              onMoveLeft={() => moveOne(tile.id, -1)}
              onMoveRight={() => moveOne(tile.id, 1)}
              onDragStart={(e) => {
                const ids =
                  isSelected && selected!.size > 1
                    ? tiles.filter((t) => selected!.has(t.id)).map((t) => t.id)
                    : [tile.id];
                setDragIds(ids);
                e.dataTransfer.effectAllowed = "move";
                e.dataTransfer.setData(DRAG_TYPE, tile.id);
                e.dataTransfer.setData("text/plain", tile.label);
              }}
              onDragEnd={endDrag}
              onDragOverTile={(e) => {
                if (!accepts(e)) return;
                e.preventDefault();
                const rect = e.currentTarget.getBoundingClientRect();
                const at = e.clientX < rect.left + rect.width / 2 ? i : i + 1;
                if (at !== dropAt) setDropAt(at);
              }}
            />
          );
        })}
      </div>
    </div>
  );
}

function Tile({
  tile,
  position,
  total,
  selected,
  selectable,
  dragging,
  tone,
  showDropBefore,
  showDropAfter,
  onToggle,
  onMoveLeft,
  onMoveRight,
  onDragStart,
  onDragEnd,
  onDragOverTile,
}: {
  tile: SortableTile;
  position: number;
  total: number;
  selected: boolean;
  selectable: boolean;
  dragging: boolean;
  tone: "default" | "danger";
  showDropBefore: boolean;
  showDropAfter: boolean;
  onToggle: (shift: boolean) => void;
  onMoveLeft: () => void;
  onMoveRight: () => void;
  onDragStart: (e: React.DragEvent) => void;
  onDragEnd: () => void;
  onDragOverTile: (e: React.DragEvent<HTMLDivElement>) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const wantsThumb = !!tile.onVisible && !tile.thumb && !tile.blank;
  const askForThumb = useEffectEvent(() => tile.onVisible?.());

  // Observe only until the tile first nears the viewport.
  useEffect(() => {
    if (!wantsThumb) return;
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          askForThumb();
          observer.disconnect();
        }
      },
      { rootMargin: "200px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [wantsThumb]);

  const rotation = tile.rotation ?? 0;
  const ring =
    tone === "danger"
      ? "border-red-500 ring-2 ring-red-500/20"
      : "border-slate-900 ring-2 ring-slate-900/15";
  const accent = tone === "danger" ? "bg-red-600" : "bg-slate-900";
  const name = `${tile.label}, position ${position} of ${total}${selected ? ", selected" : ""}`;

  let sheet: React.ReactNode;
  if (tile.blank) {
    const fit = fitInTile(tile.blank.width, tile.blank.height, rotation);
    sheet = (
      <div
        className="bg-white border border-dashed border-slate-300 shadow-2xs flex items-center justify-center"
        style={{ width: fit.width, height: fit.height }}
      >
        <span className="text-[10px] font-medium text-slate-400">Blank</span>
      </div>
    );
  } else if (tile.thumb) {
    const fit = fitInTile(tile.thumb.width, tile.thumb.height, rotation);
    sheet = (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={tile.thumb.url}
        alt=""
        draggable={false}
        className="bg-white shadow-2xs transition-transform duration-200"
        style={{
          width: fit.width,
          height: fit.height,
          transform: rotation ? `rotate(${rotation}deg) scale(${fit.scale})` : undefined,
        }}
      />
    );
  } else {
    sheet = <div className="w-[70%] h-[85%] bg-slate-100 animate-pulse rounded-xs" />;
  }

  return (
    <div
      ref={ref}
      role="listitem"
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragOver={onDragOverTile}
      className={`relative group flex flex-col items-center min-w-0 ${dragging ? "opacity-40" : ""}`}
    >
      {showDropBefore && (
        <span aria-hidden="true" className="absolute -left-2 top-0 bottom-6 w-1 rounded-full bg-orange-500" />
      )}
      {showDropAfter && (
        <span aria-hidden="true" className="absolute -right-2 top-0 bottom-6 w-1 rounded-full bg-orange-500" />
      )}
      <button
        type="button"
        data-tile-main={tile.id}
        onClick={(e) => onToggle(e.shiftKey)}
        onKeyDown={(e) => {
          if (e.altKey && e.key === "ArrowLeft") {
            e.preventDefault();
            onMoveLeft();
          } else if (e.altKey && e.key === "ArrowRight") {
            e.preventDefault();
            onMoveRight();
          }
        }}
        aria-pressed={selectable ? selected : undefined}
        aria-label={name}
        aria-keyshortcuts="Alt+ArrowLeft Alt+ArrowRight"
        title={selectable ? "Click to select or deselect · drag to move · Alt+← / Alt+→ to move" : "Drag to move · Alt+← / Alt+→ to move"}
        className={`relative w-full aspect-[3/4] bg-slate-50 rounded-md border overflow-hidden transition-all cursor-grab active:cursor-grabbing focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 ${
          selected ? ring : "border-slate-200 hover:border-slate-400"
        }`}
      >
        <span className="absolute inset-0 flex items-center justify-center p-2">{sheet}</span>
        {selected && (
          <span className={`absolute top-1.5 left-1.5 w-5 h-5 ${accent} text-white rounded-full flex items-center justify-center shadow-xs`}>
            <Check size={12} strokeWidth={3} aria-hidden="true" />
          </span>
        )}
        <span className="absolute top-1.5 right-1.5 p-0.5 rounded bg-white/90 border border-slate-200 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
          <GripVertical size={12} aria-hidden="true" />
        </span>
      </button>

      <div className="mt-1.5 flex items-center justify-center gap-1 w-full">
        <button
          type="button"
          onClick={onMoveLeft}
          disabled={position === 1}
          aria-label={`Move ${tile.label} left`}
          className={`${nudgeClass} ${position === 1 ? "invisible" : ""}`}
        >
          <ChevronLeft size={14} aria-hidden="true" />
        </button>
        <span className="min-w-0 text-center leading-tight">
          <span
            className={`block px-1.5 py-0.5 text-[10px] font-mono font-medium rounded ${
              selected ? `${accent} text-white` : "bg-slate-100 text-slate-600 border border-slate-200/80"
            }`}
          >
            {position}
          </span>
        </span>
        <button
          type="button"
          onClick={onMoveRight}
          disabled={position === total}
          aria-label={`Move ${tile.label} right`}
          className={`${nudgeClass} ${position === total ? "invisible" : ""}`}
        >
          <ChevronRight size={14} aria-hidden="true" />
        </button>
      </div>
      {tile.caption && (
        <span className="mt-0.5 text-[10px] text-slate-400 truncate max-w-full" title={tile.caption}>
          {tile.caption}
        </span>
      )}
    </div>
  );
}
