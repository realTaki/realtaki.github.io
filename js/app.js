/* ============================================================
   app.js — site-wide shared behaviors

   - Back-to-top button
   - Active nav link highlighting
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

  /* (Bilingual post body filtering lives in style.css and follows
     the <html lang> attribute set by js/i18n.js. No per-page state.) */
})();
