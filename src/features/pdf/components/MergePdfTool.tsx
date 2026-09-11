"use client";

import { useState } from "react";
import { ArrowUp, ArrowDown, Trash2, Plus, FileText } from "lucide-react";
import { usePdfTool } from "../hooks/use-pdf-tool";
import { pdfService } from "../services/pdf-processing-service";
import { downloadBlob } from "../utils/download-utils";
import { formatFileSize } from "../utils/format-file-size";
import { PdfUploadArea } from "./shared/PdfUploadArea";
import { ToolProcessingState } from "./shared/ToolProcessingState";
import { ToolSuccessState } from "./shared/ToolSuccessState";

export function MergePdfTool() {
  const { state, error, result, startProcessing, setSuccess, setFailed, reset } = usePdfTool<Uint8Array>();
  const [files, setFiles] = useState<File[]>([]);

  const handleFileSelect = (newFile: File) => {
    setFiles((prev) => [...prev, newFile]);
  };

  const handleMultipleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles((prev) => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    setFiles((prev) => {
      const newFiles = [...prev];
      const temp = newFiles[index];
      newFiles[index] = newFiles[index - 1];
      newFiles[index - 1] = temp;
      return newFiles;
    });
  };

  const moveDown = (index: number) => {
    if (index === files.length - 1) return;
    setFiles((prev) => {
      const newFiles = [...prev];
      const temp = newFiles[index];
      newFiles[index] = newFiles[index + 1];
      newFiles[index + 1] = temp;
      return newFiles;
    });
  };

  const handleMerge = async () => {
    if (files.length < 2) return;

    startProcessing();
    try {
      // Logic for merging PDFs commented out as per user request.
      // const buffers = await Promise.all(files.map((f) => f.arrayBuffer()));
      // const uint8Arrays = buffers.map((b) => new Uint8Array(b));
      // const mergedPdf = await pdfService.merge(uint8Arrays);
      // setSuccess(mergedPdf);
      setFailed(new Error("PDF merging logic has been removed."));
    } catch (err) {
      setFailed(err);
    }
  };

  const handleDownload = () => {
    if (result) {
      downloadBlob(result, "merged-document.pdf");
    }
  };

  const handleReset = () => {
    setFiles([]);
    reset();
  };

  if (state === "processing") {
    return <ToolProcessingState message="Merging PDF files..." />;
  }

  if (state === "success" && result) {
    return (
      <ToolSuccessState
        title="PDFs Merged Successfully"
        description={`${files.length} documents combined into one unified PDF file.`}
        primaryAction={{ label: "Download Merged PDF", onClick: handleDownload }}
        secondaryAction={{ label: "Merge More Files", onClick: handleReset }}
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
