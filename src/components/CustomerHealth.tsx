import type { Customer } from "../data/hartwell";

const healthMeta: Record<Customer["health"], { label: string; bg: string; text: string; dot: string }> = {
  healthy: { label: "Healthy", bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500" },
  watch: { label: "Watch", bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-500" },
  risk: { label: "Risk", bg: "bg-red-50", text: "text-red-700", dot: "bg-red-500" },
};

export function CustomerHealth({ customers }: { customers: Customer[] }) {
  return (
    <div className="bg-white border border-zinc-200 rounded-lg p-5">
      <div className="flex items-baseline justify-between mb-1">
        <h3 className="text-sm font-semibold text-zinc-900">Customer Health</h3>
        <p className="text-xs text-zinc-500">Top 5 accounts · % of revenue</p>
      </div>
      <p className="text-xs text-zinc-500 mb-4">
        Status reflects last 4 weeks of volume, on-time delivery, and Priya&apos;s escalation queue.
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
              return (
                <tr
                  key={c.name}
                  className={i !== customers.length - 1 ? "border-b border-zinc-200" : ""}
                >
                  <td className="px-4 py-3">
                    <p className="font-medium text-zinc-900">{c.name}</p>
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
