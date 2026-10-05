"use client";

import { useState } from "react";
import type { PDFDocumentProxy } from "pdfjs-dist";
import {
  Copy,
  FilePlus2,
  RotateCcw,
  RotateCw,
  SquareDashed,
  Trash2,
  Undo2,
} from "lucide-react";

import { SimplePdfTool } from "../core/SimplePdfTool";
import { outputName, PAGE_SIZES, UserFacingError } from "../core/pdf-io";
import { Notice } from "../core/ui";
import { SortablePageGrid, type SortableTile } from "./components/SortablePageGrid";
import { nextId } from "./components/open-pdf";
import { usePageThumbnails } from "./components/usePageThumbnails";
import { usePerFileState } from "./components/usePerFileState";
import { buildPdf } from "./ops/assemble";
import { moveItems, sameOrder } from "./ops/list";
import {
  deleteItems,
  duplicateItems,
  initialItems,
  insertBlankAfter,
  rotateItems,
  toPlan,
  type OrgItem,
} from "./ops/organize";

interface OrgState {
  items: OrgItem[];
  history: OrgItem[][];
  selected: Set<string>;
}

const MAX_HISTORY = 100;
const makeId = () => nextId("o");

/** Original pages get deterministic ids (p0, p1…) so the initial state is a pure function of the page count. */
function originalItems(pageCount: number): OrgItem[] {
  let i = 0;
  return initialItems(pageCount, () => `p${i++}`);
}

function freshState(pageCount: number): OrgState {
  return { items: originalItems(pageCount), history: [], selected: new Set() };
}

function isPristine(items: OrgItem[]): boolean {
  return items.every((it, i) => it.kind === "page" && it.index === i && it.rotate === 0);
}

/** Size of the page a new blank page will sit after, as displayed. */
async function displayedSize(item: OrgItem | undefined, pdfjs: PDFDocumentProxy | null) {
  if (!item) return { ...PAGE_SIZES.A4 };
  if (item.kind === "blank") return { width: item.width, height: item.height };
  if (!pdfjs) return { ...PAGE_SIZES.A4 };
  const page = await pdfjs.getPage(item.index + 1);
  const vp = page.getViewport({ scale: 1, rotation: (page.rotate + item.rotate) % 360 });
  return { width: vp.width, height: vp.height };
}

