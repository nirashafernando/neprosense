/**
 * Centralized Error Messages
 * User-friendly error messages for consistent UX
 */

module.exports = {
    // Authentication errors
    AUTH: {
        INVALID_CREDENTIALS: 'Invalid email or password. Please try again.',
        UNAUTHORIZED: 'You are not authorized to perform this action.',
        TOKEN_EXPIRED: 'Your session has expired. Please log in again.',
        TOKEN_INVALID: 'Invalid authentication token. Please log in again.',
        ACCOUNT_LOCKED: 'Your account has been locked. Please contact support.',
        ACCOUNT_NOT_FOUND: 'No account found with this email address.',
        WEAK_PASSWORD: 'Password must be at least 8 characters with uppercase, lowercase, and numbers.',
    },

    // Validation errors
    VALIDATION: {
        INVALID_HLA: 'HLA typing format is invalid. Expected format: A1,A2,B8,B44,DR1,DR4 (6 antigens separated by commas)',
        INVALID_BLOOD_GROUP: 'Blood group must be one of: A+, A-, B+, B-, AB+, AB-, O+, O-',
        AGE_OUT_OF_RANGE: 'Age must be between {min} and {max} years',
        INVALID_EMAIL: 'Please enter a valid email address',
        REQUIRED_FIELD: '{field} is required',
        INVALID_FORMAT: '{field} format is invalid',
        VALUE_TOO_LONG: '{field} is too long (maximum {max} characters)',
        VALUE_TOO_SHORT: '{field} is too short (minimum {min} characters)',
    },

    // Resource errors
    RESOURCE: {
        NOT_FOUND: '{resource} not found',
        ALREADY_EXISTS: '{resource} with this ID already exists',
        CANNOT_DELETE: 'Cannot delete {resource} because it is referenced by other records',
        CANNOT_UPDATE: 'Cannot update {resource}. Please check your data and try again.',
        CREATION_FAILED: 'Failed to create {resource}. Please try again.',
    },

    // Donor/Recipient errors
    DONOR: {
        NOT_FOUND: 'Donor not found. Please check the donor ID.',
        ALREADY_EXISTS: 'A donor with this ID already exists.',
        INVALID_DATA: 'Donor data is invalid. Please check all required fields.',
        MISSING_HLA: 'Donor HLA typing is required for matching predictions.',
    },

    RECIPIENT: {
        NOT_FOUND: 'Recipient not found. Please check the recipient ID.',
        ALREADY_EXISTS: 'A recipient with this ID already exists.',
        INVALID_DATA: 'Recipient data is invalid. Please check all required fields.',
        MISSING_HLA: 'Recipient HLA typing is required for matching predictions.',
    },

    // Prediction errors
    PREDICTION: {
        NO_COMPATIBLE_DONORS: 'No compatible donors found for this recipient. Try adjusting compatibility criteria.',
        ML_SERVICE_ERROR: 'Unable to process prediction. The ML service is temporarily unavailable. Please try again in a few moments.',
        ML_SERVICE_TIMEOUT: 'Prediction request timed out. Please try again with fewer donors.',
        INVALID_DONOR_DATA: 'One or more donors have invalid or missing data. Please verify all donor records have complete information.',
        INVALID_RECIPIENT_DATA: 'Recipient data is invalid or incomplete. Please verify the recipient record.',
        MISSING_HLA_DATA: 'HLA typing data is missing for some donors or recipients. Please update the records with HLA information.',
        NO_DONORS_SELECTED: 'Please select at least one donor for matching analysis.',
        PREDICTION_NOT_FOUND: 'Prediction record not found.',
        ALREADY_PROCESSING: 'A prediction is already being processed for this recipient. Please wait for it to complete.',
    },

    // Database errors
    DATABASE: {
        CONNECTION_ERROR: 'Database connection error. Please try again.',
        QUERY_ERROR: 'Database query failed. Please try again.',
        TRANSACTION_ERROR: 'Database transaction failed. Please try again.',
    },

    // General errors
    GENERAL: {
        SERVER_ERROR: 'An unexpected error occurred. Please try again later.',
        NETWORK_ERROR: 'Network error. Please check your connection and try again.',
        TIMEOUT: 'Request timed out. Please try again.',
        INVALID_REQUEST: 'Invalid request. Please check your input and try again.',
        RATE_LIMIT: 'Too many requests. Please wait a moment and try again.',
    },

    // File upload errors
    FILE: {
        TOO_LARGE: 'File is too large. Maximum size is {max}MB.',
        INVALID_TYPE: 'Invalid file type. Allowed types: {types}',
        UPLOAD_FAILED: 'File upload failed. Please try again.',
    },
};
