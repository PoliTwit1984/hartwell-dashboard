"use client";

import { allSourceSystems } from "../data/hartwell";

const categoryIcon: Record<string, string> = {
  tms: "🗄",
  crm: "💼",
  hr: "👤",
  tickets: "🎫",
  spreadsheet: "📊",
  files: "📂",
  notes: "📝",
};

export function TopSourceStrip() {
  return (
    <div className="bg-zinc-50 border-b border-zinc-200">
      <div className="max-w-7xl mx-auto px-6 py-3">
        <div className="flex items-baseline gap-3 flex-wrap">
          <p className="text-xs uppercase tracking-wider text-zinc-500 font-medium">
            Pulling from {allSourceSystems.length} sources
          </p>
          <span className="text-zinc-300 text-xs">·</span>
          <p className="text-xs text-zinc-600">
            Built once with Claude Code, points at Hartwell&apos;s existing systems. Buyers replicate this with theirs.
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap mt-2">
          {allSourceSystems.map((s) => (
            <span
              key={s.label}
              className="inline-flex items-center gap-1.5 bg-white border border-zinc-200 rounded-full px-3 py-1 text-xs text-zinc-700"
            >
              <span aria-hidden="true" className="text-sm leading-none">
                {categoryIcon[s.category] ?? "🗄"}
              </span>
              <span className="font-medium">{s.label}</span>
              <span className="text-zinc-400">·</span>
              <span className="text-zinc-500">{s.role}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
