"use client";

import { AlignCenter, AlignLeft, AlignRight, BringToFront, Copy, SendToBack, Trash2 } from "lucide-react";

import { Checkbox, Field, Notice, RangeInput, Select } from "../../core/ui";
import type { FontFamily, TextAlign } from "../model";

/**
 * Style controls for the selected object — or, with nothing selected, for
 * the next object the current tool creates. `kind` is the object type (or
 * "sticky"/"comment" for notes); `value` its current props.
 */

type Values = Record<string, unknown>;

const FONT_OPTIONS: { value: FontFamily; label: string }[] = [
  { value: "Helvetica", label: "Helvetica (sans-serif)" },
  { value: "Times", label: "Times (serif)" },
  { value: "Courier", label: "Courier (monospace)" },
];

function ColorRow({
  id,
  label,
  value,
  onChange,
  allowNone,
}: {
  id: string;
  label: string;
  value: string | null;
  onChange: (v: string | null) => void;
  allowNone?: boolean;
}) {
  const none = value === null;
  return (
    <Field label={label} htmlFor={id}>
      <div className="flex items-center gap-2">
        <input
          id={id}
          type="color"
          value={value ?? "#000000"}
          disabled={none}
          onChange={(e) => onChange(e.target.value)}
          className="h-8 w-11 p-0.5 bg-white border border-slate-200 rounded-md cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
        />
        {allowNone ? (
          <Checkbox id={`${id}-none`} label="None" checked={none} onChange={(v) => onChange(v ? null : "#000000")} />
        ) : (
          <span className="text-xs font-mono text-slate-500">{value}</span>
        )}
      </div>
    </Field>
  );
}

const iconBtn = (active: boolean) =>
  `inline-flex h-8 w-8 items-center justify-center rounded-md border text-xs font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 ${
    active ? "border-slate-900 bg-slate-900 text-white" : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
  }`;

