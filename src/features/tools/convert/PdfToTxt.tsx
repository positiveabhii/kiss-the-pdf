"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { Check, Copy } from "lucide-react";

import { SimplePdfTool } from "../core/SimplePdfTool";
import { openPdfJs } from "../core/pdfjs";
import { outputName, UserFacingError } from "../core/pdf-io";
import { Checkbox, Field, Notice, OptionsPanel, SecondaryButton, TextInput } from "../core/ui";
import { tryParsePages } from "../organization/ops/ranges";
import { extractText, type ExtractResult } from "./ops/pdf-text";

const PREVIEW_CHARS = 20_000;
const enc = (s: string) => new TextEncoder().encode(s);
const countWords = (s: string) => s.match(/\S+/g)?.length ?? 0;

function TextReport({ result }: { result: ExtractResult }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(result.text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };
  const allEmpty = result.emptyPages.length === result.pages;
  const truncated = result.text.length > PREVIEW_CHARS;

  return (
    <div className="space-y-3">
      {result.emptyPages.length > 0 && (
        <Notice tone="warning">
          {allEmpty
            ? "No text was found in this PDF. It is probably scanned (pages are images), and this tool doesn't do OCR."
            : `${result.emptyPages.length} page${result.emptyPages.length === 1 ? "" : "s"} had no text (${result.emptyPages.slice(0, 12).join(", ")}${result.emptyPages.length > 12 ? "…" : ""}), probably scanned images. This tool doesn't do OCR.`}{" "}
          To read scanned pages, try{" "}
          <Link href="/chat-with-pdf" className="font-medium underline">
            Chat with PDF
          </Link>{" "}
          with Claude or Gemini, which read page images.
        </Notice>
      )}
      {!allEmpty && (
        <>
          <div className="flex flex-wrap items-center gap-2">
            <SecondaryButton onClick={() => void copy()}>
              {copied ? <Check size={13} /> : <Copy size={13} />} {copied ? "Copied" : "Copy text"}
            </SecondaryButton>
            <span className="text-xs text-slate-500">
              {result.pages} page{result.pages === 1 ? "" : "s"} · {result.text.length.toLocaleString()} characters ·{" "}
              {countWords(result.text).toLocaleString()} words
            </span>
          </div>
          <pre className="max-h-96 overflow-auto whitespace-pre-wrap break-words rounded-md border border-slate-200 bg-slate-50 p-3 font-mono text-xs leading-relaxed text-slate-800">
            {truncated ? result.text.slice(0, PREVIEW_CHARS) : result.text}
          </pre>
          {truncated && (
            <p className="text-[11px] text-slate-500">
              Preview shows the first {PREVIEW_CHARS.toLocaleString()} characters. The download and Copy text include everything.
            </p>
          )}
        </>
      )}
    </div>
  );
}

export default function PdfToTxt() {
  const [pages, setPages] = useState("");
  const [separators, setSeparators] = useState(true);
  const [keepLayout, setKeepLayout] = useState(false);
  const reset = useCallback(() => setPages(""), []);

  return (
    <SimplePdfTool
      actionLabel="Convert to TXT"
      processingMessage="Extracting text…"
      onReset={reset}
      intro={<Notice>Extracts the text layer of a PDF into a plain .txt file, in reading order. Everything happens in your browser.</Notice>}
      validate={(doc) => (pages.trim() ? tryParsePages(pages, doc.pageCount).error : null)}
      options={(doc) => {
        const err = pages.trim() ? tryParsePages(pages, doc.pageCount).error : null;
        return (
          <OptionsPanel title="Options">
            <Field label="Pages" htmlFor="txt-pages" hint={`Leave blank for all ${doc.pageCount} pages, or enter e.g. 1-3, 5, 8-.`}>
              <TextInput id="txt-pages" value={pages} onChange={(e) => setPages(e.target.value)} placeholder="All pages" />
            </Field>
            {err && <p className="text-xs text-red-600">{err}</p>}
            <Checkbox id="txt-sep" checked={separators} onChange={setSeparators} label="Add a separator line before each page" />
            <Checkbox id="txt-layout" checked={keepLayout} onChange={setKeepLayout} label="Keep layout (pad with spaces to keep columns aligned)" />
          </OptionsPanel>
        );
      }}
      run={async ({ file, bytes, pageCount, onProgress, signal }) => {
        const parsed = pages.trim() ? tryParsePages(pages, pageCount) : null;
        if (parsed?.error) throw new UserFacingError(parsed.error);
        const pageNumbers = parsed?.pages.length ? parsed.pages : Array.from({ length: pageCount }, (_, i) => i + 1);
        const doc = await openPdfJs(bytes);
        try {
          const result = await extractText(doc, pageNumbers, { separators, keepLayout }, onProgress, signal);
          const allEmpty = result.emptyPages.length === result.pages;
          return {
            kind: "report",
            title: allEmpty ? "No text found" : "Text extracted",
            summary: allEmpty ? undefined : `${result.pages} page${result.pages === 1 ? "" : "s"} converted to plain text.`,
            content: <TextReport result={result} />,
            download: allEmpty
              ? undefined
              : { data: enc(result.text), fileName: outputName(file, "", "txt"), mimeType: "text/plain;charset=utf-8", label: "Download .txt" },
          };
        } finally {
          void doc.loadingTask.destroy();
        }
      }}
    />
  );
}
