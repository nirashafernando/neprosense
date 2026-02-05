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
            bgColor: 'bg-gradient-to-r from-emerald-50 to-teal-50',
            borderColor: 'border-emerald-500',
            textColor: 'text-emerald-900'
        },
        error: {
            icon: <XCircle className="w-5 h-5" />,
            bgColor: 'bg-gradient-to-r from-rose-50 to-red-50',
            borderColor: 'border-rose-500',
            textColor: 'text-rose-900'
        },
        warning: {
            icon: <AlertTriangle className="w-5 h-5" />,
            bgColor: 'bg-gradient-to-r from-amber-50 to-yellow-50',
            borderColor: 'border-amber-500',
            textColor: 'text-amber-900'
        },
        info: {
            icon: <Info className="w-5 h-5" />,
            bgColor: 'bg-gradient-to-r from-blue-50 to-sky-50',
            borderColor: 'border-blue-500',
            textColor: 'text-blue-900'
        }
    };

    const config = types[type] || types.info;

    return (
        <div
            className={`${config.bgColor} ${config.textColor} ${config.borderColor} border-l-4 rounded-xl shadow-xl border-2 p-4 min-w-80 max-w-md animate-slideIn flex items-start gap-3`}
        >
            <div className={`flex-shrink-0 mt-0.5 ${config.textColor}`}>
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
                className="flex-shrink-0 hover:bg-slate-200 hover:bg-opacity-50 rounded-full p-1 transition-all"
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

    const ToastComponent = React.useCallback(
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
