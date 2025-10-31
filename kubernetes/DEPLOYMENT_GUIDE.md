# 🚀 Kubernetes Deployment Guide

This guide will help you deploy the Todo Application to Kubernetes.

## 📋 Prerequisites

### 1. **Install Kubernetes Tools**

#### On Windows (PowerShell):

```powershell
# Install Minikube for local development
# Download from: https://github.com/kubernetes/minikube/releases
# Or use chocolatey if installed: choco install minikube

# kubectl is already installed (you have v1.34.1)

# Verify installations
kubectl version --client
minikube version
```

### 2. **Start a Local Kubernetes Cluster**

```powershell
# Using Minikube
minikube start --cpus=4 --memory=4096 --driver=docker

# Check cluster status
kubectl cluster-info
kubectl get nodes

# Access dashboard (optional)
minikube dashboard
```

### 3. **Verify Cluster Connection**

```powershell
kubectl get nodes
kubectl get namespaces
```

---

## 📦 Kubernetes Manifests Overview

| File | Purpose |
|------|---------|
| `namespace.yaml` | Creates isolated `todo-app` namespace |
| `configmap.yaml` | Non-sensitive configuration (API URLs, database names) |
| `secrets.yaml` | Sensitive data (passwords, JWT secrets, API keys) |
| `mongodb-pvc.yaml` | Persistent volumes for MongoDB data |
| `mongodb-deployment.yaml` | MongoDB database deployment |
| `mongodb-service.yaml` | Internal service for MongoDB |
| `backend-deployment.yaml` | Backend API deployment (2 replicas) |
| `backend-service.yaml` | Internal service for backend |
| `backend-hpa.yaml` | Auto-scaling rules for backend |
| `frontend-deployment.yaml` | Frontend React app deployment (2 replicas) |
| `frontend-service.yaml` | LoadBalancer service for frontend |
| `frontend-hpa.yaml` | Auto-scaling rules for frontend |
| `ingress.yaml` | HTTP routing (optional) |
| `kustomization.yaml` | Manages all resources together |

---

## 🚀 Deployment Steps

### Step 1: Update Configuration Files

**Edit `secrets.yaml`** to use your actual values:

```bash
# Open kubernetes/secrets.yaml and update:
GOOGLE_CLIENT_ID: "your-actual-google-client-id"
GOOGLE_CLIENT_SECRET: "your-actual-google-client-secret"
JWT_SECRET: "your-super-secret-key"
```

### Step 2: Deploy to Kubernetes

#### Option A: Deploy All at Once (Recommended)

```powershell
# Apply all manifests using kustomization
kubectl apply -k "kubernetes"

# Verify deployment
kubectl get all -n todo-app
```

#### Option B: Deploy Step by Step

```powershell
# 1. Create namespace
kubectl apply -f kubernetes/namespace.yaml

# 2. Create ConfigMaps and Secrets
kubectl apply -f kubernetes/configmap.yaml
kubectl apply -f kubernetes/secrets.yaml

# 3. Create MongoDB
kubectl apply -f kubernetes/mongodb-pvc.yaml
kubectl apply -f kubernetes/mongodb-deployment.yaml
kubectl apply -f kubernetes/mongodb-service.yaml

# 4. Create Backend
kubectl apply -f kubernetes/backend-deployment.yaml
kubectl apply -f kubernetes/backend-service.yaml
kubectl apply -f kubernetes/backend-hpa.yaml

# 5. Create Frontend
kubectl apply -f kubernetes/frontend-deployment.yaml
kubectl apply -f kubernetes/frontend-service.yaml
kubectl apply -f kubernetes/frontend-hpa.yaml
```

### Step 3: Check Deployment Status

```powershell
# Check all resources in todo-app namespace
kubectl get all -n todo-app

# Check pod status
kubectl get pods -n todo-app

# Check if pods are running
kubectl get pods -n todo-app -w  # -w for watch mode

# View pod logs
kubectl logs -n todo-app -l app=todo-backend
kubectl logs -n todo-app -l app=todo-frontend
kubectl logs -n todo-app -l app=todo-mongodb
```

### Step 4: Access the Application

```powershell
# Get service information
kubectl get services -n todo-app

# For frontend (LoadBalancer service)
kubectl get svc todo-frontend -n todo-app

# Port-forward to access locally (if using Minikube)
kubectl port-forward -n todo-app svc/todo-frontend 3000:80

# Then open: http://localhost:3000
```

---

## 🔍 Useful Commands

