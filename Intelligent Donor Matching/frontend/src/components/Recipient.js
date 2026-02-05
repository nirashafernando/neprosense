import React, { useState } from "react";
import { User, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../lib/axios";import { useToast } from "./Toast";
import MedicalTooltip from "./MedicalTooltip";
const AddRecipient = () => {
  const navigate = useNavigate();
  const { showSuccess, showError, ToastComponent } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    recipientId: "",
    name: "",
    weight: "",
    height: "",
    age: "",
    waitingTime: "",
    bloodGroup: "",
    urgencyScore: "",
    gender: "",
    location: "",
    hlaTyping: "",
    // Medical fields for ML predictions
    bmi: "",
    creatinine: "",
    gfr: "",
    systolicBP: "",
    diastolicBP: "",
    dialysisYears: "",
    diabetes: false,
    hypertension: false,
    pra: "",
    previousTransplants: "",
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newFormData = {
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    };
    
    // Auto-calculate BMI when weight or height changes
    if ((name === "weight" || name === "height") && newFormData.weight && newFormData.height) {
      const weightKg = parseFloat(newFormData.weight);
      const heightM = parseFloat(newFormData.height) / 100; // convert cm to meters
      if (weightKg > 0 && heightM > 0) {
        newFormData.bmi = (weightKg / (heightM * heightM)).toFixed(1);
      }
    }
    
    setFormData(newFormData);
    setError(""); // Clear error on change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const recipientData = {
        ...formData,
        weight: parseFloat(formData.weight),
        age: parseInt(formData.age),
        waitingTime: parseInt(formData.waitingTime),
        urgencyScore: parseInt(formData.urgencyScore),
        bmi: formData.bmi ? parseFloat(formData.bmi) : undefined,
        creatinine: formData.creatinine ? parseFloat(formData.creatinine) : undefined,
        gfr: formData.gfr ? parseFloat(formData.gfr) : undefined,
        systolicBP: formData.systolicBP ? parseInt(formData.systolicBP) : undefined,
        diastolicBP: formData.diastolicBP ? parseInt(formData.diastolicBP) : undefined,
        dialysisYears: formData.dialysisYears ? parseFloat(formData.dialysisYears) : undefined,        pra: formData.pra ? parseFloat(formData.pra) : 0,        previousTransplants: formData.previousTransplants ? parseInt(formData.previousTransplants) : 0,
        status: "waiting",
      };

      const response = await api.post('/recipients', recipientData);

      if (response.data.success) {
        showSuccess("Recipient details submitted successfully!");
        // Reset form
        setFormData({
          recipientId: "",
          name: "",
          weight: "",
          height: "",
          age: "",
          waitingTime: "",
          bloodGroup: "",
          urgencyScore: "",
          gender: "",
          location: "",
          hlaTyping: "",
          bmi: "",
          creatinine: "",
          gfr: "",
          systolicBP: "",
          diastolicBP: "",
          dialysisYears: "",
          diabetes: false,
          hypertension: false,
          pra: "",
          previousTransplants: "",
        });
        // Navigate back to dashboard
        navigate("/dashboard");
      }
    } catch (err) {
      console.error("Error saving recipient data:", err);
      setError(err.response?.data?.message || "Failed to submit recipient details. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackToDashboard = () => {
    navigate("/dashboard");
  };

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={handleBackToDashboard}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Dashboard</span>
          </button>

          <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-purple-600">
            <div className="flex items-center space-x-3">
              <div className="bg-purple-100 p-3 rounded-full">
                <User className="w-6 h-6 text-purple-500" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  Add Recipient
                </h1>
                <p className="text-gray-600">
                  Register a new organ transplant recipient
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              {/* Row 1: Recipient ID and Name */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="recipientId" className="block text-sm font-medium text-gray-700 mb-2">
                    Recipient ID
                  </label>
                  <input
                    type="text"
                    id="recipientId"
                    name="recipientId"
                    value={formData.recipientId}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                    placeholder="Enter recipient ID"
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                    placeholder="Enter full name"
                    required
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              {/* Row 2: Weight, Height, and Age */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-2">
                    Weight (kg)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    id="weight"
                    name="weight"
                    value={formData.weight}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                    placeholder="e.g., 65.5"
                    min="1"
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <label htmlFor="height" className="block text-sm font-medium text-gray-700 mb-2">
                    Height (cm)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    id="height"
                    name="height"
                    value={formData.height}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                    placeholder="e.g., 165"
                    min="100"
                    max="250"
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-2">
                    Age
                  </label>
                  <input
                    type="number"
                    id="age"
                    name="age"
                    value={formData.age}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                    placeholder="Enter age"
                    min="1"
                    max="90"
                    required
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              {/* Row 3: Location and Gender */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                    placeholder="Enter location"
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-2">
                    Gender
                  </label>
                  <select
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                    required
                    disabled={isSubmitting}
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
              </div>

              {/* Row 4: Waiting Time and Urgency Score */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="waitingTime" className="block text-sm font-medium text-gray-700 mb-2">
                    Waiting Time (months)
                  </label>
                  <input
                    type="number"
                    id="waitingTime"
                    name="waitingTime"
                    value={formData.waitingTime}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                    placeholder="Enter waiting time"
                    min="0"
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <label htmlFor="urgencyScore" className="block text-sm font-medium text-gray-700 mb-2">
                    Urgency Score (1-10)
                  </label>
                  <input
                    type="number"
                    id="urgencyScore"
                    name="urgencyScore"
                    value={formData.urgencyScore}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                    placeholder="Enter urgency score"
                    min="1"
                    max="10"
                    required
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              {/* Row 5: Blood Group and HLA Typing */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="bloodGroup" className="block text-sm font-medium text-gray-700 mb-2">
                    <MedicalTooltip term="Blood Group" position="top">
                      Blood Group
                    </MedicalTooltip>
                  </label>
                  <select
                    id="bloodGroup"
                    name="bloodGroup"
                    value={formData.bloodGroup}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                    required
                    disabled={isSubmitting}
                  >
                    <option value="">Select blood group</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="hlaTyping" className="block text-sm font-medium text-gray-700 mb-2">
                    <MedicalTooltip term="HLA" position="top">
                      HLA Typing
                    </MedicalTooltip>
                  </label>
                  <input
                    type="text"
                    id="hlaTyping"
                    name="hlaTyping"
                    value={formData.hlaTyping}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                    placeholder="Enter HLA typing results"
                    required
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              {/* Medical Data Section */}
              <div className="border-t pt-6 mt-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Medical Data (Optional - For ML Predictions)</h3>

                {/* BMI and Creatinine */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label htmlFor="bmi" className="block text-sm font-medium text-gray-700 mb-2">
                      <MedicalTooltip term="BMI" position="top">
                        BMI (kg/m²) <span className="text-xs text-gray-500">Auto-calculated</span>
                      </MedicalTooltip>
                    </label>
                    <input
                      type="text"
                      id="bmi"
                      name="bmi"
                      value={formData.bmi || "Enter weight & height"}
                      readOnly
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed text-gray-600"
                      placeholder="Auto-calculated from weight & height"
                      disabled
                    />
                  </div>

                  <div>
                    <label htmlFor="creatinine" className="block text-sm font-medium text-gray-700 mb-2">
                      Creatinine (mg/dL)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      id="creatinine"
                      name="creatinine"
                      value={formData.creatinine}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                      placeholder="e.g., 1.2"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                {/* GFR and Blood Pressure */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div>
                    <label htmlFor="gfr" className="block text-sm font-medium text-gray-700 mb-2">
                      <MedicalTooltip term="eGFR" position="top">
                        GFR (mL/min)
                      </MedicalTooltip>
                    </label>
                    <input
                      type="number"
                      id="gfr"
                      name="gfr"
                      value={formData.gfr}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                      placeholder="e.g., 90"
                      disabled={isSubmitting}
                    />
                  </div>

                  <div>
                    <label htmlFor="systolicBP" className="block text-sm font-medium text-gray-700 mb-2">
                      Systolic BP (mmHg)
                    </label>
                    <input
                      type="number"
                      id="systolicBP"
                      name="systolicBP"
                      value={formData.systolicBP}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                      placeholder="e.g., 120"
                      min="60"
                      max="250"
                      disabled={isSubmitting}
                    />
                  </div>

                  <div>
                    <label htmlFor="diastolicBP" className="block text-sm font-medium text-gray-700 mb-2">
                      Diastolic BP (mmHg)
                    </label>
                    <input
                      type="number"
                      id="diastolicBP"
                      name="diastolicBP"
                      value={formData.diastolicBP}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                      placeholder="e.g., 80"
                      min="40"
                      max="150"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                {/* Dialysis Years, PRA, and Previous Transplants */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div>
                    <label htmlFor="dialysisYears" className="block text-sm font-medium text-gray-700 mb-2">
                      Dialysis Years
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      id="dialysisYears"
                      name="dialysisYears"
                      value={formData.dialysisYears}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                      placeholder="e.g., 3.5"
                      min="0"
                      disabled={isSubmitting}
                    />
                  </div>

                  <div>
                    <label htmlFor="pra" className="block text-sm font-medium text-gray-700 mb-2">
                      <MedicalTooltip term="PRA" position="top">
                        PRA (%) <span className="text-xs text-gray-500">Panel Reactive Antibody</span>
                      </MedicalTooltip>
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      id="pra"
                      name="pra"
                      value={formData.pra}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                      placeholder="e.g., 15.5"
                      min="0"
                      max="100"
                      disabled={isSubmitting}
                    />
                  </div>

                  <div>
                    <label htmlFor="previousTransplants" className="block text-sm font-medium text-gray-700 mb-2">
                      Previous Transplants
                    </label>
                    <input
                      type="number"
                      id="previousTransplants"
                      name="previousTransplants"
                      value={formData.previousTransplants}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                      placeholder="e.g., 0"
                      min="0"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                {/* Medical History Checkboxes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Medical History</label>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        name="diabetes"
                        checked={formData.diabetes}
                        onChange={handleInputChange}
                        className="w-5 h-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                        disabled={isSubmitting}
                      />
                      <span className="text-sm text-gray-700">Diabetes</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        name="hypertension"
                        checked={formData.hypertension}
                        onChange={handleInputChange}
                        className="w-5 h-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                        disabled={isSubmitting}
                      />
                      <span className="text-sm text-gray-700">Hypertension</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                  {error}
                </div>
              )}

              {/* Submit Button */}
              <div className="flex justify-center pt-6">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-8 py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2 min-w-[200px]"
                >
                  <User className="w-5 h-5" />
                  <span>
                    {isSubmitting ? "Submitting..." : "Submit Recipient Details"}
                  </span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
      <ToastComponent />
    </div>
  );
};

export default AddRecipient;
