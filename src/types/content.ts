export interface Project {
  title: string;
  category: string;
  description: string;
  technologies: string[];
  githubUrl?: string;
  demoUrl?: string;
  featured: boolean;
  image?: string;
  isPlaceholder?: boolean;
}

export interface Publication {
  title: string;
  venue: string;
  year: string;
  summary: string;
  authors?: string;
  tags?: string[];
  pdfUrl?: string;
  githubUrl?: string;
  huggingfaceUrl?: string;
  id?: string;
}

export interface Experience {
  company: string;
  role: string;
  dateRange: string;
  location?: string;
  description?: string;
  bullets?: string[];
  technologies?: string[];
  isCurrent?: boolean;
  type?: 'work' | 'education';
  logo?: string;
  logoSize?: string;
}

export interface Adventure {
  title: string;
  location: string;
  date: string;
  distance: string;
  maxElevation: string;
  highlights?: string[];
  photos?: string[];
}

export interface FitnessData {
  prs: { exercise: string; weight: string }[];
  journey: string;
  photos?: string[];
}

export interface BellaProfile {
  about: string;
  birthday: string;
  breed: string;
  favoriteThings: string;
  story: string;
  photos?: string[];
}

export interface MediaItem {
  title: string;
  coverUrl?: string;
  author?: string; // For books
  rating?: string;
  date?: string;
  status: 'current' | 'completed';
  type: 'book' | 'movie' | 'show';
}

export interface RoleSpotlight {
  company: string;
  role: string;
  description: string[];
}

export interface SkillCategory {
  name: string;
  icon: string;
  subsections: SkillSubsection[];
}

export interface SkillSubsection {
  name: string;
}
