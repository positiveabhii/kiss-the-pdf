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
import { FileOutput } from "lucide-react";

export function ExtractPdfPagesTool() {
  const { state, error, result, startProcessing, setSuccess, setFailed, reset: resetTool } =
    usePdfTool<Uint8Array>();
  const doc = usePdfDocument();
  const selection = usePageSelection(doc.pageCount);

  const handleExtract = async () => {
    if (!doc.pdfBytes || !doc.file) return;

    const pagesToExtract = selection.resolvedPages;
    if (pagesToExtract.length === 0) {
      alert("Please select at least one page to extract.");
      return;
    }

    startProcessing();
    try {
      const newPdf = await pdfService.extractPages(doc.pdfBytes, pagesToExtract);
      setSuccess(newPdf);
    } catch (err) {
      setFailed(err);
    }
  };

  const handleDownload = () => {
    if (result && doc.file) {
      downloadBlob(result, `extracted-${doc.file.name}`);
    }
  };

  const handleResetAll = () => {
    doc.removeFile();
    selection.reset();
    resetTool();
  };

  if (state === "processing") {
    return <ToolProcessingState message="Extracting selected pages into new PDF..." />;
  }

  if (state === "success" && result) {
    return (
      <ToolSuccessState
        title="Pages Extracted Successfully"
        description={`${selection.resolvedPages.length} ${selection.resolvedPages.length === 1 ? "page" : "pages"} extracted into a new PDF document.`}
        primaryAction={{ label: "Download Extracted PDF", onClick: handleDownload }}
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
