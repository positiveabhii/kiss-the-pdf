"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { ToolProcessingState } from "@/features/pdf/components/shared/ToolProcessingState";

import { UserFacingError } from "../../core/pdf-io";
import { ToolResultView, type ToolOutput } from "../../core/ToolResult";

export interface RunCtx {
  onProgress: (current: number, total: number) => void;
  signal: AbortSignal;
}

/**
 * Run → progress → result state for the custom (multi-file) flows, matching
 * what SimplePdfTool does. Render `view` when it isn't null.
 */
export function useToolRun({ processingMessage, onStartOver }: { processingMessage: string; onStartOver: () => void }) {
  const [phase, setPhase] = useState<"idle" | "processing" | "done">("idle");
  const [output, setOutput] = useState<ToolOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<{ current: number; total: number } | undefined>();
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => () => abortRef.current?.abort(), []);

  const execute = useCallback(async (fn: (ctx: RunCtx) => Promise<ToolOutput>) => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setPhase("processing");
    setError(null);
    setProgress(undefined);
    try {
      const out = await fn({
        signal: controller.signal,
        onProgress: (current, total) => setProgress({ current, total }),
      });
      if (controller.signal.aborted) return;
      setOutput(out);
      setPhase("done");
    } catch (err) {
      if (controller.signal.aborted) return;
      console.error(err);
      setError(
        err instanceof UserFacingError
          ? err.message
          : `Something went wrong: ${err instanceof Error ? err.message : String(err)}`
      );
      setPhase("idle");
    }
  }, []);

  const startOver = () => {
    abortRef.current?.abort();
    setOutput(null);
    setError(null);
    setPhase("idle");
    onStartOver();
  };

  let view: React.ReactNode = null;
  if (phase === "processing") {
    view = (
      <ToolProcessingState
        message={processingMessage}
        progress={progress}
        onCancel={() => {
          abortRef.current?.abort();
          setPhase("idle");
        }}
      />
    );
  } else if (phase === "done" && output) {
    view = <ToolResultView output={output} onStartOver={startOver} startOverLabel="Start over" />;
  }

  return { view, execute, error, setError };
}
