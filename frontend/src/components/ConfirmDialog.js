import React from 'react';
import { AlertTriangle, Trash2, Check, X, Info } from 'lucide-react';

/**
 * Reusable Confirmation Dialog Component
 * Replaces browser alerts with custom, user-friendly modals
 */
const ConfirmDialog = ({
    isOpen,
    onClose,
    onConfirm,
    title = 'Confirm Action',
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    type = 'warning', // 'warning', 'danger', 'info', 'success'
    showPreview = false,
    previewData = null,
    confirmButtonColor = null
}) => {
    if (!isOpen) return null;

    const icons = {
        warning: <AlertTriangle className="w-12 h-12 text-yellow-500" />,
        danger: <Trash2 className="w-12 h-12 text-red-500" />,
        info: <Info className="w-12 h-12 text-blue-500" />,
        success: <Check className="w-12 h-12 text-green-500" />
    };

    const buttonColors = {
        warning: confirmButtonColor || 'bg-yellow-600 hover:bg-yellow-700',
        danger: confirmButtonColor || 'bg-red-600 hover:bg-red-700',
        info: confirmButtonColor || 'bg-blue-600 hover:bg-blue-700',
        success: confirmButtonColor || 'bg-green-600 hover:bg-green-700'
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 animate-scaleIn">
                {/* Header */}
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                            {icons[type]}
                        </div>
                        <div className="flex-1">
                            <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
                            <p className="text-gray-600 text-sm leading-relaxed">{message}</p>
                        </div>
                    </div>
                </div>

                {/* Preview Section */}
                {showPreview && previewData && (
                    <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                            Preview of Action:
                        </h4>
                        <div className="bg-white rounded-lg p-3 border border-gray-200">
                            {Object.entries(previewData).map(([key, value]) => (
                                <div key={key} className="flex justify-between py-1 text-sm">
                                    <span className="text-gray-600 font-medium">{key}:</span>
                                    <span className="text-gray-900">{value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="p-6 flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
                    >
                        <X className="w-4 h-4" />
                        {cancelText}
                    </button>
                    <button
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                        className={`flex-1 px-6 py-3 ${buttonColors[type]} text-white font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105`}
                    >
                        <Check className="w-4 h-4" />
                        {confirmText}
                    </button>
                </div>
            </div>

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes scaleIn {
                    from {
                        opacity: 0;
                        transform: scale(0.9);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1);
                    }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.2s ease-out;
                }
                .animate-scaleIn {
                    animation: scaleIn 0.3s ease-out;
                }
            `}</style>
        </div>
    );
};

export default ConfirmDialog;
