"use client";

import { useCallback, useState } from "react";

/**
 * Option state that belongs to the currently loaded file. SimplePdfTool lets the
 * user replace the file without unmounting the tool; tagging state with its file
 * means a new file always starts from `fallback` instead of stale selections.
 */
export function usePerFileState<T>() {
  const [state, setState] = useState<{ file: File; value: T } | null>(null);
  const get = useCallback(
    (file: File, fallback: T): T => (state && state.file === file ? state.value : fallback),
    [state]
  );
  const set = useCallback((file: File, value: T) => setState({ file, value }), []);
  const reset = useCallback(() => setState(null), []);
  return { get, set, reset };
}
