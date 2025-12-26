# Adding and Updating Hobbies Content

This guide explains how to add trail log entries, update fitness data, manage Bella's profile, and configure media tracking in your hobbies section.

## Quick Start

1. **Trail Log**: Add entries to `src/resources/hobbies.md`
2. **Fitness**: Update PRs and journey in `src/resources/fitness.md`
3. **Bella Profile**: Update info in `src/resources/hobbies.md`
4. **Media Tracking**: Configure API keys in `.env`
5. Save and rebuild: `npm run build`

## Trail Log

### Adding a New Adventure

Open `src/resources/hobbies.md` and add a new entry under the `# Trail Log` section:

```markdown
# Trail Log

## Your Trail Name
**Location:** Starting Point to End Point, State
**Date:** Month Year
**Distance:** XX.X miles
**Max Elevation:** X,XXX ft @ Location Name

### Highlights
- First notable experience or achievement
- Second memorable moment
- Third highlight

### Photos
- photo-filename-1.jpg
- photo-filename-2.jpg
```

### Field Reference

#### Required Fields

**Trail Name**
- The ## heading (e.g., "John Muir Trail - Section Hike")
- Be specific about the trail and section

**Location**
- Format: `Start to End, State/Country`
- Example: `Springer Mountain to Neels Gap, GA`

**Date**
- Format: `Month Year`
- Example: `March 2024`

**Distance**
- Format: `XX.X miles`
- Include decimal for precision
- Example: `31.2 miles`

**Max Elevation**
- Format: `X,XXX ft @ Location Name`
- Highest point reached on the trail
- Include the location name for context
- Example: `13,000 ft @ Surprise Lake`

#### Optional Fields

**Highlights**
- 2-5 bullet points of memorable moments
- Keep each to one line
- Focus on unique experiences

**Photos**
- List image filenames
- Photos should be in `public/images/` directory
- Recommended size: 1200x800px or similar 3:2 aspect ratio

### Example Entry

```markdown
## Pacific Crest Trail - Oregon Section
**Location:** Crater Lake to McKenzie Pass, OR
**Date:** July 2024
**Distance:** 78.3 miles
**Max Elevation:** 10,358 ft @ South Sister

### Highlights
- Hiked around Crater Lake's rim at sunrise
- Encountered a black bear family near Three Sisters
- Crossed fields of wildflowers in full bloom
- Summited South Sister at peak elevation

### Photos
- pct-crater-lake.jpg
- pct-sisters.jpg
- pct-wildflowers.jpg
```

## Fitness Data

### Updating Personal Records

Open `src/resources/fitness.md` and update the `## Personal Records` section:

```markdown
## Personal Records
- **Squat:** 315 lbs
- **Bench Press:** 225 lbs
- **Deadlift:** 405 lbs
- **Overhead Press:** 155 lbs
```

### Adding New Exercises

You can add or modify exercises:

```markdown
## Personal Records
- **Squat:** 315 lbs
- **Bench Press:** 225 lbs
- **Deadlift:** 405 lbs
- **Overhead Press:** 155 lbs
- **Pull-ups:** 20 reps
- **Clean & Jerk:** 185 lbs
```

### Format Requirements

- Use format: `- **Exercise Name:** Weight/Reps`
- Weight format: `XXX lbs`
- Reps format: `XX reps`
- Maximum recommended: 6-8 exercises for clean display

### Updating Your Journey

The `## My Journey` section is a paragraph describing your fitness story:

```markdown
## My Journey
Started lifting in 2019 to build strength for backpacking trips. What began as
functional training became a passion for progressive overload and the mental
discipline that comes with consistent training. Now I focus on compound movements
and maintaining strength for outdoor adventures.
```

**Tips:**
- Keep to 2-4 sentences
- Include when you started and why
- Mention your current focus
- Be authentic and personal

### Adding Photos

```markdown
### Photos
- gym-squat-pr.jpg
- gym-deadlift.jpg
```

Photos display as placeholders with 💪 emoji until you add real images to `public/images/`.

## Bella Profile

### Updating Bella's Information

Open `src/resources/hobbies.md` and find the `# Bella Profile` section:

```markdown
# Bella Profile

## Meet Bella

### About
Bella is a Staffordshire Pitbull rescue with more energy than sense.
She loves hiking, belly rubs, and stealing socks.

**Birthday:** 2018-05-15
**Breed:** Staffordshire Pitbull
**Favorite Things:** Hiking trails, squeaky toys, napping in sunbeams

### Our Story
Adopted Bella from the local shelter in 2020. She was nervous at first but
quickly became the most loyal companion. Now she's my constant hiking buddy
and the best decision I ever made.

### Photos
- bella-hiking.jpg
- bella-portrait.jpg
```

### Field Reference

**About** (paragraph)
- 1-2 sentences introducing your pet
- Include personality traits
- Keep it fun and personal

**Birthday**
- Format: `YYYY-MM-DD` (ISO 8601 date format)
- Age is automatically calculated from this date
- Example: `2018-05-15` for May 15, 2018
- If you don't know the exact date, use January 1st or an estimated date

**Breed**
- Full breed name or mix description
- Example: `Labrador Retriever` or `German Shepherd Mix`

**Favorite Things**
- Comma-separated list
- 3-5 items work best
- Example: `Hiking trails, squeaky toys, napping in sunbeams`

**Our Story** (paragraph)
- 2-4 sentences about how you met
- Include adoption story or background
- Share what makes your relationship special

**Photos**
- Add images to `public/images/`
- Recommended: 2-4 photos
- Square or portrait orientation works best

### Changing Pet Information

If you have a different pet or want to feature someone else:

```markdown
# Bella Profile

## Meet Max

### About
Max is a Golden Retriever who thinks he's a lap dog despite weighing
75 pounds. Champion stick-fetcher and professional food enthusiast.

**Birthday:** 2022-03-20
**Breed:** Golden Retriever
**Favorite Things:** Swimming, tennis balls, car rides, snacks

### Our Story
Got Max as a puppy in 2022. He failed out of service dog training for being too
friendly (seriously). Now he's the neighborhood's favorite greeter and my loyal
running companion.

### Photos
- max-beach.jpg
- max-fetch.jpg
```

## Media Tracking

### Configuring API Keys

The "Currently Enjoying" tab supports integration with various media tracking services for books, movies, and TV shows.

#### Step 1: Copy Environment Template

```bash
cp .env.example .env
```

#### Step 2: Add Your API Keys

Edit `.env` and add your credentials:

```bash
# Media Tracking APIs
PUBLIC_TRAKT_API_KEY=your-trakt-api-key-here
PUBLIC_GOODREADS_USER_ID=your-goodreads-user-id
PUBLIC_LETTERBOXD_USERNAME=your-letterboxd-username
```

### Supported Services

#### Trakt (Movies & TV)
**Current Status:** Placeholder for future integration
**What it will do:** Display currently watching and watch history

