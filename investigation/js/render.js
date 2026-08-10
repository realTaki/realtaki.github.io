// Section renderers. Classic script — defines render functions and
// module-card DOM generation. Actual orchestration (when to render,
// event binding) is in main.js.
// Depends on data.js + derived.js + meta.js + modal.js.

/* ============ HERO / INSIGHTS 统计 — 全部从 items[] 现算 ============ */
// 页面上任何一个数字都不写死:HTML 里只放 <div data-stat="xxx">,
// 由这里按 key 填进去。改 data.js → 刷新页面,数字自动跟着变。
function renderStats() {
  const s = stats;
  const cats = s.categories;
  const isEn = i18n && i18n.currentLang() === 'en';
  const span = cats.length > 1
    ? (isEn ? `${cats[0]} → ${cats[cats.length - 1]}` : `从 ${cats[0]} 到 ${cats[cats.length - 1]}`)
    : (cats[0] || '');

  // 观察卡 ①:融资节奏(按年份笔数,年份和笔数都来自 funding.date)
  const yearText = s.byYear.map(y => isEn
    ? `${y.year}: ${y.count}`
    : `${y.year} 年 ${y.count} 笔`
  ).join(isEn ? ', ' : '、');

  // 观察卡 ②:并购(来自 funding.acquired 结构化字段)
  const acqList = s.acquisitions
    .map(f => `${f.name} (${f.acquired.approx ? '~' : ''}$${f.acquired.amount}M)`)
    .join(isEn ? ', ' : '、');
  const acqYears = [...new Set(s.acquisitions.map(f => String(f.acquired.date || '').slice(0, 4)))].sort();

  // 观察卡 ③:被高亮的公司(名字只在 meta.js 的 HIGHLIGHT_NAME 里写一次)
  const hi = byName[HIGHLIGHT_NAME];
  const hf = hi && hi.funding;
  const leadInvestors = hi && hi.investors ? hi.investors.slice(0, 2).join(isEn ? ' & ' : ' 与 ') : '';

  const values = {
    lede: i18n.t('hero.inv.lede', {
      span,
      cats: s.categoryCount,
      subs: s.subCategoryCount,
      total: s.total,
      funded: s.fundedCount
    }),

    total:            String(s.total),
    modules:          i18n.t('hero.inv.stat.totalDelta', { cats: s.categoryCount, subs: s.subCategoryCount }),
    openSource:       String(s.openSourceCount),
    repos:            i18n.t('hero.inv.stat.osDelta', { n: s.repoCount }),
    funding:          `~$${s.totalFunding}M`,
    fundingBreakdown: i18n.t('hero.inv.stat.fundingDelta', { n: s.fundedCount, m: s.acquisitionCount }),
    products:         String(s.productCount),
    productParents:   i18n.t('hero.inv.stat.productsDelta', { n: s.productParentCount }),
    yearSpan:         `${s.yearSpan.first} — ${s.yearSpan.last}`,
    starCount:        () => StarStore ? String(StarStore.getStarred().size) : '0',
    infraSummary:     () => {
      const tree = s.subCategoryTree;
      const withSubs = Object.values(tree).filter(t => t.subs.length > 0);
      const subCount = withSubs.reduce((n,t) => n + t.subs.length, 0);
      return i18n.t('sec.infraTree.summary', { cats: s.categoryCount, subs: subCount, total: s.total });
    },

    insight1Title: i18n.t('insight1.title', { first: s.yearSpan.first, to: s.yearSpan.last }),
    insight1Body:  s.fundedCount
      ? i18n.t('insight1.body', { years: yearText, n: s.fundedCount, total: s.totalFunding })
      : i18n.t('insight1.body.empty'),

    insight2Title: s.acquisitionCount
      ? i18n.t('insight2.title', { n: s.acquisitionCount })
      : i18n.t('insight2.title.empty'),
    insight2Body:  s.acquisitionCount
      ? i18n.t('insight2.body', { list: acqList, years: acqYears.join(' / '), total: s.acquiredTotal })
      : i18n.t('insight2.body.empty'),

    insight3Title: hi ? i18n.t('insight3.title', { name: hi.name }) : i18n.t('insight3.title.empty'),
    insight3Body:  hi
      ? i18n.t('insight3.body', { parts: [
          hi.location && hi.location !== '—' ? i18n.t('insight.body.location', { v: hi.location }) : '',
          hf ? i18n.t('insight.body.funding', { label: hf.label, amount: hf.amount, stage: hf.stage }) : '',
          leadInvestors ? i18n.t('insight.body.investors', { v: leadInvestors }) : '',
          hi.products && hi.products.length ? i18n.t('insight.body.products', { n: hi.products.length }) : ''
        ].filter(Boolean).join(',') })
      : i18n.t('insight3.body.empty')
  };

  document.querySelectorAll('[data-stat]').forEach(el => {
    let v = values[el.dataset.stat];
    if (typeof v === 'function') v = v();
    if (v !== undefined) el.textContent = v;
  });
}

