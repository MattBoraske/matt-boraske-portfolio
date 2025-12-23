import * as fs from 'fs';
import { getCategoryIcon } from './categoryIcons';

export interface SkillSubsection {
  name: string;
}

export interface SkillCategory {
  name: string;
  icon: string;
  subsections: SkillSubsection[];
}

/**
 * Parse skills.md file to extract categories and subsections
 * @param filePath - Absolute path to skills.md file
 * @returns Array of skill categories with their subsections
 */
export function parseSkillsMarkdown(filePath: string): SkillCategory[] {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');

    // Split by ## to get major categories (excluding the first split which is empty or title)
    const sections = content.split(/^## /gm).filter(Boolean);

    return sections
      .map(section => {
        const lines = section.split('\n');
        const categoryName = lines[0].trim();

        // Extract subsections (### headers)
        const subsections: SkillSubsection[] = lines
          .filter(line => line.startsWith('###'))
          .map(line => ({
            name: line.replace(/^###\s*/, '').trim()
          }));

        return {
          name: categoryName,
          icon: getCategoryIcon(categoryName),
          subsections
        };
      })
      .filter(category => !category.name.startsWith('#')); // Filter out document title (# Skills)
  } catch (error) {
    console.error('Error parsing skills.md:', error);
    return [];
  }
}
