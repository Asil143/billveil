const FONT = "'Inter', system-ui, sans-serif";

const CSS = `
  @keyframes fadeUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
  @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.4; } }
  @keyframes glow { 0%,100% { box-shadow: 0 0 20px rgba(16,185,129,0.3); } 50% { box-shadow: 0 0 40px rgba(16,185,129,0.6); } }
  @keyframes shimmer { 0% { background-position: -200% center; } 100% { background-position: 200% center; } }

  .hero-cta:hover { transform: translateY(-3px); box-shadow: 0 20px 60px rgba(16,185,129,0.5) !important; }
  .hero-cta:active { transform: translateY(-1px); }

  .ghost-cta:hover { background: rgba(255,255,255,0.08) !important; border-color: rgba(255,255,255,0.2) !important; }

  .tool-card:hover { border-color: rgba(16,185,129,0.4) !important; background: rgba(16,185,129,0.04) !important; transform: translateY(-3px); box-shadow: 0 16px 40px rgba(0,0,0,0.3) !important; }

  .feature-card:hover { border-color: rgba(16,185,129,0.3) !important; background: rgba(16,185,129,0.03) !important; }

  .faq-item { transition: border-color 0.2s; }
  .faq-item:hover { border-color: rgba(16,185,129,0.3) !important; }

  .result-card:hover { border-color: rgba(255,255,255,0.15) !important; transform: translateY(-2px); }

  .nav-btn:hover { color: #f1f5f9 !important; }

  @media (max-width: 640px) {
    .land-hero { padding: 72px 16px 56px !important; }
    .hero-h1 { font-size: 38px !important; }
    .land-hero-p { font-size: 16px !important; }
    .land-4col { grid-template-columns: repeat(2, 1fr) !important; }
    .land-4col > div { border-right: none !important; border-bottom: 1px solid rgba(255,255,255,0.06) !important; }
    .land-2col, .land-3col { grid-template-columns: 1fr !important; }
    .land-hero-btns { flex-direction: column !important; align-items: stretch !important; }
  }
`;

