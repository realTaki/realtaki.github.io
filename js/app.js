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

  /* ── Sidebar TOC scroll-spy ──
     When a `.post-toc-sidebar` is present, observe the sections it links to
     and toggle `.is-active` on the link whose target is currently in view.
     Stops watching once the user scrolls past the article to avoid pinning
     the last entry forever. */
  var toc = document.querySelector('.post-toc-sidebar');
  if (toc && 'IntersectionObserver' in window) {
    var links = Array.prototype.slice.call(toc.querySelectorAll('a[href^="#"]'));
    var linkByHash = {};
    links.forEach(function (a) { linkByHash[a.getAttribute('href').slice(1)] = a; });

    var headings = links
      .map(function (a) { return document.getElementById(a.getAttribute('href').slice(1)); })
      .filter(Boolean);

    if (headings.length) {
      var activeHash = null;
      function setActive(hash) {
        if (hash === activeHash) return;
        activeHash = hash;
        links.forEach(function (a) { a.classList.remove('is-active'); });
        if (hash && linkByHash[hash]) linkByHash[hash].classList.add('is-active');
      }
      // Use a top-root-margin so a heading becomes "active" ~25% from the top.
      var io = new IntersectionObserver(function (entries) {
        // Pick the topmost intersecting heading.
        var visible = entries
          .filter(function (e) { return e.isIntersecting; })
          .sort(function (a, b) { return a.target.getBoundingClientRect().top - b.target.getBoundingClientRect().top; });
        if (visible.length) {
          setActive(visible[0].target.id);
        }
      }, { rootMargin: '-10% 0px -70% 0px', threshold: 0 });
      headings.forEach(function (h) { io.observe(h); });

      // If the user scrolls past the last heading, keep the last TOC entry highlighted.
      window.addEventListener('scroll', function () {
        var last = headings[headings.length - 1];
        if (!last) return;
        var rect = last.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.4) setActive(last.id);
      }, { passive: true });
    }
  }
})();
