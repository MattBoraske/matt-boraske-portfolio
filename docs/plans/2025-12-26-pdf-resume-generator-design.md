# PDF Resume Generator Design

**Date:** 2025-12-26
**Status:** Approved

## Overview

A build-time utility that generates a PDF resume from markdown content files in `src/resources/`, using an LLM (Claude) to optimize content for professional resume format. The resume will match the style and format of the existing `Matthew_Boraske_Resume.pdf`.

**Key: This is a BUILD-TIME tool, not runtime. The Claude API is called during build/generation, and the resulting PDF is a static file deployed with the site. Users download the pre-generated PDF with zero API calls at runtime.**

## Architecture Flow

```
Markdown Files → LLM Resume Writer Agent → Structured Resume Data → HTML Template → Puppeteer → PDF (static file)
```

### Components

1. **Content Files** (`src/resources/`)
   - `resume-skills.md` - New file with condensed skills for resume (curated subset)
   - Existing: `hero.md`, `contact.md`, `timeline.md`, `certifications.md`

2. **Generator Script** (`scripts/generate-resume.js`)
   - Node.js script with complete generation pipeline
   - Reads and parses markdown files
   - Calls Claude API for content optimization
   - Renders HTML and generates PDF via Puppeteer

3. **HTML Template** (`scripts/templates/resume-template.html`)
   - Standalone HTML with embedded CSS
   - Styled to match existing PDF format
   - Template placeholders for dynamic content

4. **NPM Scripts** (in `package.json`)
   - `"generate-resume": "node scripts/generate-resume.js"`
   - `"prebuild": "npm run generate-resume"` - Auto-generate before build
   - Result: PDF generated at build-time, deployed as static asset

## Generation Workflow

### Step 1: Content Ingestion

Script reads markdown files and parses into structured objects:
- Personal info (name, title) from `hero.md`
- Contact details from `contact.md`
- Education and work experience from `timeline.md` (filtered by Type)
- Skills from `resume-skills.md`
- Certifications from `certifications.md`

### Step 2: LLM Transformation (Resume Writer Agent)

**Provider:** Anthropic Claude API
- Model: `claude-3-5-sonnet-latest`
- Requires: `ANTHROPIC_API_KEY` environment variable
- **Called once per build, not per user download**

**System Prompt Strategy:**
- Role: Expert resume writer for technical/data science roles
- Tone: Professional, achievement-focused, concise
- Guidelines: Action verbs, quantifiable impact, STAR method
- Format: Structured JSON output
- Constraints: Optimize for 1-page format

**Input to Claude:**
```json
{
  "personalInfo": {
    "name": "Matthew Boraske",
    "title": "Data Scientist",
    "contact": {...}
  },
  "education": [{
    "institution": "...",
    "degree": "...",
    "dates": "...",
    "rawHighlights": [...],
    "rawDescription": "..."
  }],
  "experience": [{
    "company": "...",
    "title": "...",
    "dates": "...",
    "rawDescription": "...",
    "technologies": [...]
  }],
  "skills": {
    "rawCategories": {...}
  },
  "certifications": [...]
}
```

**Output from Claude:**
```json
{
  "education": [{
    "institution": "...",
    "degree": "...",
    "dates": "...",
    "bullets": ["optimized bullet 1", "optimized bullet 2", ...]
  }],
  "experience": [{
    "company": "...",
    "title": "...",
    "dates": "...",
    "bullets": ["impact-focused bullet 1", ...]
  }],
  "technicalSkills": [{
    "category": "Data Science & AI",
    "items": "NLP, LLMs, ..."
  }],
  "certifications": [...]
}
```

**Optimization Scope:**
- ✅ Work experience descriptions → concise, impact-focused bullets
- ✅ Education highlights → key achievements, GPA, honors, coursework
- ✅ Skills organization → intelligent grouping into resume categories
- ✅ Overall length/formatting → ensure 1-page fit

**Processing:** Fully automatic (no manual review step)

### Step 3: PDF Generation

**HTML Template Structure:**

