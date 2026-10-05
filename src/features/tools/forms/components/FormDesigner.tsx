"use client";

import { useState } from "react";
import type { PDFDocumentProxy } from "pdfjs-dist";
import {
  Calendar,
  CheckSquare,
  ChevronDown,
  CircleDot,
  Loader2,
  Signature,
  TextCursor,
  Trash2,
} from "lucide-react";

import { SegmentedControl } from "@/features/pdf/components/shared/SegmentedControl";

import { PageViewer } from "../../core/PageViewer";
import { SimplePdfTool } from "../../core/SimplePdfTool";
import { loadPdf, outputName } from "../../core/pdf-io";
import { Checkbox, Field, Notice, NumberInput, OptionsPanel, Select, TextArea, TextInput } from "../../core/ui";
import {
  addFormFields,
  DATE_FORMATS,
  designProblems,
  validFieldName,
  type DesignField,
  type DesignFieldType,
} from "../ops/add-fields";
import { detectXfa, hasAcroFields, listFields } from "../ops/form-fields";
import type { VisualRect } from "../ops/geometry";
import { BoxOverlay, PageNav } from "./BoxOverlay";
import { Inspect, useInspection } from "./inspect";

/**
 * The shared form designer behind the six "Add … field" tools: click or drag
 * on a page to place fields of the chosen type, edit their properties, move /
 * resize / delete them, then save real AcroForm fields.
 */

const TYPES: { value: DesignFieldType; label: string; icon: React.ReactNode }[] = [
  { value: "text", label: "Text", icon: <TextCursor size={13} /> },
  { value: "checkbox", label: "Checkbox", icon: <CheckSquare size={13} /> },
  { value: "radio", label: "Radio", icon: <CircleDot size={13} /> },
  { value: "dropdown", label: "Dropdown", icon: <ChevronDown size={13} /> },
  { value: "date", label: "Date", icon: <Calendar size={13} /> },
  { value: "signature", label: "Signature", icon: <Signature size={13} /> },
];

const DEFAULT_SIZE: Record<DesignFieldType, { width: number; height: number }> = {
  text: { width: 180, height: 22 },
  checkbox: { width: 14, height: 14 },
  radio: { width: 14, height: 14 },
  dropdown: { width: 150, height: 22 },
  date: { width: 110, height: 22 },
  signature: { width: 180, height: 50 },
};

const PREFIX: Record<DesignFieldType, string> = {
  text: "text",
  checkbox: "checkbox",
  radio: "choice",
  dropdown: "dropdown",
  date: "date",
  signature: "signature",
};

const INTRO: Record<DesignFieldType, string> = {
  text: "Click on the page to add a text box, or drag to draw one.",
  checkbox: "Click on the page to add a checkbox.",
  radio:
    "Click to add a radio button. With a radio button selected, the next click adds another option to the same group — only one option in a group can be chosen.",
  dropdown: "Click to add a dropdown, then list its options.",
  date: "Click to add a date field. Adobe Acrobat and Reader check the date format as it's typed; other readers accept any text.",
  signature:
    "Click to add a signature field. Acrobat and other signing apps show it as a box to click and sign digitally.",
};

const NOUN: Record<DesignFieldType, [string, string]> = {
  text: ["text field", "text fields"],
  checkbox: ["checkbox", "checkboxes"],
  radio: ["radio button", "radio buttons"],
  dropdown: ["dropdown", "dropdowns"],
  date: ["date field", "date fields"],
  signature: ["signature field", "signature fields"],
};

function uniqueName(prefix: string, taken: Set<string>): string {
  for (let n = 1; ; n++) {
    const name = `${prefix}_${n}`;
    if (!taken.has(name)) return name;
  }
}

let idCounter = 0;
const newId = () => `f${++idCounter}`;

async function inspect(bytes: Uint8Array): Promise<{ names: string[]; xfaOnly: boolean }> {
  const doc = await loadPdf(bytes);
  const xfa = detectXfa(doc);
  if (xfa.xfaOnly || !hasAcroFields(doc)) return { names: [], xfaOnly: xfa.xfaOnly };
  return { names: listFields(doc).map((f) => f.name), xfaOnly: false };
}

function boxLabel(f: DesignField): string {
  return f.type === "radio" ? `${f.groupName}: ${f.optionValue}` : f.name;
}

