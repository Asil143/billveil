import { useState } from "react";
import axios from "axios";
import Landing from "./Landing";
import About from "./About";
import DisputeLetter from "./DisputeLetter";
import DrugComparator from "./DrugComparator";
import DenialFighter from "./DenialFighter";
import { AuthProvider, useAuth } from "./AuthContext";
import Profile from "./Profile";

const EXAMPLES = [
  "CPT 99214 — $385",
  "ER visit — $4,200",
  "Blood test 80053 — $189",
  "MRI brain scan — $3,800",
  "Tylenol x2 — $45",
];

const FONT = "'Inter', system-ui, sans-serif";

const CSS = `
  * { box-sizing: border-box; margin: 0; padding: 0; }

  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.5; } }

  body { background: #f8fafc; }

  .analyze-btn:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 12px 32px rgba(16,185,129,0.45) !important;
  }
  .analyze-btn:active:not(:disabled) { transform: translateY(0); }

  .chip:hover {
    background: #f0fdf4 !important;
    border-color: #10b981 !important;
    color: #10b981 !important;
  }
  .chip.active {
    background: #f0fdf4 !important;
    border-color: #10b981 !important;
    color: #059669 !important;
  }

  .result-card { animation: fadeUp 0.35s ease forwards; }

  .reset-btn:hover { background: #f1f5f9 !important; color: #0f172a !important; }

  textarea:focus, input:focus, select:focus { outline: none; border-color: #10b981 !important; box-shadow: 0 0 0 3px rgba(16,185,129,0.1) !important; }

  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 3px; }

  @media (max-width: 640px) {
    .how-grid { grid-template-columns: 1fr !important; }
  }
`;

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

