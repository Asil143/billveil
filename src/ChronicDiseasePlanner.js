import { useState } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";

const FONT = "'Inter', system-ui, sans-serif";

const CONDITIONS = [
  "Type 2 Diabetes", "Type 1 Diabetes", "Heart Disease / CAD", "Hypertension", "Asthma",
  "COPD", "Rheumatoid Arthritis", "Multiple Sclerosis", "Lupus", "Crohn's / Colitis",
  "Cancer (general)", "Kidney Disease / CKD", "Depression / Anxiety", "Bipolar Disorder",
  "Epilepsy / Seizures", "Parkinson's Disease", "Hypothyroidism", "HIV/AIDS",
];

const SECTIONS = [
  { key: "ANNUAL COST ESTIMATE", emoji: "💰", color: "#fbbf24" },
  { key: "MEDICATION SAVINGS", emoji: "💊", color: "#34d399" },
  { key: "INSURANCE STRATEGY", emoji: "🛡️", color: "#60a5fa" },
  { key: "FINANCIAL ASSISTANCE", emoji: "🤝", color: "#a78bfa" },
  { key: "COST REDUCTION ACTIONS", emoji: "✅", color: "#10b981" },
];

export default function ChronicDiseasePlanner() {
  const { consumeCredit, showLoginModal } = useAuth();
  const [condition, setCondition] = useState("");
  const [insurance, setInsurance] = useState("");
  const [income, setIncome] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(null);

  const plan = async () => {
    if (!condition.trim()) return;
    if (!consumeCredit()) { showLoginModal(); return; }
    setLoading(true);
    setResult(null);
    setError(null);
    try {
      const r = await axios.post("/api/tools", { tool: "chronicdisease", condition, insurance, income });
      setResult(r.data.result);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const parseResult = (text) => {
    const clean = text.replace(/\*\*/g, "").replace(/^#{1,3}\s*/gm, "");
    return SECTIONS.map((s, i) => {
      const regex = new RegExp(`${s.key}:\\n([\\s\\S]*?)(?=\\n[A-Z][A-Z/ &]+:|$)`);
      const match = clean.match(regex);
      const raw = match ? match[1].trim() : null;
      if (!raw) return null;
      const content = raw.trim();
      if (!content) return null;
      return (
        <div key={s.key} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderLeft: `3px solid ${s.color}`, borderRadius: 12, padding: "16px 20px", marginBottom: 10, animation: "fadeUp 0.35s ease forwards", animationDelay: `${i * 0.07}s`, animationFillMode: "both" }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: s.color, letterSpacing: "0.12em", marginBottom: 8, textTransform: "uppercase" }}>{s.emoji} {s.key}</div>
          <div style={{ fontSize: 14, color: "#cbd5e1", lineHeight: 1.75, whiteSpace: "pre-line" }}>{content}</div>
        </div>
      );
    });
  };

  return (
    <div>
      <div style={{ textAlign: "center", marginBottom: 28 }}>
        <div style={{ fontSize: 36, marginBottom: 10 }}>🩺</div>
        <h1 style={{ fontSize: "clamp(20px, 5vw, 28px)", fontWeight: 900, color: "#f1f5f9", marginBottom: 8, letterSpacing: "-0.02em" }}>Chronic Disease Cost Planner</h1>
        <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.6, maxWidth: 460, margin: "0 auto" }}>
          Living with a chronic condition? Get an annual cost estimate, medication savings, the right insurance strategy, and financial assistance programs specific to your diagnosis.
        </p>
      </div>

      <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 20, marginBottom: 20 }}>
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 11, fontWeight: 700, color: "#475569", display: "block", marginBottom: 10, letterSpacing: "0.06em", textTransform: "uppercase" }}>Your Condition</label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 12 }}>
            {CONDITIONS.map(c => (
              <button key={c} onClick={() => setCondition(c)} style={{ padding: "5px 12px", background: condition === c ? "rgba(16,185,129,0.12)" : "rgba(255,255,255,0.04)", border: `1px solid ${condition === c ? "rgba(16,185,129,0.3)" : "rgba(255,255,255,0.08)"}`, borderRadius: 20, fontSize: 12, color: condition === c ? "#10b981" : "#64748b", cursor: "pointer", fontFamily: FONT }}>{c}</button>
            ))}
          </div>
          <input value={condition} onChange={e => setCondition(e.target.value)} placeholder="Or type your condition..." style={{ width: "100%", padding: "10px 14px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, fontSize: 14, color: "#f1f5f9", fontFamily: FONT, boxSizing: "border-box" }} />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 16 }}>
          <div>
            <label style={{ fontSize: 11, fontWeight: 700, color: "#475569", display: "block", marginBottom: 6, letterSpacing: "0.06em", textTransform: "uppercase" }}>Your Insurance (optional)</label>
            <input value={insurance} onChange={e => setInsurance(e.target.value)} placeholder="e.g. Employer PPO, Medicaid, Medicare" style={{ width: "100%", padding: "10px 12px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, fontSize: 13, color: "#f1f5f9", fontFamily: FONT, boxSizing: "border-box" }} />
          </div>
          <div>
            <label style={{ fontSize: 11, fontWeight: 700, color: "#475569", display: "block", marginBottom: 6, letterSpacing: "0.06em", textTransform: "uppercase" }}>Annual Income (optional)</label>
            <div style={{ position: "relative" }}>
              <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#64748b", fontSize: 13 }}>$</span>
              <input value={income} onChange={e => setIncome(e.target.value)} type="number" placeholder="45000" style={{ width: "100%", padding: "10px 12px 10px 24px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, fontSize: 13, color: "#f1f5f9", fontFamily: FONT, boxSizing: "border-box" }} />
            </div>
          </div>
        </div>

        <button onClick={plan} disabled={loading || !condition.trim()} style={{ width: "100%", padding: "13px", background: loading || !condition.trim() ? "rgba(255,255,255,0.05)" : "linear-gradient(135deg, #10b981, #059669)", color: loading || !condition.trim() ? "#334155" : "#fff", border: "none", borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: loading || !condition.trim() ? "default" : "pointer", fontFamily: FONT, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, transition: "all 0.2s" }}>
          {loading ? <><span style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,0.15)", borderTop: "2px solid #10b981", borderRadius: "50%", animation: "spin 0.8s linear infinite", display: "inline-block" }} /> Building your plan...</> : "🩺 Build My Cost Plan"}
        </button>
      </div>

      {error && <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: 12, padding: 16, color: "#f87171", fontSize: 14, marginBottom: 16 }}>{error}</div>}

      {result && (
        <div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: "#334155", letterSpacing: "0.12em" }}>YOUR COST PLAN — {condition.toUpperCase()}</div>
            <button onClick={() => { navigator.clipboard.writeText(result); setCopied(true); setTimeout(() => setCopied(false), 2000); }} style={{ fontSize: 12, color: copied ? "#10b981" : "#64748b", background: "rgba(255,255,255,0.04)", border: `1px solid ${copied ? "rgba(16,185,129,0.3)" : "rgba(255,255,255,0.08)"}`, padding: "4px 12px", borderRadius: 8, cursor: "pointer", fontFamily: FONT, transition: "all 0.2s" }}>{copied ? "✓ Copied" : "Copy"}</button>
          </div>
          {parseResult(result)}
          <button onClick={() => { setResult(null); setCondition(""); setInsurance(""); setIncome(""); }} style={{ marginTop: 8, padding: "8px 16px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, color: "#64748b", fontSize: 12, cursor: "pointer", fontFamily: FONT }}>← Plan a different condition</button>
        </div>
      )}
    </div>
  );
}
