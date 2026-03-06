import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Heart, Mail, Lock, AlertCircle, LogIn, Droplet } from 'lucide-react';

const LoginPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();
    
    // Get the redirect path from URL query parameters
    const searchParams = new URLSearchParams(location.search);
    const redirectPath = searchParams.get('redirect') || '/dashboard';
    
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError(''); // Clear error on input change
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const result = await login(formData.email, formData.password);

        if (result.success) {
            // Redirect to the specified path or default to dashboard
            navigate(redirectPath);
        } else {
            setError(result.message);
            setLoading(false);
        }
    };

    // Check if this is a redirect to urine module
    const isUrineRedirect = redirectPath === '/urine';

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-slate-50 via-medical-50 to-teal-50 py-12 px-4">
            {/* Background decorative elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-medical-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-teal-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse delay-1000"></div>
            </div>

            <div className="max-w-md w-full relative z-10">
                {/* Logo & Title */}
                <div className="text-center mb-8">
                    <button
                        onClick={() => navigate('/home')}
                        className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-medical-600 to-teal-600 rounded-2xl mb-4 shadow-lg transform hover:scale-105 transition-transform"
                    >
                        {isUrineRedirect ? (
                            <Droplet className="w-10 h-10 text-white" />
                        ) : (
                            <Heart className="w-10 h-10 text-white" />
                        )}
                    </button>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-medical-700 to-teal-700 bg-clip-text text-transparent mb-2">
                        {isUrineRedirect ? 'Urine Analysis Access' : 'NephroSense'}
                    </h1>
                    <p className="text-slate-600 font-medium">
                        {isUrineRedirect 
                            ? 'Secure access for urinalysis system' 
                            : 'Secure Access for Healthcare Professionals'}
                    </p>
                </div>

                {/* Login Form */}
                <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-8">
                    <div className="flex items-center justify-center mb-6">
                        <div className="flex items-center space-x-3">
                            {isUrineRedirect ? (
                                <Droplet className="w-7 h-7 text-blue-600" />
                            ) : (
                                <LogIn className="w-7 h-7 text-medical-600" />
                            )}
                            <h2 className="text-2xl font-bold text-slate-800">
                                {isUrineRedirect ? 'Sign In to Urine Analysis' : 'Doctor Sign In'}
                            </h2>
                        </div>
                    </div>

                    {error && (
                        <div className="bg-gradient-to-r from-rose-50 to-red-50 border-l-4 border-rose-500 px-4 py-3 rounded-lg mb-6 flex items-start space-x-3">
                            <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
                            <span className="text-rose-700 text-sm">{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2 flex items-center space-x-2">
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
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-medical-500 focus:border-medical-500 focus:bg-white transition-all duration-200 text-slate-800 placeholder-slate-400"
                                placeholder="doctor@hospital.com"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-semibold text-slate-700 mb-2 flex items-center space-x-2">
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
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-medical-500 focus:border-medical-500 focus:bg-white transition-all duration-200 text-slate-800 placeholder-slate-400"
                                placeholder="Enter your password"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full bg-gradient-to-r ${
                                isUrineRedirect 
                                    ? 'from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700' 
                                    : 'from-medical-600 to-teal-600 hover:from-medical-700 hover:to-teal-700'
                            } disabled:from-slate-400 disabled:to-slate-400 disabled:cursor-not-allowed text-white font-bold py-3.5 px-4 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0`}
                        >
                            {loading ? (
                                <span className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Signing in...
                                </span>
                            ) : (
                                isUrineRedirect ? 'Access Urine Analysis' : 'Sign In to Dashboard'
                            )}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-slate-600">
                            Don't have an account?{' '}
                            <Link 
                                to={isUrineRedirect ? `/register?redirect=${redirectPath}` : "/register"} 
                                className="text-medical-600 hover:text-medical-700 font-semibold hover:underline transition-colors"
                            >
                                Register here
                            </Link>
                        </p>
                        <p className="text-xs text-slate-500 mt-3">
                            <Link to="/home" className="hover:text-medical-600 transition-colors">← Back to Home</Link>
                        </p>
                    </div>

                    {/* Demo credentials for testing */}
                    {process.env.NODE_ENV === 'development' && (
                        <div className="mt-4 p-3 bg-slate-100 rounded-lg">
                            <p className="text-xs text-slate-500 mb-2">Demo Credentials (Dev Only):</p>
                            <button
                                onClick={() => {
                                    setFormData({
                                        email: 'doctor@hospital.com',
                                        password: 'demo123'
                                    });
                                }}
                                className="text-xs text-blue-600 hover:text-blue-700"
                            >
                                Fill demo account
                            </button>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="mt-8 text-center text-sm text-slate-500">
                    <p>© 2024 NephroSense. Medical Decision Support System.</p>
                    <p className="mt-1 text-xs">Empowering healthcare professionals with AI-driven insights</p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;