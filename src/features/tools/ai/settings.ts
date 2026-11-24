"use client";

import { useSyncExternalStore } from "react";
import { PROVIDERS, type ProviderId } from "./providers";

/**
 * AI settings shared by every AI tool in this browser.
 *
 * API keys never leave the browser except in requests to the provider they
 * belong to. By default they live in sessionStorage: kept for this tab only and
 * erased when it closes. "Remember on this device" moves them to localStorage.
 * Nothing here is sent to KissThePDF; there is no server to send it to.
 */

export interface AiSettings {
  provider: ProviderId;
  models: Record<ProviderId, string>;
  keys: Record<ProviderId, string>;
  remember: boolean;
}

const PREFS_KEY = "kp-ai-prefs";
const KEYS_KEY = "kp-ai-keys";
const EMPTY_KEYS: Record<ProviderId, string> = { anthropic: "", openai: "", gemini: "" };

const DEFAULTS: AiSettings = {
  provider: "anthropic",
  models: {
    anthropic: PROVIDERS.anthropic.defaultModel,
    openai: PROVIDERS.openai.defaultModel,
    gemini: PROVIDERS.gemini.defaultModel,
  },
  keys: EMPTY_KEYS,
  remember: false,
};

function read(storage: Storage | undefined, key: string): unknown {
  try {
    const raw = storage?.getItem(key);
    return raw ? JSON.parse(raw) : undefined;
  } catch {
    return undefined;
  }
}

function write(storage: Storage | undefined, key: string, value: unknown) {
  try {
    if (value === undefined) storage?.removeItem(key);
    else storage?.setItem(key, JSON.stringify(value));
  } catch {
    /* storage blocked (private mode, quota): settings just won't persist */
  }
}

const local = () => (typeof window === "undefined" ? undefined : window.localStorage);
const session = () => (typeof window === "undefined" ? undefined : window.sessionStorage);

function load(): AiSettings {
  const prefs = (read(local(), PREFS_KEY) ?? {}) as Partial<AiSettings>;
  const remember = prefs.remember === true;
  const keys = (read(remember ? local() : session(), KEYS_KEY) ?? {}) as Partial<Record<ProviderId, string>>;
  return {
    provider: prefs.provider && prefs.provider in PROVIDERS ? prefs.provider : DEFAULTS.provider,
    models: { ...DEFAULTS.models, ...(prefs.models ?? {}) },
    keys: { ...EMPTY_KEYS, ...keys },
    remember,
  };
}

let state: AiSettings | null = null;
const listeners = new Set<() => void>();

function get(): AiSettings {
  if (!state) state = load();
  return state;
}

function persist(next: AiSettings) {
  write(local(), PREFS_KEY, { provider: next.provider, models: next.models, remember: next.remember });
  // Keys live in exactly one place, so turning "remember" off removes them from disk.
  const hasKeys = Object.values(next.keys).some(Boolean);
  write(next.remember ? local() : session(), KEYS_KEY, hasKeys ? next.keys : undefined);
  write(next.remember ? session() : local(), KEYS_KEY, undefined);
}

export function updateAiSettings(patch: Partial<AiSettings> | ((s: AiSettings) => Partial<AiSettings>)) {
  const current = get();
  const next = { ...current, ...(typeof patch === "function" ? patch(current) : patch) };
  state = next;
  persist(next);
  listeners.forEach((l) => l());
}

export function clearAiKeys() {
  updateAiSettings({ keys: EMPTY_KEYS });
}

function subscribe(l: () => void) {
  listeners.add(l);
  return () => listeners.delete(l);
}

export function useAiSettings(): AiSettings {
  return useSyncExternalStore(subscribe, get, () => DEFAULTS);
}
