# Hobbies Section Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a new "Hobbies" section with tabbed interface showcasing trail log, media tracking, fitness journey, and dog profile.

**Architecture:** Single-section component with client-side tab navigation. Hybrid data approach using markdown parsers for static content (trips, fitness, Bella) and API endpoints for dynamic media tracking (books, movies, shows, games).

**Tech Stack:** Astro, TypeScript, RSS feed parsing (Goodreads, Letterboxd, Backloggd), Trakt API, vanilla JavaScript for tab state.

---

## Phase 1: Base Structure & Tab Navigation

### Task 1: Create types for hobbies data

**Files:**
- Modify: `src/types/content.ts`

**Step 1: Add Adventure interface**

```typescript
export interface Adventure {
  title: string;
  location: string;
  date: string;
  duration: string;
  distance: string;
  elevationGain: string;
  difficulty: string;
  highlights?: string[];
  photos?: string[];
}
```

Add this after the existing `Experience` interface.

**Step 2: Add FitnessData interface**

```typescript
export interface FitnessData {
  prs: { exercise: string; weight: string }[];
  journey: string;
  photos?: string[];
}
```

**Step 3: Add BellaProfile interface**

```typescript
export interface BellaProfile {
  about: string;
  age: string;
  breed: string;
  favoriteThings: string;
  story: string;
  photos?: string[];
}
```

**Step 4: Add MediaItem interface**

```typescript
export interface MediaItem {
  title: string;
  coverUrl?: string;
  author?: string; // For books
  platform?: string; // For games
  rating?: string;
  date?: string;
  status: 'current' | 'completed';
  type: 'book' | 'movie' | 'show' | 'game';
}
```

**Step 5: Verify types compile**

Run: `npx tsc --noEmit`
Expected: No errors

**Step 6: Commit**

```bash
git add src/types/content.ts
git commit -m "feat: add types for hobbies section data"
```

---

### Task 2: Create empty Hobbies component with tab structure

**Files:**
- Create: `src/components/Hobbies.astro`

**Step 1: Create basic component structure**

```astro
---
// Empty for now - will add imports and data later
---

<section id="hobbies" class="py-24 px-6 bg-bg">
  <div class="max-w-content mx-auto">
    <div class="section-header animate-on-scroll">
      <span class="header-bracket">[</span>
      <h2 class="text-3xl md:text-4xl font-bold text-text">Hobbies</h2>
      <span class="header-bracket">]</span>
    </div>

    <!-- Tab Navigation -->
    <div class="tab-nav">
      <button class="tab-button active" data-tab="trail-log">
        <span class="tab-bracket">[</span>
        Trail Log
        <span class="tab-bracket">]</span>
      </button>
      <button class="tab-button" data-tab="media">
        <span class="tab-bracket">[</span>
        Currently Enjoying
        <span class="tab-bracket">]</span>
      </button>
      <button class="tab-button" data-tab="fitness">
        <span class="tab-bracket">[</span>
        Fitness
        <span class="tab-bracket">]</span>
      </button>
      <button class="tab-button" data-tab="bella">
        <span class="tab-bracket">[</span>
        Meet Bella
        <span class="tab-bracket">]</span>
      </button>
    </div>

    <!-- Tab Content -->
    <div class="tab-content active" data-content="trail-log">
      <p class="text-text-secondary">Trail Log content coming soon...</p>
    </div>
    <div class="tab-content" data-content="media">
      <p class="text-text-secondary">Media content coming soon...</p>
    </div>
    <div class="tab-content" data-content="fitness">
      <p class="text-text-secondary">Fitness content coming soon...</p>
    </div>
    <div class="tab-content" data-content="bella">
      <p class="text-text-secondary">Bella profile coming soon...</p>
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

  .tab-nav {
    display: flex;
    gap: 1rem;
    margin-bottom: 2rem;
    flex-wrap: wrap;
    justify-content: center;
  }

  .tab-button {
    font-family: var(--font-mono);
    font-size: 0.875rem;
    font-weight: 700;
    padding: 0.75rem 1.5rem;
    background: var(--color-bg-secondary);
    color: var(--color-text-secondary);
    border: 2px solid var(--color-border);
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .tab-bracket {
    color: var(--color-border);
    font-weight: 900;
    transition: color 0.3s ease;
  }

  .tab-button:hover {
    border-color: var(--color-accent);
    color: var(--color-accent);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px var(--color-glow);
  }

  .tab-button:hover .tab-bracket {
    color: var(--color-accent);
  }

  .tab-button.active {
    background: var(--color-accent-bg-hover);
    border-color: var(--color-accent);
    color: var(--color-accent);
    box-shadow: 0 0 20px var(--color-glow);
  }

  .tab-button.active .tab-bracket {
    color: var(--color-accent);
  }

  .tab-content {
    display: none;
    min-height: 400px;
  }

  .tab-content.active {
    display: block;
    animation: fadeIn 0.3s ease;
  }

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

<script>
  // Tab switching logic
  const tabButtons = document.querySelectorAll('.tab-button');
  const tabContents = document.querySelectorAll('.tab-content');

  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const tabName = button.getAttribute('data-tab');

      // Remove active class from all buttons and contents
      tabButtons.forEach(btn => btn.classList.remove('active'));
      tabContents.forEach(content => content.classList.remove('active'));

      // Add active class to clicked button and corresponding content
      button.classList.add('active');
      const activeContent = document.querySelector(`[data-content="${tabName}"]`);
      if (activeContent) {
        activeContent.classList.add('active');
      }
    });
  });
</script>
```

