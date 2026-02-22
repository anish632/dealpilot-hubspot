import { NextRequest, NextResponse } from 'next/server';
import { storeTokens } from '@/lib/hubspot';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');

  if (!code) {
    return NextResponse.json(
      { error: 'Authorization code not provided' },
      { status: 400 }
    );
  }

  const clientId = process.env.HUBSPOT_CLIENT_ID?.trim();
  const clientSecret = process.env.HUBSPOT_CLIENT_SECRET?.trim();
  const redirectUri = 'https://dealpilot-hubspot.vercel.app/api/auth/callback';

  if (!clientId || !clientSecret) {
    return NextResponse.json(
      { error: 'HubSpot credentials not configured' },
      { status: 500 }
    );
  }

  try {
    // Exchange code for tokens
    const response = await fetch('https://api.hubapi.com/oauth/v1/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        code,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('HubSpot token exchange failed:', {
        status: response.status,
        error: errorData,
        clientIdLength: clientId.length,
        clientIdPrefix: clientId.substring(0, 8),
        redirectUri,
      });
      throw new Error(errorData.message || 'Failed to exchange authorization code');
    }

    const data = await response.json();

    // Get account info
    const accountResponse = await fetch('https://api.hubapi.com/oauth/v1/access-tokens/' + data.access_token);
    const accountData = await accountResponse.json();
    const accountId = accountData.hub_id?.toString() || 'default';

    // Store tokens
    storeTokens(
      accountId,
      data.access_token,
      data.refresh_token,
      data.expires_in
    );

    // Redirect to success page
    return NextResponse.redirect(new URL('/?installed=true', request.nextUrl.origin));
  } catch (error) {
    console.error('OAuth callback error:', error);
    return NextResponse.json(
      { 
        error: 'Authentication failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
