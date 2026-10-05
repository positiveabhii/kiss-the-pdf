"use client";

import { useState } from "react";

import { SegmentedControl } from "@/features/pdf/components/shared/SegmentedControl";
import { formatFileSize } from "@/features/pdf/utils/format-file-size";
import type { CompressionMode } from "@/features/pdf/engine/operations/compress";

import { SimplePdfTool } from "../core/SimplePdfTool";
import { outputName } from "../core/pdf-io";
import { Field, Notice, NumberInput, OptionsPanel } from "../core/ui";
import { compressSafely } from "./ops/compress";

const MODES: { value: CompressionMode; label: string; hint: string }[] = [
  {
    value: "maximum-quality",
    label: "Best quality",
    hint: "Lossless: rewrites the file structure more compactly. Images are untouched.",
  },
  {
    value: "balanced",
    label: "Balanced",
    hint: "Re-encodes JPEG photos at high quality, keeping their resolution.",
  },
  {
    value: "smaller",
    label: "Smaller",
    hint: "Re-encodes JPEG photos at medium quality and about 150 dpi. Text and vector graphics stay sharp.",
  },
  {
    value: "target-size",
    label: "Target size",
    hint: "Steps image quality down until the file fits, within limits that keep it readable.",
  },
];

export default function CompressPdf() {
  const [mode, setMode] = useState<CompressionMode>("balanced");
  const [targetKb, setTargetKb] = useState(500);

  return (
    <SimplePdfTool
      actionLabel="Compress PDF"
      processingMessage="Compressing…"
      validate={(doc) => {
        if (mode === "target-size") {
          if (!(targetKb > 0)) return "Enter a target size.";
          if (targetKb * 1024 >= doc.file.size) return `The file is already ${formatFileSize(doc.file.size)} — pick a smaller target.`;
        }
        return null;
      }}
      options={(doc) => (
        <>
          <OptionsPanel>
            <SegmentedControl
              label="Compression"
              size="sm"
              options={MODES.map((m) => ({ value: m.value, label: m.label }))}
              value={mode}
              onChange={setMode}
            />
            <p className="text-[11px] text-slate-500 -mt-2">{MODES.find((m) => m.value === mode)!.hint}</p>
            {mode === "target-size" && (
              <Field label="Target size" htmlFor="cmp-target" hint={`The file is now ${formatFileSize(doc.file.size)}.`}>
                <NumberInput id="cmp-target" value={targetKb} onChange={(v) => setTargetKb(Math.max(1, Math.round(v)))} min={1} suffix="KB" />
              </Field>
            )}
          </OptionsPanel>
          <Notice>
            Compression here works on the file&apos;s structure and its JPEG photos. PDFs that are mostly text, vector
            drawings, or already-optimised images may not shrink — if the result isn&apos;t smaller you&apos;ll get your
            original file back, not a bigger one.
          </Notice>
        </>
      )}
      run={async ({ file, bytes }) => {
        const r = await compressSafely(bytes, mode, mode === "target-size" ? targetKb * 1024 : undefined);
        const sizes = `${formatFileSize(r.originalSize)} → ${formatFileSize(r.newSize)}`;
        if (r.keptOriginal) {
          return {
            kind: "file",
            data: r.bytes,
            fileName: outputName(file, ""),
            title: "Already as small as we can make it",
            summary: `Compressing didn't make this file smaller, so here is your original, unchanged (${formatFileSize(
              r.originalSize
            )}).${mode === "maximum-quality" ? " Try “Balanced” or “Smaller” if it has photos." : ""}`,
          };
        }
        const target =
          mode === "target-size"
            ? r.targetAchieved
              ? ` Under your ${targetKb} KB target.`
              : ` Couldn't reach ${targetKb} KB without making it unreadable — this is the smallest we could get.`
            : "";
        return {
          kind: "file",
          data: r.bytes,
          fileName: outputName(file, "compressed"),
          title: `${r.savedPercent}% smaller`,
          summary: `${sizes}.${r.imagesOptimized ? ` ${r.imagesOptimized} image${r.imagesOptimized === 1 ? "" : "s"} re-encoded.` : ""}${target}`,
        };
      }}
    />
  );
}
