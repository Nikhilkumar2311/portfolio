---
title: Evolving Deployments with Kubernetes for Modern Applications
slug: cicd-kubernetes-upgrade
excerpt: How I replaced manual Docker deployments with a fully automated, autoscaling, and highly-available Kubernetes architecture managed by Kustomize and GitHub Actions.
coverImage: /blogs/cicd-kubernetes-upgrade.webp
tags:
  - Kubernetes
  - Project
  - CI/CD
  - System Architecture
publishedAt: 2026-03-24
---

## Evolving Deployments with Kubernetes

I had previously structured my **production CI/CD pipeline** to automate testing, build containers, and securely deploy to AWS EC2 instances provisioned by Terraform.

The pipeline was completely automated, but it faced a rigid operational ceiling:

**The deployment itself was imperative and lacked high availability.**

If a container crashed, the pipeline couldn't self-heal. If traffic spiked, the server couldn't autoscale. If an update broke production, rolling back required running manual Docker commands.

This upgrade focuses on solving those scaling and reliability problems by introducing **Kubernetes** and **Kustomize**, transitioning the system into a declarative, GitOps-ready environment.

---

### Quick Recap: The Previous Pipeline

At a high level, the previous phase of the pipeline worked as follows:

- Infrastructure provisioned by Terraform.
- GitHub Actions compiled tests and built Docker containers.
- CI/CD SSH'd into an EC2 instance and ran `docker run`.
- Prometheus and Grafana monitored the raw containers.

For a breakdown of how the base pipeline was built automatically, refer to:
👉 **[Building a Production-Grade CI/CD Pipeline](/blogs/production-grade-cicd-pipeline)**

For how the infrastructure was codified, see:
👉 **[Upgrading a CI/CD Pipeline with Terraform](/blogs/cicd-terraform-upgrade)**

---

### Why Kubernetes Was Needed

The main issue with raw Docker deployments became clear as the architecture scaled:

> Imperative deployments work fine until failure occurs.

Without a container orchestrator:

- Containers don't restart when underlying EC2 nodes fail.
- Adding a second server requires manual load balancer configuration.
- Dev and Prod environments share duplicated, messy configuration files.
- Zero-downtime rollouts are incredibly difficult to script manually via SSH.

Kubernetes was introduced to shift the burden of reliability away from custom Bash scripts and onto a self-healing control plane.

---

### Infrastructure Architecture Overview

The application architecture defined using Kubernetes consists of:

- **Nginx Ingress Controller** with regex routing and TLS termination.
- **NodePort Services** serving internal cluster load balancing.
- **ConfigMaps & Secrets** abstracting environment data completely out of the codebase.
- **Kustomize Overlays** managing dynamic environment separation (`k8s/overlays/dev` vs `k8s/overlays/prod`).
- **Resource Limits** strictly controlling Memory and CPU allocations.

All components are defined declaratively following the DRY (Don't Repeat Yourself) principle.

---

### Automated GitOps Integration

Instead of the pipeline pulling code to a remote server, GitHub Actions now directly injects artifacts into the Kubernetes manifests.

The deployment process includes:

- Tagging the new Docker image with the specific **Git Commit SHA**.
- Using Kustomize to dynamically inject the SHA tag: `kustomize edit set image ...`
- Applying the overlay to the targeted isolated namespace cleanly.

As a result:

- No manual SSH secrets are necessary in GitHub Actions.
- Every deployment is exactly traceable to a specific Git commit.
- If a deployment fails, Kubernetes natively rolls back to the previous stable ReplicaSet.

Deployments are no longer "events" - they are simply state synchronizations.

---

### What This Upgrade Changed

Before:

- Deployments were triggered manually via SSH scripts.
- Only a single instance of the container ran at a time.
- Both Dev and Prod containers shared similar, hacky environment files.
- Reverting bad code meant re-pushing old code through the pipeline.

After:

- Deployments are tracked purely via manifest state injections.
- Kubernetes spreads Pods across nodes and load-balances automatically.
- Kustomize cleanly structures `base`, `dev`, and `prod` configurations without duplication.
- Reverts are immediate, zero-downtime ReplicaSet rollbacks (`kubectl rollout undo`).

The pipeline now controls not just the delivery of code, but the dynamic scaling of the environment.

---

### Infrastructure Safety & Stability

Resiliency was the primary driver for this phase. Several Kubernetes constraints were implemented to enforce stability:

- **Horizontal Pod Autoscaling (HPA):** Metrics-driven scaling adds Pod replicas when average CPU usage crosses 70%.
- **Pod Disruption Budgets (PDB):** Guarantees at least 1 Pod will always be healthy, even if AWS randomly reboots the underlying nodes for maintenance.
- **Pod Anti-Affinity:** Forces Kubernetes to schedule replicas onto physically different servers to eliminate single points of failure.
- **Granular Health Checking:** Separated `/health/liveness` and `/health/readiness` endpoints to ensure traffic isn't routed to a pod until dependencies are actually connected.

---

### What Broke & What I Learned

While implementing the advanced Kustomize architecture, several real-world issues surfaced:

- **Namespace Conflicts:** Assigning identical NodePorts globally across namespaces caused deployment rejections, highlighting the importance of fully isolated environments.
- **Regex Ingress Pathing:** Using `(.*)` regular expressions aggressively broke standard `Prefix` pathing, requiring the implementation of the `ImplementationSpecific` type.
- **Persistent Volume Anti-Patterns:** Attempting to force stateful file-logging onto stateless ReplicaSets broke concurrency, immediately proving why 12-Factor Apps must log exclusively to `stdout`.

Each issue reinforced an important lesson:

> You cannot "lift and shift" traditional architecture into Kubernetes. You have to adapt to a stateless, highly-distributed mindset.

---

### Final Takeaways

This upgrade reinforced a critical operations shift:

> Orchestration solves scaling; Declarative configuration solves management.

By introducing Kubernetes and Kustomize, the system evolved from:

- **Single-Node** → **Highly Available**
- **Manual Configs** → **DRY Overlays**
- **Fragile Rollouts** → **Deterministic Synchronizations**

Kubernetes stops you from telling your servers _what to do_, and instead forces you to declare _what reality should look like_.

---

_Source code and pipeline configuration are available on GitHub._  
[View the source code on GitHub](https://github.com/Nikhilkumar2311/CI-CD-PIPELINE)
