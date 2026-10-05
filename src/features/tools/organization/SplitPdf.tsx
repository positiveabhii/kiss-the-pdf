"use client";

import { useState } from "react";

import { SegmentedControl } from "@/features/pdf/components/shared/SegmentedControl";

import { SimplePdfTool } from "../core/SimplePdfTool";
import { outputName } from "../core/pdf-io";
import { Field, Notice, NumberInput, OptionsPanel, TextInput } from "../core/ui";
import { splitGroups, splitPdf, type SplitMode } from "./ops/split";
import { formatPageList, rangeLabel, type RangeGroup } from "./ops/ranges";

type ModeName = SplitMode["mode"];

function describe(mode: SplitMode, pageCount: number): { groups: RangeGroup[] | null; error: string | null } {
  try {
    return { groups: splitGroups(mode, pageCount), error: null };
  } catch (err) {
    return { groups: null, error: err instanceof Error ? err.message : String(err) };
  }
}

/** Split into single pages, every N pages, custom ranges (one file each), or extract ranges into one file. */
export default function SplitPdf() {
  const [modeName, setModeName] = useState<ModeName>("ranges");
  const [size, setSize] = useState(2);
  const [ranges, setRanges] = useState("");

  const mode: SplitMode =
    modeName === "single"
      ? { mode: "single" }
      : modeName === "every"
        ? { mode: "every", size }
        : { mode: modeName, ranges };

  return (
    <SimplePdfTool
      actionLabel={modeName === "extract" ? "Extract ranges" : "Split PDF"}
      processingMessage="Splitting PDF…"
      onReset={() => {
        setModeName("ranges");
        setSize(2);
        setRanges("");
      }}
      validate={(doc) => {
        if (modeName === "single" && doc.pageCount < 2) return "This PDF has only one page.";
        if ((modeName === "ranges" || modeName === "extract") && !ranges.trim()) return "Enter the page ranges.";
        const { groups, error } = describe(mode, doc.pageCount);
        if (error) return error;
        if (modeName === "every" && groups!.length < 2) return `This PDF has ${doc.pageCount} pages — that's a single file of ${size}.`;
        return null;
      }}
      options={(doc) => {
        const { groups, error } = describe(mode, doc.pageCount);
        const covered = new Set<number>();
        groups?.forEach((g) => {
          for (let p = g.start; p <= g.end; p++) covered.add(p);
        });
        const missing = Array.from({ length: doc.pageCount }, (_, i) => i + 1).filter((p) => !covered.has(p));
        const showGroups = groups && groups.length > 0 && (modeName === "ranges" || modeName === "every");
        return (
          <OptionsPanel title="How to split">
            <SegmentedControl<ModeName>
              label="Mode"
              value={modeName}
              onChange={setModeName}
              options={[
                { value: "ranges", label: "Custom ranges" },
                { value: "single", label: "Every page" },
                { value: "every", label: "Every N pages" },
                { value: "extract", label: "Ranges into one file" },
              ]}
            />
            {modeName === "single" && (
              <p className="text-xs text-slate-600">
                Each of the {doc.pageCount} pages becomes its own PDF ({outputName(doc.file, "p1")}, …).
              </p>
            )}
            {modeName === "every" && (
              <Field label="Pages per file" htmlFor="split-size">
                <NumberInput id="split-size" value={size} min={1} max={doc.pageCount} step={1} onChange={(v) => setSize(Math.round(v))} />
              </Field>
            )}
            {(modeName === "ranges" || modeName === "extract") && (
              <Field
                label="Page ranges"
                htmlFor="split-ranges"
                hint={
                  modeName === "ranges"
                    ? `Each comma-separated range becomes its own file. "7-" means page 7 to the end. Pages 1–${doc.pageCount}.`
                    : `All listed ranges are combined, in the order you type them, into one PDF. Pages 1–${doc.pageCount}.`
                }
              >
                <TextInput
                  id="split-ranges"
                  value={ranges}
                  onChange={(e) => setRanges(e.target.value)}
                  placeholder="e.g. 1-3, 4-6, 7-"
                  className="font-mono"
                  aria-invalid={!!(ranges.trim() && error)}
                />
              </Field>
            )}
            {ranges.trim() && error && (modeName === "ranges" || modeName === "extract") && (
              <Notice tone="error">{error}</Notice>
            )}
            {showGroups && (
              <div className="space-y-1.5">
                <p className="text-xs text-slate-600">
                  {groups!.length} file{groups!.length === 1 ? "" : "s"}:
                </p>
                <ul className="flex flex-wrap gap-1.5" aria-label="Files that will be created">
                  {groups!.slice(0, 60).map((g, i) => (
                    <li key={i} className="px-2 py-0.5 text-[11px] font-mono bg-slate-100 border border-slate-200 rounded text-slate-700">
                      {outputName(doc.file, rangeLabel(g))}
                    </li>
                  ))}
                  {groups!.length > 60 && <li className="text-[11px] text-slate-500">…and {groups!.length - 60} more</li>}
                </ul>
              </div>
            )}
            {modeName === "extract" && groups && (
              <p className="text-xs text-slate-600">
                One PDF with {groups.reduce((n, g) => n + g.end - g.start + 1, 0)} pages.
              </p>
            )}
            {groups && missing.length > 0 && (modeName === "ranges" || modeName === "extract") && (
              <Notice tone="warning">
                Page{missing.length === 1 ? "" : "s"} {formatPageList(missing)} {missing.length === 1 ? "isn't" : "aren't"} in any range and will be left out.
              </Notice>
            )}
          </OptionsPanel>
        );
      }}
      run={async ({ file, bytes, onProgress, signal }) => {
        const files = await splitPdf(bytes, file.name, mode, { onProgress, signal });
        if (modeName === "extract") {
          const f = files[0];
          return {
            kind: "file",
            data: f.data,
            fileName: f.fileName,
            title: "Ranges extracted",
            summary: `${f.pageCount} page${f.pageCount === 1 ? "" : "s"} in one PDF.`,
          };
        }
        return {
          kind: "files",
          files: files.map((f) => ({ fileName: f.fileName, data: f.data })),
          zipName: outputName(file, "split", "zip"),
          title: "PDF split",
          summary: `${files.length} PDF${files.length === 1 ? "" : "s"} created from ${file.name}.`,
        };
      }}
    />
  );
}
