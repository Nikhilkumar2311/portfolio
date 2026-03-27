---
title: How Kubernetes Handles Configuration Without Rebuilding Containers
slug: kubernetes-configmaps-secrets
excerpt: Managing configuration separately from application code is essential in Kubernetes. ConfigMaps and Secrets make this possible while keeping systems flexible and secure.
coverImage: /blogs/kubernetes-configmaps-secrets.webp
tags:
  - Kubernetes
  - Learning
publishedAt: 2026-03-27
---

## How Kubernetes Handles Configuration Without Rebuilding Containers

When I first deployed applications using containers, I made a common mistake:

I hardcoded configuration inside the container.

Things like:
- database URLs
- API keys
- environment settings

It worked… until something needed to change.

> And suddenly, every small change required rebuilding and redeploying the entire image.

Kubernetes solves this problem using **ConfigMaps** and **Secrets**.

They allow you to separate **configuration from application code**.

---

### The Problem with Hardcoded Configuration

Hardcoding configuration creates multiple issues:

- You must rebuild images for small changes  
- Different environments (dev, staging, prod) become hard to manage  
- Sensitive data gets exposed  

Example problem:

- Same app  
- Different database in dev vs production  

Without separation → multiple images needed  
With separation → one image, multiple configs

---

### What Is a ConfigMap?

A **ConfigMap** is used to store **non-sensitive configuration data** in key-value form.

Examples:
- environment variables  
- config files  
- application settings  

You can inject ConfigMaps into Pods in multiple ways:

- environment variables  
- command-line arguments  
- mounted files  

---

### Why ConfigMaps Matter

ConfigMaps allow you to:

- change configuration without rebuilding images  
- reuse the same container across environments  
- decouple infrastructure from application logic  

This is critical for **scalable systems**.

---

### Example ConfigMap

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
data:
  NODE_ENV: production
  APP_MODE: kubernetes
```

This creates a simple configuration store.

---

### Using ConfigMap in a Pod

```yaml
env:
  - name: NODE_ENV
    valueFrom:
      configMapKeyRef:
        name: app-config
        key: NODE_ENV
```

Now your container reads configuration dynamically. No rebuild needed.

---

### What About Sensitive Data?

This is where Secrets come in. ConfigMaps are not secure. They are stored in plain text.

> Secrets are designed for sensitive data like passwords and API keys.

---

### What Is a Secret?

A Secret stores sensitive information such as:

- database passwords
- API tokens
- SSH keys

They are base64 encoded (not encrypted by default, but can be secured further).

---

### Example Secret

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: app-secret
type: Opaque
data:
  DB_PASSWORD: cGFzc3dvcmQ=
```

Here, `type: Opaque` means this is a default, general-purpose Secret that holds arbitrary user-defined data. 

Kubernetes supports multiple `type` values depending on what you are storing:

- **`Opaque`**: The default. Used for arbitrary key-value pairs (like our database password).
- **`kubernetes.io/tls`**: Designed specifically for storing TLS certificates and private keys.
- **`kubernetes.io/dockerconfigjson`**: Used to store credentials for pulling images from private container registries.
- **`kubernetes.io/basic-auth`**: Stores credentials for basic authentication (username and password).
- **`kubernetes.io/ssh-auth`**: Stores SSH credentials.

> **Note on Base64:** Notice the value `cGFzc3dvcmQ=` in the example above. This is simply the word `password` encoded in Base64 (you can test this by running `echo -n "password" | base64` in your terminal). Remember that Base64 encoding is **not encryption**—anyone who can view the Secret can easily decode it!

---

### Using Secrets in a Pod

```yaml
env:
  - name: DB_PASSWORD
    valueFrom:
      secretKeyRef:
        name: app-secret
        key: DB_PASSWORD
```

Now sensitive data is injected at runtime.

---

### ConfigMaps vs Secrets

ConfigMaps

- non-sensitive data
- plain text
- easy to manage

Secrets

- sensitive data
- base64 encoded
- can be encrypted at rest

---

### Why This Matters in Real Systems

Separating configuration gives you:

- flexibility across environments
- safer handling of sensitive data
- faster deployments
- cleaner architecture

In production systems:

- configs change often
- code changes less frequently

This separation is critical.

### The Real Philosophy

Kubernetes enforces an important principle:

> Build once, configure everywhere.

Instead of:
- rebuilding images for each environment

You:
- build one image
- inject different configs

---

### Common Mistakes Beginners Make

- putting secrets inside ConfigMaps
- hardcoding credentials in code
- rebuilding images for config changes
- not using environment-based configs

Avoiding these early saves a lot of pain later.

---

### Final Takeaway

ConfigMaps and Secrets are fundamental to building flexible Kubernetes systems.

They allow you to:

- separate configuration from code
- safely manage sensitive data
- reuse containers across environments
- reduce deployment complexity

They are a key step toward production-ready architecture.

---

### In the Next Blog

Now that we understand how configuration works, the next challenge is:

How does external traffic reach our application?

In the next article, we’ll explore Kubernetes Ingress, and how it controls traffic entering the cluster.
