// Derived data. Classic script — depends on js/data.js being loaded first.
// Exposes `fundings` (flattened funding rows), `byName` (name -> item) and
// `stats` (everything the page displays as a number).

/* ===== 派生数据 ===== */
// fundings = items that have funding data, flattened so renderers can read
// stage/amount/date/label/note/flag directly off the row, while keeping
// the parent company name and products for grouping/modal lookups.
const fundings = items
  .filter(i => i.funding)
  .map(i => ({ ...i.funding, name: i.name, products: i.products }));

// name lookup map for quick access
const byName = Object.fromEntries(items.map(i => [i.name, i]));

/* ===== 融资备注:结构化字段 → 展示文案 =====
   收购信息存在 funding.acquired 里(金额/日期都是结构化的),展示用的
   "被收购 ~$500M · Apr 2025" 由这里拼出来 —— 数据只写一遍,统计和文案同源。 */
function acquiredText(f) {
  if (!f || !f.acquired) return '';
  const a = f.acquired;
  return i18n.t('funded.acquiredFmt', {
    approx: a.approx ? '~' : '',
    amount: a.amount,
    date: a.label || a.date
  });
}
function fundingNote(f) {
  return [f && f.note, acquiredText(f)].filter(Boolean).join(' · ');
}

/* ===== 全局统计:页面上每一个数字都从 items[] 现算 =====
   加/删/改 data.js 里的任何一行,hero 卡片、导语、观察卡会自动跟着变。 */
const stats = (() => {
  const uniq = arr => [...new Set(arr)];

  const categories    = uniq(items.map(i => i.category).filter(Boolean));
  const subCategories = uniq(items.map(i => i.subCategory).filter(Boolean));
  const openSource    = items.filter(i => i.type === 'os' || i.type === 'both');
  const withRepo      = items.filter(i => i.repo);
  const withProducts  = items.filter(i => i.products && i.products.length);
  const productCount  = withProducts.reduce((s, i) => s + i.products.length, 0);

  const totalFunding  = fundings.reduce((s, f) => s + (f.amount || 0), 0);
  const acquisitions  = fundings.filter(f => f.acquired);
  const acquiredTotal = acquisitions.reduce((s, f) => s + (f.acquired.amount || 0), 0);

  // 按年份统计融资笔数(年份直接从 funding.date 的前 4 位取)
  const years    = fundings.map(f => String(f.date || '').slice(0, 4)).filter(Boolean);
  const byYear   = uniq(years).sort().map(y => ({ year: y, count: years.filter(v => v === y).length }));
  const yearSpan = byYear.length
    ? { first: byYear[0].year, last: byYear[byYear.length - 1].year }
    : { first: '—', last: '—' };

  return {
    total: items.length,
    categories, categoryCount: categories.length,
    subCategories, subCategoryCount: subCategories.length,
    openSourceCount: openSource.length,
    repoCount: withRepo.length,
    productCount, productParentCount: withProducts.length,
    fundedCount: fundings.length,
    totalFunding,
    acquisitions, acquisitionCount: acquisitions.length, acquiredTotal,
    byYear, yearSpan,

    // 分类树:每个 category → 它的 subCategory 列表(每项的 count + items)。
    // 顺序按 moduleMeta 的声明顺序,增删/改 data.js 自动重排。
    subCategoryTree: (() => {
      // 优先按 moduleMeta 的声明顺序;若 category 不在 meta 里,补在末尾
      const metaOrder = (typeof moduleMeta !== 'undefined')
        ? Object.keys(moduleMeta)
        : [];
      const allCats = uniq(items.map(i => i.category).filter(Boolean));
      const order = [...metaOrder.filter(c => allCats.includes(c)),
                      ...allCats.filter(c => !metaOrder.includes(c))];
      const tree = {};
      for (const c of order) {
        const inCat = items.filter(i => i.category === c);
        // subCategory 顺序:先出现先得
        const subs = [];
        const seen = new Set();
        for (const it of inCat) {
          const s = it.subCategory;
          if (s && !seen.has(s)) { seen.add(s); subs.push(s); }
        }
        const bySub = {};
        for (const s of subs) bySub[s] = inCat.filter(i => i.subCategory === s);
        tree[c] = { total: inCat.length, subs, bySub };
      }
      return tree;
    })()
  };
})();

// mermaid init (startOnLoad:false — render diagram nodes manually when needed).
// Runs at script-evaluation time so window.mermaid is already defined (script
// tag in <head> completes before this script loads).
if (window.mermaid) {
  mermaid.initialize({
    startOnLoad: false,
    theme: 'neutral',
    securityLevel: 'loose',
    fontFamily: 'inherit',
    flowchart: { htmlLabels: true, curve: 'basis' }
  });
}
