/* ================================================================
   Blog card renderer — drives [data-blog-latest] and [data-blog-all]
   elements from window.BLOG_POSTS (see blog-manifest.js).

   Usage in HTML:
     <div class="card-grid" data-blog-latest="3"></div>
       ↑ renders the 3 most recent posts (by date desc).
     <div class="card-grid" data-blog-all></div>
       ↑ renders every post in the manifest, newest first.

   Cards reuse the existing .home-card markup so they pick up the
   site's .card / .tag / .card-title / .card-desc styles automatically.

   Re-renders automatically on `lang:changed` from i18n.js so the
   bilingual title/desc follow the active language toggle.
   ================================================================ */
(function () {
  'use strict';

  // Tag-kind → CSS class on the rendered <span>.
  const KIND_CLASS = {
    ghost:   'tag ghost',
    default: 'tag',
    pink:    'tag pink',
    amber:   'tag amber',
    plain:   ''
  };

  function escHtml(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  function currentLang() {
    return (window.i18n && i18n.currentLang) ? i18n.currentLang() : 'zh';
  }

  function lang() {
    return currentLang() === 'en' ? 'en' : 'zh';
  }

  function renderTag(tag) {
    const cls = KIND_CLASS[tag.kind] !== undefined ? KIND_CLASS[tag.kind] : 'tag';
    const body = (tag.html !== undefined)
      ? tag.html
      : escHtml(tag.text || '');
    return cls
      ? `<span class="${cls}">${body}</span>`
      : `<span>${body}</span>`;
  }

  function renderCard(post, hrefPrefix) {
    const l = lang();
    const title = post.title[l] || post.title.zh;
    const desc  = post.desc[l]  || post.desc.zh;
    const href  = hrefPrefix + post.slug + '/';
    const tagsHtml = (post.tags || []).map(renderTag).join('\n          ');
    return `
        <a class="card home-card" href="${escHtml(href)}">
          <div class="card-title">${escHtml(title)}</div>
          <div class="card-desc">${escHtml(desc)}</div>
          <div class="tags">
            ${tagsHtml}
          </div>
        </a>`;
  }

  // Sort newest first by ISO date string (lexicographic == chronological for YYYY-MM-DD).
  function sorted(posts) {
    return posts.slice().sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
  }

  function renderAll() {
    const posts = (window.BLOG_POSTS || []).slice();
    if (!posts.length) return;

    document.querySelectorAll('[data-blog-latest], [data-blog-all]').forEach(host => {
      const isLatest = host.hasAttribute('data-blog-latest');
      const limit = isLatest
        ? Math.max(1, parseInt(host.getAttribute('data-blog-latest'), 10) || 3)
        : Infinity;

      const list = sorted(posts).slice(0, limit);
      // hrefPrefix — absolute on / (home) so it works for both /blog/<slug>/ and /<slug>/
      // From blog/index.html we use ./<slug>/; from / (home) we use /blog/<slug>/
      // Default heuristic: if host lives inside /blog/ subtree, use ./
      const isBlogPage = (location.pathname || '').replace(/\/$/, '').endsWith('/blog');
      const hrefPrefix = isBlogPage ? './' : '/blog/';

      host.innerHTML = list.map(p => renderCard(p, hrefPrefix)).join('\n');
    });
  }

  function init() {
    if (typeof window.BLOG_POSTS === 'undefined') {
      console.warn('[blog-render.js] window.BLOG_POSTS is missing — load js/blog-manifest.js first.');
      return;
    }

    function boot() {
      renderAll();
      // Re-render on language toggle so title/desc follow the active language.
      document.addEventListener('lang:changed', renderAll);
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', boot, { once: true });
    } else {
      boot();
    }
  }

  init();
})();