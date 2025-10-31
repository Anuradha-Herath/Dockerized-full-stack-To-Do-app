# 🎯 Installation & Deployment Checklist

## ✅ What's Ready (Already Done)

- [x] Kubernetes manifests created (14 YAML files)
- [x] ConfigMaps for backend and frontend
- [x] Secrets for sensitive data (MongoDB, JWT, Google OAuth)
- [x] MongoDB deployment with persistent storage (5GB)
- [x] Backend API deployment (2 replicas)
- [x] Frontend React deployment (2 replicas)
- [x] Services for network routing
- [x] Auto-scaling rules (HPA)
- [x] Health checks configured
- [x] Documentation files

---

## ⏳ What You Need to Do (Prerequisites)

### Step 1: Install Minikube (15 minutes)

1. **Download Minikube:**
   - Go to: https://github.com/kubernetes/minikube/releases/latest
   - Download: `minikube-windows-amd64.exe`
   - **Size:** ~100MB

2. **Install Minikube:**
   ```powershell
   # Option A: Copy to Program Files (requires admin)
   Copy-Item .\minikube-windows-amd64.exe 'C:\Program Files\minikube.exe'
   
   # Option B: Copy to a folder and add to PATH
   Copy-Item .\minikube-windows-amd64.exe C:\Users\Anuradha\AppData\Local\Microsoft\WindowsApps\minikube.exe
   ```

3. **Verify Installation:**
   ```powershell
   minikube version
   ```

**Expected Output:**
```
minikube version: v1.XX.X
commit: xxxxxxx
```

---

### Step 2: Start Kubernetes Cluster (5 minutes)

```powershell
# Start Minikube with adequate resources
minikube start --cpus=4 --memory=4096 --driver=docker

# ⏳ This may take 3-5 minutes the first time
# You'll see progress indicators like:
# 📘 minikube v1.XX.X on Windows
# ✅ Creating docker container...
# ✅ Preparing Kubernetes v1.XX.X...
# ✅ All set! You should be good to go!
```

**Verify Cluster is Running:**
```powershell
# Check cluster status
minikube status

# Expected output:
# minikube
# type: Control Plane
# host: Running
# kubelet: Running
# apiserver: Running
# kubeconfig: Configured

# Check nodes
kubectl get nodes

# Expected output:
# NAME       STATUS   ROLES           AGE   VERSION
# minikube   Ready    control-plane   3m    v1.XX.X
```

---

### Step 3: Update Secrets (5 minutes) ⚠️ IMPORTANT

**⚠️ DO NOT SKIP THIS STEP!**

```powershell
# Open the secrets file for editing
code kubernetes/secrets.yaml
```

**Find and update these values:**

```yaml
# ❌ BEFORE (with placeholder values)
MONGODB_PASSWORD: todopassword123
JWT_SECRET: your-super-secret-jwt-key-change-this-in-production
GOOGLE_CLIENT_ID: your-google-client-id-here
GOOGLE_CLIENT_SECRET: your-google-client-secret-here

# ✅ AFTER (with your actual values)
MONGODB_PASSWORD: YourSecurePassword123!@#
JWT_SECRET: MyLongSecureRandomKeyWithNumbers123AndSymbols!@#$%
GOOGLE_CLIENT_ID: 123456789-abcdefghijklmnop.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET: GOCSPX-YourGoogleSecretKey123
```

**Save the file:** `Ctrl+S`

---

### Step 4: Deploy to Kubernetes (2 minutes)

```powershell
# Apply all Kubernetes manifests
kubectl apply -k kubernetes

# You should see output like:
# namespace/todo-app created
# configmap/todo-backend-config created
# configmap/todo-frontend-config created
# secret/todo-backend-secrets created
# persistentvolumeclaim/mongodb-data-pvc created
# persistentvolumeclaim/mongodb-config-pvc created
# deployment.apps/todo-mongodb created
# service/todo-mongodb created
# deployment.apps/todo-backend created
# service/todo-backend created
# horizontalpodautoscaler.autoscaling/todo-backend-hpa created
# deployment.apps/todo-frontend created
# service/todo-frontend created
# horizontalpodautoscaler.autoscaling/todo-frontend-hpa created
```

---

### Step 5: Verify Deployment (5 minutes)

**Watch pods starting up:**
```powershell
# This shows real-time pod status
kubectl get pods -n todo-app -w

# Press Ctrl+C to exit watch mode when all pods are Running
```

**Expected Timeline:**
1. **0-30 seconds:** Pods in `ContainerCreating` state
2. **30-60 seconds:** MongoDB pod starts (takes longer to initialize)
3. **1-2 minutes:** Backend pods start and become `Running`
4. **2-3 minutes:** Frontend pods start and become `Running`

