import { NextRequest, NextResponse } from 'next/server';
import { getHubSpotClient } from '@/lib/hubspot';
import { validateRequest } from '@/lib/validate';

export async function POST(request: NextRequest) {
  try {
    const { inputFields, origin } = await validateRequest(request);
    const dealId = inputFields?.deal_id;

    if (!dealId) {
      return NextResponse.json({ outputFields: { win_score: '0', risk_signals: 'No deal ID provided', health_summary: 'Unable to analyze — no deal specified.', recommendation: 'Please provide a deal ID.' } });
    }

    const hubspotClient = await getHubSpotClient();

    const deal = await hubspotClient.crm.deals.basicApi.getById(dealId, [
      'dealname', 'amount', 'dealstage', 'closedate', 'hubspot_owner_id',
      'notes_last_contacted', 'createdate', 'hs_lastmodifieddate',
      'pipeline', 'hs_deal_stage_probability', 'num_associated_contacts',
      'num_notes', 'hs_is_closed_won', 'hs_is_closed',
    ]);

    const p = deal.properties;
    const now = Date.now();

    // Compute metrics
    const daysSinceContact = p.notes_last_contacted
      ? Math.floor((now - new Date(p.notes_last_contacted).getTime()) / 86400000)
      : null;
    const daysToClose = p.closedate
      ? Math.floor((new Date(p.closedate).getTime() - now) / 86400000)
      : null;
    const dealAge = p.createdate
      ? Math.floor((now - new Date(p.createdate).getTime()) / 86400000)
      : 0;
    const daysSinceModified = p.hs_lastmodifieddate
      ? Math.floor((now - new Date(p.hs_lastmodifieddate).getTime()) / 86400000)
      : null;
    const stageProbability = p.hs_deal_stage_probability
      ? parseFloat(p.hs_deal_stage_probability)
      : null;

    // Risk signals
    const risks: string[] = [];
    if (daysSinceContact !== null && daysSinceContact > 14) risks.push(`No contact in ${daysSinceContact} days`);
    if (daysSinceContact === null) risks.push('No contact date recorded');
    if (daysToClose !== null && daysToClose < 0) risks.push(`Close date overdue by ${Math.abs(daysToClose)} days`);
    if (daysToClose !== null && daysToClose >= 0 && daysToClose <= 3) risks.push(`Close date is in ${daysToClose} days`);
    if (daysSinceModified !== null && daysSinceModified > 30) risks.push(`Deal unchanged for ${daysSinceModified} days — may be stuck`);
    if (!p.amount || p.amount === '0') risks.push('No deal amount set');
    if (!p.hubspot_owner_id) risks.push('No deal owner assigned');
    if (p.num_associated_contacts === '0' || !p.num_associated_contacts) risks.push('No contacts associated with deal');
    if (dealAge > 90 && p.hs_is_closed !== 'true') risks.push(`Deal is ${dealAge} days old — review if still active`);

    // Win score (heuristic)
    let score = stageProbability !== null ? stageProbability * 100 : 50;
    if (daysSinceContact !== null && daysSinceContact <= 7) score += 10;
    if (daysSinceContact !== null && daysSinceContact > 21) score -= 20;
    if (daysToClose !== null && daysToClose < 0) score -= 15;
    if (!p.amount || p.amount === '0') score -= 10;
    if (p.num_associated_contacts && parseInt(p.num_associated_contacts) >= 2) score += 5;
    score = Math.max(0, Math.min(100, Math.round(score)));

    // Summary
    const summary = [
      `Deal: ${p.dealname || 'Unnamed'} | Amount: ${p.amount ? '$' + parseFloat(p.amount).toLocaleString() : 'Not set'} | Stage: ${p.dealstage || 'Unknown'}`,
      `Created ${dealAge} days ago | Last contact: ${daysSinceContact !== null ? daysSinceContact + ' days ago' : 'Never'} | Close date: ${daysToClose !== null ? (daysToClose >= 0 ? 'in ' + daysToClose + ' days' : Math.abs(daysToClose) + ' days overdue') : 'Not set'}`,
      `Stage probability: ${stageProbability !== null ? (stageProbability * 100) + '%' : 'Unknown'} | Associated contacts: ${p.num_associated_contacts || '0'} | Notes: ${p.num_notes || '0'}`,
    ].join('\n');

    // Top recommendation
    let recommendation = 'Deal looks healthy — continue current approach.';
    if (risks.length > 0) {
      if (daysSinceContact !== null && daysSinceContact > 14) recommendation = `Reach out immediately — it has been ${daysSinceContact} days since last contact.`;
      else if (daysToClose !== null && daysToClose < 0) recommendation = 'Close date has passed. Update the timeline or assess if this deal is still viable.';
      else if (!p.amount || p.amount === '0') recommendation = 'Set a deal amount to improve forecasting and pipeline visibility.';
      else if (daysSinceModified !== null && daysSinceModified > 30) recommendation = 'This deal has been stale for over a month. Re-engage or move to closed-lost.';
      else recommendation = `Address the following: ${risks[0]}`;
    }

    return NextResponse.json({
      outputFields: {
        win_score: score.toString(),
        risk_signals: risks.length > 0 ? risks.join('; ') : 'No significant risks identified',
        health_summary: summary,
        recommendation,
      },
    });
  } catch (error) {
    console.error('Error analyzing deal:', error);
    return NextResponse.json(
      { outputFields: { win_score: '0', risk_signals: 'Error occurred', health_summary: 'Failed to analyze deal.', recommendation: 'Please try again.' } },
      { status: 200 }
    );
  }
}
