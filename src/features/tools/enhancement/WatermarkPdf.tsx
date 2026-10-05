"use client";

import { useEffect, useMemo, useState } from "react";
import { X } from "lucide-react";

import { SegmentedControl } from "@/features/pdf/components/shared/SegmentedControl";

import { FileDropZone } from "../core/FileDropZone";
import { SimplePdfTool } from "../core/SimplePdfTool";
import { PageViewer } from "../core/PageViewer";
import { outputName, readFileBytes } from "../core/pdf-io";
import { Checkbox, ColorInput, Field, Notice, NumberInput, OptionsPanel, RangeInput, Select, TextInput } from "../core/ui";
import { encodableText, FONT_CHOICES, type FontChoice } from "./ops/page-draw";
import {
  addWatermark,
  centeredPlacements,
  imagePlacements,
  type ImagePosition,
  type WatermarkLayer,
  fitTextSize,
} from "./ops/watermark";
import { PageNav, PageRangeField, TextPreviewOverlay, parsePageList } from "./components/shared";
import { useFontMetrics } from "./components/useFontMetrics";

type Kind = "text" | "image";

interface PickedImage {
  file: File;
  bytes: Uint8Array;
  mime: "image/png" | "image/jpeg";
  url: string;
  width: number;
  height: number;
}

const IMAGE_POSITIONS: { value: ImagePosition; label: string }[] = [
  { value: "center", label: "Center" },
  { value: "top-left", label: "Top left" },
  { value: "top-right", label: "Top right" },
  { value: "bottom-left", label: "Bottom left" },
  { value: "bottom-right", label: "Bottom right" },
  { value: "tiled", label: "Tiled" },
];

