"use client";

import { useCallback, useMemo, useReducer } from "react";

/**
 * Undo/redo over immutable snapshots.
 *
 *  - commit(next)            a discrete change (one undo step)
 *  - commit(next, key)       changes with the same key within 800ms merge
 *                            into one step (colour pickers, typing)
 *  - begin / preview / end   a gesture: previews don't create steps; end()
 *                            records one step if anything changed
 */

interface State<T> {
  past: T[];
  present: T;
  future: T[];
  base: T | null;
  lastKey: string | null;
  lastAt: number;
}

type Action<T> =
  | { type: "commit"; next: T; key?: string; at: number }
  | { type: "begin" }
  | { type: "preview"; next: T }
  | { type: "end" }
  | { type: "undo" }
  | { type: "redo" }
  | { type: "reset"; value: T };

const LIMIT = 200;

function reducer<T>(s: State<T>, a: Action<T>): State<T> {
  switch (a.type) {
    case "commit": {
      if (a.next === s.present) return s;
      if (a.key && a.key === s.lastKey && a.at - s.lastAt < 800) {
        return { ...s, present: a.next, future: [], lastAt: a.at };
      }
      return {
        past: [...s.past, s.present].slice(-LIMIT),
        present: a.next,
        future: [],
        base: null,
        lastKey: a.key ?? null,
        lastAt: a.at,
      };
    }
    case "begin":
      return { ...s, base: s.present };
    case "preview":
      return { ...s, present: a.next };
    case "end": {
      if (s.base === null) return s;
      if (s.base === s.present) return { ...s, base: null };
      return { past: [...s.past, s.base].slice(-LIMIT), present: s.present, future: [], base: null, lastKey: null, lastAt: 0 };
    }
    case "undo": {
      if (!s.past.length) return s;
      return {
        past: s.past.slice(0, -1),
        present: s.past[s.past.length - 1],
        future: [s.present, ...s.future],
        base: null,
        lastKey: null,
        lastAt: 0,
      };
    }
    case "redo": {
      if (!s.future.length) return s;
      return {
        past: [...s.past, s.present],
        present: s.future[0],
        future: s.future.slice(1),
        base: null,
        lastKey: null,
        lastAt: 0,
      };
    }
    case "reset":
      return { past: [], present: a.value, future: [], base: null, lastKey: null, lastAt: 0 };
  }
}

export function useHistory<T>(initial: T) {
  const [state, dispatch] = useReducer(reducer<T>, {
    past: [],
    present: initial,
    future: [],
    base: null,
    lastKey: null,
    lastAt: 0,
  });

  const commit = useCallback((next: T, key?: string) => dispatch({ type: "commit", next, key, at: Date.now() }), []);
  const begin = useCallback(() => dispatch({ type: "begin" }), []);
  const preview = useCallback((next: T) => dispatch({ type: "preview", next }), []);
  const end = useCallback(() => dispatch({ type: "end" }), []);
  const undo = useCallback(() => dispatch({ type: "undo" }), []);
  const redo = useCallback(() => dispatch({ type: "redo" }), []);
  const reset = useCallback((value: T) => dispatch({ type: "reset", value }), []);

  return useMemo(
    () => ({
      value: state.present,
      canUndo: state.past.length > 0,
      canRedo: state.future.length > 0,
      commit,
      begin,
      preview,
      end,
      undo,
      redo,
      reset,
    }),
    [state.present, state.past.length, state.future.length, commit, begin, preview, end, undo, redo, reset]
  );
}
