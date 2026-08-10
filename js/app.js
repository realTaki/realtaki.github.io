/* ============================================================
   app.js — site-wide shared behaviors

   - Back-to-top button
   - Active nav link highlighting
   - In-article language toggle (filters EN/CN sections of a bilingual post)
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

  /* ── In-article language toggle ──
     Filters the EN / CN sections of a bilingual blog post.
     State lives on .post-body[data-article-lang] = "zh" | "en" | "both".
     Persisted per-post in localStorage; default follows the site-wide
     language (window.i18n.currentLang()) so switching nav lang flips
     the article body too. */
  var toggle = document.querySelector('.post-lang-toggle');
  var postBody = document.querySelector('.post-body');
  if (!toggle || !postBody) return;

  var ARTICLE_LANG_KEY = 'realtaki.article-lang';
  var SUPPORTED_ARTICLE_LANG = ['zh', 'en', 'both'];

  function resolveInitialArticleLang() {
    try {
      var stored = localStorage.getItem(ARTICLE_LANG_KEY);
      if (SUPPORTED_ARTICLE_LANG.indexOf(stored) !== -1) return stored;
    } catch (e) {}
    // Default follows site-wide lang if available; else "both".
    if (window.i18n && typeof window.i18n.currentLang === 'function') {
      var siteLang = window.i18n.currentLang();
      if (siteLang === 'en' || siteLang === 'zh') return siteLang;
    }
    return 'both';
  }

  function applyArticleLang(lang) {
    if (SUPPORTED_ARTICLE_LANG.indexOf(lang) === -1) lang = 'both';
    postBody.setAttribute('data-article-lang', lang);
    toggle.querySelectorAll('[data-set-lang]').forEach(function (btn) {
      var match = btn.getAttribute('data-set-lang') === lang;
      btn.classList.toggle('active', match);
      btn.setAttribute('aria-selected', match ? 'true' : 'false');
    });
  }

  function setArticleLang(lang) {
    applyArticleLang(lang);
    try { localStorage.setItem(ARTICLE_LANG_KEY, lang); } catch (e) {}
  }

  // Wire button clicks.
  toggle.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-set-lang]');
    if (!btn) return;
    setArticleLang(btn.getAttribute('data-set-lang'));
  });

  // Sync to site-wide lang changes: if user is on a single-language view,
  // mirror the nav switch; if on "both", leave it alone.
  document.addEventListener('lang:changed', function (e) {
    var next = e.detail && e.detail.lang;
    if (!next) return;
    var current = postBody.getAttribute('data-article-lang') || 'both';
    // If user is showing only one language, follow the site toggle.
    // If they're showing both, leave it (they explicitly opted in).
    if (current === 'zh' || current === 'en') setArticleLang(next);
  });

  // Initial state.
  applyArticleLang(resolveInitialArticleLang());
})();
