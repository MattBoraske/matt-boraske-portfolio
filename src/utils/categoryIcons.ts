/**
 * Maps skill category names to Lucide icon identifiers
 * See https://lucide.dev for available icons
 */
export const categoryIcons: Record<string, string> = {
  'Software Development': 'code-2',
  'Generative AI': 'sparkles',
  'Data Science & Machine Learning': 'bar-chart-3',
  'Analytics Engineering': 'database',
  'Data Engineering': 'server',
  'Domain-Specific Tools & Technologies': 'wrench',
  'Project Management': 'kanban-square',
  'Solutions Engineering': 'lightbulb',
  'Biotechnology Business': 'microscope',
  'Data Strategy & Governance': 'shield-check',
  'Certifications': 'award',
};

/**
 * Get the Lucide icon name for a given category
 * @param categoryName - The name of the skill category
 * @returns The Lucide icon identifier, or 'circle' as fallback
 */
export function getCategoryIcon(categoryName: string): string {
  return categoryIcons[categoryName] || 'circle';
}
