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
      <div className="p-4 bg-slate-50 border border-slate-200 rounded-md space-y-4 text-center">
        <p className="text-sm font-medium text-slate-700">This feature needs to be developed.</p>
      </div>
    </div>
  );
}
