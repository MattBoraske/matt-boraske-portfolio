# Portfolio Enhancements - Design Document

**Date:** 2025-12-25
**Author:** Matthew Boraske
**Status:** Approved - Ready for Implementation

## Overview

Comprehensive enhancements to the portfolio website focusing on **Professional Impact** and **Long-term Maintainability**. This design addresses visual consistency, content management infrastructure, portfolio expansion, and professional features.

## Goals

1. **Professional Impact**: Create a polished, cohesive portfolio that maximizes impression on recruiters and employers
2. **Long-term Maintainability**: Build sustainable content management system for easy updates without code changes

## Current State Analysis

### Strengths
- Retro-futuristic terminal aesthetic implemented across most components
- Strong technical foundation (Astro, TypeScript, Tailwind)
- Existing content parsing system for skills (`parseSkills.ts`)
- AWS Amplify auto-deployment on commits to main

### Issues Identified

**Visual Consistency:**
- Research, RoleSpotlight, Writing, ArticleCard, PublicationCard lack terminal theme
- Layout.astro imports unused Inter font (performance impact)

**Content Management:**
- Content hardcoded in components despite `/resources/*.md` files existing
- No easy way to update projects, publications, timeline without editing code
- Future maintainability concerns

**Portfolio Gaps:**
- Only 1 project shown (TRNF website)
- Missing ML/AI projects for data scientist/ML engineer role
- Doesn't showcase breadth of experience from timeline

**SEO & Discoverability:**
- Missing OpenGraph/Twitter card meta tags
- No sitemap.xml or robots.txt
- No structured data (JSON-LD) for search engines
- Social sharing shows poor/no preview

**Infrastructure:**
- Resume filename inconsistency (`resume.pdf` vs `Matthew_Boraske_Resume.pdf`)
- No analytics tracking
- RSS feed silently fails (returns empty array)
- Minimal documentation for deployment and maintenance

## Solution Architecture

### Phase 1: Polish & Consistency (2-3 hours)

**Objective:** Complete terminal theme and fix critical credibility issues.

#### 1.1 Terminal Theme Completion

**Components to Update:**

- **Research.astro** (`src/components/Research.astro`)
  - Add bracketed header: `[Research]`
  - Update section styling to match Projects/Timeline
  - Add terminal grid wrapper

- **PublicationCard.astro** (`src/components/PublicationCard.astro`)
  - Terminal card borders with neon glow
  - Chevron bullets for features/tags
  - Link hover effects with sliding arrows
  - Badge styling for venue/year
  - Hover effects: title glow, border intensity

- **RoleSpotlight.astro** (`src/components/RoleSpotlight.astro`)
  - Bracketed header: `[What I Do]`
  - Terminal-style role badge with brackets
  - Paragraph styling with left border accents
  - Company badge with neon border

- **Writing.astro** (`src/components/Writing.astro`)
  - Bracketed header: `[Writing]`
  - Terminal section styling

- **ArticleCard.astro** (`src/components/ArticleCard.astro`)
  - Match ProjectCard terminal aesthetic
  - Terminal card with neon borders
  - Date badge with brackets: `[DEC 25, 2025]`
  - Hover effects with title glow
  - Description with terminal styling
  - "Read More" link with sliding arrow

**Design Patterns:**
```css
/* Consistent across all cards */
.terminal-card {
  background: rgba(10, 14, 39, 0.95);
  border: 1px solid rgba(0, 255, 255, 0.3);
  transition: all 0.3s ease;
}

.terminal-card:hover {
  border-color: var(--color-accent);
  box-shadow: 0 0 20px var(--color-glow);
}

/* Bracketed headers */
.header-bracket {
  font-family: var(--font-display);
  font-size: 3rem;
  color: var(--color-accent);
  font-weight: 900;
}
```

#### 1.2 Resume Filename Fix

**Decision:** Standardize on `resume.pdf`

- Rename `public/resume.pdf` → Keep as is
- Update README.md references from `Matthew_Boraske_Resume.pdf` → `resume.pdf`
- Verify Contact.astro download link
- Test download functionality

#### 1.3 SEO Meta Tags

**Update:** `src/layouts/Layout.astro`

**OpenGraph Tags:**
```html
<meta property="og:title" content={title} />
<meta property="og:description" content={description} />
<meta property="og:image" content="/og-image.png" />
<meta property="og:url" content="https://www.mattboraske.com" />
<meta property="og:type" content="website" />
```

**Twitter Card Tags:**
```html
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content={title} />
<meta name="twitter:description" content={description} />
<meta name="twitter:image" content="/og-image.png" />
```

**Additional Meta:**
```html
<meta name="author" content="Matthew Boraske" />
<link rel="canonical" href="https://www.mattboraske.com" />
```

**OG Image Creation:**
- Size: 1200x630px
- Design: Terminal aesthetic with name/title
- Background: Deep space blue with grid
- Text: "Matthew Boraske | Data Scientist | AI/ML Engineer"
- Cyan/green accents matching theme
- Save as: `public/og-image.png`

#### 1.4 Sitemap & Robots.txt

