---
title: How I Became the DevOps Engineer in My Company
slug: how-i-became-devops-engineer
excerpt: How I transitioned from a full-stack developer to handling DevOps and cloud responsibilities in my company.
coverImage: /blogs/how-i-became-devops.png
tags:
  - DevOps
  - CI/CD
  - Docker
  - Hostinger VPS
  - GitHub Actions
publishedAt: 2026-01-27
---

## How I Became the DevOps Engineer in My Company

I joined my company as a full-stack developer, but over time I found myself handling something very different - DevOps and cloud infrastructure.

This blog explains how that happened, what I learned, and what I’m still improving.

---

### The Problem: No DevOps Team

When I joined the company, there was no dedicated DevOps engineer or team.

- Deployments were mostly manual
- Builds were happening directly on the production server
- There was no CI/CD pipeline
- Rollbacks were risky and time-consuming

As the application grew, deployments started becoming unreliable.

---

### Taking Ownership

Since no one else was handling deployments, I decided to take responsibility and learn how to manage them properly.

I started by asking simple questions:

- How can we automate deployments?
- How can we reduce downtime?
- How can we make deployments reproducible?

This was my entry point into DevOps.

---

### My First Steps into DevOps

I started with **GitHub Actions** because our code was already hosted on GitHub.

#### Tools I began with:

- **Docker** - to containerize applications
- **GitHub Actions** - for CI/CD automation
- **Hostinger VPS** - for hosting
- **GitHub** - for version control and triggers

I created GitHub Actions workflows that automatically built Docker images and deployed them to production after every successful commit.

---

### Lessons from Production

While deploying to production, I faced real issues that changed how I built Docker images.

One major problem was **large Docker image sizes**, which caused:

- Slower deployments
- Longer CI/CD execution time
- Increased resource usage on servers

To solve this, I started using **multi-stage Docker builds**, which significantly reduced image size and improved deployment speed.

---

### Improving the CI/CD Process

As the number of services increased, maintaining separate CI/CD logic became repetitive.

To improve this:

- I standardized GitHub Actions workflows
- Reused common steps across services
- Ensured consistent build and deployment behavior

This made the pipelines easier to maintain and reduced deployment errors.

---

### Handling Production Issues

Working with production systems taught me important lessons.

When a deployment fails:

1. I first roll back to the last stable version to minimize user impact
2. I analyze logs using **Loki** and **Grafana**
3. I identify the root cause
4. I apply the fix and redeploy
5. I monitor the system closely after deployment

This approach helps keep the system stable.

---

### What I Learned

This journey taught me that DevOps is not just about tools.

I learned:

- Why automation is critical
- How small mistakes can impact production
- The importance of monitoring and observability
- How to stay calm during incidents

Most importantly, I learned how to learn independently.

---

### What I’m Learning Next

To grow further, I am currently learning:

- **Infrastructure as Code** using Terraform
- **Kubernetes** for container orchestration
- Better cloud architecture and security practices

---

### Final Thoughts

I didn’t plan to become a DevOps engineer.

I became one by:

- Taking ownership
- Solving real problems
- Learning step by step

This journey is still ongoing, but it has already helped me grow significantly as an engineer.

---

_If you’re a developer in a similar situation, don’t wait for a title - start solving problems. That’s how DevOps begins._