function Properties({
  field,
  all,
  update,
  updateGroup,
  remove,
}: {
  field: DesignField;
  all: DesignField[];
  update: (patch: Partial<DesignField>) => void;
  updateGroup: (oldName: string, patch: Partial<DesignField>) => void;
  remove: () => void;
}) {
  const nameOk = validFieldName(field.type === "radio" ? field.groupName : field.name);
  const hasFont = field.type === "text" || field.type === "date" || field.type === "dropdown";
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold text-slate-800">
          {TYPES.find((t) => t.value === field.type)!.label} field · page {field.pageIndex + 1}
        </p>
        <button
          type="button"
          onClick={remove}
          className="inline-flex items-center gap-1 text-xs text-red-600 hover:text-red-800"
        >
          <Trash2 size={13} /> Delete
        </button>
      </div>
      {field.type === "radio" ? (
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Group name" htmlFor="fd-group" hint="All options in a group share it.">
            <TextInput
              id="fd-group"
              value={field.groupName}
              onChange={(e) => updateGroup(field.groupName, { groupName: e.target.value })}
            />
          </Field>
          <Field label="This option's value" htmlFor="fd-value">
            <TextInput id="fd-value" value={field.optionValue} onChange={(e) => update({ optionValue: e.target.value })} />
          </Field>
        </div>
      ) : (
        <Field label="Field name" htmlFor="fd-name" hint="Unique in the document. No dots.">
          <TextInput id="fd-name" value={field.name} onChange={(e) => update({ name: e.target.value })} />
        </Field>
      )}
      {!nameOk && <p className="text-[11px] text-red-600">Names can&apos;t be empty or contain dots.</p>}

      {(field.type === "text" || field.type === "date") && (
        <Field label="Default value" htmlFor="fd-default">
          <TextInput
            id="fd-default"
            value={field.defaultValue}
            placeholder={field.type === "date" ? field.dateFormat : ""}
            onChange={(e) => update({ defaultValue: e.target.value })}
          />
        </Field>
      )}
      {field.type === "text" && (
        <Checkbox id="fd-multi" checked={field.multiline} onChange={(multiline) => update({ multiline })} label="Multiple lines" />
      )}
      {field.type === "date" && (
        <Field label="Date format">
          <Select
            value={field.dateFormat}
            onChange={(dateFormat) => update({ dateFormat })}
            options={DATE_FORMATS.map((f) => ({ value: f, label: f }))}
          />
        </Field>
      )}
      {field.type === "dropdown" && (
        <>
          <Field label="Options (one per line)" htmlFor="fd-options">
            <TextArea
              id="fd-options"
              value={field.options.join("\n")}
              onChange={(e) => update({ options: e.target.value.split("\n") })}
            />
          </Field>
          <Field label="Selected by default">
            <Select
              value={field.defaultValue}
              onChange={(defaultValue) => update({ defaultValue })}
              options={[
                { value: "", label: "(none)" },
                ...field.options.map((o) => o.trim()).filter(Boolean).map((o) => ({ value: o, label: o })),
              ]}
            />
          </Field>
        </>
      )}
      {field.type === "checkbox" && (
        <Checkbox id="fd-checked" checked={field.checked} onChange={(checked) => update({ checked })} label="Checked by default" />
      )}
      {field.type === "radio" && (
        <>
          <Checkbox
            id="fd-selected"
            checked={field.checked}
            onChange={(checked) => update({ checked })}
            label="Selected by default"
          />
          <p className="text-[11px] text-slate-500">
            {all.filter((f) => f.type === "radio" && f.groupName === field.groupName).length} option(s) in this group.
          </p>
        </>
      )}
      <div className="flex flex-wrap items-end gap-6">
        <Checkbox id="fd-required" checked={field.required} onChange={(required) => update({ required })} label="Required" />
        {hasFont && (
          <Field label="Font size (0 = auto)">
            <NumberInput value={field.fontSize} onChange={(fontSize) => update({ fontSize: Math.max(0, fontSize) })} min={0} max={72} suffix="pt" />
          </Field>
        )}
      </div>
    </div>
  );
}