**Step 2: Add Hobbies component to homepage**

Modify: `src/pages/index.astro`

Add import after other imports:
```typescript
import Hobbies from '../components/Hobbies.astro';
```

Add component before Contact section (after Skills):
```astro
<Skills />
<Hobbies />
<Contact formspreeId="mdanprvn" />
```

**Step 3: Test in browser**

Run: `npm run dev`
Navigate to: http://localhost:4321/
Expected: See "Hobbies" section with 4 tabs, clicking tabs changes content

**Step 4: Commit**

```bash
git add src/components/Hobbies.astro src/pages/index.astro
git commit -m "feat: add hobbies section with tab navigation"
```

---

## Phase 2: Trail Log

### Task 3: Create markdown content for trail log

**Files:**
- Modify: `src/resources/hobbies.md`

**Step 1: Add sample trail log entry**

```markdown
# Trail Log

## Appalachian Trail - Georgia Section
**Location:** Springer Mountain to Neels Gap, GA
**Date:** March 2024
**Duration:** 4 days, 3 nights
**Distance:** 31.2 miles
**Elevation Gain:** 6,800 ft
**Difficulty:** Moderate

### Highlights
- First section hike of the AT
- Summit of Blood Mountain in thick fog
- Met through-hikers at Mountain Crossings

### Photos
- placeholder-trail-1.jpg
- placeholder-trail-2.jpg

---

## John Muir Trail - Section Hike
**Location:** Yosemite Valley to Tuolumne Meadows, CA
**Date:** August 2023
**Duration:** 6 days, 5 nights
**Distance:** 47.5 miles
**Elevation Gain:** 9,200 ft
**Difficulty:** Strenuous

### Highlights
- Witnessed incredible sunrise from Half Dome
- Crystal clear alpine lakes
- Encountered friendly marmots

### Photos
- placeholder-trail-3.jpg

---

# Bella Profile

## Meet Bella

### About
Bella is a 5-year-old Staffordshire Pitbull rescue with more energy than sense. She loves hiking, belly rubs, and stealing socks.

**Age:** 5 years
**Breed:** Staffordshire Pitbull
**Favorite Things:** Hiking trails, squeaky toys, napping in sunbeams

### Our Story
Adopted Bella from the local shelter in 2020. She was nervous at first but quickly became the most loyal companion. Now she's my constant hiking buddy and the best decision I ever made.

### Photos
- placeholder-bella-1.jpg
- placeholder-bella-2.jpg
```

**Step 2: Commit**

```bash
git add src/resources/hobbies.md
git commit -m "feat: add sample trail log and Bella profile content"
```

---

### Task 4: Create parseAdventures utility

**Files:**
- Create: `src/utils/parseAdventures.ts`

**Step 1: Write parser function**

```typescript
import * as fs from 'node:fs';
import type { Adventure } from '../types/content';

export function parseAdventures(filePath: string): Adventure[] {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');

    // Extract only the Trail Log section
    const trailLogMatch = content.match(/# Trail Log\n([\s\S]*?)(?=\n# |\n---\n\n# |$)/);
    if (!trailLogMatch) return [];

    const trailLogContent = trailLogMatch[1];

    // Split by ## headers
    const sections = trailLogContent.split(/^## /gm).filter(Boolean);

    return sections.map(section => {
      const lines = section.split('\n').filter(l => l.trim());
      const title = lines[0].trim();

      const getField = (field: string): string => {
        const line = lines.find(l => l.trim().startsWith(`**${field}:**`));
        if (!line) return '';
        const parts = line.split(':**');
        return parts.length > 1 ? parts[1].trim() : '';
      };

      // Get highlights from ### Highlights section
      const getHighlights = (): string[] => {
        const highlightsStart = lines.findIndex(l => l.trim() === '### Highlights');
        if (highlightsStart === -1) return [];

        const highlights: string[] = [];
        for (let i = highlightsStart + 1; i < lines.length; i++) {
          const line = lines[i].trim();
          if (line.startsWith('###') || line.startsWith('---')) break;
          if (line.startsWith('- ')) {
            highlights.push(line.substring(2));
          }
        }
        return highlights;
      };

      // Get photos from ### Photos section
      const getPhotos = (): string[] => {
        const photosStart = lines.findIndex(l => l.trim() === '### Photos');
        if (photosStart === -1) return [];

        const photos: string[] = [];
        for (let i = photosStart + 1; i < lines.length; i++) {
          const line = lines[i].trim();
          if (line.startsWith('###') || line.startsWith('---')) break;
          if (line.startsWith('- ')) {
            photos.push(line.substring(2));
          }
        }
        return photos;
      };

      return {
        title,
        location: getField('Location'),
        date: getField('Date'),
        duration: getField('Duration'),
        distance: getField('Distance'),
        elevationGain: getField('Elevation Gain'),
        difficulty: getField('Difficulty'),
        highlights: getHighlights(),
        photos: getPhotos()
      };
    });
  } catch (error) {
    console.error('Error parsing adventures:', error);
    return [];
  }
}
```

