import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Heart, Mail, Lock, AlertCircle, LogIn, Scan } from 'lucide-react';

const LoginPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Get the redirect path from location state
    const from = location.state?.from || 'dashboard';

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const result = await login(formData.email, formData.password);

        if (result.success) {
            // Redirect based on where the user came from
            if (from === 'ultrasound') {
                navigate('/ultrasound');
            } else {
                navigate('/dashboard');
            }
        } else {
            setError(result.message);
            setLoading(false);
        }
    };

    return (
        <div className="relative flex items-center justify-center min-h-screen px-4 py-12 overflow-hidden bg-gradient-to-br from-slate-50 via-medical-50 to-teal-50">
            {/* Background decorative elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute rounded-full -top-40 -right-40 w-80 h-80 bg-medical-200 mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
                <div className="absolute delay-1000 bg-teal-200 rounded-full -bottom-40 -left-40 w-80 h-80 mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
            </div>

            <div className="relative z-10 w-full max-w-md">
                {/* Logo & Title */}
                <div className="mb-8 text-center">
                    <button
                        onClick={() => navigate('/home')}
                        className="inline-flex items-center justify-center w-20 h-20 mb-4 transition-transform transform shadow-lg bg-gradient-to-br from-medical-600 to-teal-600 rounded-2xl hover:scale-105"
                    >
                        <Heart className="w-10 h-10 text-white" />
                    </button>
                    <h1 className="mb-2 text-4xl font-bold text-transparent bg-gradient-to-r from-medical-700 to-teal-700 bg-clip-text">NephroSense</h1>
                    <p className="font-medium text-slate-600">Secure Access for Healthcare Professionals</p>
                </div>

                {/* Login Form */}
                <div className="p-8 border shadow-2xl bg-white/80 backdrop-blur-lg rounded-2xl border-white/20">
                    <div className="flex items-center justify-center mb-6">
                        <div className="flex items-center space-x-3">
                            {from === 'ultrasound' ? (
                                <Scan className="w-7 h-7 text-medical-600" />
                            ) : (
                                <LogIn className="w-7 h-7 text-medical-600" />
                            )}
                            <h2 className="text-2xl font-bold text-slate-800">
                                {from === 'ultrasound' ? 'Clinical Image Analysis Login' : 'Doctor Sign In'}
                            </h2>
                        </div>
                    </div>

                    {from === 'ultrasound' && (
                        <div className="p-3 mb-6 text-center border rounded-lg bg-medical-50 border-medical-200">
                            <p className="text-sm text-medical-700">
                                Login to access the Kidney Ultrasound Analysis System
                            </p>
                        </div>
                    )}

                    {error && (
                        <div className="flex items-start px-4 py-3 mb-6 space-x-3 border-l-4 rounded-lg bg-gradient-to-r from-rose-50 to-red-50 border-rose-500">
                            <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
                            <span className="text-sm text-rose-700">{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label htmlFor="email" className="flex items-center block mb-2 space-x-2 text-sm font-semibold text-slate-700">
                                <Mail className="w-4 h-4 text-medical-600" />
                                <span>Email Address</span>
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 transition-all duration-200 border bg-slate-50 border-slate-200 rounded-xl focus:ring-2 focus:ring-medical-500 focus:border-medical-500 focus:bg-white text-slate-800 placeholder-slate-400"
                                placeholder="doctor@hospital.com"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="flex items-center block mb-2 space-x-2 text-sm font-semibold text-slate-700">
                                <Lock className="w-4 h-4 text-medical-600" />
                                <span>Password</span>
                            </label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 transition-all duration-200 border bg-slate-50 border-slate-200 rounded-xl focus:ring-2 focus:ring-medical-500 focus:border-medical-500 focus:bg-white text-slate-800 placeholder-slate-400"
                                placeholder="Enter your password"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-medical-600 to-teal-600 hover:from-medical-700 hover:to-teal-700 disabled:from-slate-400 disabled:to-slate-400 disabled:cursor-not-allowed text-white font-bold py-3.5 px-4 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center">
                                    <svg className="w-5 h-5 mr-3 -ml-1 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Signing in...
                                </span>
                            ) : (
                                from === 'ultrasound' ? 'Access Ultrasound Analysis' : 'Sign In to Dashboard'
                            )}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-slate-600">
                            Don't have an account?{' '}
                            <Link to="/register" state={{ from: from }} className="font-semibold transition-colors text-medical-600 hover:text-medical-700 hover:underline">
                                Register here
                            </Link>
                        </p>
                        <p className="mt-3 text-xs text-slate-500">
                            <Link to="/home" className="transition-colors hover:text-medical-600">← Back to Home</Link>
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-8 text-sm text-center text-slate-500">
                    <p>© 2024 NephroSense. Medical Decision Support System.</p>
                    <p className="mt-1 text-xs">Empowering healthcare professionals with AI-driven insights</p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;