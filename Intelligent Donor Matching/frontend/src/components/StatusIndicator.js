import React from 'react';
import { Wifi, WifiOff, Database, Activity, CheckCircle, AlertCircle, Loader } from 'lucide-react';

/**
 * Status Indicator Component
 * Shows real-time system health and connection status
 */
const StatusIndicator = ({ mlServiceStatus = 'connected', dbStatus = 'connected', isProcessing = false }) => {
    const getStatusColor = (status) => {
        switch (status) {
            case 'connected': return 'text-green-600 bg-green-100';
            case 'disconnected': return 'text-red-600 bg-red-100';
            case 'warning': return 'text-yellow-600 bg-yellow-100';
            default: return 'text-gray-600 bg-gray-100';
        }
    };

    const getStatusIcon = (service, status) => {
        if (service === 'ml') {
            return status === 'connected' ? <Activity className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />;
        }
        if (service === 'db') {
            return status === 'connected' ? <Database className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />;
        }
        return status === 'connected' ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />;
    };

    return (
        <div className="flex items-center gap-3 text-xs">
            {/* ML Service Status */}
            <div className={`flex items-center gap-1.5 px-2 py-1 rounded-full ${getStatusColor(mlServiceStatus)}`}>
                {getStatusIcon('ml', mlServiceStatus)}
                <span className="font-medium">ML Service</span>
                {mlServiceStatus === 'connected' && <CheckCircle className="w-3 h-3" />}
            </div>

            {/* Database Status */}
            <div className={`flex items-center gap-1.5 px-2 py-1 rounded-full ${getStatusColor(dbStatus)}`}>
                {getStatusIcon('db', dbStatus)}
                <span className="font-medium">Database</span>
                {dbStatus === 'connected' && <CheckCircle className="w-3 h-3" />}
            </div>

            {/* Processing Indicator */}
            {isProcessing && (
                <div className="flex items-center gap-1.5 px-2 py-1 rounded-full text-blue-600 bg-blue-100">
                    <Loader className="w-4 h-4 animate-spin" />
                    <span className="font-medium">Processing</span>
                </div>
            )}
        </div>
    );
};

export default StatusIndicator;