1. Create account at [trakt.tv](https://trakt.tv)
2. Get API key from [trakt.tv/oauth/applications](https://trakt.tv/oauth/applications)
3. Add to `.env`: `PUBLIC_TRAKT_API_KEY=your-key`

#### Goodreads (Books)
**Current Status:** Placeholder for future integration
**What it will do:** Display currently reading and reading history

1. Find your Goodreads user ID in your profile URL
2. Add to `.env`: `PUBLIC_GOODREADS_USER_ID=12345678`

#### Letterboxd (Movies)
**Current Status:** Placeholder for future integration
**What it will do:** Display movie watching activity

1. Create account at [letterboxd.com](https://letterboxd.com)
2. Add to `.env`: `PUBLIC_LETTERBOXD_USERNAME=yourusername`

### Future API Integration

The media tracking components are structured for future API integration. To add API support:

1. Create API endpoint in `src/pages/api/media/`
2. Implement RSS/API parsing logic
3. Update `MediaGrid.astro` to fetch from endpoint
4. See implementation plan in `docs/plans/2025-12-26-hobbies-section.md`

## Adding Photos

### Photo Storage

All hobby photos should be stored in:
```
public/images/
```

### Photo Guidelines

**Trail Log Photos**
- Aspect ratio: 16:9 or 3:2
- Size: 1200x800px recommended
- Format: JPG (optimized)
- File size: < 300KB

**Fitness Photos**
- Aspect ratio: 1:1 (square)
- Size: 800x800px recommended
- Format: JPG (optimized)
- File size: < 200KB

**Pet Photos**
- Aspect ratio: 1:1 (square) or 4:5 (portrait)
- Size: 800x800px or 800x1000px
- Format: JPG (optimized)
- File size: < 200KB

### Optimizing Photos

Before adding photos:

```bash
# Using ImageMagick
convert input.jpg -resize 1200x800 -quality 85 output.jpg

# Using online tools
# - TinyPNG: https://tinypng.com
# - Squoosh: https://squoosh.app
```

### Placeholder System

Until you add real photos, emoji placeholders display:
- 🏔️ Trail Log (mountain)
- 💪 Fitness (flexing bicep)
- 🐕 Bella Profile (dog)
- 📸 Photo galleries (camera)

## Testing Your Changes

### Local Development

```bash
# Start dev server
npm run dev

# Visit hobbies section
open http://localhost:4321/#hobbies

# Test each tab:
# - Trail Log: Check adventure cards display
# - Currently Enjoying: Verify media grid and Spotify link
# - Fitness: Check PRs and journey text
# - Meet Bella: Verify profile information
```

### Production Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview

# Verify:
# - No build errors
# - All tabs load correctly
# - Images display properly
# - Spotify link works
```

## Common Issues

### Entry Not Appearing

**Problem**: Added trail log/fitness entry but it doesn't show

**Solutions**:
1. Check markdown syntax (spaces after `**Field:**`)
2. Verify section headers (`# Trail Log`, `## Entry Name`)
3. Rebuild: `npm run build`
4. Check browser console for parsing errors

### Photos Not Loading

**Problem**: Image filename correct but not displaying

**Solutions**:
1. Verify image is in `public/images/` directory
2. Check filename matches exactly (case-sensitive)
3. Clear browser cache
4. Use relative path only (no leading slash)

### Difficulty Badge Wrong Color

**Problem**: Trail difficulty showing wrong color

**Solutions**:
- Use exact spelling: `Easy`, `Moderate`, or `Strenuous`
- Check for extra spaces or capitalization errors
- Format: `**Difficulty:** Moderate` (not `difficulty` or `DIFFICULTY`)

## Best Practices

### Trail Log

- **Order**: Most recent adventures first
- **Variety**: Mix different trails and difficulty levels
- **Details**: Include specific highlights, not generic ones
- **Photos**: Add 2-3 quality photos per adventure
- **Updates**: Add new entries as you complete hikes

### Fitness

- **Honesty**: Only list genuine PRs, don't exaggerate
- **Updates**: Update when you hit new records
- **Journey**: Keep story current and authentic
- **Focus**: Feature compound lifts and key exercises
- **Photos**: Add progress photos if comfortable sharing

### Pet Profile

- **Current**: Keep age and info up to date
- **Personality**: Let your pet's character shine through
- **Photos**: Use clear, well-lit photos
- **Story**: Share genuine moments and experiences
- **Privacy**: Only share what you're comfortable with

### Media Tracking

- **Privacy**: Only connect public profiles
- **Links**: Test Spotify link works
- **Future**: Keep API keys secure in `.env` (never commit)

## File Structure Reference

```
src/
├── resources/
│   ├── hobbies.md          # Trail Log + Bella Profile
│   └── fitness.md          # Fitness PRs + Journey
├── components/
│   ├── Hobbies.astro       # Main hobbies section
│   ├── AdventureCard.astro # Trail log cards
│   ├── FitnessTracker.astro# Fitness display
│   ├── BellaProfile.astro  # Pet profile
│   └── MediaGrid.astro     # Media tracking
└── utils/
    ├── parseAdventures.ts  # Trail log parser
    ├── parseFitness.ts     # Fitness parser
    └── parseBellaProfile.ts# Pet profile parser

public/
└── images/                 # Store all photos here

.env                        # Your API keys (don't commit!)
.env.example               # Template for API keys
```

## Next Steps

After updating your hobbies content:

1. **Test locally**: `npm run dev` and verify appearance
2. **Review content**: Check all tabs render correctly
3. **Test tab switching**: Verify navigation works
4. **Add photos**: Upload optimized images to `public/images/`
5. **Build**: `npm run build` to ensure no errors
6. **Commit**: `git add` and `git commit` your changes
7. **Deploy**: Push to trigger deployment

## Need Help?

- See [CONTENT_GUIDE.md](./CONTENT_GUIDE.md) for general content management
- Review example content in `src/resources/hobbies.md` and `src/resources/fitness.md`
- Check TypeScript types in `src/types/content.ts`
- Review parser logic in `src/utils/parse*.ts` files
- See implementation plan in `docs/plans/2025-12-26-hobbies-section.md`
