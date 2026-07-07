import dns from 'dns';
dns.setServers(['8.8.8.8', '1.1.1.1']);

import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import mongoose from 'mongoose';

// Import Database Config
import { connectDB } from './config/database.js';

// Import Error Handling Middleware
import { errorHandler } from './middleware/errorHandler.js';

// Load environment variables
dotenv.config();

/**
 * Environment Validation
 * Checks if required environment variables exist before starting.
 */
const checkRequiredEnvVars = () => {
  const required = ['MONGODB_URI', 'JWT_SECRET'];
  const missing = required.filter(envVar => !process.env[envVar]);
  
  if (missing.length > 0) {
    console.error(`ERROR: Missing required environment variables: ${missing.join(', ')}`);
    process.exit(1);
  }
};

import authRoutes from './routes/authRoutes.js';
import leadRoutes from './routes/leadRoutes.js';

// Initialize express app
const app = express();

/**
 * -----------------------
 * GLOBAL MIDDLEWARE
 * -----------------------
 */

// Set security HTTP headers
app.use(helmet());

// Logging middleware improvement
if (process.env.NODE_ENV === 'production') {
  app.use(morgan('combined')); // detailed production logging
} else {
  app.use(morgan('dev')); // concise, colorized dev logging
}

// CORS Configuration
// Allows localhost (any port), *.railway.app, *.vercel.app, *.netlify.app, and FRONTEND_URL
const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (curl, Postman, mobile apps)
    if (!origin) return callback(null, true);

    // Allow localhost on any port
    if (/^https?:\/\/localhost(:\d+)?$/.test(origin)) return callback(null, true);

    // Allow Railway deployments
    if (origin.endsWith('.railway.app') || origin.endsWith('.up.railway.app')) return callback(null, true);

    // Allow Vercel deployments
    if (origin.endsWith('.vercel.app')) return callback(null, true);

    // Allow Netlify deployments
    if (origin.endsWith('.netlify.app')) return callback(null, true);

    // Allow explicit FRONTEND_URL env variable
    if (process.env.FRONTEND_URL && origin === process.env.FRONTEND_URL) return callback(null, true);

    console.warn(`CORS blocked: ${origin}`);
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
};

app.use(cors(corsOptions));
// Handle OPTIONS preflight requests for all routes (Express 5 compatible syntax)
app.options('/{*path}', cors(corsOptions));


/**
 * Rate Limiting
 */
// General rate limiter: 100 requests per 15 minutes per IP
const generalLimiter = rateLimit({ 
  windowMs: 15 * 60 * 1000, 
  max: 100, 
  standardHeaders: true,
  legacyHeaders: false,
  message: { status: 429, message: 'Too many requests, please try again later.' }
});

// Auth rate limiter: 50 requests per 15 minutes per IP
const authLimiter = rateLimit({ 
  windowMs: 15 * 60 * 1000, 
  max: 50, 
  standardHeaders: true,
  legacyHeaders: false,
  message: { status: 429, message: 'Too many auth attempts, please try again later.' }
});

// Apply rate limiters
app.use('/api/', generalLimiter);
app.use('/api/auth/', authLimiter);

// Body parser, reading data from body into req.body
// Limit payload size to 10kb to prevent DOS attacks
app.use(express.json({ limit: '10kb' }));

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({ extended: true }));

/**
 * MongoDB Injection Protection
 * Sanitizes req.body, req.query, req.params to prevent NoSQL injections
 */
app.use(mongoSanitize());

/**
 * -----------------------
 * ROUTES
 * -----------------------
 */

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date(),
    environment: process.env.NODE_ENV || 'development',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
  });
});

// Register API routes
app.use('/api/auth', authRoutes);
app.use('/api/leads', leadRoutes);

/**
 * -----------------------
 * ERROR HANDLING
 * -----------------------
 */

// Catch-all for unhandled routes
app.use((req, res, next) => {
  const err = new Error(`Can't find ${req.originalUrl} on this server!`);
  err.statusCode = 404;
  next(err);
});

// Global Error Handler Middleware (MUST be the last middleware)
app.use(errorHandler);

/**
 * -----------------------
 * SERVER & DB INIT
 * -----------------------
 */
const PORT = process.env.PORT || 5000;
const MODE = process.env.NODE_ENV || 'development';

// 4. Environment validation on startup
checkRequiredEnvVars();

// Connect to Database, then start server
let server;
connectDB().then(() => {
  // Bind to 0.0.0.0 so Railway/Docker containers can receive external traffic
  server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT} in ${MODE} mode`);
    console.log(`Health check available at: /api/health`);
  });
}).catch((err) => {
  console.error('Failed to connect to MongoDB. Server will not start:', err.message);
  process.exit(1);
});

/**
 * Graceful Shutdown Handler
 */
const gracefulShutdown = () => {
  console.log('\nServer shutting down gracefully...');
  if (server) {
    server.close(async () => {
      try {
        await mongoose.connection.close(false);
        console.log('MongoDB connection closed cleanly.');
        process.exit(0);
      } catch (err) {
        console.error('Error closing MongoDB connection:', err);
        process.exit(1);
      }
    });
  } else {
    process.exit(0);
  }
};

// Handle process termination signals
process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);
