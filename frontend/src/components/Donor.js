import React, { useState, useEffect, useCallback } from "react";
import { Heart, ArrowLeft, User, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../lib/axios";
import { useToast } from "./Toast";
import MedicalTooltip from "./MedicalTooltip";
import FieldError, { inputClass } from "./FieldError";
import LabReportUpload from "./LabReportUpload";
import FieldSourceBadge from "./FieldSourceBadge";

// ─── Validators ──────────────────────────────────────────────────────────────

const validate = {
  // donorId is auto-generated — no manual validation needed
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
    if (n < 18) return "Donors must be at least 18 years old";
    if (n > 70) return "Donor age cannot exceed 70 years";
    return null;
  },
  weight: (v) => {
    if (v === "" || v === null || v === undefined) return "Weight is required";
    const n = parseFloat(v);
    if (isNaN(n) || n <= 0) return "Enter a valid weight";
    if (n < 30) return "Weight seems too low (min 30 kg)";
    if (n > 300) return "Weight seems too high (max 300 kg)";
    return null;
  },
  height: (v) => {
    if (v === "" || v === null || v === undefined) return "Height is required";
    const n = parseFloat(v);
    if (isNaN(n) || n <= 0) return "Enter a valid height";
    if (n < 100) return "Height seems too low (min 100 cm)";
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
  // Optional medical fields validated only when filled
  gfr: (v) => {
    if (v === "" || v === null || v === undefined) return null; // optional
    const n = parseFloat(v);
    if (isNaN(n)) return "eGFR must be a number";
    if (n < 0) return "eGFR cannot be negative";
    if (n > 200) return "eGFR value seems too high (max 200)";
    return null;
  },
  creatinine: (v) => {
    if (v === "" || v === null || v === undefined) return null;
    const n = parseFloat(v);
    if (isNaN(n)) return "Creatinine must be a number";
    if (n < 0.1) return "Creatinine seems too low";
    if (n > 20) return "Creatinine seems too high (max 20 mg/dL)";
    return null;
  },
  systolicBP: (v) => {
    if (v === "" || v === null || v === undefined) return null;
    const n = parseInt(v);
    if (isNaN(n)) return "Must be a number";
    if (n < 60 || n > 250) return "Systolic BP must be between 60–250 mmHg";
    return null;
  },
  diastolicBP: (v) => {
    if (v === "" || v === null || v === undefined) return null;
    const n = parseInt(v);
    if (isNaN(n)) return "Must be a number";
    if (n < 40 || n > 150) return "Diastolic BP must be between 40–150 mmHg";
    return null;
  },
};

const REQUIRED_FIELDS = ["name", "age", "weight", "height", "location", "gender", "bloodGroup", "hlaTyping"];

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
const FOCUS_GREEN = "focus:ring-green-500 focus:border-green-500";

const AddDonor = () => {
  const navigate = useNavigate();
  const { showSuccess, showError, ToastComponent } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  const [formData, setFormData] = useState({
    donorId: "", name: "", weight: "", height: "", age: "",
    location: "", gender: "", bloodGroup: "", hlaTyping: "",
    bmi: "", creatinine: "", gfr: "",
    systolicBP: "", diastolicBP: "",
    smoking: false, diabetes: false, hypertension: false,
  });

  const [fieldErrors, setFieldErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [fieldSources, setFieldSources] = useState({}); // "lab_report" | "manual" | "not_found" | null

  // ── Auto-generate Donor ID ──────────────────────────────────────────────────
  useEffect(() => {
    const generateId = async () => {
      try {
        const res = await api.get("/donors");
        const donors = res.data?.data || res.data || [];
        // Extract numeric parts from existing IDs like D001, D012
        const nums = donors
          .map(d => parseInt((d.donorId || "").replace(/^D/i, ""), 10))
          .filter(n => !isNaN(n));
        const next = nums.length > 0 ? Math.max(...nums) + 1 : 13;
        const nextId = `D${String(next).padStart(3, "0")}`;
        setFormData(prev => ({ ...prev, donorId: nextId }));
      } catch {
        setFormData(prev => ({ ...prev, donorId: "D013" }));
      }
    };
    generateId();
  }, []);

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

    // If user edits a field that was auto-filled from lab report, mark as manual
    if (fieldSources[name] === "lab_report") {
      setFieldSources((prev) => ({ ...prev, [name]: "manual" }));
    }

    // Validate this field immediately (only if already touched)
    if (touched[name] && validate[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: validate[name](type === "checkbox" ? checked : value) }));
    }
  };

  // ── Lab Report Extraction Handler ──────────────────────────────────────────
  const handleLabReportExtracted = useCallback((extractedFields, notFound) => {
    setFormData((prev) => {
      const updated = { ...prev };
      Object.entries(extractedFields).forEach(([key, value]) => {
        // Only fill if field hasn't been manually edited
        if (fieldSources[key] !== "manual") {
          updated[key] = value;
        }
      });
      // Recalculate BMI if weight/height were extracted
      if (updated.weight && updated.height) {
        const w = parseFloat(updated.weight);
        const h = parseFloat(updated.height) / 100;
        if (w > 0 && h > 0) updated.bmi = (w / (h * h)).toFixed(1);
      }
      return updated;
    });

    // Set field sources
    setFieldSources((prev) => {
      const sources = { ...prev };
      Object.keys(extractedFields).forEach((key) => {
        if (sources[key] !== "manual") {
          sources[key] = "lab_report";
        }
      });
      notFound.forEach((key) => {
        if (!sources[key]) {
          sources[key] = "not_found";
        }
      });
      return sources;
    });
  }, [fieldSources]);

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

    // Mark all required fields as touched and validate
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
      const donorData = {
        ...formData,
        weight: parseFloat(formData.weight),
        age: parseInt(formData.age),
        bmi: formData.bmi ? parseFloat(formData.bmi) : undefined,
        creatinine: formData.creatinine ? parseFloat(formData.creatinine) : undefined,
        gfr: formData.gfr ? parseFloat(formData.gfr) : undefined,
        systolicBP: formData.systolicBP ? parseInt(formData.systolicBP) : undefined,
        diastolicBP: formData.diastolicBP ? parseInt(formData.diastolicBP) : undefined,
        status: "active",
      };

      const response = await api.post("/donors", donorData);
      if (response.data.success) {
        showSuccess("Donor added successfully!");
        navigate("/app/dashboard");
      }
    } catch (err) {
      console.error("Error saving donor:", err);
      setServerError(err.response?.data?.message || "Failed to submit donor details. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Helper for input className ──────────────────────────────────────────────
  const ic = (field) => inputClass(fieldErrors[field], touched[field], BASE_INPUT, FOCUS_GREEN);

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

          <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-green-600">
            <div className="flex items-center space-x-3">
              <div className="bg-green-100 p-3 rounded-full">
                <Heart className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Add New Donor</h1>
                <p className="text-gray-600">Register a new organ donor</p>
              </div>
            </div>
          </div>
        </div>

        {/* Lab Report Upload */}
        <LabReportUpload
          type="donor"
          onExtracted={handleLabReportExtracted}
          accentColor="green"
        />

        {/* Form */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <form onSubmit={handleSubmit} noValidate>
            <div className="space-y-6">

              {/* Row 1: Donor ID and Name */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="donorId" className="block text-sm font-medium text-gray-700 mb-1">
                    Donor ID <span className="text-xs text-gray-400 font-normal">(auto-generated)</span>
                  </label>
                  <input
                    type="text" id="donorId" name="donorId"
                    value={formData.donorId}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-600 font-mono cursor-not-allowed"
                  />
                </div>

                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name <span className="text-rose-500">*</span>
                    <FieldSourceBadge source={fieldSources.name} />
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
                    <FieldSourceBadge source={fieldSources.weight} />
                  </label>
                  <input
                    type="number" step="0.1" id="weight" name="weight"
                    value={formData.weight} onChange={handleInputChange} onBlur={handleBlur}
                    className={ic("weight")} placeholder="e.g. 70.5"
                    disabled={isSubmitting}
                  />
                  <FieldError message={fieldErrors.weight} />
                </div>

                <div>
                  <label htmlFor="height" className="block text-sm font-medium text-gray-700 mb-1">
                    Height (cm) <span className="text-rose-500">*</span>
                    <FieldSourceBadge source={fieldSources.height} />
                  </label>
                  <input
                    type="number" step="0.1" id="height" name="height"
                    value={formData.height} onChange={handleInputChange} onBlur={handleBlur}
                    className={ic("height")} placeholder="e.g. 175"
                    disabled={isSubmitting}
                  />
                  <FieldError message={fieldErrors.height} />
                </div>

                <div>
                  <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">
                    Age <span className="text-rose-500">*</span>
                    <FieldSourceBadge source={fieldSources.age} />
                  </label>
                  <input
                    type="number" id="age" name="age"
                    value={formData.age} onChange={handleInputChange} onBlur={handleBlur}
                    className={ic("age")} placeholder="18 – 70"
                    disabled={isSubmitting}
                  />
                  <FieldError message={fieldErrors.age} />
                </div>
              </div>

              {/* Row 3: Location and Gender */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                    Location / City <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text" id="location" name="location"
                    value={formData.location} onChange={handleInputChange} onBlur={handleBlur}
                    className={ic("location")} placeholder="Enter city/location"
                    disabled={isSubmitting}
                  />
                  <FieldError message={fieldErrors.location} />
                </div>

                <div>
                  <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
                    Gender <span className="text-rose-500">*</span>
                    <FieldSourceBadge source={fieldSources.gender} />
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

              {/* Row 4: Blood Group and HLA Typing */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="bloodGroup" className="block text-sm font-medium text-gray-700 mb-1">
                    <MedicalTooltip term="Blood Group" position="top">Blood Group</MedicalTooltip>{" "}
                    <span className="text-rose-500">*</span>
                    <FieldSourceBadge source={fieldSources.bloodGroup} />
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
                    <FieldSourceBadge source={fieldSources.hlaTyping} />
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

              {/* Medical Data Section (Optional) */}
              <div className="border-t pt-6 mt-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-1">Medical Data</h3>
                <p className="text-xs text-gray-500 mb-4">Optional — used for ML predictions. Validated if provided.</p>

                {/* BMI (auto) + Creatinine */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label htmlFor="bmi" className="block text-sm font-medium text-gray-700 mb-1">
                      <MedicalTooltip term="BMI" position="top">BMI (kg/m²)</MedicalTooltip>{" "}
                      <span className="text-xs text-gray-400">Auto-calculated</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text" id="bmi" name="bmi"
                        value={formData.bmi || ""}
                        readOnly disabled
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 cursor-not-allowed text-gray-500"
                        placeholder="Fill weight & height above"
                      />
                      {formData.bmi && (
                        <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500" />
                      )}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="creatinine" className="block text-sm font-medium text-gray-700 mb-1">
                      Creatinine (mg/dL)
                      <FieldSourceBadge source={fieldSources.creatinine} />
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
                      <FieldSourceBadge source={fieldSources.gfr} />
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
                      <FieldSourceBadge source={fieldSources.systolicBP} />
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
                      <FieldSourceBadge source={fieldSources.diastolicBP} />
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

                {/* Medical History */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Medical History</label>
                  <div className="space-y-3">
                    {[
                      { name: "smoking", label: "Smoking History" },
                      { name: "diabetes", label: "Diabetes" },
                      { name: "hypertension", label: "Hypertension" },
                    ].map(({ name, label }) => (
                      <label key={name} className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox" name={name}
                          checked={formData[name]} onChange={handleInputChange}
                          className="w-5 h-5 rounded border-gray-300 text-green-600 focus:ring-green-500"
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
                  className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-8 py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2 min-w-[200px]"
                >
                  <User className="w-5 h-5" />
                  <span>{isSubmitting ? "Submitting…" : "Submit Donor Details"}</span>
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

export default AddDonor;
