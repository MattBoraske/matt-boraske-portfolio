import * as fs from 'node:fs';
import type { BellaProfile } from '../types/content';

export function parseBellaProfile(filePath: string): BellaProfile | null {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');

    // Extract Bella Profile section
    const bellaMatch = content.match(/# Bella Profile\n([\s\S]*?)(?=\n# |$)/);
    if (!bellaMatch) return null;

    const bellaContent = bellaMatch[1];
    const lines = bellaContent.split('\n').filter(l => l.trim());

    // Get About section
    const aboutStart = lines.findIndex(l => l.trim() === '### About');
    let about = '';
    let birthday = '';
    let breed = '';
    let favoriteThings = '';

    if (aboutStart !== -1) {
      for (let i = aboutStart + 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line.startsWith('###') || line.startsWith('**')) break;
        if (line && !line.startsWith('- ')) {
          about += (about ? ' ' : '') + line;
        }
      }

      // Parse stats
      const birthdayMatch = bellaContent.match(/\*\*Birthday:\*\* (.+)/);
      if (birthdayMatch) birthday = birthdayMatch[1];

      const breedMatch = bellaContent.match(/\*\*Breed:\*\* (.+)/);
      if (breedMatch) breed = breedMatch[1];

      const favMatch = bellaContent.match(/\*\*Favorite Things:\*\* (.+)/);
      if (favMatch) favoriteThings = favMatch[1];
    }

    // Get story from ### Our Story section
    const storyStart = lines.findIndex(l => l.trim() === '### Our Story');
    let story = '';

    if (storyStart !== -1) {
      for (let i = storyStart + 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line.startsWith('###')) break;
        if (line && !line.startsWith('- ')) {
          story += (story ? ' ' : '') + line;
        }
      }
    }

    // Get photos
    const photosStart = lines.findIndex(l => l.trim() === '### Photos');
    const photos: string[] = [];

    if (photosStart !== -1) {
      for (let i = photosStart + 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line.startsWith('###')) break;
        if (line.startsWith('- ')) {
          photos.push(line.substring(2));
        }
      }
    }

    return {
      about,
      birthday,
      breed,
      favoriteThings,
      story,
      photos: photos.length > 0 ? photos : undefined
    };
  } catch (error) {
    console.error('Error parsing Bella profile:', error);
    return null;
  }
}
