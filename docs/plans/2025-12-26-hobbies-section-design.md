# Hobbies Section Design

**Date:** 2025-12-26
**Status:** Approved

## Overview

Add a new "Hobbies" section to the portfolio website showcasing personal interests including hiking/backpacking trips, current media consumption, fitness journey, and dog profile.

## Goals

1. Add personal dimension to the professional portfolio
2. Showcase outdoor adventures with trip details and photos
3. Display current books, movies, shows, and games being consumed
4. Share fitness journey and personal records
5. Introduce Bella (Staffordshire Pitbull)
6. Keep section focused and lightweight - it's a small part of overall site

## Design Decisions

### Section Organization

**Single section with tabbed interface:**
- Tab 1: "Trail Log" - Hiking and backpacking trips
- Tab 2: "Currently Enjoying" - Books, movies, shows, games, music
- Tab 3: "Fitness" - Weightlifting PRs and journey
- Tab 4: "Meet Bella" - Dog profile

**Why tabs:**
- Groups related personal content together
- Maintains single-page site flow
- Reduces visual clutter
- Easier to navigate than separate sections

### Data Architecture

**Hybrid approach: Markdown + API integrations**

**Markdown files:**
- `src/resources/hobbies.md` - Trail log entries and Bella profile
- `src/resources/fitness.md` - PRs and fitness journey

**API integrations:**
- Goodreads RSS - Book tracking
- Letterboxd RSS - Movie tracking
- Trakt API - TV show tracking
- Backloggd RSS - Game tracking
- Spotify - Direct profile link (no API)

**Why hybrid:**
- APIs automate media tracking (no manual updates)
- Markdown for content that doesn't change frequently
- RSS feeds preferred over APIs (no auth, simpler)
- Spotify link-only keeps it simple

## Component Architecture

### Main Components

**Hobbies.astro**
- Main section component
- Tab navigation and state management
- Renders active tab content
- Consistent with existing section styling

**AdventureCard.astro**
- Individual trip display card
- Shows hero image, stats, highlights
- Expandable/modal for full details and photo gallery
- Grid layout similar to ProjectCard

**MediaGrid.astro**
- Displays books/movies/shows/games
- Current/History toggle functionality
- Simple cards: cover art + title only
- No progress tracking - just "currently consuming" vs "completed"

**FitnessTracker.astro**
- PR badges displayed as terminal-styled cards
- Journey narrative with photo gallery
- Two-section layout: Stats top, Story bottom

**BellaProfile.astro**
- Hero image of Bella
- Bio stats as info cards
- Adoption story with photo gallery

### Utility Functions

**parseAdventures()**
- Parses `hobbies.md` for trail log entries
- Extracts: location, date, duration, distance, elevation, difficulty, highlights, photos

**parseFitness()**
- Parses `fitness.md` for PRs and journey
- Extracts: PR list, journey text, photos

**parseBellaProfile()**
- Parses Bella section from `hobbies.md`
- Extracts: bio, stats, story, photos

**API Endpoints:**
- `/api/goodreads.json` - Fetch book data via RSS
- `/api/letterboxd.json` - Fetch movie data via RSS
- `/api/trakt.json` - Fetch TV show data via API
- `/api/backloggd.json` - Fetch game data via RSS

## Data Formats

### Trail Log Entry (hobbies.md)

```markdown
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
- trail-at-georgia-1.jpg
- trail-at-georgia-2.jpg
- trail-at-georgia-3.jpg
```

### Fitness Data (fitness.md)

```markdown
## Personal Records
- **Squat:** 315 lbs
- **Bench Press:** 225 lbs
- **Deadlift:** 405 lbs
- **Overhead Press:** 155 lbs

## My Journey
Started lifting in 2019 to build strength for backpacking trips...

### Photos
- gym-squat.jpg
- gym-deadlift.jpg
```

### Bella Profile (hobbies.md)

```markdown
## Meet Bella

### About
Bella is a 5-year-old Staffordshire Pitbull rescue...

**Age:** 5 years
**Breed:** Staffordshire Pitbull
**Favorite Things:** Hiking trails, squeaky toys, napping in sunbeams

### Our Story
Adopted Bella from the local shelter in 2020...

### Photos
- bella-portrait.jpg
- bella-hiking.jpg
```

## API Integration Details

### Goodreads RSS
- Feed URL: `https://www.goodreads.com/review/list_rss/{user_id}?shelf=currently-reading`
- Parse XML for title, author, cover image, rating
- No authentication required
- Shelf options: currently-reading, read