function Canvas({
  pdf,
  pageCount,
  page,
  setPage,
  fields,
  selectedId,
  setSelectedId,
  onCreate,
  onMove,
  onDelete,
}: {
  pdf: PDFDocumentProxy;
  pageCount: number;
  page: number;
  setPage: (p: number) => void;
  fields: DesignField[];
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
  onCreate: (rect: VisualRect | null, at: { x: number; y: number }, pageW: number, pageH: number) => void;
  onMove: (id: string, rect: VisualRect) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="space-y-2">
      <PageNav page={page} count={pageCount} onChange={setPage} />
      <PageViewer doc={pdf} pageNumber={page} maxWidth={760}>
        {(geom) => (
          <BoxOverlay
            geom={geom}
            ariaLabel="Form layout: click or drag to add a field, drag to move, corners to resize, Delete to remove"
            boxes={fields
              .filter((f) => f.pageIndex === page - 1)
              .map((f) => ({ id: f.id, rect: f.rect, label: boxLabel(f), tone: "field" as const }))}
            selectedId={selectedId}
            onSelect={setSelectedId}
            onChange={onMove}
            onDelete={onDelete}
            onCreate={(r, at) => onCreate(r, at, geom.width / geom.scale, geom.height / geom.scale)}
          />
        )}
      </PageViewer>
    </div>
  );
}

