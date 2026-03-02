import React, { useState, useEffect } from 'react';
import { TrendingUp, Users, Activity, Award } from 'lucide-react';
import api from '../lib/axios';

/**
 * DashboardStats Component
 * Displays real-time statistics and metrics
 */
const DashboardStats = () => {
    const [stats, setStats] = useState({
        totalPredictions: 0,
        thisMonth: 0,
        averageMatchScore: 0,
        lowRiskCount: 0,
        mediumRiskCount: 0,
        highRiskCount: 0,
        activeDonors: 0,
        activeRecipients: 0,
        loading: true
    });

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const [predictions, donors, recipients] = await Promise.all([
                api.get('/predictions/my-predictions'),
                api.get('/donors'),
                api.get('/recipients')
            ]);

            const predictionData = predictions.data.data || [];

            // Calculate statistics
            const now = new Date();
            const thisMonth = predictionData.filter(p => {
                const predDate = new Date(p.createdAt);
                return predDate.getMonth() === now.getMonth() &&
                    predDate.getFullYear() === now.getFullYear();
            });

            // Calculate average match score from all predictions
            let totalScore = 0;
            let scoreCount = 0;
            predictionData.forEach(pred => {
                if (pred.predictions && pred.predictions.length > 0) {
                    // Sum all probabilities in this prediction batch
                    pred.predictions.forEach(p => {
                        totalScore += (p.probability * 100) || 0; // Convert to percentage
                        scoreCount++;
                    });
                }
            });
            const avgScore = scoreCount > 0 ? (totalScore / scoreCount).toFixed(1) : 0;

            // Count risk categories from all predictions (not just top donors)
            let lowRisk = 0, mediumRisk = 0, highRisk = 0;
            predictionData.forEach(pred => {
                if (pred.predictions && pred.predictions.length > 0) {
                    pred.predictions.forEach(p => {
                        const category = p.riskCategory?.category;
                        if (category) {
                            const categoryLower = category.toLowerCase();
                            if (categoryLower.includes('low')) lowRisk++;
                            else if (categoryLower.includes('medium')) mediumRisk++;
                            else if (categoryLower.includes('high')) highRisk++;
                        }
                    });
                }
            });

            // Debug logging
            console.log('Dashboard Stats Debug:', {
                totalPredictions: predictionData.length,
                lowRisk,
                mediumRisk,
                highRisk,
                samplePrediction: predictionData[0]
            });

            setStats({
                totalPredictions: predictionData.length,
                thisMonth: thisMonth.length,
                averageMatchScore: avgScore,
                lowRiskCount: lowRisk,
                mediumRiskCount: mediumRisk,
                highRiskCount: highRisk,
                activeDonors: donors.data.data?.length || 0,
                activeRecipients: recipients.data.data?.length || 0,
                loading: false
            });
        } catch (error) {
            console.error('Error fetching stats:', error);
            setStats(prev => ({ ...prev, loading: false }));
        }
    };

    if (stats.loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {[1, 2, 3, 4].map(i => (
                    <div key={i} className="bg-white rounded-xl shadow-sm p-6 animate-pulse">
                        <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                        <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                    </div>
                ))}
            </div>
        );
    }

    const statCards = [
        {
            title: 'Total Predictions',
            value: stats.totalPredictions,
            subtitle: `${stats.thisMonth} this month`,
            icon: Activity,
            color: 'text-blue-600',
            bgColor: 'bg-blue-50'
        },
        {
            title: 'Average Match Score',
            value: `${stats.averageMatchScore}%`,
            subtitle: 'Across all predictions',
            icon: TrendingUp,
            color: 'text-green-600',
            bgColor: 'bg-green-50'
        },
        {
            title: 'Active Donors',
            value: stats.activeDonors,
            subtitle: `${stats.activeRecipients} recipients`,
            icon: Users,
            color: 'text-purple-600',
            bgColor: 'bg-purple-50'
        },
        {
            title: 'Low Risk Matches',
            value: stats.lowRiskCount,
            subtitle: `${stats.mediumRiskCount} medium, ${stats.highRiskCount} high`,
            icon: Award,
            color: 'text-emerald-600',
            bgColor: 'bg-emerald-50'
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statCards.map((stat, index) => (
                <div
                    key={index}
                    className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6"
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                            <stat.icon className={`w-6 h-6 ${stat.color}`} />
                        </div>
                    </div>
                    <h3 className="text-gray-600 text-sm font-medium mb-1">{stat.title}</h3>
                    <p className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</p>
                    <p className="text-sm text-gray-500">{stat.subtitle}</p>
                </div>
            ))}
        </div>
    );
};

export default DashboardStats;
