"use client";

import { useState } from "react";

import { SegmentedControl } from "@/features/pdf/components/shared/SegmentedControl";

import { SimplePdfTool } from "../core/SimplePdfTool";
import { PageViewer } from "../core/PageViewer";
import { outputName } from "../core/pdf-io";
import { ColorInput, Field, Notice, NumberInput, OptionsPanel, Select, TextInput } from "../core/ui";
import { FONT_CHOICES, type FontChoice } from "./ops/page-draw";
import { addPageNumbers, formatTemplate, numberedPages, slotAnchor, type HAlign, type VAlign } from "./ops/stamp-text";
import { PageNav, PageRangeField, TextPreviewOverlay, parsePageList } from "./components/shared";

type FormatId = "n" | "page-n" | "n-of" | "page-n-of" | "custom";

const FORMATS: { value: FormatId; label: string; template: string }[] = [
  { value: "n", label: "1", template: "{page}" },
  { value: "page-n", label: "Page 1", template: "Page {page}" },
  { value: "n-of", label: "1 / N", template: "{page} / {total}" },
  { value: "page-n-of", label: "Page 1 of N", template: "Page {page} of {total}" },
  { value: "custom", label: "Custom", template: "" },
];

const POSITIONS: { v: VAlign; h: HAlign; label: string }[] = [
  { v: "top", h: "left", label: "Top left" },
  { v: "top", h: "center", label: "Top center" },
  { v: "top", h: "right", label: "Top right" },
  { v: "bottom", h: "left", label: "Bottom left" },
  { v: "bottom", h: "center", label: "Bottom center" },
  { v: "bottom", h: "right", label: "Bottom right" },
];

