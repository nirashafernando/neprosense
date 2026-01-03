import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../lib/axios';

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Check for saved user on mount
    useEffect(() => {
        const savedUser = localStorage.getItem('user');
        const savedToken = localStorage.getItem('token');

        if (savedUser && savedToken) {
            try {
                setUser(JSON.parse(savedUser));
            } catch (error) {
                console.error('Failed to parse saved user:', error);
                localStorage.removeItem('user');
                localStorage.removeItem('token');
            }
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const response = await api.post('/auth/login', { email, password });

            if (response.data.success) {
                const { token, ...userData } = response.data.data;
                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(userData));
                setUser(userData);
                return { success: true };
            }
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Login failed'
            };
        }
    };

    const register = async (name, email, password, role = 'Research Viewer') => {
        try {
            const response = await api.post('/auth/register', {
                name,
                email,
                password,
                role
            });

            if (response.data.success) {
                const { token, ...userData } = response.data.data;
                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(userData));
                setUser(userData);
                return { success: true };
            }
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Registration failed'
            };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        window.location.href = '/login';
    };

    const isClinician = () => {
        return user?.role === 'Clinician';
    };

    const isResearchViewer = () => {
        return user?.role === 'Research Viewer';
    };

    const value = {
        user,
        loading,
        login,
        register,
        logout,
        isClinician,
        isResearchViewer,
        isAuthenticated: !!user
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Protected Route Wrapper
export const ProtectedRoute = ({ children, clinicianOnly = false }) => {
    const { user, isClinician } = useAuth();

    if (!user) {
        window.location.href = '/home';
        return null;
    }

    if (clinicianOnly && !isClinician()) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-red-600 mb-2">Access Denied</h2>
                    <p className="text-gray-600">This page is only accessible to Clinicians.</p>
                </div>
            </div>
        );
    }

    return children;
};

export default AuthContext;
