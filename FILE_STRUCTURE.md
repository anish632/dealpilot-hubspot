# DealPilot - File Structure

Complete overview of the project structure.

```
dealpilot-hubspot/
│
├── 📄 Configuration Files
│   ├── package.json                    # Dependencies and scripts
│   ├── tsconfig.json                   # TypeScript configuration
│   ├── next.config.ts                  # Next.js configuration
│   ├── tailwind.config.ts              # Tailwind CSS configuration
│   ├── postcss.config.js               # PostCSS configuration
│   ├── .gitignore                      # Git ignore rules
│   ├── .env.example                    # Environment variables template
│   └── .env.local.example              # Local dev environment template
│
├── 📚 Documentation
│   ├── README.md                       # Project overview and setup
│   ├── PROJECT_SUMMARY.md              # Architecture and technical details
│   ├── DEPLOYMENT.md                   # Production deployment guide
│   ├── QUICKSTART.md                   # 15-minute setup guide
│   ├── CONTRIBUTING.md                 # Contribution guidelines
│   ├── CHANGELOG.md                    # Version history
│   └── FILE_STRUCTURE.md               # This file
│
├── 🔧 Scripts
│   └── verify-setup.sh                 # Setup verification script
│
├── 🎨 Frontend (Next.js App Router)
│   └── app/
│       ├── layout.tsx                  # Root layout with Inter font
│       ├── page.tsx                    # Landing page (marketing)
│       ├── globals.css                 # Global styles with Tailwind
│       │
│       ├── 📡 API Routes
│       │   ├── tools/
│       │   │   ├── analyze-deal/
│       │   │   │   └── route.ts        # Deal health analysis endpoint
│       │   │   ├── draft-followup/
│       │   │   │   └── route.ts        # Follow-up email generation endpoint
│       │   │   └── create-next-steps/
│       │   │       └── route.ts        # Next steps creation endpoint
│       │   │
│       │   └── auth/
│       │       ├── install/
│       │       │   └── route.ts        # OAuth installation redirect
│       │       └── callback/
│       │           └── route.ts        # OAuth callback handler
│       │
│       ├── 📜 Legal Pages
│       │   ├── privacy/
│       │   │   └── page.tsx            # Privacy policy
│       │   └── terms/
│       │       └── page.tsx            # Terms of service
│
├── 🔨 Shared Libraries
│   └── lib/
│       ├── hubspot.ts                  # HubSpot API client wrapper
│       │                               # - Token storage (in-memory)
│       │                               # - Token refresh logic
│       │                               # - Client initialization
│       │
│       ├── openai.ts                   # OpenAI client singleton
│       │                               # - GPT-4o integration
│       │                               # - JSON response format
│       │
│       ├── validate.ts                 # HubSpot signature validation
│       │                               # - HMAC-SHA256 verification
│       │                               # - Request authentication
│       │
│       └── prompts.ts                  # AI prompt templates
│                                       # - ANALYZE_DEAL_PROMPT
│                                       # - DRAFT_FOLLOWUP_PROMPT
│                                       # - CREATE_NEXT_STEPS_PROMPT
│
└── 🏗️ HubSpot Project
    └── hubspot/
        ├── hsproject.json              # HubSpot project configuration
        │                               # - Platform version: 2025.2
        │                               # - Source directory: src
        │
        └── src/app/
            ├── app-hsmeta.json         # App metadata
            │                           # - Name: DealPilot
            │                           # - Scopes: deals, contacts, owners, timeline
            │                           # - Distribution: marketplace
            │
            └── workflow-actions/       # Breeze Agent tool definitions
                │
                ├── analyze-deal-hsmeta.json
                │   # Tool: Analyze Deal Health
                │   # Type: GET_DATA
                │   # Inputs: deal_id
                │   # Outputs: win_score, risk_signals, health_summary, recommendation
                │
                ├── draft-followup-hsmeta.json
                │   # Tool: Draft Follow-up Email
                │   # Type: GENERATE
                │   # Inputs: deal_id, tone, context_notes
                │   # Outputs: email_subject, email_body, suggested_send_time
                │
                └── create-next-steps-hsmeta.json
                    # Tool: Create Next Steps
                    # Type: TAKE_ACTION
                    # Inputs: deal_id, urgency
                    # Outputs: task_id, task_summary, next_steps
```

## File Descriptions

### Configuration Files

