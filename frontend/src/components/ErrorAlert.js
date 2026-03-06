import React from 'react';
import { AlertTriangle, X, Info, AlertCircle } from 'lucide-react';

/**
 * ErrorAlert Component
 * Displays consistent error/warning/info messages across the app
 */
const ErrorAlert = ({ message, onClose, type = 'error', className = '' }) => {
    if (!message) return null;

    const config = {
        error: {
            bg: 'bg-red-50',
            border: 'border-red-200',
            text: 'text-red-800',
            icon: AlertCircle,
            iconColor: 'text-red-600',
        },
        warning: {
            bg: 'bg-yellow-50',
            border: 'border-yellow-200',
            text: 'text-yellow-800',
            icon: AlertTriangle,
            iconColor: 'text-yellow-600',
        },
        info: {
            bg: 'bg-blue-50',
            border: 'border-blue-200',
            text: 'text-blue-800',
            icon: Info,
            iconColor: 'text-blue-600',
        },
        success: {
            bg: 'bg-green-50',
            border: 'border-green-200',
            text: 'text-green-800',
            icon: Info,
            iconColor: 'text-green-600',
        },
    };

    const { bg, border, text, icon: Icon, iconColor } = config[type] || config.error;

    return (
        <div className={`${bg} border ${border} rounded-lg p-4 mb-4 ${className}`}>
            <div className="flex items-start gap-3">
                <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${iconColor}`} />
                <div className="flex-1">
                    <p className={`font-medium ${text}`}>{message}</p>
                </div>
                {onClose && (
                    <button
                        onClick={onClose}
                        className={`flex-shrink-0 hover:opacity-70 transition-opacity ${text}`}
                        aria-label="Close alert"
                    >
                        <X className="w-5 h-5" />
                    </button>
                )}
            </div>
        </div>
    );
};

export default ErrorAlert;
