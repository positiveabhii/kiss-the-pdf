"use client";

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
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <p className="text-base font-medium text-slate-900 mb-1">{title}</p>
      {description && <p className="text-sm text-slate-600 mb-6">{description}</p>}
      {children}
      <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
        <button
          type="button"
          onClick={primaryAction.onClick}
          className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium rounded-md transition-colors"
        >
          {primaryAction.label}
        </button>
        {secondaryAction && (
          <button
            type="button"
            onClick={secondaryAction.onClick}
            className="px-5 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-sm font-medium rounded-md transition-colors"
          >
            {secondaryAction.label}
          </button>
        )}
      </div>
    </div>
  );
}
