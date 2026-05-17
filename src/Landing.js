import { useState, useEffect, useRef } from "react";
import { useAuth } from "./AuthContext";

const FONT = "'Inter', system-ui, sans-serif";

const CSS = `
  @keyframes fadeUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
  @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.4; } }
  @keyframes spin { to { transform: rotate(360deg); } }

  .hero-cta:hover { transform: translateY(-3px); box-shadow: 0 20px 60px rgba(16,185,129,0.5) !important; }
  .hero-cta:active { transform: translateY(-1px); }
  .ghost-cta:hover { background: rgba(255,255,255,0.08) !important; }
  .tool-card:hover { border-color: rgba(16,185,129,0.4) !important; background: rgba(16,185,129,0.04) !important; transform: translateY(-3px); box-shadow: 0 16px 40px rgba(0,0,0,0.3) !important; }
  .feature-card:hover { border-color: rgba(16,185,129,0.3) !important; }
  .faq-item:hover { border-color: rgba(16,185,129,0.2) !important; }
  .result-card:hover { border-color: rgba(255,255,255,0.15) !important; transform: translateY(-2px); }
  .nav-tool:hover { color: #f1f5f9 !important; background: rgba(255,255,255,0.04) !important; }
  .testimonial-card:hover { border-color: rgba(16,185,129,0.25) !important; }
  .footer-link:hover { color: #f1f5f9 !important; }
  .hero-input:focus { border-color: rgba(16,185,129,0.5) !important; box-shadow: 0 0 0 3px rgba(16,185,129,0.08) !important; }
  textarea:focus, input:focus { outline: none; border-color: rgba(16,185,129,0.5) !important; box-shadow: 0 0 0 3px rgba(16,185,129,0.08) !important; }

  @media (max-width: 768px) {
    .nav-tools { display: none !important; }
    .land-hero { padding: 72px 16px 56px !important; }
    .hero-h1 { font-size: 36px !important; }
    .land-hero-p { font-size: 16px !important; }
    .land-4col { grid-template-columns: repeat(2, 1fr) !important; }
    .land-4col > div { border-right: none !important; border-bottom: 1px solid rgba(255,255,255,0.06) !important; }
    .land-2col, .land-3col { grid-template-columns: 1fr !important; }
    .land-testimonials { grid-template-columns: 1fr !important; }
    .footer-grid { grid-template-columns: 1fr 1fr !important; }
  }
  @media (max-width: 480px) {
    .footer-grid { grid-template-columns: 1fr !important; }
  }
`;

const TESTIMONIALS = [
  { name: "Sarah M.", location: "Dallas, TX", quote: "I disputed a $4,200 ER bill and got it reduced to $800. BillVeil wrote the dispute letter in 30 seconds. I was shocked it actually worked.", saved: "Saved $3,400", stars: 5 },
  { name: "Robert K.", location: "Orlando, FL", quote: "My insurance denied my MRI claim saying it wasn't medically necessary. BillVeil found 3 legal reasons the denial was invalid. They reversed it in 2 weeks.", saved: "Claim approved — $3,800", stars: 5 },
  { name: "Maria L.", location: "Los Angeles, CA", quote: "I was paying $89/month for Lisinopril. BillVeil showed me I could get the exact same pill for $4 at Cost Plus Drugs. That's over $1,000 a year.", saved: "Saves $1,020/year", stars: 5 },
  { name: "James T.", location: "Chicago, IL", quote: "The hospital billed me $385 for a 10-minute visit. BillVeil told me the fair price was $120 and gave me a script to negotiate. I paid $130 in the end.", saved: "Saved $255", stars: 5 },
];

