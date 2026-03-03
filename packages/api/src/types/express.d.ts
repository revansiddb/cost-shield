// Global Express type augmentation for CostShield.
// Adds `req.user` shape set by the JWT auth middleware.

declare namespace Express {
  interface Request {
    user?: {
      id: string;
      email: string;
    };
  }
}
