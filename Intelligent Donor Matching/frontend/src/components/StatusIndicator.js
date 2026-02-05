import React from 'react';
import { Wifi, WifiOff, Database, Activity, CheckCircle, AlertCircle, Loader } from 'lucide-react';

/**
 * Status Indicator Component
 * Shows real-time system health and connection status
 */
const StatusIndicator = ({ mlServiceStatus = 'disconnected', dbStatus = 'disconnected', isProcessing = false }) => {
    const getStatusColor = (status) => {
        switch (status) {
            case 'connected': return 'text-emerald-700 bg-emerald-100 border-emerald-300';
            case 'disconnected': return 'text-rose-700 bg-rose-100 border-rose-300';
            case 'warning': return 'text-amber-700 bg-amber-100 border-amber-300';
            default: return 'text-slate-700 bg-slate-100 border-slate-300';
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

    const getStatusText = (status) => {
        return status === 'connected' ? 'Connected' : 'Offline';
    };

    return (
        <div className="flex items-center gap-2 text-xs bg-white rounded-xl shadow-lg border border-slate-200 p-2">
            {/* ML Service Status */}
            <div className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border ${getStatusColor(mlServiceStatus)}`}>
                {getStatusIcon('ml', mlServiceStatus)}
                <span className="font-semibold">ML Service</span>
                {mlServiceStatus === 'connected' ? (
                    <CheckCircle className="w-3.5 h-3.5" />
                ) : (
                    <div className="w-2 h-2 rounded-full bg-rose-600 animate-pulse"></div>
                )}
            </div>

            {/* Database Status */}
            <div className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border ${getStatusColor(dbStatus)}`}>
                {getStatusIcon('db', dbStatus)}
                <span className="font-semibold">Database</span>
                {dbStatus === 'connected' ? (
                    <CheckCircle className="w-3.5 h-3.5" />
                ) : (
                    <div className="w-2 h-2 rounded-full bg-rose-600 animate-pulse"></div>
                )}
            </div>

            {/* Processing Indicator */}
            {isProcessing && (
                <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-blue-700 bg-blue-100 border-blue-300">
                    <Loader className="w-4 h-4 animate-spin" />
                    <span className="font-semibold">Processing</span>
                </div>
            )}
        </div>
    );
};

export default StatusIndicator;
