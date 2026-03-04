import React, { useState } from "react";
import { Save, Activity, Droplets, Moon, Utensils, AlertCircle } from "lucide-react";

const LifestyleTracker = () => {
  const [formData, setFormData] = useState({
    waterIntake: "",
    dailyCalories: "", // Changed from saltIntake to dailyCalories
    sleepHours: "",
    physicalActivity: "",
    foodItems: [],
    stressLevel: "low",
    additionalNotes: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFoodToggle = (item) => {
    setFormData(prev => ({
      ...prev,
      foodItems: prev.foodItems.includes(item)
        ? prev.foodItems.filter(i => i !== item)
        : [...prev.foodItems, item]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    try {
      
      const response = await fetch("http://localhost:5000/api/save-entry", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
      
        console.log("Form data saved to backend:", formData);
        setSuccess(true);
        
      
        setFormData({
          waterIntake: "",
          dailyCalories: "", // Reset dailyCalories
          sleepHours: "",
          physicalActivity: "",
          foodItems: [],
          stressLevel: "low",
          additionalNotes: "",
        });

        setTimeout(() => setSuccess(false), 3000);
      } else {
      
        console.error("Failed to save data");
        alert("Failed to save data. Please make sure the Python backend is running.");
      }

    } catch (error) {
      
      console.error("Error connecting to server:", error);
      alert("Error connecting to server! Check if http://localhost:5000 is accessible.");
    } finally {
      setLoading(false);
    }
  };

  const foodOptions = [
    "Rice and Curry",
    "Kottu Roti",
    "String Hoppers",
    "Vegetable Salad",
    "Fruits",
    "Whole Grains",
    "Lean Protein",
  ];

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-600">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-100 p-3 rounded-full">
                <Activity className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  Daily Lifestyle Tracker
                </h1>
                <p className="text-gray-600">
                  Log your daily habits for CKD management
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-800 font-medium text-center">
              Lifestyle data saved successfully!
            </p>
          </div>
        )}

        {/* Form */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              {/* Water Intake & Calories (Modified Section) */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <Droplets className="w-5 h-5 text-blue-600" />
                  <h3 className="font-semibold text-gray-800">Hydration & Nutrition</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Water Intake (Liters)
                    </label>
                    <input
                      type="number"
                      name="waterIntake"
                      value={formData.waterIntake}
                      onChange={handleInputChange}
                      step="0.1"
                      min="0"
                      max="10"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., 2.5"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">Recommended: 2-3 liters/day</p>
                  </div>
                  
                  {/* CHANGED: Salt Intake removed, Daily Calories added */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Daily Calories
                    </label>
                    <input
                      type="number"
                      name="dailyCalories"
                      value={formData.dailyCalories}
                      onChange={handleInputChange}
                      min="0"
                      max="10000"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., 2000"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">Recommended: Depends on diet plan</p>
                  </div>

                </div>
              </div>

              {/* Sleep & Activity */}
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <Moon className="w-5 h-5 text-purple-600" />
                  <h3 className="font-semibold text-gray-800">Rest & Activity</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sleep Duration (Hours)
                    </label>
                    <input
                      type="number"
                      name="sleepHours"
                      value={formData.sleepHours}
                      onChange={handleInputChange}
                      step="0.5"
                      min="0"
                      max="24"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      placeholder="e.g., 7.5"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">Recommended: 7-8 hours/night</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Physical Activity (Minutes)
                    </label>
                    <input
                      type="number"
                      name="physicalActivity"
                      value={formData.physicalActivity}
                      onChange={handleInputChange}
                      min="0"
                      max="300"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      placeholder="e.g., 30"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">Recommended: 30+ minutes/day</p>
                  </div>
                </div>
              </div>

              {/* Food Selection */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <Utensils className="w-5 h-5 text-green-600" />
                  <h3 className="font-semibold text-gray-800">Dietary Habits</h3>
                </div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Select foods consumed today:
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {foodOptions.map((food) => (
                    <label
                      key={food}
                      className={`flex items-center p-2 border rounded-lg cursor-pointer transition-colors ${
                        formData.foodItems.includes(food)
                          ? 'bg-green-100 border-green-400'
                          : 'bg-white border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={formData.foodItems.includes(food)}
                        onChange={() => handleFoodToggle(food)}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700">{food}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Stress & Notes */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <AlertCircle className="w-5 h-5 text-yellow-600" />
                  <h3 className="font-semibold text-gray-800">Additional Information</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Stress Level
                    </label>
                    <select
                      name="stressLevel"
                      value={formData.stressLevel}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                    >
                      <option value="low">Low</option>
                      <option value="moderate">Moderate</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Additional Notes
                    </label>
                    <textarea
                      name="additionalNotes"
                      value={formData.additionalNotes}
                      onChange={handleInputChange}
                      rows="2"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                      placeholder="How you felt today, any symptoms..."
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-center pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 disabled:from-gray-400 disabled:to-gray-500 text-white px-8 py-3 rounded-lg font-semibold transition-all flex items-center space-x-2 shadow-lg hover:shadow-xl"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      <span>Save Daily Entry</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LifestyleTracker;