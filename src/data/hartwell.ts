// Hartwell Logistics — fake company data for the Sprint 01 / Code / Advanced
// capstone demo. Reuses the persona established in the abc-site repo:
// /docs/sprint-demos/sprint-01-hartwell/. Marcus Bell, Director of Operations,
// reports to Lena Park, COO. ~250 employees, 4 facilities, ~$60M revenue.

export const company = {
  name: "Hartwell Logistics",
  hq: "Cincinnati, OH",
  founded: 1998,
  employees: 250,
  annualRevenueM: 60,
  facilities: [
    { code: "CIN", city: "Cincinnati, OH", role: "HQ + main warehouse", sqft: 180_000, headcount: 120 },
    { code: "IND", city: "Indianapolis, IN", role: "Warehouse + cross-dock", sqft: 95_000, headcount: 55 },
    { code: "LOU", city: "Louisville, KY", role: "Cross-dock + last-mile", sqft: 60_000, headcount: 35 },
    { code: "PIT", city: "Pittsburgh, PA", role: "Warehouse", sqft: 75_000, headcount: 40 },
  ],
  leadership: {
    chairman: "Ed Hartwell",
    coo: "Lena Park",
    directorOps: "Marcus Bell",
    vpSales: "Tony Marchetti",
    directorCustomerSolutions: "Priya Iyengar",
    directorFleet: "Greg Halloran",
    directorHR: "Renee Sims",
  },
};

// Data-source attribution — where each widget's data lives in real life.
// The whole pitch of building this dashboard in the cohort is "you don't
// migrate, you connect" — the dashboard composes data already living in
// your existing systems.
export type DataSource = {
  system: string;
  category: "tms" | "crm" | "hr" | "tickets" | "spreadsheet" | "files" | "notes";
  flavor: string;
};

export const dataSources: Record<string, DataSource> = {
  kpiCards: {
    system: "McLeod LoadMaster (TMS)",
    category: "tms",
    flavor: "Daily extract → cached weekly snapshot",
  },
  otdTrend: {
    system: "McLeod LoadMaster (TMS)",
    category: "tms",
    flavor: "12-week historical run, joined to dispatch records",
  },
  customerHealth: {
    system: "Salesforce + Priya's status spreadsheet",
    category: "crm",
    flavor: "Account ownership from CRM; status flags from Priya's weekly sheet",
  },
  laneUtilization: {
    system: "McLeod LoadMaster + Greg's lane planner",
    category: "tms",
    flavor: "Loaded vs total miles by corridor; new-lane onboarding flags from Greg",
  },
  capexBoard: {
    system: "Capex tracker (Excel) + Notion",
    category: "spreadsheet",
    flavor: "Sponsor + payback model in Excel; status moved to Notion in March",
  },
  escalationsQueue: {
    system: "ServiceNow (post-May 12) / email queue (current)",
    category: "tickets",
    flavor: "Priya's queue; migrating from email-CC chains to tickets May 12",
  },
  peopleActivity: {
    system: "Greenhouse (ATS) + Renee's hire/exit spreadsheet",
    category: "hr",
    flavor: "Hires via ATS; departures + promotions tracked manually by Renee",
  },
  strategicContext: {
    system: "Marcus's running notes + leadership Slack",
    category: "notes",
    flavor: "Updated weekly before the Monday COO meeting",
  },
};

// All distinct data-source systems for the top-strip "Pulling from N
// sources" callout. De-duplicated by display label.
export const allSourceSystems = [
  { label: "McLeod LoadMaster", category: "tms" as const, role: "TMS" },
  { label: "Salesforce", category: "crm" as const, role: "CRM" },
  { label: "Greenhouse (ATS)", category: "hr" as const, role: "Hiring" },
  { label: "ServiceNow", category: "tickets" as const, role: "Escalations (May 12+)" },
  { label: "Excel / Notion", category: "spreadsheet" as const, role: "Capex tracker" },
  { label: "Slack + Marcus's notes", category: "notes" as const, role: "Strategic context" },
];

export const kpiTargets = {
  otdPercent: 93,
  otdQ2Mandate: 94,
  claimsRatePercent: 1.2,
  cpspBaselineDollarsPerLb: 0.082,
};