export function PropertiesPanel({
  kind,
  value,
  onChange,
  selected,
  onDelete,
  onDuplicate,
  onFront,
  onBack,
  unsupportedChars,
}: {
  kind: string;
  value: Values;
  onChange: (patch: Values) => void;
  /** True when editing a placed object (shows object actions). */
  selected: boolean;
  onDelete?: () => void;
  onDuplicate?: () => void;
  onFront?: () => void;
  onBack?: () => void;
  unsupportedChars?: string[];
}) {
  const num = (k: string, d: number) => (typeof value[k] === "number" ? (value[k] as number) : d);
  const str = (k: string) => (typeof value[k] === "string" ? (value[k] as string) : null);
  const opacity = (
    <Field label="Opacity" htmlFor="ed-opacity">
      <RangeInput
        id="ed-opacity"
        min={0.05}
        max={1}
        step={0.05}
        value={num("opacity", 1)}
        onChange={(v) => onChange({ opacity: v })}
        format={(v) => `${Math.round(v * 100)}%`}
      />
    </Field>
  );
  const strokeWidth = (label = "Stroke width") => (
    <Field label={label} htmlFor="ed-sw">
      <RangeInput
        id="ed-sw"
        min={0.5}
        max={24}
        step={0.5}
        value={num("strokeWidth", 2)}
        onChange={(v) => onChange({ strokeWidth: v })}
        format={(v) => `${v} pt`}
      />
    </Field>
  );

  let body: React.ReactNode = null;
  switch (kind) {
    case "text":
      body = (
        <>
          <Field label="Font" htmlFor="ed-font">
            <Select id="ed-font" value={(str("font") ?? "Helvetica") as FontFamily} onChange={(v) => onChange({ font: v })} options={FONT_OPTIONS} />
          </Field>
          <div className="flex flex-wrap items-end gap-3">
            <Field label="Size" htmlFor="ed-size">
              <input
                id="ed-size"
                type="number"
                min={4}
                max={400}
                step={1}
                value={num("size", 16)}
                onChange={(e) => {
                  const v = parseFloat(e.target.value);
                  if (Number.isFinite(v) && v >= 1) onChange({ size: Math.min(400, v) });
                }}
                className="w-20 px-2 py-1.5 text-sm font-mono text-slate-900 bg-white border border-slate-200 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
              />
            </Field>
            <div className="flex gap-1" role="group" aria-label="Style">
              <button type="button" aria-pressed={!!value.bold} aria-label="Bold" title="Bold" onClick={() => onChange({ bold: !value.bold })} className={iconBtn(!!value.bold)}>
                B
              </button>
              <button type="button" aria-pressed={!!value.italic} aria-label="Italic" title="Italic" onClick={() => onChange({ italic: !value.italic })} className={`${iconBtn(!!value.italic)} italic font-serif`}>
                I
              </button>
            </div>
            <div className="flex gap-1" role="group" aria-label="Alignment">
              {(
                [
                  ["left", AlignLeft],
                  ["center", AlignCenter],
                  ["right", AlignRight],
                ] as const
              ).map(([a, Icon]) => (
                <button
                  key={a}
                  type="button"
                  aria-pressed={value.align === a}
                  aria-label={`Align ${a}`}
                  title={`Align ${a}`}
                  onClick={() => onChange({ align: a as TextAlign })}
                  className={iconBtn(value.align === a)}
                >
                  <Icon size={14} aria-hidden="true" />
                </button>
              ))}
            </div>
          </div>
          <ColorRow id="ed-color" label="Color" value={str("color")} onChange={(v) => onChange({ color: v })} />
          {opacity}
          {unsupportedChars && unsupportedChars.length > 0 && (
            <Notice tone="warning">
              These characters aren&apos;t in the standard PDF fonts and will be saved as &quot;?&quot;: {unsupportedChars.join(" ")}
            </Notice>
          )}
          <p className="text-[11px] text-slate-500">Double-click the text to edit it. Drag a corner to resize.</p>
        </>
      );
      break;
    case "rect":
    case "ellipse":
    case "polygon":
      body = (
        <>
          <ColorRow id="ed-stroke" label="Stroke" value={str("stroke")} onChange={(v) => onChange({ stroke: v })} allowNone />
          <ColorRow id="ed-fill" label="Fill" value={str("fill")} onChange={(v) => onChange({ fill: v })} allowNone />
          {strokeWidth()}
          {opacity}
        </>
      );
      break;
    case "line":
    case "arrow":
    case "ink":
      body = (
        <>
          <ColorRow id="ed-stroke" label="Color" value={str("stroke")} onChange={(v) => onChange({ stroke: v ?? "#000000" })} />
          {strokeWidth(kind === "ink" ? "Pen width" : "Line width")}
          {opacity}
        </>
      );
      break;
    case "whiteout":
      body = (
        <>
          <ColorRow id="ed-fill" label="Cover color" value={str("fill")} onChange={(v) => onChange({ fill: v ?? "#ffffff" })} />
          <WhiteoutNotice />
        </>
      );
      break;
    case "highlight":
      body = (
        <>
          <ColorRow id="ed-color" label="Highlight color" value={str("color")} onChange={(v) => onChange({ color: v ?? "#facc15" })} />
          {opacity}
          {!selected && <p className="text-[11px] text-slate-500">Drag across text. On scanned pages without text, the dragged box is highlighted.</p>}
        </>
      );
      break;
    case "underline":
    case "strikeout":
      body = (
        <>
          <ColorRow id="ed-color" label="Color" value={str("color")} onChange={(v) => onChange({ color: v ?? "#dc2626" })} />
          {selected && (
            <Field label="Thickness" htmlFor="ed-th">
              <RangeInput id="ed-th" min={0.5} max={6} step={0.25} value={num("thickness", 1)} onChange={(v) => onChange({ thickness: v })} format={(v) => `${v} pt`} />
            </Field>
          )}
          {opacity}
          {!selected && <p className="text-[11px] text-slate-500">Drag across text; the line snaps to the text. Thickness follows the font size.</p>}
        </>
      );
      break;
    case "sticky":
    case "comment":
      body = (
        <>
          {selected && (
            <Field label={kind === "sticky" ? "Note" : "Comment"} htmlFor="ed-contents">
              <textarea
                id="ed-contents"
                value={str("contents") ?? ""}
                onChange={(e) => onChange({ contents: e.target.value })}
                className="w-full min-h-[72px] px-2 py-1.5 text-sm text-slate-900 bg-white border border-slate-200 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
              />
            </Field>
          )}
          <Field label="Author" htmlFor="ed-author" hint="Shown as the comment's author in PDF readers.">
            <input
              id="ed-author"
              type="text"
              value={str("author") ?? ""}
              placeholder="Anonymous"
              onChange={(e) => onChange({ author: e.target.value })}
              className="w-full px-2 py-1.5 text-sm text-slate-900 bg-white border border-slate-200 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
            />
          </Field>
          <ColorRow id="ed-color" label="Color" value={str("color")} onChange={(v) => onChange({ color: v ?? "#fde047" })} />
          <p className="text-[11px] text-slate-500">
            Saved as a real PDF comment: it shows in the comments list of Acrobat, Preview and browser viewers.
          </p>
        </>
      );
      break;
    case "image":
      body = selected ? (
        <>
          <Checkbox id="ed-lock" label="Keep aspect ratio" checked={!!value.lockAspect} onChange={(v) => onChange({ lockAspect: v })} />
          {opacity}
        </>
      ) : (
        <p className="text-[11px] text-slate-500">Click on the page where the image should go, then pick a PNG or JPG.</p>
      );
      break;
    case "eraser":
      body = (
        <p className="text-[11px] text-slate-500">
          Click anything you added in this session to remove it, or drag across pen strokes to erase whole strokes. Content that was already in the PDF can&apos;t be erased.
        </p>
      );
      break;
    default:
      body = <p className="text-[11px] text-slate-500">Click an object you added to select it. Drag to move, use the handles to resize, Delete to remove.</p>;
  }

  return (
    <div className="space-y-3">
      {body}
      {selected && (
        <div className="flex flex-wrap gap-1 pt-3 border-t border-slate-100">
          <button type="button" onClick={onDuplicate} title="Duplicate" aria-label="Duplicate" className={iconBtn(false)}>
            <Copy size={14} aria-hidden="true" />
          </button>
          <button type="button" onClick={onFront} title="Bring to front" aria-label="Bring to front" className={iconBtn(false)}>
            <BringToFront size={14} aria-hidden="true" />
          </button>
          <button type="button" onClick={onBack} title="Send to back" aria-label="Send to back" className={iconBtn(false)}>
            <SendToBack size={14} aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={onDelete}
            title="Delete (Del)"
            className="ml-auto inline-flex h-8 items-center gap-1.5 rounded-md border border-red-200 bg-white px-2.5 text-xs font-medium text-red-700 hover:bg-red-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-300"
          >
            <Trash2 size={13} aria-hidden="true" /> Delete
          </button>
        </div>
      )}
    </div>
  );
}

export function WhiteoutNotice() {
  return (
    <Notice tone="warning">
      Whiteout only <strong>covers</strong> content visually. The text and images underneath are still in the file and can
      be selected, copied or extracted — this is not redaction. Don&apos;t use it to hide confidential information.
    </Notice>
  );
}
