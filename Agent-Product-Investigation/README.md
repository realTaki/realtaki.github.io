# Agent Infra Landscape 2026

An interactive visual page showcasing the 2026 Agent Infrastructure landscape — 6 major modules, 12 sub-categories, 170+ tools, plus 13 AI Security companies with funding data. The project data is now sourced from the [antgroup/agentic-ai-landscape](https://github.com/antgroup/agentic-ai-landscape) open dataset and enriched with bilingual descriptions.

🌐 **Live page**: [https://github.com/realTaki/api/blob/main/index.html](https://github.com/realTaki/api/blob/main/index.html)

## 🚀 Quick Start

Just open `index.html` in any modern browser — pure frontend, no build step, no dependencies to install.

```bash
# Or serve locally
python3 -m http.server 8000
# Then visit http://localhost:8000
```

## 📊 What's Inside

- **6 Major Modules** (clickable cards with expandable tool lists)
  - Agentic Coding (Coding Agent + Coding Harness)
  - Personal AI Assistant
  - Chatbot
  - Agent Framework (Multi-agent / Workflow / Code-First)
  - Agent Runtime Infra (Memory / Protocols / Tool Use / Observability / API Proxy / Sandbox)
  - AI Security

- **178 tools** in `js/data.js`, including:
  - 80 hand-curated entries (existing research)
  - 93 entries extracted from `antgroup/agentic-ai-landscape` (incl. **Model Infra** layer — Inference, Pre-Train, Post-Train, Data, Compute)

- **Interactive Features**
  - Click any tool/company → opens a detail modal
  - Open Source projects → shows "View on GitHub" button
  - Companies → shows "Visit Website" button
  - Hybrid tools (e.g. CopilotKit, Daytona) → shows both
  - Search & filter across all tools
  - 13 AI Security funding records with stage / amount / date / notes

## 🛠️ Tech Stack

- HTML / CSS / JavaScript (no build step)
- `js/data.js` + `js/derived.js` + `js/meta.js` + `js/modal.js` + `js/render.js` + `js/main.js` (classic scripts loaded in order)
- [Outfit](https://fonts.google.com/specimen/Outfit) + JetBrains Mono (Google Fonts)
- [Mermaid.js](https://mermaid.js.org/) (CDN) for architecture diagrams
- Inline SVG icons

## 📁 Files

- `index.html` — page structure + styles
- `js/data.js` — single source of truth for tools/data (178 items)
- `js/derived.js` — flattened fundings, `byName` lookup
- `js/meta.js` — page-level metadata
- `js/modal.js` — tool detail modal
- `js/render.js` — section renderers
- `js/main.js` — module entry, navigation
- `probe.html` — internal debugging playground

## 📝 Data Sources

- **Primary**: [antgroup/agentic-ai-landscape](https://github.com/antgroup/agentic-ai-landscape) — `data/agentic-ai-projects.csv` (snapshot 2026-07)
- Hand-curated entries (existing research, 80 items)
- AI Security funding records (BusinessWire, SecurityWeek, TechCrunch, Axios, etc.)

## 🔄 Schema

Each entry in `items[]` has these fields:

| Field | Description |
|---|---|
| `name`, `category`, `subCategory`, `type` | Identity / placement |
| `desc`, `desc_en` | Bilingual description (ZH + EN) |
| `repo`, `website` | URLs |
| `stars`, `forks`, `openIssues` | GitHub signals |
| `license`, `archived`, `language` | Project hygiene |
| `lastPush`, `createdAt` | Activity timeline |
| `topics[]` | GitHub tags |
| `openrank` | OpenDigger popularity metric |
| `landscapeAction`, `selectionReason`, `selectionCaveat` | Source-landscape notes (keep/add/remove) |
| `funding`, `funding_breakdown[]`, `investors[]`, `products[]`, `papers[]` | Companies only |

## ⚠️ Caveats

- Some tool URLs are best-effort; if you find errors, open an issue or PR.
- `Onyx Security` funding amount shows `$113B` in the original source — this is almost certainly a typo for `$113M` or `$1.13B`, flagged in the page.
- CSV entries with `landscapeAction="omit"` or empty `landscape_layer / section` are intentionally excluded.

---

Made with Mavis · Last updated 2026-08-09
