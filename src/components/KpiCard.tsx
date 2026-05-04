type Props = {
  label: string;
  value: string;
  comparison?: string;
  trend?: "up" | "down" | "flat";
  good?: boolean;
};

export function KpiCard({ label, value, comparison, trend, good }: Props) {
  const trendColor =
    good === undefined
      ? "text-zinc-500"
      : good
        ? "text-emerald-600"
        : "text-red-600";

  const arrow = trend === "up" ? "↑" : trend === "down" ? "↓" : "—";

  return (
    <div className="bg-white border border-zinc-200 rounded-lg p-5">
      <p className="text-xs uppercase tracking-wider text-zinc-500 font-medium">
        {label}
      </p>
      <p className="text-3xl font-semibold text-zinc-900 mt-2 tabular-nums">
        {value}
      </p>
      {comparison && (
        <p className={`text-xs mt-2 font-medium ${trendColor}`}>
          {arrow} {comparison}
        </p>
      )}
    </div>
  );
}
