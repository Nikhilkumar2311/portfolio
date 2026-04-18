---
title: Building an AWS Microservices Architecture with Terraform & CI/CD
slug: aws-microservices-terraform-cicd
excerpt: How I engineered a scalable, declarative cloud infrastructure on AWS for a multi-service application using Terraform, Docker Compose, and automated CI/CD pipelines.
coverImage: /blogs/aws-microservices-terraform-cicd.webp
tags:
  - Terraform
  - AWS
  - CI/CD
  - Project
publishedAt: 2026-04-19
---

## Building an AWS Microservices Architecture with Terraform & CI/CD

When scaling **Pitchrr** into a robust multi-service architecture (featuring distinct Core, AI, Billing, PDF, and Community microservices), it became clear that manual server provisioning was no longer viable.

Relying on manual AWS console clicks to set up VPCs, IAM roles, and multiple ECR repositories introduced a major limitation:

**Infrastructure was not reproducible.**

This upgrade focuses on solving that problem by introducing **Terraform**, securely integrating it with **GitHub Actions**, and transitioning the platform into a fully automated, immutable, and Infrastructure-as-Code (IaC) driven system.

---

### The CI/CD Pipeline

At a high level, the automated CI/CD pipeline for the microservices works as follows:

- Code commits trigger **GitHub Actions** workflows.
- Application code is tested and built into lightweight Docker images.
- Images are versioned and pushed to isolated **AWS ECR** (Elastic Container Registry) repositories.
- The **AWS EC2** host automatically authenticates with ECR, pulls the latest images, and orchestrates them via **Docker Compose**.
- An **NGINX reverse proxy** routes traffic dynamically to the correct internal containers.

---

### Why Infrastructure as Code Was Needed

The main issue became clear as the architecture grew in complexity:

> A pipeline is only as reliable as the infrastructure it depends on.

Without Infrastructure as Code:

- Manually creating identical environments (Dev/Staging/Prod) was slow and error-prone.
- Managing 5+ separate ECR repositories and tagging policies manually was tedious.
- Securely handling AWS credentials on the EC2 host risked security leaks.
- Disaster recovery depended entirely on undocumented manual steps.

Terraform was introduced to eliminate these risks and codify the cloud.

---

### Infrastructure Architecture Overview

The infrastructure defined using Terraform consists of:

- **Custom VPC** with controlled CIDR ranges and an **Internet Gateway**.
- **Public Subnets** and customized Route Tables.
- **Security Groups** explicitly defining allowed incoming traffic (HTTP, HTTPS, SSH).
- **Elastic IP** ensuring stable public access to the Pitchrr platform.
- **Dynamic ECR Repositories** for all microservices, enforced with automated lifecycle cleanups.
- **IAM Instance Profiles:** Secure, zero-trust EC2 role assignments that authorize Docker to pull images from ECR without hardcoded credentials.

All components are defined declaratively, with dependencies handled automatically by Terraform.

---

### Provisioning Infrastructure with Terraform

Terraform is used to provision and manage infrastructure-not deploy application code.

Using Terraform:

- Infrastructure is defined as versioned code (`main.tf`).
- Resources are created in a predictable, dependency-aware order.
- Architecture decisions are explicit and reviewable in pull requests.
- ECR automated garbage collection policies prevent bloat and reduce AWS costs.

This completely removes manual AWS Console configuration and eliminates infrastructure drift.

---

### Automated Server Bootstrapping

EC2 instances are configured automatically at launch using a robust **user-data** script.

The bootstrapping process includes:

- Updating system packages.
- Installing the Docker Engine and Docker Compose.
- Installing the AWS CLI.
- Setting up a scheduled cron job (every 6 hours) to automatically refresh ECR login tokens via IAM roles.

As a result:

- No manual SSH setup is required.
- Instances are completely immutable and disposable.
- Server recreation is safe, hands-free, and repeatable.

Infrastructure failures no longer require manual repair-they simply require replacement.

---

### Service Orchestration & NGINX

Once the infrastructure is live, traffic routing is handled dynamically.

Using `docker-compose.yml`:

- Microservices communicate over an isolated internal Docker bridge network.
- Explicit memory limits and reservations protect the EC2 instance from resource starvation.
- The **NGINX Reverse Proxy** sits on a public-facing network, managing SSL termination (Let's Encrypt) and safely routing external HTTP/HTTPS requests to the internal APIs.

---

### What This Upgrade Changed

**Before:**

- Infrastructure was manually created via the AWS Console.
- Scaling to new microservices took hours of configuration.
- EC2 environments utilized static, risky API keys to interface with AWS services.

**After:**

- Infrastructure is defined strictly as code.
- Servers, networking, and IAM policies are fully reproducible.
- EC2 securely assumes AWS permissions without physical keys.
- Rolling out a new microservice only takes a few lines of Terraform.

The pipeline now cleanly separates continuous delivery (GitHub Actions) from infrastructure lifecycle management (Terraform).

---

### Infrastructure Safety & Stability

Automation alone is not enough-security and stability matter.

Several design decisions improve stability:

- **Zero-Trust IAM Roles:** The EC2 server accesses ECR strictly through `aws_iam_instance_profile`.
- **Resource Constraints:** Docker containers are memory-capped to prevent cascading server crashes.
- **Automated Expirations:** `aws_ecr_lifecycle_policy` guarantees that we only keep the last 5 active images, automatically purging older untagged images.

This defense-in-depth ensures safe deployments and controlled infrastructure evolution.

---

### What Broke & What I Learned

While engineering this architecture, several real-world issues surfaced:

- **ECR Token Expirations:** AWS ECR login tokens expire every 12 hours. I successfully resolved this by writing a cron job during EC2 bootstrapping to automatically fetch and inject new tokens natively.
- **Inter-service Networking:** Making NestJS, FastAPI, Node, and Redis containers talk to each other without exposing them to the internet required precise Docker network layering.
- **Provider State Issues:** State locking requires careful management if deploying across teams.

Each issue reinforced an important lesson:

> Infrastructure must be designed to be replaceable, not repaired.

---

### Final Takeaways

This upgrade reinforced a critical mindset shift:

> CI/CD is incomplete without reproducible infrastructure.

By introducing Terraform, the system evolved from:

- **Manual infra** → **Declarative architecture**
- **Risky keys** → **Secure IAM profiles**
- **Fragile recovery** → **Predictable recreation**

Infrastructure as Code is not optional for modern, multi-tier production systems-it is foundational.

---

### What’s Next

To build on this foundation, future improvements could include:

- Remote Terraform state with S3 and DynamoDB locking.
- Implementing AWS ECS (Elastic Container Service) or Kubernetes to natively replace Docker Compose for auto-scaling.

The system is no longer just deployable-it is architected to scale and evolve safely.

---

_Check out the live deployment of this architecture:_  
👉 **[View the live project (Pitchrr)](https://pitchrr.in)**
