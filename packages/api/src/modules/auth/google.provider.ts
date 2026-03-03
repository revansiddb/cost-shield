import { OAuth2Client } from 'google-auth-library';
import { config } from '../../config';
import { logger } from '../../utils/logger';

export interface GoogleUserInfo {
  sub: string;
  email: string;
  given_name?: string;
  family_name?: string;
}

const getClient = (): OAuth2Client => {
  return new OAuth2Client(
    config.google.clientId,
    config.google.clientSecret,
    config.google.callbackUrl
  );
};

/**
 * Build the Google OAuth authorization URL.
 */
export const buildGoogleAuthUrl = (state: string): string => {
  const client = getClient();
  return client.generateAuthUrl({
    access_type: 'online',
    scope: ['email', 'profile', 'openid'],
    state,
  });
};

/**
 * Exchange code → tokens → verify ID token → return user profile.
 */
export const exchangeGoogleCode = async (
  code: string,
): Promise<GoogleUserInfo> => {
  const client = getClient();
  
  // Exchange code for tokens
  const { tokens } = await client.getToken(code);
  
  if (!tokens.id_token) {
    throw new Error('No id_token in Google response');
  }

  // Verify ID token and extract payload securely
  const ticket = await client.verifyIdToken({
    idToken: tokens.id_token,
    audience: config.google.clientId,
  });

  const payload = ticket.getPayload();
  if (!payload || !payload.email) {
    throw new Error('Google token payload missing or has no email');
  }

  logger.info('Google token exchange successful', { sub: payload.sub });

  return {
    sub: payload.sub,
    email: payload.email,
    given_name: payload.given_name,
    family_name: payload.family_name,
  };
};
