const FONT = "'Inter', system-ui, sans-serif";

const CSS = `
  @keyframes glow { 0%,100% { box-shadow: 0 0 20px rgba(16,185,129,0.3); } 50% { box-shadow: 0 0 50px rgba(16,185,129,0.6); } }
  @keyframes fadeUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }

  .hero-cta:hover {
    transform: translateY(-2px);
    box-shadow: 0 16px 50px rgba(16,185,129,0.55) !important;
  }
  .feature-card:hover {
    border-color: rgba(16,185,129,0.3) !important;
    transform: translateY(-2px);
    background: rgba(255,255,255,0.05) !important;
  }
  .nav-cta:hover {
    background: rgba(16,185,129,0.2) !important;
  }
  .secondary-cta:hover {
    background: rgba(255,255,255,0.06) !important;
  }
`;

export default function Landing({ onStart }) {
  return (
    <div style={{ minHeight: "100vh", background: "#060912", fontFamily: FONT, color: "#f8fafc", overflowX: "hidden" }}>
      <style>{CSS}</style>

      {/* Background glows */}
      <div style={{ position: "fixed", top: 0, left: "50%", transform: "translateX(-50%)", width: 900, height: 500, background: "radial-gradient(ellipse at center top, rgba(16,185,129,0.14) 0%, transparent 65%)", pointerEvents: "none", zIndex: 0 }} />
      <div style={{ position: "fixed", bottom: 0, right: 0, width: 600, height: 400, background: "radial-gradient(ellipse at bottom right, rgba(99,102,241,0.07) 0%, transparent 65%)", pointerEvents: "none", zIndex: 0 }} />

      {/* Nav */}
      <nav style={{ position: "relative", zIndex: 10, borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "16px 32px", display: "flex", alignItems: "center", justifyContent: "space-between", backdropFilter: "blur(20px)", background: "rgba(6,9,18,0.8)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 34, height: 34, background: "linear-gradient(135deg, #10b981, #059669)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, boxShadow: "0 0 20px rgba(16,185,129,0.4)" }}>
            🛡️
          </div>
          <div style={{ fontSize: 18, fontWeight: 800, letterSpacing: "-0.02em", background: "linear-gradient(135deg, #fff 30%, #10b981 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            BillVeil
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ fontSize: 12, color: "#475569", fontWeight: 500 }}>Free forever</div>
          <button
            className="nav-cta"
            onClick={onStart}
            style={{ padding: "8px 20px", background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.3)", color: "#10b981", borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: FONT, transition: "all 0.2s" }}
          >
            Analyze My Bill →
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ position: "relative", zIndex: 1, textAlign: "center", padding: "100px 20px 80px", maxWidth: 800, margin: "0 auto" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.25)", color: "#10b981", padding: "7px 18px", borderRadius: 24, fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", marginBottom: 32, animation: "fadeUp 0.6s ease forwards" }}>
          <span style={{ width: 6, height: 6, background: "#10b981", borderRadius: "50%", animation: "glow 2s ease-in-out infinite" }} />
          AI-POWERED · FREE · NO SIGNUP REQUIRED
        </div>

        <h1 style={{ fontSize: 62, fontWeight: 900, lineHeight: 1.05, letterSpacing: "-0.04em", marginBottom: 28, animation: "fadeUp 0.6s 0.1s ease both" }}>
          <span style={{ background: "linear-gradient(135deg, #f8fafc 0%, #cbd5e1 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Your hospital just
          </span>
          <br />
          <span style={{ background: "linear-gradient(135deg, #10b981 0%, #34d399 60%, #6ee7b7 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            overcharged you.
          </span>
          <br />
          <span style={{ background: "linear-gradient(135deg, #f8fafc 0%, #cbd5e1 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Fight back.
          </span>
        </h1>

        <p style={{ fontSize: 19, color: "#64748b", lineHeight: 1.75, maxWidth: 560, margin: "0 auto 40px", animation: "fadeUp 0.6s 0.2s ease both" }}>
          BillVeil uses AI to decode your medical bills, expose overcharges, and give you the exact steps to get your money back.
          <strong style={{ color: "#94a3b8" }}> In 30 seconds. Free.</strong>
        </p>

        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", animation: "fadeUp 0.6s 0.3s ease both" }}>
          <button
            className="hero-cta"
            onClick={onStart}
            style={{ padding: "17px 40px", background: "linear-gradient(135deg, #10b981, #059669)", color: "#fff", border: "none", borderRadius: 12, fontSize: 17, fontWeight: 800, cursor: "pointer", fontFamily: FONT, transition: "all 0.25s", boxShadow: "0 8px 30px rgba(16,185,129,0.4)", letterSpacing: "0.01em" }}
          >
            ⚡ Analyze My Bill — Free
          </button>
          <button
            className="secondary-cta"
            onClick={onStart}
            style={{ padding: "17px 32px", background: "rgba(255,255,255,0.04)", color: "#94a3b8", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, fontSize: 15, fontWeight: 600, cursor: "pointer", fontFamily: FONT, transition: "all 0.2s" }}
          >
            See how it works ↓
          </button>
        </div>

        <div style={{ marginTop: 20, fontSize: 12, color: "#334155", animation: "fadeUp 0.6s 0.4s ease both" }}>
          No signup. No credit card. No data stored.
        </div>
      </section>

      {/* Stats */}
      <section style={{ position: "relative", zIndex: 1, borderTop: "1px solid rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.05)", background: "rgba(255,255,255,0.02)", padding: "40px 20px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 0 }}>
          {[
            { stat: "$935B", label: "Americans overpay yearly", sub: "on medical bills" },
            { stat: "80%", label: "Of bills contain errors", sub: "billing mistakes are common" },
            { stat: "10x", label: "Hospital markup rate", sub: "over fair market price" },
            { stat: "$0", label: "Cost to use BillVeil", sub: "free forever, always" },
          ].map(({ stat, label, sub }, i) => (
            <div key={stat} style={{ textAlign: "center", padding: "16px 12px", borderRight: i < 3 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
              <div style={{ fontSize: 32, fontWeight: 900, background: "linear-gradient(135deg, #10b981, #34d399)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", letterSpacing: "-0.03em", marginBottom: 6 }}>
                {stat}
              </div>
              <div style={{ fontSize: 12, color: "#94a3b8", fontWeight: 600, marginBottom: 3 }}>{label}</div>
              <div style={{ fontSize: 11, color: "#334155" }}>{sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Problem */}
      <section style={{ position: "relative", zIndex: 1, padding: "80px 20px", maxWidth: 800, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: "#10b981", letterSpacing: "0.12em", marginBottom: 16 }}>THE PROBLEM</div>
          <h2 style={{ fontSize: 38, fontWeight: 900, letterSpacing: "-0.03em", lineHeight: 1.2, marginBottom: 16 }}>
            <span style={{ background: "linear-gradient(135deg, #f8fafc, #94a3b8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              The system is rigged against you.
            </span>
          </h2>
          <p style={{ fontSize: 16, color: "#475569", lineHeight: 1.7, maxWidth: 520, margin: "0 auto" }}>
            Hospitals charge whatever they want. Insurance companies deny valid claims. Patients get buried in codes and jargon. Nobody explains anything.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
          {[
            { icon: "💸", title: "Inflated charges", desc: "Hospitals charge 10x the actual cost. A $15 aspirin becomes $150. A $200 test becomes $4,000." },
            { icon: "🤯", title: "Confusing codes", desc: "CPT codes, ICD codes, modifiers. Medical bills are designed to be unreadable so you give up." },
            { icon: "🚫", title: "Denied claims", desc: "Insurance companies deny 1 in 7 claims. Most patients never appeal — they just pay." },
            { icon: "😰", title: "No one to turn to", desc: "Medical billing advocates cost $300/hour. Most Americans can't afford to fight back." },
          ].map(({ icon, title, desc }) => (
            <div key={title} style={{ background: "rgba(239,68,68,0.04)", border: "1px solid rgba(239,68,68,0.1)", borderRadius: 14, padding: "24px 20px" }}>
              <div style={{ fontSize: 28, marginBottom: 12 }}>{icon}</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#f1f5f9", marginBottom: 8 }}>{title}</div>
              <div style={{ fontSize: 13, color: "#475569", lineHeight: 1.7 }}>{desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Solution / How it works */}
      <section style={{ position: "relative", zIndex: 1, padding: "80px 20px", background: "rgba(255,255,255,0.015)", borderTop: "1px solid rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: "#10b981", letterSpacing: "0.12em", marginBottom: 16 }}>THE SOLUTION</div>
            <h2 style={{ fontSize: 38, fontWeight: 900, letterSpacing: "-0.03em", lineHeight: 1.2 }}>
              <span style={{ background: "linear-gradient(135deg, #f8fafc, #94a3b8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                BillVeil is your AI advocate.
              </span>
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 48 }}>
            {[
              { step: "01", icon: "📋", title: "Paste your bill", desc: "Any CPT code, charge, or full bill. No formatting needed. Takes 5 seconds." },
              { step: "02", icon: "🤖", title: "AI analyzes it", desc: "Our AI cross-references fair market rates and spots every overcharge instantly." },
              { step: "03", icon: "⚡", title: "Fight back", desc: "Get a verdict, exact dollar savings, and a step-by-step action plan." },
            ].map(({ step, icon, title, desc }) => (
              <div key={step} style={{ background: "rgba(16,185,129,0.04)", border: "1px solid rgba(16,185,129,0.12)", borderRadius: 14, padding: "28px 20px", textAlign: "center" }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#10b981", letterSpacing: "0.1em", marginBottom: 16 }}>{step}</div>
                <div style={{ fontSize: 32, marginBottom: 14 }}>{icon}</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#f1f5f9", marginBottom: 8 }}>{title}</div>
                <div style={{ fontSize: 13, color: "#475569", lineHeight: 1.7 }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{ position: "relative", zIndex: 1, padding: "80px 20px", maxWidth: 800, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: "#10b981", letterSpacing: "0.12em", marginBottom: 16 }}>WHAT YOU GET</div>
          <h2 style={{ fontSize: 38, fontWeight: 900, letterSpacing: "-0.03em" }}>
            <span style={{ background: "linear-gradient(135deg, #f8fafc, #94a3b8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Everything in one place.
            </span>
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 14 }}>
          {[
            { icon: "🔍", title: "Plain English explanation", desc: "We decode every code and charge so you know exactly what you paid for." },
            { icon: "💰", title: "Fair price benchmark", desc: "See what the same service costs at fair market rates, not hospital rack rates." },
            { icon: "⚖️", title: "Overcharge verdict", desc: "FAIR PRICE, POSSIBLY OVERCHARGED, or SIGNIFICANTLY OVERCHARGED. No ambiguity." },
            { icon: "📋", title: "Action plan", desc: "3 specific steps to dispute, negotiate, or appeal. Exactly what to say and who to call." },
            { icon: "💵", title: "Savings estimate", desc: "We calculate exactly how much money you could recover if you take action." },
            { icon: "🔒", title: "100% private", desc: "We never store your medical data. Every analysis is deleted immediately after." },
          ].map(({ icon, title, desc }) => (
            <div key={title} className="feature-card" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "22px 20px", display: "flex", gap: 16, transition: "all 0.2s", cursor: "default" }}>
              <div style={{ fontSize: 26, flexShrink: 0, marginTop: 2 }}>{icon}</div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#f1f5f9", marginBottom: 6 }}>{title}</div>
                <div style={{ fontSize: 13, color: "#475569", lineHeight: 1.7 }}>{desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Tools section */}
      <section style={{ position: "relative", zIndex: 1, padding: "80px 20px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: "#10b981", letterSpacing: "0.12em", marginBottom: 16 }}>YOUR TOOLKIT</div>
            <h2 style={{ fontSize: 38, fontWeight: 900, letterSpacing: "-0.03em" }}>
              <span style={{ background: "linear-gradient(135deg, #f8fafc, #94a3b8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                Four weapons. One mission.
              </span>
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
            {[
              {
                tab: "analyzer",
                emoji: "⚡",
                label: "Bill Analyzer",
                tag: "Most Popular",
                tagColor: "#10b981",
                desc: "Paste any CPT code or charge. Get a plain-English explanation, fair price comparison, overcharge verdict, and exact action steps.",
                cta: "Analyze a Bill →",
              },
              {
                tab: "dispute",
                emoji: "✉️",
                label: "Dispute Letter",
                tag: "Save Money",
                tagColor: "#60a5fa",
                desc: "Describe what you were charged. We write a professional, ready-to-send dispute letter that hospitals and insurers take seriously.",
                cta: "Write a Letter →",
              },
              {
                tab: "drug",
                emoji: "💊",
                label: "Drug Price Comparator",
                tag: "Cut Costs",
                tagColor: "#a78bfa",
                desc: "Enter any medication. We show the fair price, Cost Plus Drugs rate, cheapest alternatives, and how much you could save monthly.",
                cta: "Compare Prices →",
              },
              {
                tab: "denial",
                emoji: "⚔️",
                label: "Denial Fighter",
                tag: "Fight Back",
                tagColor: "#f87171",
                desc: "Insurance denied your claim? We analyze the denial, write your appeal letter, and walk you through every escalation step including CFPB.",
                cta: "Fight a Denial →",
              },
            ].map(({ tab, emoji, label, tag, tagColor, desc, cta }) => (
              <div
                key={tab}
                className="feature-card"
                onClick={() => onStart(tab)}
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: "24px 22px", cursor: "pointer", transition: "all 0.2s", display: "flex", flexDirection: "column", gap: 0 }}
              >
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16 }}>
                  <div style={{ fontSize: 32 }}>{emoji}</div>
                  <div style={{ background: tagColor + "20", border: `1px solid ${tagColor}40`, color: tagColor, padding: "3px 10px", borderRadius: 20, fontSize: 10, fontWeight: 700, letterSpacing: "0.06em" }}>{tag}</div>
                </div>
                <div style={{ fontSize: 16, fontWeight: 800, color: "#f1f5f9", marginBottom: 10, letterSpacing: "-0.01em" }}>{label}</div>
                <div style={{ fontSize: 13, color: "#475569", lineHeight: 1.7, marginBottom: 20, flex: 1 }}>{desc}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#10b981" }}>{cta}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section style={{ position: "relative", zIndex: 1, padding: "80px 20px", textAlign: "center", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ maxWidth: 560, margin: "0 auto" }}>
          <div style={{ fontSize: 40, marginBottom: 20, animation: "float 3s ease-in-out infinite" }}>🛡️</div>
          <h2 style={{ fontSize: 40, fontWeight: 900, letterSpacing: "-0.03em", marginBottom: 16 }}>
            <span style={{ background: "linear-gradient(135deg, #f8fafc 0%, #10b981 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Stop overpaying.
            </span>
          </h2>
          <p style={{ fontSize: 16, color: "#475569", lineHeight: 1.7, marginBottom: 36 }}>
            330 million Americans deserve to understand their medical bills. BillVeil is free because healthcare transparency should not be a luxury.
          </p>
          <button
            className="hero-cta"
            onClick={onStart}
            style={{ padding: "17px 48px", background: "linear-gradient(135deg, #10b981, #059669)", color: "#fff", border: "none", borderRadius: 12, fontSize: 17, fontWeight: 800, cursor: "pointer", fontFamily: FONT, transition: "all 0.25s", boxShadow: "0 8px 30px rgba(16,185,129,0.4)" }}
          >
            ⚡ Analyze My Bill Free
          </button>
          <div style={{ marginTop: 16, fontSize: 12, color: "#1e293b" }}>
            No signup · No credit card · Results in 30 seconds
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ position: "relative", zIndex: 1, borderTop: "1px solid rgba(255,255,255,0.04)", padding: "32px 20px", textAlign: "center" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 12 }}>
          <div style={{ width: 24, height: 24, background: "linear-gradient(135deg, #10b981, #059669)", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13 }}>🛡️</div>
          <span style={{ fontSize: 14, fontWeight: 700, color: "#334155" }}>BillVeil</span>
        </div>
        <div style={{ fontSize: 12, color: "#1e293b", lineHeight: 2 }}>
          <div>🔒 We never store your medical information</div>
          <div>Built for the 330 million Americans who deserve better</div>
        </div>
      </footer>
    </div>
  );
}
