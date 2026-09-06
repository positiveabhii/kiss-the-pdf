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
        `This document has ${doc.pageCount} pages. Converting at ${dpi} DPI may use significant memory. Continue?`
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
        message={`Converting to ${formatLabel}…`}
        progress={progress ?? undefined}
      />
    );
  }

  if (state === "success" && result) {
    return (
      <ToolSuccessState
        title="Conversion complete"
        description={`${result.length} ${result.length === 1 ? "image" : "images"} created.`}
        primaryAction={{
          label: result.length === 1 ? `Download ${formatLabel}` : "Download all",
          onClick: handleDownloadAll,
        }}
        secondaryAction={{ label: `Convert another PDF`, onClick: handleResetAll }}
      />
    );
  }

  return (
    <div className="w-full min-w-0 max-w-3xl mx-auto space-y-6">
      {!doc.file ? (
        <PdfUploadArea onFileSelect={doc.loadFile} disabled={doc.loading} />
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="dpi-select" className="block text-sm font-medium text-slate-700 mb-1">
                Resolution (DPI)
              </label>
              <select
                id="dpi-select"
                value={dpi}
                onChange={(e) => setDpi(parseInt(e.target.value, 10))}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md bg-white"
              >
                {DPI_OPTIONS.map((d) => (
                  <option key={d} value={d}>
                    {d} DPI
                  </option>
                ))}
              </select>
            </div>

            {showQuality && (
              <div>
                <label htmlFor="quality-select" className="block text-sm font-medium text-slate-700 mb-1">
                  Image quality
                </label>
                <select
                  id="quality-select"
                  value={quality}
                  onChange={(e) => setQuality(e.target.value as "high" | "medium" | "low")}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md bg-white"
                >
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
            )}
          </div>

          {format === "jpeg" && (
            <p className="text-xs text-slate-500">Background: white (JPG does not support transparency)</p>
          )}

          {error && (
            <p className="text-sm text-red-600" role="alert">
              {error.message}
            </p>
          )}

          <button
            type="button"
            onClick={handleConvert}
            disabled={selection.resolvedPages.length === 0}
            className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white text-sm font-medium rounded-md transition-colors"
          >
            Convert to {formatLabel}
          </button>
        </>
      )}

      {doc.loading && <p className="text-sm text-slate-500 text-center">Loading document…</p>}
      {doc.error && (
        <p className="text-sm text-red-600 text-center" role="alert">
          {doc.error}
        </p>
      )}
    </div>
  );
}