**Check final status:**
```powershell
# All pods should show READY 1/1 and STATUS Running
kubectl get pods -n todo-app

# Expected output:
# NAME                                READY   STATUS    RESTARTS   AGE
# todo-mongodb-xxxxxxxxxx-xxxxx       1/1     Running   0          2m
# todo-backend-xxxxxxxxxx-xxxxx       1/1     Running   0          1m30s
# todo-backend-xxxxxxxxxx-xxxxx       1/1     Running   0          1m30s
# todo-frontend-xxxxxxxxxx-xxxxx      1/1     Running   0          1m
# todo-frontend-xxxxxxxxxx-xxxxx      1/1     Running   0          1m
```

---

### Step 6: Access Your Application (1 minute)

**Option A: Using Port-Forward (Recommended)**
```powershell
# Keep this terminal open
kubectl port-forward -n todo-app svc/todo-frontend 3000:80

# Output: Forwarding from 127.0.0.1:3000 -> 3000

# Open browser: http://localhost:3000
```

**Option B: Using Minikube Service**
```powershell
# Automatically opens in your browser
minikube service todo-frontend -n todo-app
```

---

## 🎉 Success Criteria

✅ **Minikube is running:**
```powershell
minikube status
# Should show: host: Running, kubelet: Running, apiserver: Running
```

✅ **Cluster is accessible:**
```powershell
kubectl cluster-info
# Should show Kubernetes control plane URL
```

✅ **All pods are running:**
```powershell
kubectl get pods -n todo-app
# Should show 5 pods, all with STATUS: Running
```

✅ **Application is accessible:**
- Browser: http://localhost:3000
- Should see the Todo application UI

---

## 📊 Resource Usage

After deployment, check what's running:

```powershell
# View all resources in namespace
kubectl get all -n todo-app

# View resource usage (if metrics available)
kubectl top pods -n todo-app
kubectl top nodes
```

---

## 🔍 Troubleshooting Quick Reference

| Issue | Command to Check | Solution |
|-------|------------------|----------|
| Pods stuck in Pending | `kubectl describe pod <name> -n todo-app` | Check available resources with `kubectl top nodes` |
| Container error | `kubectl logs <pod> -n todo-app` | Check pod logs for error messages |
| Connection refused | `kubectl exec <pod> -n todo-app -- wget http://todo-backend:5000` | Verify service discovery works |
| MongoDB not starting | `kubectl logs -l app=todo-mongodb -n todo-app` | Check disk space and storage permissions |

---

## 💾 Database Persistence

Your MongoDB data is stored in a Kubernetes PersistentVolume:

```powershell
# View persistent volumes
kubectl get pvc -n todo-app

# View storage
kubectl get pv

# When you delete pods, data persists
# When you delete namespace, data is cleaned up
```

---

## 🆘 Reset Everything (If Needed)

```powershell
# Complete cleanup
kubectl delete namespace todo-app

# Wait for deletion
Start-Sleep -Seconds 10

# Redeploy
kubectl apply -k kubernetes

# Or completely reset Minikube
minikube delete
minikube start --cpus=4 --memory=4096 --driver=docker
```

---

## 📈 Next Steps After Initial Deployment

1. **Monitor Logs:**
   ```powershell
   kubectl logs -f -l app=todo-backend -n todo-app
   ```

2. **Check Auto-scaling:**
   ```powershell
   kubectl get hpa -n todo-app
   ```

3. **Scale Manually:**
   ```powershell
   kubectl scale deployment todo-backend --replicas=4 -n todo-app
   ```

4. **Deploy Updates:**
   ```powershell
   kubectl set image deployment/todo-backend todo-backend=anuroxx/todo-app-backend:v2 -n todo-app
   ```

---

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| **README.md** | Overview and summary |
| **QUICK_START.md** | Quick reference commands |
| **DEPLOYMENT_GUIDE.md** | Comprehensive deployment guide |
| **setup-k8s.bat** | Windows automation script |
| **setup-k8s.sh** | Linux/Mac automation script |

---

## ⏱️ Total Time Estimate

| Task | Time |
|------|------|
| Download Minikube | 5-10 min |
| Install Minikube | 5 min |
| Update Secrets | 5 min |
| Deploy to Kubernetes | 2 min |
| Verify Deployment | 5 min |
| **TOTAL** | **22-27 minutes** |

---

## 🎯 Common Commands Summary

```powershell
# Startup
minikube start --cpus=4 --memory=4096 --driver=docker

# Deployment
kubectl apply -k kubernetes

# Monitoring
kubectl get pods -n todo-app -w
kubectl get all -n todo-app
kubectl logs -l app=todo-backend -n todo-app

# Access
kubectl port-forward -n todo-app svc/todo-frontend 3000:80

# Cleanup
kubectl delete namespace todo-app
```

---

**You're ready to deploy! Follow the steps above in order. Let me know if you hit any issues! 🚀**
