"use client";

import { useState } from "react";

import { outputName } from "../core/pdf-io";
import { Field, Notice, NumberInput, OptionsPanel, PrimaryButton, Select, TextInput } from "../core/ui";
import type { OpenedPdf } from "./components/open-pdf";
import { PdfFileSlot } from "./components/PdfFileSlot";
import { useToolRun } from "./components/useToolRun";
import { insertPdfPages, type InsertPdfOptions } from "./ops/insert";
import { tryParsePages } from "./ops/ranges";

type Position = InsertPdfOptions["position"];

/** Insert pages from a second PDF into a main PDF at a chosen position. */
export default function InsertPdfPages() {
  const [main, setMain] = useState<OpenedPdf | null>(null);
  const [other, setOther] = useState<OpenedPdf | null>(null);
  const [range, setRange] = useState("");
  const [position, setPosition] = useState<Position>("after");
  const [page, setPage] = useState(1);
  const { view, execute, error } = useToolRun({
    processingMessage: "Inserting pages…",
    onStartOver: () => {
      setMain(null);
      setOther(null);
      setRange("");
      setPosition("after");
      setPage(1);
    },
  });

  if (view) return view;

  const parsed = other ? tryParsePages(range, other.pageCount) : { pages: [], error: null };
  const insertCount = other ? (range.trim() ? parsed.pages.length : other.pageCount) : 0;
  let blocked: string | null = null;
  if (!main || !other) blocked = "Add both PDFs.";
  else if (parsed.error) blocked = "Fix the page range.";
  else if (insertCount === 0) blocked = "Choose at least one page to insert.";
  else if (position === "after" && !(Number.isInteger(page) && page >= 1 && page <= main.pageCount)) {
    blocked = `Choose a page between 1 and ${main.pageCount}.`;
  }

  const run = () =>
    execute(async ({ onProgress, signal }) => {
      const r = await insertPdfPages(main!.bytes, other!.bytes, { range, position, page }, { onProgress, signal });
      const where = position === "start" ? "at the start" : position === "end" ? "at the end" : `after page ${page}`;
      return {
        kind: "file",
        data: r.data,
        fileName: outputName(main!.file, "with-inserted-pages"),
        title: "Pages inserted",
        summary: `${r.inserted} page${r.inserted === 1 ? "" : "s"} from ${other!.file.name} inserted ${where}. ${r.pageCount} pages in total.`,
      };
    });

  return (
    <div className="w-full min-w-0 max-w-3xl mx-auto space-y-5">
      <PdfFileSlot label="1. Main PDF" title="Select the main PDF" value={main} onChange={setMain} />
      <PdfFileSlot label="2. PDF to insert pages from" title="Select the PDF to insert" value={other} onChange={setOther} />

      {main && other && (
        <OptionsPanel title="What and where">
          <Field
            label={`Pages of ${other.file.name}`}
            htmlFor="insert-range"
            hint={`Leave blank for all ${other.pageCount} pages, or e.g. 1-3, 5, 8-.`}
          >
            <TextInput
              id="insert-range"
              value={range}
              onChange={(e) => setRange(e.target.value)}
              placeholder={`All pages (1-${other.pageCount})`}
              className="font-mono"
              aria-invalid={!!parsed.error}
            />
          </Field>
          {parsed.error && <Notice tone="error">{parsed.error}</Notice>}
          <div className="flex flex-wrap items-end gap-4">
            <Field label={`Insert into ${main.file.name}`} htmlFor="insert-position">
              <Select<Position>
                id="insert-position"
                value={position}
                onChange={setPosition}
                options={[
                  { value: "after", label: "After page…" },
                  { value: "start", label: "At the start" },
                  { value: "end", label: "At the end" },
                ]}
              />
            </Field>
            {position === "after" && (
              <Field label="Page" htmlFor="insert-page" hint={`1 – ${main.pageCount}`}>
                <NumberInput id="insert-page" value={page} min={1} max={main.pageCount} step={1} onChange={(v) => setPage(Math.round(v))} />
              </Field>
            )}
          </div>
          {!blocked && (
            <p className="text-xs text-slate-600">
              {insertCount} page{insertCount === 1 ? "" : "s"} will be inserted; the result will have {main.pageCount + insertCount} pages.
            </p>
          )}
        </OptionsPanel>
      )}

      {(main || other) && (
        <>
          <PrimaryButton onClick={() => void run()} disabled={!!blocked}>
            Insert pages
          </PrimaryButton>
          {blocked && <p className="text-[11px] text-slate-500 text-center -mt-2">{blocked}</p>}
        </>
      )}
      {error && <Notice tone="error">{error}</Notice>}
    </div>
  );
}