**Install Sitemap Integration:**
```bash
npm install @astrojs/sitemap
```

**Update:** `astro.config.mjs`
```javascript
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://www.mattboraske.com',
  integrations: [tailwind(), sitemap()]
});
```

**Create:** `public/robots.txt`
```
User-agent: *
Allow: /

Sitemap: https://www.mattboraske.com/sitemap-index.xml
```

#### 1.5 Font Cleanup

**Update:** `src/layouts/Layout.astro`
- Remove lines 20-22 (Inter font import)
- Verify Orbitron and Space Mono still load via global.css
- Test all typography still renders correctly

---

### Phase 2: Content Infrastructure (3-4 hours)

**Objective:** Create maintainable content management system following the `parseSkills.ts` pattern.

#### 2.1 Content Type Definitions

**Create:** `src/types/content.ts`

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
```

#### 2.2 Content Parsers

**Create:** `src/utils/parseProjects.ts`

```typescript
import fs from 'node:fs';
import type { Project } from '../types/content';

export function parseProjects(filePath: string): Project[] {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const sections = content.split(/^## /gm).filter(Boolean).slice(1);

    return sections.map(section => {
      const lines = section.split('\n');
      const title = lines[0].trim();
      const isPlaceholder = title.startsWith('[PLACEHOLDER]');

      const getField = (field: string): string => {
        const line = lines.find(l => l.trim().startsWith(`- **${field}:**`));
        return line ? line.split(':**')[1].trim() : '';
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
        featured: getField('Featured') === 'true',
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

**Create:** `src/utils/parsePublications.ts`

```typescript
import fs from 'node:fs';
import type { Publication } from '../types/content';

export function parsePublications(filePath: string): Publication[] {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const sections = content.split(/^## /gm).filter(Boolean).slice(1);

    return sections.map(section => {
      const lines = section.split('\n');
      const title = lines[0].trim();

      const getField = (field: string): string => {
        const line = lines.find(l => l.trim().startsWith(`- **${field}:**`));
        return line ? line.split(':**')[1].trim() : '';
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

**Create:** `src/utils/parseTimeline.ts`

```typescript
import fs from 'node:fs';
import type { Experience } from '../types/content';

export function parseTimeline(filePath: string): Experience[] {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const sections = content.split(/^## /gm).filter(Boolean).slice(1);

    return sections.map(section => {
      const lines = section.split('\n');
      const title = lines[0].trim();

      const getField = (field: string): string => {
        const line = lines.find(l => l.trim().startsWith(`- **${field}:**`));
        return line ? line.split(':**')[1].trim() : '';
      };

      const getBullets = (): string[] => {
        const bulletStart = lines.findIndex(l => l.trim().startsWith('- **Bullets:**'));
        if (bulletStart === -1) return [];

        const bullets: string[] = [];
        for (let i = bulletStart + 1; i < lines.length; i++) {
          if (lines[i].trim().startsWith('  - ')) {
            bullets.push(lines[i].trim().substring(4));
          } else if (lines[i].trim().startsWith('- **')) {
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
        role: title,
        dateRange,
        description: bullets.length === 0 ? getField('Description') : undefined,
        bullets: bullets.length > 0 ? bullets : undefined,
        technologies,
        isCurrent: dateRange.toLowerCase().includes('present'),
        type: getField('Type') as 'work' | 'education',
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

**Create:** `src/utils/parseRoleSpotlight.ts`

```typescript
import fs from 'node:fs';
import type { RoleSpotlight } from '../types/content';

export function parseRoleSpotlight(filePath: string): RoleSpotlight {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n').filter(l => l.trim());

    const getField = (field: string): string => {
      const line = lines.find(l => l.startsWith(`**${field}:**`));
      return line ? line.split(':**')[1].trim() : '';
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

#### 2.3 Restructure Markdown Content Files

**Update:** `src/resources/projects.md`

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
- **Image:** filename.png (place in src/resources/) or leave blank for placeholder

See ADDING_PROJECTS.md for detailed examples.
-->

## Therapeutic Riding at Normandy Farms (TRNF) Website
- **Category:** Web Development
- **Description:** I designed and developed a website for Therapeutic Riding at Normandy Farm (TRNF) and configured their AWS account to host it.
- **Technologies:** Javascript, HTML, CSS, React, AWS
- **GitHub:** https://github.com/MattBoraske/TRNF-Site
- **Demo:** https://normandyfarm.org/
- **Featured:** true
- **Image:** trnf-site-screenshot.png
```

**Create:** `src/resources/research.md`

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

**Create:** `src/resources/timeline.md`

(Convert existing Timeline.astro data to markdown format)

**Update:** `src/resources/spotlight.md`

```markdown
# Role Spotlight

**Company:** CSL Behring
**Role:** Data Scientist

**Description:**
Currently, I serve as a functional expert in natural language processing, machine learning, and generative AI. I build AI-powered data retrieval tools using retrieval augmented generation (RAG) with fine-tuned embedding models to make information more accessible across the organization.

I led the development of a conversational AI tool that leverages plasma donor reviews to provide actionable insights for donation center managers, driving approximately a 15% improvement in average review scores. I also deployed an internal chatbot that enables private and secure conversations with GPT and Llama 3 models.

My work focuses on fine-tuning large language models for domain-specific tasks, building production AI systems, and translating complex business needs into practical generative AI solutions.
```

#### 2.4 Update Components to Use Parsers

**Update:** `src/components/Projects.astro`

```astro
---
import ProjectCard from './ProjectCard.astro';
import ProjectFilter from './ProjectFilter.astro';
import { parseProjects } from '../utils/parseProjects';

const projects = parseProjects('./src/resources/projects.md');
---
```

**Update:** `src/components/Research.astro`

```astro
---
import PublicationCard from './PublicationCard.astro';
import { parsePublications } from '../utils/parsePublications';

const publications = parsePublications('./src/resources/research.md');
---
```

**Update:** `src/components/Timeline.astro`

```astro
---
import TimelineItem from './TimelineItem.astro';
import { parseTimeline } from '../utils/parseTimeline';
import osuLogo from './icons/osu.svg';
import wcuLogo from './icons/wcu.svg';
import cslLogo from './icons/csl.svg';
import epicLogo from './icons/epic.svg';
import hondaLogo from './icons/honda.png';

const logoMap: Record<string, string> = {
  'CSL Behring': cslLogo.src,
  'Epic Systems': epicLogo.src,
  'Honda of America Manufacturing, Inc.': hondaLogo.src,
  'West Chester University of Pennsylvania': wcuLogo.src,
  'The Ohio State University': osuLogo.src
};

let experiences = parseTimeline('./src/resources/timeline.md');

// Map logo references to actual imports
experiences = experiences.map(exp => ({
  ...exp,
  logo: logoMap[exp.company] || exp.logo
}));
---
```

**Update:** `src/components/RoleSpotlight.astro`

```astro
---
import { parseRoleSpotlight } from '../utils/parseRoleSpotlight';

const spotlight = parseRoleSpotlight('./src/resources/spotlight.md');
const { company, role, description } = spotlight;
---
```

#### 2.5 Documentation

**Create:** `docs/CONTENT_GUIDE.md`

```markdown
# Content Management Guide

This guide shows you how to update portfolio content without editing code.

## Quick Reference

All content lives in `/src/resources/` as markdown files:

- `projects.md` - Project portfolio
- `research.md` - Publications and research
- `skills.md` - Technical skills (already set up)
- `timeline.md` - Work experience and education
- `spotlight.md` - Current role description

## Adding a Project

1. Open `src/resources/projects.md`
2. Add a new section at the bottom (or replace a placeholder):

```markdown
## Your Project Name
- **Category:** Machine Learning
- **Description:** 2-3 sentences about what you built and its business impact.
- **Technologies:** Python, TensorFlow, Docker, AWS
- **GitHub:** https://github.com/yourusername/repo
- **Demo:** https://demo-url.com (optional)
- **Featured:** true
- **Image:** project-screenshot.png (optional)
```

3. If you have a screenshot, save it to `src/resources/`
4. Run `npm run dev` to preview
5. Commit changes and push to trigger deployment

## Adding a Publication

Open `src/resources/research.md`:

```markdown
## Your Paper Title
- **Venue:** Conference Name or Journal
- **Year:** 2024
- **Summary:** Abstract or summary of your research.
- **Authors:** Your Name, Co-Author Name
- **Tags:** Machine Learning, NLP, Computer Vision
- **PDF:** https://link-to-pdf.com
- **GitHub:** https://github.com/yourusername/research-code
- **HuggingFace:** https://huggingface.co/username/model
```

## Updating Experience

Open `src/resources/timeline.md`:

```markdown
## Job Title
- **Company:** Company Name
- **Type:** work
- **DateRange:** January 2024 - Present
- **Description:** What you did and accomplished.
- **Technologies:** Python, AWS, React, PostgreSQL
- **Logo:** company-logo.svg (filename from src/components/icons/)

## Degree Program
- **Company:** University Name
- **Type:** education
- **DateRange:** August 2020 - May 2024
- **Bullets:**
  - Graduated with honors
  - Published thesis on XYZ
  - Research assistant for ABC project
- **Technologies:** Machine Learning, Statistics, Algorithms
- **Logo:** university-logo.svg
- **LogoSize:** w-14 h-14 (optional, defaults to w-8 h-8)
```

## Updating Current Role

Open `src/resources/spotlight.md`:

```markdown
**Company:** Your Company
**Role:** Your Title

**Description:**
First paragraph about your main responsibilities.

Second paragraph about specific achievements.

Third paragraph about your focus areas.
```

## Adding Skills

Open `src/resources/skills.md`:

```markdown
## New Skill Category

### Subcategory 1
- Skill 1
- Skill 2

### Subcategory 2
- Skill A
- Skill B
```

## Common Issues

**Images not showing:**
- Ensure image file is in `src/resources/`
- Use exact filename in markdown (case-sensitive)
- For projects: just the filename (e.g., `my-image.png`)

**Changes not appearing:**
- Restart dev server: `npm run dev`
- Clear browser cache
- Check console for errors

**Build fails:**
- Check for typos in field names (must match exactly: `**Category:**`, not `**category:**`)
- Ensure GitHub URLs are valid
- Don't use special characters in filenames

## Testing Changes Locally

```bash
# Start development server
npm run dev

# Open browser to http://localhost:4321

# Make changes to markdown files

# Save and browser will auto-reload
```

## Deploying Changes

```bash
# Add and commit your changes
git add src/resources/*.md
git commit -m "Add new project: Project Name"

# Push to main branch
git push origin main

# AWS Amplify automatically deploys
# Check status at AWS Amplify console
```

## Need Help?

See `README.md` for project structure and setup instructions.
```

**Update:** `README.md` Section

Add to Content Updates section:

```markdown
## Content Updates

All content is managed through markdown files in `src/resources/`. See [Content Management Guide](docs/CONTENT_GUIDE.md) for detailed instructions.

**Quick updates:**
- Projects: Edit `src/resources/projects.md`
- Publications: Edit `src/resources/research.md`
- Experience: Edit `src/resources/timeline.md`
- Skills: Edit `src/resources/skills.md`
- Current role: Edit `src/resources/spotlight.md`

Changes automatically deploy when pushed to main branch.
```

---

### Phase 3: Portfolio Expansion with Placeholders (1-2 hours)

**Objective:** Create professional placeholder projects that showcase expertise until replaced with real repositories.

#### 3.1 Placeholder Project Strategy

**Design Principles:**
- Based on actual work mentioned in Timeline (CSL roles, WCU research)
- Include business impact metrics
- Clear `[PLACEHOLDER]` markers
- Professional appearance
- Easy to swap with real repos

**Categories to Cover:**
- Machine Learning + NLP (2 projects)
- Generative AI (2 projects)
- Reinforcement Learning (1 project)

#### 3.2 Add Placeholder Projects

**Update:** `src/resources/projects.md`

Add these placeholder projects after the TRNF project:

```markdown
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

#### 3.3 Placeholder Indicators

**Update:** `src/components/ProjectCard.astro`

Add placeholder badge support:

```astro
---
interface Props {
  // ... existing props
  isPlaceholder?: boolean;
}

const { /* existing destructure */, isPlaceholder = false } = Astro.props;
---

<!-- After featured badge, add placeholder indicator -->
{isPlaceholder && (
  <span class="placeholder-badge">
    <span class="badge-bracket">[</span>
    Demo Project
    <span class="badge-bracket">]</span>
  </span>
)}

<style>
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
</style>
```

#### 3.4 Documentation for Swapping Placeholders

**Create:** `docs/ADDING_PROJECTS.md`

```markdown
# Adding Your Projects

## Replacing Placeholder Projects

The portfolio includes 5 placeholder projects based on your actual work. Here's how to replace them with your real GitHub repositories.

### Step-by-Step Guide

1. **Choose a placeholder to replace**

   Open `src/resources/projects.md` and find a placeholder project:
   ```markdown
   ## [PLACEHOLDER] Donor Sentiment Intelligence Platform
   ```

2. **Update the title**

   Remove `[PLACEHOLDER]` prefix:
   ```markdown
   ## Donor Sentiment Intelligence Platform
   ```

3. **Update the GitHub URL**

   Replace the placeholder URL with your actual repository:
   ```markdown
   - **GitHub:** https://github.com/MattBoraske/donor-sentiment-analysis
   ```

4. **Refine the description**

   Update with accurate details (keep business impact metrics):
   ```markdown
   - **Description:** Conversational AI analyzing donor feedback using GPT-4 and fine-tuned embeddings. Achieved 15% improvement in review scores across 12 donation centers.
   ```

5. **Add a demo (optional)**

   If you have a live demo:
   ```markdown
   - **Demo:** https://demo.mattboraske.com/donor-sentiment
   ```

6. **Add a screenshot (optional)**

   - Save screenshot as `src/resources/donor-sentiment-screenshot.png`
   - Update the Image field:
   ```markdown
   - **Image:** donor-sentiment-screenshot.png
   ```

7. **Update technologies**

   Ensure tech stack is accurate:
   ```markdown
   - **Technologies:** Python, GPT-4, RAG, PostgreSQL, FastAPI, React
   ```

### Complete Example

**Before (Placeholder):**
```markdown
## [PLACEHOLDER] Natural Language to SQL Translation Engine
- **Category:** Generative AI
- **Description:** Fine-tuned Flan-T5-XL model that translates natural language queries into executable SQL...
- **Technologies:** Python, Flan-T5, Fine-tuning, SQL, HuggingFace, PEFT
- **GitHub:** https://github.com/MattBoraske/PLACEHOLDER-text-to-sql
- **Featured:** true
- **Image:** placeholder
```

**After (Real Project):**
```markdown
## Natural Language to SQL Translation Engine
- **Category:** Generative AI
- **Description:** Fine-tuned Flan-T5-XL model enabling non-technical users to query databases using natural language. Achieved 87% accuracy on internal SQL benchmark. Reduced analyst query time by 60%.
- **Technologies:** Python, Flan-T5-XL, LoRA, SQL, PostgreSQL, HuggingFace
- **GitHub:** https://github.com/MattBoraske/nl-to-sql-engine
- **Demo:** https://sql-demo.mattboraske.com
- **Featured:** true
- **Image:** nl-to-sql-screenshot.png
```

### Adding Completely New Projects

To add a project not covered by placeholders:

```markdown
## Your New Project Title
- **Category:** Choose from: Web Development, Machine Learning, Generative AI, Data Engineering, Analytics
- **Description:** What you built, how it works, and business impact (2-3 sentences)
- **Technologies:** Python, React, AWS, PostgreSQL (comma-separated)
- **GitHub:** https://github.com/yourusername/your-repo
- **Demo:** https://demo-url.com (optional)
- **Featured:** true (or false)
- **Image:** screenshot.png (optional, or leave as "placeholder")
```

### Project Screenshot Guidelines

**Dimensions:** 1200x630px (same as OG image ratio)

**What to capture:**
- Dashboard/UI showing your project in action
- Terminal/code view for CLI tools
- Results/metrics for data science projects
- Architecture diagram for infrastructure projects

**Editing:**
- Use terminal color scheme (cyan/green accents) for consistency
- Blur any sensitive data
- Add subtle border or shadow
- Save as PNG

### Testing Changes

```bash
# Start dev server
npm run dev

# Open http://localhost:4321/#projects

# Verify:
# - Project card displays correctly
# - Screenshot loads (if added)
# - GitHub link works
# - Technologies render as tags
```

### Deployment

```bash
git add src/resources/projects.md
git add src/resources/*.png  # If you added screenshots
git commit -m "Add project: Your Project Name"
git push origin main
```

AWS Amplify will automatically rebuild and deploy.

### Project Ordering

Projects display in this order:
1. Featured projects (where `Featured: true`)
2. Non-featured projects
3. Within each group, in the order they appear in `projects.md`

To reorder, move the markdown sections in `projects.md`.

### Hiding Placeholders

Once you have enough real projects, you can:

1. Remove entire placeholder section from `projects.md`
2. Or move to bottom and set `Featured: false`

### Common Issues

**"Placeholder URL doesn't work"**
- That's expected! Replace with your real GitHub URL

**"Screenshot not showing"**
- Check filename matches exactly (case-sensitive)
- Ensure file is in `src/resources/` directory
- Try `Image: placeholder` for auto-generated icon

**"Technologies don't match my skills"**
- Update to match technologies from `skills.md`
- Maintains consistency across portfolio

### Need Inspiration?

Look at the TRNF project in `projects.md` for a real example.
```

---

### Phase 4: Professional Features (2-3 hours)

**Objective:** Add analytics, improve error handling, enhance SEO, and document AWS Amplify deployment workflow.

#### 4.1 Privacy-Focused Analytics

**Recommended:** Plausible Analytics

**Why Plausible:**
- Privacy-friendly (no cookies, GDPR compliant)
- Lightweight (< 1KB script)
- Simple dashboard
- Affordable ($9/month)

**Alternative:** Umami (self-hosted, free)

**Update:** `src/layouts/Layout.astro`

Add to `<head>` section:

```astro
{import.meta.env.PUBLIC_PLAUSIBLE_DOMAIN && (
  <script
    defer
    data-domain={import.meta.env.PUBLIC_PLAUSIBLE_DOMAIN}
    src="https://plausible.io/js/script.js"
  ></script>
)}
```

**Optional: Custom Event Tracking**

Track specific interactions:

```astro
<script>
  // Track resume downloads
  document.querySelector('a[href*="resume.pdf"]')?.addEventListener('click', () => {
    if (window.plausible) {
      window.plausible('Resume Download');
    }
  });

  // Track project clicks
  document.querySelectorAll('a[href*="github.com"]').forEach(link => {
    link.addEventListener('click', (e) => {
      if (window.plausible) {
        const projectName = e.target.closest('.project-card')?.querySelector('h3')?.textContent;
        window.plausible('Project Click', { props: { project: projectName } });
      }
    });
  });
</script>
```

**Setup:**
1. Sign up at plausible.io
2. Add domain: mattboraske.com
3. Set `PUBLIC_PLAUSIBLE_DOMAIN=mattboraske.com` in AWS Amplify env vars

#### 4.2 Improve RSS Error Handling

**Update:** `src/lib/rss.ts`

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
        { signal: AbortSignal.timeout(5000) } // 5 second timeout
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

**Update:** `src/components/Writing.astro`

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

#### 4.3 Add Structured Data (JSON-LD)

**Create:** `src/components/StructuredData.astro`

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

**Update:** `src/layouts/Layout.astro`

Add to `<head>`:

```astro
---
import StructuredData from '../components/StructuredData.astro';
---

<head>
  <!-- ... existing meta tags ... -->

  <StructuredData type="person" />
  <StructuredData type="website" />
</head>
```

#### 4.4 AWS Amplify Documentation

**Create:** `docs/DEPLOYMENT.md`

```markdown
# Deployment Guide - AWS Amplify

## Overview

This site is deployed using AWS Amplify with automatic deployments triggered on every commit to the `main` branch.

## Current Setup

**Hosting:** AWS Amplify
**Domain:** mattboraske.com (configure in Amplify console)
**Branch:** main
**Build Command:** `npm run build`
**Output Directory:** `dist/`
**Node Version:** 20

## Environment Variables

Configure in AWS Amplify Console → App Settings → Environment Variables

### Required Variables

```
PUBLIC_SITE_URL=https://www.mattboraske.com
```

### Optional Variables

```
PUBLIC_PLAUSIBLE_DOMAIN=mattboraske.com
```

## Deployment Workflow

### Automatic Deployment

1. Make changes locally
2. Commit to main branch:
   ```bash
   git add .
   git commit -m "Description of changes"
   git push origin main
   ```
3. AWS Amplify automatically:
   - Detects the commit
   - Runs build process
   - Deploys to production
   - Invalidates CDN cache

### Build Process

AWS Amplify runs these commands:

```bash
npm ci
npm run build
```

Build output goes to `dist/` directory and is served via CloudFront CDN.

## Monitoring Deployments

### Via AWS Amplify Console

1. Log into AWS Console
2. Navigate to AWS Amplify
3. Select your app
4. View build history, logs, and deployment status

### Build Status

Each commit triggers a new build with stages:
- Provision
- Build
- Deploy
- Verify

Check build logs for errors or warnings.

## Custom Domain Setup

### Adding Your Domain

1. AWS Amplify Console → Domain Management
2. Add domain: mattboraske.com
3. AWS provides DNS records to configure
4. Update DNS at your domain registrar
5. Wait for DNS propagation (up to 48 hours)
6. AWS automatically provisions SSL certificate (Let's Encrypt)

### DNS Configuration

**For root domain (mattboraske.com):**
- Type: A
- Points to: Amplify-provided CloudFront distribution

**For www subdomain:**
- Type: CNAME
- Points to: Amplify-provided hostname

### HTTPS

- Automatically enabled via AWS Certificate Manager
- Redirects HTTP → HTTPS automatically
- Certificate auto-renews

## Environment Management

### Adding Environment Variables

1. Amplify Console → App Settings → Environment Variables
2. Click "Manage variables"
3. Add key-value pairs
4. Redeploy for changes to take effect

**Important:** Variables prefixed with `PUBLIC_` are embedded in client-side code.

### Local Development Environment

Create `.env` file (not committed to git):

```bash
PUBLIC_SITE_URL=http://localhost:4321
PUBLIC_PLAUSIBLE_DOMAIN=localhost
```

## Rollback Procedure

### Via Console

1. Amplify Console → Build History
2. Find previous successful build
3. Click "Redeploy this version"

### Via Git

```bash
# Find commit hash of working version
git log --oneline

# Reset to that commit
git reset --hard <commit-hash>

# Force push (use with caution)
git push origin main --force
```

## Build Configuration

**File:** `amplify.yml` (if needed for custom build settings)

```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm ci
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: dist
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
```

Currently using default Amplify auto-detection, but add this file if you need custom build steps.

## Performance Optimization

### Amplify Features Enabled

- CloudFront CDN (global edge locations)
- Automatic image optimization
- Brotli compression
- HTTP/2 support
- Asset caching

### Cache Headers

Amplify automatically sets cache headers:
- HTML: No cache (always fresh)
- Assets (JS/CSS): 1 year (with content hashing)
- Images: 1 year

## Troubleshooting

### Build Fails

**Check Node version:**
- Amplify uses Node 20 (verify in build settings)

**Check build logs:**
1. Amplify Console → Build History
2. Click failed build
3. Expand "Build" phase
4. Review error messages

**Common issues:**
- Missing dependencies: Run `npm install` locally first
- TypeScript errors: Run `npm run astro check`
- Environment variables not set

### Site Not Updating

**Clear CloudFront cache:**
1. Amplify Console → Build History
2. Latest build → "Redeploy this version"

**Hard refresh browser:**
- Chrome/Firefox: Ctrl+Shift+R (Cmd+Shift+R on Mac)
- Clear browser cache

### Images Not Loading

- Ensure images are in `public/` directory
- Check file paths (case-sensitive)
- Verify files are committed to git
- Check build logs for missing file warnings

### Custom Domain Not Working

- Verify DNS records match Amplify requirements
- Wait for DNS propagation (up to 48 hours)
- Check SSL certificate status in Amplify Console
- Ensure domain is verified

## Post-Deployment Checklist

After each significant deployment:

- [ ] Visit site and verify all sections load
- [ ] Test navigation links
- [ ] Check mobile responsiveness
- [ ] Verify contact form works
- [ ] Test resume download
- [ ] Check Medium articles load
- [ ] Verify social share preview (LinkedIn, Twitter)
- [ ] Check console for JavaScript errors
- [ ] Test on different browsers (Chrome, Firefox, Safari)

## Analytics Access

**Plausible Analytics:** https://plausible.io/mattboraske.com

Monitor:
- Daily visitors
- Popular pages
- Referral sources
- Geographic distribution

## Regular Maintenance

### Weekly
- Check build status
- Review analytics for traffic patterns

### Monthly
- Update content (projects, blog posts)
- Review contact form submissions
- Check for broken links

### Quarterly
- Update dependencies: `npm update`
- Run security audit: `npm audit`
- Test full build locally

### Annually
- Review and update resume
- Major dependency upgrades
- Performance audit (Lighthouse)
- SEO audit

## Support Resources

**AWS Amplify Documentation:** https://docs.aws.amazon.com/amplify/
**Astro Documentation:** https://docs.astro.build/
**Build Issues:** Check GitHub repository issues
```

**Create:** `docs/MONITORING.md`

```markdown
# Site Monitoring & Maintenance

## Analytics Dashboard

**Platform:** Plausible Analytics
**URL:** https://plausible.io/mattboraske.com

### Key Metrics to Monitor

**Traffic:**
- Unique visitors (daily, weekly, monthly)
- Pageviews
- Bounce rate
- Session duration

**Popular Pages:**
- Which sections get most traffic?
- Are visitors viewing projects?
- Do they read publications?

**Traffic Sources:**
- Direct (URL typed in browser)
- Search (Google, Bing)
- Social (LinkedIn, Twitter)
- Referrals (other sites linking to you)

**Custom Events (if configured):**
- Resume downloads
- Project link clicks
- Contact form submissions
- External link clicks (GitHub, HuggingFace)

### Weekly Review

Check analytics every Monday:
- Total visitors last week
- Most viewed sections
- Traffic sources that are working
- Any unusual spikes or drops

Use insights to:
- Identify which projects resonate with visitors
- Understand which social platforms drive traffic
- Spot broken links (high bounce on specific pages)

## Content Update Schedule

### Weekly Tasks

**Check for updates:**
- [ ] Any new Medium articles published? (auto-fetches, but verify)
- [ ] Contact form submissions to respond to
- [ ] Comments on LinkedIn/Medium to engage with

### Monthly Tasks

**Content review:**
- [ ] Review analytics for underperforming sections
- [ ] Update spotlight description if role changed
- [ ] Add new projects (if completed)
- [ ] Update skills if learned new technologies

**Technical checks:**
- [ ] Test contact form submission
- [ ] Verify all external links work
- [ ] Check mobile version on actual device
- [ ] Review page load speed (should be < 2s)

### Quarterly Tasks

**Dependency updates:**
```bash
# Check for outdated packages
npm outdated

# Update dependencies
npm update

# Test build
npm run build

# Test locally
npm run preview
```

**Content refresh:**
- [ ] Add new publications (if any)
- [ ] Replace placeholder projects with real repos
- [ ] Update experience if changed jobs
- [ ] Refresh project descriptions with new metrics

**SEO check:**
- [ ] Google Search Console: Review crawl errors
- [ ] Submit updated sitemap if major changes
- [ ] Check keyword rankings (your name, key skills)

### Annual Tasks

**Major updates:**
- [ ] Update resume PDF
- [ ] Refresh OG image if branding changes
- [ ] Major dependency upgrades (Astro, Tailwind)
- [ ] Performance audit with Lighthouse
- [ ] Accessibility audit
- [ ] Full content review and refresh

**Analytics review:**
- Annual traffic trends
- Most successful content
- Traffic source breakdown
- Goal achievement (job offers, collaborations)

## Link Maintenance

### Check These Links Monthly

**Internal:**
- Navigation links (Home, Research, Projects, etc.)
- Anchor links (#research, #projects, etc.)
- Resume download link

**External:**
- GitHub profile/repositories
- LinkedIn profile
- Medium profile
- Research paper PDFs
- HuggingFace collections
- Live project demos

**Tool:** Use linkinator or similar

```bash
# Install linkinator
npm install -g linkinator

# Check for broken links
linkinator http://localhost:4321 --recurse
```

## Performance Monitoring

### Target Metrics (Lighthouse)

- Performance: > 90
- Accessibility: > 95
- Best Practices: > 95
- SEO: 100

### Run Monthly

```bash
npm run build
npm run preview
# Open Chrome DevTools → Lighthouse → Generate Report
```

### Common Issues

**Low performance:**
- Large images not optimized
- Too many third-party scripts
- Blocking resources

**Low accessibility:**
- Missing alt text on images
- Poor color contrast
- Keyboard navigation issues

## Error Tracking

### Where to Look

**Build errors:**
- AWS Amplify Console → Build History

**Runtime errors:**
- Browser console (open site, F12)
- Check for JavaScript errors

**RSS feed errors:**
- Check Writing section for fallback message
- Test Medium feed: https://medium.com/feed/@mattboraske

### Common Issues

**Medium articles not loading:**
- RSS2JSON API might be down
- Rate limiting (too many requests)
- Medium username changed

**Images not showing:**
- File path incorrect
- File not committed to git
- CDN cache not invalidated

**Contact form not working:**
- Formspree quota exceeded
- Form ID incorrect
- CORS issues

## Backup Strategy

### What's Already Backed Up

- **Code:** GitHub repository
- **Content:** Markdown files in repository
- **Deployments:** AWS Amplify keeps build history

### Additional Backups (Recommended)

**Resume:** Keep master copy in cloud storage (Google Drive, Dropbox)

**Images:** Backup `src/resources/` folder

**Analytics:** Export Plausible data quarterly

## Incident Response

### Site Down

1. Check AWS Amplify status page
2. Check latest build in Amplify Console
3. If build failed, check error logs
4. If build succeeded but site down, check domain DNS
5. Rollback to previous version if needed

### Unexpected Traffic Spike

1. Check analytics for traffic source
2. If legitimate (viral post, job posting), celebrate!
3. If suspicious (bot traffic), review in Plausible
4. Check AWS billing (unlikely to be significant cost)

### Security Issue

1. Immediately rotate any exposed credentials
2. Check for unusual commits in GitHub
3. Review AWS Amplify build logs
4. Contact AWS Support if compromise suspected

## Maintenance Checklist Template

Copy to use for monthly reviews:

```markdown
# Maintenance Check - [Month Year]

## Analytics Review
- [ ] Total visitors: _____
- [ ] Top page: _____
- [ ] Top referrer: _____
- [ ] Resume downloads: _____

## Content Updates
- [ ] New projects added: _____
- [ ] Publications updated: _____
- [ ] Spotlight refreshed: Yes/No
- [ ] Skills updated: Yes/No

## Technical Checks
- [ ] Contact form tested: Working/Issues
- [ ] All links checked: OK/Broken
- [ ] Mobile tested: OK/Issues
- [ ] Build status: Passing/Failing

## Action Items
- [ ] ___________________________
- [ ] ___________________________
- [ ] ___________________________

## Notes
___________________________________
___________________________________
```

## Automation Opportunities

### Consider Adding

**GitHub Actions:**
- Run link checker on PRs
- Lighthouse CI on deployments
- Automated dependency updates (Dependabot)

**Monitoring Services:**
- Uptime monitoring (UptimeRobot, Pingdom)
- Error tracking (Sentry for JS errors)

**Content Automation:**
- Auto-update Medium articles daily (if feed is critical)
- Scheduled screenshots for project placeholders

## Support & Resources

**Documentation:**
- This guide (you're reading it!)
- `docs/CONTENT_GUIDE.md` - Content updates
- `docs/ADDING_PROJECTS.md` - Project management
- `README.md` - Setup and overview

**External Resources:**
- AWS Amplify Docs: https://docs.aws.amazon.com/amplify/
- Astro Docs: https://docs.astro.build/
- Plausible Docs: https://plausible.io/docs

**Community:**
- Astro Discord: https://astro.build/chat
- GitHub Issues: For code-related questions
```

**Update:** `README.md`

Add these sections:

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

---

## Success Criteria

### Phase 1 Complete When:
- [ ] All sections have consistent terminal theme
- [ ] Resume downloads successfully
- [ ] Social sharing shows proper preview
- [ ] Sitemap exists and is discoverable

### Phase 2 Complete When:
- [ ] All content parsed from markdown files
- [ ] Components use parsers instead of hardcoded data
- [ ] Adding a project only requires editing projects.md
- [ ] Documentation exists for content management

### Phase 3 Complete When:
- [ ] 5-6 projects display in portfolio
- [ ] Placeholders clearly marked
- [ ] Documentation exists for swapping placeholders
- [ ] Projects showcase diverse ML/AI work

### Phase 4 Complete When:
- [ ] Analytics tracking visitor data
- [ ] RSS failures show graceful fallback
- [ ] Structured data present for SEO
- [ ] AWS Amplify deployment fully documented

## Implementation Timeline

**Total Estimated Time:** 8-12 hours

- Phase 1: 2-3 hours
- Phase 2: 3-4 hours
- Phase 3: 1-2 hours
- Phase 4: 2-3 hours

Can be completed over 2-3 focused work sessions.

## Risk Assessment

**Low Risk:**
- Terminal theme updates (visual only)
- Documentation creation
- Adding placeholders

**Medium Risk:**
- Content parsing system (requires testing)
- RSS error handling (needs fallback testing)

**Mitigation:**
- Test locally before deploying
- Commit frequently with descriptive messages
- Can rollback via git if issues arise

## Next Steps After Implementation

1. **Content Population:**
   - Replace placeholder projects with real repositories
   - Add project screenshots
   - Write blog posts to populate Writing section

2. **Ongoing Maintenance:**
   - Follow monitoring schedule in MONITORING.md
   - Update content quarterly
   - Track analytics for insights

3. **Future Enhancements:**
   - Blog section (beyond Medium integration)
   - Case studies for major projects
   - Testimonials/recommendations
   - Dark/light theme toggle (if desired beyond terminal aesthetic)
