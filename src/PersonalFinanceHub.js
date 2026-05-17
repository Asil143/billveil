import { useState, useEffect } from "react";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "./firebase";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";

const FONT = "'Inter', system-ui, sans-serif";

const QUICK_TOOLS = [
  { tab: "billscan", emoji: "📸", label: "Bill Scan", color: "#10b981", desc: "Scan any bill instantly" },
  { tab: "dispute", emoji: "✉️", label: "Dispute Letter", color: "#f87171", desc: "Write a dispute" },
  { tab: "denial", emoji: "⚔️", label: "Denial Fighter", color: "#f87171", desc: "Fight claim denials" },
  { tab: "negotiate", emoji: "📞", label: "Negotiation Script", color: "#f87171", desc: "Call billing" },
  { tab: "concierge", emoji: "🤖", label: "AI Concierge", color: "#10b981", desc: "Ask anything" },
  { tab: "eob", emoji: "📋", label: "EOB Explainer", color: "#60a5fa", desc: "Decode your EOB" },
  { tab: "drug", emoji: "💊", label: "Drug Prices", color: "#34d399", desc: "Find cheaper meds" },
  { tab: "hospitalprice", emoji: "🏥", label: "Hospital Prices", color: "#60a5fa", desc: "Look up price files" },
  { tab: "priceboard", emoji: "👥", label: "Price Board", color: "#a78bfa", desc: "Community prices" },
  { tab: "planoptimizer", emoji: "📈", label: "Plan Optimizer", color: "#fbbf24", desc: "Best insurance plan" },
  { tab: "casetracker", emoji: "📊", label: "Case Tracker", color: "#a78bfa", desc: "Track disputes" },
  { tab: "costestimate", emoji: "🔮", label: "Cost Estimator", color: "#34d399", desc: "Pre-treatment costs" },
];

function scoreFromCases(cases) {
  const won = cases.filter(c => c.status === "won").length;
  const filed = cases.filter(c => ["in_progress", "appealed", "won", "lost"].includes(c.status)).length;
  const totalBilled = cases.reduce((s, c) => s + (c.amountBilled || 0), 0);
  const totalSaved = cases.filter(c => c.status === "won").reduce((s, c) => s + (c.amountSaved || 0), 0);
  const savingsRatio = totalBilled > 0 ? totalSaved / totalBilled : 0;
  const score = Math.min(850, Math.round(300 + Math.min(won * 80, 320) + Math.min(filed * 15, 120) + Math.min(savingsRatio * 110, 110)));
  return { score, won, filed, totalBilled, totalSaved };
}

function scoreTier(score) {
  if (score >= 750) return { label: "Expert", color: "#10b981" };
  if (score >= 600) return { label: "Fighter", color: "#60a5fa" };
  if (score >= 450) return { label: "Active", color: "#a78bfa" };
  if (score >= 300) return { label: "Starting Out", color: "#fbbf24" };
  return { label: "New", color: "#64748b" };
}

