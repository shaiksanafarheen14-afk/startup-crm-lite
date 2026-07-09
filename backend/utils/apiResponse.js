/**
 * Helper utility for sending successful API responses consistently.
 * 
 * @param {Object} res - Express response object
 * @param {any} data - The payload to send back to the client
 * @param {string} message - A success message describing the action
 * @param {number} [statusCode=200] - HTTP status code (defaults to 200)
 */
export const successResponse = (res, data, message, statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data
  });
};

/**
 * Helper utility for sending error API responses consistently.
 * 
 * @param {Object} res - Express response object
 * @param {string} message - Main error message
 * @param {number} [statusCode=500] - HTTP status code (defaults to 500)
 * @param {any} [errors=null] - Additional detailed error information (e.g., validation errors)
 */
export const errorResponse = (res, message, statusCode = 500, errors = null) => {
  return res.status(statusCode).json({
    success: false,
    message,
    errors
  });
};

/**
 * Helper utility for sending paginated API responses.
 * 
 * @param {Object} res - Express response object
 * @param {Array} data - Array of paginated data items
 * @param {number} total - Total count of items across all pages
 * @param {number} page - Current page number
 * @param {number} limit - Number of items per page
 */
export const paginatedResponse = (res, data, total, page, limit) => {
  const parsedPage = parseInt(page, 10) || 1;
  const parsedLimit = parseInt(limit, 10) || 10;
  
  return res.status(200).json({
    success: true,
    data,
    pagination: {
      total,
      page: parsedPage,
      limit: parsedLimit,
      pages: Math.ceil(total / parsedLimit)
    }
  });
};
