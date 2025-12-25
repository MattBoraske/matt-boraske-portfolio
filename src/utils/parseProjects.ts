import * as fs from 'node:fs';
import type { Project } from '../types/content';

export function parseProjects(filePath: string): Project[] {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');

    // Split by ## headers, filter out the main title
    const sections = content.split(/^## /gm).filter(Boolean).slice(1);

    return sections.map(section => {
      const lines = section.split('\n').filter(l => l.trim());
      const title = lines[0].trim();
      const isPlaceholder = title.startsWith('[PLACEHOLDER]');

      const getField = (field: string): string => {
        const line = lines.find(l => l.trim().startsWith(`- **${field}:**`));
        if (!line) return '';
        const parts = line.split(':**');
        return parts.length > 1 ? parts[1].trim() : '';
      };

      const technologies = getField('Technologies')
        .split(',')
        .map(t => t.trim())
        .filter(Boolean);

      return {
        title: title.replace('[PLACEHOLDER] ', ''),
        category: getField('Category'),
        description: getField('Description'),
        technologies,
        githubUrl: getField('GitHub') || undefined,
        demoUrl: getField('Demo') || undefined,
        featured: getField('Featured').toLowerCase() === 'true',
        image: getField('Image') || undefined,
        isPlaceholder
      };
    });
  } catch (error) {
    console.error('Error parsing projects.md:', error);
    return [];
  }
}
