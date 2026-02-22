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

interface HubSpotPayload {
  callbackId?: string;
  origin?: Record<string, unknown>;
  context?: Record<string, unknown>;
  inputFields: Record<string, string>;
  fields?: Record<string, string>;
}

/**
 * Validates an incoming HubSpot request and returns the parsed payload.
 * Throws an error with a NextResponse if validation fails.
 */
export async function validateRequest(request: NextRequest): Promise<HubSpotPayload> {
  const body = await request.text();
  const secret = process.env.HUBSPOT_SIGNATURE_SECRET;

  if (secret) {
    const signature = request.headers.get('x-hubspot-signature-v2') || '';
    const isValid = validateHubSpotSignature(secret, body, signature, request.url, 'POST');
    if (!isValid) {
      throw new Error('Invalid HubSpot signature');
    }
  }

  const payload = JSON.parse(body);
  return {
    ...payload,
    inputFields: payload.inputFields || payload.fields || {},
  };
}