**Step 2: Test parser manually**

Create temp test file: `test-parse.js`
```javascript
import { parseAdventures } from './src/utils/parseAdventures.ts';
console.log(JSON.stringify(parseAdventures('./src/resources/hobbies.md'), null, 2));
```

Run: `node test-parse.js`
Expected: JSON array with 2 adventures

**Step 3: Remove test file and commit**

```bash
rm test-parse.js
git add src/utils/parseAdventures.ts
git commit -m "feat: add adventures parser utility"
```

---

### Task 5: Create AdventureCard component

**Files:**
- Create: `src/components/AdventureCard.astro`

**Step 1: Write component**

```astro
---
interface Props {
  title: string;
  location: string;
  date: string;
  duration: string;
  distance: string;
  elevationGain: string;
  difficulty: string;
  highlights?: string[];
  photos?: string[];
}

const { title, location, date, duration, distance, elevationGain, difficulty, highlights = [], photos = [] } = Astro.props;
---

<article class="adventure-card terminal-card group">
  {photos && photos.length > 0 && (
    <div class="aspect-video bg-bg-secondary overflow-hidden relative">
      <div class="placeholder-container">
        <span class="text-6xl">🏔️</span>
      </div>
    </div>
  )}

  <div class="p-6">
    <h3 class="text-xl font-semibold text-text font-display card-title mb-2">{title}</h3>

    <div class="location mb-4">
      <span class="text-accent">📍</span>
      <span class="text-text-secondary font-mono text-sm">{location}</span>
    </div>

    <div class="stats-grid">
      <div class="stat-item">
        <span class="stat-label">Date</span>
        <span class="stat-value">{date}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">Duration</span>
        <span class="stat-value">{duration}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">Distance</span>
        <span class="stat-value">{distance}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">Elevation</span>
        <span class="stat-value">{elevationGain}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">Difficulty</span>
        <span class={`difficulty-badge difficulty-${difficulty.toLowerCase()}`}>{difficulty}</span>
      </div>
    </div>

    {highlights && highlights.length > 0 && (
      <div class="highlights">
        <h4 class="highlights-title">Highlights</h4>
        <ul class="highlights-list">
          {highlights.map((highlight) => (
            <li class="highlight-item">
              <span class="highlight-chevron">&gt;</span>
              <span>{highlight}</span>
            </li>
          ))}
        </ul>
      </div>
    )}
  </div>
</article>

<style>
  .adventure-card {
    transition: all 0.3s ease;
  }

  .placeholder-container {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, var(--color-bg-secondary), var(--color-border));
  }

  .location {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 1rem;
    margin-bottom: 1.5rem;
    padding: 1rem;
    background: var(--color-bg-secondary);
    border: 1px solid var(--color-border);
    border-radius: 4px;
  }

  .stat-item {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .stat-label {
    font-family: var(--font-mono);
    font-size: 0.75rem;
    color: var(--color-text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .stat-value {
    font-family: var(--font-mono);
    font-size: 0.875rem;
    color: var(--color-text);
    font-weight: 600;
  }

  .difficulty-badge {
    font-family: var(--font-mono);
    font-size: 0.75rem;
    font-weight: 700;
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    text-align: center;
    text-transform: uppercase;
    width: fit-content;
  }

  .difficulty-easy {
    background: #10b98120;
    color: #10b981;
    border: 1px solid #10b981;
  }

  .difficulty-moderate {
    background: #f59e0b20;
    color: #f59e0b;
    border: 1px solid #f59e0b;
  }

  .difficulty-strenuous {
    background: #ef444420;
    color: #ef4444;
    border: 1px solid #ef4444;
  }

  .highlights {
    margin-top: 1.5rem;
  }

  .highlights-title {
    font-family: var(--font-mono);
    font-size: 0.875rem;
    font-weight: 700;
    color: var(--color-accent);
    margin-bottom: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .highlights-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .highlight-item {
    font-family: var(--font-mono);
    font-size: 0.875rem;
    color: var(--color-text-secondary);
    display: flex;
    align-items: flex-start;
    gap: 0.5rem;
    padding-left: 0.5rem;
    border-left: 2px solid var(--color-border);
    transition: all 0.3s ease;
  }

  .highlight-item:hover {
    border-left-color: var(--color-accent);
    transform: translateX(4px);
  }

  .highlight-chevron {
    color: var(--color-accent);
    font-weight: 700;
    flex-shrink: 0;
  }

  .card-title {
    transition: all 0.3s ease;
  }

  .adventure-card:hover .card-title {
    color: var(--color-accent);
    text-shadow: 0 0 10px var(--color-glow);
  }
</style>
```

