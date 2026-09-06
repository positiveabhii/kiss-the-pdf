"use client";

import { Upload } from "lucide-react";

interface PdfUploadAreaProps {
  onFileSelect: (file: File) => void;
  accept?: string;
  label?: string;
  disabled?: boolean;
}

export function PdfUploadArea({
  onFileSelect,
  accept = "application/pdf",
  label = "Select PDF",
  disabled = false,
}: PdfUploadAreaProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) onFileSelect(selected);
    e.target.value = "";
  };

  return (
    <label
      className={`flex flex-col items-center justify-center w-full py-10 px-6 border-2 border-dashed border-slate-300 rounded-xl bg-slate-50 cursor-pointer transition-colors hover:border-slate-400 hover:bg-slate-100/80 ${
        disabled ? "opacity-50 pointer-events-none" : ""
      }`}
    >
      <Upload className="w-8 h-8 text-slate-400 mb-3" aria-hidden="true" />
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <span className="text-xs text-slate-500 mt-1">PDF files only</span>
      <input
        type="file"
        accept={accept}
        onChange={handleChange}
        disabled={disabled}
        className="sr-only"
      />
    </label>
  );
}
