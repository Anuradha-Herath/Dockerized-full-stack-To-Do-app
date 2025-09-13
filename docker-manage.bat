@echo off
REM Docker Management Scripts for Todo App

echo ================================
echo Docker Todo App Management
echo ================================
echo.
echo 1. Start Development Environment
echo 2. Start Production Environment  
echo 3. Stop All Containers
echo 4. Clean Up (Remove containers, images, volumes)
echo 5. View Logs
echo 6. Rebuild and Push Images
echo 7. Check Container Status
echo 8. Exit
echo.

set /p choice="Enter your choice (1-8): "

if "%choice%"=="1" goto dev
if "%choice%"=="2" goto prod
if "%choice%"=="3" goto stop
if "%choice%"=="4" goto cleanup
if "%choice%"=="5" goto logs
if "%choice%"=="6" goto rebuild
if "%choice%"=="7" goto status
if "%choice%"=="8" goto exit

:dev
echo Starting development environment...
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d
goto end

:prod
echo Starting production environment...
docker-compose -f docker-compose.prod.yml up -d
goto end

:stop
echo Stopping all containers...
docker-compose down
docker-compose -f docker-compose.prod.yml down
goto end

:cleanup
echo WARNING: This will remove all containers, images, and volumes!
set /p confirm="Are you sure? (y/N): "
if /i "%confirm%"=="y" (
    docker-compose down -v --rmi all
    docker-compose -f docker-compose.prod.yml down -v --rmi all
    docker system prune -a -f
    echo Cleanup completed!
) else (
    echo Cleanup cancelled.
)
goto end

:logs
echo Available services: frontend, backend, mongodb
set /p service="Enter service name (or 'all' for all logs): "
if "%service%"=="all" (
    docker-compose logs -f
) else (
    docker-compose logs -f %service%
)
goto end

:rebuild
echo Rebuilding and pushing images...
docker-compose build --no-cache
docker tag todoapplication-backend:latest anuroxx/todo-app-backend:latest
docker tag todoapplication-frontend:latest anuroxx/todo-app-frontend:latest
docker push anuroxx/todo-app-backend:latest
docker push anuroxx/todo-app-frontend:latest
echo Images rebuilt and pushed!
goto end

:status
echo Container Status:
docker ps -a
echo.
echo Image Status:
docker images | findstr "todoapplication\|anuroxx"
goto end

:exit
exit

:end
echo.
echo Press any key to return to menu...
pause > nul
cls
goto start