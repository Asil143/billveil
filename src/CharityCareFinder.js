import { useState } from "react";
import { useAuth } from "./AuthContext";
import axios from "axios";

const FONT = "'Inter', system-ui, sans-serif";
const IS = { width: "100%", padding: "11px 14px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, fontSize: 14, color: "#f1f5f9", fontFamily: FONT, outline: "none", boxSizing: "border-box" };
const US_STATES = ["Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut","Delaware","Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa","Kansas","Kentucky","Louisiana","Maine","Maryland","Massachusetts","Michigan","Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada","New Hampshire","New Jersey","New Mexico","New York","North Carolina","North Dakota","Ohio","Oklahoma","Oregon","Pennsylvania","Rhode Island","South Carolina","South Dakota","Tennessee","Texas","Utah","Vermont","Virginia","Washington","West Virginia","Wisconsin","Wyoming","Washington D.C."];

const SECTIONS = [
  { key: "ELIGIBILITY ESTIMATE", emoji: "🎯", color: "#10b981" },
  { key: "WHAT NONPROFIT HOSPITALS MUST OFFER", emoji: "⚖️", color: "#60a5fa" },
  { key: "HOW TO APPLY", emoji: "📋", color: "#34d399" },
  { key: "APPLICATION LETTER", emoji: "📝", color: "#a78bfa" },
  { key: "DOCUMENTS TO GATHER", emoji: "📁", color: "#fbbf24" },
  { key: "IF THEY SAY NO", emoji: "🛡️", color: "#f87171" },
  { key: "OTHER PROGRAMS TO APPLY FOR", emoji: "💊", color: "#34d399" },
];

function parse(text) {
  const clean = text.replace(/\*\*/g, "").replace(/^#{1,3}\s*/gm, "");
  return SECTIONS.map((s, i) => {
    const m = clean.match(new RegExp(`${s.key}:\\n([\\s\\S]*?)(?=\\n[A-Z][A-Z ']+:|$)`));
    const content = m ? m[1].trim() : null;
    if (!content) return null;
    return (
      <div key={s.key} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderLeft: `3px solid ${s.color}`, borderRadius: 12, padding: "16px 20px", marginBottom: 10, animation: "fadeUp 0.35s ease forwards", animationDelay: `${i * 0.06}s`, animationFillMode: "both" }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: s.color, letterSpacing: "0.12em", marginBottom: 8, textTransform: "uppercase" }}>{s.emoji} {s.key}</div>
        {s.key === "APPLICATION LETTER" ? <pre style={{ fontSize: 13, color: "#cbd5e1", lineHeight: 1.9, whiteSpace: "pre-wrap", fontFamily: "'Courier New', monospace", background: "rgba(0,0,0,0.2)", borderRadius: 8, padding: 14, margin: 0 }}>{content}</pre> : <div style={{ fontSize: 14, color: "#cbd5e1", lineHeight: 1.8, whiteSpace: "pre-line" }}>{content}</div>}
      </div>
    );
  });
}

