import React, { useState, useEffect, useRef } from 'react';
import { HelpCircle, Info } from 'lucide-react';

/**
 * Medical Tooltip Component
 * Provides interactive tooltips with medical term explanations
 */
const MedicalTooltip = ({ term, children, position = 'top' }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
    const triggerRef = useRef(null);

    useEffect(() => {
        if (isVisible && triggerRef.current) {
            const rect = triggerRef.current.getBoundingClientRect();
            const scrollY = window.scrollY || window.pageYOffset;
            const scrollX = window.scrollX || window.pageXOffset;

            let top = 0;
            let left = 0;

            // Calculate position based on prop
            switch (position) {
                case 'top':
                    top = rect.top + scrollY - 10; // Position above, with offset
                    left = rect.left + scrollX + rect.width / 2;
                    break;
                case 'bottom':
                    top = rect.bottom + scrollY + 10;
                    left = rect.left + scrollX + rect.width / 2;
                    break;
                case 'left':
                    top = rect.top + scrollY + rect.height / 2;
                    left = rect.left + scrollX - 10;
                    break;
                case 'right':
                    top = rect.top + scrollY + rect.height / 2;
                    left = rect.right + scrollX + 10;
                    break;
                default:
                    top = rect.top + scrollY - 10;
                    left = rect.left + scrollX + rect.width / 2;
            }

            setTooltipPosition({ top, left });
        }
    }, [isVisible, position]);

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
        'Blood Group': {
            title: 'ABO Blood Group',
            description: 'Blood type classification (A, B, AB, O with +/-). Must be compatible between donor and recipient for safe transplantation.',
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
        },
        'Comorbidities': {
            title: 'Health Comorbidities',
            description: 'Pre-existing health conditions (diabetes, hypertension, smoking) that may affect surgical outcomes and long-term transplant success.',
            importance: 'Risk Factor'
        },
        'Age': {
            title: 'Donor/Recipient Age',
            description: 'Younger donors (18-40 years) are generally associated with better long-term transplant outcomes and graft survival.',
            importance: 'Very Important'
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
        <div className="relative inline-block" style={{ display: 'inline' }}>
            <span
                ref={triggerRef}
                className="inline-flex items-center gap-1 cursor-help border-b border-dotted border-medical-400 text-medical-600"
                onMouseEnter={() => setIsVisible(true)}
                onMouseLeave={() => setIsVisible(false)}
                onClick={() => setIsVisible(!isVisible)}
            >
                {children}
                <HelpCircle className="w-3.5 h-3.5 text-medical-500" />
            </span>

            {isVisible && (
                <>
                    <div
                        className="fixed inset-0 z-[9998]"
                        style={{ pointerEvents: 'none' }}
                    />
                    <div
                        className="fixed z-[9999] w-56 animate-fadeIn"
                        style={{
                            top: `${tooltipPosition.top}px`,
                            left: `${tooltipPosition.left}px`,
                            transform: position === 'top' || position === 'bottom' 
                                ? 'translateX(-50%) translateY(-100%)' 
                                : position === 'left' 
                                    ? 'translateX(-100%) translateY(-50%)' 
                                    : 'translateY(-50%)',
                            animation: 'fadeIn 0.2s ease-in-out',
                            pointerEvents: 'auto'
                        }}
                    >
                        <div className="bg-white rounded-lg shadow-2xl border-2 border-medical-200 overflow-hidden">
                            {/* Header */}
                            <div className="bg-gradient-to-r from-medical-600 to-teal-600 px-3 py-2 text-white">
                                <div className="flex items-start gap-2">
                                    <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <h4 className="font-bold text-xs leading-tight">{tooltipData.title}</h4>
                                    </div>
                                </div>
                            </div>

                            {/* Body */}
                            <div className="px-3 py-2">
                                <p className="text-xs text-gray-700 leading-relaxed mb-2">
                                    {tooltipData.description}
                                </p>

                                {/* Importance Badge */}
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-gray-500 font-medium">Clinical Importance:</span>
                                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${importanceColors[tooltipData.importance]}`}>
                                        {tooltipData.importance}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}

            <style>{`
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
