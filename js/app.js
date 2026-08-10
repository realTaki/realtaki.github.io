/* ============================================================
   app.js — site-wide shared behaviors

   - Back-to-top button
   - Active nav link highlighting
   - Bilingual post body filter (JS backup for html[lang] CSS rule)
   ============================================================ */
(function () {
  'use strict';

  /* ── Back to top ── */
  var totop = document.getElementById('totop');
  if (totop) {
    function onScroll() {
      totop.classList.toggle('show', (window.scrollY || document.documentElement.scrollTop) > 400);
    }
    totop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ── Active nav ── */
  var currentPath = location.pathname.replace(/\/$/, '') || '/';
  // Pre-build a base URL so we can resolve relative hrefs (e.g. './' from /blog/index.html).
  var baseHref = document.querySelector('base[href]') ? document.querySelector('base[href]').href
                 : location.href.substring(0, location.href.lastIndexOf('/') + 1);
  document.querySelectorAll('.site-nav a').forEach(function (a) {
    var href = a.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('mailto:')) return;
    // Resolve to an absolute path, then normalize (strip trailing slash, drop .html).
    var resolved;
    try { resolved = new URL(href, baseHref).pathname; }
    catch (e) { return; }
    var linkPath = resolved.replace(/\/$/, '').replace(/\.html$/, '') || '/';
    if (currentPath === linkPath) a.classList.add('active');
  });

  /* ── Bilingual post body filter ──
     Mirrors the CSS rule `html[lang] [data-lang]` in JS, so we don't
     depend on attribute-selector reactivity (some browser states don't
     repaint when only <html lang> changes). i18n.js sets <html lang>;
     we explicitly toggle inline display as a belt-and-suspenders. */
  function applyBilingualFilter(lang) {
    var active = (lang === 'en') ? 'en' : 'zh';
    document.querySelectorAll('[data-lang]').forEach(function (el) {
      el.style.display = (el.getAttribute('data-lang') === active) ? '' : 'none';
    });
  }
  function getCurrentLang() {
    if (window.i18n && typeof window.i18n.currentLang === 'function') {
      return window.i18n.currentLang();
    }
    return (document.documentElement.lang || '').startsWith('en') ? 'en' : 'zh';
  }
  applyBilingualFilter(getCurrentLang());
  document.addEventListener('lang:changed', function (e) {
    if (e && e.detail && e.detail.lang) applyBilingualFilter(e.detail.lang);
  });
})();