function ToolbarButton({
  onClick,
  disabled,
  label,
  shortcut,
  children,
  danger,
}: {
  onClick: () => void;
  disabled?: boolean;
  label: string;
  shortcut?: string;
  children: React.ReactNode;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={shortcut ? `${label} (${shortcut})` : label}
      aria-keyshortcuts={shortcut}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-md border bg-white shadow-2xs transition-colors disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 ${
        danger
          ? "text-red-700 border-red-200 hover:bg-red-50"
          : "text-slate-700 border-slate-200 hover:bg-slate-50"
      }`}
    >
      {children}
      <span>{label}</span>
    </button>
  );
}

export function OrganizeEditor({
  pdfjs,
  pageCount,
  state,
  onChange,
}: {
  pdfjs: PDFDocumentProxy | null;
  pageCount: number;
  state: OrgState;
  onChange: (next: OrgState) => void;
}) {
  const { thumbs, request } = usePageThumbnails(pdfjs);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState("");
  const { items, selected, history } = state;
  const present = new Set(items.map((it) => it.id));
  const sel = new Set(Array.from(selected).filter((id) => present.has(id)));
  const count = sel.size;

  /** Apply an edit, remembering the previous arrangement for undo. */
  const commit = (nextItems: OrgItem[], nextSelected: Set<string> = sel, message = "") => {
    setError(null);
    setStatus(message);
    onChange({
      items: nextItems,
      selected: nextSelected,
      history: [...history, items].slice(-MAX_HISTORY),
    });
  };

  const guard = (fn: () => void) => {
    try {
      fn();
    } catch (err) {
      setError(err instanceof UserFacingError ? err.message : String(err));
    }
  };

  const rotate = (delta: number) =>
    commit(rotateItems(items, sel, delta), sel, `Rotated ${count} page${count === 1 ? "" : "s"}.`);
  const remove = () =>
    guard(() => commit(deleteItems(items, sel), new Set(), `Deleted ${count} page${count === 1 ? "" : "s"}.`));
  const duplicate = () => {
    const { items: next, added } = duplicateItems(items, sel, makeId);
    commit(next, new Set(added), `Duplicated ${count} page${count === 1 ? "" : "s"}; the copies are selected.`);
  };
  const insertBlank = async () => {
    let anchor: OrgItem | undefined = items[items.length - 1];
    for (let i = items.length - 1; i >= 0; i--) {
      if (sel.has(items[i].id)) {
        anchor = items[i];
        break;
      }
    }
    let size: { width: number; height: number } = { ...PAGE_SIZES.A4 };
    try {
      size = await displayedSize(anchor, pdfjs);
    } catch {
      // keep A4
    }
    const { items: next, added } = insertBlankAfter(items, sel, size, makeId);
    commit(next, new Set([added]), `Inserted a blank page ${count ? "after the selection" : "at the end"}.`);
  };
  const undo = () => {
    if (!history.length) return;
    setError(null);
    setStatus("Undone.");
    const prev = history[history.length - 1];
    onChange({ items: prev, history: history.slice(0, -1), selected: new Set() });
  };
  const reset = () => commit(originalItems(pageCount), new Set(), "Back to the original arrangement.");
  const selectAll = () => onChange({ ...state, selected: new Set(items.map((it) => it.id)) });
  const selectNone = () => onChange({ ...state, selected: new Set() });

  const tiles: SortableTile[] = items.map((it) =>
    it.kind === "page"
      ? {
          id: it.id,
          label: `Page ${it.index + 1}${it.rotate ? `, rotated ${it.rotate}°` : ""}`,
          caption: `p. ${it.index + 1}${it.rotate ? ` · ${it.rotate}°` : ""}`,
          thumb: thumbs.get(it.index + 1),
          rotation: it.rotate,
          onVisible: () => request(it.index + 1),
        }
      : {
          id: it.id,
          label: "Blank page",
          caption: "blank",
          blank: { width: it.width, height: it.height },
        }
  );

  return (
    <div
      className="space-y-3"
      onKeyDown={(e) => {
        const mod = e.metaKey || e.ctrlKey;
        const inField = (e.target as HTMLElement).closest("input, textarea, select");
        if (inField) return;
        if (mod && e.key.toLowerCase() === "z") {
          e.preventDefault();
          undo();
        } else if (mod && e.key.toLowerCase() === "a") {
          e.preventDefault();
          selectAll();
        } else if ((e.key === "Delete" || e.key === "Backspace") && count) {
          e.preventDefault();
          remove();
        } else if (e.key === "Escape" && count) {
          selectNone();
        }
      }}
    >
      <div className="sticky top-0 z-20 -mx-1 px-1 py-2 bg-slate-50/95 backdrop-blur-sm border-b border-slate-200/70 space-y-2">
        <div className="flex flex-wrap items-center gap-1.5" role="toolbar" aria-label="Page actions">
          <ToolbarButton onClick={() => rotate(-90)} disabled={!count} label="Rotate left">
            <RotateCcw size={13} aria-hidden="true" />
          </ToolbarButton>
          <ToolbarButton onClick={() => rotate(90)} disabled={!count} label="Rotate right">
            <RotateCw size={13} aria-hidden="true" />
          </ToolbarButton>
          <ToolbarButton onClick={duplicate} disabled={!count} label="Duplicate">
            <Copy size={13} aria-hidden="true" />
          </ToolbarButton>
          <ToolbarButton onClick={() => void insertBlank()} label={count ? "Blank after" : "Blank at end"}>
            <FilePlus2 size={13} aria-hidden="true" />
          </ToolbarButton>
          <ToolbarButton onClick={remove} disabled={!count} label="Delete" shortcut="Delete" danger>
            <Trash2 size={13} aria-hidden="true" />
          </ToolbarButton>
          <span className="mx-1 h-5 w-px bg-slate-200" aria-hidden="true" />
          <ToolbarButton onClick={undo} disabled={!history.length} label="Undo" shortcut="Control+Z">
            <Undo2 size={13} aria-hidden="true" />
          </ToolbarButton>
          <ToolbarButton onClick={reset} disabled={isPristine(items)} label="Reset">
            <SquareDashed size={13} aria-hidden="true" />
          </ToolbarButton>
        </div>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-500">
          <span>
            {items.length} page{items.length === 1 ? "" : "s"} · {count} selected
          </span>
          <button type="button" onClick={selectAll} className="font-medium text-slate-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 rounded">
            Select all
          </button>
          <button type="button" onClick={selectNone} disabled={!count} className="font-medium text-slate-700 hover:underline disabled:opacity-40 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 rounded">
            Select none
          </button>
          <span className="hidden sm:inline">Click pages to add or remove them from the selection, Shift+click for a run, drag to move.</span>
        </div>
        <p className="sr-only" aria-live="polite">
          {status}
        </p>
      </div>
      {error && <Notice tone="error">{error}</Notice>}
      <SortablePageGrid
        ariaLabel="Pages"
        tiles={tiles}
        selected={sel}
        onSelectionChange={(next) => onChange({ ...state, selected: next })}
        onMove={(ids, at) => {
          const next = moveItems(items, ids, at);
          if (!sameOrder(next, items)) commit(next, sel, `Moved ${ids.length} page${ids.length === 1 ? "" : "s"}.`);
        }}
      />
    </div>
  );
}

/**
 * The flagship page manager: reorder (drag or keyboard), rotate, delete,
 * duplicate and insert blank pages on one PDF, with undo — then save.
 */
export default function OrganizePdf() {
  const org = usePerFileState<OrgState>();
  const stateFor = (file: File, pageCount: number): OrgState => org.get(file, freshState(pageCount));

  return (
    <SimplePdfTool
      preview
      actionLabel="Save arranged PDF"
      processingMessage="Building your PDF…"
      onReset={() => {
        org.reset();
      }}
      validate={(doc) => (isPristine(stateFor(doc.file, doc.pageCount).items) ? "Make a change first — rotate, move, delete, duplicate or add a page." : null)}
      options={(doc) => (
        <OrganizeEditor
          key={doc.file.name + doc.file.lastModified}
          pdfjs={doc.pdfjs}
          pageCount={doc.pageCount}
          state={stateFor(doc.file, doc.pageCount)}
          onChange={(next) => org.set(doc.file, next)}
        />
      )}
      run={async ({ file, bytes, pageCount, onProgress, signal }) => {
        const { items } = stateFor(file, pageCount);
        const data = await buildPdf([bytes], toPlan(items), { onProgress, signal });
        const blanks = items.filter((it) => it.kind === "blank").length;
        const rotated = items.filter((it) => it.kind === "page" && it.rotate).length;
        const kept = new Set(items.flatMap((it) => (it.kind === "page" ? [it.index] : []))).size;
        const parts = [`${items.length} page${items.length === 1 ? "" : "s"}`];
        if (kept < pageCount) parts.push(`${pageCount - kept} removed`);
        if (rotated) parts.push(`${rotated} rotated`);
        if (blanks) parts.push(`${blanks} blank added`);
        return {
          kind: "file",
          data,
          fileName: outputName(file, "organized"),
          title: "PDF organized",
          summary: parts.join(" · ") + ".",
        };
      }}
    />
  );
}
