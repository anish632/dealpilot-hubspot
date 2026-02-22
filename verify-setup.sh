#!/bin/bash

# DealPilot Setup Verification Script
# Run this to verify your local development environment is configured correctly

echo "🔍 Verifying DealPilot Setup..."
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

ERRORS=0
WARNINGS=0

# Check Node.js version
echo "Checking Node.js version..."
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -ge 20 ]; then
  echo -e "${GREEN}✓${NC} Node.js version: $(node -v)"
else
  echo -e "${RED}✗${NC} Node.js version $(node -v) is too old. Need v20+"
  ERRORS=$((ERRORS + 1))
fi
echo ""

# Check if node_modules exists
echo "Checking dependencies..."
if [ -d "node_modules" ]; then
  echo -e "${GREEN}✓${NC} Dependencies installed"
else
  echo -e "${RED}✗${NC} Dependencies not installed. Run: npm install"
  ERRORS=$((ERRORS + 1))
fi
echo ""

# Check environment file
echo "Checking environment configuration..."
if [ -f ".env" ] || [ -f ".env.local" ]; then
  echo -e "${GREEN}✓${NC} Environment file exists"
  
  # Check required variables
  ENV_FILE=".env"
  [ -f ".env.local" ] && ENV_FILE=".env.local"
  
  REQUIRED_VARS=(
    "HUBSPOT_APP_ID"
    "HUBSPOT_CLIENT_ID"
    "HUBSPOT_CLIENT_SECRET"
    "HUBSPOT_DEVELOPER_API_KEY"
    "OPENAI_API_KEY"
    "HUBSPOT_SIGNATURE_SECRET"
  )
  
  for VAR in "${REQUIRED_VARS[@]}"; do
    if grep -q "^${VAR}=.+" "$ENV_FILE" 2>/dev/null; then
      echo -e "${GREEN}  ✓${NC} $VAR is set"
    else
      echo -e "${YELLOW}  ⚠${NC} $VAR is not set or empty"
      WARNINGS=$((WARNINGS + 1))
    fi
  done
else
  echo -e "${RED}✗${NC} No .env or .env.local file found"
  echo "  Run: cp .env.example .env"
  ERRORS=$((ERRORS + 1))
fi
echo ""

# Check required files
echo "Checking project structure..."
REQUIRED_FILES=(
  "app/api/tools/analyze-deal/route.ts"
  "app/api/tools/draft-followup/route.ts"
  "app/api/tools/create-next-steps/route.ts"
  "app/api/auth/callback/route.ts"
  "app/api/auth/install/route.ts"
  "lib/hubspot.ts"
  "lib/openai.ts"
  "lib/prompts.ts"
  "lib/validate.ts"
  "hubspot/hsproject.json"
  "hubspot/src/app/app-hsmeta.json"
  "package.json"
  "tsconfig.json"
  "next.config.ts"
)

ALL_FILES_PRESENT=true
for FILE in "${REQUIRED_FILES[@]}"; do
  if [ -f "$FILE" ]; then
    echo -e "${GREEN}  ✓${NC} $FILE"
  else
    echo -e "${RED}  ✗${NC} Missing: $FILE"
    ALL_FILES_PRESENT=false
    ERRORS=$((ERRORS + 1))
  fi
done

if [ "$ALL_FILES_PRESENT" = true ]; then
  echo -e "${GREEN}✓${NC} All required files present"
fi
echo ""

# Check HubSpot project files
echo "Checking HubSpot project files..."
HUBSPOT_FILES=(
  "hubspot/src/app/workflow-actions/analyze-deal-hsmeta.json"
  "hubspot/src/app/workflow-actions/draft-followup-hsmeta.json"
  "hubspot/src/app/workflow-actions/create-next-steps-hsmeta.json"
)

for FILE in "${HUBSPOT_FILES[@]}"; do
  if [ -f "$FILE" ]; then
    echo -e "${GREEN}  ✓${NC} $FILE"
  else
    echo -e "${RED}  ✗${NC} Missing: $FILE"
    ERRORS=$((ERRORS + 1))
  fi
done
echo ""

# Check Git repository
echo "Checking Git repository..."
if [ -d ".git" ]; then
  echo -e "${GREEN}✓${NC} Git repository initialized"
  
  # Check for uncommitted changes
  if [ -n "$(git status --porcelain)" ]; then
    echo -e "${YELLOW}  ⚠${NC} You have uncommitted changes"
    WARNINGS=$((WARNINGS + 1))
  else
    echo -e "${GREEN}  ✓${NC} Working directory clean"
  fi
else
  echo -e "${YELLOW}⚠${NC} Git not initialized. Run: git init"
  WARNINGS=$((WARNINGS + 1))
fi
echo ""

# Check if HubSpot CLI is installed
echo "Checking HubSpot CLI..."
if command -v hs &> /dev/null; then
  echo -e "${GREEN}✓${NC} HubSpot CLI installed: $(hs --version)"
else
  echo -e "${YELLOW}⚠${NC} HubSpot CLI not installed"
  echo "  Install with: npm install -g @hubspot/cli"
  WARNINGS=$((WARNINGS + 1))
fi
echo ""

# Check if Vercel CLI is installed
echo "Checking Vercel CLI..."
if command -v vercel &> /dev/null; then
  echo -e "${GREEN}✓${NC} Vercel CLI installed"
else
  echo -e "${YELLOW}⚠${NC} Vercel CLI not installed (optional)"
  echo "  Install with: npm install -g vercel"
fi
echo ""

# Summary
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
  echo -e "${GREEN}✓ Setup verification complete! No issues found.${NC}"
  echo ""
  echo "You're ready to start developing!"
  echo "Run: npm run dev"
elif [ $ERRORS -eq 0 ]; then
  echo -e "${YELLOW}⚠ Setup verification complete with $WARNINGS warning(s).${NC}"
  echo ""
  echo "You can proceed, but consider fixing the warnings above."
else
  echo -e "${RED}✗ Setup verification failed with $ERRORS error(s) and $WARNINGS warning(s).${NC}"
  echo ""
  echo "Please fix the errors above before proceeding."
  exit 1
fi

echo ""
echo "Next steps:"
echo "  1. npm run dev        - Start development server"
echo "  2. npm run build      - Build for production"
echo "  3. vercel             - Deploy to Vercel"
echo ""