export function FormDesigner({ initialType }: { initialType: DesignFieldType }) {
  const insp = useInspection<{ names: string[]; xfaOnly: boolean }>();
  const [type, setType] = useState<DesignFieldType>(initialType);
  const [design, setDesign] = useState<{ bytes: Uint8Array; fields: DesignField[] } | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const fieldsFor = (bytes: Uint8Array) => (design?.bytes === bytes ? design.fields : []);

  return (
    <SimplePdfTool
      preview
      actionLabel="Save form fields"
      processingMessage="Creating form fields…"
      onReset={() => {
        setDesign(null);
        setSelectedId(null);
        setPage(1);
        insp.reset();
      }}
      validate={(doc) => {
        const r = insp.get(doc.bytes);
        if (!r) return "Reading the PDF…";
        if (r.value?.xfaOnly) return "XFA forms can't be edited here.";
        const fields = fieldsFor(doc.bytes);
        if (fields.length === 0) return "Place at least one field on the page.";
        return designProblems(fields, r.value?.names ?? [])[0] ?? null;
      }}
      options={(doc) => {
        const r = insp.get(doc.bytes);
        const existing = r?.value?.names ?? [];
        const fields = fieldsFor(doc.bytes);
        const selected = fields.find((f) => f.id === selectedId) ?? null;
        const setFields = (fn: (fs: DesignField[]) => DesignField[]) =>
          setDesign((d) => ({ bytes: doc.bytes, fields: fn(d?.bytes === doc.bytes ? d.fields : []) }));
        const update = (id: string, patch: Partial<DesignField>) =>
          setFields((fs) =>
            fs.map((f) => {
              if (f.id === id) return { ...f, ...patch };
              // One default-selected option per radio group.
              const me = fs.find((x) => x.id === id);
              if (patch.checked && me?.type === "radio" && f.type === "radio" && f.groupName === me.groupName) {
                return { ...f, checked: false };
              }
              return f;
            })
          );
        const updateGroup = (oldName: string, patch: Partial<DesignField>) =>
          setFields((fs) => fs.map((f) => (f.type === "radio" && f.groupName === oldName ? { ...f, ...patch } : f)));
        const remove = (id: string) => {
          setFields((fs) => fs.filter((f) => f.id !== id));
          setSelectedId(null);
        };

        const onCreate = (rect: VisualRect | null, at: { x: number; y: number }, pageW: number, pageH: number) => {
          const size = DEFAULT_SIZE[type];
          let rr: VisualRect = rect ?? { x: at.x - size.width / 2, y: at.y - size.height / 2, ...size };
          if ((type === "checkbox" || type === "radio") && rect) {
            const side = Math.max(8, Math.min(rect.width, rect.height));
            rr = { x: rect.x, y: rect.y, width: side, height: side };
          }
          rr = {
            ...rr,
            x: Math.min(Math.max(0, rr.x), pageW - rr.width),
            y: Math.min(Math.max(0, rr.y), pageH - rr.height),
          };
          const taken = new Set([
            ...existing,
            ...fields.map((f) => (f.type === "radio" ? f.groupName : f.name)),
          ]);
          const base: DesignField = {
            id: newId(),
            type,
            pageIndex: page - 1,
            rect: rr,
            name: "",
            required: false,
            fontSize: 0,
            defaultValue: "",
            multiline: false,
            checked: false,
            options: type === "dropdown" ? ["Option 1", "Option 2", "Option 3"] : [],
            groupName: "",
            optionValue: "",
            dateFormat: "yyyy-mm-dd",
          };
          if (type === "radio") {
            const last = selected?.type === "radio" ? selected : null;
            const group = last ? last.groupName : uniqueName(PREFIX.radio, taken);
            const n = fields.filter((f) => f.type === "radio" && f.groupName === group).length + 1;
            base.groupName = group;
            base.optionValue = `Option ${n}`;
            if (last && !rect) {
              // Line the new option up with the previous one.
              base.rect = { ...last.rect, x: rr.x, y: rr.y };
            }
          } else {
            base.name = uniqueName(PREFIX[type], taken);
          }
          setFields((fs) => [...fs, base]);
          setSelectedId(base.id);
        };

        return (
          <>
            <Inspect bytes={doc.bytes} run={inspect} onResult={insp.set} />
            {r?.value?.xfaOnly && (
              <Notice tone="warning">
                This PDF is an XFA form (an Adobe-only format). Adding standard form fields would break
                it; edit it in Adobe Acrobat instead.
              </Notice>
            )}
            {r?.error && <Notice tone="error">{r.error}</Notice>}
            <OptionsPanel title="Field type">
              <SegmentedControl options={TYPES} value={type} onChange={setType} />
              <p className="text-[11px] text-slate-500">{INTRO[type]}</p>
              {existing.length > 0 && (
                <p className="text-[11px] text-slate-500">
                  This PDF already has {existing.length} form field{existing.length === 1 ? "" : "s"}; they
                  are kept.
                </p>
              )}
            </OptionsPanel>

            {doc.pdfjs ? (
              <Canvas
                pdf={doc.pdfjs}
                pageCount={doc.pageCount}
                page={page}
                setPage={(p) => {
                  setPage(p);
                  setSelectedId(null);
                }}
                fields={fields}
                selectedId={selectedId}
                setSelectedId={setSelectedId}
                onCreate={onCreate}
                onMove={(id, rect) => update(id, { rect })}
                onDelete={remove}
              />
            ) : (
              <div className="flex items-center justify-center py-16 text-slate-400">
                <Loader2 className="w-5 h-5 animate-spin" />
              </div>
            )}

            {selected && (
              <OptionsPanel title="Selected field">
                <Properties
                  field={selected}
                  all={fields}
                  update={(patch) => update(selected.id, patch)}
                  updateGroup={updateGroup}
                  remove={() => remove(selected.id)}
                />
              </OptionsPanel>
            )}

            {fields.length > 0 && (
              <OptionsPanel title={`${fields.length} new field${fields.length === 1 ? "" : "s"}`}>
                <ul className="divide-y divide-slate-100 text-xs">
                  {fields.map((f) => (
                    <li key={f.id} className="flex items-center gap-2 py-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          setPage(f.pageIndex + 1);
                          setSelectedId(f.id);
                        }}
                        className={`flex-1 min-w-0 text-left truncate ${f.id === selectedId ? "font-semibold text-slate-900" : "text-slate-700 hover:text-slate-900"}`}
                      >
                        {boxLabel(f)}
                        <span className="text-slate-400">
                          {" "}
                          · {TYPES.find((t) => t.value === f.type)!.label} · p.{f.pageIndex + 1}
                        </span>
                      </button>
                      <button
                        type="button"
                        aria-label={`Delete ${boxLabel(f)}`}
                        onClick={() => remove(f.id)}
                        className="p-1 text-slate-400 hover:text-red-600"
                      >
                        <Trash2 size={13} />
                      </button>
                    </li>
                  ))}
                </ul>
              </OptionsPanel>
            )}
          </>
        );
      }}
      run={async ({ file, bytes }) => {
        const fields = fieldsFor(bytes);
        const { data, created, xfaRemoved } = await addFormFields(bytes, fields);
        const counts = new Map<DesignFieldType, number>();
        for (const c of created) counts.set(c.type, (counts.get(c.type) ?? 0) + 1);
        const parts = [...counts.entries()].map(([t, n]) => `${n} ${n === 1 ? NOUN[t][0] : NOUN[t][1]}`);
        return {
          kind: "file",
          data,
          fileName: outputName(file, "form"),
          title: "Form fields added",
          summary: `Added ${parts.join(", ")}.${xfaRemoved ? " The old XFA form layer was removed." : ""}`,
        };
      }}
    />
  );
}