export default function CharityCareFinder() {
  const { consumeCredit, profileData } = useAuth();
  const [hospital, setHospital] = useState("");
  const [state, setState] = useState("");
  const [income, setIncome] = useState("");
  const [household, setHousehold] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [focused, setFocused] = useState(null);
  const name = profileData?.firstName ? `${profileData.firstName} ${profileData.lastName || ""}`.trim() : "";

  const run = async () => {
    if (!hospital.trim() || !state || !consumeCredit()) return;
    setLoading(true); setResult(null); setError(null);
    try { const r = await axios.post("/api/tools", { tool: "charitycare", hospital, state, income, household, name }); setResult(r.data.result); }
    catch { setError("Something went wrong. Please try again."); }
    finally { setLoading(false); }
  };

  return (
    <div>
      <div style={{ textAlign: "center", marginBottom: 28 }}>
        <h1 style={{ fontSize: "clamp(22px, 6vw, 32px)", fontWeight: 900, letterSpacing: "-0.03em", marginBottom: 8, color: "#f1f5f9" }}>
          Get <span style={{ color: "#10b981", textShadow: "0 0 20px rgba(16,185,129,0.4)" }}>charity care.</span>
        </h1>
        <p style={{ fontSize: 15, color: "#64748b", lineHeight: 1.6, maxWidth: 460, margin: "0 auto" }}>Every nonprofit hospital is legally required to offer financial assistance. Most patients who qualify never apply — because nobody told them.</p>
      </div>
      <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 20, marginBottom: 20 }}>
        <div style={{ marginBottom: 12 }}>
          <label style={{ fontSize: 11, fontWeight: 700, color: "#475569", display: "block", marginBottom: 6, letterSpacing: "0.06em", textTransform: "uppercase" }}>Hospital name</label>
          <input value={hospital} onChange={e => setHospital(e.target.value)} onFocus={() => setFocused("h")} onBlur={() => setFocused(null)} placeholder="e.g. Mass General Hospital" style={{ ...IS, border: focused === "h" ? "1px solid rgba(16,185,129,0.5)" : "1px solid rgba(255,255,255,0.08)" }} />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label style={{ fontSize: 11, fontWeight: 700, color: "#475569", display: "block", marginBottom: 6, letterSpacing: "0.06em", textTransform: "uppercase" }}>State</label>
          <select value={state} onChange={e => setState(e.target.value)} onFocus={() => setFocused("s")} onBlur={() => setFocused(null)} style={{ ...IS, cursor: "pointer", border: focused === "s" ? "1px solid rgba(16,185,129,0.5)" : "1px solid rgba(255,255,255,0.08)" }}>
            <option value="" style={{ background: "#0d1526" }}>Select state…</option>
            {US_STATES.map(s => <option key={s} value={s} style={{ background: "#0d1526" }}>{s}</option>)}
          </select>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
          <div>
            <label style={{ fontSize: 11, fontWeight: 700, color: "#475569", display: "block", marginBottom: 6, letterSpacing: "0.06em", textTransform: "uppercase" }}>Annual income <span style={{ fontWeight: 400, color: "#334155", textTransform: "none" }}>optional</span></label>
            <input value={income} onChange={e => setIncome(e.target.value.replace(/[^0-9]/g, ""))} onFocus={() => setFocused("i")} onBlur={() => setFocused(null)} placeholder="e.g. 35000" style={{ ...IS, border: focused === "i" ? "1px solid rgba(16,185,129,0.5)" : "1px solid rgba(255,255,255,0.08)" }} />
          </div>
          <div>
            <label style={{ fontSize: 11, fontWeight: 700, color: "#475569", display: "block", marginBottom: 6, letterSpacing: "0.06em", textTransform: "uppercase" }}>Household size <span style={{ fontWeight: 400, color: "#334155", textTransform: "none" }}>optional</span></label>
            <input value={household} onChange={e => setHousehold(e.target.value.replace(/[^0-9]/g, ""))} onFocus={() => setFocused("hh")} onBlur={() => setFocused(null)} placeholder="e.g. 3" style={{ ...IS, border: focused === "hh" ? "1px solid rgba(16,185,129,0.5)" : "1px solid rgba(255,255,255,0.08)" }} />
          </div>
        </div>
        <button onClick={run} disabled={loading || !hospital.trim() || !state} style={{ width: "100%", padding: 14, background: loading || !hospital.trim() || !state ? "rgba(255,255,255,0.05)" : "linear-gradient(135deg,#10b981,#059669)", color: loading || !hospital.trim() || !state ? "#334155" : "#fff", border: "none", borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: loading || !hospital.trim() || !state ? "default" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, fontFamily: FONT, boxShadow: loading || !hospital.trim() || !state ? "none" : "0 8px 28px rgba(16,185,129,0.35)" }}>
          {loading ? <><span style={{ width: 17, height: 17, border: "2px solid rgba(255,255,255,0.15)", borderTop: "2px solid #10b981", borderRadius: "50%", animation: "spin 0.8s linear infinite", display: "inline-block" }} />Finding your options...</> : "🤝 Find Charity Care"}
        </button>
      </div>
      {error && <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: 12, padding: 16, color: "#f87171", fontSize: 14, marginBottom: 16 }}>{error}</div>}
      {result && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: "#334155", letterSpacing: "0.12em" }}>CHARITY CARE GUIDE</div>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => { navigator.clipboard.writeText(result); setCopied(true); setTimeout(() => setCopied(false), 2000); }} style={{ fontSize: 12, color: copied ? "#10b981" : "#64748b", background: "rgba(255,255,255,0.04)", border: `1px solid ${copied ? "rgba(16,185,129,0.3)" : "rgba(255,255,255,0.08)"}`, padding: "5px 12px", borderRadius: 8, cursor: "pointer", fontFamily: FONT }}>{copied ? "✓ Copied" : "Copy"}</button>
              <button onClick={() => { setResult(null); setHospital(""); setState(""); setIncome(""); setHousehold(""); }} style={{ fontSize: 12, color: "#64748b", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", padding: "5px 12px", borderRadius: 8, cursor: "pointer", fontFamily: FONT }}>← New Search</button>
            </div>
          </div>
          {parse(result)}
        </div>
      )}
    </div>
  );
}