export default function PageNumbers() {
  const [valign, setValign] = useState<VAlign>("bottom");
  const [halign, setHalign] = useState<HAlign>("center");
  const [format, setFormat] = useState<FormatId>("n");
  const [custom, setCustom] = useState("{page} of {total}");
  const [start, setStart] = useState(1);
  const [skip, setSkip] = useState(0);
  const [font, setFont] = useState<FontChoice>("Helvetica");
  const [size, setSize] = useState(11);
  const [color, setColor] = useState("#1e293b");
  const [margin, setMargin] = useState(28);
  const [previewPage, setPreviewPage] = useState(1);
  const [rangeText, setRangeText] = useState("");

  const template = format === "custom" ? custom : FORMATS.find((f) => f.value === format)!.template;
  const makeOpts = (pageCount: number) => ({
    font,
    size,
    color,
    valign,
    halign,
    template,
    startNumber: Math.round(start),
    skipFirst: Math.max(0, Math.round(skip)),
    pages: parsePageList(rangeText, pageCount).pages,
    margin,
  });

  return (
    <SimplePdfTool
      actionLabel="Add page numbers"
      processingMessage="Numbering pages…"
      preview
      onReset={() => setPreviewPage(1)}
      validate={(doc) => {
        const rangeError = parsePageList(rangeText, doc.pageCount).error;
        if (rangeError) return rangeError;
        if (!template.trim()) return "Type a number format.";
        if (!/\{page\}/.test(template)) return "The format needs {page} somewhere.";
        if (!numberedPages(doc.pageCount, makeOpts(doc.pageCount)).length) return "No pages left to number with these settings.";
        return null;
      }}
      options={(doc) => {
        const opts = makeOpts(doc.pageCount);
        const plan = numberedPages(doc.pageCount, opts);
        const total = opts.startNumber + plan.length - 1;
        const current = plan.find((p) => p.page === previewPage);
        const shownPage = Math.min(previewPage, doc.pageCount);
        return (
          <>
            <OptionsPanel>
              <Field label="Position">
                <div className="grid grid-cols-3 gap-1 max-w-xs" role="group" aria-label="Position">
                  {POSITIONS.map((p) => {
                    const on = p.v === valign && p.h === halign;
                    return (
                      <button
                        key={p.label}
                        type="button"
                        aria-pressed={on}
                        onClick={() => {
                          setValign(p.v);
                          setHalign(p.h);
                        }}
                        className={`px-2 py-1.5 text-[11px] rounded border transition-colors ${
                          on
                            ? "bg-slate-900 text-white border-slate-900"
                            : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                        }`}
                      >
                        {p.label}
                      </button>
                    );
                  })}
                </div>
              </Field>
              <SegmentedControl
                label="Format"
                size="sm"
                options={FORMATS.map((f) => ({ value: f.value, label: f.label }))}
                value={format}
                onChange={setFormat}
              />
              {format === "custom" && (
                <Field label="Custom format" htmlFor="pn-custom" hint="Use {page} for the number and {total} for the last number.">
                  <TextInput id="pn-custom" value={custom} onChange={(e) => setCustom(e.target.value)} />
                </Field>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="First number" htmlFor="pn-start">
                  <NumberInput id="pn-start" value={start} onChange={setStart} min={0} step={1} />
                </Field>
                <Field label="Skip first pages" htmlFor="pn-skip" hint="e.g. 1 to leave a cover page unnumbered">
                  <NumberInput id="pn-skip" value={skip} onChange={setSkip} min={0} max={doc.pageCount} step={1} />
                </Field>
              </div>
              <PageRangeField
                id="pn-range"
                label="Pages to number"
                value={rangeText}
                onChange={setRangeText}
                error={parsePageList(rangeText, doc.pageCount).error}
              />
              <p className="text-[11px] text-slate-500 -mt-2">
                {plan.length
                  ? `Pages ${plan[0].page}–${plan[plan.length - 1].page} get numbers ${plan[0].number}–${total}${
                      plan.length !== plan[plan.length - 1].page - plan[0].page + 1 ? ` (${plan.length} pages)` : ""
                    }.`
                  : "No pages selected."}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-100">
                <Field label="Font" htmlFor="pn-font">
                  <Select id="pn-font" value={font} onChange={setFont} options={FONT_CHOICES} />
                </Field>
                <Field label="Size" htmlFor="pn-size">
                  <NumberInput id="pn-size" value={size} onChange={(v) => setSize(Math.min(72, Math.max(4, v)))} min={4} max={72} suffix="pt" />
                </Field>
                <Field label="Color" htmlFor="pn-color">
                  <ColorInput id="pn-color" value={color} onChange={setColor} />
                </Field>
                <Field label="Margin" htmlFor="pn-margin" hint="Distance from the page edge">
                  <NumberInput id="pn-margin" value={margin} onChange={(v) => setMargin(Math.min(200, Math.max(0, v)))} min={0} max={200} suffix="pt" />
                </Field>
              </div>
            </OptionsPanel>

            {doc.pdfjs && (
              <div className="space-y-2">
                <PageNav page={shownPage} pageCount={doc.pageCount} onChange={setPreviewPage} />
                <PageViewer doc={doc.pdfjs} pageNumber={shownPage} maxWidth={520}>
                  {(g) => {
                    if (!current) return null;
                    const W = g.width / g.scale;
                    const H = g.height / g.scale;
                    const a = slotAnchor(W, H, valign, halign, size, margin, margin);
                    return (
                      <TextPreviewOverlay
                        width={g.width}
                        height={g.height}
                        scale={g.scale}
                        font={font}
                        size={size}
                        color={color}
                        items={[
                          {
                            text: formatTemplate(template, { page: current.number, total }),
                            u: a.u,
                            v: a.v,
                            anchor: halign === "left" ? "start" : halign === "right" ? "end" : "middle",
                          },
                        ]}
                      />
                    );
                  }}
                </PageViewer>
                {!current && <p className="text-[11px] text-slate-500 text-center">This page won&apos;t get a number.</p>}
              </div>
            )}
            <Notice>
              Numbers are placed on the page as you see it, upright, even on rotated or cropped pages. Standard fonts
              cover Latin characters only; anything else is replaced with “?”.
            </Notice>
          </>
        );
      }}
      run={async ({ file, bytes, pageCount, onProgress, signal }) => {
        const r = await addPageNumbers(bytes, makeOpts(pageCount), onProgress, signal);
        return {
          kind: "file",
          data: r.bytes,
          fileName: outputName(file, "numbered"),
          title: "Page numbers added",
          summary: `${r.stamped} page${r.stamped === 1 ? "" : "s"} numbered.${
            r.replacedChars ? " Some characters the standard font can't draw were replaced with “?”." : ""
          }`,
        };
      }}
    />
  );
}
