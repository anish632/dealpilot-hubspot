import crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';

export function validateHubSpotSignature(
  secret: string,
  requestBody: string,
  signature: string,
  url: string,
  method: string = 'POST'
): boolean {
  const sourceString = secret + method + url + requestBody;
  const hash = crypto.createHash('sha256').update(sourceString).digest('hex');
  return hash === signature;
}

/**
 * Validates an incoming HubSpot request signature.
 * Returns a NextResponse error if validation fails, or null if the request is valid.
 */
export function validateRequest(
  body: string,
  request: NextRequest
): NextResponse | null {
  const secret = process.env.HUBSPOT_SIGNATURE_SECRET;

  if (!secret) {
    console.error('HUBSPOT_SIGNATURE_SECRET is not configured — rejecting request');
    return NextResponse.json(
      { error: 'Server misconfiguration: signature secret not set' },
      { status: 500 }
    );
  }

  const signature = request.headers.get('x-hubspot-signature-v2') || '';
  const isValid = validateHubSpotSignature(secret, body, signature, request.url, 'POST');

  if (!isValid) {
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 401 }
    );
  }

  return null;
}
