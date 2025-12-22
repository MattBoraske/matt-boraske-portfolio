# Professional Portfolio Website Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a minimal, Apple-inspired portfolio website using Astro with dark/light mode, scroll animations, project filtering, and Medium RSS integration.

**Architecture:** Single-page Astro site with component-based sections. Tailwind CSS for styling with CSS custom properties for theming. Client-side JavaScript islands for interactivity (theme toggle, project filtering, contact form). RSS fetched at build time.

**Tech Stack:** Astro 4.x, Tailwind CSS, TypeScript, Formspree (contact form)

---

## Task 1: Project Scaffold

**Files:**
- Create: `package.json`
- Create: `astro.config.mjs`
- Create: `tailwind.config.mjs`
- Create: `tsconfig.json`
- Create: `src/pages/index.astro`
- Create: `src/layouts/Layout.astro`

**Step 1: Initialize Astro project**

```bash
cd /Users/mattboraske/Documents/claude-code-tests/professional-website
npm create astro@latest . -- --template minimal --install --no-git --typescript strict
```

Select defaults when prompted.

**Step 2: Install Tailwind CSS**

```bash
npx astro add tailwind -y
```

**Step 3: Verify dev server starts**

```bash
npm run dev
```

Expected: Server starts at localhost:4321, displays "Astro" page.

**Step 4: Commit**

```bash
git add -A
git commit -m "feat: initialize Astro project with Tailwind CSS"
```

---

## Task 2: Global Styles and Theme Variables

**Files:**
- Create: `src/styles/global.css`
- Modify: `src/layouts/Layout.astro`
- Modify: `tailwind.config.mjs`

**Step 1: Create global CSS with theme variables**

Create `src/styles/global.css`:

```css
@import 'tailwindcss';

:root {
  --color-bg: #ffffff;
  --color-bg-secondary: #f5f5f7;
  --color-text: #1d1d1f;
  --color-text-secondary: #6e6e73;
  --color-accent: #0071e3;
  --color-accent-hover: #0077ed;
  --color-border: #d2d2d7;
  --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --max-width: 1200px;
  --header-height: 64px;
}

[data-theme='dark'] {
  --color-bg: #000000;
  --color-bg-secondary: #1d1d1f;
  --color-text: #f5f5f7;
  --color-text-secondary: #a1a1a6;
  --color-accent: #2997ff;
  --color-accent-hover: #4db3ff;
  --color-border: #424245;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  scroll-behavior: smooth;
}

body {
  font-family: var(--font-sans);
  background-color: var(--color-bg);
  color: var(--color-text);
  line-height: 1.6;
  transition: background-color 0.3s ease, color 0.3s ease;
}

a {
  color: var(--color-accent);
  text-decoration: none;
  transition: color 0.2s ease;
}

a:hover {
  color: var(--color-accent-hover);
}

::selection {
  background-color: var(--color-accent);
  color: white;
}
```

**Step 2: Update Tailwind config for custom theme**

Update `tailwind.config.mjs`:

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        bg: 'var(--color-bg)',
        'bg-secondary': 'var(--color-bg-secondary)',
        text: 'var(--color-text)',
        'text-secondary': 'var(--color-text-secondary)',
        accent: 'var(--color-accent)',
        'accent-hover': 'var(--color-accent-hover)',
        border: 'var(--color-border)',
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      maxWidth: {
        content: 'var(--max-width)',
      },
    },
  },
  plugins: [],
};
```

**Step 3: Update Layout to use global styles**

Update `src/layouts/Layout.astro`:

```astro
---
interface Props {
  title: string;
  description?: string;
}

const { title, description = 'Data Scientist | AI/ML Engineer | Data Engineer' } = Astro.props;
---

<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content={description} />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
    <title>{title}</title>
  </head>
  <body>
    <slot />
  </body>
</html>

<style is:global>
  @import '../styles/global.css';
</style>
```

**Step 4: Verify styles load**

```bash
npm run dev
```

Expected: Page has white background, Inter font loads.

**Step 5: Commit**

```bash
git add -A
git commit -m "feat: add global styles and theme CSS variables"
```

---

## Task 3: Header Component

**Files:**
- Create: `src/components/Header.astro`
- Create: `src/components/ThemeToggle.astro`
- Create: `src/components/icons/` (directory)
- Create: `src/components/icons/GitHub.astro`
- Create: `src/components/icons/LinkedIn.astro`
- Create: `src/components/icons/Medium.astro`
- Create: `src/components/icons/Mail.astro`
- Create: `src/components/icons/Sun.astro`
- Create: `src/components/icons/Moon.astro`
- Modify: `src/pages/index.astro`

**Step 1: Create icon components**

Create `src/components/icons/GitHub.astro`:

```astro
---
interface Props {
  class?: string;
}
const { class: className = 'w-5 h-5' } = Astro.props;
---

