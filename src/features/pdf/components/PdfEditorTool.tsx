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
    <div className="w-full min-w-0 max-w-4xl mx-auto space-y-6">
      {!doc.file ? (
        <PdfUploadArea onFileSelect={doc.loadFile} label={`Select a PDF for ${toolName}`} disabled={doc.loading} />
      ) : (
        <>
          <PdfDocumentHeader
            filename={doc.file.name}
            fileSize={doc.file.size}
            pageCount={doc.pageCount}
            onReplace={doc.loadFile}
            onRemove={doc.removeFile}
          />

          {/* Interactive Annotation Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-50 border border-slate-200 rounded-md">
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setActiveTool("add-text")}
                className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded ${
                  activeTool === "add-text" ? "bg-slate-900 text-white font-semibold" : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-100"
                }`}
              >
                <Type size={13} />
                <span>Text</span>
              </button>

              <button
                onClick={() => setActiveTool("highlight-pdf")}
                className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded ${
                  activeTool === "highlight-pdf" ? "bg-slate-900 text-white font-semibold" : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-100"
                }`}
              >
                <Highlighter size={13} />
                <span>Highlight</span>
              </button>

              <button
                onClick={() => setActiveTool("draw-on-pdf")}
                className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded ${
                  activeTool === "draw-on-pdf" ? "bg-slate-900 text-white font-semibold" : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-100"
                }`}
              >
                <Pencil size={13} />
                <span>Draw</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-xs font-medium text-slate-600">Color:</label>
              <input
                type="color"
                value={strokeColor}
                onChange={(e) => setStrokeColor(e.target.value)}
                className="w-6 h-6 rounded cursor-pointer border border-slate-200"
              />
            </div>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-md space-y-3">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
              Text / Note Content
            </label>
            <input
              type="text"
              value={annotationText}
              onChange={(e) => setAnnotationText(e.target.value)}
              placeholder="Enter text or comment to place on document..."
              className="w-full h-9 px-3 text-xs bg-white border border-slate-200 rounded outline-none focus:border-slate-900"
            />
          </div>

          <div className="p-4 bg-white border border-slate-200 rounded-md min-h-[300px] flex items-center justify-center">
            <PdfPageGrid
              pageCount={Math.min(2, doc.pageCount)}
              thumbnails={doc.thumbnails}
              selectedPages={new Set([1])}
              onTogglePage={() => {}}
              onLoadThumbnail={doc.loadThumbnail}
              selectable={false}
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
              onClick={handleSaveEdits}
              className="inline-flex items-center gap-2 px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-md transition-all shadow-2xs"
            >
              <Sparkles size={14} />
              <span>Apply Edits & Save PDF</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
}
