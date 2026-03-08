import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { createProxyMiddleware } from 'http-proxy-middleware';
import services from './config/services.js';

const app = express();
const PORT = process.env.PORT || 8080;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(morgan('dev'));
app.use(cors({
  origin: FRONTEND_URL,
  credentials: true,
}));

// ── Health check for the gateway itself ───────────────────────────────────────
app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    gateway: 'NephroSense API Gateway',
    timestamp: new Date().toISOString(),
  });
});

// ── Service status endpoint ───────────────────────────────────────────────────
app.get('/gateway/services', (_req, res) => {
  const info = Object.entries(services).map(([key, svc]) => ({
    id: key,
    name: svc.name,
    target: svc.target,
    routes: svc.routes,
  }));
  res.json({ services: info });
});

// ── Register proxy routes for every service ───────────────────────────────────
// Use pathFilter (not app.use(route, ...)) so Express does NOT strip the prefix.
// This ensures the full path (e.g. /api/auth/login) is forwarded to the backend.
for (const [, svc] of Object.entries(services)) {
  for (const route of svc.routes) {
    app.use(
      createProxyMiddleware({
        target: svc.target,
        changeOrigin: true,
        pathFilter: route,
        pathRewrite: svc.pathRewrite || undefined,
        on: {
          error: (err, _req, res) => {
            console.error(`[Gateway] Error proxying to ${svc.name}:`, err.message);
            res.status(502).json({
              error: 'Bad Gateway',
              message: `${svc.name} is unavailable`,
              service: svc.name,
            });
          },
        },
      })
    );
    console.log(`✅  ${route} → ${svc.target} (${svc.name})`);
  }
}

// ── 404 fallback ──────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found on API Gateway' });
});

// ── Start ─────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚀  NephroSense API Gateway running on http://localhost:${PORT}`);
  console.log(`📋  Service registry: http://localhost:${PORT}/gateway/services\n`);
});
