"use client";

import { useState } from "react";

import { SimplePdfTool } from "../core/SimplePdfTool";
import { PageViewer } from "../core/PageViewer";
import { outputName } from "../core/pdf-io";
import { Notice, OptionsPanel, SecondaryButton } from "../core/ui";
import { CropOverlay } from "./components/CropOverlay";
import { MarginFields } from "./components/MarginFields";
import { PageNav } from "./components/PageNav";
import { ScopePicker, resolveScope, useScope } from "./components/PageScope";
import { cropPages, MIN_CROPPED_SIZE } from "./ops/crop";
import { ZERO_MARGINS, type Margins, type Unit } from "./ops/units";

export default function CropPdf() {
  const [margins, setMargins] = useState<Margins>(ZERO_MARGINS);
  const [unit, setUnit] = useState<Unit>("mm");
  const [page, setPage] = useState(1);
  const [scope, setScope, resetScope] = useScope();
  const empty = Object.values(margins).every((v) => v < 0.05);

  return (
    <SimplePdfTool
      preview
      actionLabel="Crop PDF"
      processingMessage="Cropping pages…"
      onReset={() => {
        resetScope();
        setMargins(ZERO_MARGINS);
        setPage(1);
      }}
      validate={(doc) =>
        empty ? "Drag on the page or enter margins to choose what to keep." : resolveScope(scope, doc.pageCount).error
      }
      options={(doc) => {
        const p = Math.min(page, doc.pageCount);
        return (
          <>
            <OptionsPanel title="Crop area">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <PageNav page={p} count={doc.pageCount} onChange={setPage} />
                {!empty && (
                  <SecondaryButton onClick={() => setMargins(ZERO_MARGINS)}>Reset crop</SecondaryButton>
                )}
              </div>
              <p className="text-[11px] text-slate-500">
                Drag on the page to draw the area to keep, then move it or pull its handles. The same
                margins are used on every page you crop.
              </p>
              {doc.pdfjs ? (
                <PageViewer doc={doc.pdfjs} pageNumber={p} maxWidth={520}>
                  {(geom) => (
                    <CropOverlay geom={geom} margins={margins} onChange={setMargins} minSize={MIN_CROPPED_SIZE} />
                  )}
                </PageViewer>
              ) : (
                <p className="text-xs text-slate-500">Preparing page preview…</p>
              )}
              <MarginFields value={margins} onChange={setMargins} unit={unit} onUnitChange={setUnit} />
            </OptionsPanel>
            {doc.pageCount > 1 && (
              <OptionsPanel>
                <ScopePicker doc={doc} value={scope} onChange={setScope} />
              </OptionsPanel>
            )}
            <Notice>
              Cropping sets the visible area of each page (its crop box). Content outside it is hidden,
              not deleted — it can still be recovered with a PDF editor, so don&apos;t rely on cropping to
              remove sensitive information. Pages of different sizes are trimmed by the same margins.
            </Notice>
          </>
        );
      }}
      run={async ({ file, bytes, pageCount, onProgress, signal }) => {
        const { pages } = resolveScope(scope, pageCount);
        const res = await cropPages(bytes, pages, margins, { onProgress, signal });
        return {
          kind: "file",
          data: res.bytes,
          fileName: outputName(file, "cropped"),
          title: "PDF cropped",
          summary: `${res.cropped} page${res.cropped === 1 ? "" : "s"} cropped.`,
        };
      }}
    />
  );
}
