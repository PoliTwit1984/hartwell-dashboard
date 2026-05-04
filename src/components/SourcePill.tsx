"use client";

import type { DataSource } from "../data/hartwell";

const categoryMeta: Record<DataSource["category"], { icon: string; bg: string; text: string }> = {
  tms: { icon: "🗄", bg: "bg-cyan-50", text: "text-cyan-800" },
  crm: { icon: "💼", bg: "bg-blue-50", text: "text-blue-800" },
  hr: { icon: "👤", bg: "bg-violet-50", text: "text-violet-800" },
  tickets: { icon: "🎫", bg: "bg-amber-50", text: "text-amber-800" },
  spreadsheet: { icon: "📊", bg: "bg-emerald-50", text: "text-emerald-800" },
  files: { icon: "📂", bg: "bg-zinc-100", text: "text-zinc-700" },
  notes: { icon: "📝", bg: "bg-orange-50", text: "text-orange-800" },
};

type Props = {
  source: DataSource;
  compact?: boolean;
};

export function SourcePill({ source, compact }: Props) {
  const m = categoryMeta[source.category];
  if (compact) {
    return (
      <span
        className={`inline-flex items-center gap-1 ${m.bg} ${m.text} text-[10px] font-medium px-2 py-0.5 rounded`}
        title={source.flavor}
      >
        <span aria-hidden="true">{m.icon}</span>
        <span className="truncate max-w-[12rem]">Source: {source.system}</span>
      </span>
    );
  }
  return (
    <span
      className={`inline-flex items-center gap-1.5 ${m.bg} ${m.text} text-xs font-medium px-2 py-1 rounded`}
      title={source.flavor}
    >
      <span aria-hidden="true">{m.icon}</span>
      <span>Source: {source.system}</span>
    </span>
  );
}
