---
title: I Almost Automated Terraform in CI - Here’s Why I Didn’t
slug: terraform-ci-automation-decision
excerpt: Automating Terraform in CI sounds efficient, but it can introduce serious risks. Here’s why I chose a safer workflow.
coverImage: /blogs/terraform-ci-automation-decision.webp
tags:
  - Terraform
  - Learning
publishedAt: 2026-02-20
---

## I Almost Automated Terraform in CI - Here’s Why I Didn’t

After integrating Terraform into my infrastructure workflow, the next logical step seemed obvious:

Automate it.

If CI/CD can deploy applications automatically, why not let Terraform automatically apply infrastructure changes?

It sounds efficient.  
It sounds modern.  
It sounds like best practice.

But after researching real-world workflows and considering the risks, I decided **not** to auto-apply Terraform.

This decision improved safety and aligned my workflow with how infrastructure is managed in production environments.

---

### Why Auto-Applying Terraform Seems Attractive

Automation promises:

- Faster infrastructure updates  
- Reduced manual work  
- Fully automated pipelines  
- Consistent environments  

At first glance, it feels like the next step in DevOps maturity.

But infrastructure changes are not the same as application deployments.

---

### Infrastructure Changes Are High Impact

Application deployments can fail and be rolled back.

Infrastructure changes can:
- break networking
- destroy databases
- remove access
- cause downtime
- impact multiple services

A misconfigured Terraform apply can affect far more than a single service.

This changes the risk profile significantly.

---

### CI/CD Is Safe for Applications, Not Always for Infrastructure

CI/CD pipelines work well for application delivery because:

- deployments are frequent
- rollback is fast
- impact is limited
- failures are visible quickly

Infrastructure changes are different:

- they are less frequent
- rollback is complex
- impact can be system-wide
- failures can block access entirely

Treating both the same can introduce unnecessary risk.

---

### The Risk of Unreviewed Infrastructure Changes

Imagine this scenario:

- A small Terraform change is pushed
- CI auto-applies it
- Security group rules change
- SSH access is blocked
- CI pipeline can no longer connect

Automation has now locked you out of your own system.

Manual review acts as a safety barrier against such mistakes.

---

### The Workflow I Chose Instead

Instead of auto-applying Terraform, I use a safer workflow:

1. Modify Terraform configuration  
2. Run `terraform plan`  
3. Review proposed changes  
4. Apply manually when safe  

This approach ensures:
- visibility before change
- human verification
- controlled infrastructure evolution

It balances automation with safety.

---

### How Infrastructure Teams Handle Terraform

In production environments, Terraform workflows typically include:

- Pull request reviews  
- Plan output inspection  
- Manual approval gates  
- Controlled apply steps  

Automation is used for **validation**, not blind execution.

Understanding this helped me align my workflow with real-world practices.

---

### When Auto-Apply Might Make Sense

There are scenarios where auto-apply is acceptable:

- temporary environments  
- preview environments  
- sandbox infrastructure  
- ephemeral testing setups  

But for persistent infrastructure, manual approval remains the safer choice.

---

### Final Takeaway

Automation is powerful - but not all automation is wise.

By choosing manual Terraform applies, I gained:
- safety
- visibility
- control
- confidence in infrastructure changes

Sometimes maturity in DevOps isn’t about adding automation - it’s about knowing where to stop.

---

### What’s Next

In the final Terraform blog, I’ll share the biggest lesson this journey taught me:

👉 **What Terraform Taught Me About Designing Reliable Infrastructure**

Because Terraform didn’t just help me build infrastructure - it changed how I think about systems.
