"use client";

import { useState } from "react";
import { AlertCircle, ImagePlus, Trash2 } from "lucide-react";

import { SegmentedControl } from "@/features/pdf/components/shared/SegmentedControl";
import { ToolProcessingState } from "@/features/pdf/components/shared/ToolProcessingState";
import { formatFileSize } from "@/features/pdf/utils/format-file-size";
import { sanitizeFilename } from "@/features/pdf/utils/sanitize-filename";

import { FileDropZone } from "../core/FileDropZone";
import { ToolResultView } from "../core/ToolResult";
import { ColorInput, Notice } from "../core/ui";
import { decodeImageFile, imageDecoderAvailable, type DecodeOptions } from "./decode";
import { ImageCards } from "./ImageCards";
import { addImagePage, createImageDoc, saveImageDoc, type ImagePageLayout, type PreparedImage } from "./ops/images-pdf";
import type { FitMode, OrientationChoice, PageSizeChoice } from "./ops/layout";
import { acceptFor, type ImageFormat } from "./ops/sniff";
import { useImageList, type ImageLimits } from "./useImageList";
import { useRunner } from "./useRunner";

/**
 * The one images → PDF tool. JPG/PNG/WebP/GIF/BMP/TIFF/SVG to PDF and
 * Images to PDF are this component with a different `formats` list.
 *
 * layout="basic" is the original JPG to PDF option set (page size +
 * portrait/landscape); "full" adds auto orientation, margins, fit/fill and a
 * page background.
 */

export interface ImagesToPdfToolProps {
  formats: ImageFormat[];
  /** "Select JPG images" */
  selectTitle: string;
  /** "JPG / JPEG · Local processing" */
  formatsLabel: string;
  /** "only JPG/JPEG images are supported" */
  skippedReason: string;
  limits: ImageLimits;
  layout?: "basic" | "full";
  /** Shown above the options (e.g. "SVGs become high-resolution images"). */
  notice?: React.ReactNode;
}

type Margin = "none" | "small" | "large";
type Background = "none" | "white" | "custom";
type GifFrames = "first" | "all";

const MARGIN_PT: Record<Margin, number> = { none: 0, small: 18, large: 36 };

const PAGE_SIZE_OPTIONS: { value: PageSizeChoice; label: string }[] = [
  { value: "A4", label: "A4" },
  { value: "Letter", label: "Letter" },
  { value: "fit", label: "Fit to image" },
];
const BASIC_ORIENTATION: { value: OrientationChoice; label: string }[] = [
  { value: "portrait", label: "Portrait" },
  { value: "landscape", label: "Landscape" },
];
const FULL_ORIENTATION: { value: OrientationChoice; label: string }[] = [
  { value: "auto", label: "Auto (match image)" },
  ...BASIC_ORIENTATION,
];
const MARGIN_OPTIONS: { value: Margin; label: string }[] = [
  { value: "none", label: "None" },
  { value: "small", label: "Small" },
  { value: "large", label: "Large" },
];
const FIT_OPTIONS: { value: FitMode; label: string }[] = [
  { value: "fit", label: "Fit whole image" },
  { value: "fill", label: "Fill page (crop)" },
];
const BACKGROUND_OPTIONS: { value: Background; label: string }[] = [
  { value: "none", label: "None (keep transparency)" },
  { value: "white", label: "White" },
  { value: "custom", label: "Color" },
];
const GIF_OPTIONS: { value: GifFrames; label: string }[] = [
  { value: "first", label: "First frame only" },
  { value: "all", label: "Every frame as a page" },
];
const SVG_DPI_OPTIONS: { value: number; label: string }[] = [
  { value: 150, label: "150" },
  { value: 300, label: "300" },
  { value: 600, label: "600" },
];

