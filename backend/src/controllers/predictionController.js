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
        // Get both single and batch predictions
        const singlePredictions = await PredictionResult.find({ user: req.user._id })
            .populate('predictionRequest')
            .sort({ createdAt: -1 });

        const batchPredictions = await BatchPredictionRequest.find({ user: req.user._id })
            .populate('recipientId')
            .sort({ createdAt: -1 });

        // Transform batch predictions to match display format
        const transformedBatchPredictions = [];
        for (const batch of batchPredictions) {
            if (batch.predictions && batch.predictions.length > 0) {
                for (const pred of batch.predictions) {
                    transformedBatchPredictions.push({
                        _id: `${batch._id}_${pred.donorId}`,
                        donorId: pred.donorId,
                        recipientId: batch.recipientId?.recipientId || 'N/A',
                        probability: pred.probability,
                        riskCategory: pred.riskCategory,
                        rank: pred.rank,
                        createdAt: batch.createdAt,
                        batchId: batch._id
                    });
                }
            }
        }

        res.status(200).json({
            success: true,
            count: singlePredictions.length + transformedBatchPredictions.length,
            data: transformedBatchPredictions, // Return batch predictions for now
            singlePredictions: singlePredictions
        });
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
