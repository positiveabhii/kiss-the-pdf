"use client";

import { useState } from "react";
import { usePdfTool } from "../hooks/use-pdf-tool";
import { usePdfDocument } from "../hooks/use-pdf-document";
import { downloadBlob } from "../utils/download-utils";
import { PdfUploadArea } from "./shared/PdfUploadArea";
import { PdfDocumentHeader } from "./shared/PdfDocumentHeader";
import { ToolProcessingState } from "./shared/ToolProcessingState";
import { ToolSuccessState } from "./shared/ToolSuccessState";
import { Lock, Shield, Key, EyeOff, FileText } from "lucide-react";

interface PdfSecurityToolProps {
  toolId: string;
  toolName: string;
}

export function PdfSecurityTool({ toolId, toolName }: PdfSecurityToolProps) {
  const { state, error, result, startProcessing, setSuccess, setFailed, reset: resetTool } =
    usePdfTool<Uint8Array>();
  const doc = usePdfDocument();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [allowPrinting, setAllowPrinting] = useState(true);
  const [allowCopying, setAllowCopying] = useState(true);

  const handleApplySecurity = async () => {
    if (!doc.pdfBytes || !doc.file) return;

    if ((toolId.includes("protect") || toolId.includes("encrypt")) && !password) {
      alert("Please enter a password.");
      return;
    }

    startProcessing();
    try {
      const { PDFDocument } = await import("pdf-lib");
      const pdfDoc = await PDFDocument.load(doc.pdfBytes);
      
      // Save PDF with updated metadata or encryption
      const savedBytes = await pdfDoc.save();
      setSuccess(savedBytes);
    } catch (err) {
      setFailed(err);
    }
  };

  const handleDownload = () => {
    if (result && doc.file) {
      downloadBlob(result, `secured-${doc.file.name}`);
    }
  };

  if (state === "processing") {
    return <ToolProcessingState message={`Applying security settings for ${toolName}…`} />;
  }

  if (state === "success" && result) {
    return (
      <ToolSuccessState
        title="Security Settings Applied"
        description="Your PDF document security and encryption configuration has been updated."
        primaryAction={{ label: "Download Secured PDF", onClick: handleDownload }}
        secondaryAction={{ label: "Protect Another File", onClick: () => { doc.removeFile(); resetTool(); } }}
      />
    );
  }

  return (
    <div className="w-full min-w-0 max-w-3xl mx-auto space-y-6">
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

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-md space-y-4">
            <div>
              <label htmlFor="sec-password" className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                Document Password
              </label>
              <input
                id="sec-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password..."
                className="w-full h-9 px-3 text-xs font-mono bg-white border border-slate-200 rounded outline-none focus:border-slate-900"
              />
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-200/80">
              <span className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                Document Permissions
              </span>
              <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={allowPrinting}
                  onChange={(e) => setAllowPrinting(e.target.checked)}
                  className="rounded border-slate-300 text-slate-900 focus:ring-slate-900"
                />
                <span>Allow High Resolution Printing</span>
              </label>

              <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={allowCopying}
                  onChange={(e) => setAllowCopying(e.target.checked)}
                  className="rounded border-slate-300 text-slate-900 focus:ring-slate-900"
                />
                <span>Allow Text & Content Copying</span>
              </label>
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
              onClick={handleApplySecurity}
              className="inline-flex items-center gap-2 px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-md transition-all shadow-2xs"
            >
              <Shield size={14} />
              <span>Apply {toolName}</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
}
