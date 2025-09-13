@echo off
REM Docker Image Update Script
REM Run this after committing new changes to update Docker Hub images

echo ============================================
echo Docker Image Update Workflow
echo ============================================
echo.

REM Get version input
set /p version="Enter new version (e.g., v1.1): "
if "%version%"=="" (
    echo Version is required!
    pause
    exit /b 1
)

echo.
echo Step 1: Building fresh images...
echo ============================================
docker-compose build --no-cache
if %errorlevel% neq 0 (
    echo Build failed!
    pause
    exit /b 1
)

echo.
echo Step 2: Tagging images...
echo ============================================
docker tag todoapplication-backend:latest anuroxx/todo-app-backend:%version%
docker tag todoapplication-backend:latest anuroxx/todo-app-backend:latest
docker tag todoapplication-frontend:latest anuroxx/todo-app-frontend:%version%
docker tag todoapplication-frontend:latest anuroxx/todo-app-frontend:latest

echo.
echo Step 3: Pushing to Docker Hub...
echo ============================================
echo Pushing backend images...
docker push anuroxx/todo-app-backend:%version%
docker push anuroxx/todo-app-backend:latest

echo Pushing frontend images...
docker push anuroxx/todo-app-frontend:%version%
docker push anuroxx/todo-app-frontend:latest

echo.
echo ============================================
echo ✅ Images updated successfully!
echo ============================================
echo.
echo New images available:
echo - anuroxx/todo-app-backend:%version%
echo - anuroxx/todo-app-frontend:%version%
echo - anuroxx/todo-app-backend:latest (updated)
echo - anuroxx/todo-app-frontend:latest (updated)
echo.

echo Step 4: Update running containers (optional)
echo ============================================
set /p update_containers="Update running containers now? (y/N): "
if /i "%update_containers%"=="y" (
    echo Pulling and restarting containers...
    docker-compose -f docker-compose.prod.yml pull
    docker-compose -f docker-compose.prod.yml up -d
    echo Containers updated!
)

echo.
echo Done! Remember to:
echo - Update your docker-compose.prod.yml if needed
echo - Test the new deployment
echo - Document the changes in your changelog
echo.
pause