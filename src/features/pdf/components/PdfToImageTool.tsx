"use client";

import { useState } from "react";
import { usePdfTool } from "../hooks/use-pdf-tool";
import { usePdfDocument } from "../hooks/use-pdf-document";
import { usePageSelection } from "../hooks/use-page-selection";
import { pdfRenderService, type RenderedPage } from "../services/pdf-render-service";
import { downloadBlob } from "../utils/download-utils";
import { createZipFromFiles } from "../utils/zip-utils";
import { sanitizeFilename } from "../utils/sanitize-filename";
import type { ImageFormat } from "../render/image-encoder";
import { PdfUploadArea } from "./shared/PdfUploadArea";
import { PdfDocumentHeader } from "./shared/PdfDocumentHeader";
import { PageScopeSelector } from "./shared/PageScopeSelector";
import { ToolProcessingState } from "./shared/ToolProcessingState";
import { ToolSuccessState } from "./shared/ToolSuccessState";
import { ImageIcon } from "lucide-react";

const DPI_OPTIONS = [72, 96, 150, 200, 300];

interface PdfToImageToolProps {
  format: ImageFormat;
  formatLabel: string;
}

export function PdfToImageTool({ format, formatLabel }: PdfToImageToolProps) {
  const { state, error, result, startProcessing, setSuccess, setFailed, reset: resetTool } =
    usePdfTool<RenderedPage[]>();
  const doc = usePdfDocument();
  const selection = usePageSelection(doc.pageCount);

  const [dpi, setDpi] = useState(150);
  const [quality, setQuality] = useState<"high" | "medium" | "low">("high");
  const [progress, setProgress] = useState<{ current: number; total: number } | null>(null);
  const showQuality = format !== "png";

  const handleConvert = async () => {
    if (!doc.pdfBytes) return;

    const pages = selection.resolvedPages;
    if (pages.length === 0) {
      setFailed(new Error("No pages selected."));
      return;
    }

    if (doc.pageCount > 100) {
      const confirmed = window.confirm(
        `This document has ${doc.pageCount} pages. Converting at ${dpi} DPI may use significant browser memory. Continue?`
      );
      if (!confirmed) return;
    }

    startProcessing();
    setProgress(null);

    try {
      const rendered = await pdfRenderService.renderPages(doc.pdfBytes, {
        pages,
        dpi,
        format,
        quality: showQuality ? quality : undefined,
        background: format === "jpeg" ? "white" : "transparent",
        onProgress: (current, total) => setProgress({ current, total }),
      });

      setSuccess(rendered);
    } catch (err) {
      setFailed(err);
    } finally {
      setProgress(null);
    }
  };

  const handleDownloadAll = async () => {
    if (!result || !doc.file) return;

    if (result.length === 1) {
      downloadBlob(result[0].data, result[0].filename, `image/${format === "jpeg" ? "jpeg" : format}`);
      return;
    }

    const baseName = sanitizeFilename(doc.file.name);
    const zipData = await createZipFromFiles(
      result.map((r) => ({ filename: r.filename, data: r.data }))
    );
    downloadBlob(zipData, `${baseName}-${formatLabel.toLowerCase()}.zip`, "application/zip");
  };

  const handleResetAll = () => {
    doc.removeFile();
    selection.reset();
    resetTool();
  };

  if (state === "processing") {
    return (
      <ToolProcessingState
        message={`Rendering pages to ${formatLabel}…`}
        progress={progress ?? undefined}
      />
    );
  }

  if (state === "success" && result) {
    return (
      <ToolSuccessState
        title="Conversion Complete"
        description={`${result.length} ${result.length === 1 ? "page converted" : "pages converted"} to ${formatLabel}.`}
        primaryAction={{
          label: result.length === 1 ? `Download ${formatLabel}` : "Download ZIP Archive",
          onClick: handleDownloadAll,
        }}
        secondaryAction={{ label: `Convert Another File`, onClick: handleResetAll }}
      />
    );
  }

  return (
    <div className="w-full min-w-0 max-w-3xl mx-auto space-y-6">
      {!doc.file ? (
        <PdfUploadArea onFileSelect={doc.loadFile} label={`Select a PDF to convert to ${formatLabel}`} disabled={doc.loading} />
      ) : (
        <>
          <PdfDocumentHeader
            filename={doc.file.name}
            fileSize={doc.file.size}
            pageCount={doc.pageCount}
            onReplace={doc.loadFile}
            onRemove={() => {
              doc.removeFile();
              selection.reset();
            }}
          />

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-md space-y-4">
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
              showOddEven={false}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-200/80">
              <div>
                <label htmlFor="dpi-select" className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                  Resolution (DPI)
                </label>
                <select
                  id="dpi-select"
                  value={dpi}
                  onChange={(e) => setDpi(parseInt(e.target.value, 10))}
                  className="w-full h-8 px-2.5 text-xs bg-white border border-slate-200 rounded outline-none focus:border-slate-900"
                >
                  {DPI_OPTIONS.map((d) => (
                    <option key={d} value={d}>
                      {d} DPI ({d === 150 ? "Standard" : d === 300 ? "Print Quality" : "Draft"})
                    </option>
                  ))}
                </select>
              </div>

              {showQuality && (
                <div>
                  <label htmlFor="quality-select" className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                    Image Quality
                  </label>
                  <select
                    id="quality-select"
                    value={quality}
                    onChange={(e) => setQuality(e.target.value as "high" | "medium" | "low")}
                    className="w-full h-8 px-2.5 text-xs bg-white border border-slate-200 rounded outline-none focus:border-slate-900"
                  >
                    <option value="high">High Quality (92%)</option>
                    <option value="medium">Medium Quality (75%)</option>
                    <option value="low">Compact (50%)</option>
                  </select>
                </div>
              )}
            </div>

            {format === "jpeg" && (
              <p className="text-[11px] text-slate-400 font-mono">
                Note: JPEG output automatically applies crisp white background canvas.
              </p>
            )}
          </div>

          {error && (
            <p className="text-xs font-medium text-red-600 bg-red-50 border border-red-200 p-2.5 rounded" role="alert">
              {error.message}
            </p>
          )}

          <div className="pt-2 flex justify-end">
            <button
              type="button"
              onClick={handleConvert}
              disabled={selection.resolvedPages.length === 0}
              className="inline-flex items-center gap-2 px-5 py-2 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-200 disabled:text-slate-400 text-white text-xs font-semibold rounded-md transition-all shadow-2xs"
            >
              <ImageIcon size={14} />
              <span>Convert to {formatLabel}</span>
            </button>
          </div>
        </>
      )}

      {doc.loading && <p className="text-xs font-mono text-slate-500 text-center py-4">Reading document pages…</p>}
      {doc.error && (
        <p className="text-xs font-medium text-red-600 text-center py-4" role="alert">
          {doc.error}
        </p>
      )}
    </div>
  );
}
