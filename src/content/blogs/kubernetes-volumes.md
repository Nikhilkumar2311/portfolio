---
title: Why Containers Lose Data (And How Kubernetes Volumes Fix It)
slug: kubernetes-volumes
excerpt: Containers are ephemeral, which means data can disappear at any time. Kubernetes Volumes and persistent storage solve this problem by separating data from container lifecycle.
coverImage: /blogs/kubernetes-volumes.webp
tags:
  - Kubernetes
  - Learning
publishedAt: 2026-04-13
---

## Why Containers Lose Data (And How Kubernetes Volumes Fix It)

When I first ran a database inside a Kubernetes Pod, everything worked perfectly.

Until the Pod restarted.

And all my data was gone.

> That’s when I learned one of the most important truths in Kubernetes:

Containers are temporary. Data should not be.

---

### The Core Problem: Containers Are Ephemeral

Pods in Kubernetes:

- can be deleted anytime  
- can restart on failure  
- can move between nodes  

If your data is stored inside the container:

- it disappears when the Pod is replaced  

This makes containers **stateless by design**.

---

### What Is a Volume?

A **Volume** is a storage mechanism that exists **outside the container** but is attached to it.

It allows containers to:

- store data persistently  
- share data between containers in the same Pod  

Unlike container storage, volumes survive container restarts.

---

### Types of Volumes (Basic Level)

Kubernetes provides multiple volume types:

**emptyDir**
- temporary storage  
- deleted when Pod is removed  

**hostPath**
- uses node’s filesystem  
- not recommended for production  

These are useful, but not enough for real-world systems.

---

### The Real Solution: Persistent Storage

To truly persist data across Pods, Kubernetes introduces:

- PersistentVolume (PV)  
- PersistentVolumeClaim (PVC)  

---

### What Is a PersistentVolume (PV)?

A **PersistentVolume (PV)** represents actual storage in the cluster.

It could be:

- cloud storage (AWS EBS, GCP disk)  
- NFS  
- local storage  

> PV is created and managed by the cluster (or admin).

Think of PV as:

👉 “Actual storage resource”

---

### What Is a PersistentVolumeClaim (PVC)?

A **PersistentVolumeClaim (PVC)** is a request for storage.

It defines:

- how much storage is needed  
- access mode (read/write)  

> PVC is created by the developer/application.

Think of PVC as:

👉 “Request for storage”

---

### PV and PVC Relationship

This is the most important concept:

> PVC requests → PV fulfills

Flow:

1. You create PVC  
2. Kubernetes finds matching PV  
3. PVC gets bound to PV  
4. Pod uses PVC  

This decouples:

- infrastructure (PV)  
- application needs (PVC)

---

### Example PVC

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: app-storage
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 1Gi
```

This says:
- give me 1GB storage
- I need read/write access

---

### Using PVC in a Pod

```yaml
volumes:
  - name: storage
    persistentVolumeClaim:
      claimName: app-storage

containers:
  - name: app
    image: nginx
    volumeMounts:
      - mountPath: /data
        name: storage
```

Now your data is stored outside the Pod lifecycle.

---

### What Is a StorageClass?

Managing PVs manually is not scalable. This is where StorageClass comes in.

A StorageClass defines:
- how storage should be created
- which provisioner to use

Example:
- fast SSD
- standard disk

> It enables dynamic provisioning.

---

### Dynamic Provisioning (Important Concept)

Without StorageClass:
- admin must create PV manually

With StorageClass:
- PV is created automatically when PVC is created

Flow:
PVC → StorageClass → PV created automatically

This is how modern cloud systems work.

---

### Access Modes Explained

PVC supports different access types:

ReadWriteOnce (RWO)
- mounted by one node only

ReadOnlyMany (ROX)
- multiple nodes (read-only)

ReadWriteMany (RWX)
- multiple nodes (read/write)

Choosing the right mode is important.

---

### Why This Matters in Real Systems

Without proper storage:
- databases lose data
- logs disappear
- stateful apps break

With Kubernetes storage:
- data persists across Pod restarts
- applications become reliable
- scaling becomes safe

---

### The Real Philosophy

Kubernetes enforces:

> Separate compute from storage.

Pods:
- temporary
- replaceable

Storage:
- persistent
- independent

---

### Common Mistakes Beginners Make
- storing data inside containers
- not using PVC for databases
- misunderstanding PV vs PVC
- ignoring StorageClass

---

### Final Takeaway

Kubernetes storage system provides:
- data persistence
- abstraction between app and infrastructure
- scalability through dynamic provisioning
- flexibility across environments

Understanding storage is essential for running stateful applications in Kubernetes.

---

### In the Next Blog

Now that we understand how Kubernetes handles storage, the next step is:

How do we organize resources inside a cluster?

In the next article, we’ll explore Kubernetes Namespaces, and how they help manage environments and teams.