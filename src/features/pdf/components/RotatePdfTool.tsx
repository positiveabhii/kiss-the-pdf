"use client";

import { useState, useCallback, useMemo } from "react";
import { RotateCw, RotateCcw } from "lucide-react";
import { usePdfTool } from "../hooks/use-pdf-tool";
import { usePdfDocument } from "../hooks/use-pdf-document";
import { usePageSelection } from "../hooks/use-page-selection";
import { pdfService } from "../services/pdf-processing-service";
import { downloadBlob } from "../utils/download-utils";
import { PdfUploadArea } from "./shared/PdfUploadArea";
import { PdfDocumentHeader } from "./shared/PdfDocumentHeader";
import { PdfPageGrid } from "./shared/PdfPageGrid";
import { PageScopeSelector } from "./shared/PageScopeSelector";
import { SegmentedControl } from "./shared/SegmentedControl";
import { ToolProcessingState } from "./shared/ToolProcessingState";
import { ToolSuccessState } from "./shared/ToolSuccessState";

type RotationAngle = 90 | 180 | 270;

function normalizeRotation(degrees: number): number {
  return ((degrees % 360) + 360) % 360;
}

export function RotatePdfTool() {
  const { state, error, result, startProcessing, setSuccess, setFailed, reset: resetTool } =
    usePdfTool<Uint8Array>();
  const doc = usePdfDocument();
  const selection = usePageSelection(doc.pageCount);

  const [globalAngle, setGlobalAngle] = useState<RotationAngle>(90);
  const [pendingRotations, setPendingRotations] = useState<Map<number, number>>(new Map());
  const [processedCount, setProcessedCount] = useState(0);

  const previewRotations = useMemo(() => {
    const map = new Map<number, number>();
    pendingRotations.forEach((val, page) => map.set(page, normalizeRotation(val)));
    return map;
  }, [pendingRotations]);

  const hasPendingChanges = pendingRotations.size > 0;

  const applyGlobalRotation = useCallback(
    (angle: RotationAngle) => {
      const pages =
        selection.scope === "selected" && selection.selectedPages.size > 0
          ? selection.resolvedPages
          : selection.resolvedPages.length > 0
            ? selection.resolvedPages
            : Array.from({ length: doc.pageCount }, (_, i) => i + 1);

      setPendingRotations((prev) => {
        const next = new Map(prev);
        for (const page of pages) {
          const current = next.get(page) ?? 0;
          next.set(page, normalizeRotation(current + angle));
        }
        return next;
      });
    },
    [selection.resolvedPages, selection.scope, selection.selectedPages.size, doc.pageCount]
  );

  const rotatePage = useCallback((page: number, direction: "cw" | "ccw") => {
    const delta = direction === "cw" ? 90 : 270;
    setPendingRotations((prev) => {
      const next = new Map(prev);
      const current = next.get(page) ?? 0;
      const updated = normalizeRotation(current + delta);
      if (updated === 0) next.delete(page);
      else next.set(page, updated);
      return next;
    });
  }, []);

  const resetChanges = useCallback(() => {
    setPendingRotations(new Map());
  }, []);

  const handleApply = async () => {
    if (!doc.pdfBytes || !doc.file) return;

    let rotationsToApply: { pageIndex: number; angle: RotationAngle }[];

    if (pendingRotations.size > 0) {
      rotationsToApply = [];
      pendingRotations.forEach((angle, page) => {
        const normalized = normalizeRotation(angle);
        if (normalized === 90 || normalized === 180 || normalized === 270) {
          rotationsToApply.push({ pageIndex: page - 1, angle: normalized as RotationAngle });
        }
      });
    } else {
      const pages = selection.resolvedPages;
      if (pages.length === 0) return;
      rotationsToApply = pages.map((p) => ({ pageIndex: p - 1, angle: globalAngle }));
    }

    if (rotationsToApply.length === 0) return;

    startProcessing();
    try {
      const rotated = await pdfService.rotate(doc.pdfBytes, rotationsToApply);
      setProcessedCount(rotationsToApply.length);
      setSuccess(rotated);
    } catch (err) {
      setFailed(err);
    }
  };

  const handleDownload = () => {
    if (!result || !doc.file) return;
    downloadBlob(result, `rotated-${doc.file.name}`);
  };

  const handleResetAll = () => {
    resetChanges();
    selection.reset();
    doc.removeFile();
    resetTool();
    setProcessedCount(0);
  };

  if (state === "processing") {
    return <ToolProcessingState message="Rotating PDF pages…" />;
  }

  if (state === "success" && result) {
    return (
      <ToolSuccessState
        title="Rotation Complete"
        description={`${processedCount || doc.pageCount} ${(processedCount || doc.pageCount) === 1 ? "page" : "pages"} rotated successfully.`}
        primaryAction={{ label: "Download Rotated PDF", onClick: handleDownload }}
        secondaryAction={{ label: "Rotate Another Document", onClick: handleResetAll }}
      />
    );
  }

  return (
    <div className="w-full min-w-0 max-w-3xl mx-auto space-y-6">
      {!doc.file ? (
        <PdfUploadArea onFileSelect={doc.loadFile} label="Select a PDF to rotate" disabled={doc.loading} />
      ) : (
        <>
          <PdfDocumentHeader
            filename={doc.file.name}
            fileSize={doc.file.size}
            pageCount={doc.pageCount}
            onReplace={doc.loadFile}
            onRemove={() => {
              doc.removeFile();
              resetChanges();
              selection.reset();
            }}
          />

          <section className="space-y-3 min-w-0">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Page Preview & Inspection
              </h3>
              <span className="text-[11px] text-slate-400">
                Hover a thumbnail for quick 90° controls
              </span>
            </div>

            <PdfPageGrid
              pageCount={doc.pageCount}
              thumbnails={doc.thumbnails}
              selectedPages={selection.selectedPages}
              pageRotations={previewRotations}
              onTogglePage={selection.togglePage}
              onLoadThumbnail={doc.loadThumbnail}
              onRotatePage={rotatePage}
            />
          </section>

          <section className="p-4 bg-slate-50 border border-slate-200 rounded-md space-y-4">
            <PageScopeSelector
              scope={selection.scope}
              onScopeChange={(s) => {
                selection.setScope(s);
                if (s === "all") selection.selectAll();
              }}
              rangeInput={selection.rangeInput}
              onRangeInputChange={selection.setRangeInput}
              pageCount={doc.pageCount}
              selectedCount={selection.selectedPages.size}
            />

            <SegmentedControl
              label="Batch Rotation Angle"
              value={globalAngle}
              onChange={setGlobalAngle}
              options={[
                {
                  value: 90 as RotationAngle,
                  label: "90° CW",
                  icon: <RotateCw className="w-3.5 h-3.5" aria-hidden="true" />,
                },
                { value: 180 as RotationAngle, label: "180°" },
                {
                  value: 270 as RotationAngle,
                  label: "90° CCW",
                  icon: <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />,
                },
              ]}
            />

            <div className="flex flex-wrap gap-2 pt-1">
              <button
                type="button"
                onClick={() => applyGlobalRotation(globalAngle)}
                className="px-3 py-1.5 text-xs font-medium bg-white border border-slate-200 hover:bg-slate-100 hover:border-slate-300 text-slate-700 rounded transition-colors shadow-2xs"
              >
                Apply angle to {selection.scope === "all" ? "all pages" : "selected target"}
              </button>
              {hasPendingChanges && (
                <button
                  type="button"
                  onClick={resetChanges}
                  className="px-3 py-1.5 text-xs font-medium text-slate-500 hover:text-slate-900 hover:bg-slate-200/60 rounded transition-colors"
                >
                  Reset preview changes
                </button>
              )}
            </div>
          </section>

          {error && (
            <p className="text-xs font-medium text-red-600 bg-red-50 border border-red-200 p-2.5 rounded" role="alert">
              {error.message}
            </p>
          )}

          <div className="pt-2 flex justify-end">
            <button
              type="button"
              onClick={handleApply}
              disabled={doc.pageCount === 0}
              className="px-5 py-2 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-200 disabled:text-slate-400 text-white text-xs font-semibold rounded-md transition-all shadow-2xs"
            >
              Apply Rotation & Export
            </button>
          </div>
        </>
      )}

      {doc.loading && (
        <p className="text-xs font-mono text-slate-500 text-center py-4">Reading document pages…</p>
      )}
      {doc.error && (
        <p className="text-xs font-medium text-red-600 text-center py-4" role="alert">
          {doc.error}
        </p>
      )}
    </div>
  );
}
