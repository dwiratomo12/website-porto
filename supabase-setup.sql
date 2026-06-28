-- ============================================
-- Supabase Setup — Portfolio Database
-- Run this in: Supabase Dashboard → SQL Editor
-- ============================================

-- BLOGS TABLE
CREATE TABLE IF NOT EXISTS blogs (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  excerpt TEXT DEFAULT '',
  content TEXT DEFAULT '',
  category TEXT DEFAULT 'tutorial',
  tags TEXT[] DEFAULT '{}',
  cover_gradient TEXT DEFAULT 'from-primary-900/40 to-dark-800',
  author TEXT DEFAULT 'Dwi Ratomo',
  publish_date DATE DEFAULT CURRENT_DATE,
  read_time TEXT DEFAULT '5 min read',
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- PROJECTS TABLE
CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  tech_stack TEXT[] DEFAULT '{}',
  category TEXT DEFAULT 'Web App',
  gradient TEXT DEFAULT 'from-primary-900/50 to-dark-800',
  link TEXT DEFAULT '#',
  github TEXT DEFAULT '',
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- SEED DATA
INSERT INTO blogs (id, title, slug, excerpt, content, category, tags, cover_gradient, author, publish_date, read_time, featured) VALUES
('seed-blog-1', 'Building Scalable REST APIs with Spring Boot', 'building-scalable-rest-apis-spring-boot', 'A comprehensive guide to designing and implementing production-ready REST APIs using Spring Boot with best practices for scalability and security.', '<p class="lead">Building a production-ready REST API requires more than just writing endpoints. In this comprehensive guide, we''ll walk through the design principles, architecture patterns, and best practices for creating scalable APIs with Spring Boot.</p><h2>Why Spring Boot for REST APIs?</h2><p>Spring Boot has become the de facto standard for building enterprise-grade Java applications. Its convention-over-configuration approach makes it an excellent choice.</p><h2>Project Setup</h2><pre><code>dependencies {\n    implementation ''org.springframework.boot:spring-boot-starter-web''\n    implementation ''org.springframework.boot:spring-boot-starter-data-jpa''\n}</code></pre><h2>Best Practices</h2><ul><li><strong>Use DTOs</strong> — Never expose your JPA entities directly.</li><li><strong>Validate Input</strong> — Always validate incoming data.</li><li><strong>Version Your API</strong> — Include version numbers in your URL path.</li></ul><h2>Conclusion</h2><p>Building scalable REST APIs with Spring Boot is all about following proven patterns and best practices.</p>', 'tutorial', ARRAY['Java', 'Spring Boot', 'REST API', 'Backend'], 'from-primary-900/40 to-dark-800', 'Dwi Ratomo', '2026-03-05', '8 min read', true),
('seed-blog-2', 'Getting Started with Google Cloud Platform', 'getting-started-google-cloud-platform', 'An introduction to GCP services, setting up your first project, deploying applications, and managing cloud infrastructure effectively.', '<p class="lead">Google Cloud Platform offers a powerful suite of cloud computing services. This guide will walk you through getting started with GCP.</p><h2>What is Google Cloud Platform?</h2><p>GCP is a suite of cloud computing services offered by Google. It provides infrastructure, platform, and software solutions.</p><h2>Core Services</h2><ul><li><strong>Compute Engine</strong> — Virtual machines on demand</li><li><strong>Cloud Run</strong> — Serverless container execution</li><li><strong>BigQuery</strong> — Serverless data warehouse</li></ul><h2>Setting Up</h2><pre><code>gcloud init\ngcloud auth login\ngcloud projects create my-first-project</code></pre><h2>Conclusion</h2><p>GCP provides a comprehensive set of tools for modern cloud development.</p>', 'cloud', ARRAY['GCP', 'Cloud', 'DevOps', 'Infrastructure'], 'from-green-900/40 to-dark-800', 'Dwi Ratomo', '2026-02-20', '12 min read', true),
('seed-blog-3', 'Optimizing MySQL Queries for Performance', 'optimizing-mysql-queries-performance', 'Practical techniques for analyzing and optimizing slow MySQL queries, indexing strategies, and query profiling for production databases.', '<p class="lead">Slow database queries can cripple your application performance. Learn how to identify, analyze, and optimize MySQL queries.</p><h2>Identifying Slow Queries</h2><pre><code>SET GLOBAL slow_query_log = ''ON'';\nSET GLOBAL long_query_time = 1;</code></pre><h2>Using EXPLAIN</h2><p>The EXPLAIN command reveals how MySQL executes a query.</p><h2>Indexing Strategies</h2><ul><li><strong>Primary keys</strong> — Always define a primary key</li><li><strong>Foreign keys</strong> — Index columns used in JOINs</li><li><strong>Composite indexes</strong> — Match your query patterns</li></ul><h2>Conclusion</h2><p>Query optimization is an ongoing process. Monitor your slow query log and design indexes based on real patterns.</p>', 'database', ARRAY['MySQL', 'Database', 'Performance', 'SQL'], 'from-amber-900/40 to-dark-800', 'Dwi Ratomo', '2026-02-08', '10 min read', true);

INSERT INTO projects (id, title, description, tech_stack, category, gradient, link, featured) VALUES
('seed-proj-1', 'E-Commerce Platform', 'Full-stack e-commerce platform with product management, shopping cart, payment integration, and admin dashboard.', ARRAY['Laravel', 'MySQL', 'Tailwind', 'Stripe'], 'Web App', 'from-primary-900/50 to-dark-800', '#', true),
('seed-proj-2', 'Task Management API', 'RESTful API for project & task management with authentication, role-based access control, and real-time notifications.', ARRAY['Spring Boot', 'Java', 'PostgreSQL', 'JWT'], 'API', 'from-green-900/50 to-dark-800', '#', true),
('seed-proj-3', 'Real-Time Chat App', 'WebSocket-powered chat application with rooms, direct messaging, file sharing, and online status indicators.', ARRAY['React', 'Node.js', 'Socket.io', 'MongoDB'], 'React', 'from-cyan-900/50 to-dark-800', '#', true),
('seed-proj-4', 'Cloud Infrastructure Monitor', 'Dashboard for monitoring cloud resources across GCP and AWS, with cost analysis, alerts, and automated scaling.', ARRAY['Python', 'GCP', 'AWS', 'React'], 'Cloud', 'from-purple-900/50 to-dark-800', '#', true),
('seed-proj-5', 'Blog CMS Platform', 'Content management system with markdown editor, media library, SEO tools, categories, and multi-author support.', ARRAY['PHP', 'Laravel', 'Vue.js', 'MySQL'], 'CMS', 'from-amber-900/50 to-dark-800', '#', true),
('seed-proj-6', 'Data Analytics Dashboard', 'Interactive analytics dashboard with data visualizations, real-time metrics, custom reports, and export functionality.', ARRAY['Python', 'React', 'D3.js', 'FastAPI'], 'Analytics', 'from-rose-900/50 to-dark-800', '#', true);

-- ROW LEVEL SECURITY
ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Public can read
CREATE POLICY "Public read blogs" ON blogs FOR SELECT USING (true);
CREATE POLICY "Public read projects" ON projects FOR SELECT USING (true);

-- Only authenticated can modify
CREATE POLICY "Auth insert blogs" ON blogs FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Auth update blogs" ON blogs FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Auth delete blogs" ON blogs FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Auth insert projects" ON projects FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Auth update projects" ON projects FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Auth delete projects" ON projects FOR DELETE USING (auth.role() = 'authenticated');
