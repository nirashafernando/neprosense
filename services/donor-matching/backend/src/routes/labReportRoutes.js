import express from 'express';
import multer from 'multer';
import { extractFromReport } from '../controllers/labReportController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Configure multer for in-memory file storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB per file
    files: 5,                    // Max 5 files per request
  },
  fileFilter: (_req, file, cb) => {
    const allowed = [
      'image/jpeg', 'image/jpg', 'image/png', 'image/bmp', 'image/tiff',
      'application/pdf',
    ];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only JPG, PNG, BMP, TIFF, and PDF files are supported.'), false);
    }
  },
});

// Protect all routes
router.use(protect);

// POST /api/lab-reports/extract — upload file(s) and extract medical parameters
router.post(
  '/extract',
  authorize('Doctor'),
  upload.array('reports', 5),
  extractFromReport
);

// Multer error handler
router.use((err, _req, res, _next) => {
  if (err instanceof multer.MulterError) {
    const messages = {
      LIMIT_FILE_SIZE: 'File too large. Maximum size is 10 MB.',
      LIMIT_FILE_COUNT: 'Too many files. Maximum is 5 files.',
      LIMIT_UNEXPECTED_FILE: 'Unexpected field name. Use "reports" as the field name.',
    };
    return res.status(400).json({
      success: false,
      message: messages[err.code] || err.message,
    });
  }
  if (err) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
});

export default router;
