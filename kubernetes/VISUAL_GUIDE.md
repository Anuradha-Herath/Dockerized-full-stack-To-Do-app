# 🎯 Kubernetes Setup - Visual Guide

## 📊 What's Been Set Up

### **Before You Started**
```
Your Todo Application
├── Backend (Node.js/Express)
├── Frontend (React)
└── Database (MongoDB)

Running on: Docker Compose
Status: Works with docker-compose up
```

### **After This Setup**
```
Your Todo Application  
├── Backend (Node.js/Express) - 2 replicas, auto-scaling
├── Frontend (React) - 2 replicas, auto-scaling  
└── Database (MongoDB) - persistent storage

Running on: Kubernetes Cluster (Minikube locally, any cloud platform production)
Status: Enterprise-grade deployment with auto-scaling and high availability
```

---

## 🔄 Data Flow Diagram

```
┌─────────────┐
│  User Browser│
└──────┬──────┘
       │ HTTP Request
       │ (port 3000)
       ▼
┌──────────────────────────┐
│  Frontend LoadBalancer   │
│  (Port: 80 → 3000)       │
│  Type: LoadBalancer      │
└──────────┬───────────────┘
           │
      ┌────┴─────┐
      │ 2 Pods   │
      │(replicas)│
      └────┬─────┘
           │ HTTP Request  
           │ (port 5000)
           ▼
┌──────────────────────────┐
│  Backend Service (API)   │
│  (Port: 5000)            │
│  Type: ClusterIP         │
└──────────┬───────────────┘
           │
      ┌────┴─────┐
      │ 2 Pods   │
      │(replicas)│
      └────┬─────┘
           │ MongoDB Protocol
           │ (port 27017)
           ▼
┌──────────────────────────┐
│  MongoDB Service         │
│  (Port: 27017)           │
│  Type: ClusterIP         │
└──────────┬───────────────┘
           │
           ▼
      ┌─────────┐
      │1 Pod    │
      │Database │
      └─────────┘
           │
           ▼
    ┌────────────────┐
    │ Storage (PVC)  │
    │ 5GB Data       │
    │ 1GB Config     │
    └────────────────┘
```

---

## 📦 Services Breakdown

### **Frontend Service (LoadBalancer)**
```
┌─────────────────────────────────┐
│ Service: todo-frontend          │
│ Type: LoadBalancer              │
│ External Port: 80               │
│ Internal Port: 3000             │
├─────────────────────────────────┤
│ Deployment: todo-frontend       │
│ Replicas: 2 (auto-scale 2-5)   │
│ Image: anuroxx/todo-frontend    │
├─────────────────────────────────┤
│ Probes:                         │
│ ✓ Liveness (30s initial)       │
│ ✓ Readiness (10s initial)      │
├─────────────────────────────────┤
│ Resources:                      │
│ Request: 50m CPU, 64Mi Memory  │
│ Limit: 200m CPU, 256Mi Memory  │
└─────────────────────────────────┘
```

### **Backend Service (ClusterIP)**
```
┌─────────────────────────────────┐
│ Service: todo-backend           │
│ Type: ClusterIP                 │
│ Port: 5000                      │
│ Session Affinity: Enabled       │
├─────────────────────────────────┤
│ Deployment: todo-backend        │
│ Replicas: 2 (auto-scale 2-5)   │
│ Image: anuroxx/todo-backend     │
├─────────────────────────────────┤
│ Environment Variables:          │
│ ✓ NODE_ENV: production          │
│ ✓ MONGODB_URI                   │
│ ✓ JWT_SECRET                    │
│ ✓ GOOGLE_CLIENT_*               │
├─────────────────────────────────┤
│ Probes:                         │
│ ✓ Liveness: /health (30s)      │
│ ✓ Readiness: /health (10s)     │
├─────────────────────────────────┤
│ Resources:                      │
│ Request: 100m CPU, 128Mi Memory│
│ Limit: 250m CPU, 256Mi Memory  │
└─────────────────────────────────┘
```

### **MongoDB Service (ClusterIP)**
```
┌─────────────────────────────────┐
│ Service: todo-mongodb           │
│ Type: ClusterIP                 │
│ Port: 27017                     │
├─────────────────────────────────┤
│ Deployment: todo-mongodb        │
│ Replicas: 1                     │
│ Image: mongo:7-jammy            │
├─────────────────────────────────┤
│ Storage:                        │
│ ✓ Data: 5GB PVC                │
│ ✓ Config: 1GB PVC              │
├─────────────────────────────────┤
│ Probes:                         │
│ ✓ Liveness: mongosh (30s)      │
│ ✓ Readiness: mongosh (10s)     │
├─────────────────────────────────┤
│ Resources:                      │
│ Request: 100m CPU, 256Mi Memory│
│ Limit: 500m CPU, 512Mi Memory  │
└─────────────────────────────────┘
```

