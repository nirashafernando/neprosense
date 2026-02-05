import express from 'express';
import {
    createDonor,
    getAllDonors,
    getDonorById,
    updateDonor,
    deleteDonor,
    getDonorStats
} from '../controllers/donorController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Protect all routes
router.use(protect);

// Statistics (all authenticated users)
router.get('/stats/summary', getDonorStats);

// CRUD operations (Doctor only for create/update/delete)
router.post('/', authorize('Doctor'), createDonor);
router.get('/', getAllDonors);
router.get('/:id', getDonorById);
router.put('/:id', authorize('Doctor'), updateDonor);
router.delete('/:id', authorize('Doctor'), deleteDonor);

export default router;
