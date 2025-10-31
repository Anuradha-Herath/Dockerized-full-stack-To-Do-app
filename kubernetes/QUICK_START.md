# 🚀 Quick Start Kubernetes Deployment Commands

## 📋 Prerequisites Checklist

- [ ] kubectl installed (you have: v1.34.1)
- [ ] Docker installed and running
- [ ] Minikube installed (download from: https://github.com/kubernetes/minikube/releases)
- [ ] 4+ GB RAM available for Minikube

---

## 🔧 Installation Steps (Run in PowerShell)

### Step 1: Download and Install Minikube

**Option A: Direct Download**
```powershell
# Download latest Minikube from GitHub
# https://github.com/kubernetes/minikube/releases
# Look for: minikube-windows-amd64.exe

# Move to a folder in PATH (e.g., C:\Program Files or add to PATH)
```

**Option B: Using Scoop (if installed)**
```powershell
scoop install minikube
```

### Step 2: Start Minikube Cluster

```powershell
# Start with recommended settings
minikube start --cpus=4 --memory=4096 --driver=docker

# Wait for it to initialize (3-5 minutes)

# Verify it's running
minikube status
kubectl cluster-info
```

### Step 3: Verify Setup

```powershell
# Check cluster info
kubectl get nodes
kubectl get namespaces

# You should see something like:
# NAME       STATUS   ROLES           AGE   VERSION
# minikube   Ready    control-plane   10s   v1.XX.X
```

---

## 🎯 Deploy Your Todo App

### Step 1: Update Secrets (⚠️ IMPORTANT)

```powershell
# Edit the secrets file
code kubernetes/secrets.yaml

# Update with your actual values:
# GOOGLE_CLIENT_ID: your-google-client-id
# GOOGLE_CLIENT_SECRET: your-google-client-secret
# JWT_SECRET: your-super-secret-key
```

### Step 2: Deploy All Resources

```powershell
# Deploy using Kustomization (easiest)
kubectl apply -k kubernetes

# Wait a moment for resources to be created
Start-Sleep -Seconds 5

# Check deployment status
kubectl get all -n todo-app
```

### Step 3: Wait for Pods to Be Ready

```powershell
# Watch pods starting up
kubectl get pods -n todo-app -w

# Exit watch mode with Ctrl+C

# Check if all pods are running
kubectl get pods -n todo-app

# Should show:
# NAME                                READY   STATUS    RESTARTS   AGE
# todo-backend-xxxxxxxxxx-xxxxx       1/1     Running   0          2m
# todo-frontend-xxxxxxxxxx-xxxxx      1/1     Running   0          2m
# todo-mongodb-xxxxxxxxxx-xxxxx       1/1     Running   0          3m
```

### Step 4: Check Pod Logs

```powershell
# Check backend logs
kubectl logs -n todo-app -l app=todo-backend --tail=50

# Check frontend logs
kubectl logs -n todo-app -l app=todo-frontend --tail=50

# Check MongoDB logs
kubectl logs -n todo-app -l app=todo-mongodb --tail=50
```

---

## 🌐 Access Your Application

### Using Port-Forward (Simplest for Local)

```powershell
# Forward local port 3000 to frontend service
kubectl port-forward -n todo-app svc/todo-frontend 3000:80

# Keep this terminal open, then open:
# http://localhost:3000
```

### Using Minikube Service

```powershell
# Let Minikube open the app directly
minikube service todo-frontend -n todo-app

# This automatically opens the app in your default browser
```

### Check Service Endpoints

```powershell
# Get service information
kubectl get services -n todo-app

# Get detailed info
kubectl describe svc todo-frontend -n todo-app
```

---

## 🐛 Troubleshooting

### Pods are stuck in Pending

```powershell
# Check resources
kubectl top nodes

# Describe pod for details
kubectl describe pod <pod-name> -n todo-app

# Check events
kubectl get events -n todo-app --sort-by='.lastTimestamp'
```

### Backend can't connect to MongoDB

```powershell
# Check if MongoDB pod is running
kubectl get pod -n todo-app -l app=todo-mongodb

# Check MongoDB logs
kubectl logs -n todo-app -l app=todo-mongodb

# Try connecting manually
kubectl exec -it <mongodb-pod> -n todo-app -- mongosh
```

### Frontend can't connect to Backend

```powershell
# Check backend service
kubectl get svc todo-backend -n todo-app

# Check frontend logs
kubectl logs -n todo-app -l app=todo-frontend

# Test connection from frontend pod
kubectl exec -it <frontend-pod> -n todo-app -- wget http://todo-backend:5000/health
```

### Restart Everything

```powershell
# Delete all resources
kubectl delete namespace todo-app

# Wait a moment
Start-Sleep -Seconds 5

# Redeploy
kubectl apply -k kubernetes
```

---

## 📊 Monitoring

### View Pod Resource Usage

```powershell
# If metrics-server is installed
kubectl top pods -n todo-app
kubectl top nodes
```

### Check Horizontal Pod Autoscaling

```powershell
# View HPA status
kubectl get hpa -n todo-app

# Detailed HPA info
kubectl describe hpa todo-backend-hpa -n todo-app
```

### View Pod Details

```powershell
# Get pod information
kubectl describe pod <pod-name> -n todo-app

# View pod YAML
kubectl get pod <pod-name> -n todo-app -o yaml

# View events
kubectl get events -n todo-app
```

---

## 🛠️ Common Operations

### Scale Deployments

```powershell
# Scale backend to 3 replicas
kubectl scale deployment todo-backend --replicas=3 -n todo-app

# Scale frontend to 4 replicas
kubectl scale deployment todo-frontend --replicas=4 -n todo-app

# Check scaling
kubectl get pods -n todo-app
```

### Update Images

```powershell
# Update backend image
kubectl set image deployment/todo-backend todo-backend=anuroxx/todo-app-backend:v2 -n todo-app

# Update frontend image
kubectl set image deployment/todo-frontend frontend=anuroxx/todo-app-frontend:v2 -n todo-app

# Watch rollout
kubectl rollout status deployment/todo-backend -n todo-app
```

### View Configuration

```powershell
# View ConfigMaps
kubectl get configmap -n todo-app
kubectl describe cm todo-backend-config -n todo-app

# View Secrets (names only, not values)
kubectl get secrets -n todo-app
```

### Execute Commands in Pods

```powershell
# Run bash in a pod
kubectl exec -it <pod-name> -n todo-app -- sh

# Run a specific command
kubectl exec <pod-name> -n todo-app -- ls -la

# Check environment variables
kubectl exec <pod-name> -n todo-app -- env
```

---

## 🧹 Cleanup

### Remove Single Resource

```powershell
# Delete a deployment
kubectl delete deployment todo-backend -n todo-app

# Delete a service
kubectl delete svc todo-frontend -n todo-app
```

### Delete Entire Namespace (Everything)

```powershell
# Delete all resources in namespace
kubectl delete namespace todo-app

# Verify deletion
kubectl get namespaces
```

### Delete Minikube Cluster

```powershell
# Stop Minikube
minikube stop

# Delete Minikube
minikube delete

# This deletes all deployed applications
```

---

## 🌐 Deployment to Cloud

### Azure Kubernetes Service (AKS)

```powershell
# Create resource group
az group create --name todo-rg --location eastus

# Create AKS cluster
az aks create --resource-group todo-rg --name todo-aks --node-count 3

# Get credentials
az aks get-credentials --resource-group todo-rg --name todo-aks

# Deploy
kubectl apply -k kubernetes

# Get service endpoint
kubectl get services -n todo-app
```

### AWS Elastic Kubernetes Service (EKS)

```bash
# Create cluster using eksctl
eksctl create cluster --name todo-app --region us-east-1 --nodes 3

# Deploy
kubectl apply -k kubernetes
```

### Google Cloud GKE

```bash
# Create cluster
gcloud container clusters create todo-app --zone us-central1-a --num-nodes 3

# Deploy
kubectl apply -k kubernetes
```

---

## 📚 File Structure

```
kubernetes/
├── namespace.yaml              # Namespace definition
├── configmap.yaml              # Configuration (non-sensitive)
├── secrets.yaml                # Sensitive data (update before deploying!)
├── mongodb-pvc.yaml            # Database storage
├── mongodb-deployment.yaml      # MongoDB container
├── mongodb-service.yaml         # MongoDB network access
├── backend-deployment.yaml      # Backend API container
├── backend-service.yaml         # Backend network access
├── backend-hpa.yaml            # Backend auto-scaling
├── frontend-deployment.yaml     # Frontend container
├── frontend-service.yaml        # Frontend network access
├── frontend-hpa.yaml           # Frontend auto-scaling
├── ingress.yaml                # HTTP routing (optional)
├── kustomization.yaml          # Master configuration file
├── DEPLOYMENT_GUIDE.md         # Detailed guide
├── setup-k8s.bat               # Windows setup script
├── setup-k8s.sh                # Linux/Mac setup script
└── QUICK_START.md              # This file
```

---

## ✅ Deployment Checklist

- [ ] kubectl installed and working
- [ ] Minikube installed
- [ ] Minikube cluster started
- [ ] secrets.yaml updated with real values
- [ ] Kubernetes manifests created (already done!)
- [ ] Images built and pushed to Docker Hub
- [ ] Deployment command executed: `kubectl apply -k kubernetes`
- [ ] All pods running: `kubectl get pods -n todo-app`
- [ ] Frontend accessible: `http://localhost:3000`
- [ ] Backend health check: `kubectl exec ... /health`
- [ ] MongoDB connected and working

---

## 🆘 Need Help?

```powershell
# Get general help
kubectl help

# Get help for a command
kubectl get help
kubectl apply help

# Check API resources
kubectl api-resources

# Check cluster info
kubectl cluster-info
kubectl cluster-info dump
```

---

**Happy Deploying! 🚀**
