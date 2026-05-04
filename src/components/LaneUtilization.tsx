"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import type { Lane, DataSource } from "../data/hartwell";
import { WidgetHeader } from "./WidgetHeader";

type Props = {
  lanes: Lane[];
  source?: DataSource;
  filterLabel?: string | null;
};

export function LaneUtilization({ lanes, source, filterLabel }: Props) {
  const live = lanes.filter((l) => l.status === "live").sort((a, b) => b.utilizationPct - a.utilizationPct);
  const newLanes = lanes.filter((l) => l.status === "new");

  const data = live.map((l) => ({ code: l.code, util: l.utilizationPct }));

  return (
    <div className="bg-white border border-zinc-200 rounded-lg p-5">
      <WidgetHeader
        title="Lane Utilization"
        subtitle="Loaded miles ÷ total miles · live corridors"
        source={source}
        filterLabel={filterLabel}
      />
      <p className="text-xs text-zinc-500 mb-4">
        Lanes below 75% for two consecutive weeks get flagged for review.
      </p>
      {live.length === 0 && (
        <p className="text-sm italic text-zinc-500 py-6 text-center">
          No live lanes serve this customer.
        </p>
      )}
      <div style={{ width: "100%", height: 240 }}>
        <ResponsiveContainer>
          <BarChart data={data} margin={{ top: 5, right: 16, left: -8, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" vertical={false} />
            <XAxis
              dataKey="code"
              tick={{ fontSize: 10, fill: "#71717a" }}
              tickLine={false}
              axisLine={{ stroke: "#e4e4e7" }}
            />
            <YAxis
              domain={[0, 100]}
              tick={{ fontSize: 11, fill: "#71717a" }}
              tickLine={false}
              axisLine={{ stroke: "#e4e4e7" }}
              tickFormatter={(v) => `${v}%`}
            />
            <Tooltip
              contentStyle={{
                background: "#fff",
                border: "1px solid #e4e4e7",
                borderRadius: 6,
                fontSize: 12,
              }}
              formatter={(v) => [`${v}%`, "Utilization"]}
            />
            <Bar dataKey="util" radius={[4, 4, 0, 0]}>
              {data.map((d) => (
                <Cell
                  key={d.code}
                  fill={d.util >= 80 ? "#0891b2" : d.util >= 75 ? "#06b6d4" : "#f59e0b"}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      {newLanes.length > 0 && (
        <div className="mt-4 pt-4 border-t border-zinc-200">
          <p className="text-xs uppercase tracking-wider text-zinc-500 font-medium mb-2">
            New lanes ({newLanes.length}) · onboarding
          </p>
          <div className="flex flex-wrap gap-2">
            {newLanes.map((l) => (
              <span
                key={l.code}
                className="inline-flex items-center gap-2 bg-zinc-50 text-zinc-700 text-xs font-medium px-2.5 py-1 rounded border border-zinc-200"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
                {l.code}
                <span className="text-zinc-500 font-normal">{l.corridor.split(" → ")[1]}</span>
              </span>
            ))}
          </div>
          <p className="text-xs text-zinc-500 mt-2 italic">
            Acme expansion — first volume hits May 6-10.
          </p>
        </div>
      )}
    </div>
  );
}
