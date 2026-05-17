import { useState } from "react";
import { useAuth } from "./AuthContext";
import axios from "axios";

const FONT = "'Inter', system-ui, sans-serif";
const IS = { width: "100%", padding: "11px 14px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, fontSize: 14, color: "#f1f5f9", fontFamily: FONT, outline: "none", boxSizing: "border-box" };

const SECTIONS = [
  { key: "RISK LEVEL", emoji: "🚨", color: "#f87171" },
  { key: "HOW DEFERRED INTEREST WORKS", emoji: "💣", color: "#fbbf24" },
  { key: "THE MATH", emoji: "🔢", color: "#f87171" },
  { key: "SAFER ALTERNATIVES", emoji: "✅", color: "#34d399" },
  { key: "RED FLAGS TO WATCH", emoji: "🚩", color: "#f87171" },
  { key: "IF YOU ALREADY SIGNED UP", emoji: "🛟", color: "#60a5fa" },
  { key: "YOUR RIGHTS", emoji: "⚖️", color: "#a78bfa" },
];

function parse(text) {
  return SECTIONS.map((s, i) => {
    const m = text.match(new RegExp(`${s.key}:\\n([\\s\\S]*?)(?=\\n[A-Z][A-Z ']+:|$)`));
    const content = m ? m[1].trim() : null;
    if (!content) return null;
    const isRisk = s.key === "RISK LEVEL";
    const isHigh = content.includes("HIGH RISK");
    return (
      <div key={s.key} style={{ background: isRisk && isHigh ? "rgba(239,68,68,0.07)" : "rgba(255,255,255,0.03)", border: `1px solid ${isRisk && isHigh ? "rgba(239,68,68,0.25)" : "rgba(255,255,255,0.08)"}`, borderLeft: `3px solid ${s.color}`, borderRadius: 12, padding: "16px 20px", marginBottom: 10, animation: "fadeUp 0.35s ease forwards", animationDelay: `${i * 0.06}s`, animationFillMode: "both" }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: s.color, letterSpacing: "0.12em", marginBottom: 8, textTransform: "uppercase" }}>{s.emoji} {s.key}</div>
        <div style={{ fontSize: 14, color: "#cbd5e1", lineHeight: 1.8, whiteSpace: "pre-line" }}>{content}</div>
      </div>
    );
  });
}

