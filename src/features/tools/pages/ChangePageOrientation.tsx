"use client";

import { useState } from "react";

import { SegmentedControl } from "@/features/pdf/components/shared/SegmentedControl";

import { SimplePdfTool } from "../core/SimplePdfTool";
import { outputName, UserFacingError } from "../core/pdf-io";
import { Notice, OptionsPanel } from "../core/ui";
import { ScopePicker, resolveScope, useScope } from "./components/PageScope";
import { changeOrientation, type OrientationMethod, type OrientationTarget } from "./ops/orientation";

const TARGETS: { value: OrientationTarget; label: string }[] = [
  { value: "portrait", label: "Portrait" },
  { value: "landscape", label: "Landscape" },
];

const METHODS: { value: OrientationMethod; label: string }[] = [
  { value: "rotate", label: "Rotate pages" },
  { value: "relayout", label: "Re-layout on turned paper" },
];

const DIRECTIONS: { value: 90 | 270; label: string }[] = [
  { value: 90, label: "Clockwise" },
  { value: 270, label: "Counter-clockwise" },
];

export default function ChangePageOrientation() {
  const [target, setTarget] = useState<OrientationTarget>("landscape");
  const [method, setMethod] = useState<OrientationMethod>("rotate");
  const [direction, setDirection] = useState<90 | 270>(90);
  const [scope, setScope, resetScope] = useScope();

  return (
    <SimplePdfTool
      preview
      actionLabel={`Make pages ${target}`}
      processingMessage="Changing orientation…"
      onReset={resetScope}
      validate={(doc) => resolveScope(scope, doc.pageCount).error}
      options={(doc) => (
        <>
          <OptionsPanel title="Orientation">
            <SegmentedControl label="Make pages" options={TARGETS} value={target} onChange={setTarget} />
            <SegmentedControl label="How" options={METHODS} value={method} onChange={setMethod} />
            {method === "rotate" ? (
              <>
                <SegmentedControl label="Turn" options={DIRECTIONS} value={direction} onChange={setDirection} size="sm" />
                <p className="text-[11px] text-slate-500">
                  Each page that isn&apos;t {target} yet is turned a quarter turn — the content turns with
                  it, like rotating a sheet of paper. Nothing is re-rendered.
                </p>
              </>
            ) : (
              <p className="text-[11px] text-slate-500">
                Each page that isn&apos;t {target} yet is swapped for the same paper turned sideways
                (e.g. A4 portrait → A4 landscape). The content stays upright and is scaled down to fit,
                centred, so there will be blank space on the sides.
              </p>
            )}
          </OptionsPanel>
          {doc.pageCount > 1 && (
            <OptionsPanel>
              <ScopePicker doc={doc} value={scope} onChange={setScope} />
            </OptionsPanel>
          )}
          <Notice>Pages that are already {target} (and square pages) are left untouched.</Notice>
        </>
      )}
      run={async ({ file, bytes, pageCount, onProgress, signal }) => {
        const { pages } = resolveScope(scope, pageCount);
        const res = await changeOrientation(bytes, pages, { target, method, direction, onProgress, signal });
        if (res.changed === 0) {
          throw new UserFacingError(
            `All the chosen pages are already ${target}, so there is nothing to change.`
          );
        }
        return {
          kind: "file",
          data: res.bytes,
          fileName: outputName(file, target),
          title: `Pages now ${target}`,
          summary:
            `${res.changed} page${res.changed === 1 ? "" : "s"} changed to ${target}` +
            (res.alreadyOk ? `; ${res.alreadyOk} already ${target} and left alone.` : "."),
        };
      }}
    />
  );
}
