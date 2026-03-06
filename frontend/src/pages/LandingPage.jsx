import React, { useState, useEffect } from "react";
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
    ArrowRight,
    Github,
    Sparkles,
    Target,
    Zap,
    Award,
    ChevronRight,
    FileText,
    BarChart3,
    Lock,
    Unlock,
    Droplet
} from "lucide-react";

const LandingPage = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [scrollY, setScrollY] = useState(0);
    const [activeComponent, setActiveComponent] = useState(null);

    useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const components = [
        {
            number: 1,
            title: "Urine Test Analysis",
            icon: Microscope,
            description: "CNN-based automated analysis of urine dipstick images for early detection of CKD biomarkers and risk indicators.",
            status: "active", // Changed from "conceptual" to "active"
            category: "Early Detection",
            features: ["Image Recognition", "Early Detection", "Automated Screening"],
            color: "from-blue-500 to-indigo-600",
            bgGradient: "from-blue-50 to-indigo-50",
            iconBg: "bg-blue-100",
            iconColor: "text-blue-600",
            githubLink: "#",
            route: "/urine" // Added route for urine analysis
        },
        {
            number: 2,
            title: "Clinical Image Analysis",
            icon: Image,
            description: "AI-assisted interpretation of ultrasound and medical imaging to support nephrologists in diagnostic decision-making.",
            status: "active",
            category: "Diagnostic Support",
            features: ["Ultrasound Analysis", "Diagnostic Support", "Image Enhancement"],
            color: "from-purple-500 to-pink-600",
            bgGradient: "from-purple-50 to-pink-50",
            iconBg: "bg-purple-100",
            iconColor: "text-purple-600",
            githubLink: "#",
            route: "/ultrasound",
            infoRoute: "/component-2"
        },
        {
            number: 3,
            title: "Lifestyle Prediction",
            icon: TrendingUp,
            description: "Machine learning-based prediction of CKD progression with personalized lifestyle and treatment recommendations.",
            status: "active",
            category: "Progression Tracking",
            features: ["Progression Forecasting", "Personalized Advice", "Risk Tracking"],
            color: "from-amber-500 to-orange-600",
            bgGradient: "from-amber-50 to-orange-50",
            iconBg: "bg-amber-100",
            iconColor: "text-amber-600",
            githubLink: "#",
            route: "/lifestyle",
            infoRoute: "/component-3"
        },
        {
            number: 4,
            title: "Intelligent Donor Matching",
            icon: Heart,
            description: "Advanced ML-driven donor-recipient compatibility analysis with risk-based ranking and SHAP explainability for optimal transplant decisions.",
            status: "active",
            category: "Transplant Decision",
            features: ["Risk Categorization", "AI Explainability", "Multi-Donor Ranking"],
            color: "from-medical-500 to-teal-600",
            bgGradient: "from-medical-50 to-teal-50",
            iconBg: "bg-medical-100",
            iconColor: "text-medical-600",
            route: user ? "/app/make-prediction" : "/login?redirect=/app/make-prediction"
        }
    ];

    const benefits = [
        {
            icon: Activity,
            title: "Early Detection",
            description: "Identify CKD risk factors and progression indicators before severe complications develop",
            gradient: "from-rose-500 to-red-600"
        },
        {
            icon: Brain,
            title: "AI-Powered Insights",
            description: "Leverage advanced machine learning for accurate risk assessment and decision support",
            gradient: "from-medical-500 to-teal-600"
        },
        {
            icon: Shield,
            title: "Transparent & Explainable",
            description: "SHAP-based explanations ensure clinicians understand every AI recommendation",
            gradient: "from-emerald-500 to-green-600"
        },
        {
            icon: Users,
            title: "Clinical Support",
            description: "Augments medical expertise without replacing professional judgment",
            gradient: "from-blue-500 to-indigo-600"
        }
    ];

    const stats = [
        { label: "AI Modules", value: "4", icon: Sparkles },
        { label: "Active System", value: "4", icon: CheckCircle },
        { label: "Clinical Focus", value: "100%", icon: Target },
        { label: "Accuracy", value: "High", icon: Award }
    ];

    const handleNavigate = (route) => {
        if (route.startsWith('/urine')) {
            // For urine module, check if user is logged in
            if (user) {
                navigate('/urine');
            } else {
                navigate('/login?redirect=/urine');
            }
        } else {
            navigate(route);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Animated Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-96 h-96 bg-medical-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
                <div className="absolute top-1/3 -left-40 w-96 h-96 bg-teal-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
                <div className="absolute bottom-20 right-1/3 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-2000"></div>
            </div>

            {/* Hero Section */}
            <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-medical-700 via-medical-600 to-teal-600"></div>
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30"></div>
                
                <div className="relative max-w-7xl mx-auto px-6 py-24 lg:py-32">
                    <div className="text-center">
                        {/* Logo Animation */}
                        <div className="flex items-center justify-center mb-8 animate-fade-in-up">
                            <div className="relative">
                                <div className="absolute inset-0 bg-white/20 backdrop-blur-sm rounded-3xl blur-xl"></div>
                                <div className="relative bg-white/10 backdrop-blur-sm rounded-3xl p-6 border border-white/20">
                                    <Heart className="w-16 h-16 text-white animate-pulse" />
                                </div>
                            </div>
                        </div>

                        <h1 className="text-6xl lg:text-7xl font-black text-white mb-6 animate-fade-in-up animation-delay-200">
                            Neph<span className="text-teal-200">ro</span>Sense
                        </h1>

                        <p className="text-2xl lg:text-3xl text-medical-100 mb-4 max-w-4xl mx-auto font-semibold animate-fade-in-up animation-delay-400">
                            AI-Powered Decision Support for Chronic Kidney Disease Management
                        </p>

                        <p className="text-lg lg:text-xl text-medical-200 mb-12 max-w-3xl mx-auto animate-fade-in-up animation-delay-600">
                            Integrated 4-component intelligent ecosystem for early detection, clinical analysis,
                            lifestyle guidance, and transplant matching
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12 animate-fade-in-up animation-delay-800">
                            <button
                                onClick={() => navigate(user ? '/app/dashboard' : '/login')}
                                className="group bg-white text-medical-700 px-8 py-4 rounded-xl font-bold text-lg hover:bg-medical-50 transition-all shadow-2xl hover:shadow-3xl hover:scale-105 flex items-center gap-3 w-full sm:w-auto"
                            >
                                {user ? <Activity className="w-6 h-6" /> : <Users className="w-6 h-6" />}
                                {user ? 'Go to Dashboard' : 'Clinician Login'}
                                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>
                            <button
                                onClick={() => document.getElementById('components').scrollIntoView({ behavior: 'smooth' })}
                                className="group bg-medical-800/50 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-medical-900/60 transition-all border-2 border-white/30 hover:border-white/50 flex items-center gap-3 w-full sm:w-auto"
                            >
                                Explore System
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>

                        {/* Stats Bar */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto animate-fade-in-up animation-delay-1000">
                            {stats.map((stat, idx) => {
                                const Icon = stat.icon;
                                return (
                                    <div key={idx} className="bg-white/95 backdrop-blur-md border-2 border-medical-300/50 rounded-xl p-6 hover:bg-white hover:border-medical-400 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1">
                                        <Icon className="w-8 h-8 text-medical-600 mx-auto mb-3" />
                                        <div className="text-4xl font-black bg-gradient-to-r from-medical-700 to-teal-700 bg-clip-text text-transparent mb-2">{stat.value}</div>
                                        <div className="text-sm text-slate-600 font-bold">{stat.label}</div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>

            {/* System Overview */}
            <div className="relative max-w-7xl mx-auto px-6 py-20">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center justify-center bg-gradient-to-r from-medical-100 to-teal-100 rounded-full px-6 py-2 mb-6">
                        <Sparkles className="w-5 h-5 text-medical-600 mr-2" />
                        <span className="text-medical-700 font-bold text-sm">COMPLETE CKD MANAGEMENT ECOSYSTEM</span>
                    </div>
                    <h2 className="text-4xl lg:text-5xl font-black text-slate-800 mb-6">
                        Four Intelligent Modules,<br />
                        <span className="bg-gradient-to-r from-medical-600 to-teal-600 bg-clip-text text-transparent">
                            One Unified Vision
                        </span>
                    </h2>
                    <p className="text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
                        NephroSense integrates specialized AI modules to provide comprehensive support
                        across the entire chronic kidney disease care continuum—from early screening to life-saving transplant decisions.
                    </p>
                </div>

                {/* AI Module Cards */}
                <div id="components" className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
                    {components.map((component, idx) => {
                        const Icon = component.icon;
                        const isActive = component.status === "active";
                        const StatusIcon = isActive ? Unlock : Lock;

                        return (
                            <div
                                key={component.number}
                                className={`group relative bg-white rounded-2xl shadow-xl border-2 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 ${
                                    isActive 
                                        ? "border-medical-300 hover:border-medical-400" 
                                        : "border-slate-200 hover:border-slate-300"
                                } ${activeComponent === idx ? 'ring-4 ring-medical-200' : ''}`}
                                onMouseEnter={() => setActiveComponent(idx)}
                                onMouseLeave={() => setActiveComponent(null)}
                            >
                                {/* Gradient Background Overlay */}
                                <div className={`absolute inset-0 bg-gradient-to-br ${component.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl`}></div>
                                
                                {/* Content */}
                                <div className="relative p-8">
                                    {/* Header */}
                                    <div className="flex items-start justify-between mb-6">
                                        <div className="flex items-start gap-4 flex-1">
                                            <div className={`relative ${component.iconBg} p-4 rounded-2xl group-hover:scale-110 transition-transform duration-300`}>
                                                <Icon className={`w-8 h-8 ${component.iconColor}`} />
                                                {isActive && (
                                                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white animate-pulse"></div>
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className="text-slate-400 font-black text-sm">MODULE {component.number}</span>
                                                    {isActive ? (
                                                        <span className="bg-gradient-to-r from-emerald-500 to-green-600 text-white text-xs font-black px-3 py-1 rounded-full flex items-center gap-1 shadow-lg">
                                                            <CheckCircle className="w-3 h-3" />
                                                            ACTIVE
                                                        </span>
                                                    ) : (
                                                        <span className="bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs font-black px-3 py-1 rounded-full shadow-lg">
                                                            CONCEPTUAL
                                                        </span>
                                                    )}
                                                </div>
                                                <h3 className="text-2xl font-black text-slate-800 group-hover:text-slate-900">
                                                    {component.title}
                                                </h3>
                                                <p className="text-sm text-medical-600 font-semibold mt-1">{component.category}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Description */}
                                    <p className="text-slate-600 leading-relaxed mb-6">
                                        {component.description}
                                    </p>

                                    {/* Features */}
                                    <div className="flex flex-wrap gap-2 mb-6">
                                        {component.features.map((feature, fIdx) => (
                                            <span
                                                key={fIdx}
                                                className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold px-4 py-2 rounded-full border border-slate-200 transition-colors"
                                            >
                                                {feature}
                                            </span>
                                        ))}
                                    </div>

                                    {/* Action Buttons - UPDATED SECTION */}
                                    <div className="flex gap-3">
                                        {isActive ? (
                                            <button
                                                onClick={() => {
                                                    if (component.route) {
                                                        if (user) {
                                                            // If user is logged in, go directly to the route
                                                            navigate(component.route);
                                                        } else {
                                                            // If not logged in, go to login with return path
                                                            navigate('/login', { 
                                                                state: { from: { pathname: component.route } } 
                                                            });
                                                        }
                                                    }
                                                }}
                                                className={`flex-1 bg-gradient-to-r ${component.color} text-white px-6 py-4 rounded-xl font-bold transition-all shadow-lg hover:shadow-2xl hover:scale-105 flex items-center justify-center gap-2 group`}
                                            >
                                                {component.number === 1 ? <Droplet className="w-5 h-5 group-hover:scale-110 transition-transform" /> : 
                                                 component.number === 4 ? <Heart className="w-5 h-5 group-hover:scale-110 transition-transform" /> : 
                                                 <Sparkles className="w-5 h-5 group-hover:scale-110 transition-transform" />}
                                                Launch System
                                                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                            </button>
                                        ) : (
                                            <>
                                                <button
                                                    onClick={() => navigate(`/component-${component.number}`)}
                                                    className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 px-6 py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 group border-2 border-slate-200"
                                                >
                                                    <FileText className="w-5 h-5" />
                                                    Learn More
                                                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                                </button>
                                                {component.githubLink && (
                                                    <button
                                                        onClick={() => window.open(component.githubLink, '_blank')}
                                                        className="bg-slate-800 hover:bg-slate-900 text-white px-5 py-4 rounded-xl transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
                                                    >
                                                        <Github className="w-5 h-5" />
                                                    </button>
                                                )}
                                            </>
                                        )}
                                    </div>

                                    {/* Status Indicator */}
                                    <div className="absolute top-4 right-4">
                                        <StatusIcon className={`w-6 h-6 ${isActive ? 'text-emerald-500' : 'text-slate-400'}`} />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Clinical Workflow Pathway */}
                <div className="relative bg-gradient-to-br from-medical-50 via-teal-50 to-blue-50 rounded-3xl p-12 mb-20 shadow-xl border-2 border-medical-200/30 overflow-hidden">
                    {/* Background decoration */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-medical-200/20 rounded-full filter blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-200/20 rounded-full filter blur-3xl"></div>
                    
                    <div className="relative z-10">
                        <div className="text-center mb-12">
                            <div className="inline-flex items-center justify-center bg-white rounded-full px-6 py-2 mb-4 shadow-md">
                                <Activity className="w-5 h-5 text-medical-600 mr-2" />
                                <span className="text-medical-700 font-bold text-sm">PATIENT CARE JOURNEY</span>
                            </div>
                            <h3 className="text-3xl font-black text-slate-800 mb-4">Clinical Workflow Pathway</h3>
                            <p className="text-slate-600 max-w-2xl mx-auto">
                                Integrated AI support across every stage of chronic kidney disease management
                            </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            {components.map((comp, idx) => {
                                const Icon = comp.icon;
                                const isActive = comp.status === 'active';
                                return (
                                    <div key={idx} className="relative">
                                        <div className={`bg-white/80 backdrop-blur-sm rounded-2xl p-6 border-2 transition-all hover:scale-105 hover:shadow-xl ${
                                            isActive ? 'border-medical-300 shadow-lg' : 'border-slate-200 shadow-md'
                                        }`}>
                                            <div className="text-center">
                                                <div className={`${comp.iconBg} w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-md`}>
                                                    <Icon className={`w-7 h-7 ${comp.iconColor}`} />
                                                </div>
                                                <div className="inline-flex items-center justify-center bg-gradient-to-r from-slate-100 to-slate-200 text-slate-700 text-sm font-black px-3 py-1 rounded-full mb-2">
                                                    STAGE {idx + 1}
                                                </div>
                                                <div className="text-sm font-bold text-slate-800 mb-1">{comp.category}</div>
                                                <div className="text-xs text-slate-500">{comp.title}</div>
                                                {isActive && (
                                                    <div className="mt-2">
                                                        <span className="inline-flex items-center text-xs font-bold text-emerald-600">
                                                            <CheckCircle className="w-3 h-3 mr-1" />
                                                            Live
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        {idx < components.length - 1 && (
                                            <div className="hidden md:block absolute top-1/2 -right-2 transform translate-x-1/2 -translate-y-1/2 z-20">
                                                <div className="bg-white rounded-full p-1 shadow-lg">
                                                    <ChevronRight className="w-5 h-5 text-medical-600" />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Why NephroSense */}
                <div className="mb-20">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-black text-slate-800 mb-4">
                            Why Choose NephroSense?
                        </h2>
                        <p className="text-lg text-slate-600 max-w-3xl mx-auto">
                            Built on cutting-edge AI research with clinician needs at the forefront
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {benefits.map((benefit, idx) => {
                            const Icon = benefit.icon;
                            return (
                                <div 
                                    key={idx} 
                                    className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 border-slate-100 hover:border-medical-200"
                                >
                                    <div className={`bg-gradient-to-br ${benefit.gradient} w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg`}>
                                        <Icon className="w-8 h-8 text-white" />
                                    </div>
                                    <h3 className="text-xl font-black text-slate-800 mb-3 text-center">
                                        {benefit.title}
                                    </h3>
                                    <p className="text-slate-600 text-sm text-center leading-relaxed">
                                        {benefit.description}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* CTA Section */}
                <div className="bg-gradient-to-br from-medical-600 to-teal-600 rounded-3xl p-12 text-center shadow-2xl">
                    <Zap className="w-16 h-16 text-white mx-auto mb-6 animate-pulse" />
                    <h2 className="text-4xl font-black text-white mb-4">
                        Ready to Transform CKD Care?
                    </h2>
                    <p className="text-xl text-medical-100 mb-8 max-w-2xl mx-auto">
                        Join the next generation of AI-powered clinical decision support
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            onClick={() => navigate(user ? '/app/dashboard' : '/register')}
                            className="bg-white text-medical-700 px-10 py-4 rounded-xl font-black text-lg hover:bg-medical-50 transition-all shadow-2xl hover:scale-105 flex items-center justify-center gap-2"
                        >
                            <Users className="w-6 h-6" />
                            {user ? 'Go to Dashboard' : 'Get Started'}
                            <ChevronRight className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => navigate('/component-4')}
                            className="bg-medical-800/50 backdrop-blur-sm text-white px-10 py-4 rounded-xl font-black text-lg hover:bg-medical-900/60 transition-all border-2 border-white/30 flex items-center justify-center gap-2"
                        >
                            <FileText className="w-6 h-6" />
                            View Documentation
                        </button>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="bg-gradient-to-br from-medical-800 via-medical-700 to-teal-800 text-white py-12 border-t border-medical-600/30">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col md:flex-row items-center justify-between">
                        <div className="mb-4 md:mb-0">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-2">
                                    <Heart className="w-6 h-6 text-white" />
                                </div>
                                <span className="text-2xl font-black">NephroSense</span>
                            </div>
                            <p className="text-medical-200 text-sm">
                                © 2026 NephroSense - AI-Powered CKD Management System
                            </p>
                        </div>
                        <div className="flex items-center gap-6">
                            <a href="#" className="text-medical-200 hover:text-white transition-colors text-sm font-semibold hover:underline">
                                Documentation
                            </a>
                            <a href="#" className="text-medical-200 hover:text-white transition-colors text-sm font-semibold hover:underline">
                                Research
                            </a>
                            <a href="#" className="text-medical-200 hover:text-white transition-colors text-sm font-semibold hover:underline">
                                Contact
                            </a>
                        </div>
                    </div>
                    <div className="mt-8 pt-8 border-t border-white/10 text-center">
                        <p className="text-medical-100 text-sm">
                            Research & Development Project • Medical AI Decision Support
                        </p>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes fade-in-up {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-fade-in-up {
                    animation: fade-in-up 0.6s ease-out forwards;
                }
                .animation-delay-200 {
                    animation-delay: 0.2s;
                    opacity: 0;
                }
                .animation-delay-400 {
                    animation-delay: 0.4s;
                    opacity: 0;
                }
                .animation-delay-600 {
                    animation-delay: 0.6s;
                    opacity: 0;
                }
                .animation-delay-800 {
                    animation-delay: 0.8s;
                    opacity: 0;
                }
                .animation-delay-1000 {
                    animation-delay: 1s;
                    opacity: 0;
                }
            `}</style>
        </div>
    );
};

export default LandingPage;