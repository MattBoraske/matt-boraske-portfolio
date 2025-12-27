import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { marked } from 'marked';
import Anthropic from '@anthropic-ai/sdk';
import puppeteer from 'puppeteer';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

// Paths
const RESOURCES_DIR = path.join(__dirname, '../src/resources');
const TEMPLATE_PATH = path.join(__dirname, 'templates/resume-template.html');
const OUTPUT_PATH = path.join(__dirname, '../public/Matthew_Boraske_Resume.pdf');

console.log('PDF Resume Generator');
console.log('===================\n');

// Check for API key
if (!process.env.ANTHROPIC_API_KEY) {
    console.error('Error: ANTHROPIC_API_KEY environment variable not set');
    console.error('Please set it in your .env file or environment');
    process.exit(1);
}

/**
 * Read and parse markdown files
 */
async function readMarkdownFiles() {
    console.log('Reading markdown files...');

    const files = {
        hero: await fs.readFile(path.join(RESOURCES_DIR, 'hero.md'), 'utf-8'),
        contact: await fs.readFile(path.join(RESOURCES_DIR, 'contact.md'), 'utf-8'),
        timeline: await fs.readFile(path.join(RESOURCES_DIR, 'timeline.md'), 'utf-8'),
        skills: await fs.readFile(path.join(RESOURCES_DIR, 'resume-skills.md'), 'utf-8'),
        certifications: await fs.readFile(path.join(RESOURCES_DIR, 'certifications.md'), 'utf-8')
    };

    console.log('✓ Files read successfully\n');
    return files;
}

/**
 * Parse hero.md for name and title
 */
function parseHero(content) {
    const lines = content.split('\n').filter(line => line.trim() && !line.startsWith('#'));
    const dataRow = lines.find(l => l.includes('Matthew Boraske'));

    if (dataRow) {
        const parts = dataRow.split('|').map(p => p.trim()).filter(Boolean);
        return {
            name: parts[0] || 'Matthew Boraske',
            title: parts[1] || 'Data Scientist'
        };
    }

    return {
        name: 'Matthew Boraske',
        title: 'Data Scientist'
    };
}

/**
 * Parse contact.md for contact information
 */
function parseContact(content) {
    const emailMatch = content.match(/Email:\s*(.+)/);
    const linkedinMatch = content.match(/Linkedin:\s*(.+)/);
    const githubMatch = content.match(/Github:\s*(.+)/);

    return {
        email: emailMatch ? emailMatch[1].trim() : '',
        linkedin: linkedinMatch ? linkedinMatch[1].trim() : '',
        github: githubMatch ? githubMatch[1].trim() : ''
    };
}

/**
 * Parse timeline.md for education and experience entries
 */
