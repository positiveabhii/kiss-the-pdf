"use client";

import { CheckCircle2, Download, RotateCcw } from "lucide-react";

interface ToolSuccessStateProps {
  title: string;
  description?: string;
  primaryAction: { label: string; onClick: () => void };
  secondaryAction?: { label: string; onClick: () => void };
  children?: React.ReactNode;
}

export function ToolSuccessState({
  title,
  description,
  primaryAction,
  secondaryAction,
  children,
}: ToolSuccessStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center max-w-lg mx-auto">
      <div className="p-3 bg-emerald-50 border border-emerald-200/80 rounded-md text-emerald-600 mb-4 shadow-2xs">
        <CheckCircle2 className="w-6 h-6" />
      </div>

      <h3 className="text-base font-bold text-slate-900 mb-1">{title}</h3>
      {description && <p className="text-xs text-slate-500 mb-5">{description}</p>}

      {children}

      <div className="flex flex-wrap items-center justify-center gap-2.5 mt-6 w-full">
        <button
          type="button"
          onClick={primaryAction.onClick}
          className="inline-flex items-center justify-center gap-2 px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-md transition-all shadow-2xs hover:shadow-xs active:translate-y-0.5"
        >
          <Download size={14} />
          <span>{primaryAction.label}</span>
        </button>

        {secondaryAction && (
          <button
            type="button"
            onClick={secondaryAction.onClick}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-medium rounded-md transition-colors shadow-2xs"
          >
            <RotateCcw size={13} className="text-slate-400" />
            <span>{secondaryAction.label}</span>
          </button>
        )}
      </div>
    </div>
  );
}
