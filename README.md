# 🚀 Website Portfolio

A responsive personal portfolio website built with **HTML**, **Tailwind CSS**, and **Vanilla JavaScript** — featuring a full-featured admin panel for managing blog posts and projects. All data is persisted via **localStorage** (no backend required).

---

## ✨ Features

### Public Pages
- **Home** — Hero section, About (terminal-style), Skills with animated progress bars, Projects preview, Blog preview, and Contact form
- **Blog** — Category-filtered blog listing with dynamic rendering
- **Blog Post** — Full article view with tags, author info, share button, and URL-based post loading
- **Projects** — Portfolio showcase with category filtering and tech stack badges

### Admin Panel
- **Dashboard** — Stats overview (total blogs, projects, featured items) and recent posts table
- **Blog Management** — Full CRUD for blog posts with category, featured flag, and excerpt
- **Blog Editor** — Rich HTML editor with toolbar, Write/Preview tabs, tag system, auto-slug, and gradient cover picker
- **Project Management** — Full CRUD for portfolio projects
- **Project Editor** — Form with tech stack tags, live/GitHub links, category, and gradient cover picker
- **Login** — Password-protected access gate with session management

---

## 📁 Project Structure

```
website-porto/
├── index.html              # Landing page (Home)
├── blog.html               # Blog listing page
├── blog-post.html          # Single blog post view
├── projects.html           # Projects showcase page
│
├── admin/
│   ├── login.html          # Admin login page
│   ├── index.html          # Admin dashboard
│   ├── blog.html           # Blog post management
│   ├── blog-edit.html      # Create / edit blog post
│   ├── projects.html       # Project management
│   └── project-edit.html   # Create / edit project
│
└── assets/
    ├── css/
    │   ├── style.css       # Public site styles
    │   └── admin.css       # Admin panel styles
    ├── js/
    │   ├── app.js          # Core data store & localStorage CRUD
    │   ├── admin.js        # Admin panel logic & UI helpers
    │   ├── main.js         # Frontend animations & interactivity
    │   ├── components.js   # Reusable HTML component renderers
    │   └── tailwind-config.js  # Tailwind CSS configuration
    └── img/                # Image assets
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Markup | HTML5 |
| Styling | Tailwind CSS (CDN), Custom CSS |
| Scripting | Vanilla JavaScript (ES6+) |
| Storage | localStorage (JSON) |
| Icons | SVG inline icons |

---

## 🗂️ JavaScript Architecture

| File | Responsibility |
|---|---|
| `app.js` | Data layer — `App.blog.*`, `App.project.*`, `App.auth.*`, seed data, helper utilities |
| `admin.js` | Admin UI — auth guard, toast notifications, confirmation modals, form & list handlers |
| `main.js` | Frontend — navbar scroll, mobile menu, scroll animations, skill bars, contact form |
| `components.js` | Component renderers — `navbar`, `footer`, `blogCard`, `projectCard` |
| `tailwind-config.js` | Tailwind custom theme/palette configuration |

---

## ⚡ Getting Started

Since this project requires no build step or server-side language, you can run it with any static file server.

### Option 1 — Laragon / XAMPP
Place the project folder inside `www/` (Laragon) or `htdocs/` (XAMPP) and open:
```
http://localhost/website-porto/
```

### Option 2 — VS Code Live Server
Install the **Live Server** extension, then right-click `index.html` → **Open with Live Server**.

### Option 3 — Python
```bash
cd website-porto
python -m http.server 8000
# Open http://localhost:8000
```

---

## 🔐 Admin Access

Navigate to `/admin/login.html` dan masukkan password yang kamu set di `assets/js/config.js`.

> **Note:** `config.js` di-gitignore dan tidak ikut ter-commit. Lihat `assets/js/config.example.js` sebagai template.

---

## 📝 Data & Seed Content

On first load, `app.js` auto-populates localStorage with:

**Blog Posts (6):**
- Building REST APIs with Spring Boot
- Getting Started with Google Cloud Platform
- MySQL Query Optimization Techniques
- Modern CSS Techniques with Tailwind
- Docker & Kubernetes for Beginners
- Laravel Authentication System

**Projects (6):**
- E-Commerce Platform (React, Laravel, MySQL)
- Task Management API (Spring Boot, PostgreSQL)
- Real-Time Chat Application (Node.js, Socket.io)
- Cloud Infrastructure Monitor (Python, GCP)
- Blog CMS (Laravel, MySQL)
- Analytics Dashboard (React, D3.js)

---

## 📦 Blog Post Categories

| Key | Label |
|---|---|
| `tutorial` | Tutorial |
| `cloud` | Cloud |
| `database` | Database |
| `devops` | DevOps |
| `frontend` | Frontend |
| `backend` | Backend |

---

## 🎨 Customization

### Personal Info
Edit `index.html` to update your name, bio, skills list, and contact details.

### Profile Data
Modify the seed arrays in `assets/js/app.js` to replace default blog posts and projects with your own.

### Styling
- Update `assets/css/style.css` for the public site
- Update `assets/css/admin.css` for the admin panel
- Modify `assets/js/tailwind-config.js` for custom Tailwind theme colors

---

## 🔒 Security Notes

- Authentication uses localStorage — suitable for personal/demo use only
- Password disimpan di `assets/js/config.js` yang di-gitignore — **tidak pernah ter-commit ke repository**
- Ubah password di `config.js` sebelum deploy
- For production, replace localStorage with a proper backend API and server-side authentication

---

## 📄 License

This project is open-source and free to use for personal portfolio purposes.
