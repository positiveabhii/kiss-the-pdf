"use client";

import { formatFileSize } from "../../utils/format-file-size";
import { FileText, RefreshCw, Trash2 } from "lucide-react";

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
    <div className="flex items-center justify-between gap-3 p-3 bg-slate-50 border border-slate-200 rounded-md">
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="p-2 bg-white border border-slate-200 rounded text-slate-600 shrink-0 shadow-2xs">
          <FileText className="w-4 h-4" aria-hidden="true" />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-semibold text-slate-900 truncate">{filename}</p>
          <p className="text-[11px] font-mono text-slate-500 mt-0.5">
            {formatFileSize(fileSize)} · {pageCount} {pageCount === 1 ? "page" : "pages"}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1.5 shrink-0">
        <label className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 hover:border-slate-300 rounded cursor-pointer transition-colors shadow-2xs">
          <RefreshCw className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
          <span>Replace</span>
          <input type="file" accept="application/pdf" onChange={handleReplace} className="sr-only" />
        </label>
        <button
          type="button"
          onClick={onRemove}
          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5 text-slate-400 hover:text-red-600" aria-hidden="true" />
          <span>Remove</span>
        </button>
      </div>
    </div>
  );
}
