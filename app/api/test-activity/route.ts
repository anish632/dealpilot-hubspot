import { NextRequest, NextResponse } from 'next/server';
import { getHubSpotClient } from '@/lib/hubspot';

/**
 * Test endpoint to trigger HubSpot API activity for a specific account.
 * GET /api/test-activity?account=245292473
 * Requires REFRESH_TOKEN_{accountId} env var to be set.
 */
export async function GET(request: NextRequest) {
  const accountId = request.nextUrl.searchParams.get('account');
  const secret = request.nextUrl.searchParams.get('secret');

  if (secret !== process.env.HUBSPOT_SIGNATURE_SECRET?.trim()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!accountId) {
    return NextResponse.json({ error: 'account parameter required' }, { status: 400 });
  }

  try {
    const client = await getHubSpotClient(accountId);

    // Make a simple API call to list deals — this registers as app activity
    const deals = await client.crm.deals.basicApi.getPage(10, undefined, ['dealname', 'amount']);

    return NextResponse.json({
      success: true,
      accountId,
      dealsFound: deals.results.length,
      deals: deals.results.map(d => ({
        id: d.id,
        name: d.properties.dealname,
        amount: d.properties.amount,
      })),
    });
  } catch (error) {
    return NextResponse.json({
      error: 'Failed to call HubSpot API',
      details: error instanceof Error ? error.message : 'Unknown error',
      accountId,
    }, { status: 500 });
  }
}
