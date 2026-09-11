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
      // Logic for PDF form actions commented out as per user request.
      // const { PDFDocument } = await import("pdf-lib");
      // const pdfDoc = await PDFDocument.load(doc.pdfBytes);

      // if (toolId === "flatten-pdf-form") {
      //   const form = pdfDoc.getForm();
      //   form.flatten();
      // }

      // const savedBytes = await pdfDoc.save();
      // setSuccess(savedBytes);
      setFailed(new Error("PDF form processing logic has been removed."));
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
      <div className="p-4 bg-slate-50 border border-slate-200 rounded-md space-y-4 text-center">
        <p className="text-sm font-medium text-slate-700">This feature needs to be developed.</p>
      </div>
    </div>
  );
}
