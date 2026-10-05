"use client";

import { useMemo, useState } from "react";

import { SimplePdfTool } from "../core/SimplePdfTool";
import { PageViewer } from "../core/PageViewer";
import { outputName } from "../core/pdf-io";
import { Checkbox, ColorInput, Field, Notice, NumberInput, OptionsPanel, Select, TextInput } from "../core/ui";
import { FONT_CHOICES, type FontChoice } from "./ops/page-draw";
import {
  addHeaderFooter,
  dividerV,
  formatTemplate,
  hasAnyText,
  slotAnchor,
  type HAlign,
  type VAlign,
} from "./ops/stamp-text";
import { PageNav, TextPreviewOverlay, type PreviewText } from "./components/shared";

type Slots = Record<HAlign, string>;
const EMPTY: Slots = { left: "", center: "", right: "" };
const ALIGNS: HAlign[] = ["left", "center", "right"];

function SlotRow({ prefix, label, value, onChange }: { prefix: string; label: string; value: Slots; onChange: (v: Slots) => void }) {
  return (
    <Field label={label}>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        {ALIGNS.map((a) => (
          <TextInput
            key={a}
            id={`${prefix}-${a}`}
            aria-label={`${label} ${a}`}
            placeholder={a[0].toUpperCase() + a.slice(1)}
            value={value[a]}
            onChange={(e) => onChange({ ...value, [a]: e.target.value })}
            className={a === "center" ? "text-center" : a === "right" ? "text-right" : ""}
          />
        ))}
      </div>
    </Field>
  );
}

export default function HeaderFooter() {
  const [header, setHeader] = useState<Slots>({ ...EMPTY, left: "{filename}", right: "{date}" });
  const [footer, setFooter] = useState<Slots>({ ...EMPTY, center: "Page {page} of {total}" });
  const [font, setFont] = useState<FontChoice>("Helvetica");
  const [size, setSize] = useState(9);
  const [color, setColor] = useState("#334155");
  const [marginX, setMarginX] = useState(36);
  const [marginY, setMarginY] = useState(24);
  const [divider, setDivider] = useState(false);
  const [skipFirst, setSkipFirst] = useState(false);
  const [previewPage, setPreviewPage] = useState(1);
  const date = useMemo(() => new Date().toLocaleDateString(), []);

  return (
    <SimplePdfTool
      actionLabel="Add header & footer"
      processingMessage="Adding header and footer…"
      preview
      onReset={() => setPreviewPage(1)}
      validate={() => (hasAnyText({ header, footer }) ? null : "Type some header or footer text.")}
      options={(doc) => {
        const page = Math.min(previewPage, doc.pageCount);
        const skipped = skipFirst && page === 1;
        const tokens = { page, total: doc.pageCount, date, filename: doc.file.name };
        return (
          <>
            <OptionsPanel>
              <SlotRow prefix="hf-h" label="Header" value={header} onChange={setHeader} />
              <SlotRow prefix="hf-f" label="Footer" value={footer} onChange={setFooter} />
              <p className="text-[11px] text-slate-500 -mt-2">
                Tokens: <code>{"{page}"}</code> <code>{"{total}"}</code> <code>{"{date}"}</code> ({date}){" "}
                <code>{"{filename}"}</code>
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-100">
                <Field label="Font" htmlFor="hf-font">
                  <Select id="hf-font" value={font} onChange={setFont} options={FONT_CHOICES} />
                </Field>
                <Field label="Size" htmlFor="hf-size">
                  <NumberInput id="hf-size" value={size} onChange={(v) => setSize(Math.min(48, Math.max(4, v)))} min={4} max={48} suffix="pt" />
                </Field>
                <Field label="Color" htmlFor="hf-color">
                  <ColorInput id="hf-color" value={color} onChange={setColor} />
                </Field>
                <div />
                <Field label="Side margin" htmlFor="hf-mx">
                  <NumberInput id="hf-mx" value={marginX} onChange={(v) => setMarginX(Math.min(200, Math.max(0, v)))} min={0} max={200} suffix="pt" />
                </Field>
                <Field label="Top / bottom margin" htmlFor="hf-my">
                  <NumberInput id="hf-my" value={marginY} onChange={(v) => setMarginY(Math.min(200, Math.max(0, v)))} min={0} max={200} suffix="pt" />
                </Field>
              </div>
              <div className="flex flex-wrap gap-x-6 gap-y-2">
                <Checkbox id="hf-div" checked={divider} onChange={setDivider} label="Divider line" />
                <Checkbox id="hf-skip" checked={skipFirst} onChange={setSkipFirst} label="Skip the first page" />
              </div>
            </OptionsPanel>

            {doc.pdfjs && (
              <div className="space-y-2">
                <PageNav page={page} pageCount={doc.pageCount} onChange={setPreviewPage} />
                <PageViewer doc={doc.pdfjs} pageNumber={page} maxWidth={520}>
                  {(g) => {
                    if (skipped) return null;
                    const W = g.width / g.scale;
                    const H = g.height / g.scale;
                    const items: PreviewText[] = [];
                    const lines: { u0: number; u1: number; v: number }[] = [];
                    for (const [valign, slots] of [
                      ["top", header],
                      ["bottom", footer],
                    ] as [VAlign, Slots][]) {
                      let any = false;
                      for (const h of ALIGNS) {
                        if (!slots[h].trim()) continue;
                        any = true;
                        const a = slotAnchor(W, H, valign, h, size, marginX, marginY);
                        items.push({
                          text: formatTemplate(slots[h], tokens),
                          u: a.u,
                          v: a.v,
                          anchor: h === "left" ? "start" : h === "right" ? "end" : "middle",
                        });
                      }
                      if (any && divider) lines.push({ u0: marginX, u1: W - marginX, v: dividerV(H, valign, size, marginY) });
                    }
                    return (
                      <TextPreviewOverlay
                        width={g.width}
                        height={g.height}
                        scale={g.scale}
                        font={font}
                        size={size}
                        color={color}
                        items={items}
                        lines={lines}
                      />
                    );
                  }}
                </PageViewer>
                {skipped && <p className="text-[11px] text-slate-500 text-center">The first page is skipped.</p>}
              </div>
            )}
            <Notice>
              Placed on each page as you see it, upright, even on rotated or cropped pages. Standard fonts cover Latin
              characters only; anything else is replaced with “?”.
            </Notice>
          </>
        );
      }}
      run={async ({ file, bytes, onProgress, signal }) => {
        const r = await addHeaderFooter(
          bytes,
          { font, size, color, header, footer, marginX, marginY, divider, skipFirstPage: skipFirst, date, filename: file.name },
          onProgress,
          signal
        );
        return {
          kind: "file",
          data: r.bytes,
          fileName: outputName(file, "header-footer"),
          title: "Header & footer added",
          summary: `Added to ${r.stamped} page${r.stamped === 1 ? "" : "s"}.${
            r.replacedChars ? " Some characters the standard font can't draw were replaced with “?”." : ""
          }`,
        };
      }}
    />
  );
}