```powershell
# Get pods status
kubectl get pods -n todo-app

# Get detailed pod info
kubectl describe pod <pod-name> -n todo-app

# View logs from a specific pod
kubectl logs <pod-name> -n todo-app

# View logs from a deployment
kubectl logs -n todo-app -l app=todo-backend --tail=100

# Execute command inside pod
kubectl exec -it <pod-name> -n todo-app -- sh

# Scale deployment
kubectl scale deployment todo-backend --replicas=3 -n todo-app

# Update image
kubectl set image deployment/todo-backend todo-backend=anuroxx/todo-app-backend:v2 -n todo-app

# Check events
kubectl get events -n todo-app

# Delete entire deployment
kubectl delete namespace todo-app
```

---

## 🔧 Troubleshooting

### 1. **Pods are stuck in Pending state**

```powershell
# Check resources available
kubectl top nodes

# Check pod events
kubectl describe pod <pod-name> -n todo-app

# Check storage classes
kubectl get storageclass
```

### 2. **MongoDB connection issues**

```powershell
# Check MongoDB logs
kubectl logs -n todo-app -l app=todo-mongodb

# Verify service
kubectl get svc todo-mongodb -n todo-app

# Test connection from backend pod
kubectl exec -it <backend-pod> -n todo-app -- mongosh mongodb://todo-mongodb:27017/todoapp
```

### 3. **Backend can't connect to MongoDB**

```powershell
# Check environment variables
kubectl exec -it <backend-pod> -n todo-app -- env | grep MONGODB

# Check network connectivity
kubectl exec -it <backend-pod> -n todo-app -- wget http://todo-mongodb:27017
```

### 4. **Frontend can't connect to backend**

```powershell
# Check frontend logs
kubectl logs -n todo-app -l app=todo-frontend

# Check backend service
kubectl get svc todo-backend -n todo-app

# Test from frontend pod
kubectl exec -it <frontend-pod> -n todo-app -- wget http://todo-backend:5000/health
```

---

## 📊 Monitoring and Management

### View Pod Metrics (requires metrics-server)

```powershell
# Install metrics-server (if not present)
kubectl apply -f https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml

# View pod resource usage
kubectl top pods -n todo-app

# View node resource usage
kubectl top nodes
```

### Check Horizontal Pod Autoscaler Status

```powershell
kubectl get hpa -n todo-app
kubectl describe hpa todo-backend-hpa -n todo-app
```

---

## 🔐 Security Best Practices

1. **Update Secrets**: Edit `secrets.yaml` with real values before deploying to production
2. **Use RBAC**: Create service accounts and roles for applications
3. **Network Policies**: Restrict traffic between pods
4. **Resource Limits**: Already set in deployments
5. **Private Registry**: Use private Docker registry for production

---

## 🌐 Cloud Deployment

### Deploy to Azure Kubernetes Service (AKS)

```powershell
# Create AKS cluster
az aks create --resource-group myResourceGroup --name myAKSCluster --node-count 3

# Get credentials
az aks get-credentials --resource-group myResourceGroup --name myAKSCluster

# Deploy using same commands
kubectl apply -k kubernetes
```

### Deploy to AWS EKS

```bash
# Create cluster using eksctl
eksctl create cluster --name todo-app --region us-east-1

# Deploy
kubectl apply -k kubernetes
```

### Deploy to Google Cloud GKE

```bash
# Create cluster
gcloud container clusters create todo-app --zone us-central1-a

# Deploy
kubectl apply -k kubernetes
```

---

## 📈 Next Steps

1. ✅ Set up local Kubernetes cluster (Minikube or Docker Desktop)
2. ✅ Update secrets with real values
3. ✅ Deploy manifests to cluster
4. ✅ Verify all pods are running
5. ✅ Test application access
6. ✅ Set up monitoring and logging
7. ✅ Configure CI/CD pipeline for automated deployments

---

## 📚 Additional Resources

- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [Minikube Documentation](https://minikube.sigs.k8s.io/)
- [Kubectl Cheat Sheet](https://kubernetes.io/docs/reference/kubectl/cheatsheet/)
- [Docker to Kubernetes Guide](https://docs.docker.com/get-started/kube-overview/)

---

## 💡 Tips

- Use `kubectl config current-context` to see which cluster you're connected to
- Use `minikube tunnel` to access LoadBalancer services locally
- Use `minikube delete` to clean up and start fresh
- Keep secrets in a separate vault system for production
- Always test deployments locally first before cloud deployment
