import crypto from 'crypto';

import { Request, Response } from 'express';
import * as client from 'openid-client';
import { AuthProvider as AuthProviderEnum } from '@costshield/shared';

import { config } from '../../config';
import { logger } from '../../utils/logger';
import { signToken, COOKIE_NAME, COOKIE_MAX_AGE_MS } from '../../utils/jwt';
import { User } from '../../models';

import { buildGoogleAuthUrl, exchangeGoogleCode } from './google.provider';
import { buildGitHubAuthUrl, exchangeGitHubCode } from './github.provider';
import { findOrCreateFromOAuth } from './auth.service';

const IS_PROD = config.nodeEnv === 'production';
const FRONTEND_URL = process.env.FRONTEND_URL || config.dashboardUrl;

/**
 * Issue JWT and set httpOnly cookie.
 * Only called after a successful OAuth flow — never directly accessible.
 */
const issueAuthCookie = (res: Response, userId: string, email: string): void => {
  const token = signToken({ userId, email });

  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    secure: IS_PROD,
    sameSite: 'lax',
    maxAge: COOKIE_MAX_AGE_MS,
    path: '/',
  });
};

// ─── Google ──────────────────────────────────────────────────────────────────

export const googleRedirect = async (req: Request, res: Response): Promise<void> => {
  try {
    // PKCE: generate state + code_verifier, store in cookie for callback verification
    const state = crypto.randomBytes(16).toString('hex');
    const codeVerifier = client.randomPKCECodeVerifier();

    // Store state and verifier in short-lived httpOnly cookies
    res.cookie('oauth_state', state, { httpOnly: true, maxAge: 10 * 60 * 1000, sameSite: 'lax' });
    res.cookie('oauth_code_verifier', codeVerifier, { httpOnly: true, maxAge: 10 * 60 * 1000, sameSite: 'lax' });

    const authUrl = await buildGoogleAuthUrl(state, codeVerifier);
    res.redirect(authUrl.toString());
  } catch (err) {
    logger.error('Google redirect failed', { error: err instanceof Error ? err.message : String(err) });
    res.redirect(`${FRONTEND_URL}/auth/error?reason=google_init_failed`);
  }
};

export const googleCallback = async (req: Request, res: Response): Promise<void> => {
  try {
    const expectedState: string | undefined = req.cookies?.oauth_state;
    const codeVerifier: string | undefined = req.cookies?.oauth_code_verifier;

    if (!expectedState || !codeVerifier) {
      res.redirect(`${FRONTEND_URL}/auth/error?reason=missing_state`);
      return;
    }

    // Clear PKCE cookies immediately
    res.clearCookie('oauth_state');
    res.clearCookie('oauth_code_verifier');

    // Build the full callback URL (needed by openid-client to extract code+state params)
    const apiBase = process.env.API_BASE_URL || `http://localhost:${config.port}`;
    const callbackUrl = new URL(`${apiBase}${req.originalUrl}`);

    const profile = await exchangeGoogleCode(callbackUrl, expectedState, codeVerifier);

    const { userId, email } = await findOrCreateFromOAuth({
      providerUid: profile.sub,
      email: profile.email,
      firstName: profile.given_name ?? null,
      lastName: profile.family_name ?? null,
      provider: AuthProviderEnum.GOOGLE,
    });

    issueAuthCookie(res, userId, email);
    res.redirect(`${FRONTEND_URL}/dashboard`);
  } catch (err) {
    logger.error('Google callback failed', { error: err instanceof Error ? err.message : String(err) });
    res.redirect(`${FRONTEND_URL}/auth/error?reason=google_callback_failed`);
  }
};

// ─── GitHub ──────────────────────────────────────────────────────────────────

export const githubRedirect = (_req: Request, res: Response): void => {
  const state = crypto.randomBytes(16).toString('hex');
  res.cookie('oauth_state', state, { httpOnly: true, maxAge: 10 * 60 * 1000, sameSite: 'lax' });

  const authUrl = buildGitHubAuthUrl(state);
  res.redirect(authUrl.toString());
};

export const githubCallback = async (req: Request, res: Response): Promise<void> => {
  try {
    const expectedState: string | undefined = req.cookies?.oauth_state;
    const { code, state: receivedState } = req.query as Record<string, string>;

    if (!expectedState || !receivedState || !code) {
      res.redirect(`${FRONTEND_URL}/auth/error?reason=missing_state`);
      return;
    }

    res.clearCookie('oauth_state');

    const profile = await exchangeGitHubCode(code, expectedState, receivedState);

    const { userId, email } = await findOrCreateFromOAuth({
      providerUid: String(profile.id),
      email: profile.email,
      firstName: profile.name?.split(' ')[0] ?? null,
      lastName: profile.name?.split(' ').slice(1).join(' ') || null,
      provider: AuthProviderEnum.GITHUB,
    });

    issueAuthCookie(res, userId, email);
    res.redirect(`${FRONTEND_URL}/dashboard`);
  } catch (err) {
    logger.error('GitHub callback failed', { error: err instanceof Error ? err.message : String(err) });
    res.redirect(`${FRONTEND_URL}/auth/error?reason=github_callback_failed`);
  }
};

// ─── Logout ──────────────────────────────────────────────────────────────────

export const logout = (_req: Request, res: Response): void => {
  res.clearCookie(COOKIE_NAME, { httpOnly: true, path: '/' });
  res.status(200).json({ success: true, data: { message: 'Logged out successfully' } });
};

// ─── /me ─────────────────────────────────────────────────────────────────────

export const getMe = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findByPk(req.user!.id, {
      attributes: ['id', 'email', 'firstName', 'lastName', 'createdAt'],
    });

    if (!user) {
      res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'User not found' } });
      return;
    }

    const plain = user.get({ plain: true });

    res.status(200).json({
      success: true,
      data: {
        id: plain.id,
        email: plain.email,
        firstName: plain.firstName,
        lastName: plain.lastName,
        createdAt: plain.createdAt,
      },
    });
  } catch (err) {
    logger.error('getMe failed', { error: err instanceof Error ? err.message : String(err) });
    res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'Internal Server Error' } });
  }
};