<svg class={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
</svg>
```

Create `src/components/icons/LinkedIn.astro`:

```astro
---
interface Props {
  class?: string;
}
const { class: className = 'w-5 h-5' } = Astro.props;
---

<svg class={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
</svg>
```

Create `src/components/icons/Medium.astro`:

```astro
---
interface Props {
  class?: string;
}
const { class: className = 'w-5 h-5' } = Astro.props;
---

<svg class={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
  <path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z"/>
</svg>
```

Create `src/components/icons/Mail.astro`:

```astro
---
interface Props {
  class?: string;
}
const { class: className = 'w-5 h-5' } = Astro.props;
---

<svg class={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg">
  <rect x="2" y="4" width="20" height="16" rx="2"/>
  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
</svg>
```

Create `src/components/icons/Sun.astro`:

```astro
---
interface Props {
  class?: string;
}
const { class: className = 'w-5 h-5' } = Astro.props;
---

<svg class={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg">
  <circle cx="12" cy="12" r="4"/>
  <path d="M12 2v2"/>
  <path d="M12 20v2"/>
  <path d="m4.93 4.93 1.41 1.41"/>
  <path d="m17.66 17.66 1.41 1.41"/>
  <path d="M2 12h2"/>
  <path d="M20 12h2"/>
  <path d="m6.34 17.66-1.41 1.41"/>
  <path d="m19.07 4.93-1.41 1.41"/>
</svg>
```

Create `src/components/icons/Moon.astro`:

```astro
---
interface Props {
  class?: string;
}
const { class: className = 'w-5 h-5' } = Astro.props;
---

<svg class={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg">
  <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>
</svg>
```

**Step 2: Create ThemeToggle component**

Create `src/components/ThemeToggle.astro`:

```astro
---
import Sun from './icons/Sun.astro';
import Moon from './icons/Moon.astro';
---

<button
  id="theme-toggle"
  aria-label="Toggle dark mode"
  class="p-2 rounded-full hover:bg-bg-secondary transition-colors duration-200"
>
  <Sun class="w-5 h-5 hidden dark:block" />
  <Moon class="w-5 h-5 block dark:hidden" />
</button>

<script>
  const toggle = document.getElementById('theme-toggle');
  const html = document.documentElement;

  // Check for saved preference or system preference
  const getThemePreference = () => {
    if (typeof localStorage !== 'undefined' && localStorage.getItem('theme')) {
      return localStorage.getItem('theme');
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  };

  const setTheme = (theme: string) => {
    if (theme === 'dark') {
      html.setAttribute('data-theme', 'dark');
      html.classList.add('dark');
    } else {
      html.removeAttribute('data-theme');
      html.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  };

  // Set initial theme
  setTheme(getThemePreference() || 'light');

  // Toggle theme on click
  toggle?.addEventListener('click', () => {
    const currentTheme = html.getAttribute('data-theme');
    setTheme(currentTheme === 'dark' ? 'light' : 'dark');
  });
</script>
```

**Step 3: Create Header component**

Create `src/components/Header.astro`:

```astro
---
import ThemeToggle from './ThemeToggle.astro';
import GitHub from './icons/GitHub.astro';
import LinkedIn from './icons/LinkedIn.astro';
import Medium from './icons/Medium.astro';
import Mail from './icons/Mail.astro';

interface Props {
  name?: string;
}

const { name = 'Matt Boraske' } = Astro.props;

const navLinks = [
  { href: '#about', label: 'About' },
  { href: '#experience', label: 'Experience' },
  { href: '#research', label: 'Research' },
  { href: '#projects', label: 'Projects' },
  { href: '#writing', label: 'Writing' },
  { href: '#contact', label: 'Contact' },
];

const socialLinks = [
  { href: 'https://github.com/', icon: GitHub, label: 'GitHub' },
  { href: 'https://linkedin.com/in/', icon: LinkedIn, label: 'LinkedIn' },
  { href: 'https://medium.com/@', icon: Medium, label: 'Medium' },
  { href: 'mailto:email@example.com', icon: Mail, label: 'Email' },
];
---

<header id="header" class="fixed top-0 left-0 right-0 z-50 bg-bg/80 backdrop-blur-lg border-b border-border/50">
  <nav class="max-w-content mx-auto px-6 h-16 flex items-center justify-between">
    <!-- Logo/Name -->
    <a href="#" class="text-lg font-semibold text-text hover:text-accent transition-colors">
      {name}
    </a>

    <!-- Desktop Navigation -->
    <div class="hidden md:flex items-center gap-8">
      {navLinks.map(({ href, label }) => (
        <a
          href={href}
          class="text-sm text-text-secondary hover:text-text transition-colors"
        >
          {label}
        </a>
      ))}
    </div>

    <!-- Social Icons & Theme Toggle -->
    <div class="flex items-center gap-4">
      <div class="hidden sm:flex items-center gap-3">
        {socialLinks.map(({ href, icon: Icon, label }) => (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            class="text-text-secondary hover:text-text transition-colors"
          >
            <Icon class="w-5 h-5" />
          </a>
        ))}
      </div>
      <ThemeToggle />

      <!-- Mobile Menu Button -->
      <button
        id="mobile-menu-btn"
        class="md:hidden p-2 text-text-secondary hover:text-text"
        aria-label="Toggle menu"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
        </svg>
      </button>
    </div>
  </nav>

  <!-- Mobile Menu -->
  <div id="mobile-menu" class="hidden md:hidden bg-bg border-b border-border">
    <div class="px-6 py-4 space-y-4">
      {navLinks.map(({ href, label }) => (
        <a
          href={href}
          class="block text-text-secondary hover:text-text transition-colors"
        >
          {label}
        </a>
      ))}
      <div class="flex items-center gap-4 pt-4 border-t border-border">
        {socialLinks.map(({ href, icon: Icon, label }) => (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            class="text-text-secondary hover:text-text transition-colors"
          >
            <Icon class="w-5 h-5" />
          </a>
        ))}
      </div>
    </div>
  </div>
</header>

<script>
  const menuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');

  menuBtn?.addEventListener('click', () => {
    mobileMenu?.classList.toggle('hidden');
  });

  // Close mobile menu when clicking a link
  mobileMenu?.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu?.classList.add('hidden');
    });
  });
</script>
```

**Step 4: Update index.astro to use Header**

Update `src/pages/index.astro`:

```astro
---
import Layout from '../layouts/Layout.astro';
import Header from '../components/Header.astro';
---

<Layout title="Matt Boraske | Data Scientist">
  <Header />
  <main class="pt-16">
    <section class="min-h-screen flex items-center justify-center">
      <h1 class="text-4xl font-bold">Coming Soon</h1>
    </section>
  </main>
</Layout>
```

**Step 5: Verify header displays correctly**

```bash
npm run dev
```

Expected: Header with navigation, social icons, and theme toggle. Dark mode toggle works.

**Step 6: Commit**

```bash
git add -A
git commit -m "feat: add Header component with navigation and theme toggle"
```

---

## Task 4: Hero Section

**Files:**
- Create: `src/components/Hero.astro`
- Create: `src/components/icons/ArrowDown.astro`
- Modify: `src/pages/index.astro`

**Step 1: Create ArrowDown icon**

Create `src/components/icons/ArrowDown.astro`:

```astro
---
interface Props {
  class?: string;
}
const { class: className = 'w-5 h-5' } = Astro.props;
---

<svg class={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg">
  <path d="M12 5v14"/>
  <path d="m19 12-7 7-7-7"/>
</svg>
```

**Step 2: Create Hero component**

Create `src/components/Hero.astro`:

```astro
---
import ArrowDown from './icons/ArrowDown.astro';

interface Props {
  name?: string;
  title?: string;
  tagline?: string;
}

const {
  name = 'Matt Boraske',
  title = 'Data Scientist | AI/ML Engineer | Data Engineer',
  tagline = 'Building intelligent systems at the intersection of healthcare and machine learning',
} = Astro.props;
---

<section id="hero" class="min-h-screen flex flex-col items-center justify-center px-6 text-center">
  <div class="max-w-3xl mx-auto space-y-6">
    <h1 class="text-5xl md:text-7xl font-bold text-text tracking-tight">
      {name}
    </h1>
    <p class="text-xl md:text-2xl text-text-secondary font-medium">
      {title}
    </p>
    <p class="text-lg text-text-secondary max-w-2xl mx-auto">
      {tagline}
    </p>
    <div class="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
      <a
        href="#projects"
        class="px-8 py-3 bg-accent text-white font-medium rounded-full hover:bg-accent-hover transition-colors"
      >
        View My Work
      </a>
      <a
        href="#contact"
        class="px-8 py-3 border border-border text-text font-medium rounded-full hover:bg-bg-secondary transition-colors"
      >
        Get in Touch
      </a>
    </div>
  </div>

  <!-- Scroll indicator -->
  <a
    href="#about"
    class="absolute bottom-8 left-1/2 -translate-x-1/2 text-text-secondary hover:text-text transition-colors animate-bounce"
    aria-label="Scroll down"
  >
    <ArrowDown class="w-6 h-6" />
  </a>
</section>
```

**Step 3: Update index.astro**

Update `src/pages/index.astro`:

```astro
---
import Layout from '../layouts/Layout.astro';
import Header from '../components/Header.astro';
import Hero from '../components/Hero.astro';
---

<Layout title="Matt Boraske | Data Scientist">
  <Header />
  <main>
    <Hero />
  </main>
</Layout>
```

**Step 4: Verify Hero displays**

```bash
npm run dev
```

Expected: Full-screen hero with name, title, tagline, and CTA buttons.

**Step 5: Commit**

```bash
git add -A
git commit -m "feat: add Hero section with CTA buttons"
```

---

## Task 5: Current Role Spotlight Section

**Files:**
- Create: `src/components/RoleSpotlight.astro`
- Create: `src/components/HighlightCard.astro`
- Modify: `src/pages/index.astro`

**Step 1: Create HighlightCard component**

Create `src/components/HighlightCard.astro`:

```astro
---
interface Props {
  title: string;
  icon?: string;
}

const { title, icon = '🔹' } = Astro.props;
---

<div class="px-6 py-4 bg-bg-secondary rounded-xl border border-border hover:border-accent/50 transition-colors">
  <span class="text-2xl mr-3">{icon}</span>
  <span class="text-text font-medium">{title}</span>
</div>
```

**Step 2: Create RoleSpotlight component**

Create `src/components/RoleSpotlight.astro`:

```astro
---
import HighlightCard from './HighlightCard.astro';

interface Props {
  company?: string;
  role?: string;
  description?: string[];
  highlights?: { title: string; icon: string }[];
}

const {
  company = 'CSL Behring',
  role = 'Data Scientist',
  description = [
    'At CSL Behring, I develop machine learning solutions that drive decision-making in pharmaceutical manufacturing and supply chain optimization. My work spans the full ML lifecycle—from exploratory analysis and model development to production deployment.',
    'I collaborate with cross-functional teams to translate complex business problems into data-driven solutions, leveraging advanced analytics and ML techniques to improve operational efficiency and product quality.',
    'My focus areas include predictive modeling, time series forecasting, and building scalable data pipelines that enable real-time insights across the organization.',
  ],
  highlights = [
    { title: 'Machine Learning Pipelines', icon: '🤖' },
    { title: 'Production ML Systems', icon: '⚙️' },
    { title: 'Healthcare Analytics', icon: '🏥' },
    { title: 'Data Engineering', icon: '🔧' },
  ],
} = Astro.props;
---

<section id="about" class="py-24 px-6">
  <div class="max-w-content mx-auto">
    <h2 class="text-3xl md:text-4xl font-bold text-text mb-4">What I Do</h2>

    <div class="flex items-center gap-3 mb-8">
      <span class="text-text-secondary">{role} at</span>
      <span class="px-3 py-1 bg-bg-secondary rounded-full text-sm font-medium text-text">
        {company}
      </span>
    </div>

    <div class="max-w-3xl space-y-4 mb-12">
      {description.map((paragraph) => (
        <p class="text-text-secondary leading-relaxed">
          {paragraph}
        </p>
      ))}
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {highlights.map(({ title, icon }) => (
        <HighlightCard title={title} icon={icon} />
      ))}
    </div>
  </div>
</section>
```

**Step 3: Update index.astro**

Update `src/pages/index.astro`:

```astro
---
import Layout from '../layouts/Layout.astro';
import Header from '../components/Header.astro';
import Hero from '../components/Hero.astro';
import RoleSpotlight from '../components/RoleSpotlight.astro';
---

<Layout title="Matt Boraske | Data Scientist">
  <Header />
  <main>
    <Hero />
    <RoleSpotlight />
  </main>
</Layout>
```

**Step 4: Verify section displays**

```bash
npm run dev
```

Expected: "What I Do" section with role description and highlight cards.

**Step 5: Commit**

```bash
git add -A
git commit -m "feat: add Current Role Spotlight section"
```

---

## Task 6: Work Experience Timeline

**Files:**
- Create: `src/components/Timeline.astro`
- Create: `src/components/TimelineItem.astro`
- Modify: `src/pages/index.astro`

**Step 1: Create TimelineItem component**

Create `src/components/TimelineItem.astro`:

```astro
---
interface Props {
  company: string;
  role: string;
  dateRange: string;
  description: string;
  technologies?: string[];
  isCurrent?: boolean;
}

const { company, role, dateRange, description, technologies = [], isCurrent = false } = Astro.props;
---

<div class="relative pl-8 pb-12 last:pb-0">
  <!-- Timeline line -->
  <div class="absolute left-0 top-2 bottom-0 w-px bg-border"></div>

  <!-- Timeline dot -->
  <div class={`absolute left-0 top-2 w-2 h-2 -translate-x-1/2 rounded-full ${isCurrent ? 'bg-accent' : 'bg-text-secondary'}`}></div>

  <div class="space-y-2">
    <div class="flex flex-wrap items-center gap-2">
      <span class="text-sm text-text-secondary">{dateRange}</span>
      {isCurrent && (
        <span class="px-2 py-0.5 bg-accent/10 text-accent text-xs font-medium rounded-full">
          Current
        </span>
      )}
    </div>

    <h3 class="text-xl font-semibold text-text">{role}</h3>
    <p class="text-text-secondary font-medium">{company}</p>

    <p class="text-text-secondary leading-relaxed pt-2">
      {description}
    </p>

    {technologies.length > 0 && (
      <div class="flex flex-wrap gap-2 pt-3">
        {technologies.map((tech) => (
          <span class="px-3 py-1 bg-bg-secondary text-text-secondary text-sm rounded-full">
            {tech}
          </span>
        ))}
      </div>
    )}
  </div>
</div>
```

**Step 2: Create Timeline component**

Create `src/components/Timeline.astro`:

```astro
---
import TimelineItem from './TimelineItem.astro';

interface Experience {
  company: string;
  role: string;
  dateRange: string;
  description: string;
  technologies?: string[];
  isCurrent?: boolean;
}

interface Props {
  experiences?: Experience[];
}

const { experiences = [
  {
    company: 'CSL Behring',
    role: 'Data Scientist',
    dateRange: '2023 - Present',
    description: 'Developing machine learning solutions for pharmaceutical manufacturing and supply chain optimization. Building production ML systems and data pipelines.',
    technologies: ['Python', 'PyTorch', 'Spark', 'AWS', 'Airflow'],
    isCurrent: true,
  },
  {
    company: 'Previous Company',
    role: 'Data Engineer',
    dateRange: '2021 - 2023',
    description: 'Built and maintained data infrastructure supporting analytics and machine learning workloads. Designed ETL pipelines processing millions of records daily.',
    technologies: ['Python', 'SQL', 'dbt', 'Snowflake', 'Docker'],
  },
  {
    company: 'University Research Lab',
    role: 'Research Assistant',
    dateRange: '2019 - 2021',
    description: 'Conducted research in machine learning and data science. Published papers on novel approaches to predictive modeling.',
    technologies: ['Python', 'TensorFlow', 'R', 'MATLAB'],
  },
]} = Astro.props;
---

<section id="experience" class="py-24 px-6 bg-bg-secondary">
  <div class="max-w-content mx-auto">
    <h2 class="text-3xl md:text-4xl font-bold text-text mb-12">Experience</h2>

    <div class="max-w-2xl">
      {experiences.map((exp) => (
        <TimelineItem {...exp} />
      ))}
    </div>
  </div>
</section>
```

**Step 3: Update index.astro**

Update `src/pages/index.astro`:

```astro
---
import Layout from '../layouts/Layout.astro';
import Header from '../components/Header.astro';
import Hero from '../components/Hero.astro';
import RoleSpotlight from '../components/RoleSpotlight.astro';
import Timeline from '../components/Timeline.astro';
---

<Layout title="Matt Boraske | Data Scientist">
  <Header />
  <main>
    <Hero />
    <RoleSpotlight />
    <Timeline />
  </main>
</Layout>
```

**Step 4: Verify timeline displays**

```bash
npm run dev
```

Expected: Timeline section with vertical line, dots, and experience cards.

**Step 5: Commit**

```bash
git add -A
git commit -m "feat: add Work Experience Timeline section"
```

---

## Task 7: Research & Publications Section

**Files:**
- Create: `src/components/Research.astro`
- Create: `src/components/PublicationCard.astro`
- Create: `src/components/icons/ExternalLink.astro`
- Modify: `src/pages/index.astro`

**Step 1: Create ExternalLink icon**

Create `src/components/icons/ExternalLink.astro`:

```astro
---
interface Props {
  class?: string;
}
const { class: className = 'w-4 h-4' } = Astro.props;
---

<svg class={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg">
  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
  <polyline points="15 3 21 3 21 9"/>
  <line x1="10" y1="14" x2="21" y2="3"/>
</svg>
```

**Step 2: Create PublicationCard component**

Create `src/components/PublicationCard.astro`:

```astro
---
import ExternalLink from './icons/ExternalLink.astro';

interface Props {
  title: string;
  venue: string;
  year: string;
  summary: string;
  authors?: string;
  tags?: string[];
  url?: string;
}

const { title, venue, year, summary, authors, tags = [], url } = Astro.props;
---

<article class="p-6 bg-bg rounded-2xl border border-border hover:border-accent/50 hover:shadow-lg transition-all duration-300">
  <div class="flex items-start justify-between gap-4 mb-3">
    <h3 class="text-xl font-semibold text-text leading-tight">
      {url ? (
        <a href={url} target="_blank" rel="noopener noreferrer" class="hover:text-accent transition-colors">
          {title}
          <ExternalLink class="inline-block ml-2 w-4 h-4" />
        </a>
      ) : (
        title
      )}
    </h3>
    <span class="text-sm text-text-secondary whitespace-nowrap">{year}</span>
  </div>

  <p class="text-sm text-accent font-medium mb-3">{venue}</p>

  {authors && (
    <p class="text-sm text-text-secondary mb-3">{authors}</p>
  )}

  <p class="text-text-secondary leading-relaxed mb-4">
    {summary}
  </p>

  {tags.length > 0 && (
    <div class="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <span class="px-3 py-1 bg-bg-secondary text-text-secondary text-sm rounded-full">
          {tag}
        </span>
      ))}
    </div>
  )}
</article>
```

**Step 3: Create Research component**

Create `src/components/Research.astro`:

```astro
---
import PublicationCard from './PublicationCard.astro';

interface Publication {
  title: string;
  venue: string;
  year: string;
  summary: string;
  authors?: string;
  tags?: string[];
  url?: string;
}

interface Props {
  publications?: Publication[];
}

const { publications = [
  {
    title: 'Publication Title One',
    venue: 'Conference/Journal Name',
    year: '2021',
    summary: 'A brief summary of the research paper describing the problem addressed, methodology used, and key findings or contributions to the field.',
    authors: 'Boraske, M., Coauthor, A., Coauthor, B.',
    tags: ['Machine Learning', 'NLP', 'Deep Learning'],
    url: '#',
  },
  {
    title: 'Publication Title Two',
    venue: 'Conference/Journal Name',
    year: '2020',
    summary: 'Another brief summary describing the research contributions, novel approaches, and impact of this work on the field.',
    authors: 'Boraske, M., Advisor, X.',
    tags: ['Data Science', 'Computer Vision'],
    url: '#',
  },
]} = Astro.props;
---

<section id="research" class="py-24 px-6">
  <div class="max-w-content mx-auto">
    <h2 class="text-3xl md:text-4xl font-bold text-text mb-12">Research</h2>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      {publications.map((pub) => (
        <PublicationCard {...pub} />
      ))}
    </div>
  </div>
</section>
```

**Step 4: Update index.astro**

Update `src/pages/index.astro`:

```astro
---
import Layout from '../layouts/Layout.astro';
import Header from '../components/Header.astro';
import Hero from '../components/Hero.astro';
import RoleSpotlight from '../components/RoleSpotlight.astro';
import Timeline from '../components/Timeline.astro';
import Research from '../components/Research.astro';
---

<Layout title="Matt Boraske | Data Scientist">
  <Header />
  <main>
    <Hero />
    <RoleSpotlight />
    <Timeline />
    <Research />
  </main>
</Layout>
```

**Step 5: Verify research section displays**

```bash
npm run dev
```

Expected: Two publication cards side by side with hover effects.

**Step 6: Commit**

```bash
git add -A
git commit -m "feat: add Research & Publications section"
```

---

## Task 8: Projects Section with Filtering

**Files:**
- Create: `src/components/Projects.astro`
- Create: `src/components/ProjectCard.astro`
- Create: `src/components/ProjectFilter.astro`
- Modify: `src/pages/index.astro`

**Step 1: Create ProjectCard component**

Create `src/components/ProjectCard.astro`:

```astro
---
import GitHub from './icons/GitHub.astro';
import ExternalLink from './icons/ExternalLink.astro';

interface Props {
  title: string;
  description: string;
  image?: string;
  technologies: string[];
  category: string;
  githubUrl?: string;
  demoUrl?: string;
  featured?: boolean;
}

const { title, description, image, technologies, category, githubUrl, demoUrl, featured = false } = Astro.props;
---

<article
  class="project-card group bg-bg rounded-2xl border border-border overflow-hidden hover:border-accent/50 hover:shadow-lg transition-all duration-300"
  data-category={category}
>
  {image && (
    <div class="aspect-video bg-bg-secondary overflow-hidden">
      <img
        src={image}
        alt={title}
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
      />
    </div>
  )}

  {!image && (
    <div class="aspect-video bg-bg-secondary flex items-center justify-center">
      <span class="text-4xl">🚀</span>
    </div>
  )}

  <div class="p-6">
    <div class="flex items-start justify-between gap-4 mb-2">
      <h3 class="text-xl font-semibold text-text">{title}</h3>
      {featured && (
        <span class="px-2 py-0.5 bg-accent/10 text-accent text-xs font-medium rounded-full whitespace-nowrap">
          Featured
        </span>
      )}
    </div>

    <p class="text-text-secondary mb-4 line-clamp-2">
      {description}
    </p>

    <div class="flex flex-wrap gap-2 mb-4">
      {technologies.map((tech) => (
        <span class="px-2 py-1 bg-bg-secondary text-text-secondary text-xs rounded-full">
          {tech}
        </span>
      ))}
    </div>

    <div class="flex items-center gap-4">
      {githubUrl && (
        <a
          href={githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          class="flex items-center gap-2 text-sm text-text-secondary hover:text-text transition-colors"
        >
          <GitHub class="w-4 h-4" />
          Code
        </a>
      )}
      {demoUrl && (
        <a
          href={demoUrl}
          target="_blank"
          rel="noopener noreferrer"
          class="flex items-center gap-2 text-sm text-text-secondary hover:text-text transition-colors"
        >
          <ExternalLink class="w-4 h-4" />
          Demo
        </a>
      )}
    </div>
  </div>
</article>
```

**Step 2: Create ProjectFilter component**

Create `src/components/ProjectFilter.astro`:

```astro
---
interface Props {
  categories?: string[];
}

const { categories = ['All', 'ML/AI', 'Data Engineering', 'Web', 'Other'] } = Astro.props;
---

<div class="flex flex-wrap gap-2 mb-8" id="project-filters">
  {categories.map((category, index) => (
    <button
      class={`filter-btn px-4 py-2 rounded-full text-sm font-medium transition-colors ${
        index === 0
          ? 'bg-accent text-white'
          : 'bg-bg-secondary text-text-secondary hover:text-text'
      }`}
      data-filter={category === 'All' ? 'all' : category}
    >
      {category}
    </button>
  ))}
</div>

<script>
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter');

      // Update button styles
      filterBtns.forEach((b) => {
        b.classList.remove('bg-accent', 'text-white');
        b.classList.add('bg-bg-secondary', 'text-text-secondary');
      });
      btn.classList.remove('bg-bg-secondary', 'text-text-secondary');
      btn.classList.add('bg-accent', 'text-white');

      // Filter projects
      projectCards.forEach((card) => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          (card as HTMLElement).style.display = 'block';
          (card as HTMLElement).style.animation = 'fadeIn 0.3s ease';
        } else {
          (card as HTMLElement).style.display = 'none';
        }
      });
    });
  });
