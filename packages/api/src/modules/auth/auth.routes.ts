import { Router } from 'express';

import { requireAuth } from '../../middlewares/auth';

import {
  googleRedirect,
  googleCallback,
  githubRedirect,
  githubCallback,
  logout,
  getMe,
} from './auth.controller';

const router = Router();

// ─── Google ──────────────────────────────────────────────────
router.get('/auth/google', googleRedirect);
router.get('/auth/google/callback', googleCallback);

// ─── GitHub ──────────────────────────────────────────────────
router.get('/auth/github', githubRedirect);
router.get('/auth/github/callback', githubCallback);

// ─── Session ─────────────────────────────────────────────────
router.get('/auth/logout', logout);

// ─── Profile ─────────────────────────────────────────────────
router.get('/me', requireAuth, getMe);

export { router as authRoutes };
