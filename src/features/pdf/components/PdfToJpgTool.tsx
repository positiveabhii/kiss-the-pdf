"use client";

import { useMemo, useRef, useState } from "react";
import { ImageDown, CheckSquare, Square, AlertCircle, AlertTriangle } from "lucide-react";

import { usePdfDocument } from "../hooks/use-pdf-document";
import { usePageSelection } from "../hooks/use-page-selection";
import { usePdfTool } from "../hooks/use-pdf-tool";
import { pdfRenderService, type RenderedPage } from "../services/pdf-render-service";
import { createZipFromFiles } from "../utils/zip-utils";
import { downloadBlob } from "../utils/download-utils";
import { sanitizeFilename } from "../utils/sanitize-filename";
import { formatFileSize } from "../utils/format-file-size";
import { UPLOAD_LIMITS } from "../utils/upload-limits";
import { getMimeType } from "../render/image-encoder";
import { isAbortError } from "../utils/is-abort-error";

import { PdfUploadArea } from "./shared/PdfUploadArea";
import { PdfDocumentHeader } from "./shared/PdfDocumentHeader";
import { PdfPageGrid } from "./shared/PdfPageGrid";
import { PageScopeSelector } from "./shared/PageScopeSelector";
import { SegmentedControl } from "./shared/SegmentedControl";
import { ToolProcessingState } from "./shared/ToolProcessingState";
import { ToolSuccessState } from "./shared/ToolSuccessState";

type Quality = "high" | "medium" | "low";

const QUALITY_OPTIONS: { value: Quality; label: string }[] = [
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" },
];

const DPI_OPTIONS: { value: number; label: string }[] = [
  { value: 72, label: "72" },
  { value: 150, label: "150" },
  { value: 300, label: "300" },
  { value: 600, label: "600" },
];

const PAGE_WARNING_THRESHOLD = 40;

interface ConversionResult {
  files: RenderedPage[];
  totalBytes: number;
}

