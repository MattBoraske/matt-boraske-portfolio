# Media API Integration Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Integrate Goodreads, Trakt, and Letterboxd APIs to fetch and display currently reading/watching media at build time with daily automated updates.

**Architecture:** Build-time data fetching via RSS/API calls, transformed into MediaItem arrays, baked into static HTML. GitHub Actions triggers daily Amplify rebuilds via webhook.

**Tech Stack:** Astro, TypeScript, XML/RSS parsing, Trakt API v2, GitHub Actions

---

## Phase 1: Goodreads Fetcher

### Task 1: Create Goodreads fetcher utility

**Files:**
- Create: `src/utils/mediaFetchers/goodreads.ts`
- Reference: `src/types/content.ts` (MediaItem type)

**Step 1: Create fetcher directory and file**

```bash
mkdir -p src/utils/mediaFetchers
touch src/utils/mediaFetchers/goodreads.ts
```

**Step 2: Write Goodreads RSS fetcher**

Add to `src/utils/mediaFetchers/goodreads.ts`:

```typescript
import type { MediaItem } from '../../types/content';

/**
 * Fetch currently reading books from Goodreads RSS feed
 * RSS endpoint: https://www.goodreads.com/review/list_rss/{userId}?shelf=currently-reading
 */
export async function fetchGoodreadsBooks(): Promise<MediaItem[]> {
  const userId = import.meta.env.PUBLIC_GOODREADS_USER_ID;

  if (!userId) {
    console.warn('[Goodreads] No user ID configured');
    return [];
  }

  try {
    const url = `https://www.goodreads.com/review/list_rss/${userId}?shelf=currently-reading`;
    console.log(`[Goodreads] Fetching from: ${url}`);

    const response = await fetch(url);
    if (!response.ok) {
      console.error(`[Goodreads] HTTP ${response.status}: ${response.statusText}`);
      return [];
    }

    const xmlText = await response.text();

    // Parse XML manually (Astro build environment)
    const items: MediaItem[] = [];
    const itemMatches = xmlText.matchAll(/<item>([\s\S]*?)<\/item>/g);

    for (const match of itemMatches) {
      const itemXml = match[1];

      // Extract title
      const titleMatch = itemXml.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/);
      const title = titleMatch ? titleMatch[1] : 'Unknown Title';

      // Extract author from title (format: "Title by Author")
      const authorMatch = title.match(/\s+by\s+(.+)$/);
      const bookTitle = authorMatch ? title.replace(/\s+by\s+.+$/, '') : title;
      const author = authorMatch ? authorMatch[1] : undefined;

      // Extract book URL
      const linkMatch = itemXml.match(/<link>(.*?)<\/link>/);
      const bookUrl = linkMatch ? linkMatch[1] : undefined;

      // Extract cover image from description
      const descMatch = itemXml.match(/<description><!\[CDATA\[([\s\S]*?)\]\]><\/description>/);
      const description = descMatch ? descMatch[1] : '';
      const imgMatch = description.match(/<img[^>]+src="([^"]+)"/);
      const coverUrl = imgMatch ? imgMatch[1] : undefined;

      items.push({
        title: bookTitle,
        author,
        coverUrl,
        type: 'book',
        status: 'current'
      });
    }

    console.log(`[Goodreads] Fetched ${items.length} books`);
    return items;

  } catch (error) {
    console.error('[Goodreads] Fetch error:', error);
    return [];
  }
}
```

**Step 3: Build to verify no TypeScript errors**

```bash
npm run build
```

Expected: Build succeeds, no TypeScript errors

**Step 4: Commit**

```bash
git add src/utils/mediaFetchers/goodreads.ts
git commit -m "feat: add Goodreads RSS fetcher for currently reading books"
```

---

## Phase 2: Trakt Fetcher

### Task 2: Create Trakt API fetcher

**Files:**
- Create: `src/utils/mediaFetchers/trakt.ts`

**Step 1: Create Trakt fetcher file**

```bash
touch src/utils/mediaFetchers/trakt.ts
```

**Step 2: Write Trakt API fetcher**

Add to `src/utils/mediaFetchers/trakt.ts`:

```typescript
import type { MediaItem } from '../../types/content';

interface TraktMovie {
  title: string;
  year: number;
  ids: {
    trakt: number;
    slug: string;
    tmdb?: number;
  };
}

