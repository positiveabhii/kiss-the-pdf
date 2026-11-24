"use client";

import { useCallback, useState } from "react";
import type { PDFDocumentProxy } from "pdfjs-dist";
import { Loader2, Search, Trash2 } from "lucide-react";

import { SimplePdfTool } from "../core/SimplePdfTool";
import { PageViewer } from "../core/PageViewer";
import { outputName } from "../core/pdf-io";
import { Checkbox, Field, Notice, OptionsPanel, SecondaryButton, Select } from "../core/ui";
import { PageNav } from "../pages/components/PageNav";
import { formatFileSize } from "@/features/pdf/utils/format-file-size";
import { RedactOverlay } from "./components/RedactOverlay";
import { findMarks, markId, mergeMarks, PRESETS, redactPdf, type Preset, type RedactColor, type RedactMark } from "./ops/redact";

const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? "" : "s"}`;

export default function RedactPdf() {
  const [marks, setMarks] = useState<RedactMark[]>([]);
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<string | null>(null);
  const [color, setColor] = useState<RedactColor>("black");
  const [dpi, setDpi] = useState<"150" | "200" | "300">("200");
  const [removeMetadata, setRemoveMetadata] = useState(true);
  const [query, setQuery] = useState("");
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [wholeWord, setWholeWord] = useState(false);
  const [finding, setFinding] = useState(false);
  const [findMsg, setFindMsg] = useState<{ tone: "info" | "warning"; text: string } | null>(null);

  const reset = useCallback(() => {
    setMarks([]);
    setPage(1);
    setSelected(null);
    setQuery("");
    setFindMsg(null);
  }, []);

  const deleteMark = useCallback((id: string) => {
    setMarks((all) => all.filter((m) => m.id !== id));
    setSelected(null);
  }, []);

  async function find(pdfjs: PDFDocumentProxy, what: { query: string } | { preset: Preset }) {
    setFinding(true);
    setFindMsg(null);
    try {
      const res = await findMarks(pdfjs, "query" in what ? { query: what.query, caseSensitive, wholeWord } : what);
      const label = "query" in what ? `“${what.query.trim()}”` : what.preset.label.toLowerCase();
      if (res.matches === 0) {
        setFindMsg({
          tone: "warning",
          text:
            res.pagesWithoutText === pdfjs.numPages
              ? "This PDF has no text layer (it looks scanned), so text search can't find anything. Draw boxes by hand instead."
              : `No ${label} found.`,
        });
        return;
      }
      setMarks((all) => mergeMarks(all, res.marks));
      const first = res.marks[0]?.page;
      if (first) setPage(first);
      setFindMsg({
        tone: res.pagesWithoutText ? "warning" : "info",
        text:
          `Marked ${plural(res.matches, "match")} for ${label} on ${plural(res.pagesWithMatches, "page")}. Review them before redacting.` +
          (res.pagesWithoutText ? ` ${plural(res.pagesWithoutText, "page")} had no text layer and couldn't be searched.` : ""),
      });
    } finally {
      setFinding(false);
    }
  }

  const pagesMarked = [...new Set(marks.map((m) => m.page))].sort((a, b) => a - b);
  const countOn = (p: number) => marks.filter((m) => m.page === p).length;

  return (
    <SimplePdfTool
      preview
      actionLabel={marks.length ? `Redact ${plural(marks.length, "area")} on ${plural(pagesMarked.length, "page")}` : "Redact PDF"}
      processingMessage="Redacting pages…"
      onReset={reset}
      validate={() => (marks.length ? null : "Draw boxes on the page, or use Find & redact, to mark what to remove.")}
      intro={
        <Notice>
          Redaction permanently removes what you mark. Unlike covering text with a box, the content underneath is deleted, not
          hidden, so it can&apos;t be copied, searched or recovered from the file.
        </Notice>
      }
      options={(doc) => {
        const p = Math.min(page, doc.pageCount);
        const onPage = marks.filter((m) => m.page === p);
        return (
          <>
            <OptionsPanel title="Mark areas to redact">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <PageNav page={p} count={doc.pageCount} onChange={(n) => { setPage(n); setSelected(null); }} label="Page" />
                <div className="flex gap-2">
                  {onPage.length > 0 && (
                    <SecondaryButton onClick={() => setMarks((all) => all.filter((m) => m.page !== p))}>Clear this page</SecondaryButton>
                  )}
                  {marks.length > 0 && (
                    <SecondaryButton onClick={() => { setMarks([]); setSelected(null); }}>
                      <Trash2 size={12} /> Clear all
                    </SecondaryButton>
                  )}
                </div>
              </div>
              <p className="text-[11px] text-slate-500">
                Drag on the page to draw a box over anything to remove. Click a box to select it, then press Delete or its × to remove it.
              </p>
              {doc.pdfjs ? (
                <PageViewer doc={doc.pdfjs} pageNumber={p} maxWidth={560}>
                  {(geom) => (
                    <RedactOverlay
                      geom={geom}
                      page={p}
                      marks={onPage}
                      color={color}
                      selectedId={selected}
                      onSelect={setSelected}
                      onDelete={deleteMark}
                      onAdd={(r) => setMarks((all) => [...all, { id: markId(), page: p, ...r, source: "manual" }])}
                    />
                  )}
                </PageViewer>
              ) : (
                <p className="text-xs text-slate-500">Preparing page preview…</p>
              )}
              {pagesMarked.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5 text-xs" aria-label="Pages with redactions">
                  <span className="font-semibold text-slate-600">{plural(marks.length, "box")} on:</span>
                  {pagesMarked.map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => { setPage(n); setSelected(null); }}
                      className={`rounded-full px-2 py-0.5 font-mono ${n === p ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}
                    >
                      p.{n} <span className="opacity-60">({countOn(n)})</span>
                    </button>
                  ))}
                </div>
              )}
            </OptionsPanel>

            <OptionsPanel title="Find & redact">
              <form
                className="flex gap-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (doc.pdfjs && query.trim()) void find(doc.pdfjs, { query });
                }}
              >
                <div className="relative flex-1">
                  <Search size={14} className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    id="redact-search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Word or phrase, e.g. a name"
                    className="w-full rounded-md border border-slate-200 py-2 pl-8 pr-3 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
                  />
                </div>
                <button
                  type="submit"
                  disabled={!doc.pdfjs || !query.trim() || finding}
                  className="inline-flex items-center gap-1.5 rounded-md bg-slate-900 px-3 text-xs font-semibold text-white disabled:opacity-40"
                >
                  {finding && <Loader2 size={13} className="animate-spin" />} Find &amp; mark
                </button>
              </form>
              <div className="flex flex-wrap gap-4">
                <Checkbox id="redact-case" checked={caseSensitive} onChange={setCaseSensitive} label="Match case" />
                <Checkbox id="redact-word" checked={wholeWord} onChange={setWholeWord} label="Whole words only" />
              </div>
              <div className="space-y-1.5">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Quick find</p>
                <div className="flex flex-wrap gap-2">
                  {PRESETS.map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      disabled={!doc.pdfjs || finding}
                      onClick={() => doc.pdfjs && void find(doc.pdfjs, { preset })}
                      title={preset.hint}
                      className="rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-700 hover:bg-slate-50 disabled:opacity-40"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
                <p className="text-[11px] text-slate-500">
                  Pattern matches can miss unusual formats or catch extra numbers, so check every page before redacting.
                </p>
              </div>
              {findMsg && <Notice tone={findMsg.tone}>{findMsg.text}</Notice>}
            </OptionsPanel>

            <OptionsPanel title="Output">
              <div className="flex flex-wrap gap-4">
                <Field label="Box colour" htmlFor="redact-color">
                  <Select id="redact-color" value={color} onChange={setColor} options={[{ value: "black", label: "Black" }, { value: "white", label: "White" }]} />
                </Field>
                <Field label="Quality of redacted pages" htmlFor="redact-dpi">
                  <Select
                    id="redact-dpi"
                    value={dpi}
                    onChange={setDpi}
                    options={[
                      { value: "150", label: "150 DPI (smaller file)" },
                      { value: "200", label: "200 DPI (recommended)" },
                      { value: "300", label: "300 DPI (print quality)" },
                    ]}
                  />
                </Field>
              </div>
              <Checkbox id="redact-metadata" checked={removeMetadata} onChange={setRemoveMetadata} label="Remove document metadata (title, author, XMP)" />
            </OptionsPanel>

            <Notice tone="warning">
              Each page with a redaction is turned into an image so nothing under the boxes survives. Text on those pages can no
              longer be selected or searched; pages without redactions keep their text. Bookmarks and form fields are not carried
              over. Keep your original file.
            </Notice>
          </>
        );
      }}
      run={async ({ file, bytes, onProgress, signal }) => {
        const res = await redactPdf(bytes, marks, { dpi: Number(dpi) as 150 | 200 | 300, color, removeMetadata, onProgress, signal });
        const v = res.verification;
        return {
          kind: "file",
          data: res.bytes,
          fileName: outputName(file, "redacted"),
          title: v.ok ? "PDF redacted" : "PDF redacted: check the result",
          summary: [
            `${plural(marks.length, "area")} removed on ${plural(res.redactedPages.length, "page")} · ${formatFileSize(res.bytes.byteLength)}.`,
            v.ok
              ? "Verified: no text remains under redactions (redacted pages contain no text or annotations)."
              : `Verification found ${plural(v.textItemsLeft, "text item")} and ${plural(v.annotationsLeft, "annotation")} on redacted pages.`,
            removeMetadata ? "Document metadata removed." : "",
          ]
            .filter(Boolean)
            .join(" "),
        };
      }}
    />
  );
}
