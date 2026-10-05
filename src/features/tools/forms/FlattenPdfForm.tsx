"use client";

import { Loader2 } from "lucide-react";

import { SimplePdfTool } from "../core/SimplePdfTool";
import { loadPdf, outputName } from "../core/pdf-io";
import { Notice, OptionsPanel } from "../core/ui";
import { Inspect, useInspection } from "./components/inspect";
import { detectXfa, flattenForm, hasAcroFields, listFields, type FieldInfo } from "./ops/form-fields";

interface Found {
  xfaOnly: boolean;
  fields: FieldInfo[];
}

async function inspect(bytes: Uint8Array): Promise<Found> {
  const doc = await loadPdf(bytes);
  const xfa = detectXfa(doc);
  if (xfa.xfaOnly || !hasAcroFields(doc)) return { xfaOnly: xfa.xfaOnly, fields: [] };
  return { xfaOnly: false, fields: listFields(doc) };
}

export default function FlattenPdfForm() {
  const insp = useInspection<Found>();
  return (
    <SimplePdfTool
      actionLabel="Flatten form"
      processingMessage="Flattening…"
      onReset={insp.reset}
      validate={(doc) => {
        const r = insp.get(doc.bytes);
        if (!r) return "Looking for form fields…";
        if (r.error || !r.value) return "This PDF couldn't be read.";
        if (r.value.xfaOnly) return "XFA forms can't be flattened here.";
        if (r.value.fields.length === 0) return "This PDF has no form fields to flatten.";
        return null;
      }}
      options={(doc) => {
        const r = insp.get(doc.bytes);
        const f = r?.value;
        return (
          <>
            <Inspect bytes={doc.bytes} run={inspect} onResult={insp.set} />
            {!r && (
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Loader2 size={14} className="animate-spin" /> Looking for form fields…
              </div>
            )}
            {r?.error && <Notice tone="error">{r.error}</Notice>}
            {f?.xfaOnly && (
              <Notice tone="warning">
                This is an XFA form (an Adobe-only format). Its fields aren&apos;t standard PDF form
                fields, so they can&apos;t be flattened here. Print it to PDF from Adobe Acrobat/Reader
                instead.
              </Notice>
            )}
            {f && !f.xfaOnly && f.fields.length === 0 && (
              <Notice>This PDF has no fillable form fields, so there&apos;s nothing to flatten.</Notice>
            )}
            {f && f.fields.length > 0 && (
              <OptionsPanel title={`${f.fields.length} form field${f.fields.length === 1 ? "" : "s"} found`}>
                <p className="text-sm text-slate-700">
                  Each field&apos;s current value is drawn permanently into the page and the field is
                  removed, so it can no longer be edited.
                </p>
                {f.fields.some((x) => x.kind === "signature") && (
                  <p className="text-[11px] text-slate-500">
                    Empty signature fields are removed. A signed signature&apos;s visible appearance is
                    kept, but the digital signature itself will no longer validate.
                  </p>
                )}
                <p className="text-[11px] text-slate-500">
                  Only form fields are flattened. Comments and other annotations stay as they are.
                </p>
              </OptionsPanel>
            )}
          </>
        );
      }}
      run={async ({ file, bytes }) => {
        const { data, stats, xfaOnly } = await flattenForm(bytes);
        if (xfaOnly || stats.fields === 0) throw new Error("No form fields were found to flatten.");
        return {
          kind: "file",
          data,
          fileName: outputName(file, "flattened"),
          title: "Form flattened",
          summary: `${stats.fields} field${stats.fields === 1 ? "" : "s"} flattened (${stats.drawn} drawn into the page${
            stats.removedWithoutDrawing ? `, ${stats.removedWithoutDrawing} hidden or empty removed` : ""
          }).`,
        };
      }}
    />
  );
}
