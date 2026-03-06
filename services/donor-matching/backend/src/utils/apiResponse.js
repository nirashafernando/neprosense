/**
 * Standardized API Response Utility
 * Provides consistent response format across all API endpoints
 */

class ApiResponse {
    /**
     * Send success response
     * @param {Object} res - Express response object
     * @param {*} data - Response data
     * @param {string} message - Success message
     * @param {number} statusCode - HTTP status code (default: 200)
     */
    static success(res, data, message = 'Success', statusCode = 200) {
        return res.status(statusCode).json({
            success: true,
            message,
            data,
            timestamp: new Date().toISOString()
        });
    }

    /**
     * Send error response
     * @param {Object} res - Express response object
     * @param {string} message - Error message
     * @param {number} statusCode - HTTP status code (default: 500)
     * @param {*} errors - Additional error details
     */
    static error(res, message, statusCode = 500, errors = null) {
        return res.status(statusCode).json({
            success: false,
            message,
            errors,
            timestamp: new Date().toISOString()
        });
    }

    /**
     * Send validation error response
     * @param {Object} res - Express response object
     * @param {Array} errors - Validation errors
     */
    static validationError(res, errors) {
        return this.error(res, 'Validation failed', 400, errors);
    }

    /**
     * Send not found response
     * @param {Object} res - Express response object
     * @param {string} resource - Resource name
     */
    static notFound(res, resource = 'Resource') {
        return this.error(res, `${resource} not found`, 404);
    }

    /**
     * Send unauthorized response
     * @param {Object} res - Express response object
     * @param {string} message - Unauthorized message
     */
    static unauthorized(res, message = 'Unauthorized access') {
        return this.error(res, message, 401);
    }

    /**
     * Send forbidden response
     * @param {Object} res - Express response object
     * @param {string} message - Forbidden message
     */
    static forbidden(res, message = 'Access forbidden') {
        return this.error(res, message, 403);
    }

    /**
     * Send conflict response
     * @param {Object} res - Express response object
     * @param {string} message - Conflict message
     */
    static conflict(res, message = 'Resource already exists') {
        return this.error(res, message, 409);
    }

    /**
     * Send service unavailable response
     * @param {Object} res - Express response object
     * @param {string} message - Service unavailable message
     */
    static serviceUnavailable(res, message = 'Service temporarily unavailable') {
        return this.error(res, message, 503);
    }
}

module.exports = ApiResponse;
