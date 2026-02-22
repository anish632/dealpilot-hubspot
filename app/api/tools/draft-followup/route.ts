import { NextRequest, NextResponse } from 'next/server';
import { getHubSpotClient } from '@/lib/hubspot';
import { validateRequest } from '@/lib/validate';

export async function POST(request: NextRequest) {
  try {
    const { inputFields } = await validateRequest(request);
    const dealId = inputFields?.deal_id;
    const tone = inputFields?.tone || 'professional';
    const contextNotes = inputFields?.context_notes || '';

    if (!dealId) {
      return NextResponse.json({ outputFields: { email_subject: '', email_body: 'No deal ID provided.', suggested_send_time: '' } });
    }

    const hubspotClient = await getHubSpotClient();

    const deal = await hubspotClient.crm.deals.basicApi.getById(dealId, [
      'dealname', 'amount', 'dealstage', 'closedate',
      'notes_last_contacted', 'hs_lastmodifieddate',
    ]);

    // Fetch primary contact
    let contactInfo = '';
    try {
      const associations = await hubspotClient.crm.associations.v4.basicApi.getPage(
        'deals', dealId, 'contacts', undefined, 1
      );
      if (associations.results && associations.results.length > 0) {
        const contactId = associations.results[0].toObjectId;
        const contact = await hubspotClient.crm.contacts.basicApi.getById(contactId, [
          'firstname', 'lastname', 'email', 'jobtitle', 'company',
        ]);
        const cp = contact.properties;
        contactInfo = [
          `Contact: ${cp.firstname || ''} ${cp.lastname || ''}`.trim(),
          cp.jobtitle ? `Title: ${cp.jobtitle}` : '',
          cp.company ? `Company: ${cp.company}` : '',
          cp.email ? `Email: ${cp.email}` : '',
        ].filter(Boolean).join(' | ');
      }
    } catch { /* no associated contacts */ }

    const p = deal.properties;
    const now = Date.now();
    const daysSinceContact = p.notes_last_contacted
      ? Math.floor((now - new Date(p.notes_last_contacted).getTime()) / 86400000)
      : null;
    const daysToClose = p.closedate
      ? Math.floor((new Date(p.closedate).getTime() - now) / 86400000)
      : null;

    // Build context for the Breeze agent to compose the email
    const context = [
      `Deal: ${p.dealname || 'Unnamed'}`,
      `Amount: ${p.amount ? '$' + parseFloat(p.amount).toLocaleString() : 'Not set'}`,
      `Stage: ${p.dealstage || 'Unknown'}`,
      `Last contacted: ${daysSinceContact !== null ? daysSinceContact + ' days ago' : 'No record'}`,
      `Close date: ${daysToClose !== null ? (daysToClose >= 0 ? 'in ' + daysToClose + ' days' : Math.abs(daysToClose) + ' days overdue') : 'Not set'}`,
      contactInfo || 'No contact associated',
      contextNotes ? `Additional context: ${contextNotes}` : '',
    ].filter(Boolean).join('\n');

    // Suggest send time based on data
    let sendTime = 'Tuesday or Wednesday morning, 9-10 AM recipient local time';
    if (daysToClose !== null && daysToClose <= 3 && daysToClose >= 0) sendTime = 'As soon as possible — close date is imminent';
    if (daysSinceContact !== null && daysSinceContact > 14) sendTime = 'Today — contact has been cold for over 2 weeks';

    return NextResponse.json({
      outputFields: {
        email_subject: `Follow-up context for: ${p.dealname || 'deal ' + dealId}`,
        email_body: `Tone requested: ${tone}\n\n${context}\n\nPlease use the above deal and contact context to compose a ${tone} follow-up email. The Breeze agent should draft the actual email copy based on this data.`,
        suggested_send_time: sendTime,
      },
    });
  } catch (error) {
    console.error('Error drafting follow-up:', error);
    return NextResponse.json(
      { outputFields: { email_subject: '', email_body: 'Failed to fetch deal data for follow-up.', suggested_send_time: '' } },
      { status: 200 }
    );
  }
}
