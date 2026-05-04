"use client";

import type { Customer } from "../data/hartwell";

const healthMeta: Record<Customer["health"], { label: string; bg: string; text: string; dot: string }> = {
  healthy: { label: "Healthy", bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500" },
  watch: { label: "Watch", bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-500" },
  risk: { label: "Risk", bg: "bg-red-50", text: "text-red-700", dot: "bg-red-500" },
};

type Props = {
  customers: Customer[];
  selectedCustomer: string | null;
  onSelectCustomer: (name: string | null) => void;
};

export function CustomerHealth({ customers, selectedCustomer, onSelectCustomer }: Props) {
  return (
    <div className="bg-white border border-zinc-200 rounded-lg p-5">
      <div className="flex items-baseline justify-between mb-1 gap-3 flex-wrap">
        <h3 className="text-sm font-semibold text-zinc-900">Customer Health</h3>
        <div className="flex items-center gap-3">
          <p className="text-xs text-zinc-500">Top 5 accounts · % of revenue</p>
          {selectedCustomer && (
            <button
              onClick={() => onSelectCustomer(null)}
              className="text-xs font-medium text-cyan-700 hover:text-cyan-900 transition-colors"
            >
              Clear filter ×
            </button>
          )}
        </div>
      </div>
      <p className="text-xs text-zinc-500 mb-4">
        Click an account to filter the rest of the dashboard. Status reflects last 4 weeks of volume, on-time delivery, and Priya&apos;s escalation queue.
      </p>
      <div className="overflow-hidden border border-zinc-200 rounded-md">
        <table className="w-full text-sm">
          <thead className="bg-zinc-50 text-zinc-500">
            <tr>
              <th className="text-left font-medium text-xs uppercase tracking-wider px-4 py-2">Account</th>
              <th className="text-left font-medium text-xs uppercase tracking-wider px-4 py-2">Industry</th>
              <th className="text-right font-medium text-xs uppercase tracking-wider px-4 py-2">Rev</th>
              <th className="text-left font-medium text-xs uppercase tracking-wider px-4 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c, i) => {
              const m = healthMeta[c.health];
              const isSelected = selectedCustomer === c.name;
              const baseClasses = i !== customers.length - 1 ? "border-b border-zinc-200" : "";
              const interactiveClasses = "cursor-pointer transition-colors hover:bg-zinc-50";
              const selectedClasses = isSelected ? "bg-cyan-50 hover:bg-cyan-50" : "";
              return (
                <tr
                  key={c.name}
                  onClick={() => onSelectCustomer(isSelected ? null : c.name)}
                  className={`${baseClasses} ${interactiveClasses} ${selectedClasses}`}
                >
                  <td className="px-4 py-3">
                    <p className="font-medium text-zinc-900 flex items-center gap-2">
                      {c.name}
                      {isSelected && (
                        <span className="text-[10px] uppercase tracking-wider font-semibold text-cyan-700 bg-cyan-100 px-1.5 py-0.5 rounded">
                          Filtered
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-zinc-500 mt-0.5">{c.primaryContact}</p>
                  </td>
                  <td className="px-4 py-3 text-zinc-700">{c.industry}</td>
                  <td className="px-4 py-3 text-right tabular-nums text-zinc-900 font-medium">
                    {c.revenueSharePct.toFixed(1)}%
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center gap-1.5 ${m.bg} ${m.text} text-xs font-medium px-2 py-1 rounded-full`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${m.dot}`} />
                      {m.label}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="mt-3 space-y-2">
        {customers
          .filter((c) => c.health !== "healthy" || c.recentNote.length > 60)
          .map((c) => (
            <p key={`${c.name}-note`} className="text-xs text-zinc-600 leading-relaxed">
              <span className="font-medium text-zinc-900">{c.name}:</span> {c.recentNote}
            </p>
          ))}
      </div>
    </div>
  );
}