</script>

<style>
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
</style>
```

**Step 3: Create Projects component**

Create `src/components/Projects.astro`:

```astro
---
import ProjectCard from './ProjectCard.astro';
import ProjectFilter from './ProjectFilter.astro';

interface Project {
  title: string;
  description: string;
  image?: string;
  technologies: string[];
  category: string;
  githubUrl?: string;
  demoUrl?: string;
  featured?: boolean;
}

interface Props {
  projects?: Project[];
}

const { projects = [
  {
    title: 'ML Pipeline Framework',
    description: 'An end-to-end machine learning pipeline framework for automated model training, evaluation, and deployment.',
    technologies: ['Python', 'PyTorch', 'MLflow', 'Docker'],
    category: 'ML/AI',
    githubUrl: '#',
    demoUrl: '#',
    featured: true,
  },
  {
    title: 'Data Lake Architecture',
    description: 'Scalable data lake implementation with real-time ingestion and processing capabilities.',
    technologies: ['Spark', 'Delta Lake', 'Airflow', 'AWS'],
    category: 'Data Engineering',
    githubUrl: '#',
  },
  {
    title: 'NLP Text Classifier',
    description: 'Deep learning model for multi-label text classification with attention mechanisms.',
    technologies: ['Python', 'Transformers', 'FastAPI'],
    category: 'ML/AI',
    githubUrl: '#',
    demoUrl: '#',
  },
  {
    title: 'Analytics Dashboard',
    description: 'Interactive data visualization dashboard for business intelligence and reporting.',
    technologies: ['React', 'D3.js', 'Node.js'],
    category: 'Web',
    githubUrl: '#',
    demoUrl: '#',
  },
  {
    title: 'ETL Orchestration Tool',
    description: 'Custom ETL orchestration tool for managing complex data transformation workflows.',
    technologies: ['Python', 'PostgreSQL', 'Redis'],
    category: 'Data Engineering',
    githubUrl: '#',
  },
]} = Astro.props;
---