---

## 🔧 Configuration Sources

### **ConfigMaps**
```
┌────────────────────────────────────┐
│ ConfigMap: todo-backend-config     │
├────────────────────────────────────┤
│ NODE_ENV: production               │
│ MONGODB_DATABASE: todoapp          │
│ MONGODB_HOST: todo-mongodb         │
│ MONGODB_URI: mongodb://...         │
│ PORT: 5000                         │
└────────────────────────────────────┘

┌────────────────────────────────────┐
│ ConfigMap: todo-frontend-config    │
├────────────────────────────────────┤
│ VITE_API_URL: http://backend:5000  │
└────────────────────────────────────┘
```

### **Secrets** (Encrypted)
```
┌────────────────────────────────────┐
│ Secret: todo-backend-secrets       │
├────────────────────────────────────┤
│ MONGODB_PASSWORD: ••••••••••       │
│ JWT_SECRET: ••••••••••             │
│ GOOGLE_CLIENT_ID: ••••••••••       │
│ GOOGLE_CLIENT_SECRET: ••••••••••   │
└────────────────────────────────────┘

┌────────────────────────────────────┐
│ Secret: todo-mongodb-secrets       │
├────────────────────────────────────┤
│ MONGO_ROOT_USERNAME: ••••••••••    │
│ MONGO_ROOT_PASSWORD: ••••••••••    │
└────────────────────────────────────┘
```

---

## 📈 Auto-Scaling Rules

### **Backend Auto-Scaling**
```
Metric 1: CPU Utilization
├─ Target: 70%
├─ If exceeds: Scale up (add pod)
└─ If below: Scale down (remove pod)

Metric 2: Memory Utilization  
├─ Target: 80%
├─ If exceeds: Scale up (add pod)
└─ If below: Scale down (remove pod)

Scaling Limits:
├─ Minimum Replicas: 2
└─ Maximum Replicas: 5
```

### **Frontend Auto-Scaling**
```
Metric 1: CPU Utilization
├─ Target: 70%
├─ If exceeds: Scale up (add pod)
└─ If below: Scale down (remove pod)

Metric 2: Memory Utilization
├─ Target: 80%
├─ If exceeds: Scale up (add pod)
└─ If below: Scale down (remove pod)

Scaling Limits:
├─ Minimum Replicas: 2
└─ Maximum Replicas: 5
```

---

## 🔍 Health Check Flow

### **Pod Startup Sequence**
```
Pod Created
│
├─ Container Started
│  │
│  ├─ Application Initializing...
│  │
│  ├─ Readiness Probe (after 10s)
│  │  └─ Ready? → YES → Traffic Allowed
│  │              NO → Retry (5s intervals)
│  │
│  └─ Liveness Probe (after 30s)
│     └─ Alive? → YES → Keep Running
│                 NO → Restart Pod

Traffic can start as soon as readiness probe passes!
```

---

## 📊 Resource Management

### **CPU and Memory Allocation**
```
┌──────────────────────────────────────────┐
│ Frontend Pod (2 Replicas)                │
├──────────────────────────────────────────┤
│ Requests (minimum guaranteed):           │
│   CPU: 50m × 2 = 100m                   │
│   Memory: 64Mi × 2 = 128Mi              │
│                                          │
│ Limits (maximum allowed):                │
│   CPU: 200m × 2 = 400m                  │
│   Memory: 256Mi × 2 = 512Mi             │
└──────────────────────────────────────────┘

┌──────────────────────────────────────────┐
│ Backend Pod (2 Replicas)                 │
├──────────────────────────────────────────┤
│ Requests (minimum guaranteed):           │
│   CPU: 100m × 2 = 200m                  │
│   Memory: 128Mi × 2 = 256Mi             │
│                                          │
│ Limits (maximum allowed):                │
│   CPU: 250m × 2 = 500m                  │
│   Memory: 256Mi × 2 = 512Mi             │
└──────────────────────────────────────────┘

┌──────────────────────────────────────────┐
│ MongoDB Pod (1 Replica)                  │
├──────────────────────────────────────────┤
│ Requests (minimum guaranteed):           │
│   CPU: 100m                              │
│   Memory: 256Mi                          │
│                                          │
│ Limits (maximum allowed):                │
│   CPU: 500m                              │
│   Memory: 512Mi                          │
└──────────────────────────────────────────┘

Total Requested Resources:
├─ CPU: 100m + 200m + 100m = 400m
└─ Memory: 128Mi + 256Mi + 256Mi = 640Mi
```

---

## 🌐 Network Topology

