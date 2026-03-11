/* ============================================
   Admin Panel — JavaScript
   ============================================ */
const Admin = (() => {

  /* ---- Toast ---- */
  function toast(message, type = 'success') {
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }
    const icon = type === 'success'
      ? '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>'
      : '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>';
    const el = document.createElement('div');
    el.className = `toast ${type}`;
    el.innerHTML = icon + message;
    container.appendChild(el);
    setTimeout(() => { el.style.opacity = '0'; setTimeout(() => el.remove(), 300); }, 3000);
  }

  /* ---- Confirm Modal ---- */
  function confirm(message) {
    return new Promise(resolve => {
      const overlay = document.createElement('div');
      overlay.className = 'modal-overlay';
      overlay.innerHTML = `
        <div class="modal-box">
          <p class="text-white text-lg font-semibold mb-2">Confirm</p>
          <p class="text-slate-400 text-sm mb-6">${App.escapeHtml(message)}</p>
          <div class="flex gap-3 justify-end">
            <button id="modal-cancel" class="px-4 py-2 rounded-lg text-sm font-medium text-slate-300 hover:bg-slate-800 transition">Cancel</button>
            <button id="modal-ok" class="px-4 py-2 rounded-lg text-sm font-medium bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30 transition">Delete</button>
          </div>
        </div>`;
      document.body.appendChild(overlay);
      overlay.querySelector('#modal-cancel').onclick = () => { overlay.remove(); resolve(false); };
      overlay.querySelector('#modal-ok').onclick = () => { overlay.remove(); resolve(true); };
    });
  }

  /* ---- Auth Guard ---- */
  function guard() {
    if (!App.auth.isLoggedIn()) {
      window.location.href = 'login.html';
      return false;
    }
    return true;
  }

  /* ---- Sidebar ---- */
  function renderSidebar(active) {
    const links = [
      { id: 'dashboard', label: 'Dashboard', href: 'index.html', icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/>' },
      { id: 'blog', label: 'Blog Posts', href: 'blog.html', icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"/>' },
      { id: 'projects', label: 'Projects', href: 'projects.html', icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>' },
    ];
    const html = `
      <div class="p-6 border-b border-slate-800">
        <a href="../index.html" class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">D</div>
          <span class="text-white font-semibold">Admin Panel</span>
        </a>
      </div>
      <nav class="flex-1 py-4 space-y-1">
        ${links.map(l => `<a href="${l.href}" class="sidebar-link${l.id === active ? ' active' : ''}"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">${l.icon}</svg>${l.label}</a>`).join('')}
      </nav>
      <div class="p-4 border-t border-slate-800 space-y-2">
        <a href="../index.html" class="sidebar-link"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>Back to Site</a>
        <button onclick="Admin.logout()" class="sidebar-link w-full text-left"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>Logout</button>
      </div>`;
    document.getElementById('sidebar').innerHTML = html;
  }

  /* ---- Mobile Toggle ---- */
  function initMobileToggle() {
    const btn = document.getElementById('sidebar-toggle');
    const sidebar = document.getElementById('sidebar');
    if (btn && sidebar) {
      btn.addEventListener('click', () => sidebar.classList.toggle('open'));
    }
    // Close sidebar on outside click (mobile)
    document.addEventListener('click', (e) => {
      if (sidebar && sidebar.classList.contains('open') && !sidebar.contains(e.target) && e.target !== btn && !btn?.contains(e.target)) {
        sidebar.classList.remove('open');
      }
    });
  }

  /* ---- Logout ---- */
  function logout() {
    App.auth.logout();
    window.location.href = 'login.html';
  }

  /* ---- Dashboard ---- */
  function initDashboard() {
    if (!guard()) return;
    renderSidebar('dashboard');
    initMobileToggle();
    const blogs = App.blog.getAll();
    const projects = App.project.getAll();
    document.getElementById('stat-blogs').textContent = blogs.length;
    document.getElementById('stat-projects').textContent = projects.length;
    document.getElementById('stat-featured-blogs').textContent = blogs.filter(b => b.featured).length;
    document.getElementById('stat-featured-projects').textContent = projects.filter(p => p.featured).length;

    const recent = blogs.slice(0, 5);
    const tbody = document.getElementById('recent-posts');
    if (tbody) {
      tbody.innerHTML = recent.map(p => `
        <tr>
          <td class="font-medium text-white">${App.escapeHtml(p.title)}</td>
          <td><span class="badge badge-primary">${App.escapeHtml(p.category)}</span></td>
          <td>${App.formatDate(p.publishDate)}</td>
          <td>
            <a href="blog-edit.html?id=${p.id}" class="btn-icon" title="Edit"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg></a>
          </td>
        </tr>`).join('');
    }
  }

  /* ---- Blog List ---- */
  function initBlogList() {
    if (!guard()) return;
    renderSidebar('blog');
    initMobileToggle();
    renderBlogTable();
  }

  function renderBlogTable() {
    const blogs = App.blog.getAll();
    const tbody = document.getElementById('blog-tbody');
    if (!tbody) return;
    if (blogs.length === 0) {
      tbody.innerHTML = '<tr><td colspan="5" class="text-center py-8 text-slate-500">No blog posts yet. Create your first one!</td></tr>';
      return;
    }
    tbody.innerHTML = blogs.map(p => `
      <tr>
        <td>
          <div class="font-medium text-white">${App.escapeHtml(p.title)}</div>
          <div class="text-xs text-slate-500 mt-1">${App.escapeHtml(p.excerpt || '').substring(0, 80)}...</div>
        </td>
        <td><span class="badge badge-primary">${App.escapeHtml(p.category)}</span></td>
        <td>${p.featured ? '<span class="badge badge-green">Yes</span>' : '<span class="text-slate-500">—</span>'}</td>
        <td class="text-slate-400">${App.formatDate(p.publishDate)}</td>
        <td>
          <div class="flex gap-1">
            <a href="blog-edit.html?id=${p.id}" class="btn-icon" title="Edit"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg></a>
            <button onclick="Admin.deleteBlog('${p.id}')" class="btn-icon danger" title="Delete"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg></button>
          </div>
        </td>
      </tr>`).join('');
  }

  async function deleteBlog(id) {
    const ok = await confirm('Are you sure you want to delete this blog post? This action cannot be undone.');
    if (!ok) return;
    App.blog.delete(id);
    toast('Blog post deleted');
    renderBlogTable();
  }

  /* ---- Blog Edit ---- */
  function initBlogEdit() {
    if (!guard()) return;
    renderSidebar('blog');
    initMobileToggle();

    const id = App.getParam('id');
    const isEdit = !!id;
    const form = document.getElementById('blog-form');
    const titleEl = document.getElementById('page-title');
    if (titleEl) titleEl.textContent = isEdit ? 'Edit Blog Post' : 'New Blog Post';

    // Populate category select
    const catSelect = document.getElementById('f-category');
    if (catSelect && catSelect.tagName === 'SELECT') {
      catSelect.innerHTML = App.BLOG_CATEGORIES.map(c =>
        `<option value="${c}">${c.charAt(0).toUpperCase() + c.slice(1)}</option>`
      ).join('');
    }

    // Populate gradients
    const gradientPicker = document.getElementById('gradient-picker');
    if (gradientPicker) {
      gradientPicker.innerHTML = App.GRADIENTS.map((g, i) =>
        `<div class="gradient-option bg-gradient-to-br ${g.value}" data-index="${i}" title="${g.label}"></div>`
      ).join('');
    }

    let selectedGradient = 0;
    let tags = [];

    // If editing, populate form
    if (isEdit) {
      const post = App.blog.getById(id);
      if (!post) { toast('Post not found', 'error'); return; }
      document.getElementById('f-title').value = post.title;
      document.getElementById('f-slug').value = post.slug;
      document.getElementById('f-category').value = post.category;
      document.getElementById('f-excerpt').value = post.excerpt;
      document.getElementById('f-content').value = post.content;
      document.getElementById('f-readtime').value = post.readTime || '';
      document.getElementById('f-featured').checked = post.featured;
      document.getElementById('f-date').value = post.publishDate || '';
      tags = post.tags ? [...post.tags] : [];
      selectedGradient = App.GRADIENTS.findIndex(g => g.value === post.coverGradient);
      if (selectedGradient < 0) selectedGradient = 0;
    } else {
      document.getElementById('f-date').value = new Date().toISOString().split('T')[0];
    }

    renderTags();
    selectGradient(selectedGradient);

    // Auto slug
    document.getElementById('f-title').addEventListener('input', function () {
      if (!isEdit) {
        document.getElementById('f-slug').value = App.slugify(this.value);
      }
    });

    // Tags
    document.getElementById('tag-input').addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ',') {
        e.preventDefault();
        const val = this.value.trim().replace(/,$/,'');
        if (val && !tags.includes(val)) {
          tags.push(val);
          renderTags();
        }
        this.value = '';
      }
    });

    function renderTags() {
      document.getElementById('tag-list').innerHTML = tags.map(t =>
        `<span class="tag-item">${App.escapeHtml(t)} <button type="button" onclick="this.parentElement.remove();Admin._blogRemoveTag('${App.escapeHtml(t)}')">&times;</button></span>`
      ).join('');
    }

    // Gradient picker
    gradientPicker?.addEventListener('click', e => {
      const opt = e.target.closest('.gradient-option');
      if (opt) selectGradient(parseInt(opt.dataset.index));
    });

    function selectGradient(idx) {
      selectedGradient = idx;
      gradientPicker?.querySelectorAll('.gradient-option').forEach((el, i) => {
        el.classList.toggle('selected', i === idx);
      });
    }

    // Editor tabs
    document.querySelectorAll('.editor-tab').forEach(tab => {
      tab.addEventListener('click', function () {
        document.querySelectorAll('.editor-tab').forEach(t => t.classList.remove('active'));
        this.classList.add('active');
        const target = this.dataset.tab;
        document.getElementById('editor-write').classList.toggle('hidden', target !== 'write');
        document.getElementById('editor-preview').classList.toggle('hidden', target !== 'preview');
        if (target === 'preview') {
          document.getElementById('preview-body').innerHTML = document.getElementById('f-content').value;
        }
      });
    });

    // Toolbar — insert buttons
    document.querySelectorAll('.toolbar-btn[data-insert]').forEach(btn => {
      btn.addEventListener('click', () => {
        const textarea = document.getElementById('f-content');
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selected = textarea.value.substring(start, end);
        const template = btn.dataset.insert;
        let insert = template.replace('$SELECTION', selected || 'text');
        textarea.setRangeText(insert, start, end, 'end');
        textarea.focus();
      });
    });

    // Toolbar — wrap buttons
    document.querySelectorAll('.toolbar-btn[data-wrap]').forEach(btn => {
      btn.addEventListener('click', () => {
        const textarea = document.getElementById('f-content');
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selected = textarea.value.substring(start, end) || 'text';
        const [open, close] = btn.dataset.wrap.split(',');
        textarea.setRangeText(open + selected + close, start, end, 'end');
        textarea.focus();
      });
    });

    // Expose tags for remove
    Admin._blogTags = tags;
    Admin._blogRemoveTag = function (tag) {
      const idx = tags.indexOf(tag);
      if (idx >= 0) tags.splice(idx, 1);
    };
    Admin._blogRenderTags = renderTags;

    // Save
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const data = {
        title: document.getElementById('f-title').value.trim(),
        slug: document.getElementById('f-slug').value.trim(),
        category: document.getElementById('f-category').value,
        excerpt: document.getElementById('f-excerpt').value.trim(),
        content: document.getElementById('f-content').value,
        tags: [...tags],
        coverGradient: (App.GRADIENTS[selectedGradient] || App.GRADIENTS[0]).value,
        readTime: document.getElementById('f-readtime').value.trim() || '5 min read',
        featured: document.getElementById('f-featured').checked,
        publishDate: document.getElementById('f-date').value,
      };
      if (!data.title || !data.slug || !data.category) {
        toast('Please fill in all required fields', 'error');
        return;
      }
      if (isEdit) {
        App.blog.update(id, data);
        toast('Blog post updated');
      } else {
        App.blog.create(data);
        toast('Blog post created');
      }
      setTimeout(() => window.location.href = 'blog.html', 800);
    });
  }

  /* ---- Project List ---- */
  function initProjectList() {
    if (!guard()) return;
    renderSidebar('projects');
    initMobileToggle();
    renderProjectTable();
  }

  function renderProjectTable() {
    const projects = App.project.getAll();
    const tbody = document.getElementById('project-tbody');
    if (!tbody) return;
    if (projects.length === 0) {
      tbody.innerHTML = '<tr><td colspan="5" class="text-center py-8 text-slate-500">No projects yet. Add your first one!</td></tr>';
      return;
    }
    tbody.innerHTML = projects.map(p => `
      <tr>
        <td>
          <div class="font-medium text-white">${App.escapeHtml(p.title)}</div>
          <div class="text-xs text-slate-500 mt-1">${App.escapeHtml(p.description || '').substring(0, 80)}...</div>
        </td>
        <td>
          <div class="flex flex-wrap gap-1">${(p.techStack || []).slice(0, 3).map(t => `<span class="badge badge-primary">${App.escapeHtml(t)}</span>`).join('')}</div>
        </td>
        <td>${p.featured ? '<span class="badge badge-green">Yes</span>' : '<span class="text-slate-500">—</span>'}</td>
        <td class="text-slate-400">${App.escapeHtml(p.category || '—')}</td>
        <td>
          <div class="flex gap-1">
            <a href="project-edit.html?id=${p.id}" class="btn-icon" title="Edit"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg></a>
            <button onclick="Admin.deleteProject('${p.id}')" class="btn-icon danger" title="Delete"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg></button>
          </div>
        </td>
      </tr>`).join('');
  }

  async function deleteProject(id) {
    const ok = await confirm('Are you sure you want to delete this project? This action cannot be undone.');
    if (!ok) return;
    App.project.delete(id);
    toast('Project deleted');
    renderProjectTable();
  }

  /* ---- Project Edit ---- */
  function initProjectEdit() {
    if (!guard()) return;
    renderSidebar('projects');
    initMobileToggle();

    const id = App.getParam('id');
    const isEdit = !!id;
    const form = document.getElementById('project-form');
    const titleEl = document.getElementById('page-title');
    if (titleEl) titleEl.textContent = isEdit ? 'Edit Project' : 'New Project';

    // gradients
    const gradientPicker = document.getElementById('gradient-picker');
    if (gradientPicker) {
      gradientPicker.innerHTML = App.GRADIENTS.map((g, i) =>
        `<div class="gradient-option bg-gradient-to-br ${g.value}" data-index="${i}" title="${g.label}"></div>`
      ).join('');
    }

    let selectedGradient = 0;
    let techStack = [];

    if (isEdit) {
      const proj = App.project.getById(id);
      if (!proj) { toast('Project not found', 'error'); return; }
      document.getElementById('f-title').value = proj.title;
      document.getElementById('f-description').value = proj.description;
      document.getElementById('f-category').value = proj.category || '';
      document.getElementById('f-link').value = proj.link || '';
      document.getElementById('f-github').value = proj.github || '';
      document.getElementById('f-featured').checked = proj.featured;
      techStack = proj.techStack ? [...proj.techStack] : [];
      selectedGradient = App.GRADIENTS.findIndex(g => g.value === proj.gradient);
      if (selectedGradient < 0) selectedGradient = 0;
    }

    renderTech();
    selectGradient(selectedGradient);

    // Tech stack input
    document.getElementById('tech-input').addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ',') {
        e.preventDefault();
        const val = this.value.trim().replace(/,$/,'');
        if (val && !techStack.includes(val)) {
          techStack.push(val);
          renderTech();
        }
        this.value = '';
      }
    });

    function renderTech() {
      document.getElementById('tech-list').innerHTML = techStack.map(t =>
        `<span class="tag-item">${App.escapeHtml(t)} <button type="button" onclick="this.parentElement.remove();Admin._projRemoveTech('${App.escapeHtml(t)}')">&times;</button></span>`
      ).join('');
    }

    Admin._projTechStack = techStack;
    Admin._projRemoveTech = function (tech) {
      const idx = techStack.indexOf(tech);
      if (idx >= 0) techStack.splice(idx, 1);
    };

    // gradient
    gradientPicker?.addEventListener('click', e => {
      const opt = e.target.closest('.gradient-option');
      if (opt) selectGradient(parseInt(opt.dataset.index));
    });

    function selectGradient(idx) {
      selectedGradient = idx;
      gradientPicker?.querySelectorAll('.gradient-option').forEach((el, i) => {
        el.classList.toggle('selected', i === idx);
      });
    }

    // Save
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const data = {
        title: document.getElementById('f-title').value.trim(),
        description: document.getElementById('f-description').value.trim(),
        category: document.getElementById('f-category').value.trim(),
        link: document.getElementById('f-link').value.trim(),
        github: document.getElementById('f-github').value.trim(),
        techStack: [...techStack],
        gradient: (App.GRADIENTS[selectedGradient] || App.GRADIENTS[0]).value,
        featured: document.getElementById('f-featured').checked,
      };
      if (!data.title || !data.description) {
        toast('Please fill in title and description', 'error');
        return;
      }
      if (isEdit) {
        App.project.update(id, data);
        toast('Project updated');
      } else {
        App.project.create(data);
        toast('Project created');
      }
      setTimeout(() => window.location.href = 'projects.html', 800);
    });
  }

  /* ---- Login ---- */
  function initLogin() {
    if (App.auth.isLoggedIn()) {
      window.location.href = 'index.html';
      return;
    }
    const form = document.getElementById('login-form');
    const errEl = document.getElementById('login-error');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const pw = document.getElementById('password').value;
      if (App.auth.login(pw)) {
        window.location.href = 'index.html';
      } else {
        errEl.textContent = 'Invalid password. Please try again.';
        errEl.classList.remove('hidden');
      }
    });
  }

  /* ---- Public API ---- */
  return {
    toast,
    confirm,
    guard,
    logout,
    initDashboard,
    initBlogList,
    renderBlogTable,
    deleteBlog,
    initBlogEdit,
    initProjectList,
    renderProjectTable,
    deleteProject,
    initProjectEdit,
    initLogin,
    _blogTags: [],
    _blogRemoveTag: () => {},
    _blogRenderTags: () => {},
    _projTechStack: [],
    _projRemoveTech: () => {},
  };
})();
