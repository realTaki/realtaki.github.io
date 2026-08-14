/* ================================================================
   i18n — site-wide bilingual switch (zh / en)

   Architecture:
   - One engine shared by all pages.
   - Dictionary split into two sections:
       1. site   — nav, footer, homepage
       2. inv    — investigation page (data tables, company modal)
   - Static strings in HTML tagged with data-i18n / data-i18n-attr.
   - JS code calls i18n.t(key, vars) for dynamic strings.
   - Persistence priority: URL hash > localStorage > <html lang>.

   Pages that don't need investigation strings simply don't use those
   keys — the dictionary size is irrelevant unless referenced.
   Long-form insight articles live under /blog/insight-* as static
   bilingual HTML and do not consume any i18n key.
   ================================================================ */
(function () {
  const LANG_KEY = 'realtaki.lang';
  const SUPPORTED = ['zh', 'en'];
  let _lang = 'zh';

  /* ── DICTIONARIES ── */
  const dict = {
    zh: {
      /* ========== SITE-WIDE ========== */
      'nav.home':                   '首页',
      'nav.blog':                   '博客',
      'nav.investigation':          '调研',
      'nav.langToggle':             '切换语言',
      'nav.backToTop':              '回到顶部',

      'footer.copyright':           '© 2026 realTaki · Built with ❤️ & hosted on GitHub Pages',
      'footer.nav':                 '首页 · 博客 · 调研',

      /* homepage */
      'home.title':                 'realTaki',
      'home.meta':                  '💎 LV6 正式会员 · ⭐ Pro · 🏷️ AI · 自动驾驶 · 联邦学习',
      'home.bio':                   'Coder & Hacker.',
      'home.tagline':               '🙃 哈。 · 📍 Edmonton, Alberta, CA · 🏢 UAlberta',
      'home.posts':                 '📝 最新文章',
      'home.contrib':               '🎬 我的投稿 · 参与的开源项目',
      'home.projects':              '📦 我的项目 · top by stars',
      'home.achievements':          '🏆 成就墙',
      'home.stats':                 '📊 数据中心',
      'home.tech':                  '🛠 装备栏 · 技术栈',
      'home.contact':               '📬 联系方式',
      // (home.postTitle / home.postDesc removed — latest posts now auto-render
      //  from js/blog-manifest.js + js/blog-render.js.)
      'home.contact.email':         '✉️ taki.wang@ualberta.ca',
      'home.contact.x':             '🐦 @realTaki42',
      'home.contact.gh':            '🐙 github.com/realTaki',

      'site.description':           'Coder & Hacker · AI · 自动驾驶 · 联邦学习',

      /* ========== BLOG ========== */
      'blog.title':                 '博客 · realTaki',
      'blog.description':           'realTaki 的写作:AI · 系统设计 · 工程随笔',
      'blog.post.back':             '← 返回首页',
      'mas.metaDescription':        '多智能体系统的质量、架构、可观测性与安全保障：概念框架与研究议程。',

      /* ========== INVESTIGATION ========== */
      'site.brand.aria':            'realTaki · 首页',
      'lang.toggle.aria':           '切换语言',
      'investigation.title':        '产品调研 · 2026 Q3',

      'hero.inv.eyebrow':           '2026 · Q3 SNAPSHOT',
      'hero.inv.title':             'Agent Infra <span class="accent">Landscape</span>',
      'hero.inv.lede':              '从 {span} —— {cats} 大模块、{subs} 个子类别、{total} 个工具，以及 {funded} 家代表性安全公司的融资脉络。点击任意公司或工具查看详情、官网与 GitHub 仓库。',
      'hero.inv.stat.totalLabel':   '覆盖工具 / 公司',
      'hero.inv.stat.totalDelta':   '{cats} 大模块 · {subs} 子类别',
      'hero.inv.stat.osLabel':      '开源项目',
      'hero.inv.stat.osDelta':      '{n} 个含 GitHub 仓库链接',
      'hero.inv.stat.fundingLabel': 'AI Security 融资',
      'hero.inv.stat.fundingDelta': '{n} 家公司 · {m} 起收购',
      'hero.inv.stat.productsLabel':'收录子产品',
      'hero.inv.stat.productsDelta':'隶属 {n} 家母公司',
      'hero.inv.meta.source':       '数据源',
      'hero.inv.meta.sourceVal':    'Landscape 2026 + 公开融资记录 + 实时搜索',
      'hero.inv.meta.updated':      '更新',
      'hero.inv.meta.scope':        '范围',
      'hero.inv.meta.scopeVal':     'Agent Infra + AI Security',

      'sec.allProducts.h2':         '所有产品',
      'sec.allProducts.sub':        '点模块快速筛选 · 搜索 · 同公司产品可展开',
      'sec.allProducts.searchPh':   '🔍 搜索工具、公司或产品...',

      'filter.all':                 '全部',
      'filter.os':                  '开源',
      'filter.co':                  '公司',
      'filter.both':                '混合',
      'filter.star':                '⭐ 已星标',
      'filter.starTitle':           '只看已星标的项目',
      'filter.subLabel':            '次级分类：',

      'th.name':                    '名称',
      'th.type':                    '类型',
      'th.sub':                     '子类别 / 聚焦',
      'th.stage':                   '轮次',
      'th.amount':                  '金额',
      'th.date':                    '时间',
      'th.meta':                    '聚焦 / 备注',

      'table.type.product':         '产品',
      'table.type.os':              'Open Source',
      'table.type.co':              'Company',
      'table.type.both':            'Hybrid',
      'table.expandCaret':          '展开产品',
      'table.empty':                '没有匹配项 · 试试清空搜索或切换筛选',

      'pager.info':                 '共 <strong>{n}</strong> 项 · 第 <strong>{from}-{to}</strong>',
      'pager.prev':                 '上一页',
      'pager.next':                 '下一页',
      'pager.size':                 '每页',
      'pager.unit':                 '项',

      'sec.infraTree.h2':           '分类树 · 12 大类 → 子分类',
      'sec.infraTree.summary':      '{cats} 大类 · {subs} 个子分类 · {total} 个工具',

      'tree.starredTitle':          '我的星标',
      'tree.starredDesc':           '点击 ⭐ 取消标记，标记会在 localStorage 持久化',
      'tree.starOff':               '取消星标',
      'tree.starOn':                '标为星标',
      'tree.itemCount':             '{n} 项',

      'mod.aiSec.title':            'AI Security · 专项高亮',
      'mod.aiSec.count':            '{n} 家公司 · 含完整融资数据',
      'mod.badge.new':              'NEW',
      'mod.all.title':              '全部',
      'mod.all.unit':               '个工具',

      'mod.desc.Agentic Coding':           'AI 写代码 + Coding Agent Harness，2026 最热赛道',
      'mod.desc.Personal AI Assistant':    '个人向 AI 助理，主打多端接入与轻量化',
      'mod.desc.Chatbot':                 '本地化 / 私有化对话客户端',
      'mod.desc.Agent Framework':          '构建 Agent 的底层框架与编排平台',
      'mod.desc.Agent Runtime Infra':      'Agent 跑起来需要的一切：记忆、协议、工具、观测、沙箱',
      'mod.desc.Serving':                  '把训练好的模型对外提供推理/部署服务',
      'mod.desc.Post-Train':               '模型出来后还要再加工：SFT、DPO、RLHF、Agentic RL',
      'mod.desc.Pre-Train':                '从零训练大模型的工具栈：分布式框架、编译加速、评估',
      'mod.desc.Data':                     '训练 / 评估 / RAG 数据的治理、集成与标注',
      'mod.desc.Compute & Scheduling':     'Ray / Spark / Volcano 等分布式调度底座',
      'mod.desc.AI Lab':                   '基础模型厂商与 AI 平台母公司，旗下产品收归 products',
      'mod.desc.AI Security':              'LLM 应用防护与 AI 治理，2025-2026 资本加速',

      'modal.intro':                '简介',
      'modal.basicInfo':            '基本信息',
      'modal.parentCo':             '母公司',
      'modal.products':             '产品矩阵 ({n})',
      'modal.fundingBreakdown':     '融资明细',
      'modal.investors':            '投资人 ({n})',
      'modal.papers':               '研究 / 论文 ({n})',
      'modal.links':                '外部链接',
      'modal.arch':                 '架构流程',
      'modal.noIntro':              '暂无简介',
      'modal.tagline.os':           '开源项目',
      'modal.tagline.co':           '商业公司 / 产品',
      'modal.tagline.both':         '混合：开源 + 商业',
      'modal.tagline.aiSec':        'AI 安全公司',
      'modal.productByline':        '{co} 出品',
      'modal.productBadge':         '产品 · {co}',
      'modal.visitWebsite':         '访问 {n} 官网',
      'modal.viewOnGitHub':         'View on GitHub',
      'modal.fallback.google':      'Google 搜索',
      'modal.fallback.noLinks':     '未收录具体链接，可点击 Google 搜索补充资料。',
      'modal.cell.company':         '公司',
      'modal.cell.focus':           '聚焦',
      'modal.cell.location':        '总部',
      'modal.cell.founded':         '成立',
      'modal.cell.employees':       '员工',
      'modal.close.aria':           '关闭',

      'footer.made':                'Made with Mavis · 数据综合自公开融资记录 + Landscape 2026 + 实时搜索 · 仅供研究参考',

      'dash':                       '—',
      'funded.acquiredFmt':         '被收购{approx}${amount}M · {date}',
    },

    en: {
      /* ========== SITE-WIDE ========== */
      'nav.home':                   'Home',
      'nav.blog':                   'Blog',
      'nav.investigation':          'Investigation',
      'nav.langToggle':             'Switch language',
      'nav.backToTop':              'Back to top',

      'footer.copyright':           '© 2026 realTaki · Built with ❤️ & hosted on GitHub Pages',
      'footer.nav':                 'Home · Blog · Investigation',

      'home.title':                 'realTaki',
      'home.meta':                  '💎 LV6 Member · ⭐ Pro · 🏷️ AI · Autonomous Driving · Federated Learning',
      'home.bio':                   'Coder & Hacker.',
      'home.tagline':               '🙃 ha. · 📍 Edmonton, Alberta, CA · 🏢 UAlberta',
      'home.posts':                 '📝 Latest Posts',
      'home.contrib':               '🎬 Contributions · Open Source',
      'home.projects':              '📦 My Projects · top by stars',
      'home.achievements':          '🏆 Achievements',
      'home.stats':                 '📊 Data Center',
      'home.tech':                  '🛠 Tech Stack',
      'home.contact':               '📬 Contact',
      // (home.postTitle / home.postDesc removed — latest posts now auto-render
      //  from js/blog-manifest.js + js/blog-render.js.)
      'home.contact.email':         '✉️ taki.wang@ualberta.ca',
      'home.contact.x':             '🐦 @realTaki42',
      'home.contact.gh':            '🐙 github.com/realTaki',

      'site.description':           'Coder & Hacker · AI · Autonomous Driving · Federated Learning',

      /* ========== BLOG ========== */
      'blog.title':                 'Blog · realTaki',
      'blog.description':           'Writing on AI, system design, and engineering notes',
      'blog.post.back':             '← Back to home',
      'mas.metaDescription':        'Quality, architecture, observability and assurance for multi-agent systems: a conceptual framework and research agenda.',

      /* ========== INVESTIGATION ========== */
      'site.brand.aria':            'realTaki · Home',
      'lang.toggle.aria':           'Switch language',
      'investigation.title':        'Agent-Product-Investigation · 2026 Q3',

      'hero.inv.eyebrow':           '2026 · Q3 SNAPSHOT',
      'hero.inv.title':             'Agent Infra <span class="accent">Landscape</span>',
      'hero.inv.lede':              'Across {span} — {cats} major categories, {subs} subcategories, and {total} tools, plus the funding trail of {funded} representative security companies. Click any company or tool to view details, website and GitHub repo.',
      'hero.inv.stat.totalLabel':   'Tools / Companies',
      'hero.inv.stat.totalDelta':   '{cats} categories · {subs} subcategories',
      'hero.inv.stat.osLabel':      'Open-source projects',
      'hero.inv.stat.osDelta':      '{n} with GitHub repos',
      'hero.inv.stat.fundingLabel': 'AI Security funding',
      'hero.inv.stat.fundingDelta': '{n} companies · {m} acquisitions',
      'hero.inv.stat.productsLabel':'Sub-products listed',
      'hero.inv.stat.productsDelta':'Belonging to {n} parent companies',
      'hero.inv.meta.source':       'Source',
      'hero.inv.meta.sourceVal':    'Landscape 2026 + public funding records + live search',
      'hero.inv.meta.updated':      'Updated',
      'hero.inv.meta.scope':        'Scope',
      'hero.inv.meta.scopeVal':     'Agent Infra + AI Security',

      'sec.allProducts.h2':         'All Products',
      'sec.allProducts.sub':        'Click a module to filter · Search · Expand products from the same company',
      'sec.allProducts.searchPh':   '🔍 Search tools, companies or products...',

      'filter.all':                 'All',
      'filter.os':                  'Open Source',
      'filter.co':                  'Company',
      'filter.both':                'Hybrid',
      'filter.subLabel':            'Sub-category:',
      'filter.star':                '⭐ Starred',
      'filter.starTitle':           'Show starred items only',

      'th.name':                    'Name',
      'th.type':                    'Type',
      'th.sub':                     'Subcategory / Focus',
      'th.stage':                   'Stage',
      'th.amount':                  'Amount',
      'th.date':                    'Date',
      'th.meta':                    'Focus / Notes',

      'table.type.product':         'Product',
      'table.type.os':              'Open Source',
      'table.type.co':              'Company',
      'table.type.both':            'Hybrid',
      'table.expandCaret':          'Expand products',
      'table.empty':                'No matches · try clearing the search or filter',

      'pager.info':                 '<strong>{n}</strong> total · showing <strong>{from}-{to}</strong>',
      'pager.prev':                 'Previous',
      'pager.next':                 'Next',
      'pager.size':                 'Per page',
      'pager.unit':                 '',

      'sec.infraTree.h2':           'Category Tree · 12 Major → Subcategories',
      'sec.infraTree.summary':      '{cats} categories · {subs} subcategories · {total} tools',

      'tree.starredTitle':          'My Stars',
      'tree.starredDesc':           'Click ⭐ to unstar · saved to localStorage',
      'tree.starOff':               'Unstar',
      'tree.starOn':                'Star',
      'tree.itemCount':             '{n} items',

      'mod.aiSec.title':            'AI Security · Featured',
      'mod.aiSec.count':            '{n} companies · with full funding data',
      'mod.badge.new':              'NEW',
      'mod.all.title':              'All',
      'mod.all.unit':               'tools',

      'mod.desc.Agentic Coding':           'AI coding + Coding Agent Harness — hottest track of 2026',
      'mod.desc.Personal AI Assistant':    'Personal AI assistants, multi-platform and lightweight',
      'mod.desc.Chatbot':                 'Self-hosted / private chat clients',
      'mod.desc.Agent Framework':          'Frameworks and orchestration platforms for building agents',
      'mod.desc.Agent Runtime Infra':      'Everything agents need to run: memory, protocols, tools, observability, sandboxes',
      'mod.desc.Serving':                  'Serving inference / deploying trained models',
      'mod.desc.Post-Train':               'Post-training: SFT, DPO, RLHF, Agentic RL',
      'mod.desc.Pre-Train':                'Training-from-scratch toolchain: distributed frameworks, compilers, evaluation',
      'mod.desc.Data':                     'Data governance, integration and labeling for training / eval / RAG',
      'mod.desc.Compute & Scheduling':     'Distributed scheduling substrates — Ray / Spark / Volcano',
      'mod.desc.AI Lab':                   'Foundation-model vendors and AI platform parents; sub-products nested under products',
      'mod.desc.AI Security':              'LLM app defense and AI governance — capital accelerating through 2025-2026',

      'modal.intro':                'Overview',
      'modal.basicInfo':            'Basic info',
      'modal.parentCo':             'Parent company',
      'modal.products':             'Product lineup ({n})',
      'modal.fundingBreakdown':     'Funding breakdown',
      'modal.investors':            'Investors ({n})',
      'modal.papers':               'Research / Papers ({n})',
      'modal.links':                'External links',
      'modal.arch':                 'Architecture',
      'modal.noIntro':              'No description available',
      'modal.tagline.os':           'Open-source project',
      'modal.tagline.co':           'Commercial company / product',
      'modal.tagline.both':         'Hybrid: open-source + commercial',
      'modal.tagline.aiSec':        'AI security company',
      'modal.productByline':        'A product of {co}',
      'modal.productBadge':         'Product · {co}',
      'modal.visitWebsite':         'Visit {n}',
      'modal.viewOnGitHub':         'View on GitHub',
      'modal.fallback.google':      'Google search',
      'modal.fallback.noLinks':     'No direct link captured — try Google search for more.',
      'modal.cell.company':         'Company',
      'modal.cell.focus':           'Focus',
      'modal.cell.location':        'Location',
      'modal.cell.founded':         'Founded',
      'modal.cell.employees':       'Employees',
      'modal.close.aria':           'Close',

      'footer.made':                'Made with Mavis · Data synthesized from public funding records + Landscape 2026 + live search · For research reference only',

      'dash':                       '—',
      'funded.acquiredFmt':         'Acquired{approx}${amount}M · {date}',
    }
  };

  /* ── HELPERS ── */
  function fill(template, vars) {
    if (!template) return '';
    if (!vars) return template;
    return template.replace(/\{(\w+)\}/g, (_, k) => (k in vars ? String(vars[k]) : `{${k}}`));
  }

  /* ── PUBLIC API ── */
  const i18n = {
    dict,
    currentLang() { return _lang; },

    t(key, varsOrFallback, maybeFallback) {
      let vars = null, fallback = null;
      if (typeof varsOrFallback === 'string') fallback = varsOrFallback;
      else if (varsOrFallback && typeof varsOrFallback === 'object') vars = varsOrFallback;
      if (typeof maybeFallback === 'string') fallback = maybeFallback;

      const raw = (dict[_lang] && dict[_lang][key]);
      if (raw === undefined) return fallback !== null ? fill(fallback, vars) : key;
      return fill(raw, vars);
    },

    descFor(item, vars) {
      if (!item) return '';
      const useEn = (_lang === 'en');
      const raw = useEn && item.desc_en ? item.desc_en : item.desc;
      return fill(raw || '', vars);
    },

    setLang(lang, opts) {
      const next = SUPPORTED.includes(lang) ? lang : 'zh';
      const silent = opts && opts.silent;
      const changed = (next !== _lang);
      _lang = next;

      try { localStorage.setItem(LANG_KEY, next); } catch (e) {}

      // Mirror to URL hash (preserves investigation page route e.g. #data?lang=en;
      // root URL renders as #?lang=en so the lang param stays parseable)
      try {
        const raw = (location.hash || '').replace(/^#/, '');
        const [path, query] = raw.split('?');
        const params = new URLSearchParams(query || '');
        params.set('lang', next);
        const newHash = '#' + (path || '') + '?' + params.toString();
        if (location.hash !== newHash && (path || next !== 'zh')) {
          history.replaceState(null, '', newHash);
        }
      } catch (e) {}

      document.documentElement.lang = (next === 'en') ? 'en' : 'zh-CN';

      // Title
      try {
        const t = dict[next]['investigation.title'] || dict[next]['home.title'];
        if (t) document.title = t;
      } catch (e) {}

      this.applyStatic();
      this._updateToggles(next);

      if (changed && !silent) {
        document.dispatchEvent(new CustomEvent('lang:changed', { detail: { lang: next } }));
      }
    },

    _updateToggles(next) {
      document.querySelectorAll('.lang-toggle').forEach(btn => {
        btn.querySelectorAll('[data-lang-side]').forEach(s => {
          const active = s.dataset.langSide === next;
          s.classList.toggle('active', active);
          s.setAttribute('aria-pressed', active ? 'true' : 'false');
        });
      });
    },

    applyStatic() {
      document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.dataset.i18n;
        const value = dict[_lang] && dict[_lang][key];
        if (value === undefined) return;
        if (/[<>]/.test(value)) el.innerHTML = value;
        else el.textContent = value;
      });
      document.querySelectorAll('[data-i18n-attr]').forEach(el => {
        const spec = el.dataset.i18nAttr;
        const [attrName, key] = spec.split(':');
        const value = dict[_lang] && dict[_lang][key];
        if (value !== undefined) el.setAttribute(attrName, value);
      });
    },

    resolveInitialLang() {
      try {
        const raw = (location.hash || '').replace(/^#/, '');
        const query = raw.split('?')[1];
        if (query) {
          const p = new URLSearchParams(query);
          const fromHash = p.get('lang');
          if (SUPPORTED.includes(fromHash)) return fromHash;
        }
      } catch (e) {}
      try {
        const fromLs = localStorage.getItem(LANG_KEY);
        if (SUPPORTED.includes(fromLs)) return fromLs;
      } catch (e) {}
      return (document.documentElement.lang || '').startsWith('en') ? 'en' : 'zh';
    },

    bootstrap() {
      _lang = this.resolveInitialLang();
      this.setLang(_lang, { silent: true });
    },

    bindToggle() {
      document.querySelectorAll('.lang-toggle').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const target = e.target.closest('[data-lang-side]');
          const next = target ? target.dataset.langSide : (_lang === 'zh' ? 'en' : 'zh');
          this.setLang(next);
        });
      });
    },
  };

  window.i18n = i18n;

  /* ── AUTO-INIT ── */
  (function autoInit() {
    _lang = i18n.resolveInitialLang();
    i18n.bindToggle();
    const applyNow = () => { i18n.setLang(_lang, { silent: true }); };
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', applyNow, { once: true });
    } else {
      applyNow();
    }
  })();
})();
