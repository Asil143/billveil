import { useState } from "react";
import axios from "axios";
import Landing from "./Landing";
import DisputeLetter from "./DisputeLetter";
import DrugComparator from "./DrugComparator";
import DenialFighter from "./DenialFighter";

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
  @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes glow { 0%,100% { box-shadow: 0 0 20px rgba(16,185,129,0.3); } 50% { box-shadow: 0 0 40px rgba(16,185,129,0.6); } }
  @keyframes shimmer { 0% { background-position: -200% center; } 100% { background-position: 200% center; } }

  body { background: #060912; }

  .analyze-btn:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 12px 35px rgba(16,185,129,0.5) !important;
  }
  .analyze-btn:active:not(:disabled) { transform: translateY(0); }

  .chip:hover {
    background: rgba(16,185,129,0.15) !important;
    border-color: rgba(16,185,129,0.5) !important;
    color: #10b981 !important;
  }
  .chip.active {
    background: rgba(16,185,129,0.15) !important;
    border-color: #10b981 !important;
    color: #10b981 !important;
  }

  .result-card { animation: fadeUp 0.4s ease forwards; }

  .reset-btn:hover {
    background: rgba(255,255,255,0.06) !important;
    color: #f1f5f9 !important;
  }

  textarea:focus { outline: none; }

  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 3px; }
