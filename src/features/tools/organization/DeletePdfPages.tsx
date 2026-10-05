"use client";

import { SimplePdfTool } from "../core/SimplePdfTool";
import { outputName } from "../core/pdf-io";
import { Notice } from "../core/ui";
import { PageSelectGrid } from "./components/PageSelectGrid";
import { usePerFileState } from "./components/usePerFileState";
import { deletePages } from "./ops/pages";
import { formatPageList } from "./ops/ranges";

const NONE = new Set<number>();

/** Pick pages → the same PDF without them. Deleting every page is refused. */
export default function DeletePdfPages() {
  const selection = usePerFileState<Set<number>>();

  return (
    <SimplePdfTool
      preview
      actionLabel="Delete selected pages"
      processingMessage="Removing pages…"
      onReset={selection.reset}
      validate={(doc) => {
        const n = selection.get(doc.file, NONE).size;
        if (n === 0) return "Select the pages you want to delete.";
        if (n >= doc.pageCount) return "You can't delete every page — leave at least one.";
        return null;
      }}
      options={(doc) => {
        const selected = selection.get(doc.file, NONE);
        return (
          <>
            <PageSelectGrid
              key={doc.file.name + doc.file.lastModified}
              label="Pages to delete"
              pdfjs={doc.pdfjs}
              pageCount={doc.pageCount}
              selected={selected}
              onChange={(next) => selection.set(doc.file, next)}
            />
            {selected.size > 0 && selected.size < doc.pageCount && (
              <Notice>
                {selected.size} page{selected.size === 1 ? "" : "s"} will be removed; {doc.pageCount - selected.size} will remain.
              </Notice>
            )}
          </>
        );
      }}
      run={async ({ file, bytes, onProgress, signal }) => {
        const pages = Array.from(selection.get(file, NONE));
        const { data, pageCount } = await deletePages(bytes, pages, { onProgress, signal });
        return {
          kind: "file",
          data,
          fileName: outputName(file, "pages-removed"),
          title: "Pages deleted",
          summary: `Removed page${pages.length === 1 ? "" : "s"} ${formatPageList(pages)}. ${pageCount} page${pageCount === 1 ? "" : "s"} left.`,
        };
      }}
    />
  );
}
