"use client";

import { useState } from "react";

import { SegmentedControl } from "@/features/pdf/components/shared/SegmentedControl";

import { SimplePdfTool } from "../core/SimplePdfTool";
import { outputName } from "../core/pdf-io";
import { Field, NumberInput, OptionsPanel } from "../core/ui";
import { PageSelectGrid } from "./components/PageSelectGrid";
import { usePerFileState } from "./components/usePerFileState";
import { duplicatePages, type DuplicatePlacement } from "./ops/pages";
import { formatPageList } from "./ops/ranges";

const NONE = new Set<number>();

/** Select pages, choose how many copies and where they go. */
export default function DuplicatePages() {
  const selection = usePerFileState<Set<number>>();
  const [copies, setCopies] = useState(1);
  const [placement, setPlacement] = useState<DuplicatePlacement>("after");

  return (
    <SimplePdfTool
      preview
      actionLabel="Duplicate pages"
      processingMessage="Duplicating pages…"
      onReset={() => {
        selection.reset();
        setCopies(1);
        setPlacement("after");
      }}
      validate={(doc) => {
        if (selection.get(doc.file, NONE).size === 0) return "Select the pages to duplicate.";
        if (!(copies >= 1 && copies <= 10 && Number.isInteger(copies))) return "Choose 1 to 10 copies.";
        return null;
      }}
      options={(doc) => {
        const selected = selection.get(doc.file, NONE);
        const total = doc.pageCount + selected.size * (copies >= 1 && copies <= 10 ? Math.floor(copies) : 0);
        return (
          <>
            <OptionsPanel title="Copies">
              <div className="flex flex-wrap gap-6">
                <Field label="Copies of each page" htmlFor="dup-copies" hint="1 to 10">
                  <NumberInput id="dup-copies" value={copies} min={1} max={10} step={1} onChange={(v) => setCopies(Math.round(v))} />
                </Field>
                <SegmentedControl<DuplicatePlacement>
                  label="Place copies"
                  value={placement}
                  onChange={setPlacement}
                  options={[
                    { value: "after", label: "Right after each original" },
                    { value: "end", label: "At the end" },
                  ]}
                />
              </div>
              {selected.size > 0 && (
                <p className="text-[11px] text-slate-500">The result will have {total} pages.</p>
              )}
            </OptionsPanel>
            <PageSelectGrid
              key={doc.file.name + doc.file.lastModified}
              label="Pages to duplicate"
              pdfjs={doc.pdfjs}
              pageCount={doc.pageCount}
              selected={selected}
              onChange={(next) => selection.set(doc.file, next)}
            />
          </>
        );
      }}
      run={async ({ file, bytes, onProgress, signal }) => {
        const pages = Array.from(selection.get(file, NONE));
        const { data, pageCount } = await duplicatePages(bytes, pages, copies, placement, { onProgress, signal });
        return {
          kind: "file",
          data,
          fileName: outputName(file, "duplicated"),
          title: "Pages duplicated",
          summary: `${copies} cop${copies === 1 ? "y" : "ies"} of page${pages.length === 1 ? "" : "s"} ${formatPageList(pages)} added ${placement === "after" ? "after each original" : "at the end"}. ${pageCount} pages in total.`,
        };
      }}
    />
  );
}
