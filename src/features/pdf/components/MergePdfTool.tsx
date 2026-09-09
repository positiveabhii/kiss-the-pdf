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
      const buffers = await Promise.all(files.map((f) => f.arrayBuffer()));
      const uint8Arrays = buffers.map((b) => new Uint8Array(b));

      const mergedPdf = await pdfService.merge(uint8Arrays);
      setSuccess(mergedPdf);
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
    <div className="space-y-6 max-w-3xl mx-auto">
      {files.length === 0 ? (
        <PdfUploadArea
          onFileSelect={handleFileSelect}
          label="Select PDF files to merge"
        />
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Selected Documents ({files.length})
            </h3>
            <label className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded cursor-pointer transition-colors shadow-2xs">
              <Plus size={14} className="text-slate-500" />
              <span>Add more PDFs</span>
              <input
                type="file"
                multiple
                accept="application/pdf"
                onChange={handleMultipleFiles}
                className="sr-only"
              />
            </label>
          </div>

          <div className="space-y-2">
            {files.map((file, i) => (
              <div
                key={`${file.name}-${i}`}
                className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-md group hover:border-slate-300 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="w-5 h-5 rounded bg-slate-200 text-slate-700 text-[10px] font-mono font-bold flex items-center justify-center shrink-0">
                    {i + 1}
                  </span>
                  <div className="p-1.5 bg-white border border-slate-200 rounded text-slate-500 shrink-0">
                    <FileText size={16} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-slate-900 truncate">{file.name}</p>
                    <p className="text-[11px] font-mono text-slate-500">{formatFileSize(file.size)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0 ml-2">
                  <button
                    type="button"
                    onClick={() => moveUp(i)}
                    disabled={i === 0}
                    className="p-1 text-slate-400 hover:text-slate-700 hover:bg-white rounded disabled:opacity-20 transition-colors"
                    title="Move up"
                  >
                    <ArrowUp size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveDown(i)}
                    disabled={i === files.length - 1}
                    className="p-1 text-slate-400 hover:text-slate-700 hover:bg-white rounded disabled:opacity-20 transition-colors"
                    title="Move down"
                  >
                    <ArrowDown size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeFile(i)}
                    className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors ml-1"
                    title="Remove file"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {error && (
            <p className="text-xs font-medium text-red-600 bg-red-50 border border-red-200 p-2.5 rounded">
              {error.message}
            </p>
          )}

          <div className="pt-2 flex items-center justify-between gap-4">
            <span className="text-xs text-slate-500 font-mono">
              {files.length >= 2 ? "Ready to combine" : "Select at least 2 files to merge"}
            </span>

            <button
              type="button"
              onClick={handleMerge}
              disabled={files.length < 2}
              className="px-5 py-2 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white text-xs font-semibold rounded-md transition-all shadow-2xs"
            >
              Merge {files.length} PDFs
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
