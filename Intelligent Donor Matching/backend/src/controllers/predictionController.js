import axios from 'axios';
import PredictionRequest from '../models/PredictionRequest.js';
import PredictionResult from '../models/PredictionResult.js';
import BatchPredictionRequest from '../models/BatchPredictionRequest.js';
import Donor from '../models/Donor.js';
import Recipient from '../models/Recipient.js';

// @desc    Submit donor-recipient matching prediction
// @route   POST /api/predictions/predict
// @access  Private (Clinician only)
export const predictMatch = async (req, res) => {
    try {
        const { donorData, recipientData } = req.body;

        // Validate input
        if (!donorData || !recipientData) {
            return res.status(400).json({
                success: false,
                message: 'Please provide both donor and recipient data'
            });
        }

        // Create prediction request record
        const predictionRequest = await PredictionRequest.create({
            user: req.user._id,
            donorData,
            recipientData,
            status: 'pending'
        });

        try {
            // Call ML service for prediction
            const mlServiceUrl = process.env.ML_SERVICE_URL || 'http://localhost:8000';
            const mlResponse = await axios.post(`${mlServiceUrl}/predict`, {
                donor: donorData,
                recipient: recipientData
            }, {
                timeout: 10000 // 10 second timeout
            });

            const { probability, suitability, threshold } = mlResponse.data;

            // Update prediction request status
            predictionRequest.status = 'completed';
            await predictionRequest.save();

            // Create prediction result record
            const predictionResult = await PredictionResult.create({
                user: req.user._id,
                predictionRequest: predictionRequest._id,
                compatibilityProbability: probability,
                suitabilityDecision: suitability,
                threshold: threshold || 0.5
            });

            res.status(200).json({
                success: true,
                message: 'Prediction completed successfully',
                data: {
                    requestId: predictionRequest._id,
                    resultId: predictionResult._id,
                    probability,
                    suitability,
                    threshold: threshold || 0.5,
                    disclaimer: 'This system provides decision support only and does not replace professional medical judgment.'
                }
            });

        } catch (mlError) {
            // Update prediction request as failed
            predictionRequest.status = 'failed';
            await predictionRequest.save();

            console.error('ML Service error:', mlError.message);

            return res.status(503).json({
                success: false,
                message: 'ML prediction service unavailable. Please ensure the ML service is running.',
                error: mlError.message
            });
        }

    } catch (error) {
        console.error('Prediction error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during prediction',
            error: error.message
        });
    }
};

