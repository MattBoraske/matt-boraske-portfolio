# Adding Projects to Your Portfolio

This guide explains how to add, update, and manage projects in your portfolio using the markdown-based content system.

## Quick Start

1. Open `src/resources/projects.md`
2. Find a `[PLACEHOLDER]` project or add a new section
3. Update the fields with your project information
4. Save and rebuild: `npm run build`

## Project Structure

Each project is defined using a simple markdown format:

```markdown
## Your Project Title
- **Category:** Machine Learning | Generative AI | Web Development | Data Engineering | Analytics
- **Description:** 2-3 sentences describing what you built, the problem it solved, and its impact. Focus on outcomes and metrics.
- **Technologies:** Python, TensorFlow, React, AWS (comma-separated list)
- **GitHub:** https://github.com/yourusername/repo-name
- **Demo:** https://your-demo-url.com (optional)
- **Featured:** true (or false)
- **Image:** filename.png (or "placeholder")
```

## Field Reference

### Required Fields

#### Category
Choose one category that best represents your project:
- `Machine Learning` - Traditional ML, predictive models, classification
- `Generative AI` - LLMs, RAG, fine-tuning, prompt engineering
- `Web Development` - Frontend, backend, full-stack applications
- `Data Engineering` - ETL pipelines, data infrastructure, databases
- `Analytics` - Dashboards, visualization, business intelligence

#### Description
- Length: 2-3 sentences (150-250 characters recommended)
- Include: What you built, why, and the impact/outcome
- Use specific metrics when possible ("30% faster", "500 users", "15% improvement")
- Active voice preferred ("Built", "Deployed", "Reduced")

**Good examples:**
```
Conversational AI tool analyzing donor reviews to drive operational improvements.
Implemented sentiment analysis and topic modeling. Achieved 15% improvement in
average review scores across 50+ donation centers.
```

```
Production RAG system enabling semantic search across organizational documentation.
Implements hybrid search with fine-tuned embeddings. Reduced information retrieval
time by 40% for 200+ users.
```

**Avoid:**
```
A cool project I made using AI to do stuff. It works really well and people like it.
```

#### Technologies
- Comma-separated list of technologies used
- Order: Most important/prominent first
- Be specific: "GPT-4" not "OpenAI", "React" not "JavaScript"
- Limit to 6-8 key technologies for readability

**Examples:**
```
Python, GPT-4, RAG, LangChain, FastAPI, Docker
Python, Flan-T5, Fine-tuning, PEFT, HuggingFace, PyTorch
React, TypeScript, Tailwind CSS, Astro, AWS Amplify
Python, Apache Spark, Delta Lake, Databricks, SQL
```

### Optional Fields

#### GitHub
- Full URL to your repository
- Use HTTPS format: `https://github.com/username/repo`
- If project is private/proprietary, omit this field
- Can use placeholder URL: `https://github.com/yourusername/PLACEHOLDER-project-name`

#### Demo
- Live deployment URL
- Only include if demo is publicly accessible
- Examples: deployed app, documentation site, HuggingFace Space

#### Featured
- Set to `true` for your best 2-3 projects
- Featured projects appear first in the grid
- Only feature production-quality work
- Recommended: 2-3 featured projects maximum

#### Image
- Filename of screenshot in `src/resources/` directory
- Use `"placeholder"` for auto-generated placeholder
- Recommended size: 1200x630px or 16:9 aspect ratio
- Optimize images before adding (< 200KB)

## Replacing Placeholder Projects

The portfolio includes 5 placeholder projects as examples. Replace them with your own work:

### Step 1: Choose a Placeholder

Open `src/resources/projects.md` and find a placeholder:

```markdown
## [PLACEHOLDER] Donor Sentiment Intelligence Platform
- **Category:** Machine Learning
- ...
```

### Step 2: Update All Fields

Replace the placeholder with your project:

```markdown
## Customer Churn Prediction Model
- **Category:** Machine Learning
- **Description:** Gradient boosting model predicting customer churn with 89% accuracy. Processes 50K+ customer records daily. Enabled proactive retention strategies reducing churn by 12%.
- **Technologies:** Python, XGBoost, Pandas, Scikit-learn, MLflow
- **GitHub:** https://github.com/yourusername/churn-prediction
- **Featured:** true
- **Image:** churn-dashboard.png
```

