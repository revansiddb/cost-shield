import axios from 'axios';

import { config } from '../../config';
import { logger } from '../../utils/logger';

export interface GitHubUserInfo {
  id: number;
  email: string;
  name: string | null;
}

/**
 * Build the GitHub OAuth authorization URL.
 */
export const buildGitHubAuthUrl = (state: string): URL => {
  const url = new URL('https://github.com/login/oauth/authorize');
  url.searchParams.set('client_id', config.github.clientId);
  url.searchParams.set('redirect_uri', config.github.callbackUrl);
  url.searchParams.set('scope', 'user:email read:user');
  url.searchParams.set('state', state);
  return url;
};

/**
 * Exchange code → access token → user profile.
 */
export const exchangeGitHubCode = async (
  code: string,
  expectedState: string,
  receivedState: string,
): Promise<GitHubUserInfo> => {
  if (receivedState !== expectedState) {
    throw new Error('OAuth state mismatch — potential CSRF');
  }

  // Step 1: Exchange code for access token
  const tokenResponse = await axios.post<{ access_token?: string; error?: string }>(
    'https://github.com/login/oauth/access_token',
    {
      client_id: config.github.clientId,
      client_secret: config.github.clientSecret,
      code,
      redirect_uri: config.github.callbackUrl,
    },
    { headers: { Accept: 'application/json' } },
  );

  const accessToken = tokenResponse.data.access_token;
  if (!accessToken) {
    throw new Error(`GitHub token exchange failed: ${tokenResponse.data.error ?? 'unknown'}`);
  }

  logger.info('GitHub token exchange successful');

  // Step 2: Fetch user profile
  const profileResponse = await axios.get<{ id: number; name: string | null; email: string | null }>(
    'https://api.github.com/user',
    { headers: { Authorization: `Bearer ${accessToken}`, Accept: 'application/vnd.github+json' } },
  );

  let email = profileResponse.data.email;

  // Step 3: Fetch emails if primary email not in profile
  if (!email) {
    const emailsResponse = await axios.get<Array<{ email: string; primary: boolean; verified: boolean }>>(
      'https://api.github.com/user/emails',
      { headers: { Authorization: `Bearer ${accessToken}`, Accept: 'application/vnd.github+json' } },
    );

    const primary = emailsResponse.data.find((e) => e.primary && e.verified);
    email = primary?.email ?? null;
  }

  if (!email) {
    throw new Error('GitHub profile has no verified email. Please make your email public or verify it.');
  }

  return {
    id: profileResponse.data.id,
    email,
    name: profileResponse.data.name,
  };
};