// 12 weeks of historical KPI data, ending the week of May 4, 2026 (current
// week). Realistic patterns: Q1 OTD struggle (under target), Q2 mandate kicks
// in, recent improvement; CPSP wobbles with fuel surcharges; claims rate
// stable; detention pressure elevated due to IND driver shortage.
export type WeeklyKpi = {
  weekOf: string;
  otd: number;
  cpsp: number;
  claimsRate: number;
  openDriverReqs: number;
  detentionHoursWoWPct: number;
};

export const kpiHistory: WeeklyKpi[] = [
  { weekOf: "2026-02-16", otd: 91.4, cpsp: 0.080, claimsRate: 1.05, openDriverReqs: 5, detentionHoursWoWPct: 4 },
  { weekOf: "2026-02-23", otd: 91.8, cpsp: 0.081, claimsRate: 0.95, openDriverReqs: 6, detentionHoursWoWPct: 6 },
  { weekOf: "2026-03-02", otd: 92.0, cpsp: 0.083, claimsRate: 1.10, openDriverReqs: 6, detentionHoursWoWPct: 8 },
  { weekOf: "2026-03-09", otd: 91.5, cpsp: 0.085, claimsRate: 1.00, openDriverReqs: 7, detentionHoursWoWPct: 11 },
  { weekOf: "2026-03-16", otd: 92.2, cpsp: 0.084, claimsRate: 0.92, openDriverReqs: 7, detentionHoursWoWPct: 13 },
  { weekOf: "2026-03-23", otd: 91.9, cpsp: 0.082, claimsRate: 0.88, openDriverReqs: 8, detentionHoursWoWPct: 15 },
  { weekOf: "2026-03-30", otd: 92.5, cpsp: 0.083, claimsRate: 0.90, openDriverReqs: 8, detentionHoursWoWPct: 17 },
  { weekOf: "2026-04-06", otd: 93.1, cpsp: 0.085, claimsRate: 0.95, openDriverReqs: 8, detentionHoursWoWPct: 18 },
  { weekOf: "2026-04-13", otd: 93.4, cpsp: 0.086, claimsRate: 0.92, openDriverReqs: 8, detentionHoursWoWPct: 20 },
  { weekOf: "2026-04-20", otd: 93.7, cpsp: 0.085, claimsRate: 0.89, openDriverReqs: 8, detentionHoursWoWPct: 22 },
  { weekOf: "2026-04-27", otd: 94.0, cpsp: 0.086, claimsRate: 0.90, openDriverReqs: 8, detentionHoursWoWPct: 22 },
  { weekOf: "2026-05-04", otd: 94.0, cpsp: 0.089, claimsRate: 0.90, openDriverReqs: 8, detentionHoursWoWPct: 22 },
];

export type CustomerHealth = "healthy" | "watch" | "risk";

export type Customer = {
  name: string;
  industry: string;
  revenueSharePct: number;
  primaryContact: string;
  health: CustomerHealth;
  recentNote: string;
  // Hartwell-side ownership for this account
  attachedPeople: { ae: string; ops: string; accountManager: string };
  // Lanes this customer ships through
  lanes: string[];
  // Per-customer current-week KPIs (when filtered)
  weekKpis: { otd: number; cpsp: number; claimsRate: number; volumeIndex: number };
  // 12-week OTD history (when filtered)
  otdHistory: { weekOf: string; otd: number }[];
};

// Helper to generate plausible 12-week OTD history per customer with
// individual baselines + week-over-week noise.
function generateOtdHistory(baselines: number[]): { weekOf: string; otd: number }[] {
  return kpiHistory.map((w, i) => ({ weekOf: w.weekOf, otd: baselines[i] }));
}

