# Matt Boraske - Professional Portfolio

A modern, responsive portfolio website built with Astro, showcasing research publications, projects, and professional experience in AI/ML and software engineering.

## Features

- **Responsive Design**: Mobile-first design with smooth animations and dark mode support
- **Research Publications**: Showcase academic papers with links to PDFs, GitHub repositories, and HuggingFace datasets
- **Project Portfolio**: Filterable project gallery with categories and live demos
- **Medium Integration**: Automatic fetching of latest blog posts from Medium
- **Career Timeline**: Interactive timeline of professional experience
- **Skills & Certifications**: Organized display of technical skills and professional certifications
- **Contact Form**: Integrated contact form for professional inquiries
- **Official Brand Assets**: Uses official SVG logos for GitHub, LinkedIn, and HuggingFace with dark/light mode support

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
│   │   ├── icons/            # Icon components with official brand SVGs
│   │   ├── About.astro       # About section
│   │   ├── Contact.astro     # Contact form section
│   │   ├── Footer.astro      # Site footer
│   │   ├── Hero.astro        # Hero/landing section
│   │   ├── Projects.astro    # Projects portfolio section
│   │   ├── PublicationCard.astro  # Research publication card
│   │   ├── Research.astro    # Research publications section
│   │   ├── Skills.astro      # Skills and certifications
│   │   ├── Timeline.astro    # Career timeline
│   │   └── Writing.astro     # Medium articles section
│   ├── layouts/
│   │   └── Layout.astro      # Base layout with SEO meta tags
│   ├── pages/
│   │   └── index.astro       # Main landing page
│   ├── resources/            # Reference materials and documentation
│   │   ├── biography.md
│   │   ├── career_timeline.md
│   │   ├── certifications.md
│   │   ├── education.md
│   │   ├── projects.md
│   │   ├── research.md
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

### Projects
Filterable project showcase featuring:
- Category-based filtering (All, AI/ML, Web Development, etc.)
- Live demo links and GitHub repositories
- Technology stack tags
- Project descriptions

### Writing
Automatically fetches and displays latest articles from Medium using RSS feed integration.

### Contact
Professional contact form with:
- Email integration
- Resume download
- Social media links (GitHub, LinkedIn)

## Content Updates

Content can be updated by modifying the respective component files:
- Research: `src/components/Research.astro`
- Projects: `src/components/Projects.astro`
- Timeline: `src/components/Timeline.astro`
- Skills: `src/components/Skills.astro`

## License

This project is open source and available for reference. Please don't use the content (resume details, publications, etc.) as it's personal information.

## Contact

Matt Boraske - [mattboraske@gmail.com](mailto:mattboraske@gmail.com)

Portfolio: [https://www.mattboraske.com](https://www.mattboraske.com)

GitHub: [@MattBoraske](https://github.com/MattBoraske)

LinkedIn: [Matt Boraske](https://www.linkedin.com/in/matt-boraske/)
