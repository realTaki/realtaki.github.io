// Entry point — orchestrates all rendering and page navigation.
// Classic script, loaded last (after data → derived → meta → modal → render).
// All functions and variables are defined by earlier scripts in the same global scope.
//
// `type="module"` is intentionally NOT used here so the page works when
// opened via file:// protocol without a local server.

/* ============== 0. 防呆:缺脚本时不崩溃 ============== */
// 如果上游某个 js 因为 dev-tunnel 504 / 网络抖动没加载,继续往下跑只会触发更多 ReferenceError,
// 整页就废了。这里把"必需函数"集中检查,缺失就打印一条明确诊断,跳过对应初始化。
// 静态 HTML / data-i18n 仍然能渲染,只是动态内容(表格 / 分类树 / 洞察卡)会缺席。
const _missing = [];
['renderStats','renderAllProducts','renderInfraTree','renderPager']
  .forEach(fn => { if (typeof window[fn] !== 'function') _missing.push(fn + '()'); });
if (_missing.length) {
  console.error('[main.js] missing render functions:', _missing.join(', '),
    '\n         → 上游 js/render.js 大概率没加载成功(检查 DevTools Network 标签)。');
  console.error('[main.js] 页面会以"静态 HTML + 中/英切换(静态部分)"呈现,表格 / 分类树 / 洞察卡等动态内容不会渲染。');
}

/* ============== 1. HERO / INSIGHTS 统计 ============== */
if (typeof renderStats === 'function') renderStats();

/* ============== 2. 全产品表格 + 事件绑定 ============== */
if (typeof renderAllProducts === 'function') renderAllProducts();

/* ============== 2.5 Model Infra 三层结构树 ============== */
if (typeof renderInfraTree === 'function') renderInfraTree();

// 事件绑定仅在 render.js 正常加载时才有意义(它定义了 apSearch / currentPage 等)。
if (typeof renderAllProducts === 'function') {
  apSearch.addEventListener('input', () => {
    currentPage = 1;
    renderAllProducts();
  });

  document.querySelectorAll('[data-apType]').forEach(b => {
    b.addEventListener('click', () => {
      document.querySelectorAll('[data-apType]').forEach(x => x.classList.remove('active'));
      b.classList.add('active');
      activeApType = b.dataset.aptype;
      currentPage = 1;
      renderAllProducts();
    });
  });

  // ⭐ 星标筛选
  document.querySelectorAll('[data-apStar]').forEach(b => {
    b.addEventListener('click', () => {
      activeStarOnly = !activeStarOnly;
      b.classList.toggle('active', activeStarOnly);
      currentPage = 1;
      renderAllProducts();
    });
  });

  // 列头点击 → 切换排序
  document.querySelectorAll('.ap-table th[data-sort]').forEach(th => {
    th.addEventListener('click', () => {
      const key = th.dataset.sort;
      if (sortKey === key) {
        sortDir = sortDir === 'asc' ? 'desc' : 'asc';
      } else {
        sortKey = key;
        sortDir = 'asc';
      }
      currentPage = 1;
      renderAllProducts();
    });
  });
}

/* ============== 星标联动:状态变更 → 重渲染表格 + 分类树 + 统计 ============== */
// 来自 js/star.js 的 stars:changed 事件,任意位置(表格 / 分类树)切换后
// 自动同步所有视图,无需各自手动调 re-render。
document.addEventListener('stars:changed', () => {
  // 同步顶部"⭐ 已星标 (n)"计数
  const cntEl = document.querySelector('[data-stat="starCount"]');
  if (cntEl && typeof StarStore !== 'undefined') {
    cntEl.textContent = String(StarStore.getStarred().size);
  }
  // 表格 + 分类树都重渲染(保持筛选/页码不变)——只在 render.js 在线时调用
  if (typeof renderAllProducts === 'function') renderAllProducts();
  if (typeof renderInfraTree === 'function') renderInfraTree();
});

/* ============== 语言切换联动:lang:changed → 重渲染所有视图 ============== */
// 来自 js/i18n.js 的 lang:changed 事件,切换语言后自动同步所有动态内容。
// 表格描述、洞察卡、统计 delta、分类树、模态都跟着新语言走。
document.addEventListener('lang:changed', () => {
  // 静态 data-i18n 节点已由 i18n.setLang() 处理;这里只重渲染动态视图。
  if (typeof renderStats === 'function') renderStats();
  if (typeof renderInfraTree === 'function') renderInfraTree();
  if (typeof renderAllProducts === 'function') renderAllProducts();
  // 如果模态打开,关闭它(避免半英文半中文;用户重新点开时用新语言展示)
  if (typeof closeModal === 'function' && document.getElementById('modalBg').classList.contains('active')) {
    closeModal();
  }
});

/* ============== 3. 页面导航 (Investigation / Insights) ============== */
// Lightweight hash-based two-tab switcher.
// URL hash is decoupled from internal page id: '#data' -> investigation page,
// '#insights' -> insights page. Keeps the URL clean (avoids "/investigation/#investigation").
const PAGES = ['investigation', 'insights'];
const HASH_FOR_PAGE = { investigation: 'data', insights: 'insights' };
const PAGE_FOR_HASH = { data: 'investigation', insights: 'insights' };

function getRouteFromHash() {
  const raw = (location.hash || '').replace(/^#/, '').toLowerCase();
  return PAGE_FOR_HASH[raw] || 'investigation';
}

function applyPage(page) {
  const safe = PAGES.includes(page) ? page : 'investigation';
  document.querySelectorAll('.page').forEach(el => {
    el.hidden = el.dataset.page !== safe;
  });
  document.querySelectorAll('.page-switch').forEach(tab => {
    const match = tab.dataset.page === safe;
    tab.setAttribute('aria-selected', match ? 'true' : 'false');
    tab.setAttribute('tabindex', match ? '0' : '-1');
  });
  const wantHash = HASH_FOR_PAGE[safe] || safe;
  if (location.hash.replace(/^#/, '') !== wantHash) {
    history.replaceState(null, '', '#' + wantHash);
  }
  window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });
}

function bindTabs() {
  document.querySelectorAll('.page-switch').forEach(tab => {
    tab.addEventListener('click', (e) => {
      const page = tab.dataset.page;
      if (!PAGES.includes(page)) return;
      e.preventDefault();
      applyPage(page);
    });
  });
  window.addEventListener('hashchange', () => applyPage(getRouteFromHash()));
}

bindTabs();
applyPage(getRouteFromHash());
