# Media API Integration Design

**Date:** 2025-12-26
**Status:** Approved
**Author:** Claude Code

## Overview

Integrate Goodreads, Trakt, and Letterboxd APIs to display currently reading/watching media in the hobbies section. Data fetches at build time and updates daily via scheduled GitHub Actions workflow.

## Requirements

- Display current books, movies, and TV shows
- Fetch data during Astro build process
- Update automatically once per day
- Graceful fallbacks when APIs fail or return no data
- Profile links for users to view full history on each service

## Architecture

### Data Flow

1. **Build Time:**
   - Astro build process runs media fetchers
   - Fetchers call Goodreads RSS, Trakt API, and Letterboxd RSS
   - Data transforms into `MediaItem[]` arrays
   - Static HTML generated with current media baked in

2. **Scheduled Updates:**
   - GitHub Actions workflow triggers daily (6am UTC)
   - Calls Amplify webhook via HTTP POST
   - Amplify rebuilds site with fresh data
   - Deploys updated static files

3. **Manual Updates:**
   - Any git commit triggers Amplify rebuild
   - Fresh data fetched during build
   - Standard deployment flow

### Error Handling

- Each fetcher wrapped in try/catch
- Returns empty array on failure
- Build process never fails due to API errors
- UI shows friendly message with profile link when no data

## API Integrations

### Goodreads (Books)

**Endpoint:** `https://www.goodreads.com/review/list_rss/{user_id}?shelf=currently-reading`

**Authentication:** None (public RSS feed)

**Data Extracted:**
- Title
- Author
- Cover image URL
- Book URL on Goodreads

**Implementation Notes:**
- Parse XML RSS feed
- Filter for `shelf="currently-reading"`
- Handle missing cover images with placeholder

### Trakt (Movies & TV Shows)

**Endpoint:** `https://api.trakt.tv/sync/watchlist/movies` and `/shows`

**Authentication:** Client ID in headers
```
trakt-api-version: 2
trakt-api-key: {CLIENT_ID}
```

**Data Extracted:**
- Title
- Year
- Poster URL (from TMDB integration)
- Trakt URL

**Implementation Notes:**
- Returns JSON
- Separate calls for movies and shows
- Combine results into single array
- Use watchlist as proxy for "currently watching"

### Letterboxd (Movies)

**Endpoint:** `https://letterboxd.com/{username}/rss/`

**Authentication:** None (public RSS feed)

**Data Extracted:**
- Title
- Year
- Poster image URL
- Letterboxd URL

**Implementation Notes:**
- Parse XML RSS feed
- Filter diary entries from last 7 days
- Use as proxy for recently watched

## UI Components

### MediaGrid Component Changes

**Remove:**
- "Currently" / "History" toggle
- History view functionality
- Spotify/Music/Games sections (already removed)

**Add:**
- Profile link buttons for each service
- Empty state messages
- Media item cards with cover images

**Layout:**
- 3-column grid: Books, Movies, Shows
- Up to 3 items per section
- Consistent terminal theme styling

### Media Item Card

**Structure:**
```
┌─────────────────┐
│  Cover Image    │
├─────────────────┤
│ Title           │
│ Author/Year     │
│ "Currently..."  │
└─────────────────┘
```

**Empty State:**
```
📚 Not currently reading anything
[View my Goodreads library →]
```

**Profile Links:**
- Goodreads: `https://www.goodreads.com/user/show/145806143`
- Trakt: `https://trakt.tv/users/me`
- Letterboxd: `https://letterboxd.com/mattboraske/`

## File Structure

### New Files

```
src/utils/mediaFetchers/
  ├── goodreads.ts       # Fetch currently reading books
  ├── trakt.ts           # Fetch currently watching
  ├── letterboxd.ts      # Fetch recent movie activity
  └── index.ts           # Export all fetchers

.github/workflows/
  └── daily-rebuild.yml  # Scheduled webhook trigger
```

### Modified Files

```
src/components/MediaGrid.astro     # Remove toggle, add profile links, display data
src/components/Hobbies.astro       # Pass fetched data to MediaGrid
src/types/content.ts               # Ensure MediaItem type matches needs
```

## GitHub Actions Workflow

### Trigger Schedule

```yaml
schedule:
  - cron: '0 6 * * *'  # 6am UTC daily
workflow_dispatch:      # Manual trigger option
```

### Workflow Steps

1. Trigger Amplify webhook
2. Done!

```yaml
- name: Trigger Amplify Rebuild
  run: curl -X POST ${{ secrets.AMPLIFY_WEBHOOK_URL }}
```

### Required Secrets

- `AMPLIFY_WEBHOOK_URL`: Webhook from Amplify Console

### Amplify Setup

1. AWS Amplify Console → Build settings → Webhooks
2. Create new webhook
3. Copy URL to GitHub repo secrets

## Environment Variables

**Already configured in `.env`:**
```bash
PUBLIC_GOODREADS_USER_ID=145806143
PUBLIC_TRAKT_API_KEY=10d447a00480b4a5d5535d18ed42704cceb9ad4c78ccb18972d631203f4d9235
PUBLIC_LETTERBOXD_USERNAME=mattboraske
```

**Must also add to Amplify:**
- Add same variables to Amplify Console → Environment variables
- Required for build-time fetching

## Data Types

### MediaItem Interface

```typescript
export interface MediaItem {
  title: string;
  coverUrl?: string;
  author?: string;     // For books
  rating?: string;
  date?: string;
  status: 'current' | 'completed';
  type: 'book' | 'movie' | 'show';
}
```

### Fetcher Return Type

```typescript
async function fetchGoodreads(): Promise<MediaItem[]>
async function fetchTrakt(): Promise<MediaItem[]>
async function fetchLetterboxd(): Promise<MediaItem[]>
```

## Testing Strategy

### Local Testing

```bash
npm run build
```
- Verify fetchers run during build
- Check browser for displayed data
- Test empty states by temporarily breaking API calls

### Workflow Testing

1. Manually trigger workflow in GitHub Actions
2. Monitor Amplify build logs
3. Verify fresh data appears on deployed site

### Error Testing

- Test with invalid API keys (should show empty state)
- Test with network errors (should show empty state)
- Verify build completes successfully despite errors

## Success Criteria

- ✅ Current books display from Goodreads
- ✅ Current movies/shows display from Trakt
- ✅ Recent movies display from Letterboxd
- ✅ Empty states show profile links
- ✅ Site rebuilds daily at 6am UTC
- ✅ Build never fails due to API errors
- ✅ Cover/poster images display correctly
- ✅ Links direct to correct service profiles

## Future Enhancements

- Add caching layer to reduce API calls
- Add "last updated" timestamp
- Support for more granular scheduling (multiple times per day)
- Add analytics to track which media gets most attention
