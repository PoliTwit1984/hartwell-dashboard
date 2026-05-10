<div align="center">

# 📊 Hartwell Dashboard

**Advanced AI Builders Club Sprint 01 capstone — what's possible if you push hard.**

An operations dashboard for "Hartwell Industries," a fictional mid-market manufacturer. Built to show the upper end of what a non-engineer can ship in 4 weeks: real data viz, agentic AI patterns, production deploy.

[![Built_for](https://img.shields.io/badge/Built_for-AI_Builders_Club-d97757)](https://aibuildersclub.ai)
[![Sprint](https://img.shields.io/badge/Sprint-01_Capstone-22c55e)]()
[![Next.js](https://img.shields.io/badge/Next.js-16-000000?logo=next.js)](https://nextjs.org)
[![License](https://img.shields.io/badge/License-MIT-blue)](#license)

</div>

---

## Why it exists

Sprint 01 capstones come in three difficulty tiers:

| Tier | Example | What it teaches |
|---|---|---|
| Easy | Landing page + form | Frontend + Vercel |
| Middle | Priya RAG | Retrieval, embeddings, agentic chat |
| **Advanced** | **Hartwell Dashboard** | **Real-time dashboards, agentic insights, production deploy** |

Hartwell is the **stretch goal** — what's possible if you push past the comfort zone.

## What's in here

- **📈 Live ops dashboard** with KPI cards, trend charts, and a real-time alert feed
- **🧠 AI insights panel** — Claude summarizes anomalies in the data and recommends actions
- **🔍 Drill-down views** for each KPI, with cohort and segment slicing
- **🎲 Mock data generator** so the dashboard runs end-to-end without a live backend
- **📱 Responsive layout** — works on phone, tablet, and 32" monitors

## Quick start

```bash
git clone https://github.com/joewilsonai/hartwell-dashboard
cd hartwell-dashboard
npm install
cp .env.example .env.local   # add ANTHROPIC_API_KEY
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Stack

- **Next.js 16** (App Router) + **TypeScript** + **Tailwind v4**
- **Anthropic SDK** for the insights agent
- **Recharts** for visualization
- **Vercel** for deploy

## Companion projects

- 🧠 **[priya-rag](https://github.com/joewilsonai/priya-rag)** — Middle-tier Sprint capstone (RAG pipeline)
- 🧠 **[priya-rag-web](https://github.com/joewilsonai/priya-rag-web)** — Priya's chat UI

## License

MIT — fork it, learn from it, ship your own.

Built by [Joe Wilson](https://github.com/joewilsonai) for [AI Builders Club](https://aibuildersclub.ai).
