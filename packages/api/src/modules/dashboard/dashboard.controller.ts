import { Request, Response } from 'express';

import { logger } from '../../utils/logger';
import { dashboardService } from './dashboard.service';

export const dashboardController = {
  /**
   * GET /api/v1/dashboard
   * Query params: range (7d|30d), project_id (optional)
   */
  async getDashboard(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;

      // Parse query parameters with safe defaults
      const range = (req.query.range as string) || '7d';
      const projectId = req.query.project_id as string | undefined;

      // Validate range
      if (!['7d', '30d'].includes(range)) {
        res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid range. Allowed values: 7d, 30d',
          },
        });
        return;
      }

      const data = await dashboardService.getDashboard(userId, range, projectId);

      res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      logger.error('Failed to load dashboard', {
        error: error instanceof Error ? error.message : String(error),
      });
      res.status(500).json({
        success: false,
        error: { code: 'INTERNAL_ERROR', message: 'Internal Server Error' },
      });
    }
  },
};
