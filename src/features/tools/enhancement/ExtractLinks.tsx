"use client";

import { useState } from "react";
import { Check, Copy, FileJson } from "lucide-react";

import { downloadBlob } from "@/features/pdf/utils/download-utils";

import { SimplePdfTool } from "../core/SimplePdfTool";
import { openPdfJs } from "../core/pdfjs";
import { outputName } from "../core/pdf-io";
import { Notice, SecondaryButton } from "../core/ui";
import { extractLinks, KIND_LABEL, linksToCsv, linksToJson, type FoundLink } from "./ops/extract-links";

const enc = (s: string) => new TextEncoder().encode(s);

function Report({ links, baseName }: { links: FoundLink[]; baseName: string }) {
  const [copied, setCopied] = useState(false);
  const unique = [...new Set(links.filter((l) => l.kind !== "internal" && l.kind !== "other").map((l) => l.target))];
  const copy = async () => {
    const text = unique.length ? unique.join("\n") : links.map((l) => `p${l.page}\t${l.target}`).join("\n");
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };
  if (!links.length) {
    return (
      <Notice>
        No links found: no clickable links, and no web or e-mail addresses in the page text. Scanned pages have no
        text to search — run OCR first if that&apos;s the case.
      </Notice>
    );
  }
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        <SecondaryButton onClick={() => void copy()}>
          {copied ? <Check size={13} /> : <Copy size={13} />} {copied ? "Copied" : `Copy ${unique.length ? `${unique.length} unique address${unique.length === 1 ? "" : "es"}` : "all"}`}
        </SecondaryButton>
        <SecondaryButton onClick={() => downloadBlob(enc(linksToJson(links)), `${baseName}-links.json`, "application/json")}>
          <FileJson size={13} /> Download JSON
        </SecondaryButton>
      </div>
      <div className="overflow-x-auto border border-slate-200 rounded-md">
        <table className="w-full text-xs">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="text-left font-semibold px-3 py-2 w-14">Page</th>
              <th className="text-left font-semibold px-3 py-2 w-44">Type</th>
              <th className="text-left font-semibold px-3 py-2">Target</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {links.map((l, i) => (
              <tr key={i} className="align-top">
                <td className="px-3 py-1.5 font-mono text-slate-500">{l.page}</td>
                <td className="px-3 py-1.5 text-slate-600">{KIND_LABEL[l.kind]}</td>
                <td className="px-3 py-1.5 text-slate-900 break-all">
                  {l.kind === "web" || l.kind === "text" ? (
                    <a href={l.target} target="_blank" rel="noopener noreferrer nofollow" className="hover:underline">
                      {l.target}
                    </a>
                  ) : (
                    l.target
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-[11px] text-slate-500">
        Addresses in the text are found by pattern; one broken across two lines may be cut short.
      </p>
    </div>
  );
}

export default function ExtractLinks() {
  return (
    <SimplePdfTool
      actionLabel="Find links"
      processingMessage="Reading links…"
      intro={
        <Notice>
          Lists clickable links (web, e-mail and links to other pages) and web or e-mail addresses written in the text.
        </Notice>
      }
      run={async ({ file, bytes, onProgress, signal }) => {
        const doc = await openPdfJs(bytes);
        try {
          const links = await extractLinks(doc, onProgress, signal);
          const base = outputName(file, "", "x").replace(/\.x$/, "");
          const counts = {
            web: links.filter((l) => l.kind === "web").length,
            internal: links.filter((l) => l.kind === "internal").length,
            text: links.filter((l) => l.kind === "text").length,
          };
          return {
            kind: "report",
            title: links.length ? `${links.length} link${links.length === 1 ? "" : "s"} found` : "No links found",
            summary: links.length
              ? `${counts.web} web/e-mail, ${counts.internal} internal, ${counts.text} written in the text.`
              : undefined,
            content: <Report links={links} baseName={base} />,
            download: links.length
              ? { data: enc(linksToCsv(links)), fileName: `${base}-links.csv`, mimeType: "text/csv", label: "Download CSV" }
              : undefined,
          };
        } finally {
          void doc.loadingTask.destroy();
        }
      }}
    />
  );
}
