/**
 * Global Express Error Handler Middleware
 * Intercepts all errors thrown in routes or other middleware and formats them into a standard API response.
 * 
 * @param {Error} err - The error object
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const errorHandler = (err, req, res, next) => {
  // Default to 500 Server Error
  let statusCode = 500;
  let message = 'Server error';
  let errors = null;

  // 1. Mongoose ValidationError
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation Error';
    // Extract field-by-field error messages
    errors = Object.values(err.errors).map(val => val.message);
  }

  // 2. Mongoose CastError (e.g., Invalid ObjectId)
  else if (err.name === 'CastError') {
    statusCode = 404;
    message = 'Resource not found';
    errors = `Invalid ${err.path}: ${err.value}`;
  }

  // 3. MongoDB Duplicate Key Error (code 11000)
  else if (err.code === 11000) {
    statusCode = 409;
    // Extract the field that caused the duplicate error
    const field = Object.keys(err.keyValue)[0];
    // Custom message for email, else generic duplicate message
    message = field === 'email' ? 'Email already exists' : `Duplicate value entered for ${field}`;
  }

  // 4. JWT Authentication Errors
  else if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token. Please log in again.';
  }
  else if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Your token has expired. Please log in again.';
  }
  
  // 5. Custom status codes thrown by controllers (if available)
  else if (err.statusCode) {
    statusCode = err.statusCode;
    message = err.message || message;
  }

  // Build the error response payload
  const errorResponsePayload = {
    success: false,
    message,
    errors
  };

  // Append stack trace only in development mode
  if (process.env.NODE_ENV === 'development') {
    errorResponsePayload.stack = err.stack;
  }

  // Send the final JSON response
  res.status(statusCode).json(errorResponsePayload);
};