`;

export default function App() {
  const [view, setView] = useState("landing");
  const [tab, setTab] = useState("analyzer");
  const [bill, setBill] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [tip, setTip] = useState(false);
  const [focused, setFocused] = useState(false);

  if (view === "landing") return <Landing onStart={() => setView("app")} />;

  const TABS = [
    { id: "analyzer", label: "⚡ Bill Analyzer" },
    { id: "dispute", label: "✉️ Dispute Letter" },
    { id: "drug", label: "💊 Drug Prices" },
    { id: "denial", label: "⚔️ Denial Fighter" },
  ];

  const analyzeBill = async () => {
    if (!bill.trim()) return;
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
      const regex = new RegExp(`${section.key}:\\n([\\s\\S]*?)(?=\\n[A-Z ]+:|$)`);
      const match = text.match(regex);
      const content = match ? match[1].trim() : null;
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
            background: isVerdict ? verdictBg : "rgba(255,255,255,0.03)",
            border: `1px solid ${isVerdict ? verdictColor + "40" : "rgba(255,255,255,0.08)"}`,
            borderLeft: `3px solid ${isVerdict ? verdictColor : section.color}`,
            borderRadius: 12,
            padding: "20px 24px",
            marginBottom: 10,
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
            <div style={{ fontSize: 15, color: "#cbd5e1", lineHeight: 1.8, whiteSpace: "pre-line" }}>
              {content}
            </div>
          )}
        </div>
      );
    });
  };

  return (
    <div style={{ minHeight: "100vh", background: "#060912", fontFamily: FONT, color: "#f8fafc" }}>
      <style>{CSS}</style>

      {/* Background glow */}
      <div style={{ position: "fixed", top: 0, left: "50%", transform: "translateX(-50%)", width: 800, height: 400, background: "radial-gradient(ellipse at center, rgba(16,185,129,0.12) 0%, transparent 70%)", pointerEvents: "none", zIndex: 0 }} />

      {/* Header */}
      <div style={{ position: "relative", zIndex: 1, borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", backdropFilter: "blur(20px)", background: "rgba(6,9,18,0.8)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 34, height: 34, background: "linear-gradient(135deg, #10b981, #059669)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, boxShadow: "0 0 20px rgba(16,185,129,0.4)" }}>
            🛡️
          </div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800, letterSpacing: "-0.02em", background: "linear-gradient(135deg, #fff 30%, #10b981 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              BillVeil
            </div>
            <div style={{ fontSize: 10, color: "#475569", marginTop: 1, letterSpacing: "0.04em" }}>
              SEE THROUGH EVERY MEDICAL BILL
            </div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#10b981", fontWeight: 600 }}>
            <span style={{ width: 7, height: 7, background: "#10b981", borderRadius: "50%", display: "inline-block", animation: "glow 2s ease-in-out infinite" }} />
            Free forever
          </div>
        </div>
      </div>

      {/* Tab bar */}
      <div style={{ position: "relative", zIndex: 1, borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(6,9,18,0.6)", backdropFilter: "blur(20px)", overflowX: "auto" }}>
        <div style={{ maxWidth: 700, margin: "0 auto", display: "flex", padding: "0 20px" }}>
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{ padding: "14px 18px", background: "transparent", border: "none", borderBottom: `2px solid ${tab === t.id ? "#10b981" : "transparent"}`, color: tab === t.id ? "#10b981" : "#475569", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: FONT, whiteSpace: "nowrap", transition: "all 0.2s" }}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ position: "relative", zIndex: 1, maxWidth: 700, margin: "0 auto", padding: "36px 20px 40px" }}>

        {/* Non-analyzer tabs */}
        {tab === "dispute" && <DisputeLetter />}
        {tab === "drug" && <DrugComparator />}
        {tab === "denial" && <DenialFighter />}

        {/* Analyzer tab */}
        {tab === "analyzer" && <>

        {/* Hero */}
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <h1 style={{ fontSize: 36, fontWeight: 900, lineHeight: 1.15, letterSpacing: "-0.03em", marginBottom: 12 }}>
            <span style={{ background: "linear-gradient(135deg, #f8fafc 0%, #f8fafc 50%, #10b981 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Is your medical
            </span>
            {" "}
            <span style={{ background: "linear-gradient(135deg, #10b981 0%, #34d399 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              bill fair?
            </span>
          </h1>

          <p style={{ fontSize: 18, color: "#64748b", lineHeight: 1.7, maxWidth: 480, margin: "0 auto 36px" }}>
            Americans overpay <strong style={{ color: "#94a3b8" }}>$935 billion</strong> every year on medical bills. We give you the weapon to fight back.
          </p>

          {/* Stats */}
          <div style={{ display: "flex", justifyContent: "center", gap: 0, marginBottom: 0 }}>
            {[
              { stat: "$935B", label: "Overpaid yearly" },
              { stat: "80%", label: "Bills have errors" },
              { stat: "10x", label: "Hospital markups" },
            ].map(({ stat, label }, i) => (
              <div key={stat} style={{ padding: "16px 32px", borderRight: i < 2 ? "1px solid rgba(255,255,255,0.06)" : "none", textAlign: "center" }}>
                <div style={{ fontSize: 26, fontWeight: 900, background: "linear-gradient(135deg, #10b981, #34d399)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", letterSpacing: "-0.02em" }}>
                  {stat}
                </div>
                <div style={{ fontSize: 11, color: "#475569", marginTop: 3, fontWeight: 500 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Input card */}
        <div style={{ background: "rgba(255,255,255,0.03)", border: focused ? "1px solid rgba(16,185,129,0.5)" : "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 28, marginBottom: 20, backdropFilter: "blur(20px)", boxShadow: focused ? "0 0 0 4px rgba(16,185,129,0.08), 0 20px 60px rgba(0,0,0,0.4)" : "0 20px 60px rgba(0,0,0,0.3)", transition: "all 0.25s" }}>
          <label style={{ fontSize: 12, fontWeight: 700, color: "#94a3b8", display: "block", marginBottom: 12, letterSpacing: "0.06em", textTransform: "uppercase" }}>
            Paste your bill, charge, or CPT code
          </label>
          <textarea
            value={bill}
            onChange={(e) => setBill(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder="e.g. CPT 99214 — $385, or paste your full bill here..."
            style={{ width: "100%", height: 110, padding: 16, border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10, fontSize: 15, color: "#f1f5f9", resize: "vertical", fontFamily: FONT, lineHeight: 1.6, background: "rgba(255,255,255,0.04)", boxSizing: "border-box", transition: "border 0.2s" }}
          />

          {/* Example chips */}
          <div style={{ marginTop: 14, marginBottom: 20 }}>
            <div style={{ fontSize: 10, fontWeight: 600, color: "#334155", marginBottom: 8, letterSpacing: "0.08em" }}>TRY AN EXAMPLE</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {EXAMPLES.map((ex) => (
                <button
                  key={ex}
                  className={`chip${bill === ex ? " active" : ""}`}
                  onClick={() => setBill(ex)}
                  style={{ padding: "5px 13px", background: "rgba(255,255,255,0.04)", color: "#64748b", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 24, fontSize: 12, fontWeight: 500, cursor: "pointer", transition: "all 0.15s", fontFamily: FONT }}
                >
                  {ex}
                </button>
              ))}
            </div>
          </div>

          <button
            className="analyze-btn"
            onClick={analyzeBill}
            disabled={loading || !bill.trim()}
            style={{ width: "100%", padding: "16px", background: loading || !bill.trim() ? "rgba(255,255,255,0.05)" : "linear-gradient(135deg, #10b981, #059669)", color: loading || !bill.trim() ? "#334155" : "#fff", border: loading || !bill.trim() ? "1px solid rgba(255,255,255,0.06)" : "none", borderRadius: 12, fontSize: 16, fontWeight: 700, cursor: loading || !bill.trim() ? "default" : "pointer", transition: "all 0.25s", letterSpacing: "0.01em", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, boxShadow: loading || !bill.trim() ? "none" : "0 8px 25px rgba(16,185,129,0.35)", fontFamily: FONT }}
          >
            {loading ? (
              <>
                <span style={{ width: 18, height: 18, border: "2px solid rgba(255,255,255,0.2)", borderTop: "2px solid #10b981", borderRadius: "50%", animation: "spin 0.8s linear infinite", display: "inline-block" }} />
                Analyzing your bill...
              </>
            ) : (
              <>⚡ Analyze My Bill — Free</>
            )}
          </button>
        </div>

        {/* Error */}
        {error && (
          <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: 12, padding: 16, color: "#f87171", fontSize: 14, marginBottom: 16 }}>
            {error}
          </div>
        )}

        {/* How it works */}
        {!result && !loading && (
          <div style={{ marginTop: 48 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: "#334155", letterSpacing: "0.12em", textAlign: "center", marginBottom: 24 }}>HOW IT WORKS</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
              {[
                { step: "01", title: "Paste your bill", desc: "Any charge, CPT code, or full bill. No formatting needed." },
                { step: "02", title: "AI scans it", desc: "We compare against fair market rates and flag every overcharge." },
                { step: "03", title: "Fight back", desc: "Get exact steps to dispute, negotiate, or demand a refund." },
              ].map(({ step, title, desc }) => (
                <div key={step} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, padding: "22px 18px" }}>
                  <div style={{ fontSize: 28, fontWeight: 900, background: "linear-gradient(135deg, #10b981, #34d399)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", marginBottom: 10, letterSpacing: "-0.02em" }}>{step}</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#f1f5f9", marginBottom: 6 }}>{title}</div>
                  <div style={{ fontSize: 12, color: "#475569", lineHeight: 1.7 }}>{desc}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Results */}
        {result && (
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: "#334155", letterSpacing: "0.12em" }}>ANALYSIS RESULTS</div>
              <button
                className="reset-btn"
                onClick={() => { setResult(null); setBill(""); setTip(false); }}
                style={{ fontSize: 12, color: "#475569", background: "transparent", border: "1px solid rgba(255,255,255,0.06)", padding: "5px 12px", borderRadius: 8, cursor: "pointer", fontFamily: FONT, transition: "all 0.2s" }}
              >
                ← Analyze another
              </button>
            </div>

            {parseResult(result)}

            {/* Tip Jar */}
            <div style={{ marginTop: 24 }}>
              {!tip ? (
                <div style={{ background: "rgba(251,191,36,0.06)", border: "1px solid rgba(251,191,36,0.2)", borderRadius: 16, padding: 28, textAlign: "center" }}>
                  <div style={{ fontSize: 32, marginBottom: 12 }}>☕</div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: "#fbbf24", marginBottom: 8 }}>Did BillVeil help you?</div>
                  <div style={{ fontSize: 14, color: "#78716c", marginBottom: 24, lineHeight: 1.7 }}>
                    BillVeil is free forever. If we saved you money, a small tip keeps us running for the next person who needs us.
                  </div>
                  <button
                    onClick={() => setTip(true)}
                    style={{ padding: "13px 36px", background: "linear-gradient(135deg, #f59e0b, #d97706)", color: "#fff", border: "none", borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: "pointer", boxShadow: "0 8px 25px rgba(245,158,11,0.35)", fontFamily: FONT, transition: "all 0.2s" }}
                  >
                    Leave a Tip ❤️
                  </button>
                </div>
              ) : (
                <div style={{ background: "rgba(52,211,153,0.06)", border: "1px solid rgba(52,211,153,0.2)", borderRadius: 16, padding: 28, textAlign: "center" }}>
                  <div style={{ fontSize: 40, marginBottom: 12 }}>🙏</div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: "#34d399", marginBottom: 8 }}>Thank you so much!</div>
                  <div style={{ fontSize: 14, color: "#475569", lineHeight: 1.7 }}>
                    Your support keeps BillVeil free for every American who needs it. You are part of the solution.
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Footer */}
        <div style={{ textAlign: "center", marginTop: 60, paddingTop: 32, borderTop: "1px solid rgba(255,255,255,0.04)", fontSize: 12, color: "#1e293b", lineHeight: 2.2 }}>
          <div>🔒 BillVeil does not store your medical information</div>
          <div>Built for the 330 million Americans who deserve better</div>
        </div>

        </>}
      </div>
    </div>
  );
}
