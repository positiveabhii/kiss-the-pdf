"use client";

import { SimplePdfTool } from "../core/SimplePdfTool";
import { outputName } from "../core/pdf-io";
import { Notice } from "../core/ui";
import { keepPages, oddEvenIndices } from "./ops/select";

/** Shared by extract-odd-pages and extract-even-pages. */
export function ExtractOddEven({ which }: { which: "odd" | "even" }) {
  const pagesList = (n: number) =>
    oddEvenIndices(n, which)
      .slice(0, 6)
      .map((i) => i + 1)
      .join(", ") + (oddEvenIndices(n, which).length > 6 ? ", …" : "");
  return (
    <SimplePdfTool
      actionLabel={`Extract ${which} pages`}
      processingMessage={`Extracting ${which} pages…`}
      validate={(doc) => {
        if (doc.pageCount < 2) {
          return which === "even"
            ? "This PDF has only one page, so it has no even pages."
            : "This PDF has only one page — its odd pages are the whole document.";
        }
        return null;
      }}
      options={(doc) =>
        doc.pageCount < 2 ? (
          <Notice tone="warning">
            {which === "even"
              ? "This PDF has only one page (page 1, an odd page). There are no even pages to extract."
              : "This PDF has only one page, so extracting the odd pages would give you the same file back."}
          </Notice>
        ) : (
          <Notice>
            The new PDF will contain the {oddEvenIndices(doc.pageCount, which).length} {which} pages
            (pages {pagesList(doc.pageCount)}) of {doc.pageCount}, in their original order.
          </Notice>
        )
      }
      run={async ({ file, bytes, pageCount, onProgress }) => {
        const keep = oddEvenIndices(pageCount, which);
        onProgress(0, 1);
        const data = await keepPages(bytes, keep);
        onProgress(1, 1);
        return {
          kind: "file",
          data,
          fileName: outputName(file, `${which}-pages`),
          title: `${which === "odd" ? "Odd" : "Even"} pages extracted`,
          summary: `${keep.length} of ${pageCount} pages kept.`,
        };
      }}
    />
  );
}
