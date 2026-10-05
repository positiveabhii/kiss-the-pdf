"use client";

import { SimplePdfTool } from "../core/SimplePdfTool";
import { outputName } from "../core/pdf-io";
import { PageSelectGrid } from "./components/PageSelectGrid";
import { usePerFileState } from "./components/usePerFileState";
import { extractPages } from "./ops/pages";
import { formatPageList } from "./ops/ranges";

const NONE = new Set<number>();

/** Pick pages (thumbnails or a range) → one new PDF with just those pages, in document order. */
export default function ExtractPdfPages() {
  const selection = usePerFileState<Set<number>>();

  return (
    <SimplePdfTool
      preview
      actionLabel="Extract pages"
      processingMessage="Extracting pages…"
      onReset={selection.reset}
      validate={(doc) =>
        selection.get(doc.file, NONE).size === 0 ? "Select the pages you want to keep." : null
      }
      options={(doc) => (
        <PageSelectGrid
          key={doc.file.name + doc.file.lastModified}
          label="Pages to extract"
          pdfjs={doc.pdfjs}
          pageCount={doc.pageCount}
          selected={selection.get(doc.file, NONE)}
          onChange={(next) => selection.set(doc.file, next)}
        />
      )}
      run={async ({ file, bytes, onProgress, signal }) => {
        const pages = Array.from(selection.get(file, NONE));
        const { data, pageCount } = await extractPages(bytes, pages, { onProgress, signal });
        return {
          kind: "file",
          data,
          fileName: outputName(file, "extracted"),
          title: "Pages extracted",
          summary: `${pageCount} page${pageCount === 1 ? "" : "s"} (${formatPageList(pages)}) in a new PDF.`,
        };
      }}
    />
  );
}
