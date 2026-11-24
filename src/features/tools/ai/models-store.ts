"use client";

import { useEffect, useSyncExternalStore } from "react";
import { listModels, PROVIDERS, type ModelOption, type ProviderId } from "./providers";
import { updateAiSettings, useAiSettings } from "./settings";

/**
 * Model lists per provider, loaded once per API key and shared by the setup
 * panel and the model switcher. Loading a list also proves the key works.
 */

export type ModelState = { status: "loading" | "ok" | "error"; models: ModelOption[]; error?: string };

const cache = new Map<string, ModelState>();
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());
const cacheKey = (p: ProviderId, key: string) => `${p}:${key}`;

function load(provider: ProviderId, key: string) {
  const k = cacheKey(provider, key);
  if (cache.has(k)) return;
  cache.set(k, { status: "loading", models: [] });
  emit();
  listModels(provider, key)
    .then((models) => {
      cache.set(k, { status: "ok", models });
      // Choose a model when none is saved, or the saved one isn't offered to this key.
      updateAiSettings((cur) => {
        const chosen = cur.models[provider];
        if (!models.length || (chosen && models.some((m) => m.id === chosen))) return {};
        const preferred = models.find((m) => m.id === PROVIDERS[provider].defaultModel) ?? models[0];
        return { models: { ...cur.models, [provider]: preferred.id } };
      });
    })
    .catch((e) => cache.set(k, { status: "error", models: [], error: e instanceof Error ? e.message : String(e) }))
    .finally(emit);
}

let version = 0;
listeners.add(() => version++);
const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};

/** Model lists for every provider that has a key (null when it has none). */
export function useModelLists(): Record<ProviderId, ModelState | null> {
  const s = useAiSettings();
  useSyncExternalStore(subscribe, () => version, () => 0);

  useEffect(() => {
    // Debounced so typing a key doesn't fire a request per keystroke.
    const t = window.setTimeout(() => {
      for (const p of Object.keys(PROVIDERS) as ProviderId[]) if (s.keys[p].trim()) load(p, s.keys[p]);
    }, 500);
    return () => window.clearTimeout(t);
  }, [s.keys]);

  const out = {} as Record<ProviderId, ModelState | null>;
  for (const p of Object.keys(PROVIDERS) as ProviderId[]) {
    out[p] = s.keys[p].trim() ? (cache.get(cacheKey(p, s.keys[p])) ?? { status: "loading", models: [] }) : null;
  }
  return out;
}

/** Forget a failed list so the next render retries it (e.g. after fixing a key). */
export function retryModelList(provider: ProviderId, key: string) {
  cache.delete(cacheKey(provider, key));
  load(provider, key);
}