### Step 3: Remove the [PLACEHOLDER] Marker

The `[PLACEHOLDER]` prefix in the title triggers the "Demo Project" badge. Remove it for your real projects:

```markdown
## Customer Churn Prediction Model  ← No [PLACEHOLDER] prefix
```

### Step 4: Add Your Image (Optional)

If you have a screenshot:

1. Add image to `src/resources/`: `churn-dashboard.png`
2. Update Image field: `**Image:** churn-dashboard.png`

Or use placeholder:
- Update Image field: `**Image:** placeholder`

## Adding a New Project

To add a project beyond the initial 6:

```markdown
# Projects

<!-- Existing projects above -->

## Your New Project Title
- **Category:** Web Development
- **Description:** Built a real-time collaboration tool for remote teams using WebSockets and React. Supports 100+ concurrent users with sub-100ms latency. Deployed to 5 companies with 500+ daily active users.
- **Technologies:** React, TypeScript, Node.js, Socket.io, PostgreSQL, Docker
- **GitHub:** https://github.com/yourusername/collab-tool
- **Demo:** https://demo.collab-tool.com
- **Featured:** false
- **Image:** collab-screenshot.png
```

## Examples by Category

### Machine Learning

```markdown
## Fraud Detection System
- **Category:** Machine Learning
- **Description:** Real-time fraud detection using ensemble methods. Processes 1M+ transactions daily with 95% precision and 0.2% false positive rate. Prevented $2.5M in fraudulent transactions in Q1 2024.
- **Technologies:** Python, Random Forest, XGBoost, Kafka, Redis, PostgreSQL
- **GitHub:** https://github.com/yourusername/fraud-detection
- **Featured:** true
- **Image:** fraud-dashboard.png
```

### Generative AI

```markdown
## Code Review Assistant
- **Category:** Generative AI
- **Description:** LLM-powered code review tool identifying bugs, security issues, and style violations. Fine-tuned GPT-3.5 on 100K code review comments. Reduced review time by 45% across 20-developer team.
- **Technologies:** Python, GPT-3.5, Fine-tuning, LangChain, GitHub API
- **GitHub:** https://github.com/yourusername/code-reviewer
- **Demo:** https://code-review-demo.com
- **Featured:** true
- **Image:** code-review-ui.png
```

### Web Development

```markdown
## Task Management SaaS
- **Category:** Web Development
- **Description:** Full-stack project management platform with real-time collaboration. Built with serverless architecture on AWS. Serving 1,000+ users across 50 organizations with 99.9% uptime.
- **Technologies:** React, TypeScript, Next.js, AWS Lambda, DynamoDB, Tailwind
- **GitHub:** https://github.com/yourusername/task-manager
- **Demo:** https://taskmanager.example.com
- **Featured:** true
- **Image:** taskmanager-screenshot.png
```

### Data Engineering

```markdown
## Real-Time Analytics Pipeline
- **Category:** Data Engineering
- **Description:** Event streaming pipeline processing 10M+ events daily. Built incremental ETL with Delta Lake for reliable data processing. Reduced data latency from hours to minutes.
- **Technologies:** Python, Apache Spark, Kafka, Delta Lake, Databricks, SQL
- **GitHub:** https://github.com/yourusername/analytics-pipeline
- **Featured:** false
- **Image:** pipeline-architecture.png
```

### Analytics

```markdown
## Executive KPI Dashboard
- **Category:** Analytics
- **Description:** Interactive business intelligence dashboard tracking 50+ KPIs across sales, operations, and finance. Built with React and Plotly for real-time visualization. Used by C-suite for weekly business reviews.
- **Technologies:** React, Plotly, Python, FastAPI, PostgreSQL, Docker
- **Demo:** https://dashboard-demo.example.com
- **Featured:** false
- **Image:** kpi-dashboard.png
```

## Tips for Strong Project Descriptions

