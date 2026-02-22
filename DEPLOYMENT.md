# DealPilot Deployment Guide

Complete step-by-step guide to deploy DealPilot to production.

## Prerequisites Checklist

- ✅ HubSpot Developer Account ([developers.hubspot.com](https://developers.hubspot.com))
- ✅ OpenAI API Key ([platform.openai.com](https://platform.openai.com))
- ✅ Vercel Account ([vercel.com](https://vercel.com))
- ✅ GitHub Account ([github.com](https://github.com))
- ✅ HubSpot CLI installed (`npm install -g @hubspot/cli`)

## Step 1: Create HubSpot App

1. Go to [HubSpot Developer Portal](https://developers.hubspot.com)
2. Navigate to **Apps** → **Create app**
3. Fill in app details:
   - **App Name**: DealPilot
   - **Description**: AI-powered deal intelligence for Breeze agents
   - **Logo**: Upload a logo (optional)
4. Note down your **App ID**

### Configure OAuth

1. Go to **Auth** tab
2. Add **Redirect URL**: `https://dealpilot-hubspot.vercel.app/api/auth/callback` (update with your domain)
3. Add **Scopes**:
   - `crm.objects.deals.read`
   - `crm.objects.deals.write`
   - `crm.objects.contacts.read`
   - `crm.objects.owners.read`
   - `timeline`
4. Note down:
   - **Client ID**
   - **Client Secret**

### Generate API Key

1. Go to **Settings** → **Integrations** → **Private Apps**
2. Create a new private app or use developer API key
3. Note down your **Developer API Key**

### Create Signature Secret

1. Go to **Webhooks** tab (or create one manually)
2. Generate or note down the **Signature Secret** (for validating requests)

## Step 2: Get OpenAI API Key

1. Go to [OpenAI Platform](https://platform.openai.com)
2. Navigate to **API Keys**
3. Create a new secret key
4. Note down the key (it won't be shown again)

## Step 3: Deploy to Vercel

### Option A: Deploy via Vercel Dashboard

1. Push code to GitHub:
   ```bash
   cd ~/apps/dealpilot-hubspot
   git remote add origin https://github.com/anish632/dealpilot-hubspot.git
   git push -u origin main
   ```

2. Go to [Vercel Dashboard](https://vercel.com/dashboard)
3. Click **New Project**
4. Import your GitHub repository
5. Configure project:
   - **Framework Preset**: Next.js
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

6. Add **Environment Variables**:
   ```
   HUBSPOT_APP_ID=your_app_id
   HUBSPOT_CLIENT_ID=your_client_id
   HUBSPOT_CLIENT_SECRET=your_client_secret
   HUBSPOT_DEVELOPER_API_KEY=your_api_key
   OPENAI_API_KEY=your_openai_key
   HUBSPOT_SIGNATURE_SECRET=your_signature_secret
   ```

7. Click **Deploy**

### Option B: Deploy via Vercel CLI

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy:
   ```bash
   cd ~/apps/dealpilot-hubspot
   vercel
   ```

4. Follow the prompts:
   - Link to existing project or create new
   - Set environment variables when prompted

5. Deploy to production:
   ```bash
   vercel --prod
   ```

### Set Environment Variables (CLI Method)

```bash
vercel env add HUBSPOT_APP_ID
vercel env add HUBSPOT_CLIENT_ID
vercel env add HUBSPOT_CLIENT_SECRET
vercel env add HUBSPOT_DEVELOPER_API_KEY
vercel env add OPENAI_API_KEY
vercel env add HUBSPOT_SIGNATURE_SECRET
```

## Step 4: Update HubSpot App Configuration

1. Go back to your HubSpot app settings
2. Update **Redirect URL** to match your Vercel deployment:
   ```
   https://your-app.vercel.app/api/auth/callback
   ```
3. Save changes

## Step 5: Upload HubSpot Project

### Authenticate with HubSpot CLI

```bash
hs auth
```

Follow the prompts to authenticate with your HubSpot account.

### Update Action URLs

Before uploading, update all `actionUrl` values in the HubSpot project files to point to your Vercel deployment:

**Files to update:**
- `hubspot/src/app/workflow-actions/analyze-deal-hsmeta.json`
- `hubspot/src/app/workflow-actions/draft-followup-hsmeta.json`
- `hubspot/src/app/workflow-actions/create-next-steps-hsmeta.json`

Change:
```json
"actionUrl": "https://dealpilot-hubspot.vercel.app/api/tools/analyze-deal"
```

To:
```json
"actionUrl": "https://your-actual-vercel-url.vercel.app/api/tools/analyze-deal"
```

### Upload Project

```bash
cd hubspot
hs project upload
```

Select your HubSpot account and confirm the upload.

## Step 6: Link Project to App

1. In HubSpot Developer Portal, go to your app
2. Navigate to **Breeze Extensions** (or similar section for agent tools)
3. Link the uploaded project to your app
4. Publish the tools (or keep them in draft mode for testing)

## Step 7: Test the Integration

### Create a Test Breeze Agent

1. In your HubSpot account, go to **Automations** → **Breeze Agents**
2. Create a new agent
3. Verify that the three DealPilot tools appear:
   - ✅ Analyze Deal Health
   - ✅ Draft Follow-up Email
   - ✅ Create Next Steps

### Test Each Tool

#### Test 1: Analyze Deal Health

1. Create a test deal in your HubSpot account
2. Ask the Breeze agent: "Analyze deal [deal_id]"
3. Verify it returns:
   - Win score (0-100)
   - Risk signals
   - Health summary
   - Recommendation

#### Test 2: Draft Follow-up Email

1. Ask the agent: "Draft a follow-up email for deal [deal_id] in a professional tone"
2. Verify it returns:
   - Email subject
   - Email body
   - Suggested send time

#### Test 3: Create Next Steps

1. Ask the agent: "Create next steps for deal [deal_id] with high urgency"
2. Verify:
   - A task is created in HubSpot
   - Returns task ID and summary
   - Returns 3 prioritized next steps

## Step 8: Monitor & Debug

### View Logs in Vercel

1. Go to your Vercel project
2. Navigate to **Deployments** → Select your deployment → **Functions**
3. View real-time logs for each API endpoint

### Common Issues

**Issue**: "Invalid signature" error
- **Solution**: Verify `HUBSPOT_SIGNATURE_SECRET` is set correctly in Vercel

**Issue**: "Failed to fetch deal data"
- **Solution**: Check HubSpot API key and scopes are configured properly

**Issue**: "OpenAI API error"
- **Solution**: Verify OpenAI API key is valid and has credits

**Issue**: Tools not appearing in Breeze agent
- **Solution**: 
  1. Verify project upload was successful
  2. Check that app is linked to the project
  3. Ensure tools are published (or in correct environment)

### Debug Mode

Add debug logging in your API routes:

```typescript
console.log('Request payload:', JSON.stringify(payload, null, 2));
console.log('Deal data:', JSON.stringify(dealData, null, 2));
```

View logs in Vercel dashboard under **Functions** → **Logs**

## Step 9: Production Checklist

Before making the app public:

- ✅ All environment variables set in Vercel
- ✅ OAuth redirect URL matches Vercel deployment
- ✅ All tool action URLs point to Vercel deployment
- ✅ Signature validation is working
- ✅ All three tools tested successfully
- ✅ Error handling tested (invalid deal IDs, missing data, etc.)
- ✅ Privacy policy and terms of service reviewed
- ✅ Landing page displays correctly
- ✅ Rate limiting implemented (optional but recommended)
- ✅ Monitoring/error tracking set up (e.g., Sentry)

## Step 10: Submit to HubSpot Marketplace (Optional)

To make your app available publicly:

1. In HubSpot Developer Portal, go to your app
2. Navigate to **Listing** tab
3. Fill in marketplace listing details:
   - Description
   - Screenshots
   - Pricing (free or paid)
   - Support contact
4. Submit for review
5. Wait for HubSpot approval (usually 1-2 weeks)

## Maintenance & Updates

### Update Code

```bash
# Make changes locally
cd ~/apps/dealpilot-hubspot
# Edit files...

# Commit and push
git add .
git commit -m "Update: description of changes"
git push origin main

# Vercel will automatically deploy the changes
```

### Update HubSpot Project

```bash
cd hubspot
hs project upload
```

### Rollback Deployment

If something goes wrong:

```bash
# In Vercel dashboard:
# Deployments → Find previous working deployment → Promote to Production
```

Or via CLI:
```bash
vercel rollback
```

## Support

For issues or questions:
- **Email**: support@dasgroupllc.com
- **Docs**: See README.md
- **Logs**: Vercel dashboard → Functions → Logs

---

**Deployment completed successfully?** 🎉  
Time to analyze some deals and close more business with DealPilot!
