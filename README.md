# Matthew Boraske - Professional Portfolio

## Resume Generation

This project includes an automated PDF resume generator that creates a professional resume from markdown content files.

### How It Works

1. Content is sourced from markdown files in `src/resources/`
2. Claude API optimizes content for professional resume format
3. Optimized content is rendered into an HTML template
4. Puppeteer converts HTML to PDF

### Usage

Generate resume manually:
```bash
npm run generate-resume
```

The resume is automatically generated during build:
```bash
npm run build
```

Output: `public/Matthew_Boraske_Resume.pdf`

### Requirements

- `ANTHROPIC_API_KEY` environment variable (set in `.env`)
- Node.js dependencies: puppeteer, @anthropic-ai/sdk, marked

### Content Files

- `src/resources/hero.md` - Name and title
- `src/resources/contact.md` - Contact information
- `src/resources/timeline.md` - Education and experience
- `src/resources/resume-skills.md` - Technical skills (curated for resume)
- `src/resources/certifications.md` - Certifications

Edit these files to update resume content, then run `npm run generate-resume`.

## To-Do
- fix email form... add API key to amplify
- mobile optimizations
- fix favicon not loading in deployed app