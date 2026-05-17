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
  { key: "WHAT TO KNOW FIRST", emoji: "💡", color: "#60a5fa", label: "What to Know First" },
  { key: "SPECIALIST TO SEE", emoji: "🩺", color: "#10b981", label: "Specialist to See" },
  { key: "QUESTIONS TO ASK", emoji: "❓", color: "#fbbf24", label: "Questions to Ask" },
  { key: "RED FLAGS TO WATCH FOR", emoji: "🚩", color: "#f87171", label: "Red Flags to Watch For" },
  { key: "HOW TO GET YOUR RECORDS", emoji: "📁", color: "#a78bfa", label: "How to Get Your Records" },
  { key: "WHAT TO BRING", emoji: "🎒", color: "#34d399", label: "What to Bring" },
  { key: "IF OPINIONS DIFFER", emoji: "⚖️", color: "#60a5fa", label: "If Opinions Differ" },
];

function parseResult(text) {
  return SECTIONS.map((section, i) => {
    const regex = new RegExp(`${section.key}:\\n([\\s\\S]*?)(?=\\n[A-Z][A-Z &]+:|$)`);
    const match = text.match(regex);
    const content = match ? match[1].trim() : null;
    if (!content) return null;

    const isRedFlags = section.key === "RED FLAGS TO WATCH FOR";
    const isQuestions = section.key === "QUESTIONS TO ASK";

    return (
      <div key={section.key} style={{ background: isRedFlags ? "rgba(239,68,68,0.06)" : "rgba(255,255,255,0.03)", border: `1px solid ${isRedFlags ? "rgba(239,68,68,0.2)" : "rgba(255,255,255,0.08)"}`, borderLeft: `3px solid ${section.color}`, borderRadius: 12, padding: "18px 20px", marginBottom: 10, animation: "fadeUp 0.35s ease forwards", animationDelay: `${i * 0.07}s`, animationFillMode: "both" }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: section.color, letterSpacing: "0.12em", marginBottom: 10, textTransform: "uppercase" }}>
          {section.emoji} {section.label}
        </div>
        {isQuestions ? (
          <div style={{ fontSize: 14, color: "#e2e8f0", lineHeight: 2, whiteSpace: "pre-line", background: "rgba(251,191,36,0.04)", borderRadius: 8, padding: "12px 14px" }}>{content}</div>
        ) : (
          <div style={{ fontSize: 14, color: "#cbd5e1", lineHeight: 1.8, whiteSpace: "pre-line" }}>{content}</div>
        )}
      </div>
    );
  });
}

