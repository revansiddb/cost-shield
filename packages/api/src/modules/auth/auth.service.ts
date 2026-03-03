import { AuthProvider as AuthProviderEnum } from '@costshield/shared';

import { sequelize } from '../../database';
import { User, AuthProvider } from '../../models';
import { logger } from '../../utils/logger';

export interface OAuthProfile {
  providerUid: string;    // Unique ID from the OAuth provider (sub for Google, id for GitHub)
  email: string;
  firstName: string | null;
  lastName: string | null;
  provider: AuthProviderEnum;
}

export interface AuthServiceResult {
  userId: string;
  email: string;
}

/**
 * Shared "find-or-create" logic for all OAuth providers.
 *
 * Strategy (inside a transaction):
 * 1. Find existing AuthProvider row.
 * 2. If found → return associated user.
 * 3. Else → find user by email.
 *    a. If found → link new AuthProvider.
 *    b. If not  → create user + link AuthProvider.
 *
 * This means a user can link multiple OAuth providers to the same account
 * as long as they share the same email.
 */
export const findOrCreateFromOAuth = async (profile: OAuthProfile): Promise<AuthServiceResult> => {
  return sequelize.transaction(async (t) => {
    // 1. Check for existing linked provider
    const existingProvider = await AuthProvider.findOne({
      where: { provider: profile.provider, providerUid: profile.providerUid },
      include: [{ model: User, as: undefined }],
      transaction: t,
    });

    if (existingProvider) {
      const user = await User.findByPk(existingProvider.userId, { transaction: t });
      if (!user) throw new Error('Linked user not found');
      logger.info('OAuth login: existing provider', { provider: profile.provider, userId: user.id });
      return { userId: user.id, email: user.email };
    }

    // 2. No linked provider — look up by email
    let user = await User.findOne({ where: { email: profile.email }, transaction: t });

    if (!user) {
      // 2a. Create a brand new user
      user = await User.create({
        email: profile.email,
        firstName: profile.firstName,
        lastName: profile.lastName,
        isEmailVerified: true,
        isActive: true,
      }, { transaction: t });

      logger.info('OAuth login: new user created', { provider: profile.provider, userId: user.id });
    } else {
      logger.info('OAuth login: existing user, linking provider', { provider: profile.provider, userId: user.id });
    }

    // 2b. Link the OAuth provider
    await AuthProvider.create({
      userId: user.id,
      provider: profile.provider,
      providerUid: profile.providerUid,
    }, { transaction: t });

    return { userId: user.id, email: user.email };
  });
};
