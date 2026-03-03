import { Request, Response } from 'express';
import { TrackRequestPayload, TrackResponse, ApiResponse } from '@costshield/shared';

import { alertsService } from '../alerts/alerts.service';
import { logger } from '../../utils';

import { trackingService } from './tracking.service';

export const trackController = {
  /**
   * POST /api/v1/track
   */
  async trackCost(
    req: Request<{}, {}, TrackRequestPayload>,
    res: Response<ApiResponse<TrackResponse>>,
  ): Promise<void> {
    try {
      const payload = req.body;

      // 1. Transactional Tracking (DB state ONLY)
      const result = await trackingService.trackCost(payload);

      // 2. Transaction has COMMITTED successfully at this point.
      // 3. Process email alert IF necessary. Do not block failure.
      if (result.alertToTrigger && result.projectInfo) {
        // Await the email send so the function doesn't dangle unhandled rejections or exit lambda preemptively,
        // but alertsService wraps it strictly in a try/catch, so it will NOT throw here.
        await alertsService.sendBudgetAlertEmail(
          result.projectInfo.userId,
          result.projectInfo.name,
          result.alertToTrigger.type!,
          result.alertToTrigger.cost!,
          result.alertToTrigger.budget!,
          result.projectInfo.currencyCode,
        );
      }

      // 4. Send successful response back to SDK
      res.status(200).json({
        success: true,
        data: {
          success: true,
          budgetStatus: result.budgetStatus,
        },
      });
    } catch (error) {
      logger.error('Track error', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      // If error is from invalid API key, we could return 401, but a generic 500 is safe.
      // Usually we want to return a 401 if 'Project not found', but centralized error handler manages this semantic parsing.
      // So we bubble everything up by throwing it to `express`'s unhandled rejection catcher, or call `next(error)`
      // Since express 5 or using express-async-handler handles it, we can just throw. But since we don't have next mapped:
      
      const isAuthError = error instanceof Error && error.message.includes('Project not found');
      res.status(isAuthError ? 401 : 500).json({
        success: false,
        error: {
          code: isAuthError ? 'UNAUTHORIZED' : 'INTERNAL_ERROR',
          message: isAuthError ? 'Unauthorized' : 'Internal Server Error'
        }
      });
    }
  },
};
