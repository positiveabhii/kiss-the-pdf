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
      // Logic for PDF security actions commented out as per user request.
      // const { PDFDocument } = await import("pdf-lib");
      // const pdfDoc = await PDFDocument.load(doc.pdfBytes);
      
      // // Save PDF with updated metadata or encryption
      // const savedBytes = await pdfDoc.save();
      // setSuccess(savedBytes);
      setFailed(new Error("PDF security logic has been removed."));
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
      <div className="p-4 bg-slate-50 border border-slate-200 rounded-md space-y-4 text-center">
        <p className="text-sm font-medium text-slate-700">This feature needs to be developed.</p>
      </div>
    </div>
  );
}
