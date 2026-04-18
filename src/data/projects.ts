import type { Project } from "../types";

export const projects: Project[] = [
  {
    title: "CI/CD Pipeline Automation",
    description:
      "Automated deployment pipeline using GitHub Actions with Docker containerization and AWS deployment.",
    status: "completed",
    problem: "Manual deployments were time-consuming and error-prone.",
    solution:
      "Built a GitHub Actions workflow that automatically builds, tests, and deploys on every push.",
    outcome:
      "Reduced deployment time from 30 min to under 5 min with zero manual intervention.",
    techStack: ["GitHub Actions", "Docker", "AWS EC2", "Shell Script"],
    githubUrl: "https://github.com/Nikhilkumar2311/CI-CD-PIPELINE",
    liveUrl: undefined,
    architectureDiagram: "/diagrams/cicd-pipeline.webp",
    blogUrl: "/blogs/production-grade-cicd-pipeline",
  },
  {
    title: "Infrastructure as Code",
    description:
      "Cloud infrastructure provisioning using Terraform with modular and reusable configurations.",
    status: "completed",
    problem:
      "Manual AWS resource setup was inconsistent and hard to replicate.",
    solution:
      "Creating Terraform modules for VPC, EC2, S3, and IAM with reusable patterns.",
    outcome:
      "Infrastructure can be deployed reliably and consistently across environments.",
    techStack: ["Terraform", "AWS", "VPC"],
    githubUrl: "https://github.com/Nikhilkumar2311/CI-CD-PIPELINE",
    liveUrl: undefined,
    architectureDiagram: "/diagrams/terraform.webp",
    blogUrl: "/blogs/cicd-terraform-upgrade",
  },
  {
    title: "Monitoring Stack Setup",
    description:
      "Complete monitoring solution with Prometheus for metrics collection and Grafana for visualization.",
    status: "completed",
    problem: "No visibility into application performance or system health.",
    solution:
      "Setting up Prometheus + Grafana + Loki stack with Docker Compose for observability.",
    outcome: "Real-time dashboards and alerting for proactive issue detection.",
    techStack: ["Prometheus", "Grafana", "Docker Compose", "Loki"],
    githubUrl: "https://github.com/Nikhilkumar2311/CI-CD-PIPELINE",
    liveUrl: undefined,
    architectureDiagram: "/diagrams/monitoring.webp",
    blogUrl: "/blogs/cicd-monitoring-upgrade",
  },
  {
    title: "Kubernetes CI/CD Architecture",
    description:
      "Highly available, autoscaling Kubernetes architecture with environment separation and automated GitOps-style deployments.",
    status: "completed",
    problem:
      "Manual Docker deployments lacked automated scaling, self-healing capabilities, and required duplicating complex configuration files across Dev and Prod environments.",
    solution:
      "Designed a completely declarative Kubernetes infrastructure using Kustomize overlays for environment isolation. Implemented advanced SRE constraints (HPA, PDBs, Pod Anti-Affinity, Liveness/Readiness probes) and integrated dynamic image tagging directly into the GitHub Actions CI/CD pipeline.",
    outcome:
      "Achieved fully automated, zero-downtime rolling updates, strict resource management, and instant deployment rollbacks while maintaining clean, DRY infrastructure-as-code.",
    techStack: [
      "Kubernetes",
      "Kustomize",
      "GitHub Actions",
      "Docker",
      "Minikube",
    ],
    githubUrl: "https://github.com/Nikhilkumar2311/CI-CD-PIPELINE",
    liveUrl: undefined,
    architectureDiagram: "/diagrams/k8s.webp",
    blogUrl: "/blogs/cicd-kubernetes-upgrade",
  },
  {
    title: "AWS Driven Microservices Architecture & CI/CD",
    description:
      "Scalable, Infrastructure-as-Code driven deployment on AWS featuring containerized Python and Node.js microservices with automated GitOps-style delivery.",
    status: "completed",
    problem:
      "Manual infrastructure provisioning and deployment processes created bottlenecks, security vulnerabilities, and inconsistencies across environments for a complex multi-service architecture.",
    solution:
      "Engineered a fully declarative infrastructure utilizing Terraform for automated AWS provisioning (VPC, EC2, IAM, ECR). Leveraged zero-trust security principles using IAM instance profiles instead of static credentials, and orchestrated a unified Docker Compose multi-container environment backed by an NGINX reverse proxy for dynamic routing. Integrated GitHub Actions to deliver a highly automated CI/CD pipeline featuring ECR image lifecycle management and automated container deployment.",
    outcome:
      "Achieved predictable, immutable deployments with zero manual SSH configuration required. Decreased deployment time by 80%, enhanced security posture through strict IAM integrations, and optimized cloud costs with automated EC2 health checks and ECR image cleanup policies.",
    techStack: [
      "AWS EC2 & VPC",
      "AWS ECR",
      "Terraform",
      "Docker Compose",
      "GitHub Actions",
    ],
    githubUrl: undefined,
    liveUrl: "https://pitchrr.in",
    architectureDiagram: "/diagrams/aws-architecture.webp",
    blogUrl: "/blogs/aws-microservices-terraform-cicd",
  },
];
