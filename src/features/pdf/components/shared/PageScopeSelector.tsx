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
    <div className="space-y-3">
      <fieldset>
        <legend className="text-sm font-medium text-slate-700 mb-2">Pages</legend>
        <div className="flex flex-wrap gap-2">
          {options.map((opt) => (
            <label
              key={opt.value}
              className={`inline-flex items-center px-3 py-1.5 text-sm rounded-md border cursor-pointer transition-colors ${
                scope === opt.value
                  ? "border-blue-600 bg-blue-50 text-blue-800"
                  : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
              }`}
            >
              <input
                type="radio"
                name="page-scope"
                value={opt.value}
                checked={scope === opt.value}
                onChange={() => onScopeChange(opt.value)}
                className="sr-only"
              />
              {opt.label}
            </label>
          ))}
        </div>
      </fieldset>

      {scope === "selected" && (
        <p className="text-xs text-slate-500">
          {selectedCount} of {pageCount} pages selected. Click thumbnails to select.
        </p>
      )}

      {scope === "range" && (
        <div>
          <label htmlFor="page-range" className="sr-only">
            Page range
          </label>
          <input
            id="page-range"
            type="text"
            value={rangeInput}
            onChange={(e) => onRangeInputChange(e.target.value)}
            placeholder={`e.g. 1-3, 5, 8-10 (1-${pageCount})`}
            className="w-full max-w-md px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
          />
        </div>
      )}
    </div>
  );
}