/* ============ 全分类树 ============ */
// 数据全部从 stats.subCategoryTree 现算,顺序按 moduleMeta 声明顺序。
// 改 data.js(增/删/换 category/subCategory),或调 moduleMeta 顺序,树自动重排。
// AI Security 跳过——它有自己专门的粉色高亮卡(在模块卡区),不再展开。
function renderInfraTree() {
  const root = document.getElementById('infraTree');
  if (!root) return;
  const tree = stats.subCategoryTree;
  const starred = (typeof StarStore !== 'undefined') ? StarStore.getStarred() : new Set();

  // 顶部"⭐ 星标"分组:按 starred 名字取 items
  const starredItems = items.filter(it => starred.has(it.name));
  const isEn = i18n && i18n.currentLang() === 'en';
  const starredTitle  = i18n.t('tree.starredTitle');
  const starredDesc   = i18n.t('tree.starredDesc');
  const itemCountFmt  = (n) => i18n.t('tree.itemCount', { n });
  const starOffLabel  = i18n.t('tree.starOff');
  const starOnLabel   = i18n.t('tree.starOn');
  const starredHtml = starredItems.length ? `
    <div class="infra-group starred-group open" data-group="__starred">
      <div class="infra-group-head">
        <span class="infra-group-icon starred-icon">⭐</span>
        <div>
          <div class="infra-group-name">${starredTitle}</div>
          <div class="infra-group-desc">${starredDesc}</div>
        </div>
        <span class="infra-group-count">${itemCountFmt(starredItems.length)}</span>
        <svg class="infra-caret" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 6 15 12 9 18"/></svg>
      </div>
      <div class="infra-subs starred-subs">
        ${starredItems.map(it => `
          <span class="infra-item starred-item" data-co="${it.name}" title="${(i18n.descFor(it) || '').replace(/"/g,'&quot;')}">
            <button class="star-btn active" data-star="${it.name}" title="${starOffLabel}" aria-label="${starOffLabel}">★</button>
            ${it.name}
          </span>
        `).join('')}
      </div>
    </div>
  ` : '';

  const groupsHtml = Object.keys(tree).filter(k => k !== 'AI Security').map(key => {
    const node = tree[key];
    const meta = moduleMeta[key] || {};
    // resolve desc: prefer i18n key, fallback to literal string, fallback to ''
    const groupDesc = (typeof i18n !== 'undefined' && i18n.t)
      ? (i18n.t('mod.desc.' + key, '') || meta.desc || '')
      : (meta.desc || '');
    const subsHtml = node.subs.map(sub => {
      const list = node.bySub[sub] || [];
      const itemsHtml = list.map(it => {
        const ghStars = it.stars ? `<span class="star">★${it.stars}</span>` : '';
        const userStarred = starred.has(it.name);
        const starBtn = userStarred
          ? `<button class="star-btn active" data-star="${it.name}" title="${starOffLabel}" aria-label="${starOffLabel}">★</button>`
          : `<button class="star-btn" data-star="${it.name}" title="${starOnLabel}" aria-label="${starOnLabel}">☆</button>`;
        return `<span class="infra-item${userStarred ? ' is-starred' : ''}" data-co="${it.name}" title="${(i18n.descFor(it) || '').replace(/"/g,'&quot;')}">${starBtn}${it.name}${ghStars}</span>`;
      }).join('');
      return `<div class="infra-sub">
        <div class="infra-sub-head">
          <span class="infra-sub-name">${sub}</span>
          <span class="infra-sub-count">${itemCountFmt(list.length)}</span>
        </div>
        <div class="infra-items">${itemsHtml || '<span class="infra-sub-count">—</span>'}</div>
      </div>`;
    }).join('');
    return `<div class="infra-group" data-group="${key}">
      <div class="infra-group-head">
        <span class="infra-group-icon">${meta.icon || ''}</span>
        <div>
          <div class="infra-group-name">${key}</div>
          <div class="infra-group-desc">${groupDesc}</div>
        </div>
        <span class="infra-group-count">${itemCountFmt(node.total)}</span>
        <svg class="infra-caret" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 6 15 12 9 18"/></svg>
      </div>
      <div class="infra-subs">${subsHtml}</div>
    </div>`;
  }).join('');

  root.innerHTML = starredHtml + groupsHtml;

  // 折叠/展开
  root.querySelectorAll('.infra-group-head').forEach(h => {
    h.addEventListener('click', () => h.parentElement.classList.toggle('open'));
  });
  // 点击子项(点名字) → 跳到主表 + 搜索
  root.querySelectorAll('.infra-item').forEach(el => {
    el.addEventListener('click', (e) => {
      // 点星标按钮不触发跳转
      if (e.target.classList.contains('star-btn')) return;
      e.stopPropagation();
      if (typeof apSearch !== 'undefined' && apSearch) {
        apSearch.value = el.dataset.co;
        currentPage = 1;
        renderAllProducts();
        apSearch.closest('section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
  // 分类树里点星标按钮 → 切换
  root.querySelectorAll('.star-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (typeof StarStore !== 'undefined') StarStore.toggleStar(btn.dataset.star);
    });
  });
}

/* ============ ALL PRODUCTS — 模块卡 + 列表合并 ============ */
// 模块卡:点击切换 activeCategory 筛选器,后台与下方列表共享同一 items[]
// AI Security 单独渲染:特化卡(粉色) + 公司标签内联展开
let activeCategory = 'all';
const modulesEl = document.getElementById('modules');

Object.entries(moduleMeta).forEach(([mname, mdata]) => {
  const total = items.filter(i => i.category === mname).length;
  const isAiSec = (mname === 'AI Security');
  const div = document.createElement('div');
  div.className = 'mod' + (isAiSec ? ' ai-sec-mod' : '');
  div.dataset.category = mname;

  if (isAiSec) {
    // 特化卡:标准头 + 全部公司内联标签(直接展开,无需展开按钮)
    const aiSecItems = items.filter(i => i.category === 'AI Security');
    div.innerHTML = `
      <span class="mod-icon">${mdata.icon}</span>
      <div class="mod-name">${i18n.t('mod.aiSec.title')}</div>
      <div class="mod-count">${i18n.t('mod.aiSec.count', { n: total })}</div>
      <div class="ai-sec-tags">
        ${aiSecItems.map(item => `
          <span class="ai-sec-tag" data-tool="${item.name}">
            <span class="co-dot"></span>
            ${item.name}
            ${item.name === HIGHLIGHT_NAME ? `<span class="badge-new">${i18n.t('mod.badge.new')}</span>` : ''}
          </span>
        `).join('')}
      </div>
    `;
    // 标签点击 → 在下方列表中直接筛选出该公司(设置搜索框,触发 render)
    // stopPropagation 避免冒泡到卡片的 filter
    div.querySelectorAll('.ai-sec-tag').forEach(tag => {
      tag.addEventListener('click', (e) => {
        e.stopPropagation();
        apSearch.value = tag.dataset.tool;
        currentPage = 1;
        renderAllProducts();
      });
    });
  } else {
    div.innerHTML = `
      <span class="mod-icon">${mdata.icon}</span>
      <div class="mod-name">${mname}</div>
      <div class="mod-count">${total} tools</div>
    `;
  }

  // 卡片点击 → 切换 category 筛选(同其他模块卡)
  div.addEventListener('click', () => {
    activeCategory = (activeCategory === mname) ? 'all' : mname;
    document.querySelectorAll('.mod').forEach(m => {
      m.classList.toggle('active', m.dataset.category === activeCategory);
    });
    currentPage = 1;
    renderAllProducts();
  });
  modulesEl.appendChild(div);
});

/* ============ ALL PRODUCTS LIST — 同一 items[],支持模块 + 类型 + 搜索 + 排序 + 星标 ============ */
const apTbody = document.getElementById('apTbody');
const apPager = document.getElementById('apPager');
const apSearch = document.getElementById('apSearch');
let activeApType = 'all';
let activeStarOnly = false;
let sortKey = 'name';
let sortDir = 'asc';

// 翻页状态
let currentPage = 1;
const PAGE_SIZE_OPTIONS = [10, 15, 20, 30, 50];
let pageSize = 15;

// Default 子类别显示名映射(从 meta.js 来的 subCatDisplay 也可)
function subCategoryDisplay(item) {
  if (item.subCategory) return subCatDisplay[item.subCategory] || item.subCategory;
  if (item.focus) return item.focus;
  return '—';
}

function productMatches(item, q) {
  if (!q) return false;
  if (item.name.toLowerCase().includes(q)) return true;
  if (item.desc && item.desc.toLowerCase().includes(q)) return true;
  if (item.desc_en && item.desc_en.toLowerCase().includes(q)) return true;
  if (item.products && item.products.some(p =>
    p.name.toLowerCase().includes(q) ||
    (p.desc && p.desc.toLowerCase().includes(q)) ||
    (p.desc_en && p.desc_en.toLowerCase().includes(q))
  )) return true;
  return false;
}

function compareItems(a, b, key, dir) {
  const sign = dir === 'desc' ? -1 : 1;
  const av = a[key] ?? '';
  const bv = b[key] ?? '';
  if (typeof av === 'number' && typeof bv === 'number') return (av - bv) * sign;
  // funding 在子对象里,要展开
  let aV = av, bV = bv;
  if (key === 'stage' || key === 'amount' || key === 'date') {
    aV = a.funding ? a.funding[key === 'amount' ? 'amount' : (key === 'stage' ? 'stage' : 'date')] : '';
    bV = b.funding ? b.funding[key === 'amount' ? 'amount' : (key === 'stage' ? 'stage' : 'date')] : '';
  }
  if (typeof aV === 'number' && typeof bV === 'number') return (aV - bV) * sign;
  return String(aV).localeCompare(String(bV)) * sign;
}

function renderAllProducts() {
  const q = apSearch.value.trim().toLowerCase();
  const starred = (typeof StarStore !== 'undefined') ? StarStore.getStarred() : new Set();
  const filtered = items
    .filter(item => {
      if (activeCategory !== 'all' && item.category !== activeCategory) return false;
      if (activeApType !== 'all' && item.type !== activeApType) return false;
      if (activeStarOnly && !starred.has(item.name)) return false;
      if (q && !productMatches(item, q)) return false;
      return true;
    })
    .sort((a, b) => compareItems(a, b, sortKey, sortDir));

  // 星标优先排序:开启 starred-only 时仍按当前 sortKey,但星标项置顶
  if (activeStarOnly) {
    filtered.sort((a, b) => {
      const sa = starred.has(a.name) ? 0 : 1;
      const sb = starred.has(b.name) ? 0 : 1;
      if (sa !== sb) return sa - sb;
      return compareItems(a, b, sortKey, sortDir);
    });
  }

  // 翻页:主条目级别切片,展开的子行跟随主行渲染
  const totalCount = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  if (currentPage > totalPages) currentPage = totalPages;
  if (currentPage < 1) currentPage = 1;
  const pageStart = (currentPage - 1) * pageSize;
  const paged = filtered.slice(pageStart, pageStart + pageSize);

  // 渲染主行 + 子产品行(展开时)
  const rows = [];
  const starOff = i18n.t('tree.starOff');
  const starOn  = i18n.t('tree.starOn');
  const productBadge = i18n.t('table.type.product');
  paged.forEach(item => {
    const f = item.funding;
    const fAmount = f ? f.amount : null;
    const fStage = f ? f.stage : '';
    const fDate = f ? f.date : '';
    const fFlag = f && f.flag;
    const fNote = f ? fundingNote(f) : '';
    const metaBits = [item.focus, item.location, fNote].filter(Boolean);
    const meta = metaBits.join(' · ');
    const isStarred = starred.has(item.name);
    const descText = i18n.descFor(item);
    const starBtn = `<button class="star-btn${isStarred ? ' active' : ''}" data-star="${item.name}" title="${isStarred ? starOff : starOn}" aria-label="${isStarred ? starOff : starOn}">${isStarred ? '★' : '☆'}</button>`;
    rows.push(`
      <tr class="ap-row${isStarred ? ' is-starred' : ''}" data-co="${item.name}">
        <td class="td-caret">
          ${item.products && item.products.length
            ? `<span class="ap-caret" aria-label="${i18n.t('table.expandCaret')}">▸</span>`
            : `<span class="ap-caret-spacer"></span>`}
        </td>
        <td class="td-name">
          <span class="ap-name">${item.name}</span>
          ${descText ? `<div class="ap-desc">${descText}</div>` : ''}
        </td>
        <td class="td-star">${starBtn}</td>
        <td class="td-type">
          <span class="type-badge ${typeBadgeClass[item.type]}">${i18n.t('table.type.' + item.type, typeLabel[item.type])}</span>
        </td>
        <td class="td-sub">${item.subCategory ? (subCatDisplay[item.subCategory] || item.subCategory) : '—'}</td>
        <td class="td-stage">${f ? `<span class="stage-pill ${stageClass(f.stage)}">${f.stage}</span>` : '<span class="dash">—</span>'}</td>
        <td class="td-amount">${f ? `<span class="amount ${fFlag ? 'flagged' : ''}">$${fAmount}M</span>` : '<span class="dash">—</span>'}</td>
        <td class="td-date">${f ? `<span class="date-cell">${f.label}</span>` : '<span class="dash">—</span>'}</td>
        <td class="td-meta">${meta || '<span class="dash">—</span>'}</td>
      </tr>
    `);
    // 子产品行(默认折叠,搜索命中产品时自动展开)
    if (item.products && item.products.length) {
      item.products.forEach(p => {
        const pDesc = i18n.descFor(p);
        rows.push(`
          <tr class="ap-product-row" data-parent="${item.name}" data-co="${item.name}" data-product="${p.name}">
            <td class="td-caret"></td>
            <td class="td-name"><span class="ap-sub-name">↳ ${p.name}</span></td>
            <td class="td-star"></td>
            <td class="td-type"><span class="type-badge type-co">${productBadge}</span></td>
            <td class="td-sub" colspan="5"><span class="ap-sub-desc">${pDesc || ''}</span></td>
          </tr>
        `);
      });
    }
  });

  apTbody.innerHTML = rows.length ? rows.join('') : `
    <tr class="ap-empty-row"><td colspan="9" class="ap-empty">${i18n.t('table.empty')}</td></tr>
  `;

  // 搜索命中产品时自动展开对应父行
  if (q) {
    paged.forEach(item => {
      if (item.products && item.products.some(p =>
        p.name.toLowerCase().includes(q) || (p.desc && p.desc.toLowerCase().includes(q))
      )) {
        const parent = apTbody.querySelector(`.ap-row[data-co="${CSS.escape(item.name)}"]`);
        if (parent) {
          parent.classList.add('expanded');
          apTbody.querySelectorAll(`.ap-product-row[data-parent="${CSS.escape(item.name)}"]`)
            .forEach(sub => sub.style.display = 'table-row');
        }
      }
    });
  }

  // 列头排序指示器
  document.querySelectorAll('.ap-table th[data-sort]').forEach(th => {
    const ind = th.querySelector('.sort-ind');
    if (th.dataset.sort === sortKey) {
      ind.textContent = sortDir === 'asc' ? '▲' : '▼';
      th.classList.add('active-sort');
    } else {
      ind.textContent = '';
      th.classList.remove('active-sort');
    }
  });

  // 主行点击 → 打开 modal(排除 caret 列、star 按钮)
  apTbody.querySelectorAll('.ap-row').forEach(tr => {
    tr.addEventListener('click', (e) => {
      if (e.target.classList.contains('ap-caret')) return;
      if (e.target.classList.contains('star-btn')) return;
      openModal(tr.dataset.co);
    });
  });
  // 子行点击 → 打开产品 modal
  apTbody.querySelectorAll('.ap-product-row').forEach(tr => {
    tr.addEventListener('click', () => openProductModal(tr.dataset.co, tr.dataset.product));
  });
  // caret 点击 → 切换展开
  apTbody.querySelectorAll('.ap-caret').forEach(el => {
    el.addEventListener('click', (e) => {
      e.stopPropagation();
      const row = el.closest('.ap-row');
      const expanded = row.classList.toggle('expanded');
      const parentName = row.dataset.co;
      apTbody.querySelectorAll(`.ap-product-row[data-parent="${CSS.escape(parentName)}"]`)
        .forEach(sub => sub.style.display = expanded ? 'table-row' : 'none');
    });
  });
  // 星标按钮点击 → 切换星标,不要打开 modal
  apTbody.querySelectorAll('.star-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (typeof StarStore !== 'undefined') StarStore.toggleStar(btn.dataset.star);
    });
  });

  renderPager(totalCount, totalPages);
}

