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

  /* ========== SEED DATA ========== */
  const SEED_BLOGS = [
    {
      id: 'seed-blog-1',
      title: 'Building Scalable REST APIs with Spring Boot',
      slug: 'building-scalable-rest-apis-spring-boot',
      excerpt: 'A comprehensive guide to designing and implementing production-ready REST APIs using Spring Boot with best practices for scalability and security.',
      content: `<p class="lead">Building a production-ready REST API requires more than just writing endpoints. In this comprehensive guide, we'll walk through the design principles, architecture patterns, and best practices for creating scalable APIs with Spring Boot.</p>
<h2>Why Spring Boot for REST APIs?</h2>
<p>Spring Boot has become the de facto standard for building enterprise-grade Java applications. Its convention-over-configuration approach, combined with the powerful Spring ecosystem, makes it an excellent choice for building REST APIs that need to scale.</p>
<p>Key advantages include auto-configuration, embedded servers, production-ready features out of the box, and a massive community with extensive documentation and libraries.</p>
<h2>Project Setup</h2>
<p>Let's start by setting up our project with Spring Initializr. We'll need the following dependencies:</p>
<pre><code>dependencies {
    implementation 'org.springframework.boot:spring-boot-starter-web'
    implementation 'org.springframework.boot:spring-boot-starter-data-jpa'
    implementation 'org.springframework.boot:spring-boot-starter-validation'
    implementation 'org.springframework.boot:spring-boot-starter-security'
    runtimeOnly 'com.mysql:mysql-connector-j'
}</code></pre>
<h2>Creating the REST Controller</h2>
<p>Our controller should be thin — it handles HTTP request/response mapping and delegates business logic to the service layer:</p>
<pre><code>@RestController
@RequestMapping("/api/v1/projects")
@RequiredArgsConstructor
public class ProjectController {

    private final ProjectService projectService;

    @GetMapping
    public ResponseEntity&lt;Page&lt;ProjectDTO&gt;&gt; getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(
            projectService.findAll(PageRequest.of(page, size))
        );
    }

    @PostMapping
    public ResponseEntity&lt;ProjectDTO&gt; create(
            @Valid @RequestBody CreateProjectRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(projectService.create(request));
    }
}</code></pre>
<h2>Best Practices Summary</h2>
<ul>
<li><strong>Use DTOs</strong> — Never expose your JPA entities directly.</li>
<li><strong>Validate Input</strong> — Always validate incoming data using Bean Validation.</li>
<li><strong>Version Your API</strong> — Include version numbers in your URL path.</li>
<li><strong>Implement Pagination</strong> — Always paginate collection endpoints.</li>
<li><strong>Centralize Error Handling</strong> — Use @ControllerAdvice for consistent error responses.</li>
</ul>
<h2>Conclusion</h2>
<p>Building scalable REST APIs with Spring Boot is all about following proven patterns and best practices. By structuring your code properly, validating inputs, and handling errors consistently, you'll have a solid foundation that can grow with your application.</p>`,
      category: 'tutorial',
      tags: ['Java', 'Spring Boot', 'REST API', 'Backend'],
      coverGradient: 'from-primary-900/40 to-dark-800',
      author: 'Dwi Ratomo',
      publishDate: '2026-03-05',
      readTime: '8 min read',
      featured: true,
    },
    {
      id: 'seed-blog-2',
      title: 'Getting Started with Google Cloud Platform',
      slug: 'getting-started-google-cloud-platform',
      excerpt: 'An introduction to GCP services, setting up your first project, deploying applications, and managing cloud infrastructure effectively.',
      content: `<p class="lead">Google Cloud Platform offers a powerful suite of cloud computing services. This guide will walk you through getting started with GCP and deploying your first application.</p>
<h2>What is Google Cloud Platform?</h2>
<p>GCP is a suite of cloud computing services offered by Google. It provides infrastructure, platform, and software solutions for building, deploying, and scaling applications.</p>
<h2>Core Services</h2>
<ul>
<li><strong>Compute Engine</strong> — Virtual machines on demand</li>
<li><strong>App Engine</strong> — Fully managed application platform</li>
<li><strong>Cloud Run</strong> — Serverless container execution</li>
<li><strong>Cloud Storage</strong> — Object storage for any amount of data</li>
<li><strong>BigQuery</strong> — Serverless data warehouse</li>
</ul>
<h2>Setting Up Your First Project</h2>
<p>Navigate to the Google Cloud Console and create a new project. Set up billing and enable the APIs you need.</p>
<pre><code># Install the gcloud CLI
curl https://sdk.cloud.google.com | bash

# Initialize and authenticate
gcloud init
gcloud auth login

# Create a new project
gcloud projects create my-first-project
gcloud config set project my-first-project</code></pre>
<h2>Deploying to App Engine</h2>
<p>App Engine is the simplest way to deploy web applications on GCP:</p>
<pre><code># Create app.yaml
runtime: java17
instance_class: F1

# Deploy
gcloud app deploy</code></pre>
<h2>Conclusion</h2>
<p>GCP provides a comprehensive set of tools for modern cloud development. Start with the free tier and explore the services that best fit your needs.</p>`,
      category: 'cloud',
      tags: ['GCP', 'Cloud', 'DevOps', 'Infrastructure'],
      coverGradient: 'from-green-900/40 to-dark-800',
      author: 'Dwi Ratomo',
      publishDate: '2026-02-20',
      readTime: '12 min read',
      featured: true,
    },
    {
      id: 'seed-blog-3',
      title: 'Optimizing MySQL Queries for Performance',
      slug: 'optimizing-mysql-queries-performance',
      excerpt: 'Practical techniques for analyzing and optimizing slow MySQL queries, indexing strategies, and query profiling for production databases.',
      content: `<p class="lead">Slow database queries can cripple your application performance. Learn how to identify, analyze, and optimize MySQL queries for production workloads.</p>
<h2>Identifying Slow Queries</h2>
<p>Enable the slow query log to find problematic queries:</p>
<pre><code>SET GLOBAL slow_query_log = 'ON';
SET GLOBAL long_query_time = 1;
SET GLOBAL slow_query_log_file = '/var/log/mysql/slow.log';</code></pre>
<h2>Using EXPLAIN</h2>
<p>The EXPLAIN command reveals how MySQL executes a query:</p>
<pre><code>EXPLAIN SELECT u.name, COUNT(o.id) as order_count
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
WHERE u.status = 'active'
GROUP BY u.id
ORDER BY order_count DESC
LIMIT 10;</code></pre>
<h2>Indexing Strategies</h2>
<ul>
<li><strong>Primary keys</strong> — Always define a primary key</li>
<li><strong>Foreign keys</strong> — Index columns used in JOINs</li>
<li><strong>WHERE clauses</strong> — Index frequently filtered columns</li>
<li><strong>Composite indexes</strong> — Match your query patterns</li>
<li><strong>Covering indexes</strong> — Include all selected columns</li>
</ul>
<pre><code>-- Composite index for common query pattern
CREATE INDEX idx_user_status_date
ON users (status, created_at);

-- Covering index
CREATE INDEX idx_orders_user_total
ON orders (user_id, total, created_at);</code></pre>
<h2>Conclusion</h2>
<p>Query optimization is an ongoing process. Monitor your slow query log, use EXPLAIN regularly, and design your indexes based on real query patterns.</p>`,
      category: 'database',
      tags: ['MySQL', 'Database', 'Performance', 'SQL'],
      coverGradient: 'from-amber-900/40 to-dark-800',
      author: 'Dwi Ratomo',
      publishDate: '2026-02-08',
      readTime: '10 min read',
      featured: true,
    },
    {
      id: 'seed-blog-4',
      title: 'Modern CSS Techniques Every Developer Should Know',
      slug: 'modern-css-techniques',
      excerpt: 'From container queries to cascade layers — the CSS features that are transforming web development.',
      content: `<p class="lead">CSS has evolved dramatically. Modern features like container queries, cascade layers, and subgrid are changing how we build web layouts.</p>
<h2>Container Queries</h2>
<p>Container queries let you style elements based on their container's size, not just the viewport.</p>
<pre><code>.card-container {
  container-type: inline-size;
}

@container (min-width: 400px) {
  .card {
    display: grid;
    grid-template-columns: 1fr 2fr;
  }
}</code></pre>
<h2>Cascade Layers</h2>
<p>Layers give you explicit control over the cascade:</p>
<pre><code>@layer base, components, utilities;

@layer base {
  h1 { font-size: 2rem; }
}

@layer components {
  .btn { padding: 0.5rem 1rem; }
}</code></pre>
<h2>Conclusion</h2>
<p>Embrace these modern CSS features to write cleaner, more maintainable stylesheets.</p>`,
      category: 'frontend',
      tags: ['CSS', 'Frontend', 'Web Design'],
      coverGradient: 'from-cyan-900/40 to-dark-800',
      author: 'Dwi Ratomo',
      publishDate: '2026-01-28',
      readTime: '6 min read',
      featured: false,
    },
    {
      id: 'seed-blog-5',
      title: 'Docker & Kubernetes: A Practical Guide',
      slug: 'docker-kubernetes-practical-guide',
      excerpt: 'Learn containerization fundamentals and orchestration patterns to deploy and manage applications at scale.',
      content: `<p class="lead">Containers have revolutionized how we build and deploy software. This guide covers Docker fundamentals and Kubernetes orchestration.</p>
<h2>Docker Basics</h2>
<pre><code>FROM openjdk:17-slim
WORKDIR /app
COPY target/api.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]</code></pre>
<h2>Kubernetes Deployment</h2>
<pre><code>apiVersion: apps/v1
kind: Deployment
metadata:
  name: api-deployment
spec:
  replicas: 3
  selector:
    matchLabels:
      app: api
  template:
    spec:
      containers:
      - name: api
        image: myapi:latest
        ports:
        - containerPort: 8080</code></pre>
<h2>Conclusion</h2>
<p>Docker and Kubernetes together provide a robust platform for deploying and scaling modern applications.</p>`,
      category: 'devops',
      tags: ['Docker', 'Kubernetes', 'DevOps', 'Cloud'],
      coverGradient: 'from-rose-900/40 to-dark-800',
      author: 'Dwi Ratomo',
      publishDate: '2026-01-15',
      readTime: '15 min read',
      featured: false,
    },
    {
      id: 'seed-blog-6',
      title: 'Authentication Best Practices in Laravel',
      slug: 'authentication-best-practices-laravel',
      excerpt: 'Implementing secure authentication flows with Laravel Sanctum, rate limiting, and role-based authorization.',
      content: `<p class="lead">Security is paramount in any web application. This guide covers implementing robust authentication in Laravel.</p>
<h2>Laravel Sanctum</h2>
<p>Sanctum provides a lightweight authentication system for SPAs and APIs:</p>
<pre><code>// Install Sanctum
composer require laravel/sanctum
php artisan vendor:publish --provider="Laravel\\Sanctum\\SanctumServiceProvider"

// Generate token
$token = $user->createToken('api-token')->plainTextToken;</code></pre>
<h2>Rate Limiting</h2>
<pre><code>// In RouteServiceProvider
RateLimiter::for('api', function (Request $request) {
    return Limit::perMinute(60)->by($request->user()?->id ?: $request->ip());
});</code></pre>
<h2>Conclusion</h2>
<p>Always implement authentication from the start and follow security best practices to protect your users.</p>`,
      category: 'backend',
      tags: ['Laravel', 'PHP', 'Security', 'Authentication'],
      coverGradient: 'from-violet-900/40 to-dark-800',
      author: 'Dwi Ratomo',
      publishDate: '2026-01-03',
      readTime: '9 min read',
      featured: false,
    },
  ];

  const SEED_PROJECTS = [
    {
      id: 'seed-proj-1',
      title: 'E-Commerce Platform',
      description: 'Full-stack e-commerce platform with product management, shopping cart, payment integration, and admin dashboard.',
      techStack: ['Laravel', 'MySQL', 'Tailwind', 'Stripe'],
      category: 'Web App',
      gradient: 'from-primary-900/50 to-dark-800',
      link: '#',
      featured: true,
    },
    {
      id: 'seed-proj-2',
      title: 'Task Management API',
      description: 'RESTful API for project & task management with authentication, role-based access control, and real-time notifications.',
      techStack: ['Spring Boot', 'Java', 'PostgreSQL', 'JWT'],
      category: 'API',
      gradient: 'from-green-900/50 to-dark-800',
      link: '#',
      featured: true,
    },
    {
      id: 'seed-proj-3',
      title: 'Real-Time Chat App',
      description: 'WebSocket-powered chat application with rooms, direct messaging, file sharing, and online status indicators.',
      techStack: ['React', 'Node.js', 'Socket.io', 'MongoDB'],
      category: 'React',
      gradient: 'from-cyan-900/50 to-dark-800',
      link: '#',
      featured: true,
    },
    {
      id: 'seed-proj-4',
      title: 'Cloud Infrastructure Monitor',
      description: 'Dashboard for monitoring cloud resources across GCP and AWS, with cost analysis, alerts, and automated scaling.',
      techStack: ['Python', 'GCP', 'AWS', 'React'],
      category: 'Cloud',
      gradient: 'from-purple-900/50 to-dark-800',
      link: '#',
      featured: true,
    },
    {
      id: 'seed-proj-5',
      title: 'Blog CMS Platform',
      description: 'Content management system with markdown editor, media library, SEO tools, categories, and multi-author support.',
      techStack: ['PHP', 'Laravel', 'Vue.js', 'MySQL'],
      category: 'CMS',
      gradient: 'from-amber-900/50 to-dark-800',
      link: '#',
      featured: true,
    },
    {
      id: 'seed-proj-6',
      title: 'Data Analytics Dashboard',
      description: 'Interactive analytics dashboard with data visualizations, real-time metrics, custom reports, and export functionality.',
      techStack: ['Python', 'React', 'D3.js', 'FastAPI'],
      category: 'Analytics',
      gradient: 'from-rose-900/50 to-dark-800',
      link: '#',
      featured: true,
    },
  ];

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
    if (localStorage.getItem(KEYS.seeded)) return;
    _set(KEYS.blogs, SEED_BLOGS);
    _set(KEYS.projects, SEED_PROJECTS);
    localStorage.setItem(KEYS.seeded, '1');
  }

  function init() { seed(); }

  /* ========== PUBLIC API ========== */
  return {
    init, seed, blog, project, auth,
    generateId, slugify, getParam, formatDate, escapeHtml,
    GRADIENTS, BLOG_CATEGORIES, CATEGORY_COLORS,
  };
})();

// Auto-initialise
App.init();
