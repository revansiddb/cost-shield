import * as client from 'openid-client';

import { config } from '../../config';
import { logger } from '../../utils/logger';

// ─── OpenID Configuration ───────────────────────────────────────────────────
// Cached after first discovery (lazy initialized per cold-start)
let _googleConfig: client.Configuration | null = null;

const getGoogleConfig = async (): Promise<client.Configuration> => {
  if (!_googleConfig) {
    _googleConfig = await client.discovery(
      new URL('https://accounts.google.com'),
      config.google.clientId,
      config.google.clientSecret,
    );
  }
  return _googleConfig;
};

export interface GoogleUserInfo {
  sub: string;
  email: string;
  given_name?: string;
  family_name?: string;
}

/**
 * Build the Google OAuth authorization URL.
 * Returns the redirect URL and the pkce code_verifier stored server-side for verification.
 */
export const buildGoogleAuthUrl = async (
  state: string,
  codeVerifier: string,
): Promise<URL> => {
  const googleConfig = await getGoogleConfig();

  const codeChallenge = await client.calculatePKCECodeChallenge(codeVerifier);

  const params: Record<string, string> = {
    redirect_uri: config.google.callbackUrl,
    scope: 'openid email profile',
    state,
    code_challenge: codeChallenge,
    code_challenge_method: 'S256',
  };

  return client.buildAuthorizationUrl(googleConfig, new URLSearchParams(params));
};

/**
 * Exchange code → tokens → verify → return user profile.
 */
export const exchangeGoogleCode = async (
  callbackUrl: URL,
  expectedState: string,
  codeVerifier: string,
): Promise<GoogleUserInfo> => {
  const googleConfig = await getGoogleConfig();

  const tokens = await client.authorizationCodeGrant(googleConfig, callbackUrl, {
    pkceCodeVerifier: codeVerifier,
    expectedState,
  });

  // Extract claims from ID token (already verified by openid-client)
  const claims = tokens.claims();
  if (!claims) throw new Error('No claims in Google ID token');

  const email = claims.email as string | undefined;
  if (!email) throw new Error('Google profile missing email');

  logger.info('Google token exchange successful', { sub: claims.sub });

  return {
    sub: claims.sub,
    email,
    given_name: claims.given_name as string | undefined,
    family_name: claims.family_name as string | undefined,
  };
};
