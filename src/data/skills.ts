import type { SkillCategory } from '../types';

export const skillCategories: SkillCategory[] = [
    {
        title: 'Cloud & Infrastructure',
        icon: 'Cloud',
        skills: [
            { name: 'AWS' },
            { name: 'EC2' },
            { name: 'S3' },
            { name: 'VPC' },
            { name: 'IAM' },
            { name: 'ECS' },
            { name: 'ECR' },
        ],
    },
    {
        title: 'CI/CD & Automation',
        icon: 'GitBranch',
        skills: [
            { name: 'GitHub Actions' },
            { name: 'Jenkins' },
            { name: 'Shell Scripting' },
        ],
    },
    {
        title: 'Containers & Orchestration',
        icon: 'Container',
        skills: [
            { name: 'Docker' },
            { name: 'Docker Compose' },
            // { name: 'Kubernetes' },
            // { name: 'Helm' },
        ],
    },
    {
        title: 'Monitoring & Observability',
        icon: 'Activity',
        skills: [
            { name: 'Prometheus' },
            { name: 'Grafana' },
            { name: 'Loki' },
        ],
    },
    {
        title: 'Programming & Scripting',
        icon: 'Code',
        skills: [
            { name: 'Python' },
            { name: 'Bash' },
            { name: 'JavaScript' },
            { name: 'TypeScript' },
            { name: 'YAML' },
        ],
    },
];
