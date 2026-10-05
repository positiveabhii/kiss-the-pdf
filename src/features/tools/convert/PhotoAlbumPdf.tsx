"use client";

import { useState } from "react";
import { AlertCircle, BookImage, Trash2 } from "lucide-react";

import { SegmentedControl } from "@/features/pdf/components/shared/SegmentedControl";
import { ToolProcessingState } from "@/features/pdf/components/shared/ToolProcessingState";
import { formatFileSize } from "@/features/pdf/utils/format-file-size";

import { FileDropZone } from "../core/FileDropZone";
import { ToolResultView } from "../core/ToolResult";
import { Checkbox, ColorInput, Field, Notice, RangeInput } from "../core/ui";
import { decodeImageFile } from "./decode";
import { ImageCards } from "./ImageCards";
import { ALBUM_LIMITS, ALBUM_MAX_DIMENSION } from "./limits";
import { CAPTION_SIZE, albumPageLayout, buildAlbumPdf } from "./ops/album";
import type { PreparedImage } from "./ops/images-pdf";
import { albumPlacement, type AlbumPerPage, type FitMode } from "./ops/layout";
import { acceptFor, type ImageFormat } from "./ops/sniff";
import { useImageList, type ImageItem } from "./useImageList";
import { useRunner } from "./useRunner";

const FORMATS: ImageFormat[] = ["jpg", "png", "webp", "gif", "bmp", "tiff", "svg"];
const MM = 72 / 25.4;

const PER_PAGE: { value: AlbumPerPage; label: string }[] = [
  { value: 1, label: "1" },
  { value: 2, label: "2" },
  { value: 4, label: "4" },
  { value: 6, label: "6" },
  { value: 9, label: "9" },
];
const SIZES: { value: "A4" | "Letter"; label: string }[] = [
  { value: "A4", label: "A4" },
  { value: "Letter", label: "Letter" },
];
const ORIENTATIONS: { value: "portrait" | "landscape"; label: string }[] = [
  { value: "portrait", label: "Portrait" },
  { value: "landscape", label: "Landscape" },
];
const FITS: { value: FitMode; label: string }[] = [
  { value: "fit", label: "Fit whole photo" },
  { value: "fill", label: "Fill cell (crop)" },
];

interface Settings {
  pageSize: "A4" | "Letter";
  orientation: "portrait" | "landscape";
  perPage: AlbumPerPage;
  marginMm: number;
  gapMm: number;
  background: string;
  fit: FitMode;
  captions: boolean;
}

function captionCss(bg: string): string {
  const n = parseInt(bg.replace("#", ""), 16) || 0xffffff;
  const lum = (0.2126 * ((n >> 16) & 255) + 0.7152 * ((n >> 8) & 255) + 0.0722 * (n & 255)) / 255;
  return lum > 0.5 ? "rgb(51 65 85)" : "rgb(235 237 242)";
}

