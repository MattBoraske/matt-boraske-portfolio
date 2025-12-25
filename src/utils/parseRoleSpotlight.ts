import * as fs from 'node:fs';
import type { RoleSpotlight } from '../types/content';

export function parseRoleSpotlight(filePath: string): RoleSpotlight {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n').filter(l => l.trim());

    const getField = (field: string): string => {
      const line = lines.find(l => l.startsWith(`**${field}:**`));
      if (!line) return '';
      const parts = line.split(':**');
      return parts.length > 1 ? parts[1].trim() : '';
    };

    const description: string[] = [];
    let inDescription = false;

    for (const line of lines) {
      if (line.startsWith('**Description:**')) {
        inDescription = true;
        continue;
      }
      if (inDescription && line.startsWith('**')) {
        break;
      }
      if (inDescription && line.trim()) {
        description.push(line.trim());
      }
    }

    return {
      company: getField('Company'),
      role: getField('Role'),
      description
    };
  } catch (error) {
    console.error('Error parsing spotlight.md:', error);
    return {
      company: 'CSL Behring',
      role: 'Data Scientist',
      description: ['Currently working on AI/ML projects.']
    };
  }
}
