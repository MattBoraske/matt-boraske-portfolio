# Matthew Boraske - Professional Portfolio

A modern, responsive portfolio website built with Astro, showcasing research publications, projects, and professional experience in AI/ML and software engineering.

## Features

- **Responsive Design**: Mobile-first design with smooth animations and dark mode support
- **Research Publications**: Showcase academic papers with links to PDFs, GitHub repositories, and HuggingFace datasets
- **Project Portfolio**: Project showcase with live demos, GitHub repositories, and technology stacks
- **Medium Integration**: Automatic fetching of latest blog posts from Medium
- **Career Timeline**: Interactive timeline with company/university logos and education highlights in bulleted format
- **Skills & Certifications**: Interactive certification badges with tooltips showing issue/expiration dates and credential links
- **Contact Form**: Formspree-integrated contact form for professional inquiries
- **Official Brand Assets**: Uses official SVG/PNG logos for companies and universities (CSL Behring, Epic Systems, Honda, OSU, WCU)

## Tech Stack

- **Framework**: [Astro](https://astro.build) - Modern static site generator
- **Styling**: [Tailwind CSS](https://tailwindcss.com) - Utility-first CSS framework
- **Icons**: Official brand SVGs (GitHub, LinkedIn, HuggingFace)
- **Deployment**: AWS Amplify / Netlify ready
- **Type Safety**: TypeScript throughout the codebase

## Project Structure

```text
/
├── public/
│   ├── favicon.svg           # Site favicon
│   └── Matthew_Boraske_Resume.pdf  # Downloadable resume
├── src/
│   ├── components/
│   │   ├── icons/            # Icon components and brand logos (SVG/PNG)
│   │   │   ├── csl.svg       # CSL Behring logo
│   │   │   ├── epic.svg      # Epic Systems logo
│   │   │   ├── honda.png     # Honda logo
│   │   │   ├── osu.svg       # Ohio State logo
│   │   │   └── wcu.svg       # West Chester logo
│   │   ├── Contact.astro     # Contact section with Formspree form
│   │   ├── ContactForm.astro # Formspree contact form component
│   │   ├── Footer.astro      # Site footer
│   │   ├── Header.astro      # Navigation header
│   │   ├── Hero.astro        # Hero/landing section
│   │   ├── Projects.astro    # Projects portfolio section
│   │   ├── ProjectCard.astro # Individual project card
│   │   ├── PublicationCard.astro  # Research publication card
│   │   ├── Research.astro    # Research publications section
│   │   ├── RoleSpotlight.astro    # Current role description
│   │   ├── Skills.astro      # Skills with interactive certification tooltips
│   │   ├── Timeline.astro    # Career timeline with company logos
│   │   ├── TimelineItem.astro     # Individual timeline entry
│   │   └── Writing.astro     # Medium articles section
│   ├── layouts/
│   │   └── Layout.astro      # Base layout with SEO meta tags
│   ├── pages/
│   │   └── index.astro       # Main landing page
│   ├── resources/            # Reference materials and documentation
│   │   ├── certifications.md # Professional certifications with URLs
│   │   ├── contact.md        # Contact information
│   │   ├── hero.md           # Hero section content
│   │   ├── projects.md       # Project descriptions
│   │   ├── research.md       # Research publications
│   │   ├── skills.md         # Technical skills
│   │   ├── spotlight.md      # Current role spotlight
│   │   ├── timeline.md       # Career timeline content
│   │   ├── trnf-site-screenshot.png  # TRNF project screenshot
│   │   └── Matthew_Boraske_Resume.docx
│   └── utils/
│       └── fetchMediumArticles.ts  # Medium RSS feed integration
├── astro.config.mjs          # Astro configuration
├── tailwind.config.mjs       # Tailwind CSS configuration
└── package.json
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or pnpm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/MattBoraske/matt-boraske-portfolio.git
cd matt-boraske-portfolio
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The site will be available at `http://localhost:4321`

## Commands

All commands are run from the root of the project:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## Deployment

The site is configured for deployment on:
- **AWS Amplify**: Uses `amplify.yml` for build configuration
- **Netlify**: Uses `netlify.toml` for build configuration

Both platforms will automatically build and deploy when pushing to the main branch.

## Key Sections

### Research Publications
Displays academic research with:
- Direct links to published papers (PDFs)
- GitHub repository links for code implementations
- HuggingFace dataset/model collections
- Detailed summaries and tags
- Clickable thesis title linking to research card

### Projects
Project showcase featuring:
- Live demo links and GitHub repositories
- Technology stack tags
- Project screenshots
- Detailed descriptions

### Career Timeline
Interactive timeline with:
- Company and university logos (CSL Behring, Epic Systems, Honda, OSU, WCU)
- Education sections with bulleted highlights
- Work experience with detailed descriptions
- Technology tags for each position

### Skills & Certifications
Technical skills organized by category with:
- Interactive certification badges
- Hover tooltips showing issue and expiration dates
- Clickable links to credential verification (Credly, Databricks)
- AWS and Databricks certifications

### Writing
Automatically fetches and displays latest articles from Medium using RSS feed integration.

### Contact
Professional contact form with:
- Formspree integration for email submissions
- Direct email, GitHub, LinkedIn, and Medium links
- Resume download
- Location information

## Content Updates

Content can be updated in two ways:

### 1. Component Files (Direct)
- Research: `src/components/Research.astro`
- Projects: `src/components/Projects.astro`
- Timeline: `src/components/Timeline.astro`
- Skills: `src/components/Skills.astro`
- Hero: `src/components/Hero.astro`
- Role Spotlight: `src/components/RoleSpotlight.astro`

### 2. Resource Documentation (Reference)
The `/src/resources/` folder contains markdown files documenting the content:
- `hero.md` - Name and title
- `spotlight.md` - Current role description
- `timeline.md` - Career milestones
- `certifications.md` - Professional certifications with URLs
- `projects.md` - Project details
- `research.md` - Research publications
- `skills.md` - Technical skills
- `contact.md` - Contact information

## Configuration

### Formspree Contact Form
To enable the contact form:
1. Sign up at [Formspree](https://formspree.io)
2. Create a new form and get your Form ID
3. Update `src/pages/index.astro` with your Form ID:
   ```astro
   <Contact formspreeId="your-form-id-here" />
   ```

### Medium Integration
Update the Medium username in `src/pages/index.astro`:
```astro
<Writing mediumUsername="your-medium-username" />
```

## License

This project is open source and available for reference. Please don't use the content (resume details, publications, etc.) as it's personal information.

## Contact

Matthew Boraske - [mattboraske@gmail.com](mailto:mattboraske@gmail.com)

Portfolio: [https://www.mattboraske.com](https://www.mattboraske.com)

GitHub: [@MattBoraske](https://github.com/MattBoraske)

LinkedIn: [Matthew Boraske](https://www.linkedin.com/in/matt-boraske/)

Medium: [@mattboraske](https://medium.com/@mattboraske)
