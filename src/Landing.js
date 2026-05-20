'use client';
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
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
  .tool-card:hover { border-color: rgba(16,185,129,0.4) !important; transform: translateY(-2px); }
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
    .land-mobile-nav { display: flex !important; }
    body { padding-bottom: 68px; }
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

const ALL_SERVICES = [
  {
    label: "Fight Your Bill",
    color: "#f87171",
    icon: "⚔️",
    tools: [
      { tab: "billscan", emoji: "📸", label: "Bill Scan" },
      { tab: "dispute", emoji: "✉️", label: "Dispute Letter" },
      { tab: "denial", emoji: "⚔️", label: "Denial Fighter" },
      { tab: "negotiate", emoji: "📞", label: "Negotiation Script" },
      { tab: "debtrights", emoji: "⚖️", label: "Debt Rights Checker" },
      { tab: "surprisebill", emoji: "🚨", label: "Surprise Billing Checker" },
      { tab: "itemization", emoji: "📑", label: "Itemization Request" },
      { tab: "charitycare", emoji: "🤝", label: "Charity Care Finder" },
      { tab: "paymentplan", emoji: "💳", label: "Payment Plan Negotiator" },
      { tab: "creditcard", emoji: "⚠️", label: "Medical Credit Card Warning" },
      { tab: "patientrights", emoji: "⚖️", label: "Patient Rights Guide" },
      { tab: "hipaa", emoji: "🔒", label: "HIPAA Rights Guide" },
      { tab: "mentalparity", emoji: "🧠", label: "Mental Health Parity" },
    ],
  },
  {
    label: "Understand Your Coverage",
    color: "#60a5fa",
    icon: "📋",
    tools: [
      { tab: "eob", emoji: "📋", label: "EOB Explainer" },
      { tab: "priorauth", emoji: "📝", label: "Prior Auth Helper" },
      { tab: "secondopinion", emoji: "🩺", label: "Second Opinion Finder" },
      { tab: "insplan", emoji: "🏥", label: "Insurance Plan Decoder" },
      { tab: "providercheck", emoji: "🔍", label: "Provider Network Checker" },
      { tab: "hsafsa", emoji: "💰", label: "HSA / FSA Optimizer" },
      { tab: "preventive", emoji: "🩺", label: "Preventive Care Checker" },
    ],
  },
  {
    label: "Find Savings",
    color: "#34d399",
    icon: "💰",
    tools: [
      { tab: "drug", emoji: "💊", label: "Drug Price Comparator" },
      { tab: "genericdrug", emoji: "💊", label: "Generic Drug Finder" },
      { tab: "costestimate", emoji: "🔮", label: "Pre-Treatment Cost Estimator" },
      { tab: "hospitalprice", emoji: "🏥", label: "Hospital Price Lookup" },
      { tab: "priceboard", emoji: "👥", label: "Community Price Board" },
      { tab: "cobra", emoji: "🧮", label: "COBRA Calculator" },
      { tab: "cptlookup", emoji: "🔢", label: "CPT Code Lookup" },
      { tab: "erurgent", emoji: "🏥", label: "ER vs. Urgent Care" },
      { tab: "hospitalquality", emoji: "🏆", label: "Hospital Quality Checker" },
    ],
  },
  {
    label: "Track Your Progress",
    color: "#a78bfa",
    icon: "📊",
    tools: [
      { tab: "casetracker", emoji: "📊", label: "Case Tracker" },
      { tab: "savings", emoji: "🏆", label: "Savings Dashboard" },
      { tab: "hub", emoji: "🗂️", label: "My Hub" },
      { tab: "glossary", emoji: "📚", label: "Medical Glossary" },
    ],
  },
  {
    label: "Financial & Tax Tools",
    color: "#fb923c",
    icon: "🧾",
    tools: [
      { tab: "medtax", emoji: "🧾", label: "Medical Tax Calculator" },
      { tab: "fsatracker", emoji: "⏰", label: "FSA Tracker" },
    ],
  },
  {
    label: "Populations & Life Events",
    color: "#38bdf8",
    icon: "🎖️",
    tools: [
      { tab: "medicare", emoji: "🏛️", label: "Medicare Navigator" },
      { tab: "veterans", emoji: "🎖️", label: "Veterans Benefits" },
      { tab: "chronicdisease", emoji: "🩺", label: "Chronic Disease Planner" },
    ],
  },
  {
    label: "AI Tools",
    color: "#10b981",
    icon: "🤖",
    tools: [
      { tab: "concierge", emoji: "🤖", label: "BillVeil Concierge" },
      { tab: "planoptimizer", emoji: "📈", label: "Insurance Plan Optimizer" },
      { tab: "insurance", emoji: "🛡️", label: "Insurance Finder" },
    ],
  },
];

