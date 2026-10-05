"use client";

import { useState } from "react";

import { SegmentedControl } from "@/features/pdf/components/shared/SegmentedControl";

import { SimplePdfTool } from "../core/SimplePdfTool";
import { outputName } from "../core/pdf-io";
import { Field, NumberInput, OptionsPanel, Select } from "../core/ui";
import type { BlankSize } from "./ops/assemble";
import { insertBlankPages, type InsertPosition } from "./ops/insert";

const POSITIONS: { value: InsertPosition; label: string }[] = [
  { value: "after", label: "After page…" },
  { value: "before", label: "Before page…" },
  { value: "start", label: "At the start" },
  { value: "end", label: "At the end" },
];

/** Insert one or more blank pages at a chosen position. */
export default function InsertBlankPage() {
  const [position, setPosition] = useState<InsertPosition>("after");
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(1);
  const [size, setSize] = useState<BlankSize>("match");

  const needsPage = position === "before" || position === "after";

  return (
    <SimplePdfTool
      actionLabel={`Insert ${count === 1 ? "blank page" : `${count} blank pages`}`}
      processingMessage="Inserting blank pages…"
      onReset={() => {
        setPosition("after");
        setPage(1);
        setCount(1);
        setSize("match");
      }}
      validate={(doc) => {
        if (needsPage && !(Number.isInteger(page) && page >= 1 && page <= doc.pageCount)) {
          return `Choose a page between 1 and ${doc.pageCount}.`;
        }
        if (!(Number.isInteger(count) && count >= 1 && count <= 100)) return "Insert between 1 and 100 pages.";
        return null;
      }}
      options={(doc) => (
        <OptionsPanel title="Blank pages">
          <div className="flex flex-wrap items-end gap-4">
            <Field label="Position" htmlFor="blank-position">
              <Select id="blank-position" value={position} onChange={setPosition} options={POSITIONS} />
            </Field>
            {needsPage && (
              <Field label="Page" htmlFor="blank-page" hint={`1 – ${doc.pageCount}`}>
                <NumberInput id="blank-page" value={page} min={1} max={doc.pageCount} step={1} onChange={(v) => setPage(Math.round(v))} />
              </Field>
            )}
            <Field label="How many" htmlFor="blank-count">
              <NumberInput id="blank-count" value={count} min={1} max={100} step={1} onChange={(v) => setCount(Math.round(v))} />
            </Field>
          </div>
          <SegmentedControl<BlankSize>
            label="Page size"
            value={size}
            onChange={setSize}
            options={[
              { value: "match", label: "Match adjacent page" },
              { value: "A4", label: "A4" },
              { value: "Letter", label: "Letter" },
            ]}
          />
        </OptionsPanel>
      )}
      run={async ({ file, bytes, onProgress, signal }) => {
        const r = await insertBlankPages(bytes, { position, page, count, size }, { onProgress, signal });
        const where =
          position === "start" ? "at the start" : position === "end" ? "at the end" : `${position} page ${page}`;
        return {
          kind: "file",
          data: r.data,
          fileName: outputName(file, "with-blank"),
          title: "Blank pages inserted",
          summary: `${count} blank page${count === 1 ? "" : "s"} (${Math.round(r.size.width)}×${Math.round(r.size.height)} pt) added ${where}. ${r.pageCount} pages in total.`,
        };
      }}
    />
  );
}
