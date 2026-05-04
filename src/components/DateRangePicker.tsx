"use client";

export type DateRange = "1w" | "4w" | "12w";

const options: { value: DateRange; label: string }[] = [
  { value: "1w", label: "Last week" },
  { value: "4w", label: "Last 4 weeks" },
  { value: "12w", label: "Last 12 weeks" },
];

type Props = {
  value: DateRange;
  onChange: (range: DateRange) => void;
};

export function DateRangePicker({ value, onChange }: Props) {
  return (
    <div className="inline-flex items-center bg-white border border-zinc-200 rounded-md overflow-hidden text-sm">
      {options.map((opt, i) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`px-3 py-1.5 transition-colors ${
            value === opt.value
              ? "bg-zinc-900 text-white"
              : "text-zinc-700 hover:bg-zinc-50"
          } ${i !== options.length - 1 ? "border-r border-zinc-200" : ""}`}
          aria-pressed={value === opt.value}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

export function rangeToWeeks(range: DateRange): number {
  if (range === "1w") return 1;
  if (range === "4w") return 4;
  return 12;
}