function AppContent() {
  const { user, usesLeft, consumeCredit, logout, showLoginModal } = useAuth();
  const [view, setView] = useState("landing");
  const [tab, setTab] = useState("analyzer");
  const [bill, setBill] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [tip, setTip] = useState(false);
  const [focused, setFocused] = useState(false);

  const goToApp = (t) => { setTab(t || "analyzer"); setView("app"); };

  if (view === "landing") return <Landing onStart={goToApp} onAbout={() => setView("about")} />;
  if (view === "about") return <About onBack={() => setView("landing")} onStart={goToApp} />;

  const TABS = [
    { id: "analyzer", emoji: "⚡", label: "Bill Analyzer" },
    { id: "dispute", emoji: "✉️", label: "Dispute Letter" },
    { id: "drug", emoji: "💊", label: "Drug Prices" },
    { id: "denial", emoji: "⚔️", label: "Denial Fighter" },
    ...(user ? [{ id: "profile", emoji: "👤", label: "My Profile" }] : []),
  ];

  const analyzeBill = async () => {
    if (!bill.trim()) return;
    if (!consumeCredit()) return;
    setLoading(true);
    setResult(null);
    setError(null);
    try {
      const response = await axios.post("/api/analyze", { bill });
      setResult(response.data.result);
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const parseResult = (text) => {
    const sections = [
      { key: "WHAT IS THIS", emoji: "🔍", color: "#60a5fa", label: "What Is This" },
      { key: "FAIR PRICE", emoji: "💰", color: "#34d399", label: "Fair Price" },
      { key: "VERDICT", emoji: "⚖️", color: "#fbbf24", label: "Verdict" },
      { key: "WHY", emoji: "📋", color: "#a78bfa", label: "Why" },
      { key: "WHAT TO DO", emoji: "✅", color: "#34d399", label: "What To Do" },
      { key: "MONEY YOU COULD SAVE", emoji: "💵", color: "#34d399", label: "Money You Could Save" },
    ];

    return sections.map((section, i) => {
      const regex = new RegExp(`(?:#{1,3}\\s*)?${section.key}:\\n([\\s\\S]*?)(?=\\n(?:#{1,3}\\s*)?[A-Z][A-Z ]+:|$)`);
      const match = text.match(regex);
      const raw = match ? match[1].trim() : null;
      if (!raw) return null;
      const content = raw.replace(/^#{1,3}\s*/gm, "").replace(/\*\*/g, "").trim();
      if (!content) return null;

      const isVerdict = section.key === "VERDICT";
      const verdictColor = content.includes("SIGNIFICANTLY OVERCHARGED")
        ? "#f87171" : content.includes("POSSIBLY OVERCHARGED")
        ? "#fbbf24" : "#34d399";
      const verdictBg = content.includes("SIGNIFICANTLY OVERCHARGED")
        ? "rgba(239,68,68,0.08)" : content.includes("POSSIBLY OVERCHARGED")
        ? "rgba(251,191,36,0.08)" : "rgba(52,211,153,0.08)";

      return (
        <div
          key={section.key}
          className="result-card"
          style={{
            background: isVerdict ? verdictBg : "#ffffff",
            border: `1px solid ${isVerdict ? verdictColor + "40" : "#e2e8f0"}`,
            borderLeft: `3px solid ${isVerdict ? verdictColor : section.color}`,
            borderRadius: 12,
            padding: "20px 24px",
            marginBottom: 10,
            boxShadow: isVerdict ? "none" : "0 1px 3px rgba(0,0,0,0.04)",
            animationDelay: `${i * 0.08}s`,
            animationFillMode: "both",
          }}
        >
          <div style={{ fontSize: 10, fontWeight: 700, color: isVerdict ? verdictColor : section.color, letterSpacing: "0.12em", marginBottom: 12, textTransform: "uppercase" }}>
            {section.emoji} {section.label}
          </div>
          {isVerdict ? (
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: verdictColor + "20", border: `1px solid ${verdictColor}50`, color: verdictColor, padding: "8px 20px", borderRadius: 24, fontSize: 14, fontWeight: 800, letterSpacing: "0.04em" }}>
              <span style={{ width: 8, height: 8, background: verdictColor, borderRadius: "50%", display: "inline-block", animation: "glow 2s ease-in-out infinite" }} />
              {content}
            </div>
          ) : (
            <div style={{ fontSize: 15, color: "#374151", lineHeight: 1.8, whiteSpace: "pre-line" }}>
              {content}
            </div>
          )}
        </div>
      );
    });
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: FONT, color: "#0f172a" }}>
      <style>{CSS}</style>

      {/* Header */}
      <div style={{ position: "sticky", top: 0, zIndex: 10, background: "rgba(255,255,255,0.95)", backdropFilter: "blur(12px)", borderBottom: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 20px 6px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 28, height: 28, background: "linear-gradient(135deg, #10b981, #059669)", borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15 }}>🛡️</div>
            <span style={{ fontSize: 16, fontWeight: 800, letterSpacing: "-0.02em", color: "#0f172a" }}>BillVeil</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button onClick={() => setView("about")} style={{ background: "none", border: "none", color: "#64748b", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: FONT }}>About</button>
            {user ? (
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ fontSize: 12, color: "#059669", fontWeight: 600, background: "#f0fdf4", border: "1px solid #bbf7d0", padding: "3px 10px", borderRadius: 20 }}>
                  📱 ···{user.phoneNumber?.slice(-4)}
                </div>
                <button onClick={logout} style={{ background: "none", border: "1px solid #e2e8f0", color: "#64748b", fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: FONT, borderRadius: 6, padding: "4px 10px" }}>Sign out</button>
              </div>
            ) : usesLeft > 0 ? (
              <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#059669", fontWeight: 600, background: "#f0fdf4", border: "1px solid #bbf7d0", padding: "4px 12px", borderRadius: 20 }}>
                <span style={{ width: 6, height: 6, background: "#10b981", borderRadius: "50%", animation: "pulse 2s ease-in-out infinite" }} />
                {usesLeft} free {usesLeft === 1 ? "analysis" : "analyses"} left
              </div>
            ) : (
              <button onClick={showLoginModal} style={{ background: "#10b981", border: "none", color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: FONT, borderRadius: 8, padding: "6px 14px", boxShadow: "0 2px 8px rgba(16,185,129,0.3)" }}>
                Sign in free →
              </button>
            )}
          </div>
        </div>
        <div style={{ display: "flex", gap: 4, padding: "0 12px 10px", overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
          {TABS.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{ padding: "7px 14px", background: tab === t.id ? "#f0fdf4" : "transparent", border: `1px solid ${tab === t.id ? "#10b981" : "#e2e8f0"}`, borderRadius: 8, color: tab === t.id ? "#059669" : "#64748b", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: FONT, transition: "all 0.15s", whiteSpace: "nowrap", flexShrink: 0 }}>
              {t.emoji} {t.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 700, margin: "0 auto", padding: "28px 16px 48px" }}>

        {tab === "dispute" && <DisputeLetter />}
        {tab === "drug" && <DrugComparator />}
        {tab === "denial" && <DenialFighter />}
        {tab === "profile" && <Profile />}

        {tab === "analyzer" && <>

        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <h1 style={{ fontSize: "clamp(22px, 6vw, 34px)", fontWeight: 900, lineHeight: 1.15, letterSpacing: "-0.03em", marginBottom: 8, color: "#0f172a" }}>
            Is your medical <span style={{ color: "#10b981" }}>bill fair?</span>
          </h1>
          <p style={{ fontSize: "clamp(14px, 3vw, 16px)", color: "#64748b", lineHeight: 1.6, maxWidth: 460, margin: "0 auto 20px" }}>
            Americans overpay <strong style={{ color: "#0f172a" }}>$935 billion</strong> yearly. Paste your bill and we'll tell you in seconds.
          </p>
          <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap" }}>
            {[{ stat: "$935B", label: "Overpaid yearly" }, { stat: "80%", label: "Bills have errors" }, { stat: "10x", label: "Hospital markups" }].map(({ stat, label }, i) => (
              <div key={stat} style={{ padding: "8px clamp(12px, 4vw, 24px)", borderRight: i < 2 ? "1px solid #e2e8f0" : "none", textAlign: "center" }}>
                <div style={{ fontSize: "clamp(17px, 5vw, 24px)", fontWeight: 900, color: "#10b981" }}>{stat}</div>
                <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 1 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: "#ffffff", border: focused ? "1px solid #10b981" : "1px solid #e2e8f0", borderRadius: 16, padding: 20, marginBottom: 20, boxShadow: focused ? "0 0 0 3px rgba(16,185,129,0.1)" : "0 1px 4px rgba(0,0,0,0.05)", transition: "all 0.2s" }}>
          <label style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", display: "block", marginBottom: 10, letterSpacing: "0.06em", textTransform: "uppercase" }}>
            Paste your bill, charge, or CPT code
          </label>
          <textarea
            value={bill}
            onChange={(e) => setBill(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder="e.g. CPT 99214 — $385, or paste your full bill here..."
            style={{ width: "100%", height: 110, padding: 13, border: "1px solid #e2e8f0", borderRadius: 10, fontSize: 14, color: "#0f172a", resize: "vertical", fontFamily: FONT, lineHeight: 1.6, background: "#f8fafc", boxSizing: "border-box" }}
          />
          <div style={{ marginTop: 12, marginBottom: 16 }}>
            <div style={{ fontSize: 10, fontWeight: 600, color: "#94a3b8", marginBottom: 8, letterSpacing: "0.08em" }}>TRY AN EXAMPLE</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {EXAMPLES.map((ex) => (
                <button key={ex} className={`chip${bill === ex ? " active" : ""}`} onClick={() => setBill(ex)} style={{ padding: "5px 13px", background: "#f8fafc", color: "#64748b", border: "1px solid #e2e8f0", borderRadius: 24, fontSize: 12, fontWeight: 500, cursor: "pointer", transition: "all 0.15s", fontFamily: FONT }}>{ex}</button>
              ))}
            </div>
          </div>
          <button className="analyze-btn" onClick={analyzeBill} disabled={loading || !bill.trim()} style={{ width: "100%", padding: "15px", background: loading || !bill.trim() ? "#f1f5f9" : "linear-gradient(135deg, #10b981, #059669)", color: loading || !bill.trim() ? "#94a3b8" : "#fff", border: "none", borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: loading || !bill.trim() ? "default" : "pointer", transition: "all 0.2s", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, boxShadow: loading || !bill.trim() ? "none" : "0 4px 16px rgba(16,185,129,0.3)", fontFamily: FONT }}>
            {loading ? (<><span style={{ width: 17, height: 17, border: "2px solid #e2e8f0", borderTop: "2px solid #10b981", borderRadius: "50%", animation: "spin 0.8s linear infinite", display: "inline-block" }} />Analyzing your bill...</>) : <>⚡ Analyze My Bill — Free</>}
          </button>
        </div>

        {error && <div style={{ background: "#fff5f5", border: "1px solid #fecaca", borderRadius: 12, padding: 16, color: "#ef4444", fontSize: 14, marginBottom: 16 }}>{error}</div>}

        {!result && !loading && (
          <div style={{ marginTop: 40 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", letterSpacing: "0.12em", textAlign: "center", marginBottom: 20 }}>HOW IT WORKS</div>
            <div className="how-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
              {[{ step: "01", title: "Paste your bill", desc: "Any charge, CPT code, or full bill. No formatting needed." }, { step: "02", title: "AI scans it", desc: "We compare against fair market rates and flag every overcharge." }, { step: "03", title: "Fight back", desc: "Get exact steps to dispute, negotiate, or demand a refund." }].map(({ step, title, desc }) => (
                <div key={step} style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 14, padding: "20px 16px", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
                  <div style={{ fontSize: 26, fontWeight: 900, color: "#10b981", marginBottom: 10 }}>{step}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", marginBottom: 4 }}>{title}</div>
                  <div style={{ fontSize: 12, color: "#64748b", lineHeight: 1.7 }}>{desc}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {result && (
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", letterSpacing: "0.12em" }}>ANALYSIS RESULTS</div>
              <button className="reset-btn" onClick={() => { setResult(null); setBill(""); setTip(false); }} style={{ fontSize: 12, color: "#64748b", background: "#f8fafc", border: "1px solid #e2e8f0", padding: "5px 12px", borderRadius: 8, cursor: "pointer", fontFamily: FONT, transition: "all 0.2s" }}>← Analyze another</button>
            </div>
            {parseResult(result)}
            <div style={{ marginTop: 24 }}>
              {!tip ? (
                <div style={{ background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 16, padding: 28, textAlign: "center" }}>
                  <div style={{ fontSize: 30, marginBottom: 10 }}>☕</div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: "#92400e", marginBottom: 8 }}>Did BillVeil help you?</div>
                  <div style={{ fontSize: 14, color: "#78716c", marginBottom: 20, lineHeight: 1.7 }}>BillVeil is free forever. If we saved you money, a small tip keeps us running for the next person who needs us.</div>
                  <a href="https://buy.stripe.com/7sY3cxalf2f769Pf71bfO00" target="_blank" rel="noopener noreferrer" onClick={() => setTip(true)} style={{ display: "inline-block", padding: "12px 32px", background: "linear-gradient(135deg, #f59e0b, #d97706)", color: "#fff", borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: "pointer", boxShadow: "0 4px 16px rgba(245,158,11,0.3)", textDecoration: "none" }}>Leave a Tip ❤️</a>
                </div>
              ) : (
                <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 16, padding: 28, textAlign: "center" }}>
                  <div style={{ fontSize: 36, marginBottom: 10 }}>🙏</div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: "#065f46", marginBottom: 6 }}>Thank you so much!</div>
                  <div style={{ fontSize: 14, color: "#64748b", lineHeight: 1.7 }}>Your support keeps BillVeil free for every American who needs it.</div>
                </div>
              )}
            </div>
          </div>
        )}

        <div style={{ textAlign: "center", marginTop: 56, paddingTop: 28, borderTop: "1px solid #e2e8f0", fontSize: 12, color: "#94a3b8", lineHeight: 2.2 }}>
          <div>🔒 BillVeil does not store your medical information</div>
          <div>Built for the 330 million Americans who deserve better</div>
        </div>

        </>}
      </div>
    </div>
  );
}
