# Hartwell Dashboard

**AI Builders Club Sprint 01 — Advanced capstone example**

An operations dashboard for "Hartwell Industries," a fictional mid-market manufacturing company. Built to demonstrate the upper end of what a non-engineer can ship in a 4-week AIBC sprint: real data viz, real interactions, agentic patterns, and a production deploy.

## What's in here

- **Live ops dashboard** with KPI cards, trend charts, and a real-time alert feed
- **AI insights panel** — Claude summarizes anomalies in the data and recommends actions
- **Drill-down views** for each KPI, with cohort and segment slicing
- **Mock data generator** so the dashboard runs end-to-end without a live backend

## Stack

- **Next.js 16** (App Router) + **TypeScript** + **Tailwind v4**
- **Anthropic SDK** for the insights agent
- **Recharts** for visualization
- **Vercel** for deploy

## Run locally

```bash
git clone https://github.com/joewilsonai/hartwell-dashboard
cd hartwell-dashboard
npm install
cp .env.example .env.local   # add ANTHROPIC_API_KEY
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Why it exists

AI Builders Club Sprint 01 — *"Build a real AI product in 4 weeks."* Most capstones we showcase are the achievable middle (Priya RAG, BuildScope). Hartwell is the **stretch goal** — what's possible if you push hard, learn fast, and ship loud.

Built by [Joe Wilson](https://github.com/joewilsonai) for [AI Builders Club](https://aibuildersclub.ai).

## License

MIT
