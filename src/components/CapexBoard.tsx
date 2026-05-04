import type { CapexItem } from "../data/hartwell";

const statusMeta: Record<CapexItem["status"], { label: string; bg: string; text: string }> = {
  "pending-approval": { label: "Pending", bg: "bg-amber-50", text: "text-amber-700" },
  approved: { label: "Approved", bg: "bg-emerald-50", text: "text-emerald-700" },
  deferred: { label: "Deferred", bg: "bg-zinc-100", text: "text-zinc-600" },
};

function formatUsd(amount: number): string {
  if (amount >= 1_000_000) return `$${(amount / 1_000_000).toFixed(1)}M`;
  if (amount >= 1_000) return `$${(amount / 1_000).toFixed(0)}K`;
  return `$${amount}`;
}

export function CapexBoard({ items }: { items: CapexItem[] }) {
  return (
    <div className="bg-white border border-zinc-200 rounded-lg p-5">
      <div className="flex items-baseline justify-between mb-1">
        <h3 className="text-sm font-semibold text-zinc-900">Capex Pending</h3>
        <p className="text-xs text-zinc-500">{items.filter((i) => i.status === "pending-approval").length} awaiting sign-off</p>
      </div>
      <p className="text-xs text-zinc-500 mb-4">
        Items needing your approval, with sponsor and payback period.
      </p>
      <div className="space-y-3">
        {items.map((item) => {
          const m = statusMeta[item.status];
          return (
            <div key={item.id} className="border border-zinc-200 rounded-md p-3">
              <div className="flex items-start justify-between mb-2 gap-2">
                <div>
                  <p className="font-medium text-zinc-900 text-sm">{item.title}</p>
                  <p className="text-xs text-zinc-500 mt-0.5">{item.id}</p>
                </div>
                <span
                  className={`${m.bg} ${m.text} text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded shrink-0`}
                >
                  {m.label}
                </span>
              </div>
              <div className="flex items-center gap-4 text-xs text-zinc-700 mb-2">
                <span className="tabular-nums font-medium text-zinc-900">{formatUsd(item.amountUsd)}</span>
                <span>·</span>
                <span>{item.paybackMonths}-month payback</span>
                <span>·</span>
                <span>Sponsor: {item.sponsor}</span>
              </div>
              <p className="text-xs text-zinc-600 leading-relaxed">{item.notes}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
