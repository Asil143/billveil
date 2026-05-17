'use client';
import { useState } from "react";
import { useAuth } from "./AuthContext";
import axios from "axios";

const FONT = "'Inter', system-ui, sans-serif";
const IS = { width: "100%", padding: "11px 14px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, fontSize: 14, color: "#f1f5f9", fontFamily: FONT, outline: "none", boxSizing: "border-box" };

const SECTIONS = [
  { key: "PLAN RECOMMENDATION", emoji: "🎯", color: "#10b981" },
  { key: "PLAN TYPE EXPLAINED", emoji: "📋", color: "#60a5fa" },
  { key: "DEDUCTIBLE STRATEGY", emoji: "💰", color: "#34d399" },
  { key: "KEY FEATURES TO PRIORITIZE", emoji: "✅", color: "#a78bfa" },
  { key: "OPEN ENROLLMENT CHECKLIST", emoji: "📝", color: "#fbbf24" },
  { key: "RED FLAGS TO AVOID", emoji: "🚨", color: "#f87171" },
  { key: "QUESTIONS TO ASK HR OR YOUR BROKER", emoji: "💬", color: "#60a5fa" },
];

function parse(text) {
  const clean = text.replace(/\*\*/g, "").replace(/^#{1,3}\s*/gm, "");
  return SECTIONS.map((s, i) => {
    const m = clean.match(new RegExp(`${s.key}:\\n([\\s\\S]*?)(?=\\n[A-Z][A-Z ']+:|$)`));
    const content = m ? m[1].trim() : null;
    if (!content) return null;
    return (
      <div key={s.key} style={{ background: s.key === "PLAN RECOMMENDATION" ? "rgba(16,185,129,0.05)" : "rgba(255,255,255,0.03)", border: `1px solid ${s.key === "PLAN RECOMMENDATION" ? "rgba(16,185,129,0.2)" : "rgba(255,255,255,0.08)"}`, borderLeft: `3px solid ${s.color}`, borderRadius: 12, padding: "16px 20px", marginBottom: 10, animation: "fadeUp 0.35s ease forwards", animationDelay: `${i * 0.06}s`, animationFillMode: "both" }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: s.color, letterSpacing: "0.12em", marginBottom: 8, textTransform: "uppercase" }}>{s.emoji} {s.key}</div>
        <div style={{ fontSize: 14, color: "#cbd5e1", lineHeight: 1.8, whiteSpace: "pre-line" }}>{content}</div>
      </div>
    );
  });
}

const BUDGET_OPTIONS = ["Low monthly premium", "Low deductible (pay less when sick)", "Balanced (middle ground)", "HDHP + HSA (invest the savings)"];

export default function InsurancePlanOptimizer() {
  const { consumeCredit } = useAuth();
  const [situation, setSituation] = useState("");
  const [expectedCare, setExpectedCare] = useState("");
  const [familySize, setFamilySize] = useState("");
  const [budget, setBudget] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  const run = async () => {
    if (!situation.trim() || !consumeCredit()) return;
    setLoading(true); setResult(null); setError(null);
    try {
      const r = await axios.post("/api/tools", { tool: "planoptimizer", situation, expectedCare, familySize, budget });
      setResult(r.data.result);
    } catch { setError("Something went wrong. Please try again."); }
    finally { setLoading(false); }
  };

  return (
    <div>
      <div style={{ textAlign: "center", marginBottom: 28 }}>
        <h1 style={{ fontSize: "clamp(22px, 6vw, 32px)", fontWeight: 900, letterSpacing: "-0.03em", marginBottom: 8, color: "#f1f5f9" }}>
          Find your <span style={{ color: "#10b981", textShadow: "0 0 20px rgba(16,185,129,0.4)" }}>best plan.</span>
        </h1>
        <p style={{ fontSize: 15, color: "#64748b", lineHeight: 1.6, maxWidth: 460, margin: "0 auto" }}>
          Describe your health situation. AI recommends the right plan type, deductible strategy, and what to look for during open enrollment.
        </p>
      </div>

      <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 20, marginBottom: 20 }}>
        <div style={{ marginBottom: 14 }}>
          <label style={{ fontSize: 11, fontWeight: 700, color: "#475569", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>Your health situation *</label>
          <textarea value={situation} onChange={e => setSituation(e.target.value)} placeholder="e.g. I have Type 2 diabetes, see my PCP quarterly, take 3 medications, and had one specialist visit last year..." style={{ ...IS, height: 90, resize: "vertical" }} />
        </div>
        <div style={{ marginBottom: 14 }}>
          <label style={{ fontSize: 11, fontWeight: 700, color: "#475569", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>Expected care this year <span style={{ fontWeight: 400, textTransform: "none", color: "#334155" }}>optional</span></label>
          <input value={expectedCare} onChange={e => setExpectedCare(e.target.value)} placeholder="e.g. knee surgery, pregnancy, regular prescriptions, mental health visits" style={IS} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
          <div>
            <label style={{ fontSize: 11, fontWeight: 700, color: "#475569", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>Family size <span style={{ fontWeight: 400, textTransform: "none", color: "#334155" }}>optional</span></label>
            <input value={familySize} onChange={e => setFamilySize(e.target.value)} placeholder="e.g. just me, me + spouse, family of 4" style={IS} />
          </div>
          <div>
            <label style={{ fontSize: 11, fontWeight: 700, color: "#475569", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>Budget preference <span style={{ fontWeight: 400, textTransform: "none", color: "#334155" }}>optional</span></label>
            <select value={budget} onChange={e => setBudget(e.target.value)} style={{ ...IS, cursor: "pointer" }}>
              <option value="">Select preference...</option>
              {BUDGET_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
        </div>
        <button onClick={run} disabled={loading || !situation.trim()} style={{ width: "100%", padding: 14, background: loading || !situation.trim() ? "rgba(255,255,255,0.05)" : "linear-gradient(135deg,#10b981,#059669)", color: loading || !situation.trim() ? "#334155" : "#fff", border: "none", borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: loading || !situation.trim() ? "default" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, fontFamily: FONT, boxShadow: loading || !situation.trim() ? "none" : "0 8px 28px rgba(16,185,129,0.35)" }}>
          {loading ? <><span style={{ width: 17, height: 17, border: "2px solid rgba(255,255,255,0.15)", borderTop: "2px solid #10b981", borderRadius: "50%", animation: "spin 0.8s linear infinite", display: "inline-block" }} />Analyzing your situation...</> : "📈 Find My Best Plan"}
        </button>
      </div>

      {error && <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: 12, padding: 16, color: "#f87171", fontSize: 14, marginBottom: 16 }}>{error}</div>}

      {result && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: "#334155", letterSpacing: "0.12em" }}>YOUR PLAN RECOMMENDATION</div>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => { navigator.clipboard.writeText(result); setCopied(true); setTimeout(() => setCopied(false), 2000); }} style={{ fontSize: 12, color: copied ? "#10b981" : "#64748b", background: "rgba(255,255,255,0.04)", border: `1px solid ${copied ? "rgba(16,185,129,0.3)" : "rgba(255,255,255,0.08)"}`, padding: "5px 12px", borderRadius: 8, cursor: "pointer", fontFamily: FONT }}>{copied ? "✓ Copied" : "Copy"}</button>
              <button onClick={() => { setResult(null); setSituation(""); setExpectedCare(""); setFamilySize(""); setBudget(""); }} style={{ fontSize: 12, color: "#64748b", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", padding: "5px 12px", borderRadius: 8, cursor: "pointer", fontFamily: FONT }}>← New Analysis</button>
            </div>
          </div>
          {parse(result)}
        </div>
      )}
    </div>
  );
}
