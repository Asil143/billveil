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
  { key: "LETTER", emoji: "📝", color: "#60a5fa", label: "Authorization Letter" },
  { key: "KEY ARGUMENTS", emoji: "💪", color: "#34d399", label: "Key Arguments" },
  { key: "SUPPORTING DOCUMENTS TO ATTACH", emoji: "📎", color: "#fbbf24", label: "Supporting Documents to Attach" },
  { key: "WHAT TO EXPECT", emoji: "⏱️", color: "#a78bfa", label: "What to Expect" },
  { key: "IF DENIED", emoji: "🛡️", color: "#f87171", label: "If Denied" },
];

function parseResult(text) {
  return SECTIONS.map((section, i) => {
    const regex = new RegExp(`${section.key}:\\n([\\s\\S]*?)(?=\\n[A-Z][A-Z &]+:|$)`);
    const match = clean.match(regex);
    const content = match ? match[1].trim() : null;
    if (!content) return null;

    const isLetter = section.key === "LETTER";
    const isDenied = section.key === "IF DENIED";

    return (
      <div key={section.key} style={{ background: isDenied ? "rgba(239,68,68,0.06)" : isLetter ? "rgba(96,165,250,0.04)" : "rgba(255,255,255,0.03)", border: `1px solid ${isDenied ? "rgba(239,68,68,0.2)" : isLetter ? "rgba(96,165,250,0.2)" : "rgba(255,255,255,0.08)"}`, borderLeft: `3px solid ${section.color}`, borderRadius: 12, padding: "18px 20px", marginBottom: 10, animation: "fadeUp 0.35s ease forwards", animationDelay: `${i * 0.07}s`, animationFillMode: "both" }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: section.color, letterSpacing: "0.12em", marginBottom: 10, textTransform: "uppercase" }}>
          {section.emoji} {section.label}
        </div>
        {isLetter ? (
          <pre style={{ fontSize: 13, color: "#cbd5e1", lineHeight: 1.9, whiteSpace: "pre-wrap", fontFamily: "'Courier New', monospace", background: "rgba(0,0,0,0.2)", borderRadius: 8, padding: "16px", margin: 0 }}>{content}</pre>
        ) : (
          <div style={{ fontSize: 14, color: "#cbd5e1", lineHeight: 1.8, whiteSpace: "pre-line" }}>{content}</div>
        )}
      </div>
    );
  });
}

