"use client";

import { useState } from "react";

import { SegmentedControl } from "@/features/pdf/components/shared/SegmentedControl";

import { SimplePdfTool } from "../core/SimplePdfTool";
import { outputName } from "../core/pdf-io";
import { Field, NumberInput, Notice, OptionsPanel, RangeInput } from "../core/ui";
import { ScopePicker, resolveScope, useScope } from "./components/PageScope";
import { scalePages, type ScaleAnchor, type ScaleMode } from "./ops/scale";

const MODES: { value: ScaleMode; label: string }[] = [
  { value: "content", label: "Scale content, keep page size" },
  { value: "page", label: "Scale whole page" },
];

const ANCHORS: { value: ScaleAnchor; label: string }[] = [
  { value: "center", label: "Centre" },
  { value: "top-left", label: "Top-left" },
];

export default function ScalePdf() {
  const [percent, setPercent] = useState(90);
  const [mode, setMode] = useState<ScaleMode>("content");
  const [anchor, setAnchor] = useState<ScaleAnchor>("center");
  const [scope, setScope, resetScope] = useScope();
  const clamp = (v: number) => Math.min(400, Math.max(10, Math.round(v)));

  return (
    <SimplePdfTool
      preview
      actionLabel={`Scale to ${percent}%`}
      processingMessage="Scaling pages…"
      onReset={resetScope}
      validate={(doc) =>
        percent < 10 || percent > 400
          ? "Choose a scale between 10% and 400%."
          : percent === 100
            ? "Choose a scale other than 100%."
            : resolveScope(scope, doc.pageCount).error
      }
      options={(doc) => (
        <>
          <OptionsPanel title="Scale">
            <Field label="Scale" htmlFor="scale-pct">
              <RangeInput value={clamp(percent)} onChange={(v) => setPercent(clamp(v))} min={10} max={400} step={5} format={(v) => `${v}%`} />
              <NumberInput id="scale-pct" value={percent} onChange={(v) => setPercent(Math.round(v))} min={10} max={400} step={1} suffix="%" />
            </Field>
            <SegmentedControl label="What to scale" options={MODES} value={mode} onChange={setMode} />
            {mode === "content" ? (
              <>
                <SegmentedControl label="Anchor" options={ANCHORS} value={anchor} onChange={setAnchor} size="sm" />
                <p className="text-[11px] text-slate-500 -mt-2">
                  {percent > 100
                    ? "Content larger than the page is cut off at the edges."
                    : `The content shrinks towards the ${anchor === "center" ? "centre" : "top-left corner"}; the rest of the page stays white.`}
                </p>
              </>
            ) : (
              <p className="text-[11px] text-slate-500 -mt-2">
                The paper and everything on it grow or shrink together (e.g. 50% turns A4 into A6).
              </p>
            )}
          </OptionsPanel>
          {doc.pageCount > 1 && (
            <OptionsPanel>
              <ScopePicker doc={doc} value={scope} onChange={setScope} />
            </OptionsPanel>
          )}
          <Notice>Scaling is done in the PDF itself, so text stays sharp and selectable.</Notice>
        </>
      )}
      run={async ({ file, bytes, pageCount, onProgress, signal }) => {
        const { pages } = resolveScope(scope, pageCount);
        const res = await scalePages(bytes, pages, { percent, mode, anchor, onProgress, signal });
        return {
          kind: "file",
          data: res.bytes,
          fileName: outputName(file, `scaled-${percent}`),
          title: "PDF scaled",
          summary: `${res.changed} page${res.changed === 1 ? "" : "s"} scaled to ${percent}%${mode === "page" ? " (page size included)" : ""}.`,
        };
      }}
    />
  );
}
