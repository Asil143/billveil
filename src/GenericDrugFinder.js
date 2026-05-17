'use client';
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
  { key: "GENERIC EQUIVALENT", emoji: "💊", color: "#10b981", label: "Generic Equivalent" },
  { key: "HOW MUCH YOU COULD SAVE", emoji: "💰", color: "#34d399", label: "How Much You Could Save" },
  { key: "BEST PHARMACY PRICES", emoji: "🏪", color: "#60a5fa", label: "Best Pharmacy Prices" },
  { key: "DISCOUNT PROGRAMS", emoji: "🎟️", color: "#fbbf24", label: "Discount Programs" },
  { key: "HOW TO ASK YOUR DOCTOR", emoji: "🗣️", color: "#a78bfa", label: "How to Ask Your Doctor" },
  { key: "MANUFACTURER COUPONS", emoji: "🏷️", color: "#f87171", label: "Manufacturer Coupons" },
  { key: "THERAPEUTIC ALTERNATIVES", emoji: "🔄", color: "#34d399", label: "Therapeutic Alternatives" },
];

function parseResult(text) {
  return SECTIONS.map((section, i) => {
    const regex = new RegExp(`${section.key}:\\n([\\s\\S]*?)(?=\\n[A-Z][A-Z &]+:|$)`);
    const match = clean.match(regex);
    const content = match ? match[1].trim() : null;
    if (!content) return null;

    const isSavings = section.key === "HOW MUCH YOU COULD SAVE";
    const isDoctor = section.key === "HOW TO ASK YOUR DOCTOR";

    return (
      <div key={section.key} style={{ background: isSavings ? "rgba(52,211,153,0.05)" : "rgba(255,255,255,0.03)", border: `1px solid ${isSavings ? "rgba(52,211,153,0.2)" : "rgba(255,255,255,0.08)"}`, borderLeft: `3px solid ${section.color}`, borderRadius: 12, padding: "18px 20px", marginBottom: 10, animation: "fadeUp 0.35s ease forwards", animationDelay: `${i * 0.07}s`, animationFillMode: "both" }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: section.color, letterSpacing: "0.12em", marginBottom: 10, textTransform: "uppercase" }}>
          {section.emoji} {section.label}
        </div>
        {isDoctor ? (
          <pre style={{ fontSize: 13, color: "#e2e8f0", lineHeight: 1.9, whiteSpace: "pre-wrap", fontFamily: "'Courier New', monospace", background: "rgba(167,139,250,0.06)", borderRadius: 8, padding: "14px", margin: 0 }}>{content}</pre>
        ) : (
          <div style={{ fontSize: 14, color: "#cbd5e1", lineHeight: 1.8, whiteSpace: "pre-line" }}>{content}</div>
        )}
      </div>
    );
  });
}

