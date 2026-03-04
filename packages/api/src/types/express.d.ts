// Global Express type augmentation for CostShield.
// Adds `req.user` shape set by the JWT auth middleware.

declare namespace Express {
  interface Request {
    user?: {
      id: string;
      email: string;
    };
    subscription?: any; // To hold the active subscription retrieved by middleare. Ideally typed cleanly across modules.
  }
}
