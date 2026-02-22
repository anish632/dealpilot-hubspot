# DealPilot - AI Deal Intelligence for HubSpot

DealPilot is a HubSpot Breeze Agent app that provides AI-powered deal intelligence tools. It helps sales teams analyze deals, draft personalized follow-ups, and create smart next steps automatically.

## Features

### 🎯 Analyze Deal Health
- AI-powered win probability scoring (0-100)
- Automatic risk signal detection (stale deals, missing info, overdue dates)
- Comprehensive health summaries
- Actionable recommendations

### ✉️ Draft Follow-up Emails
- Context-aware email generation
- Tone control (professional, casual, urgent)
- Personalized based on deal stage and contact info
- Suggested send times

### ✅ Create Next Steps
- AI-generated, prioritized action items
- Automatic task creation in HubSpot
- Time-bound recommendations
- Urgency-based prioritization

## Architecture

- **Backend**: Next.js 14 (App Router) on Vercel
- **AI**: OpenAI GPT-4o for content generation
- **Integration**: HubSpot API Client
- **Language**: TypeScript

## Setup

### Prerequisites

- Node.js 20+ and npm/yarn
- HubSpot developer account
- OpenAI API key
- Vercel account (for deployment)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/anish632/dealpilot-hubspot.git
   cd dealpilot-hubspot
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Copy `.env.example` to `.env` and fill in your credentials:
   ```bash
   cp .env.example .env
   ```

   Required variables:
   - `HUBSPOT_APP_ID` - Your HubSpot app ID
   - `HUBSPOT_CLIENT_ID` - OAuth client ID
   - `HUBSPOT_CLIENT_SECRET` - OAuth client secret
   - `HUBSPOT_DEVELOPER_API_KEY` - HubSpot developer API key
   - `OPENAI_API_KEY` - OpenAI API key
   - `HUBSPOT_SIGNATURE_SECRET` - Webhook signature secret

4. **Run development server**
   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:3000`

## Deployment

### Deploy to Vercel

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/anish632/dealpilot-hubspot.git
   git push -u origin main
   ```

2. **Deploy to Vercel**
   ```bash
   vercel
   ```

   Or connect your GitHub repository in the Vercel dashboard.

3. **Set environment variables in Vercel**
   
   Go to your Vercel project settings → Environment Variables and add all the variables from `.env`

4. **Update HubSpot app settings**
   
   In your HubSpot developer account, update:
   - Redirect URL: `https://your-app.vercel.app/api/auth/callback`
   - Webhook URLs: Point to your Vercel deployment

## HubSpot Project Upload

The `hubspot/` directory contains the HubSpot project configuration for Breeze Agent tools.

### Prerequisites

- Install HubSpot CLI:
  ```bash
  npm install -g @hubspot/cli
  ```

- Authenticate:
  ```bash
  hs auth
  ```

### Upload to HubSpot

1. **Navigate to the HubSpot project directory**
   ```bash
   cd hubspot
   ```

2. **Upload the project**
   ```bash
   hs project upload
   ```

3. **Configure action URLs**
   
   Update the `actionUrl` in each `workflow-actions/*-hsmeta.json` file to point to your Vercel deployment:
   ```json
   "actionUrl": "https://your-app.vercel.app/api/tools/analyze-deal"
   ```

4. **Test the tools**
   
   In HubSpot, create a Breeze agent and verify the three tools are available:
   - Analyze Deal Health
   - Draft Follow-up Email
   - Create Next Steps

## API Endpoints

### Tool Endpoints

- `POST /api/tools/analyze-deal` - Analyze deal health and win probability
- `POST /api/tools/draft-followup` - Generate follow-up email
- `POST /api/tools/create-next-steps` - Create AI-recommended next steps

### Auth Endpoints

- `GET /api/auth/install` - Initiate OAuth flow
- `GET /api/auth/callback` - OAuth callback handler

## Security

- All HubSpot webhook requests are validated using HMAC-SHA256 signatures
- OAuth tokens are stored securely (in-memory for now, migrate to database for production)
- HTTPS/TLS encryption for all API communication
- Environment variables for sensitive credentials

## Development

### Project Structure

```
dealpilot-hubspot/
├── app/
│   ├── api/
│   │   ├── tools/          # Tool endpoints
│   │   └── auth/           # OAuth endpoints
│   ├── privacy/            # Privacy policy page
│   ├── terms/              # Terms of service page
│   ├── layout.tsx
│   ├── page.tsx            # Landing page
│   └── globals.css
├── lib/
│   ├── hubspot.ts          # HubSpot client helpers
│   ├── openai.ts           # OpenAI client
│   ├── validate.ts         # Signature validation
│   └── prompts.ts          # AI prompts
├── hubspot/
│   ├── hsproject.json
│   └── src/app/
│       ├── app-hsmeta.json
│       └── workflow-actions/
└── package.json
```

### Testing

Test your endpoints locally using tools like Postman or curl:

```bash
# Test analyze-deal endpoint
curl -X POST http://localhost:3000/api/tools/analyze-deal \
  -H "Content-Type: application/json" \
  -d '{"inputFields": {"deal_id": "123456"}}'
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## Support

For issues or questions:
- **Email**: support@dasgroupllc.com
- **GitHub Issues**: https://github.com/anish632/dealpilot-hubspot/issues

## License

Copyright © 2025 Das Group LLC. All rights reserved.

## Privacy & Terms

- [Privacy Policy](/privacy)
- [Terms of Service](/terms)
