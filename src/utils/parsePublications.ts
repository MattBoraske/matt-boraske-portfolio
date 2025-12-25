import * as fs from 'node:fs';
import type { Publication } from '../types/content';

export function parsePublications(filePath: string): Publication[] {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');

    // Split by ## headers, filter out the main title
    const sections = content.split(/^## /gm).filter(Boolean).slice(1);

    return sections.map(section => {
      const lines = section.split('\n').filter(l => l.trim());
      const title = lines[0].trim();

      const getField = (field: string): string => {
        const line = lines.find(l => l.trim().startsWith(`- **${field}:**`));
        if (!line) return '';
        const parts = line.split(':**');
        return parts.length > 1 ? parts[1].trim() : '';
      };

      const tags = getField('Tags')
        .split(',')
        .map(t => t.trim())
        .filter(Boolean);

      return {
        title,
        venue: getField('Venue'),
        year: getField('Year'),
        summary: getField('Summary'),
        authors: getField('Authors') || undefined,
        tags,
        pdfUrl: getField('PDF') || undefined,
        githubUrl: getField('GitHub') || undefined,
        huggingfaceUrl: getField('HuggingFace') || undefined,
        id: getField('ID') || undefined
      };
    });
  } catch (error) {
    console.error('Error parsing research.md:', error);
    return [];
  }
}
