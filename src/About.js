const FONT = "'Inter', system-ui, sans-serif";

const CSS = `
  @keyframes glow { 0%,100% { box-shadow: 0 0 20px rgba(16,185,129,0.3); } 50% { box-shadow: 0 0 40px rgba(16,185,129,0.6); } }
  .about-back:hover { color: #94a3b8 !important; }
  .about-cta:hover { transform: translateY(-2px); box-shadow: 0 12px 35px rgba(16,185,129,0.5) !important; }
`;

export default function About({ onBack, onStart }) {
  return (
    <div style={{ minHeight: "100vh", background: "#060912", fontFamily: FONT, color: "#f8fafc", overflowX: "hidden" }}>
      <style>{CSS}</style>

      <div style={{ position: "fixed", top: 0, left: "50%", transform: "translateX(-50%)", width: 800, height: 400, background: "radial-gradient(ellipse at center, rgba(16,185,129,0.1) 0%, transparent 70%)", pointerEvents: "none", zIndex: 0 }} />

      {/* Header */}
      <div style={{ position: "sticky", top: 0, zIndex: 10, backdropFilter: "blur(20px)", background: "rgba(6,9,18,0.95)", borderBottom: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 24px", height: 60 }}>
        <button className="about-back" onClick={onBack} style={{ background: "none", border: "none", color: "#64748b", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: FONT, transition: "color 0.2s" }}>
          ← Back
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 28, height: 28, background: "linear-gradient(135deg, #10b981, #059669)", borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, boxShadow: "0 0 14px rgba(16,185,129,0.4)" }}>🛡️</div>
          <div style={{ fontSize: 16, fontWeight: 800, background: "linear-gradient(135deg, #fff 30%, #10b981 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>BillVeil</div>
        </div>
        <button onClick={() => onStart("analyzer")} style={{ padding: "7px 16px", background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.3)", color: "#10b981", borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: FONT }}>
          Get Started →
        </button>
      </div>

      {/* Content */}
      <div style={{ position: "relative", zIndex: 1, maxWidth: 680, margin: "0 auto", padding: "48px 20px 80px" }}>

        {/* Mission */}
        <div style={{ marginBottom: 56 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: "#10b981", letterSpacing: "0.12em", marginBottom: 16 }}>OUR MISSION</div>
          <h1 style={{ fontSize: "clamp(26px, 6vw, 38px)", fontWeight: 900, lineHeight: 1.15, letterSpacing: "-0.03em", marginBottom: 20, color: "#f1f5f9" }}>
            Healthcare transparency<br />
            <span style={{ color: "#10b981" }}>is a right, not a luxury.</span>
          </h1>
          <p style={{ fontSize: 17, color: "#64748b", lineHeight: 1.85, marginBottom: 16 }}>
            Every year, Americans overpay <strong style={{ color: "#94a3b8" }}>$935 billion</strong> on medical bills. Hospitals charge 10x fair market rates. Insurance companies deny valid claims. And patients — buried in codes and jargon — just pay.
          </p>
          <p style={{ fontSize: 17, color: "#64748b", lineHeight: 1.85 }}>
            BillVeil exists to change that. We put the same AI tools in your hands that used to cost $300/hour from a medical billing advocate.
          </p>
        </div>

        {/* Why */}
        <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 16, padding: "28px 24px", marginBottom: 28 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: "#10b981", letterSpacing: "0.12em", marginBottom: 16 }}>WHY WE BUILT THIS</div>
          <p style={{ fontSize: 15, color: "#94a3b8", lineHeight: 1.8, marginBottom: 14 }}>
            BillVeil was built by an independent developer who got tired of watching everyday people get crushed by medical bills they didn't understand — and couldn't afford to fight.
          </p>
          <p style={{ fontSize: 15, color: "#94a3b8", lineHeight: 1.8 }}>
            Most Americans never dispute a bill. Not because it's fair — but because they don't know how, and the system is designed to make it hard. BillVeil makes it easy.
          </p>
        </div>

        {/* Tools */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: "#10b981", letterSpacing: "0.12em", marginBottom: 20 }}>WHAT WE OFFER</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              { emoji: "⚡", title: "Bill Analyzer", desc: "Paste any charge or CPT code. Get a plain-English verdict and exact dollar savings." },
              { emoji: "✉️", title: "Dispute Letter Generator", desc: "Describe your situation. We write a professional letter hospitals and insurers take seriously." },
              { emoji: "💊", title: "Drug Price Comparator", desc: "Enter any medication. Find the cheapest option and how much you could save monthly." },
              { emoji: "⚔️", title: "Denial Fighter", desc: "Insurance denied your claim? We walk you through every step to appeal and escalate." },
            ].map(({ emoji, title, desc }) => (
              <div key={title} style={{ display: "flex", gap: 16, padding: "16px 18px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12 }}>
                <div style={{ fontSize: 22, flexShrink: 0 }}>{emoji}</div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#f1f5f9", marginBottom: 4 }}>{title}</div>
                  <div style={{ fontSize: 13, color: "#64748b", lineHeight: 1.6 }}>{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Privacy */}
        <div style={{ background: "rgba(16,185,129,0.05)", border: "1px solid rgba(16,185,129,0.18)", borderRadius: 16, padding: "22px 20px", marginBottom: 48 }}>
          <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
            <div style={{ fontSize: 26, flexShrink: 0 }}>🔒</div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#f1f5f9", marginBottom: 8 }}>Your medical data stays private</div>
              <div style={{ fontSize: 13, color: "#64748b", lineHeight: 1.7 }}>
                BillVeil does not store, sell, or share any medical information you enter. Every analysis is processed and immediately discarded. No account required. No data retained. Ever.
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div style={{ textAlign: "center" }}>
          <button
            className="about-cta"
            onClick={() => onStart("analyzer")}
            style={{ padding: "16px 44px", background: "linear-gradient(135deg, #10b981, #059669)", color: "#fff", border: "none", borderRadius: 12, fontSize: 16, fontWeight: 800, cursor: "pointer", fontFamily: FONT, boxShadow: "0 8px 25px rgba(16,185,129,0.35)", transition: "all 0.25s", letterSpacing: "0.01em" }}
          >
            ⚡ Analyze My Bill — Free
          </button>
          <div style={{ marginTop: 12, fontSize: 12, color: "#334155" }}>No signup · No credit card · Results in 30 seconds</div>
        </div>
      </div>

      {/* Footer */}
      <footer style={{ position: "relative", zIndex: 1, borderTop: "1px solid rgba(255,255,255,0.04)", padding: "28px 20px", textAlign: "center" }}>
        <div style={{ fontSize: 12, color: "#1e293b", lineHeight: 2 }}>
          <div>Built for the 330 million Americans who deserve better</div>
          <div>© 2025 BillVeil · Free forever</div>
        </div>
      </footer>
    </div>
  );
}
