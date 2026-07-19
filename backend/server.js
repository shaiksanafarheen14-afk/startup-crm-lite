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

// Database configuration
import connectDB from './config/database.js';

// Global error handler
import { errorHandler } from './middleware/errorHandler.js';

// Import Routes
import authRoutes from './routes/authRoutes.js';
import leadRoutes from './routes/leadRoutes.js';

// Load environment variables from .env file
dotenv.config();

// Initialize Express application
const app = express();

// ==========================================
// Middleware Configuration
// ==========================================

// Set security HTTP headers
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// Log incoming requests
if (process.env.NODE_ENV === 'production') {
  app.use(morgan('combined'));
} else {
  app.use(morgan('dev'));
}

// Enable Cross-Origin Resource Sharing (CORS)
// Allows the frontend application to communicate with this API securely
app.use(cors({
  origin: (origin, callback) => {
    // Normalize origins by removing trailing slashes for safer comparison
    const frontendUrl = process.env.FRONTEND_URL ? process.env.FRONTEND_URL.replace(/\/$/, '') : '';
    const allowedOrigins = [frontendUrl, 'https://your-app.vercel.app'];
    
    if (!origin || allowedOrigins.includes(origin.replace(/\/$/, ''))) {
      callback(null, true);
    } else {
      console.error(`CORS BLOCKED ORIGIN: ${origin} (Expected: ${frontendUrl})`);
      const error = new Error('Not allowed by CORS');
      error.statusCode = 403; // <-- Minimal fix: Prevent the global error handler from defaulting this to 500
      callback(error);
    }
  },
  credentials: true // Allow cookies/authorization headers
}));

// Parse incoming JSON payloads and limit size to prevent large payload attacks
app.use(express.json({ limit: '10kb' }));

// Parse incoming URL-encoded payloads (e.g., from HTML forms)
app.use(express.urlencoded({ extended: true }));

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Rate Limiting
app.set('trust proxy', 1);

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { success: false, message: 'Too many requests, please try again later.' }
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { success: false, message: 'Too many auth attempts.' }
});

app.use('/api/', generalLimiter);
app.use('/api/auth/', authLimiter);


// ==========================================
// Routes Configuration
// ==========================================

// Health check endpoint to verify API is running
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/leads', leadRoutes);


// ==========================================
// Error Handling
// ==========================================

// Global error handling middleware MUST be registered LAST (after all routes)
app.use(errorHandler);


// ==========================================
// Server Initialization & Shutdown
// ==========================================

const PORT = process.env.PORT || 5000;
const MODE = process.env.NODE_ENV || 'development';

const checkRequiredEnvVars = () => {
  const required = ['MONGODB_URI', 'JWT_SECRET', 'PORT'];
  const missing = required.filter(envVar => !process.env[envVar]);
  
  if (missing.length > 0) {
    console.error(`ERROR: Missing required environment variables: ${missing.join(', ')}`);
    process.exit(1);
  }
};

checkRequiredEnvVars();

let server;

// Start server only after attempting to connect to the database
connectDB().then(() => {
  server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} in ${MODE} mode`);
  });
});

// Graceful shutdown
const gracefulShutdown = () => {
  console.log('Server shutting down gracefully');
  if (server) {
    server.close(() => {
      console.log('HTTP server closed.');
      mongoose.connection.close(false).then(() => {
        console.log('MongoDB connection closed.');
        process.exit(0);
      });
    });
  } else {
    process.exit(0);
  }
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);
