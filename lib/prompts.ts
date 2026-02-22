export const ANALYZE_DEAL_PROMPT = `You are a senior sales strategist analyzing a HubSpot deal. Given the deal data below, provide:

1. **Win Score** (0-100): Based on deal stage progression, amount, close date proximity, last contact recency, and completeness of information.
2. **Risk Signals**: List specific risks (e.g., "No contact in 14+ days", "Close date overdue by 3 weeks", "No decision maker identified", "Deal stuck in same stage for 30+ days").
3. **Health Summary**: 2-3 sentence overall assessment.
4. **Recommendation**: Single most impactful action the rep should take right now.

Respond in JSON format: { "win_score": number, "risk_signals": string, "health_summary": string, "recommendation": string }

Deal Data:
{{DEAL_DATA}}`;

export const DRAFT_FOLLOWUP_PROMPT = `You are an expert sales copywriter. Draft a follow-up email for the deal below.

Tone: {{TONE}}
Additional context: {{CONTEXT}}

Guidelines:
- Keep subject line under 50 characters
- Email body should be 3-5 paragraphs max
- Reference specific deal details naturally
- Include a clear call-to-action
- Be {{TONE}} but always professional

Respond in JSON format: { "email_subject": string, "email_body": string, "suggested_send_time": string }

Deal Data:
{{DEAL_DATA}}

Contact Data:
{{CONTACT_DATA}}`;

export const CREATE_NEXT_STEPS_PROMPT = `You are a sales coach creating actionable next steps for a deal.

Urgency: {{URGENCY}}

Generate exactly 3 prioritized next steps. Each should be:
- Specific and actionable (not vague like "follow up")
- Time-bound (include "within X days")
- Tied to advancing the deal stage

Also create a single task summary (1 sentence) for the most important action.

Respond in JSON format: { "task_summary": string, "next_steps": string }

Deal Data:
{{DEAL_DATA}}`;
