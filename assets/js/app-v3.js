/* ============================================
   App.js — Data Store & CRUD Operations
   Powered by Supabase (PostgreSQL).
   ============================================ */

/* ---- Supabase client init ---- */
const sb = window.supabase.createClient(
  'https://vehcmczhsxoksfchjhxl.supabase.co',
  'sb_publishable_3CRIG_t66a0Txi98VGr93Q_gh3S_62S'
);

const App = (() => {
  /* ---------- helpers ---------- */
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

  /* ---------- DB column mapping ---------- */
  function _blogFromDB(row) {
    return {
      id: row.id, title: row.title, slug: row.slug,
      excerpt: row.excerpt || '', content: row.content || '',
      category: row.category || 'tutorial', tags: row.tags || [],
      coverGradient: row.cover_gradient || 'from-primary-900/40 to-dark-800',
      author: row.author || 'Dwi Ratomo',
      publishDate: row.publish_date || '', readTime: row.read_time || '5 min read',
      featured: row.featured || false,
    };
  }
  function _blogToDB(data) {
    return {
      id: data.id, title: data.title, slug: data.slug,
      excerpt: data.excerpt, content: data.content,
      category: data.category, tags: data.tags,
      cover_gradient: data.coverGradient, author: data.author,
      publish_date: data.publishDate, read_time: data.readTime,
      featured: data.featured,
    };
  }
  function _projectFromDB(row) {
    return {
      id: row.id, title: row.title, description: row.description || '',
      techStack: row.tech_stack || [], category: row.category || 'Web App',
      gradient: row.gradient || 'from-primary-900/50 to-dark-800',
      link: row.link || '#', github: row.github || '',
      featured: row.featured || false,
    };
  }
  function _projectToDB(data) {
    return {
      id: data.id, title: data.title, description: data.description,
      tech_stack: data.techStack, category: data.category,
      gradient: data.gradient, link: data.link, github: data.github,
      featured: data.featured,
    };
  }

  /* ========== BLOG CRUD (async) ========== */
  const blog = {
    async getAll(filter) {
      let query = sb.from('blogs').select('*').order('publish_date', { ascending: false });
      if (filter && filter.category && filter.category !== 'all') {
        query = query.eq('category', filter.category);
      }
      if (filter && filter.featured) {
        query = query.eq('featured', true);
      }
      const { data, error } = await query;
      if (error) { console.warn('Blog fetch failed', error); return []; }
      return (data || []).map(_blogFromDB);
    },
    async getById(id) {
      const { data } = await sb.from('blogs').select('*').eq('id', id).single();
      return data ? _blogFromDB(data) : null;
    },
    async getBySlug(slug) {
      const { data } = await sb.from('blogs').select('*').eq('slug', slug).single();
      return data ? _blogFromDB(data) : null;
    },
    async create(data) {
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
      const { error } = await sb.from('blogs').insert(_blogToDB(item));
      if (error) throw error;
      return item;
    },
    async update(id, data) {
      const existing = await blog.getById(id);
      if (!existing) return null;
      const updated = { ...existing, ...data, id };
      if (data.title && !data.slug) updated.slug = slugify(data.title);
      const { error } = await sb.from('blogs').update(_blogToDB(updated)).eq('id', id);
      if (error) throw error;
      return updated;
    },
    async delete(id) {
      const { error } = await sb.from('blogs').delete().eq('id', id);
      if (error) throw error;
    },
    async count() {
      const { count } = await sb.from('blogs').select('*', { count: 'exact', head: true });
      return count || 0;
    },
  };

  /* ========== PROJECT CRUD (async) ========== */
  const project = {
    async getAll(filter) {
      let query = sb.from('projects').select('*').order('created_at', { ascending: false });
      if (filter && filter.category && filter.category !== 'all') {
        query = query.eq('category', filter.category);
      }
      if (filter && filter.featured) {
        query = query.eq('featured', true);
      }
      const { data, error } = await query;
      if (error) { console.warn('Project fetch failed', error); return []; }
      return (data || []).map(_projectFromDB);
    },
    async getById(id) {
      const { data } = await sb.from('projects').select('*').eq('id', id).single();
      return data ? _projectFromDB(data) : null;
    },
    async create(data) {
      const item = {
        id: generateId(),
        title: data.title,
        description: data.description || '',
        techStack: data.techStack || [],
        category: data.category || 'Web App',
        gradient: data.gradient || 'from-primary-900/50 to-dark-800',
        link: data.link || '#',
        github: data.github || '',
        featured: data.featured || false,
      };
      const { error } = await sb.from('projects').insert(_projectToDB(item));
      if (error) throw error;
      return item;
    },
    async update(id, data) {
      const existing = await project.getById(id);
      if (!existing) return null;
      const updated = { ...existing, ...data, id };
      const { error } = await sb.from('projects').update(_projectToDB(updated)).eq('id', id);
      if (error) throw error;
      return updated;
    },
    async delete(id) {
      const { error } = await sb.from('projects').delete().eq('id', id);
      if (error) throw error;
    },
    async count() {
      const { count } = await sb.from('projects').select('*', { count: 'exact', head: true });
      return count || 0;
    },
  };

  /* ========== AUTH (Supabase) ========== */
  const auth = {
    async login(email, password) {
      const { data, error } = await sb.auth.signInWithPassword({ email, password });
      if (error) { console.warn('Login failed', error.message); return false; }
      return !!data?.session;
    },
    async logout() {
      await sb.auth.signOut();
      localStorage.removeItem('porto_auth');
    },
    async isLoggedIn() {
      const { data } = await sb.auth.getSession();
      return !!data?.session;
    },
  };

  /* ========== GRADIENT OPTIONS ========== */
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

  /* ========== INIT ========== */
  let _ready = null;
  async function init() {
    if (_ready) return _ready;
    _ready = (async () => {
      // Test Supabase connection
      const { error } = await sb.from('blogs').select('id', { count: 'exact', head: true });
      if (error) console.warn('Supabase init check:', error.message);
    })();
    return _ready;
  }

  /* ========== PUBLIC API ========== */
  return {
    init, blog, project, auth,
    generateId, slugify, getParam, formatDate, escapeHtml,
    GRADIENTS, BLOG_CATEGORIES, CATEGORY_COLORS,
  };
})();
