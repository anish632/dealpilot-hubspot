import { Client } from '@hubspot/api-client';

// WARNING: In-memory token storage — tokens are lost on serverless cold starts.
// Replace with a persistent store (e.g. database, KV, or encrypted cookies) before production use.
const tokenStore = new Map<string, { accessToken: string; refreshToken: string; expiresAt: number }>();

export function storeTokens(
  accountId: string,
  accessToken: string,
  refreshToken: string,
  expiresIn: number
) {
  tokenStore.set(accountId, {
    accessToken,
    refreshToken,
    expiresAt: Date.now() + expiresIn * 1000,
  });
}

export function getTokens(accountId: string) {
  return tokenStore.get(accountId);
}

export async function getHubSpotClient(accessToken?: string): Promise<Client> {
  const client = new Client();
  
  if (accessToken) {
    client.setAccessToken(accessToken);
  } else if (process.env.HUBSPOT_DEVELOPER_API_KEY) {
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
      client_id: process.env.HUBSPOT_CLIENT_ID!,
      client_secret: process.env.HUBSPOT_CLIENT_SECRET!,
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