### **Kubernetes Network (Internal DNS)**
```
External World
     │ (Port 80)
     ▼
┌─────────────────────┐
│ Frontend Service    │
│ DNS: todo-frontend  │
│ Port: 80 → 3000     │
└────────┬────────────┘
         │ (DNS: todo-frontend.todo-app.svc.cluster.local)
         │
    ┌────┴─────────────────────┐
    │ Frontend Pods (2x)        │
    │ Can reach:                │
    │ - Backend at: todo-backend│
    │ - MongoDB at: todo-mongodb│
    └────┬─────────────────────┘
         │ (Port 5000)
         ▼
┌────────────────────────┐
│ Backend Service        │
│ DNS: todo-backend      │
│ Port: 5000             │
└────────┬───────────────┘
         │ (DNS: todo-backend.todo-app.svc.cluster.local)
         │
    ┌────┴────────────────────┐
    │ Backend Pods (2x)       │
    │ Can reach:              │
    │ - MongoDB at: todo-mongodb│
    └────┬───────────────────┘
         │ (Port 27017)
         ▼
┌────────────────────────┐
│ MongoDB Service        │
│ DNS: todo-mongodb      │
│ Port: 27017            │
└────────┬───────────────┘
         │ (DNS: todo-mongodb.todo-app.svc.cluster.local)
         │
    ┌────┴──────────────┐
    │ MongoDB Pod (1x)  │
    └───────────────────┘
```

---

## 🚀 Deployment Process

### **Step-by-Step Sequence**
```
1. kubectl apply -k kubernetes
   │
   ├─ Creates: Namespace (todo-app)
   ├─ Creates: ConfigMaps
   ├─ Creates: Secrets
   ├─ Creates: PersistentVolumeClaims
   │
   └─ Creates Resources in Order:
      │
      ├─ MongoDB (Database first!)
      │  ├─ Pod starting...
      │  ├─ Readiness probe waiting...
      │  └─ Ready! (Accept connections)
      │
      ├─ Backend (Waits for MongoDB)
      │  ├─ Pod starting...
      │  ├─ Connecting to MongoDB...
      │  ├─ Readiness probe waiting...
      │  └─ Ready! (Accept requests)
      │
      └─ Frontend (Waits for Backend)
         ├─ Pod starting...
         ├─ Readiness probe waiting...
         └─ Ready! (Accept traffic)

Total Time: 2-3 minutes typically
```

---

## 📊 Pod Lifecycle

### **What Happens at Each Phase**
```
┌────────────────┐
│ Pod Pending    │ - Image downloading
│ (30-60 seconds)│ - Volume mounting
└────────┬───────┘
         │
┌────────▼───────────┐
│ Container Creating │ - Image being pulled
│ (30-60 seconds)    │ - Container starting
└────────┬───────────┘
         │
┌────────▼──────────────────────┐
│ Running - Readiness False      │ - App starting
│ (0-10 seconds)                 │ - Readiness checks: FAIL
│                                 │ - NO TRAFFIC yet
└────────┬──────────────────────┘
         │
┌────────▼──────────────────────┐
│ Running - Readiness True       │ - App ready
│ (after readiness passes)       │ - Traffic ALLOWED
│                                 │ - Liveness checks: OK
│                                 │ - Ready for requests
└────────────────────────────────┘
```

---

## 🛠️ Common Operations Timeline

### **Scaling Up (Add More Pods)**
```
Current: 2 replicas
Action: Scale to 4 replicas
Timeline:
├─ 0s: kubectl scale command received
├─ 1s: 2 new pods created
├─ 5s: Containers starting
├─ 10s: Readiness checks passing
└─ 15s: New pods accepting traffic

Result: 2 + 2 = 4 total pods
```

### **Rolling Update (New Image)**
```
Current: 2 pods with v1 image
Action: Update to v2 image
Timeline:
├─ 0s: Update command received
├─ 5s: Old pod #1 terminating
├─ 10s: New pod #1 starting with v2
├─ 30s: New pod #1 ready
├─ 35s: Old pod #2 terminating
├─ 40s: New pod #2 starting with v2
├─ 60s: New pod #2 ready
└─ 65s: Complete! All running v2

Result: Zero downtime! v1 → v2
```

---

## 📈 Monitoring Points

### **What to Watch**
```
Cluster Health:
├─ Node Status: Ready?
├─ Available Resources
└─ Pod Count

Pod Health:
├─ Status: Running?
├─ Restarts: 0?
├─ Ready Condition: True?
└─ Age: How long running?

Service Health:
├─ Endpoints: Active?
├─ Traffic Flow: Working?
└─ Response Time: Acceptable?

Database Health:
├─ Connection: Successful?
├─ Storage: Used vs Available
├─ Backup Status: Current?
└─ Performance: Queries fast?
```

---

**This setup provides enterprise-grade reliability and scalability! 🎉**