interface TraktShow {
  title: string;
  year: number;
  ids: {
    trakt: number;
    slug: string;
    tmdb?: number;
  };
}

/**
 * Fetch currently watching movies and shows from Trakt watchlist
 * API: https://api.trakt.tv/sync/watchlist/movies and /shows
 */
export async function fetchTraktMedia(): Promise<MediaItem[]> {
  const clientId = import.meta.env.PUBLIC_TRAKT_API_KEY;

  if (!clientId) {
    console.warn('[Trakt] No client ID configured');
    return [];
  }

  const headers = {
    'Content-Type': 'application/json',
    'trakt-api-version': '2',
    'trakt-api-key': clientId
  };

  const items: MediaItem[] = [];

  try {
    // Fetch movies watchlist
    console.log('[Trakt] Fetching movies watchlist');
    const moviesResponse = await fetch('https://api.trakt.tv/sync/watchlist/movies', { headers });

    if (moviesResponse.ok) {
      const moviesData = await moviesResponse.json();

      for (const item of moviesData.slice(0, 3)) { // Limit to 3 items
        const movie: TraktMovie = item.movie;
        items.push({
          title: `${movie.title} (${movie.year})`,
          coverUrl: movie.ids.tmdb
            ? `https://image.tmdb.org/t/p/w500/movie/${movie.ids.tmdb}.jpg`
            : undefined,
          type: 'movie',
          status: 'current'
        });
      }
      console.log(`[Trakt] Fetched ${moviesData.length} movies`);
    } else {
      console.error(`[Trakt] Movies HTTP ${moviesResponse.status}`);
    }

    // Fetch shows watchlist
    console.log('[Trakt] Fetching shows watchlist');
    const showsResponse = await fetch('https://api.trakt.tv/sync/watchlist/shows', { headers });

    if (showsResponse.ok) {
      const showsData = await showsResponse.json();

      for (const item of showsData.slice(0, 3)) { // Limit to 3 items
        const show: TraktShow = item.show;
        items.push({
          title: `${show.title} (${show.year})`,
          coverUrl: show.ids.tmdb
            ? `https://image.tmdb.org/t/p/w500/tv/${show.ids.tmdb}.jpg`
            : undefined,
          type: 'show',
          status: 'current'
        });
      }
      console.log(`[Trakt] Fetched ${showsData.length} shows`);
    } else {
      console.error(`[Trakt] Shows HTTP ${showsResponse.status}`);
    }

    console.log(`[Trakt] Total items: ${items.length}`);
    return items;

  } catch (error) {
    console.error('[Trakt] Fetch error:', error);
    return [];
  }
}
```

**Step 3: Build to verify no TypeScript errors**

```bash
npm run build
```

Expected: Build succeeds

**Step 4: Commit**

```bash
git add src/utils/mediaFetchers/trakt.ts
git commit -m "feat: add Trakt API fetcher for movies and shows watchlist"
```

---

## Phase 3: Letterboxd Fetcher

### Task 3: Create Letterboxd RSS fetcher

**Files:**
- Create: `src/utils/mediaFetchers/letterboxd.ts`

**Step 1: Create Letterboxd fetcher file**

```bash
touch src/utils/mediaFetchers/letterboxd.ts
```

**Step 2: Write Letterboxd RSS fetcher**

Add to `src/utils/mediaFetchers/letterboxd.ts`:

```typescript
import type { MediaItem } from '../../types/content';

/**
 * Fetch recent movie activity from Letterboxd RSS feed
 * RSS endpoint: https://letterboxd.com/{username}/rss/
 */
