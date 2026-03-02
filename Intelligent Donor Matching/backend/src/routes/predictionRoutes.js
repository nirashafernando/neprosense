import express from 'express';
import { protect, authorize } from '../middleware/auth.js';
import {
    predictMatch,
    getPredictionResult,
    getMyPredictions,
    getAllPredictions,
    predictBatch,
    getBatchPrediction,
    getBatchPredictionDetails,
    deleteBatchPrediction
} from '../controllers/predictionController.js';
import { generateMatchingReportPDF } from '../controllers/pdfController.js';
import axios from 'axios';

const router = express.Router();

// Health check endpoint (no authentication required)
router.get('/health-check', async (req, res) => {
    try {
        // Check if ML service is responsive
        const mlServiceUrl = process.env.ML_SERVICE_URL || 'http://localhost:8000';
        const response = await axios.get(`${mlServiceUrl}/health`, { timeout: 5000 });
        
        res.json({
            success: true,
            message: 'Services are healthy',
            mlService: response.data
        });
    } catch (error) {
        res.status(503).json({
            success: false,
            message: 'ML service is not available',
            error: error.message
        });
    }
});

// Protect all routes below - authentication required
router.use(protect);

// POST /api/predictions/predict - Create new prediction (Doctor only)
router.post('/predict', authorize('Doctor'), predictMatch);

// POST /api/predictions/predict-batch - Create batch prediction (Doctor only)
router.post('/predict-batch', authorize('Doctor'), predictBatch);

// GET /api/predictions/batch/:id/details - Get detailed batch prediction with explanations
router.get('/batch/:id/details', getBatchPredictionDetails);

// GET /api/predictions/batch/:id/pdf - Download PDF report
router.get('/batch/:id/pdf', generateMatchingReportPDF);

// GET /api/predictions/batch/:id - Get batch prediction
router.get('/batch/:id', getBatchPrediction);

// DELETE /api/predictions/batch/:id - Delete batch prediction
router.delete('/batch/:id', deleteBatchPrediction);

// GET /api/predictions/my-predictions - Get user's predictions
router.get('/my-predictions', getMyPredictions);

// GET /api/predictions/:id - Get specific prediction
router.get('/:id', getPredictionResult);

// GET /api/predictions - Get all predictions (Research Viewer only)
router.get('/', authorize('Research Viewer'), getAllPredictions);

export default router;