export default function Landing({ onStart, onAbout }) {
  return (
    <div style={{ minHeight: "100vh", background: "#050810", fontFamily: FONT, color: "#f1f5f9", overflowX: "hidden" }}>
      <style>{CSS}</style>

      {/* Ambient glow */}
      <div style={{ position: "fixed", top: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 900, height: 600, background: "radial-gradient(ellipse at 50% 0%, rgba(16,185,129,0.12) 0%, rgba(16,185,129,0.03) 50%, transparent 70%)", pointerEvents: "none", zIndex: 0 }} />

      {/* Nav */}
      <nav style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(5,8,16,0.85)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "0 28px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 60 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 30, height: 30, background: "linear-gradient(135deg, #10b981, #059669)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, boxShadow: "0 0 14px rgba(16,185,129,0.4)" }}>
            🛡️
          </div>
          <span style={{ fontSize: 17, fontWeight: 800, letterSpacing: "-0.02em", color: "#f1f5f9" }}>BillVeil</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button className="nav-btn" onClick={onAbout} style={{ padding: "6px 14px", background: "transparent", border: "none", color: "#64748b", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: FONT, transition: "color 0.2s" }}>About</button>
          <button onClick={() => onStart("analyzer")} style={{ padding: "8px 20px", background: "linear-gradient(135deg, #10b981, #059669)", border: "none", color: "#fff", borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: FONT, boxShadow: "0 4px 16px rgba(16,185,129,0.35)" }}>
            Get Started →
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="land-hero" style={{ position: "relative", zIndex: 1, textAlign: "center", padding: "110px 20px 90px", maxWidth: 820, margin: "0 auto" }}>

        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.25)", color: "#10b981", padding: "6px 18px", borderRadius: 24, fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", marginBottom: 32, animation: "fadeUp 0.6s ease both" }}>
          <span style={{ width: 6, height: 6, background: "#10b981", borderRadius: "50%", animation: "pulse 2s ease-in-out infinite" }} />
          AI-POWERED · FREE · NO SIGNUP REQUIRED
        </div>

        <h1 className="hero-h1" style={{ fontSize: "clamp(36px, 8vw, 68px)", fontWeight: 900, lineHeight: 1.05, letterSpacing: "-0.04em", marginBottom: 26, animation: "fadeUp 0.6s 0.1s ease both" }}>
          Your hospital just<br />
          <span style={{ color: "#10b981", textShadow: "0 0 40px rgba(16,185,129,0.4)" }}>overcharged you.</span><br />
          Fight back.
        </h1>

        <p className="land-hero-p" style={{ fontSize: 19, color: "#94a3b8", lineHeight: 1.75, maxWidth: 520, margin: "0 auto 40px", fontWeight: 400, animation: "fadeUp 0.6s 0.2s ease both" }}>
          BillVeil uses AI to decode your medical bills, expose overcharges, and give you the exact steps to get your money back — in 30 seconds, free.
        </p>

        <div className="land-hero-btns" style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap", animation: "fadeUp 0.6s 0.3s ease both" }}>
          <button className="hero-cta" onClick={onStart} style={{ padding: "17px 44px", background: "linear-gradient(135deg, #10b981, #059669)", color: "#fff", border: "none", borderRadius: 14, fontSize: 16, fontWeight: 800, cursor: "pointer", fontFamily: FONT, transition: "all 0.25s", boxShadow: "0 8px 32px rgba(16,185,129,0.4)", letterSpacing: "0.01em" }}>
            ⚡ Analyze My Bill — Free
          </button>
          <button className="ghost-cta" onClick={onAbout} style={{ padding: "17px 30px", background: "rgba(255,255,255,0.04)", color: "#94a3b8", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 14, fontSize: 15, fontWeight: 600, cursor: "pointer", fontFamily: FONT, transition: "all 0.2s" }}>
            How it works ↓
          </button>
        </div>

        <div style={{ marginTop: 20, fontSize: 12, color: "#334155", animation: "fadeUp 0.6s 0.4s ease both" }}>
          No signup · No credit card · Results in 30 seconds
        </div>
      </section>

      {/* Stats */}
      <section style={{ position: "relative", zIndex: 1, borderTop: "1px solid rgba(255,255,255,0.06)", borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "40px 20px", background: "rgba(255,255,255,0.02)" }}>
        <div className="land-4col" style={{ maxWidth: 800, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 0 }}>
          {[
            { stat: "$935B", label: "Americans overpay yearly" },
            { stat: "80%", label: "Of bills contain errors" },
            { stat: "10x", label: "Hospital markup rate" },
            { stat: "$0", label: "Cost to use BillVeil" },
          ].map(({ stat, label }, i) => (
            <div key={stat} style={{ textAlign: "center", padding: "16px 12px", borderRight: i < 3 ? "1px solid rgba(255,255,255,0.06)" : "none" }}>
              <div style={{ fontSize: 32, fontWeight: 900, color: "#10b981", letterSpacing: "-0.03em", marginBottom: 5, textShadow: "0 0 20px rgba(16,185,129,0.3)" }}>{stat}</div>
              <div style={{ fontSize: 12, color: "#475569", fontWeight: 600 }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Problem */}
      <section style={{ position: "relative", zIndex: 1, padding: "90px 20px", maxWidth: 820, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 52 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: "#10b981", letterSpacing: "0.14em", marginBottom: 16 }}>THE PROBLEM</div>
          <h2 style={{ fontSize: "clamp(26px, 5vw, 40px)", fontWeight: 900, letterSpacing: "-0.03em", color: "#f1f5f9", marginBottom: 14 }}>The system is rigged against you.</h2>
          <p style={{ fontSize: 15, color: "#64748b", lineHeight: 1.7, maxWidth: 500, margin: "0 auto" }}>Hospitals charge whatever they want. Insurance companies deny valid claims. Nobody explains anything.</p>
        </div>

        <div className="land-2col" style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 14 }}>
          {[
            { icon: "💸", title: "Inflated charges", desc: "Hospitals charge 10x the actual cost. A $15 aspirin becomes $150. A $200 test becomes $4,000." },
            { icon: "🤯", title: "Confusing codes", desc: "CPT codes, ICD codes, modifiers. Medical bills are designed to be unreadable so you give up." },
            { icon: "🚫", title: "Denied claims", desc: "Insurance companies deny 1 in 7 claims. Most patients never appeal — they just pay." },
            { icon: "😰", title: "No one to turn to", desc: "Medical billing advocates cost $300/hour. Most Americans can't afford to fight back." },
          ].map(({ icon, title, desc }) => (
            <div key={title} style={{ background: "rgba(239,68,68,0.04)", border: "1px solid rgba(239,68,68,0.15)", borderRadius: 16, padding: "24px 20px" }}>
              <div style={{ fontSize: 26, marginBottom: 12 }}>{icon}</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#f1f5f9", marginBottom: 8 }}>{title}</div>
              <div style={{ fontSize: 13, color: "#64748b", lineHeight: 1.75 }}>{desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section style={{ position: "relative", zIndex: 1, borderTop: "1px solid rgba(255,255,255,0.06)", borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "90px 20px", background: "rgba(16,185,129,0.02)" }}>
        <div style={{ maxWidth: 820, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: "#10b981", letterSpacing: "0.14em", marginBottom: 16 }}>HOW IT WORKS</div>
            <h2 style={{ fontSize: "clamp(26px, 5vw, 40px)", fontWeight: 900, letterSpacing: "-0.03em", color: "#f1f5f9" }}>BillVeil is your AI advocate.</h2>
          </div>

          <div className="land-3col" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
            {[
              { step: "01", icon: "📋", title: "Paste your bill", desc: "Any CPT code, charge, or full bill. No formatting needed. Takes 5 seconds." },
              { step: "02", icon: "🤖", title: "AI analyzes it", desc: "We cross-reference fair market rates and spot every overcharge instantly." },
              { step: "03", icon: "⚡", title: "Fight back", desc: "Get a verdict, exact dollar savings, and a step-by-step action plan." },
            ].map(({ step, icon, title, desc }) => (
              <div key={step} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: 16, padding: "30px 22px", textAlign: "center" }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#10b981", letterSpacing: "0.1em", marginBottom: 16 }}>{step}</div>
                <div style={{ fontSize: 32, marginBottom: 14 }}>{icon}</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#f1f5f9", marginBottom: 8 }}>{title}</div>
                <div style={{ fontSize: 13, color: "#64748b", lineHeight: 1.75 }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{ position: "relative", zIndex: 1, padding: "90px 20px", maxWidth: 820, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 52 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: "#10b981", letterSpacing: "0.14em", marginBottom: 16 }}>WHAT YOU GET</div>
          <h2 style={{ fontSize: "clamp(26px, 5vw, 40px)", fontWeight: 900, letterSpacing: "-0.03em", color: "#f1f5f9" }}>Everything in one place.</h2>
        </div>

        <div className="land-2col" style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
          {[
            { icon: "🔍", title: "Plain English explanation", desc: "We decode every code and charge so you know exactly what you paid for." },
            { icon: "💰", title: "Fair price benchmark", desc: "See what the same service costs at fair market rates, not hospital rack rates." },
            { icon: "⚖️", title: "Overcharge verdict", desc: "FAIR PRICE, POSSIBLY OVERCHARGED, or SIGNIFICANTLY OVERCHARGED. No ambiguity." },
            { icon: "📋", title: "Action plan", desc: "3 specific steps to dispute, negotiate, or appeal. Exactly what to say." },
            { icon: "💵", title: "Savings estimate", desc: "We calculate exactly how much money you could recover if you take action." },
            { icon: "🔒", title: "100% private", desc: "We never store your medical data. Every analysis is deleted immediately." },
          ].map(({ icon, title, desc }) => (
            <div key={title} className="feature-card" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "20px", display: "flex", gap: 14, transition: "all 0.2s" }}>
              <div style={{ fontSize: 24, flexShrink: 0, marginTop: 2 }}>{icon}</div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#f1f5f9", marginBottom: 5 }}>{title}</div>
                <div style={{ fontSize: 13, color: "#64748b", lineHeight: 1.75 }}>{desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Tools */}
      <section style={{ position: "relative", zIndex: 1, borderTop: "1px solid rgba(255,255,255,0.06)", borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "90px 20px", background: "rgba(255,255,255,0.015)" }}>
        <div style={{ maxWidth: 820, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: "#10b981", letterSpacing: "0.14em", marginBottom: 16 }}>YOUR TOOLKIT</div>
            <h2 style={{ fontSize: "clamp(26px, 5vw, 40px)", fontWeight: 900, letterSpacing: "-0.03em", color: "#f1f5f9" }}>Four tools. One mission.</h2>
          </div>

          <div className="land-2col" style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
            {[
              { tab: "analyzer", emoji: "⚡", label: "Bill Analyzer", tag: "Most Popular", tagColor: "#10b981", desc: "Paste any CPT code or charge. Get a plain-English explanation, fair price comparison, overcharge verdict, and exact action steps.", cta: "Analyze a Bill →" },
              { tab: "dispute", emoji: "✉️", label: "Dispute Letter", tag: "Save Money", tagColor: "#3b82f6", desc: "Describe what you were charged. We write a professional, ready-to-send dispute letter that hospitals and insurers take seriously.", cta: "Write a Letter →" },
              { tab: "drug", emoji: "💊", label: "Drug Price Comparator", tag: "Cut Costs", tagColor: "#8b5cf6", desc: "Enter any medication. We show the fair price, Cost Plus Drugs rate, cheapest alternatives, and how much you could save monthly.", cta: "Compare Prices →" },
              { tab: "denial", emoji: "⚔️", label: "Denial Fighter", tag: "Fight Back", tagColor: "#ef4444", desc: "Insurance denied your claim? We analyze the denial, write your appeal letter, and walk you through every escalation step.", cta: "Fight a Denial →" },
            ].map(({ tab, emoji, label, tag, tagColor, desc, cta }) => (
              <div key={tab} className="tool-card" onClick={() => onStart(tab)} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 18, padding: "26px 24px", cursor: "pointer", transition: "all 0.25s", boxShadow: "0 4px 20px rgba(0,0,0,0.2)" }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16 }}>
                  <div style={{ fontSize: 32 }}>{emoji}</div>
                  <div style={{ background: tagColor + "18", border: `1px solid ${tagColor}35`, color: tagColor, padding: "3px 10px", borderRadius: 20, fontSize: 10, fontWeight: 700, letterSpacing: "0.06em" }}>{tag}</div>
                </div>
                <div style={{ fontSize: 16, fontWeight: 800, color: "#f1f5f9", marginBottom: 10 }}>{label}</div>
                <div style={{ fontSize: 13, color: "#64748b", lineHeight: 1.75, marginBottom: 18 }}>{desc}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#10b981" }}>{cta}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Real Results */}
      <section style={{ position: "relative", zIndex: 1, padding: "90px 20px", maxWidth: 820, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 52 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: "#10b981", letterSpacing: "0.14em", marginBottom: 16 }}>REAL RESULTS</div>
          <h2 style={{ fontSize: "clamp(26px, 5vw, 40px)", fontWeight: 900, letterSpacing: "-0.03em", color: "#f1f5f9", marginBottom: 10 }}>What BillVeil finds.</h2>
          <p style={{ fontSize: 14, color: "#475569" }}>Example analyses from real medical bills.</p>
        </div>

        <div className="land-3col" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
          {[
            { charge: "ER Visit — $4,200", verdict: "SIGNIFICANTLY OVERCHARGED", finding: "Medicare rate: $420. Hospital charged 10x. Itemized bill showed 3 duplicate charges.", saved: "Could recover $2,800–$3,600" },
            { charge: "MRI Brain — $3,800", verdict: "SIGNIFICANTLY OVERCHARGED", finding: "Fair market rate: $320–$500. Facility used a 12x markup. No Surprises Act applies.", saved: "Could recover $3,000+" },
            { charge: "Lisinopril 10mg — $89/mo", verdict: "SIGNIFICANTLY OVERCHARGED", finding: "GoodRx generic: $4/mo. Cost Plus Drugs: $3/mo. Zero reason to pay $89.", saved: "Save $85/month = $1,020/year" },
          ].map(({ charge, verdict, finding, saved }) => (
            <div key={charge} className="result-card" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: "22px 18px", transition: "all 0.2s" }}>
              <div style={{ fontSize: 12, color: "#64748b", fontWeight: 600, marginBottom: 12 }}>{charge}</div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", color: "#f87171", padding: "4px 12px", borderRadius: 20, fontSize: 10, fontWeight: 800, letterSpacing: "0.06em", marginBottom: 14 }}>
                <span style={{ width: 5, height: 5, background: "#ef4444", borderRadius: "50%" }} />
                {verdict}
              </div>
              <div style={{ fontSize: 13, color: "#64748b", lineHeight: 1.75, marginBottom: 12 }}>{finding}</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#10b981" }}>✓ {saved}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section style={{ position: "relative", zIndex: 1, borderTop: "1px solid rgba(255,255,255,0.06)", padding: "90px 20px", background: "rgba(255,255,255,0.015)" }}>
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: "#10b981", letterSpacing: "0.14em", marginBottom: 16 }}>FAQ</div>
            <h2 style={{ fontSize: "clamp(26px, 5vw, 40px)", fontWeight: 900, letterSpacing: "-0.03em", color: "#f1f5f9" }}>Common questions.</h2>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              { q: "Is BillVeil really free?", a: "Yes, completely. No credit card, no signup, no hidden fees. We built this because healthcare transparency shouldn't cost money. If we help you, we accept optional tips — but they're never required." },
              { q: "Is my medical information safe?", a: "We never store, log, or share what you enter. Every analysis is processed and immediately discarded. There is no account, no database, and no way for your data to be sold or breached." },
              { q: "How accurate are the results?", a: "Our AI is trained on Medicare allowable rates, fair market pricing data, and billing guidelines. It gives accurate benchmarks for most common charges. Use the results as a starting point for your negotiation." },
              { q: "Can I actually negotiate a medical bill?", a: "Yes — over 60% of patients who negotiate their medical bills get a reduction. Hospitals have a chargemaster rate and a negotiated rate. You can almost always pay less than the original bill." },
              { q: "What if my insurance company ignores my appeal?", a: "Under the ACA and ERISA, insurers must respond within 30–60 days. If denied again, you have the right to a free external review by an Independent Review Organization. 73% of externally reviewed denials are overturned." },
            ].map(({ q, a }) => (
              <div key={q} className="faq-item" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "22px 24px" }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#f1f5f9", marginBottom: 10 }}>{q}</div>
                <div style={{ fontSize: 13, color: "#64748b", lineHeight: 1.85 }}>{a}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section style={{ position: "relative", zIndex: 1, padding: "100px 20px", textAlign: "center", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: 600, height: 400, background: "radial-gradient(ellipse at center, rgba(16,185,129,0.1) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "relative", maxWidth: 520, margin: "0 auto" }}>
          <div style={{ fontSize: 48, marginBottom: 24, animation: "float 3s ease-in-out infinite" }}>🛡️</div>
          <h2 style={{ fontSize: "clamp(32px, 7vw, 52px)", fontWeight: 900, letterSpacing: "-0.04em", color: "#f1f5f9", marginBottom: 16, lineHeight: 1.1 }}>
            Stop overpaying.<br />
            <span style={{ color: "#10b981" }}>Start fighting back.</span>
          </h2>
          <p style={{ fontSize: 15, color: "#64748b", lineHeight: 1.75, marginBottom: 36 }}>
            330 million Americans deserve to understand their medical bills. BillVeil is free because healthcare transparency should not be a luxury.
          </p>
          <button className="hero-cta" onClick={onStart} style={{ padding: "18px 52px", background: "linear-gradient(135deg, #10b981, #059669)", color: "#fff", border: "none", borderRadius: 14, fontSize: 17, fontWeight: 800, cursor: "pointer", fontFamily: FONT, transition: "all 0.25s", boxShadow: "0 10px 40px rgba(16,185,129,0.4)", letterSpacing: "0.01em" }}>
            ⚡ Analyze My Bill — Free
          </button>
          <div style={{ marginTop: 16, fontSize: 12, color: "#334155" }}>No signup · No credit card · Results in 30 seconds</div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ position: "relative", zIndex: 1, borderTop: "1px solid rgba(255,255,255,0.05)", padding: "32px 20px", textAlign: "center" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 12 }}>
          <div style={{ width: 22, height: 22, background: "linear-gradient(135deg, #10b981, #059669)", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12 }}>🛡️</div>
          <span style={{ fontSize: 13, fontWeight: 700, color: "#f1f5f9" }}>BillVeil</span>
        </div>
        <div style={{ fontSize: 12, color: "#1e293b", lineHeight: 2.2 }}>
          <div>🔒 We never store your medical information</div>
          <div>Built for the 330 million Americans who deserve better · © 2025 BillVeil · Free forever</div>
        </div>
      </footer>
    </div>
  );
}
