"use client";

import type { CapexItem, DataSource } from "../data/hartwell";
import { WidgetHeader } from "./WidgetHeader";

const statusMeta: Record<CapexItem["status"], { label: string; bg: string; text: string }> = {
  "pending-approval": { label: "Pending", bg: "bg-amber-50", text: "text-amber-700" },
  approved: { label: "Approved", bg: "bg-emerald-50", text: "text-emerald-700" },
  deferred: { label: "Deferred", bg: "bg-zinc-100", text: "text-zinc-600" },
};

export function formatUsd(amount: number): string {
  if (amount >= 1_000_000) return `$${(amount / 1_000_000).toFixed(1)}M`;
  if (amount >= 1_000) return `$${(amount / 1_000).toFixed(0)}K`;
  return `$${amount}`;
}

type Props = {
  items: CapexItem[];
  onSelectItem?: (item: CapexItem) => void;
  source?: DataSource;
  filterLabel?: string | null;
};

export function CapexBoard({ items, onSelectItem, source, filterLabel }: Props) {
  return (
    <div className="bg-white border border-zinc-200 rounded-lg p-5">
      <WidgetHeader
        title="Capex Pending"
        subtitle={`${items.filter((i) => i.status === "pending-approval").length} awaiting sign-off`}
        source={source}
        filterLabel={filterLabel}
      />
      <p className="text-xs text-zinc-500 mb-4">
        Click an item for the full sponsor + payback breakdown.
      </p>
      {items.length === 0 && (
        <p className="text-sm italic text-zinc-500 py-6 text-center">
          No capex items tied to this customer.
        </p>
      )}
      <div className="space-y-3">
        {items.map((item) => {
          const m = statusMeta[item.status];
          return (
            <button
              key={item.id}
              onClick={() => onSelectItem?.(item)}
              className="w-full text-left border border-zinc-200 rounded-md p-3 hover:border-zinc-300 hover:bg-zinc-50 transition-colors block"
            >
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
              <div className="flex items-center gap-4 text-xs text-zinc-700 mb-2 flex-wrap">
                <span className="tabular-nums font-medium text-zinc-900">{formatUsd(item.amountUsd)}</span>
                <span className="text-zinc-300">·</span>
                <span>{item.paybackMonths}-month payback</span>
                <span className="text-zinc-300">·</span>
                <span>Sponsor: {item.sponsor}</span>
              </div>
              <p className="text-xs text-zinc-600 leading-relaxed">{item.notes}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
