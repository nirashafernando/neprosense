import React, { useState, useEffect } from 'react';
import { X, ChevronRight, ChevronLeft, Check, Users, Activity, FileText, BarChart3, Sparkles, BookOpen } from 'lucide-react';

/**
 * Onboarding Tutorial Component
 * First-time user walkthrough with interactive steps
 */
const OnboardingTutorial = ({ onComplete, userRole = 'Doctor' }) => {
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
        Doctor: [
            {
                title: 'Welcome to NeproSense',
                description: 'This intelligent system helps you find the best kidney donor matches using AI-powered analysis. Let\'s take a quick tour.',
                highlight: null,
                icon: Sparkles,
                gradient: 'from-purple-500 to-pink-500'
            },
            {
                title: 'Add Donors & Recipients',
                description: 'Start by adding donor and recipient profiles. Click "Donor" or "Recipient" in the sidebar to add medical records including HLA typing, blood group, and health data.',
                highlight: 'sidebar',
                icon: Users,
                gradient: 'from-green-500 to-emerald-500'
            },
            {
                title: 'Make Predictions',
                description: 'Once you have profiles, click "Make Prediction" to run AI analysis. Select a recipient and donors to evaluate compatibility scores and risk categories.',
                highlight: 'prediction',
                icon: Activity,
                gradient: 'from-blue-500 to-cyan-500'
            },
            {
                title: 'Understanding Results',
                description: 'Results show compatibility percentage, risk level (Low/Medium/High), and SHAP explanations showing which factors influenced the score.',
                highlight: 'results',
                icon: BarChart3,
                gradient: 'from-orange-500 to-red-500'
            },
            {
                title: 'Medical Terms Help',
                description: 'Hover over any medical term with a dotted underline to see detailed explanations. HLA, eGFR, and other terms have built-in tooltips.',
                highlight: null,
                icon: BookOpen,
                gradient: 'from-indigo-500 to-purple-500'
            },
            {
                title: 'View Reports',
                description: 'Access all your prediction history in the "Reports" section. Download PDFs or view detailed comparisons of top donor matches.',
                highlight: 'reports',
                icon: FileText,
                gradient: 'from-teal-500 to-green-500'
            }
        ]
    };

    const steps = tutorialSteps[userRole] || tutorialSteps.Doctor;

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
    const StepIcon = currentStepData.icon;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-md animate-fadeIn">
            <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full mx-4 overflow-hidden animate-scaleIn transform transition-all">
                {/* Animated Progress Bar */}
                <div className="h-2.5 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 relative overflow-hidden">
                    <div
                        className={`h-full bg-gradient-to-r ${currentStepData.gradient} transition-all duration-500 ease-out relative`}
                        style={{ width: `${progress}%` }}
                    >
                        <div className="absolute inset-0 bg-white opacity-30 animate-shimmer" />
                    </div>
                </div>

                {/* Header with Icon */}
                <div className={`bg-gradient-to-r ${currentStepData.gradient} p-8 text-white relative overflow-hidden`}>
                    {/* Decorative background pattern */}
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-32 translate-x-32" />
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full translate-y-24 -translate-x-24" />
                    </div>
                    
                    <div className="flex items-start justify-between relative z-10">
                        <div className="flex items-start gap-4 flex-1">
                            {/* Animated Icon Circle */}
                            <div className="bg-white bg-opacity-20 backdrop-blur-sm p-4 rounded-2xl shadow-lg transform transition-transform hover:scale-105">
                                <StepIcon className="w-10 h-10 text-white animate-float" strokeWidth={2} />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-white text-opacity-90 text-sm font-medium bg-white bg-opacity-20 px-3 py-1 rounded-full">
                                        Step {currentStep + 1} of {steps.length}
                                    </span>
                                </div>
                                <h2 className="text-3xl font-bold mb-2 leading-tight">{currentStepData.title}</h2>
                            </div>
                        </div>
                        <button
                            onClick={skipTutorial}
                            className="hover:bg-white hover:bg-opacity-20 rounded-full p-2.5 transition-all hover:rotate-90 transform duration-300"
                            aria-label="Close tutorial"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-8 bg-gradient-to-br from-gray-50 to-white">
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
                        <p className="text-gray-700 text-lg leading-relaxed">
                            {currentStepData.description}
                        </p>
                    </div>

                    {/* Enhanced Pro Tip Section */}
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 p-5 rounded-2xl mb-6 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-200 rounded-full opacity-20 -translate-y-16 translate-x-16" />
                        <div className="relative z-10">
                            <div className="flex items-start gap-3">
                                <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-2 rounded-lg shadow-md">
                                    <Sparkles className="w-5 h-5 text-white" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-bold text-blue-900 mb-2 text-base">Pro Tip</h4>
                                    <p className="text-blue-800 text-sm leading-relaxed">
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
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex items-center justify-between">
                        <button
                            onClick={handlePrevious}
                            disabled={currentStep === 0}
                            className="flex items-center gap-2 px-6 py-3 text-gray-700 hover:bg-gray-100 rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed font-medium shadow-sm border border-gray-200 hover:border-gray-300 hover:shadow-md disabled:hover:bg-transparent disabled:hover:border-gray-200 disabled:hover:shadow-sm"
                        >
                            <ChevronLeft className="w-5 h-5" />
                            Previous
                        </button>

                        {/* Enhanced Progress Dots */}
                        <div className="flex gap-2.5">
                            {steps.map((_, idx) => (
                                <div
                                    key={idx}
                                    className={`rounded-full transition-all duration-300 ${
                                        idx === currentStep
                                            ? `bg-gradient-to-r ${currentStepData.gradient} w-10 h-2.5 shadow-md`
                                            : idx < currentStep
                                            ? 'bg-green-500 w-2.5 h-2.5'
                                            : 'bg-gray-300 w-2.5 h-2.5'
                                    }`}
                                />
                            ))}
                        </div>

                        <button
                            onClick={handleNext}
                            className={`flex items-center gap-2 px-6 py-3 bg-gradient-to-r ${currentStepData.gradient} hover:opacity-90 text-white rounded-xl transition-all font-medium shadow-lg hover:shadow-xl transform hover:scale-105`}
                        >
                            {currentStep === steps.length - 1 ? (
                                <>
                                    Get Started
                                    <Check className="w-5 h-5" />
                                </>
                            ) : (
                                <>
                                    Next
                                    <ChevronRight className="w-5 h-5" />
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
                @keyframes float {
                    0%, 100% {
                        transform: translateY(0px);
                    }
                    50% {
                        transform: translateY(-10px);
                    }
                }
                @keyframes shimmer {
                    0% {
                        transform: translateX(-100%);
                    }
                    100% {
                        transform: translateX(100%);
                    }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.3s ease-out;
                }
                .animate-scaleIn {
                    animation: scaleIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
                }
                .animate-float {
                    animation: float 3s ease-in-out infinite;
                }
                .animate-shimmer {
                    animation: shimmer 2s infinite;
                }
            `}</style>
        </div>
    );
};

export default OnboardingTutorial;
