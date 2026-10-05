"use client";

import { ArrowDownUp, RotateCcw } from "lucide-react";
import type { PDFDocumentProxy } from "pdfjs-dist";

import { SimplePdfTool } from "../core/SimplePdfTool";
import { outputName } from "../core/pdf-io";
import { SecondaryButton } from "../core/ui";
import { SortablePageGrid, type SortableTile } from "./components/SortablePageGrid";
import { usePageThumbnails } from "./components/usePageThumbnails";
import { usePerFileState } from "./components/usePerFileState";
import { moveItems } from "./ops/list";
import { reorderPages } from "./ops/pages";

interface Item {
  id: string;
  index: number;
}

const identity = (n: number): Item[] => Array.from({ length: n }, (_, index) => ({ id: `p${index}`, index }));

export function ReorderEditor({
  pdfjs,
  items,
  onChange,
}: {
  pdfjs: PDFDocumentProxy | null;
  items: Item[];
  onChange: (next: Item[]) => void;
}) {
  const { thumbs, request } = usePageThumbnails(pdfjs);
  const tiles: SortableTile[] = items.map((it) => {
    return {
      id: it.id,
      label: `Page ${it.index + 1}`,
      caption: `page ${it.index + 1}`,
      thumb: thumbs.get(it.index + 1),
      onVisible: () => request(it.index + 1),
    };
  });
  const changed = items.some((it, i) => it.index !== i);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs text-slate-600">
          Drag pages into the order you want, or use the arrows (Alt+←/→ on a focused page).
        </p>
        <div className="flex gap-2">
          <SecondaryButton onClick={() => onChange(items.slice().reverse())}>
            <ArrowDownUp size={13} aria-hidden="true" /> Reverse
          </SecondaryButton>
          <SecondaryButton onClick={() => onChange(identity(items.length))} disabled={!changed}>
            <RotateCcw size={13} aria-hidden="true" /> Reset
          </SecondaryButton>
        </div>
      </div>
      <SortablePageGrid
        ariaLabel="Pages in their new order"
        tiles={tiles}
        onMove={(ids, at) => onChange(moveItems(items, ids, at))}
      />
    </div>
  );
}

/** Drag-and-drop page reordering. Each page keeps its own rotation. */
export default function ReorderPages() {
  const order = usePerFileState<Item[]>();

  return (
    <SimplePdfTool
      preview
      actionLabel="Save new order"
      processingMessage="Reordering pages…"
      onReset={order.reset}
      validate={(doc) => {
        if (doc.pageCount < 2) return "This PDF has only one page.";
        const items = order.get(doc.file, identity(doc.pageCount));
        return items.every((it, i) => it.index === i) ? "Move at least one page first." : null;
      }}
      options={(doc) => (
        <ReorderEditor
          key={doc.file.name + doc.file.lastModified}
          pdfjs={doc.pdfjs}
          items={order.get(doc.file, identity(doc.pageCount))}
          onChange={(next) => order.set(doc.file, next)}
        />
      )}
      run={async ({ file, bytes, pageCount, onProgress, signal }) => {
        const items = order.get(file, identity(pageCount));
        const { data } = await reorderPages(bytes, items.map((it) => it.index), { onProgress, signal });
        const moved = items.filter((it, i) => it.index !== i).length;
        return {
          kind: "file",
          data,
          fileName: outputName(file, "reordered"),
          title: "Pages reordered",
          summary: `${pageCount} pages; ${moved} changed position.`,
        };
      }}
    />
  );
}
