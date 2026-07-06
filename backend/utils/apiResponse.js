/**
 * Helper utility functions for consistent API responses across the application.
 */

/**
 * Sends a successful API response.
 * @param {Object} res - Express response object
 * @param {Object|Array} data - The payload to send
 * @param {String} message - Success message
 * @param {Number} statusCode - HTTP status code (default: 200)
 */
export const successResponse = (res, data, message, statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

/**
 * Sends an error API response.
 * @param {Object} res - Express response object
 * @param {String} message - Error message
 * @param {Number} statusCode - HTTP status code (default: 500)
 * @param {Object|Array|null} errors - Detailed error information (optional)
 */
export const errorResponse = (res, message, statusCode = 500, errors = null) => {
  return res.status(statusCode).json({
    success: false,
    message,
    errors,
  });
};

/**
 * Sends a paginated API response.
 * @param {Object} res - Express response object
 * @param {Array} data - The paginated payload
 * @param {Number} total - Total number of items
 * @param {Number} page - Current page number
 * @param {Number} limit - Number of items per page
 */
export const paginatedResponse = (res, data, total, page, limit) => {
  return res.status(200).json({
    success: true,
    data,
    pagination: {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    },
  });
};
