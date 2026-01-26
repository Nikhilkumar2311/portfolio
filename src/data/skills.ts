import { Flame, Zap, BookOpen, type LucideIcon } from 'lucide-react';

// Skill tier interface for tiered layout
export interface SkillTier {
    title: string;
    subtitle: string;
    icon: LucideIcon;
    color: string;
    bgColor: string;
    borderColor: string;
    skills: { name: string }[];
}

export const skillTiers: SkillTier[] = [
    {
        title: 'Core Skills',
        subtitle: 'Daily use in production',
        icon: Flame,
        color: 'text-orange-400',
        bgColor: 'bg-orange-400/10',
        borderColor: 'border-orange-400/30',
        skills: [
            { name: 'AWS' },
            { name: 'Docker' },
            { name: 'Jenkins' },
            { name: 'GitHub Actions' },
            { name: 'EC2 / S3 / IAM' },
            { name: 'Shell Scripting' },
            { name: 'Prometheus' },
            { name: 'Grafana' },
            { name: 'Docker Compose' },
            { name: 'ECS / ECR' },
        ],
    },
    {
        title: 'Proficient',
        subtitle: 'Strong working knowledge',
        icon: Zap,
        color: 'text-primary',
        bgColor: 'bg-primary/10',
        borderColor: 'border-primary/30',
        skills: [
            { name: 'Python' },
            { name: 'Typescript' },
            { name: 'MongoDB' },
            { name: 'MYSQL' },
            { name: 'Express' },
            { name: 'Node.js' },
            { name: 'React' },
            { name: 'Next.js' },
            { name: 'Tailwind CSS' },
            { name: 'Tailwind CSS' },
        ],
    },
    {
        title: 'Learning',
        subtitle: 'Currently exploring',
        icon: BookOpen,
        color: 'text-secondary',
        bgColor: 'bg-secondary/10',
        borderColor: 'border-secondary/30',
        skills: [
            { name: 'Kubernetes' },
            { name: 'Terraform' },
            { name: 'Ansible' },
            { name: 'ArgoCD' },
        ],
    },
];
