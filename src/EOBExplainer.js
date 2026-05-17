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

const SECTIONS = [
  { key: "WHAT HAPPENED", emoji: "📄", color: "#60a5fa", label: "What Happened" },
  { key: "INSURANCE PAID", emoji: "🏥", color: "#34d399", label: "Insurance Paid" },
  { key: "YOUR RESPONSIBILITY", emoji: "💳", color: "#fbbf24", label: "Your Responsibility" },
  { key: "WHAT WAS WRITTEN OFF", emoji: "✂️", color: "#a78bfa", label: "What Was Written Off" },
  { key: "RED FLAGS", emoji: "🚩", color: "#f87171", label: "Red Flags" },
  { key: "WHAT TO DO NEXT", emoji: "✅", color: "#34d399", label: "What To Do Next" },
  { key: "APPEAL RIGHTS", emoji: "⚖️", color: "#60a5fa", label: "Appeal Rights" },
];

function parseEOB(text) {
  return SECTIONS.map((section, i) => {
    const regex = new RegExp(`${section.key}:\\n([\\s\\S]*?)(?=\\n[A-Z][A-Z &]+:|$)`);
    const match = clean.match(regex);
    const content = match ? match[1].trim() : null;
    if (!content) return null;

    const isRedFlags = section.key === "RED FLAGS";
    const noFlags = isRedFlags && content.toLowerCase().includes("no red flags");

    return (
      <div key={section.key} style={{ background: isRedFlags && !noFlags ? "rgba(239,68,68,0.06)" : "rgba(255,255,255,0.03)", border: `1px solid ${isRedFlags && !noFlags ? "rgba(239,68,68,0.25)" : "rgba(255,255,255,0.08)"}`, borderLeft: `3px solid ${isRedFlags && !noFlags ? "#f87171" : section.color}`, borderRadius: 12, padding: "18px 20px", marginBottom: 10, animation: "fadeUp 0.35s ease forwards", animationDelay: `${i * 0.07}s`, animationFillMode: "both" }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: isRedFlags && !noFlags ? "#f87171" : section.color, letterSpacing: "0.12em", marginBottom: 10, textTransform: "uppercase" }}>
          {section.emoji} {section.label}
        </div>
        <div style={{ fontSize: 14, color: "#cbd5e1", lineHeight: 1.8, whiteSpace: "pre-line" }}>{content}</div>
      </div>
    );
  });
}

const EXAMPLE = `Service: ER Visit 01/15/2024
Provider: City General Hospital
Billed amount: $4,200.00
Insurance discount: $1,680.00
Amount plan paid: $1,764.00
Deductible applied: $500.00
Coinsurance (20%): $256.00
Amount you owe: $756.00`;

export default function EOBExplainer() {
  const { consumeCredit } = useAuth();
  const [eob, setEob] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [focused, setFocused] = useState(false);

  const explain = async () => {
    if (!eob.trim()) return;
    if (!consumeCredit()) return;
    setLoading(true);
    setResult(null);
    setError(null);
    try {
      const res = await axios.post("/api/tools", { tool: "eob", eob });
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
          Understand your <span style={{ color: "#10b981", textShadow: "0 0 20px rgba(16,185,129,0.4)" }}>EOB.</span>
        </h1>
        <p style={{ fontSize: "clamp(14px, 3vw, 15px)", color: "#64748b", lineHeight: 1.6, maxWidth: 460, margin: "0 auto" }}>
          Paste your Explanation of Benefits. We'll decode exactly what insurance paid, what you owe, and whether to dispute it.
        </p>
      </div>

      <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 20, marginBottom: 20 }}>
        <div style={{ marginBottom: 12 }}>
          <label style={{ fontSize: 11, fontWeight: 700, color: "#475569", display: "block", marginBottom: 6, letterSpacing: "0.06em", textTransform: "uppercase" }}>
            Paste your Explanation of Benefits
          </label>
          <textarea
            value={eob}
            onChange={(e) => setEob(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder="Paste the text from your EOB — key lines like billed amount, insurance paid, your responsibility, adjustments..."
            style={{ ...IS, height: 160, resize: "vertical", border: focused ? "1px solid rgba(16,185,129,0.5)" : "1px solid rgba(255,255,255,0.08)" }}
          />
        </div>
        <div style={{ marginBottom: 16 }}>
          <button
            onClick={() => setEob(EXAMPLE)}
            style={{ fontSize: 12, color: "#64748b", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", padding: "5px 14px", borderRadius: 8, cursor: "pointer", fontFamily: FONT }}
          >
            Try an example
          </button>
        </div>
        <button
          onClick={explain}
          disabled={loading || !eob.trim()}
          style={{ width: "100%", padding: "14px", background: loading || !eob.trim() ? "rgba(255,255,255,0.05)" : "linear-gradient(135deg, #10b981, #059669)", color: loading || !eob.trim() ? "#334155" : "#fff", border: "none", borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: loading || !eob.trim() ? "default" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, fontFamily: FONT, boxShadow: loading || !eob.trim() ? "none" : "0 8px 28px rgba(16,185,129,0.35)" }}
        >
          {loading
            ? (<><span style={{ width: 17, height: 17, border: "2px solid rgba(255,255,255,0.15)", borderTop: "2px solid #10b981", borderRadius: "50%", animation: "spin 0.8s linear infinite", display: "inline-block" }} />Decoding your EOB...</>)
            : "📋 Explain My EOB"}
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
            <div style={{ fontSize: 10, fontWeight: 700, color: "#334155", letterSpacing: "0.12em" }}>EOB BREAKDOWN</div>
            <div style={{ display: "flex", gap: 8 }}>
              <button
                onClick={() => { navigator.clipboard.writeText(result); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
                style={{ fontSize: 12, color: copied ? "#10b981" : "#64748b", background: "rgba(255,255,255,0.04)", border: `1px solid ${copied ? "rgba(16,185,129,0.3)" : "rgba(255,255,255,0.08)"}`, padding: "5px 12px", borderRadius: 8, cursor: "pointer", fontFamily: FONT, transition: "all 0.2s" }}
              >
                {copied ? "✓ Copied" : "Copy"}
              </button>
              <button
                onClick={() => { setResult(null); setEob(""); }}
                style={{ fontSize: 12, color: "#64748b", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", padding: "5px 12px", borderRadius: 8, cursor: "pointer", fontFamily: FONT }}
              >
                ← New EOB
              </button>
            </div>
          </div>
          <div style={{ background: "rgba(96,165,250,0.06)", border: "1px solid rgba(96,165,250,0.2)", borderRadius: 12, padding: "12px 16px", marginBottom: 14, fontSize: 13, color: "#60a5fa", fontWeight: 600 }}>
            💡 You have the right to appeal any insurance denial within 180 days of receiving your EOB.
          </div>
          {parseEOB(result)}
        </div>
      )}
    </div>
  );
}