export async function fetchLetterboxdMovies(): Promise<MediaItem[]> {
  const username = import.meta.env.PUBLIC_LETTERBOXD_USERNAME;

  if (!username) {
    console.warn('[Letterboxd] No username configured');
    return [];
  }

  try {
    const url = `https://letterboxd.com/${username}/rss/`;
    console.log(`[Letterboxd] Fetching from: ${url}`);

    const response = await fetch(url);
    if (!response.ok) {
      console.error(`[Letterboxd] HTTP ${response.status}: ${response.statusText}`);
      return [];
    }

    const xmlText = await response.text();

    // Parse XML manually
    const items: MediaItem[] = [];
    const itemMatches = xmlText.matchAll(/<item>([\s\S]*?)<\/item>/g);

    // Get current date for filtering recent entries (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    for (const match of itemMatches) {
      const itemXml = match[1];

      // Extract published date
      const pubDateMatch = itemXml.match(/<pubDate>(.*?)<\/pubDate>/);
      if (pubDateMatch) {
        const pubDate = new Date(pubDateMatch[1]);
        if (pubDate < sevenDaysAgo) continue; // Skip old entries
      }

      // Extract title (format: "Movie Title, Year")
      const titleMatch = itemXml.match(/<letterboxd:filmTitle>(.*?)<\/letterboxd:filmTitle>/);
      const filmTitle = titleMatch ? titleMatch[1] : null;

      const yearMatch = itemXml.match(/<letterboxd:filmYear>(.*?)<\/letterboxd:filmYear>/);
      const year = yearMatch ? yearMatch[1] : '';

      if (!filmTitle) continue;

      // Extract link
      const linkMatch = itemXml.match(/<link>(.*?)<\/link>/);
      const movieUrl = linkMatch ? linkMatch[1] : undefined;

      // Extract image from description
      const descMatch = itemXml.match(/<description><!\[CDATA\[([\s\S]*?)\]\]><\/description>/);
      const description = descMatch ? descMatch[1] : '';
      const imgMatch = description.match(/<img[^>]+src="([^"]+)"/);
      const coverUrl = imgMatch ? imgMatch[1] : undefined;

      items.push({
        title: year ? `${filmTitle} (${year})` : filmTitle,
        coverUrl,
        type: 'movie',
        status: 'current'
      });

      // Limit to 3 recent movies
      if (items.length >= 3) break;
    }

    console.log(`[Letterboxd] Fetched ${items.length} recent movies`);
    return items;

  } catch (error) {
    console.error('[Letterboxd] Fetch error:', error);
    return [];
  }
}
```

**Step 3: Build to verify no TypeScript errors**

```bash
npm run build
```

Expected: Build succeeds

**Step 4: Commit**

```bash
git add src/utils/mediaFetchers/letterboxd.ts
git commit -m "feat: add Letterboxd RSS fetcher for recent movie activity"
```

---

## Phase 4: Fetcher Index

### Task 4: Create fetcher index file

**Files:**
- Create: `src/utils/mediaFetchers/index.ts`

**Step 1: Create index file**

```bash
touch src/utils/mediaFetchers/index.ts
```

**Step 2: Export all fetchers**

Add to `src/utils/mediaFetchers/index.ts`:

```typescript
export { fetchGoodreadsBooks } from './goodreads';
export { fetchTraktMedia } from './trakt';
export { fetchLetterboxdMovies } from './letterboxd';
```

**Step 3: Build to verify exports work**

```bash
npm run build
```

Expected: Build succeeds

**Step 4: Commit**

```bash
git add src/utils/mediaFetchers/index.ts
git commit -m "feat: add media fetchers index for exports"
```

---

## Phase 5: Update MediaGrid Component

### Task 5: Remove toggle and update MediaGrid to display data

**Files:**
- Modify: `src/components/MediaGrid.astro`

**Step 1: Read current MediaGrid component**

```bash
cat src/components/MediaGrid.astro
```

**Step 2: Replace entire MediaGrid component**

Replace contents of `src/components/MediaGrid.astro` with:

```astro
---
import type { MediaItem } from '../types/content';

interface Props {
  books: MediaItem[];
  movies: MediaItem[];
  shows: MediaItem[];
}

const { books, movies, shows } = Astro.props;

const goodreadsUrl = `https://www.goodreads.com/user/show/${import.meta.env.PUBLIC_GOODREADS_USER_ID}`;
const traktUrl = 'https://trakt.tv';
const letterboxdUrl = `https://letterboxd.com/${import.meta.env.PUBLIC_LETTERBOXD_USERNAME}/`;
---

