// Detail modal: openModal / openProductModal / closeModal.
// Classic script — depends on data.js + derived.js + meta.js.

const modalBg = document.getElementById('modalBg');
const mName = document.getElementById('m-name');
const mTypeBadge = document.getElementById('m-typebadge');
const mTagline = document.getElementById('m-tagline');
const mBody = document.getElementById('m-body');

function taglineFor(item) {
  if (item.subCategory === 'Companies') return item.focus || i18n.t('modal.tagline.aiSec');
  return i18n.t('modal.tagline.' + item.type);
}

function openProductModal(coName, prodName) {
  const co = byName[coName];
  if (!co || !co.products) return;
  const p = co.products.find(x => x.name === prodName);
  if (!p) return;
  mName.textContent = p.name;
  mTypeBadge.innerHTML = `<span class="type-badge ${typeBadgeClass.co}">${i18n.t('modal.productBadge', { co: coName })}</span>`;
  mTagline.textContent = i18n.t('modal.productByline', { co: coName });
  mBody.innerHTML = '';

  // 简介 = 产品描述
  const desc = document.createElement('div');
  desc.className = 'modal-section';
  const layerTag = p.layer ? `<span class="type-badge" style="background:#fef3c7;color:#b45309;margin-right:8px;">${p.layer}</span>` : '';
  desc.innerHTML = `<h5>${i18n.t('modal.intro')}</h5><p>${layerTag}${i18n.descFor(p) || i18n.t('modal.noIntro')}</p>`;
  mBody.appendChild(desc);

  // AgentGraph 专属:架构流程图(mermaid)
  if (p.name === 'AgentGraph') {
    const arch = document.createElement('div');
    arch.className = 'modal-section';
    arch.innerHTML = `<h5>${i18n.t('modal.arch')}</h5><div class="mermaid-wrap"><pre class="mermaid"></pre></div>`;
    // 用 textContent 注入,保留 <br/> 字面量给 mermaid 解析
    arch.querySelector('pre.mermaid').textContent =
      `flowchart TD
    A["执行 Trace"] --> B["Action Graph<br/>每一步模型输出、工具调用、Agent 通信"]
    A --> C["Component Graph<br/>Agent、工具、短期记忆、长期记忆"]
    B --> D["定位高风险动作"]
    C --> D
    D --> E["红队评测、策略加固、运行时拦截"]`;
    mBody.appendChild(arch);
    if (window.mermaid) {
      try { mermaid.run({ nodes: arch.querySelectorAll('.mermaid') }); }
      catch (e) { console.warn('mermaid render failed', e); }
    }
  }

  // 母公司信息
  const parent = document.createElement('div');
  parent.className = 'modal-section';
  parent.innerHTML = `<h5>${i18n.t('modal.parentCo')}</h5>
    <div class="info-grid">
      <div class="info-cell"><div class="k">${i18n.t('modal.cell.company')}</div><div class="v">${co.name}</div></div>
      <div class="info-cell"><div class="k">${i18n.t('modal.cell.focus')}</div><div class="v">${co.focus || '—'}</div></div>
      <div class="info-cell"><div class="k">${i18n.t('modal.cell.location')}</div><div class="v">${co.location || '—'}</div></div>
      <div class="info-cell"><div class="k">${i18n.t('modal.cell.founded')}</div><div class="v">${co.founded || '—'}</div></div>
    </div>`;
  mBody.appendChild(parent);

  // 跳转链接:优先产品自带链接,fallback 到母公司链接
  if (co.website || co.repo || p.website || p.repo) {
    const lr = document.createElement('div');
    lr.className = 'modal-section';
    const links = [];
    if (p.repo)   links.push({ url: p.repo,   label: i18n.t('modal.viewOnGitHub'), cls: 'github' });
    else if (co.repo) links.push({ url: co.repo, label: i18n.t('modal.viewOnGitHub'), cls: 'github' });
    if (p.website)  links.push({ url: p.website, label: i18n.t('modal.visitWebsite', { n: p.name }), cls: '' });
    else if (co.website) links.push({ url: co.website, label: i18n.t('modal.visitWebsite', { n: co.name }), cls: '' });
    lr.innerHTML = `<h5>${i18n.t('modal.links')}</h5>
      <div class="link-row">${links.map(l => `
        <a class="link-btn ${l.cls}" href="${l.url}" target="_blank" rel="noopener">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
          ${l.label}
        </a>`).join('')}</div>`;
    mBody.appendChild(lr);
  }

  modalBg.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function openModal(name) {
  const t = byName[name];
  if (!t) return;
  mName.textContent = name;
  mTypeBadge.innerHTML = `<span class="type-badge ${typeBadgeClass[t.type]}">${i18n.t('table.type.' + t.type, typeLabel[t.type])}</span>`;
  mTagline.textContent = taglineFor(t);
  mBody.innerHTML = '';

  if (t.flag) {
    const f = document.createElement('div');
    f.className = 'modal-section';
    f.innerHTML = `<div class="flag-banner">${t.flag}</div>`;
    mBody.appendChild(f);
  }

  const desc = document.createElement('div');
  desc.className = 'modal-section';
  desc.innerHTML = `<h5>${i18n.t('modal.intro')}</h5><p>${i18n.descFor(t)}</p>`;
  mBody.appendChild(desc);

  if (t.location || t.founded || t.employees || t.focus) {
    const grid = document.createElement('div');
    grid.className = 'modal-section';
    grid.innerHTML = `<h5>${i18n.t('modal.basicInfo')}</h5>
      <div class="info-grid">
        <div class="info-cell"><div class="k">${i18n.t('modal.cell.location')}</div><div class="v">${t.location || '—'}</div></div>
        <div class="info-cell"><div class="k">${i18n.t('modal.cell.founded')}</div><div class="v">${t.founded || '—'}</div></div>
        <div class="info-cell"><div class="k">${i18n.t('modal.cell.employees')}</div><div class="v">${t.employees || '—'}</div></div>
        <div class="info-cell"><div class="k">${i18n.t('modal.cell.focus')}</div><div class="v">${t.focus || '—'}</div></div>
      </div>`;
    mBody.appendChild(grid);
  }

  if (t.products && t.products.length) {
    const ps = document.createElement('div');
    ps.className = 'modal-section';
    ps.innerHTML = `<h5>${i18n.t('modal.products', { n: t.products.length })}</h5>
      <div class="product-list">${t.products.map(p => `
        <div class="product">
          <div class="pn"><span class="dot"></span>${p.name}</div>
          <div class="pd">${i18n.descFor(p)}</div>
        </div>`).join('')}</div>`;
    mBody.appendChild(ps);
  }

  if (t.funding_breakdown && t.funding_breakdown.length) {
    const fb = document.createElement('div');
    fb.className = 'modal-section';
    fb.innerHTML = `<h5>${i18n.t('modal.fundingBreakdown')}</h5>
      <div class="product-list">${t.funding_breakdown.map(b => `
        <div class="product">
          <div class="pn"><span class="dot"></span>${b.round}</div>
          <div class="pd mono">${b.amount}</div>
        </div>`).join('')}</div>`;
    mBody.appendChild(fb);
  }

  if (t.investors && t.investors.length) {
    const inv = document.createElement('div');
    inv.className = 'modal-section';
    inv.innerHTML = `<h5>${i18n.t('modal.investors', { n: t.investors.length })}</h5>
      <p>${t.investors.map(i => `<span class="type-badge" style="margin:2px 4px 2px 0;display:inline-block;background:#f4f4f5;color:#3a4256;">${i}</span>`).join('')}</p>`;
    mBody.appendChild(inv);
  }

  if (t.papers && t.papers.length) {
    const pr = document.createElement('div');
    pr.className = 'modal-section';
    pr.innerHTML = `<h5>${i18n.t('modal.papers', { n: t.papers.length })}</h5>
      <div class="paper-list">${t.papers.map(p => `
        <div class="paper">
          <div class="paper-title"><a href="${p.url}" target="_blank" rel="noopener">${p.title}</a></div>
          <div class="paper-meta">${p.authors} · ${p.venue}${p.year ? ' · ' + p.year : ''}</div>
          ${p.summary ? `<div class="paper-summary">${p.summary}</div>` : ''}
        </div>`).join('')}</div>`;
    mBody.appendChild(pr);
  }

  // Links: repo → GitHub button, website → Visit Website button
  const links = [];
  if (t.repo) links.push({ url: t.repo, label: i18n.t('modal.viewOnGitHub'), cls: 'github', icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>' });
  if (t.website) links.push({ url: t.website, label: i18n.t('modal.visitWebsite', { n: name }), icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>' });

  if (links.length) {
    const lr = document.createElement('div');
    lr.className = 'modal-section';
    lr.innerHTML = `<h5>${i18n.t('modal.links')}</h5>
      <div class="link-row">${links.map(l => `
        <a class="link-btn ${l.cls}" href="${l.url}" target="_blank" rel="noopener">${l.icon}${l.label}</a>
      `).join('')}</div>`;
    mBody.appendChild(lr);
  }

  if (!t.repo && !t.website) {
    const nr = document.createElement('div');
    nr.className = 'modal-section';
    nr.innerHTML = `<h5>${i18n.t('modal.links')}</h5>
      <div class="link-row">
        <a class="link-btn secondary" href="https://www.google.com/search?q=${encodeURIComponent(name + ' agent infra')}" target="_blank" rel="noopener">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          ${i18n.t('modal.fallback.google')}
        </a>
      </div>
      <p style="margin-top:8px;font-size:12px;color:var(--ink-3);">${i18n.t('modal.fallback.noLinks')}</p>`;
    mBody.appendChild(nr);
  }

  modalBg.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  modalBg.classList.remove('active');
  document.body.style.overflow = '';
  if (mBody) mBody.classList.remove('article-mode');
}

/* ================================================================
   长文洞察 — insights 页面卡片点击打开
   复用同一套 modal DOM,内容换成 article 渲染。
   ================================================================ */
function openArticle(slug) {
  const a = articles && articles[slug];
  if (!a) return;

  mName.textContent = a.title;
  mTypeBadge.innerHTML = `<span class="type-badge type-co">${i18n.t('modal.article.badge', { eyebrow: a.eyebrow })}</span>`;
  mTagline.textContent = a.deck;
  mBody.innerHTML = '';
  mBody.classList.add('article-mode');

  // Eyebrow
  const eyebrow = document.createElement('div');
  eyebrow.className = 'article-eyebrow';
  eyebrow.textContent = a.eyebrow;
  mBody.appendChild(eyebrow);

  // Deck
  const deck = document.createElement('p');
  deck.className = 'article-deck';
  deck.textContent = a.deck;
  mBody.appendChild(deck);

  // Byline
  const byline = document.createElement('div');
  byline.className = 'article-byline';
  byline.textContent = a.byline;
  mBody.appendChild(byline);

  // Stats row
  if (a.stats && a.stats.length) {
    const stats = document.createElement('div');
    stats.className = 'article-stats';
    stats.innerHTML = a.stats.map(s => `
      <div class="article-stat">
        <div class="article-stat-value">${articleEs(s.value)}<span class="article-stat-suffix">${articleEs(s.suffix || '')}</span></div>
        <div class="article-stat-label">${articleEs(s.label)}</div>
      </div>
    `).join('');
    mBody.appendChild(stats);
  }

  // Sections
  for (const sec of (a.sections || [])) {
    const secEl = document.createElement('section');
    secEl.className = 'article-section';
    if (sec.h) {
      const h = document.createElement('h3');
      h.textContent = sec.h;
      secEl.appendChild(h);
    }
    for (const p of (sec.paragraphs || [])) {
      const para = document.createElement('p');
      para.textContent = p;
      secEl.appendChild(para);
    }
    mBody.appendChild(secEl);
  }

  // Callout
  if (a.callout) {
    const c = document.createElement('div');
    c.className = `article-callout ${a.callout.kind === 'quote' ? 'article-callout-quote' : 'article-callout-stat'}`;
    c.innerHTML = `
      <div class="article-callout-text">${articleEs(a.callout.text)}</div>
      ${a.callout.cite ? `<div class="article-callout-cite">${articleEs(a.callout.cite)}</div>` : ''}
    `;
    mBody.appendChild(c);
  }

  // Related companies
  if (a.relatedCompanies && a.relatedCompanies.length) {
    const wrap = document.createElement('div');
    wrap.className = 'article-related';
    wrap.innerHTML = `<div class="article-related-title">${i18n.t('modal.article.related')}</div>
      <div class="article-related-tags">${a.relatedCompanies.map(name => {
        const item = byName[name];
        const cls = item ? 'article-related-tag' : 'article-related-tag muted';
        const descText = item ? i18n.descFor(item).slice(0, 60) : '';
        const title = item ? `${name} — ${descText}` : i18n.t('modal.article.notListed', { name });
        const onclick = item ? `onclick="openModal('${articleEs(name).replace(/'/g, "\\'")}')"` : '';
        return `<span class="${cls}" ${onclick} title="${articleEs(title)}">${articleEs(name)}</span>`;
      }).join('')}</div>`;
    mBody.appendChild(wrap);
  }

  modalBg.classList.add('active');
  document.body.style.overflow = 'hidden';
  mBody.scrollTop = 0;
}

// Expose closeModal to inline onclick in index.html (the close button).
// Keeping this global avoids a second event listener + a separate click handler.
window.closeModal = closeModal;
window.openArticle = openArticle;

modalBg.addEventListener('click', (e) => { if (e.target === modalBg) closeModal(); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });
