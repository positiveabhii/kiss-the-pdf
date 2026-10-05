"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

import { SimplePdfTool } from "../core/SimplePdfTool";
import { outputName } from "../core/pdf-io";
import { Notice, OptionsPanel } from "../core/ui";
import { removeWatermarks, scanWatermarks, type Finding, type WatermarkScan } from "./ops/remove-watermark";

interface ScanState {
  bytes: Uint8Array;
  result: WatermarkScan | null;
  error: string | null;
}

function Scanner({ bytes, onDone }: { bytes: Uint8Array; onDone: (s: ScanState) => void }) {
  useEffect(() => {
    let alive = true;
    scanWatermarks(bytes)
      .then((result) => alive && onDone({ bytes, result, error: null }))
      .catch((e: unknown) => alive && onDone({ bytes, result: null, error: e instanceof Error ? e.message : String(e) }));
    return () => {
      alive = false;
    };
  }, [bytes, onDone]);
  return null;
}

const KIND_LABEL: Record<Finding["kind"], string> = {
  annotation: "Watermark annotation",
  artifact: "Marked watermark",
  layer: "Watermark layer",
  "layer-xobject": "Watermark layer object",
};

function groupByPage(findings: Finding[]): [number, Finding[]][] {
  const m = new Map<number, Finding[]>();
  for (const f of findings) m.set(f.page, [...(m.get(f.page) ?? []), f]);
  return [...m.entries()].sort((a, b) => a[0] - b[0]);
}

export default function RemoveWatermark() {
  const [scan, setScan] = useState<ScanState | null>(null);

  return (
    <SimplePdfTool
      actionLabel="Remove watermark"
      processingMessage="Removing watermark…"
      onReset={() => setScan(null)}
      validate={(doc) => {
        if (!scan || scan.bytes !== doc.bytes) return "Looking for watermarks…";
        if (scan.error) return "This file couldn't be checked.";
        if (!scan.result?.findings.length) return "No removable watermark found.";
        return null;
      }}
      options={(doc) => {
        const current = scan && scan.bytes === doc.bytes ? scan : null;
        const findings = current?.result?.findings ?? [];
        const groups = groupByPage(findings);
        return (
          <>
            <Scanner bytes={doc.bytes} onDone={setScan} />
            {!current ? (
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Loader2 size={14} className="animate-spin" /> Looking for watermarks…
              </div>
            ) : current.error ? (
              <Notice tone="error">{current.error}</Notice>
            ) : findings.length === 0 ? (
              <Notice tone="warning">
                <p className="font-semibold">No removable watermark found in this PDF.</p>
                <p className="mt-1">
                  This tool removes watermarks that are marked as watermarks inside the file: watermark annotations,
                  content tagged as a watermark artifact (Acrobat, Word, and our Watermark PDF tool do this), and
                  layers named “watermark”. In this file the watermark — if there is one — is ordinary page content,
                  mixed in with the text and images, so it can&apos;t be told apart and removed automatically.
                </p>
              </Notice>
            ) : (
              <OptionsPanel title={`Found on ${groups.length} page${groups.length === 1 ? "" : "s"}`}>
                <ul className="max-h-72 overflow-y-auto divide-y divide-slate-100 border border-slate-200 rounded-md">
                  {groups.map(([page, list]) => (
                    <li key={page} className="flex gap-3 px-3 py-2 text-xs">
                      <span className="w-14 shrink-0 font-mono text-slate-500">Page {page}</span>
                      <span className="flex-1 min-w-0 text-slate-700">
                        {list.map((f, i) => (
                          <span key={i} className="block truncate" title={f.detail}>
                            {KIND_LABEL[f.kind]}
                            {f.kind === "layer" || f.kind === "layer-xobject" ? ` — ${f.detail}` : ""}
                          </span>
                        ))}
                      </span>
                    </li>
                  ))}
                </ul>
                {current.result!.layers.length > 0 && (
                  <p className="text-[11px] text-slate-500">
                    Watermark layer{current.result!.layers.length === 1 ? "" : "s"}:{" "}
                    {current.result!.layers.map((n) => `“${n}”`).join(", ")} — removed from the layers list too.
                  </p>
                )}
                <p className="text-[11px] text-slate-500">
                  Only these items are removed. Everything else on the pages is left exactly as it was.
                </p>
              </OptionsPanel>
            )}
            {current?.result?.issues.length ? (
              <Notice tone="warning">
                {current.result.issues.slice(0, 5).map((i, k) => (
                  <p key={k}>
                    Page {i.page}: {i.message}
                  </p>
                ))}
                {current.result.issues.length > 5 && <p>…and {current.result.issues.length - 5} more.</p>}
              </Notice>
            ) : null}
          </>
        );
      }}
      run={async ({ file, bytes, onProgress, signal }) => {
        const r = await removeWatermarks(bytes, onProgress, signal);
        const pages = new Set(r.findings.map((f) => f.page)).size;
        return {
          kind: "file",
          data: r.bytes,
          fileName: outputName(file, "no-watermark"),
          title: "Watermark removed",
          summary: `Removed ${r.findings.length} watermark item${r.findings.length === 1 ? "" : "s"} from ${pages} page${
            pages === 1 ? "" : "s"
          }.${r.issues.length ? ` ${r.issues.length} item${r.issues.length === 1 ? "" : "s"} couldn't be removed safely and were left.` : ""}`,
        };
      }}
    />
  );
}
