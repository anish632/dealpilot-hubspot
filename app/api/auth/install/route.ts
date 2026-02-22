import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const clientId = process.env.HUBSPOT_CLIENT_ID?.trim();
  const appUrl = (process.env.APP_URL || request.nextUrl.origin).trim();
  const redirectUri = `${appUrl}/api/auth/callback`;
  
  if (!clientId) {
    return NextResponse.json(
      { error: 'HubSpot client ID not configured' },
      { status: 500 }
    );
  }

  const scopes = [
    'oauth',
    'crm.objects.deals.read',
    'crm.objects.deals.write',
    'crm.objects.contacts.read',
    'crm.objects.owners.read',
  ];

  const authUrl = new URL('https://app.hubspot.com/oauth/authorize');
  authUrl.searchParams.set('client_id', clientId);
  authUrl.searchParams.set('redirect_uri', redirectUri);
  authUrl.searchParams.set('scope', scopes.join(' '));

  return NextResponse.redirect(authUrl.toString());
}
