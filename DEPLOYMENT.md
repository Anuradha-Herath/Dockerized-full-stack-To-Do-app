# Docker Deployment Guide

## 🚀 Quick Start with Docker Hub Images

### Prerequisites
- Docker and Docker Compose installed
- Ports 80, 5000, and 27017 available

### Production Deployment
```bash
# Using published Docker Hub images
docker-compose -f docker-compose.prod.yml up -d
```

### Development Deployment
```bash
# Build and run locally
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d
```

## 📦 Available Images

- **Backend**: `anuroxx/todo-app-backend:latest`
- **Frontend**: `anuroxx/todo-app-frontend:latest`

## 🔧 Environment Configuration

1. Copy the environment template:
   ```bash
   cp .env.prod.template .env.prod
   ```

2. Edit `.env.prod` with your actual values

3. Use with docker-compose:
   ```yaml
   env_file:
     - .env.prod
   ```

## 🌐 Access Points

- **Frontend**: http://localhost (port 80)
- **Backend API**: http://localhost:5000
- **MongoDB**: localhost:27017
- **Health Check**: http://localhost:5000/health

## 🔍 Monitoring and Logs

```bash
# View all logs
docker-compose -f docker-compose.prod.yml logs -f

# View specific service logs
docker-compose -f docker-compose.prod.yml logs -f backend

# Check container status
docker ps

# Check health status
docker inspect todo-backend-prod | grep Health -A 10
```

## 🛠 Management Commands

Use the provided batch script:
```cmd
docker-manage.bat
```

## 🔄 Updates

1. Pull latest images:
   ```bash
   docker-compose -f docker-compose.prod.yml pull
   ```

2. Restart services:
   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```

## 🔒 Security Notes

- Change default JWT and session secrets
- Use environment variables for sensitive data
- Regular security updates
- Monitor container logs
- Implement SSL/TLS in production

## 🐛 Troubleshooting

### Container won't start
```bash
docker-compose -f docker-compose.prod.yml logs [service-name]
```

### Database connection issues
```bash
docker exec -it todo-mongodb-prod mongosh todoapp
```

### Reset everything
```bash
docker-compose -f docker-compose.prod.yml down -v
docker-compose -f docker-compose.prod.yml up -d
```