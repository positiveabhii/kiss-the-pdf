"use client";

import { useEffect, useState } from "react";
import { Check, ChevronDown, Eye, EyeOff, KeyRound, Loader2, ShieldCheck } from "lucide-react";

import { Checkbox, Field, TextInput } from "../core/ui";
import { listModels, PROVIDERS, type ModelOption, type ProviderId } from "./providers";
import { clearAiKeys, updateAiSettings, useAiSettings } from "./settings";

type ModelState = { provider: ProviderId; key: string; status: "loading" | "ok" | "error"; models: ModelOption[]; error?: string };

/** Loads the model list for the active provider and key (this also checks the key). */
export function useModels() {
  const s = useAiSettings();
  const key = s.keys[s.provider];
  const [state, setState] = useState<ModelState | null>(null);

  useEffect(() => {
    if (!key.trim()) return;
    let cancelled = false;
    const t = window.setTimeout(() => {
      setState({ provider: s.provider, key, status: "loading", models: [] });
      listModels(s.provider, key)
        .then((models) => {
          if (cancelled) return;
          setState({ provider: s.provider, key, status: "ok", models });
          // Pick a model automatically if none is chosen or the saved one isn't available.
          const chosen = s.models[s.provider];
          if (models.length && (!chosen || !models.some((m) => m.id === chosen))) {
            const preferred = models.find((m) => m.id === PROVIDERS[s.provider].defaultModel) ?? models[0];
            updateAiSettings((cur) => ({ models: { ...cur.models, [s.provider]: preferred.id } }));
          }
        })
        .catch((e) => !cancelled && setState({ provider: s.provider, key, status: "error", models: [], error: e instanceof Error ? e.message : String(e) }));
    }, 500);
    return () => {
      cancelled = true;
      window.clearTimeout(t);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- reload only when provider or key changes
  }, [s.provider, key]);

  return state && state.provider === s.provider && state.key === key && key.trim() ? state : null;
}

export function AiSetupPanel({ models }: { models: ModelState | null }) {
  const s = useAiSettings();
  const [showKey, setShowKey] = useState(false);
  const p = PROVIDERS[s.provider];
  const key = s.keys[s.provider];
  const ready = models?.status === "ok" && Boolean(s.models[s.provider]);
  // Open until the key works, then collapsed unless the user reopens it.
  const [manualOpen, setOpen] = useState<boolean | null>(null);
  const open = manualOpen ?? !ready;
  const currentModel = models?.models.find((m) => m.id === s.models[s.provider]);

  if (ready && !open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex w-full items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3 text-left text-sm hover:bg-slate-50"
      >
        <span className="flex min-w-0 items-center gap-2">
          <Check size={15} className="shrink-0 text-emerald-600" />
          <span className="truncate">
            <span className="font-semibold text-slate-900">{p.label}</span>
            <span className="text-slate-500"> · {currentModel?.label ?? s.models[s.provider]}</span>
          </span>
        </span>
        <span className="flex shrink-0 items-center gap-1 text-xs font-medium text-slate-500">
          Change <ChevronDown size={14} />
        </span>
      </button>
    );
  }

  return (
    <div className="space-y-4 rounded-lg border border-slate-200 bg-white p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-900">
            <KeyRound size={15} /> Connect your AI model
          </h3>
          <p className="mt-0.5 text-xs text-slate-500">Bring your own API key. You pay your provider directly; KissThePDF never sees the key.</p>
        </div>
        {ready && (
          <button type="button" onClick={() => setOpen(false)} className="text-xs font-medium text-slate-500 hover:text-slate-900">
            Done
          </button>
        )}
      </div>

      <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label="AI provider">
        {(Object.keys(PROVIDERS) as ProviderId[]).map((id) => (
          <button
            key={id}
            type="button"
            role="radio"
            aria-checked={s.provider === id}
            onClick={() => updateAiSettings({ provider: id })}
            className={`rounded-md border px-3 py-2 text-left transition-colors ${
              s.provider === id ? "border-slate-900 bg-slate-900 text-white" : "border-slate-200 hover:border-slate-300"
            }`}
          >
            <span className="block text-sm font-semibold">{PROVIDERS[id].label}</span>
            <span className={`block text-[11px] ${s.provider === id ? "text-white/70" : "text-slate-500"}`}>{PROVIDERS[id].company}</span>
          </button>
        ))}
      </div>

      <Field
        label={`${p.company} API key`}
        htmlFor="ai-key"
        hint={s.remember ? "Saved in this browser until you clear it." : "Kept for this tab only and erased when you close it."}
      >
        <div className="flex gap-2" data-clarity-mask="true">
          <TextInput
            id="ai-key"
            type={showKey ? "text" : "password"}
            value={key}
            onChange={(e) => updateAiSettings((cur) => ({ keys: { ...cur.keys, [s.provider]: e.target.value.trim() } }))}
            placeholder={p.keyHint}
            autoComplete="off"
            spellCheck={false}
            data-clarity-mask="true"
            className="font-mono"
          />
          <button
            type="button"
            onClick={() => setShowKey((v) => !v)}
            className="shrink-0 rounded-md border border-slate-200 px-2.5 text-slate-500 hover:text-slate-900"
            aria-label={showKey ? "Hide key" : "Show key"}
          >
            {showKey ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        </div>
      </Field>
      <p className="-mt-2 text-xs text-slate-500">
        No key yet?{" "}
        <a href={p.keyUrl} target="_blank" rel="noopener noreferrer" className="font-medium text-blue-700 hover:underline">
          Create one at {p.company}
        </a>
        . Set a spending limit on it.
      </p>

      {key && (
        <Field label="Model" htmlFor="ai-model">
          {models?.status === "loading" && (
            <p className="flex items-center gap-2 text-xs text-slate-500"><Loader2 size={13} className="animate-spin" /> Checking key and loading models…</p>
          )}
          {models?.status === "error" && <p className="text-xs text-red-600">{models.error}</p>}
          {models?.status === "ok" && (
            <div className="space-y-2">
              <select
                id="ai-model"
                value={models.models.some((m) => m.id === s.models[s.provider]) ? s.models[s.provider] : "__custom"}
                onChange={(e) =>
                  e.target.value !== "__custom" &&
                  updateAiSettings((cur) => ({ models: { ...cur.models, [s.provider]: e.target.value } }))
                }
                className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
              >
                {models.models.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.label === m.id ? m.id : `${m.label} (${m.id})`}
                  </option>
                ))}
                <option value="__custom">Other model id…</option>
              </select>
              <TextInput
                aria-label="Model id"
                value={s.models[s.provider]}
                onChange={(e) => updateAiSettings((cur) => ({ models: { ...cur.models, [s.provider]: e.target.value.trim() } }))}
                placeholder="Or type any model id"
                spellCheck={false}
                className="font-mono text-xs"
              />
            </div>
          )}
        </Field>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-3">
        <Checkbox
          id="ai-remember"
          checked={s.remember}
          onChange={(remember) => updateAiSettings({ remember })}
          label="Remember keys on this device"
        />
        <button type="button" onClick={clearAiKeys} className="text-xs font-medium text-slate-500 hover:text-red-600">
          Clear all keys
        </button>
      </div>
      <p className="flex items-start gap-1.5 text-[11px] leading-relaxed text-slate-500">
        <ShieldCheck size={13} className="mt-px shrink-0 text-emerald-600" />
        Your key goes only to {p.company}. Your PDF&apos;s content is sent from your browser to {p.company} to answer; nothing passes through
        or is stored by KissThePDF, and chats disappear when you leave the page.
      </p>
    </div>
  );
}