export default function Landing() {
  const router = useRouter();
  const { user, showLoginModal, logout, initials } = useAuth();
  const [heroBill, setHeroBill] = useState("");
  const [openFaq, setOpenFaq] = useState(null);
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const [showServicesMenu, setShowServicesMenu] = useState(false);
  const accountMenuRef = useRef(null);
  const servicesMenuRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (accountMenuRef.current && !accountMenuRef.current.contains(e.target)) setShowAccountMenu(false);
      if (servicesMenuRef.current && !servicesMenuRef.current.contains(e.target)) setShowServicesMenu(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const goTo = (tab, bill) => {
    if (bill) sessionStorage.setItem("bv_heroBill", bill);
    router.push(`/${tab}`);
  };

  const handleAnalyze = () => {
    if (heroBill.trim()) {
      goTo("analyzer", heroBill);
    } else {
      goTo("analyzer");
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

        {/* Services dropdown — desktop only */}
        <div className="nav-tools" style={{ display: "flex", alignItems: "center", gap: 12, flex: 1, justifyContent: "center" }}>
          <button className="nav-tool" onClick={() => goTo("analyzer")} style={{ padding: "6px 12px", background: "transparent", border: "none", color: "#64748b", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: FONT, borderRadius: 7, transition: "all 0.15s" }}>
            ⚡ Bill Analyzer
          </button>
          <div ref={servicesMenuRef} style={{ position: "relative" }}>
            <button
              onClick={() => setShowServicesMenu(v => !v)}
              style={{ padding: "6px 14px", background: showServicesMenu ? "rgba(16,185,129,0.1)" : "transparent", border: showServicesMenu ? "1px solid rgba(16,185,129,0.25)" : "1px solid transparent", color: showServicesMenu ? "#10b981" : "#64748b", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: FONT, borderRadius: 8, transition: "all 0.15s", display: "flex", alignItems: "center", gap: 6 }}
            >
              🛠️ Services
              <span style={{ fontSize: 10, transform: showServicesMenu ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.2s", display: "inline-block" }}>▾</span>
            </button>
            {showServicesMenu && (
              <div style={{ position: "absolute", top: "calc(100% + 12px)", left: "50%", transform: "translateX(-50%)", background: "#0d1526", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 16, padding: 20, boxShadow: "0 24px 64px rgba(0,0,0,0.7)", zIndex: 200, display: "grid", gridTemplateColumns: "repeat(4, 200px)", gap: 20, width: "max-content" }}>
                {ALL_SERVICES.map(cat => (
                  <div key={cat.label}>
                    <div style={{ fontSize: 9, fontWeight: 800, color: cat.color, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 10, display: "flex", alignItems: "center", gap: 5 }}>
                      <span>{cat.icon}</span> {cat.label}
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                      {cat.tools.map(tool => (
                        <button
                          key={tool.tab}
                          onClick={() => { goTo(tool.tab); setShowServicesMenu(false); }}
                          style={{ padding: "7px 10px", background: "none", border: "none", color: "#64748b", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: FONT, textAlign: "left", borderRadius: 8, transition: "all 0.12s", display: "flex", alignItems: "center", gap: 7 }}
                          onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; e.currentTarget.style.color = "#f1f5f9"; }}
                          onMouseLeave={e => { e.currentTarget.style.background = "none"; e.currentTarget.style.color = "#64748b"; }}
                        >
                          <span style={{ fontSize: 14, flexShrink: 0 }}>{tool.emoji}</span>
                          {tool.label}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
          <button onClick={() => router.push("/learn")} style={{ padding: "6px 12px", background: "transparent", border: "none", color: "#64748b", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: FONT }}>Case Files</button>
          <button onClick={() => router.push("/about")} style={{ padding: "6px 12px", background: "transparent", border: "none", color: "#64748b", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: FONT }}>About</button>

          {user ? (
            <div style={{ position: "relative" }} ref={accountMenuRef}>
              <button onClick={() => setShowAccountMenu(!showAccountMenu)} style={{ width: 34, height: 34, borderRadius: "50%", background: "linear-gradient(135deg, #10b981, #059669)", border: "2px solid rgba(16,185,129,0.4)", color: "#fff", fontWeight: 800, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 12px rgba(16,185,129,0.35)" }}>
                {initials || "👤"}
              </button>
              {showAccountMenu && (
                <div style={{ position: "absolute", top: 42, right: 0, background: "#0d1526", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: 6, minWidth: 190, boxShadow: "0 16px 40px rgba(0,0,0,0.6)", zIndex: 100 }}>
                  <button onClick={() => { goTo("profile"); setShowAccountMenu(false); }} style={{ width: "100%", padding: "9px 12px", background: "none", border: "none", color: "#94a3b8", fontSize: 13, fontWeight: 600, cursor: "pointer", textAlign: "left", fontFamily: FONT, borderRadius: 8, display: "block" }}>👤  My Profile</button>
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
          44 FREE TOOLS · NO SIGNUP REQUIRED
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
            <span style={{ fontSize: 18 }}>🛡️</span> 44 free tools, no signup needed
          </div>
          <div style={{ width: 1, height: 18, background: "rgba(255,255,255,0.08)" }} />
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#64748b", fontWeight: 600 }}>
            <span style={{ fontSize: 18 }}>🔒</span> Your bill is never stored or shared
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

        <div style={{ animation: "fadeUp 0.6s 0.4s ease both" }}>
          <div style={{ fontSize: 12, color: "#334155", marginBottom: 10 }}>No signup · No credit card · Results in 30 seconds</div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 20, flexWrap: "wrap" }}>
            {[
              { icon: "🔒", text: "256-bit encrypted" },
              { icon: "🚫", text: "Data never stored" },
              { icon: "✅", text: "HIPAA-aware" },
            ].map(({ icon, text }) => (
              <div key={text} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: "#334155", fontWeight: 600 }}>
                <span style={{ fontSize: 13 }}>{icon}</span> {text}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social proof savings strip — hidden until real user data available */}

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
            { icon: "⚡", text: "Results in seconds" },
            { icon: "💸", text: "Always free" },
          ].map(({ icon, text }) => (
            <div key={text} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#475569", fontWeight: 600 }}>
              <span style={{ fontSize: 14 }}>{icon}</span> {text}
            </div>
          ))}
        </div>
      </section>

      {/* Data sources bar */}
      <section style={{ position: "relative", zIndex: 1, padding: "24px 20px", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
        <div style={{ maxWidth: 820, margin: "0 auto", textAlign: "center" }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: "#334155", letterSpacing: "0.14em", marginBottom: 16, textTransform: "uppercase" }}>Powered by official data sources</div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, flexWrap: "wrap" }}>
            {[
              { label: "CMS Medicare Rates", desc: "Official allowable rates" },
              { label: "No Surprises Act 2022", desc: "Federal billing protection" },
              { label: "USPSTF Guidelines", desc: "Preventive care standards" },
              { label: "ACA / ERISA Law", desc: "Insurance appeal rights" },
              { label: "HIPAA Regulations", desc: "Patient data rights" },
              { label: "State Charity Care Laws", desc: "Hospital forgiveness rules" },
            ].map(({ label, desc }) => (
              <div key={label} title={desc} style={{ padding: "6px 14px", background: "rgba(16,185,129,0.04)", border: "1px solid rgba(16,185,129,0.12)", borderRadius: 8, fontSize: 11, color: "#475569", fontWeight: 700, letterSpacing: "0.01em" }}>
                {label}
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

      {/* Live Demo */}
      <LiveDemo onFullTool={() => router.push("/analyzer")} />

      {/* Services */}
      <section id="services" style={{ position: "relative", zIndex: 1, padding: "90px 20px", maxWidth: 900, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: "#10b981", letterSpacing: "0.14em", marginBottom: 16 }}>SERVICES</div>
          <h2 style={{ fontSize: "clamp(26px, 5vw, 40px)", fontWeight: 900, letterSpacing: "-0.03em", color: "#f1f5f9", marginBottom: 12 }}>Every tool you need. Free.</h2>
          <p style={{ fontSize: 15, color: "#64748b", lineHeight: 1.7, maxWidth: 460, margin: "0 auto" }}>
            44 specialized tools to understand, fight, and reduce your medical bills — organized by what you need to do right now.
          </p>
        </div>

        {/* Bill Scan featured */}
        <div
          onClick={() => goTo("billscan")}
          className="tool-card"
          style={{ background: "linear-gradient(135deg, rgba(16,185,129,0.1), rgba(5,150,105,0.05))", border: "1px solid rgba(16,185,129,0.3)", borderRadius: 18, padding: "22px 26px", cursor: "pointer", marginBottom: 40, display: "flex", alignItems: "center", gap: 20, transition: "all 0.2s" }}
        >
          <div style={{ fontSize: 40, flexShrink: 0 }}>📸</div>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
              <div style={{ fontSize: 16, fontWeight: 800, color: "#f1f5f9" }}>Bill Scan</div>
              <div style={{ fontSize: 9, fontWeight: 700, color: "#10b981", background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.3)", padding: "2px 8px", borderRadius: 8, letterSpacing: "0.08em" }}>FEATURED</div>
            </div>
            <div style={{ fontSize: 13, color: "#64748b", lineHeight: 1.6 }}>Take a photo or upload your bill — AI reads every charge and CPT code automatically. No typing required.</div>
          </div>
          <div style={{ fontSize: 20, color: "#10b981", flexShrink: 0 }}>→</div>
        </div>

        {/* Categories */}
        {ALL_SERVICES.map(cat => (
          <div key={cat.label} style={{ marginBottom: 40 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
              <span style={{ fontSize: 16 }}>{cat.icon}</span>
              <div style={{ fontSize: 11, fontWeight: 800, color: cat.color, letterSpacing: "0.12em", textTransform: "uppercase" }}>{cat.label}</div>
              <div style={{ flex: 1, height: 1, background: `linear-gradient(to right, ${cat.color}40, transparent)` }} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 12 }}>
              {cat.tools.filter(t => t.tab !== "billscan").map(tool => (
                <div
                  key={tool.tab}
                  className="tool-card"
                  onClick={() => goTo(tool.tab)}
                  style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: "16px 18px", cursor: "pointer", transition: "all 0.2s", display: "flex", alignItems: "center", gap: 14 }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = `${cat.color}50`; e.currentTarget.style.background = `${cat.color}08`; e.currentTarget.style.transform = "translateY(-2px)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.background = "rgba(255,255,255,0.03)"; e.currentTarget.style.transform = "translateY(0)"; }}
                >
                  <div style={{ fontSize: 24, flexShrink: 0 }}>{tool.emoji}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#f1f5f9", flex: 1 }}>{tool.label}</div>
                  <div style={{ fontSize: 14, color: cat.color, flexShrink: 0 }}>→</div>
                </div>
              ))}
            </div>
          </div>
        ))}
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

      {/* Testimonials — hidden until real user testimonials are collected */}

      {/* Case Files strip */}
      <section style={{ position: "relative", zIndex: 1, background: "rgba(16,185,129,0.04)", borderTop: "1px solid rgba(16,185,129,0.12)", borderBottom: "1px solid rgba(16,185,129,0.12)", padding: "16px 20px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "center", gap: 32, flexWrap: "wrap" }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: "#475569", letterSpacing: "0.1em" }}>📁 CASE FILES</span>
          {[
            { label: "Surprise ER Bill", slug: "surprise-billing" },
            { label: "Denied MRI Claim", slug: "denied-claim-appeal" },
            { label: "Charity Care — Bill Erased", slug: "charity-care" },
            { label: "Generic Drug Savings", slug: "generic-drug-savings" },
          ].map(({ label, slug }) => (
            <button key={slug} onClick={() => router.push(`/learn/${slug}`)} style={{ background: "none", border: "none", color: "#10b981", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: FONT, padding: 0 }}
              onMouseEnter={e => e.currentTarget.style.opacity = "0.7"}
              onMouseLeave={e => e.currentTarget.style.opacity = "1"}>
              {label} →
            </button>
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
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              { q: "How much does BillVeil cost?", a: "You get 3 analyses with no account required. After that, create an account with just your phone number to continue — no password, no credit card. We accept optional tips but never require them." },
              { q: "Is my medical information safe?", a: "Bill text you type into any tool is processed and immediately discarded — we never log or store your medical queries. Your optional profile (name, insurance info) is stored securely on your account and never shared. No diagnosis or treatment data is ever collected." },
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

      {/* Privacy & Security Trust Section */}
      <section style={{ position: "relative", zIndex: 1, borderTop: "1px solid rgba(255,255,255,0.06)", padding: "80px 20px", background: "rgba(16,185,129,0.015)" }}>
        <div style={{ maxWidth: 820, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: "#10b981", letterSpacing: "0.14em", marginBottom: 16 }}>PRIVACY & SECURITY</div>
            <h2 style={{ fontSize: "clamp(24px, 4.5vw, 36px)", fontWeight: 900, letterSpacing: "-0.03em", color: "#f1f5f9", marginBottom: 12 }}>Your health data belongs to you.</h2>
            <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.7, maxWidth: 480, margin: "0 auto" }}>We built BillVeil with privacy as the foundation — not an afterthought. Here's exactly how we handle your information.</p>
          </div>
          <div className="land-3col" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 28 }}>
            {[
              { icon: "🚫", title: "Nothing stored", body: "We do not log, save, or store anything you type into BillVeil. Every session is stateless — when you close the tab, the data is gone." },
              { icon: "🔒", title: "256-bit TLS encryption", body: "All data travels between your browser and our servers over 256-bit TLS — the same standard used by banks and healthcare systems." },
              { icon: "👤", title: "Your profile, your control", body: "Any profile info you add (name, insurance, address) is optional and stored securely on your account. Bill text you analyze is never saved or logged — it's gone the moment the response is returned." },
            ].map(({ icon, title, body }) => (
              <div key={title} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: "24px 20px" }}>
                <div style={{ fontSize: 28, marginBottom: 12 }}>{icon}</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#f1f5f9", marginBottom: 8 }}>{title}</div>
                <div style={{ fontSize: 13, color: "#64748b", lineHeight: 1.75 }}>{body}</div>
              </div>
            ))}
          </div>
          <div className="land-2col" style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 14 }}>
            {[
              { icon: "🤖", title: "AI processes, never learns from you", body: "The AI model analyzes your bill in the moment. It does not retain your inputs, improve from your data, or share results with any third party." },
              { icon: "📋", title: "HIPAA-aware practices", body: "While BillVeil is an informational tool rather than a covered entity, we follow HIPAA-aligned data minimization principles by design." },
            ].map(({ icon, title, body }) => (
              <div key={title} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: "24px 20px", display: "flex", gap: 16, alignItems: "flex-start" }}>
                <div style={{ fontSize: 24, flexShrink: 0 }}>{icon}</div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#f1f5f9", marginBottom: 6 }}>{title}</div>
                  <div style={{ fontSize: 13, color: "#64748b", lineHeight: 1.75 }}>{body}</div>
                </div>
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
          <button className="hero-cta" onClick={() => goTo("analyzer")} style={{ padding: "18px 52px", background: "linear-gradient(135deg, #10b981, #059669)", color: "#fff", border: "none", borderRadius: 14, fontSize: 17, fontWeight: 800, cursor: "pointer", fontFamily: FONT, transition: "all 0.25s", boxShadow: "0 10px 40px rgba(16,185,129,0.4)", letterSpacing: "0.01em" }}>
            ⚡ Analyze My Bill
          </button>
          <div style={{ marginTop: 16, fontSize: 12, color: "#334155" }}>No signup · No credit card · Results in 30 seconds</div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ position: "relative", zIndex: 1, borderTop: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.01)", padding: "56px 28px 32px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>

          {/* Top row: brand + quick links */}
          <div style={{ display: "grid", gridTemplateColumns: "240px 1fr", gap: 48, marginBottom: 48, alignItems: "start" }}>

            {/* Brand */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                <div style={{ width: 28, height: 28, background: "linear-gradient(135deg, #10b981, #059669)", borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15 }}>🛡️</div>
                <span style={{ fontSize: 16, fontWeight: 800, color: "#f1f5f9" }}>BillVeil</span>
              </div>
              <p style={{ fontSize: 13, color: "#475569", lineHeight: 1.75, marginBottom: 20 }}>
                44 AI tools for medical billing transparency. Built for the 330 million Americans who deserve better.
              </p>
              <div style={{ fontSize: 12, color: "#334155", marginBottom: 16 }}>🔒 We never store your medical data</div>
              <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
                {[
                  { href: "https://twitter.com/billveil", label: "𝕏", title: "BillVeil on X" },
                  { href: "https://linkedin.com/company/billveil", label: "in", title: "BillVeil on LinkedIn" },
                ].map(({ href, label, title }) => (
                  <a key={href} href={href} target="_blank" rel="noopener noreferrer" title={title} style={{ width: 32, height: 32, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", color: "#475569", fontSize: 13, fontWeight: 800, textDecoration: "none", transition: "all 0.15s" }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = "#94a3b8"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.color = "#475569"; }}>
                    {label}
                  </a>
                ))}
              </div>
              {/* Company + Legal inline */}
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: "#334155", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 2 }}>Company</div>
                <button className="footer-link" onClick={() => router.push("/learn")} style={{ background: "none", border: "none", color: "#475569", fontSize: 12, fontWeight: 500, cursor: "pointer", fontFamily: FONT, textAlign: "left", padding: 0, transition: "color 0.15s" }}>Case Files</button>
                <button className="footer-link" onClick={() => router.push("/about")} style={{ background: "none", border: "none", color: "#475569", fontSize: 12, fontWeight: 500, cursor: "pointer", fontFamily: FONT, textAlign: "left", padding: 0, transition: "color 0.15s" }}>About</button>
                <a href="mailto:hello@billveil.com" className="footer-link" style={{ color: "#475569", fontSize: 12, fontWeight: 500, textDecoration: "none", transition: "color 0.15s" }}>Contact</a>
                <button className="footer-link" onClick={() => router.push("/privacy")} style={{ background: "none", border: "none", color: "#475569", fontSize: 12, fontWeight: 500, cursor: "pointer", fontFamily: FONT, textAlign: "left", padding: 0, transition: "color 0.15s" }}>Privacy Policy</button>
                <button className="footer-link" onClick={() => router.push("/terms")} style={{ background: "none", border: "none", color: "#475569", fontSize: 12, fontWeight: 500, cursor: "pointer", fontFamily: FONT, textAlign: "left", padding: 0, transition: "color 0.15s" }}>Terms of Service</button>
              </div>
            </div>

            {/* Tools sitemap — all categories */}
            <div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: "#475569", letterSpacing: "0.12em", textTransform: "uppercase" }}>All Tools</div>
                <button className="footer-link" onClick={() => goTo("services")} style={{ background: "none", border: "none", color: "#10b981", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: FONT, padding: 0, transition: "color 0.15s" }}>Browse all 44 tools →</button>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px 32px" }}>
                {ALL_SERVICES.map(cat => (
                  <div key={cat.label}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: cat.color, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8, display: "flex", alignItems: "center", gap: 5 }}>
                      <span style={{ fontSize: 12 }}>{cat.icon}</span> {cat.label}
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      {cat.tools.slice(0, 4).map(tool => (
                        <button key={tool.tab} className="footer-link" onClick={() => goTo(tool.tab)} style={{ background: "none", border: "none", color: "#475569", fontSize: 12, fontWeight: 500, cursor: "pointer", fontFamily: FONT, textAlign: "left", padding: 0, transition: "color 0.15s", lineHeight: 1.4 }}>
                          {tool.emoji} {tool.label}
                        </button>
                      ))}
                      {cat.tools.length > 4 && (
                        <button className="footer-link" onClick={() => goTo("services")} style={{ background: "none", border: "none", color: "#334155", fontSize: 11, cursor: "pointer", fontFamily: FONT, textAlign: "left", padding: 0, transition: "color 0.15s" }}>
                          +{cat.tools.length - 4} more →
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: 24, display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
              <div style={{ fontSize: 12, color: "#1e293b" }}>© 2026 BillVeil</div>
              <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                <button className="footer-link" onClick={() => router.push("/privacy")} style={{ background: "none", border: "none", color: "#1e293b", fontSize: 12, cursor: "pointer", fontFamily: FONT, padding: 0 }}>Privacy</button>
                <button className="footer-link" onClick={() => router.push("/terms")} style={{ background: "none", border: "none", color: "#1e293b", fontSize: 12, cursor: "pointer", fontFamily: FONT, padding: 0 }}>Terms</button>
              </div>
            </div>
            <div style={{ fontSize: 11, color: "#1e293b", lineHeight: 1.8 }}>
              BillVeil provides informational tools only and does not constitute medical, legal, or financial advice. Always consult a qualified professional. BillVeil does not discriminate on the basis of race, color, national origin, sex, disability, or age.
            </div>
          </div>
        </div>
      </footer>
      {/* Mobile bottom nav — hidden on desktop via CSS */}
      <nav className="land-mobile-nav" style={{ display: "none", position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 100, background: "rgba(5,8,16,0.97)", backdropFilter: "blur(20px)", borderTop: "1px solid rgba(255,255,255,0.08)", padding: "8px 4px", justifyContent: "space-around", alignItems: "center" }}>
        {[
          { label: "Analyze", emoji: "⚡", tab: "analyzer" },
          { label: "Scan Bill", emoji: "📸", tab: "billscan" },
          { label: "Dispute", emoji: "✉️", tab: "dispute" },
          { label: "All Tools", emoji: "🛠️", tab: "services" },
          { label: "AI Chat", emoji: "🤖", tab: "concierge" },
        ].map(({ label, emoji, tab }) => (
          <button key={tab} onClick={() => goTo(tab)} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3, background: "none", border: "none", cursor: "pointer", fontFamily: FONT, padding: "4px 10px", borderRadius: 10 }}>
            <span style={{ fontSize: 20 }}>{emoji}</span>
            <span style={{ fontSize: 10, color: "#475569", fontWeight: 600 }}>{label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}

const SAMPLE_BILL = `Emergency Room Visit - $3,200
CBC Blood Test x2 - $480
IV Saline 1000ml - $800
Physician Consultation (10 min) - $850
Ibuprofen 200mg x2 - $95
Chest X-Ray - $1,100`;

function LiveDemo({ onFullTool }) {
  const [bill, setBill] = useState(SAMPLE_BILL);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const analyze = async () => {
    if (!bill.trim() || loading) return;
    setLoading(true); setResult(null); setError(null);
    try {
      const r = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bill }),
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data.error || "Failed");
      setResult(data.result);
    } catch (e) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section style={{ position: "relative", zIndex: 1, borderTop: "1px solid rgba(255,255,255,0.06)", padding: "90px 20px", background: "#050810" }}>
      <div style={{ maxWidth: 820, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.25)", borderRadius: 20, padding: "5px 14px", fontSize: 11, fontWeight: 700, color: "#10b981", marginBottom: 16, letterSpacing: "0.08em" }}>
            ⚡ LIVE DEMO
          </div>
          <h2 style={{ fontSize: "clamp(24px, 5vw, 38px)", fontWeight: 900, letterSpacing: "-0.03em", color: "#f1f5f9", marginBottom: 12 }}>
            Try it right now
          </h2>
          <p style={{ fontSize: 15, color: "#64748b", maxWidth: 460, margin: "0 auto" }}>
            A sample hospital bill is loaded below. Hit Analyze and watch BillVeil find the overcharges in seconds.
          </p>
        </div>

        <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, overflow: "hidden" }}>
          {/* Bill input */}
          <div style={{ padding: "24px 24px 0" }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: "#334155", letterSpacing: "0.12em", marginBottom: 10 }}>SAMPLE BILL — edit or paste your own</div>
            <textarea
              value={bill}
              onChange={e => { setBill(e.target.value); setResult(null); }}
              rows={6}
              style={{ width: "100%", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: "14px 16px", fontSize: 13, color: "#cbd5e1", fontFamily: "'Courier New', monospace", resize: "vertical", boxSizing: "border-box", lineHeight: 1.7 }}
            />
          </div>

          {/* Analyze button */}
          <div style={{ padding: "16px 24px 24px" }}>
            <button
              onClick={analyze}
              disabled={loading || !bill.trim()}
              style={{ width: "100%", padding: "14px", background: loading ? "rgba(255,255,255,0.05)" : "linear-gradient(135deg,#10b981,#059669)", color: loading ? "#334155" : "#fff", border: "none", borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: loading ? "default" : "pointer", fontFamily: FONT, display: "flex", alignItems: "center", justifyContent: "center", gap: 10, boxShadow: loading ? "none" : "0 8px 28px rgba(16,185,129,0.35)", transition: "all 0.2s" }}
            >
              {loading
                ? <><span style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,0.15)", borderTop: "2px solid #10b981", borderRadius: "50%", animation: "spin 0.8s linear infinite", display: "inline-block" }} /> Analyzing your bill...</>
                : "⚡ Analyze This Bill"}
            </button>
          </div>

          {/* Error */}
          {error && (
            <div style={{ margin: "0 24px 24px", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 12, padding: "12px 16px", color: "#f87171", fontSize: 13 }}>
              {error}
            </div>
          )}

          {/* Results */}
          {result && (
            <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", padding: "24px" }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: "#10b981", letterSpacing: "0.12em", marginBottom: 16 }}>⚡ ANALYSIS COMPLETE</div>
              <div style={{ fontSize: 14, color: "#cbd5e1", lineHeight: 1.85, whiteSpace: "pre-line", marginBottom: 24 }}>
                {result}
              </div>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <button
                  onClick={onFullTool}
                  style={{ padding: "11px 24px", background: "linear-gradient(135deg,#10b981,#059669)", color: "#fff", border: "none", borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: FONT, boxShadow: "0 4px 16px rgba(16,185,129,0.3)" }}
                >
                  Use full Bill Analyzer →
                </button>
                <button
                  onClick={() => { setResult(null); setBill(SAMPLE_BILL); }}
                  style={{ padding: "11px 20px", background: "rgba(255,255,255,0.04)", color: "#64748b", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: FONT }}
                >
                  Reset
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
