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
['renderStats','renderAllProducts','renderSubModules','renderPager']
  .forEach(fn => { if (typeof window[fn] !== 'function') _missing.push(fn + '()'); });
if (_missing.length) {
  console.error('[main.js] missing render functions:', _missing.join(', '),
    '\n         → 上游 js/render.js 大概率没加载成功(检查 DevTools Network 标签)。');
  console.error('[main.js] 页面会以"静态 HTML + 中/英切换(静态部分)"呈现,表格 / 次级类别卡 / 洞察卡等动态内容不会渲染。');
}

/* ============== 1. HERO / INSIGHTS 统计 ============== */
if (typeof renderStats === 'function') renderStats();

/* ============== 2. 全产品表格 + 事件绑定 ============== */
if (typeof renderAllProducts === 'function') renderAllProducts();

/* ============== 2.5 次级类别卡(选中大类时展开) ============== */
if (typeof renderSubModules === 'function') renderSubModules();

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

/* ============== 星标联动:状态变更 → 重渲染表格 + 统计 ============== */
// 来自 js/star.js 的 stars:changed 事件,任意位置切换星标后
// 自动同步所有视图,无需各自手动调 re-render。
document.addEventListener('stars:changed', () => {
  // 同步顶部"⭐ 已星标 (n)"计数
  const cntEl = document.querySelector('[data-stat="starCount"]');
  if (cntEl && typeof StarStore !== 'undefined') {
    cntEl.textContent = String(StarStore.getStarred().size);
  }
  // 表格重渲染(保持筛选/页码不变)——只在 render.js 在线时调用
  if (typeof renderAllProducts === 'function') renderAllProducts();
});

/* ============== 语言切换联动:lang:changed → 重渲染所有视图 ============== */
// 来自 js/i18n.js 的 lang:changed 事件,切换语言后自动同步所有动态内容。
// 表格描述、洞察卡、统计 delta、模态、次级类别卡都跟着新语言走。
document.addEventListener('lang:changed', () => {
  // 静态 data-i18n 节点已由 i18n.setLang() 处理;这里只重渲染动态视图。
  if (typeof renderStats === 'function') renderStats();
  if (typeof renderSubModules === 'function') renderSubModules();
  if (typeof renderAllProducts === 'function') renderAllProducts();
  // 如果模态打开,关闭它(避免半英文半中文;用户重新点开时用新语言展示)
  if (typeof closeModal === 'function' && document.getElementById('modalBg').classList.contains('active')) {
    closeModal();
  }
});

// (Investigation / Insights 双 tab 切换已移除 — Insight 长文现作为独立博客文章
//  在 /blog/insight-*/ 下。本页只渲染 Data。page-switch / bindTabs 等逻辑已删除。)
