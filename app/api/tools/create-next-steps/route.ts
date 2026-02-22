import { NextRequest, NextResponse } from 'next/server';
import { getHubSpotClient } from '@/lib/hubspot';
import { validateRequest } from '@/lib/validate';

export async function POST(request: NextRequest) {
  try {
    const { inputFields } = await validateRequest(request);
    const dealId = inputFields?.deal_id;
    const urgency = inputFields?.urgency || 'medium';

    if (!dealId) {
      return NextResponse.json({ outputFields: { task_id: '', task_summary: 'No deal ID provided.', next_steps: '' } });
    }

    const hubspotClient = await getHubSpotClient();

    const deal = await hubspotClient.crm.deals.basicApi.getById(dealId, [
      'dealname', 'amount', 'dealstage', 'closedate', 'hubspot_owner_id',
      'notes_last_contacted', 'hs_lastmodifieddate', 'num_associated_contacts',
    ]);

    const p = deal.properties;
    const now = Date.now();
    const daysSinceContact = p.notes_last_contacted
      ? Math.floor((now - new Date(p.notes_last_contacted).getTime()) / 86400000)
      : null;
    const daysToClose = p.closedate
      ? Math.floor((new Date(p.closedate).getTime() - now) / 86400000)
      : null;
    const daysSinceModified = p.hs_lastmodifieddate
      ? Math.floor((now - new Date(p.hs_lastmodifieddate).getTime()) / 86400000)
      : null;

    // Generate data-driven next steps
    const steps: string[] = [];

    // Step 1: Contact recency
    if (daysSinceContact === null || daysSinceContact > 7) {
      steps.push(`1. REACH OUT (within ${urgency === 'high' ? '1 day' : urgency === 'low' ? '5 days' : '3 days'}): ${daysSinceContact !== null ? `Last contact was ${daysSinceContact} days ago` : 'No contact date on record'}. Schedule a call or send a personalized follow-up.`);
    } else {
      steps.push(`1. MAINTAIN MOMENTUM (within ${urgency === 'high' ? '2 days' : '5 days'}): Last contact was ${daysSinceContact} days ago — keep the conversation active with a value-add touchpoint.`);
    }

    // Step 2: Deal completeness
    if (!p.amount || p.amount === '0') {
      steps.push(`2. SET DEAL AMOUNT (within ${urgency === 'high' ? '1 day' : '3 days'}): No amount is set. Confirm pricing and update the deal value for accurate forecasting.`);
    } else if (daysToClose !== null && daysToClose < 0) {
      steps.push(`2. UPDATE CLOSE DATE (today): Close date is ${Math.abs(daysToClose)} days overdue. Either push the date or assess if this deal should be closed-lost.`);
    } else if (p.num_associated_contacts === '0' || !p.num_associated_contacts) {
      steps.push(`2. ADD CONTACTS (within ${urgency === 'high' ? '1 day' : '3 days'}): No contacts are associated. Add the decision maker(s) and key stakeholders.`);
    } else {
      steps.push(`2. ADVANCE STAGE (within ${urgency === 'high' ? '2 days' : '5 days'}): Review what's needed to move from "${p.dealstage}" to the next stage. Identify and address any blockers.`);
    }

    // Step 3: Strategic
    if (daysSinceModified !== null && daysSinceModified > 21) {
      steps.push(`3. REVIEW DEAL VIABILITY (within ${urgency === 'high' ? '2 days' : '1 week'}): This deal hasn't been updated in ${daysSinceModified} days. Decide: re-engage with a new angle, or move to closed-lost.`);
    } else if (daysToClose !== null && daysToClose >= 0 && daysToClose <= 7) {
      steps.push(`3. PREPARE FOR CLOSE (within ${daysToClose} days): Close date is approaching. Ensure all stakeholders are aligned, contracts are ready, and final objections are addressed.`);
    } else {
      steps.push(`3. MAP DECISION PROCESS (within 1 week): Confirm the buying process, timeline, and decision criteria. Identify any competing priorities or vendors.`);
    }

    const taskSummary = steps[0].split(':').slice(1).join(':').trim().split('.')[0] + '.';
    const nextStepsText = steps.join('\n\n');

    // Create task in HubSpot
    const dueDays = urgency === 'high' ? 1 : urgency === 'low' ? 7 : 3;
    const dueDate = new Date(now + dueDays * 86400000);

    let taskId = '';
    try {
      const task = await hubspotClient.crm.objects.tasks.basicApi.create({
        properties: {
          hs_task_subject: `[DealPilot] ${p.dealname || 'Deal'}: ${taskSummary}`,
          hs_task_body: nextStepsText,
          hs_task_status: 'NOT_STARTED',
          hs_task_priority: urgency === 'high' ? 'HIGH' : urgency === 'low' ? 'LOW' : 'MEDIUM',
          hs_timestamp: dueDate.getTime().toString(),
          ...(p.hubspot_owner_id ? { hubspot_owner_id: p.hubspot_owner_id } : {}),
        },
        associations: [
          {
            to: { id: dealId },
            types: [
              {
                associationCategory: 'HUBSPOT_DEFINED' as any,
                associationTypeId: 216,
              },
            ],
          },
        ],
      });
      taskId = task.id;
    } catch (e) {
      console.error('Failed to create task:', e);
    }

    const response: Record<string, string> = {
      task_summary: `[${urgency.toUpperCase()} priority] ${taskSummary}`,
      next_steps: nextStepsText,
    };

    if (taskId) {
      response.task_id = taskId;
      response.ctaCrmObjectType = 'deal';
      response.ctaCrmObjectId = dealId;
    }

    return NextResponse.json({ outputFields: response });
  } catch (error) {
    console.error('Error creating next steps:', error);
    return NextResponse.json(
      { outputFields: { task_id: '', task_summary: 'Failed to create next steps.', next_steps: '' } },
      { status: 200 }
    );
  }
}
