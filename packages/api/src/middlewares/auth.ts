import { Request, Response, NextFunction } from 'express';

// Extend Express Request to include our assumed user structure
declare module 'express-serve-static-core' {
  interface Request {
    user?: {
      id: string;
      email?: string;
    };
  }
}

/**
 * Mock authentication middleware to satisfy route constraints before full auth module is built.
 * Assuming the Auth flow will eventually attach `req.user`.
 */
export const requireAuth = (req: Request, res: Response, next: NextFunction): void => {
  // Normally we would verify a JWT or session here
  // For now, if no user is mocked, we could block it, but we assume it's injected before this.

  if (!req.user || !req.user.id) {
    // Return unauthorized if missing
    res.status(401).json({ success: false, error: 'Unauthorized' });
    return;
  }

  next();
};
