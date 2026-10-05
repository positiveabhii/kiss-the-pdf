"use client";

import { useState } from "react";
import { AlertCircle, Grid3x3, Trash2 } from "lucide-react";

import { SegmentedControl } from "@/features/pdf/components/shared/SegmentedControl";
import { ToolProcessingState } from "@/features/pdf/components/shared/ToolProcessingState";
import { formatFileSize } from "@/features/pdf/utils/format-file-size";

import { FileDropZone } from "../core/FileDropZone";
import { ToolResultView } from "../core/ToolResult";
import { Checkbox, Field, Notice, TextInput } from "../core/ui";
import { decodeImageFile } from "./decode";
import { ImageRows } from "./ImageCards";
import { CONTACT_JPEG_QUALITY, CONTACT_LIMITS, CONTACT_THUMB_MAX } from "./limits";
import { buildContactSheetPdf, contactPageLayout } from "./ops/album";
import type { PreparedImage } from "./ops/images-pdf";
import { acceptFor, type ImageFormat } from "./ops/sniff";
import { useImageList } from "./useImageList";
import { useRunner } from "./useRunner";

const FORMATS: ImageFormat[] = ["jpg", "png", "webp", "gif", "bmp", "tiff", "svg"];

const COLUMNS = [3, 4, 5, 6, 7, 8].map((n) => ({ value: n, label: String(n) }));
const SIZES: { value: "A4" | "Letter"; label: string }[] = [
  { value: "A4", label: "A4" },
  { value: "Letter", label: "Letter" },
];
const ORIENTATIONS: { value: "portrait" | "landscape"; label: string }[] = [
  { value: "portrait", label: "Portrait" },
  { value: "landscape", label: "Landscape" },
];

export default function ContactSheetPdf() {
  const list = useImageList(CONTACT_LIMITS, FORMATS);
  const runner = useRunner();
  const [cols, setCols] = useState(5);
  const [pageSize, setPageSize] = useState<"A4" | "Letter">("A4");
  const [orientation, setOrientation] = useState<"portrait" | "landscape">("portrait");
  const [labels, setLabels] = useState(true);
  const [title, setTitle] = useState("");
  const [pageNumbers, setPageNumbers] = useState(true);
  const { items } = list;

  const layout = contactPageLayout({ pageSize, orientation, cols, title, pageNumbers, labels, count: items.length });

  // Thumbnails only need ~200 DPI at their printed size: keeps a 200-photo sheet small.
  const cellBox = layout.cells[0]?.image;
  const thumbMax = cellBox
    ? Math.min(CONTACT_THUMB_MAX, Math.max(160, Math.ceil((Math.max(cellBox.width, cellBox.height) * 200) / 72)))
    : CONTACT_THUMB_MAX;

  const build = () =>
    runner.run(async ({ signal, onProgress }) => {
      const getImage = async (i: number): Promise<PreparedImage> => {
        const got: { img?: PreparedImage } = {};
        await decodeImageFile(
          items[i].file,
          {
            gifFrames: "first",
            maxFrames: 1,
            svgDpi: 150,
            maxDimension: thumbMax,
            flattenOnto: "#ffffff",
            jpegQuality: CONTACT_JPEG_QUALITY,
          },
          async (img) => {
            got.img ??= img;
          },
          signal
        );
        if (!got.img) throw new Error(`"${items[i].file.name}" produced no image.`);
        return got.img;
      };
      const { bytes, pageCount } = await buildContactSheetPdf({
        count: items.length,
        getImage,
        onProgress,
        signal,
        pageSize,
        orientation,
        cols,
        labels: labels ? items.map((it) => it.file.name) : null,
        title,
        pageNumbers,
      });
      return {
        kind: "file",
        data: bytes,
        fileName: "contact-sheet.pdf",
        title: "Contact sheet created!",
        summary: `${items.length} image${items.length === 1 ? "" : "s"} on ${pageCount} page${pageCount === 1 ? "" : "s"} · ${formatFileSize(bytes.byteLength)}`,
      };
    });

  const startOver = () => {
    runner.reset();
    list.clear();
  };

  if (runner.phase === "processing") {
    return (
      <div className="w-full min-w-0 max-w-3xl mx-auto">
        <ToolProcessingState message="Building contact sheet..." progress={runner.progress} onCancel={runner.cancel} />
      </div>
    );
  }
  if (runner.phase === "done" && runner.output) {
    return (
      <div className="w-full min-w-0 max-w-3xl mx-auto">
        <ToolResultView output={runner.output} onStartOver={startOver} startOverLabel="Make another sheet" />
      </div>
    );
  }

  return (
    <div className="w-full min-w-0 max-w-3xl mx-auto space-y-6">
      <FileDropZone
        accept={acceptFor(FORMATS)}
        multiple
        title={list.adding ? "Reading images…" : "Select images"}
        subtitle="Drag and drop a folder's worth of images here, or click to browse"
        formatsLabel="JPG · PNG · WebP · GIF · BMP · TIFF · SVG · Local processing"
        onFiles={(f) => void list.add(f)}
        onRejected={list.reject}
      />
      <p className="text-[11px] text-slate-500">
        Up to {CONTACT_LIMITS.maxImages} images. Thumbnails are downscaled so even large sets make a small PDF.
      </p>
      {list.skipped.length > 0 && (
        <Notice tone="warning">
          {list.skipped.length} file{list.skipped.length === 1 ? "" : "s"} skipped — not an image this tool can read.
        </Notice>
      )}
      {list.error && <Notice tone="error">{list.error}</Notice>}

      {items.length > 0 && (
        <>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Images ({items.length})</h3>
              <button
                type="button"
                onClick={startOver}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
              >
                <Trash2 size={13} /> Clear all
              </button>
            </div>
            <ImageRows items={items} onMove={list.move} onRemove={list.remove} />
          </div>

          <div className="p-4 bg-white border border-slate-200 rounded-lg space-y-4">
            <SegmentedControl label="Columns" options={COLUMNS} value={cols} onChange={setCols} size="sm" />
            <div className="flex flex-wrap gap-4">
              <SegmentedControl label="Page size" options={SIZES} value={pageSize} onChange={setPageSize} size="sm" />
              <SegmentedControl label="Orientation" options={ORIENTATIONS} value={orientation} onChange={setOrientation} size="sm" />
            </div>
            <Field label="Title (optional)" htmlFor="cs-title" hint="Printed at the top of every page.">
              <TextInput id="cs-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Shoot 2026-10-04" maxLength={120} />
            </Field>
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              <Checkbox id="cs-labels" checked={labels} onChange={setLabels} label="File names under thumbnails" />
              <Checkbox id="cs-pages" checked={pageNumbers} onChange={setPageNumbers} label="Page numbers" />
            </div>
            <p className="text-[11px] font-mono text-slate-500">
              {layout.cols} × {layout.rows} = {layout.perPage} per page · {layout.pageCount} page
              {layout.pageCount === 1 ? "" : "s"}
            </p>
          </div>

          <button
            type="button"
            onClick={() => void build()}
            disabled={list.adding}
            className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-md text-sm font-semibold transition-all shadow-2xs bg-slate-900 hover:bg-slate-800 text-white hover:shadow-xs active:translate-y-0.5 disabled:opacity-40"
          >
            <Grid3x3 size={16} />
            Create contact sheet
          </button>
          {runner.phase === "error" && runner.error && (
            <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-md text-xs text-red-700">
              <AlertCircle size={14} className="shrink-0 mt-0.5" />
              <span>Could not create the contact sheet: {runner.error}</span>
            </div>
          )}
        </>
      )}
    </div>
  );
}
