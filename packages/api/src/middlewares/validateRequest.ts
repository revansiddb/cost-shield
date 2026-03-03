import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { ApiErrorResponse } from '@costshield/shared';

import { logger } from '../utils/logger';

export const validateRequest = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const errorDetails = errors.array().map((err) => ({
      field: err.type === 'field' ? err.path : 'unknown',
      message: err.msg,
    }));

    // Standard Validation Error Format
    const response: ApiErrorResponse = {
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid request payload',
        details: errorDetails,
      },
    };

    logger.warn('Validation Error', { path: req.path, details: errorDetails });
    res.status(400).json(response);
    return;
  }
  
  next();
};