/* ============ PAGER — 页码 + 上一页/下一页 + 每页大小 ============ */
function buildPageList(cur, total) {
  const pages = new Set([1, total, cur, cur - 1, cur + 1]);
  const list = [...pages].filter(p => p >= 1 && p <= total).sort((a, b) => a - b);
  const out = [];
  for (let i = 0; i < list.length; i++) {
    if (i > 0 && list[i] - list[i - 1] > 1) out.push('…');
    out.push(list[i]);
  }
  return out;
}

function renderPager(totalCount, totalPages) {
  if (!apPager) return;
  if (totalCount === 0) { apPager.innerHTML = ''; return; }

  const from = (currentPage - 1) * pageSize + 1;
  const to = Math.min(currentPage * pageSize, totalCount);
  const pageList = buildPageList(currentPage, totalPages);

  const sizeOpts = PAGE_SIZE_OPTIONS.map(n =>
    `<option value="${n}"${n === pageSize ? ' selected' : ''}>${n}</option>`
  ).join('');

  apPager.innerHTML = `
    <span class="ap-pager-info">
      ${i18n.t('pager.info', { n: totalCount, from, to })}
    </span>
    <div class="ap-pager-pages">
      <button class="ap-pager-btn" data-page="prev"${currentPage === 1 ? ' disabled' : ''} aria-label="${i18n.t('pager.prev')}">‹</button>
      ${pageList.map(p =>
        p === '…'
          ? `<span class="ap-pager-ellipsis">…</span>`
          : `<button class="ap-pager-btn${p === currentPage ? ' active' : ''}" data-page="${p}">${p}</button>`
      ).join('')}
      <button class="ap-pager-btn" data-page="next"${currentPage === totalPages ? ' disabled' : ''} aria-label="${i18n.t('pager.next')}">›</button>
    </div>
    <label class="ap-pager-size">
      ${i18n.t('pager.size')}
      <select id="apPageSize">${sizeOpts}</select>
      ${i18n.t('pager.unit')}
    </label>
  `;

  apPager.querySelectorAll('.ap-pager-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const v = btn.dataset.page;
      if (v === 'prev') currentPage = Math.max(1, currentPage - 1);
      else if (v === 'next') currentPage = Math.min(totalPages, currentPage + 1);
      else currentPage = parseInt(v, 10);
      renderAllProducts();
      apTbody.closest('section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
  const sel = document.getElementById('apPageSize');
  sel.addEventListener('change', () => {
    pageSize = parseInt(sel.value, 10);
    currentPage = 1;
    renderAllProducts();
  });
}

// 需要 stageClass 来给轮次染色;从原 table CSS 复用的工具函数
function stageClass(s) {
  if (s === 'Seed') return 'stage-Seed';
  if (s === 'Series A') return 'stage-A';
  if (s === 'Series B') return 'stage-B';
  if (s === 'Strategic') return 'stage-Strategic';
  if (s === 'Seed+Series A') return 'stage-A';
  return 'stage-Seed';
}
