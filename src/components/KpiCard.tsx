"use client";

type Props = {
  label: string;
  value: string;
  comparison?: string;
  trend?: "up" | "down" | "flat";
  good?: boolean;
  anomaly?: boolean;
  onClick?: () => void;
};

export function KpiCard({ label, value, comparison, trend, good, anomaly, onClick }: Props) {
  const trendColor =
    good === undefined
      ? "text-zinc-500"
      : good
        ? "text-emerald-600"
        : "text-red-600";

  const arrow = trend === "up" ? "↑" : trend === "down" ? "↓" : "—";

  const baseClass = "bg-white border rounded-lg p-5 text-left transition-all";
  const stateClass = anomaly
    ? "border-red-300 ring-2 ring-red-100"
    : "border-zinc-200";
  const interactiveClass = onClick ? "hover:border-zinc-300 hover:shadow-sm cursor-pointer" : "";

  const Wrapper = onClick ? "button" : "div";

  return (
    <Wrapper
      onClick={onClick}
      className={`${baseClass} ${stateClass} ${interactiveClass} w-full block`}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-xs uppercase tracking-wider text-zinc-500 font-medium">
          {label}
        </p>
        {anomaly && (
          <span className="text-[10px] uppercase tracking-wider font-semibold text-red-700 bg-red-50 px-1.5 py-0.5 rounded shrink-0">
            Anomaly
          </span>
        )}
      </div>
      <p className="text-3xl font-semibold text-zinc-900 mt-2 tabular-nums">
        {value}
      </p>
      {comparison && (
        <p className={`text-xs mt-2 font-medium ${trendColor}`}>
          {arrow} {comparison}
        </p>
      )}
    </Wrapper>
  );
}
