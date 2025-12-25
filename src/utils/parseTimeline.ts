import * as fs from 'node:fs';
import type { Experience } from '../types/content';

export function parseTimeline(filePath: string): Experience[] {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');

    // Split by ## headers, filter out the main title
    const sections = content.split(/^## /gm).filter(Boolean).slice(1);

    return sections.map(section => {
      const lines = section.split('\n').filter(l => l.trim());
      const role = lines[0].trim();

      const getField = (field: string): string => {
        const line = lines.find(l => l.trim().startsWith(`- **${field}:**`));
        if (!line) return '';
        const parts = line.split(':**');
        return parts.length > 1 ? parts[1].trim() : '';
      };

      const getBullets = (): string[] => {
        const bulletStart = lines.findIndex(l => l.trim().startsWith('- **Bullets:**'));
        if (bulletStart === -1) return [];

        const bullets: string[] = [];
        for (let i = bulletStart + 1; i < lines.length; i++) {
          const line = lines[i].trim();
          if (line.startsWith('  - ')) {
            bullets.push(line.substring(4));
          } else if (line.startsWith('- **')) {
            break;
          }
        }
        return bullets;
      };

      const technologies = getField('Technologies')
        .split(',')
        .map(t => t.trim())
        .filter(Boolean);

      const bullets = getBullets();
      const dateRange = getField('DateRange');

      return {
        company: getField('Company'),
        role,
        dateRange,
        description: bullets.length === 0 ? getField('Description') : undefined,
        bullets: bullets.length > 0 ? bullets : undefined,
        technologies,
        isCurrent: dateRange.toLowerCase().includes('present'),
        type: (getField('Type') as 'work' | 'education') || 'work',
        logo: getField('Logo') || undefined,
        logoSize: getField('LogoSize') || 'w-8 h-8'
      };
    });
  } catch (error) {
    console.error('Error parsing timeline.md:', error);
    return [];
  }
}
