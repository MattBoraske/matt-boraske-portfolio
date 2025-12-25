# Portfolio Enhancements Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Transform portfolio into a polished, maintainable site with complete terminal theme, content management system, expanded project showcase, and professional features.

**Architecture:** Build on existing terminal theme by completing visual consistency across all components. Create markdown-based content management system following the parseSkills.ts pattern. Add professional features (analytics, error handling, SEO) and comprehensive documentation for AWS Amplify deployment.

**Tech Stack:** Astro 5.16, TypeScript, Tailwind CSS, Node.js fs module for build-time parsing, Plausible Analytics, AWS Amplify

---

## Phase 1: Polish & Consistency

### Task 1.1: Complete Terminal Theme - Research Section

**Files:**
- Modify: `src/components/Research.astro:48-58`

**Step 1: Update Research section header with terminal brackets**

Replace the plain h2 header with bracketed terminal-style header:

```astro
<section id="research" class="py-24 px-6">
  <div class="max-w-content mx-auto">
    <div class="section-header animate-on-scroll">
      <span class="header-bracket">[</span>
      <h2 class="text-3xl md:text-4xl font-bold text-text">Research</h2>
      <span class="header-bracket">]</span>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      {publications.map((pub) => (
        <PublicationCard {...pub} />
      ))}
    </div>
  </div>
</section>

<style>
  .section-header {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    margin-bottom: 3rem;
  }

  .header-bracket {
    font-family: var(--font-display);
    font-size: 3rem;
    color: var(--color-accent);
    font-weight: 900;
  }
</style>
```

**Step 2: Verify changes in browser**

Run: `npm run dev` (if not already running)
Navigate to: http://localhost:4321/#research
Expected: See `[Research]` header with cyan brackets matching other sections

**Step 3: Commit changes**

```bash
git add src/components/Research.astro
git commit -m "style: add terminal theme header to Research section"
```

---

### Task 1.2: Complete Terminal Theme - PublicationCard

**Files:**
- Modify: `src/components/PublicationCard.astro` (complete rewrite)

**Step 1: Read current PublicationCard structure**

Run: `cat src/components/PublicationCard.astro | head -50`
Note: Current structure to understand what we're transforming

**Step 2: Replace PublicationCard with terminal-themed version**

Replace entire file content:

```astro
---
import GitHub from './icons/GitHub.astro';
import HuggingFace from './icons/HuggingFace.astro';
import ExternalLink from './icons/ExternalLink.astro';

interface Props {
  title: string;
  venue: string;
  year: string;
  summary: string;
  authors?: string;
  tags?: string[];
  pdfUrl?: string;
  githubUrl?: string;
  huggingfaceUrl?: string;
  id?: string;
}

const { title, venue, year, summary, authors, tags = [], pdfUrl, githubUrl, huggingfaceUrl, id } = Astro.props;
---

<article class="publication-card terminal-card group" id={id}>
  <div class="p-6">
    <!-- Title with terminal styling -->
    <h3 class="publication-title">{title}</h3>

    <!-- Venue and year badge -->
    <div class="publication-meta">
      <span class="venue-badge">
        <span class="badge-bracket">[</span>
        {venue}
        <span class="badge-bracket">]</span>
      </span>
      <span class="year-badge">{year}</span>
    </div>

    <!-- Authors -->
    {authors && (
      <p class="authors-text">
        <span class="author-icon">&gt;</span>
        {authors}
      </p>
    )}

    <!-- Summary -->
    <p class="summary-text">{summary}</p>

    <!-- Tags -->
    {tags.length > 0 && (
      <div class="tags-container">
        {tags.map((tag) => (
          <span class="pub-tag">
            <span class="tag-chevron">&gt;</span>
            {tag}
          </span>
        ))}
      </div>
    )}

    <!-- Links -->
    <div class="links-container">
      {pdfUrl && (
        <a
          href={pdfUrl}
          target="_blank"
          rel="noopener noreferrer"
          class="pub-link"
        >
          <ExternalLink class="w-4 h-4" />
          <span>PDF</span>
          <span class="link-arrow">→</span>
        </a>
      )}
      {githubUrl && (
        <a
          href={githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          class="pub-link"
        >
          <GitHub class="w-4 h-4" />
          <span>Code</span>
          <span class="link-arrow">→</span>
        </a>
      )}
      {huggingfaceUrl && (
        <a
          href={huggingfaceUrl}
          target="_blank"
          rel="noopener noreferrer"
          class="pub-link"
        >
          <HuggingFace class="w-4 h-4" />
          <span>Dataset</span>
          <span class="link-arrow">→</span>
        </a>
      )}
    </div>
  </div>
</article>

<style>
  .publication-card {
    position: relative;
    transition: all 0.3s ease;
  }

  .publication-title {
    font-family: var(--font-display);
    font-size: 1.25rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.02em;
    color: var(--color-text);
    margin-bottom: 1rem;
    line-height: 1.4;
    transition: all 0.3s ease;
  }

  .publication-card:hover .publication-title {
    color: var(--color-accent);
    text-shadow: 0 0 10px var(--color-glow);
  }

  .publication-meta {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 0.75rem;
    flex-wrap: wrap;
  }

  .venue-badge {
    font-family: var(--font-mono);
    font-size: 0.75rem;
    font-weight: 700;
    color: rgba(255, 255, 255, 0.7);
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }

  .badge-bracket {
    color: var(--color-accent);
    font-weight: 900;
  }

  .year-badge {
    font-family: var(--font-mono);
    font-size: 0.75rem;
    font-weight: 700;
    padding: 0.25rem 0.75rem;
    background: rgba(0, 255, 255, 0.1);
    color: var(--color-accent);
    border: 1px solid rgba(0, 255, 255, 0.3);
    border-radius: 4px;
  }

  .authors-text {
    font-family: var(--font-mono);
    font-size: 0.75rem;
    color: rgba(255, 255, 255, 0.6);
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .author-icon {
    color: var(--color-accent);
    font-weight: 700;
  }

  .summary-text {
    font-family: var(--font-mono);
    font-size: 0.875rem;
    line-height: 1.6;
    color: rgba(255, 255, 255, 0.7);
    margin-bottom: 1rem;
  }

  .tags-container {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-bottom: 1.5rem;
  }

  .pub-tag {
    font-family: var(--font-mono);
    font-size: 0.75rem;
    font-weight: 700;
    padding: 0.25rem 0.625rem;
    background: rgba(0, 255, 255, 0.05);
    color: rgba(255, 255, 255, 0.6);
    border: 1px solid rgba(0, 255, 255, 0.2);
    border-radius: 4px;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }

  .tag-chevron {
    color: var(--color-accent);
    font-weight: 700;
  }

  .pub-tag:hover {
    background: rgba(0, 255, 255, 0.1);
    border-color: var(--color-accent);
    color: var(--color-accent);
    transform: translateY(-2px);
  }

  .links-container {
    display: flex;
    align-items: center;
    gap: 1.5rem;
    flex-wrap: wrap;
  }

  .pub-link {
    font-family: var(--font-mono);
    font-size: 0.875rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: rgba(255, 255, 255, 0.6);
    display: flex;
    align-items: center;
    gap: 0.5rem;
    transition: all 0.3s ease;
    position: relative;
  }

  .link-arrow {
    opacity: 0;
    transform: translateX(-5px);
    transition: all 0.3s ease;
    color: var(--color-accent);
  }

  .pub-link:hover {
    color: var(--color-accent);
  }

  .pub-link:hover .link-arrow {
    opacity: 1;
    transform: translateX(0);
  }

  .pub-link:hover {
    filter: drop-shadow(0 0 8px var(--color-glow));
  }
</style>
```