export function PdfToJpgTool() {
  const {
    file,
    pdfBytes,
    pageCount,
    thumbnails,
    loading,
    error: loadError,
    loadFile,
    removeFile,
    loadThumbnail,
  } = usePdfDocument();

  const {
    scope,
    setScope,
    selectedPages,
    togglePage,
    selectAll,
    clearSelection,
    rangeInput,
    setRangeInput,
    resolvedPages,
    highlightedPages,
    reset: resetPageSelection,
  } = usePageSelection(pageCount);

  const {
    state,
    result,
    error,
    startProcessing,
    setSuccess,
    setFailed,
    reset,
    cancelProcessing,
  } = usePdfTool<ConversionResult>();

  const [quality, setQuality] = useState<Quality>("high");
  const [dpi, setDpi] = useState<number>(300);
  const [progress, setProgress] = useState<{ current: number; total: number } | undefined>(undefined);
  const [invalidFileError, setInvalidFileError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const baseFilename = useMemo(
    () => (file ? sanitizeFilename(file.name) : "document"),
    [file]
  );

  const handleFileSelect = (file: File) => {
    const isPdf =
      file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");

    if (!isPdf) {
      setInvalidFileError(
        `"${file.name}" is not a PDF file. Only PDF files can be processed.`
      );
      return;
    }

    if (file.size > UPLOAD_LIMITS.maxPdfSizeBytes) {
      setInvalidFileError(
        `"${file.name}" exceeds the ${formatFileSize(UPLOAD_LIMITS.maxPdfSizeBytes)} PDF size limit.`
      );
      return;
    }

    setInvalidFileError(null);
    reset();
    resetPageSelection();
    void loadFile(file);
  };

  const handleRemove = () => {
    cancelProcessing();
    reset();
    setInvalidFileError(null);
    removeFile();
  };

  const handleConvert = () => {
    if (!pdfBytes || resolvedPages.length === 0) return;

    const controller = new AbortController();
    abortRef.current = controller;

    startProcessing();
    setProgress({ current: 0, total: resolvedPages.length });

    void pdfRenderService
      .renderPages(pdfBytes, {
        pages: resolvedPages,
        dpi,
        format: "jpeg",
        quality,
        background: "white",
        onProgress: (current, total) => setProgress({ current, total }),
        signal: controller.signal,
      })
      .then((files) => {
        abortRef.current = null;
        const totalBytes = files.reduce((sum, file) => sum + file.data.byteLength, 0);
        setSuccess({ files, totalBytes });
      })
      .catch((err: unknown) => {
        abortRef.current = null;
        if (isAbortError(err)) return;
        setFailed(err);
      });
  };

  const handleCancel = () => {
    abortRef.current?.abort();
    abortRef.current = null;
    cancelProcessing();
  };

  const handleDownload = () => {
    if (!result || result.files.length === 0) return;

    if (result.files.length === 1) {
      downloadBlob(
        result.files[0].data,
        `${baseFilename}-${result.files[0].filename}`,
        getMimeType("jpeg")
      );
      return;
    }

    void createZipFromFiles(
      result.files.map((file) => ({
        filename: `${baseFilename}-${file.filename}`,
        data: file.data,
      }))
    )
      .then((zipBytes) => {
        downloadBlob(zipBytes, `${baseFilename}-jpg.zip`, "application/zip");
      })
      .catch((err: unknown) => {
        setFailed(err);
      });
  };

  const isProcessing = state === "processing";

  return (
    <div className="w-full min-w-0 max-w-3xl mx-auto space-y-6">
      {isProcessing ? (
        <ToolProcessingState
          message="Converting pages to JPG..."
          progress={progress}
          onCancel={handleCancel}
        />
      ) : state === "success" && result ? (
        <ToolSuccessState
          title="Conversion complete!"
          description={`Exported ${result.files.length} page${result.files.length === 1 ? "" : "s"} as JPG · ${formatFileSize(result.totalBytes)}`}
          primaryAction={{ label: result.files.length === 1 ? "Download JPG" : "Download JPGs (ZIP)", onClick: handleDownload }}
          secondaryAction={{ label: "Convert another file", onClick: handleRemove }}
        />
      ) : (
        <>
          {loadError && (
            <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-md text-xs text-red-700">
              <AlertCircle size={14} className="shrink-0 mt-0.5" />
              <span>{loadError}</span>
            </div>
          )}

          {loading && !file ? (
            <ToolProcessingState message="Preparing document..." />
          ) : !file ? (
            <>
              {invalidFileError && (
                <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-md text-xs text-amber-800">
                  <AlertCircle size={14} className="shrink-0 mt-0.5" />
                  <span>{invalidFileError}</span>
                </div>
              )}
              <PdfUploadArea
                onFileSelect={handleFileSelect}
                label="Select PDF to convert to JPG"
              />
              <p className="text-[11px] text-slate-500">
                Up to {formatFileSize(UPLOAD_LIMITS.maxPdfSizeBytes)} per file
              </p>
            </>
          ) : (
            <>
              <PdfDocumentHeader
                filename={file.name}
                fileSize={file.size}
                pageCount={pageCount}
                onReplace={handleFileSelect}
                onRemove={handleRemove}
              />

              {loading && (
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-md text-xs text-slate-500 text-center">
                  Preparing document...
                </div>
              )}

              {loadError && (
                <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-md text-xs text-red-700">
                  <AlertCircle size={14} className="shrink-0 mt-0.5" />
                  <span>{loadError}</span>
                </div>
              )}

              <div className="p-4 bg-white border border-slate-200 rounded-lg space-y-4">
                <PageScopeSelector
                  scope={scope}
                  onScopeChange={setScope}
                  rangeInput={rangeInput}
                  onRangeInputChange={setRangeInput}
                  pageCount={pageCount}
                  selectedCount={selectedPages.size}
                />

                <div className="flex flex-wrap items-end gap-4 pt-3 border-t border-slate-100">
                  <SegmentedControl
                    label="Quality"
                    options={QUALITY_OPTIONS}
                    value={quality}
                    onChange={setQuality}
                    size="sm"
                  />
                  <SegmentedControl
                    label="Resolution (DPI)"
                    options={DPI_OPTIONS}
                    value={dpi}
                    onChange={setDpi}
                    size="sm"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Pages
                  </h3>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={selectAll}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 rounded transition-colors"
                    >
                      <CheckSquare size={13} className="text-slate-400" />
                      Select all
                    </button>
                    <button
                      type="button"
                      onClick={clearSelection}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 rounded transition-colors"
                    >
                      <Square size={13} className="text-slate-400" />
                      Clear
                    </button>
                  </div>
                </div>
                <PdfPageGrid
                  pageCount={pageCount}
                  thumbnails={thumbnails}
                  selectedPages={highlightedPages}
                  onTogglePage={togglePage}
                  onLoadThumbnail={loadThumbnail}
                />
              </div>

              <button
                type="button"
                onClick={handleConvert}
                disabled={resolvedPages.length === 0}
                className={`w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-md text-sm font-semibold transition-all shadow-2xs ${
                  resolvedPages.length === 0
                    ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                    : "bg-slate-900 hover:bg-slate-800 text-white hover:shadow-xs active:translate-y-0.5"
                }`}
              >
                <ImageDown size={16} />
                {resolvedPages.length > 0
                  ? `Convert to JPG (${resolvedPages.length} page${resolvedPages.length === 1 ? "" : "s"})`
                  : "Select at least one page"}
              </button>

              {resolvedPages.length > PAGE_WARNING_THRESHOLD && (
                <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-md text-xs text-amber-800">
                  <AlertTriangle size={14} className="shrink-0 mt-0.5" />
                  <span>
                    {resolvedPages.length} pages selected — converting many pages at high resolution
                    can be slow and memory-hungry. Consider lowering the DPI or selecting fewer
                    pages.
                  </span>
                </div>
              )}

              {state === "error" && error && (
                <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-md text-xs text-red-700">
                  <AlertCircle size={14} className="shrink-0 mt-0.5" />
                  <span>Conversion failed: {error.message}</span>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}