// @desc    Get prediction result by ID
// @route   GET /api/predictions/:id
// @access  Private
export const getPredictionResult = async (req, res) => {
    try {
        const predictionResult = await PredictionResult.findById(req.params.id)
            .populate('predictionRequest')
            .populate('user', 'name email role');

        if (!predictionResult) {
            return res.status(404).json({
                success: false,
                message: 'Prediction result not found'
            });
        }

        // Check if user has access (own prediction or research viewer can see all)
        if (predictionResult.user._id.toString() !== req.user._id.toString()
            && req.user.role !== 'Research Viewer') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to access this prediction'
            });
        }

        res.status(200).json({
            success: true,
            data: predictionResult
        });

    } catch (error) {
        console.error('Get prediction error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// @desc    Get all predictions for current user
// @route   GET /api/predictions/my-predictions
// @access  Private
export const getMyPredictions = async (req, res) => {
    try {
        // Fetch batch predictions (multi-donor matching)
        const batchPredictions = await BatchPredictionRequest.find({ user: req.user._id })
            .populate('recipientId', 'recipientId name bloodGroup age urgencyScore')
            .populate('donorIds', 'donorId name bloodGroup age')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: batchPredictions.length,
            data: batchPredictions
        });

    } catch (error) {
        console.error('Get my predictions error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// @desc    Get all predictions (Research Viewer only)
// @route   GET /api/predictions
// @access  Private (Research Viewer)
export const getAllPredictions = async (req, res) => {
    try {
        const predictions = await PredictionResult.find()
            .populate('user', 'name email role')
            .populate('predictionRequest')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: predictions.length,
            data: predictions
        });

    } catch (error) {
        console.error('Get all predictions error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// @desc    Batch donor prediction (Research-grade matching)
// @route   POST /api/predictions/predict-batch
// @access  Private (Clinician only)
export const predictBatch = async (req, res) => {
    try {
        const { recipientId, donorIds, selectAll } = req.body;

        if (!recipientId) {
            return res.status(400).json({
                success: false,
                message: 'Please provide recipient ID'
            });
        }

        const recipient = await Recipient.findById(recipientId);
        if (!recipient) {
            return res.status(404).json({
                success: false,
                message: 'Recipient not found'
            });
        }

        let donors;
        if (selectAll) {
            donors = await Donor.find({});
        } else {
            if (!donorIds || donorIds.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Please select at least one donor'
                });
            }
            donors = await Donor.find({ _id: { $in: donorIds } });
        }

        if (!donors || donors.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No donors found'
            });
        }

        const recipientData = {
            recipientId: recipient.recipientId,
            age: recipient.age,
            bloodGroup: recipient.bloodGroup,
            hlaTyping: recipient.hlaTyping || '',
            bmi: recipient.bmi || 24.0,
            creatinine: recipient.creatinine || 2.0,
            gfr: recipient.gfr || 50,
            systolicBP: recipient.systolicBP || 130,
            diastolicBP: recipient.diastolicBP || 85,
            dialysisYears: recipient.dialysisYears || 0,
            diabetes: recipient.diabetes || false,
            hypertension: recipient.hypertension || false,
            previousTransplants: recipient.previousTransplants || 0
        };

        const donorsData = donors.map(donor => ({
            donorId: donor.donorId,
            age: donor.age,
            bloodGroup: donor.bloodGroup,
            hlaTyping: donor.hlaTyping || '',
            bmi: donor.bmi || 24.0,
            creatinine: donor.creatinine || 1.0,
            gfr: donor.gfr || 90,
            systolicBP: donor.systolicBP || 120,
            diastolicBP: donor.diastolicBP || 80,
            smoking: donor.smoking || false,
            diabetes: donor.diabetes || false,
            hypertension: donor.hypertension || false
        }));

        try {
            const mlServiceUrl = process.env.ML_SERVICE_URL || 'http://localhost:8000';
            const mlResponse = await axios.post(`${mlServiceUrl}/predict-batch`, {
                recipient: recipientData,
                donors: donorsData
            }, { timeout: 30000 });

            if (!mlResponse.data.success) {
                throw new Error('ML service returned unsuccessful response');
            }

            const { predictions, topDonors, totalEvaluated } = mlResponse.data;

            const predictionsWithRefs = predictions.map(pred => {
                const donor = donors.find(d => d.donorId === pred.donorId);
                return {
                    ...pred,
                    donor_ref: donor ? donor._id : null
                };
            });

            const batchPrediction = await BatchPredictionRequest.create({
                user: req.user._id,
                recipientId: recipient._id,
                donorIds: donors.map(d => d._id),
                selectAll: selectAll || false,
                predictions: predictionsWithRefs,
                topDonors: topDonors.map(td => {
                    const donor = donors.find(d => d.donorId === td.donorId);
                    return {
                        ...td,
                        donor_ref: donor ? donor._id : null
                    };
                }),
                totalEvaluated,
                status: 'completed'
            });

            res.status(200).json({
                success: true,
                message: `Batch prediction completed. ${totalEvaluated} donors evaluated.`,
                data: {
                    batchPredictionId: batchPrediction._id,
                    recipientId: recipient.recipientId,
                    predictions: predictionsWithRefs,
                    topDonors,
                    totalEvaluated,
                    disclaimer: 'This system provides decision support only. Final clinical decisions must be made by qualified medical professionals.'
                }
            });

        } catch (mlError) {
            console.error('ML Service batch prediction error:', mlError.message);
            return res.status(503).json({
                success: false,
                message: 'ML batch prediction service unavailable',
                error: mlError.message
            });
        }

    } catch (error) {
        console.error('Batch prediction error:', error);
        res.status(500).json({
            success: false,
            message: 'Batch prediction failed',
            error: error.message
        });
    }
};

