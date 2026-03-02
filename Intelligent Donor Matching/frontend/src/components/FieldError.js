import React from 'react';
import { AlertCircle } from 'lucide-react';

/**
 * Renders an inline validation error below a form field.
 */
const FieldError = ({ message }) => {
    if (!message) return null;
    return (
        <div className="flex items-center gap-1.5 mt-1.5">
            <AlertCircle className="w-3.5 h-3.5 text-rose-500 flex-shrink-0" />
            <p className="text-xs text-rose-600 font-medium">{message}</p>
        </div>
    );
};

/**
 * Returns className string for an input based on error state.
 * @param {string|null} error   - current error string or null
 * @param {boolean}     touched - whether the field has been interacted with
 * @param {string}      base    - base className (without border color)
 * @param {string}      focusRing - the focus-ring colour class (e.g. 'focus:ring-green-500')
 */
export const inputClass = (error, touched, base = '', focusRing = 'focus:ring-green-500 focus:border-green-500') => {
    const borderColor = !touched
        ? 'border-gray-300'
        : error
            ? 'border-rose-400 bg-rose-50'
            : 'border-emerald-400 bg-emerald-50/30';
    return `${base} ${borderColor} ${focusRing}`;
};

export default FieldError;