<section id="projects" class="py-24 px-6 bg-bg-secondary">
  <div class="max-w-content mx-auto">
    <h2 class="text-3xl md:text-4xl font-bold text-text mb-8">Projects</h2>

    <ProjectFilter />

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project) => (
        <ProjectCard {...project} />
      ))}
    </div>
  </div>
</section>
```

**Step 4: Update index.astro**

Update `src/pages/index.astro`:

```astro
---
import Layout from '../layouts/Layout.astro';
import Header from '../components/Header.astro';
import Hero from '../components/Hero.astro';
import RoleSpotlight from '../components/RoleSpotlight.astro';
import Timeline from '../components/Timeline.astro';
import Research from '../components/Research.astro';
import Projects from '../components/Projects.astro';
---

<Layout title="Matt Boraske | Data Scientist">
  <Header />
  <main>
    <Hero />
    <RoleSpotlight />
    <Timeline />
    <Research />
    <Projects />
  </main>
</Layout>
```

**Step 5: Verify projects section with filtering**

```bash
npm run dev
```

Expected: Project grid with filter buttons. Clicking filters shows/hides cards.

**Step 6: Commit**

```bash
git add -A
git commit -m "feat: add Projects section with category filtering"
```

---

## Task 9: Writing Section with Medium RSS

**Files:**
- Create: `src/components/Writing.astro`
- Create: `src/components/ArticleCard.astro`
- Create: `src/lib/rss.ts`
- Modify: `src/pages/index.astro`

**Step 1: Create RSS parser utility**

Create `src/lib/rss.ts`:

```typescript
export interface Article {
  title: string;
  link: string;
  pubDate: string;
  description: string;
}

