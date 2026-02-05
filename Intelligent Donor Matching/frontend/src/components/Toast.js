import React, { useEffect } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';

/**
 * Toast Notification Component
 * Replaces browser alerts with elegant toast notifications
 */
const Toast = ({ message, type = 'info', duration = 3000, onClose, action }) => {
    useEffect(() => {
        if (duration > 0) {
            const timer = setTimeout(onClose, duration);
            return () => clearTimeout(timer);
        }
    }, [duration, onClose]);

    const types = {
        success: {
            icon: <CheckCircle className="w-5 h-5" />,
            bgColor: 'bg-green-500',
            borderColor: 'border-green-600',
            textColor: 'text-white'
        },
        error: {
            icon: <XCircle className="w-5 h-5" />,
            bgColor: 'bg-red-500',
            borderColor: 'border-red-600',
            textColor: 'text-white'
        },
        warning: {
            icon: <AlertTriangle className="w-5 h-5" />,
            bgColor: 'bg-yellow-500',
            borderColor: 'border-yellow-600',
            textColor: 'text-white'
        },
        info: {
            icon: <Info className="w-5 h-5" />,
            bgColor: 'bg-blue-500',
            borderColor: 'border-blue-600',
            textColor: 'text-white'
        }
    };

    const config = types[type] || types.info;

    return (
        <div
            className={`${config.bgColor} ${config.textColor} ${config.borderColor} border-l-4 rounded-lg shadow-2xl p-4 min-w-80 max-w-md animate-slideIn flex items-start gap-3`}
        >
            <div className="flex-shrink-0 mt-0.5">
                {config.icon}
            </div>
            <div className="flex-1">
                <p className="font-medium text-sm leading-relaxed">{message}</p>
                {action && (
                    <button
                        onClick={action.onClick}
                        className="mt-2 text-xs font-semibold underline hover:no-underline"
                    >
                        {action.label}
                    </button>
                )}
            </div>
            <button
                onClick={onClose}
                className="flex-shrink-0 hover:bg-white hover:bg-opacity-20 rounded-full p-1 transition-all"
            >
                <X className="w-4 h-4" />
            </button>

            <style jsx>{`
                @keyframes slideIn {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
                .animate-slideIn {
                    animation: slideIn 0.3s ease-out;
                }
            `}</style>
        </div>
    );
};

/**
 * Toast Container Component
 * Manages multiple toasts
 */
export const ToastContainer = ({ toasts, removeToast }) => {
    return (
        <div className="fixed top-4 right-4 z-50 flex flex-col gap-3">
            {toasts.map((toast) => (
                <Toast
                    key={toast.id}
                    message={toast.message}
                    type={toast.type}
                    duration={toast.duration}
                    action={toast.action}
                    onClose={() => removeToast(toast.id)}
                />
            ))}
        </div>
    );
};

/**
 * Toast Hook for easy usage
 */
export const useToast = () => {
    const [toasts, setToasts] = React.useState([]);

    const showToast = React.useCallback((message, type = 'info', duration = 3000, action = null) => {
        const id = Date.now() + Math.random();
        setToasts(prev => [...prev, { id, message, type, duration, action }]);
    }, []);

    const removeToast = React.useCallback((id) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    }, []);

    const ToastComponent = React.useMemo(
        () => <ToastContainer toasts={toasts} removeToast={removeToast} />,
        [toasts, removeToast]
    );

    return {
        showToast,
        showSuccess: (msg, duration) => showToast(msg, 'success', duration),
        showError: (msg, duration, action) => showToast(msg, 'error', duration, action),
        showWarning: (msg, duration) => showToast(msg, 'warning', duration),
        showInfo: (msg, duration) => showToast(msg, 'info', duration),
        ToastComponent
    };
};

export default Toast;
