import { Client } from '@hubspot/api-client';

// In-memory cache for access tokens (refresh tokens stored in env vars)
const accessTokenCache = new Map<string, { accessToken: string; expiresAt: number }>();

export function storeTokens(
  accountId: string,
  accessToken: string,
  refreshToken: string,
  expiresIn: number
) {
  accessTokenCache.set(accountId, {
    accessToken,
    expiresAt: Date.now() + expiresIn * 1000,
  });
  // Log refresh token so it can be stored as env var for persistence
  console.log(`[DealPilot] Account ${accountId} installed. Refresh token: ${refreshToken}`);
}

export function getTokens(accountId: string) {
  return accessTokenCache.get(accountId);
}

/**
 * Get a fresh access token for a specific account using its refresh token.
 * Checks env vars REFRESH_TOKEN_{accountId} for persistent refresh tokens,
 * falls back to in-memory cache.
 */
async function getAccessTokenForAccount(accountId: string): Promise<string | null> {
  // Check if we have a valid cached access token
  const cached = accessTokenCache.get(accountId);
  if (cached && cached.expiresAt > Date.now() + 60000) {
    return cached.accessToken;
  }

  // Look for refresh token in env vars
  const refreshToken = process.env[`REFRESH_TOKEN_${accountId}`]?.trim();
  if (refreshToken) {
    try {
      const result = await refreshAccessToken(refreshToken);
      accessTokenCache.set(accountId, {
        accessToken: result.accessToken,
        expiresAt: Date.now() + result.expiresIn * 1000,
      });
      return result.accessToken;
    } catch (e) {
      console.error(`Failed to refresh token for account ${accountId}:`, e);
    }
  }

  // Fall back to in-memory cached token (from recent OAuth install)
  if (cached) {
    return cached.accessToken;
  }

  return null;
}

/**
 * Get a HubSpot client for a specific account.
 * Resolves the access token from env-based refresh tokens or in-memory cache.
 */
export async function getHubSpotClient(accountIdOrToken?: string): Promise<Client> {
  const client = new Client();

  // If it looks like an account ID (numeric), resolve the token
  if (accountIdOrToken && /^\d+$/.test(accountIdOrToken)) {
    const token = await getAccessTokenForAccount(accountIdOrToken);
    if (token) {
      client.setAccessToken(token);
      return client;
    }
  }

  // If a direct access token was passed
  if (accountIdOrToken) {
    client.setAccessToken(accountIdOrToken);
    return client;
  }

  // Fallback to developer API key
  if (process.env.HUBSPOT_DEVELOPER_API_KEY) {
    client.setAccessToken(process.env.HUBSPOT_DEVELOPER_API_KEY);
  }

  return client;
}

export async function refreshAccessToken(refreshToken: string): Promise<{ accessToken: string; expiresIn: number }> {
  const response = await fetch('https://api.hubapi.com/oauth/v1/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      client_id: process.env.HUBSPOT_CLIENT_ID!.trim(),
      client_secret: process.env.HUBSPOT_CLIENT_SECRET!.trim(),
      refresh_token: refreshToken,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to refresh access token');
  }

  const data = await response.json();
  return {
    accessToken: data.access_token,
    expiresIn: data.expires_in,
  };
}