| File | Purpose |
|------|---------|
| `package.json` | NPM dependencies, scripts, and project metadata |
| `tsconfig.json` | TypeScript compiler options and paths |
| `next.config.ts` | Next.js build and runtime configuration |
| `tailwind.config.ts` | Tailwind CSS utility classes and theme |
| `postcss.config.js` | PostCSS plugins (Tailwind, Autoprefixer) |
| `.gitignore` | Files and directories to exclude from Git |
| `.env.example` | Template for required environment variables |

### API Routes (app/api/)

| Route | Method | Purpose |
|-------|--------|---------|
| `/api/tools/analyze-deal` | POST | Analyze deal health, win probability, and risk signals |
| `/api/tools/draft-followup` | POST | Generate personalized follow-up email based on deal context |
| `/api/tools/create-next-steps` | POST | Create AI-recommended next steps and HubSpot task |
| `/api/auth/install` | GET | Initiate HubSpot OAuth flow |
| `/api/auth/callback` | GET | Handle OAuth callback and store tokens |

### Library Functions (lib/)

| Function | File | Purpose |
|----------|------|---------|
| `getHubSpotClient()` | `hubspot.ts` | Get authenticated HubSpot API client |
| `storeTokens()` | `hubspot.ts` | Store OAuth access and refresh tokens |
| `refreshAccessToken()` | `hubspot.ts` | Refresh expired access tokens |
| `generateCompletion()` | `openai.ts` | Generate AI completion via OpenAI |
| `validateHubSpotSignature()` | `validate.ts` | Validate HubSpot webhook signatures |
| `ANALYZE_DEAL_PROMPT` | `prompts.ts` | Prompt for deal analysis |
| `DRAFT_FOLLOWUP_PROMPT` | `prompts.ts` | Prompt for email generation |
| `CREATE_NEXT_STEPS_PROMPT` | `prompts.ts` | Prompt for next steps |

### HubSpot Project Files

| File | Purpose |
|------|---------|
| `hsproject.json` | Root project configuration |
| `app-hsmeta.json` | App metadata (name, description, scopes) |
| `analyze-deal-hsmeta.json` | Tool definition for deal analysis |
| `draft-followup-hsmeta.json` | Tool definition for email drafting |
| `create-next-steps-hsmeta.json` | Tool definition for next steps |

## Key Directories

### `/app` - Next.js Application
All frontend and API code lives here. Uses Next.js 14 App Router.

### `/lib` - Shared Utilities
Reusable functions and configurations used across API routes.

### `/hubspot` - HubSpot Project
Separate directory for HubSpot Breeze Agent definitions. This gets uploaded to HubSpot via their CLI.

## File Size Summary

- **Total TypeScript files**: 14
- **Total JSON files**: 6
- **Total Markdown files**: 7
- **Total CSS files**: 1
- **Lines of code (estimated)**: ~2,500

## Dependencies

### Production
- `next` - React framework
- `react` & `react-dom` - UI library
- `@hubspot/api-client` - HubSpot API wrapper
- `openai` - OpenAI API client

### Development
- `typescript` - Type safety
- `tailwindcss` - Utility-first CSS
- `autoprefixer` & `postcss` - CSS processing

## Environment Variables

Required in `.env` (see `.env.example`):

```bash
HUBSPOT_APP_ID              # HubSpot app identifier
HUBSPOT_CLIENT_ID           # OAuth client ID
HUBSPOT_CLIENT_SECRET       # OAuth client secret
HUBSPOT_DEVELOPER_API_KEY   # HubSpot API key
OPENAI_API_KEY              # OpenAI API key
HUBSPOT_SIGNATURE_SECRET    # Webhook signature validation secret
```

## Build Output

When you run `npm run build`:

```
.next/                      # Next.js build output (gitignored)
├── cache/                  # Build cache
├── server/                 # Server-side code
├── static/                 # Static assets
└── standalone/             # Standalone deployment files
```

## Deployment Structure (Vercel)

```
Production URL: https://dealpilot-hubspot.vercel.app

Endpoints:
├── GET  /                                      → Landing page
├── GET  /privacy                               → Privacy policy
├── GET  /terms                                 → Terms of service
├── POST /api/tools/analyze-deal                → Deal analysis
├── POST /api/tools/draft-followup              → Email generation
├── POST /api/tools/create-next-steps           → Next steps creation
├── GET  /api/auth/install                      → OAuth install
└── GET  /api/auth/callback                     → OAuth callback
```

---

**Need to add a new file?**  
Update this document to keep the team informed!
