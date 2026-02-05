/**
 * Form Validation Utilities
 * Provides real-time validation with user-friendly error messages
 */

export const validators = {
    // Email validation
    email: (value) => {
        if (!value) return 'Email is required';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) return 'Please enter a valid email address';
        return null;
    },

    // Required field validation
    required: (fieldName) => (value) => {
        if (!value || value.toString().trim() === '') {
            return `${fieldName} is required`;
        }
        return null;
    },

    // Number range validation
    numberRange: (min, max, fieldName) => (value) => {
        if (value === '' || value === null || value === undefined) {
            return `${fieldName} is required`;
        }
        const num = parseFloat(value);
        if (isNaN(num)) return `${fieldName} must be a number`;
        if (num < min || num > max) {
            return `${fieldName} must be between ${min} and ${max}`;
        }
        return null;
    },

    // HLA validation (format: A1,A2,B7,B8,DR3,DR4)
    hla: (value) => {
        if (!value) return 'HLA typing is required';
        const antigens = value.split(',').map(a => a.trim()).filter(a => a);
        if (antigens.length !== 6) {
            return 'HLA must contain exactly 6 antigens (e.g., A1,A2,B7,B8,DR3,DR4)';
        }
        const validPattern = /^[A-Z]+\d+$/;
        for (const antigen of antigens) {
            if (!validPattern.test(antigen)) {
                return `Invalid HLA antigen format: ${antigen}. Use format like A1, B7, DR3`;
            }
        }
        return null;
    },

    // Blood group validation
    bloodGroup: (value) => {
        if (!value) return 'Blood group is required';
        const validGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
        if (!validGroups.includes(value)) {
            return 'Please select a valid blood group';
        }
        return null;
    },

    // Age validation (18-80 for donors/recipients)
    age: (value) => {
        if (!value) return 'Age is required';
        const age = parseInt(value);
        if (isNaN(age)) return 'Age must be a number';
        if (age < 18) return 'Age must be at least 18 years';
        if (age > 80) return 'Age must be 80 years or less';
        return null;
    },

    // eGFR validation (0-150 typical range)
    egfr: (value) => {
        if (!value && value !== 0) return 'eGFR is required';
        const gfr = parseFloat(value);
        if (isNaN(gfr)) return 'eGFR must be a number';
        if (gfr < 0) return 'eGFR cannot be negative';
        if (gfr > 150) return 'eGFR value seems unusually high. Please verify.';
        return null;
    },

    // BMI validation (12-50 typical range)
    bmi: (value) => {
        if (!value) return 'BMI is required';
        const bmi = parseFloat(value);
        if (isNaN(bmi)) return 'BMI must be a number';
        if (bmi < 12) return 'BMI value seems too low. Please verify.';
        if (bmi > 50) return 'BMI value seems too high. Please verify.';
        return null;
    },

    // Phone number validation
    phone: (value) => {
        if (!value) return null; // Optional field
        const phoneRegex = /^[\d\s\-\+\(\)]+$/;
        if (!phoneRegex.test(value)) {
            return 'Please enter a valid phone number';
        }
        const digitsOnly = value.replace(/\D/g, '');
        if (digitsOnly.length < 10) {
            return 'Phone number should have at least 10 digits';
        }
        return null;
    },

    // Donor ID validation
    donorId: (value) => {
        if (!value) return 'Donor ID is required';
        const idRegex = /^D\d{3,}$/;
        if (!idRegex.test(value)) {
            return 'Donor ID must start with "D" followed by numbers (e.g., D001)';
        }
        return null;
    },

    // Recipient ID validation
    recipientId: (value) => {
        if (!value) return 'Recipient ID is required';
        const idRegex = /^R\d{3,}$/;
        if (!idRegex.test(value)) {
            return 'Recipient ID must start with "R" followed by numbers (e.g., R001)';
        }
        return null;
    }
};

/**
 * Validate a single field
 */
export const validateField = (value, validatorFn) => {
    if (typeof validatorFn !== 'function') return null;
    return validatorFn(value);
};

/**
 * Validate an entire form
 */
export const validateForm = (formData, validationRules) => {
    const errors = {};
    let isValid = true;

    Object.keys(validationRules).forEach(field => {
        const error = validateField(formData[field], validationRules[field]);
        if (error) {
            errors[field] = error;
            isValid = false;
        }
    });

    return { isValid, errors };
};

/**
 * Get user-friendly error messages with actionable suggestions
 */
export const getErrorMessage = (error, context = {}) => {
    const errorMessages = {
        // Network errors
        'Network Error': {
            message: 'Unable to connect to the server',
            suggestion: 'Please check your internet connection and try again',
            action: 'Retry'
        },
        'timeout': {
            message: 'Request timed out',
            suggestion: 'The server is taking too long to respond. Please try again',
            action: 'Retry'
        },

        // Authentication errors
        '401': {
            message: 'Authentication failed',
            suggestion: 'Your session may have expired. Please log in again',
            action: 'Go to Login'
        },
        '403': {
            message: 'Access denied',
            suggestion: 'You don\'t have permission to perform this action',
            action: 'Contact Admin'
        },

        // Validation errors
        '400': {
            message: 'Invalid data provided',
            suggestion: 'Please check all fields and try again',
            action: 'Review Form'
        },
        '422': {
            message: 'Validation failed',
            suggestion: 'Some fields contain invalid data. Please correct them',
            action: 'Check Fields'
        },

        // Server errors
        '500': {
            message: 'Server error occurred',
            suggestion: 'Something went wrong on our end. Please try again later',
            action: 'Retry Later'
        },
        '503': {
            message: 'Service temporarily unavailable',
            suggestion: 'The ML prediction service is currently down. Please try again in a few minutes',
            action: 'Retry in 5 mins'
        },

        // Database errors
        'duplicate': {
            message: 'This record already exists',
            suggestion: `A ${context.type || 'record'} with this ${context.field || 'ID'} already exists`,
            action: 'Use Different ID'
        },

        // Default
        'default': {
            message: 'An unexpected error occurred',
            suggestion: 'Please try again or contact support if the problem persists',
            action: 'Retry'
        }
    };

    // Match error pattern
    const errorKey = Object.keys(errorMessages).find(key =>
        error.toString().toLowerCase().includes(key.toLowerCase())
    );

    return errorMessages[errorKey] || errorMessages.default;
};

/**
 * Auto-save functionality
 */
export class FormAutoSave {
    constructor(saveCallback, delay = 2000) {
        this.saveCallback = saveCallback;
        this.delay = delay;
        this.timeoutId = null;
        this.lastSaved = null;
    }

    trigger(formData) {
        clearTimeout(this.timeoutId);
        this.timeoutId = setTimeout(() => {
            this.saveCallback(formData);
            this.lastSaved = new Date();
        }, this.delay);
    }

    forceSave(formData) {
        clearTimeout(this.timeoutId);
        this.saveCallback(formData);
        this.lastSaved = new Date();
    }

    getLastSavedTime() {
        return this.lastSaved;
    }

    destroy() {
        clearTimeout(this.timeoutId);
    }
}
