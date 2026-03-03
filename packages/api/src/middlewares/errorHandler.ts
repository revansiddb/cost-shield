import { Request, Response, NextFunction } from 'express';
import { ApiErrorResponse } from '@costshield/shared';

import { logger } from '../utils/logger';

export const errorHandler = (err: Error, req: Request, res: Response, _next: NextFunction): void => {
  logger.error('Unhandled Exception', {
    error: err.message,
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
    path: req.path,
    method: req.method,
  });

  // Handle explicitly thrown semantic errors if needed, otherwise default to 500
  let code = 'INTERNAL_ERROR';
  let message = 'Internal Server Error';
  let status = 500;

  if (err.message.includes('Project not found') || err.message.includes('invalid API key')) {
    status = 401;
    code = 'UNAUTHORIZED';
    message = 'Invalid or expired API Key';
  }

  const response: ApiErrorResponse = {
    success: false,
    error: {
      code,
      message,
    },
  };

  res.status(status).json(response);
};
