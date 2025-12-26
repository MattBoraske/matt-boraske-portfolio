import * as fs from 'fs';
import { getCategoryIcon } from './categoryIcons';

export interface SkillSubsection {
  name: string;
  skills: string[];
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

        // Extract subsections (### headers) with their skills
        const subsections: SkillSubsection[] = [];
        let currentSubsection: string | null = null;
        let currentSkills: string[] = [];

        for (let i = 1; i < lines.length; i++) {
          const line = lines[i].trim();

          if (line.startsWith('###')) {
            // Save previous subsection if exists
            if (currentSubsection) {
              subsections.push({
                name: currentSubsection,
                skills: currentSkills
              });
            }

            // Start new subsection
            currentSubsection = line.replace(/^###\s*/, '').trim();
            currentSkills = [];
          } else if (line.startsWith('-') && currentSubsection) {
            // Add skill to current subsection
            const skill = line.replace(/^-\s*/, '').trim();
            if (skill) {
              currentSkills.push(skill);
            }
          }
        }

        // Don't forget the last subsection
        if (currentSubsection) {
          subsections.push({
            name: currentSubsection,
            skills: currentSkills
          });
        }

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
