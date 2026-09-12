"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { PDFDocument } from "pdf-lib";
import {
  ImagePlus,
  AlertCircle,
  ArrowUp,
  ArrowDown,
  Trash2,
} from "lucide-react";

import { usePdfTool } from "../hooks/use-pdf-tool";
import { downloadBlob } from "../utils/download-utils";
import { sanitizeFilename } from "../utils/sanitize-filename";
import { formatFileSize } from "../utils/format-file-size";
import { UPLOAD_LIMITS } from "../utils/upload-limits";

import { SegmentedControl } from "./shared/SegmentedControl";
import { ToolProcessingState } from "./shared/ToolProcessingState";
import { ToolSuccessState } from "./shared/ToolSuccessState";

type PageSizeOption = "A4" | "letter" | "fit";
type Orientation = "portrait" | "landscape";

const PAGE_SIZES: Record<"A4" | "letter", { width: number; height: number }> = {
  A4: { width: 595.28, height: 841.89 },
  letter: { width: 612, height: 792 },
};

const PAGE_SIZE_OPTIONS: { value: PageSizeOption; label: string }[] = [
  { value: "A4", label: "A4" },
  { value: "letter", label: "Letter" },
  { value: "fit", label: "Fit to image" },
];

const ORIENTATION_OPTIONS: { value: Orientation; label: string }[] = [
  { value: "portrait", label: "Portrait" },
  { value: "landscape", label: "Landscape" },
];

interface ImageItem {
  id: string;
  file: File;
  previewUrl: string;
  width: number;
  height: number;
}

const isJpegFile = (file: File): boolean =>
  file.type === "image/jpeg" || /\.jpe?g$/i.test(file.name);

interface LoadedImage {
  file: File;
  previewUrl: string;
}

/**
 * Filters incoming files against upload limits and returns the images that
 * should be added, updating the counters/error messages.
 */
const collectAcceptableImages = (
  files: FileList | File[],
  currentImages: ImageItem[],
  setSkippedCount: React.Dispatch<React.SetStateAction<number>>,
  setUploadError: React.Dispatch<React.SetStateAction<string | null>>
): LoadedImage[] => {
  const incoming = Array.from(files);
  const currentSize = currentImages.reduce((sum, img) => sum + img.file.size, 0);
  const accepted: LoadedImage[] = [];
  let addedBytes = 0;
  let skipped = 0;
  let error: string | null = null;

  for (const file of incoming) {
    if (!isJpegFile(file)) {
      skipped++;
      continue;
    }
    if (file.size > UPLOAD_LIMITS.maxImageSizeBytes) {
      if (!error) {
        error = `"${file.name}" exceeds the ${formatFileSize(UPLOAD_LIMITS.maxImageSizeBytes)} per-image limit.`;
      }
      continue;
    }
    if (currentImages.length + accepted.length >= UPLOAD_LIMITS.maxImages) {
      if (!error) error = `A maximum of ${UPLOAD_LIMITS.maxImages} images per PDF is allowed.`;
      continue;
    }
    if (currentSize + addedBytes + file.size > UPLOAD_LIMITS.maxTotalImagesBytes) {
      if (!error) {
        error = `Total image size exceeds the ${formatFileSize(UPLOAD_LIMITS.maxTotalImagesBytes)} limit.`;
      }
      continue;
    }
    accepted.push({ file, previewUrl: URL.createObjectURL(file) });
    addedBytes += file.size;
  }

  if (skipped > 0) setSkippedCount((prev) => prev + skipped);
  setUploadError(error);
  return accepted;
};

async function normalizeImage(
  file: File
): Promise<{ bytes: Uint8Array; width: number; height: number }> {
  const bitmap = await createImageBitmap(file);
  try {
    const canvas = document.createElement("canvas");
    canvas.width = bitmap.width;
    canvas.height = bitmap.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Could not create canvas context.");

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(bitmap, 0, 0);

    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (b) => (b ? resolve(b) : reject(new Error("Could not encode image."))),
        "image/jpeg",
        0.95
      );
    });

    return {
      bytes: new Uint8Array(await blob.arrayBuffer()),
      width: canvas.width,
      height: canvas.height,
    };
  } finally {
    bitmap.close();
  }
}

async function buildPdf(
  images: ImageItem[],
  size: PageSizeOption,
  orientation: Orientation,
  onProgress?: (current: number, total: number) => void
): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();

  for (let i = 0; i < images.length; i++) {
    onProgress?.(i + 1, images.length);
    const item = images[i];
    const { bytes, width, height } = await normalizeImage(item.file);
    const jpg = await pdfDoc.embedJpg(bytes);

    let pageWidth: number;
    let pageHeight: number;
    if (size === "fit") {
      pageWidth = width;
      pageHeight = height;
    } else {
      const template = PAGE_SIZES[size];
      pageWidth = orientation === "landscape" ? template.height : template.width;
      pageHeight = orientation === "landscape" ? template.width : template.height;
    }

    const page = pdfDoc.addPage([pageWidth, pageHeight]);
    const aspect = width / height;
    let drawWidth = pageWidth;
    let drawHeight = drawWidth / aspect;
    if (drawHeight > pageHeight) {
      drawHeight = pageHeight;
      drawWidth = drawHeight * aspect;
    }

    page.drawImage(jpg, {
      x: (pageWidth - drawWidth) / 2,
      y: (pageHeight - drawHeight) / 2,
      width: drawWidth,
      height: drawHeight,
    });
  }

  return pdfDoc.save();
}

