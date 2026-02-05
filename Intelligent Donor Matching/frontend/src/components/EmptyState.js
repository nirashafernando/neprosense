import React from 'react';
import { FileQuestion, UserPlus, Users, FileText, Activity } from 'lucide-react';

/**
 * Empty State Component
 * Displays helpful messages and CTAs when there's no data
 */
const EmptyState = ({ type, onAction, actionLabel }) => {
    const emptyStates = {
        donors: {
            icon: Users,
            title: 'No Donors Yet',
            description: 'Start building your donor registry by adding your first donor profile.',
            subtext: 'Add donor medical records including HLA typing, blood group, and health data.',
            actionLabel: actionLabel || 'Add First Donor',
            gradient: 'from-green-500 to-emerald-600'
        },
        recipients: {
            icon: UserPlus,
            title: 'No Recipients Yet',
            description: 'Begin by adding recipient profiles to find compatible donor matches.',
            subtext: 'Include medical history, HLA typing, and urgency level for accurate matching.',
            actionLabel: actionLabel || 'Add First Recipient',
            gradient: 'from-purple-500 to-pink-600'
        },
        predictions: {
            icon: Activity,
            title: 'No Predictions Yet',
            description: 'Run your first AI-powered compatibility analysis.',
            subtext: 'Select a recipient and donors to get compatibility scores and risk assessments.',
            actionLabel: actionLabel || 'Make Prediction',
            gradient: 'from-blue-500 to-cyan-600'
        },
        reports: {
            icon: FileText,
            title: 'No Reports Generated',
            description: 'Your prediction reports will appear here.',
            subtext: 'Run predictions to generate detailed compatibility reports with SHAP explanations.',
            actionLabel: actionLabel || 'View Predictions',
            gradient: 'from-orange-500 to-red-600'
        },
        searchResults: {
            icon: FileQuestion,
            title: 'No Results Found',
            description: 'We couldn\'t find any matches for your search.',
            subtext: 'Try adjusting your search criteria or filters.',
            actionLabel: null,
            gradient: 'from-gray-500 to-slate-600'
        }
    };

    const state = emptyStates[type] || emptyStates.searchResults;
    const Icon = state.icon;

    return (
        <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className={`bg-gradient-to-br ${state.gradient} p-6 rounded-full mb-6 shadow-lg`}>
                <Icon className="w-16 h-16 text-white" strokeWidth={1.5} />
            </div>
            
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {state.title}
            </h3>
            
            <p className="text-gray-600 text-center mb-2 max-w-md">
                {state.description}
            </p>
            
            <p className="text-gray-500 text-sm text-center mb-6 max-w-md">
                {state.subtext}
            </p>

            {state.actionLabel && onAction && (
                <button
                    onClick={onAction}
                    className={`bg-gradient-to-r ${state.gradient} hover:opacity-90 text-white px-6 py-3 rounded-lg font-medium transition-all shadow-md hover:shadow-lg flex items-center gap-2`}
                >
                    <Icon className="w-5 h-5" />
                    {state.actionLabel}
                </button>
            )}

            {!onAction && type === 'searchResults' && (
                <div className="mt-4 text-sm text-gray-500 space-y-1">
                    <p>• Try different search terms</p>
                    <p>• Check spelling and filters</p>
                    <p>• Clear filters to see all results</p>
                </div>
            )}
        </div>
    );
};

export default EmptyState;