function parseTimeline(content) {
    const sections = content.split('---').map(s => s.trim()).filter(Boolean);
    const education = [];
    const experience = [];

    sections.forEach(section => {
        const typeMatch = section.match(/\*\*Type:\*\*\s*(.+)/);
        const type = typeMatch ? typeMatch[1].trim() : '';

        const institutionMatch = section.match(/^##\s*(.+?)\s*-\s*(.+?)$/m);
        const dateMatch = section.match(/\*\*Date Range:\*\*\s*(.+)/);
        const locationMatch = section.match(/\*\*Location:\*\*\s*(.+)/);
        const descMatch = section.match(/###\s*Description\s*\n([\s\S]+?)(?=###|$)/);
        const highlightsMatch = section.match(/###\s*Highlights\s*\n([\s\S]+?)(?=###|$)/);

        const entry = {
            company: institutionMatch ? institutionMatch[1].trim() : '',
            title: institutionMatch ? institutionMatch[2].trim() : '',
            dates: dateMatch ? dateMatch[1].trim() : '',
            location: locationMatch ? locationMatch[1].trim() : '',
            description: descMatch ? descMatch[1].trim() : '',
            highlights: highlightsMatch ? highlightsMatch[1].trim() : ''
        };

        if (type === 'Education') {
            education.push(entry);
        } else if (type === 'Work') {
            experience.push(entry);
        }
    });

    return { education, experience };
}

/**
 * Parse resume-skills.md
 */
function parseSkills(content) {
    const sections = content.split('##').filter(s => s.trim());
    const categories = [];

    sections.forEach(section => {
        const lines = section.trim().split('\n');
        const category = lines[0].trim();
        const items = lines.slice(1).join('\n').trim();

        if (category && items) {
            categories.push({ category, items });
        }
    });

    return categories;
}

/**
 * Parse certifications.md
 */
function parseCertifications(content) {
    const lines = content.split('\n').filter(l => l.startsWith('|') && !l.includes('---') && !l.includes('Certification'));

    return lines.map(line => {
        const parts = line.split('|').map(p => p.trim()).filter(Boolean);
        return {
            name: parts[0] || '',
            url: parts[1] || '',
            issueDate: parts[2] || '',
            expirationDate: parts[3] || ''
        };
    });
}

/**
 * Create prompt for Claude to optimize resume content
 */
function createClaudePrompt(personalInfo, education, experience, skills, certifications) {
    return `You are an expert resume writer specializing in technical resumes for data scientists and software engineers.

Your task is to optimize the following resume content for a professional 1-page PDF resume. Follow these guidelines:

1. **Education**: Condense into 2-3 concise bullet points per entry, highlighting GPA, thesis, key coursework, and honors
2. **Experience**: Create 3-4 impactful bullet points per role using action verbs and quantifiable results (STAR method)
3. **Skills**: Organize into clear categories matching the provided structure
4. **Tone**: Professional, achievement-focused, concise
5. **Format**: Return valid JSON matching the schema below

**Input Data:**

Personal Info: ${JSON.stringify(personalInfo, null, 2)}

Education Entries: ${JSON.stringify(education, null, 2)}

Experience Entries: ${JSON.stringify(experience, null, 2)}

Skills Categories: ${JSON.stringify(skills, null, 2)}

Certifications: ${JSON.stringify(certifications, null, 2)}

**Required Output Format (JSON):**

{
  "education": [
    {
      "institution": "Full institution name",
      "degree": "Degree title",
      "dates": "Date range",
      "bullets": ["Bullet 1", "Bullet 2", "Bullet 3"]
    }
  ],
  "experience": [
    {
      "company": "Company name",
      "title": "Job title",
      "dates": "Date range",
      "bullets": ["Impact bullet 1", "Impact bullet 2", "Impact bullet 3", "Impact bullet 4"]
    }
  ],
  "technicalSkills": [
    {
      "category": "Category name",
      "items": "Comma-separated skills"
    }
  ],
  "certifications": [
    {
      "name": "Certification name",
      "details": "Issue and expiration info"
    }
  ]
}

Return ONLY the JSON, no other text.`;
}

/**
 * Call Claude API to optimize resume content
 */
async function optimizeWithClaude(personalInfo, education, experience, skills, certifications) {
    console.log('Calling Claude API to optimize content...');

    const anthropic = new Anthropic({
        apiKey: process.env.ANTHROPIC_API_KEY
    });

    const prompt = createClaudePrompt(personalInfo, education, experience, skills, certifications);

    const message = await anthropic.messages.create({
        model: 'claude-sonnet-4-5-20250929',
        max_tokens: 4000,
        messages: [{
            role: 'user',
            content: prompt
        }]
    });

    const responseText = message.content[0].text;

    // Extract JSON from response (handle code blocks if present)
    let jsonText = responseText;
    if (responseText.includes('```json')) {
        jsonText = responseText.match(/```json\n([\s\S]+?)\n```/)[1];
    } else if (responseText.includes('```')) {
        jsonText = responseText.match(/```\n([\s\S]+?)\n```/)[1];
    }

    const optimizedContent = JSON.parse(jsonText);
    console.log('✓ Content optimized by Claude\n');

    return optimizedContent;
}

/**
 * Render HTML template with optimized content
 */
async function renderTemplate(personalInfo, optimizedContent) {
    console.log('Rendering HTML template...');

    let template = await fs.readFile(TEMPLATE_PATH, 'utf-8');

    // Render contact info
    const contactHtml = `
        ☎ ${personalInfo.phone || '484-796-1788'}<br>
        ✉ <a href="mailto:${personalInfo.email}">${personalInfo.email}</a><br>
        🔗 <a href="${personalInfo.linkedin}">linked.com/in/matt-boraske</a><br>
        🐙 <a href="${personalInfo.github}">github.com/MattBoraske</a>
    `.trim();

    // Render education
    const educationHtml = optimizedContent.education.map(entry => `
        <div class="entry">
            <div class="entry-header">
                <span class="institution">${entry.institution} | ${entry.degree}</span>
                <span class="dates">${entry.dates}</span>
            </div>
            <ul>
                ${entry.bullets.map(b => `<li>${b}</li>`).join('\n                ')}
            </ul>
        </div>
    `).join('\n');

    // Render experience
    const experienceHtml = optimizedContent.experience.map(entry => `
        <div class="entry">
            <div class="entry-header">
                <span class="company">${entry.company} | ${entry.title}</span>
                <span class="dates">${entry.dates}</span>
            </div>
            <ul>
                ${entry.bullets.map(b => `<li>${b}</li>`).join('\n                ')}
            </ul>
        </div>
    `).join('\n');

    // Render technical skills
    const skillsHtml = optimizedContent.technicalSkills.map(category => `
        <div class="skills-category">
            <strong>${category.category}:</strong> ${category.items}
        </div>
    `).join('\n');

    // Render certifications
    const certificationsHtml = optimizedContent.certifications.map(cert => `
        <div class="skills-category">
            <strong>${cert.name}</strong> ${cert.details}
        </div>
    `).join('\n');

    // Replace placeholders
    template = template
        .replace('{{name}}', personalInfo.name)
        .replace('{{title}}', personalInfo.title)
        .replace('{{contact}}', contactHtml)
        .replace('{{education}}', educationHtml)
        .replace('{{experience}}', experienceHtml)
        .replace('{{technicalSkills}}', skillsHtml)
        .replace('{{certifications}}', certificationsHtml);

    console.log('✓ Template rendered\n');
    return template;
}

/**
 * Generate PDF from HTML using Puppeteer
 */
async function generatePDF(html) {
    console.log('Generating PDF with Puppeteer...');

    const browser = await puppeteer.launch({
        headless: 'new'
    });

    const page = await browser.newPage();

    // Set content
    await page.setContent(html, {
        waitUntil: 'networkidle0'
    });

    // Ensure output directory exists
    await fs.mkdir(path.dirname(OUTPUT_PATH), { recursive: true });

    // Generate PDF
    await page.pdf({
        path: OUTPUT_PATH,
        format: 'Letter',
        margin: {
            top: '0.5in',
            right: '0.65in',
            bottom: '0.5in',
            left: '0.65in'
        },
        printBackground: true
    });

    await browser.close();

    console.log(`✓ PDF generated: ${OUTPUT_PATH}\n`);
}

async function main() {
    try {
        // Read files
        const files = await readMarkdownFiles();

        // Parse content
        console.log('Parsing content...');
        const personalInfo = {
            ...parseHero(files.hero),
            ...parseContact(files.contact)
        };
        const { education, experience } = parseTimeline(files.timeline);
        const skills = parseSkills(files.skills);
        const certifications = parseCertifications(files.certifications);

        console.log('✓ Content parsed successfully\n');
        console.log(`Found: ${education.length} education entries, ${experience.length} experience entries`);
        console.log(`Found: ${skills.length} skill categories, ${certifications.length} certifications\n`);

        // Optimize content with Claude
        const optimizedContent = await optimizeWithClaude(
            personalInfo,
            education,
            experience,
            skills,
            certifications
        );

        console.log('Optimized content preview:');
        console.log(`- Education entries: ${optimizedContent.education.length}`);
        console.log(`- Experience entries: ${optimizedContent.experience.length}`);
        console.log(`- Skill categories: ${optimizedContent.technicalSkills.length}`);
        console.log(`- Certifications: ${optimizedContent.certifications.length}\n`);

        // Render HTML template
        const html = await renderTemplate(personalInfo, optimizedContent);

        // Generate PDF
        await generatePDF(html);

        console.log('✅ Resume generation complete!');
        console.log(`Output: ${OUTPUT_PATH}`);

    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
}

main();
