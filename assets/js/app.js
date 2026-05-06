/* ============================================
   App.js — Data Store & CRUD Operations
   Uses localStorage for persistence.
   ============================================ */

const App = (() => {
  /* ---------- storage keys ---------- */
  const KEYS = {
    blogs:    'porto_blogs',
    projects: 'porto_projects',
    auth:     'porto_auth',
    seeded:   'porto_seeded',
  };

  /* ---------- helpers ---------- */
  function _get(key) {
    try { return JSON.parse(localStorage.getItem(key)) || []; }
    catch { return []; }
  }
  function _set(key, data) { localStorage.setItem(key, JSON.stringify(data)); }
  function generateId() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 8); }
  function slugify(text) { return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''); }
  function getParam(name) { return new URLSearchParams(window.location.search).get(name); }
  function formatDate(d) {
    const date = new Date(d);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  }
  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  /* ========== BLOG CRUD ========== */
  const blog = {
    getAll(filter) {
      let items = _get(KEYS.blogs).sort((a, b) => new Date(b.publishDate) - new Date(a.publishDate));
      if (filter && filter.category && filter.category !== 'all') {
        items = items.filter(i => i.category === filter.category);
      }
      if (filter && filter.featured) {
        items = items.filter(i => i.featured);
      }
      return items;
    },
    getById(id) { return _get(KEYS.blogs).find(i => i.id === id) || null; },
    getBySlug(slug) { return _get(KEYS.blogs).find(i => i.slug === slug) || null; },
    create(data) {
      const items = _get(KEYS.blogs);
      const item = {
        id: generateId(),
        title: data.title,
        slug: data.slug || slugify(data.title),
        excerpt: data.excerpt || '',
        content: data.content || '',
        category: data.category || 'tutorial',
        tags: data.tags || [],
        coverGradient: data.coverGradient || 'from-primary-900/40 to-dark-800',
        author: 'Dwi Ratomo',
        publishDate: data.publishDate || new Date().toISOString().split('T')[0],
        readTime: data.readTime || '5 min read',
        featured: data.featured || false,
      };
      items.push(item);
      _set(KEYS.blogs, items);
      return item;
    },
    update(id, data) {
      const items = _get(KEYS.blogs);
      const idx = items.findIndex(i => i.id === id);
      if (idx === -1) return null;
      items[idx] = { ...items[idx], ...data, id };
      if (data.title && !data.slug) items[idx].slug = slugify(data.title);
      _set(KEYS.blogs, items);
      return items[idx];
    },
    delete(id) {
      const items = _get(KEYS.blogs).filter(i => i.id !== id);
      _set(KEYS.blogs, items);
    },
    count() { return _get(KEYS.blogs).length; },
  };

  /* ========== PROJECT CRUD ========== */
  const project = {
    getAll(filter) {
      let items = _get(KEYS.projects);
      if (filter && filter.category && filter.category !== 'all') {
        items = items.filter(i => i.category === filter.category);
      }
      if (filter && filter.featured) {
        items = items.filter(i => i.featured);
      }
      return items;
    },
    getById(id) { return _get(KEYS.projects).find(i => i.id === id) || null; },
    create(data) {
      const items = _get(KEYS.projects);
      const item = {
        id: generateId(),
        title: data.title,
        description: data.description || '',
        techStack: data.techStack || [],
        category: data.category || 'Web App',
        gradient: data.gradient || 'from-primary-900/50 to-dark-800',
        link: data.link || '#',
        featured: data.featured || false,
      };
      items.push(item);
      _set(KEYS.projects, items);
      return item;
    },
    update(id, data) {
      const items = _get(KEYS.projects);
      const idx = items.findIndex(i => i.id === id);
      if (idx === -1) return null;
      items[idx] = { ...items[idx], ...data, id };
      _set(KEYS.projects, items);
      return items[idx];
    },
    delete(id) {
      const items = _get(KEYS.projects).filter(i => i.id !== id);
      _set(KEYS.projects, items);
    },
    count() { return _get(KEYS.projects).length; },
  };

  /* ========== AUTH ========== */
  const DEFAULT_PASS = (typeof APP_CONFIG !== 'undefined' && APP_CONFIG.adminPassword) ? APP_CONFIG.adminPassword : '';
  const auth = {
    login(password) {
      if (password === DEFAULT_PASS) {
        _set(KEYS.auth, { loggedIn: true, time: Date.now() });
        return true;
      }
      return false;
    },
    logout() { localStorage.removeItem(KEYS.auth); },
    isLoggedIn() {
      try {
        const a = JSON.parse(localStorage.getItem(KEYS.auth));
        return a && a.loggedIn === true;
      } catch { return false; }
    },
  };

  /* ========== SEED DATA (loaded lazily) ========== */
  const inAdmin = location.pathname.includes('/admin');
  const basePath = inAdmin ? '../' : '';
  const SEED_DATA_URL = (typeof APP_CONFIG !== 'undefined' && APP_CONFIG.seedDataUrl)
    ? APP_CONFIG.seedDataUrl
    : `${basePath}assets/data/seed.json`;
  let seedPromise = null;

  /* ========== GRADIENT OPTIONS (for admin forms) ========== */
  const GRADIENTS = [
    { value: 'from-primary-900/40 to-dark-800', label: 'Indigo' },
    { value: 'from-green-900/40 to-dark-800',   label: 'Green' },
    { value: 'from-amber-900/40 to-dark-800',   label: 'Amber' },
    { value: 'from-cyan-900/40 to-dark-800',    label: 'Cyan' },
    { value: 'from-rose-900/40 to-dark-800',    label: 'Rose' },
    { value: 'from-violet-900/40 to-dark-800',  label: 'Violet' },
    { value: 'from-teal-900/40 to-dark-800',    label: 'Teal' },
    { value: 'from-sky-900/40 to-dark-800',     label: 'Sky' },
    { value: 'from-purple-900/50 to-dark-800',  label: 'Purple' },
    { value: 'from-indigo-900/40 to-dark-800',  label: 'Deep Indigo' },
  ];

  const BLOG_CATEGORIES = ['tutorial', 'cloud', 'database', 'devops', 'frontend', 'backend'];
  const CATEGORY_COLORS = {
    tutorial: 'primary', cloud: 'green', database: 'amber',
    devops: 'rose', frontend: 'cyan', backend: 'violet',
  };

  /* ========== INIT / SEED ========== */
  function seed() {
    if (localStorage.getItem(KEYS.seeded)) return Promise.resolve();
    if (seedPromise) return seedPromise;

    seedPromise = fetch(SEED_DATA_URL, { cache: 'force-cache' })
      .then((res) => {
        if (!res.ok) throw new Error('Seed data request failed');
        return res.json();
      })
      .then((data) => {
        _set(KEYS.blogs, Array.isArray(data.blogs) ? data.blogs : []);
        _set(KEYS.projects, Array.isArray(data.projects) ? data.projects : []);
        localStorage.setItem(KEYS.seeded, '1');
      })
      .catch((err) => {
        console.warn('Seed data load failed', err);
      })
      .finally(() => {
        seedPromise = null;
      });

    return seedPromise;
  }

  function init() { return seed(); }

  /* ========== PUBLIC API ========== */
  return {
    init, seed, blog, project, auth,
    generateId, slugify, getParam, formatDate, escapeHtml,
    GRADIENTS, BLOG_CATEGORIES, CATEGORY_COLORS,
  };
})();

