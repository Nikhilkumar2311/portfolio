import type { Experience, Certification } from "../types";

export const experiences: Experience[] = [
  {
    title: "DevOps Cloud Engineer + Full-Stack Developer",
    company: "Pocketwise Technologies Private Limited",
    period: "2025 - Present",
    description:
      "Worked across DevOps and full-stack development, focusing on building scalable cloud infrastructure, automating CI/CD pipelines, and developing end-to-end web applications.",
    highlights: [
      "Built and maintained automated CI/CD pipelines using GitHub Actions and Jenkins",
      "Designed and deployed cloud infrastructure on AWS using EC2, S3, VPC, and related services",
      "Containerized and orchestrated applications using Docker and Docker Compose",
      "Implemented monitoring and observability solutions using Prometheus and Grafana",
      "Developed responsive web applications using React and Node.js",
      "Worked with relational and NoSQL databases including PostgreSQL and MongoDB",
      "Deployed and maintained production-ready applications",
      "Gained hands-on DevOps expertise by managing deployments and infrastructure challenges",
    ],
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
