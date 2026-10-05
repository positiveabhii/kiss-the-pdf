"use client";

import { useState } from "react";
import { Check, Copy, Eye, EyeOff } from "lucide-react";

import { passwordStrength, type Strength } from "../ops/passwords";

const inputClass =
  "w-full pl-3 pr-10 py-2 text-sm text-slate-900 bg-white border border-slate-200 rounded-md shadow-2xs placeholder:text-slate-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:border-slate-400 font-mono";

/** Password box with a show/hide toggle. Never autofilled from or saved to the browser's password manager. */
export function PasswordInput({
  id,
  value,
  onChange,
  placeholder,
  autoFocus,
  onEnter,
  visible: visibleProp,
  onVisibleChange,
}: {
  id: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
  onEnter?: () => void;
  /** Controlled visibility (so a confirm field can follow the main one). */
  visible?: boolean;
  onVisibleChange?: (v: boolean) => void;
}) {
  const [own, setOwn] = useState(false);
  const visible = visibleProp ?? own;
  const setVisible = onVisibleChange ?? setOwn;
  return (
    <div className="relative">
      <input
        id={id}
        type={visible ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && onEnter) onEnter();
        }}
        placeholder={placeholder}
        autoFocus={autoFocus}
        autoComplete="new-password"
        autoCapitalize="off"
        autoCorrect="off"
        spellCheck={false}
        data-1p-ignore
        data-lpignore="true"
        className={inputClass}
      />
      <button
        type="button"
        onClick={() => setVisible(!visible)}
        aria-label={visible ? "Hide password" : "Show password"}
        aria-pressed={visible}
        className="absolute inset-y-0 right-0 flex items-center px-3 text-slate-400 hover:text-slate-700"
      >
        {visible ? <EyeOff size={15} /> : <Eye size={15} />}
      </button>
    </div>
  );
}

const STRENGTH_STYLE: Record<Strength, { bars: number; color: string }> = {
  empty: { bars: 0, color: "bg-slate-200" },
  weak: { bars: 1, color: "bg-red-500" },
  fair: { bars: 2, color: "bg-amber-500" },
  good: { bars: 3, color: "bg-lime-600" },
  strong: { bars: 4, color: "bg-emerald-600" },
};

export function StrengthMeter({ password }: { password: string }) {
  const { level, hint } = passwordStrength(password);
  if (level === "empty") return null;
  const s = STRENGTH_STYLE[level];
  return (
    <div className="flex items-center gap-2" aria-live="polite">
      <div className="flex gap-1" aria-hidden="true">
        {[0, 1, 2, 3].map((i) => (
          <span key={i} className={`h-1 w-8 rounded-full ${i < s.bars ? s.color : "bg-slate-200"}`} />
        ))}
      </div>
      <span className="text-[11px] text-slate-500">{hint}</span>
    </div>
  );
}

/** A secret shown once with a copy button (e.g. a generated owner password). */
export function SecretValue({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="flex items-center gap-2 min-w-0">
      <code className="flex-1 min-w-0 truncate px-2 py-1.5 text-xs font-mono bg-slate-50 border border-slate-200 rounded select-all">
        {value}
      </code>
      <button
        type="button"
        onClick={() => {
          void navigator.clipboard?.writeText(value).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
          });
        }}
        className="inline-flex items-center gap-1 px-2 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded hover:bg-slate-50"
      >
        {copied ? <Check size={13} /> : <Copy size={13} />} {copied ? "Copied" : "Copy"}
      </button>
    </div>
  );
}
