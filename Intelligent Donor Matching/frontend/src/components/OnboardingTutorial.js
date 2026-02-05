import React, { useState, useEffect } from 'react';
import { X, ChevronRight, ChevronLeft, Check, Lightbulb } from 'lucide-react';

/**
 * Onboarding Tutorial Component
 * First-time user walkthrough with interactive steps
 */
const OnboardingTutorial = ({ onComplete, userRole = 'Clinician' }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Check if user has seen tutorial
        const hasSeenTutorial = localStorage.getItem('hasSeenOnboarding');
        if (!hasSeenTutorial) {
            setIsVisible(true);
        }
    }, []);

    const tutorialSteps = {
        Clinician: [
            {
                title: 'Welcome to NeproSense!',
                description: 'This intelligent system helps you find the best kidney donor matches using AI-powered analysis. Let\'s take a quick tour.',
                icon: '🎯',
                highlight: null
            },
            {
                title: 'Add Donors & Recipients',
                description: 'Start by adding donor and recipient profiles. Click "Donor" or "Recipient" in the sidebar to add medical records including HLA typing, blood group, and health data.',
                icon: '👥',
                highlight: 'sidebar'
            },
            {
                title: 'Make Predictions',
                description: 'Once you have profiles, click "Make Prediction" to run AI analysis. Select a recipient and donors to evaluate compatibility scores and risk categories.',
                icon: '🔬',
                highlight: 'prediction'
            },
            {
                title: 'Understanding Results',
                description: 'Results show compatibility percentage, risk level (Low/Medium/High), and SHAP explanations showing which factors influenced the score.',
                icon: '📊',
                highlight: 'results'
            },
            {
                title: 'Medical Terms Help',
                description: 'Hover over any medical term with a dotted underline to see detailed explanations. HLA, eGFR, and other terms have built-in tooltips.',
                icon: '❓',
                highlight: null
            },
            {
                title: 'View Reports',
                description: 'Access all your prediction history in the "Reports" section. Download PDFs or view detailed comparisons of top donor matches.',
                icon: '📄',
                highlight: 'reports'
            }
        ]
    };

    const steps = tutorialSteps[userRole] || tutorialSteps.Clinician;

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            completeTutorial();
        }
    };

    const handlePrevious = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const completeTutorial = () => {
        localStorage.setItem('hasSeenOnboarding', 'true');
        setIsVisible(false);
        if (onComplete) onComplete();
    };

    const skipTutorial = () => {
        localStorage.setItem('hasSeenOnboarding', 'true');
        setIsVisible(false);
    };

    if (!isVisible) return null;

    const currentStepData = steps[currentStep];
    const progress = ((currentStep + 1) / steps.length) * 100;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-4 overflow-hidden animate-scaleIn">
                {/* Progress Bar */}
                <div className="h-2 bg-gray-200">
                    <div
                        className="h-full bg-gradient-to-r from-medical-600 to-teal-600 transition-all duration-300"
                        style={{ width: `${progress}%` }}
                    />
                </div>

                {/* Header */}
                <div className="bg-gradient-to-r from-medical-600 to-teal-600 p-6 text-white">
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                            <span className="text-5xl">{currentStepData.icon}</span>
                            <div>
                                <h2 className="text-2xl font-bold mb-1">{currentStepData.title}</h2>
                                <p className="text-medical-100 text-sm">
                                    Step {currentStep + 1} of {steps.length}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={skipTutorial}
                            className="hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-all"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-8">
                    <p className="text-gray-700 text-lg leading-relaxed mb-6">
                        {currentStepData.description}
                    </p>

                    {/* Tips Section */}
                    <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg mb-6">
                        <div className="flex items-start gap-3">
                            <Lightbulb className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                            <div>
                                <h4 className="font-semibold text-blue-900 mb-1">Pro Tip</h4>
                                <p className="text-blue-800 text-sm">
                                    {currentStep === 0 && 'You can restart this tutorial anytime from your profile settings.'}
                                    {currentStep === 1 && 'Accurate HLA typing is crucial. Use format: A1,A2,B7,B8,DR3,DR4'}
                                    {currentStep === 2 && 'You can compare multiple donors at once for comprehensive analysis.'}
                                    {currentStep === 3 && 'Green SHAP values increase compatibility, red values decrease it.'}
                                    {currentStep === 4 && 'Click on any medical term to learn more about its clinical importance.'}
                                    {currentStep === 5 && 'PDF reports include all donor comparisons and explanations for patient records.'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex items-center justify-between">
                        <button
                            onClick={handlePrevious}
                            disabled={currentStep === 0}
                            className="flex items-center gap-2 px-6 py-3 text-gray-600 hover:bg-gray-100 rounded-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed font-medium"
                        >
                            <ChevronLeft className="w-4 h-4" />
                            Previous
                        </button>

                        <div className="flex gap-2">
                            {steps.map((_, idx) => (
                                <div
                                    key={idx}
                                    className={`w-2 h-2 rounded-full transition-all ${
                                        idx === currentStep
                                            ? 'bg-medical-600 w-6'
                                            : idx < currentStep
                                            ? 'bg-green-500'
                                            : 'bg-gray-300'
                                    }`}
                                />
                            ))}
                        </div>

                        <button
                            onClick={handleNext}
                            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-medical-600 to-teal-600 hover:from-medical-700 hover:to-teal-700 text-white rounded-lg transition-all font-medium shadow-lg hover:shadow-xl"
                        >
                            {currentStep === steps.length - 1 ? (
                                <>
                                    Get Started
                                    <Check className="w-4 h-4" />
                                </>
                            ) : (
                                <>
                                    Next
                                    <ChevronRight className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes scaleIn {
                    from {
                        opacity: 0;
                        transform: scale(0.95);
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

export default OnboardingTutorial;
