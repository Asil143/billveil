import { useState } from "react";
import { useAuth } from "./AuthContext";
import axios from "axios";

const FONT = "'Inter', system-ui, sans-serif";
const IS = { width: "100%", padding: "11px 14px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, fontSize: 14, color: "#f1f5f9", fontFamily: FONT, outline: "none", boxSizing: "border-box" };

const SECTIONS = [
  { key: "VERDICT", emoji: "⚖️", color: "#fbbf24" },
  { key: "WHAT THE NO SURPRISES ACT SAYS", emoji: "📜", color: "#60a5fa" },
  { key: "WHY THIS BILL MAY BE ILLEGAL", emoji: "🚨", color: "#f87171" },
  { key: "YOUR PROTECTIONS", emoji: "🛡️", color: "#34d399" },
  { key: "WHAT TO DO RIGHT NOW", emoji: "✅", color: "#10b981" },
  { key: "HOW TO DISPUTE IT", emoji: "📋", color: "#a78bfa" },
  { key: "KEY DEADLINES", emoji: "⏰", color: "#f87171" },
];

function parse(text) {
  return SECTIONS.map((s, i) => {
    const m = text.match(new RegExp(`${s.key}:\\n([\\s\\S]*?)(?=\\n[A-Z][A-Z ']+:|$)`));
    const content = m ? m[1].trim() : null;
    if (!content) return null;
    const isVerdict = s.key === "VERDICT";
    const isIllegal = content.includes("LIKELY VIOLATES") || content.includes("POSSIBLY VIOLATES");
    return (
      <div key={s.key} style={{ background: isVerdict && isIllegal ? "rgba(239,68,68,0.07)" : "rgba(255,255,255,0.03)", border: `1px solid ${isVerdict && isIllegal ? "rgba(239,68,68,0.25)" : "rgba(255,255,255,0.08)"}`, borderLeft: `3px solid ${s.color}`, borderRadius: 12, padding: "16px 20px", marginBottom: 10, animation: "fadeUp 0.35s ease forwards", animationDelay: `${i * 0.06}s`, animationFillMode: "both" }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: s.color, letterSpacing: "0.12em", marginBottom: 8, textTransform: "uppercase" }}>{s.emoji} {s.key}</div>
        <div style={{ fontSize: 14, color: "#cbd5e1", lineHeight: 1.8, whiteSpace: "pre-line" }}>{content}</div>
      </div>
    );
  });
}

export default function SurpriseBillingChecker() {
  const { consumeCredit } = useAuth();
  const [bill, setBill] = useState("");
  const [situation, setSituation] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [focused, setFocused] = useState(null);

  const run = async () => {
    if (!bill.trim() || !consumeCredit()) return;
    setLoading(true); setResult(null); setError(null);
    try { const r = await axios.post("/api/tools", { tool: "surprisebill", bill, situation }); setResult(r.data.result); }
    catch { setError("Something went wrong. Please try again."); }
    finally { setLoading(false); }
  };

  return (
    <div>
      <div style={{ textAlign: "center", marginBottom: 28 }}>
        <h1 style={{ fontSize: "clamp(22px, 6vw, 32px)", fontWeight: 900, letterSpacing: "-0.03em", marginBottom: 8, color: "#f1f5f9" }}>
          Is this a <span style={{ color: "#10b981", textShadow: "0 0 20px rgba(16,185,129,0.4)" }}>surprise bill?</span>
        </h1>
        <p style={{ fontSize: 15, color: "#64748b", lineHeight: 1.6, maxWidth: 460, margin: "0 auto" }}>The No Surprises Act (2022) bans many unexpected out-of-network bills. Check if yours violates federal law.</p>
      </div>
      <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 20, marginBottom: 20 }}>
        <div style={{ marginBottom: 12 }}>
          <label style={{ fontSize: 11, fontWeight: 700, color: "#475569", display: "block", marginBottom: 6, letterSpacing: "0.06em", textTransform: "uppercase" }}>Describe the bill</label>
          <textarea value={bill} onChange={e => setBill(e.target.value)} onFocus={() => setFocused("bill")} onBlur={() => setFocused(null)} placeholder="e.g. I went to an in-network ER but got a separate bill from an out-of-network anesthesiologist for $3,200..." style={{ ...IS, height: 90, resize: "vertical", border: focused === "bill" ? "1px solid rgba(16,185,129,0.5)" : "1px solid rgba(255,255,255,0.08)" }} />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 11, fontWeight: 700, color: "#475569", display: "block", marginBottom: 6, letterSpacing: "0.06em", textTransform: "uppercase" }}>Additional context <span style={{ fontWeight: 400, color: "#334155", textTransform: "none" }}>optional</span></label>
          <input value={situation} onChange={e => setSituation(e.target.value)} onFocus={() => setFocused("sit")} onBlur={() => setFocused(null)} placeholder="e.g. emergency visit, air ambulance, facility was in-network" style={{ ...IS, border: focused === "sit" ? "1px solid rgba(16,185,129,0.5)" : "1px solid rgba(255,255,255,0.08)" }} />
        </div>
        <button onClick={run} disabled={loading || !bill.trim()} style={{ width: "100%", padding: 14, background: loading || !bill.trim() ? "rgba(255,255,255,0.05)" : "linear-gradient(135deg,#10b981,#059669)", color: loading || !bill.trim() ? "#334155" : "#fff", border: "none", borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: loading || !bill.trim() ? "default" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, fontFamily: FONT, boxShadow: loading || !bill.trim() ? "none" : "0 8px 28px rgba(16,185,129,0.35)" }}>
          {loading ? <><span style={{ width: 17, height: 17, border: "2px solid rgba(255,255,255,0.15)", borderTop: "2px solid #10b981", borderRadius: "50%", animation: "spin 0.8s linear infinite", display: "inline-block" }} />Checking...</> : "🔍 Check My Bill"}
        </button>
      </div>
      {error && <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: 12, padding: 16, color: "#f87171", fontSize: 14, marginBottom: 16 }}>{error}</div>}
      {result && (
        <div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: "#334155", letterSpacing: "0.12em" }}>NO SURPRISES ACT ANALYSIS</div>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => { navigator.clipboard.writeText(result); setCopied(true); setTimeout(() => setCopied(false), 2000); }} style={{ fontSize: 12, color: copied ? "#10b981" : "#64748b", background: "rgba(255,255,255,0.04)", border: `1px solid ${copied ? "rgba(16,185,129,0.3)" : "rgba(255,255,255,0.08)"}`, padding: "5px 12px", borderRadius: 8, cursor: "pointer", fontFamily: FONT }}>{copied ? "✓ Copied" : "Copy"}</button>
              <button onClick={() => { setResult(null); setBill(""); setSituation(""); }} style={{ fontSize: 12, color: "#64748b", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", padding: "5px 12px", borderRadius: 8, cursor: "pointer", fontFamily: FONT }}>← New Check</button>
            </div>
          </div>
          {parse(result)}
        </div>
      )}
    </div>
  );
}
