"use client";

import { useState } from "react";
import { usePdfTool } from "../hooks/use-pdf-tool";
import { usePdfDocument } from "../hooks/use-pdf-document";
import { downloadBlob } from "../utils/download-utils";
import { PdfUploadArea } from "./shared/PdfUploadArea";
import { PdfDocumentHeader } from "./shared/PdfDocumentHeader";
import { PdfPageGrid } from "./shared/PdfPageGrid";
import { ToolProcessingState } from "./shared/ToolProcessingState";
import { ToolSuccessState } from "./shared/ToolSuccessState";
import { Pencil, Type, Image as ImageIcon, Highlighter, Square, Circle, Sparkles } from "lucide-react";

interface PdfEditorToolProps {
  toolId: string;
  toolName: string;
}

export function PdfEditorTool({ toolId, toolName }: PdfEditorToolProps) {
  const { state, error, result, startProcessing, setSuccess, setFailed, reset: resetTool } =
    usePdfTool<Uint8Array>();
  const doc = usePdfDocument();

  const [activeTool, setActiveTool] = useState<string>(toolId);
  const [annotationText, setAnnotationText] = useState<string>("Sample Note");
  const [strokeColor, setStrokeColor] = useState<string>("#c2410c");

  const handleSaveEdits = async () => {
    if (!doc.pdfBytes || !doc.file) return;

    startProcessing();
    try {
      const { PDFDocument, rgb } = await import("pdf-lib");
      const pdfDoc = await PDFDocument.load(doc.pdfBytes);
      const pages = pdfDoc.getPages();
      const firstPage = pages[0];

      if (firstPage && annotationText.trim()) {
        firstPage.drawText(annotationText, {
          x: 50,
          y: firstPage.getHeight() - 100,
          size: 18,
          color: rgb(0.76, 0.25, 0.05),
        });
      }

      const modifiedBytes = await pdfDoc.save();
      setSuccess(modifiedBytes);
    } catch (err) {
      setFailed(err);
    }
  };

  const handleDownload = () => {
    if (result && doc.file) {
      downloadBlob(result, `edited-${doc.file.name}`);
    }
  };

  if (state === "processing") {
    return <ToolProcessingState message={`Applying ${toolName} edits to PDF…`} />;
  }

  if (state === "success" && result) {
    return (
      <ToolSuccessState
        title="PDF Edits Applied"
        description="Your text annotations and drawing markups have been saved onto the PDF."
        primaryAction={{ label: "Download Edited PDF", onClick: handleDownload }}
        secondaryAction={{ label: "Edit Another File", onClick: () => { doc.removeFile(); resetTool(); } }}
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
