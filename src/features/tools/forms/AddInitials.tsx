"use client";

import { useCallback, useState } from "react";

import { SegmentedControl } from "@/features/pdf/components/shared/SegmentedControl";

import { PageViewer } from "../core/PageViewer";
import { SimplePdfTool } from "../core/SimplePdfTool";
import { hexToRgb01, outputName } from "../core/pdf-io";
import { Checkbox, Field, NumberInput, OptionsPanel, RangeInput, TextInput } from "../core/ui";
import { PageNav } from "./components/BoxOverlay";
import { PageTargets, resolveTargets, type Targets } from "./components/PageTargets";
import { SignaturePad } from "./components/SignaturePad";
import { InkPicker } from "./components/SignatureSources";
import type { SignatureImage } from "./components/signature-image";
import { clampToPage, cornerRect, type Corner } from "./ops/geometry";
import { cornerPlacements, stampImage, stampTextInCorner, type InitialsFont } from "./ops/stamp";

const CORNERS: { value: Corner; label: string }[] = [
  { value: "top-left", label: "Top left" },
  { value: "top-right", label: "Top right" },
  { value: "bottom-left", label: "Bottom left" },
  { value: "bottom-right", label: "Bottom right" },
];

const FONTS: { value: InitialsFont; label: string; css: string }[] = [
  { value: "times-italic", label: "Serif italic", css: "italic bold {s}px 'Times New Roman', Times, serif" },
  { value: "helvetica-bold", label: "Sans bold", css: "bold {s}px Helvetica, Arial, sans-serif" },
  { value: "courier", label: "Mono", css: "bold {s}px 'Courier New', Courier, monospace" },
];

/** Same box width formula as ops/stamp textBoxWidth, measured with the browser's equivalent font. */
function previewTextWidth(text: string, font: InitialsFont, height: number): number {
  const c = document.createElement("canvas").getContext("2d");
  const size = height * 0.62;
  if (!c) return text.length * size * 0.6 + height * 0.5;
  c.font = FONTS.find((f) => f.value === font)!.css.replace("{s}", String(size));
  return c.measureText(text).width + height * 0.5;
}

