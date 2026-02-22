import { NextRequest, NextResponse } from 'next/server';
import { getHubSpotClient } from '@/lib/hubspot';
import { generateCompletion } from '@/lib/openai';
import { validateHubSpotSignature } from '@/lib/validate';
import { ANALYZE_DEAL_PROMPT } from '@/lib/prompts';

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('x-hubspot-signature-v2') || '';
    const url = request.url;

    // Validate HubSpot signature
    if (process.env.HUBSPOT_SIGNATURE_SECRET) {
      const isValid = validateHubSpotSignature(
        process.env.HUBSPOT_SIGNATURE_SECRET,
        body,
        signature,
        url,
        'POST'
      );

      if (!isValid) {
        return NextResponse.json(
          { error: 'Invalid signature' },
          { status: 401 }
        );
      }
    }

    const payload = JSON.parse(body);
    const { inputFields } = payload;
    const dealId = inputFields?.deal_id;

    if (!dealId) {
      return NextResponse.json(
        { error: 'deal_id is required' },
        { status: 400 }
      );
    }

    // Fetch deal data from HubSpot
    const hubspotClient = await getHubSpotClient();
    
    const deal = await hubspotClient.crm.deals.basicApi.getById(dealId, [
      'dealname',
      'amount',
      'dealstage',
      'closedate',
      'hubspot_owner_id',
      'notes_last_contacted',
      'createdate',
      'hs_lastmodifieddate',
      'pipeline',
      'hs_deal_stage_probability',
    ]);

    const dealData = {
      id: deal.id,
      name: deal.properties.dealname,
      amount: deal.properties.amount,
      stage: deal.properties.dealstage,
      closeDate: deal.properties.closedate,
      ownerId: deal.properties.hubspot_owner_id,
      lastContacted: deal.properties.notes_last_contacted,
      createdDate: deal.properties.createdate,
      lastModified: deal.properties.hs_lastmodifieddate,
      pipeline: deal.properties.pipeline,
      stageProbability: deal.properties.hs_deal_stage_probability,
    };

    // Generate AI analysis
    const prompt = ANALYZE_DEAL_PROMPT.replace(
      '{{DEAL_DATA}}',
      JSON.stringify(dealData, null, 2)
    );

    const aiResponse = await generateCompletion(prompt, 0.7);
    const analysis = JSON.parse(aiResponse);

    return NextResponse.json({
      outputFields: {
        win_score: analysis.win_score?.toString() || '0',
        risk_signals: analysis.risk_signals || 'No significant risks identified',
        health_summary: analysis.health_summary || 'Deal analysis complete',
        recommendation: analysis.recommendation || 'Continue monitoring deal progress',
      },
    });
  } catch (error) {
    console.error('Error analyzing deal:', error);
    return NextResponse.json(
      { 
        error: 'Failed to analyze deal',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
