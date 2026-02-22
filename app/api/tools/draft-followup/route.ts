import { NextRequest, NextResponse } from 'next/server';
import { getHubSpotClient } from '@/lib/hubspot';
import { validateRequest } from '@/lib/validate';
import { chatCompletion } from '@/lib/ai';
import { DRAFT_FOLLOWUP_PROMPT } from '@/lib/prompts';

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
    let contactData = 'No contact associated';
    let contactFirstName = '';
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
        contactFirstName = cp.firstname || '';
        contactData = [
          `Name: ${cp.firstname || ''} ${cp.lastname || ''}`.trim(),
          cp.jobtitle ? `Title: ${cp.jobtitle}` : '',
          cp.company ? `Company: ${cp.company}` : '',
          cp.email ? `Email: ${cp.email}` : '',
        ].filter(Boolean).join('\n');
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

    const dealData = [
      `Deal: ${p.dealname || 'Unnamed'}`,
      `Amount: ${p.amount ? '$' + parseFloat(p.amount).toLocaleString() : 'Not set'}`,
      `Stage: ${p.dealstage || 'Unknown'}`,
      `Last contacted: ${daysSinceContact !== null ? daysSinceContact + ' days ago' : 'No record'}`,
      `Close date: ${daysToClose !== null ? (daysToClose >= 0 ? 'in ' + daysToClose + ' days' : Math.abs(daysToClose) + ' days overdue') : 'Not set'}`,
      contextNotes ? `Additional context: ${contextNotes}` : '',
    ].filter(Boolean).join('\n');

    // Build prompt
    const prompt = DRAFT_FOLLOWUP_PROMPT
      .replaceAll('{{TONE}}', tone)
      .replaceAll('{{CONTEXT}}', contextNotes || 'None')
      .replaceAll('{{DEAL_DATA}}', dealData)
      .replaceAll('{{CONTACT_DATA}}', contactData);

    // Suggest send time
    let sendTime = 'Tuesday or Wednesday morning, 9-10 AM recipient local time';
    if (daysToClose !== null && daysToClose <= 3 && daysToClose >= 0) sendTime = 'As soon as possible — close date is imminent';
    if (daysSinceContact !== null && daysSinceContact > 14) sendTime = 'Today — contact has been cold for over 2 weeks';

    let emailSubject = `Following up on ${p.dealname || 'our conversation'}`;
    let emailBody = '';

    try {
      const aiResponse = await chatCompletion(
        'You are an expert sales copywriter. Respond ONLY with valid JSON, no markdown.',
        prompt
      );

      // Parse JSON from response
      const cleaned = aiResponse.replace(/```json?\n?/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleaned);
      emailSubject = parsed.email_subject || emailSubject;
      emailBody = parsed.email_body || '';
      if (parsed.suggested_send_time) sendTime = parsed.suggested_send_time;
    } catch (aiError) {
      console.error('AI generation failed, using fallback:', aiError);
      // Fallback: generate a simple template
      const greeting = contactFirstName ? `Hi ${contactFirstName}` : 'Hi there';
      emailBody = `${greeting},\n\nI wanted to follow up on ${p.dealname || 'our recent conversation'}. ${daysSinceContact !== null && daysSinceContact > 7 ? `It's been about ${daysSinceContact} days since we last connected, and I` : 'I'} wanted to check in and see where things stand on your end.\n\n${p.amount ? `We discussed a deal valued at $${parseFloat(p.amount).toLocaleString()}, and I` : 'I'} want to make sure we're aligned on next steps and timeline${daysToClose !== null && daysToClose > 0 ? ` as we approach the ${new Date(p.closedate!).toLocaleDateString()} target` : ''}.\n\nWould you have time for a quick call this week to discuss?\n\nBest regards`;
    }

    return NextResponse.json({
      outputFields: {
        email_subject: emailSubject,
        email_body: emailBody,
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