export default function AddInitials() {
  const [mode, setMode] = useState<"type" | "draw">("type");
  const [text, setText] = useState("");
  const [font, setFont] = useState<InitialsFont>("times-italic");
  const [color, setColor] = useState("#0b2a6f");
  const [img, setImgState] = useState<SignatureImage | null>(null);
  const [corner, setCorner] = useState<Corner>("bottom-right");
  const [margin, setMargin] = useState(28);
  const [height, setHeight] = useState(24);
  const [border, setBorder] = useState(false);
  const [targets, setTargets] = useState<Targets>({ scope: "all", range: "" });
  const [page, setPage] = useState(1);

  const setImg = useCallback((next: SignatureImage | null) => {
    setImgState((prev) => {
      if (prev && prev !== next) URL.revokeObjectURL(prev.url);
      return next;
    });
  }, []);

  const ready = mode === "type" ? text.trim().length > 0 : !!img;

  return (
    <SimplePdfTool
      preview
      actionLabel="Add initials"
      processingMessage="Adding initials…"
      onReset={() => setPage(1)}
      validate={(doc) => {
        if (!ready) return mode === "type" ? "Enter your initials." : "Draw your initials.";
        return resolveTargets(targets, page, doc.pageCount).error;
      }}
      options={(doc) => {
        const boxW =
          mode === "type"
            ? text.trim()
              ? previewTextWidth(text.trim(), font, height)
              : height * 1.5
            : img
              ? (height * img.width) / img.height
              : height * 1.5;
        const fontCss = FONTS.find((f) => f.value === font)!.css;
        return (
          <>
            <OptionsPanel title="Initials">
              <SegmentedControl
                options={[
                  { value: "type", label: "Type" },
                  { value: "draw", label: "Draw" },
                ]}
                value={mode}
                onChange={setMode}
              />
              {mode === "type" ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Initials" htmlFor="ini-text">
                    <TextInput
                      id="ini-text"
                      value={text}
                      maxLength={8}
                      onChange={(e) => setText(e.target.value)}
                      placeholder="J.D."
                    />
                  </Field>
                  <Field label="Style">
                    <SegmentedControl options={FONTS} value={font} onChange={setFont} size="sm" />
                  </Field>
                </div>
              ) : (
                <div className="max-w-sm">
                  <SignaturePad
                    color={color}
                    thickness={4}
                    onImage={setImg}
                    width={300}
                    height={150}
                    placeholder="Draw initials"
                  />
                </div>
              )}
              <Field label="Ink">
                <InkPicker value={color} onChange={setColor} />
              </Field>
            </OptionsPanel>

            <OptionsPanel title="Position">
              <SegmentedControl label="Corner" options={CORNERS} value={corner} onChange={setCorner} />
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Distance from edges">
                  <NumberInput value={margin} onChange={setMargin} min={0} max={200} step={2} suffix="pt" />
                </Field>
                <Field label="Height">
                  <RangeInput value={height} onChange={setHeight} min={12} max={72} format={(v) => `${v} pt`} />
                </Field>
              </div>
              {mode === "type" && (
                <Checkbox id="ini-border" checked={border} onChange={setBorder} label="Draw a box around them" />
              )}
              <PageTargets value={targets} onChange={setTargets} pageCount={doc.pageCount} current={page} />
            </OptionsPanel>

            {doc.pdfjs && (
              <div className="space-y-2">
                <PageNav page={page} count={doc.pageCount} onChange={setPage} />
                <PageViewer doc={doc.pdfjs} pageNumber={page} maxWidth={640}>
                  {(geom) => {
                    const pw = geom.width / geom.scale;
                    const ph = geom.height / geom.scale;
                    const r = clampToPage({ width: pw, height: ph }, cornerRect({ width: pw, height: ph }, corner, margin, boxW, height));
                    const onThisPage = resolveTargets(targets, page, doc.pageCount).indices.includes(page - 1);
                    const s = geom.scale;
                    return (
                      <div
                        className={`absolute flex items-center justify-center ${onThisPage ? "" : "opacity-30"} ${
                          border && mode === "type" ? "border" : "outline outline-1 outline-dashed outline-blue-400"
                        }`}
                        style={{
                          left: r.x * s,
                          top: r.y * s,
                          width: r.width * s,
                          height: r.height * s,
                          borderColor: color,
                          color,
                          font: fontCss.replace("{s}", String(height * 0.62 * s)),
                          lineHeight: 1,
                        }}
                        title={onThisPage ? undefined : "Not added on this page"}
                      >
                        {mode === "type"
                          ? text.trim()
                          : img && (
                              // eslint-disable-next-line @next/next/no-img-element -- local blob URL
                              <img src={img.url} alt="" className="w-full h-full" />
                            )}
                      </div>
                    );
                  }}
                </PageViewer>
              </div>
            )}
          </>
        );
      }}
      run={async ({ file, bytes, pageCount }) => {
        const { indices, error } = resolveTargets(targets, page, pageCount);
        if (error) throw new Error(error);
        const result =
          mode === "type"
            ? await stampTextInCorner(bytes, {
                text,
                font,
                height,
                color: hexToRgb01(color),
                corner,
                margin,
                pageIndices: indices,
                border,
              })
            : await stampImage(bytes, img!.png, (pdf) =>
                cornerPlacements(pdf, indices, corner, margin, height, img!.width / img!.height)
              );
        return {
          kind: "file",
          data: result.data,
          fileName: outputName(file, "initialed"),
          title: "Initials added",
          summary: `Added to ${result.pages} page${result.pages === 1 ? "" : "s"}.`,
        };
      }}
    />
  );
}
