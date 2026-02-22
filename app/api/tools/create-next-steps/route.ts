import { NextRequest, NextResponse } from 'next/server';
import { getHubSpotClient } from '@/lib/hubspot';
import { generateCompletion } from '@/lib/openai';
import { validateRequest } from '@/lib/validate';
import { CREATE_NEXT_STEPS_PROMPT } from '@/lib/prompts';
import { AssociationSpecAssociationCategoryEnum } from '@hubspot/api-client/lib/codegen/crm/associations/v4/models/AssociationSpec';

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();

    // Validate HubSpot signature
    const validationError = validateRequest(body, request);
    if (validationError) return validationError;

    const payload = JSON.parse(body);
    const { inputFields } = payload;
    const dealId = inputFields?.deal_id;
    const urgency = inputFields?.urgency || 'medium';

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
      'hs_lastmodifieddate',
    ]);

    const dealData = {
      id: deal.id,
      name: deal.properties.dealname,
      amount: deal.properties.amount,
      stage: deal.properties.dealstage,
      closeDate: deal.properties.closedate,
      ownerId: deal.properties.hubspot_owner_id,
      lastContacted: deal.properties.notes_last_contacted,
      lastModified: deal.properties.hs_lastmodifieddate,
    };

    // Generate AI next steps
    const prompt = CREATE_NEXT_STEPS_PROMPT
      .replaceAll('{{URGENCY}}', urgency)
      .replaceAll('{{DEAL_DATA}}', JSON.stringify(dealData, null, 2));

    const aiResponse = await generateCompletion(prompt, 0.7);
    const nextSteps = JSON.parse(aiResponse);

    // Create a task in HubSpot
    const taskSubject = nextSteps.task_summary || 'Follow up on deal';
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + (urgency === 'high' ? 1 : urgency === 'low' ? 7 : 3));

    const task = await hubspotClient.crm.objects.tasks.basicApi.create({
      properties: {
        hs_task_subject: taskSubject,
        hs_task_body: nextSteps.next_steps,
        hs_task_status: 'NOT_STARTED',
        hs_task_priority: urgency === 'high' ? 'HIGH' : urgency === 'low' ? 'LOW' : 'MEDIUM',
        hs_timestamp: dueDate.getTime().toString(),
      },
      associations: [
        {
          to: { id: dealId },
          types: [
            {
              associationCategory: AssociationSpecAssociationCategoryEnum.HubspotDefined,
              associationTypeId: 216, // Task to Deal association
            },
          ],
        },
      ],
    });

    return NextResponse.json({
      outputFields: {
        task_id: task.id,
        task_summary: taskSubject,
        next_steps: nextSteps.next_steps || 'Next steps generated',
      },
    });
  } catch (error) {
    console.error('Error creating next steps:', error);
    return NextResponse.json(
      { 
        error: 'Failed to create next steps',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
