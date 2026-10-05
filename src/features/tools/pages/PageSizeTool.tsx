"use client";

import { useState } from "react";

import { SegmentedControl } from "@/features/pdf/components/shared/SegmentedControl";

import { SimplePdfTool } from "../core/SimplePdfTool";
import { outputName } from "../core/pdf-io";
import { Field, NumberInput, Notice, OptionsPanel, Select } from "../core/ui";
import { ScopePicker, resolveScope, useScope } from "./components/PageScope";
import { UNIT_OPTIONS } from "./components/MarginFields";
import { resizePages, type FitMode, type Orientation } from "./ops/pageSize";
import { describePaper, fromPt, PAGE_SIZES, roundFor, toPt, type PageSizeName, type Unit } from "./ops/units";

type SizeChoice = PageSizeName | "custom";

const SIZE_OPTIONS: { value: SizeChoice; label: string }[] = [
  ...(Object.keys(PAGE_SIZES) as PageSizeName[]).map((n) => ({
    value: n,
    label: `${n} (${describePaper(n)})`,
  })),
  { value: "custom", label: "Custom size" },
];

const ORIENTATION_OPTIONS: { value: Orientation; label: string }[] = [
  { value: "auto", label: "Match each page" },
  { value: "portrait", label: "Portrait" },
  { value: "landscape", label: "Landscape" },
];

const FIT_OPTIONS: { value: FitMode; label: string }[] = [
  { value: "fit", label: "Fit (keep proportions)" },
  { value: "stretch", label: "Stretch to fill" },
  { value: "actual", label: "Keep original scale" },
];

const FIT_HINT: Record<FitMode, string> = {
  fit: "Content is scaled up or down to fit the new paper without distortion, and centred. Leftover space stays white.",
  stretch: "Content is stretched to fill the whole sheet. Text and images get distorted if the proportions differ.",
  actual: "Content keeps its size and is centred. On smaller paper the edges are cut off.",
};

/**
 * One engine behind resize-pdf, change-page-size, a4/a3/letter/legal-pdf and
 * custom-page-size. `preset`:
 *  - "any"    → every size to choose from (A4 selected)
 *  - "custom" → starts on a custom width × height
 *  - a size   → fixed to that paper (orientation and fit still adjustable)
 */
export function PageSizeTool({ preset = "any" }: { preset?: "any" | "custom" | PageSizeName }) {
  const fixed = preset !== "any" && preset !== "custom" ? preset : null;
  const [size, setSize] = useState<SizeChoice>(fixed ?? (preset === "custom" ? "custom" : "A4"));
  const [unit, setUnit] = useState<Unit>("mm");
  const [custom, setCustom] = useState<{ width: number; height: number }>({ width: PAGE_SIZES.A4.width, height: PAGE_SIZES.A4.height });
  const [orientation, setOrientation] = useState<Orientation>("auto");
  const [fit, setFit] = useState<FitMode>("fit");
  const [scope, setScope, resetScope] = useScope();

  const paper = size === "custom" ? custom : PAGE_SIZES[size];
  const paperLabel = size === "custom" ? "the custom size" : size;
  const customError =
    size !== "custom"
      ? null
      : custom.width < 36 || custom.height < 36
        ? "The custom size must be at least 0.5 in (12.7 mm) each way."
        : custom.width > 14400 || custom.height > 14400
          ? "PDF pages can be at most 200 in (5080 mm) each way."
          : null;

  return (
    <SimplePdfTool
      preview
      actionLabel={fixed ? `Convert to ${fixed}` : "Resize pages"}
      processingMessage="Resizing pages…"
      onReset={resetScope}
      validate={(doc) => customError ?? resolveScope(scope, doc.pageCount).error}
      options={(doc) => (
        <>
          <OptionsPanel title="Paper">
            {fixed ? (
              <p className="text-sm text-slate-700">
                Every page goes onto <strong>{fixed}</strong> paper ({describePaper(fixed)}).
              </p>
            ) : (
              <Field label="Page size" htmlFor="page-size">
                <Select id="page-size" value={size} onChange={setSize} options={SIZE_OPTIONS} />
              </Field>
            )}
            {size === "custom" && (
              <div className="space-y-3">
                <SegmentedControl label="Units" options={UNIT_OPTIONS} value={unit} onChange={setUnit} size="sm" />
                <div className="flex flex-wrap gap-4">
                  <Field label="Width" htmlFor="custom-w">
                    <NumberInput
                      id="custom-w"
                      value={roundFor(unit, fromPt(custom.width, unit))}
                      onChange={(v) => setCustom((c) => ({ ...c, width: toPt(v, unit) }))}
                      min={0}
                      step={unit === "in" ? 0.1 : 1}
                      suffix={unit}
                    />
                  </Field>
                  <Field label="Height" htmlFor="custom-h">
                    <NumberInput
                      id="custom-h"
                      value={roundFor(unit, fromPt(custom.height, unit))}
                      onChange={(v) => setCustom((c) => ({ ...c, height: toPt(v, unit) }))}
                      min={0}
                      step={unit === "in" ? 0.1 : 1}
                      suffix={unit}
                    />
                  </Field>
                </div>
                {customError && <Notice tone="warning">{customError}</Notice>}
              </div>
            )}
            <SegmentedControl
              label="Orientation"
              options={ORIENTATION_OPTIONS}
              value={orientation}
              onChange={setOrientation}
            />
            {orientation === "auto" && (
              <p className="text-[11px] text-slate-500 -mt-2">
                Landscape pages go on landscape {paperLabel}, portrait pages on portrait {paperLabel}.
              </p>
            )}
            <SegmentedControl label="Content" options={FIT_OPTIONS} value={fit} onChange={setFit} />
            <p className="text-[11px] text-slate-500 -mt-2">{FIT_HINT[fit]}</p>
          </OptionsPanel>
          {doc.pageCount > 1 && (
            <OptionsPanel>
              <ScopePicker doc={doc} value={scope} onChange={setScope} />
            </OptionsPanel>
          )}
          <Notice>
            Pages are placed on new paper without re-rendering, so text stays sharp and selectable.
            Links stay clickable and move with the content. Pages that are already this size are left
            as they are.
          </Notice>
        </>
      )}
      run={async ({ file, bytes, pageCount, onProgress, signal }) => {
        const { pages } = resolveScope(scope, pageCount);
        const res = await resizePages(bytes, pages, { paper, orientation, fit, onProgress, signal });
        if (res.changed === 0) {
          return {
            kind: "report",
            title: "Nothing to change",
            summary: `All ${res.unchanged} selected page${res.unchanged === 1 ? " is" : "s are"} already ${paperLabel} in the requested orientation, so no new file was made.`,
            content: null,
          };
        }
        const name = size === "custom" ? "resized" : size.toLowerCase();
        return {
          kind: "file",
          data: res.bytes,
          fileName: outputName(file, name),
          title: "Pages resized",
          summary:
            `${res.changed} page${res.changed === 1 ? "" : "s"} placed on ${paperLabel}` +
            (res.unchanged ? `; ${res.unchanged} already had that size and were left alone.` : "."),
        };
      }}
    />
  );
}
