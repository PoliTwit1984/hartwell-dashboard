"use client";

import type { Escalation, DataSource } from "../data/hartwell";
import { StickyNote } from "./StickyNote";
import { WidgetHeader } from "./WidgetHeader";

const sevMeta: Record<Escalation["severity"], { label: string; bg: string; text: string }> = {
  low: { label: "Low", bg: "bg-zinc-100", text: "text-zinc-700" },
  medium: { label: "Medium", bg: "bg-amber-50", text: "text-amber-700" },
  high: { label: "High", bg: "bg-red-50", text: "text-red-700" },
};

const statusMeta: Record<Escalation["status"], { label: string; dot: string }> = {
  open: { label: "Open", dot: "bg-red-500" },
  monitoring: { label: "Monitoring", dot: "bg-amber-500" },
  resolved: { label: "Resolved", dot: "bg-emerald-500" },
};

type Props = {
  escalations: Escalation[];
  source?: DataSource;
  filterLabel?: string | null;
};

export function EscalationsQueue({ escalations, source, filterLabel }: Props) {
  return (
    <div className="bg-white border border-zinc-200 rounded-lg p-5">
      <WidgetHeader
        title="Customer Escalations"
        subtitle={`${escalations.length} active`}
        source={source}
        filterLabel={filterLabel}
      />
      <p className="text-xs text-zinc-500 mb-4">
        Owned by Priya Iyengar (Customer Solutions) and Tony Marchetti (Sales). Notes you add are stored locally.
      </p>
      {escalations.length === 0 && (
        <p className="text-sm italic text-zinc-500 py-6 text-center">
          No active escalations matching the current filter.
        </p>
      )}
      <div className="space-y-3">
        {escalations.map((e) => {
          const sev = sevMeta[e.severity];
          const st = statusMeta[e.status];
          return (
            <div
              key={`${e.customer}-${e.opened}`}
              className="border border-zinc-200 rounded-md p-3"
            >
              <div className="flex items-center justify-between mb-2 gap-2 flex-wrap">
                <div className="flex items-center gap-2">
                  <span
                    className={`${sev.bg} ${sev.text} text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded`}
                  >
                    {sev.label}
                  </span>
                  <p className="font-medium text-zinc-900 text-sm">{e.customer}</p>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                  <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />
                  {st.label}
                </div>
              </div>
              <p className="text-sm text-zinc-700 leading-relaxed">{e.summary}</p>
              <p className="text-xs text-zinc-500 mt-2">
                Owner: {e.owner} · Opened {e.opened.slice(5)}
              </p>
              <StickyNote
                storageKey={`hartwell:escalation-note:${e.customer}:${e.opened}`}
                placeholder={`Note for ${e.customer} escalation`}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