export async function fetchMediumArticles(username: string, limit: number = 4): Promise<Article[]> {
  try {
    // Medium RSS feed URL
    const feedUrl = `https://medium.com/feed/@${username}`;

    // Use a CORS proxy for client-side fetching, or fetch directly at build time
    const response = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feedUrl)}`);

    if (!response.ok) {
      throw new Error('Failed to fetch RSS feed');
    }

    const data = await response.json();

    if (data.status !== 'ok') {
      throw new Error('Invalid RSS feed response');
    }

    return data.items.slice(0, limit).map((item: any) => ({
      title: item.title,
      link: item.link,
      pubDate: new Date(item.pubDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      description: item.description
        .replace(/<[^>]*>/g, '') // Strip HTML tags
        .substring(0, 150) + '...',
    }));
  } catch (error) {
    console.error('Error fetching Medium articles:', error);
    return [];
  }
}
```

**Step 2: Create ArticleCard component**

Create `src/components/ArticleCard.astro`:

```astro
---
import ExternalLink from './icons/ExternalLink.astro';

interface Props {
  title: string;
  link: string;
  pubDate: string;
  description: string;
}

const { title, link, pubDate, description } = Astro.props;
---

<article class="p-6 bg-bg rounded-xl border border-border hover:border-accent/50 transition-colors">
  <a href={link} target="_blank" rel="noopener noreferrer" class="block group">
    <div class="flex items-start justify-between gap-4 mb-2">
      <h3 class="text-lg font-semibold text-text group-hover:text-accent transition-colors">
        {title}
      </h3>
      <ExternalLink class="w-4 h-4 text-text-secondary flex-shrink-0 mt-1" />
    </div>

    <p class="text-sm text-text-secondary mb-3">{pubDate}</p>

    <p class="text-text-secondary line-clamp-2">
      {description}
    </p>
  </a>
</article>
```