/** Live mock of the first album page, drawn from the same layout math as the PDF. */
function AlbumPreview({ items, s }: { items: ImageItem[]; s: Settings }) {
  const layout = albumPageLayout({
    pageSize: s.pageSize,
    orientation: s.orientation,
    perPage: s.perPage,
    marginPt: s.marginMm * MM,
    gapPt: s.gapMm * MM,
    captions: s.captions,
  });
  const W = layout.pageWidth;
  const H = layout.pageHeight;
  const pct = (v: number, of: number) => `${(v / of) * 100}%`;
  return (
    <div className="flex justify-center">
      <div
        className="relative border border-slate-300 shadow-xs overflow-hidden"
        style={{
          width: W > H ? 320 : 230,
          aspectRatio: `${W} / ${H}`,
          backgroundColor: s.background,
          containerType: "inline-size",
        }}
        aria-label="Preview of the first album page"
      >
        {layout.cells.map((c, i) => {
          const item = items[i];
          if (!item) {
            return (
              <div
                key={i}
                className="absolute border border-dashed border-slate-300"
                style={{ left: pct(c.image.x, W), top: pct(H - (c.image.y + c.image.height), H), width: pct(c.image.width, W), height: pct(c.image.height, H) }}
              />
            );
          }
          const place = albumPlacement(c, item.probe.width || 1, item.probe.height || 1, s.fit);
          const box = place.clip;
          const caption = s.captions ? item.caption.trim() : "";
          return (
            <div key={item.id}>
              <div
                className="absolute overflow-hidden bg-slate-200/60"
                style={{ left: pct(box.x, W), top: pct(H - (box.y + box.height), H), width: pct(box.width, W), height: pct(box.height, H) }}
              >
                {item.probe.previewUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.probe.previewUrl} alt="" className="w-full h-full" style={{ objectFit: s.fit === "fit" ? "contain" : "cover" }} />
                )}
              </div>
              {place.caption && caption && (
                <div
                  className="absolute flex items-center justify-center overflow-hidden whitespace-nowrap"
                  style={{
                    left: pct(place.caption.x, W),
                    top: pct(H - (place.caption.y + place.caption.height), H),
                    width: pct(place.caption.width, W),
                    height: pct(place.caption.height, H),
                    fontSize: `${(CAPTION_SIZE / W) * 100}cqw`,
                    color: captionCss(s.background),
                  }}
                >
                  <span className="truncate">{caption}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function PhotoAlbumPdf() {
  const list = useImageList(ALBUM_LIMITS, FORMATS);
  const runner = useRunner();
  const [s, setS] = useState<Settings>({
    pageSize: "A4",
    orientation: "portrait",
    perPage: 4,
    marginMm: 12,
    gapMm: 5,
    background: "#ffffff",
    fit: "fit",
    captions: false,
  });
  const set = <K extends keyof Settings>(k: K, v: Settings[K]) => setS((p) => ({ ...p, [k]: v }));
  const { items } = list;
  const pages = Math.ceil(items.length / s.perPage);
  const multiFrame = items.some((i) => i.probe.frames > 1);

  const build = () =>
    runner.run(async ({ signal, onProgress }) => {
      const notes = new Set<string>();
      const getImage = async (i: number): Promise<PreparedImage> => {
        const got: { img?: PreparedImage } = {};
        // Albums use one picture per photo: the first frame / page of GIFs and TIFFs.
        const report = await decodeImageFile(
          items[i].file,
          { gifFrames: "first", maxFrames: 1, svgDpi: 300, maxDimension: ALBUM_MAX_DIMENSION },
          async (img) => {
            got.img ??= img;
          },
          signal
        );
        report.notes.forEach((n) => notes.add(n));
        if (!got.img) throw new Error(`"${items[i].file.name}" produced no image.`);
        return got.img;
      };
      const { bytes, pageCount } = await buildAlbumPdf({
        count: items.length,
        getImage,
        onProgress,
        signal,
        title: "Photo album",
        pageSize: s.pageSize,
        orientation: s.orientation,
        perPage: s.perPage,
        marginPt: s.marginMm * MM,
        gapPt: s.gapMm * MM,
        background: s.background,
        fit: s.fit,
        captions: s.captions ? items.map((it) => it.caption) : null,
      });
      return {
        kind: "file",
        data: bytes,
        fileName: "photo-album.pdf",
        title: "Album created!",
        summary: [
          `${items.length} photo${items.length === 1 ? "" : "s"} on ${pageCount} page${pageCount === 1 ? "" : "s"} · ${formatFileSize(bytes.byteLength)}`,
          ...[...notes].filter((n) => !/first of \d+ frames/.test(n)),
        ].join(" "),
      };
    });

  const startOver = () => {
    runner.reset();
    list.clear();
  };

  if (runner.phase === "processing") {
    return (
      <div className="w-full min-w-0 max-w-3xl mx-auto">
        <ToolProcessingState message="Building your album..." progress={runner.progress} onCancel={runner.cancel} />
      </div>
    );
  }
  if (runner.phase === "done" && runner.output) {
    return (
      <div className="w-full min-w-0 max-w-3xl mx-auto">
        <ToolResultView output={runner.output} onStartOver={startOver} startOverLabel="Make another album" />
      </div>
    );
  }

  return (
    <div className="w-full min-w-0 max-w-3xl mx-auto space-y-6">
      <FileDropZone
        accept={acceptFor(FORMATS)}
        multiple
        title={list.adding ? "Reading photos…" : "Select photos"}
        subtitle="Drag and drop your photos here, or click to browse"
        formatsLabel="JPG · PNG · WebP · GIF · BMP · TIFF · SVG · Local processing"
        onFiles={(f) => void list.add(f)}
        onRejected={list.reject}
      />
      <p className="text-[11px] text-slate-500">
        Up to {ALBUM_LIMITS.maxImages} photos · {formatFileSize(ALBUM_LIMITS.maxImageSizeBytes)} each. Photos
        are scaled to at most {ALBUM_MAX_DIMENSION}px on the long side — plenty for print.
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
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Photos ({items.length})</h3>
              <button
                type="button"
                onClick={startOver}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
              >
                <Trash2 size={13} /> Clear all
              </button>
            </div>
            <ImageCards
              items={items}
              onMove={list.move}
              onRemove={list.remove}
              onCaption={s.captions ? list.setCaption : undefined}
            />
            {multiFrame && (
              <p className="text-[11px] text-slate-500">
                Animated GIFs and multi-page TIFFs contribute their first frame / page.
              </p>
            )}
          </div>

          <div className="grid gap-4 md:grid-cols-[1fr_auto]">
            <div className="p-4 bg-white border border-slate-200 rounded-lg space-y-4 min-w-0">
              <SegmentedControl label="Photos per page" options={PER_PAGE} value={s.perPage} onChange={(v) => set("perPage", v)} size="sm" />
              <div className="flex flex-wrap gap-4">
                <SegmentedControl label="Page size" options={SIZES} value={s.pageSize} onChange={(v) => set("pageSize", v)} size="sm" />
                <SegmentedControl label="Orientation" options={ORIENTATIONS} value={s.orientation} onChange={(v) => set("orientation", v)} size="sm" />
              </div>
              <SegmentedControl label="Photo placement" options={FITS} value={s.fit} onChange={(v) => set("fit", v)} size="sm" />
              <Field label="Margin" htmlFor="album-margin">
                <RangeInput id="album-margin" min={0} max={40} value={s.marginMm} onChange={(v) => set("marginMm", v)} format={(v) => `${v} mm`} />
              </Field>
              <Field label="Gap between photos" htmlFor="album-gap">
                <RangeInput id="album-gap" min={0} max={20} value={s.gapMm} onChange={(v) => set("gapMm", v)} format={(v) => `${v} mm`} />
              </Field>
              <Field label="Background">
                <ColorInput value={s.background} onChange={(v) => set("background", v)} />
              </Field>
              <div className="space-y-1">
                <Checkbox id="album-captions" checked={s.captions} onChange={(v) => set("captions", v)} label="Add captions" />
                {s.captions && (
                  <p className="text-[11px] text-slate-500">
                    Captions start as the file name — edit them under each photo above. Characters outside
                    Western European scripts print as “?”.
                  </p>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Page 1 preview</p>
              <AlbumPreview items={items} s={s} />
              <p className="text-[11px] text-slate-500 text-center">
                {pages} page{pages === 1 ? "" : "s"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => void build()}
            disabled={list.adding}
            className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-md text-sm font-semibold transition-all shadow-2xs bg-slate-900 hover:bg-slate-800 text-white hover:shadow-xs active:translate-y-0.5 disabled:opacity-40"
          >
            <BookImage size={16} />
            Create album ({pages} page{pages === 1 ? "" : "s"})
          </button>
          {runner.phase === "error" && runner.error && (
            <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-md text-xs text-red-700">
              <AlertCircle size={14} className="shrink-0 mt-0.5" />
              <span>Could not create the album: {runner.error}</span>
            </div>
          )}
        </>
      )}
    </div>
  );
}
