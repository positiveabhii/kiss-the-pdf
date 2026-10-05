"use client";

import { useCallback, useState } from "react";
import { Loader2 } from "lucide-react";
import { PDFName } from "pdf-lib";

import { SimplePdfTool } from "../core/SimplePdfTool";
import { loadPdf, outputName } from "../core/pdf-io";
import { Checkbox, Field, Notice, OptionsPanel, TextInput } from "../core/ui";
import { Inspect, useInspection, type Inspection } from "./components/inspect";
import { readEditableMetadata, writeMetadata, type EditableMetadata } from "./ops/metadata";

interface Loaded {
  meta: EditableMetadata;
  hasXmp: boolean;
}

async function inspect(bytes: Uint8Array): Promise<Loaded> {
  const doc = await loadPdf(bytes);
  return { meta: readEditableMetadata(doc), hasXmp: doc.catalog.has(PDFName.of("Metadata")) };
}

/** Date ↔ <input type="datetime-local"> (local time, to the second). */
function toLocalInput(d: Date | null): string {
  if (!d) return "";
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`;
}
function fromLocalInput(s: string): Date | null {
  if (!s) return null;
  const d = new Date(s);
  return Number.isNaN(d.getTime()) ? null : d;
}

type Form = Omit<EditableMetadata, "creationDate" | "modDate"> & { created: string; modified: string };

const TEXT_FIELDS: { key: keyof Omit<Form, "created" | "modified">; label: string; hint?: string }[] = [
  { key: "title", label: "Title", hint: "Shown in the window title / tab of many readers." },
  { key: "author", label: "Author" },
  { key: "subject", label: "Subject" },
  { key: "keywords", label: "Keywords", hint: "Comma- or space-separated." },
  { key: "creator", label: "Creator", hint: "The app the document was made in." },
  { key: "producer", label: "Producer", hint: "The app that wrote the PDF." },
];

export default function EditPdfMetadata() {
  const insp = useInspection<Loaded>();
  const [form, setForm] = useState<{ bytes: Uint8Array; values: Form } | null>(null);
  const [touchModified, setTouchModified] = useState(true);

  const setInspection = insp.set;
  const onResult = useCallback(
    (r: Inspection<Loaded>) => {
      setInspection(r);
      if (r.value) {
        const m = r.value.meta;
        setForm({
          bytes: r.bytes,
          values: {
            title: m.title,
            author: m.author,
            subject: m.subject,
            keywords: m.keywords,
            creator: m.creator,
            producer: m.producer,
            created: toLocalInput(m.creationDate),
            modified: toLocalInput(m.modDate),
          },
        });
      }
    },
    [setInspection]
  );

  const set = (patch: Partial<Form>) => setForm((f) => (f ? { ...f, values: { ...f.values, ...patch } } : f));

  return (
    <SimplePdfTool
      actionLabel="Save metadata"
      processingMessage="Saving…"
      onReset={() => {
        insp.reset();
        setForm(null);
      }}
      validate={(doc) => (form?.bytes === doc.bytes ? null : "Reading metadata…")}
      options={(doc) => {
        const r = insp.get(doc.bytes);
        const v = form?.bytes === doc.bytes ? form.values : null;
        return (
          <>
            <Inspect bytes={doc.bytes} run={inspect} onResult={onResult} />
            {!r && (
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Loader2 size={14} className="animate-spin" /> Reading metadata…
              </div>
            )}
            {r?.error && <Notice tone="error">{r.error}</Notice>}
            {v && (
              <OptionsPanel title="Document properties">
                <div className="grid gap-4 sm:grid-cols-2">
                  {TEXT_FIELDS.map((f) => (
                    <Field key={f.key} label={f.label} hint={f.hint} htmlFor={`md-${f.key}`}>
                      <TextInput
                        id={`md-${f.key}`}
                        value={v[f.key]}
                        onChange={(e) => set({ [f.key]: e.target.value })}
                      />
                    </Field>
                  ))}
                  <Field label="Created" htmlFor="md-created">
                    <TextInput
                      id="md-created"
                      type="datetime-local"
                      step={1}
                      value={v.created}
                      onChange={(e) => set({ created: e.target.value })}
                    />
                  </Field>
                  <Field label="Modified" htmlFor="md-modified">
                    <TextInput
                      id="md-modified"
                      type="datetime-local"
                      step={1}
                      value={v.modified}
                      disabled={touchModified}
                      onChange={(e) => set({ modified: e.target.value })}
                    />
                    <Checkbox
                      id="md-now"
                      checked={touchModified}
                      onChange={setTouchModified}
                      label="Set to the time I save"
                    />
                  </Field>
                </div>
                <p className="text-[11px] text-slate-500">
                  Leave a field empty to remove it.{" "}
                  {r?.value?.hasXmp
                    ? "This PDF also has an XMP metadata packet; it will be rewritten to match, so readers that prefer XMP don't keep showing the old values."
                    : ""}
                </p>
              </OptionsPanel>
            )}
          </>
        );
      }}
      run={async ({ file, bytes }) => {
        if (!form || form.bytes !== bytes) throw new Error("Metadata not loaded yet.");
        const v = form.values;
        const { data, xmp } = await writeMetadata(bytes, {
          title: v.title,
          author: v.author,
          subject: v.subject,
          keywords: v.keywords,
          creator: v.creator,
          producer: v.producer,
          creationDate: fromLocalInput(v.created),
          modDate: touchModified ? new Date() : fromLocalInput(v.modified),
        });
        return {
          kind: "file",
          data,
          fileName: outputName(file, "metadata"),
          title: "Metadata saved",
          summary:
            xmp === "replaced"
              ? "Document properties updated, and the XMP packet rewritten to match."
              : "Document properties updated.",
        };
      }}
    />
  );
}
