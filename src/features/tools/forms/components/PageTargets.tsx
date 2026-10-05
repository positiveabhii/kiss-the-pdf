"use client";

import { SegmentedControl } from "@/features/pdf/components/shared/SegmentedControl";
import { parsePageRange } from "@/features/pdf/utils/page-range-parser";

import { TextInput } from "../../core/ui";

export type TargetScope = "this" | "all" | "custom";

export interface Targets {
  scope: TargetScope;
  range: string;
}

/** 0-based page indices, or an error message. `current` is 1-based. */
export function resolveTargets(
  t: Targets,
  current: number,
  count: number
): { indices: number[]; error: string | null } {
  if (t.scope === "this") return { indices: [current - 1], error: null };
  if (t.scope === "all") return { indices: Array.from({ length: count }, (_, i) => i), error: null };
  try {
    const pages = parsePageRange(t.range, count);
    if (pages.length === 0) return { indices: [], error: "Enter the pages, e.g. 1-3, 5." };
    return { indices: pages.map((p) => p - 1), error: null };
  } catch (e) {
    return { indices: [], error: e instanceof Error ? e.message : "Invalid page range." };
  }
}

export function PageTargets({
  value,
  onChange,
  pageCount,
  current,
  allowThis = true,
}: {
  value: Targets;
  onChange: (t: Targets) => void;
  pageCount: number;
  current: number;
  allowThis?: boolean;
}) {
  const options: { value: TargetScope; label: string }[] = [
    ...(allowThis ? [{ value: "this" as const, label: `This page (${current})` }] : []),
    { value: "all", label: "All pages" },
    { value: "custom", label: "Custom" },
  ];
  const { error } = resolveTargets(value, current, pageCount);
  return (
    <div className="space-y-2">
      <SegmentedControl
        label="Pages"
        options={options}
        value={value.scope}
        onChange={(scope) => onChange({ ...value, scope })}
      />
      {value.scope === "custom" && (
        <div className="max-w-xs space-y-1">
          <TextInput
            aria-label="Page range"
            placeholder={`e.g. 1-3, 5 (of ${pageCount})`}
            value={value.range}
            onChange={(e) => onChange({ ...value, range: e.target.value })}
          />
          {value.range && error && <p className="text-[11px] text-red-600">{error}</p>}
        </div>
      )}
    </div>
  );
}