### Letterboxd RSS
- Feed URL: `https://letterboxd.com/{username}/rss`
- Parse XML for title, poster, rating, watch date
- No authentication required
- Auto-updates when you log films

### Trakt API
- Requires API key (free tier sufficient)
- Endpoint: `/users/{username}/watching` for current
- Endpoint: `/users/{username}/history/shows` for history
- Returns JSON with show details and progress
- Store API key in `.env` as `PUBLIC_TRAKT_API_KEY`

### Backloggd RSS
- Feed URL: `https://backloggd.com/u/{username}/games/feed/`
- Parse XML for title, cover, status, platform, rating
- No authentication required
- Updates when you update your backlog

### Spotify
- Simple link card to profile URL
- No API integration needed
- Keeps music section lightweight

## Implementation Plan

### Phase 1: Base Structure
1. Create `Hobbies.astro` component with tab navigation
2. Add Hobbies section to `index.astro` between Skills and Contact
3. Implement tab state management (client-side JS)
4. Style tabs with terminal theme (brackets, accent, glow)

### Phase 2: Trail Log
1. Create `AdventureCard.astro` component
2. Implement `parseAdventures()` utility
3. Add sample trip entries to `hobbies.md`
4. Build grid layout and modal/expandable view

### Phase 3: Media Tracking
1. Create API endpoints for each service
2. Implement `MediaGrid.astro` with toggle functionality
3. Build RSS parsers for Goodreads, Letterboxd, Backloggd
4. Build Trakt API integration
5. Add Spotify link card
6. Test API rate limits and error handling

### Phase 4: Fitness
1. Create `FitnessTracker.astro` component
2. Implement `parseFitness()` utility
3. Add fitness data to `fitness.md`
4. Build PR badges and journey layout

### Phase 5: Bella Profile
1. Create `BellaProfile.astro` component
2. Implement `parseBellaProfile()` utility
3. Add Bella content to `hobbies.md`
4. Build profile layout with photo gallery

### Phase 6: Polish
1. Add loading states for API data
2. Implement error handling and fallbacks
3. Add animation transitions between tabs
4. Optimize images for web
5. Test responsive design
6. Add analytics tracking for tab interactions

## Trade-offs

### API vs Manual Tracking
**Chose:** Hybrid approach (APIs for media, markdown for trips/fitness/Bella)
- **Pros:** Automates frequent updates, reduces maintenance
- **Cons:** Requires API setup, potential rate limits, external dependencies
- **Mitigation:** Use RSS when possible (no auth), graceful fallbacks

### Single Section vs Multiple Sections
**Chose:** Single tabbed section
- **Pros:** Compact, focused, maintains single-page flow
- **Cons:** Less prominent than separate sections
- **Why:** Hobbies are supplementary to professional content

### Progress Tracking vs Simple Status
**Chose:** No progress bars or percentages for media
- **Pros:** Cleaner UI, less data to manage
- **Cons:** Less detailed for completionists
- **Why:** Keeps focus on "what" not "how much"

### Letterboxd + Trakt vs Trakt Only
**Chose:** Separate services for movies and TV
- **Pros:** User prefers Letterboxd for movies, more specialized tracking
- **Cons:** Two integrations instead of one
- **Why:** User preference and better movie-focused features

### Backloggd vs Manual Games
**Chose:** Backloggd with RSS feed
- **Pros:** Consistent with other media tracking, auto-updates
- **Cons:** Another service to maintain
- **Why:** RSS feed makes it as easy as Letterboxd/Goodreads

## Environment Variables

```
# Trakt API (required for TV shows)
PUBLIC_TRAKT_API_KEY=your-trakt-api-key

# Usernames for RSS feeds
PUBLIC_GOODREADS_USER_ID=your-goodreads-user-id
PUBLIC_LETTERBOXD_USERNAME=your-letterboxd-username
PUBLIC_BACKLOGGD_USERNAME=your-backloggd-username
PUBLIC_SPOTIFY_PROFILE_URL=your-spotify-profile-url
```

## Error Handling

**API failures:**
- Display placeholder message: "Unable to load current [media type]"
- Log errors to console for debugging
- Don't break page rendering

**Missing images:**
- Use fallback placeholder images for trips/fitness/Bella
- Graceful degradation for missing trip photos

**Rate limits:**
- Cache API responses (client-side for session duration)
- Implement exponential backoff for failures
- Display cached data when rate limited

## Success Metrics

- Section loads without errors
- Tab navigation is smooth and intuitive
- API data displays correctly or fails gracefully
- Responsive design works on mobile
- Adds personal dimension without overshadowing professional content
