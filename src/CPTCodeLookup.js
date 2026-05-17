import { useState } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";

const FONT = "'Inter', system-ui, sans-serif";

const COMMON = [
  { code: "99213", label: "Office visit (established)" },
  { code: "99214", label: "Office visit (complex)" },
  { code: "99283", label: "ER visit (moderate)" },
  { code: "80053", label: "Comprehensive metabolic panel" },
  { code: "71046", label: "Chest X-ray (2 views)" },
  { code: "70553", label: "MRI brain w/ contrast" },
  { code: "93000", label: "EKG / ECG" },
  { code: "85025", label: "Complete blood count (CBC)" },
];

const SECTIONS = [
  { key: "WHAT IT IS", emoji: "🔍", color: "#60a5fa" },
  { key: "MEDICARE RATE", emoji: "💰", color: "#34d399" },
  { key: "FAIR PRICE RANGE", emoji: "📊", color: "#10b981" },
  { key: "AVERAGE CHARGED", emoji: "🏥", color: "#fbbf24" },
  { key: "RED FLAGS", emoji: "🚨", color: "#f87171" },
  { key: "WHAT TO DO", emoji: "✅", color: "#34d399" },
];

export default function CPTCodeLookup() {
  const { consumeCredit, showLoginModal } = useAuth();
  const [query, setQuery] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  const lookup = async () => {
    if (!query.trim()) return;
    if (!consumeCredit()) { showLoginModal(); return; }
    setLoading(true);
    setResult(null);
    setError(null);
    try {
      const r = await axios.post("/api/tools", { tool: "cptlookup", query });
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
      const regex = new RegExp(`${s.key}:\\n([\\s\\S]*?)(?=\\n[A-Z][A-Z/ ]+:|$)`);
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
        <div style={{ fontSize: 36, marginBottom: 10 }}>🔢</div>
        <h1 style={{ fontSize: "clamp(20px, 5vw, 28px)", fontWeight: 900, color: "#f1f5f9", marginBottom: 8, letterSpacing: "-0.02em" }}>CPT Code Lookup</h1>
        <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.6, maxWidth: 440, margin: "0 auto" }}>
          Paste any CPT code or procedure name — get a plain-English explanation, Medicare rate, what a fair charge looks like, and how to dispute if overcharged.
        </p>
      </div>

      <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 20, marginBottom: 20 }}>
        <label style={{ fontSize: 11, fontWeight: 700, color: "#475569", display: "block", marginBottom: 10, letterSpacing: "0.06em", textTransform: "uppercase" }}>CPT Code or Procedure Name</label>
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={e => e.key === "Enter" && lookup()}
          placeholder="e.g. 99214, 80053, 'MRI brain scan', 'blood test'"
          style={{ width: "100%", padding: "12px 14px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, fontSize: 14, color: "#f1f5f9", fontFamily: FONT, marginBottom: 14, boxSizing: "border-box" }}
        />
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 10, fontWeight: 600, color: "#334155", marginBottom: 8, letterSpacing: "0.08em" }}>COMMON CODES</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {COMMON.map(c => (
              <button key={c.code} onClick={() => setQuery(c.code)} style={{ padding: "4px 10px", background: query === c.code ? "rgba(16,185,129,0.12)" : "rgba(255,255,255,0.04)", border: `1px solid ${query === c.code ? "rgba(16,185,129,0.3)" : "rgba(255,255,255,0.08)"}`, borderRadius: 20, fontSize: 11, color: query === c.code ? "#10b981" : "#64748b", cursor: "pointer", fontFamily: FONT }}>
                {c.code} — {c.label}
              </button>
            ))}
          </div>
        </div>
        <button onClick={lookup} disabled={loading || !query.trim()} style={{ width: "100%", padding: "13px", background: loading || !query.trim() ? "rgba(255,255,255,0.05)" : "linear-gradient(135deg, #10b981, #059669)", color: loading || !query.trim() ? "#334155" : "#fff", border: "none", borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: loading || !query.trim() ? "default" : "pointer", fontFamily: FONT, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, transition: "all 0.2s" }}>
          {loading ? <><span style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,0.15)", borderTop: "2px solid #10b981", borderRadius: "50%", animation: "spin 0.8s linear infinite", display: "inline-block" }} /> Looking up...</> : "🔢 Look Up Code"}
        </button>
      </div>

      {error && <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: 12, padding: 16, color: "#f87171", fontSize: 14, marginBottom: 16 }}>{error}</div>}

      {result && (
        <div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: "#334155", letterSpacing: "0.12em" }}>LOOKUP RESULTS</div>
            <button onClick={() => { navigator.clipboard.writeText(result); setCopied(true); setTimeout(() => setCopied(false), 2000); }} style={{ fontSize: 12, color: copied ? "#10b981" : "#64748b", background: "rgba(255,255,255,0.04)", border: `1px solid ${copied ? "rgba(16,185,129,0.3)" : "rgba(255,255,255,0.08)"}`, padding: "4px 12px", borderRadius: 8, cursor: "pointer", fontFamily: FONT, transition: "all 0.2s" }}>{copied ? "✓ Copied" : "Copy"}</button>
          </div>
          {parseResult(result)}
          <button onClick={() => { setResult(null); setQuery(""); }} style={{ marginTop: 8, padding: "8px 16px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, color: "#64748b", fontSize: 12, cursor: "pointer", fontFamily: FONT }}>← Look up another code</button>
        </div>
      )}

      {!result && !loading && (
        <div style={{ marginTop: 24, background: "rgba(96,165,250,0.05)", border: "1px solid rgba(96,165,250,0.15)", borderRadius: 14, padding: "18px 20px" }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#60a5fa", letterSpacing: "0.1em", marginBottom: 10, textTransform: "uppercase" }}>💡 Where to find CPT codes on your bill</div>
          <div style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.75 }}>
            CPT codes are 5-digit numbers on your Explanation of Benefits (EOB) or itemized bill. Look for columns labeled "Procedure Code," "Service Code," or "CPT." They appear as numbers like 99214, 80053, or 71046.
          </div>
        </div>
      )}
    </div>
  );
}
