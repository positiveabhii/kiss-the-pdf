"use client";

import { useState } from "react";
import { usePdfTool } from "../hooks/use-pdf-tool";
import { usePdfDocument } from "../hooks/use-pdf-document";
import { usePageSelection } from "../hooks/use-page-selection";
import { pdfService } from "../services/pdf-processing-service";
import { downloadBlob } from "../utils/download-utils";
import { PdfUploadArea } from "./shared/PdfUploadArea";
import { PdfDocumentHeader } from "./shared/PdfDocumentHeader";
import { PdfPageGrid } from "./shared/PdfPageGrid";
import { PageScopeSelector } from "./shared/PageScopeSelector";
import { ToolProcessingState } from "./shared/ToolProcessingState";
import { ToolSuccessState } from "./shared/ToolSuccessState";
import { Trash2 } from "lucide-react";

export function DeletePdfPagesTool() {
  const { state, error, result, startProcessing, setSuccess, setFailed, reset: resetTool } =
    usePdfTool<Uint8Array>();
  const doc = usePdfDocument();
  const selection = usePageSelection(doc.pageCount);

  const handleDelete = async () => {
    if (!doc.pdfBytes || !doc.file) return;

    const pagesToDelete = selection.resolvedPages;
    if (pagesToDelete.length === 0) {
      alert("Please select at least one page to delete.");
      return;
    }

    if (pagesToDelete.length >= doc.pageCount) {
      alert("You cannot delete all pages in the document.");
      return;
    }

    startProcessing();
    try {
      const newPdf = await pdfService.deletePages(doc.pdfBytes, pagesToDelete);
      setSuccess(newPdf);
    } catch (err) {
      setFailed(err);
    }
  };

  const handleDownload = () => {
    if (result && doc.file) {
      downloadBlob(result, `modified-${doc.file.name}`);
    }
  };

  const handleResetAll = () => {
    doc.removeFile();
    selection.reset();
    resetTool();
  };

  if (state === "processing") {
    return <ToolProcessingState message="Deleting selected PDF pages..." />;
  }

  if (state === "success" && result) {
    return (
      <ToolSuccessState
        title="Pages Deleted Successfully"
        description={`${selection.resolvedPages.length} ${selection.resolvedPages.length === 1 ? "page removed" : "pages removed"}. Remaining document page count: ${doc.pageCount - selection.resolvedPages.length}.`}
        primaryAction={{ label: "Download Updated PDF", onClick: handleDownload }}
        secondaryAction={{ label: "Process Another Document", onClick: handleResetAll }}
      />
    );
  }

  return (
    <div className="w-full min-w-0 max-w-3xl mx-auto space-y-6">
      {!doc.file ? (
        <PdfUploadArea onFileSelect={doc.loadFile} label="Select a PDF to delete pages from" disabled={doc.loading} />
      ) : (
        <>
          <PdfDocumentHeader
            filename={doc.file.name}
            fileSize={doc.file.size}
            pageCount={doc.pageCount}
            onReplace={doc.loadFile}
            onRemove={() => {
              doc.removeFile();
              selection.reset();
            }}
          />

          <section className="space-y-3 min-w-0">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Select Pages to Remove
              </h3>
              <span className="text-[11px] text-slate-400">
                Click thumbnails to select pages for deletion
              </span>
            </div>

            <PdfPageGrid
              pageCount={doc.pageCount}
              thumbnails={doc.thumbnails}
              selectedPages={selection.selectedPages}
              onTogglePage={selection.togglePage}
              onLoadThumbnail={doc.loadThumbnail}
            />
          </section>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-md space-y-3">
            <PageScopeSelector
              scope={selection.scope}
              onScopeChange={(s) => {
                selection.setScope(s);
                if (s === "all") selection.selectAll();
              }}
              rangeInput={selection.rangeInput}
              onRangeInputChange={selection.setRangeInput}
              pageCount={doc.pageCount}
              selectedCount={selection.selectedPages.size}
            />
          </div>

          {error && (
            <p className="text-xs font-medium text-red-600 bg-red-50 border border-red-200 p-2.5 rounded" role="alert">
              {error.message}
            </p>
          )}

          <div className="pt-2 flex justify-end">
            <button
              type="button"
              onClick={handleDelete}
              disabled={selection.resolvedPages.length === 0 || selection.resolvedPages.length >= doc.pageCount}
              className="inline-flex items-center gap-2 px-5 py-2 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-200 disabled:text-slate-400 text-white text-xs font-semibold rounded-md transition-all shadow-2xs"
            >
              <Trash2 size={14} />
              <span>Delete {selection.resolvedPages.length} Pages</span>
            </button>
          </div>
        </>
      )}

      {doc.loading && <p className="text-xs font-mono text-slate-500 text-center py-4">Reading document pages…</p>}
      {doc.error && (
        <p className="text-xs font-medium text-red-600 text-center py-4" role="alert">
          {doc.error}
        </p>
      )}
    </div>
  );
}
