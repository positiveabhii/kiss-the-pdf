"use client";

import { useEffect, useRef, useState } from "react";

import { SegmentedControl } from "@/features/pdf/components/shared/SegmentedControl";

import { SimplePdfTool } from "../core/SimplePdfTool";
import { PageViewer, type PageGeometry } from "../core/PageViewer";
import { outputName } from "../core/pdf-io";
import { ColorInput, Field, Notice, NumberInput, OptionsPanel, Select, TextArea } from "../core/ui";
import { PageNav, PageRangeField, parsePageList } from "../enhancement/components/shared";
import { addQrCode, contrastOk, placeSquare, qrColor, type QrLevel, type QrPlacement } from "./ops/qr";
import { capturePointer } from "../core/pointer";

type Scope = "this" | "all" | "range";

interface QrImage {
  key: string;
  dataUrl: string;
  png: Uint8Array;
  modules: number;
}

function dataUrlToBytes(url: string): Uint8Array {
  const b64 = url.slice(url.indexOf(",") + 1);
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

const LEVELS: { value: QrLevel; label: string }[] = [
  { value: "L", label: "Low (7%)" },
  { value: "M", label: "Medium (15%)" },
  { value: "Q", label: "Quartile (25%)" },
  { value: "H", label: "High (30%)" },
];

/** Draggable square on the page preview; positions are fractions of the visible page. */
function Placer({
  g,
  placement,
  onChange,
  image,
}: {
  g: PageGeometry;
  placement: QrPlacement;
  onChange: (p: QrPlacement) => void;
  image: string | null;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const drag = useRef<{ dx: number; dy: number } | null>(null);
  const W = g.width / g.scale;
  const H = g.height / g.scale;
  const sq = placeSquare(W, H, placement);
  const left = sq.u * g.scale;
  const top = (H - sq.v - sq.size) * g.scale;
  const side = sq.size * g.scale;

  const moveTo = (clientX: number, clientY: number, dx: number, dy: number) => {
    const r = ref.current!.getBoundingClientRect();
    const x = clientX - r.left - dx;
    const y = clientY - r.top - dy;
    onChange({
      ...placement,
      left: Math.min(Math.max(0, x / g.width), 1 - side / g.width),
      top: Math.min(Math.max(0, y / g.height), 1 - side / g.height),
    });
  };

  return (
    <div
      ref={ref}
      className="absolute inset-0 touch-none"
      onPointerDown={(e) => {
        // Click on empty page area: centre the code there and start dragging.
        capturePointer(e.currentTarget, e.pointerId);
        drag.current = { dx: side / 2, dy: side / 2 };
        moveTo(e.clientX, e.clientY, side / 2, side / 2);
      }}
      onPointerMove={(e) => drag.current && moveTo(e.clientX, e.clientY, drag.current.dx, drag.current.dy)}
      onPointerUp={() => (drag.current = null)}
      onPointerCancel={() => (drag.current = null)}
    >
      <div
        className="absolute cursor-move ring-2 ring-blue-500 ring-offset-1 bg-white/40"
        style={{ left, top, width: side, height: side }}
        onPointerDown={(e) => {
          e.stopPropagation();
          capturePointer(ref.current, e.pointerId);
          const r = e.currentTarget.getBoundingClientRect();
          drag.current = { dx: e.clientX - r.left, dy: e.clientY - r.top };
        }}
      >
        {image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={image} alt="QR code preview" className="w-full h-full pointer-events-none" style={{ imageRendering: "pixelated" }} draggable={false} />
        )}
      </div>
    </div>
  );
}

export default function AddQrCode() {
  const [content, setContent] = useState("https://");
  const [size, setSize] = useState(96);
  const [level, setLevel] = useState<QrLevel>("M");
  const [dark, setDark] = useState("#000000");
  const [light, setLight] = useState("#ffffff");
  const [margin, setMargin] = useState(2);
  const [scope, setScope] = useState<Scope>("this");
  const [rangeText, setRangeText] = useState("");
  const [page, setPage] = useState(1);
  const [pos, setPos] = useState<{ left: number; top: number }>({ left: 0.78, top: 0.04 });
  const [qr, setQr] = useState<QrImage | null>(null);
  const [qrError, setQrError] = useState<{ key: string; message: string } | null>(null);

  const text = content.trim();
  const valid = text !== "" && text !== "https://" && text !== "http://";
  const key = `${text}|${level}|${dark}|${light}|${margin}`;

  useEffect(() => {
    if (!valid) return;
    let alive = true;
    void import("qrcode").then(async (QR) => {
      try {
        const modules = QR.create(text, { errorCorrectionLevel: level }).modules.size;
        // ~10 px per module keeps the code crisp when printed at a few inches.
        const scale = Math.max(4, Math.ceil(600 / (modules + 2 * margin)));
        const dataUrl = await QR.toDataURL(text, {
          errorCorrectionLevel: level,
          margin,
          scale,
          color: { dark: qrColor(dark), light: qrColor(light) },
        });
        if (alive) setQr({ key, dataUrl, png: dataUrlToBytes(dataUrl), modules });
      } catch (e) {
        if (alive)
          setQrError({
            key,
            message: /too big|amount of data/i.test(String(e))
              ? "That's too much text for a QR code. Shorten it or lower the error correction."
              : "Couldn't make a QR code from this text.",
          });
      }
    });
    return () => {
      alive = false;
    };
  }, [valid, text, level, dark, light, margin, key]);

  const current = qr && qr.key === key ? qr : null;
  const error = qrError && qrError.key === key ? qrError.message : null;
  const placement: QrPlacement = { ...pos, size };

  const pagesFor = (pageCount: number): number[] =>
    scope === "this" ? [Math.min(page, pageCount)] : scope === "all" ? Array.from({ length: pageCount }, (_, i) => i + 1) : parsePageList(rangeText, pageCount).pages;

  return (
    <SimplePdfTool
      actionLabel="Add QR code"
      processingMessage="Adding QR code…"
      preview
      onReset={() => setPage(1)}
      validate={(doc) => {
        if (!valid) return "Type the link or text for the QR code.";
        if (error) return error;
        if (!current) return "Making the QR code…";
        if (scope === "range") {
          const r = parsePageList(rangeText, doc.pageCount);
          if (r.error) return r.error;
          if (!r.pages.length) return "Type the pages to add it to.";
        }
        return null;
      }}
      options={(doc) => {
        const shown = Math.min(page, doc.pageCount);
        const targets = pagesFor(doc.pageCount);
        const onThis = targets.includes(shown);
        return (
          <>
            <OptionsPanel>
              <Field label="Link or text" htmlFor="qr-text" hint={current ? `${text.length} characters · ${current.modules}×${current.modules} modules` : undefined}>
                <TextArea id="qr-text" value={content} onChange={(e) => setContent(e.target.value)} rows={2} className="min-h-[60px]" />
              </Field>
              {error && <Notice tone="error">{error}</Notice>}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Size" htmlFor="qr-size" hint={`${(size / 72 * 2.54).toFixed(1)} cm wide`}>
                  <NumberInput id="qr-size" value={size} onChange={(v) => setSize(Math.min(600, Math.max(24, v)))} min={24} max={600} suffix="pt" />
                </Field>
                <Field label="Error correction" htmlFor="qr-level" hint="Higher survives damage or a logo, but makes a denser code.">
                  <Select id="qr-level" value={level} onChange={setLevel} options={LEVELS} />
                </Field>
                <Field label="Code color" htmlFor="qr-dark">
                  <ColorInput id="qr-dark" value={dark} onChange={setDark} />
                </Field>
                <Field label="Background" htmlFor="qr-light">
                  <ColorInput id="qr-light" value={light} onChange={setLight} />
                </Field>
                <Field label="Quiet zone" htmlFor="qr-margin" hint="Blank border, in modules. 2–4 scans best.">
                  <NumberInput id="qr-margin" value={margin} onChange={(v) => setMargin(Math.min(10, Math.max(0, Math.round(v))))} min={0} max={10} />
                </Field>
              </div>
              {!contrastOk(dark, light) && (
                <Notice tone="warning">The code needs to be clearly darker than its background, or phones may not scan it.</Notice>
              )}
              <SegmentedControl
                label="Add to"
                size="sm"
                options={[
                  { value: "this", label: `This page (${shown})` },
                  { value: "all", label: "All pages" },
                  { value: "range", label: "Pages…" },
                ]}
                value={scope}
                onChange={setScope}
              />
              {scope === "range" && (
                <PageRangeField
                  id="qr-range"
                  value={rangeText}
                  onChange={setRangeText}
                  error={parsePageList(rangeText, doc.pageCount).error}
                  hint="Example: 1-3, 5, 8-"
                />
              )}
            </OptionsPanel>
            {doc.pdfjs && (
              <div className="space-y-2">
                <PageNav page={shown} pageCount={doc.pageCount} onChange={setPage} label="Drag the code into place" />
                <PageViewer doc={doc.pdfjs} pageNumber={shown} maxWidth={520}>
                  {(g) => <Placer g={g} placement={placement} onChange={(p) => setPos({ left: p.left, top: p.top })} image={current?.dataUrl ?? null} />}
                </PageViewer>
                {!onThis && <p className="text-[11px] text-slate-500 text-center">This page isn&apos;t one of the pages it will be added to.</p>}
              </div>
            )}
            <Notice>
              The position is kept relative to each page, so on other pages it lands in the same spot as seen. Test the
              code with your phone before sharing.
            </Notice>
          </>
        );
      }}
      run={async ({ file, bytes, pageCount }) => {
        const pages = pagesFor(pageCount);
        const out = await addQrCode(bytes, { png: current!.png, placement, pages });
        return {
          kind: "file",
          data: out,
          fileName: outputName(file, "qr"),
          title: "QR code added",
          summary: `Added to ${pages.length} page${pages.length === 1 ? "" : "s"}.`,
        };
      }}
    />
  );
}
