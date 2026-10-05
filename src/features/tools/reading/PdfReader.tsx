"use client";

import { Notice } from "../core/ui";
import { ReaderView } from "./viewer/ReaderView";
import { ViewerShell } from "./viewer/ViewerShell";

/** Read a PDF: thumbnails, continuous scroll, zoom, selectable text. */
export default function PdfReader() {
  return (
    <ViewerShell
      intro={
        <Notice>
          Opens right here in your browser. Shortcuts: ← → pages, Home / End first and last page, + / − zoom, 0 fit
          width.
        </Notice>
      }
    >
      {({ doc, file, openAnother }) => <ReaderView doc={doc} fileName={file.name} openAnother={openAnother} />}
    </ViewerShell>
  );
}
