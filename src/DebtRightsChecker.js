import { useState } from "react";
import { useAuth } from "./AuthContext";
import axios from "axios";

const FONT = "'Inter', system-ui, sans-serif";

const IS = {
  width: "100%", padding: "11px 14px",
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: 10, fontSize: 14, color: "#f1f5f9",
  fontFamily: FONT, outline: "none", boxSizing: "border-box",
};

const US_STATES = [
  "Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut",
  "Delaware","Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa",
  "Kansas","Kentucky","Louisiana","Maine","Maryland","Massachusetts","Michigan",
  "Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada","New Hampshire",
  "New Jersey","New Mexico","New York","North Carolina","North Dakota","Ohio",
  "Oklahoma","Oregon","Pennsylvania","Rhode Island","South Carolina","South Dakota",
  "Tennessee","Texas","Utah","Vermont","Virginia","Washington","West Virginia",
  "Wisconsin","Wyoming","Washington D.C.",
];

const SECTIONS = [
  { key: "YOUR KEY RIGHTS", emoji: "⚖️", color: "#10b981", label: "Your Key Rights" },
  { key: "CREDIT REPORTING RULES", emoji: "📊", color: "#60a5fa", label: "Credit Reporting Rules" },
  { key: "STATUTE OF LIMITATIONS", emoji: "⏳", color: "#fbbf24", label: "Statute of Limitations" },
  { key: "DEBT COLLECTOR RULES", emoji: "🚫", color: "#f87171", label: "Debt Collector Rules" },
  { key: "HOSPITAL OBLIGATIONS", emoji: "🏥", color: "#a78bfa", label: "Hospital Obligations" },
  { key: "WHAT TO DO NOW", emoji: "✅", color: "#34d399", label: "What To Do Now" },
  { key: "MAGIC WORDS TO SAY", emoji: "🗣️", color: "#fbbf24", label: "Magic Words to Say" },
];

function parseResult(text) {
  return SECTIONS.map((section, i) => {
    const regex = new RegExp(`${section.key}:\\n([\\s\\S]*?)(?=\\n[A-Z][A-Z &]+:|$)`);
    const match = clean.match(regex);
    const content = match ? match[1].trim() : null;
    if (!content) return null;

    const isMagic = section.key === "MAGIC WORDS TO SAY";

    return (
      <div key={section.key} style={{ background: isMagic ? "rgba(251,191,36,0.05)" : "rgba(255,255,255,0.03)", border: `1px solid ${isMagic ? "rgba(251,191,36,0.2)" : "rgba(255,255,255,0.08)"}`, borderLeft: `3px solid ${section.color}`, borderRadius: 12, padding: "18px 20px", marginBottom: 10, animation: "fadeUp 0.35s ease forwards", animationDelay: `${i * 0.07}s`, animationFillMode: "both" }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: section.color, letterSpacing: "0.12em", marginBottom: 10, textTransform: "uppercase" }}>
          {section.emoji} {section.label}
        </div>
        {isMagic ? (
          <pre style={{ fontSize: 13, color: "#fde68a", lineHeight: 1.9, whiteSpace: "pre-wrap", fontFamily: "'Courier New', monospace", background: "rgba(0,0,0,0.25)", borderRadius: 8, padding: "14px", margin: 0 }}>{content}</pre>
        ) : (
          <div style={{ fontSize: 14, color: "#cbd5e1", lineHeight: 1.8, whiteSpace: "pre-line" }}>{content}</div>
        )}
      </div>
    );
  });
}