**Step 3: Verify in browser**

Navigate to: http://localhost:4321/#research
Expected: Publication cards have terminal styling with:
- Uppercase titles that glow cyan on hover
- Bracketed venue badges
- Year badges with neon borders
- Chevron tags
- Links with sliding arrows on hover

**Step 4: Commit changes**

```bash
git add src/components/PublicationCard.astro
git commit -m "style: apply terminal theme to PublicationCard"
```

---

### Task 1.3: Complete Terminal Theme - RoleSpotlight

**Files:**
- Modify: `src/components/RoleSpotlight.astro:19-38`

**Step 1: Update RoleSpotlight with terminal styling**

Replace the entire component content:

```astro
---
interface Props {
  company?: string;
  role?: string;
  description?: string[];
}

const {
  company = 'CSL Behring',
  role = 'Data Scientist',
  description = [
    'Currently, I serve as a functional expert in natural language processing, machine learning, and generative AI. I build AI-powered data retrieval tools using retrieval augmented generation (RAG) with fine-tuned embedding models to make information more accessible across the organization.',
    'I led the development of a conversational AI tool that leverages plasma donor reviews to provide actionable insights for donation center managers, driving approximately a 15% improvement in average review scores. I also deployed an internal chatbot that enables private and secure conversations with GPT and Llama 3 models.',
    'My work focuses on fine-tuning large language models for domain-specific tasks, building production AI systems, and translating complex business needs into practical generative AI solutions.',
  ],
} = Astro.props;
---

<section id="about" class="py-24 px-6">
  <div class="max-w-content mx-auto">
    <div class="section-header animate-on-scroll">
      <span class="header-bracket">[</span>
      <h2 class="text-3xl md:text-4xl font-bold text-text">What I Do</h2>
      <span class="header-bracket">]</span>
    </div>

    <div class="role-container">
      <span class="role-label">
        <span class="terminal-prompt">&gt;</span>
        {role} at
      </span>
      <span class="company-badge">
        <span class="badge-bracket">[</span>
        {company}
        <span class="badge-bracket">]</span>
      </span>
    </div>

    <div class="max-w-3xl description-container">
      {description.map((paragraph) => (
        <p class="description-paragraph">
          {paragraph}
        </p>
      ))}
    </div>
  </div>
</section>

<style>
  .section-header {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    margin-bottom: 2rem;
  }

  .header-bracket {
    font-family: var(--font-display);
    font-size: 3rem;
    color: var(--color-accent);
    font-weight: 900;
  }

  .role-container {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 2rem;
    flex-wrap: wrap;
  }

  .role-label {
    font-family: var(--font-mono);
    font-size: 0.875rem;
    color: rgba(255, 255, 255, 0.7);
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .terminal-prompt {
    color: var(--color-accent);
    font-weight: 700;
  }

  .company-badge {
    font-family: var(--font-mono);
    font-size: 0.875rem;
    font-weight: 700;
    padding: 0.5rem 1rem;
    background: rgba(0, 255, 255, 0.1);
    color: var(--color-accent);
    border: 1px solid var(--color-accent);
    border-radius: 4px;
    display: flex;
    align-items: center;
    gap: 0.25rem;
    box-shadow: 0 0 15px rgba(0, 255, 255, 0.2);
    transition: all 0.3s ease;
  }

  .company-badge:hover {
    background: rgba(0, 255, 255, 0.15);
    box-shadow: 0 0 25px rgba(0, 255, 255, 0.4);
  }

  .badge-bracket {
    color: var(--color-accent-hover);
    font-weight: 900;
  }

  .description-container {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
  }

  .description-paragraph {
    font-family: var(--font-mono);
    font-size: 0.9375rem;
    line-height: 1.8;
    color: rgba(255, 255, 255, 0.75);
    padding-left: 1rem;
    border-left: 2px solid rgba(0, 255, 255, 0.3);
    transition: all 0.3s ease;
  }

  .description-paragraph:hover {
    border-left-color: var(--color-accent);
    transform: translateX(4px);
  }
</style>
```

**Step 2: Verify in browser**

Navigate to: http://localhost:4321/#about
Expected:
- `[What I Do]` header with brackets
- Company badge with brackets and neon glow
- Paragraphs with left border accent that brightens on hover

**Step 3: Commit changes**

```bash
git add src/components/RoleSpotlight.astro
git commit -m "style: apply terminal theme to RoleSpotlight"
```

---

### Task 1.4: Complete Terminal Theme - Writing Section

**Files:**
- Modify: `src/components/Writing.astro:22-42`

**Step 1: Update Writing section header**

Replace the h2 header section:

```astro
<section id="writing" class="py-24 px-6">
  <div class="max-w-content mx-auto">
    <div class="section-header animate-on-scroll">
      <span class="header-bracket">[</span>
      <h2 class="text-3xl md:text-4xl font-bold text-text">Writing</h2>
      <span class="header-bracket">]</span>
    </div>

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

<style>
  .section-header {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    margin-bottom: 3rem;
  }

  .header-bracket {
    font-family: var(--font-display);
    font-size: 3rem;
    color: var(--color-accent);
    font-weight: 900;
  }
</style>
```

**Step 2: Verify in browser**

Navigate to: http://localhost:4321/#writing
Expected: `[Writing]` header with cyan brackets

**Step 3: Commit changes**

```bash
git add src/components/Writing.astro
git commit -m "style: add terminal theme header to Writing section"
```

---

### Task 1.5: Complete Terminal Theme - ArticleCard

**Files:**
- Modify: `src/components/ArticleCard.astro` (complete rewrite)

**Step 1: Replace ArticleCard with terminal-themed version**

Replace entire file content:

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

<article class="article-card terminal-card group">
  <div class="p-6">
    <!-- Date badge -->
    <div class="date-badge">
      <span class="badge-bracket">[</span>
      {pubDate}
      <span class="badge-bracket">]</span>
    </div>

    <!-- Title -->
    <h3 class="article-title">
      <a href={link} target="_blank" rel="noopener noreferrer">
        {title}
      </a>
    </h3>

    <!-- Description -->
    <p class="article-description">
      <span class="desc-chevron">&gt;</span>
      {description}
    </p>

    <!-- Read more link -->
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      class="read-more-link"
    >
      <ExternalLink class="w-4 h-4" />
      <span>Read Article</span>
      <span class="link-arrow">→</span>
    </a>
  </div>
</article>

<style>
  .article-card {
    position: relative;
    transition: all 0.3s ease;
  }

  .date-badge {
    font-family: var(--font-mono);
    font-size: 0.75rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: rgba(255, 255, 255, 0.6);
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }

  .badge-bracket {
    color: var(--color-accent);
    font-weight: 900;
  }

  .article-title {
    font-family: var(--font-display);
    font-size: 1.25rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.02em;
    margin-bottom: 1rem;
    line-height: 1.4;
  }

  .article-title a {
    color: var(--color-text);
    transition: all 0.3s ease;
  }

  .article-card:hover .article-title a {
    color: var(--color-accent);
    text-shadow: 0 0 10px var(--color-glow);
  }

  .article-description {
    font-family: var(--font-mono);
    font-size: 0.875rem;
    line-height: 1.6;
    color: rgba(255, 255, 255, 0.7);
    margin-bottom: 1.5rem;
    display: flex;
    gap: 0.5rem;
  }

  .desc-chevron {
    color: var(--color-accent);
    font-weight: 700;
    flex-shrink: 0;
  }

  .read-more-link {
    font-family: var(--font-mono);
    font-size: 0.875rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: rgba(255, 255, 255, 0.6);
    display: flex;
    align-items: center;
    gap: 0.5rem;
    transition: all 0.3s ease;
  }

  .link-arrow {
    opacity: 0;
    transform: translateX(-5px);
    transition: all 0.3s ease;
    color: var(--color-accent);
  }

  .read-more-link:hover {
    color: var(--color-accent);
  }

  .read-more-link:hover .link-arrow {
    opacity: 1;
    transform: translateX(0);
  }

  .read-more-link:hover {
    filter: drop-shadow(0 0 8px var(--color-glow));
  }