**Step 3: Create Writing component**

Create `src/components/Writing.astro`:

```astro
---
import ArticleCard from './ArticleCard.astro';
import ExternalLink from './icons/ExternalLink.astro';
import { fetchMediumArticles } from '../lib/rss';

interface Props {
  mediumUsername?: string;
}

const { mediumUsername = 'your-medium-username' } = Astro.props;

// Fetch articles at build time
let articles = await fetchMediumArticles(mediumUsername, 4);

// Fallback placeholder articles if fetch fails
if (articles.length === 0) {
  articles = [
    {
      title: 'Getting Started with Machine Learning in Production',
      link: '#',
      pubDate: 'December 2024',
      description: 'A comprehensive guide to deploying machine learning models in production environments...',
    },
    {
      title: 'Building Scalable Data Pipelines with Apache Spark',
      link: '#',
      pubDate: 'November 2024',
      description: 'Learn how to design and implement data pipelines that scale with your business needs...',
    },
    {
      title: 'The Future of Healthcare AI',
      link: '#',
      pubDate: 'October 2024',
      description: 'Exploring the intersection of artificial intelligence and healthcare innovation...',
    },
  ];
}
---

<section id="writing" class="py-24 px-6">
  <div class="max-w-content mx-auto">
    <h2 class="text-3xl md:text-4xl font-bold text-text mb-12">Writing</h2>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      {articles.map((article) => (
        <ArticleCard {...article} />
      ))}
    </div>

    <a
      href={`https://medium.com/@${mediumUsername}`}
      target="_blank"
      rel="noopener noreferrer"
      class="inline-flex items-center gap-2 text-accent hover:text-accent-hover transition-colors"
    >
      Read more on Medium
      <ExternalLink class="w-4 h-4" />
    </a>
  </div>
</section>
```

**Step 4: Update index.astro**

Update `src/pages/index.astro`:

```astro
---
import Layout from '../layouts/Layout.astro';
import Header from '../components/Header.astro';
import Hero from '../components/Hero.astro';
import RoleSpotlight from '../components/RoleSpotlight.astro';
import Timeline from '../components/Timeline.astro';
import Research from '../components/Research.astro';
import Projects from '../components/Projects.astro';
import Writing from '../components/Writing.astro';
---

<Layout title="Matt Boraske | Data Scientist">
  <Header />
  <main>
    <Hero />
    <RoleSpotlight />
    <Timeline />
    <Research />
    <Projects />
    <Writing />
  </main>
</Layout>
```

**Step 5: Verify writing section displays**

```bash
npm run dev
```

Expected: Writing section with article cards (placeholder or real if username configured).

**Step 6: Commit**

```bash
git add -A
git commit -m "feat: add Writing section with Medium RSS integration"
```

---

## Task 10: Skills Section

**Files:**
- Create: `src/components/Skills.astro`
- Modify: `src/pages/index.astro`

**Step 1: Create Skills component**

Create `src/components/Skills.astro`:

```astro
---
interface SkillCategory {
  name: string;
  skills: string[];
}

interface Props {
  categories?: SkillCategory[];
}

const { categories = [
  {
    name: 'Languages',
    skills: ['Python', 'SQL', 'R', 'TypeScript', 'Bash'],
  },
  {
    name: 'ML/AI',
    skills: ['PyTorch', 'TensorFlow', 'scikit-learn', 'Hugging Face', 'MLflow'],
  },
  {
    name: 'Data Engineering',
    skills: ['Apache Spark', 'Airflow', 'dbt', 'Kafka', 'Delta Lake'],
  },
  {
    name: 'Cloud & Infrastructure',
    skills: ['AWS', 'GCP', 'Docker', 'Kubernetes', 'Terraform'],
  },
  {
    name: 'Databases',
    skills: ['PostgreSQL', 'Snowflake', 'MongoDB', 'Redis', 'Elasticsearch'],
  },
]} = Astro.props;
---

