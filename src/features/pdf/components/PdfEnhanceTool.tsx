"use client";

import { useState } from "react";
import { usePdfTool } from "../hooks/use-pdf-tool";
import { usePdfDocument } from "../hooks/use-pdf-document";
import { downloadBlob } from "../utils/download-utils";
import { PdfUploadArea } from "./shared/PdfUploadArea";
import { PdfDocumentHeader } from "./shared/PdfDocumentHeader";
import { ToolProcessingState } from "./shared/ToolProcessingState";
import { ToolSuccessState } from "./shared/ToolSuccessState";
import { Sparkles, Droplets, Link as LinkIcon, QrCode } from "lucide-react";

interface PdfEnhanceToolProps {
  toolId: string;
  toolName: string;
}

export function PdfEnhanceTool({ toolId, toolName }: PdfEnhanceToolProps) {
  const { state, error, result, startProcessing, setSuccess, setFailed, reset: resetTool } =
    usePdfTool<Uint8Array>();
  const doc = usePdfDocument();

  const [textInput, setTextInput] = useState("CONFIDENTIAL");
  const [position, setPosition] = useState("bottom-center");

  const handleEnhance = async () => {
    if (!doc.pdfBytes || !doc.file) return;

    startProcessing();
    try {
      const { PDFDocument, rgb, StandardFonts } = await import("pdf-lib");
      const pdfDoc = await PDFDocument.load(doc.pdfBytes);
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

      if (toolId.includes("watermark")) {
        const pages = pdfDoc.getPages();
        for (const page of pages) {
          page.drawText(textInput, {
            x: page.getWidth() / 4,
            y: page.getHeight() / 2,
            size: 36,
            font,
            color: rgb(0.8, 0.8, 0.8),
            opacity: 0.4,
          });
        }
      } else if (toolId.includes("numbers") || toolId.includes("page-numbers")) {
        const pages = pdfDoc.getPages();
        pages.forEach((page, idx) => {
          page.drawText(`Page ${idx + 1} of ${pages.length}`, {
            x: page.getWidth() / 2 - 30,
            y: 20,
            size: 10,
            font,
            color: rgb(0.3, 0.3, 0.3),
          });
        });
      }

      const savedBytes = await pdfDoc.save();
      setSuccess(savedBytes);
    } catch (err) {
      setFailed(err);
    }
  };

  const handleDownload = () => {
    if (result && doc.file) {
      downloadBlob(result, `enhanced-${doc.file.name}`);
    }
  };

  if (state === "processing") {
    return <ToolProcessingState message={`Applying ${toolName} enhancement to PDF…`} />;
  }

  if (state === "success" && result) {
    return (
      <ToolSuccessState
        title="Document Enhancement Complete"
        description="Your page numbers, watermarks, or link structure have been added."
        primaryAction={{ label: "Download Enhanced PDF", onClick: handleDownload }}
        secondaryAction={{ label: "Enhance Another File", onClick: () => { doc.removeFile(); resetTool(); } }}
      />
    );
  }

  return (
    <div className="w-full min-w-0 max-w-3xl mx-auto space-y-6">
      {!doc.file ? (
        <PdfUploadArea onFileSelect={doc.loadFile} label={`Select PDF for ${toolName}`} disabled={doc.loading} />
      ) : (
        <>
          <PdfDocumentHeader
            filename={doc.file.name}
            fileSize={doc.file.size}
            pageCount={doc.pageCount}
            onReplace={doc.loadFile}
            onRemove={doc.removeFile}
          />

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-md space-y-4">
            <div>
              <label htmlFor="enhance-text" className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                Text / Stamp Value
              </label>
              <input
                id="enhance-text"
                type="text"
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="Enter text value..."
                className="w-full h-9 px-3 text-xs bg-white border border-slate-200 rounded outline-none focus:border-slate-900"
              />
            </div>
          </div>

          {error && (
            <p className="text-xs font-medium text-red-600 bg-red-50 border border-red-200 p-2.5 rounded" role="alert">
              {error.message}
            </p>
          )}

          <div className="pt-2 flex justify-end">
            <button
              type="button"
              onClick={handleEnhance}
              className="inline-flex items-center gap-2 px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-md transition-all shadow-2xs"
            >
              <Sparkles size={14} />
              <span>Apply {toolName}</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
}
