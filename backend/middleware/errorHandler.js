import { errorResponse } from '../utils/apiResponse.js';

/**
 * Global Error Handler Middleware
 * Intercepts all errors thrown in the application and normalizes the response.
 */
export const errorHandler = (err, req, res, next) => {
  // Determine environment
  const isDev = process.env.NODE_ENV === 'development';
  
  // Default values
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Server error';
  let errors = null;

  // 1. Mongoose ValidationError
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation Error';
    // Extract field-by-field error messages
    errors = Object.values(err.errors).map((val) => val.message);
  }
  
  // 2. Mongoose CastError (e.g., invalid ObjectId)
  else if (err.name === 'CastError') {
    statusCode = 404;
    message = 'Resource not found';
  }
  
  // 3. MongoDB duplicate key (code 11000)
  else if (err.code === 11000) {
    statusCode = 409;
    message = 'Duplicate field value entered';
    // Often this occurs with emails
    if (err.keyValue && err.keyValue.email) {
      message = 'Email already exists';
    }
  }
  
  // 4. JWT errors
  else if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token. Please log in again.';
  }
  else if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Your token has expired. Please log in again.';
  }

  // Prepare error details for the response
  // In development: include err.stack if we don't already have specific `errors`
  // In production: never send stack traces
  let responseErrors = null;
  if (isDev) {
    responseErrors = errors ? errors : err.stack;
  } else {
    responseErrors = errors; // Keep field errors in production, but never stack trace
  }

  // Fallback message for generic 500s in production
  if (!isDev && statusCode === 500 && !err.isOperational) {
    message = 'Server error';
  }

  // Send consistent response
  return errorResponse(res, message, statusCode, responseErrors);
};
