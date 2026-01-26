import { Cloud, GitBranch, Box, Activity, type LucideIcon } from 'lucide-react';

// DevOps stack category interface
export interface DevOpsCategory {
  category: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
  borderColor: string;
  tools: string[];
}

export const devOpsStack: DevOpsCategory[] = [
  {
    category: 'Cloud & Hosting',
    icon: Cloud,
    color: 'text-secondary',
    bgColor: 'bg-secondary/10',
    borderColor: 'border-secondary/30',
    tools: ['AWS', 'EC2', 'S3', 'ECS', 'ECR', 'IAM', 'VPC'],
  },
  {
    category: 'CI/CD',
    icon: GitBranch,
    color: 'text-primary',
    bgColor: 'bg-primary/10',
    borderColor: 'border-primary/30',
    tools: ['Jenkins', 'GitHub Actions', 'Shell Scripts'],
  },
  {
    category: 'Containers',
    icon: Box,
    color: 'text-green-400',
    bgColor: 'bg-green-400/10',
    borderColor: 'border-green-400/30',
    tools: ['Docker', 'Docker Compose'],
  },
  {
    category: 'Monitoring',
    icon: Activity,
    color: 'text-amber-400',
    bgColor: 'bg-amber-400/10',
    borderColor: 'border-amber-400/30',
    tools: ['Prometheus', 'Grafana', 'Loki'],
  },
];
