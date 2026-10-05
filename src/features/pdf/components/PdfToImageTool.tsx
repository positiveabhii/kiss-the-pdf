"use client";

import { useMemo, useRef, useState } from "react";
import { ImageDown, CheckSquare, Square, AlertCircle, AlertTriangle, Info } from "lucide-react";

import { usePdfDocument } from "../hooks/use-pdf-document";
import { usePageSelection } from "../hooks/use-page-selection";
import { usePdfTool } from "../hooks/use-pdf-tool";
import { pdfRenderService, type RenderedPage } from "../services/pdf-render-service";
import { createZipFromFiles } from "../utils/zip-utils";
import { downloadBlob } from "../utils/download-utils";
import { sanitizeFilename } from "../utils/sanitize-filename";
import { formatFileSize } from "../utils/format-file-size";
import { UPLOAD_LIMITS } from "../utils/upload-limits";
import { getMimeType, type ImageFormat } from "../render/image-encoder";
import { isAbortError } from "../utils/is-abort-error";

import { PdfUploadArea } from "./shared/PdfUploadArea";
import { PdfDocumentHeader } from "./shared/PdfDocumentHeader";
import { PdfPageGrid } from "./shared/PdfPageGrid";
import { PageScopeSelector } from "./shared/PageScopeSelector";
import { SegmentedControl } from "./shared/SegmentedControl";
import { ToolProcessingState } from "./shared/ToolProcessingState";
import { ToolSuccessState } from "./shared/ToolSuccessState";

/**
 * PDF pages → images. One component for PDF to JPG / PNG / WebP / TIFF and
 * PDF to Images ZIP; the format decides which options show.
 */

export type OutputFormat = ImageFormat | "tiff";
type Quality = "high" | "medium" | "low";
type Background = "white" | "transparent";
type TiffCompression = "deflate" | "none";
type TiffPacking = "multipage" | "perpage";

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

const BACKGROUND_OPTIONS: { value: Background; label: string }[] = [
  { value: "white", label: "White" },
  { value: "transparent", label: "Transparent" },
];

const ZIP_FORMAT_OPTIONS: { value: ImageFormat; label: string }[] = [
  { value: "jpeg", label: "JPG" },
  { value: "png", label: "PNG" },
  { value: "webp", label: "WebP" },
];

const TIFF_COMPRESSION_OPTIONS: { value: TiffCompression; label: string }[] = [
  { value: "deflate", label: "Deflate (lossless, smaller)" },
  { value: "none", label: "None" },
];

const TIFF_PACKING_OPTIONS: { value: TiffPacking; label: string }[] = [
  { value: "multipage", label: "One multi-page TIFF" },
  { value: "perpage", label: "One TIFF per page (ZIP)" },
];

const PAGE_WARNING_THRESHOLD = 40;

const LABEL: Record<OutputFormat, string> = { jpeg: "JPG", png: "PNG", webp: "WebP", tiff: "TIFF" };
const EXT: Record<OutputFormat, string> = { jpeg: "jpg", png: "png", webp: "webp", tiff: "tif" };

interface ConversionResult {
  files: RenderedPage[];
  totalBytes: number;
  /** A single combined file (multi-page TIFF) rather than one per page. */
  combined: boolean;
  format: OutputFormat;
}

export interface PdfToImageToolProps {
  /** Output format. Ignored when `chooseFormat` is on. */
  format?: OutputFormat;
  /** PDF to Images ZIP: let the user pick JPG / PNG / WebP, always download a ZIP. */
  chooseFormat?: boolean;
}

/** Approximate uncompressed RGB size of a Letter page at `dpi`. */
function rawPageBytes(dpi: number) {
  return Math.round(8.5 * dpi) * Math.round(11 * dpi) * 3;
}

