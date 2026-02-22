# Contributing to DealPilot

Thank you for considering contributing to DealPilot! This document provides guidelines and instructions for contributing.

## Code of Conduct

- Be respectful and professional in all interactions
- Welcome newcomers and help them get started
- Focus on constructive feedback
- Respect differing viewpoints and experiences

## How to Contribute

### Reporting Bugs

If you find a bug, please create an issue with:

1. **Clear title**: Describe the issue concisely
2. **Description**: Detailed explanation of the problem
3. **Steps to reproduce**: How to replicate the issue
4. **Expected behavior**: What should happen
5. **Actual behavior**: What actually happens
6. **Environment**: Node version, OS, browser (if applicable)
7. **Screenshots**: If relevant

**Example:**
```
Title: Analyze Deal Tool returns 500 error for deals without owner

Description:
When analyzing a deal that doesn't have an assigned owner (hubspot_owner_id is null),
the API returns a 500 Internal Server Error instead of handling the missing data gracefully.

Steps to Reproduce:
1. Create a deal in HubSpot without assigning an owner
2. Call /api/tools/analyze-deal with the deal ID
3. Observe the 500 error

Expected: Tool should handle missing owner gracefully and still provide analysis
Actual: 500 Internal Server Error

Environment:
- Node: 20.11.0
- HubSpot Account: Production
- Browser: Chrome 120
```

### Suggesting Enhancements

For feature requests or enhancements:

1. **Check existing issues**: See if it's already been suggested
2. **Create a new issue** with:
   - Clear title describing the feature
   - Detailed explanation of the enhancement
   - Use cases and benefits
   - Proposed implementation (if you have ideas)
   - Any potential drawbacks or considerations

### Pull Requests

1. **Fork the repository**
   ```bash
   # Click "Fork" on GitHub
   git clone https://github.com/your-username/dealpilot-hubspot.git
   cd dealpilot-hubspot
   ```

2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   # Or for bug fixes:
   git checkout -b fix/bug-description
   ```

3. **Make your changes**
   - Write clean, readable code
   - Follow existing code style
   - Add comments for complex logic
   - Update documentation if needed

4. **Test your changes**
   ```bash
   # Run the dev server
   npm run dev
   
   # Test affected endpoints
   # Ensure no regressions
   ```

5. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: Add deal scoring algorithm improvement"
   # Or: "fix: Handle null owner ID in deal analysis"
   ```

   **Commit message format:**
   - `feat:` New feature
   - `fix:` Bug fix
   - `docs:` Documentation changes
   - `style:` Code style changes (formatting, etc.)
   - `refactor:` Code refactoring
   - `test:` Adding tests
   - `chore:` Maintenance tasks

6. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

7. **Create a Pull Request**
   - Go to the original repository on GitHub
   - Click "New Pull Request"
   - Select your branch
   - Fill in the PR template with:
     - Description of changes
     - Related issue number (if applicable)
     - Testing steps
     - Screenshots (if UI changes)

### Pull Request Guidelines

**Before submitting:**
- ✅ Code follows existing style and conventions
- ✅ All tests pass (when tests are added)
- ✅ No console errors or warnings
- ✅ Documentation updated if needed
- ✅ Commit messages are clear and descriptive
- ✅ No merge conflicts with main branch

**PR Review Process:**
1. Maintainers will review your PR
2. Feedback may be provided for changes
3. Make requested changes and push updates
4. Once approved, PR will be merged

## Development Setup

### Prerequisites

- Node.js 20+
- npm or yarn
- HubSpot developer account (for testing)
- OpenAI API key

### Local Development

```bash
# Clone your fork
git clone https://github.com/your-username/dealpilot-hubspot.git
cd dealpilot-hubspot

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Edit .env with your test credentials
# (Use test HubSpot account, not production)

# Run development server
npm run dev
```

### Project Structure

```
dealpilot-hubspot/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── tools/        # Tool endpoints
│   │   └── auth/         # OAuth endpoints
│   ├── privacy/          # Privacy policy page
│   ├── terms/            # Terms of service page
│   └── page.tsx          # Landing page
├── lib/                   # Shared utilities
│   ├── hubspot.ts        # HubSpot client
│   ├── openai.ts         # OpenAI client
│   ├── validate.ts       # Signature validation
│   └── prompts.ts        # AI prompts
├── hubspot/              # HubSpot project files
│   └── src/app/          # App metadata
└── docs/                 # Documentation
```

### Code Style

**TypeScript:**
- Use TypeScript for all new code
- Define proper types/interfaces
- Avoid `any` types when possible
- Use async/await over promises

**Formatting:**
- 2 spaces for indentation
- Single quotes for strings
- Semicolons at end of statements
- Trailing commas in objects/arrays

**Functions:**
```typescript
// Good
export async function analyzeDeal(dealId: string): Promise<DealAnalysis> {
  const deal = await fetchDeal(dealId);
  return generateAnalysis(deal);
}

// Avoid
export async function analyzeDeal(dealId) {
  return generateAnalysis(await fetchDeal(dealId));
}
```

**Error Handling:**
```typescript
// Always include try-catch in API routes
export async function POST(request: NextRequest) {
  try {
    // ... logic
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in analyze-deal:', error);
    return NextResponse.json(
      { error: 'Failed to analyze deal' },
      { status: 500 }
    );
  }
}
```

### AI Prompt Guidelines

When modifying prompts in `lib/prompts.ts`:

1. **Be specific**: Clearly define expected inputs and outputs
2. **Use JSON format**: Request structured JSON responses for reliable parsing
3. **Include examples**: Show the AI what you want
4. **Set constraints**: Define limits (e.g., "Keep subject under 50 characters")
5. **Test thoroughly**: Try edge cases and unusual inputs

**Example:**
```typescript
export const EXAMPLE_PROMPT = `You are a sales expert. Analyze the deal below.

Return JSON format: { "score": number, "insights": string }

Requirements:
- Score must be 0-100
- Insights should be 2-3 sentences max
- Focus on actionable recommendations

Deal Data:
{{DEAL_DATA}}`;
```

### Testing Changes

**Manual Testing:**
1. Test with real HubSpot deals (use test account)
2. Try edge cases (missing data, null values, etc.)
3. Verify error handling works correctly
4. Check Vercel logs for any issues

**Areas to Test:**
- ✅ Valid inputs work as expected
- ✅ Invalid inputs return proper errors
- ✅ Missing data is handled gracefully
- ✅ Large datasets don't cause timeouts
- ✅ OAuth flow works correctly
- ✅ Signature validation passes

## Documentation

When making changes that affect:

- **API behavior**: Update README.md and PROJECT_SUMMARY.md
- **Setup process**: Update DEPLOYMENT.md
- **Configuration**: Update .env.example and documentation
- **New features**: Add to CHANGELOG.md

## Questions?

If you have questions about contributing:

- Check existing issues and PRs
- Read the documentation thoroughly
- Open a discussion issue for clarification
- Email support@dasgroupllc.com for private questions

## License

By contributing, you agree that your contributions will be licensed under the same license as the project.

---

Thank you for contributing to DealPilot! 🚀
