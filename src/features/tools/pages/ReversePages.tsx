"use client";

import { PDFDocument } from "pdf-lib";

import { SimplePdfTool } from "../core/SimplePdfTool";
import { loadPdf, outputName, savePdf } from "../core/pdf-io";
import { Notice } from "../core/ui";

/** Reverse page order: last page first. Reference implementation of a SimplePdfTool. */
export default function ReversePages() {
  return (
    <SimplePdfTool
      actionLabel="Reverse page order"
      processingMessage="Reversing pages…"
      validate={(doc) => (doc.pageCount < 2 ? "This PDF has only one page." : null)}
      options={(doc) => (
        <Notice>
          Page {doc.pageCount} will become page 1, and page 1 will become page {doc.pageCount}.
        </Notice>
      )}
      run={async ({ file, bytes, onProgress }) => {
        const src = await loadPdf(bytes);
        const out = await PDFDocument.create();
        const order = src.getPageIndices().reverse();
        const pages = await out.copyPages(src, order);
        pages.forEach((p, i) => {
          onProgress(i + 1, pages.length);
          out.addPage(p);
        });
        return {
          kind: "file",
          data: await savePdf(out),
          fileName: outputName(file, "reversed"),
          title: "Pages reversed",
          summary: `${pages.length} pages, now in reverse order.`,
        };
      }}
    />
  );
}
