"use client";

import { Link2, Link2Off } from "lucide-react";

import { SegmentedControl } from "@/features/pdf/components/shared/SegmentedControl";

import { NumberInput } from "../../core/ui";
import { fromPt, roundFor, toPt, type Margins, type Unit } from "../ops/units";

export const UNIT_OPTIONS: { value: Unit; label: string }[] = [
  { value: "mm", label: "mm" },
  { value: "in", label: "in" },
  { value: "pt", label: "pt" },
];

const SIDES: { key: keyof Margins; label: string }[] = [
  { key: "top", label: "Top" },
  { key: "right", label: "Right" },
  { key: "bottom", label: "Bottom" },
  { key: "left", label: "Left" },
];

/** Four margin inputs (values held in points) with a unit switch and an optional link-all toggle. */
export function MarginFields({
  value,
  onChange,
  unit,
  onUnitChange,
  linked,
  onLinkedChange,
  max,
}: {
  value: Margins;
  onChange: (m: Margins) => void;
  unit: Unit;
  onUnitChange: (u: Unit) => void;
  linked?: boolean;
  onLinkedChange?: (v: boolean) => void;
  /** Largest value per side, in points. */
  max?: number;
}) {
  const step = unit === "in" ? 0.05 : unit === "mm" ? 1 : 1;
  const set = (key: keyof Margins, display: number) => {
    const pt = Math.max(0, Math.min(max ?? Infinity, toPt(display, unit)));
    onChange(linked ? { top: pt, right: pt, bottom: pt, left: pt } : { ...value, [key]: pt });
  };
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-end gap-3">
        <SegmentedControl label="Units" options={UNIT_OPTIONS} value={unit} onChange={onUnitChange} size="sm" />
        {onLinkedChange && (
          <button
            type="button"
            onClick={() => onLinkedChange(!linked)}
            aria-pressed={!!linked}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
          >
            {linked ? <Link2 size={13} /> : <Link2Off size={13} />}
            {linked ? "Same on all sides" : "Each side separately"}
          </button>
        )}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {SIDES.map((s) => (
          <div key={s.key} className="space-y-1 min-w-0">
            <label
              htmlFor={`margin-${s.key}`}
              className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500"
            >
              {s.label}
            </label>
            <NumberInput
              id={`margin-${s.key}`}
              value={roundFor(unit, fromPt(value[s.key], unit))}
              onChange={(v) => set(s.key, v)}
              min={0}
              step={step}
              suffix={unit}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
