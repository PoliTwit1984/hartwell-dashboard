import type { PeopleEvent } from "../data/hartwell";

const typeMeta: Record<PeopleEvent["type"], { label: string; bg: string; text: string }> = {
  hire: { label: "New hire", bg: "bg-emerald-50", text: "text-emerald-700" },
  departure: { label: "Departure", bg: "bg-zinc-100", text: "text-zinc-700" },
  promotion: { label: "Promotion", bg: "bg-blue-50", text: "text-blue-700" },
};

export function PeopleActivity({ events }: { events: PeopleEvent[] }) {
  return (
    <div className="bg-white border border-zinc-200 rounded-lg p-5">
      <div className="flex items-baseline justify-between mb-1">
        <h3 className="text-sm font-semibold text-zinc-900">People Activity</h3>
        <p className="text-xs text-zinc-500">Last 14 days · Renee Sims, HR</p>
      </div>
      <p className="text-xs text-zinc-500 mb-4">
        Hires, departures, and promotions across the four facilities.
      </p>
      <div className="space-y-2">
        {events.map((e) => {
          const m = typeMeta[e.type];
          return (
            <div
              key={`${e.name}-${e.date}`}
              className="flex items-start gap-3 py-2 border-b border-zinc-100 last:border-0"
            >
              <span
                className={`${m.bg} ${m.text} text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded shrink-0 mt-0.5`}
              >
                {m.label}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-zinc-900">{e.name}</p>
                <p className="text-xs text-zinc-600">{e.role} · {e.facility} hub</p>
              </div>
              <p className="text-xs text-zinc-500 tabular-nums shrink-0">{e.date.slice(5)}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
