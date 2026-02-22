export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-purple-700">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
              <span className="text-2xl">🎯</span>
            </div>
            <h1 className="text-2xl font-bold text-white">DealPilot</h1>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
          AI Deal Intelligence for HubSpot
        </h2>
        <p className="text-xl md:text-2xl text-blue-100 mb-12 max-w-3xl mx-auto">
          Supercharge your sales team with AI-powered deal analysis, automated follow-ups, and intelligent next steps.
        </p>
        <a
          href="https://ecosystem.hubspot.com/marketplace/apps"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-white text-blue-600 font-semibold px-8 py-4 rounded-lg shadow-lg hover:shadow-xl transition-all hover:scale-105"
        >
          Install from HubSpot Marketplace
        </a>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Feature 1 */}
          <div className="bg-white rounded-xl p-8 shadow-lg">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-2xl font-bold mb-3 text-gray-900">Analyze Deal Health</h3>
            <p className="text-gray-600">
              Get instant AI-powered win probability scores, risk signals, and health summaries for any deal. 
              Identify stale deals, missing information, and overdue close dates automatically.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white rounded-xl p-8 shadow-lg">
            <div className="text-4xl mb-4">✉️</div>
            <h3 className="text-2xl font-bold mb-3 text-gray-900">Draft Follow-ups</h3>
            <p className="text-gray-600">
              Generate personalized follow-up emails based on deal context, contact information, and deal stage. 
              Choose your tone (professional, casual, urgent) and add custom context.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white rounded-xl p-8 shadow-lg">
            <div className="text-4xl mb-4">✅</div>
            <h3 className="text-2xl font-bold mb-3 text-gray-900">Create Next Steps</h3>
            <p className="text-gray-600">
              AI generates prioritized, time-bound action items and automatically creates tasks in HubSpot. 
              Set urgency levels and get actionable recommendations to move deals forward.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h3 className="text-3xl font-bold text-white mb-12">Powered by HubSpot Breeze</h3>
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 max-w-4xl mx-auto">
          <p className="text-lg text-white mb-6">
            DealPilot integrates seamlessly with HubSpot&apos;s Breeze AI agent platform. 
            Simply install the app, and your Breeze agents will have access to three powerful tools:
          </p>
          <ul className="text-left text-white space-y-3 max-w-2xl mx-auto">
            <li className="flex items-start">
              <span className="mr-3">•</span>
              <span><strong>Analyze Deal Health:</strong> Instant deal intelligence and risk assessment</span>
            </li>
            <li className="flex items-start">
              <span className="mr-3">•</span>
              <span><strong>Draft Follow-up Email:</strong> Contextual email generation with tone control</span>
            </li>
            <li className="flex items-start">
              <span className="mr-3">•</span>
              <span><strong>Create Next Steps:</strong> Automated task creation with AI recommendations</span>
            </li>
          </ul>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-12 text-center text-white/80">
        <div className="space-x-6 mb-4">
          <a href="/privacy" className="hover:text-white transition-colors">Privacy Policy</a>
          <a href="/terms" className="hover:text-white transition-colors">Terms of Service</a>
        </div>
        <p className="text-sm">
          © 2025 Das Group LLC. All rights reserved.
          <br />
          Contact: <a href="mailto:support@dasgroupllc.com" className="underline hover:text-white">support@dasgroupllc.com</a>
        </p>
      </footer>
    </main>
  );
}
