"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import type { PDFDocumentProxy } from "pdfjs-dist";

import { PageViewer } from "../core/PageViewer";
import { SimplePdfTool } from "../core/SimplePdfTool";
import { loadPdf, outputName } from "../core/pdf-io";
import { Checkbox, Notice, OptionsPanel, TextArea, TextInput } from "../core/ui";
import { PageNav } from "./components/BoxOverlay";
import { Inspect, useInspection, type Inspection } from "./components/inspect";
import {
  detectXfa,
  fillForm,
  hasAcroFields,
  listFields,
  type FieldInfo,
  type FieldValue,
  type XfaInfo,
} from "./ops/form-fields";

interface Found {
  xfa: XfaInfo;
  fields: FieldInfo[];
}

async function inspect(bytes: Uint8Array): Promise<Found> {
  const doc = await loadPdf(bytes);
  const xfa = detectXfa(doc);
  if (xfa.xfaOnly || !hasAcroFields(doc)) return { xfa, fields: [] };
  // Push buttons have no value to fill.
  return { xfa, fields: listFields(doc).filter((f) => f.kind !== "button") };
}

const ADD_FIELD_TOOLS = [
  ["/add-text-field", "Add Text Field"],
  ["/add-checkbox", "Add Checkbox"],
  ["/add-radio-button", "Add Radio Button"],
  ["/add-dropdown", "Add Dropdown"],
  ["/add-date-field", "Add Date Field"],
  ["/add-signature-field", "Add Signature Field"],
] as const;

const inputId = (i: number) => `ff-${i}`;

function same(a: FieldValue, b: FieldValue): boolean {
  if (Array.isArray(a) && Array.isArray(b)) return a.length === b.length && a.every((x, i) => x === b[i]);
  return a === b;
}

