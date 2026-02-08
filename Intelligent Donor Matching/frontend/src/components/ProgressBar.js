import React from 'react';

/**
 * Progress Bar Component
 * Shows processing progress with smooth animations
 */
const ProgressBar = ({ 
    progress = 0, 
    label = null, 
    showPercentage = true,
    color = 'medical',
    size = 'md',
    isIndeterminate = false 
}) => {
    const colorClasses = {
        medical: 'bg-medical-600',
        green: 'bg-green-600',
        blue: 'bg-blue-600',
        purple: 'bg-purple-600',
        red: 'bg-red-600',
        yellow: 'bg-yellow-600'
    };

    const sizeClasses = {
        sm: 'h-1',
        md: 'h-2',
        lg: 'h-3'
    };

    const bgColor = colorClasses[color] || colorClasses.medical;
    const height = sizeClasses[size] || sizeClasses.md;

    return (
        <div className="w-full">
            {(label || showPercentage) && (
                <div className="flex justify-between items-center mb-2">
                    {label && <span className="text-sm font-medium text-gray-700">{label}</span>}
                    {showPercentage && !isIndeterminate && (
                        <span className="text-sm font-semibold text-gray-900">{Math.round(progress)}%</span>
                    )}
                </div>
            )}
            
            <div className={`w-full bg-gray-200 rounded-full overflow-hidden ${height}`}>
                {isIndeterminate ? (
                    <div className={`h-full ${bgColor} animate-indeterminate`} style={{ width: '30%' }} />
                ) : (
                    <div
                        className={`h-full ${bgColor} transition-all duration-300 ease-out`}
                        style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
                    />
                )}
            </div>

            <style jsx>{`
                @keyframes indeterminate {
                    0% {
                        transform: translateX(-100%);
                    }
                    100% {
                        transform: translateX(400%);
                    }
                }
                .animate-indeterminate {
                    animation: indeterminate 1.5s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
};

export default ProgressBar;
