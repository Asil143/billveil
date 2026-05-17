'use client';
import { useState } from "react";
import { useAuth } from "./AuthContext";
import axios from "axios";

const FONT = "'Inter', system-ui, sans-serif";
const IS = { width: "100%", padding: "11px 14px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, fontSize: 14, color: "#f1f5f9", fontFamily: FONT, outline: "none", boxSizing: "border-box" };

const SECTIONS = [
  { key: "PLAN TYPE", emoji: "🏷️", color: "#60a5fa" },
  { key: "DEDUCTIBLE", emoji: "💳", color: "#fbbf24" },
  { key: "OUT-OF-POCKET MAXIMUM", emoji: "🛑", color: "#f87171" },
  { key: "WHAT'S COVERED", emoji: "✅", color: "#34d399" },
  { key: "WHAT'S NOT COVERED", emoji: "🚫", color: "#f87171" },
  { key: "IN-NETWORK vs OUT-OF-NETWORK", emoji: "🗺️", color: "#a78bfa" },
  { key: "HIDDEN GOTCHAS", emoji: "⚠️", color: "#fbbf24" },
  { key: "BOTTOM LINE", emoji: "⚖️", color: "#10b981" },
];

function parse(text) {
  const clean = text.replace(/\*\*/g, "").replace(/^#{1,3}\s*/gm, "");
  return SECTIONS.map((s, i) => {
    const m = clean.match(new RegExp(`${s.key}:\\n([\\s\\S]*?)(?=\\n[A-Z][A-Z '\\-]+:|$)`));
    const content = m ? m[1].trim() : null;
    if (!content) return null;
    return (
      <div key={s.key} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderLeft: `3px solid ${s.color}`, borderRadius: 12, padding: "16px 20px", marginBottom: 10, animation: "fadeUp 0.35s ease forwards", animationDelay: `${i * 0.06}s`, animationFillMode: "both" }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: s.color, letterSpacing: "0.12em", marginBottom: 8, textTransform: "uppercase" }}>{s.emoji} {s.key}</div>
        <div style={{ fontSize: 14, color: "#cbd5e1", lineHeight: 1.8, whiteSpace: "pre-line" }}>{content}</div>
      </div>
    );
  });
}

export default function InsurancePlanDecoder() {
  const { consumeCredit } = useAuth();
  const [plan, setPlan] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [focused, setFocused] = useState(false);

  const run = async () => {
    if (!plan.trim() || !consumeCredit()) return;
    setLoading(true); setResult(null); setError(null);
    try { const r = await axios.post("/api/tools", { tool: "insplan", plan }); setResult(r.data.result); }
    catch { setError("Something went wrong. Please try again."); }
    finally { setLoading(false); }
  };

  return (
    <div>
      <div style={{ textAlign: "center", marginBottom: 28 }}>
        <h1 style={{ fontSize: "clamp(22px, 6vw, 32px)", fontWeight: 900, letterSpacing: "-0.03em", marginBottom: 8, color: "#f1f5f9" }}>
          Decode your <span style={{ color: "#10b981", textShadow: "0 0 20px rgba(16,185,129,0.4)" }}>insurance plan.</span>
        </h1>
        <p style={{ fontSize: 15, color: "#64748b", lineHeight: 1.6, maxWidth: 460, margin: "0 auto" }}>Paste your Summary of Benefits — we'll explain deductibles, coverage, gotchas, and whether it's a good deal.</p>
      </div>
      <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 20, marginBottom: 20 }}>
        <label style={{ fontSize: 11, fontWeight: 700, color: "#475569", display: "block", marginBottom: 6, letterSpacing: "0.06em", textTransform: "uppercase" }}>Paste your Summary of Benefits and Coverage</label>
        <textarea value={plan} onChange={e => setPlan(e.target.value)} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} placeholder="Paste the text from your insurance plan documents, SBC, or benefits summary..." style={{ ...IS, height: 160, resize: "vertical", marginBottom: 16, border: focused ? "1px solid rgba(16,185,129,0.5)" : "1px solid rgba(255,255,255,0.08)" }} />
        <button onClick={run} disabled={loading || !plan.trim()} style={{ width: "100%", padding: 14, background: loading || !plan.trim() ? "rgba(255,255,255,0.05)" : "linear-gradient(135deg,#10b981,#059669)", color: loading || !plan.trim() ? "#334155" : "#fff", border: "none", borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: loading || !plan.trim() ? "default" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, fontFamily: FONT, boxShadow: loading || !plan.trim() ? "none" : "0 8px 28px rgba(16,185,129,0.35)" }}>
          {loading ? <><span style={{ width: 17, height: 17, border: "2px solid rgba(255,255,255,0.15)", borderTop: "2px solid #10b981", borderRadius: "50%", animation: "spin 0.8s linear infinite", display: "inline-block" }} />Decoding your plan...</> : "🏥 Decode My Plan"}
        </button>
      </div>
      {error && <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: 12, padding: 16, color: "#f87171", fontSize: 14, marginBottom: 16 }}>{error}</div>}
      {result && (
        <div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: "#334155", letterSpacing: "0.12em" }}>PLAN BREAKDOWN</div>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => { navigator.clipboard.writeText(result); setCopied(true); setTimeout(() => setCopied(false), 2000); }} style={{ fontSize: 12, color: copied ? "#10b981" : "#64748b", background: "rgba(255,255,255,0.04)", border: `1px solid ${copied ? "rgba(16,185,129,0.3)" : "rgba(255,255,255,0.08)"}`, padding: "5px 12px", borderRadius: 8, cursor: "pointer", fontFamily: FONT }}>{copied ? "✓ Copied" : "Copy"}</button>
              <button onClick={() => { setResult(null); setPlan(""); }} style={{ fontSize: 12, color: "#64748b", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", padding: "5px 12px", borderRadius: 8, cursor: "pointer", fontFamily: FONT }}>← New Plan</button>
            </div>
          </div>
          {parse(result)}
        </div>
      )}
    </div>
  );
}
