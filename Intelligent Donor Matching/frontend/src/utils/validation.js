/**
 * Frontend Validation Utilities
 * Client-side validation before API calls
 */

/**
 * Validate HLA typing format
 * @param {string} hlaString - HLA typing string
 * @returns {string|null} - Error message or null if valid
 */
export const validateHLA = (hlaString) => {
    if (!hlaString || hlaString.trim() === '') {
        return 'HLA typing is required';
    }

    // Remove extra spaces
    const cleaned = hlaString.trim().replace(/\s+/g, '');

    // Check format: should be 6 antigens separated by commas
    const pattern = /^[A-Z]+\d+,[A-Z]+\d+,[A-Z]+\d+,[A-Z]+\d+,[A-Z]+\d+,[A-Z]+\d+$/;
    if (!pattern.test(cleaned)) {
        return 'HLA format must be: A1,A2,B8,B44,DR1,DR4 (6 antigens separated by commas)';
    }

    const parts = cleaned.split(',');
    if (parts.length !== 6) {
        return 'HLA typing must have exactly 6 antigens (2 for A, 2 for B, 2 for DR)';
    }

    return null; // Valid
};

/**
 * Validate age
 * @param {number|string} age - Age value
 * @param {number} min - Minimum age
 * @param {number} max - Maximum age
 * @returns {string|null} - Error message or null if valid
 */
export const validateAge = (age, min = 1, max = 100) => {
    if (!age && age !== 0) {
        return 'Age is required';
    }

    const ageNum = parseInt(age);
    if (isNaN(ageNum)) {
        return 'Age must be a number';
    }

    if (ageNum < min || ageNum > max) {
        return `Age must be between ${min} and ${max}`;
    }

    return null;
};

/**
 * Validate blood group
 * @param {string} bloodGroup - Blood group
 * @returns {string|null} - Error message or null if valid
 */
export const validateBloodGroup = (bloodGroup) => {
    if (!bloodGroup || bloodGroup.trim() === '') {
        return 'Blood group is required';
    }

    const validGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
    if (!validGroups.includes(bloodGroup)) {
        return 'Invalid blood group. Must be one of: A+, A-, B+, B-, AB+, AB-, O+, O-';
    }

    return null;
};

/**
 * Validate email
 * @param {string} email - Email address
 * @returns {string|null} - Error message or null if valid
 */
export const validateEmail = (email) => {
    if (!email || email.trim() === '') {
        return 'Email is required';
    }

    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!pattern.test(email)) {
        return 'Invalid email format';
    }

    return null;
};

/**
 * Validate required field
 * @param {*} value - Field value
 * @param {string} fieldName - Field name for error message
 * @returns {string|null} - Error message or null if valid
 */
export const validateRequired = (value, fieldName) => {
    if (value === null || value === undefined || value === '') {
        return `${fieldName} is required`;
    }

    if (typeof value === 'string' && value.trim() === '') {
        return `${fieldName} is required`;
    }

    return null;
};

/**
 * Validate eGFR (kidney function)
 * @param {number|string} gfr - eGFR value
 * @returns {string|null} - Error message or null if valid
 */
export const validateGFR = (gfr) => {
    if (!gfr && gfr !== 0) {
        return 'eGFR is required';
    }

    const gfrNum = parseFloat(gfr);
    if (isNaN(gfrNum)) {
        return 'eGFR must be a number';
    }

    if (gfrNum < 0 || gfrNum > 200) {
        return 'eGFR must be between 0 and 200 ml/min';
    }

    return null;
};

/**
 * Validate BMI
 * @param {number|string} bmi - BMI value
 * @returns {string|null} - Error message or null if valid
 */
export const validateBMI = (bmi) => {
    if (!bmi && bmi !== 0) {
        return 'BMI is required';
    }

    const bmiNum = parseFloat(bmi);
    if (isNaN(bmiNum)) {
        return 'BMI must be a number';
    }

    if (bmiNum < 10 || bmiNum > 50) {
        return 'BMI must be between 10 and 50';
    }

    return null;
};

/**
 * Validate donor ID format
 * @param {string} donorId - Donor ID
 * @returns {string|null} - Error message or null if valid
 */
export const validateDonorId = (donorId) => {
    if (!donorId || donorId.trim() === '') {
        return 'Donor ID is required';
    }

    // Allow alphanumeric and hyphens
    const pattern = /^[A-Z0-9-]+$/i;
    if (!pattern.test(donorId)) {
        return 'Donor ID can only contain letters, numbers, and hyphens';
    }

    if (donorId.length < 3 || donorId.length > 20) {
        return 'Donor ID must be between 3 and 20 characters';
    }

    return null;
};

/**
 * Validate recipient ID format
 * @param {string} recipientId - Recipient ID
 * @returns {string|null} - Error message or null if valid
 */
export const validateRecipientId = (recipientId) => {
    if (!recipientId || recipientId.trim() === '') {
        return 'Recipient ID is required';
    }

    // Allow alphanumeric and hyphens
    const pattern = /^[A-Z0-9-]+$/i;
    if (!pattern.test(recipientId)) {
        return 'Recipient ID can only contain letters, numbers, and hyphens';
    }

    if (recipientId.length < 3 || recipientId.length > 20) {
        return 'Recipient ID must be between 3 and 20 characters';
    }

    return null;
};

/**
 * Format HLA string (remove spaces, uppercase)
 * @param {string} hlaString - HLA typing string
 * @returns {string} - Formatted HLA string
 */
export const formatHLA = (hlaString) => {
    if (!hlaString) return '';
    return hlaString.trim().replace(/\s+/g, '').toUpperCase();
};

/**
 * Get HLA example based on ethnicity (for help text)
 * @returns {string} - Example HLA string
 */
export const getHLAExample = () => {
    return 'A1,A2,B8,B44,DR1,DR4';
};

/**
 * Validate entire donor form
 * @param {Object} formData - Form data object
 * @returns {Object} - Object with field errors
 */
export const validateDonorForm = (formData) => {
    const errors = {};

    const donorIdError = validateDonorId(formData.donorId);
    if (donorIdError) errors.donorId = donorIdError;

    const ageError = validateAge(formData.age, 18, 70);
    if (ageError) errors.age = ageError;

    const bloodGroupError = validateBloodGroup(formData.bloodGroup);
    if (bloodGroupError) errors.bloodGroup = bloodGroupError;

    const hlaError = validateHLA(formData.hlaTyping);
    if (hlaError) errors.hlaTyping = hlaError;

    const gfrError = validateGFR(formData.gfr);
    if (gfrError) errors.gfr = gfrError;

    const bmiError = validateBMI(formData.bmi);
    if (bmiError) errors.bmi = bmiError;

    return errors;
};

/**
 * Validate entire recipient form
 * @param {Object} formData - Form data object
 * @returns {Object} - Object with field errors
 */
export const validateRecipientForm = (formData) => {
    const errors = {};

    const recipientIdError = validateRecipientId(formData.recipientId);
    if (recipientIdError) errors.recipientId = recipientIdError;

    const ageError = validateAge(formData.age, 1, 100);
    if (ageError) errors.age = ageError;

    const bloodGroupError = validateBloodGroup(formData.bloodGroup);
    if (bloodGroupError) errors.bloodGroup = bloodGroupError;

    const hlaError = validateHLA(formData.hlaTyping);
    if (hlaError) errors.hlaTyping = hlaError;

    return errors;
};
