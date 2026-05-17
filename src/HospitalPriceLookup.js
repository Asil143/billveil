'use client';
import { useState } from "react";
import { useAuth } from "./AuthContext";
import axios from "axios";

const FONT = "'Inter', system-ui, sans-serif";
const IS = { width: "100%", padding: "11px 14px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, fontSize: 14, color: "#f1f5f9", fontFamily: FONT, outline: "none", boxSizing: "border-box" };

const SECTIONS = [
  { key: "HOW TO FIND THEIR PRICES", emoji: "🔍", color: "#60a5fa" },
  { key: "WHAT YOU SHOULD EXPECT TO PAY", emoji: "💰", color: "#34d399" },
  { key: "HOW TO READ THE DATA", emoji: "📊", color: "#a78bfa" },
  { key: "YOUR RIGHTS IF PRICES AREN'T POSTED", emoji: "⚖️", color: "#f87171" },
  { key: "NEGOTIATING WITH THIS DATA", emoji: "📞", color: "#10b981" },
  { key: "PRICE COMPARISON RESOURCES", emoji: "🌐", color: "#fbbf24" },
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
        <div style={{ fontSize: 14, color: "#cbd5e1", lineHeight: 1.8, whiteSpace: "pre-line" }}>{content}</div>
      </div>
    );
  });
}

const US_STATES = ["AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY","DC"];

export default function HospitalPriceLookup() {
  const { consumeCredit } = useAuth();
  const [hospital, setHospital] = useState("");
  const [state, setState] = useState("");
  const [procedure, setProcedure] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  const run = async () => {
    if (!hospital.trim() || !consumeCredit()) return;
    setLoading(true); setResult(null); setError(null);
    try {
      const r = await axios.post("/api/tools", { tool: "hospitalprice", hospital, state, procedure });
      setResult(r.data.result);
    } catch { setError("Something went wrong. Please try again."); }
    finally { setLoading(false); }
  };

  return (
    <div>
      <div style={{ textAlign: "center", marginBottom: 28 }}>
        <h1 style={{ fontSize: "clamp(22px, 6vw, 32px)", fontWeight: 900, letterSpacing: "-0.03em", marginBottom: 8, color: "#f1f5f9" }}>
          Hospital <span style={{ color: "#10b981", textShadow: "0 0 20px rgba(16,185,129,0.4)" }}>Price Lookup</span>
        </h1>
        <p style={{ fontSize: 15, color: "#64748b", lineHeight: 1.6, maxWidth: 480, margin: "0 auto" }}>
          Federal law requires every hospital to publish their prices. We show you exactly where to find them and what you should actually pay.
        </p>
      </div>

      <div style={{ background: "rgba(16,185,129,0.05)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: 12, padding: "12px 16px", marginBottom: 20, fontSize: 13, color: "#10b981" }}>
        ⚖️ The Hospital Price Transparency Rule (Jan 2021) requires all hospitals to post machine-readable price files. Hospitals face $300/day fines for non-compliance.
      </div>

      <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 20, marginBottom: 20 }}>
        <div style={{ marginBottom: 14 }}>
          <label style={{ fontSize: 11, fontWeight: 700, color: "#475569", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>Hospital Name *</label>
          <input value={hospital} onChange={e => setHospital(e.target.value)} placeholder="e.g. Memorial Hermann, Mayo Clinic, St. Mary's Hospital" style={IS} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
          <div>
            <label style={{ fontSize: 11, fontWeight: 700, color: "#475569", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>State <span style={{ fontWeight: 400, textTransform: "none", color: "#334155" }}>optional</span></label>
            <select value={state} onChange={e => setState(e.target.value)} style={{ ...IS, cursor: "pointer" }}>
              <option value="">Select state...</option>
              {US_STATES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontSize: 11, fontWeight: 700, color: "#475569", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>Procedure <span style={{ fontWeight: 400, textTransform: "none", color: "#334155" }}>optional</span></label>
            <input value={procedure} onChange={e => setProcedure(e.target.value)} placeholder="e.g. knee replacement, MRI, colonoscopy" style={IS} />
          </div>
        </div>
        <button onClick={run} disabled={loading || !hospital.trim()} style={{ width: "100%", padding: 14, background: loading || !hospital.trim() ? "rgba(255,255,255,0.05)" : "linear-gradient(135deg,#10b981,#059669)", color: loading || !hospital.trim() ? "#334155" : "#fff", border: "none", borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: loading || !hospital.trim() ? "default" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, fontFamily: FONT, boxShadow: loading || !hospital.trim() ? "none" : "0 8px 28px rgba(16,185,129,0.35)" }}>
          {loading ? <><span style={{ width: 17, height: 17, border: "2px solid rgba(255,255,255,0.15)", borderTop: "2px solid #10b981", borderRadius: "50%", animation: "spin 0.8s linear infinite", display: "inline-block" }} />Finding prices...</> : "🏥 Look Up Hospital Prices"}
        </button>
      </div>

      {error && <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: 12, padding: 16, color: "#f87171", fontSize: 14, marginBottom: 16 }}>{error}</div>}

      {result && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: "#334155", letterSpacing: "0.12em" }}>PRICE LOOKUP — {hospital.toUpperCase()}</div>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => { navigator.clipboard.writeText(result); setCopied(true); setTimeout(() => setCopied(false), 2000); }} style={{ fontSize: 12, color: copied ? "#10b981" : "#64748b", background: "rgba(255,255,255,0.04)", border: `1px solid ${copied ? "rgba(16,185,129,0.3)" : "rgba(255,255,255,0.08)"}`, padding: "5px 12px", borderRadius: 8, cursor: "pointer", fontFamily: FONT }}>{copied ? "✓ Copied" : "Copy"}</button>
              <button onClick={() => { setResult(null); setHospital(""); setState(""); setProcedure(""); }} style={{ fontSize: 12, color: "#64748b", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", padding: "5px 12px", borderRadius: 8, cursor: "pointer", fontFamily: FONT }}>← New Lookup</button>
            </div>
          </div>
          {parse(result)}
        </div>
      )}
    </div>
  );
}
