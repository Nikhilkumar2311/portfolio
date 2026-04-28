---
title: How Kubernetes Decides Where Your Pods Run
slug: kubernetes-scheduler
excerpt: Kubernetes doesn’t randomly place Pods on nodes. The scheduler makes intelligent decisions based on resources, constraints, and policies to ensure efficient workload distribution.
coverImage: /blogs/kubernetes-scheduler.webp
tags:
  - Kubernetes
  - Learning
publishedAt: 2026-04-28
---

## How Kubernetes Decides Where Your Pods Run

When you create a Pod in Kubernetes, you never specify:

“Run this on Node A”

Yet, somehow, the Pod gets scheduled and starts running.

At first, it feels automatic.

But behind the scenes, there’s a critical component making this decision:

> The Kubernetes Scheduler

---

### The Problem: Where Should a Pod Run?

In a cluster:

- multiple nodes exist  
- each node has different resources  
- workloads have different requirements  

The question is:

👉 Which node is the best place for this Pod?

This is what the scheduler solves.

---

### What Is the Kubernetes Scheduler?

The **Scheduler** is a control plane component that:

- watches for unscheduled Pods  
- selects the best node  
- assigns the Pod to that node  

Important:

> The scheduler only decides placement - it does NOT run the Pod.

Once assigned, the **kubelet** on that node actually runs it.

---

### The Scheduling Process (Step-by-Step)

Here’s what happens when you create a Pod:

1. Pod is created (no node assigned)  
2. Scheduler detects unscheduled Pod  
3. Filters nodes that are eligible  
4. Scores remaining nodes  
5. Selects the best node  
6. Assigns Pod to that node  

This entire process happens automatically.

---

### Step 1: Filtering Nodes

The scheduler first removes nodes that **cannot run the Pod**.

Reasons a node may be filtered out:

- insufficient CPU or memory  
- node is not ready  
- taints block scheduling  
- node doesn’t match constraints  

This step ensures only valid nodes are considered.

---

### Step 2: Scoring Nodes

Now the scheduler ranks the remaining nodes.

It evaluates based on:

- resource availability  
- load balancing  
- affinity rules  
- topology  

Each node gets a score.

The highest score wins.

---

### Resource Requests Matter

Pods can define resource requirements:

```yaml
resources:
  requests:
    cpu: "500m"
    memory: "256Mi"
```

The scheduler uses this to:
- avoid overloading nodes
- ensure fair distribution

> Without requests, scheduling becomes less predictable.

---

### Node Affinity (Controlling Placement)

Sometimes you want control over where Pods run.

This is done using node affinity.

Example:

```yaml
affinity:
  nodeAffinity:
    requiredDuringSchedulingIgnoredDuringExecution:
      nodeSelectorTerms:
        - matchExpressions:
            - key: disktype
              operator: In
              values:
                - ssd
```

This ensures Pods run only on specific nodes.

---

### Taints and Tolerations

Another important concept:

> Taints repel Pods. Tolerations allow Pods.

Example:
- Node is tainted → no Pod can run
- Pod has toleration → it can run

Used for:
- dedicated nodes
- special workloads

---

### Why Scheduling Matters

Without a scheduler:
- Pods could overload nodes
- resources would be wasted
- system becomes unstable

With the scheduler:
- workloads are balanced
- resources are optimized
- system remains reliable

---

### The Real Philosophy

The scheduler follows a simple principle:

> Place workloads where they fit best.

Not randomly.
Not manually.

But based on rules, constraints, and optimization.

---

### Common Mistakes Beginners Make
- not defining resource requests
- misunderstanding affinity rules
- ignoring taints and tolerations
- assuming Pods run randomly

---

### How Scheduler Fits in the Bigger Picture

Now you can see the full flow:
- Deployment → defines desired state
- Scheduler → chooses node
- kubelet → runs Pod
- Service → exposes Pod
- Ingress → exposes externally

Everything is connected.

---

### Final Takeaway

The Kubernetes Scheduler is what makes the cluster efficient.

It ensures:
- intelligent workload placement
- optimal resource usage
- system stability

Without it, Kubernetes would not function as a distributed system.

---

### In the Next Blog

Now that we understand all core components, it’s time to step back and look at the bigger picture:

How everything in Kubernetes works together.

In the next article, we’ll break down:

- control plane
- etcd
- full architecture
- and the real lessons Kubernetes teaches about system design
