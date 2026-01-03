import express from 'express';
import { protect, authorize } from '../middleware/auth.js';
import {
    predictMatch,
    getPredictionResult,
    getMyPredictions,
    getAllPredictions,
    predictBatch,
    getBatchPrediction,
    getBatchPredictionDetails
} from '../controllers/predictionController.js';
import { generateMatchingReportPDF } from '../controllers/pdfController.js';

const router = express.Router();

// Protect all routes - authentication required
router.use(protect);

// POST /api/predictions/predict - Create new prediction (Clinician only)
router.post('/predict', authorize('Clinician'), predictMatch);

// POST /api/predictions/predict-batch - Create batch prediction (Clinician only)
router.post('/predict-batch', authorize('Clinician'), predictBatch);

// GET /api/predictions/batch/:id/details - Get detailed batch prediction with explanations
router.get('/batch/:id/details', getBatchPredictionDetails);

// GET /api/predictions/batch/:id/pdf - Download PDF report
router.get('/batch/:id/pdf', generateMatchingReportPDF);

// GET /api/predictions/batch/:id - Get batch prediction
router.get('/batch/:id', getBatchPrediction);

// GET /api/predictions/my-predictions - Get user's predictions
router.get('/my-predictions', getMyPredictions);

// GET /api/predictions/:id - Get specific prediction
router.get('/:id', getPredictionResult);

// GET /api/predictions - Get all predictions (Research Viewer only)
router.get('/', authorize('Research Viewer'), getAllPredictions);

export default router;
