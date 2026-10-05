"use client";

import { useState } from "react";

import { SegmentedControl } from "@/features/pdf/components/shared/SegmentedControl";

import { SimplePdfTool } from "../core/SimplePdfTool";
import { hexToRgb01, MM_TO_PT, outputName } from "../core/pdf-io";
import { ColorInput, Field, Notice, OptionsPanel } from "../core/ui";
import { MarginFields } from "./components/MarginFields";
import { ScopePicker, resolveScope, useScope } from "./components/PageScope";
import { addMargins, type MarginMode } from "./ops/margins";
import type { Margins, Unit } from "./ops/units";

const MODES: { value: MarginMode; label: string }[] = [
  { value: "enlarge", label: "Make pages bigger" },
  { value: "shrink", label: "Keep page size, shrink content" },
];

const DEFAULT = 10 * MM_TO_PT;
const INITIAL: Margins = { top: DEFAULT, right: DEFAULT, bottom: DEFAULT, left: DEFAULT };

export default function AddMargins() {
  const [margins, setMargins] = useState<Margins>(INITIAL);
  const [unit, setUnit] = useState<Unit>("mm");
  const [linked, setLinked] = useState(true);
  const [mode, setMode] = useState<MarginMode>("enlarge");
  const [color, setColor] = useState("#ffffff");
  const [scope, setScope, resetScope] = useScope();
  const empty = Object.values(margins).every((v) => v <= 0);

  return (
    <SimplePdfTool
      preview
      actionLabel="Add margins"
      processingMessage="Adding margins…"
      onReset={resetScope}
      validate={(doc) => (empty ? "Enter a margin for at least one side." : resolveScope(scope, doc.pageCount).error)}
      options={(doc) => (
        <>
          <OptionsPanel title="Margins">
            <MarginFields
              value={margins}
              onChange={setMargins}
              unit={unit}
              onUnitChange={setUnit}
              linked={linked}
              onLinkedChange={(v) => {
                setLinked(v);
                if (v) setMargins({ top: margins.top, right: margins.top, bottom: margins.top, left: margins.top });
              }}
              max={2000}
            />
            <SegmentedControl label="How" options={MODES} value={mode} onChange={setMode} />
            <p className="text-[11px] text-slate-500 -mt-2">
              {mode === "enlarge"
                ? "The paper grows by the margins; the content keeps its exact size."
                : "The paper keeps its size; the content is scaled down (proportionally) to fit inside the margins."}
            </p>
            <Field label="Margin colour" htmlFor="margin-color">
              <ColorInput id="margin-color" value={color} onChange={setColor} />
            </Field>
          </OptionsPanel>
          {doc.pageCount > 1 && (
            <OptionsPanel>
              <ScopePicker doc={doc} value={scope} onChange={setScope} />
            </OptionsPanel>
          )}
          <Notice>Text stays sharp and selectable, and links move with the content.</Notice>
        </>
      )}
      run={async ({ file, bytes, pageCount, onProgress, signal }) => {
        const { pages } = resolveScope(scope, pageCount);
        const res = await addMargins(bytes, pages, {
          margins,
          mode,
          color: hexToRgb01(color),
          onProgress,
          signal,
        });
        return {
          kind: "file",
          data: res.bytes,
          fileName: outputName(file, "margins"),
          title: "Margins added",
          summary: `${res.changed} page${res.changed === 1 ? "" : "s"} ${mode === "enlarge" ? "enlarged" : "given margins"}.`,
        };
      }}
    />
  );
}
