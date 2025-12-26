import * as fs from 'node:fs';
import type { FitnessData } from '../types/content';

export function parseFitness(filePath: string): FitnessData | null {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n').filter(l => l.trim());

    // Parse PRs from ## Personal Records section
    const prsStart = lines.findIndex(l => l.trim() === '## Personal Records');
    const prs: { exercise: string; weight: string }[] = [];

    if (prsStart !== -1) {
      for (let i = prsStart + 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line.startsWith('##')) break;
        if (line.startsWith('- **')) {
          // Format: - **Exercise:** weight
          const match = line.match(/- \*\*(.+?):\*\* (.+)/);
          if (match) {
            prs.push({ exercise: match[1], weight: match[2] });
          }
        }
      }
    }

    // Parse journey text from ## My Journey section
    const journeyStart = lines.findIndex(l => l.trim() === '## My Journey');
    let journey = '';

    if (journeyStart !== -1) {
      for (let i = journeyStart + 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line.startsWith('##') || line.startsWith('###')) break;
        if (line && !line.startsWith('- ')) {
          journey += (journey ? ' ' : '') + line;
        }
      }
    }

    // Parse photos from ### Photos section
    const photosStart = lines.findIndex(l => l.trim() === '### Photos');
    const photos: string[] = [];

    if (photosStart !== -1) {
      for (let i = photosStart + 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line.startsWith('###') || line.startsWith('##')) break;
        if (line.startsWith('- ')) {
          photos.push(line.substring(2));
        }
      }
    }

    return {
      prs,
      journey,
      photos: photos.length > 0 ? photos : undefined
    };
  } catch (error) {
    console.error('Error parsing fitness.md:', error);
    return null;
  }
}
