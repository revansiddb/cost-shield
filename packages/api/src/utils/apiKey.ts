import crypto from 'crypto';

interface ApiKeyResult {
  rawKey: string;
  keyHash: string;
  keyPrefix: string;
}

export const generateApiKey = (): ApiKeyResult => {
  // Generate 32 bytes of entropy and convert to hex or base64url
  const entropy = crypto.randomBytes(32).toString('hex');

  // Format: cs_live_<entropy>
  const rawKey = `cs_live_${entropy}`;

  // Prefix for DB lookups and display (max length string inside DB model for keyPrefix is 20)
  // "cs_live_" is 8 chars. We take 8 more = 16 chars total.
  const keyPrefix = rawKey.substring(0, 16);

  // Hash the full key with SHA-256 for secure storage
  const keyHash = crypto.createHash('sha256').update(rawKey).digest('hex');

  return { rawKey, keyHash, keyPrefix };
};
