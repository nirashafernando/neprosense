import express from 'express';
import {
    predictMatch,
    predictBatch,
    getBatchPrediction,
    getPredictionResult,
    getMyPredictions,
    getAllPredictions
} from '../controllers/predictionController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Protect all routes
router.use(protect);

// Clinician-only routes
router.post('/predict', authorize('Clinician'), predictMatch);
router.post('/predict-batch', authorize('Clinician'), predictBatch);
router.get('/batch/:id', getBatchPrediction);

// User's own predictions
router.get('/my-predictions', getMyPredictions);

// Single prediction result
router.get('/:id', getPredictionResult);

// All predictions (Research Viewer only)
router.get('/', authorize('Research Viewer'), getAllPredictions);

export default router;
