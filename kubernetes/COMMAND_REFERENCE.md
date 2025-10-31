# 🔧 Complete Kubernetes Command Reference

## 🎯 One-Command Quick Deploy

After Minikube is running and secrets are updated:

```powershell
kubectl apply -k kubernetes && kubectl get pods -n todo-app -w
```

---

## 📋 Table of Contents

1. [Cluster Management](#cluster-management)
2. [Deployment](#deployment)
3. [Monitoring & Status](#monitoring--status)
4. [Logs & Debugging](#logs--debugging)
5. [Scaling](#scaling)
6. [Updates & Rollouts](#updates--rollouts)
7. [Cleanup](#cleanup)
8. [Troubleshooting](#troubleshooting)

---

## 🖥️ Cluster Management

### Start Minikube
```powershell
# Basic startup
minikube start

# With optimal settings for this app
minikube start --cpus=4 --memory=4096 --driver=docker

# Check status
minikube status

# Get cluster info
kubectl cluster-info
```

### Stop/Delete Cluster
```powershell
# Stop without deleting
minikube stop

# Delete cluster completely
minikube delete

# Restart
minikube restart
```

### Access Minikube Dashboard
```powershell
minikube dashboard

# This opens a web UI to manage the cluster
```

---

## 📦 Deployment

### Deploy All Resources
```powershell
# Deploy everything at once (recommended)
kubectl apply -k kubernetes

# Alternative: Deploy step by step
kubectl apply -f kubernetes/namespace.yaml
kubectl apply -f kubernetes/configmap.yaml
kubectl apply -f kubernetes/secrets.yaml
kubectl apply -f kubernetes/mongodb-pvc.yaml
kubectl apply -f kubernetes/mongodb-deployment.yaml
kubectl apply -f kubernetes/mongodb-service.yaml
kubectl apply -f kubernetes/backend-deployment.yaml
kubectl apply -f kubernetes/backend-service.yaml
kubectl apply -f kubernetes/frontend-deployment.yaml
kubectl apply -f kubernetes/frontend-service.yaml
```

### Check Deployment Status
```powershell
# Get all resources
kubectl get all -n todo-app

# Get only deployments
kubectl get deployments -n todo-app

# Get services
kubectl get services -n todo-app

# Get pods
kubectl get pods -n todo-app
```

---

## 📊 Monitoring & Status

### View Pod Status
```powershell
# List all pods
kubectl get pods -n todo-app

# Get detailed info
kubectl get pods -n todo-app -o wide

# Watch real-time updates
kubectl get pods -n todo-app -w

# Exit watch mode: Ctrl+C
```

### Pod Details
```powershell
# Describe a specific pod
kubectl describe pod <pod-name> -n todo-app

# Get pod YAML config
kubectl get pod <pod-name> -n todo-app -o yaml

# Get pod JSON
kubectl get pod <pod-name> -n todo-app -o json
```

### Service Status
```powershell
# List services
kubectl get services -n todo-app

# Detailed service info
kubectl describe service <service-name> -n todo-app

# Get service endpoints
kubectl get endpoints -n todo-app
```

### Resource Usage
```powershell
# Pod resource usage
kubectl top pods -n todo-app

# Node resource usage
kubectl top nodes

# Requires metrics-server to be installed
```

### Configuration
```powershell
# View ConfigMaps
kubectl get configmaps -n todo-app
kubectl describe cm todo-backend-config -n todo-app

# View Secrets (names only, not values)
kubectl get secrets -n todo-app
kubectl describe secret todo-backend-secrets -n todo-app

# View Secret values (use carefully!)
kubectl get secret todo-backend-secrets -n todo-app -o jsonpath='{.data.JWT_SECRET}' | base64 -d
```

---

## 📝 Logs & Debugging

### View Logs
```powershell
# Last 50 lines of logs
kubectl logs <pod-name> -n todo-app --tail=50

# Follow logs in real-time
kubectl logs <pod-name> -n todo-app -f

# Logs from all backend pods
kubectl logs -n todo-app -l app=todo-backend

# Logs with timestamps
kubectl logs <pod-name> -n todo-app --timestamps=true

# Previous pod logs (if crashed and restarted)
kubectl logs <pod-name> -n todo-app --previous
```

### Logs by Service
```powershell
# Backend logs
kubectl logs -n todo-app -l app=todo-backend --tail=100

# Frontend logs
kubectl logs -n todo-app -l app=todo-frontend --tail=100

# MongoDB logs
kubectl logs -n todo-app -l app=todo-mongodb --tail=100

# All pods in real-time
kubectl logs -n todo-app -l app=todo-backend -f
```

### Execute Commands in Pod
```powershell
# Open shell in pod
kubectl exec -it <pod-name> -n todo-app -- sh

# Run specific command
kubectl exec <pod-name> -n todo-app -- env

# Check if service is reachable
kubectl exec -it <pod-name> -n todo-app -- wget http://todo-backend:5000

# Check MongoDB connection
kubectl exec -it <mongodb-pod> -n todo-app -- mongosh
```

### Check Events
```powershell
# All events in namespace
kubectl get events -n todo-app

# Events sorted by time
kubectl get events -n todo-app --sort-by='.lastTimestamp'

# Watch events in real-time
kubectl get events -n todo-app -w
```

---

## 📈 Scaling

### Manual Scaling
```powershell
# Scale backend to 3 replicas
kubectl scale deployment todo-backend --replicas=3 -n todo-app

# Scale frontend to 4 replicas
kubectl scale deployment todo-frontend --replicas=4 -n todo-app

# Scale back to 2
kubectl scale deployment todo-backend --replicas=2 -n todo-app
```

### Check Auto-Scaling
```powershell
# View HPA status
kubectl get hpa -n todo-app

# Detailed HPA info
kubectl describe hpa todo-backend-hpa -n todo-app

# Watch HPA in action
kubectl get hpa -n todo-app -w
```

### Pod Affinity
```powershell
# View pod distribution
kubectl get pods -n todo-app -o wide

# See which node each pod is on
kubectl get pods -n todo-app -o custom-columns=NAME:.metadata.name,NODE:.spec.nodeName
```

---

## 🔄 Updates & Rollouts

### Update Image
```powershell
# Update backend image
kubectl set image deployment/todo-backend todo-backend=anuroxx/todo-app-backend:v2 -n todo-app

# Update frontend image
kubectl set image deployment/todo-frontend frontend=anuroxx/todo-app-frontend:v2 -n todo-app
```

### Monitor Rollout
```powershell
# Check rollout status
kubectl rollout status deployment/todo-backend -n todo-app

# Watch rollout progress
kubectl rollout status deployment/todo-backend -n todo-app -w
```

### Rollback to Previous Version
```powershell
# Check rollout history
kubectl rollout history deployment/todo-backend -n todo-app

# Rollback to previous version
kubectl rollout undo deployment/todo-backend -n todo-app

# Rollback to specific revision
kubectl rollout undo deployment/todo-backend --to-revision=1 -n todo-app
```

### Restart Deployment
```powershell
# Restart all pods (useful for configuration changes)
kubectl rollout restart deployment/todo-backend -n todo-app

# Verify restart
kubectl get pods -n todo-app
```

---

## 🧹 Cleanup

### Remove Individual Resources
```powershell
# Delete a pod
kubectl delete pod <pod-name> -n todo-app

# Delete a deployment
kubectl delete deployment todo-backend -n todo-app

# Delete a service
kubectl delete service todo-frontend -n todo-app
```

### Remove Entire Application
```powershell
# Delete everything in namespace
kubectl delete namespace todo-app

# Verify deletion
kubectl get namespaces
```

### Clean Minikube
```powershell
# Delete Minikube cluster
minikube delete

# Clean all Docker images from Minikube
minikube clean-up

# Full reset
minikube delete && minikube start
```

---

## 🆘 Troubleshooting

### Diagnose Pod Issues
```powershell
# Full pod diagnosis
kubectl describe pod <pod-name> -n todo-app

# Check for common issues
# - Status: CrashLoopBackOff → App is crashing
# - Status: ImagePullBackOff → Image not found
# - Status: Pending → Resources unavailable
# - Status: Running but not Ready → Readiness probe failing
```

### Check Readiness/Liveness
```powershell
# View probe results
kubectl describe pod <pod-name> -n todo-app

# Look for "Conditions" section and "Probes" section
# Ready: True = Can receive traffic
# Alive: True = Pod is healthy
```

### Test Connectivity
```powershell
# From frontend pod, test backend
kubectl exec -it <frontend-pod> -n todo-app -- wget http://todo-backend:5000

# From backend pod, test MongoDB
kubectl exec -it <backend-pod> -n todo-app -- mongosh mongodb://todo-mongodb:27017/todoapp

# Check DNS resolution
kubectl exec <pod> -n todo-app -- nslookup todo-backend
```

### Debug MongoDB Connection
```powershell
# Check MongoDB logs
kubectl logs -n todo-app -l app=todo-mongodb

# Check if service exists
kubectl get svc todo-mongodb -n todo-app

# Connect to MongoDB
kubectl exec -it <mongodb-pod> -n todo-app -- mongosh

# Inside mongosh:
# db.adminCommand("ping")
# use todoapp
# db.collection.find()
```

### Debug Backend Connection
```powershell
# Check if service is responding
kubectl exec <pod> -n todo-app -- wget -O- http://todo-backend:5000/health

# Check logs for connection errors
kubectl logs <backend-pod> -n todo-app | grep -i error

# Check environment variables
kubectl exec <backend-pod> -n todo-app -- env | grep MONGO
```

### Resource Issues
```powershell
# Check node resources
kubectl top nodes

# Check pod resource usage
kubectl top pods -n todo-app

# If resources low:
# 1. Scale down pods: kubectl scale deployment todo-backend --replicas=1
# 2. Increase Minikube memory: minikube delete && minikube start --memory=8192
```

---

## 🚀 Common Workflows

### Complete Restart Workflow
```powershell
# 1. Delete deployment
kubectl delete namespace todo-app

# 2. Wait for cleanup
Start-Sleep -Seconds 10

# 3. Redeploy
kubectl apply -k kubernetes

# 4. Monitor
kubectl get pods -n todo-app -w
```

### Update and Verify Workflow
```powershell
# 1. Update ConfigMap or Secrets
code kubernetes/configmap.yaml
kubectl apply -f kubernetes/configmap.yaml

# 2. Restart to pick up changes
kubectl rollout restart deployment/todo-backend -n todo-app

# 3. Verify
kubectl get pods -n todo-app -w
```

### Scale and Monitor Workflow
```powershell
# 1. Scale up
kubectl scale deployment todo-backend --replicas=4 -n todo-app

# 2. Watch scaling progress
kubectl get pods -n todo-app -w

# 3. Check resource usage
kubectl top pods -n todo-app

# 4. Scale back if needed
kubectl scale deployment todo-backend --replicas=2 -n todo-app
```

### Investigate Failure Workflow
```powershell
# 1. Check pod status
kubectl get pods -n todo-app

# 2. If not running, describe pod
kubectl describe pod <pod-name> -n todo-app

# 3. Check logs
kubectl logs <pod-name> -n todo-app --tail=100

# 4. Check previous logs if crashed
kubectl logs <pod-name> -n todo-app --previous

# 5. Check events
kubectl get events -n todo-app --sort-by='.lastTimestamp'
```

---

## 💡 Pro Tips

### 1. Create Aliases for Shorter Commands
```powershell
# Add to PowerShell profile
alias k='kubectl'
alias kns='kubectl -n todo-app'
alias kgp='kubectl get pods -n todo-app'
alias kl='kubectl logs -n todo-app'
```

### 2. Use Kubernetes Namespace Shortcut
```powershell
# Set default namespace
kubectl config set-context --current --namespace=todo-app

# Then all commands use this namespace by default
kubectl get pods  # Automatically uses todo-app namespace
```

### 3. Watch Multiple Resources
```powershell
# Watch all resources
kubectl get all -n todo-app -w
```

### 4. Use Labels for Batch Operations
```powershell
# Delete all backend pods
kubectl delete pods -l app=todo-backend -n todo-app

# Scale all services
kubectl scale deployment -l app=todo-backend --replicas=3 -n todo-app
```

---

## 📚 Quick Reference Sheet

| Task | Command |
|------|---------|
| **Deploy** | `kubectl apply -k kubernetes` |
| **Check Status** | `kubectl get all -n todo-app` |
| **View Logs** | `kubectl logs -n todo-app -l app=todo-backend` |
| **Scale** | `kubectl scale deployment todo-backend --replicas=3 -n todo-app` |
| **Port Forward** | `kubectl port-forward -n todo-app svc/todo-frontend 3000:80` |
| **Describe Pod** | `kubectl describe pod <name> -n todo-app` |
| **Execute Command** | `kubectl exec <pod> -n todo-app -- <command>` |
| **View Events** | `kubectl get events -n todo-app` |
| **Delete All** | `kubectl delete namespace todo-app` |
| **Rollback** | `kubectl rollout undo deployment/todo-backend -n todo-app` |

---

**Happy Kubernetes Deploying! 🚀**