export default function DebtRightsChecker() {
  const { consumeCredit } = useAuth();
  const [state, setState] = useState("");
  const [situation, setSituation] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [focused, setFocused] = useState(null);

  const check = async () => {
    if (!state) return;
    if (!consumeCredit()) return;
    setLoading(true);
    setResult(null);
    setError(null);
    try {
      const res = await axios.post("/api/tools", { tool: "debtrights", state, situation });
      setResult(res.data.result);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div style={{ textAlign: "center", marginBottom: 28 }}>
        <h1 style={{ fontSize: "clamp(22px, 6vw, 32px)", fontWeight: 900, lineHeight: 1.15, letterSpacing: "-0.03em", marginBottom: 8, color: "#f1f5f9" }}>
          Know your <span style={{ color: "#10b981", textShadow: "0 0 20px rgba(16,185,129,0.4)" }}>legal rights.</span>
        </h1>
        <p style={{ fontSize: "clamp(14px, 3vw, 15px)", color: "#64748b", lineHeight: 1.6, maxWidth: 460, margin: "0 auto" }}>
          Medical debt collectors count on you not knowing the law. Find out exactly what they can and can't do — and what to say to stop them.
        </p>
      </div>

      <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 20, marginBottom: 20 }}>
        <div style={{ marginBottom: 12 }}>
          <label style={{ fontSize: 11, fontWeight: 700, color: "#475569", display: "block", marginBottom: 6, letterSpacing: "0.06em", textTransform: "uppercase" }}>
            Your state
          </label>
          <select
            value={state}
            onChange={(e) => setState(e.target.value)}
            onFocus={() => setFocused("state")}
            onBlur={() => setFocused(null)}
            style={{ ...IS, border: focused === "state" ? "1px solid rgba(16,185,129,0.5)" : "1px solid rgba(255,255,255,0.08)", cursor: "pointer" }}
          >
            <option value="" style={{ background: "#0d1526" }}>Select your state…</option>
            {US_STATES.map((s) => (
              <option key={s} value={s} style={{ background: "#0d1526" }}>{s}</option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 11, fontWeight: 700, color: "#475569", display: "block", marginBottom: 6, letterSpacing: "0.06em", textTransform: "uppercase" }}>
            Describe your situation <span style={{ fontWeight: 400, color: "#334155", textTransform: "none", letterSpacing: 0 }}>optional</span>
          </label>
          <textarea
            value={situation}
            onChange={(e) => setSituation(e.target.value)}
            onFocus={() => setFocused("situation")}
            onBlur={() => setFocused(null)}
            placeholder="e.g. A collections agency keeps calling me about a $3,200 ER bill from 2022. I can't afford to pay it."
            style={{ ...IS, height: 90, resize: "vertical", border: focused === "situation" ? "1px solid rgba(16,185,129,0.5)" : "1px solid rgba(255,255,255,0.08)" }}
          />
        </div>

        <button
          onClick={check}
          disabled={loading || !state}
          style={{ width: "100%", padding: "14px", background: loading || !state ? "rgba(255,255,255,0.05)" : "linear-gradient(135deg, #10b981, #059669)", color: loading || !state ? "#334155" : "#fff", border: "none", borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: loading || !state ? "default" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, fontFamily: FONT, boxShadow: loading || !state ? "none" : "0 8px 28px rgba(16,185,129,0.35)" }}
        >
          {loading
            ? (<><span style={{ width: 17, height: 17, border: "2px solid rgba(255,255,255,0.15)", borderTop: "2px solid #10b981", borderRadius: "50%", animation: "spin 0.8s linear infinite", display: "inline-block" }} />Looking up your rights...</>)
            : "⚖️ Check My Rights"}
        </button>
      </div>

      {error && (
        <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: 12, padding: 16, color: "#f87171", fontSize: 14, marginBottom: 16 }}>
          {error}
        </div>
      )}

      {result && (
        <div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: "#334155", letterSpacing: "0.12em" }}>YOUR RIGHTS IN {state.toUpperCase()}</div>
            <div style={{ display: "flex", gap: 8 }}>
              <button
                onClick={() => { navigator.clipboard.writeText(result); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
                style={{ fontSize: 12, color: copied ? "#10b981" : "#64748b", background: "rgba(255,255,255,0.04)", border: `1px solid ${copied ? "rgba(16,185,129,0.3)" : "rgba(255,255,255,0.08)"}`, padding: "5px 12px", borderRadius: 8, cursor: "pointer", fontFamily: FONT, transition: "all 0.2s" }}
              >
                {copied ? "✓ Copied" : "Copy"}
              </button>
              <button
                onClick={() => { setResult(null); setState(""); setSituation(""); }}
                style={{ fontSize: 12, color: "#64748b", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", padding: "5px 12px", borderRadius: 8, cursor: "pointer", fontFamily: FONT }}
              >
                ← New Check
              </button>
            </div>
          </div>
          <div style={{ background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 12, padding: "12px 16px", marginBottom: 14, fontSize: 13, color: "#f87171", fontWeight: 600 }}>
            ⚠️ This is educational information, not legal advice. For lawsuits or large debts, consult a consumer rights attorney — many work on contingency for FDCPA cases.
          </div>
          {parseResult(result)}
        </div>
      )}
    </div>
  );
}
