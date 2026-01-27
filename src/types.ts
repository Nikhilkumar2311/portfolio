// Types for portfolio data

export interface Skill {
  name: string;
  icon?: string;
}

export interface SkillCategory {
  title: string;
  icon: string;
  skills: Skill[];
}

export interface Tool {
  name: string;
  description: string;
  icon: string;
}

export type ProjectStatus = 'completed' | 'in-progress' | 'planned';

export interface Project {
  title: string;
  description: string;
  status: ProjectStatus;
  problem?: string;
  solution?: string;
  outcome?: string;
  techStack: string[];
  githubUrl?: string;
  liveUrl?: string;
  architectureDiagram?: string;
}

export type EmploymentType = 'full-time' | 'internship' | 'contract' | 'freelance';

export interface Experience {
  title: string;
  company: string;
  companyInitial?: string; // For logo placeholder
  logo?: string; // URL or path to company logo
  period: string;
  duration?: string; // e.g., "1 year", "6 months"
  employmentType: EmploymentType;
  description: string;
  highlights: {
    category: string;
    items: string[];
  }[];
  techStack: string[];
}

export interface Certification {
  name: string;
  platform: string;
  date?: string;
  credentialUrl?: string;
}

export interface NavLink {
  label: string;
  href: string;
}

export interface SocialLink {
  name: string;
  url: string;
  icon: string;
}

export interface BlogPost {
  slug: string;           // SEO-friendly URL slug
  title: string;
  excerpt: string;        // Short preview for cards
  content: string;        // Markdown content
  coverImage?: string;
  tags: string[];
  publishedAt: string;    // ISO date string
  updatedAt?: string;
  readingTime: number;    // Estimated minutes to read
}
