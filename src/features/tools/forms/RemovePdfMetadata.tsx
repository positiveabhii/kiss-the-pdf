"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";

import { SimplePdfTool } from "../core/SimplePdfTool";
import { loadPdf, outputName } from "../core/pdf-io";
import { Checkbox, Notice, OptionsPanel } from "../core/ui";
import { Inspect, useInspection } from "./components/inspect";
import { MetadataTable } from "./components/MetadataTable";
import { isMetadataEmpty, readMetadataReport, stripMetadata, type MetadataReport } from "./ops/metadata";

async function inspect(bytes: Uint8Array): Promise<MetadataReport> {
  return readMetadataReport(await loadPdf(bytes));
}

export default function RemovePdfMetadata() {
  const insp = useInspection<MetadataReport>();
  const [pageLevel, setPageLevel] = useState(true);

  return (
    <SimplePdfTool
      actionLabel="Remove metadata"
      processingMessage="Removing metadata…"
      onReset={insp.reset}
      validate={(doc) => {
        const r = insp.get(doc.bytes);
        if (!r) return "Reading metadata…";
        if (r.error || !r.value) return "This PDF's metadata couldn't be read.";
        if (isMetadataEmpty(r.value, pageLevel)) return "No metadata found — there's nothing to remove.";
        return null;
      }}
      options={(doc) => {
        const r = insp.get(doc.bytes);
        return (
          <>
            <Inspect bytes={doc.bytes} run={inspect} onResult={insp.set} />
            <OptionsPanel title="Found in this PDF">
              {!r ? (
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Loader2 size={14} className="animate-spin" /> Reading metadata…
                </div>
              ) : r.error || !r.value ? (
                <Notice tone="error">{r.error}</Notice>
              ) : (
                <MetadataTable report={r.value} includePages={pageLevel} />
              )}
            </OptionsPanel>
            <OptionsPanel>
              <Checkbox
                id="strip-pages"
                checked={pageLevel}
                onChange={setPageLevel}
                label="Also remove page-level metadata and private app data (PieceInfo)"
              />
              <p className="text-[11px] text-slate-500">
                Removes the document properties and the XMP packet. Page content, bookmarks and form
                fields are untouched. Text inside the pages and image EXIF data are not metadata and stay.
              </p>
            </OptionsPanel>
          </>
        );
      }}
      run={async ({ file, bytes }) => {
        const { data, before, after } = await stripMetadata(bytes, { pageLevel });
        const fileName = outputName(file, "no-metadata");
        return {
          kind: "report",
          title: "Metadata removed",
          summary: `${fileName} — checked by re-reading the saved file.`,
          download: { data, fileName, label: "Download PDF" },
          content: (
            <div className="grid gap-4 sm:grid-cols-2">
              <OptionsPanel title="Before">
                <MetadataTable report={before} includePages={pageLevel} />
              </OptionsPanel>
              <OptionsPanel title="After">
                <MetadataTable report={after} includePages />
              </OptionsPanel>
            </div>
          ),
        };
      }}
    />
  );
}
