# Medium Research & Writing Agent

An AI-powered agent that researches current topics in tech and writes expert-level articles for amateur audiences.

## Overview

This agent automates the content creation pipeline:

1. **Research** - Searches the web for latest developments in AI, ML, cloud, and system architecture
2. **Analysis** - Identifies the most interesting and timely topics
3. **Writing** - Creates engaging, educational articles in an expert-to-amateur style
4. **Local Drafts** - Saves articles to `./drafts/` for review and manual publishing

> **Note on Medium Publishing:** Medium's API is deprecated as of January 2025. The agent generates local drafts that you can manually publish to Medium, Dev.to, Hashnode, or any other platform.

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Add to your `.env` file:

```bash
# Required - for AI research and writing
ANTHROPIC_API_KEY=your_api_key_here
```

**Note:** Medium API tokens are no longer being issued as of January 2025. The agent works perfectly for generating local drafts without any additional configuration.

## Usage

### Generate Article

```bash
npm run research-agent
```

This will:
- Research current topics using web search
- Select the most interesting topic
- Write a complete 1200-1800 word article
- Save it to `./drafts/` folder with timestamp
- Display article stats (title, word count, file location)

### Manual Publishing Workflow

After generating an article:
1. Review the draft in `./drafts/[date]-[title].md`
2. Make any edits you want
3. Manually publish to your platform of choice:
   - **Medium** - Copy/paste into Medium editor
   - **Dev.to** - Use their markdown import
   - **Hashnode** - Direct markdown import
   - **LinkedIn** - Copy/paste article
   - **Your own blog** - Use the markdown file directly

### Manual Execution

```bash
node scripts/medium-research-agent.js
```

## How It Works

### Research Topics

The agent searches for current developments in:
- Data Science
- System Architecture
- Cloud Computing
- Traditional AI
- Generative AI
- AI Agents
- Machine Learning
- MLOps

### Topic Selection

Uses Claude to:
1. Evaluate timeliness and relevance
2. Assess practical applicability
3. Consider educational value
4. Rate interest level

### Article Writing

Creates articles with:
- **Tone**: Expert explaining to motivated amateurs
- **Length**: 1200-1800 words
- **Structure**:
  - Catchy, clear title
  - Engaging hook
  - Background/context
  - Deep dive
  - Practical examples
  - Implications
  - Next steps
  - Conclusion

### Local Drafts

- Saves articles to `./drafts/` with timestamp
- Includes frontmatter with metadata (title, category, tags, date)
- Markdown format ready for any publishing platform
- Auto-generates relevant tags based on content

## Output

### Local Files

Articles are saved to `./drafts/` with:
- Filename: `YYYY-MM-DD-article-title.md`
- Frontmatter with metadata (title, category, tags, date, status)
- Full markdown content
- Proper heading structure for easy publishing

Example:
```
drafts/
  └── 2025-12-27-understanding-ai-agents-in-production.md
```

### Console Output

The agent displays:
- Research progress (topics found, searches performed)
- Selected topic and rationale
- Article title and word count
- File save location
- Success confirmation

## Customization

### Change Research Topics

Edit `RESEARCH_TOPICS` array in `medium-research-agent.js`:

```javascript
const RESEARCH_TOPICS = [
    'your custom topic',
    'another topic',
    // ...
];
```

### Adjust Writing Style

Modify the writing prompt in the `writeArticle()` function to change:
- Tone and voice
- Article length
- Structure
- Target audience level

### Add More Tags

Update `generateTags()` function to include more technology-specific tags.

## Automation

### Run on Schedule

Use cron (Linux/Mac) or Task Scheduler (Windows):

```bash
# Run every Monday at 9am
0 9 * * 1 cd /path/to/project && npm run research-agent
```

### GitHub Actions

Create `.github/workflows/research-agent.yml`:

```yaml
name: Weekly Article Generation
on:
  schedule:
    - cron: '0 9 * * 1' # Every Monday at 9am
  workflow_dispatch: # Manual trigger

jobs:
  generate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm run research-agent
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
          MEDIUM_INTEGRATION_TOKEN: ${{ secrets.MEDIUM_INTEGRATION_TOKEN }}
      - uses: actions/upload-artifact@v3
        with:
          name: article-draft
          path: drafts/
```

## Tips

### Review Before Publishing

1. Run `npm run research-agent`
2. Review article in `./drafts/` folder
3. Make any edits needed
4. Copy/paste to your publishing platform of choice

### Finding Great Topics

The agent works best when:
- Major tech announcements happen
- New research papers are published
- Conferences occur (re:Invent, KubeCon, NeurIPS, etc.)
- Significant product launches

### Improving Quality

- Run multiple times and pick the best article
- Provide feedback by editing the prompts
- Add domain-specific knowledge to research topics
- Customize tags for better Medium discoverability

## Troubleshooting

### "No topics found"

- Check your internet connection
- Verify ANTHROPIC_API_KEY is set in `.env`
- Try running again (web search results can vary)

### Search failures

If web searches fail, the agent will still work using Claude's knowledge through January 2025. For best results with current events, ensure stable internet connection.

### Articles too technical/simple

Adjust the writing prompt in `scripts/medium-research-agent.js`:
- For more technical: Change target audience to "senior engineers"
- For simpler: Change to "beginners and career switchers"

## Examples

### Sample Article Topics Generated

- "Understanding Vector Databases: The Foundation of Modern AI Applications"
- "How Multi-Agent Systems Are Changing Software Architecture"
- "Practical Guide to Implementing RAG in Production"
- "Cloud Cost Optimization: Lessons from Scaling to 1M Users"

## Future Enhancements

Potential improvements:
- [ ] Multi-platform publishing (Dev.to, Hashnode)
- [ ] Image generation for articles
- [ ] SEO optimization
- [ ] Social media cross-posting
- [ ] Analytics tracking
- [ ] A/B testing titles
- [ ] Series/sequence planning

## License

Part of your professional website project.