export function PdfToImageTool({ format: fixedFormat = "jpeg", chooseFormat = false }: PdfToImageToolProps) {
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

  const [zipFormat, setZipFormat] = useState<ImageFormat>("jpeg");
  const format: OutputFormat = chooseFormat ? zipFormat : fixedFormat;
  const label = LABEL[format];

  const [quality, setQuality] = useState<Quality>("high");
  const [dpi, setDpi] = useState<number>(300);
  const [background, setBackground] = useState<Background>("white");
  const [tiffCompression, setTiffCompression] = useState<TiffCompression>("deflate");
  const [tiffPacking, setTiffPacking] = useState<TiffPacking>("multipage");
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

  const renderTiff = async (bytes: Uint8Array, signal: AbortSignal): Promise<ConversionResult> => {
    const { encodeTiffPage, assembleTiff } = await import("@/features/tools/convert/ops/tiff");
    const encoded: Awaited<ReturnType<typeof encodeTiffPage>>[] = [];
    const files: RenderedPage[] = [];
    await pdfRenderService.forEachPage(
      bytes,
      {
        pages: resolvedPages,
        dpi,
        background: "white",
        onProgress: (current, total) => setProgress({ current, total }),
        signal,
      },
      async (canvas, pageNumber) => {
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("Could not read the rendered page.");
        const { data, width, height } = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const page = await encodeTiffPage({ width, height, pixels: data, channels: 4, dpi }, tiffCompression);
        if (tiffPacking === "multipage") encoded.push(page);
        else files.push({ pageNumber, data: assembleTiff([page]), filename: `page-${pageNumber}.tif` });
      }
    );
    if (tiffPacking === "multipage") {
      const data = assembleTiff(encoded);
      return { files: [{ pageNumber: 0, data, filename: "pages.tif" }], totalBytes: data.byteLength, combined: true, format };
    }
    return { files, totalBytes: files.reduce((s, f) => s + f.data.byteLength, 0), combined: false, format };
  };

  const handleConvert = () => {
    if (!pdfBytes || resolvedPages.length === 0) return;

    const controller = new AbortController();
    abortRef.current = controller;

    startProcessing();
    setProgress({ current: 0, total: resolvedPages.length });

    const job: Promise<ConversionResult> =
      format === "tiff"
        ? renderTiff(pdfBytes, controller.signal)
        : pdfRenderService
            .renderPages(pdfBytes, {
              pages: resolvedPages,
              dpi,
              format,
              quality,
              background: format === "jpeg" ? "white" : background,
              onProgress: (current, total) => setProgress({ current, total }),
              signal: controller.signal,
            })
            .then((files) => ({
              files,
              totalBytes: files.reduce((sum, file) => sum + file.data.byteLength, 0),
              combined: false,
              format,
            }));

    void job
      .then((res) => {
        abortRef.current = null;
        setSuccess(res);
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

  const mimeOf = (f: OutputFormat) => (f === "tiff" ? "image/tiff" : getMimeType(f));

  const handleDownload = () => {
    if (!result || result.files.length === 0) return;

    if (result.combined) {
      downloadBlob(result.files[0].data, `${baseFilename}.tif`, mimeOf(result.format));
      return;
    }

    if (result.files.length === 1 && !chooseFormat) {
      downloadBlob(
        result.files[0].data,
        `${baseFilename}-${result.files[0].filename}`,
        mimeOf(result.format)
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
        downloadBlob(
          zipBytes,
          `${baseFilename}-${chooseFormat ? "images" : EXT[result.format]}.zip`,
          "application/zip"
        );
      })
      .catch((err: unknown) => {
        setFailed(err);
      });
  };

  const isProcessing = state === "processing";
  const resultLabel = result ? LABEL[result.format] : label;
  const singleDownload = result && (result.combined || (result.files.length === 1 && !chooseFormat));
  const pageWord = (n: number) => `page${n === 1 ? "" : "s"}`;

  return (
    <div className="w-full min-w-0 max-w-3xl mx-auto space-y-6">
      {isProcessing ? (
        <ToolProcessingState
          message={`Converting pages to ${label}...`}
          progress={progress}
          onCancel={handleCancel}
        />
      ) : state === "success" && result ? (
        <ToolSuccessState
          title="Conversion complete!"
          description={
            result.combined
              ? `Exported ${resolvedPages.length} ${pageWord(resolvedPages.length)} into one multi-page TIFF · ${formatFileSize(result.totalBytes)}`
              : `Exported ${result.files.length} ${pageWord(result.files.length)} as ${resultLabel} · ${formatFileSize(result.totalBytes)}`
          }
          primaryAction={{
            label: singleDownload ? `Download ${resultLabel}` : `Download ${resultLabel}s (ZIP)`,
            onClick: handleDownload,
          }}
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
                label={chooseFormat ? "Select PDF to export as images" : `Select PDF to convert to ${label}`}
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
                  {chooseFormat && (
                    <SegmentedControl
                      label="Image format"
                      options={ZIP_FORMAT_OPTIONS}
                      value={zipFormat}
                      onChange={setZipFormat}
                      size="sm"
                    />
                  )}
                  {(format === "jpeg" || format === "webp") && (
                    <SegmentedControl
                      label="Quality"
                      options={QUALITY_OPTIONS}
                      value={quality}
                      onChange={setQuality}
                      size="sm"
                    />
                  )}
                  <SegmentedControl
                    label="Resolution (DPI)"
                    options={DPI_OPTIONS}
                    value={dpi}
                    onChange={setDpi}
                    size="sm"
                  />
                  {(format === "png" || format === "webp") && (
                    <SegmentedControl
                      label="Background"
                      options={BACKGROUND_OPTIONS}
                      value={background}
                      onChange={setBackground}
                      size="sm"
                    />
                  )}
                  {format === "tiff" && (
                    <>
                      <SegmentedControl
                        label="Output"
                        options={TIFF_PACKING_OPTIONS}
                        value={tiffPacking}
                        onChange={setTiffPacking}
                        size="sm"
                      />
                      <SegmentedControl
                        label="Compression"
                        options={TIFF_COMPRESSION_OPTIONS}
                        value={tiffCompression}
                        onChange={setTiffCompression}
                        size="sm"
                      />
                    </>
                  )}
                </div>

                {format === "tiff" && (
                  <div className="flex items-start gap-2 p-3 bg-slate-50 border border-slate-200 rounded-md text-xs text-slate-700">
                    <Info size={14} className="shrink-0 mt-0.5" />
                    <span>
                      {tiffCompression === "none"
                        ? `Uncompressed TIFF is large: about ${formatFileSize(rawPageBytes(dpi))} per Letter-size page at ${dpi} DPI.`
                        : "Deflate is lossless and opens in Photoshop, GIMP, Preview, Windows Photos and most scanners' software. Pick None only if an old program can't read it."}{" "}
                      Pages are saved as 24-bit RGB with the DPI recorded in the file.
                    </span>
                  </div>
                )}
                {format === "webp" && (
                  <p className="text-[11px] text-slate-500">
                    WebP needs a current browser to create (Safari 17 or newer).
                  </p>
                )}
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
                  ? `Convert to ${label} (${resolvedPages.length} ${pageWord(resolvedPages.length)})`
                  : "Select at least one page"}
              </button>

              {(resolvedPages.length > PAGE_WARNING_THRESHOLD ||
                (format === "tiff" && dpi >= 600 && resolvedPages.length > 5)) && (
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
