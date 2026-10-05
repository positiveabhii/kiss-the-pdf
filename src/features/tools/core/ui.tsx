"use client";

import { AlertCircle, Info, AlertTriangle } from "lucide-react";

/**
 * Small form primitives in the toolkit's existing visual language (slate,
 * hairline borders, 11–13px UI type). Use these instead of hand-styling so
 * every tool looks like one product. For choice-of-few use the existing
 * `SegmentedControl` from features/pdf/components/shared.
 */

export function OptionsPanel({ children, title }: { children: React.ReactNode; title?: string }) {
  return (
    <div className="p-4 bg-white border border-slate-200 rounded-lg space-y-4">
      {title && (
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">{title}</h3>
      )}
      {children}
    </div>
  );
}

export function Field({
  label,
  hint,
  htmlFor,
  children,
}: {
  label: string;
  hint?: string;
  htmlFor?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5 min-w-0">
      <label
        htmlFor={htmlFor}
        className="block text-xs font-semibold uppercase tracking-wider text-slate-500"
      >
        {label}
      </label>
      {children}
      {hint && <p className="text-[11px] text-slate-500">{hint}</p>}
    </div>
  );
}

const inputClass =
  "w-full px-3 py-2 text-sm text-slate-900 bg-white border border-slate-200 rounded-md shadow-2xs placeholder:text-slate-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:border-slate-400 disabled:opacity-50";

export function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input type="text" {...props} className={`${inputClass} ${props.className ?? ""}`} />;
}

export function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={`${inputClass} min-h-[80px] ${props.className ?? ""}`} />;
}

export function NumberInput({
  value,
  onChange,
  min,
  max,
  step,
  id,
  suffix,
  disabled,
}: {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
  id?: string;
  suffix?: string;
  disabled?: boolean;
}) {
  return (
    <div className="flex items-center gap-2">
      <input
        id={id}
        type="number"
        inputMode="decimal"
        value={Number.isFinite(value) ? value : ""}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        onChange={(e) => {
          const v = parseFloat(e.target.value);
          if (!Number.isNaN(v)) onChange(v);
        }}
        className={`${inputClass} max-w-[140px] font-mono`}
      />
      {suffix && <span className="text-xs text-slate-500">{suffix}</span>}
    </div>
  );
}

export function Select<T extends string>({
  value,
  onChange,
  options,
  id,
}: {
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
  id?: string;
}) {
  return (
    <select
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value as T)}
      className={`${inputClass} max-w-xs`}
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

export function ColorInput({
  value,
  onChange,
  id,
}: {
  value: string;
  onChange: (v: string) => void;
  id?: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <input
        id={id}
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-9 w-12 p-0.5 bg-white border border-slate-200 rounded-md cursor-pointer"
      />
      <span className="text-xs font-mono text-slate-500">{value}</span>
    </div>
  );
}

export function Checkbox({
  checked,
  onChange,
  label,
  id,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  id?: string;
}) {
  return (
    <label htmlFor={id} className="inline-flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 rounded border-slate-300 accent-slate-900"
      />
      {label}
    </label>
  );
}

export function RangeInput({
  value,
  onChange,
  min,
  max,
  step = 1,
  id,
  format,
}: {
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step?: number;
  id?: string;
  format?: (v: number) => string;
}) {
  return (
    <div className="flex items-center gap-3">
      <input
        id={id}
        type="range"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="flex-1 accent-slate-900"
      />
      <span className="w-14 text-right text-xs font-mono text-slate-600">
        {format ? format(value) : value}
      </span>
    </div>
  );
}

type NoticeTone = "info" | "warning" | "error";

export function Notice({ tone = "info", children }: { tone?: NoticeTone; children: React.ReactNode }) {
  const styles: Record<NoticeTone, string> = {
    info: "bg-slate-50 border-slate-200 text-slate-700",
    warning: "bg-amber-50 border-amber-200 text-amber-800",
    error: "bg-red-50 border-red-200 text-red-700",
  };
  const Icon = tone === "error" ? AlertCircle : tone === "warning" ? AlertTriangle : Info;
  return (
    <div className={`flex items-start gap-2 p-3 border rounded-md text-xs ${styles[tone]}`} role={tone === "error" ? "alert" : undefined}>
      <Icon size={14} className="shrink-0 mt-0.5" />
      <div className="min-w-0">{children}</div>
    </div>
  );
}

export function PrimaryButton({
  children,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      {...rest}
      className={`w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-md text-sm font-semibold transition-all shadow-2xs bg-slate-900 hover:bg-slate-800 text-white hover:shadow-xs active:translate-y-0.5 disabled:opacity-40 disabled:cursor-not-allowed disabled:active:translate-y-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 ${rest.className ?? ""}`}
    >
      {children}
    </button>
  );
}

export function SecondaryButton({
  children,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      {...rest}
      className={`inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-md shadow-2xs hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 ${rest.className ?? ""}`}
    >
      {children}
    </button>
  );
}