export default function WatermarkPdf() {
  const [kind, setKind] = useState<Kind>("text");
  const [text, setText] = useState("CONFIDENTIAL");
  const [font, setFont] = useState<FontChoice>("Helvetica-Bold");
  const [size, setSize] = useState(64);
  // Fit to each page by default: a fixed size runs off small pages and looks
  // lost on large ones.
  const [autoSize, setAutoSize] = useState(true);
  const [color, setColor] = useState("#dc2626");
  const [opacity, setOpacity] = useState(0.25);
  const [angle, setAngle] = useState(45);
  const [layout, setLayout] = useState<"center" | "tiled">("center");
  const [image, setImage] = useState<PickedImage | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const [scale, setScale] = useState(0.5);
  const [position, setPosition] = useState<ImagePosition>("center");
  const [layer, setLayer] = useState<WatermarkLayer>("over");
  const [rangeText, setRangeText] = useState("");
  const [previewPage, setPreviewPage] = useState(1);
  const metrics = useFontMetrics(font);

  useEffect(() => () => {
    if (image) URL.revokeObjectURL(image.url);
  }, [image]);

  const pickImage = async (file: File) => {
    setImageError(null);
    const mime = file.type === "image/png" || /\.png$/i.test(file.name) ? "image/png" : "image/jpeg";
    const bytes = await readFileBytes(file);
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => setImage({ file, bytes, mime, url, width: img.naturalWidth, height: img.naturalHeight });
    img.onerror = () => {
      URL.revokeObjectURL(url);
      setImageError(`"${file.name}" couldn't be read as an image.`);
    };
    img.src = url;
  };

  const shownText = useMemo(() => (metrics ? encodableText(metrics, text.trim()).text : text.trim()), [metrics, text]);

  return (
    <SimplePdfTool
      actionLabel="Add watermark"
      processingMessage="Adding watermark…"
      preview
      onReset={() => setPreviewPage(1)}
      validate={(doc) => {
        const r = parsePageList(rangeText, doc.pageCount);
        if (r.error) return r.error;
        if (kind === "text" && !text.trim()) return "Type the watermark text.";
        if (kind === "image" && !image) return "Choose a PNG or JPG image.";
        return null;
      }}
      options={(doc) => {
        const page = Math.min(previewPage, doc.pageCount);
        const range = parsePageList(rangeText, doc.pageCount);
        const onThisPage = !range.pages.length || range.pages.includes(page);
        return (
          <>
            <OptionsPanel>
              <SegmentedControl
                label="Watermark"
                size="sm"
                options={[
                  { value: "text", label: "Text" },
                  { value: "image", label: "Image" },
                ]}
                value={kind}
                onChange={setKind}
              />
              {kind === "text" ? (
                <>
                  <Field label="Text" htmlFor="wm-text">
                    <TextInput id="wm-text" value={text} onChange={(e) => setText(e.target.value)} />
                  </Field>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="Font" htmlFor="wm-font">
                      <Select id="wm-font" value={font} onChange={setFont} options={FONT_CHOICES} />
                    </Field>
                    <Field label="Size" htmlFor="wm-size">
                      <div className="space-y-2">
                        <Checkbox id="wm-size-auto" checked={autoSize} onChange={setAutoSize} label="Fit to each page" />
                        <NumberInput id="wm-size" value={size} onChange={(v) => setSize(Math.min(400, Math.max(6, v)))} min={6} max={400} suffix="pt" disabled={autoSize} />
                      </div>
                    </Field>
                    <Field label="Color" htmlFor="wm-color">
                      <ColorInput id="wm-color" value={color} onChange={setColor} />
                    </Field>
                    <Field label="Rotation" htmlFor="wm-angle">
                      <RangeInput id="wm-angle" value={angle} onChange={setAngle} min={-90} max={90} step={5} format={(v) => `${v}°`} />
                    </Field>
                  </div>
                  <SegmentedControl
                    label="Placement"
                    size="sm"
                    options={[
                      { value: "center", label: "Center" },
                      { value: "tiled", label: "Tiled" },
                    ]}
                    value={layout}
                    onChange={setLayout}
                  />
                </>
              ) : (
                <>
                  {image ? (
                    <div className="flex items-center gap-3 p-2 border border-slate-200 rounded-md">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={image.url} alt="" className="h-12 w-12 object-contain bg-slate-50 rounded" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-slate-800 truncate">{image.file.name}</p>
                        <p className="text-[11px] text-slate-500">
                          {image.width} × {image.height} px
                        </p>
                      </div>
                      <button
                        type="button"
                        aria-label="Remove image"
                        onClick={() => setImage(null)}
                        className="p-1 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <FileDropZone
                      compact
                      accept="image/png,image/jpeg,.png,.jpg,.jpeg"
                      title="Choose a PNG or JPG"
                      formatsLabel="PNG keeps transparency"
                      onFiles={([f]) => void pickImage(f)}
                      onRejected={([f]) => setImageError(`"${f.name}" isn't a PNG or JPG.`)}
                    />
                  )}
                  {imageError && <Notice tone="error">{imageError}</Notice>}
                  <Field label="Width" htmlFor="wm-scale">
                    <RangeInput id="wm-scale" value={scale} onChange={setScale} min={0.05} max={1} step={0.05} format={(v) => `${Math.round(v * 100)}%`} />
                  </Field>
                  <Field label="Position" htmlFor="wm-pos">
                    <Select id="wm-pos" value={position} onChange={setPosition} options={IMAGE_POSITIONS} />
                  </Field>
                </>
              )}
              <Field label="Opacity" htmlFor="wm-opacity">
                <RangeInput id="wm-opacity" value={opacity} onChange={setOpacity} min={0.05} max={1} step={0.05} format={(v) => `${Math.round(v * 100)}%`} />
              </Field>
              <SegmentedControl
                label="Layer"
                size="sm"
                options={[
                  { value: "over", label: "Over content" },
                  { value: "under", label: "Behind content" },
                ]}
                value={layer}
                onChange={setLayer}
              />
              {layer === "under" && (
                <p className="text-[11px] text-slate-500 -mt-2">
                  Behind the page&apos;s own content. On scanned pages or pages with a solid background it will be
                  hidden — use “Over content” with low opacity for those.
                </p>
              )}
              <PageRangeField id="wm-range" value={rangeText} onChange={setRangeText} error={range.error} />
            </OptionsPanel>

            {doc.pdfjs && (
              <div className="space-y-2">
                <PageNav page={page} pageCount={doc.pageCount} onChange={setPreviewPage} />
                <PageViewer doc={doc.pdfjs} pageNumber={page} maxWidth={520}>
                  {(g) => {
                    if (!onThisPage) return null;
                    const W = g.width / g.scale;
                    const H = g.height / g.scale;
                    if (kind === "text") {
                      if (!metrics || !shownText) return null;
                      const shownSize = autoSize
                        ? fitTextSize(metrics, shownText, angle, W, H, layout === "tiled")
                        : size;
                      const w = metrics.widthOfTextAtSize(shownText, shownSize);
                      const h = metrics.heightAtSize(shownSize, { descender: false });
                      const items = centeredPlacements(W, H, w, h, angle, layout === "tiled").map((p) => ({
                        text: shownText,
                        u: p.u,
                        v: p.v,
                        anchor: "start" as const,
                        angle,
                      }));
                      return (
                        <div className="absolute inset-0 overflow-hidden">
                          <TextPreviewOverlay
                            width={g.width}
                            height={g.height}
                            scale={g.scale}
                            font={font}
                            size={shownSize}
                            color={color}
                            opacity={opacity}
                            items={items}
                          />
                        </div>
                      );
                    }
                    if (!image) return null;
                    const w = W * scale;
                    const h = (w * image.height) / image.width;
                    return (
                      <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        {imagePlacements(W, H, w, h, position).map((p, i) => (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            key={i}
                            src={image.url}
                            alt=""
                            className="absolute max-w-none"
                            style={{
                              left: p.u * g.scale,
                              top: (H - p.v - h) * g.scale,
                              width: w * g.scale,
                              height: h * g.scale,
                              opacity,
                            }}
                          />
                        ))}
                      </div>
                    );
                  }}
                </PageViewer>
                {!onThisPage && <p className="text-[11px] text-slate-500 text-center">This page isn&apos;t in the page range.</p>}
              </div>
            )}
            <Notice>
              The watermark is tagged as a watermark inside the PDF (the way Acrobat does it), so it can be removed
              again later with Remove Watermark.
            </Notice>
          </>
        );
      }}
      run={async ({ file, bytes, pageCount, onProgress, signal }) => {
        const pages = parsePageList(rangeText, pageCount).pages;
        const r = await addWatermark(
          bytes,
          {
            layer,
            pages,
            mark:
              kind === "text"
                ? { kind: "text", text, font, size: autoSize ? "auto" : size, color, opacity, angle, layout }
                : { kind: "image", bytes: image!.bytes, mime: image!.mime, scale, opacity, position },
          },
          onProgress,
          signal
        );
        return {
          kind: "file",
          data: r.bytes,
          fileName: outputName(file, "watermarked"),
          title: "Watermark added",
          summary: `Watermarked ${r.pages} page${r.pages === 1 ? "" : "s"}${layer === "under" ? ", behind the content" : ""}.${
            r.replacedChars ? " Some characters the standard font can't draw were replaced with “?”." : ""
          }`,
        };
      }}
    />
  );
}