// @desc    Get batch prediction by ID
// @route   GET /api/predictions/batch/:id
// @access  Private
export const getBatchPrediction = async (req, res) => {
    try {
        const batchPrediction = await BatchPredictionRequest.findById(req.params.id)
            .populate('recipientId')
            .populate('donorIds')
            .populate('predictions.donor_ref')
            .populate('topDonors.donor_ref');

        if (!batchPrediction) {
            return res.status(404).json({
                success: false,
                message: 'Batch prediction not found'
            });
        }

        if (batchPrediction.user.toString() !== req.user._id.toString() && req.user.role !== 'Admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to view this prediction'
            });
        }

        res.status(200).json({
            success: true,
            data: batchPrediction
        });

    } catch (error) {
        console.error('Get batch prediction error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve batch prediction',
            error: error.message
        });
    }
};

// @desc    Get detailed batch prediction for modal view
// @route   GET /api/predictions/batch/:id/details
// @access  Private
export const getBatchPredictionDetails = async (req, res) => {
    try {
        const batchPrediction = await BatchPredictionRequest.findById(req.params.id)
            .populate('recipientId')
            .populate('donorIds')
            .populate('user', 'name email role');

        if (!batchPrediction) {
            return res.status(404).json({
                success: false,
                message: 'Batch prediction not found'
            });
        }

        // Authorization check
        if (batchPrediction.user._id.toString() !== req.user._id.toString() && req.user.role !== 'Admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to view this prediction'
            });
        }

        // Get top 3 donors
        const top3Donors = batchPrediction.predictions
            .sort((a, b) => b.probability - a.probability) // Higher probability = better match (FIXED)
            .slice(0, 3)
            .map((pred, index) => {
                const donor = batchPrediction.donorIds.find(d => d.donorId === pred.donorId);

                return {
                    rank: index + 1,
                    donorId: pred.donorId,
                    donor: donor || null,
                    matchScore: Math.round(pred.probability * 100), // FIXED: Use probability directly
                    probability: pred.probability,
                    riskCategory: pred.riskCategory,
                    shapExplanation: pred.shapExplanation || [],
                    parameters: {
                        bloodGroup: donor?.bloodGroup || 'N/A',
                        age: donor?.age || 0,
                        bmi: donor?.bmi || 0,
                        gfr: donor?.gfr || 0,
                        hlaMatchScore: pred.parameters?.hlaMatchScore || pred.hlaMatchScore || 0,  // Read from parameters object
                        diabetes: donor?.diabetes || false,
                        hypertension: donor?.hypertension || false,
                        smoking: donor?.smoking || false
                    }
                };
            });

        // Generate human-readable explanation for top donor
        const topDonor = top3Donors[0];
        const recipient = batchPrediction.recipientId;
        const reasons = generateMatchExplanation(topDonor, recipient);

        // Generate comparison highlights
        const comparisonHighlights = {};
        top3Donors.forEach(donor => {
            const highlights = [];

            if (donor.rank === 1) {
                if (donor.parameters.bloodGroup === recipient.bloodGroup) {
                    highlights.push("Perfect blood match");
                }
                if (donor.parameters.age < 40) {
                    highlights.push("Young donor");
                }
                if (donor.parameters.gfr >= 90) {
                    highlights.push("Excellent kidney function");
                }
                if (!donor.parameters.diabetes && !donor.parameters.hypertension) {
                    highlights.push("No comorbidities");
                }
            } else {
                // Highlight specific strengths for other donors
                if (donor.parameters.hlaMatchScore > topDonor.parameters.hlaMatchScore) {
                    highlights.push("Better HLA match");
                }
                if (donor.parameters.bmi >= 18.5 && donor.parameters.bmi <= 25) {
                    highlights.push("Ideal BMI");
                }
            }

            comparisonHighlights[donor.donorId] = highlights;
        });

        res.status(200).json({
            success: true,
            data: {
                batchPredictionId: batchPrediction._id,
                recipient: {
                    recipientId: recipient.recipientId,
                    name: recipient.name,
                    age: recipient.age,
                    bloodGroup: recipient.bloodGroup,
                    urgencyScore: recipient.urgencyScore,
                    dialysisYears: recipient.dialysisYears || 0
                },
                topDonors: top3Donors,
                explanation: {
                    topDonorId: topDonor.donorId,
                    reasons: reasons,
                    comparisonHighlights: comparisonHighlights
                },
                totalEvaluated: batchPrediction.totalEvaluated
            }
        });

    } catch (error) {
        console.error('Get batch prediction details error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve prediction details',
            error: error.message
        });
    }
};

