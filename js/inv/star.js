// Star / featured bookmark feature.
// Persists to localStorage so starred items survive reloads.
// Exposes `starred` Set, `isStarred(name)`, `toggleStar(name)`,
// `clearStars()`, and `STARS_CHANGED` event for re-render.

(function () {
  const KEY = 'agent-lands.starred.v1';
  let starred = new Set();

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) starred = new Set(JSON.parse(raw));
    } catch (e) {
      console.warn('star: failed to load from localStorage', e);
      starred = new Set();
    }
  }
  function save() {
    try {
      localStorage.setItem(KEY, JSON.stringify([...starred]));
    } catch (e) {
      console.warn('star: failed to save to localStorage', e);
    }
  }

  load();

  function isStarred(name) { return starred.has(name); }
  function getStarred() { return starred; }

  function toggleStar(name) {
    if (!name) return false;
    if (starred.has(name)) starred.delete(name);
    else starred.add(name);
    save();
    document.dispatchEvent(new CustomEvent('stars:changed', { detail: { name, starred: starred.has(name) } }));
    return starred.has(name);
  }

  function clearStars() {
    starred.clear();
    save();
    document.dispatchEvent(new CustomEvent('stars:changed', { detail: { cleared: true } }));
  }

  // expose globally (classic-script, no module system)
  window.StarStore = { isStarred, getStarred, toggleStar, clearStars };
})();