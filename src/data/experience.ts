import type { Experience, Certification } from "../types";

export const experiences: Experience[] = [
  {
    title: "DevOps Cloud Engineer + Full-Stack Developer",
    company: "Pocketwise Technologies Private Limited",
    companyInitial: "P",
    logo: '/company/pocketwise.svg',
    period: "2025 - Present",
    duration: "~1 Year",
    employmentType: "full-time",
    description:
      "Worked across DevOps and full-stack development, focusing on building scalable cloud infrastructure, automating CI/CD pipelines, and developing end-to-end web applications.",
    highlights: [
      {
        category: "DevOps & Cloud",
        items: [
          "Built and maintained automated CI/CD pipelines using GitHub Actions and Jenkins",
          "Designed and deployed cloud infrastructure on AWS using EC2, S3, VPC, and related services",
          "Containerized and orchestrated applications using Docker and Docker Compose",
          "Implemented monitoring and observability solutions using Prometheus and Grafana",
        ],
      },
      {
        category: "Development",
        items: [
          "Developed responsive web applications using React and Node.js",
          "Deployed and maintained production-ready applications",
        ],
      },
    ],
    techStack: ["AWS", "Docker", "Jenkins", "GitHub Actions", "React", "Node.js", "Prometheus", "Grafana", "TypeScript"],
  },
];

export const certifications: Certification[] = [
  {
    name: "AWS Cloud Practitioner",
    platform: "Amazon Web Services",
    date: "2024",
    credentialUrl: undefined,
  },
  {
    name: "Docker Fundamentals",
    platform: "Docker",
    date: "2024",
    credentialUrl: undefined,
  },
];
