import * as fs from 'fs';

export interface Certification {
  name: string;
  url: string;
  issueDate: string;
  expirationDate: string;
}

/**
 * Parse certifications.md file to extract certification data from markdown table
 * @param filePath - Absolute path to certifications.md file
 * @returns Array of certifications
 */
export function parseCertifications(filePath: string): Certification[] {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n').filter(l => l.trim());

    // Find table rows (skip header and separator rows)
    const certifications: Certification[] = [];
    let inTable = false;

    for (const line of lines) {
      // Check if we're in the table
      if (line.startsWith('|') && line.includes('Certification')) {
        inTable = true;
        continue; // Skip header row
      }
      if (line.startsWith('|') && line.includes('---')) {
        continue; // Skip separator row
      }

      // Parse table rows
      if (inTable && line.startsWith('|')) {
        const cells = line
          .split('|')
          .map(cell => cell.trim())
          .filter(cell => cell.length > 0);

        if (cells.length >= 4) {
          certifications.push({
            name: cells[0],
            url: cells[1],
            issueDate: cells[2],
            expirationDate: cells[3]
          });
        }
      }
    }

    return certifications;
  } catch (error) {
    console.error('Error parsing certifications.md:', error);
    return [];
  }
}
