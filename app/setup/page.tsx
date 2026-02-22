export default function Setup() {
  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <a href="/" className="text-white/30 hover:text-white/60 text-sm transition-colors">← Back to Home</a>

        <h1 className="text-4xl font-bold mt-8 mb-4">Setup Guide</h1>
        <p className="text-white/40 mb-12">Get DealPilot running in your HubSpot account in under 5 minutes.</p>

        <div className="space-y-12">
          <section>
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-3">
              <span className="text-sm font-mono text-white/20">01</span>
              Install DealPilot
            </h2>
            <div className="text-white/50 space-y-3 text-sm leading-relaxed">
              <p>Click the <strong className="text-white/80">Install</strong> button on the HubSpot Marketplace listing, or visit:</p>
              <code className="block bg-white/5 rounded-lg px-4 py-3 text-white/60 border border-white/5">
                https://dealpilot-hubspot.vercel.app/api/auth/install
              </code>
              <p>You&apos;ll be redirected to HubSpot to authorize DealPilot. Grant the requested permissions:</p>
              <ul className="list-disc list-inside space-y-1 pl-2">
                <li>Read deals and contacts</li>
                <li>Create and update deals</li>
                <li>Read deal owners</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-3">
              <span className="text-sm font-mono text-white/20">02</span>
              Add Tools to a Breeze Agent
            </h2>
            <div className="text-white/50 space-y-3 text-sm leading-relaxed">
              <p>After installing, go to <strong className="text-white/80">Breeze → Breeze Studio</strong> in your HubSpot account.</p>
              <p>Create a new agent or edit an existing one. In the <strong className="text-white/80">Tools</strong> section, click <strong className="text-white/80">Add tool</strong> and select the DealPilot tools:</p>
              <ul className="list-disc list-inside space-y-1 pl-2">
                <li><strong className="text-white/80">Analyze Deal Health</strong> — Score win probability and identify risks</li>
                <li><strong className="text-white/80">Draft Follow-up Email</strong> — Generate context-aware follow-ups</li>
                <li><strong className="text-white/80">Create Next Steps</strong> — AI-recommended tasks with auto-creation</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-3">
              <span className="text-sm font-mono text-white/20">03</span>
              Start Using DealPilot
            </h2>
            <div className="text-white/50 space-y-3 text-sm leading-relaxed">
              <p>Chat with your Breeze agent and ask about any deal. Example prompts:</p>
              <div className="space-y-2">
                {[
                  "How healthy is the Acme Corp deal?",
                  "Analyze deal 12345",
                  "Draft a follow-up email for the Enterprise deal",
                  "Create next steps for deal 67890 with high urgency",
                ].map((prompt) => (
                  <div key={prompt} className="bg-white/5 rounded-lg px-4 py-2.5 border border-white/5 text-white/60 italic">
                    &quot;{prompt}&quot;
                  </div>
                ))}
              </div>
              <p className="mt-4">The agent will use DealPilot&apos;s tools to fetch your CRM data, analyze it, and respond with actionable insights.</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-3">
              <span className="text-sm font-mono text-white/20">04</span>
              Data &amp; Permissions
            </h2>
            <div className="text-white/50 space-y-3 text-sm leading-relaxed">
              <p>DealPilot accesses the following HubSpot data:</p>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="py-2 pr-4 text-white/60 font-medium">Data</th>
                      <th className="py-2 pr-4 text-white/60 font-medium">Access</th>
                      <th className="py-2 text-white/60 font-medium">Purpose</th>
                    </tr>
                  </thead>
                  <tbody className="text-white/40">
                    <tr className="border-b border-white/5">
                      <td className="py-2 pr-4">Deals</td>
                      <td className="py-2 pr-4">Read &amp; Write</td>
                      <td className="py-2">Analyze deal properties, create tasks</td>
                    </tr>
                    <tr className="border-b border-white/5">
                      <td className="py-2 pr-4">Contacts</td>
                      <td className="py-2 pr-4">Read</td>
                      <td className="py-2">Fetch associated contacts for follow-ups</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4">Owners</td>
                      <td className="py-2 pr-4">Read</td>
                      <td className="py-2">Assign tasks to deal owners</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="mt-3">No data is stored on our servers. All analysis happens in real-time and results are returned directly to HubSpot.</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-3">
              <span className="text-sm font-mono text-white/20">05</span>
              Uninstall
            </h2>
            <div className="text-white/50 space-y-3 text-sm leading-relaxed">
              <p>To remove DealPilot, go to <strong className="text-white/80">Settings → Integrations → Connected Apps</strong> in HubSpot and uninstall the app. All access will be revoked immediately.</p>
            </div>
          </section>

          <section className="border-t border-white/5 pt-8">
            <h2 className="text-xl font-semibold mb-3">Need Help?</h2>
            <p className="text-white/40 text-sm">
              Contact us at{' '}
              <a href="mailto:support@dasgroupllc.com" className="text-blue-400 hover:text-blue-300">
                support@dasgroupllc.com
              </a>
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
