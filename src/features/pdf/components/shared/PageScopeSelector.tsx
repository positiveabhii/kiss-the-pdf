"use client";

import type { PageScope } from "../../hooks/use-page-selection";

interface PageScopeSelectorProps {
  scope: PageScope;
  onScopeChange: (scope: PageScope) => void;
  rangeInput: string;
  onRangeInputChange: (value: string) => void;
  pageCount: number;
  selectedCount: number;
  showOddEven?: boolean;
}

const SCOPE_OPTIONS: { value: PageScope; label: string }[] = [
  { value: "all", label: "All pages" },
  { value: "selected", label: "Selected" },
  { value: "range", label: "Page range" },
];

export function PageScopeSelector({
  scope,
  onScopeChange,
  rangeInput,
  onRangeInputChange,
  pageCount,
  selectedCount,
  showOddEven = true,
}: PageScopeSelectorProps) {
  const options = showOddEven
    ? [...SCOPE_OPTIONS, { value: "odd" as PageScope, label: "Odd pages" }, { value: "even" as PageScope, label: "Even pages" }]
    : SCOPE_OPTIONS;

  return (
    <div className="space-y-2.5">
      <fieldset>
        <legend className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
          Target Pages
        </legend>
        <div className="flex flex-wrap gap-1.5">
          {options.map((opt) => {
            const isSelected = scope === opt.value;
            return (
              <label
                key={opt.value}
                className={`inline-flex items-center px-2.5 py-1 text-xs font-medium rounded border cursor-pointer transition-all ${
                  isSelected
                    ? "bg-slate-900 text-white font-semibold border-slate-900 shadow-2xs"
                    : "bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                <input
                  type="radio"
                  name="page-scope"
                  value={opt.value}
                  checked={isSelected}
                  onChange={() => onScopeChange(opt.value)}
                  className="sr-only"
                />
                {opt.label}
              </label>
            );
          })}
        </div>
      </fieldset>

      {scope === "selected" && (
        <p className="text-[11px] font-mono text-slate-500 bg-slate-50 border border-slate-200/60 px-2.5 py-1 rounded inline-block">
          {selectedCount} of {pageCount} pages selected. Click thumbnails to select.
        </p>
      )}

      {scope === "range" && (
        <div className="max-w-md">
          <label htmlFor="page-range" className="sr-only">
            Page range
          </label>
          <input
            id="page-range"
            type="text"
            value={rangeInput}
            onChange={(e) => onRangeInputChange(e.target.value)}
            placeholder={`e.g. 1-3, 5, 8-10 (1-${pageCount})`}
            className="w-full h-8 px-3 text-xs font-mono bg-white border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900 placeholder:text-slate-400 placeholder:font-sans"
          />
        </div>
      )}
    </div>
  );
}
