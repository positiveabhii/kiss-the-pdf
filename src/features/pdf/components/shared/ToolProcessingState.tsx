"use client";

interface ToolProcessingStateProps {
  message: string;
  progress?: { current: number; total: number };
}

export function ToolProcessingState({ message, progress }: ToolProcessingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-8 h-8 border-2 border-slate-300 border-t-slate-700 rounded-full animate-spin mb-4" />
      <p className="text-sm font-medium text-slate-700">{message}</p>
      {progress && (
        <p className="text-xs text-slate-500 mt-2">
          Page {progress.current} of {progress.total}
        </p>
      )}
    </div>
  );
}