export default function PersonalFinanceHub() {
  const { user, showLoginModal, initials, profileData } = useAuth();
  const navigate = useNavigate();
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    const q = query(collection(db, "users", user.uid, "cases"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, snap => {
      setCases(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
    return unsub;
  }, [user]);

  if (!user) {
    return (
      <div style={{ textAlign: "center", padding: "60px 20px" }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🗂️</div>
        <div style={{ fontSize: 20, fontWeight: 800, color: "#f1f5f9", marginBottom: 8 }}>Your Medical Finance Hub</div>
        <div style={{ fontSize: 14, color: "#64748b", marginBottom: 24, lineHeight: 1.7, maxWidth: 360, margin: "0 auto 24px" }}>
          Sign in to see your personalized dashboard — score, savings, active cases, and quick access to every tool.
        </div>
        <button onClick={showLoginModal} style={{ padding: "13px 32px", background: "linear-gradient(135deg, #10b981, #059669)", color: "#fff", border: "none", borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: FONT, boxShadow: "0 8px 28px rgba(16,185,129,0.35)" }}>
          Sign In / Sign Up
        </button>
      </div>
    );
  }

  const { score, won, totalBilled, totalSaved } = scoreFromCases(cases);
  const tier = scoreTier(score);
  const inProgress = cases.filter(c => ["in_progress", "appealed"].includes(c.status)).length;
  const displayName = profileData?.name?.split(" ")[0] || initials || "there";

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 13, color: "#475569", marginBottom: 4 }}>Welcome back,</div>
        <h1 style={{ fontSize: "clamp(22px, 6vw, 30px)", fontWeight: 900, letterSpacing: "-0.03em", color: "#f1f5f9", marginBottom: 4 }}>
          {displayName} <span style={{ color: tier.color }}>{tier.label}</span>
        </h1>
        <div style={{ fontSize: 13, color: "#475569" }}>Here's your complete medical billing picture.</div>
      </div>

      {/* Score + Stats row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 3fr", gap: 12, marginBottom: 20 }}>
        {/* Score card */}
        <div style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${tier.color}40`, borderRadius: 16, padding: "20px 16px", textAlign: "center", cursor: "pointer" }} onClick={() => navigate("/savings")}>
          <div style={{ fontSize: 10, fontWeight: 700, color: "#475569", letterSpacing: "0.1em", marginBottom: 8 }}>BILLVEIL SCORE</div>
          <div style={{ fontSize: 42, fontWeight: 900, color: tier.color, lineHeight: 1, marginBottom: 4, textShadow: `0 0 24px ${tier.color}60` }}>{loading ? "—" : score}</div>
          <div style={{ fontSize: 11, fontWeight: 700, color: tier.color, background: `${tier.color}18`, border: `1px solid ${tier.color}30`, padding: "2px 10px", borderRadius: 8, display: "inline-block" }}>{tier.label}</div>
          <div style={{ fontSize: 10, color: "#334155", marginTop: 8 }}>out of 850 · tap to view</div>
        </div>

        {/* Stats grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {[
            { label: "Total Saved", value: loading ? "—" : `$${totalSaved.toLocaleString()}`, color: "#10b981" },
            { label: "Cases Won", value: loading ? "—" : won, color: "#34d399" },
            { label: "In Progress", value: loading ? "—" : inProgress, color: "#fbbf24" },
            { label: "Total Billed", value: loading ? "—" : `$${totalBilled.toLocaleString()}`, color: "#94a3b8" },
          ].map(({ label, value, color }) => (
            <div key={label} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: "14px 16px" }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: "#475569", letterSpacing: "0.08em", marginBottom: 6 }}>{label.toUpperCase()}</div>
              <div style={{ fontSize: 22, fontWeight: 900, color }}>{value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Action buttons */}
      <div style={{ display: "flex", gap: 10, marginBottom: 24, flexWrap: "wrap" }}>
        <button onClick={() => navigate("/casetracker")} style={{ padding: "10px 18px", background: "linear-gradient(135deg, #10b981, #059669)", color: "#fff", border: "none", borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: FONT, boxShadow: "0 4px 16px rgba(16,185,129,0.3)" }}>
          + New Case
        </button>
        <button onClick={() => navigate("/savings")} style={{ padding: "10px 18px", background: "rgba(255,255,255,0.04)", color: "#94a3b8", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: FONT }}>
          View Full Dashboard →
        </button>
        <button onClick={() => navigate("/billscan")} style={{ padding: "10px 18px", background: "rgba(255,255,255,0.04)", color: "#94a3b8", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: FONT }}>
          📸 Scan a Bill
        </button>
      </div>

      {/* Recent cases */}
      {!loading && cases.length > 0 && (
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: "#475569", letterSpacing: "0.1em", marginBottom: 12 }}>RECENT CASES</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {cases.slice(0, 3).map(c => {
              const statusColors = { open: "#60a5fa", in_progress: "#fbbf24", appealed: "#a78bfa", won: "#10b981", lost: "#f87171", closed: "#475569" };
              const col = statusColors[c.status] || "#64748b";
              return (
                <div key={c.id} onClick={() => navigate("/casetracker")} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer" }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#f1f5f9", marginBottom: 2 }}>{c.title}</div>
                    <div style={{ fontSize: 11, color: "#475569" }}>{c.hospital || "No hospital"} · ${(c.amountBilled || 0).toLocaleString()} billed</div>
                  </div>
                  <div style={{ fontSize: 10, fontWeight: 700, color: col, background: `${col}18`, border: `1px solid ${col}30`, padding: "3px 10px", borderRadius: 8, whiteSpace: "nowrap", marginLeft: 12 }}>
                    {c.status?.replace("_", " ").toUpperCase()}
                  </div>
                </div>
              );
            })}
            {cases.length > 3 && (
              <button onClick={() => navigate("/casetracker")} style={{ background: "none", border: "1px dashed rgba(255,255,255,0.08)", borderRadius: 12, padding: "10px", color: "#475569", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: FONT }}>
                View all {cases.length} cases →
              </button>
            )}
          </div>
        </div>
      )}

      {!loading && cases.length === 0 && (
        <div style={{ background: "rgba(16,185,129,0.04)", border: "1px dashed rgba(16,185,129,0.2)", borderRadius: 14, padding: "24px 20px", marginBottom: 28, textAlign: "center" }}>
          <div style={{ fontSize: 28, marginBottom: 8 }}>📊</div>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#f1f5f9", marginBottom: 4 }}>No cases yet</div>
          <div style={{ fontSize: 13, color: "#64748b", marginBottom: 14 }}>Start tracking a dispute, negotiation, or appeal to earn your BillVeil Score.</div>
          <button onClick={() => navigate("/casetracker")} style={{ padding: "9px 20px", background: "linear-gradient(135deg, #10b981, #059669)", color: "#fff", border: "none", borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: FONT }}>
            Open Case Tracker
          </button>
        </div>
      )}

      {/* Quick tools grid */}
      <div style={{ fontSize: 10, fontWeight: 700, color: "#475569", letterSpacing: "0.1em", marginBottom: 12 }}>QUICK ACCESS</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 10 }}>
        {QUICK_TOOLS.map(t => (
          <button key={t.tab} onClick={() => navigate(`/${t.tab}`)} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: "14px 12px", cursor: "pointer", textAlign: "left", fontFamily: FONT, transition: "all 0.15s" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = `${t.color}60`; e.currentTarget.style.background = `${t.color}08`; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.background = "rgba(255,255,255,0.03)"; }}>
            <div style={{ fontSize: 22, marginBottom: 6 }}>{t.emoji}</div>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#f1f5f9", marginBottom: 2 }}>{t.label}</div>
            <div style={{ fontSize: 10, color: "#475569" }}>{t.desc}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