export const customers: Customer[] = [
  {
    name: "Acme Manufacturing",
    industry: "Specialty fasteners",
    revenueSharePct: 14.0,
    primaryContact: "Janelle Forsythe · VP Supply Chain",
    health: "healthy",
    recentNote: "Expansion deal closed end of April — three new southbound lanes (ATL-DFW/NYC/MIA) onboarding starts Monday. Risk: ATL driver pool overlaps existing CIN-DFW recruiting.",
    attachedPeople: { ae: "Tony Marchetti", ops: "Priya Iyengar", accountManager: "Janelle Forsythe (customer-side)" },
    lanes: ["CIN-DFW", "CIN-ATL", "ATL-DFW", "ATL-NYC", "ATL-MIA"],
    weekKpis: { otd: 95.2, cpsp: 0.087, claimsRate: 0.5, volumeIndex: 142 },
    otdHistory: generateOtdHistory([93.0, 93.5, 94.1, 93.8, 94.5, 94.2, 94.8, 95.1, 95.0, 95.3, 95.5, 95.2]),
  },
  {
    name: "Midstate Building Products",
    industry: "Regional building supply",
    revenueSharePct: 9.0,
    primaryContact: "David Hwang · Director of Distribution",
    health: "healthy",
    recentNote: "Quiet week. Annual rate negotiation cycle still January 2027.",
    attachedPeople: { ae: "Tony Marchetti", ops: "Priya Iyengar", accountManager: "David Hwang (customer-side)" },
    lanes: ["CIN-ATL", "LOU-NSH", "PIT-PHI"],
    weekKpis: { otd: 94.8, cpsp: 0.084, claimsRate: 0.7, volumeIndex: 95 },
    otdHistory: generateOtdHistory([93.5, 93.8, 94.0, 94.2, 94.5, 94.3, 94.6, 94.5, 94.7, 94.8, 94.6, 94.8]),
  },
  {
    name: "Vitalux Beverage Co.",
    industry: "Craft beverage",
    revenueSharePct: 7.0,
    primaryContact: "Sam Ortega · Logistics Lead",
    health: "watch",
    recentNote: "Volume up 30% YoY but considering direct-fleet move. Tony has retention conversation booked May 12.",
    attachedPeople: { ae: "Tony Marchetti", ops: "Priya Iyengar", accountManager: "Sam Ortega (customer-side)" },
    lanes: ["CIN-NYC", "CIN-ATL"],
    weekKpis: { otd: 91.5, cpsp: 0.092, claimsRate: 1.4, volumeIndex: 78 },
    otdHistory: generateOtdHistory([93.5, 92.8, 92.3, 91.9, 91.5, 91.0, 90.8, 91.2, 91.0, 91.3, 91.4, 91.5]),
  },
  {
    name: "Threadway Apparel",
    industry: "Mid-market apparel",
    revenueSharePct: 5.0,
    primaryContact: "Marisol Becker · Operations Director",
    health: "healthy",
    recentNote: "Q2 baseline volume. Q4 capacity strain expected.",
    attachedPeople: { ae: "Tony Marchetti", ops: "Priya Iyengar", accountManager: "Marisol Becker (customer-side)" },
    lanes: ["PIT-PHI", "CIN-NYC"],
    weekKpis: { otd: 93.6, cpsp: 0.083, claimsRate: 0.8, volumeIndex: 56 },
    otdHistory: generateOtdHistory([92.5, 92.8, 93.0, 93.2, 93.5, 93.4, 93.6, 93.5, 93.7, 93.6, 93.5, 93.6]),
  },
  {
    name: "Carbon Forge Industrial",
    industry: "Metal stamping (auto/appliance)",
    revenueSharePct: 3.0,
    primaryContact: "Pete Salazar · Plant Manager",
    health: "healthy",
    recentNote: "Highest gross margin per shipment. First claim in 14 months filed this week — small ($2,800 damage on Detroit shipment), Pete unfazed.",
    attachedPeople: { ae: "Tony Marchetti", ops: "Priya Iyengar", accountManager: "Pete Salazar (customer-side)" },
    lanes: ["IND-DET", "IND-CHI"],
    weekKpis: { otd: 95.8, cpsp: 0.078, claimsRate: 1.2, volumeIndex: 31 },
    otdHistory: generateOtdHistory([95.0, 95.2, 95.5, 95.3, 95.6, 95.4, 95.7, 95.5, 95.8, 95.7, 95.6, 95.8]),
  },
];

export type Lane = {
  code: string;
  corridor: string;
  utilizationPct: number;
  status: "live" | "new";
};

export const lanes: Lane[] = [
  { code: "CIN-DFW", corridor: "Cincinnati → Dallas/Fort Worth", utilizationPct: 88, status: "live" },
  { code: "CIN-ATL", corridor: "Cincinnati → Atlanta", utilizationPct: 84, status: "live" },
  { code: "CIN-NYC", corridor: "Cincinnati → New York metro", utilizationPct: 81, status: "live" },
  { code: "CIN-PHX", corridor: "Cincinnati → Phoenix", utilizationPct: 68, status: "live" },
  { code: "IND-CHI", corridor: "Indianapolis → Chicago", utilizationPct: 79, status: "live" },
  { code: "IND-DET", corridor: "Indianapolis → Detroit", utilizationPct: 86, status: "live" },
  { code: "LOU-NSH", corridor: "Louisville → Nashville", utilizationPct: 91, status: "live" },
  { code: "PIT-PHI", corridor: "Pittsburgh → Philadelphia", utilizationPct: 77, status: "live" },
  { code: "ATL-DFW", corridor: "Atlanta → Dallas/Fort Worth", utilizationPct: 0, status: "new" },
  { code: "ATL-NYC", corridor: "Atlanta → New York metro", utilizationPct: 0, status: "new" },
  { code: "ATL-MIA", corridor: "Atlanta → Miami", utilizationPct: 0, status: "new" },
];

