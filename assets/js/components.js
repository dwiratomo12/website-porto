/* ============================================
   Components.js — Reusable HTML Renderers
   Keeps navbar, footer, cards DRY.
   ============================================ */

const Components = (() => {
  /* ---- base path detection ---- */
  const inAdmin = location.pathname.includes('/admin');
  const base = inAdmin ? '../' : '';

  /* ==================== NAVBAR ==================== */
  function navbar(activePage) {
    const links = [
      { label: 'Home',     href: base + 'index.html',           id: 'home' },
      { label: 'About',    href: base + 'index.html#about',     id: 'about' },
      { label: 'Skills',   href: base + 'index.html#skills',    id: 'skills' },
      { label: 'Projects', href: base + 'projects.html',        id: 'projects' },
      { label: 'Blog',     href: base + 'blog.html',            id: 'blog' },
      { label: 'Contact',  href: base + 'index.html#contact',   id: 'contact' },
    ];

    const desktopLinks = links.map(l =>
      `<a href="${l.href}" class="nav-link${activePage === l.id ? ' active' : ''}">${l.label}</a>`
    ).join('');

    const mobileLinks = links.map(l =>
      `<a href="${l.href}" class="mobile-nav-link">${l.label}</a>`
    ).join('');

    return `
    <nav id="navbar" class="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16 lg:h-20">
          <a href="${base}index.html" class="flex items-center gap-2 group">
            <div class="w-9 h-9 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-bold text-sm group-hover:scale-110 transition-transform">D</div>
            <span class="text-lg font-bold text-white">Dwi<span class="text-primary-400">Ratomo</span></span>
          </a>
          <div class="hidden md:flex items-center gap-1">${desktopLinks}</div>
          <button id="menu-toggle" class="md:hidden relative w-10 h-10 flex items-center justify-center rounded-lg text-dark-300 hover:text-white hover:bg-dark-800/50 transition-colors" aria-label="Toggle menu">
            <svg id="menu-icon" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
            <svg id="close-icon" class="w-6 h-6 hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>
      </div>
      <div id="mobile-menu" class="md:hidden hidden bg-dark-900/95 backdrop-blur-xl border-t border-dark-800/50">
        <div class="px-4 py-4 space-y-1">${mobileLinks}</div>
      </div>
    </nav>`;
  }

  /* ==================== FOOTER ==================== */
  function footer() {
    return `
    <footer class="py-8 border-t border-dark-800/50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div class="flex items-center gap-2">
            <div class="w-7 h-7 rounded-md bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-bold text-xs">D</div>
            <span class="text-sm text-dark-400">&copy; ${new Date().getFullYear()} Created by <span class="text-white font-medium">Dwiratomo</span>. All rights reserved.</span>
          </div>
          <div class="flex items-center gap-4">
            <a href="https://github.com/dwiratomo12" target="_blank" rel="noopener noreferrer" class="text-dark-500 hover:text-primary-400 transition-colors" aria-label="GitHub">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
            </a>
            <a href="https://linkedin.com/in/dwiratomo" target="_blank" rel="noopener noreferrer" class="text-dark-500 hover:text-primary-400 transition-colors" aria-label="LinkedIn">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
            </a>
            <a href="mailto:contact@dwiratomo.com" class="text-dark-500 hover:text-primary-400 transition-colors" aria-label="Email">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
            </a>
          </div>
        </div>
      </div>
    </footer>`;
  }

  /* ==================== BLOG CARD ==================== */
  function blogCard(post) {
    const cc = App.CATEGORY_COLORS[post.category] || 'primary';
    return `
    <a href="${base}blog-post.html?id=${post.id}" class="blog-card scroll-animate group" data-category="${post.category}">
      <div class="relative overflow-hidden rounded-t-xl">
        <div class="aspect-[16/10] bg-gradient-to-br ${post.coverGradient} flex items-center justify-center">
          <svg class="w-12 h-12 text-${cc}-500/30" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/></svg>
        </div>
        <div class="absolute top-3 left-3 px-2 py-1 bg-${cc}-500/20 backdrop-blur-sm rounded-md text-xs font-medium text-${cc}-300 capitalize">${App.escapeHtml(post.category)}</div>
      </div>
      <div class="p-6">
        <div class="flex items-center gap-3 text-xs text-dark-500 mb-3">
          <span>${App.formatDate(post.publishDate)}</span>
          <span class="w-1 h-1 rounded-full bg-dark-600"></span>
          <span>${App.escapeHtml(post.readTime)}</span>
        </div>
        <h3 class="text-lg font-bold text-white mb-2 group-hover:text-primary-400 transition-colors">${App.escapeHtml(post.title)}</h3>
        <p class="text-dark-400 text-sm leading-relaxed">${App.escapeHtml(post.excerpt)}</p>
      </div>
    </a>`;
  }

  /* ==================== PROJECT CARD ==================== */
  function projectCard(proj) {
    const tags = proj.techStack.map(t => `<span class="tech-tag">${App.escapeHtml(t)}</span>`).join('');
    return `
    <div class="project-card scroll-animate">
      <div class="relative overflow-hidden rounded-t-xl">
        <div class="aspect-video bg-gradient-to-br ${proj.gradient} flex items-center justify-center">
          <svg class="w-16 h-16 text-white/10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/></svg>
        </div>
        <div class="absolute top-3 right-3 px-2 py-1 bg-dark-900/80 backdrop-blur-sm rounded-md text-xs font-mono text-primary-400">${App.escapeHtml(proj.category)}</div>
      </div>
      <div class="p-6">
        <h3 class="text-lg font-bold text-white mb-2">${App.escapeHtml(proj.title)}</h3>
        <p class="text-dark-400 text-sm mb-4 leading-relaxed">${App.escapeHtml(proj.description)}</p>
        <div class="flex flex-wrap gap-2 mb-5">${tags}</div>
        <a href="${proj.link}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-2 text-sm font-medium text-primary-400 hover:text-primary-300 transition-colors group/link">
          View Project <svg class="w-4 h-4 group-hover/link:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
        </a>
      </div>
    </div>`;
  }

  /* ==================== INJECT INTO PAGE ==================== */
  function render(selector, html) {
    const el = document.querySelector(selector);
    if (el) el.innerHTML = html;
  }

  return { navbar, footer, blogCard, projectCard, render };
})();
