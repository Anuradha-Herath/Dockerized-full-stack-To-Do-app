// Load environment variables first
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cron = require('node-cron');
const passport = require('./config/passport');
const NotificationService = require('./services/NotificationService');

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      scriptSrc: ["'self'"],
    },
  },
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.'
  }
});

// Stricter rate limiting for auth routes
const authLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.AUTH_RATE_LIMIT_MAX) || 50, // limit each IP to auth requests per windowMs
  message: {
    error: 'Too many authentication attempts, please try again later.'
  }
});

app.use(limiter);

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = process.env.ALLOWED_ORIGINS 
      ? process.env.ALLOWED_ORIGINS.split(',')
      : [
          'http://localhost:3000',
          'http://localhost:3001',
          'http://localhost:5173',
          process.env.FRONTEND_URL
        ];
    
    const cleanOrigins = allowedOrigins.filter(Boolean);
    
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin || cleanOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));

// Handle preflight OPTIONS requests
app.options('*', cors(corsOptions));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Passport middleware
app.use(passport.initialize());

// MongoDB connection
if (!process.env.MONGO_URI) {
  console.error('MONGO_URI is not defined in environment variables.');
  process.exit(1);
}

if (!process.env.JWT_SECRET) {
  console.error('JWT_SECRET is not defined in environment variables.');
  process.exit(1);
}

mongoose.connect(process.env.MONGO_URI)
.then(() => {
  console.log('Connected to MongoDB');
  console.log('Database:', mongoose.connection.name);
  
  // Schedule notification checks
  // Check for overdue tasks every hour
  cron.schedule('0 * * * *', async () => {
    console.log('🔍 Checking for overdue tasks...');
    await NotificationService.checkAndCreateOverdueNotifications();
  });
  
  // Check for upcoming due dates every 30 minutes
  cron.schedule('*/30 * * * *', async () => {
    console.log('⏰ Checking for upcoming task reminders...');
    await NotificationService.checkAndCreateReminderNotifications();
  });
  
  // Clean up old notifications daily at 2 AM
  cron.schedule('0 2 * * *', async () => {
    console.log('🧹 Cleaning up old notifications...');
    await NotificationService.cleanupOldNotifications();
  });
  
  console.log('📅 Notification scheduler started');
})
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

// Health check route
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'TodoMaster API is running',
    timestamp: new Date().toISOString(),
    version: '2.0.0',
    environment: process.env.NODE_ENV || 'development'
  });
});

// API Routes
app.use('/api/auth', authLimiter, require('./routes/auth'));
app.use('/auth', authLimiter, require('./routes/googleAuth'));
app.use('/api/tasks', require('./routes/tasks'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/notifications', require('./routes/notifications'));

// Welcome route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to TodoMaster API',
    version: '2.0.0',
    documentation: '/api/docs',
    health: '/health'
  });
});

// API documentation route (basic)
app.get('/api/docs', (req, res) => {
  res.json({
    name: 'TodoMaster API',
    version: '2.0.0',
    description: 'Complete task management API with authentication',
    endpoints: {
      authentication: {
        'POST /api/auth/register': 'Register new user',
        'POST /api/auth/login': 'Login user',
        'GET /api/auth/me': 'Get current user info',
        'GET /api/auth/profile': 'Get current user profile',
        'PUT /api/auth/profile': 'Update user profile',
        'PUT /api/auth/change-password': 'Change password',
        'DELETE /api/auth/account': 'Delete account',
        'GET /auth/google': 'Start Google OAuth',
        'GET /auth/google/callback': 'Google OAuth callback'
      },
      tasks: {
        'GET /api/tasks': 'Get all tasks (with filtering)',
        'GET /api/tasks/stats': 'Get task statistics',
        'GET /api/tasks/:id': 'Get single task',
        'POST /api/tasks': 'Create new task',
        'PUT /api/tasks/:id': 'Update task',
        'DELETE /api/tasks/:id': 'Delete task',
        'POST /api/tasks/bulk-update': 'Bulk update tasks',
        'DELETE /api/tasks/bulk-delete': 'Bulk delete tasks'
      },
      categories: {
        'GET /api/categories': 'Get all categories',
        'GET /api/categories/stats': 'Get category statistics',
        'POST /api/categories': 'Create new category',
        'PUT /api/categories/:id': 'Update category',
        'DELETE /api/categories/:id': 'Delete category'
      },
      notifications: {
        'GET /api/notifications': 'Get all notifications',
        'GET /api/notifications/stats': 'Get notification statistics',
        'GET /api/notifications/:id': 'Get single notification',
        'PUT /api/notifications/:id/read': 'Mark notification as read/unread',
        'PUT /api/notifications/mark-all-read': 'Mark all notifications as read',
        'DELETE /api/notifications/:id': 'Delete notification',
        'DELETE /api/notifications/bulk-delete': 'Bulk delete notifications'
      }
    },
    authentication: 'Bearer token required for protected routes'
  });
});

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({
      error: 'Validation Error',
      details: errors
    });
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return res.status(400).json({
      error: `${field} already exists`
    });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ error: 'Invalid token' });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ error: 'Token expired' });
  }

  // CORS error
  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({ error: 'Not allowed by CORS policy' });
  }

  // Default error
  res.status(err.status || 500).json({
    error: process.env.NODE_ENV === 'production' 
      ? 'Something went wrong!' 
      : err.message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    method: req.method,
    path: req.originalUrl,
    availableRoutes: [
      'GET /',
      'GET /health',
      'GET /api/docs',
      'POST /api/auth/register',
      'POST /api/auth/login',
      'GET /auth/google',
      'GET /api/tasks',
      'GET /api/categories'
    ]
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  mongoose.connection.close();
  console.log('MongoDB connection closed');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  mongoose.connection.close();
  console.log('MongoDB connection closed');
  process.exit(0);
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 TodoMaster API Server is running on port ${PORT}`);
  console.log(`📱 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 Health check: http://localhost:${PORT}/health`);
  console.log(`📚 Documentation: http://localhost:${PORT}/api/docs`);
});