**Step 2: Commit**

```bash
git add src/components/AdventureCard.astro
git commit -m "feat: add adventure card component"
```

---

### Task 6: Integrate Trail Log into Hobbies component

**Files:**
- Modify: `src/components/Hobbies.astro`

**Step 1: Add imports**

At the top of the frontmatter:
```typescript
import AdventureCard from './AdventureCard.astro';
import { parseAdventures } from '../utils/parseAdventures';

const adventures = parseAdventures('./src/resources/hobbies.md');
```

**Step 2: Replace trail-log tab content**

Replace:
```astro
<div class="tab-content active" data-content="trail-log">
  <p class="text-text-secondary">Trail Log content coming soon...</p>
</div>
```

With:
```astro
<div class="tab-content active" data-content="trail-log">
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {adventures.map((adventure) => (
      <AdventureCard {...adventure} />
    ))}
  </div>
</div>
```

**Step 3: Test in browser**

Navigate to: http://localhost:4321/#hobbies
Expected: See 2 trail log cards with stats and highlights

**Step 4: Commit**

```bash
git add src/components/Hobbies.astro
git commit -m "feat: integrate trail log with hobbies section"
```

---

## Phase 3: Fitness Tab

### Task 7: Create fitness markdown content

**Files:**
- Create: `src/resources/fitness.md`

**Step 1: Add fitness content**

```markdown
# Fitness Journey

## Personal Records
- **Squat:** 315 lbs
- **Bench Press:** 225 lbs
- **Deadlift:** 405 lbs
- **Overhead Press:** 155 lbs

## My Journey
Started lifting in 2019 to build strength for backpacking trips. What began as functional training became a passion for progressive overload and the mental discipline that comes with consistent training. Now I focus on compound movements and maintaining strength for outdoor adventures.

### Photos
- placeholder-gym-1.jpg
- placeholder-gym-2.jpg
```

**Step 2: Commit**

```bash
git add src/resources/fitness.md
git commit -m "feat: add fitness content"
```

---

### Task 8: Create parseFitness utility

**Files:**
- Create: `src/utils/parseFitness.ts`

**Step 1: Write parser**

```typescript
import * as fs from 'node:fs';
import type { FitnessData } from '../types/content';

export function parseFitness(filePath: string): FitnessData | null {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n').filter(l => l.trim());

    // Parse PRs from ## Personal Records section
    const prsStart = lines.findIndex(l => l.trim() === '## Personal Records');
    const prs: { exercise: string; weight: string }[] = [];

    if (prsStart !== -1) {
      for (let i = prsStart + 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line.startsWith('##')) break;
        if (line.startsWith('- **')) {
          // Format: - **Exercise:** weight
          const match = line.match(/- \*\*(.+?):\*\* (.+)/);
          if (match) {
            prs.push({ exercise: match[1], weight: match[2] });
          }
        }
      }
    }

    // Parse journey text from ## My Journey section
    const journeyStart = lines.findIndex(l => l.trim() === '## My Journey');
    let journey = '';

    if (journeyStart !== -1) {
      for (let i = journeyStart + 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line.startsWith('##') || line.startsWith('###')) break;
        if (line && !line.startsWith('- ')) {
          journey += (journey ? ' ' : '') + line;
        }
      }
    }

    // Parse photos from ### Photos section
    const photosStart = lines.findIndex(l => l.trim() === '### Photos');
    const photos: string[] = [];

    if (photosStart !== -1) {
      for (let i = photosStart + 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line.startsWith('###') || line.startsWith('##')) break;
        if (line.startsWith('- ')) {
          photos.push(line.substring(2));
        }
      }
    }

    return {
      prs,
      journey,
      photos: photos.length > 0 ? photos : undefined
    };
  } catch (error) {
    console.error('Error parsing fitness.md:', error);
    return null;
  }
}
```

**Step 2: Commit**

```bash
git add src/utils/parseFitness.ts
git commit -m "feat: add fitness parser utility"
```

---

### Task 9: Create FitnessTracker component

**Files:**
- Create: `src/components/FitnessTracker.astro`

**Step 1: Write component**

