import { useState, useEffect } from "react";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "./firebase";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";

const FONT = "'Inter', system-ui, sans-serif";

function computeScore(cases) {
  if (!cases.length) return 300;
  const won = cases.filter(c => c.status === "won").length;
  const filed = cases.length;
  const totalSaved = cases.reduce((s, c) => s + (c.amountSaved || 0), 0);
  const totalBilled = cases.reduce((s, c) => s + (c.amountBilled || 0), 0);
  const savingsRatio = totalBilled > 0 ? totalSaved / totalBilled : 0;
  let score = 300;
  score += Math.min(won * 80, 320);
  score += Math.min(filed * 15, 120);
  score += Math.min(Math.round(savingsRatio * 110), 110);
  return Math.min(score, 850);
}

function scoreLabel(score) {
  if (score >= 750) return { label: "Expert", color: "#10b981", desc: "You're a medical billing master. Most patients never fight back." };
  if (score >= 600) return { label: "Fighter", color: "#34d399", desc: "Strong record. You know your rights and use them." };
  if (score >= 450) return { label: "Active", color: "#60a5fa", desc: "Good progress. Keep disputing and tracking outcomes." };
  if (score >= 300) return { label: "Starting Out", color: "#fbbf24", desc: "Just getting started. File your first case to build your score." };
  return { label: "New", color: "#94a3b8", desc: "Log your first case to start building your BillVeil Score." };
}

