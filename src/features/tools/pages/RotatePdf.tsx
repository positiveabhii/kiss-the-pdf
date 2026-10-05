"use client";

import { useState } from "react";
import { RotateCcw, RotateCw, Undo2 } from "lucide-react";

import { PdfPageGrid } from "@/features/pdf/components/shared/PdfPageGrid";

import { SimplePdfTool, type LoadedPdf } from "../core/SimplePdfTool";
import { outputName } from "../core/pdf-io";
import { Notice, OptionsPanel, SecondaryButton } from "../core/ui";
import { useThumbnails } from "./components/useThumbnails";
import { normaliseRotation } from "./ops/geometry";
import { rotatePages } from "./ops/rotate";

/** Extra clockwise rotation per 1-based page, for one file. */
interface RotationState {
  file: File | null;
  rotations: Map<number, number>;
  selected: Set<number>;
}

const EMPTY: RotationState = { file: null, rotations: new Map(), selected: new Set() };

function RotateGrid({
  doc,
  state,
  onChange,
}: {
  doc: LoadedPdf;
  state: RotationState;
  onChange: (s: RotationState) => void;
}) {
  const { thumbnails, loadThumbnail } = useThumbnails(doc.pdfjs);
  const s = state.file === doc.file ? state : { ...EMPTY, file: doc.file };
  const rotate = (pages: number[], delta: number) => {
    const rotations = new Map(s.rotations);
    for (const p of pages) {
      const r = normaliseRotation((rotations.get(p) ?? 0) + delta);
      if (r === 0) rotations.delete(p);
      else rotations.set(p, r);
    }
    onChange({ ...s, rotations });
  };
  const all = Array.from({ length: doc.pageCount }, (_, i) => i + 1);
  const targets = s.selected.size ? [...s.selected] : all;
  const which = s.selected.size ? `${s.selected.size} selected` : "all";
  // CSS rotation for the preview: keep the turn direction (−90 rather than 270) for a nicer animation.
  const cssRotations = new Map([...s.rotations].map(([p, r]) => [p, r === 270 ? -90 : r]));

  return (
    <OptionsPanel title="Pages">
      <div className="flex flex-wrap items-center gap-2">
        <SecondaryButton onClick={() => rotate(targets, 270)}>
          <RotateCcw size={13} /> Rotate {which} left
        </SecondaryButton>
        <SecondaryButton onClick={() => rotate(targets, 90)}>
          <RotateCw size={13} /> Rotate {which} right
        </SecondaryButton>
        {s.selected.size > 0 && (
          <SecondaryButton onClick={() => onChange({ ...s, selected: new Set() })}>Clear selection</SecondaryButton>
        )}
        {s.rotations.size > 0 && (
          <SecondaryButton onClick={() => onChange({ ...s, rotations: new Map() })}>
            <Undo2 size={13} /> Reset
          </SecondaryButton>
        )}
      </div>
      <p className="text-[11px] text-slate-500">
        Hover a page and use its arrows to turn just that page, or click pages to select several and
        rotate them together.
      </p>
      {doc.pdfjs ? (
        <PdfPageGrid
          key={doc.file.name + doc.file.size}
          pageCount={doc.pageCount}
          thumbnails={thumbnails}
          selectedPages={s.selected}
          pageRotations={cssRotations}
          onTogglePage={(p) => {
            const selected = new Set(s.selected);
            if (selected.has(p)) selected.delete(p);
            else selected.add(p);
            onChange({ ...s, selected });
          }}
          onLoadThumbnail={loadThumbnail}
          onRotatePage={(p, dir) => rotate([p], dir === "cw" ? 90 : 270)}
        />
      ) : (
        <p className="text-xs text-slate-500">Preparing page previews…</p>
      )}
    </OptionsPanel>
  );
}

/** Rotate individual pages (or all) by 90° steps. */
export default function RotatePdf() {
  const [state, setState] = useState<RotationState>(EMPTY);
  const current = (doc: LoadedPdf) => (state.file === doc.file ? state.rotations : new Map<number, number>());
  return (
    <SimplePdfTool
      preview
      actionLabel="Apply rotation"
      processingMessage="Rotating pages…"
      onReset={() => setState(EMPTY)}
      validate={(doc) => (current(doc).size === 0 ? "Rotate at least one page first." : null)}
      options={(doc) => (
        <>
          <RotateGrid doc={doc} state={state} onChange={setState} />
          {current(doc).size > 0 && (
            <Notice>
              {current(doc).size} page{current(doc).size === 1 ? "" : "s"} will be rotated. Rotation is
              stored in the page, so text and image quality are unchanged.
            </Notice>
          )}
        </>
      )}
      run={async ({ file, bytes, onProgress, signal }) => {
        const rot = state.file === file ? state.rotations : new Map<number, number>();
        const { bytes: data, rotated } = await rotatePages(bytes, (i) => rot.get(i + 1) ?? 0, {
          onProgress,
          signal,
        });
        return {
          kind: "file",
          data,
          fileName: outputName(file, "rotated"),
          title: "PDF rotated",
          summary: `${rotated} page${rotated === 1 ? "" : "s"} rotated.`,
        };
      }}
    />
  );
}
