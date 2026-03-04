import { Request, Response, NextFunction } from 'express';
import { SubscriptionStatus } from '@costshield/shared';

import { Subscription, Plan } from '../models';
import { logger } from '../utils/logger';

export const requireActiveSubscription = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const userId = req.user?.id;
  
  if (!userId) {
    res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Authentication required' } });
    return;
  }

  try {
    // 1. Fetch active subscription for the user
    // In MVP, users have exactly 1 active subscription.
    const subscription = await Subscription.findOne({
      where: { userId, status: SubscriptionStatus.ACTIVE },
      include: [{ model: Plan, as: 'plan' }]
    });

    if (!subscription) {
      res.status(403).json({ success: false, error: { code: 'NO_ACTIVE_SUBSCRIPTION', message: 'No active subscription found.' } });
      return;
    }

    // 2. Enforce 15-day trial constraint (current date > ends_at)
    const now = new Date();
    if (now > subscription.currentPeriodEnd) {
      // Transition to EXPIRED
      subscription.status = SubscriptionStatus.EXPIRED;
      await subscription.save();

      res.status(403).json({
        success: false,
        error: { code: 'TRIAL_EXPIRED', message: 'Your 15-day trial has expired.' },
      });
      return;
    }

    // Store subscription context for subsequent handlers (e.g. limit enforcement)
    // Note: We extend Request globally in a moment to allow req.subscription
    req.subscription = subscription;
    next();
  } catch (error) {
    logger.error('requireActiveSubscription failed', {
      error: error instanceof Error ? error.message : String(error),
      userId,
    });
    res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'Internal Server Error' } });
  }
};
