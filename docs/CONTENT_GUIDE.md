# Content Management Guide

This portfolio uses a markdown-based content management system. All content is stored in `src/resources/` as `.md` files, parsed at build time, and rendered dynamically.

## Philosophy

- **Markdown as Source of Truth**: Content lives in simple markdown files, not buried in component code
- **Build-Time Parsing**: Content is parsed during the build process for optimal performance
- **Type Safety**: TypeScript types ensure content structure consistency
- **Easy Updates**: Edit markdown files and rebuild to update your portfolio

## Content Files

All content files are located in `src/resources/`:

| File | Purpose | Component |
|------|---------|-----------|
| `research.md` | Publications and research papers | `Research.astro` |
| `spotlight.md` | Current role description | `RoleSpotlight.astro` |
| `projects.md` | Portfolio projects | `Projects.astro` |
| `skills.md` | Technical skills organized by category | `Skills.astro` |
| `timeline.md` | Work experience and education | `Timeline.astro` |

## Updating Research Publications

**File**: `src/resources/research.md`

### Format

```markdown
# Research Publications

## Your Publication Title
- **Venue:** Conference or Journal Name
- **Year:** 2025
- **Summary:** 2-3 sentences describing your research and key findings
- **Authors:** Author names
- **Tags:** Keyword1, Keyword2, Keyword3
- **PDF:** https://link-to-paper.pdf
- **GitHub:** https://github.com/username/repo
- **HuggingFace:** https://huggingface.co/collection-url
- **ID:** unique-id (optional, for anchor links)
```

### Example

```markdown
## Context is Key: Aligning LLMs with Human Moral Judgments
- **Venue:** FLAIRS (Florida Artificial Intelligence Research Society)
- **Year:** 2025
- **Summary:** This research investigates whether pre-trained LLMs can align with human moral judgments using RAG approaches.
- **Authors:** Boraske, M.
- **Tags:** LLMs, RAG, NLP
- **PDF:** https://journals.flvc.org/FLAIRS/article/download/138947/144114
- **GitHub:** https://github.com/MattBoraske/AITA-RAG-Agent
```

### Adding a New Publication

1. Open `src/resources/research.md`
2. Add a new `## Title` section at the top or bottom
3. Fill in all required fields (Venue, Year, Summary)
4. Add optional fields as needed (Authors, Tags, PDF, GitHub, HuggingFace)
5. Save the file
6. Run `npm run build` to regenerate the site

## Updating Current Role

**File**: `src/resources/spotlight.md`

### Format

```markdown
# Role Spotlight

**Company:** Your Company Name
**Role:** Your Job Title

**Description:**
First paragraph about your role and responsibilities.

Second paragraph about specific achievements or projects.

Third paragraph about your focus areas and impact.
```

### Tips

- Keep description to 2-4 paragraphs
- Focus on impact and specific technologies
- Update when you change roles or have new achievements
- Description paragraphs are automatically separated in the UI

## Updating Projects

**File**: `src/resources/projects.md`

See [`ADDING_PROJECTS.md`](./ADDING_PROJECTS.md) for detailed project management instructions.

### Quick Format

```markdown
## Project Title
- **Category:** Web Development | Machine Learning | Generative AI | Data Engineering | Analytics
- **Description:** 2-3 sentences about what you built and its impact
- **Technologies:** Python, React, AWS (comma-separated)
- **GitHub:** https://github.com/username/repo
- **Demo:** https://demo-url.com (optional)
- **Featured:** true (appears first) or false
- **Image:** filename.png (in src/resources/) or "placeholder"
```

## Updating Skills

**File**: `src/resources/skills.md`

This file is managed by the existing `parseSkills.ts` parser. See the file for current format examples.

## Updating Timeline (Experience)

**File**: `src/resources/timeline.md`

### Format with Bullets

```markdown
## Your Role Title
- **Company:** Company Name
- **DateRange:** Jan 2023 - Present
- **Type:** work (or "education")
- **Logo:** /path/to/logo.svg (optional)
- **Technologies:** Python, TypeScript, AWS
- **Bullets:**
  - Led development of X feature resulting in Y impact
  - Built Z system using A and B technologies
  - Improved performance by N%
```

### Format with Description

```markdown
## Your Role Title
- **Company:** University Name
- **DateRange:** Aug 2020 - May 2024
- **Type:** education
- **Description:** Brief description of your role or degree program
- **Technologies:** Relevant technologies or coursework
```

### Adding New Experience

1. Open `src/resources/timeline.md`
2. Add new `## Role Title` at the top (most recent first)
3. Use **Bullets** for work experience with multiple achievements
4. Use **Description** for education or single-responsibility roles
5. Set **Type** to "work" or "education"
6. Technologies are automatically displayed as tags

## Build and Deploy Workflow

### Local Development

```bash
# Make content changes
vim src/resources/research.md

# See changes immediately (hot reload)
npm run dev

# Verify in browser
open http://localhost:4321
```

### Production Build

```bash
# Build the site
npm run build

# Preview production build
npm run preview

# Deploy (automatic on git push to main)
git add src/resources/
git commit -m "Update content"
git push origin main
```

## Best Practices

### Writing Descriptions

- **Be specific**: "Improved query performance by 60%" not "Made things faster"
- **Show impact**: Include metrics, user counts, or business outcomes
- **Use active voice**: "Built" "Led" "Deployed" not "Was responsible for"
- **Keep it current**: Update descriptions as your work evolves

### Managing Images

- Store project images in `src/resources/` or `public/`
- Use descriptive filenames: `donor-sentiment-dashboard.png`
- Optimize images before adding (< 200KB recommended)
- Use `"placeholder"` for demo projects without screenshots

### Version Control

- Commit content changes separately from code changes
- Use descriptive commit messages: `"Add FLAIRS 2025 publication"`
- Keep one logical change per commit for easy rollback

### SEO Considerations

- Use descriptive, keyword-rich titles
- Write summaries that include key technologies and outcomes
- Add relevant tags to publications
- Update meta descriptions in `src/layouts/Layout.astro` if needed

## Troubleshooting

### Content Not Updating

1. Check file syntax (proper markdown formatting)
2. Verify all required fields are present
3. Rebuild: `npm run build`
4. Clear browser cache or use incognito mode

### Parser Errors

If you see build errors:

1. Check for special characters that need escaping (apostrophes, quotes)
2. Ensure field names match exactly (case-sensitive)
3. Verify comma-separated lists don't have trailing commas
4. Check that markdown headers use `##` not `#` for entries

### Build Failures

```bash
# Clear cache and rebuild
rm -rf dist node_modules/.vite
npm run build
```

## Advanced: Custom Fields

To add new fields to content types:

1. Update type in `src/types/content.ts`
2. Update parser in `src/utils/parse*.ts`
3. Update component to use new field
4. Update documentation (this file)
5. Rebuild and test

Example: Adding "doi" field to publications:

```typescript
// src/types/content.ts
export interface Publication {
  // ... existing fields
  doi?: string;
}

// src/utils/parsePublications.ts
return {
  // ... existing fields
  doi: getField('DOI') || undefined
};

// src/components/PublicationCard.astro
const { title, venue, year, doi, ... } = Astro.props;
```

## Need Help?

- Review example content in existing `.md` files
- Check component source code to see how content is used
- See parser utilities in `src/utils/` for field names and formats
- Refer to TypeScript types in `src/types/content.ts` for available fields