<section id="skills" class="py-24 px-6 bg-bg-secondary">
  <div class="max-w-content mx-auto">
    <h2 class="text-3xl md:text-4xl font-bold text-text mb-12">Skills</h2>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {categories.map(({ name, skills }) => (
        <div>
          <h3 class="text-lg font-semibold text-text mb-4">{name}</h3>
          <div class="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <span class="px-3 py-1.5 bg-bg text-text-secondary text-sm rounded-full border border-border hover:border-accent/50 transition-colors">
                {skill}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
</section>
```

**Step 2: Update index.astro**

Update `src/pages/index.astro`:

```astro
---
import Layout from '../layouts/Layout.astro';
import Header from '../components/Header.astro';
import Hero from '../components/Hero.astro';
import RoleSpotlight from '../components/RoleSpotlight.astro';
import Timeline from '../components/Timeline.astro';
import Research from '../components/Research.astro';
import Projects from '../components/Projects.astro';
import Writing from '../components/Writing.astro';
import Skills from '../components/Skills.astro';
---

<Layout title="Matt Boraske | Data Scientist">
  <Header />
  <main>
    <Hero />
    <RoleSpotlight />
    <Timeline />
    <Research />
    <Projects />
    <Writing />
    <Skills />
  </main>
</Layout>
```

**Step 3: Verify skills section displays**

```bash
npm run dev
```

Expected: Skills section with grouped tags by category.

**Step 4: Commit**

```bash
git add -A
git commit -m "feat: add Skills section with categorized tech tags"
```

---

## Task 11: Contact Section

**Files:**
- Create: `src/components/Contact.astro`
- Create: `src/components/ContactForm.astro`
- Modify: `src/pages/index.astro`

**Step 1: Create ContactForm component**

Create `src/components/ContactForm.astro`:

```astro
---
interface Props {
  formspreeId?: string;
}

const { formspreeId = 'your-formspree-id' } = Astro.props;
---

<form
  id="contact-form"
  action={`https://formspree.io/f/${formspreeId}`}
  method="POST"
  class="space-y-4"
>
  <div>
    <label for="name" class="block text-sm font-medium text-text mb-2">Name</label>
    <input
      type="text"
      id="name"
      name="name"
      required
      class="w-full px-4 py-3 bg-bg border border-border rounded-lg text-text placeholder-text-secondary focus:outline-none focus:border-accent transition-colors"
      placeholder="Your name"
    />
  </div>

  <div>
    <label for="email" class="block text-sm font-medium text-text mb-2">Email</label>
    <input
      type="email"
      id="email"
      name="email"
      required
      class="w-full px-4 py-3 bg-bg border border-border rounded-lg text-text placeholder-text-secondary focus:outline-none focus:border-accent transition-colors"
      placeholder="your@email.com"
    />
  </div>

  <div>
    <label for="message" class="block text-sm font-medium text-text mb-2">Message</label>
    <textarea
      id="message"
      name="message"
      required
      rows="5"
      class="w-full px-4 py-3 bg-bg border border-border rounded-lg text-text placeholder-text-secondary focus:outline-none focus:border-accent transition-colors resize-none"
      placeholder="Your message..."
    ></textarea>
  </div>

  <button
    type="submit"
    class="w-full px-6 py-3 bg-accent text-white font-medium rounded-lg hover:bg-accent-hover transition-colors"
  >
    Send Message
  </button>
</form>

<div id="form-success" class="hidden p-6 bg-green-50 dark:bg-green-900/20 rounded-lg text-center">
  <p class="text-green-600 dark:text-green-400 font-medium">Thanks! I'll be in touch soon.</p>
</div>

<script>
  const form = document.getElementById('contact-form') as HTMLFormElement;
  const successMsg = document.getElementById('form-success');

  form?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(form);

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: formData,
        headers: {
          Accept: 'application/json',
        },
      });

      if (response.ok) {
        form.style.display = 'none';
        successMsg?.classList.remove('hidden');
      }
    } catch (error) {
      console.error('Form submission error:', error);
    }
  });
</script>
```

**Step 2: Create Contact component**

Create `src/components/Contact.astro`:

```astro
---
import ContactForm from './ContactForm.astro';
import GitHub from './icons/GitHub.astro';
import LinkedIn from './icons/LinkedIn.astro';
import Medium from './icons/Medium.astro';
import Mail from './icons/Mail.astro';

interface Props {
  email?: string;
  location?: string;
}

const { email = 'email@example.com', location = 'Philadelphia, PA' } = Astro.props;

const socialLinks = [
  { href: 'https://github.com/', icon: GitHub, label: 'GitHub' },
  { href: 'https://linkedin.com/in/', icon: LinkedIn, label: 'LinkedIn' },
  { href: 'https://medium.com/@', icon: Medium, label: 'Medium' },
];
---

<section id="contact" class="py-24 px-6">
  <div class="max-w-content mx-auto">
    <h2 class="text-3xl md:text-4xl font-bold text-text mb-4">Get in Touch</h2>
    <p class="text-text-secondary mb-12 max-w-2xl">
      Interested in collaborating or have a question? Feel free to reach out.
    </p>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-12">
      <!-- Contact Form -->
      <div>
        <ContactForm />
      </div>

      <!-- Contact Info -->
      <div class="space-y-8">
        <div>
          <h3 class="text-lg font-semibold text-text mb-4">Direct Contact</h3>
          <a
            href={`mailto:${email}`}
            class="flex items-center gap-3 text-text-secondary hover:text-accent transition-colors"
          >
            <Mail class="w-5 h-5" />
            {email}
          </a>
        </div>

        {location && (
          <div>
            <h3 class="text-lg font-semibold text-text mb-4">Location</h3>
            <p class="text-text-secondary">{location}</p>
          </div>
        )}

        <div>
          <h3 class="text-lg font-semibold text-text mb-4">Connect</h3>
          <div class="flex items-center gap-4">
            {socialLinks.map(({ href, icon: Icon, label }) => (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                class="p-3 bg-bg-secondary rounded-full text-text-secondary hover:text-text hover:bg-border transition-colors"
              >
                <Icon class="w-5 h-5" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h3 class="text-lg font-semibold text-text mb-4">Resume</h3>
          <a
            href="/resume.pdf"
            download
            class="inline-flex items-center gap-2 px-6 py-3 bg-bg-secondary text-text font-medium rounded-lg hover:bg-border transition-colors"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
            Download Resume
          </a>
        </div>
      </div>
    </div>
  </div>
</section>
```

**Step 3: Update index.astro**

Update `src/pages/index.astro`:

```astro
---
import Layout from '../layouts/Layout.astro';
import Header from '../components/Header.astro';
import Hero from '../components/Hero.astro';
import RoleSpotlight from '../components/RoleSpotlight.astro';
import Timeline from '../components/Timeline.astro';
import Research from '../components/Research.astro';
import Projects from '../components/Projects.astro';
import Writing from '../components/Writing.astro';
import Skills from '../components/Skills.astro';
import Contact from '../components/Contact.astro';
---

<Layout title="Matt Boraske | Data Scientist">
  <Header />
  <main>
    <Hero />
    <RoleSpotlight />
    <Timeline />
    <Research />
    <Projects />
    <Writing />
    <Skills />
    <Contact />
  </main>
</Layout>
```

**Step 4: Create placeholder resume**

```bash
touch /Users/mattboraske/Documents/claude-code-tests/professional-website/public/resume.pdf
```

(User will replace with actual PDF)

**Step 5: Verify contact section displays**

```bash
npm run dev
```

Expected: Contact form and info with resume download button.

**Step 6: Commit**

```bash
git add -A
git commit -m "feat: add Contact section with form and resume download"
```

---

## Task 12: Footer

**Files:**
- Create: `src/components/Footer.astro`
- Modify: `src/pages/index.astro`

**Step 1: Create Footer component**

Create `src/components/Footer.astro`:

```astro
---
import GitHub from './icons/GitHub.astro';
import LinkedIn from './icons/LinkedIn.astro';
import Medium from './icons/Medium.astro';

const currentYear = new Date().getFullYear();

const socialLinks = [
  { href: 'https://github.com/', icon: GitHub, label: 'GitHub' },
  { href: 'https://linkedin.com/in/', icon: LinkedIn, label: 'LinkedIn' },
  { href: 'https://medium.com/@', icon: Medium, label: 'Medium' },
];
---

<footer class="py-8 px-6 border-t border-border">
  <div class="max-w-content mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
    <p class="text-sm text-text-secondary">
      © {currentYear} Matt Boraske. All rights reserved.
    </p>

    <div class="flex items-center gap-4">
      {socialLinks.map(({ href, icon: Icon, label }) => (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          class="text-text-secondary hover:text-text transition-colors"
        >
          <Icon class="w-5 h-5" />
        </a>
      ))}
    </div>
  </div>
</footer>
```

**Step 2: Update index.astro**

Update `src/pages/index.astro`:

```astro
---
import Layout from '../layouts/Layout.astro';
import Header from '../components/Header.astro';
import Hero from '../components/Hero.astro';
import RoleSpotlight from '../components/RoleSpotlight.astro';
import Timeline from '../components/Timeline.astro';
import Research from '../components/Research.astro';
import Projects from '../components/Projects.astro';
import Writing from '../components/Writing.astro';
import Skills from '../components/Skills.astro';
import Contact from '../components/Contact.astro';
import Footer from '../components/Footer.astro';
---

<Layout title="Matt Boraske | Data Scientist">
  <Header />
  <main>
    <Hero />
    <RoleSpotlight />
    <Timeline />
    <Research />
    <Projects />
    <Writing />
    <Skills />
    <Contact />
  </main>
  <Footer />
</Layout>
```

**Step 3: Verify footer displays**

```bash
npm run dev
```

Expected: Minimal footer with copyright and social icons.

**Step 4: Commit**

```bash
git add -A
git commit -m "feat: add Footer component"
```

---

## Task 13: Scroll Animations

**Files:**
- Create: `src/components/ScrollAnimation.astro`
- Modify: `src/styles/global.css`
- Modify: All section components to add animation classes

**Step 1: Add animation styles to global.css**

Add to `src/styles/global.css`:

```css
/* Scroll Animations */
.animate-on-scroll {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}

.animate-on-scroll.is-visible {
  opacity: 1;
  transform: translateY(0);
}

.animate-delay-100 { transition-delay: 0.1s; }
.animate-delay-200 { transition-delay: 0.2s; }
.animate-delay-300 { transition-delay: 0.3s; }
.animate-delay-400 { transition-delay: 0.4s; }
```

**Step 2: Create scroll animation script component**

Create `src/components/ScrollAnimation.astro`:

```astro
<script>
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1,
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
      }
    });
  }, observerOptions);

  // Observe all elements with animate-on-scroll class
  document.querySelectorAll('.animate-on-scroll').forEach((el) => {
    observer.observe(el);
  });
