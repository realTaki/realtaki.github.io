// 长文洞察 — 三条卡片对应的全文内容。
// 每篇文章 = { slug, eyebrow, title, deck, byline, sections: [{h, paragraphs: [...]}], callout?, relatedCompanies?: [...] }
// sections 渲染为文章正文,callout 是高亮引语/数字,relatedCompanies 把卡片链接到 items[] 详情。

const articles = {
  /* =============================================================
     1. 护栏赛道融资节奏
     ============================================================= */
  guardrails: {
    slug: 'guardrails',
    eyebrow: '观察 01 · 资本节奏',
    title: '护栏赛道融资节奏 · 2024–2026',
    deck: 'AI Security 不再是"等模型稳定再说"的中间层,而是 2025-2026 资本最先下注的应用层入口。',
    byline: '整理自同源 items[] 数据 · 2026 Q3',
    stats: [
      { label: '已披露融资', value: '13', suffix: '家' },
      { label: '累计融资', value: '$549', suffix: 'M' },
      { label: '覆盖时间', value: '2024', suffix: '→ 2026' }
    ],
    sections: [
      {
        h: '节奏判断:从"按年"到"按半年"',
        paragraphs: [
          '把 13 笔已披露融资按时间排序,可以看到一条清晰的两段式曲线:2024 全年仅 3 笔,代表事件是 Lakera HiddenLayer Prompt Security 进入 A 轮;2025 节奏几乎翻倍,3 笔新融资 + 2 笔并购重组;而 2026 才过去 7 个月,就已经落下 5 笔 — 平均每月近 1 笔。',
          '这是一个结构性信号:头部 LLM 客户的采购周期已经下沉到模型层之上,客户问"你们怎么解决 prompt injection / 数据泄露 / 合规审计"的时间和决策路径都更短,创业公司的销售漏斗因此被压缩,反过来又逼着投资人在 6–9 个月内下注占位。'
        ]
      },
      {
        h: '轮次与金额:种子轮体量被整体抬升',
        paragraphs: [
          '金额分布上,2024 的 Lakera (A, $20M) 与 HiddenLayer (A, $56M) 仍然守在传统 A 轮区间;到了 2025 中段,WitnessAI (Strategic, $58M) 和 Noma Security (B, $100M) 直接跳出传统轮次/金额配比,反映出战略买家和大型机构正在把 LLM 安全视为独立品类。',
          '2026 新一批公司无论是否披露具体业务,种子轮金额从 2024 的 $8M-$20M 抬到 $10M-$60M,Virtue AI (Seed+A, $30M)、Oak (Seed, $60M) 都不是"做翻译 / 做聊天"的体量 — 投资人开始给护栏一个独立的估值锚。'
        ]
      },
      {
        h: '被忽视的拐点:从模型评估 → Agent 治理',
        paragraphs: [
          '如果你只看募资数据,会以为这是一个关于"prompt injection 防火墙"的故事。但细看 13 家公司的产品矩阵,新的重心已经偏到 Agent 治理:HiddenLayer 的 MLDR、Virtue AI 的 AgentSuite、Holistic AI 的 Guardian Agents (Sentinel 观测 + Operative 干预)、Noma Security 的全生命周期风险治理 — 都在解决"agent 出问题谁负责"这个问题。',
          '这意味着 2026 之后的护栏赛道,买家画像会从"安全团队"扩展到"基础架构 / 平台团队",Reasoning:gating agent 上生产会触发比 chat 一个 LLM 更复杂的合规问题,采购预算的归属也会跟着漂移。'
        ]
      },
      {
        h: '判断:2026 H2 还有 3–5 笔窗口',
        paragraphs: [
          '把节奏外推:按当前 5 笔/7 个月的节奏,2026 H2 再出 5–6 笔是合理预期。但轮次和金额结构会变化 — 种子轮密度下降,A/B 轮占比上升,因为 2024 那批 A 轮公司面临 next-round 决策。',
          '需要警惕的是赛道拥挤:Tradition 安全厂商 (CrowdStrike、Palo Alto、ZScaler) 都已经在 2025-2026 把 LLM 治理塞进主产品线,留给独立创业公司的窗口更接近"垂直场景 + 监管合规驱动" (例如医疗 / 金融 / EU AI Act),而不是"通用 LLM 防火墙"。'
        ]
      }
    ],
    callout: {
      kind: 'quote',
      text: 'AI Security 不再是中间层,而是应用层入口 — 13 笔融资 × 3 起并购,是 2025-2026 资本最先下注的品类。',
      cite: '本页数据综合 / Openrank 2607'
    },
    relatedCompanies: ['Virtue AI', 'Lakera', 'Protect AI', 'Noma Security', 'Holistic AI', 'HiddenLayer', 'WitnessAI', 'NeuralTrust', 'Prompt Security']
  },

  /* =============================================================
     2. 大厂开始扫货
     ============================================================= */
  mna: {
    slug: 'mna',
    eyebrow: '观察 02 · 并购信号',
    title: '大厂开始扫货 · 3 起收购 · 合计 ~$800M',
    deck: 'Lakera 和 Protect AI 在 2025 年内被收购,合计 ~$800M 退出,头部整合信号明确。',
    byline: '整理自同源 items[] 数据 · 2026 Q3',
    stats: [
      { label: '并购笔数', value: '3', suffix: '起' },
      { label: '退出合计', value: '~$800', suffix: 'M' },
      { label: '买方集中度', value: '2', suffix: '家头部' }
    ],
    sections: [
      {
        h: '两组对照:Lakera vs Protect AI',
        paragraphs: [
          '把两起并购并排看会非常有意思。Lakera 在 2024-07 完成 A 轮 $20M,2025-09 即被收购,作价 ~$300M — 估值在 14 个月内翻了 ~15 倍。Protect AI 节奏更急:2024-12 落 B 轮 $60M,2025-04 就被收购,作价 ~$500M — 8 个月、~8 倍。',
          '两个共同点:一是退出估值远高于最近一轮融资估值,说明战略买家在 LLM 安全领域愿意给出"未来 3 年现金流贴现"的溢价;二是两家被收购后都很快并入"大厂安全产品线" — Lakera 去了 Palo Alto 路线,Protect AI 走的是传统 SOC 厂商通路,后者的并入方式意味着 LLM 治理会被默认绑进传统安全堆栈。'
        ]
      },
      {
        h: '为什么是 2025:Q3 之后',
        paragraphs: [
          '并购集中爆发在 2025 Q3 之后,直接和"大客户开始批量上线 LLM 应用"的时间表对齐。当 Fortune 500 客户开始把 LLM 接入到生产环境,合规、采购和法务才会真正和企业级安全厂商坐下来谈 — 这时独立护栏公司的"小而美"反而成为被收购的理由,而不是阻碍。',
          '也因为 2025 年是大量 LLM 应用"真实出问题"的第一个完整年份:Air Canada chatbot 败诉、MCP 协议漏洞被披露、Agent 越权操作进入公共视野 — 每一件都把"为什么需要 LLM 防护"从 PPT 拉到了真实事故。'
        ]
      },
      {
        h: '可预见的下一波:中型买家接棒',
        paragraphs: [
          '2025 出钱的是 Palo Alto / 传统 SOC 厂商,2026 之后接力棒会到云厂商和 LLM 平台公司手里 — AWS/Azure/GCP / OpenAI / Anthropic 都还没有正式的 LLM 防护产品线,这是 12–18 个月内最明显的并购窗口。',
          '对独立公司而言,这意味着两条路:要么尽快长到 A 轮以上、成为被并购候选;要么找到云厂商不会自己做的垂直场景 (医疗 / 法律 / 金融 / EU AI Act),留在独立路线。中间态 (B 轮 + 通用产品) 会越来越难融资。'
        ]
      },
      {
        h: '判断:并购不会停,但并购条款会变',
        paragraphs: [
          '接下来 18 个月还会看到 3–5 笔同类并购,但买方从"安全厂商"扩展到"云厂商 + LLM 平台",估值倍数会从目前的 8–15 倍向 5–8 倍靠拢 — 因为买方自己也在做,溢价会让位给整合成本。',
          '对创始人意味着:如果你的退出路径是并购,2026 H2 / 2027 H1 是最好的窗口,拖到 2027 之后要么估值被打回来,要么被剩下 2–3 家头部收购方挑剩。'
        ]
      }
    ],
    callout: {
      kind: 'stat',
      text: 'Lakera (~$300M) + Protect AI (~$500M) = ~$800M 退出,2025-Q3 之后头部整合信号明确。',
      cite: '数据来源:同源 items[]'
    },
    relatedCompanies: ['Lakera', 'Protect AI', 'Virtue AI', 'Noma Security', 'WitnessAI']
  },

  /* =============================================================
     3. Virtue AI 值得关注
     ============================================================= */
  virtue: {
    slug: 'virtue',
    eyebrow: '观察 03 · 公司特写',
    title: 'Virtue AI 值得关注 · 4 位 AI 安全教授 × 完整产品矩阵',
    deck: '由 4 位 AI 安全领域顶尖学者创立,Seed+A 合计 $30M,Lightspeed 与 Walden Catalyst 联合领投。',
    byline: '整理自同源 items[] 数据 · 2026 Q3',
    stats: [
      { label: '团队规模', value: '30', suffix: '+ 员工' },
      { label: '产品矩阵', value: '5', suffix: '条线' },
      { label: '融资', value: '$30', suffix: 'M (Seed+A)' }
    ],
    sections: [
      {
        h: '为什么是 Virtue AI:把"研究"做成"产品"',
        paragraphs: [
          '市场上大部分 AI 安全公司做的是"工程化" — 把现有红队方法 / 评估框架打包成 SaaS。Virtue AI 的不同在于:它从一开始就有 Stanford / UIUC 联合研究做底,AutoRedTeamer 框架 (阿斯顿大学 / 斯坦福 / Virtue AI 联合发表) 直接转化为 DTAP (DecodingTrust Agent Platform) 产品。',
          '结果是他们在 Agent 场景下的攻击成功率比 baseline 高 20%,但是算力成本反而低 46% — 这种"研究 → 指标 → 工程"的传导链路,在 AI 安全这个品类里非常少见,也是头部机构愿意给 A 轮估值溢价的根本原因。'
        ]
      },
      {
        h: '产品矩阵:5 条线对应 5 个客户关键问题',
        paragraphs: [
          'VirtueRed — 算法化红队平台,覆盖 320+ 风险类别 (幻觉、隐私泄露、越狱、prompt injection),100+ 攻击算法、600+ 攻击向量。直接卖给模型团队做上线前的回归测试。',
          'DTAP — 可控、可交互的 AI Agent 红队评估平台,基于 AutoRedTeamer 框架,直接对应 Agent 治理这个新场景的痛点。',
          'VirtueGuard — 实时多模态护栏,文本 / 图像 / 音频 / 视频 / 代码,90+ 语言,延迟 <10ms。卖给应用层,作为用户输入和模型输出之间的最后一道门。',
          'VirtueAgent — 安全智能体,自动解读企业内部安全策略与监管法规。这条线最可能切到合规自动化。',
          'AgentSuite — 面向企业 AI Agent 的端到端安全平台 (2026-01 发布),把上面 4 条线整合成一个企业级 SKU。'
        ]
      },
      {
        h: '投资人结构:Lightspeed 领头 + 学术 + 产业三方',
        paragraphs: [
          'Lightspeed Venture Partners 和 Walden Catalyst Ventures 联合领投,Prosperity7 (阿美风投) 跟投 — 这是一个少见的"硅谷 VC + 学术权威 + 沙特主权基金"三方组合,对一家 2024 才出隐身模式的初创公司来说,意味着同时打通了学界信任、硅谷渠道和中东资金。',
          '个人投资者里 Lip-Bu Tan (Intel CEO)、Amarjit Gill、Chris Ré (Stanford 教授) 三位是值得留意的信号 — 前两者意味着产业级背书,Chris Ré 既是学术合伙人也是潜在客户推荐人。'
        ]
      },
      {
        h: '判断:独立的窗口期大约还有 12–18 个月',
        paragraphs: [
          '以当前融资节奏 (Seed → A 14 个月) 和产品矩阵成熟度,2026 H2 走向 B 轮几乎板上钉钉。但护栏赛道并购窗口已经打开 (见观察 02),Virtue AI 的独立路线能否跑通,取决于:1) AgentSuite 能不能在 12 个月内拿到 3–5 个 Fortune 500 客户;2) 学术发布的产出节奏能不能继续保持 (论文 → 指标 → 产品);3) 真正的差异点 — DTAP 的 Agent 治理护城河能不能保持 18 个月不被云厂商 / LLM 平台复制。',
          '如果上面三点都能给出肯定答案,这家公司的上限是"独立平台上市";如果其中 1–2 点做不到,2027 进入并购候选池的概率非常高。'
        ]
      }
    ],
    callout: {
      kind: 'quote',
      text: '4 位 AI 安全教授 × 320+ 风险类别 × 5 条产品线 — AI Security 赛道里少见的"研究 → 指标 → 工程"完整链路。',
      cite: '本页数据综合 / Virtue AI 公开资料'
    },
    relatedCompanies: ['Virtue AI', 'Holistic AI', 'HiddenLayer', 'Lakera', 'Protect AI']
  }
};

// Helper to escape text for safe HTML interpolation
function articleEs(s) {
  if (s == null) return '';
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
