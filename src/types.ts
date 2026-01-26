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

export interface Experience {
  title: string;
  company: string;
  period: string;
  description: string;
  highlights: string[];
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
