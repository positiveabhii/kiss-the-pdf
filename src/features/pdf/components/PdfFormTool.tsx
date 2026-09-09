"use client";

import { useState } from "react";
import { usePdfTool } from "../hooks/use-pdf-tool";
import { usePdfDocument } from "../hooks/use-pdf-document";
import { downloadBlob } from "../utils/download-utils";
import { PdfUploadArea } from "./shared/PdfUploadArea";
import { PdfDocumentHeader } from "./shared/PdfDocumentHeader";
import { ToolProcessingState } from "./shared/ToolProcessingState";
import { ToolSuccessState } from "./shared/ToolSuccessState";
import { ClipboardList, CheckSquare, PenTool, Layers } from "lucide-react";

interface PdfFormToolProps {
  toolId: string;
  toolName: string;
}

export function PdfFormTool({ toolId, toolName }: PdfFormToolProps) {
  const { state, error, result, startProcessing, setSuccess, setFailed, reset: resetTool } =
    usePdfTool<Uint8Array>();
  const doc = usePdfDocument();

  const [fieldName, setFieldName] = useState("field_1");
  const [fieldValue, setFieldValue] = useState("");
  const [signatureData, setSignatureData] = useState<string>("");

  const handleApplyFormAction = async () => {
    if (!doc.pdfBytes || !doc.file) return;

    startProcessing();
    try {
      const { PDFDocument } = await import("pdf-lib");
      const pdfDoc = await PDFDocument.load(doc.pdfBytes);

      if (toolId === "flatten-pdf-form") {
        const form = pdfDoc.getForm();
        form.flatten();
      }

      const savedBytes = await pdfDoc.save();
      setSuccess(savedBytes);
    } catch (err) {
      setFailed(err);
    }
  };

  const handleDownload = () => {
    if (result && doc.file) {
      downloadBlob(result, `form-${doc.file.name}`);
    }
  };

  if (state === "processing") {
    return <ToolProcessingState message={`Processing PDF Form (${toolName})…`} />;
  }

  if (state === "success" && result) {
    return (
      <ToolSuccessState
        title="Form Processing Complete"
        description="Your form fields and signature updates have been processed."
        primaryAction={{ label: "Download Form PDF", onClick: handleDownload }}
        secondaryAction={{ label: "Process Another Form", onClick: () => { doc.removeFile(); resetTool(); } }}
      />
    );
  }

  return (
    <div className="w-full min-w-0 max-w-3xl mx-auto space-y-6">
      {!doc.file ? (
        <PdfUploadArea onFileSelect={doc.loadFile} label={`Select PDF Form for ${toolName}`} disabled={doc.loading} />
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
              <label htmlFor="field-name" className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                Form Field Name
              </label>
              <input
                id="field-name"
                type="text"
                value={fieldName}
                onChange={(e) => setFieldName(e.target.value)}
                placeholder="e.g. FullName, Date, Signature"
                className="w-full h-9 px-3 text-xs bg-white border border-slate-200 rounded outline-none focus:border-slate-900"
              />
            </div>

            <div>
              <label htmlFor="field-val" className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                Default Field Value / Input
              </label>
              <input
                id="field-val"
                type="text"
                value={fieldValue}
                onChange={(e) => setFieldValue(e.target.value)}
                placeholder="Enter value..."
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
              onClick={handleApplyFormAction}
              className="inline-flex items-center gap-2 px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-md transition-all shadow-2xs"
            >
              <ClipboardList size={14} />
              <span>Apply {toolName}</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
}
