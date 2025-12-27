import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { marked } from 'marked';
import Anthropic from '@anthropic-ai/sdk';
import puppeteer from 'puppeteer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Paths
const RESOURCES_DIR = path.join(__dirname, '../src/resources');
const TEMPLATE_PATH = path.join(__dirname, 'templates/resume-template.html');
const OUTPUT_PATH = path.join(__dirname, '../public/Matthew_Boraske_Resume.pdf');

console.log('PDF Resume Generator');
console.log('===================\n');

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
    const nameMatch = lines.find(l => l.includes('Matthew Boraske'));
    const titleMatch = lines.find(l => l.includes('Data Scientist'));

    return {
        name: nameMatch ? nameMatch.split('|')[1].trim() : 'Matthew Boraske',
        title: titleMatch ? titleMatch.split('|')[1].trim() : 'Data Scientist'
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

    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
}

main();
