@echo off
REM Kubernetes Setup Script for Windows
REM This script installs and starts Minikube for local Kubernetes development

echo.
echo ==========================================
echo Kubernetes Setup Script
echo ==========================================
echo.

REM Check if kubectl is installed
echo [*] Checking kubectl installation...
kubectl version --client >nul 2>&1
if %errorlevel% neq 0 (
    echo [-] kubectl not found. Please install it first.
    echo    Download from: https://kubernetes.io/docs/tasks/tools/
    pause
    exit /b 1
) else (
    echo [+] kubectl is installed
    kubectl version --client
)

echo.

REM Check if Minikube is installed
echo [*] Checking Minikube installation...
minikube version >nul 2>&1
if %errorlevel% neq 0 (
    echo [-] Minikube not found. Installing...
    echo.
    echo Please download Minikube from:
    echo https://github.com/kubernetes/minikube/releases
    echo.
    echo Or install with Chocolatey:
    echo choco install minikube
    echo.
    echo Or with Scoop:
    echo scoop install minikube
    echo.
    pause
    exit /b 1
) else (
    echo [+] Minikube is installed
    minikube version
)

echo.

REM Start Minikube
echo [*] Starting Minikube cluster...
minikube start --cpus=4 --memory=4096 --driver=docker

echo.

REM Verify cluster
echo [*] Verifying cluster connection...
kubectl cluster-info
kubectl get nodes

echo.
echo ==========================================
echo Setup Complete!
echo ==========================================
echo.
echo Next steps:
echo 1. Update Kubernetes/secrets.yaml with your actual values
echo 2. Deploy: kubectl apply -k kubernetes
echo 3. Check status: kubectl get all -n todo-app
echo 4. Access app: kubectl port-forward -n todo-app svc/todo-frontend 3000:80
echo 5. Open: http://localhost:3000
echo.
echo Dashboard: minikube dashboard
echo.
pause
