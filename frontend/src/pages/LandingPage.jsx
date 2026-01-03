import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
    Heart,
    Brain,
    Activity,
    Microscope,
    Image,
    TrendingUp,
    Users,
    Shield,
    CheckCircle,
    AlertTriangle,
    ArrowRight,
    Github
} from "lucide-react";

const LandingPage = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    const components = [
        {
            number: 1,
            title: "Urine Test Analysis",
            icon: Microscope,
            description: "CNN-based automated analysis of urine dipstick images for early detection of CKD biomarkers and risk indicators.",
            status: "conceptual",
            features: ["Image recognition", "Early detection", "Automated screening"],
            githubLink: "#"
        },
        {
            number: 2,
            title: "Clinical Image Analysis",
            icon: Image,
            description: "AI-assisted interpretation of ultrasound and medical imaging to support nephrologists in diagnostic decision-making.",
            status: "conceptual",
            features: ["Ultrasound analysis", "Diagnostic support", "Image enhancement"],
            githubLink: "#"
        },
        {
            number: 3,
            title: "Lifestyle Prediction",
            icon: TrendingUp,
            description: "Machine learning-based prediction of CKD progression with personalized lifestyle and treatment recommendations.",
            status: "conceptual",
            features: ["Progression forecasting", "Personalized advice", "Risk tracking"],
            githubLink: "#"
        },
        {
            number: 4,
            title: "Intelligent Donor Matching",
            icon: Heart,
            description: "Advanced ML-driven donor-recipient compatibility analysis with risk-based ranking and SHAP explainability.",
            status: "active",
            features: ["Risk categorization", "AI explainability", "Multi-donor ranking"],
            route: user ? "/make-prediction" : "/login"
        }
    ];

    const benefits = [
        {
            icon: Activity,
            title: "Early Detection",
            description: "Identify CKD risk factors and progression indicators before severe complications develop"
        },
        {
            icon: Brain,
            title: "AI-Powered Insights",
            description: "Leverage advanced machine learning for accurate risk assessment and decision support"
        },
        {
            icon: Shield,
            title: "Transparent & Explainable",
            description: "SHAP-based explanations ensure clinicians understand every AI recommendation"
        },
        {
            icon: Users,
            title: "Clinical Support",
            description: "Augments medical expertise without replacing professional judgment"
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <div className="bg-gradient-to-br from-medical-700 via-medical-600 to-teal-600 text-white">
                <div className="max-w-7xl mx-auto px-6 py-20">
                    <div className="text-center">
                        <div className="flex items-center justify-center mb-6">
                            <div className="bg-white/10 backdrop-blur-sm rounded-full p-4 mr-4">
                                <Heart className="w-12 h-12 text-white" />
                            </div>
                            <h1 className="text-5xl font-bold">NephroSense</h1>
                        </div>

                        <p className="text-2xl text-medical-100 mb-4 max-w-3xl mx-auto">
                            AI-Powered Decision Support for Chronic Kidney Disease Management
                        </p>

                        <p className="text-lg text-medical-200 mb-8 max-w-2xl mx-auto">
                            Integrated 4-component intelligent system for early detection, clinical analysis,
                            lifestyle guidance, and transplant matching
                        </p>

                        <div className="flex items-center justify-center gap-4">
                            <button
                                onClick={() => navigate('/login')}
                                className="bg-white text-medical-700 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-medical-50 transition-all shadow-lg flex items-center gap-2"
                            >
                                <Users className="w-5 h-5" />
                                Clinician Login
                            </button>
                            <button
                                onClick={() => document.getElementById('components').scrollIntoView({ behavior: 'smooth' })}
                                className="bg-medical-800 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-medical-900 transition-all border-2 border-white/20 flex items-center gap-2"
                            >
                                Explore Components
                                <ArrowRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* System Overview */}
            <div className="max-w-7xl mx-auto px-6 py-16">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                        Complete CKD Management Ecosystem
                    </h2>
                    <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                        NephroSense integrates four specialized AI components to provide comprehensive support
                        across the entire chronic kidney disease care continuum—from early detection to transplant decision-making.
                    </p>
                </div>

                {/* Component Cards */}
                <div id="components" className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                    {components.map((component) => {
                        const Icon = component.icon;
                        const isActive = component.status === "active";

                        return (
                            <div
                                key={component.number}
                                className={`bg-white rounded-xl shadow-lg border-2 transition-all hover:shadow-xl ${isActive ? "border-medical-500" : "border-gray-200"
                                    }`}
                            >
                                <div className="p-8">
                                    {/* Header */}
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-4">
                                            <div className={`p-3 rounded-lg ${isActive ? "bg-medical-100" : "bg-gray-100"
                                                }`}>
                                                <Icon className={`w-8 h-8 ${isActive ? "text-medical-600" : "text-gray-600"
                                                    }`} />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    {isActive ? (
                                                        <span className="bg-medical-100 text-medical-700 text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1">
                                                            <CheckCircle className="w-3 h-3" />
                                                            Active
                                                        </span>
                                                    ) : (
                                                        <span className="bg-amber-100 text-amber-700 text-xs font-semibold px-3 py-1 rounded-full">
                                                            Conceptual
                                                        </span>
                                                    )}
                                                </div>
                                                <h3 className="text-xl font-bold text-gray-900">
                                                    {component.title}
                                                </h3>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Description */}
                                    <p className="text-gray-600 mb-4">
                                        {component.description}
                                    </p>

                                    {/* Features */}
                                    <div className="flex flex-wrap gap-2 mb-6">
                                        {component.features.map((feature, idx) => (
                                            <span
                                                key={idx}
                                                className="bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full"
                                            >
                                                {feature}
                                            </span>
                                        ))}
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex gap-3">
                                        {isActive ? (
                                            <button
                                                onClick={() => navigate(component.route)}
                                                className="flex-1 bg-medical-600 hover:bg-medical-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                                            >
                                                <Heart className="w-4 h-4" />
                                                Access System
                                            </button>
                                        ) : (
                                            <>
                                                <button
                                                    onClick={() => navigate(`/component-${component.number}`)}
                                                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors"
                                                >
                                                    Learn More
                                                </button>
                                                {component.githubLink && (
                                                    <a
                                                        href={component.githubLink}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-3 rounded-lg transition-colors flex items-center gap-2"
                                                    >
                                                        <Github className="w-4 h-4" />
                                                    </a>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Why NephroSense */}
                <div className="bg-white rounded-xl shadow-lg p-12 mb-16">
                    <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
                        Why NephroSense?
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {benefits.map((benefit, idx) => {
                            const Icon = benefit.icon;
                            return (
                                <div key={idx} className="text-center">
                                    <div className="bg-medical-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Icon className="w-8 h-8 text-medical-600" />
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                                        {benefit.title}
                                    </h3>
                                    <p className="text-gray-600 text-sm">
                                        {benefit.description}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="bg-medical-900 text-white py-8">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <p className="text-medical-200">
                        © 2026 NephroSense - AI-Powered CKD Management System
                    </p>
                    <p className="text-medical-300 text-sm mt-2">
                        Research & Development Project
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;
