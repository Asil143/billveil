import { useState, useEffect, useRef } from "react";
import axios from "axios";
import Landing from "./Landing";
import About from "./About";
import Privacy from "./Privacy";
import Terms from "./Terms";
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
  @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.4; } }

  body { background: #050810; }

  .analyze-btn:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 16px 40px rgba(16,185,129,0.5) !important;
  }
  .analyze-btn:active:not(:disabled) { transform: translateY(0); }

  .chip:hover {
    background: rgba(16,185,129,0.12) !important;
    border-color: rgba(16,185,129,0.3) !important;
    color: #10b981 !important;
  }
  .chip.active {
    background: rgba(16,185,129,0.12) !important;
    border-color: rgba(16,185,129,0.3) !important;
    color: #10b981 !important;
  }

  .result-card { animation: fadeUp 0.35s ease forwards; }

  .reset-btn:hover { background: rgba(255,255,255,0.08) !important; color: #f1f5f9 !important; }

  textarea:focus, input:focus, select:focus { outline: none; border-color: rgba(16,185,129,0.5) !important; box-shadow: 0 0 0 3px rgba(16,185,129,0.08) !important; }

  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 3px; }

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
  const autoAnalyzeRef = useRef(false);
  const accountMenuRef = useRef(null);
  const [showAccountMenu, setShowAccountMenu] = useState(false);

  useEffect(() => {
    const handler = (e) => { if (accountMenuRef.current && !accountMenuRef.current.contains(e.target)) setShowAccountMenu(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const goToApp = (t, initialBill) => {
    setTab(t || "analyzer");
    setResult(null);
    setError(null);
    if (initialBill) {
      setBill(initialBill);
      autoAnalyzeRef.current = true;
    }
    setView("app");
  };

  // Auto-trigger analysis when coming from landing hero input
  useEffect(() => {
    if (autoAnalyzeRef.current && bill.trim() && view === "app" && tab === "analyzer") {
      autoAnalyzeRef.current = false;
      if (consumeCredit()) {
        setLoading(true);
        setResult(null);
        setError(null);
        axios.post("/api/analyze", { bill })
          .then(r => setResult(r.data.result))
          .catch(() => setError("Something went wrong. Please try again."))
          .finally(() => setLoading(false));
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view]);

  if (view === "landing") return <Landing onStart={goToApp} onAbout={() => setView("about")} onPrivacy={() => setView("privacy")} onTerms={() => setView("terms")} />;
  if (view === "about") return <About onBack={() => setView("landing")} onStart={goToApp} />;
  if (view === "privacy") return <Privacy onBack={() => setView("landing")} />;
  if (view === "terms") return <Terms onBack={() => setView("landing")} />;

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
        <div key={section.key} className="result-card" style={{ background: isVerdict ? verdictBg : "rgba(255,255,255,0.03)", border: `1px solid ${isVerdict ? verdictColor + "40" : "rgba(255,255,255,0.08)"}`, borderLeft: `3px solid ${isVerdict ? verdictColor : section.color}`, borderRadius: 12, padding: "20px 24px", marginBottom: 10, animationDelay: `${i * 0.08}s`, animationFillMode: "both" }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: isVerdict ? verdictColor : section.color, letterSpacing: "0.12em", marginBottom: 12, textTransform: "uppercase" }}>
            {section.emoji} {section.label}
          </div>
          {isVerdict ? (
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: verdictColor + "20", border: `1px solid ${verdictColor}50`, color: verdictColor, padding: "8px 20px", borderRadius: 24, fontSize: 14, fontWeight: 800, letterSpacing: "0.04em" }}>
              <span style={{ width: 8, height: 8, background: verdictColor, borderRadius: "50%", display: "inline-block" }} />
              {content}
            </div>
          ) : (
            <div style={{ fontSize: 15, color: "#cbd5e1", lineHeight: 1.8, whiteSpace: "pre-line" }}>{content}</div>
          )}
        </div>
      );
    });
  };

  return (
    <div style={{ minHeight: "100vh", background: "#050810", fontFamily: FONT, color: "#f1f5f9" }}>
      <style>{CSS}</style>

      {/* Header */}
      <div style={{ position: "sticky", top: 0, zIndex: 10, background: "rgba(5,8,16,0.9)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 20px 6px" }}>
          <button onClick={() => setView("landing")} style={{ display: "flex", alignItems: "center", gap: 10, background: "none", border: "none", cursor: "pointer", padding: 0 }}>
            <div style={{ width: 28, height: 28, background: "linear-gradient(135deg, #10b981, #059669)", borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, boxShadow: "0 0 12px rgba(16,185,129,0.4)" }}>🛡️</div>
            <span style={{ fontSize: 16, fontWeight: 800, letterSpacing: "-0.02em", color: "#f1f5f9", fontFamily: FONT }}>BillVeil</span>
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button onClick={() => setView("about")} style={{ background: "none", border: "none", color: "#64748b", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: FONT }}>About</button>

            {user ? (
              <div style={{ position: "relative" }} ref={accountMenuRef}>
                <button onClick={() => setShowAccountMenu(!showAccountMenu)} style={{ width: 34, height: 34, borderRadius: "50%", background: "linear-gradient(135deg, #10b981, #059669)", border: "2px solid rgba(16,185,129,0.4)", color: "#fff", fontWeight: 800, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 12px rgba(16,185,129,0.35)" }}>
                  {user.phoneNumber?.slice(-2) || "U"}
                </button>
                {showAccountMenu && (
                  <div style={{ position: "absolute", top: 42, right: 0, background: "#0d1526", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: 6, minWidth: 190, boxShadow: "0 16px 40px rgba(0,0,0,0.6)", zIndex: 100 }}>
                    <div style={{ padding: "8px 12px", fontSize: 12, color: "#475569", borderBottom: "1px solid rgba(255,255,255,0.06)", marginBottom: 4 }}>
                      📱 ···{user.phoneNumber?.slice(-4)}
                    </div>
                    <button onClick={() => { setTab("profile"); setShowAccountMenu(false); }} style={{ width: "100%", padding: "9px 12px", background: "none", border: "none", color: "#94a3b8", fontSize: 13, fontWeight: 600, cursor: "pointer", textAlign: "left", fontFamily: FONT, borderRadius: 8, display: "block" }}>👤 My Profile</button>
                    <button onClick={() => { logout(); setShowAccountMenu(false); }} style={{ width: "100%", padding: "9px 12px", background: "none", border: "none", color: "#f87171", fontSize: 13, fontWeight: 600, cursor: "pointer", textAlign: "left", fontFamily: FONT, borderRadius: 8, display: "block" }}>Sign Out</button>
                  </div>
                )}
              </div>
            ) : (
              <>
                {usesLeft > 0 && (
                  <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#10b981", fontWeight: 600, background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.25)", padding: "4px 12px", borderRadius: 20 }}>
                    <span style={{ width: 6, height: 6, background: "#10b981", borderRadius: "50%", animation: "pulse 2s ease-in-out infinite" }} />
                    {usesLeft} free {usesLeft === 1 ? "analysis" : "analyses"} left
                  </div>
                )}
                <button onClick={showLoginModal} style={{ padding: "7px 14px", background: "none", border: "1px solid rgba(255,255,255,0.12)", color: "#94a3b8", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: FONT }}>Log In</button>
                <button onClick={showLoginModal} style={{ padding: "7px 14px", background: "linear-gradient(135deg, #10b981, #059669)", border: "none", color: "#fff", borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: FONT, boxShadow: "0 4px 12px rgba(16,185,129,0.35)" }}>Sign Up →</button>
              </>
            )}
          </div>
        </div>
        <div style={{ display: "flex", gap: 4, padding: "0 12px 10px", overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
          {TABS.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{ padding: "7px 14px", background: tab === t.id ? "rgba(16,185,129,0.12)" : "transparent", border: `1px solid ${tab === t.id ? "rgba(16,185,129,0.3)" : "rgba(255,255,255,0.07)"}`, borderRadius: 8, color: tab === t.id ? "#10b981" : "#64748b", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: FONT, transition: "all 0.15s", whiteSpace: "nowrap", flexShrink: 0 }}>
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
          <h1 style={{ fontSize: "clamp(22px, 6vw, 34px)", fontWeight: 900, lineHeight: 1.15, letterSpacing: "-0.03em", marginBottom: 8, color: "#f1f5f9" }}>
            Is your medical <span style={{ color: "#10b981", textShadow: "0 0 20px rgba(16,185,129,0.4)" }}>bill fair?</span>
          </h1>
          <p style={{ fontSize: "clamp(14px, 3vw, 16px)", color: "#64748b", lineHeight: 1.6, maxWidth: 460, margin: "0 auto 20px" }}>
            Americans overpay <strong style={{ color: "#94a3b8" }}>$935 billion</strong> yearly. Paste your bill and we'll tell you in seconds.
          </p>
          <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap" }}>
            {[{ stat: "$935B", label: "Overpaid yearly" }, { stat: "80%", label: "Bills have errors" }, { stat: "10x", label: "Hospital markups" }].map(({ stat, label }, i) => (
              <div key={stat} style={{ padding: "8px clamp(12px, 4vw, 24px)", borderRight: i < 2 ? "1px solid rgba(255,255,255,0.06)" : "none", textAlign: "center" }}>
                <div style={{ fontSize: "clamp(17px, 5vw, 24px)", fontWeight: 900, color: "#10b981", textShadow: "0 0 16px rgba(16,185,129,0.3)" }}>{stat}</div>
                <div style={{ fontSize: 11, color: "#475569", marginTop: 1 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: "rgba(255,255,255,0.03)", border: focused ? "1px solid rgba(16,185,129,0.4)" : "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 20, marginBottom: 20, boxShadow: focused ? "0 0 0 3px rgba(16,185,129,0.08)" : "none", transition: "all 0.2s" }}>
          <label style={{ fontSize: 11, fontWeight: 700, color: "#475569", display: "block", marginBottom: 10, letterSpacing: "0.06em", textTransform: "uppercase" }}>
            Paste your bill, charge, or CPT code
          </label>
          <textarea
            value={bill}
            onChange={(e) => setBill(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder="e.g. CPT 99214 — $385, or paste your full bill here..."
            style={{ width: "100%", height: 110, padding: 13, border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, fontSize: 14, color: "#f1f5f9", resize: "vertical", fontFamily: FONT, lineHeight: 1.6, background: "rgba(255,255,255,0.04)", boxSizing: "border-box" }}
          />
          <div style={{ marginTop: 12, marginBottom: 16 }}>
            <div style={{ fontSize: 10, fontWeight: 600, color: "#334155", marginBottom: 8, letterSpacing: "0.08em" }}>TRY AN EXAMPLE</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {EXAMPLES.map((ex) => (
                <button key={ex} className={`chip${bill === ex ? " active" : ""}`} onClick={() => setBill(ex)} style={{ padding: "5px 13px", background: "rgba(255,255,255,0.04)", color: "#64748b", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 24, fontSize: 12, fontWeight: 500, cursor: "pointer", transition: "all 0.15s", fontFamily: FONT }}>{ex}</button>
              ))}
            </div>
          </div>
          <button className="analyze-btn" onClick={analyzeBill} disabled={loading || !bill.trim()} style={{ width: "100%", padding: "15px", background: loading || !bill.trim() ? "rgba(255,255,255,0.05)" : "linear-gradient(135deg, #10b981, #059669)", color: loading || !bill.trim() ? "#334155" : "#fff", border: "none", borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: loading || !bill.trim() ? "default" : "pointer", transition: "all 0.2s", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, boxShadow: loading || !bill.trim() ? "none" : "0 8px 28px rgba(16,185,129,0.35)", fontFamily: FONT }}>
            {loading ? (<><span style={{ width: 17, height: 17, border: "2px solid rgba(255,255,255,0.15)", borderTop: "2px solid #10b981", borderRadius: "50%", animation: "spin 0.8s linear infinite", display: "inline-block" }} />Analyzing your bill...</>) : <>⚡ Analyze My Bill — Free</>}
          </button>
        </div>

        {error && <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: 12, padding: 16, color: "#f87171", fontSize: 14, marginBottom: 16 }}>{error}</div>}

        {!result && !loading && (
          <div style={{ marginTop: 40 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: "#334155", letterSpacing: "0.12em", textAlign: "center", marginBottom: 20 }}>HOW IT WORKS</div>
            <div className="how-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
              {[{ step: "01", title: "Paste your bill", desc: "Any charge, CPT code, or full bill. No formatting needed." }, { step: "02", title: "AI scans it", desc: "We compare against fair market rates and flag every overcharge." }, { step: "03", title: "Fight back", desc: "Get exact steps to dispute, negotiate, or demand a refund." }].map(({ step, title, desc }) => (
                <div key={step} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "20px 16px" }}>
                  <div style={{ fontSize: 26, fontWeight: 900, color: "#10b981", marginBottom: 10, textShadow: "0 0 16px rgba(16,185,129,0.3)" }}>{step}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#f1f5f9", marginBottom: 4 }}>{title}</div>
                  <div style={{ fontSize: 12, color: "#64748b", lineHeight: 1.7 }}>{desc}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {result && (
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: "#334155", letterSpacing: "0.12em" }}>ANALYSIS RESULTS</div>
              <button className="reset-btn" onClick={() => { setResult(null); setBill(""); setTip(false); }} style={{ fontSize: 12, color: "#64748b", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", padding: "5px 12px", borderRadius: 8, cursor: "pointer", fontFamily: FONT, transition: "all 0.2s" }}>← Analyze another</button>
            </div>
            {parseResult(result)}
            <div style={{ marginTop: 24 }}>
              {!tip ? (
                <div style={{ background: "rgba(245,158,11,0.06)", border: "1px solid rgba(245,158,11,0.2)", borderRadius: 16, padding: 28, textAlign: "center" }}>
                  <div style={{ fontSize: 30, marginBottom: 10 }}>☕</div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: "#fbbf24", marginBottom: 8 }}>Did BillVeil help you?</div>
                  <div style={{ fontSize: 14, color: "#64748b", marginBottom: 20, lineHeight: 1.7 }}>If we saved you money, a small tip helps keep BillVeil running for the next person who needs us.</div>
                  <a href="https://buy.stripe.com/7sY3cxalf2f769Pf71bfO00" target="_blank" rel="noopener noreferrer" onClick={() => setTip(true)} style={{ display: "inline-block", padding: "12px 32px", background: "linear-gradient(135deg, #f59e0b, #d97706)", color: "#fff", borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: "pointer", boxShadow: "0 4px 20px rgba(245,158,11,0.3)", textDecoration: "none" }}>Leave a Tip ❤️</a>
                </div>
              ) : (
                <div style={{ background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: 16, padding: 28, textAlign: "center" }}>
                  <div style={{ fontSize: 36, marginBottom: 10 }}>🙏</div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: "#10b981", marginBottom: 6 }}>Thank you so much!</div>
                  <div style={{ fontSize: 14, color: "#64748b", lineHeight: 1.7 }}>Your support keeps BillVeil free for every American who needs it.</div>
                </div>
              )}
            </div>
          </div>
        )}

        <div style={{ textAlign: "center", marginTop: 56, paddingTop: 28, borderTop: "1px solid rgba(255,255,255,0.05)", fontSize: 12, color: "#1e293b", lineHeight: 2.2 }}>
          <div>🔒 BillVeil does not store your medical information</div>
          <div>Built for the 330 million Americans who deserve better</div>
        </div>

        </>}
      </div>
    </div>
  );
}
