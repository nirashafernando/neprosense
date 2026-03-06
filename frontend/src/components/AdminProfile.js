import React, { useState, useEffect } from "react";
import {
    Users,
    Heart,
    Activity,
    User,
    Award,
    Briefcase,
    Mail,
    Save,
    Loader,
    Phone,
    MapPin,
    Calendar,
    Shield,
    CheckCircle,
    PlayCircle
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import api from "../lib/axios";
import { useToast } from "./Toast";
import OnboardingTutorial from "./OnboardingTutorial";

const AdminProfile = () => {
    const { user } = useAuth();
    const { showSuccess, showError, ToastComponent } = useToast();
    const [stats, setStats] = useState({
        totalPredictions: 0,
        donorsCount: 0,
        recipientsCount: 0,
    });

    const [profileData, setProfileData] = useState({
        name: user?.name || "",
        email: user?.email || "",
        role: user?.role || "",
        qualifications: "",
        experience: "",
        contactNumber: "",
        specialization: "",
        department: "",
        licenseNumber: ""
    });

    const [loading, setLoading] = useState(false);
    const [fetchingStats, setFetchingStats] = useState(true);
    const [error, setError] = useState(null);
    const [showOnboarding, setShowOnboarding] = useState(false);

    useEffect(() => {
        fetchStats();
        fetchProfileData();
    }, []);

    const fetchProfileData = async () => {
        try {
            const response = await api.get('/auth/me');
            if (response.data.success) {
                const userData = response.data.data;
                setProfileData({
                    name: userData.name || "",
                    email: userData.email || "",
                    role: userData.role || "",
                    qualifications: userData.qualifications || "",
                    experience: userData.experience || "",
                    contactNumber: userData.contactNumber || "",
                    specialization: userData.specialization || "",
                    department: userData.department || "",
                    licenseNumber: userData.licenseNumber || ""
                });
            }
        } catch (err) {
            console.error("Error fetching profile data:", err);
        }
    };

    const fetchStats = async () => {
        try {
            setFetchingStats(true);

            const [donorsRes, recipientsRes, predictionsRes] = await Promise.all([
                api.get('/donors'),
                api.get('/recipients'),
                api.get('/predictions/my-predictions')
            ]);

            setStats({
                donorsCount: donorsRes.data.count || donorsRes.data.data?.length || 0,
                recipientsCount: recipientsRes.data.count || recipientsRes.data.data?.length || 0,
                totalPredictions: predictionsRes.data.count || predictionsRes.data.data?.length || 0,
            });

            setFetchingStats(false);
        } catch (err) {
            console.error("Error fetching stats:", err);
            setFetchingStats(false);
        }
    };

    const handleInputChange = (field, value) => {
        setProfileData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleUpdate = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await api.put('/auth/profile', {
                qualifications: profileData.qualifications,
                experience: profileData.experience,
                specialization: profileData.specialization,
                department: profileData.department,
                contactNumber: profileData.contactNumber,
                licenseNumber: profileData.licenseNumber
            });

            if (response.data.success) {
                showSuccess('Profile updated successfully!');
            }
        } catch (err) {
            console.error("Error updating profile:", err);
            showError(err.response?.data?.message || "Failed to update profile. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleRestartTutorial = () => {
        localStorage.removeItem('hasSeenOnboarding');
        setShowOnboarding(true);
        showSuccess('Tutorial restarted! Follow the steps to learn about the system.');
    };

    const statsCards = [
        {
            title: "Total Predictions",
            value: stats.totalPredictions,
            icon: Activity,
            gradient: "from-medical-500 to-teal-600",
            bgColor: "bg-gradient-to-br from-medical-50 to-teal-50",
            iconBg: "bg-medical-100",
            iconColor: "text-medical-600",
        },
        {
            title: "Donors Managed",
            value: stats.donorsCount,
            icon: Heart,
            gradient: "from-red-500 to-pink-600",
            bgColor: "bg-gradient-to-br from-red-50 to-pink-50",
            iconBg: "bg-red-100",
            iconColor: "text-red-600",
        },
        {
            title: "Recipients Managed",
            value: stats.recipientsCount,
            icon: Users,
            gradient: "from-blue-500 to-cyan-600",
            bgColor: "bg-gradient-to-br from-blue-50 to-cyan-50",
            iconBg: "bg-blue-100",
            iconColor: "text-blue-600",
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 p-6">
            <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-6">
                <div className="bg-white rounded-xl shadow-md border border-slate-200 p-5">
                    <div className="flex items-center gap-3">
                        <div className="bg-gradient-to-br from-medical-500 to-medical-700 p-3 rounded-xl shadow-lg">
                            <User className="w-7 h-7 text-white" strokeWidth={2.5} />
                        </div>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">Admin Profile</h1>
                            <p className="text-slate-600 mt-0.5 text-sm">Manage your professional information and view system statistics</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {statsCards.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <div
                            key={index}
                            className={`${stat.bgColor} rounded-xl p-6 border-2 border-slate-200 shadow-md hover:shadow-lg transition-all relative overflow-hidden`}
                        >
                            <div className="absolute top-0 right-0 w-20 h-20 bg-white/20 rounded-full -mr-10 -mt-10"></div>
                            <div className="relative flex items-center justify-between">
                                <div>
                                    <p className="text-slate-600 text-xs font-bold mb-2 uppercase tracking-wide">
                                        {stat.title}
                                    </p>
                                    <p className="text-4xl font-bold text-slate-900">
                                        {fetchingStats ? (
                                            <Loader className="w-10 h-10 animate-spin text-slate-400" strokeWidth={2.5} />
                                        ) : (
                                            stat.value
                                        )}
                                    </p>
                                </div>
                                <div className={`${stat.iconBg} p-4 rounded-xl shadow-sm`}>
                                    <Icon className={`w-8 h-8 ${stat.iconColor}`} strokeWidth={2.5} />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Profile Section */}
            <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">
                {/* Profile Header */}
                <div className="bg-gradient-to-r from-medical-600 to-teal-600 p-8 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-24 -mb-24"></div>
                    <div className="relative flex items-center justify-between">
                        <div className="flex items-center gap-6">
                            <div className="bg-white/20 backdrop-blur-sm p-6 rounded-full border-2 border-white/30">
                                <User className="w-16 h-16 text-white" strokeWidth={2.5} />
                            </div>
                            <div>
                                <h2 className="text-3xl font-bold mb-2 tracking-tight">Professional Profile</h2>
                                <p className="text-medical-100 flex items-center gap-2 font-medium">
                                    <Shield className="w-5 h-5" strokeWidth={2.5} />
                                    Healthcare Professional Information
                                </p>
                            </div>
                        </div>
                        
                        {/* Restart Tutorial Button */}
                        <button
                            onClick={handleRestartTutorial}
                            className="bg-white/20 hover:bg-white/30 backdrop-blur-sm px-5 py-2.5 rounded-xl flex items-center gap-2 transition-all border-2 border-white/30 font-medium shadow-md hover:shadow-lg"
                        >
                            <PlayCircle className="w-5 h-5" strokeWidth={2.5} />
                            <span>Restart Tutorial</span>
                        </button>
                    </div>
                </div>

                {/* Current User Info */}
                <div className="bg-gradient-to-r from-medical-50 to-teal-50 p-6 border-b-2 border-medical-100">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="flex items-center gap-3">
                            <div className="bg-medical-100 p-3 rounded-xl shadow-sm">
                                <User className="w-5 h-5 text-medical-600" strokeWidth={2.5} />
                            </div>
                            <div>
                                <span className="text-xs font-bold text-slate-600 uppercase tracking-wide">Name</span>
                                <p className="font-bold text-slate-900">{user?.name}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="bg-blue-100 p-3 rounded-xl shadow-sm">
                                <Mail className="w-5 h-5 text-blue-600" strokeWidth={2.5} />
                            </div>
                            <div>
                                <span className="text-xs font-bold text-slate-600 uppercase tracking-wide">Email</span>
                                <p className="font-bold text-slate-900 text-sm">{user?.email}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="bg-emerald-100 p-3 rounded-xl shadow-sm">
                                <Shield className="w-5 h-5 text-emerald-600" strokeWidth={2.5} />
                            </div>
                            <div>
                                <span className="text-xs font-bold text-slate-600 uppercase tracking-wide">Role</span>
                                <p className="font-bold text-medical-600">{user?.role}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Edit Form */}
                <div className="p-8">
                    {error && (
                        <div className="mb-6 p-4 bg-gradient-to-r from-rose-50 to-red-50 border-2 border-rose-300 rounded-xl">
                            <p className="text-rose-800 text-sm font-bold">{error}</p>
                        </div>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Left Column */}
                        <div className="space-y-5">
                            <div>
                                <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2">
                                    <Award className="w-4 h-4 text-medical-600" strokeWidth={2.5} />
                                    Qualifications
                                </label>
                                <textarea
                                    value={profileData.qualifications}
                                    onChange={(e) => handleInputChange("qualifications", e.target.value)}
                                    placeholder="e.g., MBBS, MD Nephrology, Fellowship in Transplant Medicine"
                                    rows="3"
                                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-medical-500 focus:border-medical-500 transition-all shadow-sm hover:shadow-md font-medium"
                                />
                            </div>

                            <div>
                                <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2">
                                    <Briefcase className="w-4 h-4 text-medical-600" strokeWidth={2.5} />
                                    Specialization
                                </label>
                                <input
                                    type="text"
                                    value={profileData.specialization}
                                    onChange={(e) => handleInputChange("specialization", e.target.value)}
                                    placeholder="e.g., Nephrology, Transplant Surgery"
                                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-medical-500 focus:border-medical-500 transition-all shadow-sm hover:shadow-md font-medium"
                                />
                            </div>

                            <div>
                                <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2">
                                    <MapPin className="w-4 h-4 text-medical-600" strokeWidth={2.5} />
                                    Department
                                </label>
                                <input
                                    type="text"
                                    value={profileData.department}
                                    onChange={(e) => handleInputChange("department", e.target.value)}
                                    placeholder="e.g., Transplant Unit, Nephrology Department"
                                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-medical-500 focus:border-medical-500 transition-all shadow-sm hover:shadow-md font-medium"
                                />
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="space-y-5">
                            <div>
                                <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2">
                                    <Calendar className="w-4 h-4 text-medical-600" strokeWidth={2.5} />
                                    Professional Experience
                                </label>
                                <textarea
                                    value={profileData.experience}
                                    onChange={(e) => handleInputChange("experience", e.target.value)}
                                    placeholder="Years of practice, key achievements, areas of expertise"
                                    rows="3"
                                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-medical-500 focus:border-medical-500 transition-all shadow-sm hover:shadow-md font-medium"
                                />
                            </div>

                            <div>
                                <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2">
                                    <Phone className="w-4 h-4 text-medical-600" strokeWidth={2.5} />
                                    Contact Number
                                </label>
                                <input
                                    type="tel"
                                    value={profileData.contactNumber}
                                    onChange={(e) => handleInputChange("contactNumber", e.target.value)}
                                    placeholder="+94 7XX XXX XXX"
                                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-medical-500 focus:border-medical-500 transition-all shadow-sm hover:shadow-md font-medium"
                                />
                            </div>

                            <div>
                                <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2">
                                    <Shield className="w-4 h-4 text-medical-600" strokeWidth={2.5} />
                                    Medical License Number
                                </label>
                                <input
                                    type="text"
                                    value={profileData.licenseNumber}
                                    onChange={(e) => handleInputChange("licenseNumber", e.target.value)}
                                    placeholder="Medical license or registration number"
                                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-medical-500 focus:border-medical-500 transition-all shadow-sm hover:shadow-md font-medium"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Update Button */}
                    <div className="mt-8 flex justify-center">
                        <button
                            onClick={handleUpdate}
                            disabled={loading}
                            className="bg-gradient-to-r from-medical-600 to-teal-600 hover:from-medical-700 hover:to-teal-700 disabled:from-slate-400 disabled:to-slate-500 text-white px-12 py-4 rounded-xl font-bold transition-all flex items-center space-x-3 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <>
                                    <Loader className="w-6 h-6 animate-spin" strokeWidth={2.5} />
                                    <span>Updating Profile...</span>
                                </>
                            ) : (
                                <>
                                    <Save className="w-6 h-6" strokeWidth={2.5} />
                                    <span>Update Profile</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Toast Notifications */}
            <ToastComponent />

            {/* Onboarding Tutorial */}
            {showOnboarding && (
                <OnboardingTutorial
                    userRole={user?.role}
                    onComplete={() => setShowOnboarding(false)}
                />
            )}
            </div>
        </div>
    );
};

export default AdminProfile;