export default function CreditCardWarning() {
  const { consumeCredit } = useAuth();
  const [card, setCard] = useState("");
  const [amount, setAmount] = useState("");
  const [situation, setSituation] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [focused, setFocused] = useState(null);

  const run = async () => {
    if (!situation.trim() && !card.trim()) return;
    if (!consumeCredit()) return;
    setLoading(true); setResult(null); setError(null);
    try { const r = await axios.post("/api/creditcardwarn", { card, amount, situation }); setResult(r.data.result); }
    catch { setError("Something went wrong. Please try again."); }
    finally { setLoading(false); }
  };

  const canRun = situation.trim() || card.trim();

  return (
    <div>
      <div style={{ textAlign: "center", marginBottom: 28 }}>
        <h1 style={{ fontSize: "clamp(22px, 6vw, 32px)", fontWeight: 900, letterSpacing: "-0.03em", marginBottom: 8, color: "#f1f5f9" }}>
          Medical credit card <span style={{ color: "#f87171", textShadow: "0 0 20px rgba(239,68,68,0.4)" }}>warning.</span>
        </h1>
        <p style={{ fontSize: 15, color: "#64748b", lineHeight: 1.6, maxWidth: 460, margin: "0 auto" }}>CareCredit and similar cards have deferred interest traps that can double your debt. Understand the risks before you sign.</p>
      </div>
      <div style={{ background: "rgba(239,68,68,0.04)", border: "1px solid rgba(239,68,68,0.15)", borderRadius: 16, padding: 20, marginBottom: 20 }}>
        <div style={{ marginBottom: 12 }}>
          <label style={{ fontSize: 11, fontWeight: 700, color: "#475569", display: "block", marginBottom: 6, letterSpacing: "0.06em", textTransform: "uppercase" }}>Card or product name <span style={{ fontWeight: 400, color: "#334155", textTransform: "none" }}>optional</span></label>
          <input value={card} onChange={e => setCard(e.target.value)} onFocus={() => setFocused("c")} onBlur={() => setFocused(null)} placeholder="e.g. CareCredit, Synchrony Health, AccessOne" style={{ ...IS, border: focused === "c" ? "1px solid rgba(239,68,68,0.5)" : "1px solid rgba(255,255,255,0.08)" }} />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label style={{ fontSize: 11, fontWeight: 700, color: "#475569", display: "block", marginBottom: 6, letterSpacing: "0.06em", textTransform: "uppercase" }}>Amount <span style={{ fontWeight: 400, color: "#334155", textTransform: "none" }}>optional</span></label>
          <input value={amount} onChange={e => setAmount(e.target.value.replace(/[^0-9.]/g, ""))} onFocus={() => setFocused("a")} onBlur={() => setFocused(null)} placeholder="e.g. 2500" style={{ ...IS, border: focused === "a" ? "1px solid rgba(239,68,68,0.5)" : "1px solid rgba(255,255,255,0.08)" }} />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 11, fontWeight: 700, color: "#475569", display: "block", marginBottom: 6, letterSpacing: "0.06em", textTransform: "uppercase" }}>Your situation</label>
          <textarea value={situation} onChange={e => setSituation(e.target.value)} onFocus={() => setFocused("s")} onBlur={() => setFocused(null)} placeholder="e.g. The hospital is offering me CareCredit for a $2,500 dental bill with 18 months no interest..." style={{ ...IS, height: 80, resize: "vertical", border: focused === "s" ? "1px solid rgba(239,68,68,0.5)" : "1px solid rgba(255,255,255,0.08)" }} />
        </div>
        <button onClick={run} disabled={loading || !canRun} style={{ width: "100%", padding: 14, background: loading || !canRun ? "rgba(255,255,255,0.05)" : "linear-gradient(135deg,#ef4444,#dc2626)", color: loading || !canRun ? "#334155" : "#fff", border: "none", borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: loading || !canRun ? "default" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, fontFamily: FONT, boxShadow: loading || !canRun ? "none" : "0 8px 28px rgba(239,68,68,0.35)" }}>
          {loading ? <><span style={{ width: 17, height: 17, border: "2px solid rgba(255,255,255,0.15)", borderTop: "2px solid #fff", borderRadius: "50%", animation: "spin 0.8s linear infinite", display: "inline-block" }} />Analyzing risks...</> : "⚠️ Analyze the Risk"}
        </button>
      </div>
      {error && <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: 12, padding: 16, color: "#f87171", fontSize: 14, marginBottom: 16 }}>{error}</div>}
      {result && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: "#334155", letterSpacing: "0.12em" }}>RISK ANALYSIS</div>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => { navigator.clipboard.writeText(result); setCopied(true); setTimeout(() => setCopied(false), 2000); }} style={{ fontSize: 12, color: copied ? "#10b981" : "#64748b", background: "rgba(255,255,255,0.04)", border: `1px solid ${copied ? "rgba(16,185,129,0.3)" : "rgba(255,255,255,0.08)"}`, padding: "5px 12px", borderRadius: 8, cursor: "pointer", fontFamily: FONT }}>{copied ? "✓ Copied" : "Copy"}</button>
              <button onClick={() => { setResult(null); setCard(""); setAmount(""); setSituation(""); }} style={{ fontSize: 12, color: "#64748b", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", padding: "5px 12px", borderRadius: 8, cursor: "pointer", fontFamily: FONT }}>← New Check</button>
            </div>
          </div>
          {parse(result)}
        </div>
      )}
    </div>
  );
}
