import { useState } from "react";
import { useAuth } from "./AuthContext";
import axios from "axios";

const FONT = "'Inter', system-ui, sans-serif";
const IS = { width: "100%", padding: "11px 14px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, fontSize: 14, color: "#f1f5f9", fontFamily: FONT, outline: "none", boxSizing: "border-box" };

const SECTIONS = [
  { key: "COST ESTIMATE", emoji: "💰", color: "#34d399" },
  { key: "WHAT AFFECTS YOUR COST", emoji: "🔢", color: "#fbbf24" },
  { key: "QUESTIONS TO ASK YOUR INSURANCE BEFORE", emoji: "📞", color: "#60a5fa" },
  { key: "HOW TO FIND CHEAPER OPTIONS", emoji: "🔍", color: "#10b981" },
  { key: "PRICE TRANSPARENCY RESOURCES", emoji: "🌐", color: "#a78bfa" },
  { key: "BEFORE YOU SCHEDULE", emoji: "✅", color: "#34d399" },
  { key: "WATCH OUT FOR", emoji: "⚠️", color: "#f87171" },
];

function parse(text) {
  const clean = text.replace(/\*\*/g, "").replace(/^#{1,3}\s*/gm, "");
  return SECTIONS.map((s, i) => {
    const m = clean.match(new RegExp(`${s.key}:\\n([\\s\\S]*?)(?=\\n[A-Z][A-Z ']+:|$)`));
    const content = m ? m[1].trim() : null;
    if (!content) return null;
    return (
      <div key={s.key} style={{ background: s.key === "COST ESTIMATE" ? "rgba(52,211,153,0.05)" : "rgba(255,255,255,0.03)", border: `1px solid ${s.key === "COST ESTIMATE" ? "rgba(52,211,153,0.2)" : "rgba(255,255,255,0.08)"}`, borderLeft: `3px solid ${s.color}`, borderRadius: 12, padding: "16px 20px", marginBottom: 10, animation: "fadeUp 0.35s ease forwards", animationDelay: `${i * 0.06}s`, animationFillMode: "both" }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: s.color, letterSpacing: "0.12em", marginBottom: 8, textTransform: "uppercase" }}>{s.emoji} {s.key}</div>
        <div style={{ fontSize: 14, color: "#cbd5e1", lineHeight: 1.8, whiteSpace: "pre-line" }}>{content}</div>
      </div>
    );
  });
}

export default function CostEstimator() {
  const { consumeCredit } = useAuth();
  const [procedure, setProcedure] = useState("");
  const [insurance, setInsurance] = useState("");
  const [location, setLocation] = useState("");
  const [deductible, setDeductible] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [focused, setFocused] = useState(null);

  const run = async () => {
    if (!procedure.trim() || !consumeCredit()) return;
    setLoading(true); setResult(null); setError(null);
    try { const r = await axios.post("/api/tools", { tool: "costestimate", procedure, insurance, location, deductible }); setResult(r.data.result); }
    catch { setError("Something went wrong. Please try again."); }
    finally { setLoading(false); }
  };

  return (
    <div>
      <div style={{ textAlign: "center", marginBottom: 28 }}>
        <h1 style={{ fontSize: "clamp(22px, 6vw, 32px)", fontWeight: 900, letterSpacing: "-0.03em", marginBottom: 8, color: "#f1f5f9" }}>
          Know the cost <span style={{ color: "#10b981", textShadow: "0 0 20px rgba(16,185,129,0.4)" }}>before treatment.</span>
        </h1>
        <p style={{ fontSize: 15, color: "#64748b", lineHeight: 1.6, maxWidth: 460, margin: "0 auto" }}>Get a realistic out-of-pocket estimate, find cheaper facilities, and know exactly what to ask before you agree to anything.</p>
      </div>
      <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 20, marginBottom: 20 }}>
        <div style={{ marginBottom: 12 }}>
          <label style={{ fontSize: 11, fontWeight: 700, color: "#475569", display: "block", marginBottom: 6, letterSpacing: "0.06em", textTransform: "uppercase" }}>Procedure or treatment</label>
          <input value={procedure} onChange={e => setProcedure(e.target.value)} onFocus={() => setFocused("p")} onBlur={() => setFocused(null)} placeholder="e.g. knee arthroscopy, colonoscopy, MRI lumbar spine" style={{ ...IS, border: focused === "p" ? "1px solid rgba(16,185,129,0.5)" : "1px solid rgba(255,255,255,0.08)" }} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
          <div>
            <label style={{ fontSize: 11, fontWeight: 700, color: "#475569", display: "block", marginBottom: 6, letterSpacing: "0.06em", textTransform: "uppercase" }}>Insurance <span style={{ fontWeight: 400, color: "#334155", textTransform: "none" }}>optional</span></label>
            <input value={insurance} onChange={e => setInsurance(e.target.value)} onFocus={() => setFocused("i")} onBlur={() => setFocused(null)} placeholder="e.g. Aetna PPO" style={{ ...IS, border: focused === "i" ? "1px solid rgba(16,185,129,0.5)" : "1px solid rgba(255,255,255,0.08)" }} />
          </div>
          <div>
            <label style={{ fontSize: 11, fontWeight: 700, color: "#475569", display: "block", marginBottom: 6, letterSpacing: "0.06em", textTransform: "uppercase" }}>Location <span style={{ fontWeight: 400, color: "#334155", textTransform: "none" }}>optional</span></label>
            <input value={location} onChange={e => setLocation(e.target.value)} onFocus={() => setFocused("l")} onBlur={() => setFocused(null)} placeholder="e.g. Dallas TX" style={{ ...IS, border: focused === "l" ? "1px solid rgba(16,185,129,0.5)" : "1px solid rgba(255,255,255,0.08)" }} />
          </div>
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 11, fontWeight: 700, color: "#475569", display: "block", marginBottom: 6, letterSpacing: "0.06em", textTransform: "uppercase" }}>Remaining deductible <span style={{ fontWeight: 400, color: "#334155", textTransform: "none" }}>optional</span></label>
          <input value={deductible} onChange={e => setDeductible(e.target.value.replace(/[^0-9.]/g, ""))} onFocus={() => setFocused("d")} onBlur={() => setFocused(null)} placeholder="e.g. 1200" style={{ ...IS, border: focused === "d" ? "1px solid rgba(16,185,129,0.5)" : "1px solid rgba(255,255,255,0.08)" }} />
        </div>
        <button onClick={run} disabled={loading || !procedure.trim()} style={{ width: "100%", padding: 14, background: loading || !procedure.trim() ? "rgba(255,255,255,0.05)" : "linear-gradient(135deg,#10b981,#059669)", color: loading || !procedure.trim() ? "#334155" : "#fff", border: "none", borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: loading || !procedure.trim() ? "default" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, fontFamily: FONT, boxShadow: loading || !procedure.trim() ? "none" : "0 8px 28px rgba(16,185,129,0.35)" }}>
          {loading ? <><span style={{ width: 17, height: 17, border: "2px solid rgba(255,255,255,0.15)", borderTop: "2px solid #10b981", borderRadius: "50%", animation: "spin 0.8s linear infinite", display: "inline-block" }} />Estimating your costs...</> : "🔮 Estimate My Cost"}
        </button>
      </div>
      {error && <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: 12, padding: 16, color: "#f87171", fontSize: 14, marginBottom: 16 }}>{error}</div>}
      {result && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: "#334155", letterSpacing: "0.12em" }}>COST ESTIMATE — {procedure.toUpperCase()}</div>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => { navigator.clipboard.writeText(result); setCopied(true); setTimeout(() => setCopied(false), 2000); }} style={{ fontSize: 12, color: copied ? "#10b981" : "#64748b", background: "rgba(255,255,255,0.04)", border: `1px solid ${copied ? "rgba(16,185,129,0.3)" : "rgba(255,255,255,0.08)"}`, padding: "5px 12px", borderRadius: 8, cursor: "pointer", fontFamily: FONT }}>{copied ? "✓ Copied" : "Copy"}</button>
              <button onClick={() => { setResult(null); setProcedure(""); setInsurance(""); setLocation(""); setDeductible(""); }} style={{ fontSize: 12, color: "#64748b", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", padding: "5px 12px", borderRadius: 8, cursor: "pointer", fontFamily: FONT }}>← New Estimate</button>
            </div>
          </div>
          {parse(result)}
        </div>
      )}
    </div>
  );
}
