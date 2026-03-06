import React, { useState, useEffect } from "react";
import { AlertTriangle, CheckCircle, TrendingUp, ChevronDown, ChevronUp, Activity } from "lucide-react";

const RiskPrediction = () => {
  const [showDetails, setShowDetails] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [debugInfo, setDebugInfo] = useState(null);
  const [predictionData, setPredictionData] = useState({
    riskLevel: "UNKNOWN",
    probability: 0,
    factors: [],
    recommendations: [],
    nextSteps: []
  });

  useEffect(() => {
    const fetchPrediction = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Step 1: Fetch lifestyle data
        console.log("Fetching lifestyle data...");
        const response = await fetch("http://localhost:8080/api/lifestyle/view-data");
        const data = await response.json();

        if (!response.ok) {
          throw new Error(`Failed to fetch lifestyle data: ${response.status}`);
        }

        if (data.length === 0) {
          setError("No lifestyle data found. Please add entries in Lifestyle Tracker first.");
          setLoading(false);
          return;
        }

        console.log("Lifestyle data fetched:", data);
        const latestEntry = data[data.length - 1];
        
        // Step 2: Prepare user data for prediction
        const userData = {
          age: 45,
          gender: "Male",
          height_cm: 170,
          weight_kg: 75,
          daily_steps: 5000,
          sleep_hours: latestEntry["Sleep (hrs)"] || latestEntry.sleep || 6,
          exercise_minutes: latestEntry["Activity (min)"] || latestEntry.activity || 20,
          routine_adherence_score: 0.7,
          goal: "maintain"
        };

        console.log("Sending prediction request with data:", userData);

        // Step 3: Get prediction from ML model
        const predictionResponse = await fetch("http://localhost:8080/api/lifestyle/predict-diet", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData)
        });

        const responseText = await predictionResponse.text();
        console.log("Raw prediction response:", responseText);

        let mlResult;
        try {
          mlResult = JSON.parse(responseText);
        } catch (e) {
          console.error("Failed to parse response as JSON:", responseText);
          throw new Error(`Invalid JSON response from server: ${responseText.substring(0, 100)}`);
        }

        if (!predictionResponse.ok) {
          throw new Error(`Prediction failed: ${mlResult.error || mlResult.message || predictionResponse.status}`);
        }

        console.log("ML Prediction result:", mlResult);

        // Step 4: Calculate risk levels
        const riskLevel = calculateRiskLevel(mlResult, latestEntry);
        const probability = calculateProbability(mlResult, latestEntry);
        const factors = identifyRiskFactors(latestEntry, mlResult);
        
        setPredictionData({
          riskLevel: riskLevel,
          probability: probability,
          factors: factors,
          recommendations: generateRecommendations(latestEntry, mlResult),
          nextSteps: generateNextSteps(riskLevel)
        });

        setDebugInfo(null); // Clear debug info on success

      } catch (error) {
        console.error("Error in fetchPrediction:", error);
        setError(error.message || "Failed to load prediction data");
        setDebugInfo({
          message: error.message,
          stack: error.stack
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPrediction();
  }, []);

  const calculateRiskLevel = (mlResult, entry) => {
    if (!mlResult || !mlResult.prediction) return "UNKNOWN";
    
    const bmi = mlResult.prediction.bmi;
    const stage = mlResult.prediction.stage;
    const water = entry["Water (L)"] || entry.water || 0;
    const calories = entry["Calories (kcal)"] || entry.calories || 0;
    const sleep = entry["Sleep (hrs)"] || entry.sleep || 0;
    
    let riskFactors = 0;
    if (water < 1.5) riskFactors++;
    if (calories > 2500) riskFactors++;
    if (sleep < 6) riskFactors++;
    if (bmi > 30) riskFactors += 2;
    else if (bmi > 25) riskFactors++;
    if (stage === "Advanced") riskFactors += 2;
    else if (stage === "Intermediate") riskFactors++;
    
    if (riskFactors >= 4) return "HIGH";
    if (riskFactors >= 2) return "MODERATE";
    return "LOW";
  };

  const calculateProbability = (mlResult, entry) => {
    if (!mlResult || !mlResult.prediction) return 0;
    
    const bmi = mlResult.prediction.bmi;
    const stage = mlResult.prediction.stage;
    const water = entry["Water (L)"] || entry.water || 0;
    const calories = entry["Calories (kcal)"] || entry.calories || 0;
    
    let probability = 20;
    
    if (bmi > 30) probability += 25;
    else if (bmi > 25) probability += 15;
    
    if (stage === "Advanced") probability += 20;
    else if (stage === "Intermediate") probability += 10;
    
    if (water < 1.5) probability += 15;
    else if (water < 2.0) probability += 5;
    
    if (calories > 3000) probability += 15;
    else if (calories > 2500) probability += 10;
    
    return Math.min(probability, 95);
  };

  const identifyRiskFactors = (entry, mlResult) => {
    const factors = [];
    if (!mlResult || !mlResult.prediction) return factors;
    
    const water = entry["Water (L)"] || entry.water || 0;
    const calories = entry["Calories (kcal)"] || entry.calories || 0;
    const sleep = entry["Sleep (hrs)"] || entry.sleep || 0;
    const activity = entry["Activity (min)"] || entry.activity || 0;

    if (water < 2.0) {
      factors.push({
        name: "Low Hydration",
        impact: water < 1.5 ? "High" : "Medium",
        description: `Water intake ${((2.5 - water) / 2.5 * 100).toFixed(0)}% below recommended`
      });
    }

    if (calories > 2200) {
      factors.push({
        name: "High Calorie Intake",
        impact: calories > 3000 ? "High" : "Medium",
        description: `Calorie intake ${((calories - 2000) / 2000 * 100).toFixed(0)}% above recommended`
      });
    }

    if (sleep < 7) {
      factors.push({
        name: "Insufficient Sleep",
        impact: sleep < 6 ? "High" : "Medium",
        description: `Sleep duration ${((8 - sleep) / 8 * 100).toFixed(0)}% below optimal range`
      });
    }

    if (activity < 30) {
      factors.push({
        name: "Limited Physical Activity",
        impact: activity < 15 ? "Medium" : "Low",
        description: `Physical activity ${((30 - activity) / 30 * 100).toFixed(0)}% below recommended`
      });
    }

    if (mlResult.prediction.bmi > 30) {
      factors.push({
        name: "High BMI",
        impact: "High",
        description: `BMI ${mlResult.prediction.bmi.toFixed(1)} indicates obesity`
      });
    } else if (mlResult.prediction.bmi > 25) {
      factors.push({
        name: "Elevated BMI",
        impact: "Medium",
        description: `BMI ${mlResult.prediction.bmi.toFixed(1)} indicates overweight`
      });
    }

    return factors;
  };

  const generateRecommendations = (entry, mlResult) => {
    const recommendations = [];
    if (!mlResult) return recommendations;
    
    const water = entry["Water (L)"] || entry.water || 0;
    const calories = entry["Calories (kcal)"] || entry.calories || 0;
    const sleep = entry["Sleep (hrs)"] || entry.sleep || 0;
    const activity = entry["Activity (min)"] || entry.activity || 0;

    if (water < 2.0) {
      recommendations.push(`Increase water intake to ${(2.5 - water).toFixed(1)}L more daily (target: 2.5L)`);
    } else {
      recommendations.push("Maintain good hydration levels");
    }

    if (mlResult.diet_plan) {
      if (calories > mlResult.diet_plan.daily_calories + 200) {
        recommendations.push(`Reduce daily calories by ${calories - mlResult.diet_plan.daily_calories} to reach ML target of ${mlResult.diet_plan.daily_calories}kcal`);
      } else if (calories < mlResult.diet_plan.daily_calories - 200) {
        recommendations.push(`Increase daily calories to reach ML target of ${mlResult.diet_plan.daily_calories}kcal`);
      } else {
        recommendations.push(`Follow ML diet plan: ${mlResult.diet_plan.protein_g}g protein, ${mlResult.diet_plan.carbs_g}g carbs, ${mlResult.diet_plan.fat_g}g fat`);
      }
    } else {
      recommendations.push("Reduce salt consumption to under 5g per day");
    }

    if (sleep < 7) {
      recommendations.push(`Aim for ${8 - sleep} more hours of quality sleep (target: 7-8 hours)`);
    } else {
      recommendations.push("Maintain good sleep habits");
    }

    if (activity < 30) {
      recommendations.push(`Incorporate ${30 - activity} more minutes of moderate activity daily`);
    } else {
      recommendations.push("Continue your active lifestyle");
    }

    return recommendations;
  };

  const generateNextSteps = (riskLevel) => {
    const steps = [
      "Schedule follow-up in 2 weeks",
      "Consult with nutritionist for diet plan",
      "Monitor blood pressure regularly"
    ];

    if (riskLevel === "HIGH") {
      steps.unshift("Consult with nephrologist immediately");
      steps.push("Consider dietary counseling");
      steps.push("Daily blood pressure monitoring");
    } else if (riskLevel === "MODERATE") {
      steps.unshift("Schedule nutritionist consultation");
      steps.push("Weekly weight tracking");
    } else {
      steps.unshift("Continue healthy habits");
      steps.push("Monthly check-in");
    }

    return steps;
  };

  const getRiskColor = (level) => {
    switch (level) {
      case "LOW": return { bg: "bg-green-500", border: "border-green-500", text: "text-green-600", light: "bg-green-50" };
      case "MODERATE": return { bg: "bg-yellow-500", border: "border-yellow-500", text: "text-yellow-600", light: "bg-yellow-50" };
      case "HIGH": return { bg: "bg-red-500", border: "border-red-500", text: "text-red-600", light: "bg-red-50" };
      default: return { bg: "bg-gray-500", border: "border-gray-500", text: "text-gray-600", light: "bg-gray-50" };
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Analyzing lifestyle data with ML model...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <p className="text-red-600 mb-4">{error}</p>
            {debugInfo && (
              <div className="mt-4 p-4 bg-gray-100 rounded-lg text-left">
                <p className="font-mono text-sm text-gray-700 whitespace-pre-wrap">
                  {debugInfo.message}
                </p>
              </div>
            )}
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  const colors = getRiskColor(predictionData.riskLevel);

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-600">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-100 p-3 rounded-full">
                <Activity className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  CKD Risk Prediction Results
                </h1>
                <p className="text-gray-600">
                  ML-powered lifestyle risk assessment based on your latest data
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className={`bg-white rounded-xl shadow-lg p-8 border-4 ${colors.border} mb-8`}>
          <div className="text-center">
            <h2 className="text-xl font-bold text-gray-700 mb-4">Predicted CKD Risk Level</h2>
            <div className={`inline-block px-12 py-6 ${colors.bg} text-white text-4xl font-bold rounded-2xl shadow-lg mb-6`}>
              {predictionData.riskLevel}
            </div>
            <p className="text-gray-600 mb-4">
              Based on your lifestyle data, there is a <span className="font-bold">{predictionData.probability}%</span> probability of CKD progression risk
            </p>
            
            <div className="w-full max-w-md mx-auto bg-gray-200 rounded-full h-4 mb-2">
              <div 
                className={`h-4 rounded-full transition-all duration-1000 ${colors.bg}`}
                style={{ width: `${predictionData.probability}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-sm text-gray-500 px-2">
              <span>Low Risk</span>
              <span>Moderate Risk</span>
              <span>High Risk</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <AlertTriangle className="w-6 h-6 text-yellow-500" />
            Key Risk Factors Identified
          </h2>
          
          {predictionData.factors.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No significant risk factors identified</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {predictionData.factors.map((factor, index) => (
                <div key={index} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">{factor.name}</h3>
                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                      factor.impact === "High" ? "bg-red-100 text-red-700" :
                      factor.impact === "Medium" ? "bg-yellow-100 text-yellow-700" :
                      "bg-blue-100 text-blue-700"
                    }`}>
                      {factor.impact} Impact
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{factor.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="text-center mb-6">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="bg-gray-600 hover:bg-gray-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2 mx-auto"
          >
            {showDetails ? (
              <>
                <ChevronUp className="w-5 h-5" />
                Hide Detailed Insights
              </>
            ) : (
              <>
                <ChevronDown className="w-5 h-5" />
                View Detailed Insights
              </>
            )}
          </button>
        </div>

        {showDetails && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <CheckCircle className="w-6 h-6 text-green-500" />
                Personalized Recommendations
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {predictionData.recommendations.map((rec, index) => (
                  <div key={index} className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <div className="bg-green-100 p-2 rounded">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      </div>
                      <div>
                        <p className="text-green-800">{rec}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-blue-500" />
                Recommended Next Steps
              </h2>
              
              <div className="space-y-3">
                {predictionData.nextSteps.map((step, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="bg-blue-100 p-2 rounded">
                      <span className="font-bold text-blue-600">{index + 1}</span>
                    </div>
                    <p className="text-blue-800">{step}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-r-lg">
              <div className="flex">
                <AlertTriangle className="w-6 h-6 text-yellow-500 flex-shrink-0 mt-0.5 mr-3" />
                <div>
                  <h3 className="text-lg font-bold text-yellow-900 mb-2">Clinical Decision Support Tool</h3>
                  <div className="text-yellow-800">
                    <p className="mb-2">
                      This AI-powered risk assessment is designed to support clinical decision-making and lifestyle management.
                      It does not replace professional medical advice, diagnosis, or treatment.
                    </p>
                    <p>
                      Please consult with a qualified healthcare provider for comprehensive medical evaluation and personalized care plans.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RiskPrediction;