export default function GenericDrugFinder() {
  const { consumeCredit } = useAuth();
  const [drug, setDrug] = useState("");
  const [dose, setDose] = useState("");
  const [insurance, setInsurance] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [focused, setFocused] = useState(null);

  const find = async () => {
    if (!drug.trim()) return;
    if (!consumeCredit()) return;
    setLoading(true);
    setResult(null);
    setError(null);
    try {
      const res = await axios.post("/api/tools", { tool: "drugfinder", drug, dose, insurance });
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
          Stop overpaying for <span style={{ color: "#10b981", textShadow: "0 0 20px rgba(16,185,129,0.4)" }}>prescriptions.</span>
        </h1>
        <p style={{ fontSize: "clamp(14px, 3vw, 15px)", color: "#64748b", lineHeight: 1.6, maxWidth: 460, margin: "0 auto" }}>
          Find the generic equivalent, cheapest pharmacy, and every discount program available for your medication.
        </p>
      </div>

      <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 20, marginBottom: 20 }}>
        <div style={{ marginBottom: 12 }}>
          <label style={{ fontSize: 11, fontWeight: 700, color: "#475569", display: "block", marginBottom: 6, letterSpacing: "0.06em", textTransform: "uppercase" }}>
            Drug name
          </label>
          <input
            value={drug}
            onChange={(e) => setDrug(e.target.value)}
            onFocus={() => setFocused("drug")}
            onBlur={() => setFocused(null)}
            placeholder="e.g. Ozempic, Humira, Eliquis, Xarelto"
            style={{ ...IS, border: focused === "drug" ? "1px solid rgba(16,185,129,0.5)" : "1px solid rgba(255,255,255,0.08)" }}
          />
        </div>

        <div style={{ marginBottom: 12 }}>
          <label style={{ fontSize: 11, fontWeight: 700, color: "#475569", display: "block", marginBottom: 6, letterSpacing: "0.06em", textTransform: "uppercase" }}>
            Dose / strength <span style={{ fontWeight: 400, color: "#334155", textTransform: "none", letterSpacing: 0 }}>optional</span>
          </label>
          <input
            value={dose}
            onChange={(e) => setDose(e.target.value)}
            onFocus={() => setFocused("dose")}
            onBlur={() => setFocused(null)}
            placeholder="e.g. 10mg daily, 0.5mg weekly injection"
            style={{ ...IS, border: focused === "dose" ? "1px solid rgba(16,185,129,0.5)" : "1px solid rgba(255,255,255,0.08)" }}
          />
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 11, fontWeight: 700, color: "#475569", display: "block", marginBottom: 6, letterSpacing: "0.06em", textTransform: "uppercase" }}>
            Insurance <span style={{ fontWeight: 400, color: "#334155", textTransform: "none", letterSpacing: 0 }}>optional</span>
          </label>
          <input
            value={insurance}
            onChange={(e) => setInsurance(e.target.value)}
            onFocus={() => setFocused("insurance")}
            onBlur={() => setFocused(null)}
            placeholder="e.g. Medicare Part D, Medicaid, Blue Cross, uninsured"
            style={{ ...IS, border: focused === "insurance" ? "1px solid rgba(16,185,129,0.5)" : "1px solid rgba(255,255,255,0.08)" }}
          />
        </div>

        <button
          onClick={find}
          disabled={loading || !drug.trim()}
          style={{ width: "100%", padding: "14px", background: loading || !drug.trim() ? "rgba(255,255,255,0.05)" : "linear-gradient(135deg, #10b981, #059669)", color: loading || !drug.trim() ? "#334155" : "#fff", border: "none", borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: loading || !drug.trim() ? "default" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, fontFamily: FONT, boxShadow: loading || !drug.trim() ? "none" : "0 8px 28px rgba(16,185,129,0.35)" }}
        >
          {loading
            ? (<><span style={{ width: 17, height: 17, border: "2px solid rgba(255,255,255,0.15)", borderTop: "2px solid #10b981", borderRadius: "50%", animation: "spin 0.8s linear infinite", display: "inline-block" }} />Finding savings...</>)
            : "💊 Find Generic & Savings"}
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
            <div style={{ fontSize: 10, fontWeight: 700, color: "#334155", letterSpacing: "0.12em" }}>SAVINGS REPORT — {drug.toUpperCase()}</div>
            <div style={{ display: "flex", gap: 8 }}>
              <button
                onClick={() => { navigator.clipboard.writeText(result); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
                style={{ fontSize: 12, color: copied ? "#10b981" : "#64748b", background: "rgba(255,255,255,0.04)", border: `1px solid ${copied ? "rgba(16,185,129,0.3)" : "rgba(255,255,255,0.08)"}`, padding: "5px 12px", borderRadius: 8, cursor: "pointer", fontFamily: FONT, transition: "all 0.2s" }}
              >
                {copied ? "✓ Copied" : "Copy"}
              </button>
              <button
                onClick={() => { setResult(null); setDrug(""); setDose(""); setInsurance(""); }}
                style={{ fontSize: 12, color: "#64748b", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", padding: "5px 12px", borderRadius: 8, cursor: "pointer", fontFamily: FONT }}
              >
                ← New Search
              </button>
            </div>
          </div>
          <div style={{ background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: 12, padding: "12px 16px", marginBottom: 14, fontSize: 13, color: "#10b981", fontWeight: 600 }}>
            💊 Prices are estimates. Always verify at the pharmacy counter and compare GoodRx before paying.
          </div>
          {parseResult(result)}
        </div>
      )}
    </div>
  );
}
