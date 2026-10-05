"use client";

import { useState } from "react";
import { RotateCcw, RotateCw } from "lucide-react";

import { SegmentedControl } from "@/features/pdf/components/shared/SegmentedControl";

import { SimplePdfTool } from "../core/SimplePdfTool";
import { outputName } from "../core/pdf-io";
import { Notice, OptionsPanel } from "../core/ui";
import { rotatePages } from "./ops/rotate";

type Angle = 90 | 180 | 270;

const ANGLES: { value: Angle; label: string; icon?: React.ReactNode }[] = [
  { value: 90, label: "90° right", icon: <RotateCw size={13} /> },
  { value: 180, label: "180°" },
  { value: 270, label: "90° left", icon: <RotateCcw size={13} /> },
];

/** Rotate every page by the same angle. */
export default function RotateEntirePdf() {
  const [angle, setAngle] = useState<Angle>(90);
  return (
    <SimplePdfTool
      actionLabel="Rotate all pages"
      processingMessage="Rotating pages…"
      onReset={() => setAngle(90)}
      options={(doc) => (
        <OptionsPanel title="Rotation">
          <SegmentedControl options={ANGLES} value={angle} onChange={setAngle} />
          <Notice>
            All {doc.pageCount} page{doc.pageCount === 1 ? "" : "s"} will be turned{" "}
            {angle === 180 ? "upside down" : angle === 90 ? "a quarter turn clockwise" : "a quarter turn counter-clockwise"}.
            Pages that were already rotated keep their rotation and turn further. Nothing is
            re-rendered, so text and quality stay exactly the same.
          </Notice>
        </OptionsPanel>
      )}
      run={async ({ file, bytes, onProgress, signal }) => {
        const { bytes: data, rotated } = await rotatePages(bytes, () => angle, { onProgress, signal });
        return {
          kind: "file",
          data,
          fileName: outputName(file, "rotated"),
          title: "PDF rotated",
          summary: `${rotated} page${rotated === 1 ? "" : "s"} rotated ${angle === 270 ? "90° left" : angle === 90 ? "90° right" : "180°"}.`,
        };
      }}
    />
  );
}
