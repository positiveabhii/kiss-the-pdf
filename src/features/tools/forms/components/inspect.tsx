"use client";

import { useCallback, useEffect, useState } from "react";

/**
 * Async per-file inspection for SimplePdfTool's `options` render prop (which
 * can't use hooks itself): the tool keeps the result in its own state, keyed
 * by the file's bytes, and renders <Inspect> to fill it in.
 */

export interface Inspection<T> {
  bytes: Uint8Array;
  value: T | null;
  error: string | null;
}

export function useInspection<T>() {
  const [state, setState] = useState<Inspection<T> | null>(null);
  const get = useCallback(
    (bytes: Uint8Array): Inspection<T> | null => (state?.bytes === bytes ? state : null),
    [state]
  );
  const reset = useCallback(() => setState(null), []);
  return { get, set: setState, reset };
}

/** `run` must be a stable (module-level) function. */
export function Inspect<T>({
  bytes,
  run,
  onResult,
}: {
  bytes: Uint8Array;
  run: (bytes: Uint8Array) => Promise<T>;
  onResult: (r: Inspection<T>) => void;
}) {
  useEffect(() => {
    let cancelled = false;
    run(bytes)
      .then((value) => !cancelled && onResult({ bytes, value, error: null }))
      .catch((e: unknown) => {
        if (!cancelled) {
          onResult({ bytes, value: null, error: e instanceof Error ? e.message : "Could not read this PDF." });
        }
      });
    return () => {
      cancelled = true;
    };
  }, [bytes, run, onResult]);
  return null;
}