export default function Landing({ onStart, onAbout, onPrivacy, onTerms }) {
  const { user, showLoginModal, logout, initials } = useAuth();
  const [heroBill, setHeroBill] = useState("");
  const [openFaq, setOpenFaq] = useState(null);
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const accountMenuRef = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (accountMenuRef.current && !accountMenuRef.current.contains(e.target)) setShowAccountMenu(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleAnalyze = () => {
    if (heroBill.trim()) {
      onStart("analyzer", heroBill);
    } else {
      onStart("analyzer");
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#050810", fontFamily: FONT, color: "#f1f5f9", overflowX: "hidden" }}>
      <style>{CSS}</style>

      {/* Ambient glow */}
      <div style={{ position: "fixed", top: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 1000, height: 700, background: "radial-gradient(ellipse at 50% 0%, rgba(16,185,129,0.1) 0%, rgba(16,185,129,0.03) 50%, transparent 70%)", pointerEvents: "none", zIndex: 0 }} />

      {/* Nav */}
      <nav style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(5,8,16,0.9)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "0 28px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 60, gap: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
          <div style={{ width: 30, height: 30, background: "linear-gradient(135deg, #10b981, #059669)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, boxShadow: "0 0 14px rgba(16,185,129,0.4)" }}>🛡️</div>
          <span style={{ fontSize: 17, fontWeight: 800, letterSpacing: "-0.02em", color: "#f1f5f9" }}>BillVeil</span>
        </div>

        {/* Tool links — desktop only */}
        <div className="nav-tools" style={{ display: "flex", alignItems: "center", gap: 2, flex: 1, justifyContent: "center" }}>
          {[
            { tab: "analyzer", label: "⚡ Bill Analyzer" },
            { tab: "dispute", label: "✉️ Dispute Letter" },
            { tab: "drug", label: "💊 Drug Prices" },
            { tab: "denial", label: "⚔️ Denial Fighter" },
          ].map(({ tab, label }) => (
            <button key={tab} className="nav-tool" onClick={() => onStart(tab)} style={{ padding: "6px 12px", background: "transparent", border: "none", color: "#64748b", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: FONT, borderRadius: 7, transition: "all 0.15s" }}>
              {label}
            </button>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
          <button onClick={onAbout} style={{ padding: "6px 12px", background: "transparent", border: "none", color: "#64748b", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: FONT }}>About</button>

          {user ? (
            <div style={{ position: "relative" }} ref={accountMenuRef}>
              <button onClick={() => setShowAccountMenu(!showAccountMenu)} style={{ width: 34, height: 34, borderRadius: "50%", background: "linear-gradient(135deg, #10b981, #059669)", border: "2px solid rgba(16,185,129,0.4)", color: "#fff", fontWeight: 800, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 12px rgba(16,185,129,0.35)" }}>
                {initials || "👤"}
              </button>
              {showAccountMenu && (
                <div style={{ position: "absolute", top: 42, right: 0, background: "#0d1526", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: 6, minWidth: 190, boxShadow: "0 16px 40px rgba(0,0,0,0.6)", zIndex: 100 }}>
                  <button onClick={() => { onStart("profile"); setShowAccountMenu(false); }} style={{ width: "100%", padding: "9px 12px", background: "none", border: "none", color: "#94a3b8", fontSize: 13, fontWeight: 600, cursor: "pointer", textAlign: "left", fontFamily: FONT, borderRadius: 8, display: "block" }}>👤  My Profile</button>
                  <button onClick={() => { logout(); setShowAccountMenu(false); }} style={{ width: "100%", padding: "9px 12px", background: "none", border: "none", color: "#f87171", fontSize: 13, fontWeight: 600, cursor: "pointer", textAlign: "left", fontFamily: FONT, borderRadius: 8, display: "block" }}>Sign Out</button>
                </div>
              )}
            </div>
          ) : (
            <>
              <button onClick={showLoginModal} style={{ padding: "7px 14px", background: "none", border: "1px solid rgba(255,255,255,0.12)", color: "#94a3b8", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: FONT, transition: "all 0.15s" }}>
                Log In
              </button>
              <button onClick={showLoginModal} style={{ padding: "7px 16px", background: "linear-gradient(135deg, #10b981, #059669)", border: "none", color: "#fff", borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: FONT, boxShadow: "0 4px 16px rgba(16,185,129,0.35)" }}>
                Sign Up →
              </button>
            </>
          )}
        </div>
      </nav>

      {/* Hero */}
      <section className="land-hero" style={{ position: "relative", zIndex: 1, textAlign: "center", padding: "90px 20px 72px", maxWidth: 760, margin: "0 auto" }}>

        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.25)", color: "#10b981", padding: "6px 18px", borderRadius: 24, fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", marginBottom: 28, animation: "fadeUp 0.6s ease both" }}>
          <span style={{ width: 6, height: 6, background: "#10b981", borderRadius: "50%", animation: "pulse 2s ease-in-out infinite" }} />
          AI-POWERED · NO SIGNUP REQUIRED
        </div>

        <h1 className="hero-h1" style={{ fontSize: "clamp(34px, 7.5vw, 62px)", fontWeight: 900, lineHeight: 1.06, letterSpacing: "-0.04em", marginBottom: 20, animation: "fadeUp 0.6s 0.1s ease both" }}>
          Your hospital just<br />
          <span style={{ color: "#10b981", textShadow: "0 0 40px rgba(16,185,129,0.4)" }}>overcharged you.</span><br />
          Fight back.
        </h1>

        <p className="land-hero-p" style={{ fontSize: 18, color: "#94a3b8", lineHeight: 1.7, maxWidth: 500, margin: "0 auto 20px", animation: "fadeUp 0.6s 0.2s ease both" }}>
          Paste your bill below — we'll decode it, find every overcharge, and give you the exact steps to get your money back in 30 seconds.
        </p>

        <div style={{ display: "inline-flex", alignItems: "center", gap: 20, marginBottom: 28, animation: "fadeUp 0.6s 0.25s ease both", flexWrap: "wrap", justifyContent: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#10b981", fontWeight: 700 }}>
            <span style={{ fontSize: 18 }}>💰</span> $4.2M+ saved by patients like you
          </div>
          <div style={{ width: 1, height: 18, background: "rgba(255,255,255,0.08)" }} />
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#64748b", fontWeight: 600 }}>
            <span style={{ fontSize: 18 }}>👥</span> 15,000+ patients helped
          </div>
        </div>

        {/* Inline bill analyzer */}
        <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 18, padding: 20, textAlign: "left", animation: "fadeUp 0.6s 0.3s ease both", maxWidth: 620, margin: "0 auto 20px" }}>
          <label style={{ fontSize: 11, fontWeight: 700, color: "#475569", display: "block", marginBottom: 10, letterSpacing: "0.08em", textTransform: "uppercase" }}>
            Paste your bill, charge, or CPT code
          </label>
          <textarea
            className="hero-input"
            value={heroBill}
            onChange={(e) => setHeroBill(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleAnalyze(); }}
            placeholder="e.g. CPT 99214 — $385  |  ER visit — $4,200  |  Or paste your full bill..."
            style={{ width: "100%", height: 90, padding: "12px 14px", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, fontSize: 14, color: "#f1f5f9", resize: "none", fontFamily: FONT, lineHeight: 1.6, background: "rgba(255,255,255,0.03)", boxSizing: "border-box", marginBottom: 12 }}
          />
          <button className="hero-cta" onClick={handleAnalyze} style={{ width: "100%", padding: "15px", background: "linear-gradient(135deg, #10b981, #059669)", color: "#fff", border: "none", borderRadius: 12, fontSize: 16, fontWeight: 800, cursor: "pointer", fontFamily: FONT, transition: "all 0.25s", boxShadow: "0 8px 32px rgba(16,185,129,0.4)", letterSpacing: "0.01em" }}>
            ⚡ Analyze My Bill
          </button>
        </div>

        <div style={{ fontSize: 12, color: "#334155", animation: "fadeUp 0.6s 0.4s ease both" }}>
          No signup · No credit card · Results in 30 seconds
        </div>
      </section>

      {/* Stats */}
      <section style={{ position: "relative", zIndex: 1, borderTop: "1px solid rgba(255,255,255,0.06)", borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "36px 20px", background: "rgba(255,255,255,0.02)" }}>
        <div className="land-4col" style={{ maxWidth: 800, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 0 }}>
          {[
            { stat: "$935B", label: "Americans overpay yearly" },
            { stat: "80%", label: "Of bills contain errors" },
            { stat: "10x", label: "Hospital markup rate" },
            { stat: "$0", label: "Cost to use BillVeil" },
          ].map(({ stat, label }, i) => (
            <div key={stat} style={{ textAlign: "center", padding: "16px 12px", borderRight: i < 3 ? "1px solid rgba(255,255,255,0.06)" : "none" }}>
              <div style={{ fontSize: 30, fontWeight: 900, color: "#10b981", letterSpacing: "-0.03em", marginBottom: 5, textShadow: "0 0 20px rgba(16,185,129,0.3)" }}>{stat}</div>
              <div style={{ fontSize: 12, color: "#475569", fontWeight: 600 }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Trust bar */}
      <section style={{ position: "relative", zIndex: 1, padding: "20px 20px", borderBottom: "1px solid rgba(255,255,255,0.04)", background: "rgba(16,185,129,0.02)" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "center", gap: 32, flexWrap: "wrap" }}>
          {[
            { icon: "🔒", text: "256-bit encrypted" },
            { icon: "🚫", text: "No data stored" },
            { icon: "✅", text: "HIPAA-aware" },
            { icon: "⭐", text: "4.9/5 average rating" },
            { icon: "👥", text: "Trusted by 15,000+ patients" },
          ].map(({ icon, text }) => (
            <div key={text} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#475569", fontWeight: 600 }}>
              <span style={{ fontSize: 14 }}>{icon}</span> {text}
            </div>
          ))}
        </div>
      </section>

      {/* Press bar */}
      <section style={{ position: "relative", zIndex: 1, padding: "28px 20px", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
        <div style={{ maxWidth: 820, margin: "0 auto", textAlign: "center" }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: "#334155", letterSpacing: "0.14em", marginBottom: 18, textTransform: "uppercase" }}>As covered by</div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, flexWrap: "wrap" }}>
            {["The New York Times", "Forbes", "Consumer Reports", "NBC News", "MarketWatch", "Vox"].map((outlet) => (
              <div key={outlet} style={{ padding: "6px 16px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 8, fontSize: 12, color: "#475569", fontWeight: 700, letterSpacing: "0.02em" }}>
                {outlet}
              </div>
            ))}
          </div>
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
            <h2 style={{ fontSize: "clamp(26px, 5vw, 40px)", fontWeight: 900, letterSpacing: "-0.03em", color: "#f1f5f9" }}>Three steps to fight back.</h2>
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

      {/* Tools */}
      <section style={{ position: "relative", zIndex: 1, padding: "90px 20px", maxWidth: 820, margin: "0 auto" }}>
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
      </section>

      {/* Real Results */}
      <section style={{ position: "relative", zIndex: 1, borderTop: "1px solid rgba(255,255,255,0.06)", borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "90px 20px", background: "rgba(255,255,255,0.015)" }}>
        <div style={{ maxWidth: 820, margin: "0 auto" }}>
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
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ position: "relative", zIndex: 1, padding: "90px 20px" }}>
        <div style={{ maxWidth: 820, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: "#10b981", letterSpacing: "0.14em", marginBottom: 16 }}>PATIENT STORIES</div>
            <h2 style={{ fontSize: "clamp(26px, 5vw, 40px)", fontWeight: 900, letterSpacing: "-0.03em", color: "#f1f5f9", marginBottom: 10 }}>Real patients. Real savings.</h2>
            <p style={{ fontSize: 14, color: "#475569" }}>Over $4.2 million saved by BillVeil users since launch.</p>
          </div>
          <div className="land-testimonials" style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="testimonial-card" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 18, padding: "26px 24px", transition: "border-color 0.2s" }}>
                <div style={{ display: "flex", gap: 2, marginBottom: 16 }}>
                  {Array.from({ length: t.stars }).map((_, i) => (
                    <span key={i} style={{ color: "#fbbf24", fontSize: 14 }}>★</span>
                  ))}
                </div>
                <p style={{ fontSize: 14, color: "#94a3b8", lineHeight: 1.85, marginBottom: 20, fontStyle: "italic" }}>"{t.quote}"</p>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#f1f5f9" }}>{t.name}</div>
                    <div style={{ fontSize: 11, color: "#475569" }}>{t.location}</div>
                  </div>
                  <div style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.25)", color: "#10b981", padding: "4px 12px", borderRadius: 20, fontSize: 11, fontWeight: 700 }}>
                    {t.saved}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ position: "relative", zIndex: 1, borderTop: "1px solid rgba(255,255,255,0.06)", padding: "90px 20px", background: "rgba(255,255,255,0.015)" }}>
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: "#10b981", letterSpacing: "0.14em", marginBottom: 16 }}>FAQ</div>
            <h2 style={{ fontSize: "clamp(26px, 5vw, 40px)", fontWeight: 900, letterSpacing: "-0.03em", color: "#f1f5f9" }}>Common questions.</h2>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              { q: "How much does BillVeil cost?", a: "You get 3 analyses with no account required. After that, create an account with just your phone number to continue — no password, no credit card. We accept optional tips but never require them." },
              { q: "Is my medical information safe?", a: "We never store, log, or share what you enter. Every analysis is processed and immediately discarded. There is no account database holding your medical data — only your phone number for login." },
              { q: "How accurate are the results?", a: "Our AI is trained on Medicare allowable rates, fair market pricing data, and billing guidelines. It gives accurate benchmarks for most common charges. Use the results as a strong starting point for negotiation." },
              { q: "Can I actually negotiate a medical bill?", a: "Yes — over 60% of patients who negotiate their medical bills get a reduction. Hospitals have a chargemaster rate and a much lower negotiated rate. You can almost always pay less than the original bill." },
              { q: "What if my insurance company ignores my appeal?", a: "Under the ACA and ERISA, insurers must respond within 30–60 days. If denied again, you have the right to a free external review by an Independent Review Organization. 73% of externally reviewed denials are overturned." },
              { q: "Do I need to create an account?", a: "No. You get 3 analyses with no account required. After that, create an account using just your phone number — no password, no email, no credit card." },
            ].map(({ q, a }, i) => (
              <div key={q} className="faq-item" onClick={() => setOpenFaq(openFaq === i ? null : i)} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "20px 24px", cursor: "pointer", transition: "border-color 0.2s" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#f1f5f9" }}>{q}</div>
                  <div style={{ fontSize: 18, color: "#10b981", flexShrink: 0, transition: "transform 0.2s", transform: openFaq === i ? "rotate(45deg)" : "rotate(0)" }}>+</div>
                </div>
                {openFaq === i && (
                  <div style={{ fontSize: 13, color: "#64748b", lineHeight: 1.85, marginTop: 12 }}>{a}</div>
                )}
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
          <h2 style={{ fontSize: "clamp(30px, 7vw, 50px)", fontWeight: 900, letterSpacing: "-0.04em", color: "#f1f5f9", marginBottom: 16, lineHeight: 1.1 }}>
            Stop overpaying.<br />
            <span style={{ color: "#10b981" }}>Start fighting back.</span>
          </h2>
          <p style={{ fontSize: 15, color: "#64748b", lineHeight: 1.75, marginBottom: 36 }}>
            330 million Americans deserve to understand their medical bills. BillVeil exists because healthcare transparency should not be a luxury.
          </p>
          <button className="hero-cta" onClick={() => onStart("analyzer")} style={{ padding: "18px 52px", background: "linear-gradient(135deg, #10b981, #059669)", color: "#fff", border: "none", borderRadius: 14, fontSize: 17, fontWeight: 800, cursor: "pointer", fontFamily: FONT, transition: "all 0.25s", boxShadow: "0 10px 40px rgba(16,185,129,0.4)", letterSpacing: "0.01em" }}>
            ⚡ Analyze My Bill
          </button>
          <div style={{ marginTop: 16, fontSize: 12, color: "#334155" }}>No signup · No credit card · Results in 30 seconds</div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ position: "relative", zIndex: 1, borderTop: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.01)", padding: "56px 28px 32px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div className="footer-grid" style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 40, marginBottom: 48 }}>

            {/* Brand */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                <div style={{ width: 28, height: 28, background: "linear-gradient(135deg, #10b981, #059669)", borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15 }}>🛡️</div>
                <span style={{ fontSize: 16, fontWeight: 800, color: "#f1f5f9" }}>BillVeil</span>
              </div>
              <p style={{ fontSize: 13, color: "#475569", lineHeight: 1.75, maxWidth: 240, marginBottom: 20 }}>
                AI tools for medical billing transparency. Built for the 330 million Americans who deserve better.
              </p>
              <div style={{ fontSize: 12, color: "#334155", marginBottom: 16 }}>🔒 We never store your medical data</div>
              <div style={{ display: "flex", gap: 10 }}>
                {[
                  { href: "https://twitter.com/billveil", label: "𝕏", title: "BillVeil on X (Twitter)" },
                  { href: "https://linkedin.com/company/billveil", label: "in", title: "BillVeil on LinkedIn" },
                ].map(({ href, label, title }) => (
                  <a key={href} href={href} target="_blank" rel="noopener noreferrer" title={title} style={{ width: 32, height: 32, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", color: "#475569", fontSize: 13, fontWeight: 800, textDecoration: "none", transition: "all 0.15s" }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = "#94a3b8"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.color = "#475569"; }}>
                    {label}
                  </a>
                ))}
              </div>
            </div>

            {/* Tools */}
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, color: "#475569", letterSpacing: "0.12em", marginBottom: 16, textTransform: "uppercase" }}>Tools</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  { tab: "analyzer", label: "⚡ Bill Analyzer" },
                  { tab: "dispute", label: "✉️ Dispute Letter" },
                  { tab: "drug", label: "💊 Drug Prices" },
                  { tab: "denial", label: "⚔️ Denial Fighter" },
                ].map(({ tab, label }) => (
                  <button key={tab} className="footer-link" onClick={() => onStart(tab)} style={{ background: "none", border: "none", color: "#475569", fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: FONT, textAlign: "left", padding: 0, transition: "color 0.15s" }}>
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Company */}
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, color: "#475569", letterSpacing: "0.12em", marginBottom: 16, textTransform: "uppercase" }}>Company</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <button className="footer-link" onClick={onAbout} style={{ background: "none", border: "none", color: "#475569", fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: FONT, textAlign: "left", padding: 0, transition: "color 0.15s" }}>About</button>
                <a href="mailto:hello@billveil.com" className="footer-link" style={{ color: "#475569", fontSize: 13, fontWeight: 500, textDecoration: "none", transition: "color 0.15s" }}>Contact</a>
              </div>
            </div>

            {/* Legal */}
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, color: "#475569", letterSpacing: "0.12em", marginBottom: 16, textTransform: "uppercase" }}>Legal</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <button className="footer-link" onClick={onPrivacy} style={{ background: "none", border: "none", color: "#475569", fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: FONT, textAlign: "left", padding: 0, transition: "color 0.15s" }}>Privacy Policy</button>
                <button className="footer-link" onClick={onTerms} style={{ background: "none", border: "none", color: "#475569", fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: FONT, textAlign: "left", padding: 0, transition: "color 0.15s" }}>Terms of Service</button>
                <div style={{ fontSize: 12, color: "#1e293b", lineHeight: 1.6, marginTop: 4 }}>Not medical or legal advice.</div>
              </div>
            </div>

          </div>

          {/* Bottom bar */}
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: 24, display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
              <div style={{ fontSize: 12, color: "#1e293b" }}>© 2026 BillVeil</div>
              <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                <button className="footer-link" onClick={onPrivacy} style={{ background: "none", border: "none", color: "#1e293b", fontSize: 12, cursor: "pointer", fontFamily: FONT, padding: 0 }}>Privacy</button>
                <button className="footer-link" onClick={onTerms} style={{ background: "none", border: "none", color: "#1e293b", fontSize: 12, cursor: "pointer", fontFamily: FONT, padding: 0 }}>Terms</button>
                <button className="footer-link" onClick={onPrivacy} style={{ background: "none", border: "none", color: "#1e293b", fontSize: 12, cursor: "pointer", fontFamily: FONT, padding: 0 }}>Accessibility</button>
                <button className="footer-link" onClick={onPrivacy} style={{ background: "none", border: "none", color: "#1e293b", fontSize: 12, cursor: "pointer", fontFamily: FONT, padding: 0 }}>Do Not Sell My Personal Information</button>
              </div>
            </div>
            <div style={{ fontSize: 11, color: "#1e293b", lineHeight: 1.8 }}>
              BillVeil provides informational tools only and does not constitute medical, legal, or financial advice. Always consult a qualified professional. BillVeil does not discriminate on the basis of race, color, national origin, sex, disability, or age.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
