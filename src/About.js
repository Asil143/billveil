'use client';
import { useRouter } from "next/navigation";
const FONT = "'Inter', system-ui, sans-serif";

const CSS = `
  @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.4; } }
  .about-back:hover { color: #f1f5f9 !important; }
  .about-cta:hover { transform: translateY(-3px); box-shadow: 0 20px 60px rgba(16,185,129,0.5) !important; }
  .about-tool:hover { border-color: rgba(16,185,129,0.3) !important; background: rgba(16,185,129,0.03) !important; }
`;

export default function About() {
  const router = useRouter();
  return (
    <div style={{ minHeight: "100vh", background: "#050810", fontFamily: FONT, color: "#f1f5f9", overflowX: "hidden" }}>
      <style>{CSS}</style>

      {/* Ambient glow */}
      <div style={{ position: "fixed", top: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 900, height: 500, background: "radial-gradient(ellipse at 50% 0%, rgba(16,185,129,0.1) 0%, transparent 70%)", pointerEvents: "none", zIndex: 0 }} />

      {/* Header */}
      <div style={{ position: "sticky", top: 0, zIndex: 10, background: "rgba(5,8,16,0.85)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 28px", height: 60 }}>
        <button className="about-back" onClick={() => router.back()} style={{ background: "none", border: "none", color: "#64748b", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: FONT, transition: "color 0.2s" }}>
          ← Back
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 28, height: 28, background: "linear-gradient(135deg, #10b981, #059669)", borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, boxShadow: "0 0 14px rgba(16,185,129,0.4)" }}>🛡️</div>
          <div style={{ fontSize: 16, fontWeight: 800, color: "#f1f5f9" }}>BillVeil</div>
        </div>
        <button onClick={() => router.push("/analyzer")} style={{ padding: "7px 18px", background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.3)", color: "#10b981", borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: FONT }}>
          Get Started →
        </button>
      </div>

      {/* Content */}
      <div style={{ position: "relative", zIndex: 1, maxWidth: 680, margin: "0 auto", padding: "56px 20px 90px" }}>

        {/* Mission */}
        <div style={{ marginBottom: 60 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: "#10b981", letterSpacing: "0.14em", marginBottom: 18 }}>OUR MISSION</div>
          <h1 style={{ fontSize: "clamp(28px, 6vw, 42px)", fontWeight: 900, lineHeight: 1.1, letterSpacing: "-0.03em", marginBottom: 22, color: "#f1f5f9" }}>
            Healthcare transparency<br />
            <span style={{ color: "#10b981", textShadow: "0 0 30px rgba(16,185,129,0.3)" }}>is a right, not a luxury.</span>
          </h1>
          <p style={{ fontSize: 17, color: "#64748b", lineHeight: 1.85, marginBottom: 16 }}>
            Every year, Americans overpay <strong style={{ color: "#94a3b8" }}>$935 billion</strong> on medical bills. Hospitals charge 10x fair market rates. Insurance companies deny valid claims. And patients — buried in codes and jargon — just pay.
          </p>
          <p style={{ fontSize: 17, color: "#64748b", lineHeight: 1.85 }}>
            BillVeil exists to change that. We put the same AI tools in your hands that used to cost $300/hour from a medical billing advocate.
          </p>
        </div>

        {/* Why */}
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 18, padding: "30px 26px", marginBottom: 28 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: "#10b981", letterSpacing: "0.14em", marginBottom: 18 }}>WHY WE BUILT THIS</div>
          <p style={{ fontSize: 15, color: "#64748b", lineHeight: 1.85, marginBottom: 14 }}>
            BillVeil was built by an independent developer who got tired of watching everyday people get crushed by medical bills they didn't understand — and couldn't afford to fight.
          </p>
          <p style={{ fontSize: 15, color: "#64748b", lineHeight: 1.85 }}>
            Most Americans never dispute a bill. Not because it's fair — but because they don't know how, and the system is designed to make it hard. BillVeil makes it easy.
          </p>
        </div>

        {/* Tools */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: "#10b981", letterSpacing: "0.14em", marginBottom: 22 }}>WHAT WE OFFER</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              { emoji: "⚡", title: "Bill Analyzer", desc: "Paste any charge or CPT code. Get a plain-English verdict and exact dollar savings." },
              { emoji: "✉️", title: "Dispute Letter Generator", desc: "Describe your situation. We write a professional letter hospitals and insurers take seriously." },
              { emoji: "💊", title: "Drug Price Comparator", desc: "Enter any medication. Find the cheapest option and how much you could save monthly." },
              { emoji: "⚔️", title: "Denial Fighter", desc: "Insurance denied your claim? We walk you through every step to appeal and escalate." },
            ].map(({ emoji, title, desc }) => (
              <div key={title} className="about-tool" style={{ display: "flex", gap: 16, padding: "18px 20px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, transition: "all 0.2s" }}>
                <div style={{ fontSize: 24, flexShrink: 0 }}>{emoji}</div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#f1f5f9", marginBottom: 5 }}>{title}</div>
                  <div style={{ fontSize: 13, color: "#64748b", lineHeight: 1.7 }}>{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Privacy */}
        <div style={{ background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: 18, padding: "24px 22px", marginBottom: 52 }}>
          <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
            <div style={{ fontSize: 28, flexShrink: 0 }}>🔒</div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#f1f5f9", marginBottom: 8 }}>Your medical data stays private</div>
              <div style={{ fontSize: 13, color: "#64748b", lineHeight: 1.75 }}>
                BillVeil does not store, sell, or share any medical information you enter. Every analysis is processed and immediately discarded. No account required. No data retained. Ever.
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div style={{ textAlign: "center" }}>
          <button
            className="about-cta"
            onClick={() => router.push("/analyzer")}
            style={{ padding: "17px 50px", background: "linear-gradient(135deg, #10b981, #059669)", color: "#fff", border: "none", borderRadius: 14, fontSize: 16, fontWeight: 800, cursor: "pointer", fontFamily: FONT, boxShadow: "0 8px 32px rgba(16,185,129,0.4)", transition: "all 0.25s", letterSpacing: "0.01em" }}
          >
            ⚡ Analyze My Bill
          </button>
          <div style={{ marginTop: 14, fontSize: 12, color: "#334155" }}>No signup · No credit card · Results in 30 seconds</div>
        </div>
      </div>

      {/* Footer */}
      <footer style={{ position: "relative", zIndex: 1, borderTop: "1px solid rgba(255,255,255,0.05)", padding: "28px 20px", textAlign: "center" }}>
        <div style={{ fontSize: 12, color: "#1e293b", lineHeight: 2.2 }}>
          <div>Built for the 330 million Americans who deserve better</div>
          <div>© 2026 BillVeil</div>
        </div>
      </footer>
    </div>
  );
}
