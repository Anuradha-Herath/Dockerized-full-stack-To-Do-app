# 📝 Dockerized Todo Application

A full-stack Todo application built with React, Node.js, Express, and MongoDB, all containerized with Docker for easy deployment and development.

## 🚀 Tech Stack

### Frontend
- **React 18** with Hooks
- **Vite** for fast development and building
- **Axios** for API communication
- **CSS3** with modern styling
- **Nginx** for production serving

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **CORS** enabled for cross-origin requests
- **Environment variables** for configuration

### DevOps
- **Docker** & **Docker Compose**
- **Multi-stage builds** for optimized images
- **Health checks** for all services
- **Persistent volumes** for database storage
- **Network isolation** for security

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│                 │    │                 │    │                 │
│   Frontend      │────│   Backend       │────│   MongoDB       │
│   (React/Nginx) │    │   (Node.js)     │    │   Database      │
│   Port: 3000    │    │   Port: 5000    │    │   Port: 27017   │
│                 │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🛠️ Prerequisites

Make sure you have the following installed on your system:

- [Docker](https://docs.docker.com/get-docker/) (version 20.10 or higher)
- [Docker Compose](https://docs.docker.com/compose/install/) (version 2.0 or higher)

## 🚀 Quick Start

1. **Clone the repository** (or use the provided files)
   ```bash
   cd "c:\Users\Anuradha\Downloads\Moratuwa Academic\Projects\To Do application"
   ```

2. **Start all services with Docker Compose**
   ```bash
   docker-compose up --build
   ```

3. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - Health Check: http://localhost:5000/health

4. **Stop the application**
   ```bash
   docker-compose down
   ```

## 📁 Project Structure

```
todo-app/
├── backend/                 # Node.js Express API
│   ├── server.js           # Main server file
│   ├── package.json        # Dependencies and scripts
│   ├── .env               # Environment variables
│   ├── Dockerfile         # Backend container config
│   └── .dockerignore      # Docker ignore rules
├── frontend/               # React application
│   ├── src/
│   │   ├── components/
│   │   │   ├── TaskForm.jsx
│   │   │   ├── TaskForm.css
│   │   │   ├── TaskList.jsx
│   │   │   └── TaskList.css
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json       # Dependencies and scripts
│   ├── vite.config.js     # Vite configuration
│   ├── index.html         # HTML template
│   ├── nginx.conf         # Nginx configuration
│   ├── Dockerfile         # Frontend container config
│   └── .dockerignore      # Docker ignore rules
├── docker-compose.yml     # Multi-service orchestration
└── README.md             # Project documentation
```

## 🔌 API Endpoints

### Tasks API
- `GET /api/tasks` - Get all tasks
- `GET /api/tasks/:id` - Get a specific task
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task

### Health Check
- `GET /health` - Check API health status

### Request/Response Examples

**Create a task:**
```bash
curl -X POST http://localhost:5000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title": "Learn Docker", "description": "Complete the Docker tutorial"}'
```

**Response:**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "title": "Learn Docker",
  "description": "Complete the Docker tutorial",
  "completed": false,
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

## 🐳 Docker Commands

### Development
```bash
# Start services in development mode
docker-compose up

# Rebuild and start services
docker-compose up --build

# Start services in background
docker-compose up -d

# View logs
docker-compose logs -f

# View logs for specific service
docker-compose logs -f backend
```

### Production
```bash
# Build images for production
docker-compose -f docker-compose.yml build

# Start in production mode
docker-compose -f docker-compose.yml up -d
```

### Maintenance
```bash
# Stop all services
docker-compose down

# Stop and remove volumes (⚠️ deletes all data)
docker-compose down -v

# Remove all containers and images
docker-compose down --rmi all

# View running containers
docker-compose ps
```

## 🔧 Environment Variables

### Backend (.env)
```env
PORT=5000
MONGO_URI=mongodb://mongodb:27017/todoapp
NODE_ENV=production
```

### Frontend (Docker environment)
```env
VITE_API_URL=http://localhost:5000
```

## 📊 Service URLs & Ports

| Service  | Internal Port | External Port | URL                    |
|----------|---------------|---------------|------------------------|
| Frontend | 3000          | 3000          | http://localhost:3000  |
| Backend  | 5000          | 5000          | http://localhost:5000  |
| MongoDB  | 27017         | 27017         | mongodb://localhost:27017 |

## 🔍 Troubleshooting

### Common Issues

1. **Port already in use**
   ```bash
   # Check what's using the port
   netstat -an | findstr :3000
   
   # Change ports in docker-compose.yml if needed
   ports:
     - "3001:3000"  # Use external port 3001 instead
   ```

2. **MongoDB connection issues**
   ```bash
   # Check MongoDB container logs
   docker-compose logs mongodb
   
   # Verify MongoDB is healthy
   docker-compose ps
   ```

3. **Frontend can't connect to backend**
   - Check that backend is running: http://localhost:5000/health
   - Verify CORS is enabled in backend
   - Check browser console for errors

4. **Application won't start**
   ```bash
   # Clean up and restart
   docker-compose down -v
   docker system prune -f
   docker-compose up --build
   ```

### Health Checks

All services include health checks:
```bash
# Check service health
docker-compose ps

# Manual health checks
curl http://localhost:5000/health    # Backend
curl http://localhost:3000/health    # Frontend
```

## 🚀 Features

- ✅ Create, read, update, and delete tasks
- ✅ Mark tasks as complete/incomplete
- ✅ Edit tasks inline
- ✅ Responsive design for mobile and desktop
- ✅ Real-time data persistence
- ✅ Docker containerization
- ✅ Health monitoring
- ✅ Production-ready setup

## 🔐 Security Features

- Non-root users in containers
- Security headers in Nginx
- Input validation and sanitization
- CORS protection
- Docker image vulnerability scanning

## 📈 Performance

- Multi-stage Docker builds for smaller images
- Nginx gzip compression
- Static asset caching
- Database connection pooling
- Health checks for high availability

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test with Docker Compose
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

---

**Happy Coding! 🎉**

For questions or issues, please check the troubleshooting section above or create an issue in the repository.

---

# To-Do Application

A beginner-friendly, production-ready, Dockerized multi-service To-Do application with a Node.js/Express/MongoDB backend and a React (Vite) frontend.

---

## 🚀 Quick Start (Production)

1. **Install Docker & Docker Compose**
   - [Docker Desktop](https://www.docker.com/products/docker-desktop/)

2. **Clone or Download the Project**
   - Place all files in a single directory.

3. **Build & Start All Services**
   ```sh
   docker-compose up --build
   ```
   This will start:
   - MongoDB (database, port 27017)
   - Backend API (Node.js, port 5000)
   - Frontend (React, port 3000)

4. **Access the App**
   - Frontend: [http://localhost:3000](http://localhost:3000)
   - Backend API: [http://localhost:5000](http://localhost:5000)

5. **Stop All Services**
   Press `Ctrl+C` in the terminal, then run:
   ```sh
   docker-compose down
   ```

---

## 🛠️ Development Mode (Hot Reload)

1. **Start in Development Mode**
   ```sh
   docker-compose -f docker-compose.yml -f docker-compose.dev.yml up --build
   ```
   - Backend: watches for code changes (nodemon)
   - Frontend: watches for code changes (Vite dev server)

2. **Access the App**
   - Frontend: [http://localhost:3000](http://localhost:3000)
   - Backend API: [http://localhost:5000](http://localhost:5000)

---

## 📦 Project Structure

- `backend/` — Node.js + Express + MongoDB API
- `frontend/` — React (Vite) web app
- `docker-compose.yml` — Production orchestration
- `docker-compose.dev.yml` — Development overrides

---

## ⚙️ Environment Variables

- Backend: `backend/.env` (edit `MONGO_URI` if needed)
- Frontend: `VITE_API_URL` (set in Docker Compose)

---

## 📝 Tech Stack
- Node.js, Express, MongoDB, Mongoose
- React 18, Vite, Axios
- Docker, Docker Compose, Nginx

---

## 🔗 Useful URLs
- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend API: [http://localhost:5000](http://localhost:5000)
- MongoDB: `mongodb://localhost:27017/todoapp`

---

## 💡 Tips
- All data is stored in a Docker volume (`todo-mongodb-data`).
- To reset the database, run: `docker volume rm todo-mongodb-data`
- For troubleshooting, check logs with: `docker-compose logs`

---

## 📄 License
MIT
