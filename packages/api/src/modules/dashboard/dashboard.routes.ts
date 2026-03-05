import { Router } from 'express';

import { requireAuth } from '../../middlewares/auth';
import { dashboardController } from './dashboard.controller';

const router = Router();

router.get('/dashboard', requireAuth, dashboardController.getDashboard);

export { router as dashboardRoutes };
