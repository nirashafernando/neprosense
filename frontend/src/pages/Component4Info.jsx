import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, ArrowLeft } from 'lucide-react';

const Component4Info = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-medical-50 to-teal-50">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <button
          onClick={() => navigate('/home')}
          className="flex items-center gap-2 text-medical-600 hover:text-medical-700 mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Home
        </button>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-medical-100 p-4 rounded-xl">
              <Heart className="w-8 h-8 text-medical-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800">Intelligent Donor Matching</h1>
          </div>

          <p className="text-gray-600 mb-6">
            Coming soon: Advanced ML-driven donor-recipient compatibility analysis with risk-based ranking and SHAP explainability.
          </p>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-blue-800">
              This component is under development. Check back later for updates!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Component4Info;