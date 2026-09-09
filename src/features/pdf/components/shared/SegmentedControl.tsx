"use client";

interface SegmentedControlOption<T extends string | number> {
  value: T;
  label: string;
  icon?: React.ReactNode;
}

interface SegmentedControlProps<T extends string | number> {
  options: SegmentedControlOption<T>[];
  value: T;
  onChange: (value: T) => void;
  label?: string;
  size?: "sm" | "md";
}

export function SegmentedControl<T extends string | number>({
  options,
  value,
  onChange,
  label,
  size = "md",
}: SegmentedControlProps<T>) {
  const padding = size === "sm" ? "px-2 py-1 text-xs" : "px-3 py-1.5 text-xs";

  return (
    <div>
      {label && (
        <span className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
          {label}
        </span>
      )}
      <div
        className="inline-flex flex-wrap gap-0.5 p-0.5 bg-slate-100 border border-slate-200/80 rounded-md"
        role="group"
        aria-label={label}
      >
        {options.map((option) => {
          const selected = option.value === value;
          return (
            <button
              key={String(option.value)}
              type="button"
              onClick={() => onChange(option.value)}
              aria-pressed={selected}
              className={`inline-flex items-center gap-1.5 ${padding} font-medium rounded transition-all ${
                selected
                  ? "bg-white text-slate-900 font-semibold shadow-2xs border border-slate-200/60"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
              }`}
            >
              {option.icon}
              <span>{option.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