export default function SecondOpinionFinder() {
  const { consumeCredit } = useAuth();
  const [diagnosis, setDiagnosis] = useState("");
  const [procedure, setProcedure] = useState("");
  const [concern, setConcern] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [focused, setFocused] = useState(null);

  const generate = async () => {
    if (!diagnosis.trim()) return;
    if (!consumeCredit()) return;
    setLoading(true);
    setResult(null);
    setError(null);
    try {
      const res = await axios.post("/api/tools", { tool: "secondopinion", diagnosis, procedure, concern });
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
          Get a smarter <span style={{ color: "#10b981", textShadow: "0 0 20px rgba(16,185,129,0.4)" }}>second opinion.</span>
        </h1>
        <p style={{ fontSize: "clamp(14px, 3vw, 15px)", color: "#64748b", lineHeight: 1.6, maxWidth: 460, margin: "0 auto" }}>
          Know exactly which specialist to see, what questions to ask, and what red flags to look for before agreeing to any treatment.
        </p>
      </div>

      <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 20, marginBottom: 20 }}>
        <div style={{ marginBottom: 12 }}>
          <label style={{ fontSize: 11, fontWeight: 700, color: "#475569", display: "block", marginBottom: 6, letterSpacing: "0.06em", textTransform: "uppercase" }}>
            Your diagnosis
          </label>
          <textarea
            value={diagnosis}
            onChange={(e) => setDiagnosis(e.target.value)}
            onFocus={() => setFocused("diagnosis")}
            onBlur={() => setFocused(null)}
            placeholder="e.g. Lumbar disc herniation L4-L5 with nerve compression, or Type 2 diabetes with recommended insulin therapy"
            style={{ ...IS, height: 80, resize: "vertical", border: focused === "diagnosis" ? "1px solid rgba(16,185,129,0.5)" : "1px solid rgba(255,255,255,0.08)" }}
          />
        </div>

        <div style={{ marginBottom: 12 }}>
          <label style={{ fontSize: 11, fontWeight: 700, color: "#475569", display: "block", marginBottom: 6, letterSpacing: "0.06em", textTransform: "uppercase" }}>
            Recommended procedure or treatment <span style={{ fontWeight: 400, color: "#334155", textTransform: "none", letterSpacing: 0 }}>optional</span>
          </label>
          <input
            value={procedure}
            onChange={(e) => setProcedure(e.target.value)}
            onFocus={() => setFocused("procedure")}
            onBlur={() => setFocused(null)}
            placeholder="e.g. Spinal fusion surgery, knee replacement, chemotherapy"
            style={{ ...IS, border: focused === "procedure" ? "1px solid rgba(16,185,129,0.5)" : "1px solid rgba(255,255,255,0.08)" }}
          />
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 11, fontWeight: 700, color: "#475569", display: "block", marginBottom: 6, letterSpacing: "0.06em", textTransform: "uppercase" }}>
            What concerns you most? <span style={{ fontWeight: 400, color: "#334155", textTransform: "none", letterSpacing: 0 }}>optional</span>
          </label>
          <input
            value={concern}
            onChange={(e) => setConcern(e.target.value)}
            onFocus={() => setFocused("concern")}
            onBlur={() => setFocused(null)}
            placeholder="e.g. Not sure surgery is necessary, worried about side effects, want alternatives"
            style={{ ...IS, border: focused === "concern" ? "1px solid rgba(16,185,129,0.5)" : "1px solid rgba(255,255,255,0.08)" }}
          />
        </div>

        <button
          onClick={generate}
          disabled={loading || !diagnosis.trim()}
          style={{ width: "100%", padding: "14px", background: loading || !diagnosis.trim() ? "rgba(255,255,255,0.05)" : "linear-gradient(135deg, #10b981, #059669)", color: loading || !diagnosis.trim() ? "#334155" : "#fff", border: "none", borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: loading || !diagnosis.trim() ? "default" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, fontFamily: FONT, boxShadow: loading || !diagnosis.trim() ? "none" : "0 8px 28px rgba(16,185,129,0.35)" }}
        >
          {loading
            ? (<><span style={{ width: 17, height: 17, border: "2px solid rgba(255,255,255,0.15)", borderTop: "2px solid #10b981", borderRadius: "50%", animation: "spin 0.8s linear infinite", display: "inline-block" }} />Preparing your guide...</>)
            : "🩺 Get Second Opinion Guide"}
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
            <div style={{ fontSize: 10, fontWeight: 700, color: "#334155", letterSpacing: "0.12em" }}>YOUR SECOND OPINION GUIDE</div>
            <div style={{ display: "flex", gap: 8 }}>
              <button
                onClick={() => { navigator.clipboard.writeText(result); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
                style={{ fontSize: 12, color: copied ? "#10b981" : "#64748b", background: "rgba(255,255,255,0.04)", border: `1px solid ${copied ? "rgba(16,185,129,0.3)" : "rgba(255,255,255,0.08)"}`, padding: "5px 12px", borderRadius: 8, cursor: "pointer", fontFamily: FONT, transition: "all 0.2s" }}
              >
                {copied ? "✓ Copied" : "Copy"}
              </button>
              <button
                onClick={() => { setResult(null); setDiagnosis(""); setProcedure(""); setConcern(""); }}
                style={{ fontSize: 12, color: "#64748b", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", padding: "5px 12px", borderRadius: 8, cursor: "pointer", fontFamily: FONT }}
              >
                ← New Search
              </button>
            </div>
          </div>
          <div style={{ background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: 12, padding: "12px 16px", marginBottom: 14, fontSize: 13, color: "#10b981", fontWeight: 600 }}>
            🩺 You have the absolute right to a second opinion. Most insurance covers it. Take the questions list to your appointment.
          </div>
          {parseResult(result)}
        </div>
      )}
    </div>
  );
}
