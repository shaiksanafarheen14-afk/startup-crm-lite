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
  const required = ['MONGODB_URI', 'JWT_SECRET', 'PORT'];
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

// Update CORS for production
const allowedOrigins = [process.env.FRONTEND_URL, 'https://your-app.vercel.app'];
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl) or if origin is in the allowed list
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

/**
 * Rate Limiting
 */
// General rate limiter: 100 requests per 15 minutes per IP
const generalLimiter = rateLimit({ 
  windowMs: 15 * 60 * 1000, 
  max: 100, 
  message: 'Too many requests, please try again later.' 
});

// Auth rate limiter (stricter): 10 requests per 15 minutes per IP
const authLimiter = rateLimit({ 
  windowMs: 15 * 60 * 1000, 
  max: 10, 
  message: 'Too many auth attempts.' 
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
  server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} in ${MODE} mode`);
  });
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
