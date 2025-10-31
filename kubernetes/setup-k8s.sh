#!/bin/bash
# Kubernetes Setup Script for macOS/Linux

echo "=========================================="
echo "Kubernetes Setup Script"
echo "=========================================="
echo ""

# Check if kubectl is installed
echo "[*] Checking kubectl installation..."
if ! command -v kubectl &> /dev/null; then
    echo "[-] kubectl not found. Please install it first."
    echo "    Download from: https://kubernetes.io/docs/tasks/tools/"
    exit 1
else
    echo "[+] kubectl is installed"
    kubectl version --client
fi

echo ""

# Check if Minikube is installed
echo "[*] Checking Minikube installation..."
if ! command -v minikube &> /dev/null; then
    echo "[-] Minikube not found. Installing..."
    echo ""
    echo "Please download Minikube from:"
    echo "https://github.com/kubernetes/minikube/releases"
    echo ""
    echo "Or install with Homebrew:"
    echo "brew install minikube"
    echo ""
    exit 1
else
    echo "[+] Minikube is installed"
    minikube version
fi

echo ""

# Start Minikube
echo "[*] Starting Minikube cluster..."
minikube start --cpus=4 --memory=4096 --driver=docker

echo ""

# Verify cluster
echo "[*] Verifying cluster connection..."
kubectl cluster-info
kubectl get nodes

echo ""
echo "=========================================="
echo "Setup Complete!"
echo "=========================================="
echo ""
echo "Next steps:"
echo "1. Update kubernetes/secrets.yaml with your actual values"
echo "2. Deploy: kubectl apply -k kubernetes"
echo "3. Check status: kubectl get all -n todo-app"
echo "4. Access app: kubectl port-forward -n todo-app svc/todo-frontend 3000:80"
echo "5. Open: http://localhost:3000"
echo ""
echo "Dashboard: minikube dashboard"
echo ""
