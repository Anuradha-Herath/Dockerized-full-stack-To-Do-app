#!/bin/bash
# Quick deployment script for To-Do Application on Kubernetes

echo "=========================================="
echo "To-Do Application Kubernetes Deployment"
echo "=========================================="
echo ""

# Step 1: Deploy Secrets
echo "[1/5] Deploying Secrets..."
kubectl apply -f kubernetes/secrets/
echo "✓ Secrets deployed"
echo ""

# Step 2: Deploy ConfigMaps
echo "[2/5] Deploying ConfigMaps..."
kubectl apply -f kubernetes/configmaps/
echo "✓ ConfigMaps deployed"
echo ""

# Step 3: Deploy MongoDB
echo "[3/5] Deploying MongoDB..."
kubectl apply -f kubernetes/mongodb/
echo "✓ MongoDB deployed"
echo "Waiting for MongoDB to be ready..."
kubectl wait --for=condition=ready pod -l component=database --timeout=300s
echo ""

# Step 4: Deploy Backend
echo "[4/5] Deploying Backend..."
kubectl apply -f kubernetes/backend/
echo "✓ Backend deployed"
echo "Waiting for Backend to be ready..."
kubectl wait --for=condition=ready pod -l component=backend --timeout=300s
echo ""

# Step 5: Deploy Frontend
echo "[5/5] Deploying Frontend..."
kubectl apply -f kubernetes/frontend/
echo "✓ Frontend deployed"
echo "Waiting for Frontend to be ready..."
kubectl wait --for=condition=ready pod -l component=frontend --timeout=300s
echo ""

echo "=========================================="
echo "Deployment Complete!"
echo "=========================================="
echo ""
echo "Your services are now deployed:"
echo ""
echo "Services:"
kubectl get svc
echo ""
echo "Pods:"
kubectl get pods
echo ""
echo "To access your application:"
echo "1. Get Minikube IP: minikube ip"
echo "2. Open: http://<minikube-ip>:30000"
echo ""
echo "Or use port forwarding:"
echo "kubectl port-forward svc/frontend 3000:3000"
echo "Then open: http://localhost:3000"
echo ""
