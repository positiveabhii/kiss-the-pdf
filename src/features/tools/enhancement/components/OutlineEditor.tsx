"use client";

import { ArrowDown, ArrowUp, IndentDecrease, IndentIncrease, Plus, Trash2 } from "lucide-react";

import { SecondaryButton } from "../../core/ui";
import { moveItem, removeItem, shiftLevel, subtreeEnd } from "../ops/outline";

/**
 * Editable bookmark list: title, target page, nesting by indent/outdent,
 * reorder (an item moves together with its children), delete, add.
 */

export interface EditorItem {
  id: string;
  title: string;
  /** 1-based target page, or null when it points outside this document. */
  page: number | null;
  level: number;
  /** Carried through untouched (original object, original target, open state). */
  sourceRef?: string;
  sourcePageIndex?: number | null;
  open?: boolean;
}

let seq = 0;
export function newId(): string {
  seq += 1;
  return `b${Date.now().toString(36)}${seq}`;
}

const iconBtn =
  "p-1 rounded text-slate-500 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent";

export function OutlineEditor({
  items,
  onChange,
  pageCount,
  nesting = true,
  emptyText = "No bookmarks yet.",
  addLabel = "Add bookmark",
}: {
  items: EditorItem[];
  onChange: (items: EditorItem[]) => void;
  pageCount: number;
  nesting?: boolean;
  emptyText?: string;
  addLabel?: string;
}) {
  const update = (i: number, patch: Partial<EditorItem>) =>
    onChange(items.map((it, k) => (k === i ? { ...it, ...patch } : it)));

  const add = () => {
    const last = items[items.length - 1];
    const page = Math.min(pageCount, (last?.page ?? 0) + 1) || 1;
    onChange([...items, { id: newId(), title: `Page ${page}`, page, level: 0 }]);
  };

  return (
    <div className="space-y-2">
      {items.length === 0 ? (
        <p className="text-xs text-slate-500 py-3 text-center border border-dashed border-slate-200 rounded-md">{emptyText}</p>
      ) : (
        <ol className="space-y-1 max-h-[28rem] overflow-y-auto pr-1">
          {items.map((it, i) => {
            const end = subtreeEnd(items, i);
            const hasPrevSibling = (() => {
              for (let p = i - 1; p >= 0; p--) {
                if (items[p].level === it.level) return true;
                if (items[p].level < it.level) return false;
              }
              return false;
            })();
            const hasNextSibling = end < items.length && items[end].level === it.level;
            const canIndent = nesting && i > 0 && it.level <= items[i - 1].level;
            return (
              <li
                key={it.id}
                className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-md px-2 py-1.5"
                style={{ marginLeft: Math.min(it.level, 8) * 16 }}
              >
                <input
                  aria-label={`Title of bookmark ${i + 1}`}
                  value={it.title}
                  onChange={(e) => update(i, { title: e.target.value })}
                  className="flex-1 min-w-0 px-2 py-1 text-sm text-slate-900 bg-transparent border border-transparent rounded hover:border-slate-200 focus:border-slate-400 focus:outline-none"
                />
                <label className="flex items-center gap-1 text-[11px] text-slate-500 shrink-0">
                  p.
                  {it.page === null ? (
                    <button
                      type="button"
                      title="This bookmark points outside the document (a web link or another file). Click to point it at a page instead."
                      onClick={() => update(i, { page: 1 })}
                      className="px-1.5 py-1 text-[11px] text-slate-500 border border-dashed border-slate-300 rounded"
                    >
                      link
                    </button>
                  ) : (
                    <input
                      type="number"
                      aria-label={`Target page of bookmark ${i + 1}`}
                      min={1}
                      max={pageCount}
                      value={it.page}
                      onChange={(e) => {
                        const v = parseInt(e.target.value, 10);
                        if (!Number.isNaN(v)) update(i, { page: Math.min(pageCount, Math.max(1, v)) });
                      }}
                      className="w-14 px-1.5 py-1 text-xs font-mono text-slate-900 border border-slate-200 rounded focus:outline-none focus:border-slate-400"
                    />
                  )}
                </label>
                {nesting && (
                  <>
                    <button type="button" className={iconBtn} aria-label="Outdent" title="Outdent" disabled={it.level === 0} onClick={() => onChange(shiftLevel(items, i, -1))}>
                      <IndentDecrease size={14} />
                    </button>
                    <button type="button" className={iconBtn} aria-label="Indent" title="Indent (make it a child of the one above)" disabled={!canIndent} onClick={() => onChange(shiftLevel(items, i, 1))}>
                      <IndentIncrease size={14} />
                    </button>
                  </>
                )}
                <button type="button" className={iconBtn} aria-label="Move up" title="Move up" disabled={!hasPrevSibling} onClick={() => onChange(moveItem(items, i, -1))}>
                  <ArrowUp size={14} />
                </button>
                <button type="button" className={iconBtn} aria-label="Move down" title="Move down" disabled={!hasNextSibling} onClick={() => onChange(moveItem(items, i, 1))}>
                  <ArrowDown size={14} />
                </button>
                <button type="button" className={iconBtn} aria-label="Delete" title="Delete (children move up a level)" onClick={() => onChange(removeItem(items, i))}>
                  <Trash2 size={14} />
                </button>
              </li>
            );
          })}
        </ol>
      )}
      <SecondaryButton onClick={add}>
        <Plus size={13} /> {addLabel}
      </SecondaryButton>
    </div>
  );
}

/** Editor items → outline entries for writing. */
export function toEntries(items: EditorItem[]) {
  return items.map((it) => ({
    title: it.title.trim() || "Untitled",
    pageIndex: it.page === null ? null : it.page - 1,
    level: it.level,
    sourceRef: it.sourceRef,
    sourcePageIndex: it.sourcePageIndex,
    open: it.open,
  }));
}
