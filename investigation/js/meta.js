// UI metadata (module descriptions / icons / label maps).
// Classic script — no imports; loaded after data.js + derived.js.

/* module UI 元数据(仅描述/图标,工具列表从 items 派生) */
const moduleMeta = {
  "Agentic Coding":        { desc:"AI 写代码 + Coding Agent Harness,2026 最热赛道",      icon:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>' },
  "Personal AI Assistant": { desc:"个人向 AI 助理,主打多端接入与轻量化",                   icon:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>' },
  "Chatbot":              { desc:"本地化 / 私有化对话客户端",                               icon:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>' },
  "Agent Framework":      { desc:"构建 Agent 的底层框架与编排平台",                        icon:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>' },
  "Agent Runtime Infra":  { desc:"Agent 跑起来需要的一切:记忆、协议、工具、观测、沙箱",     icon:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="8" rx="2" ry="2"/><rect x="2" y="14" width="20" height="8" rx="2" ry="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/></svg>' },
  "Serving":              { desc:"把训练好的模型对外提供推理/部署服务",                  icon:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12h20"/><path d="M5 8h14"/><path d="M5 16h14"/><circle cx="12" cy="12" r="3"/></svg>' },
  "Post-Train":           { desc:"模型出来后还要再加工:SFT、DPO、RLHF、Agentic RL",   icon:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v4"/><path d="M12 18v4"/><path d="M4.93 4.93l2.83 2.83"/><path d="M16.24 16.24l2.83 2.83"/><path d="M2 12h4"/><path d="M18 12h4"/><path d="M4.93 19.07l2.83-2.83"/><path d="M16.24 7.76l2.83-2.83"/></svg>' },
  "Pre-Train":            { desc:"从零训练大模型的工具栈:分布式框架、编译加速、评估",   icon:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18"/><path d="M15 3v18"/><path d="M3 9h18"/><path d="M3 15h18"/></svg>' },
  "Data":                 { desc:"训练 / 评估 / RAG 数据的治理、集成与标注",              icon:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v6a9 3 0 0 0 18 0V5"/><path d="M3 11v6a9 3 0 0 0 18 0v-6"/></svg>' },
  "Compute & Scheduling": { desc:"Ray / Spark / Volcano 等分布式调度底座",                icon:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/><circle cx="7" cy="10" r="1"/><circle cx="12" cy="10" r="1"/><circle cx="17" cy="10" r="1"/></svg>' },
  "AI Lab":               { desc:"基础模型厂商与 AI 平台母公司,旗下产品收归 products",     icon:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>' },
  "AI Security":          { desc:"LLM 应用防护与 AI 治理,2025-2026 资本加速",              icon:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>' }
};

/* 页面上被特别标注(NEW 徽章 / 观察卡)的公司。改这里即可换人,
   不要再把公司名散落写死在 render.js 里。 */
const HIGHLIGHT_NAME = "Virtue AI";

const typeLabel = { os: "Open Source", co: "Company", both: "Hybrid" };
const typeBadgeClass = { os: "type-os", co: "type-co", both: "type-both" };
const typeFilterKey = { os:"os", co:"co", both:"both", all:"all" };

/* subCategory display-name whitelist.
   Keys that appear here use the mapped value as display text;
   keys NOT listed fall through to the raw subCategory string.
   Currently all entries are identity mappings — the map exists as an
   explicit override point for future translation/shortening needs. */
const subCatDisplay = {
  "Memory, Knowledge & Context":   "Memory, Knowledge & Context",
  "Protocols & Tool Interoperability": "Protocols & Tool Interoperability",
  "Workflow Platform & Agent Builder": "Workflow Platform & Agent Builder",
  "Code-First Agent Framework":   "Code-First Agent Framework",
  "Dev Environment":              "Dev Environment",
  "Model API Proxy":              "Model API Proxy",
  "Evaluation":                   "Evaluation",
};