Embedded CSS styling:
- Typography: Professional fonts (Arial/Helvetica)
- Colors: Black text, gold/orange accents for title and headers
- Layout: Single column, 0.5-0.75" margins
- Header: Name (large bold) + Title (gold) + Contact (right-aligned with icons)
- Sections: Bold headers, clear spacing
- Entries: Company/Institution in gold, dates right-aligned, bulleted lists

Template placeholders inject optimized content from Claude.

**Puppeteer Configuration:**
- Headless Chrome
- Letter size (8.5" × 11")
- Print options: specified margins, no headers/footers
- Output: `public/Matthew_Boraske_Resume.pdf`

## Script Implementation

**File:** `scripts/generate-resume.js`

**Dependencies:**
```json
{
  "puppeteer": "^latest",
  "@anthropic-ai/sdk": "^latest",
  "marked": "^latest"
}
```

**Core Flow:**

1. **Load Configuration**
   - Read `ANTHROPIC_API_KEY` from env
   - Define file paths and options
   - Optional: Load `resume-config.json` for customization

2. **Parse Markdown Files**
   - Read all source files from `src/resources/`
   - Parse markdown (tables, lists, frontmatter)
   - Extract structured data (dates, locations, technologies)

3. **Call Claude API**
   - Initialize Anthropic client
   - Send structured prompt with raw content
   - Request JSON response with strict schema
   - Parse and validate response

4. **Render HTML Template**
   - Load `resume-template.html`
   - Inject Claude's optimized content
   - Handle array iteration (education, experience, etc.)

5. **Generate PDF**
   - Launch Puppeteer browser
   - Load HTML content
   - Configure print settings
   - Save PDF to output path
   - Close browser

6. **Error Handling**
   - API failures: Log and provide helpful message
   - File I/O errors: Check permissions and paths
   - PDF generation errors: Validate HTML
   - Exit with appropriate status codes

**Optional Configuration** (`resume-config.json`):
```json
{
  "outputPath": "public/Matthew_Boraske_Resume.pdf",
  "templatePath": "scripts/templates/resume-template.html",
  "model": "claude-3-5-sonnet-latest",
  "pdfOptions": {
    "format": "Letter",
    "margin": {
      "top": "0.5in",
      "bottom": "0.5in",
      "left": "0.5in",
      "right": "0.5in"
    }
  }
}
```

## Visual Design Matching

The PDF will replicate the existing resume format:
- **Header:** Name in large bold black, "Data Scientist" in gold below
- **Contact:** Icons with phone, email, LinkedIn, GitHub (right-aligned)
- **Section Headers:** Bold (Education, Experience, Technical Skills, Certifications)
- **Entries:** Company/institution names in gold, dates right-aligned
- **Bullets:** Proper spacing and indentation
- **Whitespace:** Clean, professional layout

## Build Integration

**package.json scripts:**
```json
{
  "scripts": {
    "generate-resume": "node scripts/generate-resume.js",
    "prebuild": "npm run generate-resume",
    "build": "astro build",
    "dev": "astro dev",
    "preview": "astro preview"
  }
}
```

**Workflow:**
1. Edit markdown files in `src/resources/`
2. Run `npm run build`
3. `prebuild` hook runs `generate-resume` first
4. Claude API called, PDF generated to `public/`
5. Astro build proceeds, includes static PDF
6. Deploy site with pre-generated PDF

**Cost:** Claude API called once per build, not per user download.

## Benefits

1. **Always Up-to-Date:** Resume auto-generated from website content
2. **LLM-Optimized:** Professional writing with impact-focused language
3. **Single Source of Truth:** Markdown files serve both website and resume
4. **Consistent Branding:** PDF matches professional format
5. **Easy Updates:** Edit markdown, run build, get updated PDF
6. **Zero Runtime Cost:** Static file, no API calls per download
7. **Fast User Experience:** Pre-generated PDF downloads instantly

## Future Enhancements (Optional)

- Multiple resume versions (data science vs. software engineering focus)
- Custom prompts for different job types
- A/B testing different phrasings
- Resume tailoring based on job description input
- Version tracking and changelog