```astro
---
interface Props {
  prs: { exercise: string; weight: string }[];
  journey: string;
  photos?: string[];
}

const { prs, journey, photos = [] } = Astro.props;
---

<div class="fitness-tracker">
  <!-- PRs Section -->
  <div class="prs-section">
    <h3 class="section-title">
      <span class="title-bracket">[</span>
      Personal Records
      <span class="title-bracket">]</span>
    </h3>
    <div class="prs-grid">
      {prs.map((pr) => (
        <div class="pr-card">
          <div class="pr-exercise">{pr.exercise}</div>
          <div class="pr-weight">{pr.weight}</div>
        </div>
      ))}
    </div>
  </div>

  <!-- Journey Section -->
  <div class="journey-section">
    <h3 class="section-title">
      <span class="title-bracket">[</span>
      My Journey
      <span class="title-bracket">]</span>
    </h3>
    <p class="journey-text">{journey}</p>

    {photos && photos.length > 0 && (
      <div class="photo-grid">
        {photos.map((photo) => (
          <div class="photo-placeholder">
            <span class="text-4xl">💪</span>
          </div>
        ))}
      </div>
    )}
  </div>
</div>

<style>
  .fitness-tracker {
    display: flex;
    flex-direction: column;
    gap: 3rem;
  }

  .section-title {
    font-family: var(--font-display);
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--color-text);
    margin-bottom: 1.5rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .title-bracket {
    color: var(--color-accent);
    font-weight: 900;
  }

  .prs-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
  }

  .pr-card {
    background: var(--color-bg-secondary);
    border: 2px solid var(--color-border);
    border-radius: 8px;
    padding: 1.5rem;
    text-align: center;
    transition: all 0.3s ease;
  }

  .pr-card:hover {
    border-color: var(--color-accent);
    transform: translateY(-4px);
    box-shadow: 0 4px 12px var(--color-glow);
  }

  .pr-exercise {
    font-family: var(--font-mono);
    font-size: 0.875rem;
    color: var(--color-text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: 0.5rem;
  }

  .pr-weight {
    font-family: var(--font-display);
    font-size: 2rem;
    font-weight: 900;
    color: var(--color-accent);
    text-shadow: 0 0 10px var(--color-glow);
  }

  .journey-text {
    font-family: var(--font-mono);
    font-size: 1rem;
    line-height: 1.8;
    color: var(--color-text-secondary);
    padding: 1.5rem;
    background: var(--color-bg-secondary);
    border-left: 4px solid var(--color-accent);
    border-radius: 4px;
    margin-bottom: 2rem;
  }

  .photo-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1rem;
  }

  .photo-placeholder {
    aspect-ratio: 1;
    background: linear-gradient(135deg, var(--color-bg-secondary), var(--color-border));
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2px solid var(--color-border);
    transition: all 0.3s ease;
  }

  .photo-placeholder:hover {
    border-color: var(--color-accent);
    transform: scale(1.05);
  }
</style>
```

**Step 2: Commit**

```bash
git add src/components/FitnessTracker.astro
git commit -m "feat: add fitness tracker component"
```

---

### Task 10: Integrate Fitness into Hobbies component

**Files:**
- Modify: `src/components/Hobbies.astro`

**Step 1: Add imports**

Add to imports section:
```typescript
import FitnessTracker from './FitnessTracker.astro';
import { parseFitness } from '../utils/parseFitness';

const fitnessData = parseFitness('./src/resources/fitness.md');
```

**Step 2: Replace fitness tab content**

Replace:
```astro
<div class="tab-content" data-content="fitness">
  <p class="text-text-secondary">Fitness content coming soon...</p>
</div>
```

With:
```astro
<div class="tab-content" data-content="fitness">
  {fitnessData ? (
    <FitnessTracker {...fitnessData} />
  ) : (
    <p class="text-text-secondary">No fitness data available.</p>
  )}
</div>
```

**Step 3: Test in browser**

Navigate to fitness tab
Expected: See PRs and journey text

**Step 4: Commit**

```bash
git add src/components/Hobbies.astro
git commit -m "feat: integrate fitness tracker into hobbies section"
```

---

## Phase 4: Bella Profile Tab

### Task 11: Create parseBellaProfile utility

**Files:**
- Create: `src/utils/parseBellaProfile.ts`

**Step 1: Write parser**

```typescript
import * as fs from 'node:fs';
import type { BellaProfile } from '../types/content';

export function parseBellaProfile(filePath: string): BellaProfile | null {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');

    // Extract Bella Profile section
    const bellaMatch = content.match(/# Bella Profile\n([\s\S]*?)(?=\n# |$)/);
    if (!bellaMatch) return null;

    const bellaContent = bellaMatch[1];
    const lines = bellaContent.split('\n').filter(l => l.trim());

    // Get About section
    const aboutStart = lines.findIndex(l => l.trim() === '### About');
    let about = '';
    let age = '';
    let breed = '';
    let favoriteThings = '';

    if (aboutStart !== -1) {
      for (let i = aboutStart + 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line.startsWith('###') || line.startsWith('**')) break;
        if (line && !line.startsWith('- ')) {
          about += (about ? ' ' : '') + line;
        }
      }

      // Parse stats
      const ageMatch = bellaContent.match(/\*\*Age:\*\* (.+)/);
      if (ageMatch) age = ageMatch[1];

      const breedMatch = bellaContent.match(/\*\*Breed:\*\* (.+)/);
      if (breedMatch) breed = breedMatch[1];

      const favMatch = bellaContent.match(/\*\*Favorite Things:\*\* (.+)/);
      if (favMatch) favoriteThings = favMatch[1];
    }

    // Get story from ### Our Story section
    const storyStart = lines.findIndex(l => l.trim() === '### Our Story');
    let story = '';

    if (storyStart !== -1) {
      for (let i = storyStart + 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line.startsWith('###')) break;
        if (line && !line.startsWith('- ')) {
          story += (story ? ' ' : '') + line;
        }
      }
    }

    // Get photos
    const photosStart = lines.findIndex(l => l.trim() === '### Photos');
    const photos: string[] = [];

    if (photosStart !== -1) {
      for (let i = photosStart + 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line.startsWith('###')) break;
        if (line.startsWith('- ')) {
          photos.push(line.substring(2));
        }
      }
    }

    return {
      about,
      age,
      breed,
      favoriteThings,
      story,
      photos: photos.length > 0 ? photos : undefined
    };
  } catch (error) {
    console.error('Error parsing Bella profile:', error);
    return null;
  }
}
```

