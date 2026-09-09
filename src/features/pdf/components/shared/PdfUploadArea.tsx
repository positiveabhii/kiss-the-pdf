"use client";

import { Upload, FileUp } from "lucide-react";

interface PdfUploadAreaProps {
  onFileSelect: (file: File) => void;
  accept?: string;
  label?: string;
  disabled?: boolean;
}

export function PdfUploadArea({
  onFileSelect,
  accept = "application/pdf",
  label = "Select PDF File",
  disabled = false,
}: PdfUploadAreaProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) onFileSelect(selected);
    e.target.value = "";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled) return;
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      onFileSelect(droppedFile);
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className={`relative flex flex-col items-center justify-center w-full py-10 px-6 border border-dashed border-slate-300 rounded-lg bg-slate-50/50 hover:bg-slate-50/90 hover:border-slate-400 transition-all ${
        disabled ? "opacity-50 pointer-events-none" : "cursor-pointer group"
      }`}
    >
      <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer">
        <div className="p-3 bg-white border border-slate-200 rounded-md shadow-2xs text-slate-500 group-hover:text-slate-900 group-hover:border-slate-300 transition-colors mb-3">
          <FileUp className="w-5 h-5" aria-hidden="true" />
        </div>

        <div className="text-center space-y-1">
          <p className="text-sm font-semibold text-slate-800 group-hover:text-slate-900">
            {label}
          </p>
          <p className="text-xs text-slate-500">
            Drag and drop your PDF here, or click to browse
          </p>
        </div>

        <div className="mt-4 px-3 py-1.5 bg-white border border-slate-200 text-slate-700 font-medium text-xs rounded-md group-hover:bg-slate-100/80 group-hover:border-slate-300 transition-colors shadow-2xs">
          Choose file
        </div>

        <span className="text-[11px] text-slate-400 mt-3 font-mono">
          PDF format · Local processing
        </span>

        <input
          type="file"
          accept={accept}
          onChange={handleChange}
          disabled={disabled}
          className="sr-only"
        />
      </label>
    </div>
  );
}
