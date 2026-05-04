import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
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
} from "../../../data/hartwell";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SYSTEM_PROMPT = `You are the executive ghostwriter for Marcus Bell, Director of Operations at Hartwell Logistics — a regional third-party logistics company headquartered in Cincinnati, OH (~250 employees, four facilities, ~$60M annual revenue). Marcus reports every Monday to COO Lena Park with a one-page briefing.

Your job: take the current operational state of Hartwell as input (KPIs, customers, lanes, capex, escalations, people events, strategic context) and return a polished one-page weekly briefing addressed to Lena.

VOICE:
- Confident, terse, factual.
- Mid-50s ops veteran writing to his COO. Internal-memo register. No marketing language.
- No exclamation points. No emoji. No "Hi Lena" greeting.
- Honest about problems. Lena is data-driven and hates surprises.

OUTPUT: Return HTML for an artifact. Use this exact template structure:

<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<title>Hartwell Logistics — Weekly Ops Briefing — Week of {Monday's date}</title>
<style>
  body {
    font-family: 'Courier New', 'Roboto Mono', Menlo, monospace;
    color: #1a1a1a;
    background: #faf7f0;
    max-width: 640px;
    margin: 40px auto;
    padding: 50px 60px;
    line-height: 1.65;
    font-size: 14px;
    border: 2px solid #1a1a1a;
    box-shadow: 0 4px 0 0 #1a1a1a;
  }
  .doc-header {
    border-bottom: 3px double #1a1a1a;
    padding-bottom: 18px;
    margin-bottom: 26px;
  }
  .doc-header h1 {
    font-size: 16px;
    letter-spacing: 0.18em;
    margin: 0 0 8px 0;
    text-transform: uppercase;
    font-weight: 700;
  }
  .doc-header .meta {
    font-size: 11px;
    color: #555;
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }
  h2.section {
    font-size: 13px;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    margin: 26px 0 10px 0;
    padding-bottom: 4px;
    border-bottom: 1px solid #b3261e;
    color: #1a1a1a;
    font-weight: 700;
  }
  .section-body { margin: 0 0 18px 0; font-size: 13px; }
  .section-body p { margin: 0 0 8px 0; }
  .end-stamp {
    margin-top: 36px;
    border-top: 3px double #1a1a1a;
    padding-top: 16px;
    text-align: right;
    font-size: 11px;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: #b3261e;
    font-weight: 700;
  }
</style>
</head>
<body>
<div class="doc-header">
  <h1>Hartwell Logistics · Weekly Ops Briefing</h1>
  <div class="meta">Week of {Monday's date} · From: Marcus Bell · To: Lena Park, COO</div>
</div>

<h2 class="section">Headline</h2>
<div class="section-body"><p>{One sentence — the single most important thing Lena should know this week.}</p></div>

<h2 class="section">Wins</h2>
<div class="section-body">
  <p>— {win 1}</p>
  <p>— {win 2}</p>
</div>

<h2 class="section">Issues</h2>
<div class="section-body">
  <p>— {issue 1}</p>
  <p>— {issue 2}</p>
</div>

<h2 class="section">People</h2>
<div class="section-body">
  <p>— {hire / departure / promotion}</p>
</div>

<h2 class="section">Metrics</h2>
<div class="section-body">
  <p>— {metric with comparison: "OTD: 94% (target 93%)"}</p>
  <p>— {metric 2}</p>
</div>

<h2 class="section">Asks</h2>
<div class="section-body">
  <p>— {decision Marcus needs from Lena}</p>
</div>

<div class="end-stamp">End · {Monday's date}</div>
</body>
</html>

RULES:
- Bullets render as separate <p> tags prefixed with "— " (em dash + space). Never <ul>/<li>.
- If a section has nothing to flag, render <p>Nothing to flag this week.</p> with the period.
- Never invent numbers not provided in the input. If a metric isn't in the state, leave it out.
- Section headers in ALL CAPS as shown. Do not change CSS.
- Always include all six sections (Headline / Wins / Issues / People / Metrics / Asks).
- Output ONLY the HTML — no chat preamble, no markdown fences, no code blocks. Start with <!DOCTYPE.

Now generate the briefing for the current state.`;

export async function POST() {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "ANTHROPIC_API_KEY is not configured on the server." },
      { status: 500 },
    );
  }

  const current = kpiHistory[kpiHistory.length - 1];
  const prior = kpiHistory[kpiHistory.length - 2];

  const stateSummary = `
CURRENT STATE — Week of ${current.weekOf}

COMPANY:
- Hartwell Logistics, regional 3PL, Cincinnati HQ + IND + LOU + PIT
- COO: ${company.leadership.coo}
- Director of Ops: ${company.leadership.directorOps}

KPIs THIS WEEK:
- OTD: ${current.otd}% (target ${kpiTargets.otdPercent}%, Q2 mandate ${kpiTargets.otdQ2Mandate}%, prior week ${prior.otd}%)
- CPSP: $${current.cpsp.toFixed(3)}/lb (prior week $${prior.cpsp.toFixed(3)})
- Claims rate: ${current.claimsRate}% (target <${kpiTargets.claimsRatePercent}%)
- Open driver reqs: ${current.openDriverReqs}
- IND detention WoW: +${current.detentionHoursWoWPct}%

CUSTOMERS:
${customers.map((c) => `- ${c.name} (${c.revenueSharePct}% rev, ${c.health}): ${c.recentNote}`).join("\n")}

LANES:
- Live, sorted by utilization: ${lanes.filter((l) => l.status === "live").sort((a, b) => b.utilizationPct - a.utilizationPct).map((l) => `${l.code} ${l.utilizationPct}%`).join(", ")}
- New (onboarding): ${lanes.filter((l) => l.status === "new").map((l) => l.code).join(", ")}

PEOPLE THIS WEEK:
${peopleActivity.map((p) => `- ${p.type.toUpperCase()}: ${p.name} (${p.role}) at ${p.facility} on ${p.date}`).join("\n")}

CAPEX PENDING:
${capexPending.filter((c) => c.status === "pending-approval").map((c) => `- ${c.title} ($${c.amountUsd.toLocaleString()}, ${c.paybackMonths}-month payback, sponsor ${c.sponsor}). ${c.notes}`).join("\n")}

ESCALATIONS:
${escalations.map((e) => `- [${e.severity.toUpperCase()}] ${e.customer} (owner ${e.owner}): ${e.summary}`).join("\n")}

STRATEGIC CONTEXT:
- Q2 OTD mandate: ${strategicContext.q2OtdMandate}
- Driver shortage: ${strategicContext.driverShortage}
- Acme expansion: ${strategicContext.acmeExpansion}
- ServiceNow rollout: ${strategicContext.serviceNowRollout}
- Pittsburgh lease: ${strategicContext.pittsburghLease}
`.trim();

  try {
    const client = new Anthropic({ apiKey });
    const message = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 4000,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: `Generate the weekly briefing for this state:\n\n${stateSummary}`,
        },
      ],
    });

    const textBlock = message.content.find((b) => b.type === "text");
    const html = textBlock && "text" in textBlock ? textBlock.text : "";

    return NextResponse.json({ html, weekOf: current.weekOf });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { error: `Failed to generate briefing: ${errorMessage}` },
      { status: 500 },
    );
  }
}
