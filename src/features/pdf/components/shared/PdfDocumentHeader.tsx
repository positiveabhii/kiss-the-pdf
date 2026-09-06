"use client";

import { formatFileSize } from "../../utils/format-file-size";
import { FileText, RefreshCw, X } from "lucide-react";

interface PdfDocumentHeaderProps {
  filename: string;
  fileSize: number;
  pageCount: number;
  onReplace: (file: File) => void;
  onRemove: () => void;
}

export function PdfDocumentHeader({
  filename,
  fileSize,
  pageCount,
  onReplace,
  onRemove,
}: PdfDocumentHeaderProps) {
  const handleReplace = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onReplace(file);
    e.target.value = "";
  };

  return (
    <div className="flex items-start justify-between gap-4 py-3 border-b border-slate-200">
      <div className="flex items-start gap-3 min-w-0">
        <FileText className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" aria-hidden="true" />
        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-900 truncate">{filename}</p>
          <p className="text-xs text-slate-500 mt-0.5">
            {formatFileSize(fileSize)} · {pageCount} {pageCount === 1 ? "page" : "pages"}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <label className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md cursor-pointer transition-colors">
          <RefreshCw className="w-3.5 h-3.5" aria-hidden="true" />
          Replace
          <input type="file" accept="application/pdf" onChange={handleReplace} className="sr-only" />
        </label>
        <button
          type="button"
          onClick={onRemove}
          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
        >
          <X className="w-3.5 h-3.5" aria-hidden="true" />
          Remove
        </button>
      </div>
    </div>
  );
}
