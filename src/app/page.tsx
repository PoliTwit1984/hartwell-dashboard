import {
  company,
  kpiTargets,
  kpiHistory,
  customers,
  lanes,
  peopleActivity,
  capexPending,
  escalations,
  strategicContext,
} from "../data/hartwell";
import { KpiCard } from "../components/KpiCard";
import { OtdTrend } from "../components/OtdTrend";
import { CustomerHealth } from "../components/CustomerHealth";
import { LaneUtilization } from "../components/LaneUtilization";
import { CapexBoard } from "../components/CapexBoard";
import { EscalationsQueue } from "../components/EscalationsQueue";
import { PeopleActivity } from "../components/PeopleActivity";
import { StrategicContext } from "../components/StrategicContext";

export default function Dashboard() {
  const current = kpiHistory[kpiHistory.length - 1];
  const prior = kpiHistory[kpiHistory.length - 2];

  const otdDelta = current.otd - prior.otd;
  const cpspDeltaPct = ((current.cpsp - prior.cpsp) / prior.cpsp) * 100;
  const claimsDelta = current.claimsRate - prior.claimsRate;

  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Top bar */}
      <header className="bg-white border-b border-zinc-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-baseline gap-3 flex-wrap">
            <h1 className="text-lg font-semibold text-zinc-900 tracking-tight">
              {company.name}
            </h1>
            <span className="text-zinc-300">·</span>
            <p className="text-sm text-zinc-700">Operations Dashboard</p>
          </div>
          <div className="text-xs text-zinc-500 flex items-center gap-3 flex-wrap">
            <span>Week of {current.weekOf}</span>
            <span className="text-zinc-300">·</span>
            <span>For {company.leadership.coo}, COO</span>
            <span className="text-zinc-300">·</span>
            <span>Owned by {company.leadership.directorOps}, Director of Ops</span>
          </div>
        </div>
      </header>

      {/* Sample-data banner */}
      <div className="bg-amber-50 border-b border-amber-200">
        <div className="max-w-7xl mx-auto px-6 py-2.5 flex items-baseline justify-between gap-4 flex-wrap">
          <p className="text-xs text-amber-800">
            <span className="font-semibold uppercase tracking-wider">Sample build</span>
            <span className="mx-2 text-amber-300">·</span>
            Hartwell Logistics is a fictional regional 3PL used as a Sprint 01 / Code / Advanced capstone example for AI Builders Club. All people, customers, lanes, and metrics are sample data.
          </p>
          <a
            href="https://aibuildersclub.ai/capstone/sprint-01-dashboard"
            className="text-xs text-amber-900 font-semibold underline whitespace-nowrap"
          >
            ← Back to AIBC
          </a>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        {/* KPI row */}
        <section aria-labelledby="kpi-heading">
          <h2 id="kpi-heading" className="sr-only">Key performance indicators</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <KpiCard
              label="On-Time Delivery"
              value={`${current.otd.toFixed(1)}%`}
              comparison={`${otdDelta >= 0 ? "+" : ""}${otdDelta.toFixed(1)} pts WoW · target ${kpiTargets.otdPercent}%`}
              trend={otdDelta > 0 ? "up" : otdDelta < 0 ? "down" : "flat"}
              good={current.otd >= kpiTargets.otdPercent}
            />
            <KpiCard
              label="Cost Per Shipped Pound"
              value={`$${current.cpsp.toFixed(3)}/lb`}
              comparison={`${cpspDeltaPct >= 0 ? "+" : ""}${cpspDeltaPct.toFixed(1)}% WoW · baseline $${kpiTargets.cpspBaselineDollarsPerLb.toFixed(3)}`}
              trend={cpspDeltaPct > 0 ? "up" : cpspDeltaPct < 0 ? "down" : "flat"}
              good={cpspDeltaPct <= 5}
            />
            <KpiCard
              label="Claims Rate"
              value={`${current.claimsRate.toFixed(2)}%`}
              comparison={`${claimsDelta >= 0 ? "+" : ""}${claimsDelta.toFixed(2)} pts WoW · target <${kpiTargets.claimsRatePercent}%`}
              trend={claimsDelta > 0 ? "up" : claimsDelta < 0 ? "down" : "flat"}
              good={current.claimsRate < kpiTargets.claimsRatePercent}
            />
            <KpiCard
              label="Open Driver Reqs"
              value={`${current.openDriverReqs}`}
              comparison={`+${current.detentionHoursWoWPct}% IND detention WoW`}
              trend={current.openDriverReqs > 5 ? "up" : "flat"}
              good={current.openDriverReqs <= 5}
            />
          </div>
        </section>

        {/* OTD trend + Strategic context */}
        <section className="grid lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <OtdTrend
              history={kpiHistory}
              target={kpiTargets.otdPercent}
              q2Mandate={kpiTargets.otdQ2Mandate}
            />
          </div>
          <div>
            <StrategicContext context={strategicContext} />
          </div>
        </section>

        {/* Customer health + Capex */}
        <section className="grid lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <CustomerHealth customers={customers} />
          </div>
          <div>
            <CapexBoard items={capexPending} />
          </div>
        </section>

        {/* Lane utilization (full width) */}
        <section>
          <LaneUtilization lanes={lanes} />
        </section>

        {/* Escalations + People */}
        <section className="grid lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <EscalationsQueue escalations={escalations} />
          </div>
          <div>
            <PeopleActivity events={peopleActivity} />
          </div>
        </section>
      </main>

      <footer className="border-t border-zinc-200 bg-white mt-12">
        <div className="max-w-7xl mx-auto px-6 py-6 text-xs text-zinc-500 flex items-center justify-between flex-wrap gap-3">
          <p>
            Built with{" "}
            <a
              href="https://www.anthropic.com/claude-code"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-700 underline hover:text-zinc-900"
            >
              Claude Code
            </a>{" "}
            as a Sprint 01 / Code / Advanced capstone example for{" "}
            <a
              href="https://aibuildersclub.ai/capstone/sprint-01-dashboard"
              className="text-zinc-700 underline hover:text-zinc-900"
            >
              AI Builders Club
            </a>
            . All sample data — Hartwell Logistics is fictional.
          </p>
          <p>
            <a
              href="https://github.com/PoliTwit1984/hartwell-dashboard"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-700 underline hover:text-zinc-900"
            >
              github.com/PoliTwit1984/hartwell-dashboard
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
