"use client";

import { Modal } from "./Modal";
import { allSourceSystems, dataSources } from "../data/hartwell";

const widgetByKey: { key: keyof typeof dataSources; label: string }[] = [
  { key: "kpiCards", label: "KPI cards (OTD, CPSP, Claims, Driver reqs)" },
  { key: "otdTrend", label: "OTD trend chart" },
  { key: "customerHealth", label: "Customer health table" },
  { key: "laneUtilization", label: "Lane utilization" },
  { key: "capexBoard", label: "Capex pending board" },
  { key: "escalationsQueue", label: "Customer escalations" },
  { key: "peopleActivity", label: "People activity" },
  { key: "strategicContext", label: "Strategic context" },
];

const categoryIcon: Record<string, string> = {
  tms: "🗄",
  crm: "💼",
  hr: "👤",
  tickets: "🎫",
  spreadsheet: "📊",
  files: "📂",
  notes: "📝",
};

type Props = {
  open: boolean;
  onClose: () => void;
};

export function DataFlowModal({ open, onClose }: Props) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Where does each widget's data come from?"
      subtitle="The dashboard composes from existing systems — no migration."
      widthClass="max-w-3xl"
    >
      <div className="space-y-5">
        <p className="text-sm text-zinc-700 leading-relaxed">
          The actual value of building a dashboard like this with Claude Code isn&apos;t the
          UI — it&apos;s that you don&apos;t move your data anywhere. Hartwell&apos;s
          KPIs already live in McLeod (TMS). Customer-health flags already live in
          Salesforce + Priya&apos;s spreadsheet. Capex sponsors live in Excel.
          Escalations live in email today and ServiceNow tomorrow. Strategic
          context lives in Marcus&apos;s notes + leadership Slack. The dashboard
          stitches them — Claude Code generates the connectors and the synthesis layer.
        </p>

        <div>
          <p className="text-xs uppercase tracking-wider text-zinc-500 font-medium mb-2">
            Source systems · {allSourceSystems.length}
          </p>
          <div className="flex items-center gap-2 flex-wrap">
            {allSourceSystems.map((s) => (
              <span
                key={s.label}
                className="inline-flex items-center gap-1.5 bg-zinc-50 border border-zinc-200 rounded-full px-3 py-1 text-xs text-zinc-700"
              >
                <span aria-hidden="true">{categoryIcon[s.category] ?? "🗄"}</span>
                <span className="font-medium">{s.label}</span>
                <span className="text-zinc-400">·</span>
                <span className="text-zinc-500">{s.role}</span>
              </span>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs uppercase tracking-wider text-zinc-500 font-medium mb-2">
            Per-widget mapping
          </p>
          <div className="border border-zinc-200 rounded-md overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-zinc-50 text-zinc-500">
                <tr>
                  <th className="text-left font-medium text-xs uppercase tracking-wider px-4 py-2">Widget</th>
                  <th className="text-left font-medium text-xs uppercase tracking-wider px-4 py-2">Pulls from</th>
                </tr>
              </thead>
              <tbody>
                {widgetByKey.map((w, i) => {
                  const source = dataSources[w.key];
                  return (
                    <tr
                      key={w.key}
                      className={i !== widgetByKey.length - 1 ? "border-b border-zinc-200" : ""}
                    >
                      <td className="px-4 py-3 align-top w-1/3">
                        <p className="font-medium text-zinc-900 text-sm">{w.label}</p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm text-zinc-900 font-medium flex items-center gap-1.5">
                          <span aria-hidden="true">{categoryIcon[source.category] ?? "🗄"}</span>
                          {source.system}
                        </p>
                        <p className="text-xs text-zinc-500 mt-0.5 italic">
                          {source.flavor}
                        </p>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-cyan-50 border border-cyan-200 rounded-md p-4">
          <p className="text-sm text-cyan-900 leading-relaxed">
            <span className="font-semibold">For the cohort sprint:</span> swap each
            source above with whatever your company actually uses. Claude Code
            generates the connector code per source. Same dashboard shape, your data.
          </p>
        </div>
      </div>
    </Modal>
  );
}
