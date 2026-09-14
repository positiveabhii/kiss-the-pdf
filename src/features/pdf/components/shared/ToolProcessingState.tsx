"use client";

import { Loader2, X } from "lucide-react";

interface ToolProcessingStateProps {
  message: string;
  progress?: { current: number; total: number };
  onCancel?: () => void;
}

export function ToolProcessingState({ message, progress, onCancel }: ToolProcessingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="p-3 bg-slate-50 border border-slate-200 rounded-md mb-4 shadow-2xs">
        <Loader2 className="w-6 h-6 text-slate-700 animate-spin" />
      </div>
      <p className="text-sm font-semibold text-slate-900">{message}</p>
      {progress ? (
        <p className="text-xs font-mono text-slate-500 mt-1.5">
          Processing page {progress.current} of {progress.total}
        </p>
      ) : (
        <p className="text-xs text-slate-400 mt-1 font-mono">Running local WASM/JS engine...</p>
      )}
      {onCancel && (
        <button
          type="button"
          onClick={onCancel}
          className="mt-6 inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-red-700 bg-red-50 border border-red-200 hover:bg-red-100 rounded-md transition-colors"
        >
          <X size={13} />
          Cancel
        </button>
      )}
    </div>
  );
}
