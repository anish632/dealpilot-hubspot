export default function Home() {
  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white overflow-hidden">
      {/* Ambient glow effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[128px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-violet-600/15 rounded-full blur-[128px]" />
      </div>

      <div className="relative z-10">
        {/* Nav */}
        <header className="border-b border-white/5">
          <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-sm font-bold">
                DP
              </div>
              <span className="text-lg font-semibold tracking-tight">DealPilot</span>
            </div>
            <nav className="hidden md:flex items-center gap-8 text-sm text-white/50">
              <a href="#features" className="hover:text-white transition-colors">Features</a>
              <a href="#how-it-works" className="hover:text-white transition-colors">How it works</a>
              <a
                href="https://ecosystem.hubspot.com/marketplace/apps"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-full bg-white text-black text-sm font-medium hover:bg-white/90 transition-colors"
              >
                Install App
              </a>
            </nav>
          </div>
        </header>

        {/* Hero */}
        <section className="max-w-4xl mx-auto px-6 pt-24 pb-20 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 text-xs text-white/60 mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Now in beta — Breeze Agent Tools
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.1] mb-6">
            AI deal intelligence
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">
              inside HubSpot
            </span>
          </h1>
          <p className="text-lg md:text-xl text-white/40 max-w-2xl mx-auto mb-10 leading-relaxed">
            Score deal health, draft follow-ups, and create next steps — all from a single conversation with your Breeze agent.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="https://ecosystem.hubspot.com/marketplace/apps"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3.5 rounded-full bg-white text-black font-semibold text-sm hover:bg-white/90 transition-all hover:shadow-[0_0_32px_rgba(255,255,255,0.15)]"
            >
              Install from Marketplace →
            </a>
            <a
              href="#features"
              className="px-8 py-3.5 rounded-full border border-white/10 text-white/60 text-sm hover:text-white hover:border-white/25 transition-all"
            >
              See how it works
            </a>
          </div>
        </section>

        {/* Feature Cards */}
        <section id="features" className="max-w-6xl mx-auto px-6 py-20">
          <div className="grid md:grid-cols-3 gap-4">
            {[
              {
                icon: "📊",
                title: "Analyze Deal Health",
                desc: "AI scores win probability (0–100), surfaces risk signals like stale deals or missing decision makers, and delivers a health summary with the single most impactful action to take.",
                tag: "GET_DATA",
                color: "from-blue-500/10 to-blue-600/5",
                border: "border-blue-500/10",
              },
              {
                icon: "✉️",
                title: "Draft Follow-up",
                desc: "Generates personalized emails using deal stage, contact data, and last activity. Pick a tone — professional, casual, or urgent — and get a ready-to-send draft with subject line.",
                tag: "GENERATE",
                color: "from-violet-500/10 to-violet-600/5",
                border: "border-violet-500/10",
              },
              {
                icon: "⚡",
                title: "Create Next Steps",
                desc: "Three prioritized, time-bound actions ranked by impact. The top action is automatically created as a HubSpot task linked to the deal — with the right priority and due date.",
                tag: "TAKE_ACTION",
                color: "from-emerald-500/10 to-emerald-600/5",
                border: "border-emerald-500/10",
              },
            ].map((f) => (
              <div
                key={f.title}
                className={`group rounded-2xl border ${f.border} bg-gradient-to-b ${f.color} p-8 hover:border-white/15 transition-all duration-300`}
              >
                <div className="text-3xl mb-5">{f.icon}</div>
                <div className="flex items-center gap-3 mb-3">
                  <h3 className="text-xl font-semibold">{f.title}</h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/5 text-white/30 border border-white/5">
                    {f.tag}
                  </span>
                </div>
                <p className="text-sm text-white/40 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="max-w-4xl mx-auto px-6 py-20">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 tracking-tight">
            Three tools. One conversation.
          </h2>
          <div className="space-y-8">
            {[
              { step: "01", title: "Install DealPilot", desc: "Add the app from HubSpot Marketplace. It connects directly to Breeze Studio — no code, no config." },
              { step: "02", title: "Talk to your agent", desc: "Ask your Breeze agent anything about a deal: \"How healthy is the Acme deal?\" or \"Draft a follow-up for deal 12345.\"" },
              { step: "03", title: "Get results instantly", desc: "DealPilot analyzes your CRM data in real-time, generates insights with AI, and takes action — all within the chat." },
            ].map((s) => (
              <div
                key={s.step}
                className="flex gap-6 items-start p-6 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
              >
                <span className="text-2xl font-bold text-white/10 font-mono shrink-0">{s.step}</span>
                <div>
                  <h3 className="text-lg font-semibold mb-1">{s.title}</h3>
                  <p className="text-sm text-white/40">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="max-w-3xl mx-auto px-6 py-20 text-center">
          <div className="rounded-2xl border border-white/5 bg-gradient-to-b from-white/[0.03] to-transparent p-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">
              Ready to close more deals?
            </h2>
            <p className="text-white/40 mb-8 max-w-lg mx-auto">
              DealPilot is free during the Breeze Agent Tools beta. Install now and be the first to get AI deal intelligence inside HubSpot.
            </p>
            <a
              href="https://ecosystem.hubspot.com/marketplace/apps"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex px-8 py-3.5 rounded-full bg-gradient-to-r from-blue-500 to-violet-500 font-semibold text-sm hover:shadow-[0_0_32px_rgba(139,92,246,0.3)] transition-all"
            >
              Install DealPilot →
            </a>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-white/5">
          <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between text-xs text-white/25">
            <div className="flex items-center gap-3 mb-4 md:mb-0">
              <div className="w-6 h-6 rounded bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-[8px] font-bold">
                DP
              </div>
              <span>© 2026 Das Group LLC</span>
            </div>
            <div className="flex items-center gap-6">
              <a href="/privacy" className="hover:text-white/50 transition-colors">Privacy</a>
              <a href="/terms" className="hover:text-white/50 transition-colors">Terms</a>
              <a href="mailto:support@dasgroupllc.com" className="hover:text-white/50 transition-colors">Contact</a>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}
