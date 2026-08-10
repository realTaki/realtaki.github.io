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
  document.querySelectorAll('.site-nav a').forEach(function (a) {
    var href = a.getAttribute('href');
    if (!href) return;
    // Resolve relative paths for matching
    var linkPath = href.replace(/\/$/, '') || '/';
    if (href.startsWith('/')) {
      // absolute path: exact match
      if (currentPath === linkPath) a.classList.add('active');
    }
  });
})();
