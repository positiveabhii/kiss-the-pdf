"use client";

import { useCallback, useEffect, useState } from "react";
import { ListOrdered, Loader2 } from "lucide-react";

import { SimplePdfTool } from "../core/SimplePdfTool";
import { outputName } from "../core/pdf-io";
import { Notice, OptionsPanel, SecondaryButton } from "../core/ui";
import { loadOutline, saveWithOutline, type OutlineEntry } from "./ops/outline";
import { OutlineEditor, newId, toEntries, type EditorItem } from "./components/OutlineEditor";

/**
 * Shared by "bookmarks" (create an outline) and "edit-bookmarks" (load the
 * existing one and change it). Both end by rewriting the whole /Outlines tree.
 */

interface Loaded {
  bytes: Uint8Array;
  entries: OutlineEntry[] | null;
  error: string | null;
}

function OutlineLoader({ bytes, onDone }: { bytes: Uint8Array; onDone: (l: Loaded) => void }) {
  useEffect(() => {
    let alive = true;
    loadOutline(bytes)
      .then((entries) => alive && onDone({ bytes, entries, error: null }))
      .catch((e: unknown) => alive && onDone({ bytes, entries: null, error: e instanceof Error ? e.message : String(e) }));
    return () => {
      alive = false;
    };
  }, [bytes, onDone]);
  return null;
}

function fromEntries(entries: OutlineEntry[]): EditorItem[] {
  return entries.map((e) => ({
    id: newId(),
    title: e.title,
    page: e.pageIndex === null ? null : e.pageIndex + 1,
    level: e.level,
    sourceRef: e.sourceRef,
    sourcePageIndex: e.sourcePageIndex,
    open: e.open,
  }));
}

function onePerPageItems(pageCount: number): EditorItem[] {
  return Array.from({ length: pageCount }, (_, i) => ({ id: newId(), title: `Page ${i + 1}`, page: i + 1, level: 0 }));
}

export function BookmarksTool({ mode }: { mode: "create" | "edit" }) {
  const [loaded, setLoaded] = useState<Loaded | null>(null);
  const [items, setItems] = useState<EditorItem[]>([]);
  const [startedEmpty, setStartedEmpty] = useState(false);

  // Runs once per opened file (the loader's effect is keyed on the bytes).
  const onLoaded = useCallback(
    (l: Loaded) => {
      setLoaded(l);
      setStartedEmpty(!l.entries?.length);
      // Edit mode starts from the existing outline; create mode starts empty.
      setItems(mode === "edit" && l.entries ? fromEntries(l.entries) : []);
    },
    [mode]
  );

  return (
    <SimplePdfTool
      actionLabel={mode === "edit" ? "Save bookmarks" : "Add bookmarks"}
      processingMessage="Writing bookmarks…"
      onReset={() => {
        setLoaded(null);
        setItems([]);
      }}
      validate={(doc) => {
        if (!loaded || loaded.bytes !== doc.bytes) return "Reading bookmarks…";
        if (mode === "create" && items.length === 0) return "Add at least one bookmark.";
        if (mode === "edit" && items.length === 0 && startedEmpty) return "Add at least one bookmark.";
        if (items.some((i) => !i.title.trim())) return "Every bookmark needs a title.";
        return null;
      }}
      options={(doc) => {
        const ready = loaded && loaded.bytes === doc.bytes;
        const existing = ready ? loaded.entries?.length ?? 0 : 0;
        return (
          <>
            <OutlineLoader bytes={doc.bytes} onDone={onLoaded} />
            {!ready ? (
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Loader2 size={14} className="animate-spin" /> Reading bookmarks…
              </div>
            ) : (
              <>
                {loaded.error && <Notice tone="error">{loaded.error}</Notice>}
                {mode === "create" && existing > 0 && (
                  <Notice tone="warning">
                    This PDF already has {existing} bookmark{existing === 1 ? "" : "s"}. Saving replaces them.{" "}
                    <button
                      type="button"
                      className="underline font-semibold"
                      onClick={() => setItems(fromEntries(loaded.entries!))}
                    >
                      Load them here to keep and extend them
                    </button>
                  </Notice>
                )}
                {mode === "edit" && existing === 0 && (
                  <Notice>This PDF has no bookmarks yet. Create some below and they&apos;ll be added.</Notice>
                )}
                <OptionsPanel title={`Bookmarks (${items.length})`}>
                  <div className="flex flex-wrap gap-2">
                    <SecondaryButton
                      onClick={() => {
                        if (items.length && !window.confirm("Replace the current list with one bookmark per page?")) return;
                        setItems(onePerPageItems(doc.pageCount));
                      }}
                    >
                      <ListOrdered size={13} /> One bookmark per page
                    </SecondaryButton>
                    {mode === "edit" && existing > 0 && (
                      <SecondaryButton onClick={() => setItems(fromEntries(loaded.entries!))}>Undo all changes</SecondaryButton>
                    )}
                  </div>
                  <OutlineEditor items={items} onChange={setItems} pageCount={doc.pageCount} />
                  <p className="text-[11px] text-slate-500">
                    Indent makes a bookmark a child of the one above it. Moving a bookmark moves its children with it.
                    {items.some((i) => i.page === null) &&
                      " Bookmarks marked “link” point to a web page or another file and are kept as they are."}
                  </p>
                </OptionsPanel>
                {mode === "edit" && items.length === 0 && existing > 0 && (
                  <Notice tone="warning">Saving now removes all bookmarks from this PDF.</Notice>
                )}
              </>
            )}
          </>
        );
      }}
      run={async ({ file, bytes }) => {
        const out = await saveWithOutline(bytes, toEntries(items));
        return {
          kind: "file",
          data: out,
          fileName: outputName(file, "bookmarked"),
          title: items.length ? "Bookmarks saved" : "Bookmarks removed",
          summary: items.length
            ? `${items.length} bookmark${items.length === 1 ? "" : "s"}. The bookmarks panel opens automatically in most viewers.`
            : "The PDF no longer has bookmarks.",
        };
      }}
    />
  );
}

export default function Bookmarks() {
  return <BookmarksTool mode="create" />;
}