export type PeopleEvent = {
  date: string;
  type: "hire" | "departure" | "promotion";
  name: string;
  role: string;
  facility: string;
  customerTag?: string;
};

export const peopleActivity: PeopleEvent[] = [
  { date: "2026-04-28", type: "hire", name: "Anjali Singh", role: "Dispatcher", facility: "IND", customerTag: "Carbon Forge Industrial" },
  { date: "2026-05-02", type: "hire", name: "Mariana Cruz", role: "Warehouse Picker", facility: "PIT", customerTag: "Threadway Apparel" },
  { date: "2026-05-15", type: "departure", name: "Raul Vega", role: "Warehouse Lead (retiring)", facility: "LOU", customerTag: "Midstate Building Products" },
];

export type CapexItem = {
  id: string;
  title: string;
  amountUsd: number;
  paybackMonths: number;
  sponsor: string;
  status: "pending-approval" | "approved" | "deferred";
  notes: string;
  customerTag?: string;
};

export const capexPending: CapexItem[] = [
  {
    id: "CAP-2026-014",
    title: "Louisville third dock door",
    amountUsd: 185_000,
    paybackMonths: 14,
    sponsor: "Greg Halloran",
    status: "pending-approval",
    notes: "Existing two doors at >90% morning-load utilization; LOU volume up 11% YoY.",
    customerTag: "Midstate Building Products",
  },
  {
    id: "CAP-2026-018",
    title: "ATL hub driver-recruiting program",
    amountUsd: 95_000,
    paybackMonths: 9,
    sponsor: "Greg Halloran",
    status: "pending-approval",
    notes: "Sign-on bonus pool + Ivy Tech ATL CDL training partnership to staff the new ATL-DFW/NYC/MIA lanes from Acme expansion.",
    customerTag: "Acme Manufacturing",
  },
  {
    id: "CAP-2026-009",
    title: "McLeod TMS upgrade",
    amountUsd: 240_000,
    paybackMonths: 30,
    sponsor: "Greg Halloran",
    status: "deferred",
    notes: "Deferred to Q4 2026 budget cycle. Lena pushed back on March timing.",
  },
];

export type Escalation = {
  customer: string;
  severity: "low" | "medium" | "high";
  opened: string;
  owner: string;
  summary: string;
  status: "open" | "monitoring" | "resolved";
};

export const escalations: Escalation[] = [
  {
    customer: "Acme Manufacturing",
    severity: "medium",
    opened: "2026-05-03",
    owner: "Priya Iyengar",
    summary: "ATL-DFW onboarding readiness review — driver pool concerns flagged by Greg.",
    status: "monitoring",
  },
  {
    customer: "Vitalux Beverage Co.",
    severity: "high",
    opened: "2026-04-28",
    owner: "Tony Marchetti",
    summary: "Direct-fleet evaluation conversation — retention call booked May 12.",
    status: "open",
  },
  {
    customer: "Threadway Apparel",
    severity: "low",
    opened: "2026-04-30",
    owner: "Priya Iyengar",
    summary: "Q4 capacity planning early conversation. Marisol asked about peak-week buffers.",
    status: "monitoring",
  },
];

export const strategicContext = {
  q2OtdMandate: "Above 94% sustained — Q1 landed at 92.1%, currently at 94.0% week 18 of Q2.",
  driverShortage: "IND hub running 8 drivers short of plan; Greg's relief plan due end of week.",
  acmeExpansion: "Three new southbound lanes (ATL-DFW/NYC/MIA) — first volume hits May 6-10.",
  serviceNowRollout: "Customer-escalation tracking migrates from email to ServiceNow May 12.",
  pittsburghLease: "Decision window opens May 19 — renew + expand vs relocate.",
};
