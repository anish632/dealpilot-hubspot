import { NextRequest, NextResponse } from 'next/server';
import { getHubSpotClient } from '@/lib/hubspot';
import { generateCompletion } from '@/lib/openai';
import { validateHubSpotSignature } from '@/lib/validate';
import { DRAFT_FOLLOWUP_PROMPT } from '@/lib/prompts';

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
    const tone = inputFields?.tone || 'professional';
    const contextNotes = inputFields?.context_notes || '';

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
      'notes_last_contacted',
      'hs_lastmodifieddate',
    ]);

    // Fetch associated contacts
    const associations = await hubspotClient.crm.deals.associationsApi.getAll(
      dealId,
      'contacts'
    );

    let contactData = {};
    if (associations.results && associations.results.length > 0) {
      const contactId = associations.results[0].id;
      const contact = await hubspotClient.crm.contacts.basicApi.getById(contactId, [
        'firstname',
        'lastname',
        'email',
        'jobtitle',
        'company',
      ]);

      contactData = {
        name: `${contact.properties.firstname || ''} ${contact.properties.lastname || ''}`.trim(),
        email: contact.properties.email,
        title: contact.properties.jobtitle,
        company: contact.properties.company,
      };
    }

    const dealData = {
      id: deal.id,
      name: deal.properties.dealname,
      amount: deal.properties.amount,
      stage: deal.properties.dealstage,
      closeDate: deal.properties.closedate,
      lastContacted: deal.properties.notes_last_contacted,
      lastModified: deal.properties.hs_lastmodifieddate,
    };

    // Generate AI follow-up email
    const prompt = DRAFT_FOLLOWUP_PROMPT
      .replace('{{TONE}}', tone)
      .replace('{{CONTEXT}}', contextNotes)
      .replace('{{DEAL_DATA}}', JSON.stringify(dealData, null, 2))
      .replace('{{CONTACT_DATA}}', JSON.stringify(contactData, null, 2));

    const aiResponse = await generateCompletion(prompt, 0.8);
    const draft = JSON.parse(aiResponse);

    return NextResponse.json({
      outputFields: {
        email_subject: draft.email_subject || 'Follow-up on our conversation',
        email_body: draft.email_body || 'Draft email body',
        suggested_send_time: draft.suggested_send_time || 'Within 24 hours',
      },
    });
  } catch (error) {
    console.error('Error drafting follow-up:', error);
    return NextResponse.json(
      { 
        error: 'Failed to draft follow-up email',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