// Helper function to generate human-readable explanations
function generateMatchExplanation(topDonor, recipient) {
    const reasons = [];
    const donor = topDonor.donor;
    const params = topDonor.parameters;

    // Blood group compatibility
    if (params.bloodGroup === recipient.bloodGroup) {
        reasons.push(`Perfect blood type match (${params.bloodGroup} → ${recipient.bloodGroup})`);
    } else if (params.bloodGroup === 'O-' || params.bloodGroup === 'O+') {
        reasons.push(`Universal donor compatibility (${params.bloodGroup} → ${recipient.bloodGroup})`);
    } else {
        reasons.push(`Blood type compatible (${params.bloodGroup} → ${recipient.bloodGroup})`);
    }

    // Age compatibility
    const ageDiff = Math.abs(params.age - recipient.age);
    if (ageDiff < 15) {
        reasons.push(`Excellent age compatibility (${ageDiff} year difference, optimal range)`);
    } else if (ageDiff < 25) {
        reasons.push(`Good age compatibility (${ageDiff} year difference, acceptable range)`);
    } else {
        reasons.push(`Age difference of ${ageDiff} years within acceptable limits`);
    }

    // HLA matching
    if (params.hlaMatchScore >= 5) {
        reasons.push(`Strong HLA tissue compatibility (${params.hlaMatchScore}/6 antigens matched)`);
    } else if (params.hlaMatchScore >= 3) {
        reasons.push(`Adequate HLA tissue compatibility (${params.hlaMatchScore}/6 antigens matched)`);
    }

    // Kidney function
    if (params.gfr >= 90) {
        reasons.push(`Excellent donor kidney function (eGFR: ${params.gfr} ml/min/1.73m²)`);
    } else if (params.gfr >= 60) {
        reasons.push(`Good donor kidney function (eGFR: ${params.gfr} ml/min/1.73m²)`);
    }

    // Health profile
    if (!params.diabetes && !params.hypertension && !params.smoking) {
        reasons.push("Clean donor health profile (no diabetes, hypertension, or smoking history)");
    } else {
        const conditions = [];
        if (params.diabetes) conditions.push("diabetes");
        if (params.hypertension) conditions.push("hypertension");
        if (params.smoking) conditions.push("smoking");
        reasons.push(`Donor has ${conditions.join(', ')} - managed risk factors`);
    }

    // Overall risk
    if (topDonor.riskCategory?.category === 'Low Risk') {
        reasons.push("Low rejection risk prediction based on comprehensive analysis");
    } else if (topDonor.riskCategory?.category === 'Medium Risk') {
        reasons.push("Medium rejection risk - careful post-transplant monitoring recommended");
    }

    return reasons;
}

