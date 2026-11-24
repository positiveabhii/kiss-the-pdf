"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Check, ChevronDown, KeyRound, Loader2, Search } from "lucide-react";

import { PROVIDERS, type ProviderId } from "./providers";
import type { ModelState } from "./models-store";
import { updateAiSettings, useAiSettings } from "./settings";

/**
 * Header dropdown to switch provider and model mid-conversation. Lists every
 * provider that has a key, with its models; others link to the key setup.
 */
export function ModelSwitcher({
  lists,
  onManageKeys,
  disabled,
}: {
  lists: Record<ProviderId, ModelState | null>;
  onManageKeys: () => void;
  disabled?: boolean;
}) {
  const s = useAiSettings();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const root = useRef<HTMLDivElement>(null);
  const search = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    search.current?.focus();
    const onDown = (e: MouseEvent) => !root.current?.contains(e.target as Node) && setOpen(false);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const current = lists[s.provider]?.models.find((m) => m.id === s.models[s.provider]);
  const label = current?.label ?? (s.models[s.provider] || "Choose a model");
  const providers = Object.keys(PROVIDERS) as ProviderId[];
  const needle = q.trim().toLowerCase();
  const filtered = useMemo(
    () =>
      providers.map((p) => ({
        p,
        state: lists[p],
        models: (lists[p]?.models ?? []).filter((m) => !needle || `${m.label} ${m.id}`.toLowerCase().includes(needle)),
      })),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- providers is a constant list
    [lists, needle]
  );

  const pick = (p: ProviderId, id: string) => {
    updateAiSettings((cur) => ({ provider: p, models: { ...cur.models, [p]: id } }));
    setOpen(false);
    setQ("");
  };

  return (
    <div ref={root} className="relative">
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="flex max-w-[260px] items-center gap-2 rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-xs hover:bg-slate-50 disabled:opacity-50"
      >
        <span className="font-semibold text-slate-900">{PROVIDERS[s.provider].label}</span>
        <span className="truncate text-slate-500">{label}</span>
        <ChevronDown size={13} className="shrink-0 text-slate-400" />
      </button>

      {open && (
        <div className="absolute right-0 top-full z-30 mt-1.5 w-80 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-xl">
          <div className="flex items-center gap-2 border-b border-slate-100 px-3 py-2">
            <Search size={14} className="text-slate-400" />
            <input
              ref={search}
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search models"
              className="w-full text-sm outline-none placeholder:text-slate-400"
            />
          </div>
          <div className="max-h-80 overflow-y-auto py-1" role="listbox">
            {filtered.map(({ p, state, models }) => (
              <div key={p} className="py-1">
                <p className="px-3 pb-1 pt-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  {PROVIDERS[p].label} · {PROVIDERS[p].company}
                </p>
                {!state ? (
                  <button
                    type="button"
                    onClick={() => {
                      updateAiSettings({ provider: p });
                      setOpen(false);
                      onManageKeys();
                    }}
                    className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-xs text-blue-700 hover:bg-slate-50"
                  >
                    <KeyRound size={13} /> Add a {PROVIDERS[p].label} key to use its models
                  </button>
                ) : state.status === "loading" ? (
                  <p className="flex items-center gap-2 px-3 py-1.5 text-xs text-slate-500">
                    <Loader2 size={13} className="animate-spin" /> Loading models…
                  </p>
                ) : state.status === "error" ? (
                  <p className="px-3 py-1.5 text-xs text-red-600">{state.error}</p>
                ) : models.length === 0 ? (
                  <p className="px-3 py-1.5 text-xs text-slate-400">No matching models</p>
                ) : (
                  models.map((m) => {
                    const active = s.provider === p && s.models[p] === m.id;
                    return (
                      <button
                        key={m.id}
                        type="button"
                        role="option"
                        aria-selected={active}
                        onClick={() => pick(p, m.id)}
                        className={`flex w-full items-center justify-between gap-3 px-3 py-1.5 text-left hover:bg-slate-50 ${active ? "bg-slate-50" : ""}`}
                      >
                        <span className="min-w-0">
                          <span className="block truncate text-sm text-slate-900">{m.label}</span>
                          {m.label !== m.id && <span className="block truncate font-mono text-[10px] text-slate-400">{m.id}</span>}
                        </span>
                        {active && <Check size={14} className="shrink-0 text-emerald-600" />}
                      </button>
                    );
                  })
                )}
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              onManageKeys();
            }}
            className="flex w-full items-center gap-2 border-t border-slate-100 px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50"
          >
            <KeyRound size={13} /> Manage API keys
          </button>
        </div>
      )}
    </div>
  );
}
