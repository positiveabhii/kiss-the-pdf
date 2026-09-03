import { useState, useCallback } from "react";

export type ToolState = "idle" | "processing" | "success" | "error";

export interface UsePdfToolResult<TResult> {
  state: ToolState;
  error: Error | null;
  result: TResult | null;
  startProcessing: () => void;
  setSuccess: (data: TResult) => void;
  setFailed: (err: Error | unknown) => void;
  reset: () => void;
}

export function usePdfTool<TResult = Uint8Array>(): UsePdfToolResult<TResult> {
  const [state, setState] = useState<ToolState>("idle");
  const [error, setError] = useState<Error | null>(null);
  const [result, setResult] = useState<TResult | null>(null);

  const startProcessing = useCallback(() => {
    setState("processing");
    setError(null);
    setResult(null);
  }, []);

  const setSuccess = useCallback((data: TResult) => {
    setState("success");
    setResult(data);
    setError(null);
  }, []);

  const setFailed = useCallback((err: Error | unknown) => {
    setState("error");
    if (err instanceof Error) {
      setError(err);
    } else if (typeof err === "string") {
      setError(new Error(err));
    } else {
      setError(new Error("An unknown error occurred during PDF processing."));
    }
  }, []);

  const reset = useCallback(() => {
    setState("idle");
    setError(null);
    setResult(null);
  }, []);

  return {
    state,
    error,
    result,
    startProcessing,
    setSuccess,
    setFailed,
    reset,
  };
}
