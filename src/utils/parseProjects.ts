import * as fs from 'node:fs';
import type { Project } from '../types/content';
import { getScreenshotUrl } from './getScreenshotUrl';

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

      const demoUrl = getField('Demo') || undefined;
      const imageField = getField('Image') || undefined;

      // Determine image URL:
      // 1. If has explicit image filename (not 'placeholder'), check if it exists
      // 2. If file doesn't exist and has demoUrl, try screenshot
      // 3. Otherwise use undefined (shows placeholder icon in ProjectCard)
      let image: string | undefined = imageField;

      // Check if custom image file actually exists
      if (imageField && imageField !== 'placeholder') {
        const imagePath = `./src/resources/${imageField}`;
        const imageExists = fs.existsSync(imagePath);

        if (!imageExists && demoUrl) {
          // File doesn't exist, try screenshot instead
          const screenshotUrl = getScreenshotUrl(demoUrl);
          image = screenshotUrl || undefined;
        } else if (!imageExists) {
          // No demo URL to screenshot, use undefined (shows placeholder icon)
          image = undefined;
        }
      } else if (demoUrl && (!imageField || imageField === 'placeholder')) {
        // No custom image specified, try screenshot
        const screenshotUrl = getScreenshotUrl(demoUrl);
        image = screenshotUrl || undefined;
      } else if (imageField === 'placeholder') {
        // Explicitly set to undefined to show placeholder icon
        image = undefined;
      }

      return {
        title: title.replace('[PLACEHOLDER] ', ''),
        category: getField('Category'),
        description: getField('Description'),
        technologies,
        githubUrl: getField('GitHub') || undefined,
        demoUrl,
        featured: getField('Featured').toLowerCase() === 'true',
        image,
        isPlaceholder
      };
    });
  } catch (error) {
    console.error('Error parsing projects.md:', error);
    return [];
  }
}
