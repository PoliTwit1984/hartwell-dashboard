"use client";

import { useMemo, useState } from "react";
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
  type WeeklyKpi,
  type CapexItem,
} from "../data/hartwell";
import { KpiCard } from "../components/KpiCard";
import { OtdTrend } from "../components/OtdTrend";
import { CustomerHealth } from "../components/CustomerHealth";
import { LaneUtilization } from "../components/LaneUtilization";
import { CapexBoard, formatUsd } from "../components/CapexBoard";
import { EscalationsQueue } from "../components/EscalationsQueue";
import { PeopleActivity } from "../components/PeopleActivity";
import { StrategicContext } from "../components/StrategicContext";
import { Modal } from "../components/Modal";
import { DateRangePicker, rangeToWeeks, type DateRange } from "../components/DateRangePicker";

export default function Dashboard() {
  // ─── state ────────────────────────────────────────────────────────────
  const [dateRange, setDateRange] = useState<DateRange>("12w");
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);
  const [selectedWeek, setSelectedWeek] = useState<WeeklyKpi | null>(null);
  const [selectedCapex, setSelectedCapex] = useState<CapexItem | null>(null);
  const [reportOpen, setReportOpen] = useState(false);
  const [reportLoading, setReportLoading] = useState(false);
  const [reportHtml, setReportHtml] = useState<string | null>(null);
  const [reportError, setReportError] = useState<string | null>(null);

  // ─── derived data ─────────────────────────────────────────────────────
  const weeksToShow = rangeToWeeks(dateRange);
  const filteredHistory = useMemo(
    () => kpiHistory.slice(-weeksToShow),
    [weeksToShow],
  );

  const current = filteredHistory[filteredHistory.length - 1];
  const prior =
    filteredHistory[filteredHistory.length - 2] ??
    kpiHistory[kpiHistory.length - 2];

  const otdDelta = current.otd - prior.otd;
  const cpspDeltaPct = ((current.cpsp - prior.cpsp) / prior.cpsp) * 100;
  const claimsDelta = current.claimsRate - prior.claimsRate;

  // Anomaly logic: flag a KPI when the comparison breaches its threshold.
  const otdAnomaly = current.otd < kpiTargets.otdPercent;
  const cpspAnomaly = Math.abs(cpspDeltaPct) >= 5;
  const claimsAnomaly = current.claimsRate >= kpiTargets.claimsRatePercent;
  const driverAnomaly = current.openDriverReqs > 5;

  const filteredEscalations = useMemo(
    () =>
      selectedCustomer
        ? escalations.filter((e) => e.customer === selectedCustomer)
        : escalations,
    [selectedCustomer],
  );

  const filteredCustomers = selectedCustomer
    ? customers.filter((c) => c.name === selectedCustomer)
    : customers;

  // ─── generate report ─────────────────────────────────────────────────
  const generateReport = async () => {
    setReportOpen(true);
    setReportLoading(true);
    setReportHtml(null);
    setReportError(null);
    try {
      const res = await fetch("/api/generate-report", { method: "POST" });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? `Server returned ${res.status}`);
      }
      const data = await res.json();
      setReportHtml(data.html);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      setReportError(msg);
    } finally {
      setReportLoading(false);
    }
  };

  // ─── render ───────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Top bar */}
      <header className="bg-white border-b border-zinc-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-baseline gap-3 flex-wrap">
            <h1 className="text-lg font-semibold text-zinc-900 tracking-tight">
              {company.name}
            </h1>
            <span className="text-zinc-300">·</span>
            <p className="text-sm text-zinc-700">Operations Dashboard</p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <DateRangePicker value={dateRange} onChange={setDateRange} />
            <button
              onClick={generateReport}
              disabled={reportLoading}
              className="bg-zinc-900 text-white text-sm font-medium px-4 py-1.5 rounded-md hover:bg-zinc-800 transition-colors disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center gap-2"
            >
              {reportLoading ? (
                <>
                  <span className="inline-block w-3 h-3 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Generating…
                </>
              ) : (
                <>Generate weekly briefing →</>
              )}
            </button>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 pb-3 text-xs text-zinc-500 flex items-center gap-3 flex-wrap">
          <span>Week of {current.weekOf}</span>
          <span className="text-zinc-300">·</span>
          <span>For {company.leadership.coo}, COO</span>
          <span className="text-zinc-300">·</span>
          <span>Owned by {company.leadership.directorOps}, Director of Ops</span>
        </div>
      </header>

      {/* Sample-data banner */}
      <div className="bg-amber-50 border-b border-amber-200">
        <div className="max-w-7xl mx-auto px-6 py-2.5 flex items-baseline justify-between gap-4 flex-wrap">
          <p className="text-xs text-amber-800">
            <span className="font-semibold uppercase tracking-wider">Sample build</span>
            <span className="mx-2 text-amber-300">·</span>
            Hartwell Logistics is a fictional regional 3PL used as a Sprint 01 / Code / Advanced capstone example for AI Builders Club. All people, customers, lanes, and metrics are sample data. Notes you add are stored only in your browser.
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
              anomaly={otdAnomaly}
              onClick={() => setSelectedWeek(current)}
            />
            <KpiCard
              label="Cost Per Shipped Pound"
              value={`$${current.cpsp.toFixed(3)}/lb`}
              comparison={`${cpspDeltaPct >= 0 ? "+" : ""}${cpspDeltaPct.toFixed(1)}% WoW · baseline $${kpiTargets.cpspBaselineDollarsPerLb.toFixed(3)}`}
              trend={cpspDeltaPct > 0 ? "up" : cpspDeltaPct < 0 ? "down" : "flat"}
              good={cpspDeltaPct <= 5}
              anomaly={cpspAnomaly}
            />
            <KpiCard
              label="Claims Rate"
              value={`${current.claimsRate.toFixed(2)}%`}
              comparison={`${claimsDelta >= 0 ? "+" : ""}${claimsDelta.toFixed(2)} pts WoW · target <${kpiTargets.claimsRatePercent}%`}
              trend={claimsDelta > 0 ? "up" : claimsDelta < 0 ? "down" : "flat"}
              good={current.claimsRate < kpiTargets.claimsRatePercent}
              anomaly={claimsAnomaly}
            />
            <KpiCard
              label="Open Driver Reqs"
              value={`${current.openDriverReqs}`}
              comparison={`+${current.detentionHoursWoWPct}% IND detention WoW`}
              trend={current.openDriverReqs > 5 ? "up" : "flat"}
              good={current.openDriverReqs <= 5}
              anomaly={driverAnomaly}
            />
          </div>
        </section>

        {/* OTD trend + Strategic context */}
        <section className="grid lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <OtdTrend
              history={filteredHistory}
              target={kpiTargets.otdPercent}
              q2Mandate={kpiTargets.otdQ2Mandate}
              onPointClick={setSelectedWeek}
            />
          </div>
          <div>
            <StrategicContext context={strategicContext} />
          </div>
        </section>

        {/* Customer health + Capex */}
        <section className="grid lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <CustomerHealth
              customers={customers}
              selectedCustomer={selectedCustomer}
              onSelectCustomer={setSelectedCustomer}
            />
          </div>
          <div>
            <CapexBoard items={capexPending} onSelectItem={setSelectedCapex} />
          </div>
        </section>

        {/* Lane utilization (full width) */}
        <section>
          <LaneUtilization lanes={lanes} />
        </section>

        {/* Escalations + People */}
        <section className="grid lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <EscalationsQueue escalations={filteredEscalations} />
          </div>
          <div>
            <PeopleActivity events={peopleActivity} />
          </div>
        </section>

        {selectedCustomer && (
          <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-4 flex items-center justify-between gap-3 flex-wrap text-sm">
            <p className="text-cyan-900">
              Filtered to <span className="font-semibold">{selectedCustomer}</span>.
              Customer Health table + escalation queue are showing only this account.
            </p>
            <button
              onClick={() => setSelectedCustomer(null)}
              className="text-cyan-700 hover:text-cyan-900 font-medium"
            >
              Clear filter ×
            </button>
          </div>
        )}

        {/* Filtered customer note */}
        {selectedCustomer && filteredCustomers[0] && (
          <div className="bg-white border border-zinc-200 rounded-lg p-5">
            <p className="text-xs uppercase tracking-wider text-zinc-500 font-medium mb-2">
              {filteredCustomers[0].name} · most recent note
            </p>
            <p className="text-sm text-zinc-700 leading-relaxed">
              {filteredCustomers[0].recentNote}
            </p>
          </div>
        )}
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

      {/* OTD week drill-down modal */}
      <Modal
        open={selectedWeek !== null}
        onClose={() => setSelectedWeek(null)}
        title={`Week of ${selectedWeek?.weekOf ?? ""}`}
        subtitle="Drill-down · top loads that missed the OTD window"
      >
        {selectedWeek && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="border border-zinc-200 rounded p-3">
                <p className="text-xs uppercase tracking-wider text-zinc-500 font-medium">OTD</p>
                <p className="text-xl font-semibold text-zinc-900 mt-1 tabular-nums">{selectedWeek.otd.toFixed(1)}%</p>
              </div>
              <div className="border border-zinc-200 rounded p-3">
                <p className="text-xs uppercase tracking-wider text-zinc-500 font-medium">Open driver reqs</p>
                <p className="text-xl font-semibold text-zinc-900 mt-1 tabular-nums">{selectedWeek.openDriverReqs}</p>
              </div>
              <div className="border border-zinc-200 rounded p-3">
                <p className="text-xs uppercase tracking-wider text-zinc-500 font-medium">CPSP</p>
                <p className="text-xl font-semibold text-zinc-900 mt-1 tabular-nums">${selectedWeek.cpsp.toFixed(3)}/lb</p>
              </div>
              <div className="border border-zinc-200 rounded p-3">
                <p className="text-xs uppercase tracking-wider text-zinc-500 font-medium">Claims rate</p>
                <p className="text-xl font-semibold text-zinc-900 mt-1 tabular-nums">{selectedWeek.claimsRate.toFixed(2)}%</p>
              </div>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-zinc-500 font-medium mb-2">
                Top 5 missed loads this week
              </p>
              <ul className="text-sm text-zinc-700 space-y-2">
                <li className="flex justify-between border-b border-zinc-100 pb-2">
                  <span>Acme Mfg · ATL-DFW · driver swap delay</span>
                  <span className="text-zinc-500 tabular-nums">+4h 10m</span>
                </li>
                <li className="flex justify-between border-b border-zinc-100 pb-2">
                  <span>Threadway · PIT-PHI · receiver overflow</span>
                  <span className="text-zinc-500 tabular-nums">+3h 25m</span>
                </li>
                <li className="flex justify-between border-b border-zinc-100 pb-2">
                  <span>Vitalux · CIN-NYC · weather hold</span>
                  <span className="text-zinc-500 tabular-nums">+2h 50m</span>
                </li>
                <li className="flex justify-between border-b border-zinc-100 pb-2">
                  <span>Midstate · LOU-NSH · loading-bay queue</span>
                  <span className="text-zinc-500 tabular-nums">+2h 15m</span>
                </li>
                <li className="flex justify-between">
                  <span>Carbon Forge · IND-DET · paperwork hold</span>
                  <span className="text-zinc-500 tabular-nums">+1h 45m</span>
                </li>
              </ul>
              <p className="text-xs text-zinc-400 italic mt-3">
                Sample data — in a real cohort build, this list comes from the TMS exception report.
              </p>
            </div>
          </div>
        )}
      </Modal>

      {/* Capex drill-down modal */}
      <Modal
        open={selectedCapex !== null}
        onClose={() => setSelectedCapex(null)}
        title={selectedCapex?.title ?? ""}
        subtitle={selectedCapex?.id ?? ""}
      >
        {selectedCapex && (
          <div className="space-y-5">
            <div className="grid grid-cols-3 gap-3">
              <div className="border border-zinc-200 rounded p-3">
                <p className="text-xs uppercase tracking-wider text-zinc-500 font-medium">Amount</p>
                <p className="text-xl font-semibold text-zinc-900 mt-1 tabular-nums">{formatUsd(selectedCapex.amountUsd)}</p>
              </div>
              <div className="border border-zinc-200 rounded p-3">
                <p className="text-xs uppercase tracking-wider text-zinc-500 font-medium">Payback</p>
                <p className="text-xl font-semibold text-zinc-900 mt-1 tabular-nums">{selectedCapex.paybackMonths} mo</p>
              </div>
              <div className="border border-zinc-200 rounded p-3">
                <p className="text-xs uppercase tracking-wider text-zinc-500 font-medium">Sponsor</p>
                <p className="text-base font-semibold text-zinc-900 mt-1">{selectedCapex.sponsor}</p>
              </div>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-zinc-500 font-medium mb-2">Justification</p>
              <p className="text-sm text-zinc-700 leading-relaxed">{selectedCapex.notes}</p>
            </div>
            <div className="border-t border-zinc-200 pt-4">
              <p className="text-xs uppercase tracking-wider text-zinc-500 font-medium mb-2">Approval workflow</p>
              <ol className="text-sm text-zinc-700 space-y-1.5 list-decimal pl-5">
                <li>Sponsor presents the case at Monday leadership meeting.</li>
                <li>COO reviews payback model + facility-volume data.</li>
                <li>Finance signs off on capex pool draw.</li>
                <li>PO created in TMS, vendor scheduled.</li>
              </ol>
              <p className="text-xs text-zinc-400 italic mt-3">
                Sample workflow — your build would tie this to your actual capex tracker.
              </p>
            </div>
          </div>
        )}
      </Modal>

      {/* Generate Report modal */}
      <Modal
        open={reportOpen}
        onClose={() => setReportOpen(false)}
        title="Weekly Leadership Briefing"
        subtitle={`Generated from current dashboard state · Week of ${current.weekOf}`}
        widthClass="max-w-3xl"
      >
        {reportLoading && (
          <div className="py-12 text-center">
            <div className="inline-block w-8 h-8 border-4 border-zinc-200 border-t-zinc-900 rounded-full animate-spin" />
            <p className="text-sm text-zinc-500 mt-4">
              Calling Claude to compose the briefing from the dashboard&apos;s current state…
            </p>
          </div>
        )}
        {reportError && (
          <div className="py-8">
            <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded p-4">
              <span className="font-semibold">Could not generate briefing:</span> {reportError}
            </p>
            <p className="text-xs text-zinc-500 mt-3">
              In production this would surface a friendlier error and a retry button. For the demo,
              the most common cause is a missing <code className="font-mono">ANTHROPIC_API_KEY</code> on the server.
            </p>
          </div>
        )}
        {reportHtml && (
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <p className="text-xs text-zinc-500 italic">
                Rendered as an HTML artifact — same shape as the Sprint 01 / Claude / Entry briefing Project. Forward this to Lena → Ed → Tony.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    if (reportHtml) navigator.clipboard.writeText(reportHtml).catch(() => {});
                  }}
                  className="text-xs font-medium text-zinc-700 border border-zinc-200 rounded px-3 py-1.5 hover:bg-zinc-50"
                >
                  Copy HTML
                </button>
                <button
                  onClick={() => {
                    const blob = new Blob([reportHtml], { type: "text/html" });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = `hartwell-briefing-${current.weekOf}.html`;
                    a.click();
                    URL.revokeObjectURL(url);
                  }}
                  className="text-xs font-medium text-white bg-zinc-900 rounded px-3 py-1.5 hover:bg-zinc-800"
                >
                  Download .html
                </button>
              </div>
            </div>
            <iframe
              srcDoc={reportHtml}
              title="Generated weekly briefing"
              className="w-full bg-white border border-zinc-200 rounded"
              style={{ minHeight: 640 }}
            />
          </div>
        )}
      </Modal>
    </div>
  );
}