</style>
```

**Step 2: Verify in browser**

Navigate to: http://localhost:4321/#writing
Expected: Article cards with:
- Bracketed date badges
- Uppercase titles that glow on hover
- Descriptions with chevron prefixes
- "Read Article" links with sliding arrows

**Step 3: Commit changes**

```bash
git add src/components/ArticleCard.astro
git commit -m "style: apply terminal theme to ArticleCard"
```

---

### Task 1.6: Fix Resume Filename

**Files:**
- Check: `public/resume.pdf` (already exists)
- Modify: `README.md:29,197`

**Step 1: Verify current resume file**

Run: `ls -la public/*.pdf`
Expected: See `resume.pdf`

**Step 2: Update README references**

Open `README.md` and find line 29:
```markdown
│   ├── favicon.svg           # Site favicon
│   └── Matthew_Boraske_Resume.pdf  # Downloadable resume
```

Change to:
```markdown
│   ├── favicon.svg           # Site favicon
│   └── resume.pdf  # Downloadable resume
```

Find any other references and update them.

**Step 3: Verify Contact download link**

Run: `grep -n "resume.pdf" src/components/Contact.astro`
Expected: Should already reference `/resume.pdf`

**Step 4: Test download link**

Navigate to: http://localhost:4321/#contact
Click resume download button
Expected: PDF downloads successfully

**Step 5: Commit changes**

```bash
git add README.md
git commit -m "docs: fix resume filename reference in README"
```

---

### Task 1.7: Add SEO Meta Tags

**Files:**
- Modify: `src/layouts/Layout.astro:1-30`
- Create: `public/og-image.png` (placeholder for now)

**Step 1: Update Layout.astro with comprehensive meta tags**

Replace the `<head>` section in Layout.astro:

```astro
---
import '../styles/global.css';
import ScrollAnimation from '../components/ScrollAnimation.astro';

interface Props {
  title: string;
  description?: string;
}

const {
  title,
  description = 'Data Scientist specializing in AI/ML, NLP, and Generative AI. Building production ML systems and fine-tuning LLMs for domain-specific tasks.'
} = Astro.props;

const siteUrl = 'https://www.mattboraske.com';
const ogImage = `${siteUrl}/og-image.png`;
---

<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <!-- Primary Meta Tags -->
    <meta name="title" content={title} />
    <meta name="description" content={description} />
    <meta name="author" content="Matthew Boraske" />

    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website" />
    <meta property="og:url" content={siteUrl} />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:image" content={ogImage} />

    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image" />
    <meta property="twitter:url" content={siteUrl} />
    <meta property="twitter:title" content={title} />
    <meta property="twitter:description" content={description} />
    <meta property="twitter:image" content={ogImage} />

    <!-- Canonical URL -->
    <link rel="canonical" href={siteUrl} />

    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <title>{title}</title>
  </head>
  <body>
    <slot />
    <ScrollAnimation />
  </body>
</html>
```

**Step 2: Create placeholder OG image**

Note: For now, we'll create a TODO to generate the proper OG image later.

Run: `echo "TODO: Create 1200x630 OG image with terminal aesthetic" > public/og-image-todo.txt`

**Step 3: Verify meta tags in browser**

Navigate to: http://localhost:4321/
Right-click → View Page Source
Expected: See all OG and Twitter meta tags in `<head>`

**Step 4: Commit changes**

```bash
git add src/layouts/Layout.astro public/og-image-todo.txt
git commit -m "feat: add comprehensive SEO meta tags for social sharing"
```

---

### Task 1.8: Add Sitemap Integration

**Files:**
- Modify: `astro.config.mjs:1-8`
- Create: `public/robots.txt`

**Step 1: Install sitemap integration**

Run: `npm install @astrojs/sitemap`
Expected: Package installed successfully

**Step 2: Update astro.config.mjs**

Replace content with:

```javascript
// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://www.mattboraske.com',
  integrations: [tailwind(), sitemap()]
});
```

**Step 3: Create robots.txt**

Create `public/robots.txt`:

```
User-agent: *
Allow: /

Sitemap: https://www.mattboraske.com/sitemap-index.xml
```

**Step 4: Build and verify sitemap generation**

Run: `npm run build`
Run: `ls -la dist/sitemap*.xml`
Expected: See sitemap-index.xml and sitemap-0.xml files

**Step 5: Commit changes**

```bash
git add astro.config.mjs public/robots.txt package.json package-lock.json
git commit -m "feat: add sitemap generation and robots.txt"
```

---

### Task 1.9: Remove Unused Font Import

**Files:**
- Modify: `src/layouts/Layout.astro:head`

**Step 1: Remove Inter font preconnect and link**

In Layout.astro `<head>`, the Google Fonts links were already removed in Task 1.7.
Verify they're not present.

Run: `grep -n "fonts.googleapis" src/layouts/Layout.astro`
Expected: No results (already removed)

**Step 2: Verify fonts still load correctly**

Navigate to: http://localhost:4321/
Open DevTools → Network → Fonts
Expected: Orbitron and Space Mono load from global.css

**Step 3: If needed, commit (likely already done in 1.7)**

Note: This was completed in Task 1.7, no separate commit needed.

---

## Phase 2: Content Infrastructure

### Task 2.1: Create Content Type Definitions

**Files:**
- Create: `src/types/content.ts`

**Step 1: Create types directory**

Run: `mkdir -p src/types`

**Step 2: Create content.ts with all type definitions**

Create `src/types/content.ts`:

```typescript
export interface Project {
  title: string;
  category: string;
  description: string;
  technologies: string[];
  githubUrl?: string;
  demoUrl?: string;
  featured: boolean;
  image?: string;
  isPlaceholder?: boolean;
}

export interface Publication {
  title: string;
  venue: string;
  year: string;
  summary: string;
  authors?: string;
  tags?: string[];
  pdfUrl?: string;
  githubUrl?: string;
  huggingfaceUrl?: string;
  id?: string;
}

export interface Experience {
  company: string;
  role: string;
  dateRange: string;
  description?: string;
  bullets?: string[];
  technologies?: string[];
  isCurrent?: boolean;
  type?: 'work' | 'education';
  logo?: string;
  logoSize?: string;
}

export interface RoleSpotlight {
  company: string;
  role: string;
  description: string[];
}

export interface SkillCategory {
  name: string;
  icon: string;
  subsections: SkillSubsection[];
}

export interface SkillSubsection {
  name: string;
}
```

**Step 3: Verify TypeScript compiles**

Run: `npx tsc --noEmit src/types/content.ts`
Expected: No errors

**Step 4: Commit changes**

```bash
git add src/types/content.ts
git commit -m "feat: add TypeScript type definitions for content"
```

---

### Task 2.2: Create Projects Parser

**Files:**
- Create: `src/utils/parseProjects.ts`

**Step 1: Create parseProjects.ts**

Create `src/utils/parseProjects.ts`:

```typescript
import fs from 'node:fs';
import type { Project } from '../types/content';

export function parseProjects(filePath: string): Project[] {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');

    // Split by ## headers, filter out the main title
    const sections = content.split(/^## /gm).filter(Boolean).slice(1);

    return sections.map(section => {
      const lines = section.split('\n').filter(l => l.trim());
      const title = lines[0].trim();
      const isPlaceholder = title.startsWith('[PLACEHOLDER]');

      const getField = (field: string): string => {
        const line = lines.find(l => l.trim().startsWith(`- **${field}:**`));
        if (!line) return '';
        const parts = line.split(':**');
        return parts.length > 1 ? parts[1].trim() : '';
      };

      const technologies = getField('Technologies')
        .split(',')
        .map(t => t.trim())
        .filter(Boolean);

      return {
        title: title.replace('[PLACEHOLDER] ', ''),
        category: getField('Category'),
        description: getField('Description'),
        technologies,
        githubUrl: getField('GitHub') || undefined,
        demoUrl: getField('Demo') || undefined,
        featured: getField('Featured').toLowerCase() === 'true',
        image: getField('Image') || undefined,
        isPlaceholder
      };
    });
  } catch (error) {
    console.error('Error parsing projects.md:', error);
    return [];
  }
}
```

**Step 2: Verify it compiles**

Run: `npx tsc --noEmit src/utils/parseProjects.ts`
Expected: No errors

**Step 3: Commit changes**

```bash
git add src/utils/parseProjects.ts
git commit -m "feat: add parseProjects utility for markdown content parsing"
```

---

### Task 2.3: Create Publications Parser

**Files:**
- Create: `src/utils/parsePublications.ts`

**Step 1: Create parsePublications.ts**

Create `src/utils/parsePublications.ts`:

```typescript
import fs from 'node:fs';
import type { Publication } from '../types/content';

export function parsePublications(filePath: string): Publication[] {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');

    // Split by ## headers, filter out the main title
    const sections = content.split(/^## /gm).filter(Boolean).slice(1);

    return sections.map(section => {
      const lines = section.split('\n').filter(l => l.trim());
      const title = lines[0].trim();

      const getField = (field: string): string => {
        const line = lines.find(l => l.trim().startsWith(`- **${field}:**`));
        if (!line) return '';
        const parts = line.split(':**');
        return parts.length > 1 ? parts[1].trim() : '';
      };

      const tags = getField('Tags')
        .split(',')
        .map(t => t.trim())
        .filter(Boolean);

      return {
        title,
        venue: getField('Venue'),
        year: getField('Year'),
        summary: getField('Summary'),
        authors: getField('Authors') || undefined,
        tags,
        pdfUrl: getField('PDF') || undefined,
        githubUrl: getField('GitHub') || undefined,
        huggingfaceUrl: getField('HuggingFace') || undefined,
        id: getField('ID') || undefined
      };
    });
  } catch (error) {
    console.error('Error parsing research.md:', error);
    return [];
  }
}
```

**Step 2: Verify it compiles**

Run: `npx tsc --noEmit src/utils/parsePublications.ts`
Expected: No errors

**Step 3: Commit changes**

```bash
git add src/utils/parsePublications.ts
git commit -m "feat: add parsePublications utility for research markdown parsing"
```

---

### Task 2.4: Create Timeline Parser

**Files:**
- Create: `src/utils/parseTimeline.ts`

**Step 1: Create parseTimeline.ts**

Create `src/utils/parseTimeline.ts`:

```typescript
import fs from 'node:fs';
import type { Experience } from '../types/content';

export function parseTimeline(filePath: string): Experience[] {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');

    // Split by ## headers, filter out the main title
    const sections = content.split(/^## /gm).filter(Boolean).slice(1);

    return sections.map(section => {
      const lines = section.split('\n').filter(l => l.trim());
      const role = lines[0].trim();

      const getField = (field: string): string => {
        const line = lines.find(l => l.trim().startsWith(`- **${field}:**`));
        if (!line) return '';
        const parts = line.split(':**');
        return parts.length > 1 ? parts[1].trim() : '';
      };

      const getBullets = (): string[] => {
        const bulletStart = lines.findIndex(l => l.trim().startsWith('- **Bullets:**'));
        if (bulletStart === -1) return [];

        const bullets: string[] = [];
        for (let i = bulletStart + 1; i < lines.length; i++) {
          const line = lines[i].trim();
          if (line.startsWith('  - ')) {
            bullets.push(line.substring(4));
          } else if (line.startsWith('- **')) {
            break;
          }
        }
        return bullets;
      };

      const technologies = getField('Technologies')
        .split(',')
        .map(t => t.trim())
        .filter(Boolean);

      const bullets = getBullets();
      const dateRange = getField('DateRange');

      return {
        company: getField('Company'),
        role,
        dateRange,
        description: bullets.length === 0 ? getField('Description') : undefined,
        bullets: bullets.length > 0 ? bullets : undefined,
        technologies,
        isCurrent: dateRange.toLowerCase().includes('present'),
        type: (getField('Type') as 'work' | 'education') || 'work',
        logo: getField('Logo') || undefined,
        logoSize: getField('LogoSize') || 'w-8 h-8'
      };
    });
  } catch (error) {
    console.error('Error parsing timeline.md:', error);
    return [];
  }
}
```

**Step 2: Verify it compiles**

Run: `npx tsc --noEmit src/utils/parseTimeline.ts`
Expected: No errors

**Step 3: Commit changes**

```bash
git add src/utils/parseTimeline.ts
git commit -m "feat: add parseTimeline utility for experience markdown parsing"
```

---

### Task 2.5: Create RoleSpotlight Parser

**Files:**
- Create: `src/utils/parseRoleSpotlight.ts`

**Step 1: Create parseRoleSpotlight.ts**

Create `src/utils/parseRoleSpotlight.ts`:

```typescript
import fs from 'node:fs';
import type { RoleSpotlight } from '../types/content';

export function parseRoleSpotlight(filePath: string): RoleSpotlight {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n').filter(l => l.trim());

    const getField = (field: string): string => {
      const line = lines.find(l => l.startsWith(`**${field}:**`));
      if (!line) return '';
      const parts = line.split(':**');
      return parts.length > 1 ? parts[1].trim() : '';
    };

    const description: string[] = [];
    let inDescription = false;

    for (const line of lines) {
      if (line.startsWith('**Description:**')) {
        inDescription = true;
        continue;
      }
      if (inDescription && line.startsWith('**')) {
        break;
      }
      if (inDescription && line.trim()) {
        description.push(line.trim());
      }
    }

    return {
      company: getField('Company'),
      role: getField('Role'),
      description
    };
  } catch (error) {
    console.error('Error parsing spotlight.md:', error);
    return {
      company: 'CSL Behring',
      role: 'Data Scientist',
      description: ['Currently working on AI/ML projects.']
    };
  }
}
```

**Step 2: Verify it compiles**

Run: `npx tsc --noEmit src/utils/parseRoleSpotlight.ts`
Expected: No errors

**Step 3: Commit changes**

```bash
git add src/utils/parseRoleSpotlight.ts
git commit -m "feat: add parseRoleSpotlight utility for spotlight markdown parsing"
```

---

### Task 2.6: Create research.md Content File

**Files:**
- Create: `src/resources/research.md`

**Step 1: Create research.md with current publications**

Create `src/resources/research.md`:

```markdown
# Research Publications

## Context is Key: Aligning Large Language Models with Human Moral Judgments through Retrieval-Augmented Generation
- **Venue:** FLAIRS (Florida Artificial Intelligence Research Society)
- **Year:** 2025
- **Summary:** This research investigates whether pre-trained large language models (LLMs) can align with human moral judgments on a dataset of approximately fifty thousand interpersonal conflicts from the AITA (Am I the A******) subreddit. We introduce a retrieval-augmented generation (RAG) approach that uses pre-trained LLMs as core components. Using OpenAI's GPT-4o, our agent outperforms directly prompting the LLM while achieving 83% accuracy and a Matthews correlation coefficient of 0.469 while also reducing the rate of toxic responses from 22.53% to virtually zero.
- **Authors:** Boraske, M.
- **Tags:** LLMs, RAG, NLP, Moral Judgments, Conflict Resolution
- **PDF:** https://journals.flvc.org/FLAIRS/article/download/138947/144114
- **GitHub:** https://github.com/MattBoraske/AITA-RAG-Agent
- **HuggingFace:** https://huggingface.co/collections/MattBoraske/reddit-aita-finetuning-v2

## The Efficacy of Finetuning Large Language Models for Interpersonal Conflict Resolution
- **Venue:** West Chester University of Pennsylvania - M.S. Thesis
- **Year:** 2024
- **Summary:** This study addresses the gap in evaluating LLMs on ambiguous tasks such as interpersonal conflict resolution. We evaluate LLMs on four new datasets derived from the "Am I the A**hole" (AITA) subreddit, featuring discussions of interpersonal conflicts. Using Google's Flan-T5 and Meta's Llama-2-Chat, these models were evaluated on their ability to classify and justify conflicts and their tendency to generate toxic language. Findings suggest that the most effective strategy involves finetuning an encoder-decoder LLM on a dataset cleaned of toxicity, followed by iterative refinement using RLHF to align with ethical standards.
- **Authors:** Boraske, M. (Advised by Dr. Richard Burns)
- **Tags:** LLMs, Fine-tuning, NLP, Conflict Resolution, RLHF
- **PDF:** https://digitalcommons.wcupa.edu/cgi/viewcontent.cgi?article=1461&context=all_theses
- **GitHub:** https://github.com/MattBoraske/Reddit-AITA-Conflict-Resolution-LLM-FT-Efficacy
- **HuggingFace:** https://huggingface.co/collections/MattBoraske/reddit-aita-finetuning-v1
- **ID:** thesis
```

**Step 2: Verify file created**

Run: `cat src/resources/research.md | head -10`
Expected: See the markdown content

**Step 3: Commit changes**

```bash
git add src/resources/research.md
git commit -m "feat: create research.md for publication content management"
```

---

### Task 2.7: Update Research Component to Use Parser

**Files:**
- Modify: `src/components/Research.astro:1-59`

**Step 1: Replace Research.astro to use parser**

Replace content with:

```astro
---
import PublicationCard from './PublicationCard.astro';
import { parsePublications } from '../utils/parsePublications';

const publications = parsePublications('./src/resources/research.md');
---

<section id="research" class="py-24 px-6">
  <div class="max-w-content mx-auto">
    <div class="section-header animate-on-scroll">
      <span class="header-bracket">[</span>
      <h2 class="text-3xl md:text-4xl font-bold text-text">Research</h2>
      <span class="header-bracket">]</span>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      {publications.map((pub) => (
        <PublicationCard {...pub} />
      ))}
    </div>
  </div>
</section>

<style>
  .section-header {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    margin-bottom: 3rem;
  }

  .header-bracket {
    font-family: var(--font-display);
    font-size: 3rem;
    color: var(--color-accent);
    font-weight: 900;
  }
</style>
```

**Step 2: Build and verify publications render**

Run: `npm run build`
Expected: Build succeeds, no errors

Run: `npm run preview`
Navigate to: http://localhost:4321/#research
Expected: Both publications display correctly

**Step 3: Commit changes**

```bash
git add src/components/Research.astro
git commit -m "feat: update Research component to use parsePublications"
```

---

### Task 2.8: Create spotlight.md Content File

**Files:**
- Create: `src/resources/spotlight.md`

**Step 1: Create spotlight.md**

Create `src/resources/spotlight.md`:

```markdown
# Role Spotlight

**Company:** CSL Behring
**Role:** Data Scientist

**Description:**
Currently, I serve as a functional expert in natural language processing, machine learning, and generative AI. I build AI-powered data retrieval tools using retrieval augmented generation (RAG) with fine-tuned embedding models to make information more accessible across the organization.

I led the development of a conversational AI tool that leverages plasma donor reviews to provide actionable insights for donation center managers, driving approximately a 15% improvement in average review scores. I also deployed an internal chatbot that enables private and secure conversations with GPT and Llama 3 models.

My work focuses on fine-tuning large language models for domain-specific tasks, building production AI systems, and translating complex business needs into practical generative AI solutions.
```

**Step 2: Verify file created**

Run: `cat src/resources/spotlight.md`
Expected: See the content

**Step 3: Commit changes**

```bash
git add src/resources/spotlight.md
git commit -m "feat: create spotlight.md for role spotlight content"
```

---

### Task 2.9: Update RoleSpotlight Component to Use Parser

**Files:**
- Modify: `src/components/RoleSpotlight.astro` (already updated in 1.3, just add parser)

**Step 1: Update RoleSpotlight to use parser**

Replace the frontmatter in RoleSpotlight.astro:

```astro
---
import { parseRoleSpotlight } from '../utils/parseRoleSpotlight';

const spotlight = parseRoleSpotlight('./src/resources/spotlight.md');
const { company, role, description } = spotlight;
---
```

Keep the rest of the component the same.

**Step 2: Build and verify**

Run: `npm run build`
Expected: Build succeeds

Run: `npm run preview`
Navigate to: http://localhost:4321/#about
Expected: Role spotlight displays correctly with content from markdown

**Step 3: Commit changes**

```bash
git add src/components/RoleSpotlight.astro
git commit -m "feat: update RoleSpotlight to use parseRoleSpotlight"
```

---

### Task 2.10: Create CONTENT_GUIDE.md Documentation

**Files:**
- Create: `docs/CONTENT_GUIDE.md`

**Step 1: Create comprehensive content guide**

Create `docs/CONTENT_GUIDE.md` with the full content from the design document (see design doc for full text - it's quite long).

**Step 2: Verify file created**

Run: `wc -l docs/CONTENT_GUIDE.md`
Expected: See line count

**Step 3: Commit changes**

```bash
git add docs/CONTENT_GUIDE.md
git commit -m "docs: add comprehensive content management guide"
```

---

## Phase 3: Portfolio Expansion with Placeholders

### Task 3.1: Update projects.md with Placeholders

**Files:**
- Modify: `src/resources/projects.md`

**Step 1: Update projects.md header with instructions**

Create/update `src/resources/projects.md`:

```markdown
# Projects

<!-- CONTENT MANAGEMENT INSTRUCTIONS:

To add your own project, replace any [PLACEHOLDER] entry or add a new one:

## Your Project Title
- **Category:** Choose from: Web Development, Machine Learning, Generative AI, Data Engineering, Analytics
- **Description:** 2-3 sentences describing what you built and its impact
- **Technologies:** Python, TensorFlow, React, AWS (comma-separated)
- **GitHub:** https://github.com/yourusername/repo-name
- **Demo:** https://your-demo-url.com (optional)
- **Featured:** true (appears first) or false
- **Image:** filename.png (place in src/resources/) or "placeholder" for auto-generated

See docs/ADDING_PROJECTS.md for detailed examples.
-->

## Therapeutic Riding at Normandy Farms (TRNF) Website
- **Category:** Web Development
- **Description:** I designed and developed a website for Therapeutic Riding at Normandy Farm (TRNF) and configured their AWS account to host it.
- **Technologies:** Javascript, HTML, CSS, React, AWS
- **GitHub:** https://github.com/MattBoraske/TRNF-Site
- **Demo:** https://normandyfarm.org/
- **Featured:** true
- **Image:** trnf-site-screenshot.png

## [PLACEHOLDER] Donor Sentiment Intelligence Platform
- **Category:** Machine Learning
- **Description:** Conversational AI tool analyzing plasma donor reviews to provide actionable insights for donation center managers. Implements sentiment analysis, topic modeling, and trend detection to drive operational improvements. Achieved approximately 15% improvement in average donor review scores.
- **Technologies:** Python, GPT-4, RAG, NLP, Sentiment Analysis, LangChain
- **GitHub:** https://github.com/MattBoraske/PLACEHOLDER-donor-sentiment
- **Featured:** true
- **Image:** placeholder

## [PLACEHOLDER] Natural Language to SQL Translation Engine
- **Category:** Generative AI
- **Description:** Fine-tuned Flan-T5-XL model that translates natural language queries into executable SQL, democratizing data access across the organization. Trained on mixture of SQL instruction and preference data. Reduced analyst query time by 60%.
- **Technologies:** Python, Flan-T5, Fine-tuning, SQL, HuggingFace, PEFT
- **GitHub:** https://github.com/MattBoraske/PLACEHOLDER-text-to-sql
- **Featured:** true
- **Image:** placeholder

## [PLACEHOLDER] RAG-Powered Knowledge Retrieval System
- **Category:** Generative AI
- **Description:** Production RAG system with fine-tuned embedding models enabling semantic search across organizational documentation. Implements hybrid search combining dense and sparse retrieval. Reduced information retrieval time by 40%.
- **Technologies:** Python, RAG, Vector DB, FAISS, Fine-tuned Embeddings, FastAPI
- **GitHub:** https://github.com/MattBoraske/PLACEHOLDER-rag-retrieval
- **Featured:** false
- **Image:** placeholder

## [PLACEHOLDER] Internal LLM Chat Interface
- **Category:** Generative AI
- **Description:** Secure, private chatbot interface enabling conversations with GPT-4 and Llama 3 models. Implements role-based access control, conversation history, and audit logging for enterprise compliance. Supports 200+ active users across 5 departments.
- **Technologies:** Python, GPT-4, Llama 3, React, Docker, AWS
- **GitHub:** https://github.com/MattBoraske/PLACEHOLDER-llm-chat
- **Featured:** false
- **Image:** placeholder

## [PLACEHOLDER] Reinforcement Learning Restaurant Optimizer
- **Category:** Machine Learning
- **Description:** Custom OpenAI Gym environment simulating counter-service restaurant operations. Trained PPO and A2C agents to optimize human labor allocation and minimize customer wait times. West Chester University Graduate Research project.
- **Technologies:** Python, Reinforcement Learning, PPO, A2C, OpenAI Gym
- **GitHub:** https://github.com/MattBoraske/PLACEHOLDER-rl-restaurant
- **Featured:** false
- **Image:** placeholder
```

**Step 2: Verify file**

Run: `grep -c "PLACEHOLDER" src/resources/projects.md`
Expected: See count of placeholder projects

**Step 3: Commit changes**

```bash
git add src/resources/projects.md
git commit -m "feat: add placeholder projects to projects.md"
```

---

### Task 3.2: Update Projects Component to Use Parser

**Files:**
- Modify: `src/components/Projects.astro:1-50`

**Step 1: Replace Projects.astro to use parser**

Replace content with:

```astro
---
import ProjectCard from './ProjectCard.astro';
import ProjectFilter from './ProjectFilter.astro';
import { parseProjects } from '../utils/parseProjects';

const projects = parseProjects('./src/resources/projects.md');
---

<section id="projects" class="py-24 px-6 bg-bg-secondary">
  <div class="max-w-content mx-auto">
    <div class="section-header animate-on-scroll">
      <span class="header-bracket">[</span>
      <h2 class="text-3xl md:text-4xl font-bold text-text">Projects</h2>
      <span class="header-bracket">]</span>
    </div>

    <ProjectFilter />

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project) => (
        <ProjectCard {...project} />
      ))}
    </div>
  </div>
</section>

<style>
  .section-header {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    margin-bottom: 3rem;
  }

  .header-bracket {
    font-family: var(--font-display);
    font-size: 3rem;
    color: var(--color-accent);
    font-weight: 900;
  }
</style>
```

**Step 2: Build and verify**

Run: `npm run build`
Expected: Build succeeds

Run: `npm run preview`
Navigate to: http://localhost:4321/#projects
Expected: 6 projects display (1 real + 5 placeholders)

**Step 3: Commit changes**

```bash
git add src/components/Projects.astro
git commit -m "feat: update Projects component to use parseProjects"
```

---

### Task 3.3: Add Placeholder Badge to ProjectCard

**Files:**
- Modify: `src/components/ProjectCard.astro`

**Step 1: Add isPlaceholder prop and badge**

In the Props interface, add:

```typescript
interface Props {
  title: string;
  description: string;
  image?: string;
  technologies: string[];
  category: string;
  githubUrl?: string;
  demoUrl?: string;
  featured?: boolean;
  isPlaceholder?: boolean; // Add this
}

const { title, description, image, technologies, category, githubUrl, demoUrl, featured = false, isPlaceholder = false } = Astro.props;
```

**Step 2: Add placeholder badge in markup**

After the featured badge section (around line 44), add:

```astro
{isPlaceholder && (
  <span class="placeholder-badge">
    <span class="badge-bracket">[</span>
    Demo Project
    <span class="badge-bracket">]</span>
  </span>
)}
```

**Step 3: Add placeholder badge styles**

Add to the `<style>` section:

```css
.placeholder-badge {
  font-family: var(--font-mono);
  font-size: 0.625rem;
  font-weight: 700;
  padding: 0.25rem 0.5rem;
  background: rgba(255, 255, 255, 0.05);
  color: rgba(255, 255, 255, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}
```

**Step 4: Verify in browser**

Navigate to: http://localhost:4321/#projects
Expected: Placeholder projects show "[Demo Project]" badge

**Step 5: Commit changes**

```bash
git add src/components/ProjectCard.astro
git commit -m "feat: add placeholder badge to ProjectCard"
```

---

### Task 3.4: Create ADDING_PROJECTS.md Documentation

**Files:**
- Create: `docs/ADDING_PROJECTS.md`

**Step 1: Create comprehensive project addition guide**

Create `docs/ADDING_PROJECTS.md` with the full content from the design document (see design doc section 3.4 for full text).

**Step 2: Verify file**

Run: `cat docs/ADDING_PROJECTS.md | head -20`
Expected: See documentation header

**Step 3: Commit changes**

```bash
git add docs/ADDING_PROJECTS.md
git commit -m "docs: add guide for adding and replacing projects"
```

---

## Phase 4: Professional Features

### Task 4.1: Add Plausible Analytics Script

**Files:**
- Modify: `src/layouts/Layout.astro`
- Create: `.env.example`

**Step 1: Add analytics script to Layout**

In Layout.astro `<head>`, after the canonical link, add:

```astro
<!-- Analytics -->
{import.meta.env.PUBLIC_PLAUSIBLE_DOMAIN && (
  <script
    defer
    data-domain={import.meta.env.PUBLIC_PLAUSIBLE_DOMAIN}
    src="https://plausible.io/js/script.js"
  ></script>
)}
```

**Step 2: Create .env.example**

Create `.env.example`:

```bash
# Site Configuration
PUBLIC_SITE_URL=https://www.mattboraske.com

# Analytics (Optional)
# Sign up at https://plausible.io and add your domain
PUBLIC_PLAUSIBLE_DOMAIN=mattboraske.com
```

**Step 3: Add .env to .gitignore**

Run: `echo ".env" >> .gitignore`

**Step 4: Verify analytics script in HTML**

Run: `npm run build && grep -A 2 "plausible" dist/index.html`
Expected: See commented-out script (since env var not set locally)

**Step 5: Commit changes**

```bash
git add src/layouts/Layout.astro .env.example .gitignore
git commit -m "feat: add Plausible analytics integration with env var"
```

---

### Task 4.2: Improve RSS Error Handling

**Files:**
- Modify: `src/lib/rss.ts`

**Step 1: Update rss.ts with retry logic and better errors**

Replace `src/lib/rss.ts` with:

```typescript
export interface Article {
  title: string;
  link: string;
  pubDate: string;
  description: string;
}

export interface FetchResult {
  articles: Article[];
  error?: string;
}

export async function fetchMediumArticles(
  username: string,
  limit: number = 4
): Promise<FetchResult> {
  const maxRetries = 3;
  const retryDelay = 1000; // 1 second

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const feedUrl = `https://medium.com/feed/@${username}`;
      const response = await fetch(
        `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feedUrl)}`,
        {
          signal: AbortSignal.timeout(5000) // 5 second timeout
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.status !== 'ok') {
        throw new Error(`RSS feed error: ${data.message || 'Unknown error'}`);
      }

      const articles = data.items.slice(0, limit).map((item: any) => ({
        title: item.title,
        link: item.link,
        pubDate: new Date(item.pubDate).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
        description: item.description
          .replace(/<[^>]*>/g, '')
          .substring(0, 150) + '...',
      }));

      return { articles };

    } catch (error) {
      const isLastAttempt = attempt === maxRetries - 1;
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';

      console.error(`Attempt ${attempt + 1}/${maxRetries} failed:`, errorMessage);

      if (isLastAttempt) {
        return {
          articles: [],
          error: `Unable to fetch articles from Medium. Please visit my profile directly.`
        };
      }

      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, retryDelay * (attempt + 1)));
    }
  }

  return { articles: [], error: 'Failed to fetch articles after multiple attempts' };
}
```

**Step 2: Verify it compiles**

Run: `npx tsc --noEmit src/lib/rss.ts`
Expected: No errors

**Step 3: Commit changes**

```bash
git add src/lib/rss.ts
git commit -m "feat: add retry logic and better error handling to RSS fetch"
```

---

### Task 4.3: Update Writing Component with Error Fallback UI

**Files:**
- Modify: `src/components/Writing.astro`

**Step 1: Update Writing.astro to handle errors**

Replace `src/components/Writing.astro`:

```astro
---
import ArticleCard from './ArticleCard.astro';
import ExternalLink from './icons/ExternalLink.astro';
import { fetchMediumArticles } from '../lib/rss';

interface Props {
  mediumUsername?: string;
}

const { mediumUsername = 'mattboraske' } = Astro.props;

const { articles, error } = await fetchMediumArticles(mediumUsername, 4);
---

<section id="writing" class="py-24 px-6">
  <div class="max-w-content mx-auto">
    <div class="section-header animate-on-scroll">
      <span class="header-bracket">[</span>
      <h2 class="text-3xl md:text-4xl font-bold text-text">Writing</h2>
      <span class="header-bracket">]</span>
    </div>

    {error ? (
      <div class="error-card terminal-card">
        <p class="error-message">
          <span class="terminal-prompt">&gt;</span> {error}
        </p>
        <a
          href={`https://medium.com/@${mediumUsername}`}
          target="_blank"
          rel="noopener noreferrer"
          class="medium-link"
        >
          <span>Visit Medium Profile</span>
          <span class="link-arrow">→</span>
        </a>
      </div>
    ) : (
      <>
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
      </>
    )}
  </div>
</section>

<style>
  .section-header {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    margin-bottom: 3rem;
  }

  .header-bracket {
    font-family: var(--font-display);
    font-size: 3rem;
    color: var(--color-accent);
    font-weight: 900;
  }

  .error-card {
    padding: 2rem;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
  }

  .error-message {
    font-family: var(--font-mono);
    font-size: 0.875rem;
    color: rgba(255, 255, 255, 0.7);
  }

  .terminal-prompt {
    color: var(--color-accent);
    font-weight: 700;
    margin-right: 0.5rem;
  }

  .medium-link {
    font-family: var(--font-mono);
    font-size: 0.875rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--color-accent);
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.5rem;
    border: 1px solid var(--color-accent);
    border-radius: 4px;
    transition: all 0.3s ease;
  }

  .medium-link:hover {
    background: rgba(0, 255, 255, 0.1);
    box-shadow: 0 0 20px var(--color-glow);
  }

  .link-arrow {
    opacity: 0;
    transform: translateX(-5px);
    transition: all 0.3s ease;
  }

  .medium-link:hover .link-arrow {
    opacity: 1;
    transform: translateX(0);
  }
</style>
```

**Step 2: Test error fallback locally**

Note: To test, you could temporarily break the RSS URL, but for now we'll verify during build.

Run: `npm run build`
Expected: Build succeeds (RSS might actually work or show fallback)

**Step 3: Commit changes**

```bash
git add src/components/Writing.astro
git commit -m "feat: add error fallback UI for Writing section"
```

---

### Task 4.4: Add Structured Data Component

**Files:**
- Create: `src/components/StructuredData.astro`

**Step 1: Create StructuredData component**

Create `src/components/StructuredData.astro`:

```astro
---
interface Props {
  type: 'person' | 'website';
}

const { type } = Astro.props;

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Matthew Boraske",
  "jobTitle": "Data Scientist",
  "description": "Data Scientist specializing in AI/ML, NLP, and Generative AI",
  "url": "https://www.mattboraske.com",
  "image": "https://www.mattboraske.com/og-image.png",
  "sameAs": [
    "https://github.com/MattBoraske",
    "https://www.linkedin.com/in/matt-boraske/",
    "https://medium.com/@mattboraske"
  ],
  "worksFor": {
    "@type": "Organization",
    "name": "CSL Behring"
  },
  "alumniOf": [
    {
      "@type": "CollegeOrUniversity",
      "name": "West Chester University of Pennsylvania",
      "sameAs": "https://www.wcupa.edu/"
    },
    {
      "@type": "CollegeOrUniversity",
      "name": "The Ohio State University",
      "sameAs": "https://www.osu.edu/"
    }
  ],
  "knowsAbout": [
    "Machine Learning",
    "Natural Language Processing",
    "Generative AI",
    "Large Language Models",
    "Data Science",
    "Python",
    "Retrieval Augmented Generation"
  ]
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Matt Boraske - Data Scientist Portfolio",
  "url": "https://www.mattboraske.com",
  "description": "Portfolio showcasing AI/ML research, projects in generative AI and NLP, and technical writing",
  "author": {
    "@type": "Person",
    "name": "Matthew Boraske"
  }
};

const schema = type === 'person' ? personSchema : websiteSchema;
---

<script type="application/ld+json" set:html={JSON.stringify(schema)} />
```

**Step 2: Verify it compiles**

Run: `npx tsc --noEmit src/components/StructuredData.astro`
Expected: No errors (or warning about set:html which is expected)

**Step 3: Commit changes**

```bash
git add src/components/StructuredData.astro
git commit -m "feat: add StructuredData component for JSON-LD schema"
```

---

### Task 4.5: Add Structured Data to Layout

**Files:**
- Modify: `src/layouts/Layout.astro`

**Step 1: Import and add StructuredData to head**

Add import at top of frontmatter:

```astro
---
import '../styles/global.css';
import ScrollAnimation from '../components/ScrollAnimation.astro';
import StructuredData from '../components/StructuredData.astro';
```

In the `<head>`, before closing tag, add:

```astro
<!-- Structured Data -->
<StructuredData type="person" />
<StructuredData type="website" />
```

**Step 2: Build and verify JSON-LD in HTML**

Run: `npm run build && grep -A 5 "application/ld+json" dist/index.html | head -20`
Expected: See JSON-LD schema in HTML

**Step 3: Commit changes**

```bash
git add src/layouts/Layout.astro
git commit -m "feat: add structured data to page head"
```

---

### Task 4.6: Create AWS Amplify Deployment Documentation

**Files:**
- Create: `docs/DEPLOYMENT.md`

**Step 1: Create comprehensive deployment guide**

Create `docs/DEPLOYMENT.md` with the AWS Amplify-focused content from the design document (see design doc section 4.4 for full text).

**Step 2: Verify file**

Run: `cat docs/DEPLOYMENT.md | head -30`
Expected: See deployment guide header

**Step 3: Commit changes**

```bash
git add docs/DEPLOYMENT.md
git commit -m "docs: add AWS Amplify deployment guide"
```

---

### Task 4.7: Create Monitoring Documentation

**Files:**
- Create: `docs/MONITORING.md`

**Step 1: Create monitoring guide**

Create `docs/MONITORING.md` with content from design document (see design doc section 4.4 for full text).

**Step 2: Verify file**

Run: `wc -l docs/MONITORING.md`
Expected: See line count

**Step 3: Commit changes**

```bash
git add docs/MONITORING.md
git commit -m "docs: add site monitoring and maintenance guide"
```

---

### Task 4.8: Update README with New Sections

**Files:**
- Modify: `README.md`

**Step 1: Add deployment section to README**

After the "Commands" section, add:

```markdown
## Deployment

This site is deployed on AWS Amplify with automatic deployments on commits to main branch.

See [Deployment Guide](docs/DEPLOYMENT.md) for details on:
- Environment variables
- Custom domain setup
- Build configuration
- Troubleshooting

## Monitoring

Analytics tracked with Plausible Analytics (privacy-friendly).

See [Monitoring Guide](docs/MONITORING.md) for:
- Regular maintenance schedule
- Performance monitoring
- Link checking
- Content update workflow

## Analytics

**Platform:** Plausible Analytics
**Access:** https://plausible.io/mattboraske.com

Tracks page views, traffic sources, and popular content without cookies or personal data collection.
```

**Step 2: Update "Content Updates" section**

Replace or update the existing "Content Updates" section:

```markdown
## Content Updates

All content is managed through markdown files in `src/resources/`. See [Content Management Guide](docs/CONTENT_GUIDE.md) for detailed instructions.

**Quick updates:**
- Projects: Edit `src/resources/projects.md`
- Publications: Edit `src/resources/research.md`
- Skills: Edit `src/resources/skills.md`
- Current role: Edit `src/resources/spotlight.md`

Changes automatically deploy when pushed to main branch.
```

**Step 3: Commit changes**

```bash
git add README.md
git commit -m "docs: update README with deployment, monitoring, and content management info"
```

---

## Final Verification and Cleanup

### Task 5.1: Full Build Test

**Files:**
- None (verification only)

**Step 1: Clean and rebuild**

Run: `rm -rf dist node_modules/.vite`
Run: `npm run build`
Expected: Build succeeds with no errors

**Step 2: Run preview and test all sections**

Run: `npm run preview`

Navigate and verify:
- http://localhost:4321/ - Homepage loads
- http://localhost:4321/#about - RoleSpotlight shows
- http://localhost:4321/#experience - Timeline displays
- http://localhost:4321/#research - Publications show
- http://localhost:4321/#projects - 6 projects (1 real + 5 placeholders)
- http://localhost:4321/#writing - Articles or error fallback
- http://localhost:4321/#skills - Skills with dropdowns
- http://localhost:4321/#contact - Contact form

**Step 3: Verify all sections have terminal theme**

Check that all sections have:
- Bracketed headers `[Section Name]`
- Terminal card styling
- Consistent cyan/green accents
- Hover effects

**Step 4: Document verification completion**

Note: No commit needed, this is verification only.

---

### Task 5.2: Review Documentation Completeness

**Files:**
- Verify: All doc files exist

**Step 1: List all documentation files**

Run: `ls -1 docs/`
Expected to see:
- CONTENT_GUIDE.md
- ADDING_PROJECTS.md
- DEPLOYMENT.md
- MONITORING.md
- plans/ directory

**Step 2: Verify documentation links in README**

Run: `grep -E "\[.*\]\(docs/" README.md`
Expected: See links to all doc files

**Step 3: Document any missing pieces**

Create a TODO file if anything is incomplete:

```bash
echo "# Implementation TODOs

## Optional Enhancements
- [ ] Create actual OG image (1200x630) with terminal aesthetic
- [ ] Add timeline.md content file
- [ ] Test with actual Plausible account
- [ ] Take screenshots for project placeholders

## Future Features
- [ ] Blog section (beyond Medium)
- [ ] Case studies for projects
- [ ] Dark/light theme toggle
" > docs/TODO.md
```

**Step 4: Commit TODO file**

```bash
git add docs/TODO.md
git commit -m "docs: add TODO list for optional enhancements"
```

---

### Task 5.3: Final Commit and Summary

**Files:**
- None (final review)

**Step 1: Review git status**

Run: `git status`
Expected: Working directory clean

**Step 2: Review commit history**

Run: `git log --oneline -20`
Expected: See all phase commits in logical order

**Step 3: Create implementation summary**

Create final summary commit:

```bash
git commit --allow-empty -m "docs: complete portfolio enhancements implementation

Phase 1: Terminal theme completed across all components
Phase 2: Content management system with markdown parsers
Phase 3: Expanded portfolio with 5 placeholder projects
Phase 4: Added analytics, error handling, SEO, and docs

All phases complete and tested locally.
Ready for deployment to AWS Amplify."
```

**Step 4: Verify build one final time**

Run: `npm run build`
Expected: Clean build with no errors

---

## Execution Complete

All implementation tasks have been completed. The portfolio now features:

✅ **Phase 1:** Complete terminal theme with SEO optimization
✅ **Phase 2:** Markdown-based content management system
✅ **Phase 3:** 6-project portfolio (1 real + 5 placeholders)
✅ **Phase 4:** Analytics, error handling, structured data, comprehensive docs

**Next Steps:**
1. Push to main branch: `git push origin main`
2. AWS Amplify will auto-deploy
3. Sign up for Plausible and add domain
4. Set `PUBLIC_PLAUSIBLE_DOMAIN` in Amplify env vars
5. Replace placeholder projects over time
6. Create OG image (1200x630) when ready

**Documentation Reference:**
- Content updates: `docs/CONTENT_GUIDE.md`
- Adding projects: `docs/ADDING_PROJECTS.md`
- Deployment: `docs/DEPLOYMENT.md`
- Maintenance: `docs/MONITORING.md`
