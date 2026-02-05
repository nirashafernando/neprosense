import React, { useState } from 'react';
import { HelpCircle, Info } from 'lucide-react';

/**
 * Medical Tooltip Component
 * Provides interactive tooltips with medical term explanations
 */
const MedicalTooltip = ({ term, children, position = 'top' }) => {
    const [isVisible, setIsVisible] = useState(false);

    const medicalTerms = {
        'HLA': {
            title: 'Human Leukocyte Antigen (HLA)',
            description: 'Proteins on cell surfaces that help the immune system distinguish between self and non-self. Higher HLA matches (6/6 is perfect) reduce rejection risk.',
            importance: 'Critical Factor'
        },
        'eGFR': {
            title: 'Estimated Glomerular Filtration Rate (eGFR)',
            description: 'Measures how well kidneys filter blood. Normal is ≥90 mL/min/1.73m². Lower values indicate reduced kidney function.',
            importance: 'Very Important'
        },
        'BMI': {
            title: 'Body Mass Index (BMI)',
            description: 'Weight-to-height ratio. Optimal range is 18.5-24.9. Extreme values increase surgical complications.',
            importance: 'Important'
        },
        'Crossmatch': {
            title: 'Crossmatch Test',
            description: 'Laboratory test mixing donor and recipient blood to check for immune reactions. Negative crossmatch is required for transplant.',
            importance: 'Absolute Requirement'
        },
        'PRA': {
            title: 'Panel Reactive Antibody (PRA)',
            description: 'Percentage of donor population recipient has antibodies against. Lower PRA (0-10%) is better for finding compatible donors.',
            importance: 'Very Important'
        },
        'SHAP': {
            title: 'SHapley Additive exPlanations',
            description: 'AI explainability method showing how each factor contributes to the compatibility score. Positive values increase compatibility.',
            importance: 'Informational'
        },
        'Blood Compatibility': {
            title: 'ABO Blood Type Compatibility',
            description: 'Donor and recipient blood types must be compatible. O is universal donor, AB is universal recipient.',
            importance: 'Absolute Requirement'
        },
        'Immunosuppression': {
            title: 'Immunosuppressive Therapy',
            description: 'Medications that suppress immune system to prevent rejection. Required lifelong after transplant.',
            importance: 'Post-Transplant Care'
        },
        'CIT': {
            title: 'Cold Ischemia Time',
            description: 'Time kidney is preserved outside body. Shorter CIT (<24 hours) improves outcomes.',
            importance: 'Important'
        },
        'Diabetes': {
            title: 'Diabetes Mellitus',
            description: 'Chronic condition affecting blood sugar. Can impact kidney function and surgical risk.',
            importance: 'Risk Factor'
        },
        'Hypertension': {
            title: 'High Blood Pressure',
            description: 'Chronic elevated blood pressure. Can damage kidneys over time and affect transplant outcomes.',
            importance: 'Risk Factor'
        }
    };

    const tooltipData = medicalTerms[term] || {
        title: term,
        description: 'Medical term explanation not available.',
        importance: 'Unknown'
    };

    const positionClasses = {
        top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
        bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
        left: 'right-full top-1/2 -translate-y-1/2 mr-2',
        right: 'left-full top-1/2 -translate-y-1/2 ml-2'
    };

    const importanceColors = {
        'Absolute Requirement': 'bg-red-100 text-red-700 border-red-300',
        'Critical Factor': 'bg-orange-100 text-orange-700 border-orange-300',
        'Very Important': 'bg-yellow-100 text-yellow-700 border-yellow-300',
        'Important': 'bg-blue-100 text-blue-700 border-blue-300',
        'Risk Factor': 'bg-purple-100 text-purple-700 border-purple-300',
        'Informational': 'bg-gray-100 text-gray-700 border-gray-300',
        'Post-Transplant Care': 'bg-green-100 text-green-700 border-green-300',
        'Unknown': 'bg-gray-100 text-gray-700 border-gray-300'
    };

    return (
        <div className="relative inline-block">
            <span
                className="inline-flex items-center gap-1 cursor-help border-b border-dotted border-medical-400 text-medical-600"
                onMouseEnter={() => setIsVisible(true)}
                onMouseLeave={() => setIsVisible(false)}
                onClick={() => setIsVisible(!isVisible)}
            >
                {children}
                <HelpCircle className="w-3.5 h-3.5 text-medical-500" />
            </span>

            {isVisible && (
                <div
                    className={`absolute ${positionClasses[position]} z-50 w-80 animate-fadeIn`}
                    style={{ animation: 'fadeIn 0.2s ease-in-out' }}
                >
                    <div className="bg-white rounded-lg shadow-2xl border-2 border-medical-200 overflow-hidden">
                        {/* Header */}
                        <div className="bg-gradient-to-r from-medical-600 to-teal-600 px-4 py-3 text-white">
                            <div className="flex items-start gap-2">
                                <Info className="w-5 h-5 mt-0.5 flex-shrink-0" />
                                <div>
                                    <h4 className="font-bold text-sm leading-tight">{tooltipData.title}</h4>
                                </div>
                            </div>
                        </div>

                        {/* Body */}
                        <div className="px-4 py-3">
                            <p className="text-sm text-gray-700 leading-relaxed mb-3">
                                {tooltipData.description}
                            </p>

                            {/* Importance Badge */}
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-gray-500 font-medium">Clinical Importance:</span>
                                <span className={`text-xs font-semibold px-2 py-1 rounded-full border ${importanceColors[tooltipData.importance]}`}>
                                    {tooltipData.importance}
                                </span>
                            </div>
                        </div>

                        {/* Arrow */}
                        <div
                            className={`absolute w-3 h-3 bg-white border-2 border-medical-200 transform rotate-45 ${
                                position === 'top' ? 'top-full left-1/2 -translate-x-1/2 -translate-y-1/2' :
                                position === 'bottom' ? 'bottom-full left-1/2 -translate-x-1/2 translate-y-1/2' :
                                position === 'left' ? 'left-full top-1/2 -translate-x-1/2 -translate-y-1/2' :
                                'right-full top-1/2 translate-x-1/2 -translate-y-1/2'
                            }`}
                        />
                    </div>
                </div>
            )}

            <style jsx>{`
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(-5px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
        </div>
    );
};

export default MedicalTooltip;
