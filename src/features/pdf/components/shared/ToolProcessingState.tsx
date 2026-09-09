"use client";

import { Loader2 } from "lucide-react";

interface ToolProcessingStateProps {
  message: string;
  progress?: { current: number; total: number };
}

export function ToolProcessingState({ message, progress }: ToolProcessingStateProps) {
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
    </div>
  );
}