interface ConversionResult {
  pdfBytes: Uint8Array;
  fileName: string;
  pageCount: number;
}

export function JpgToPdfTool() {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [pageSize, setPageSize] = useState<PageSizeOption>("A4");
  const [orientation, setOrientation] = useState<Orientation>("portrait");
  const [skippedCount, setSkippedCount] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [progress, setProgress] = useState<{ current: number; total: number } | undefined>(undefined);
  const inputRef = useRef<HTMLInputElement>(null);

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

  const isProcessing = state === "processing";

  const baseFilename = useMemo(() => {
    if (images.length === 0) return "images";
    return images.length === 1 ? sanitizeFilename(images[0].file.name) : "images";
  }, [images]);

  useEffect(() => {
    const urls = images.map((img) => img.previewUrl);
    return () => urls.forEach((url) => URL.revokeObjectURL(url));
  }, [images]);

  const addFiles = (files: FileList | File[]) => {
    const accepted = collectAcceptableImages(files, images, setSkippedCount, setUploadError);

    accepted.forEach(({ file, previewUrl }, index) => {
      const id = `${file.name}-${file.lastModified}-${index}-${Math.random().toString(36).slice(2, 8)}`;
      const preview = new Image();
      preview.onload = () => {
        setImages((prev) => [
          ...prev,
          { id, file, previewUrl, width: preview.naturalWidth, height: preview.naturalHeight },
        ]);
      };
      preview.onerror = () => {
        URL.revokeObjectURL(previewUrl);
        setSkippedCount((prev) => prev + 1);
      };
      preview.src = previewUrl;
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files?.length) addFiles(e.dataTransfer.files);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) addFiles(e.target.files);
    e.target.value = "";
  };

  const removeImage = (id: string) => {
    setImages((prev) => {
      const target = prev.find((img) => img.id === id);
      if (target) URL.revokeObjectURL(target.previewUrl);
      return prev.filter((img) => img.id !== id);
    });
  };

  const moveImage = (index: number, direction: -1 | 1) => {
    setImages((prev) => {
      const target = index + direction;
      if (target < 0 || target >= prev.length) return prev;
      const next = [...prev];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  };

  const handleConvert = () => {
    if (images.length === 0) return;
    startProcessing();
    setProgress({ current: 0, total: images.length });

    void buildPdf(images, pageSize, orientation, (current, total) =>
      setProgress({ current, total })
    )
      .then((pdfBytes) => {
        setSuccess({
          pdfBytes,
          fileName: `${baseFilename}.pdf`,
          pageCount: images.length,
        });
      })
      .catch((err: unknown) => {
        setFailed(err);
      });
  };

  const handleDownload = () => {
    if (!result) return;
    downloadBlob(result.pdfBytes, result.fileName, "application/pdf");
  };

  const handleStartOver = () => {
    cancelProcessing();
    reset();
    setSkippedCount(0);
    setUploadError(null);
    images.forEach((img) => URL.revokeObjectURL(img.previewUrl));
    setImages([]);
  };

  return (
    <div className="w-full min-w-0 max-w-3xl mx-auto space-y-6">
      {isProcessing ? (
        <ToolProcessingState message="Creating PDF..." progress={progress} />
      ) : state === "success" && result ? (
        <ToolSuccessState
          title="PDF created!"
          description={`Combined ${result.pageCount} image${result.pageCount === 1 ? "" : "s"} into ${result.fileName} · ${formatFileSize(result.pdfBytes.byteLength)}`}
          primaryAction={{ label: "Download PDF", onClick: handleDownload }}
          secondaryAction={{ label: "Convert another file", onClick: handleStartOver }}
        />
      ) : (
        <>
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            className="relative flex flex-col items-center justify-center w-full py-10 px-6 border border-dashed border-slate-300 rounded-lg bg-slate-50/50 hover:bg-slate-50/90 hover:border-slate-400 transition-all cursor-pointer group"
          >
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="flex flex-col items-center justify-center w-full h-full cursor-pointer"
            >
              <div className="p-3 bg-white border border-slate-200 rounded-md shadow-2xs text-slate-500 group-hover:text-slate-900 group-hover:border-slate-300 transition-colors mb-3">
                <ImagePlus className="w-5 h-5" aria-hidden="true" />
              </div>
              <div className="text-center space-y-1">
                <p className="text-sm font-semibold text-slate-800 group-hover:text-slate-900">
                  Select JPG images
                </p>
                <p className="text-xs text-slate-500">
                  Drag and drop one or more images here, or click to browse
                </p>
              </div>
              <div className="mt-4 px-3 py-1.5 bg-white border border-slate-200 text-slate-700 font-medium text-xs rounded-md group-hover:bg-slate-100/80 group-hover:border-slate-300 transition-colors shadow-2xs">
                Choose images
              </div>
              <span className="text-[11px] text-slate-400 mt-3 font-mono">
                JPG / JPEG · Local processing
              </span>
            </button>
            <input
              ref={inputRef}
              type="file"
              accept="image/jpeg,.jpg,.jpeg"
              multiple
              onChange={handleInputChange}
              className="sr-only"
            />
          </div>

          <p className="text-[11px] text-slate-500">
            Up to {UPLOAD_LIMITS.maxImages} images · {formatFileSize(UPLOAD_LIMITS.maxImageSizeBytes)} each ·{" "}
            {formatFileSize(UPLOAD_LIMITS.maxTotalImagesBytes)} total
          </p>

          {skippedCount > 0 && (
            <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-md text-xs text-amber-800">
              <AlertCircle size={14} className="shrink-0 mt-0.5" />
              <span>
                {skippedCount} file{skippedCount === 1 ? "" : "s"} skipped — only JPG/JPEG images are supported.
              </span>
            </div>
          )}

          {uploadError && (
            <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-md text-xs text-red-700">
              <AlertCircle size={14} className="shrink-0 mt-0.5" />
              <span>{uploadError}</span>
            </div>
          )}

          {images.length > 0 && (
            <>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Images ({images.length})
                  </h3>
                  <button
                    type="button"
                    onClick={handleStartOver}
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                  >
                    <Trash2 size={13} />
                    Clear all
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {images.map((img, index) => (
                    <div
                      key={img.id}
                      className="relative group flex flex-col rounded-md border border-slate-200 bg-white overflow-hidden"
                    >
                      <div className="relative w-full aspect-[4/3] bg-slate-50">
                        <span className="absolute top-1.5 left-1.5 z-10 px-1.5 py-0.5 text-[10px] font-mono font-semibold bg-slate-900/75 text-white rounded">
                          {index + 1}
                        </span>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={img.previewUrl}
                          alt=""
                          className="w-full h-full object-contain"
                          draggable={false}
                        />
                      </div>
                      <div className="p-2 min-w-0">
                        <p className="text-[11px] font-semibold text-slate-800 truncate" title={img.file.name}>
                          {img.file.name}
                        </p>
                        <p className="text-[10px] font-mono text-slate-500 mt-0.5">
                          {formatFileSize(img.file.size)} · {img.width}×{img.height}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 p-1.5 border-t border-slate-100">
                        <button
                          type="button"
                          onClick={() => moveImage(index, -1)}
                          disabled={index === 0}
                          aria-label={`Move ${img.file.name} up`}
                          className="flex-1 inline-flex items-center justify-center gap-1 px-2 py-1 text-[11px] font-medium text-slate-600 bg-white border border-slate-200 rounded hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        >
                          <ArrowUp size={12} /> Up
                        </button>
                        <button
                          type="button"
                          onClick={() => moveImage(index, 1)}
                          disabled={index === images.length - 1}
                          aria-label={`Move ${img.file.name} down`}
                          className="flex-1 inline-flex items-center justify-center gap-1 px-2 py-1 text-[11px] font-medium text-slate-600 bg-white border border-slate-200 rounded hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        >
                          <ArrowDown size={12} /> Down
                        </button>
                        <button
                          type="button"
                          onClick={() => removeImage(img.id)}
                          aria-label={`Remove ${img.file.name}`}
                          className="p-1.5 text-slate-400 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-white border border-slate-200 rounded-lg space-y-4">
                <SegmentedControl
                  label="Page size"
                  options={PAGE_SIZE_OPTIONS}
                  value={pageSize}
                  onChange={setPageSize}
                  size="sm"
                />
                <div className={pageSize === "fit" ? "opacity-40 pointer-events-none" : "opacity-100 pointer-events-auto"}>
                  <SegmentedControl
                    label="Orientation"
                    options={ORIENTATION_OPTIONS}
                    value={orientation}
                    onChange={setOrientation}
                    size="sm"
                  />
                </div>
                {pageSize === "fit" && (
                  <p className="text-[11px] font-mono text-slate-500">
                    Fit mode: each page matches its image dimensions. Orientation is not used.
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={handleConvert}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-md text-sm font-semibold transition-all shadow-2xs bg-slate-900 hover:bg-slate-800 text-white hover:shadow-xs active:translate-y-0.5"
              >
                <ImagePlus size={16} />
                Convert {images.length > 1 ? `${images.length} images` : "image"} to PDF
              </button>

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