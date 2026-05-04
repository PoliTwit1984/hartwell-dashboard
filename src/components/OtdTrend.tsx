"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import type { WeeklyKpi } from "../data/hartwell";

type Props = {
  history: WeeklyKpi[];
  target: number;
  q2Mandate: number;
  onPointClick?: (week: WeeklyKpi) => void;
};

export function OtdTrend({ history, target, q2Mandate, onPointClick }: Props) {
  const data = history.map((w) => ({
    week: w.weekOf.slice(5),
    weekFull: w.weekOf,
    otd: w.otd,
    raw: w,
  }));

  return (
    <div className="bg-white border border-zinc-200 rounded-lg p-5">
      <div className="flex items-baseline justify-between mb-1 gap-3 flex-wrap">
        <h3 className="text-sm font-semibold text-zinc-900">
          On-Time Delivery
        </h3>
        <p className="text-xs text-zinc-500">
          Target {target}% · Q2 mandate {q2Mandate}%
        </p>
      </div>
      <p className="text-xs text-zinc-500 mb-4">
        {history.length} weeks shown. Click a data point to drill into the loads
        that missed the window that week.
      </p>
      <div style={{ width: "100%", height: 220 }}>
        <ResponsiveContainer>
          <LineChart data={data} margin={{ top: 5, right: 16, left: -8, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" vertical={false} />
            <XAxis
              dataKey="week"
              tick={{ fontSize: 11, fill: "#71717a" }}
              tickLine={false}
              axisLine={{ stroke: "#e4e4e7" }}
            />
            <YAxis
              domain={[88, 96]}
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
              formatter={(v) => [`${typeof v === "number" ? v.toFixed(1) : v}%`, "OTD"]}
              labelFormatter={(l) => `Week of ${l}`}
            />
            <ReferenceLine
              y={target}
              stroke="#a1a1aa"
              strokeDasharray="4 3"
              label={{ value: "Target", fontSize: 10, fill: "#71717a", position: "right" }}
            />
            <ReferenceLine
              y={q2Mandate}
              stroke="#dc2626"
              strokeDasharray="4 3"
              label={{ value: "Q2 mandate", fontSize: 10, fill: "#dc2626", position: "right" }}
            />
            <Line
              type="monotone"
              dataKey="otd"
              stroke="#0891b2"
              strokeWidth={2.5}
              dot={{ r: 4, strokeWidth: 0, fill: "#0891b2" }}
              activeDot={{
                r: 7,
                strokeWidth: 2,
                stroke: "#fff",
                fill: "#0891b2",
                style: { cursor: "pointer" },
                onClick: (_e, payload) => {
                  // Recharts passes the dot's payload via "payload" on activeDot
                  const p = payload as unknown as { payload?: { raw: WeeklyKpi } };
                  if (onPointClick && p.payload?.raw) onPointClick(p.payload.raw);
                },
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