<div class="media-grid">
  <!-- Books -->
  <div class="media-section">
    <h4 class="media-title">
      <span class="icon">📚</span>
      Books
    </h4>

    {books.length > 0 ? (
      <div class="media-items">
        {books.map((book) => (
          <div class="media-card">
            {book.coverUrl && (
              <img src={book.coverUrl} alt={book.title} class="media-cover" />
            )}
            <div class="media-info">
              <h5 class="media-item-title">{book.title}</h5>
              {book.author && <p class="media-author">{book.author}</p>}
              <span class="media-badge">Currently Reading</span>
            </div>
          </div>
        ))}
      </div>
    ) : (
      <div class="empty-state">
        <p class="empty-text">Not currently reading anything</p>
      </div>
    )}

    <a href={goodreadsUrl} target="_blank" rel="noopener noreferrer" class="profile-link">
      View my Goodreads library →
    </a>
  </div>

  <!-- Movies -->
  <div class="media-section">
    <h4 class="media-title">
      <span class="icon">🎬</span>
      Movies
    </h4>

    {movies.length > 0 ? (
      <div class="media-items">
        {movies.map((movie) => (
          <div class="media-card">
            {movie.coverUrl && (
              <img src={movie.coverUrl} alt={movie.title} class="media-cover" />
            )}
            <div class="media-info">
              <h5 class="media-item-title">{movie.title}</h5>
              <span class="media-badge">Watching</span>
            </div>
          </div>
        ))}
      </div>
    ) : (
      <div class="empty-state">
        <p class="empty-text">No movies in watchlist</p>
      </div>
    )}

    <a href={letterboxdUrl} target="_blank" rel="noopener noreferrer" class="profile-link">
      View my Letterboxd →
    </a>
  </div>

  <!-- Shows -->
  <div class="media-section">
    <h4 class="media-title">
      <span class="icon">📺</span>
      Shows
    </h4>

    {shows.length > 0 ? (
      <div class="media-items">
        {shows.map((show) => (
          <div class="media-card">
            {show.coverUrl && (
              <img src={show.coverUrl} alt={show.title} class="media-cover" />
            )}
            <div class="media-info">
              <h5 class="media-item-title">{show.title}</h5>
              <span class="media-badge">Watching</span>
            </div>
          </div>
        ))}
      </div>
    ) : (
      <div class="empty-state">
        <p class="empty-text">No shows in watchlist</p>
      </div>
    )}

    <a href={traktUrl} target="_blank" rel="noopener noreferrer" class="profile-link">
      View my Trakt →
    </a>
  </div>
</div>