</script>
```

**Step 3: Update Layout to include scroll animation script**

Update `src/layouts/Layout.astro` to add at the end before closing body:

```astro
---
import ScrollAnimation from '../components/ScrollAnimation.astro';

interface Props {
  title: string;
  description?: string;
}

const { title, description = 'Data Scientist | AI/ML Engineer | Data Engineer' } = Astro.props;
---

<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content={description} />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
    <title>{title}</title>
  </head>
  <body>
    <slot />
    <ScrollAnimation />
  </body>
</html>

<style is:global>
  @import '../styles/global.css';
</style>
```

**Step 4: Add animation classes to section components**

Update each section component to add `animate-on-scroll` class to the main section element and key child elements. Example for `RoleSpotlight.astro`:

```astro
<section id="about" class="py-24 px-6">
  <div class="max-w-content mx-auto">
    <h2 class="text-3xl md:text-4xl font-bold text-text mb-4 animate-on-scroll">What I Do</h2>
    <!-- ... rest with animate-on-scroll classes on key elements -->
  </div>
</section>
```

Repeat for all section components (Timeline, Research, Projects, Writing, Skills, Contact).

**Step 5: Verify animations work**

```bash
npm run dev
```

Expected: Sections fade in as you scroll down the page.

**Step 6: Commit**

```bash
git add -A
git commit -m "feat: add scroll-triggered fade-in animations"
```

---

## Task 14: Final Polish and Build Test

**Files:**
- Modify: Various components for final tweaks
- Create: `public/favicon.svg`

**Step 1: Create favicon**

Create `public/favicon.svg`:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <text y=".9em" font-size="90">👨‍💻</text>
</svg>
```

**Step 2: Test production build**

```bash
npm run build
```

Expected: Build completes without errors.

**Step 3: Preview production build**

```bash
npm run preview
```

Expected: Site runs in production mode at localhost:4321.

**Step 4: Commit**

```bash
git add -A
git commit -m "feat: add favicon and verify production build"
```

---

## Task 15: Deployment Setup

**Files:**
- Create: `netlify.toml` or `vercel.json`

**Step 1: Create Netlify config (or Vercel)**

Create `netlify.toml`:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "20"
```

**Step 2: Commit**

```bash
git add -A
git commit -m "chore: add Netlify deployment config"
```

**Step 3: Deploy**

Push to GitHub and connect to Netlify/Vercel:

```bash
git remote add origin <your-github-repo-url>
git push -u origin master
```

Then connect the repo in Netlify/Vercel dashboard.

---

## Content Placeholders to Replace

After building, the user needs to replace these placeholder values:

1. **Header.astro**: Update social links with actual URLs
2. **Hero.astro**: Customize tagline
3. **RoleSpotlight.astro**: Write actual role description
4. **Timeline.astro**: Add real work experience
5. **Research.astro**: Add real publications
6. **Projects.astro**: Add real projects with images
7. **Writing.astro**: Set actual Medium username
8. **Skills.astro**: Customize skill list
9. **Contact.astro**: Set email, location, social links
10. **ContactForm.astro**: Get Formspree ID
11. **public/resume.pdf**: Add actual resume

---

## Summary

| Task | Description | Est. Steps |
|------|-------------|------------|
| 1 | Project Scaffold | 4 |
| 2 | Global Styles & Theme | 5 |
| 3 | Header Component | 6 |
| 4 | Hero Section | 5 |
| 5 | Role Spotlight | 5 |
| 6 | Work Timeline | 5 |
| 7 | Research Section | 6 |
| 8 | Projects + Filtering | 6 |
| 9 | Writing + RSS | 6 |
| 10 | Skills Section | 4 |
| 11 | Contact Section | 6 |
| 12 | Footer | 4 |
| 13 | Scroll Animations | 6 |
| 14 | Final Polish | 4 |
| 15 | Deployment | 3 |

**Total: 15 tasks, ~75 steps**
