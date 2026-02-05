import React from 'react';
import {
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';

/**
 * MatchDistributionChart Component
 * Visualizes match score and risk category distributions
 */
const MatchDistributionChart = ({ predictions }) => {
    if (!predictions || predictions.length === 0) {
        return (
            <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Match Distribution</h3>
                <div className="text-center py-12 text-gray-500">
                    No prediction data available
                </div>
            </div>
        );
    }

    // Prepare HLA score distribution data
    const hlaScoreData = [
        { score: '6/6', count: 0, fill: '#10b981' },
        { score: '5/6', count: 0, fill: '#34d399' },
        { score: '4/6', count: 0, fill: '#fbbf24' },
        { score: '3/6', count: 0, fill: '#fb923c' },
        { score: '2/6', count: 0, fill: '#f87171' },
        { score: '1/6', count: 0, fill: '#dc2626' },
        { score: '0/6', count: 0, fill: '#991b1b' }
    ];

    // Prepare risk category data
    const riskData = [
        { name: 'Low Risk', value: 0, color: '#10b981' },
        { name: 'Medium Risk', value: 0, color: '#fbbf24' },
        { name: 'High Risk', value: 0, color: '#ef4444' }
    ];

    // Count occurrences
    predictions.forEach(pred => {
        if (pred.topDonors && pred.topDonors.length > 0) {
            const topDonor = pred.topDonors[0];

            // HLA score distribution
            const hlaScore = topDonor.parameters?.hlaMatchScore;
            if (hlaScore !== undefined) {
                const scoreIndex = 6 - hlaScore; // Reverse index (6/6 first)
                if (scoreIndex >= 0 && scoreIndex < hlaScoreData.length) {
                    hlaScoreData[scoreIndex].count++;
                }
            }

            // Risk category distribution
            const category = topDonor.riskCategory?.category;
            if (category === 'Low Risk') riskData[0].value++;
            else if (category === 'Medium Risk') riskData[1].value++;
            else if (category === 'High Risk') riskData[2].value++;
        }
    });

    // Filter out zero counts for HLA
    const filteredHLAData = hlaScoreData.filter(item => item.count > 0);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* HLA Score Distribution */}
            <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">HLA Match Score Distribution</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={filteredHLAData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="score" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="count" fill="#3b82f6" radius={[8, 8, 0, 0]}>
                            {filteredHLAData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
                <div className="mt-4 text-sm text-gray-600">
                    <p>Total predictions analyzed: {predictions.length}</p>
                </div>
            </div>

            {/* Risk Category Distribution */}
            <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Risk Category Distribution</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie
                            data={riskData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            outerRadius={100}
                            fill="#8884d8"
                            dataKey="value"
                        >
                            {riskData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip />
                    </PieChart>
                </ResponsiveContainer>
                <div className="mt-4 flex justify-center gap-6 text-sm">
                    {riskData.map((item, index) => (
                        <div key={index} className="flex items-center gap-2">
                            <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: item.color }}
                            ></div>
                            <span className="text-gray-700">
                                {item.name}: {item.value}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MatchDistributionChart;
