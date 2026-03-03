import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';

import { config } from './config';
import { trackingRoutes } from './modules/tracking';
import { projectsRoutes } from './modules/projects';
import { authRoutes } from './modules/auth';
import { errorHandler } from './middlewares/errorHandler';

const app = express();

// =============================
// Middleware
// =============================
app.use(helmet());
app.use(cors({ origin: config.frontendUrl, credentials: true }));
app.use(express.json());
app.use(cookieParser());

// =============================
// Health Check
// =============================
app.get('/health', (_req, res) => {
  res.json({ success: true, timestamp: new Date().toISOString() });
});

// =============================
// Routes (to be wired per dev order)
// =============================
// 1. POST /api/v1/track       — tracking module
app.use('/api/v1', trackingRoutes);

// 2. /api/v1/auth/*            — auth module (Google + GitHub OAuth, /me)
app.use('/api/v1', authRoutes);

// 3. /api/v1/projects/*        — projects module
app.use('/api/v1/projects', projectsRoutes);

// 4. /api/billing/*            — billing module (plan display only in v1)

// =============================
// Global Error Handler
// =============================
app.use(errorHandler);

export { app };
