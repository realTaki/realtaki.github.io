/* ================================================================
   Blog post manifest — single source of truth for all blog cards.

   Home page (/) uses data-blog-latest="N" to render the N most
   recent posts. Blog index (/blog/) uses data-blog-all to render
   every entry. Each post has a slug (folder name), date (YYYY-MM-DD),
   bilingual title/desc, and an array of tag pills.

   Tag kinds:
     - 'ghost'   transparent + grey text, used for the date pill
     - 'default' blue   (matches .tag)
     - 'pink'    pink   (matches .tag.pink)
     - 'amber'   amber  (matches .tag.amber) — used by AI-aggregated badge
     - 'plain'   no class, fully custom (use `html` field)

   Tag content can be plain text (`text`) or HTML with data-lang
   spans (`html`) — used by the bilingual AI-aggregated pill.

   To add a new post: append a new entry here with a unique slug,
   the date the post is being published, and the appropriate tags.
   The homepage and blog index will pick it up automatically on
   next page load (no HTML edit needed).
   ================================================================ */
(function () {
  window.BLOG_POSTS = [
    {
      slug: 'mas-assurance-framework',
      date: '2026-08-13',
      title: {
        zh: 'MAS 质量、架构、可观测性与安全保障',
        en: 'MAS Quality, Architecture, Observability & Assurance'
      },
      desc: {
        zh: '从上下文隔离到动态因果交互图:一套面向多智能体系统的质量评测、红队与蓝队统一保障框架。',
        en: 'A unified assurance framework for multi-agent systems — context isolation, dynamic causal interaction graphs, and combined red-team / blue-team evaluation.'
      },
      tags: [
        { kind: 'ghost',   text: '📅 2026-08-13' },
        { kind: 'default', text: 'Multi-Agent' },
        { kind: 'default', text: 'Observability' },
        { kind: 'pink',    text: 'AI Security' }
      ]
    },

    {
      slug: 'designing-for-abundant-intelligence',
      date: '2026-08-09',
      title: {
        zh: 'Designing for Abundant Intelligence',
        en: 'Designing for Abundant Intelligence'
      },
      desc: {
        zh: '不要围绕今天的大模型局限构建未来。中英双语长文,关于 AI 创新、Multi-Agent 协调与未来协议化基础设施。',
        en: 'Don\'t build the future around today\'s model limitations. A bilingual long read on AI innovation, multi-agent coordination and protocol-based infrastructure.'
      },
      tags: [
        { kind: 'ghost',   text: '📅 2026-08-09' },
        { kind: 'default', text: 'AI' },
        { kind: 'default', text: 'Multi-Agent' },
        { kind: 'pink',    text: '系统设计' }
      ]
    },

    {
      slug: 'insight-virtue',
      date: '2026-08-07',
      title: {
        zh: 'Virtue AI 值得关注 · 4 位 AI 安全教授 × 完整产品矩阵',
        en: 'Why Virtue AI Matters · 4 AI-Safety Professors × Full Product Lineup'
      },
      desc: {
        zh: '由 4 位 AI 安全领域顶尖学者创立,Seed+A 合计 $30M;AutoRedTeamer → DTAP,研究到产品的完整链路。',
        en: 'Founded by 4 leading AI-safety professors; Seed+A combined $30M. AutoRedTeamer → DTAP — a rare research-to-product pipeline in the AI-security category.'
      },
      tags: [
        { kind: 'ghost',   text: '📅 2026-08-07' },
        { kind: 'amber',   html: '🤖 <span data-lang="zh">AI 聚合</span><span data-lang="en">AI-aggregated</span>' },
        { kind: 'default', text: 'Virtue AI' },
        { kind: 'default', text: 'AI Security' },
        { kind: 'pink',    text: 'Insights' }
      ]
    },

    {
      slug: 'insight-mna',
      date: '2026-08-07',
      title: {
        zh: '大厂开始扫货 · 3 起收购 · 合计 ~$800M',
        en: 'Big Tech on a Buying Spree · 3 Deals · ~$800M Total'
      },
      desc: {
        zh: 'Lakera (~$300M) + Protect AI (~$500M) 在 2025 年内被收购,头部整合信号明确;云厂商和 LLM 平台是下一波买方。',
        en: 'Lakera (~$300M) + Protect AI (~$500M) were both acquired within 2025. Top-of-funnel consolidation is clear; cloud providers and LLM platforms are the next wave of buyers.'
      },
      tags: [
        { kind: 'ghost',   text: '📅 2026-08-07' },
        { kind: 'amber',   html: '🤖 <span data-lang="zh">AI 聚合</span><span data-lang="en">AI-aggregated</span>' },
        { kind: 'default', text: 'AI Security' },
        { kind: 'default', text: 'M&amp;A' },
        { kind: 'pink',    text: 'Insights' }
      ]
    },

    {
      slug: 'insight-guardrails',
      date: '2026-08-07',
      title: {
        zh: '护栏赛道融资节奏 · 2024–2026',
        en: 'Guardrail Funding Rhythm · 2024–2026'
      },
      desc: {
        zh: '13 笔已披露融资 × 3 起并购:AI Security 从"等模型稳定再说"变成 2025-2026 资本最先下注的应用层入口。',
        en: '13 disclosed rounds × 3 acquisitions: AI security is no longer a "wait until models stabilize" middle layer — it is the first application-layer category capital bet on in 2025–2026.'
      },
      tags: [
        { kind: 'ghost',   text: '📅 2026-08-07' },
        { kind: 'amber',   html: '🤖 <span data-lang="zh">AI 聚合</span><span data-lang="en">AI-aggregated</span>' },
        { kind: 'default', text: 'AI Security' },
        { kind: 'default', text: 'Funding' },
        { kind: 'pink',    text: 'Insights' }
      ]
    }
  ];
})();