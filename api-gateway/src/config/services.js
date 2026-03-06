// Service registry – single source of truth for all microservice URLs & routes

const services = {
  // ── Donor Matching – Node.js/Express backend ──────────────────────────────
  donorMatchingBackend: {
    name: 'Donor Matching Backend',
    target: process.env.DONOR_MATCHING_BACKEND_URL || 'http://localhost:5000',
    // All paths that belong to this service
    routes: [
      '/api/auth',
      '/api/donors',
      '/api/recipients',
      '/api/predictions',
      '/api/reports',
      '/api/users',
    ],
    healthCheck: '/health',
  },

  // ── Donor Matching – FastAPI ML service ───────────────────────────────────
  donorMatchingML: {
    name: 'Donor Matching ML Service',
    target: process.env.DONOR_MATCHING_ML_URL || 'http://localhost:8000',
    routes: ['/api/ml'],
    // Strip /api/ml prefix so FastAPI receives its own paths (e.g. /predict)
    pathRewrite: { '^/api/ml': '' },
    healthCheck: '/health',
  },

  // ── Lifestyle Prediction – Flask ──────────────────────────────────────────
  lifestyle: {
    name: 'Lifestyle Service',
    target: process.env.LIFESTYLE_SERVICE_URL || 'http://localhost:5001',
    routes: ['/api/lifestyle'],
    pathRewrite: { '^/api/lifestyle': '' },
    healthCheck: '/health',
  },

  // ── Ultrasound Image Analysis – Flask ─────────────────────────────────────
  ultrasound: {
    name: 'Ultrasound Service',
    target: process.env.ULTRASOUND_SERVICE_URL || 'http://localhost:5002',
    routes: ['/api/ultrasound'],
    pathRewrite: { '^/api/ultrasound': '' },
    healthCheck: '/health',
  },

  // ── Urine Analysis – Flask ────────────────────────────────────────────────
  urine: {
    name: 'Urine Analysis Service',
    target: process.env.URINE_SERVICE_URL || 'http://localhost:5003',
    routes: ['/api/urine'],
    pathRewrite: { '^/api/urine': '' },
    healthCheck: '/health',
  },
};

export default services;
