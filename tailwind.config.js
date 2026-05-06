module.exports = {
  darkMode: 'class',
  content: [
    './*.html',
    './admin/*.html',
    './assets/js/**/*.js',
  ],
  safelist: [
    { pattern: /bg-(primary|green|amber|rose|cyan|violet)-500\/20/ },
    { pattern: /text-(primary|green|amber|rose|cyan|violet)-300/ },
    { pattern: /text-(primary|green|amber|rose|cyan|violet)-500\/30/ },
    { pattern: /from-(primary|green|amber|cyan|rose|violet|teal|sky|purple|indigo)-900\/(40|50)/ },
    'to-dark-800',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      colors: {
        primary: {
          50:  '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
        },
        dark: {
          50:  '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },
      },
    },
  },
};