### Show Impact with Metrics

**Better:**
```
Reduced query latency by 60%, from 5s to 2s average response time.
Serving 500+ daily active users across 10 departments.
```

**Avoid:**
```
Made queries faster. Used by many people.
```

### Be Specific About Technologies

**Better:**
```
Technologies: Python, Flan-T5-XL, LoRA Fine-tuning, HuggingFace Transformers
```

**Avoid:**
```
Technologies: AI, Machine Learning, Python
```

### Focus on What Makes it Interesting

Highlight:
- Novel approach or architecture
- Scale (users, data volume, throughput)
- Business impact (revenue, efficiency, growth)
- Technical challenge solved
- Production readiness

### Keep Descriptions Concise

- Aim for 150-250 characters
- 2-3 sentences maximum
- Every word should add value
- Remove filler words ("really", "very", "basically")

## Managing Project Images

### Adding Screenshots

1. Take a clean screenshot (hide sensitive data)
2. Crop to 16:9 aspect ratio (1200x675px recommended)
3. Optimize image size (< 200KB ideal)
4. Save to `src/resources/` with descriptive name
5. Reference in project: `**Image:** your-screenshot.png`

### Using Placeholders

For projects without screenshots:
```markdown
**Image:** placeholder
```

This displays an auto-generated placeholder with a lightning bolt icon.

### Image Guidelines

- Use actual product screenshots when possible
- Show the UI/dashboard/results, not just code
- Include data visualization if relevant
- Blur or redact sensitive information
- Optimize file size before committing

## Testing Your Changes

### Local Development

```bash
# Start dev server (hot reload enabled)
npm run dev

# Visit in browser
open http://localhost:4321

# Navigate to Projects section
# Filter by category to test filtering
# Verify project cards render correctly
```

### Production Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview

# Check for build errors
# Verify all projects load
# Test project filtering
```

## Common Issues

### Project Not Appearing

**Problem**: Added project but it doesn't show up

**Solutions**:
1. Check markdown syntax (spaces after `**Field:**`)
2. Verify required fields are present
3. Rebuild: `npm run build`
4. Clear browser cache

### Image Not Loading

**Problem**: Image path correct but not displaying

**Solutions**:
1. Verify image is in `src/resources/` directory
2. Check filename matches exactly (case-sensitive)
3. Rebuild to process new images
4. Use `placeholder` temporarily to test

### Formatting Issues

**Problem**: Description or technologies look wrong

**Solutions**:
1. Ensure comma-separated lists have no trailing commas
2. Check for special characters that need escaping
3. Verify field names match exactly (case-sensitive)
4. Review CONTENT_GUIDE.md for format examples

## Best Practices

### Portfolio Curation

- **Quality over quantity**: 6-8 strong projects > 20 weak ones
- **Feature your best**: Highlight 2-3 projects with `Featured: true`
- **Variety**: Show range across different categories
- **Recency**: Keep projects current (last 1-2 years preferred)
- **Relevance**: Match projects to your target roles

### Descriptions

- **Lead with impact**: Start with what you achieved
- **Use metrics**: Quantify results whenever possible
- **Be honest**: Don't exaggerate capabilities or scale
- **Proofread**: Check spelling and grammar
- **Update regularly**: Keep descriptions current as projects evolve

### Technical Stack

- **Be selective**: List key technologies only
- **Stay current**: Remove deprecated tech from active projects
- **Be accurate**: Only list technologies you meaningfully used
- **Order matters**: Put most important tech first

## Next Steps

After adding your projects:

1. **Test locally**: `npm run dev` and verify appearance
2. **Review content**: Check descriptions, links, images
3. **Test filtering**: Verify category filtering works
4. **Build**: `npm run build` to ensure no errors
5. **Commit**: `git add` and `git commit` your changes
6. **Deploy**: Push to trigger deployment

## Need Help?

- See [CONTENT_GUIDE.md](./CONTENT_GUIDE.md) for general content management
- Review example projects in `src/resources/projects.md`
- Check TypeScript types in `src/types/content.ts`
- Review parser logic in `src/utils/parseProjects.ts`