**Step 2: Commit**

```bash
git add src/utils/parseBellaProfile.ts
git commit -m "feat: add Bella profile parser utility"
```

---

### Task 12: Create BellaProfile component

**Files:**
- Create: `src/components/BellaProfile.astro`

**Step 1: Write component**

```astro
---
interface Props {
  about: string;
  age: string;
  breed: string;
  favoriteThings: string;
  story: string;
  photos?: string[];
}

const { about, age, breed, favoriteThings, story, photos = [] } = Astro.props;
---

<div class="bella-profile">
  <!-- Hero Section -->
  <div class="hero-section">
    <div class="hero-image">
      <span class="text-8xl">🐕</span>
    </div>
    <div class="hero-content">
      <h3 class="bella-title">
        <span class="title-bracket">[</span>
        Meet Bella
        <span class="title-bracket">]</span>
      </h3>
      <p class="about-text">{about}</p>
    </div>
  </div>

  <!-- Stats Section -->
  <div class="stats-section">
    <div class="stat-card">
      <div class="stat-label">Age</div>
      <div class="stat-value">{age}</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">Breed</div>
      <div class="stat-value">{breed}</div>
    </div>
    <div class="stat-card full-width">
      <div class="stat-label">Favorite Things</div>
      <div class="stat-value">{favoriteThings}</div>
    </div>
  </div>

  <!-- Story Section -->
  <div class="story-section">
    <h4 class="section-title">
      <span class="title-bracket">[</span>
      Our Story
      <span class="title-bracket">]</span>
    </h4>
    <p class="story-text">{story}</p>

    {photos && photos.length > 0 && (
      <div class="photo-grid">
        {photos.map((photo) => (
          <div class="photo-placeholder">
            <span class="text-4xl">📸</span>
          </div>
        ))}
      </div>
    )}
  </div>
</div>

<style>
  .bella-profile {
    max-width: 800px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 3rem;
  }

  .hero-section {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 2rem;
    align-items: center;
    padding: 2rem;
    background: var(--color-bg-secondary);
    border: 2px solid var(--color-border);
    border-radius: 12px;
  }

  .hero-image {
    width: 150px;
    height: 150px;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--color-accent-bg), var(--color-accent-bg-hover));
    border: 4px solid var(--color-accent);
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 0 30px var(--color-glow);
  }

  .bella-title {
    font-family: var(--font-display);
    font-size: 2rem;
    font-weight: 900;
    color: var(--color-text);
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .title-bracket {
    color: var(--color-accent);
  }

  .about-text {
    font-family: var(--font-mono);
    font-size: 1rem;
    line-height: 1.7;
    color: var(--color-text-secondary);
  }

  .stats-section {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }

  .stat-card {
    background: var(--color-bg-secondary);
    border: 2px solid var(--color-border);
    border-radius: 8px;
    padding: 1.5rem;
    transition: all 0.3s ease;
  }

  .stat-card.full-width {
    grid-column: 1 / -1;
  }

  .stat-card:hover {
    border-color: var(--color-accent);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px var(--color-glow);
  }

  .stat-label {
    font-family: var(--font-mono);
    font-size: 0.75rem;
    color: var(--color-text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: 0.5rem;
  }

  .stat-value {
    font-family: var(--font-mono);
    font-size: 1.125rem;
    color: var(--color-accent);
    font-weight: 700;
  }

  .section-title {
    font-family: var(--font-display);
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--color-text);
    margin-bottom: 1.5rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .story-text {
    font-family: var(--font-mono);
    font-size: 1rem;
    line-height: 1.8;
    color: var(--color-text-secondary);
    padding: 1.5rem;
    background: var(--color-bg-secondary);
    border-left: 4px solid var(--color-accent);
    border-radius: 4px;
    margin-bottom: 2rem;
  }

  .photo-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1rem;
  }

  .photo-placeholder {
    aspect-ratio: 1;
    background: linear-gradient(135deg, var(--color-bg-secondary), var(--color-border));
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2px solid var(--color-border);
    transition: all 0.3s ease;
  }

  .photo-placeholder:hover {
    border-color: var(--color-accent);
    transform: scale(1.05);
  }
</style>
```

**Step 2: Commit**

```bash
git add src/components/BellaProfile.astro
git commit -m "feat: add Bella profile component"
```

---

### Task 13: Integrate Bella Profile into Hobbies component

**Files:**
- Modify: `src/components/Hobbies.astro`

**Step 1: Add imports**

Add to imports:
```typescript
import BellaProfile from './BellaProfile.astro';
import { parseBellaProfile } from '../utils/parseBellaProfile';

const bellaData = parseBellaProfile('./src/resources/hobbies.md');
```