export default function PriorAuthHelper() {
  const { consumeCredit, profileData } = useAuth();
  const [procedure, setProcedure] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [insurance, setInsurance] = useState("");
  const [doctor, setDoctor] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [focused, setFocused] = useState(null);

  const name = profileData?.firstName
    ? `${profileData.firstName} ${profileData.lastName || ""}`.trim()
    : "";

  const generate = async () => {
    if (!procedure.trim()) return;
    if (!consumeCredit()) return;
    setLoading(true);
    setResult(null);
    setError(null);
    try {
      const res = await axios.post("/api/tools", { tool: "priorauth", procedure, diagnosis, insurance, doctor, name });
      setResult(res.data.result);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const field = (label, value, setter, placeholder, key, opts = {}) => (
    <div style={{ marginBottom: 12 }}>
      <label style={{ fontSize: 11, fontWeight: 700, color: "#475569", display: "block", marginBottom: 6, letterSpacing: "0.06em", textTransform: "uppercase" }}>
        {label} {opts.optional && <span style={{ fontWeight: 400, color: "#334155", textTransform: "none", letterSpacing: 0 }}>optional</span>}
      </label>
      {opts.textarea ? (
        <textarea
          value={value}
          onChange={(e) => setter(e.target.value)}
          onFocus={() => setFocused(key)}
          onBlur={() => setFocused(null)}
          placeholder={placeholder}
          style={{ ...IS, height: 80, resize: "vertical", border: focused === key ? "1px solid rgba(16,185,129,0.5)" : "1px solid rgba(255,255,255,0.08)" }}
        />
      ) : (
        <input
          value={value}
          onChange={(e) => setter(e.target.value)}
          onFocus={() => setFocused(key)}
          onBlur={() => setFocused(null)}
          placeholder={placeholder}
          style={{ ...IS, border: focused === key ? "1px solid rgba(16,185,129,0.5)" : "1px solid rgba(255,255,255,0.08)" }}
        />
      )}
    </div>
  );

  return (
    <div>
      <div style={{ textAlign: "center", marginBottom: 28 }}>
        <h1 style={{ fontSize: "clamp(22px, 6vw, 32px)", fontWeight: 900, lineHeight: 1.15, letterSpacing: "-0.03em", marginBottom: 8, color: "#f1f5f9" }}>
          Get your procedure <span style={{ color: "#10b981", textShadow: "0 0 20px rgba(16,185,129,0.4)" }}>pre-approved.</span>
        </h1>
        <p style={{ fontSize: "clamp(14px, 3vw, 15px)", color: "#64748b", lineHeight: 1.6, maxWidth: 460, margin: "0 auto" }}>
          AI writes a complete prior authorization letter for your insurance company — ready to print and submit.
        </p>
      </div>

      <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 20, marginBottom: 20 }}>
        {field("Procedure or treatment requested", procedure, setProcedure, "e.g. MRI lumbar spine, knee replacement surgery, physical therapy 12 sessions", "procedure", { textarea: true })}
        {field("Diagnosis / reason for treatment", diagnosis, setDiagnosis, "e.g. lumbar disc herniation L4-L5 with radiculopathy", "diagnosis")}
        {field("Insurance company", insurance, setInsurance, "e.g. Blue Cross Blue Shield, Aetna, UnitedHealth", "insurance", { optional: true })}
        {field("Ordering physician", doctor, setDoctor, "e.g. Dr. Sarah Johnson, MD — Orthopedic Surgery", "doctor", { optional: true })}

        <button
          onClick={generate}
          disabled={loading || !procedure.trim()}
          style={{ width: "100%", padding: "14px", background: loading || !procedure.trim() ? "rgba(255,255,255,0.05)" : "linear-gradient(135deg, #10b981, #059669)", color: loading || !procedure.trim() ? "#334155" : "#fff", border: "none", borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: loading || !procedure.trim() ? "default" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, fontFamily: FONT, boxShadow: loading || !procedure.trim() ? "none" : "0 8px 28px rgba(16,185,129,0.35)" }}
        >
          {loading
            ? (<><span style={{ width: 17, height: 17, border: "2px solid rgba(255,255,255,0.15)", borderTop: "2px solid #10b981", borderRadius: "50%", animation: "spin 0.8s linear infinite", display: "inline-block" }} />Writing your letter...</>)
            : "📝 Generate Prior Auth Letter"}
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
            <div style={{ fontSize: 10, fontWeight: 700, color: "#334155", letterSpacing: "0.12em" }}>PRIOR AUTHORIZATION PACKAGE</div>
            <div style={{ display: "flex", gap: 8 }}>
              <button
                onClick={() => { navigator.clipboard.writeText(result); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
                style={{ fontSize: 12, color: copied ? "#10b981" : "#64748b", background: "rgba(255,255,255,0.04)", border: `1px solid ${copied ? "rgba(16,185,129,0.3)" : "rgba(255,255,255,0.08)"}`, padding: "5px 12px", borderRadius: 8, cursor: "pointer", fontFamily: FONT, transition: "all 0.2s" }}
              >
                {copied ? "✓ Copied" : "Copy"}
              </button>
              <button
                onClick={() => { setResult(null); setProcedure(""); setDiagnosis(""); setInsurance(""); setDoctor(""); }}
                style={{ fontSize: 12, color: "#64748b", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", padding: "5px 12px", borderRadius: 8, cursor: "pointer", fontFamily: FONT }}
              >
                ← New Request
              </button>
            </div>
          </div>
          <div style={{ background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: 12, padding: "12px 16px", marginBottom: 14, fontSize: 13, color: "#10b981", fontWeight: 600 }}>
            📌 Have your doctor's office submit this letter with supporting medical records. Follow up by phone in 3–5 business days.
          </div>
          {parseResult(result)}
        </div>
      )}
    </div>
  );
}
