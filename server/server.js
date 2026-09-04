import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import { connectDB } from './config/db.js';

// Route imports
import authRoutes from './routes/authRoutes.js';
import farmRoutes from './routes/farmRoutes.js';
import cropRoutes from './routes/cropRoutes.js';
import recommendationRoutes from './routes/recommendationRoutes.js';
import marketRoutes from './routes/marketRoutes.js';
import weatherRoutes from './routes/weatherRoutes.js';
import feedbackRoutes from './routes/feedbackRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import subscriptionRoutes from './routes/subscriptionRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();

  // Port configuration: use process.env.PORT or fallback to 3000 (container default) / 5000
  const PORT = process.env.PORT || 3000;

  // Database Connection
  await connectDB();

  // Middleware
  app.use(
    cors({
      origin: '*',
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'x-user-id'],
    })
  );
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));

  // API Health Check
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'healthy',
      service: 'FarmPro Recommendation & Market API',
      timestamp: new Date().toISOString(),
    });
  });

  // Mount API Endpoints
  app.use('/api/auth', authRoutes);
  app.use('/api/farms', farmRoutes);
  app.use('/api/crops', cropRoutes);
  app.use('/api/recommendations', recommendationRoutes);
  app.use('/api/market', marketRoutes);
  app.use('/api/weather', weatherRoutes);
  app.use('/api/feedback', feedbackRoutes);
  app.use('/api/ai', aiRoutes);
  app.use('/api/subscriptions', subscriptionRoutes);

  // Global Error Handler - Never exposes stack traces to frontend
  app.use((err, req, res, next) => {
    console.error(`[API Error] ${req.method} ${req.originalUrl}:`, err.message);
    const statusCode = err.statusCode || (err.name === 'ValidationError' ? 400 : 500);
    res.status(statusCode).json({
      success: false,
      error: err.message || 'An internal server error occurred. Please try again.',
    });
  });

  // Client SPA Serving only during local development
  if (process.env.NODE_ENV !== 'production' && !process.env.TEST_MODE) {
    const { createServer: createViteServer } = await import('vite');

    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });

    app.use(vite.middlewares);
  }

  return new Promise((resolve, reject) => {
    const server = app.listen(PORT, '0.0.0.0', () => {
      console.log(`FarmPro server running on http://0.0.0.0:${PORT}`);
      resolve(server);
    });
    server.on('error', reject);
  });
}

// Auto-start when executed directly: node server/server.js or tsx server/server.js
const isDirectExecution = process.argv[1]?.endsWith('server.js') || process.argv[1]?.endsWith('server.ts');
if (isDirectExecution && !process.env.TEST_MODE) {
  startServer().catch(err => {
    console.error('Fatal server boot error:', err.message);
  });
}

export default startServer;
