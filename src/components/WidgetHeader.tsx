"use client";

import type { DataSource } from "../data/hartwell";
import { SourcePill } from "./SourcePill";

type Props = {
  title: string;
  subtitle?: string;
  source?: DataSource;
  filterLabel?: string | null;
  rightSlot?: React.ReactNode;
};

export function WidgetHeader({ title, subtitle, source, filterLabel, rightSlot }: Props) {
  return (
    <div className="mb-3">
      <div className="flex items-baseline justify-between gap-3 flex-wrap">
        <h3 className="text-sm font-semibold text-zinc-900">{title}</h3>
        <div className="flex items-center gap-2 flex-wrap">
          {source && <SourcePill source={source} compact />}
          {rightSlot}
        </div>
      </div>
      {(subtitle || filterLabel) && (
        <div className="flex items-center gap-2 mt-1 flex-wrap">
          {filterLabel && (
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-cyan-800 bg-cyan-100 px-1.5 py-0.5 rounded">
              Filtered: {filterLabel}
            </span>
          )}
          {subtitle && <p className="text-xs text-zinc-500">{subtitle}</p>}
        </div>
      )}
    </div>
  );
}