export function ImagesToPdfTool({
  formats,
  selectTitle,
  formatsLabel,
  skippedReason,
  limits,
  layout = "full",
  notice,
}: ImagesToPdfToolProps) {
  const list = useImageList(limits, formats);
  const runner = useRunner();
  const full = layout === "full";

  const [pageSize, setPageSize] = useState<PageSizeChoice>("A4");
  const [orientation, setOrientation] = useState<OrientationChoice>(full ? "auto" : "portrait");
  const [margin, setMargin] = useState<Margin>("none");
  const [fit, setFit] = useState<FitMode>("fit");
  const [background, setBackground] = useState<Background>("none");
  const [customColor, setCustomColor] = useState("#f1f5f9");
  const [gifFrames, setGifFrames] = useState<GifFrames>("all");
  const [svgDpi, setSvgDpi] = useState(300);

  const { items } = list;
  const hasAnimatedGif = items.some((i) => i.probe.format === "gif" && i.probe.frames > 1);
  const hasSvg = items.some((i) => i.probe.format === "svg");
  const mayHaveTransparency = items.some((i) => i.probe.format !== "jpg");
  const canSplitGif = imageDecoderAvailable();

  const expectedPages = items.reduce((s, it) => {
    if (it.probe.format === "gif") return s + (gifFrames === "all" && canSplitGif ? it.probe.frames : 1);
    return s + it.probe.frames;
  }, 0);

  const baseFilename = items.length === 1 ? sanitizeFilename(items[0].file.name) : "images";

  const convert = () =>
    runner.run(async ({ signal, onProgress }) => {
      const pageLayout: ImagePageLayout = {
        pageSize,
        orientation,
        marginPt: full ? MARGIN_PT[margin] : 0,
        fit: full ? fit : "fit",
        background: !full ? null : background === "white" ? "#ffffff" : background === "custom" ? customColor : null,
      };
      const decodeOpts: DecodeOptions = { gifFrames, svgDpi };
      const doc = await createImageDoc();
      const notes: string[] = [];
      for (let i = 0; i < items.length; i++) {
        if (signal.aborted) throw new DOMException("Aborted", "AbortError");
        onProgress(i + 1, items.length);
        const file = items[i].file;
        const add = (img: PreparedImage) => addImagePage(doc, img, pageLayout).then(() => undefined);
        try {
          const report = await decodeImageFile(file, decodeOpts, add, signal);
          notes.push(...report.notes);
        } catch (err) {
          // pdf-lib rejects a few unusual JPEG/PNG encodings; redraw them through a canvas.
          if (err instanceof Error && /Could not embed image/.test(err.message)) {
            const report = await decodeImageFile(file, { ...decodeOpts, forceCanvas: true }, add, signal);
            notes.push(...report.notes);
          } else throw err;
        }
      }
      const data = await saveImageDoc(doc);
      const pages = doc.getPageCount();
      const fileName = `${baseFilename}.pdf`;
      const what =
        pages === items.length
          ? `Combined ${items.length} image${items.length === 1 ? "" : "s"}`
          : `Made ${pages} pages from ${items.length} image${items.length === 1 ? "" : "s"}`;
      return {
        kind: "file",
        data,
        fileName,
        title: "PDF created!",
        summary: [`${what} into ${fileName} · ${formatFileSize(data.byteLength)}`, ...notes].join(" "),
      };
    });

  const startOver = () => {
    runner.reset();
    list.clear();
  };

  if (runner.phase === "processing") {
    return (
      <div className="w-full min-w-0 max-w-3xl mx-auto space-y-6">
        <ToolProcessingState message="Creating PDF..." progress={runner.progress} onCancel={runner.cancel} />
      </div>
    );
  }
  if (runner.phase === "done" && runner.output) {
    return (
      <div className="w-full min-w-0 max-w-3xl mx-auto space-y-6">
        <ToolResultView output={runner.output} onStartOver={startOver} startOverLabel="Convert another file" />
      </div>
    );
  }

  return (
    <div className="w-full min-w-0 max-w-3xl mx-auto space-y-6">
      <FileDropZone
        accept={acceptFor(formats)}
        multiple
        title={list.adding ? "Reading images…" : selectTitle}
        subtitle="Drag and drop one or more images here, or click to browse"
        formatsLabel={formatsLabel}
        onFiles={(files) => void list.add(files)}
        onRejected={list.reject}
      />

      <p className="text-[11px] text-slate-500">
        Up to {limits.maxImages} images · {formatFileSize(limits.maxImageSizeBytes)} each ·{" "}
        {formatFileSize(limits.maxTotalBytes)} total
      </p>

      {list.skipped.length > 0 && (
        <Notice tone="warning">
          {list.skipped.length} file{list.skipped.length === 1 ? "" : "s"} skipped — {skippedReason}.
        </Notice>
      )}
      {list.error && <Notice tone="error">{list.error}</Notice>}

      {items.length > 0 && (
        <>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Images ({items.length})
              </h3>
              <button
                type="button"
                onClick={startOver}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
              >
                <Trash2 size={13} />
                Clear all
              </button>
            </div>
            <ImageCards items={items} onMove={list.move} onRemove={list.remove} />
          </div>

          {notice}

          <div className="p-4 bg-white border border-slate-200 rounded-lg space-y-4">
            <SegmentedControl label="Page size" options={PAGE_SIZE_OPTIONS} value={pageSize} onChange={setPageSize} size="sm" />
            <div className={pageSize === "fit" ? "opacity-40 pointer-events-none" : "opacity-100 pointer-events-auto"}>
              <SegmentedControl
                label="Orientation"
                options={full ? FULL_ORIENTATION : BASIC_ORIENTATION}
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
            {full && (
              <div className="flex flex-wrap items-end gap-4 pt-3 border-t border-slate-100">
                <SegmentedControl label="Margin" options={MARGIN_OPTIONS} value={margin} onChange={setMargin} size="sm" />
                <div className={pageSize === "fit" ? "opacity-40 pointer-events-none" : ""}>
                  <SegmentedControl label="Image placement" options={FIT_OPTIONS} value={fit} onChange={setFit} size="sm" />
                </div>
              </div>
            )}
            {full && mayHaveTransparency && (
              <div className="flex flex-wrap items-end gap-4 pt-3 border-t border-slate-100">
                <SegmentedControl
                  label="Page background"
                  options={BACKGROUND_OPTIONS}
                  value={background}
                  onChange={setBackground}
                  size="sm"
                />
                {background === "custom" && <ColorInput value={customColor} onChange={setCustomColor} />}
              </div>
            )}
            {hasAnimatedGif && (
              <div className="space-y-2 pt-3 border-t border-slate-100">
                <SegmentedControl label="Animated GIFs" options={GIF_OPTIONS} value={gifFrames} onChange={setGifFrames} size="sm" />
                {gifFrames === "all" && !canSplitGif && (
                  <Notice tone="warning">
                    This browser can&apos;t split GIF animations into frames, so only the first frame of each
                    GIF will be used. Chrome, Edge or Safari 17+ can convert every frame.
                  </Notice>
                )}
              </div>
            )}
            {hasSvg && (
              <div className="space-y-2 pt-3 border-t border-slate-100">
                <SegmentedControl label="SVG resolution (DPI)" options={SVG_DPI_OPTIONS} value={svgDpi} onChange={setSvgDpi} size="sm" />
                <p className="text-[11px] text-slate-500">
                  SVGs are placed in the PDF as high-resolution images, not as vector graphics — text in
                  them won&apos;t be selectable.
                </p>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => void convert()}
            disabled={list.adding}
            className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-md text-sm font-semibold transition-all shadow-2xs bg-slate-900 hover:bg-slate-800 text-white hover:shadow-xs active:translate-y-0.5 disabled:opacity-40"
          >
            <ImagePlus size={16} />
            Convert {items.length > 1 ? `${items.length} images` : "image"} to PDF
            {expectedPages !== items.length && ` (${expectedPages} pages)`}
          </button>

          {runner.phase === "error" && runner.error && (
            <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-md text-xs text-red-700">
              <AlertCircle size={14} className="shrink-0 mt-0.5" />
              <span>Conversion failed: {runner.error}</span>
            </div>
          )}
        </>
      )}
    </div>
  );
}
