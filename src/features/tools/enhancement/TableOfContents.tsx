"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

import { SegmentedControl } from "@/features/pdf/components/shared/SegmentedControl";

import { SimplePdfTool } from "../core/SimplePdfTool";
import { outputName } from "../core/pdf-io";
import { Checkbox, Field, Notice, NumberInput, OptionsPanel, Select, TextInput } from "../core/ui";
import { loadOutline, type OutlineEntry } from "./ops/outline";
import { insertToc, type TocEntry } from "./ops/toc";
import { OutlineEditor, newId, type EditorItem } from "./components/OutlineEditor";

type Source = "bookmarks" | "manual";
type Where = "front" | "after";

interface Loaded {
  bytes: Uint8Array;
  entries: OutlineEntry[];
}

function Loader({ bytes, onDone }: { bytes: Uint8Array; onDone: (l: Loaded) => void }) {
  useEffect(() => {
    let alive = true;
    loadOutline(bytes)
      .then((entries) => alive && onDone({ bytes, entries }))
      .catch(() => alive && onDone({ bytes, entries: [] }));
    return () => {
      alive = false;
    };
  }, [bytes, onDone]);
  return null;
}

export default function TableOfContents() {
  const [loaded, setLoaded] = useState<Loaded | null>(null);
  const [source, setSource] = useState<Source>("bookmarks");
  const [manual, setManual] = useState<EditorItem[]>([]);
  const [title, setTitle] = useState("Contents");
  const [where, setWhere] = useState<Where>("front");
  const [afterPage, setAfterPage] = useState(1);
  const [fontSize, setFontSize] = useState(11);
  const [leaders, setLeaders] = useState(true);
  const [depth, setDepth] = useState("2");

  const onLoaded = useCallback((l: Loaded) => {
    setLoaded(l);
    const usable = l.entries.filter((e) => e.pageIndex !== null);
    setSource(usable.length ? "bookmarks" : "manual");
  }, []);

  const entriesFor = (doc: { bytes: Uint8Array; pageCount: number }): TocEntry[] => {
    if (source === "bookmarks") {
      if (!loaded || loaded.bytes !== doc.bytes) return [];
      const maxLevel = parseInt(depth, 10) - 1;
      return loaded.entries
        .filter((e) => e.pageIndex !== null && e.level <= maxLevel)
        .map((e) => ({ title: e.title, pageIndex: e.pageIndex!, level: e.level }));
    }
    return manual
      .filter((m) => m.page !== null && m.title.trim())
      .map((m) => ({ title: m.title, pageIndex: m.page! - 1, level: m.level }));
  };

  return (
    <SimplePdfTool
      actionLabel="Insert table of contents"
      processingMessage="Building the table of contents…"
      onReset={() => {
        setLoaded(null);
        setManual([]);
      }}
      validate={(doc) => {
        if (!loaded || loaded.bytes !== doc.bytes) return "Reading bookmarks…";
        if (!entriesFor(doc).length) return source === "bookmarks" ? "No bookmarks to list." : "Add at least one entry.";
        return null;
      }}
      options={(doc) => {
        const ready = loaded && loaded.bytes === doc.bytes;
        const bookmarkCount = ready ? loaded.entries.filter((e) => e.pageIndex !== null).length : 0;
        const entries = entriesFor(doc);
        return (
          <>
            <Loader bytes={doc.bytes} onDone={onLoaded} />
            {!ready ? (
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Loader2 size={14} className="animate-spin" /> Reading bookmarks…
              </div>
            ) : (
              <>
                <OptionsPanel>
                  <SegmentedControl
                    label="Entries"
                    size="sm"
                    options={[
                      { value: "bookmarks", label: `From bookmarks (${bookmarkCount})` },
                      { value: "manual", label: "Type my own" },
                    ]}
                    value={source}
                    onChange={(v) => {
                      setSource(v);
                      if (v === "manual" && manual.length === 0 && bookmarkCount) {
                        setManual(
                          loaded.entries
                            .filter((e) => e.pageIndex !== null)
                            .map((e) => ({ id: newId(), title: e.title, page: e.pageIndex! + 1, level: e.level }))
                        );
                      }
                    }}
                  />
                  {source === "bookmarks" ? (
                    bookmarkCount === 0 ? (
                      <Notice tone="warning">
                        This PDF has no bookmarks to build a table of contents from. Choose “Type my own”, or add
                        bookmarks first with the Bookmarks tool.
                      </Notice>
                    ) : (
                      <Field label="Levels to include" htmlFor="toc-depth">
                        <Select
                          id="toc-depth"
                          value={depth}
                          onChange={setDepth}
                          options={[
                            { value: "1", label: "Top level only" },
                            { value: "2", label: "Two levels" },
                            { value: "3", label: "Three levels" },
                            { value: "9", label: "All levels" },
                          ]}
                        />
                      </Field>
                    )
                  ) : (
                    <OutlineEditor
                      items={manual}
                      onChange={setManual}
                      pageCount={doc.pageCount}
                      emptyText="No entries yet."
                      addLabel="Add entry"
                    />
                  )}
                  <p className="text-[11px] text-slate-500">
                    {entries.length} entr{entries.length === 1 ? "y" : "ies"}. Page numbers refer to the original
                    pages and are shifted automatically to account for the inserted contents pages.
                  </p>
                </OptionsPanel>
                <OptionsPanel>
                  <Field label="Title" htmlFor="toc-title">
                    <TextInput id="toc-title" value={title} onChange={(e) => setTitle(e.target.value)} />
                  </Field>
                  <div className="flex flex-wrap items-end gap-4">
                    <SegmentedControl
                      label="Insert"
                      size="sm"
                      options={[
                        { value: "front", label: "At the front" },
                        { value: "after", label: "After page…" },
                      ]}
                      value={where}
                      onChange={setWhere}
                    />
                    {where === "after" && (
                      <NumberInput
                        id="toc-after"
                        value={afterPage}
                        onChange={(v) => setAfterPage(Math.min(doc.pageCount, Math.max(1, Math.round(v))))}
                        min={1}
                        max={doc.pageCount}
                      />
                    )}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="Text size" htmlFor="toc-size">
                      <NumberInput id="toc-size" value={fontSize} onChange={(v) => setFontSize(Math.min(18, Math.max(7, v)))} min={7} max={18} suffix="pt" />
                    </Field>
                  </div>
                  <Checkbox id="toc-leaders" checked={leaders} onChange={setLeaders} label="Dotted leaders" />
                </OptionsPanel>
                <Notice>
                  Each line links to its page. The contents pages match the size of the page they follow (or the first page when
                  inserted at the front). Titles use Helvetica, which covers Latin characters only; anything else shows as “?”.
                </Notice>
              </>
            )}
          </>
        );
      }}
      run={async (ctx) => {
        const entries = entriesFor(ctx);
        const r = await insertToc(ctx.bytes, {
          title,
          entries,
          insertAt: where === "front" ? 0 : afterPage,
          fontSize,
          leaders,
        });
        return {
          kind: "file",
          data: r.bytes,
          fileName: outputName(ctx.file, "toc"),
          title: "Table of contents added",
          summary: `${entries.length} entr${entries.length === 1 ? "y" : "ies"} on ${r.tocPages} page${
            r.tocPages === 1 ? "" : "s"
          }, inserted ${where === "front" ? "at the front" : `after page ${afterPage}`}.${
            r.replacedChars ? " Some characters were replaced with “?”." : ""
          }`,
        };
      }}
    />
  );
}
