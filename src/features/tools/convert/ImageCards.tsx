"use client";

import { ArrowDown, ArrowUp, ImageOff, Trash2 } from "lucide-react";

import { formatFileSize } from "@/features/pdf/utils/format-file-size";

import { FORMAT_LABEL } from "./ops/sniff";
import type { ImageItem } from "./useImageList";

function frameBadge(item: ImageItem): string | null {
  if (item.probe.frames <= 1) return null;
  return item.probe.format === "gif" ? `${item.probe.frames} frames` : `${item.probe.frames} pages`;
}

function Preview({ item, className }: { item: ImageItem; className: string }) {
  if (!item.probe.previewUrl) {
    return (
      <div className={`${className} flex items-center justify-center text-slate-300`}>
        <ImageOff size={18} />
      </div>
    );
  }
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={item.probe.previewUrl} alt="" loading="lazy" decoding="async" draggable={false} className={className} />;
}

/** Card grid (thumbnail, name, size, reorder, remove) — the JPG to PDF look. */
export function ImageCards({
  items,
  onMove,
  onRemove,
  onCaption,
}: {
  items: ImageItem[];
  onMove: (index: number, dir: -1 | 1) => void;
  onRemove: (id: string) => void;
  /** Show an editable caption field per image. */
  onCaption?: (id: string, caption: string) => void;
}) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
      {items.map((img, index) => {
        const badge = frameBadge(img);
        return (
          <div
            key={img.id}
            className="relative group flex flex-col rounded-md border border-slate-200 bg-white overflow-hidden"
          >
            <div className="relative w-full aspect-[4/3] bg-slate-50">
              <span className="absolute top-1.5 left-1.5 z-10 px-1.5 py-0.5 text-[10px] font-mono font-semibold bg-slate-900/75 text-white rounded">
                {index + 1}
              </span>
              {badge && (
                <span className="absolute top-1.5 right-1.5 z-10 px-1.5 py-0.5 text-[10px] font-mono font-semibold bg-white/90 border border-slate-200 text-slate-700 rounded">
                  {badge}
                </span>
              )}
              <Preview item={img} className="w-full h-full object-contain" />
            </div>
            <div className="p-2 min-w-0">
              <p className="text-[11px] font-semibold text-slate-800 truncate" title={img.file.name}>
                {img.file.name}
              </p>
              <p className="text-[10px] font-mono text-slate-500 mt-0.5">
                {formatFileSize(img.file.size)} · {img.probe.width}×{img.probe.height}
                {img.probe.format !== "jpg" && ` · ${FORMAT_LABEL[img.probe.format]}`}
              </p>
              {onCaption && (
                <input
                  type="text"
                  value={img.caption}
                  onChange={(e) => onCaption(img.id, e.target.value)}
                  placeholder="Caption"
                  aria-label={`Caption for ${img.file.name}`}
                  className="mt-1.5 w-full px-2 py-1 text-[11px] text-slate-800 bg-white border border-slate-200 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
                />
              )}
            </div>
            <div className="flex items-center gap-1 p-1.5 border-t border-slate-100 mt-auto">
              <button
                type="button"
                onClick={() => onMove(index, -1)}
                disabled={index === 0}
                aria-label={`Move ${img.file.name} up`}
                className="flex-1 inline-flex items-center justify-center gap-1 px-2 py-1 text-[11px] font-medium text-slate-600 bg-white border border-slate-200 rounded hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ArrowUp size={12} /> Up
              </button>
              <button
                type="button"
                onClick={() => onMove(index, 1)}
                disabled={index === items.length - 1}
                aria-label={`Move ${img.file.name} down`}
                className="flex-1 inline-flex items-center justify-center gap-1 px-2 py-1 text-[11px] font-medium text-slate-600 bg-white border border-slate-200 rounded hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ArrowDown size={12} /> Down
              </button>
              <button
                type="button"
                onClick={() => onRemove(img.id)}
                aria-label={`Remove ${img.file.name}`}
                className="p-1.5 text-slate-400 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/** Compact rows for long lists (contact sheets with hundreds of photos). */
export function ImageRows({
  items,
  onMove,
  onRemove,
}: {
  items: ImageItem[];
  onMove: (index: number, dir: -1 | 1) => void;
  onRemove: (id: string) => void;
}) {
  return (
    <ul className="max-h-96 overflow-y-auto divide-y divide-slate-100 border border-slate-200 rounded-md bg-white">
      {items.map((img, index) => (
        <li key={img.id} className="flex items-center gap-2.5 px-2.5 py-1.5">
          <span className="w-7 text-right text-[10px] font-mono text-slate-400">{index + 1}</span>
          <Preview item={img} className="w-10 h-8 shrink-0 rounded-sm bg-slate-50 object-cover" />
          <div className="flex-1 min-w-0">
            <p className="text-xs text-slate-800 truncate" title={img.file.name}>
              {img.file.name}
            </p>
            <p className="text-[10px] font-mono text-slate-500">
              {formatFileSize(img.file.size)} · {img.probe.width}×{img.probe.height}
            </p>
          </div>
          <button
            type="button"
            onClick={() => onMove(index, -1)}
            disabled={index === 0}
            aria-label={`Move ${img.file.name} up`}
            className="p-1 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded disabled:opacity-30"
          >
            <ArrowUp size={13} />
          </button>
          <button
            type="button"
            onClick={() => onMove(index, 1)}
            disabled={index === items.length - 1}
            aria-label={`Move ${img.file.name} down`}
            className="p-1 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded disabled:opacity-30"
          >
            <ArrowDown size={13} />
          </button>
          <button
            type="button"
            onClick={() => onRemove(img.id)}
            aria-label={`Remove ${img.file.name}`}
            className="p-1 text-slate-400 hover:text-red-700 hover:bg-red-50 rounded"
          >
            <Trash2 size={13} />
          </button>
        </li>
      ))}
    </ul>
  );
}
