# DealPilot - Quick Start Guide

Get DealPilot up and running in 15 minutes.

## Prerequisites

Have these ready before starting:
- ✅ HubSpot developer account
- ✅ OpenAI API key  
- ✅ Vercel account
- ✅ GitHub account
- ✅ Node.js 20+ installed

## 5-Minute Local Setup

### 1. Clone & Install (2 min)

```bash
cd ~/apps
git clone https://github.com/anish632/dealpilot-hubspot.git
cd dealpilot-hubspot
npm install
```

### 2. Configure Environment (2 min)

```bash
cp .env.example .env
```

Edit `.env` with your credentials:
```bash
# Get these from HubSpot Developer Portal
HUBSPOT_APP_ID=your_app_id
HUBSPOT_CLIENT_ID=your_client_id
HUBSPOT_CLIENT_SECRET=your_client_secret
HUBSPOT_DEVELOPER_API_KEY=your_dev_api_key
HUBSPOT_SIGNATURE_SECRET=any_random_string_for_dev

# Get from OpenAI Platform
OPENAI_API_KEY=sk-...
```

### 3. Run Development Server (1 min)

```bash
npm run dev
```

Visit http://localhost:3000 — you should see the landing page!

---

## 10-Minute Production Deployment

### 1. Create HubSpot App (3 min)

1. Go to [developers.hubspot.com](https://developers.hubspot.com)
2. Click **Create app**
3. Name it "DealPilot"
4. Add scopes:
   - `crm.objects.deals.read`
   - `crm.objects.deals.write`
   - `crm.objects.contacts.read`
   - `crm.objects.owners.read`
   - `timeline`
5. Note: **App ID**, **Client ID**, **Client Secret**

### 2. Deploy to Vercel (4 min)

```bash
# Push to GitHub
git remote add origin https://github.com/anish632/dealpilot-hubspot.git
git push -u origin main

# Deploy
vercel

# Add environment variables
vercel env add HUBSPOT_APP_ID
vercel env add HUBSPOT_CLIENT_ID
vercel env add HUBSPOT_CLIENT_SECRET
vercel env add HUBSPOT_DEVELOPER_API_KEY
vercel env add OPENAI_API_KEY
vercel env add HUBSPOT_SIGNATURE_SECRET

# Deploy to production
vercel --prod
```

### 3. Upload HubSpot Project (3 min)

```bash
# Install CLI
npm install -g @hubspot/cli

# Authenticate
hs auth

# Update action URLs in hubspot/src/app/workflow-actions/*.json
# Change "https://dealpilot.dasgroupllc.com" to your Vercel URL

# Upload
cd hubspot
hs project upload
```

---

## Test Your Installation

### Test API Endpoints (Local)

```bash
# Test analyze-deal endpoint
curl -X POST http://localhost:3000/api/tools/analyze-deal \
  -H "Content-Type: application/json" \
  -d '{
    "inputFields": {
      "deal_id": "YOUR_TEST_DEAL_ID"
    }
  }'
```

Expected response:
```json
{
  "outputFields": {
    "win_score": "75",
    "risk_signals": "No major risks identified",
    "health_summary": "Deal is progressing well...",
    "recommendation": "Schedule a follow-up call within 3 days"
  }
}
```

### Test Breeze Integration

1. In HubSpot, go to **Automations** → **Breeze Agents**
2. Create a new agent
3. Verify these tools appear:
   - ✅ Analyze Deal Health
   - ✅ Draft Follow-up Email
   - ✅ Create Next Steps
4. Test a conversation:
   ```
   User: "Analyze deal 12345"
   Agent: [Uses Analyze Deal Health tool]
   ```

---

## Common Quick Fixes

### Issue: "Invalid signature" error
```bash
# Make sure HUBSPOT_SIGNATURE_SECRET is set
# For local dev, signature validation can be disabled by removing the check
```

### Issue: "OpenAI API error"
```bash
# Verify your API key has credits
# Check key at platform.openai.com
```

### Issue: Tools not showing in Breeze
```bash
# 1. Verify project upload succeeded
cd hubspot && hs project upload

# 2. Check action URLs are correct
# Edit hubspot/src/app/workflow-actions/*.json

# 3. Link project to app in HubSpot Developer Portal
```

### Issue: "Failed to fetch deal data"
```bash
# Check HubSpot API key in .env
# Verify scopes are configured in HubSpot app
# Try with a different deal ID
```

---

## Next Steps

Once everything is working:

1. ✅ **Test all three tools** with real deals
2. ✅ **Review AI prompts** in `lib/prompts.ts` (customize if needed)
3. ✅ **Set up monitoring** (Vercel logs or Sentry)
4. ✅ **Configure rate limiting** (optional but recommended)
5. ✅ **Update privacy policy** with your company details
6. ✅ **Invite team members** to test
7. ✅ **Submit to HubSpot Marketplace** (if going public)

---

## Resources

- **Full Documentation**: [README.md](./README.md)
- **Deployment Guide**: [DEPLOYMENT.md](./DEPLOYMENT.md)
- **Architecture Details**: [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md)
- **Contributing**: [CONTRIBUTING.md](./CONTRIBUTING.md)

## Support

Questions? Email support@dasgroupllc.com

---

**Ready in 15 minutes!** ⏱️  
Now go close some deals with AI-powered intelligence! 🚀