function FieldInput({
  f,
  index,
  value,
  onChange,
}: {
  f: FieldInfo;
  index: number;
  value: FieldValue;
  onChange: (v: FieldValue) => void;
}) {
  const id = inputId(index);
  const disabled = f.readOnly;
  switch (f.kind) {
    case "text":
      return f.multiline ? (
        <TextArea
          id={id}
          value={String(value)}
          maxLength={f.maxLength ?? undefined}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <TextInput
          id={id}
          value={String(value)}
          maxLength={f.maxLength ?? undefined}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
        />
      );
    case "checkbox":
      return (
        <div className={disabled ? "opacity-50 pointer-events-none" : undefined}>
          <Checkbox id={id} checked={value === true} onChange={onChange} label="Checked" />
        </div>
      );
    case "radio":
      return (
        <div id={id} tabIndex={-1} role="radiogroup" className="flex flex-wrap gap-x-4 gap-y-1.5">
          {f.options.map((o) => (
            <label key={o} className="inline-flex items-center gap-1.5 text-sm text-slate-700">
              <input
                type="radio"
                name={id}
                checked={value === o}
                disabled={disabled}
                onChange={() => onChange(o)}
                className="accent-slate-900"
              />
              {o}
            </label>
          ))}
        </div>
      );
    case "dropdown":
      return f.editable ? (
        <>
          <TextInput
            id={id}
            list={`${id}-list`}
            value={String(value)}
            disabled={disabled}
            onChange={(e) => onChange(e.target.value)}
          />
          <datalist id={`${id}-list`}>
            {f.options.map((o) => (
              <option key={o} value={o} />
            ))}
          </datalist>
        </>
      ) : (
        <select
          id={id}
          value={String(value)}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
          className="w-full max-w-xs px-3 py-2 text-sm bg-white border border-slate-200 rounded-md"
        >
          <option value="">—</option>
          {f.options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      );
    case "optionlist": {
      const arr = Array.isArray(value) ? value : [];
      return (
        <div id={id} tabIndex={-1} className="flex flex-wrap gap-x-4 gap-y-1.5">
          {f.options.map((o) => (
            <label key={o} className="inline-flex items-center gap-1.5 text-sm text-slate-700">
              <input
                type={f.multiSelect ? "checkbox" : "radio"}
                name={id}
                checked={arr.includes(o)}
                disabled={disabled}
                onChange={(e) =>
                  onChange(
                    f.multiSelect
                      ? e.target.checked
                        ? f.options.filter((x) => x === o || arr.includes(x))
                        : arr.filter((x) => x !== o)
                      : [o]
                  )
                }
                className="accent-slate-900"
              />
              {o}
            </label>
          ))}
        </div>
      );
    }
    case "signature":
      return (
        <p className="text-xs text-slate-500">
          {f.signed
            ? "Already signed."
            : "Signature field — sign it in a PDF reader that supports digital signatures, or use Draw Signature to add a visible signature."}
        </p>
      );
    default:
      return null;
  }
}

const KIND_LABEL: Record<FieldInfo["kind"], string> = {
  text: "Text",
  checkbox: "Checkbox",
  radio: "Choice",
  dropdown: "Dropdown",
  optionlist: "List",
  signature: "Signature",
  button: "Button",
};

function Preview({
  pdf,
  fields,
  page,
  setPage,
  pageCount,
}: {
  pdf: PDFDocumentProxy;
  fields: FieldInfo[];
  page: number;
  setPage: (p: number) => void;
  pageCount: number;
}) {
  return (
    <div className="space-y-2">
      <PageNav page={page} count={pageCount} onChange={setPage} />
      <PageViewer doc={pdf} pageNumber={page} maxWidth={720}>
        {(geom) =>
          fields.flatMap((f, i) =>
            f.widgets
              .filter((w) => w.pageIndex === page - 1)
              .map((w, k) => (
                <button
                  key={`${i}-${k}`}
                  type="button"
                  title={f.name}
                  aria-label={`Go to field ${f.name}`}
                  onClick={() => {
                    const el = document.getElementById(inputId(i));
                    el?.scrollIntoView({ block: "center", behavior: "smooth" });
                    el?.focus({ preventScroll: true });
                  }}
                  className="absolute border border-blue-500/70 bg-blue-500/10 hover:bg-blue-500/25"
                  style={{
                    left: w.rect.x * geom.scale,
                    top: w.rect.y * geom.scale,
                    width: w.rect.width * geom.scale,
                    height: w.rect.height * geom.scale,
                  }}
                />
              ))
          )
        }
      </PageViewer>
    </div>
  );
}

export default function FillPdfForms() {
  const insp = useInspection<Found>();
  const [state, setState] = useState<{ bytes: Uint8Array; values: Record<string, FieldValue> } | null>(null);
  const [flatten, setFlatten] = useState(false);
  const [page, setPage] = useState(1);

  const setInspection = insp.set;
  const onResult = useCallback(
    (r: Inspection<Found>) => {
      setInspection(r);
      if (r.value) {
        setState({ bytes: r.bytes, values: Object.fromEntries(r.value.fields.map((f) => [f.name, f.value])) });
        const first = r.value.fields.find((f) => f.pages.length)?.pages[0];
        setPage(first !== undefined ? first + 1 : 1);
      }
    },
    [setInspection]
  );

  const changes = (found: Found, values: Record<string, FieldValue>) =>
    Object.fromEntries(
      found.fields
        .filter((f) => !f.readOnly && f.kind !== "signature" && !same(values[f.name], f.value))
        .map((f) => [f.name, values[f.name]])
    );

  return (
    <SimplePdfTool
      preview
      actionLabel="Save filled PDF"
      processingMessage="Filling the form…"
      onReset={() => {
        insp.reset();
        setState(null);
        setPage(1);
      }}
      validate={(doc) => {
        const r = insp.get(doc.bytes);
        if (!r || state?.bytes !== doc.bytes) return r?.error ? "This PDF couldn't be read." : "Reading form fields…";
        const found = r.value!;
        if (found.xfa.xfaOnly) return "XFA forms can't be filled here.";
        if (found.fields.length === 0) return "This PDF has no form fields.";
        if (Object.keys(changes(found, state.values)).length === 0 && !flatten) return "Fill in at least one field.";
        return null;
      }}
      options={(doc) => {
        const r = insp.get(doc.bytes);
        const found = r?.value;
        const values = state?.bytes === doc.bytes ? state.values : null;
        const setValue = (name: string, v: FieldValue) =>
          setState((s) => (s ? { ...s, values: { ...s.values, [name]: v } } : s));
        const byPage = new Map<number, number[]>();
        found?.fields.forEach((f, i) => {
          const p = f.pages.length ? f.pages[0] : -1;
          byPage.set(p, [...(byPage.get(p) ?? []), i]);
        });
        const missingRequired =
          found && values
            ? found.fields.filter(
                (f) => f.required && f.kind !== "signature" && (values[f.name] === "" || values[f.name] === false || (Array.isArray(values[f.name]) && (values[f.name] as string[]).length === 0))
              )
            : [];
        return (
          <>
            <Inspect bytes={doc.bytes} run={inspect} onResult={onResult} />
            {!r && (
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Loader2 size={14} className="animate-spin" /> Reading form fields…
              </div>
            )}
            {r?.error && <Notice tone="error">{r.error}</Notice>}
            {found?.xfa.xfaOnly && (
              <Notice tone="warning">
                This is an XFA form — an Adobe-only format whose fields aren&apos;t standard PDF form
                fields. It can&apos;t be filled here; open it in Adobe Acrobat or Reader.
              </Notice>
            )}
            {found && !found.xfa.xfaOnly && found.fields.length === 0 && (
              <Notice>
                This PDF has no fillable form fields. You can add some with{" "}
                {ADD_FIELD_TOOLS.map(([href, label], i) => (
                  <span key={href}>
                    <Link href={href} className="font-semibold underline underline-offset-2">
                      {label}
                    </Link>
                    {i < ADD_FIELD_TOOLS.length - 1 ? ", " : "."}
                  </span>
                ))}
              </Notice>
            )}
            {found && found.xfa.hasXfa && !found.xfa.xfaOnly && (
              <Notice>
                This form also carries an XFA version. It will be removed on save so every reader shows
                the values you enter here.
              </Notice>
            )}
            {found && values && found.fields.length > 0 && (
              <>
                {doc.pdfjs && (
                  <Preview pdf={doc.pdfjs} fields={found.fields} page={page} setPage={setPage} pageCount={doc.pageCount} />
                )}
                <OptionsPanel title={`${found.fields.length} field${found.fields.length === 1 ? "" : "s"}`}>
                  {[...byPage.entries()]
                    .sort(([a], [b]) => (a < 0 ? 1 : b < 0 ? -1 : a - b))
                    .map(([p, idxs]) => (
                      <div key={p} className="space-y-3">
                        <button
                          type="button"
                          disabled={p < 0}
                          onClick={() => setPage(p + 1)}
                          className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 hover:text-slate-700"
                        >
                          {p >= 0 ? `Page ${p + 1}` : "Not on a page"}
                        </button>
                        {idxs.map((i) => {
                          const f = found.fields[i];
                          return (
                            <div key={f.name} className="space-y-1">
                              <label htmlFor={inputId(i)} className="flex items-baseline gap-2 text-xs">
                                <span className="font-semibold text-slate-800 break-all">{f.name}</span>
                                <span className="text-slate-400">
                                  {KIND_LABEL[f.kind]}
                                  {f.required ? " · required" : ""}
                                  {f.readOnly ? " · read-only" : ""}
                                </span>
                              </label>
                              <div onFocus={() => f.pages.length && setPage(f.pages[0] + 1)}>
                                <FieldInput f={f} index={i} value={values[f.name]} onChange={(v) => setValue(f.name, v)} />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ))}
                </OptionsPanel>
                <OptionsPanel>
                  <Checkbox
                    id="ff-flatten"
                    checked={flatten}
                    onChange={setFlatten}
                    label="Flatten after filling (values become part of the page and can't be edited)"
                  />
                  {missingRequired.length > 0 && (
                    <p className="text-[11px] text-amber-700">
                      Required but empty: {missingRequired.map((f) => f.name).join(", ")}.
                    </p>
                  )}
                </OptionsPanel>
              </>
            )}
          </>
        );
      }}
      run={async ({ file, bytes }) => {
        const found = insp.get(bytes)?.value;
        if (!found || state?.bytes !== bytes) throw new Error("Form not loaded yet.");
        const result = await fillForm(bytes, changes(found, state.values), { flatten });
        const parts = [`${result.changed} field${result.changed === 1 ? "" : "s"} filled`];
        if (result.flattened) parts.push(`${result.flattened.fields} flattened into the page`);
        if (result.viewerRendered) {
          parts.push(
            "some values use characters the built-in font can't draw, so readers will render them (most do)"
          );
        }
        return {
          kind: "file",
          data: result.data,
          fileName: outputName(file, result.flattened ? "filled-flat" : "filled"),
          title: "Form filled",
          summary: parts.join(" · ") + ".",
        };
      }}
    />
  );
}
