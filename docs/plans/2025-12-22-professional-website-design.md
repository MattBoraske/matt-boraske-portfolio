# Professional Portfolio Website Design

## Overview

A personal portfolio website for a Data Scientist / AI-ML Engineer / Data Engineer. The site serves as a professional hub emphasizing current work, past research, and personal projects, with links to Medium for writing.

## Tech Stack

- **Framework**: Astro
- **Styling**: CSS (or Tailwind CSS)
- **Deployment**: Vercel or Netlify (free tier)
- **Form Backend**: Formspree or Netlify Forms
- **RSS Integration**: Medium RSS feed auto-fetch at build time

## Visual Design

### Style
- Apple-inspired minimal aesthetic
- Clean sans-serif typography (Inter or system font stack)
- Generous whitespace
- High contrast

### Colors
- Light mode: Near-black text (#1a1a1a) on white background
- Dark mode: Light text on near-black background
- One subtle accent color for links/buttons (muted blue or similar)
- Theme toggle in header

### Typography
- Large, bold headings
- Lighter body text
- 60-70% page width for readability

### Animations
- Subtle scroll-triggered fade/slide-in effects
- Smooth hover transitions
- Filter transitions on project grid

## Site Structure

### Header (Fixed)
- **Left**: Name/logo (text-based)
- **Center-Right**: Navigation links (About, Experience, Research, Projects, Writing, Contact)
- **Far Right**: Social icons (GitHub, LinkedIn, Medium, Email) + dark/light mode toggle
- **Behavior**: Subtle backdrop blur on scroll

### Section 1: Hero
- Large, bold headline with name
- Subtitle: "Data Scientist | AI/ML Engineer | Data Engineer"
- One-liner tagline (e.g., "Building intelligent systems at the intersection of healthcare and machine learning")
- CTA button: "View My Work" or "Get in Touch"
- Optional: Subtle animated gradient or minimal geometric accent

### Section 2: Current Role Spotlight
- Section heading: "What I Do"
- Company: CSL Behring (small logo/badge)
- Role: Data Scientist
- 2-3 paragraphs describing:
  - What you work on (domains, problem types)
  - Technologies and methods used
  - Impact areas (non-proprietary)
- Highlight cards (3-4) with tech-focused skills, light domain context:
  - Examples: "Machine Learning Pipelines", "Production ML Systems", "Healthcare Analytics", "Data Engineering"

### Section 3: Work Experience Timeline
- Section heading: "Experience"
- Vertical timeline format
- Includes current role (CSL Behring) for chronological context
- Each entry contains:
  - Date range
  - Company name + small logo
  - Role title
  - 2-3 bullet points or short paragraph
  - Tech stack tags
- Visual: Thin vertical line connecting entries, dot/node at each role
- Ordering: Most recent at top
- Mobile: Stacked vertically, timeline line on left

### Section 4: Research & Publications
- Section heading: "Research"
- 2 publications displayed as larger, detailed cards
- Single row, side-by-side on desktop
- Each card contains:
  - Paper/project title (linked to publication)
  - Publication venue/context
  - Year
  - Summary (2-3 sentences)
  - Co-authors (if applicable)
  - Method/topic tags
- Hover effect: subtle lift/shadow

### Section 5: Personal Projects
- Section heading: "Projects"
- Filter buttons at top: "All", "ML/AI", "Data Engineering", etc.
- Grid of ~5 projects
- Each project card contains:
  - Thumbnail/screenshot
  - Project title
  - Short description (1-2 sentences)
  - Tech stack tags
  - Links: GitHub, live demo, write-up (as applicable)
- Hover: Subtle scale-up or overlay with quick links
- Filter transitions: Smooth fade/shuffle animation
- Option to badge 1-2 featured projects

### Section 6: Recent Writing
- Section heading: "Writing"
- Auto-fetched from Medium RSS feed at build time
- 3-4 most recent articles displayed
- Each entry contains:
  - Article title (links to Medium)
  - Publication date
  - Brief excerpt (1-2 sentences)
  - Read time (optional)
- "Read more on Medium" link at bottom to profile
- External link icons indicating opens in new tab

### Section 7: Skills & Tech Stack
- Section heading: "Skills"
- Grouped text tags by category:
  - **Languages**: Python, SQL, R, etc.
  - **ML/AI**: PyTorch, TensorFlow, scikit-learn, etc.
  - **Data Engineering**: Spark, Airflow, dbt, etc.
  - **Cloud/Infrastructure**: AWS, GCP, Docker, etc.
  - **Other**: Git, Linux, etc.
- Clean tag styling, grouped under category headings

### Section 8: Contact
- Section heading: "Get in Touch"
- Brief intro line
- Two-column layout (stacks on mobile):
  - **Left**: Contact form
    - Name field
    - Email field
    - Message textarea
    - Submit button
  - **Right**: Direct contact options
    - Email address (mailto link)
    - LinkedIn, GitHub, Medium icons
    - Location (city/region, optional)
- Form backend: Formspree or Netlify Forms
- Success state: "Thanks, I'll be in touch" message

### Footer
- Minimal design
- Copyright notice
- Repeat social icons (optional)

## Interactive Features

| Feature | Description |
|---------|-------------|
| Scroll animations | Sections fade/slide in as user scrolls |
| Project filtering | Filter projects by category with smooth transitions |
| Contact form | Functional form with backend integration |
| Resume download | PDF download button (location TBD - header or hero) |
| Dark/light toggle | Theme switcher, persists user preference |

## Responsive Behavior

- **Desktop**: Full layout as described
- **Tablet**: Reduced padding, 2-column grids become 1-2 columns
- **Mobile**:
  - Hamburger menu for navigation
  - Single column layouts
  - Timeline line moves to left side
  - Stacked cards and sections

## Content Requirements

To build the site, the following content is needed:

1. **Hero**: Tagline/one-liner
2. **Current Role**: 2-3 paragraphs about CSL Behring work, highlight card topics
3. **Experience**: Past roles with dates, descriptions, tech used
4. **Research**: 2 publication details (title, venue, year, summary, link)
5. **Projects**: ~5 projects with descriptions, screenshots, links
6. **Skills**: List of technologies grouped by category
7. **Contact**: Email address, social links
8. **Resume**: PDF file for download
9. **Medium**: Profile URL for RSS feed

## Deployment

- Host on Vercel or Netlify (free tier)
- Auto-deploy on git push
- RSS feed fetched at build time (rebuild periodically or on publish)