**Step 2: Replace Bella tab content**

Replace:
```astro
<div class="tab-content" data-content="bella">
  <p class="text-text-secondary">Bella profile coming soon...</p>
</div>
```

With:
```astro
<div class="tab-content" data-content="bella">
  {bellaData ? (
    <BellaProfile {...bellaData} />
  ) : (
    <p class="text-text-secondary">No Bella profile data available.</p>
  )}
</div>
```

**Step 3: Test in browser**

Navigate to Bella tab
Expected: See profile with stats and story

**Step 4: Commit**

```bash
git add src/components/Hobbies.astro
git commit -m "feat: integrate Bella profile into hobbies section"
```

---

## Phase 5: Currently Enjoying - Base Structure

### Task 14: Create MediaGrid component structure

**Files:**
- Create: `src/components/MediaGrid.astro`

**Step 1: Create component with placeholder content**

```astro
---
// Will add API integration later - for now just structure
---

<div class="media-grid">
  <!-- Toggle -->
  <div class="view-toggle">
    <button class="toggle-button active" data-view="current">
      <span class="bracket">[</span>
      Currently
      <span class="bracket">]</span>
    </button>
    <button class="toggle-button" data-view="history">
      <span class="bracket">[</span>
      History
      <span class="bracket">]</span>
    </button>
  </div>

  <!-- Media Categories -->
  <div class="media-sections">
    <!-- Books -->
    <div class="media-section">
      <h4 class="media-title">
        <span class="icon">📚</span>
        Books
      </h4>
      <div class="media-items current-items active">
        <p class="placeholder-text">Loading books...</p>
      </div>
      <div class="media-items history-items">
        <p class="placeholder-text">Book history...</p>
      </div>
    </div>

    <!-- Movies -->
    <div class="media-section">
      <h4 class="media-title">
        <span class="icon">🎬</span>
        Movies
      </h4>
      <div class="media-items current-items active">
        <p class="placeholder-text">Loading movies...</p>
      </div>
      <div class="media-items history-items">
        <p class="placeholder-text">Movie history...</p>
      </div>
    </div>

    <!-- Shows -->
    <div class="media-section">
      <h4 class="media-title">
        <span class="icon">📺</span>
        Shows
      </h4>
      <div class="media-items current-items active">
        <p class="placeholder-text">Loading shows...</p>
      </div>
      <div class="media-items history-items">
        <p class="placeholder-text">Show history...</p>
      </div>
    </div>

    <!-- Games -->
    <div class="media-section">
      <h4 class="media-title">
        <span class="icon">🎮</span>
        Games
      </h4>
      <div class="media-items current-items active">
        <p class="placeholder-text">Loading games...</p>
      </div>
      <div class="media-items history-items">
        <p class="placeholder-text">Game history...</p>
      </div>
    </div>

    <!-- Music -->
    <div class="media-section">
      <h4 class="media-title">
        <span class="icon">🎵</span>
        Music
      </h4>
      <a href="https://spotify.com" target="_blank" rel="noopener noreferrer" class="spotify-card">
        <span class="spotify-icon">🎧</span>
        <span class="spotify-text">Listen on Spotify</span>
        <span class="external-icon">→</span>
      </a>
    </div>
  </div>
</div>

<style>
  .media-grid {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  .view-toggle {
    display: flex;
    gap: 1rem;
    justify-content: center;
    margin-bottom: 1rem;
  }

  .toggle-button {
    font-family: var(--font-mono);
    font-size: 0.875rem;
    font-weight: 700;
    padding: 0.75rem 1.5rem;
    background: var(--color-bg-secondary);
    color: var(--color-text-secondary);
    border: 2px solid var(--color-border);
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .bracket {
    color: var(--color-border);
    font-weight: 900;
  }

  .toggle-button:hover {
    border-color: var(--color-accent);
    color: var(--color-accent);
  }

  .toggle-button:hover .bracket {
    color: var(--color-accent);
  }

  .toggle-button.active {
    background: var(--color-accent-bg-hover);
    border-color: var(--color-accent);
    color: var(--color-accent);
  }

  .toggle-button.active .bracket {
    color: var(--color-accent);
  }

  .media-sections {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 2rem;
  }

  .media-section {
    background: var(--color-bg-secondary);
    border: 2px solid var(--color-border);
    border-radius: 8px;
    padding: 1.5rem;
    transition: all 0.3s ease;
  }

  .media-section:hover {
    border-color: var(--color-accent);
  }

  .media-title {
    font-family: var(--font-display);
    font-size: 1.25rem;
    font-weight: 700;
    color: var(--color-text);
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .icon {
    font-size: 1.5rem;
  }

  .media-items {
    display: none;
    min-height: 100px;
  }

  .media-items.active {
    display: block;
  }

  .placeholder-text {
    font-family: var(--font-mono);
    font-size: 0.875rem;
    color: var(--color-text-secondary);
    text-align: center;
    padding: 2rem;
  }

  .spotify-card {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem;
    background: linear-gradient(135deg, #1db954, #1ed760);
    border-radius: 8px;
    text-decoration: none;
    color: white;
    font-family: var(--font-mono);
    font-weight: 700;
    transition: all 0.3s ease;
  }

  .spotify-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(29, 185, 84, 0.4);
  }

  .spotify-icon {
    font-size: 1.5rem;
  }

  .external-icon {
    font-size: 1.5rem;
  }
</style>

<script>
  // Toggle between current and history views
  const toggleButtons = document.querySelectorAll('.toggle-button');
  const currentItems = document.querySelectorAll('.current-items');
  const historyItems = document.querySelectorAll('.history-items');

  toggleButtons.forEach(button => {
    button.addEventListener('click', () => {
      const view = button.getAttribute('data-view');

      // Update button states
      toggleButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      // Update visible items
      if (view === 'current') {
        currentItems.forEach(items => items.classList.add('active'));
        historyItems.forEach(items => items.classList.remove('active'));
      } else {
        currentItems.forEach(items => items.classList.remove('active'));
        historyItems.forEach(items => items.classList.add('active'));
      }
    });
  });
</script>
```

