import * as fs from 'node:fs';
import type { Experience } from '../types/content';

export function parseTimeline(filePath: string): Experience[] {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');

    // Split by ## headers, filter out the main title
    const sections = content.split(/^## /gm).filter(Boolean).slice(1);

    return sections.map(section => {
      const lines = section.split('\n');

      // Parse company and role from first line (format: "Company - Role")
      const firstLine = lines[0].trim();
      const [company, role] = firstLine.split(' - ').map(s => s.trim());

      // Get field value from **Field:** format
      const getField = (field: string): string => {
        const line = lines.find(l => l.trim().startsWith(`**${field}:**`));
        if (!line) return '';
        const parts = line.split(':**');
        return parts.length > 1 ? parts[1].trim() : '';
      };

      // Get description from ### Description section
      const getDescription = (): string => {
        const descStart = lines.findIndex(l => l.trim() === '### Description');
        if (descStart === -1) return '';

        let description = '';
        for (let i = descStart + 1; i < lines.length; i++) {
          const line = lines[i].trim();
          if (line.startsWith('###') || line.startsWith('---')) break;
          if (line) description += (description ? ' ' : '') + line;
        }
        return description;
      };

      // Get bullets from ### Highlights section
      const getBullets = (): string[] => {
        const highlightsStart = lines.findIndex(l => l.trim() === '### Highlights');
        if (highlightsStart === -1) return [];

        const bullets: string[] = [];
        for (let i = highlightsStart + 1; i < lines.length; i++) {
          const line = lines[i].trim();
          if (line.startsWith('###') || line.startsWith('---')) break;
          if (line.startsWith('- ')) {
            bullets.push(line.substring(2));
          }
        }
        return bullets;
      };

      // Get technologies from ### Technologies section
      const getTechnologies = (): string[] => {
        const techStart = lines.findIndex(l => l.trim() === '### Technologies');
        if (techStart === -1) return [];

        const technologies: string[] = [];
        for (let i = techStart + 1; i < lines.length; i++) {
          const line = lines[i].trim();
          if (line.startsWith('###') || line.startsWith('---')) break;
          if (line.startsWith('- ')) {
            technologies.push(line.substring(2));
          }
        }
        return technologies;
      };

      const description = getDescription();
      const bullets = getBullets();
      const technologies = getTechnologies();
      const dateRange = getField('Date Range');
      const type = getField('Type').toLowerCase();

      return {
        company,
        role,
        dateRange,
        description: bullets.length === 0 && description ? description : undefined,
        bullets: bullets.length > 0 ? bullets : undefined,
        technologies,
        isCurrent: dateRange.toLowerCase().includes('present') || getField('Current').toLowerCase() === 'yes',
        type: (type === 'education' ? 'education' : 'work') as 'work' | 'education',
        logo: undefined, // Will be mapped in Timeline component
        logoSize: type === 'education' ? 'w-14 h-14' : 'w-8 h-8'
      };
    });
  } catch (error) {
    console.error('Error parsing timeline.md:', error);
    return [];
  }
}
