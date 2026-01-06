import express from 'express';
import {
    createRecipient,
    getAllRecipients,
    getRecipientById,
    updateRecipient,
    deleteRecipient,
    getRecipientStats
} from '../controllers/recipientController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Protect all routes
router.use(protect);

// Statistics (all authenticated users)
router.get('/stats/summary', getRecipientStats);

// CRUD operations (Clinician only for create/update/delete)
router.post('/', authorize('Clinician'), createRecipient);
router.get('/', getAllRecipients);
router.get('/:id', getRecipientById);
router.put('/:id', authorize('Clinician'), updateRecipient);
router.delete('/:id', authorize('Clinician'), deleteRecipient);

export default router;