**Step 2: Commit**

```bash
git add src/components/MediaGrid.astro
git commit -m "feat: add media grid component structure"
```

---

### Task 15: Integrate MediaGrid into Hobbies component

**Files:**
- Modify: `src/components/Hobbies.astro`

**Step 1: Add import**

Add to imports:
```typescript
import MediaGrid from './MediaGrid.astro';
```

**Step 2: Replace media tab content**

Replace:
```astro
<div class="tab-content" data-content="media">
  <p class="text-text-secondary">Media content coming soon...</p>
</div>
```

With:
```astro
<div class="tab-content" data-content="media">
  <MediaGrid />
</div>
```

**Step 3: Test in browser**

Navigate to media tab, test current/history toggle
Expected: Toggle works, placeholder text shows

**Step 4: Commit**

```bash
git add src/components/Hobbies.astro
git commit -m "feat: integrate media grid into hobbies section"
```

---

## Phase 6: API Integrations (Simplified - No Server Endpoints)

**Note:** For the initial implementation, we'll use client-side fetch directly in components rather than creating server endpoints. This simplifies the implementation while still achieving the core functionality.

### Task 16: Add environment variables for API keys

**Files:**
- Modify: `.env.example`
- Create/Modify: `.env`

**Step 1: Update .env.example**

Add to `.env.example`:
```
# Media Tracking APIs
PUBLIC_TRAKT_API_KEY=your-trakt-api-key
PUBLIC_GOODREADS_USER_ID=your-goodreads-user-id
PUBLIC_LETTERBOXD_USERNAME=your-letterboxd-username
PUBLIC_BACKLOGGD_USERNAME=your-backloggd-username
PUBLIC_SPOTIFY_PROFILE_URL=https://open.spotify.com/user/your-username
```

**Step 2: Add actual values to .env**

Create or update `.env` with real values (user will need to provide these)

**Step 3: Commit .env.example only**

```bash
git add .env.example
git commit -m "feat: add environment variables for media APIs"
```

---

### Task 17: Update MediaGrid with Spotify link

**Files:**
- Modify: `src/components/MediaGrid.astro`

**Step 1: Add Spotify URL from environment**

In frontmatter, add:
```typescript
const spotifyUrl = import.meta.env.PUBLIC_SPOTIFY_PROFILE_URL || 'https://spotify.com';
```

**Step 2: Update Spotify card href**

Change:
```astro
<a href="https://spotify.com" target="_blank" rel="noopener noreferrer" class="spotify-card">
```

To:
```astro
<a href={spotifyUrl} target="_blank" rel="noopener noreferrer" class="spotify-card">
```

**Step 3: Commit**

```bash
git add src/components/MediaGrid.astro
git commit -m "feat: connect Spotify profile URL from environment"
```

---

### Task 18: Build complete and ready for API integration

**Files:**
- None (verification step)

**Step 1: Run full build**

Run: `npm run build`
Expected: Build succeeds with no errors

**Step 2: Test all tabs in dev mode**

Run: `npm run dev`
Test each tab:
- Trail Log: Shows adventure cards ✓
- Currently Enjoying: Shows media grid with placeholder ✓
- Fitness: Shows PRs and journey ✓
- Bella: Shows profile ✓

**Step 3: Commit checkpoint**

```bash
git commit --allow-empty -m "chore: hobbies section base implementation complete"
```

---

## Summary

**Implementation complete for:**
✅ Base tab structure with navigation
✅ Trail Log with adventures parser and cards
✅ Fitness tracker with PRs and journey
✅ Bella profile with stats and story
✅ Media grid structure with current/history toggle
✅ Spotify profile link integration

**Remaining work (future tasks):**
- API integrations for Goodreads, Letterboxd, Trakt, Backloggd
- Real photo uploads and display
- Responsive design refinements
- Loading states for API data
- Error handling for failed API calls

**Ready for:**
- User to add real content to markdown files
- User to add real photos
- User to configure API keys
- Future API integration tasks