export default function SavingsDashboard() {
  const { user, showLoginModal } = useAuth();
  const navigate = useNavigate();
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (user === undefined) return;
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
        <div style={{ fontSize: 48, marginBottom: 16 }}>🏆</div>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: "#f1f5f9", marginBottom: 8 }}>Savings Dashboard</h2>
        <p style={{ fontSize: 14, color: "#64748b", marginBottom: 24, lineHeight: 1.6 }}>See your BillVeil Score, total savings, and every case outcome. Log in to view your dashboard.</p>
        <button onClick={showLoginModal} style={{ padding: "12px 28px", background: "linear-gradient(135deg, #10b981, #059669)", color: "#fff", border: "none", borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: FONT }}>Log In to View Dashboard</button>
      </div>
    );
  }

  if (loading) return <div style={{ textAlign: "center", padding: 40, color: "#334155", fontFamily: FONT }}>Loading dashboard...</div>;

  const totalBilled = cases.reduce((s, c) => s + (c.amountBilled || 0), 0);
  const totalSaved = cases.reduce((s, c) => s + (c.amountSaved || 0), 0);
  const won = cases.filter(c => c.status === "won").length;
  const lost = cases.filter(c => c.status === "lost").length;
  const inProgress = cases.filter(c => ["open", "in_progress", "appealed"].includes(c.status)).length;
  const score = computeScore(cases);
  const { label: scoreText, color: scoreColor, desc: scoreDesc } = scoreLabel(score);
  const scorePercent = score / 850;

  const savingsPct = totalBilled > 0 ? Math.round((totalSaved / totalBilled) * 100) : 0;

  const scoreBreakdown = [
    { label: "Cases filed", pts: Math.min(cases.length * 15, 120), maxPts: 120, display: `${cases.length} filed` },
    { label: "Cases won", pts: Math.min(won * 80, 320), maxPts: 320, display: `${won} won` },
    { label: "Savings ratio", pts: Math.min(Math.round((totalBilled > 0 ? totalSaved / totalBilled : 0) * 110), 110), maxPts: 110, display: totalBilled > 0 ? `${savingsPct}%` : "—" },
  ];

  const shareText = `My BillVeil Score: ${score}/850 (${scoreText})\nTotal saved: $${totalSaved.toLocaleString()}\nCases won: ${won}/${cases.length}\nbillveil.com`;

  return (
    <div>
      <div style={{ textAlign: "center", marginBottom: 28 }}>
        <h1 style={{ fontSize: "clamp(22px, 6vw, 32px)", fontWeight: 900, letterSpacing: "-0.03em", marginBottom: 8, color: "#f1f5f9" }}>
          Savings <span style={{ color: "#10b981", textShadow: "0 0 20px rgba(16,185,129,0.4)" }}>Dashboard</span>
        </h1>
        <p style={{ fontSize: 15, color: "#64748b", lineHeight: 1.6 }}>Your complete billing health — score, savings, and every outcome.</p>
      </div>

      {/* BillVeil Score card */}
      <div style={{ background: "linear-gradient(135deg, rgba(16,185,129,0.08), rgba(5,150,105,0.03))", border: "1px solid rgba(16,185,129,0.2)", borderRadius: 20, padding: "28px 24px", marginBottom: 20, textAlign: "center" }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: "#475569", letterSpacing: "0.14em", marginBottom: 14 }}>BILLVEIL SCORE</div>
        <div style={{ fontSize: "clamp(64px, 16vw, 88px)", fontWeight: 900, color: scoreColor, lineHeight: 1, marginBottom: 6, textShadow: `0 0 40px ${scoreColor}50` }}>{score}</div>
        <div style={{ fontSize: 12, color: "#334155", marginBottom: 20, fontWeight: 600 }}>out of 850</div>

        <div style={{ height: 8, background: "rgba(255,255,255,0.06)", borderRadius: 4, overflow: "hidden", margin: "0 auto 20px", maxWidth: 340 }}>
          <div style={{ height: "100%", width: `${scorePercent * 100}%`, background: `linear-gradient(to right, #059669, ${scoreColor})`, borderRadius: 4 }} />
        </div>

        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: `${scoreColor}18`, border: `1px solid ${scoreColor}35`, padding: "7px 20px", borderRadius: 24, marginBottom: 10 }}>
          <span style={{ width: 8, height: 8, background: scoreColor, borderRadius: "50%", display: "inline-block" }} />
          <span style={{ fontSize: 13, fontWeight: 800, color: scoreColor, fontFamily: FONT }}>{scoreText}</span>
        </div>
        <div style={{ fontSize: 13, color: "#64748b", lineHeight: 1.6, maxWidth: 380, margin: "0 auto 22px", fontFamily: FONT }}>{scoreDesc}</div>

        <button
          onClick={() => { navigator.clipboard.writeText(shareText); setCopied(true); setTimeout(() => setCopied(false), 2500); }}
          style={{ padding: "9px 22px", background: copied ? "rgba(16,185,129,0.12)" : "rgba(255,255,255,0.05)", border: `1px solid ${copied ? "rgba(16,185,129,0.3)" : "rgba(255,255,255,0.1)"}`, borderRadius: 10, color: copied ? "#10b981" : "#64748b", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: FONT, transition: "all 0.2s" }}
        >
          {copied ? "✓ Copied to clipboard" : "📤 Share My Score"}
        </button>
      </div>

      {/* Stats grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
        {[
          { label: "Total Billed", value: `$${totalBilled.toLocaleString()}`, color: "#f87171", emoji: "💸", sub: "across all cases" },
          { label: "Total Saved", value: `$${totalSaved.toLocaleString()}`, color: "#34d399", emoji: "💰", sub: totalBilled > 0 ? `${savingsPct}% reduction` : "log wins to track" },
          { label: "Cases Won", value: `${won}`, color: "#10b981", emoji: "🏆", sub: `of ${cases.length} total` },
          { label: "In Progress", value: `${inProgress}`, color: "#60a5fa", emoji: "⚡", sub: `${lost} lost or closed` },
        ].map(stat => (
          <div key={stat.label} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: "18px 16px", textAlign: "center" }}>
            <div style={{ fontSize: 22, marginBottom: 6 }}>{stat.emoji}</div>
            <div style={{ fontSize: "clamp(20px, 5vw, 28px)", fontWeight: 900, color: stat.color, marginBottom: 3, fontFamily: FONT }}>{stat.value}</div>
            <div style={{ fontSize: 11, color: "#64748b", fontWeight: 700, marginBottom: 2 }}>{stat.label}</div>
            <div style={{ fontSize: 10, color: "#334155" }}>{stat.sub}</div>
          </div>
        ))}
      </div>

      {/* Score breakdown */}
      <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, padding: "18px 20px", marginBottom: 20 }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: "#334155", letterSpacing: "0.12em", marginBottom: 16 }}>HOW YOUR SCORE IS CALCULATED</div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12, padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
          <span style={{ fontSize: 13, color: "#64748b", fontFamily: FONT }}>Base score</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: "#334155", fontFamily: FONT }}>+300 pts</span>
        </div>
        {scoreBreakdown.map(row => (
          <div key={row.label} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
            <div style={{ flex: 1, fontSize: 13, color: "#64748b", fontFamily: FONT }}>{row.label}</div>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#475569", minWidth: 36, textAlign: "right", fontFamily: FONT }}>{row.display}</div>
            <div style={{ width: 80, height: 6, background: "rgba(255,255,255,0.06)", borderRadius: 3, overflow: "hidden", flexShrink: 0 }}>
              <div style={{ height: "100%", width: `${row.maxPts > 0 ? (row.pts / row.maxPts) * 100 : 0}%`, background: "linear-gradient(to right, #10b981, #059669)", borderRadius: 3 }} />
            </div>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#10b981", minWidth: 52, textAlign: "right", fontFamily: FONT }}>+{row.pts} pts</div>
          </div>
        ))}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 12, marginTop: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: "#94a3b8", fontFamily: FONT }}>Total Score</span>
          <span style={{ fontSize: 15, fontWeight: 900, color: scoreColor, fontFamily: FONT }}>{score} / 850</span>
        </div>
      </div>

      {/* Recent wins */}
      {won > 0 && (
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: "#334155", letterSpacing: "0.12em", marginBottom: 12 }}>RECENT WINS</div>
          {cases.filter(c => c.status === "won").slice(0, 3).map(c => (
            <div key={c.id} style={{ background: "rgba(52,211,153,0.04)", border: "1px solid rgba(52,211,153,0.15)", borderRadius: 12, padding: "14px 16px", marginBottom: 8, display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: 20, flexShrink: 0 }}>🏆</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#f1f5f9", marginBottom: 2 }}>{c.title}</div>
                <div style={{ fontSize: 12, color: "#475569" }}>{c.hospital || "Unknown provider"}</div>
              </div>
              {c.amountSaved > 0 && (
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <div style={{ fontSize: 15, fontWeight: 900, color: "#34d399" }}>${c.amountSaved.toLocaleString()}</div>
                  <div style={{ fontSize: 10, color: "#475569" }}>saved</div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {cases.length === 0 ? (
        <div style={{ textAlign: "center", padding: "32px 20px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14 }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>📊</div>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#475569", marginBottom: 6, fontFamily: FONT }}>No cases tracked yet</div>
          <div style={{ fontSize: 13, color: "#334155", marginBottom: 20, fontFamily: FONT }}>Add a case to start building your score and tracking savings.</div>
          <button onClick={() => navigate("/casetracker")} style={{ padding: "10px 24px", background: "linear-gradient(135deg, #10b981, #059669)", color: "#fff", border: "none", borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: FONT }}>📊 Open Case Tracker</button>
        </div>
      ) : (
        <button onClick={() => navigate("/casetracker")} style={{ width: "100%", padding: 14, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, color: "#64748b", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: FONT }}>→ Manage Cases in Case Tracker</button>
      )}

      {lost > 0 && (
        <div style={{ marginTop: 16, background: "rgba(239,68,68,0.04)", border: "1px solid rgba(239,68,68,0.12)", borderRadius: 12, padding: "12px 16px", fontSize: 13, color: "#64748b", lineHeight: 1.7, fontFamily: FONT }}>
          💡 You have {lost} case{lost > 1 ? "s" : ""} that didn't go your way. You can still appeal to your state insurance commissioner or file in small claims court.
        </div>
      )}
    </div>
  );
}
