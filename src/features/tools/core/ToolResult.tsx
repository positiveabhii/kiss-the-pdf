"use client";

import { useEffect, useMemo, useState } from "react";
import { Download, ExternalLink, FileText } from "lucide-react";

import { downloadBlob } from "@/features/pdf/utils/download-utils";
import { formatFileSize } from "@/features/pdf/utils/format-file-size";
import { createZipFromFiles } from "@/features/pdf/utils/zip-utils";
import { ToolSuccessState } from "@/features/pdf/components/shared/ToolSuccessState";

/**
 * What a tool produces. Every tool — simple or custom — ends in one of these
 * and renders it with <ToolResultView>, so results look and behave the same
 * everywhere (download, PDF preview, zip for many files, start over).
 */
export type ToolOutput =
  | {
      kind: "file";
      data: Uint8Array;
      fileName: string;
      /** Defaults from the extension (pdf/png/jpg/webp/tiff/zip/json/txt/csv/html). */
      mimeType?: string;
      title?: string;
      summary?: string;
    }
  | {
      kind: "files";
      files: { fileName: string; data: Uint8Array; mimeType?: string }[];
      /** Name of the combined download, e.g. "report-pages.zip". */
      zipName: string;
      title?: string;
      summary?: string;
    }
  | {
      /** Information rather than a new file (links found, metadata…). */
      kind: "report";
      title: string;
      summary?: string;
      content: React.ReactNode;
      download?: { data: Uint8Array; fileName: string; mimeType?: string; label?: string };
    };

const MIME_BY_EXT: Record<string, string> = {
  pdf: "application/pdf",
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  webp: "image/webp",
  tif: "image/tiff",
  tiff: "image/tiff",
  gif: "image/gif",
  svg: "image/svg+xml",
  zip: "application/zip",
  json: "application/json",
  txt: "text/plain",
  csv: "text/csv",
  html: "text/html",
};

export function mimeFor(fileName: string, explicit?: string): string {
  if (explicit) return explicit;
  const ext = fileName.split(".").pop()?.toLowerCase() ?? "";
  return MIME_BY_EXT[ext] ?? "application/octet-stream";
}

function isPdfName(name: string) {
  return /\.pdf$/i.test(name);
}

/** Opens a PDF result in a new tab with the browser's own viewer. */
function PreviewLink({ data, fileName }: { data: Uint8Array; fileName: string }) {
  const url = useMemo(
    () => URL.createObjectURL(new Blob([data as unknown as BlobPart], { type: "application/pdf" })),
    [data]
  );
  useEffect(() => () => URL.revokeObjectURL(url), [url]);
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 underline-offset-2 hover:underline"
    >
      <ExternalLink size={13} /> Preview {fileName} in a new tab
    </a>
  );
}

export function ToolResultView({
  output,
  onStartOver,
  startOverLabel = "Process another file",
}: {
  output: ToolOutput;
  onStartOver: () => void;
  startOverLabel?: string;
}) {
  const [zipping, setZipping] = useState(false);

  if (output.kind === "file") {
    return (
      <ToolSuccessState
        title={output.title ?? "Done!"}
        description={
          output.summary ?? `${output.fileName} · ${formatFileSize(output.data.byteLength)}`
        }
        primaryAction={{
          label: `Download ${output.fileName.split(".").pop()?.toUpperCase() ?? "file"}`,
          onClick: () =>
            downloadBlob(output.data, output.fileName, mimeFor(output.fileName, output.mimeType)),
        }}
        secondaryAction={{ label: startOverLabel, onClick: onStartOver }}
      >
        {isPdfName(output.fileName) && <PreviewLink data={output.data} fileName={output.fileName} />}
      </ToolSuccessState>
    );
  }

  if (output.kind === "files") {
    const total = output.files.reduce((s, f) => s + f.data.byteLength, 0);
    const downloadZip = async () => {
      setZipping(true);
      try {
        const zip = await createZipFromFiles(
          output.files.map((f) => ({ filename: f.fileName, data: f.data }))
        );
        downloadBlob(zip, output.zipName, "application/zip");
      } finally {
        setZipping(false);
      }
    };
    return (
      <ToolSuccessState
        title={output.title ?? "Done!"}
        description={
          output.summary ??
          `${output.files.length} file${output.files.length === 1 ? "" : "s"} · ${formatFileSize(total)}`
        }
        primaryAction={{
          label: zipping ? "Preparing ZIP…" : `Download all (ZIP)`,
          onClick: () => void downloadZip(),
        }}
        secondaryAction={{ label: startOverLabel, onClick: onStartOver }}
      >
        <ul className="w-full max-h-64 overflow-y-auto divide-y divide-slate-100 border border-slate-200 rounded-md text-left">
          {output.files.map((f) => (
            <li key={f.fileName} className="flex items-center gap-2 px-3 py-2">
              <FileText size={14} className="shrink-0 text-slate-400" />
              <span className="flex-1 min-w-0 truncate text-xs text-slate-700" title={f.fileName}>
                {f.fileName}
              </span>
              <span className="text-[10px] font-mono text-slate-400">
                {formatFileSize(f.data.byteLength)}
              </span>
              <button
                type="button"
                onClick={() => downloadBlob(f.data, f.fileName, mimeFor(f.fileName, f.mimeType))}
                aria-label={`Download ${f.fileName}`}
                className="p-1 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded"
              >
                <Download size={14} />
              </button>
            </li>
          ))}
        </ul>
      </ToolSuccessState>
    );
  }

  // report
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-slate-900">{output.title}</h3>
          {output.summary && <p className="text-xs text-slate-500 mt-0.5">{output.summary}</p>}
        </div>
        <div className="flex gap-2">
          {output.download && (
            <button
              type="button"
              onClick={() =>
                downloadBlob(
                  output.download!.data,
                  output.download!.fileName,
                  mimeFor(output.download!.fileName, output.download!.mimeType)
                )
              }
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-md"
            >
              <Download size={13} /> {output.download.label ?? "Download"}
            </button>
          )}
          <button
            type="button"
            onClick={onStartOver}
            className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-medium rounded-md"
          >
            {startOverLabel}
          </button>
        </div>
      </div>
      <div>{output.content}</div>
    </div>
  );
}