<style>
  .media-grid {
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
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .media-section:hover {
    border-color: var(--color-accent);
  }

  .media-title {
    font-family: var(--font-display);
    font-size: 1.25rem;
    font-weight: 700;
    color: var(--color-text);
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin: 0;
  }

  .icon {
    font-size: 1.5rem;
  }

  .media-items {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    min-height: 100px;
  }

  .media-card {
    display: flex;
    gap: 1rem;
    padding: 0.75rem;
    background: var(--color-bg);
    border: 1px solid var(--color-border);
    border-radius: 6px;
    transition: all 0.3s ease;
  }

  .media-card:hover {
    border-color: var(--color-accent);
    transform: translateX(2px);
  }

  .media-cover {
    width: 60px;
    height: 90px;
    object-fit: cover;
    border-radius: 4px;
    flex-shrink: 0;
  }

  .media-info {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    justify-content: center;
  }

  .media-item-title {
    font-family: var(--font-mono);
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--color-text);
    margin: 0;
    line-height: 1.3;
  }

  .media-author {
    font-family: var(--font-mono);
    font-size: 0.75rem;
    color: var(--color-text-secondary);
    margin: 0;
  }

  .media-badge {
    font-family: var(--font-mono);
    font-size: 0.65rem;
    color: var(--color-accent);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    font-weight: 700;
  }

  .empty-state {
    min-height: 100px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .empty-text {
    font-family: var(--font-mono);
    font-size: 0.875rem;
    color: var(--color-text-secondary);
    text-align: center;
  }

  .profile-link {
    font-family: var(--font-mono);
    font-size: 0.75rem;
    color: var(--color-accent);
    text-decoration: none;
    padding: 0.5rem;
    text-align: center;
    border: 1px solid var(--color-border);
    border-radius: 4px;
    transition: all 0.3s ease;
    margin-top: auto;
  }

  .profile-link:hover {
    border-color: var(--color-accent);
    background: var(--color-accent-bg);
  }
</style>
```

**Step 3: Build to verify component renders**

```bash
npm run build
```

Expected: Build succeeds, no errors

**Step 4: Commit**

```bash
git add src/components/MediaGrid.astro
git commit -m "refactor: remove toggle and update MediaGrid to display fetched data"
```

---

## Phase 6: Update Hobbies Component

### Task 6: Integrate fetchers into Hobbies component

**Files:**
- Modify: `src/components/Hobbies.astro`

**Step 1: Read current Hobbies component**

```bash
grep -A 5 "MediaGrid" src/components/Hobbies.astro
```

**Step 2: Add imports and fetch data at top of component**

Find the frontmatter section (between `---` marks) and add after existing imports:

```typescript
import { fetchGoodreadsBooks, fetchTraktMedia, fetchLetterboxdMovies } from '../utils/mediaFetchers';
import type { MediaItem } from '../types/content';

// Fetch media data at build time
const allBooks = await fetchGoodreadsBooks();
const allMedia = await fetchTraktMedia();
const letterboxdMovies = await fetchLetterboxdMovies();

// Separate movies and shows from Trakt
const traktMovies = allMedia.filter(item => item.type === 'movie');
const traktShows = allMedia.filter(item => item.type === 'show');

// Combine movie sources
const allMovies = [...traktMovies, ...letterboxdMovies];
```

**Step 3: Update MediaGrid component call**

Find the line with `<MediaGrid />` and replace with:

```astro
<MediaGrid books={allBooks} movies={allMovies} shows={traktShows} />
```

**Step 4: Build and check console output**

```bash
npm run build
```

Expected:
- Build succeeds
- Console logs show fetcher activity (e.g., "[Goodreads] Fetching from...")
- No errors about missing props

**Step 5: Commit**

```bash
git add src/components/Hobbies.astro
git commit -m "feat: integrate media fetchers into Hobbies component"
```

---

## Phase 7: GitHub Actions Workflow

### Task 7: Create daily rebuild workflow

**Files:**
- Create: `.github/workflows/daily-rebuild.yml`

**Step 1: Create GitHub workflows directory**

```bash
mkdir -p .github/workflows
touch .github/workflows/daily-rebuild.yml
```

**Step 2: Write workflow file**

Add to `.github/workflows/daily-rebuild.yml`:

```yaml
name: Daily Media Update

on:
  schedule:
    # Run daily at 6am UTC (2am EST / 11pm PST)
    - cron: '0 6 * * *'

  # Allow manual trigger for testing
  workflow_dispatch:

jobs:
  trigger-rebuild:
    runs-on: ubuntu-latest

    steps:
      - name: Trigger Amplify Rebuild
        run: |
          curl -X POST -d {} "${{ secrets.AMPLIFY_WEBHOOK_URL }}"
          echo "Amplify rebuild triggered successfully"
```

**Step 3: Commit workflow**

```bash
git add .github/workflows/daily-rebuild.yml
git commit -m "ci: add daily rebuild workflow for media updates"
```

---

## Phase 8: Documentation

### Task 8: Update ADDING_HOBBIES.md documentation

**Files:**
- Modify: `docs/ADDING_HOBBIES.md`

**Step 1: Find Media Tracking section**

```bash
grep -n "## Media Tracking" docs/ADDING_HOBBIES.md
```

**Step 2: Add implementation notes**

Find the "Future API Integration" subsection and replace with:

```markdown
### Current Implementation

The media tracking components now fetch live data at build time:

**Goodreads (Books):**
- Fetches from RSS feed: `https://www.goodreads.com/review/list_rss/{user_id}?shelf=currently-reading`
- Displays books on "currently-reading" shelf
- No API key required

**Trakt (Movies & TV):**
- Fetches from API v2: `/sync/watchlist/movies` and `/sync/watchlist/shows`
- Displays watchlist items (up to 3 per category)
- Requires client ID in `PUBLIC_TRAKT_API_KEY`

**Letterboxd (Movies):**
- Fetches from RSS feed: `https://letterboxd.com/{username}/rss/`
- Displays diary entries from last 7 days
- No API key required

**Automatic Updates:**
- GitHub Actions workflow runs daily at 6am UTC
- Triggers Amplify webhook to rebuild with fresh data
- Manual trigger available in GitHub Actions tab

### Adding Amplify Webhook to GitHub

1. Go to AWS Amplify Console → Your App → Build settings → Webhooks
2. Click "Create webhook"
3. Copy the webhook URL
4. Go to GitHub → Your repo → Settings → Secrets and variables → Actions
5. Click "New repository secret"
6. Name: `AMPLIFY_WEBHOOK_URL`
7. Value: Paste the webhook URL
8. Click "Add secret"

The daily workflow will now trigger automatic rebuilds.
```

**Step 3: Commit documentation**

```bash
git add docs/ADDING_HOBBIES.md
git commit -m "docs: update media tracking with implementation details"
```

---

## Phase 9: Testing & Verification

### Task 9: Local build test

**Files:**
- None (testing only)

**Step 1: Clean build**

```bash
rm -rf dist
npm run build
```

**Step 2: Verify console output**

Expected output should include:
```
[Goodreads] Fetching from: https://www.goodreads.com/review/list_rss/145806143?shelf=currently-reading
[Goodreads] Fetched X books
[Trakt] Fetching movies watchlist
[Trakt] Fetched X movies
[Trakt] Fetching shows watchlist
[Trakt] Fetched X shows
[Letterboxd] Fetching from: https://letterboxd.com/mattboraske/rss/
[Letterboxd] Fetched X recent movies
```

**Step 3: Check built HTML**

```bash
grep -o "Currently Reading" dist/index.html | head -5
```

Expected: Should find text if books exist, or "Not currently reading" if empty

**Step 4: Start dev server and visually verify**

```bash
npm run dev
```

Navigate to http://localhost:4321/#hobbies and click "Currently Enjoying" tab:
- Books section shows Goodreads data or empty state
- Movies section shows combined Trakt/Letterboxd data or empty state
- Shows section shows Trakt data or empty state
- Profile links work correctly

### Task 10: Create summary and verification report

**Step 1: Create verification checklist**

Create file `docs/plans/2025-12-26-media-api-verification.md`:

```markdown
# Media API Integration Verification

## Build-Time Fetching
- [ ] Goodreads fetcher runs during build
- [ ] Trakt fetcher runs during build
- [ ] Letterboxd fetcher runs during build
- [ ] Build completes successfully even if APIs fail
- [ ] Console logs show fetch activity

## UI Display
- [ ] Books section displays Goodreads data
- [ ] Movies section displays Trakt + Letterboxd data
- [ ] Shows section displays Trakt data
- [ ] Empty states show when no data
- [ ] Profile links navigate correctly
- [ ] Cover images display (when available)
- [ ] "Currently Reading"/"Watching" badges visible

## GitHub Actions
- [ ] Workflow file created
- [ ] Workflow can be manually triggered
- [ ] Cron schedule set to 6am UTC

## Amplify Setup (Manual)
- [ ] Add webhook in Amplify Console
- [ ] Add AMPLIFY_WEBHOOK_URL secret to GitHub
- [ ] Add environment variables to Amplify:
  - PUBLIC_GOODREADS_USER_ID=145806143
  - PUBLIC_TRAKT_API_KEY=10d447a00480b4a5d5535d18ed42704cceb9ad4c78ccb18972d631203f4d9235
  - PUBLIC_LETTERBOXD_USERNAME=mattboraske

## Post-Deployment
- [ ] Manually trigger workflow in GitHub Actions
- [ ] Verify Amplify rebuild triggered
- [ ] Check deployed site shows fresh media data
- [ ] Test daily schedule (check next morning)
```

**Step 2: Commit verification checklist**

```bash
git add docs/plans/2025-12-26-media-api-verification.md
git commit -m "docs: add media API verification checklist"
```

---

## Summary

**Total Tasks:** 10 across 9 phases

**Files Created:**
- `src/utils/mediaFetchers/goodreads.ts`
- `src/utils/mediaFetchers/trakt.ts`
- `src/utils/mediaFetchers/letterboxd.ts`
- `src/utils/mediaFetchers/index.ts`
- `.github/workflows/daily-rebuild.yml`
- `docs/plans/2025-12-26-media-api-verification.md`

**Files Modified:**
- `src/components/MediaGrid.astro`
- `src/components/Hobbies.astro`
- `docs/ADDING_HOBBIES.md`

**Manual Steps After Implementation:**
1. Set up Amplify webhook (see Task 8 docs)
2. Add `AMPLIFY_WEBHOOK_URL` secret to GitHub
3. Add environment variables to Amplify Console
4. Manually trigger workflow to test
5. Verify deployed site shows media data

**Testing Commands:**
```bash
npm run build    # Verify fetchers run
npm run dev      # Visual verification
```
