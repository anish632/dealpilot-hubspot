import crypto from 'crypto';

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
