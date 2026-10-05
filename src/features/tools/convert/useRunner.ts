"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { isAbortError } from "@/features/pdf/utils/is-abort-error";

import type { ToolOutput } from "../core/ToolResult";

export interface RunContext {
  signal: AbortSignal;
  onProgress: (current: number, total: number) => void;
}

/** idle → processing → done | error, with cancel and progress. */
export function useRunner() {
  const [phase, setPhase] = useState<"idle" | "processing" | "done" | "error">("idle");
  const [output, setOutput] = useState<ToolOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<{ current: number; total: number } | undefined>();
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => () => abortRef.current?.abort(), []);

  const run = useCallback(async (job: (ctx: RunContext) => Promise<ToolOutput>) => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setPhase("processing");
    setError(null);
    setProgress(undefined);
    try {
      const out = await job({
        signal: controller.signal,
        onProgress: (current, total) => setProgress({ current, total }),
      });
      if (controller.signal.aborted) return;
      setOutput(out);
      setPhase("done");
    } catch (err) {
      if (controller.signal.aborted || isAbortError(err)) return;
      console.error(err);
      // Shown after the tool's own "Conversion failed:" prefix. UserFacingError
      // messages are written for the user; others are still the best we have.
      setError(err instanceof Error ? err.message : String(err));
      setPhase("error");
    }
  }, []);

  const cancel = useCallback(() => {
    abortRef.current?.abort();
    setPhase("idle");
  }, []);

  const reset = useCallback(() => {
    abortRef.current?.abort();
    setOutput(null);
    setError(null);
    setPhase("idle");
  }, []);

  return { phase, output, error, progress, run, cancel, reset };
}
