import React, { useState } from "react";
import { User, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../lib/axios";
import { useToast } from "./Toast";
import MedicalTooltip from "./MedicalTooltip";
import FieldError, { inputClass } from "./FieldError";

// ─── Validators ──────────────────────────────────────────────────────────────

const validate = {
  recipientId: (v) => {
    if (!v?.trim()) return "Recipient ID is required";
    if (!/^[A-Z0-9\-]+$/i.test(v)) return "Only letters, numbers, and hyphens allowed";
    if (v.trim().length < 3) return "Recipient ID must be at least 3 characters";
    return null;
  },
  name: (v) => {
    if (!v?.trim()) return "Full name is required";
    if (v.trim().length < 2) return "Name must be at least 2 characters";
    if (!/^[a-zA-Z\s.\-']+$/.test(v)) return "Name can only contain letters, spaces and . - '";
    return null;
  },
  age: (v) => {
    if (v === "" || v === null || v === undefined) return "Age is required";
    const n = parseInt(v);
    if (isNaN(n)) return "Age must be a number";
    if (n < 1) return "Age must be at least 1";
    if (n > 90) return "Age cannot exceed 90";
    return null;
  },
  weight: (v) => {
    if (v === "" || v === null || v === undefined) return "Weight is required";
    const n = parseFloat(v);
    if (isNaN(n) || n <= 0) return "Enter a valid weight";
    if (n < 10) return "Weight seems too low (min 10 kg)";
    if (n > 300) return "Weight seems too high (max 300 kg)";
    return null;
  },
  height: (v) => {
    if (v === "" || v === null || v === undefined) return "Height is required";
    const n = parseFloat(v);
    if (isNaN(n) || n <= 0) return "Enter a valid height";
    if (n < 60) return "Height seems too low (min 60 cm)";
    if (n > 250) return "Height cannot exceed 250 cm";
    return null;
  },
  location: (v) => {
    if (!v?.trim()) return "Location is required";
    if (v.trim().length < 2) return "Enter a valid city/location";
    return null;
  },
  gender: (v) => (!v ? "Please select a gender" : null),
  bloodGroup: (v) => (!v ? "Please select a blood group" : null),
  hlaTyping: (v) => {
    if (!v?.trim()) return "HLA typing is required";
    const clean = v.trim().replace(/\s+/g, "").toUpperCase();
    const parts = clean.split(",").filter(Boolean);
    if (parts.length !== 6) return "HLA must have exactly 6 antigens (e.g. A1,A2,B7,B8,DR3,DR4)";
    if (parts.some((p) => !/^[A-Z]+\d+$/.test(p))) return "Invalid format — use e.g. A1,A2,B7,B8,DR3,DR4";
    return null;
  },
  waitingTime: (v) => {
    if (v === "" || v === null || v === undefined) return "Waiting time is required";
    const n = parseInt(v);
    if (isNaN(n)) return "Must be a number";
    if (n < 0) return "Waiting time cannot be negative";
    if (n > 600) return "Waiting time seems too high (max 600 months)";
    return null;
  },
  urgencyScore: (v) => {
    if (v === "" || v === null || v === undefined) return "Urgency score is required";
    const n = parseInt(v);
    if (isNaN(n)) return "Must be a number";
    if (n < 1 || n > 10) return "Urgency score must be between 1 and 10";
    return null;
  },
  // Optional medical fields
  gfr: (v) => {
    if (v === "" || v === null || v === undefined) return null;
    const n = parseFloat(v);
    if (isNaN(n)) return "eGFR must be a number";
    if (n < 0 || n > 200) return "eGFR must be between 0 and 200";
    return null;
  },
  creatinine: (v) => {
    if (v === "" || v === null || v === undefined) return null;
    const n = parseFloat(v);
    if (isNaN(n)) return "Must be a number";
    if (n < 0.1 || n > 20) return "Creatinine must be between 0.1–20 mg/dL";
    return null;
  },
  systolicBP: (v) => {
    if (v === "" || v === null || v === undefined) return null;
    const n = parseInt(v);
    if (isNaN(n)) return "Must be a number";
    if (n < 60 || n > 250) return "Systolic BP must be 60–250 mmHg";
    return null;
  },
  diastolicBP: (v) => {
    if (v === "" || v === null || v === undefined) return null;
    const n = parseInt(v);
    if (isNaN(n)) return "Must be a number";
    if (n < 40 || n > 150) return "Diastolic BP must be 40–150 mmHg";
    return null;
  },
  pra: (v) => {
    if (v === "" || v === null || v === undefined) return null;
    const n = parseFloat(v);
    if (isNaN(n)) return "Must be a number";
    if (n < 0 || n > 100) return "PRA must be between 0 and 100%";
    return null;
  },
  dialysisYears: (v) => {
    if (v === "" || v === null || v === undefined) return null;
    const n = parseFloat(v);
    if (isNaN(n)) return "Must be a number";
    if (n < 0) return "Cannot be negative";
    if (n > 50) return "Dialysis years seems too high";
    return null;
  },
  previousTransplants: (v) => {
    if (v === "" || v === null || v === undefined) return null;
    const n = parseInt(v);
    if (isNaN(n)) return "Must be a whole number";
    if (n < 0) return "Cannot be negative";
    if (n > 10) return "Previous transplants count seems too high";
    return null;
  },
};

const REQUIRED_FIELDS = [
  "recipientId", "name", "age", "weight", "height",
  "location", "gender", "bloodGroup", "hlaTyping",
  "waitingTime", "urgencyScore",
];

const validateAll = (formData) => {
  const errors = {};
  Object.keys(validate).forEach((field) => {
    const err = validate[field](formData[field]);
    if (err) errors[field] = err;
  });
  return errors;
};

// ─── Component ───────────────────────────────────────────────────────────────

const BASE_INPUT = "w-full px-3 py-2 border rounded-lg focus:ring-2 transition-colors";
const FOCUS_PURPLE = "focus:ring-purple-500 focus:border-purple-500";

const AddRecipient = () => {
  const navigate = useNavigate();
  const { showSuccess, showError, ToastComponent } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  const [formData, setFormData] = useState({
    recipientId: "", name: "", weight: "", height: "", age: "",
    waitingTime: "", bloodGroup: "", urgencyScore: "",
    gender: "", location: "", hlaTyping: "",
    bmi: "", creatinine: "", gfr: "",
    systolicBP: "", diastolicBP: "",
    dialysisYears: "", diabetes: false, hypertension: false,
    pra: "", previousTransplants: "",
  });

  const [fieldErrors, setFieldErrors] = useState({});
  const [touched, setTouched] = useState({});

  // ── Handlers ────────────────────────────────────────────────────────────────

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    let newFormData = { ...formData, [name]: type === "checkbox" ? checked : value };

    // Auto-calculate BMI
    if ((name === "weight" || name === "height") && newFormData.weight && newFormData.height) {
      const w = parseFloat(newFormData.weight);
      const h = parseFloat(newFormData.height) / 100;
      if (w > 0 && h > 0) newFormData.bmi = (w / (h * h)).toFixed(1);
    }

    setFormData(newFormData);
    setServerError("");

    if (touched[name] && validate[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: validate[name](type === "checkbox" ? checked : value) }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    if (validate[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: validate[name](value) }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");

    const allTouched = REQUIRED_FIELDS.reduce((acc, f) => ({ ...acc, [f]: true }), {});
    setTouched((prev) => ({ ...prev, ...allTouched }));
    const errors = validateAll(formData);
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) {
      showError("Please fix the errors before submitting.");
      return;
    }

    setIsSubmitting(true);
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
        dialysisYears: formData.dialysisYears ? parseFloat(formData.dialysisYears) : undefined,
        pra: formData.pra ? parseFloat(formData.pra) : 0,
        previousTransplants: formData.previousTransplants ? parseInt(formData.previousTransplants) : 0,
        status: "waiting",
      };

      const response = await api.post("/recipients", recipientData);
      if (response.data.success) {
        showSuccess("Recipient added successfully!");
        navigate("/app/dashboard");
      }
    } catch (err) {
      console.error("Error saving recipient:", err);
      setServerError(err.response?.data?.message || "Failed to submit recipient details. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const ic = (field) => inputClass(fieldErrors[field], touched[field], BASE_INPUT, FOCUS_PURPLE);

  // ── JSX ────────────────────────────────────────────────────────────────────
  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/app/dashboard")}
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
                <h1 className="text-2xl font-bold text-gray-800">Add Recipient</h1>
                <p className="text-gray-600">Register a new organ transplant recipient</p>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <form onSubmit={handleSubmit} noValidate>
            <div className="space-y-6">

              {/* Row 1: IDs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="recipientId" className="block text-sm font-medium text-gray-700 mb-1">
                    Recipient ID <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text" id="recipientId" name="recipientId"
                    value={formData.recipientId} onChange={handleInputChange} onBlur={handleBlur}
                    className={ic("recipientId")} placeholder="e.g. R001 or REC-001"
                    disabled={isSubmitting}
                  />
                  <FieldError message={fieldErrors.recipientId} />
                </div>

                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text" id="name" name="name"
                    value={formData.name} onChange={handleInputChange} onBlur={handleBlur}
                    className={ic("name")} placeholder="Enter full name"
                    disabled={isSubmitting}
                  />
                  <FieldError message={fieldErrors.name} />
                </div>
              </div>

              {/* Row 2: Weight, Height, Age */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-1">
                    Weight (kg) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number" step="0.1" id="weight" name="weight"
                    value={formData.weight} onChange={handleInputChange} onBlur={handleBlur}
                    className={ic("weight")} placeholder="e.g. 65.5"
                    disabled={isSubmitting}
                  />
                  <FieldError message={fieldErrors.weight} />
                </div>

                <div>
                  <label htmlFor="height" className="block text-sm font-medium text-gray-700 mb-1">
                    Height (cm) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number" step="0.1" id="height" name="height"
                    value={formData.height} onChange={handleInputChange} onBlur={handleBlur}
                    className={ic("height")} placeholder="e.g. 165"
                    disabled={isSubmitting}
                  />
                  <FieldError message={fieldErrors.height} />
                </div>

                <div>
                  <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">
                    Age <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number" id="age" name="age"
                    value={formData.age} onChange={handleInputChange} onBlur={handleBlur}
                    className={ic("age")} placeholder="1 – 90"
                    disabled={isSubmitting}
                  />
                  <FieldError message={fieldErrors.age} />
                </div>
              </div>

              {/* Row 3: Location and Gender */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                    Location <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text" id="location" name="location"
                    value={formData.location} onChange={handleInputChange} onBlur={handleBlur}
                    className={ic("location")} placeholder="Enter location"
                    disabled={isSubmitting}
                  />
                  <FieldError message={fieldErrors.location} />
                </div>

                <div>
                  <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
                    Gender <span className="text-rose-500">*</span>
                  </label>
                  <select
                    id="gender" name="gender"
                    value={formData.gender} onChange={handleInputChange} onBlur={handleBlur}
                    className={ic("gender")} disabled={isSubmitting}
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                  <FieldError message={fieldErrors.gender} />
                </div>
              </div>

              {/* Row 4: Waiting Time + Urgency */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="waitingTime" className="block text-sm font-medium text-gray-700 mb-1">
                    Waiting Time (months) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number" id="waitingTime" name="waitingTime"
                    value={formData.waitingTime} onChange={handleInputChange} onBlur={handleBlur}
                    className={ic("waitingTime")} placeholder="e.g. 12"
                    disabled={isSubmitting}
                  />
                  <FieldError message={fieldErrors.waitingTime} />
                </div>

                <div>
                  <label htmlFor="urgencyScore" className="block text-sm font-medium text-gray-700 mb-1">
                    Urgency Score (1–10) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number" id="urgencyScore" name="urgencyScore"
                    value={formData.urgencyScore} onChange={handleInputChange} onBlur={handleBlur}
                    className={ic("urgencyScore")} placeholder="1 = Low, 10 = Critical"
                    disabled={isSubmitting}
                  />
                  <FieldError message={fieldErrors.urgencyScore} />
                </div>
              </div>

              {/* Row 5: Blood Group and HLA */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="bloodGroup" className="block text-sm font-medium text-gray-700 mb-1">
                    <MedicalTooltip term="Blood Group" position="top">Blood Group</MedicalTooltip>{" "}
                    <span className="text-rose-500">*</span>
                  </label>
                  <select
                    id="bloodGroup" name="bloodGroup"
                    value={formData.bloodGroup} onChange={handleInputChange} onBlur={handleBlur}
                    className={ic("bloodGroup")} disabled={isSubmitting}
                  >
                    <option value="">Select blood group</option>
                    {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((g) => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                  <FieldError message={fieldErrors.bloodGroup} />
                </div>

                <div>
                  <label htmlFor="hlaTyping" className="block text-sm font-medium text-gray-700 mb-1">
                    <MedicalTooltip term="HLA" position="top">HLA Typing</MedicalTooltip>{" "}
                    <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text" id="hlaTyping" name="hlaTyping"
                    value={formData.hlaTyping} onChange={handleInputChange} onBlur={handleBlur}
                    className={ic("hlaTyping")} placeholder="e.g. A1,A2,B7,B8,DR3,DR4"
                    disabled={isSubmitting}
                  />
                  <p className="text-xs text-gray-400 mt-1">6 antigens separated by commas</p>
                  <FieldError message={fieldErrors.hlaTyping} />
                </div>
              </div>

              {/* Medical Data (Optional) */}
              <div className="border-t pt-6 mt-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-1">Medical Data</h3>
                <p className="text-xs text-gray-500 mb-4">Optional — used for ML predictions. Validated if provided.</p>

                {/* BMI + Creatinine */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label htmlFor="bmi" className="block text-sm font-medium text-gray-700 mb-1">
                      <MedicalTooltip term="BMI" position="top">BMI (kg/m²)</MedicalTooltip>{" "}
                      <span className="text-xs text-gray-400">Auto-calculated</span>
                    </label>
                    <input
                      type="text" id="bmi" name="bmi"
                      value={formData.bmi || ""} readOnly disabled
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 cursor-not-allowed text-gray-500"
                      placeholder="Fill weight & height above"
                    />
                  </div>

                  <div>
                    <label htmlFor="creatinine" className="block text-sm font-medium text-gray-700 mb-1">
                      Creatinine (mg/dL)
                    </label>
                    <input
                      type="number" step="0.1" id="creatinine" name="creatinine"
                      value={formData.creatinine} onChange={handleInputChange} onBlur={handleBlur}
                      className={ic("creatinine")} placeholder="e.g. 1.2"
                      disabled={isSubmitting}
                    />
                    <FieldError message={fieldErrors.creatinine} />
                  </div>
                </div>

                {/* GFR + BP */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div>
                    <label htmlFor="gfr" className="block text-sm font-medium text-gray-700 mb-1">
                      <MedicalTooltip term="eGFR" position="top">GFR (mL/min)</MedicalTooltip>
                    </label>
                    <input
                      type="number" id="gfr" name="gfr"
                      value={formData.gfr} onChange={handleInputChange} onBlur={handleBlur}
                      className={ic("gfr")} placeholder="e.g. 90"
                      disabled={isSubmitting}
                    />
                    <FieldError message={fieldErrors.gfr} />
                  </div>

                  <div>
                    <label htmlFor="systolicBP" className="block text-sm font-medium text-gray-700 mb-1">
                      Systolic BP (mmHg)
                    </label>
                    <input
                      type="number" id="systolicBP" name="systolicBP"
                      value={formData.systolicBP} onChange={handleInputChange} onBlur={handleBlur}
                      className={ic("systolicBP")} placeholder="e.g. 120"
                      disabled={isSubmitting}
                    />
                    <FieldError message={fieldErrors.systolicBP} />
                  </div>

                  <div>
                    <label htmlFor="diastolicBP" className="block text-sm font-medium text-gray-700 mb-1">
                      Diastolic BP (mmHg)
                    </label>
                    <input
                      type="number" id="diastolicBP" name="diastolicBP"
                      value={formData.diastolicBP} onChange={handleInputChange} onBlur={handleBlur}
                      className={ic("diastolicBP")} placeholder="e.g. 80"
                      disabled={isSubmitting}
                    />
                    <FieldError message={fieldErrors.diastolicBP} />
                  </div>
                </div>

                {/* Dialysis, PRA, Previous Transplants */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div>
                    <label htmlFor="dialysisYears" className="block text-sm font-medium text-gray-700 mb-1">
                      Dialysis Years
                    </label>
                    <input
                      type="number" step="0.1" id="dialysisYears" name="dialysisYears"
                      value={formData.dialysisYears} onChange={handleInputChange} onBlur={handleBlur}
                      className={ic("dialysisYears")} placeholder="e.g. 3.5"
                      disabled={isSubmitting}
                    />
                    <FieldError message={fieldErrors.dialysisYears} />
                  </div>

                  <div>
                    <label htmlFor="pra" className="block text-sm font-medium text-gray-700 mb-1">
                      <MedicalTooltip term="PRA" position="top">PRA (%)</MedicalTooltip>
                    </label>
                    <input
                      type="number" step="0.1" id="pra" name="pra"
                      value={formData.pra} onChange={handleInputChange} onBlur={handleBlur}
                      className={ic("pra")} placeholder="e.g. 15.5"
                      disabled={isSubmitting}
                    />
                    <FieldError message={fieldErrors.pra} />
                  </div>

                  <div>
                    <label htmlFor="previousTransplants" className="block text-sm font-medium text-gray-700 mb-1">
                      Previous Transplants
                    </label>
                    <input
                      type="number" id="previousTransplants" name="previousTransplants"
                      value={formData.previousTransplants} onChange={handleInputChange} onBlur={handleBlur}
                      className={ic("previousTransplants")} placeholder="e.g. 0"
                      disabled={isSubmitting}
                    />
                    <FieldError message={fieldErrors.previousTransplants} />
                  </div>
                </div>

                {/* Medical History */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Medical History</label>
                  <div className="space-y-3">
                    {[
                      { name: "diabetes", label: "Diabetes" },
                      { name: "hypertension", label: "Hypertension" },
                    ].map(({ name, label }) => (
                      <label key={name} className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox" name={name}
                          checked={formData[name]} onChange={handleInputChange}
                          className="w-5 h-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                          disabled={isSubmitting}
                        />
                        <span className="text-sm text-gray-700">{label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Server Error */}
              {serverError && (
                <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-lg flex items-center gap-2">
                  <span>{serverError}</span>
                </div>
              )}

              {/* Submit */}
              <div className="flex justify-center pt-6">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-8 py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2 min-w-[200px]"
                >
                  <User className="w-5 h-5" />
                  <span>{isSubmitting ? "Submitting…" : "Submit Recipient Details"}</span>
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
