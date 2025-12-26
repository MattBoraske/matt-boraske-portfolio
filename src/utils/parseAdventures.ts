import * as fs from 'node:fs';
import type { Adventure } from '../types/content';

export function parseAdventures(filePath: string): Adventure[] {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');

    // Extract only the Trail Log section
    const trailLogMatch = content.match(/# Trail Log\n([\s\S]*?)(?=\n+# [A-Z]|$)/);
    if (!trailLogMatch) return [];

    const trailLogContent = trailLogMatch[1];

    // Split by ## headers and filter out empty sections
    const sections = trailLogContent
      .split(/^## /gm)
      .filter(s => s && s.trim().length > 0);

    return sections.map(section => {
      const lines = section.split('\n').filter(l => l.trim());
      const title = lines[0].trim();

      const getField = (field: string): string => {
        const line = lines.find(l => l.trim().startsWith(`**${field}:**`));
        if (!line) return '';
        const parts = line.split(':**');
        return parts.length > 1 ? parts[1].trim() : '';
      };

      // Get highlights from ### Highlights section
      const getHighlights = (): string[] => {
        const highlightsStart = lines.findIndex(l => l.trim() === '### Highlights');
        if (highlightsStart === -1) return [];

        const highlights: string[] = [];
        for (let i = highlightsStart + 1; i < lines.length; i++) {
          const line = lines[i].trim();
          if (line.startsWith('###') || line.startsWith('---')) break;
          if (line.startsWith('- ')) {
            highlights.push(line.substring(2));
          }
        }
        return highlights;
      };

      // Get photos from ### Photos section
      const getPhotos = (): string[] => {
        const photosStart = lines.findIndex(l => l.trim() === '### Photos');
        if (photosStart === -1) return [];

        const photos: string[] = [];
        for (let i = photosStart + 1; i < lines.length; i++) {
          const line = lines[i].trim();
          if (line.startsWith('###') || line.startsWith('---')) break;
          if (line.startsWith('- ')) {
            photos.push(line.substring(2));
          }
        }
        return photos;
      };

      return {
        title,
        location: getField('Location'),
        date: getField('Date'),
        distance: getField('Distance'),
        maxElevation: getField('Max Elevation'),
        highlights: getHighlights(),
        photos: getPhotos()
      };
    });
  } catch (error) {
    console.error('Error parsing adventures:', error);
    return [];
  }
}
