import type { Tool } from "../types";

export const tools: Tool[] = [
  {
    name: "AWS",
    description:
      "Cloud platform for hosting, storage, and infrastructure services.",
    icon: "Cloud",
  },
  {
    name: "Docker",
    description:
      "Containerization platform for building and deploying applications.",
    icon: "Container",
  },
  {
    name: "GitHub Actions",
    description:
      "CI/CD automation directly integrated with GitHub repositories.",
    icon: "GitBranch",
  },
  {
    name: "Jenkins",
    description: "Open-source automation server for building CI/CD pipelines.",
    icon: "Settings",
  },
  // {
  //     name: 'Kubernetes',
  //     description: 'Container orchestration platform for managing deployments at scale.',
  //     icon: 'Layers',
  // },
  // {
  //     name: 'Terraform',
  //     description: 'Infrastructure as Code tool for provisioning cloud resources.',
  //     icon: 'FileCode',
  // },
  {
    name: "Prometheus",
    description: "Monitoring and alerting toolkit for metrics collection.",
    icon: "Activity",
  },
  {
    name: "Grafana",
    description:
      "Visualization platform for monitoring dashboards and analytics.",
    icon: "BarChart3",
  },
  {
    name: "Loki",
    description:
      "Log aggregation system for storing, querying, and analyzing application logs.",
    icon: "File",
  },
];
