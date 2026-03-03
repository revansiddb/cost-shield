import { Request, Response, NextFunction } from 'express';

import { verifyToken, COOKIE_NAME } from '../utils/jwt';
import { logger } from '../utils/logger';

export const requireAuth = (req: Request, res: Response, next: NextFunction): void => {
  const token: string | undefined = req.cookies?.[COOKIE_NAME];

  if (!token) {
    res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Authentication required' } });
    return;
  }

  try {
    const payload = verifyToken(token);
    req.user = { id: payload.userId, email: payload.email };
    next();
  } catch (err) {
    logger.warn('Invalid JWT token', { error: err instanceof Error ? err.message : 'Unknown' });
    res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Invalid or expired session' } });
  }
};
