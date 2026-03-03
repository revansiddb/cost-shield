import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { TRACK_RATE_LIMIT_PER_MINUTE } from '@costshield/shared';

import { validateRequest } from '../../middlewares/validateRequest';

import { trackValidator } from './tracking.validator';
import { trackController } from './tracking.controller';

const router = Router();

// Apply a strict rate limit for the tracking endpoint from the standard shared configuration.
const trackLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: TRACK_RATE_LIMIT_PER_MINUTE, // typically 1000
  message: { success: false, error: 'Too many tracking requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Since tracking SDK passes data here via POST, we align with the specified path POST /api/v1/track
router.post(
  '/track', 
  trackLimiter, 
  trackValidator, 
  validateRequest, 
  trackController.trackCost.bind(trackController)
);

export { router as trackingRoutes };
