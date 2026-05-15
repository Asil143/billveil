import { useState } from "react";
import axios from "axios";

const FONT = "'Inter', system-ui, sans-serif";

const EXAMPLES = [
  "Not medically necessary",
  "Out of network provider",
  "Prior authorization required",
  "Experimental treatment",
  "Duplicate claim",
];

export default function DenialFighter() {
  const [denial, setDenial] = useState("");
  const [amount, setAmount] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  const analyze = async () => {
    if (!denial.trim()) return;
    setLoading(true);
    setResult(null);
    setError(null);
    try {
      const response = await axios.post("/api/denial", { denial, amount });
      setResult(response.data.result);
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const copyAppeal = () => {
    if (!result) return;
    const match = result.match(/APPEAL LETTER:\n([\s\S]*?)(?=\n[A-Z ]+:|$)/);
    const letter = match ? match[1].trim() : result;
    navigator.clipboard.writeText(letter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const parseResult = (text) => {
    const sections = [
      { key: "WHY THEY DENIED IT", emoji: "🚫", color: "#f87171", label: "Why They Denied It" },
      { key: "IS THIS DENIAL VALID", emoji: "⚖️", color: "#fbbf24", label: "Is This Denial Valid" },
      { key: "YOUR RIGHTS", emoji: "📜", color: "#a78bfa", label: "Your Rights" },
      { key: "APPEAL LETTER", emoji: "✉️", color: "#10b981", label: "Appeal Letter" },
      { key: "WHAT TO DO NEXT", emoji: "✅", color: "#34d399", label: "What To Do Next" },
      { key: "CHANCE OF SUCCESS", emoji: "📊", color: "#60a5fa", label: "Chance of Success" },
    ];

    return sections.map((section, i) => {
      const regex = new RegExp(`${section.key}:\\n([\\s\\S]*?)(?=\\n[A-Z ]+:|$)`);
      const match = text.match(regex);
      const content = match ? match[1].trim() : null;
      if (!content) return null;

      const isVerdict = section.key === "IS THIS DENIAL VALID";
      const isLetter = section.key === "APPEAL LETTER";
      const verdictColor = content.includes("LIKELY INVALID") ? "#34d399"
        : content.includes("POSSIBLY INVALID") ? "#fbbf24" : "#f87171";

      return (
        <div key={section.key} style={{ background: "rgba(255,255,255,0.03)", border: `1px solid rgba(255,255,255,0.08)`, borderLeft: `3px solid ${isVerdict ? verdictColor : section.color}`, borderRadius: 12, padding: "18px 22px", marginBottom: 10, animation: "fadeUp 0.4s ease forwards", animationDelay: `${i * 0.07}s`, animationFillMode: "both" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: isVerdict ? verdictColor : section.color, letterSpacing: "0.12em", textTransform: "uppercase" }}>
              {section.emoji} {section.label}
            </div>
            {isLetter && (
              <button onClick={copyAppeal} style={{ padding: "5px 12px", background: copied ? "rgba(16,185,129,0.15)" : "rgba(255,255,255,0.06)", border: `1px solid ${copied ? "rgba(16,185,129,0.4)" : "rgba(255,255,255,0.1)"}`, color: copied ? "#10b981" : "#94a3b8", borderRadius: 8, fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: FONT, transition: "all 0.2s" }}>
                {copied ? "✓ Copied!" : "Copy Letter"}
              </button>
            )}
          </div>
          {isVerdict ? (
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: verdictColor + "20", border: `1px solid ${verdictColor}50`, color: verdictColor, padding: "7px 18px", borderRadius: 24, fontSize: 13, fontWeight: 800 }}>
              <span style={{ width: 7, height: 7, background: verdictColor, borderRadius: "50%" }} />
              {content}
            </div>
          ) : (
            <div style={{ fontSize: 14, color: "#cbd5e1", lineHeight: 1.85, whiteSpace: "pre-line", fontFamily: isLetter ? "monospace" : FONT }}>
              {content}
            </div>
          )}
        </div>
      );
    });
  };

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: "#f1f5f9", marginBottom: 8, letterSpacing: "-0.02em" }}>
          Insurance Denial Fighter
        </h2>
        <p style={{ fontSize: 14, color: "#475569", lineHeight: 1.6 }}>
          Paste the reason your claim was denied. We will tell you if the denial is valid, your legal rights, and write a complete appeal letter.
        </p>
      </div>

      <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 24, marginBottom: 16 }}>
        <label style={{ fontSize: 11, fontWeight: 700, color: "#64748b", display: "block", marginBottom: 10, letterSpacing: "0.06em", textTransform: "uppercase" }}>
          Denial reason from your insurance
        </label>
        <textarea
          value={denial}
          onChange={(e) => setDenial(e.target.value)}
          placeholder="e.g. Claim denied — service not medically necessary. Or paste the exact text from your denial letter."
          style={{ width: "100%", height: 110, padding: 14, border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, fontSize: 14, color: "#f1f5f9", resize: "vertical", fontFamily: FONT, lineHeight: 1.6, background: "rgba(255,255,255,0.04)", boxSizing: "border-box", outline: "none" }}
        />

        <div style={{ marginTop: 10, marginBottom: 14 }}>
          <div style={{ fontSize: 10, fontWeight: 600, color: "#334155", marginBottom: 7, letterSpacing: "0.08em" }}>COMMON DENIALS</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {EXAMPLES.map((ex) => (
              <button key={ex} onClick={() => setDenial(ex)} style={{ padding: "5px 12px", background: denial === ex ? "rgba(16,185,129,0.15)" : "rgba(255,255,255,0.04)", color: denial === ex ? "#10b981" : "#64748b", border: `1px solid ${denial === ex ? "rgba(16,185,129,0.4)" : "rgba(255,255,255,0.08)"}`, borderRadius: 24, fontSize: 12, fontWeight: 500, cursor: "pointer", transition: "all 0.15s", fontFamily: FONT }}>
                {ex}
              </button>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 11, fontWeight: 700, color: "#64748b", display: "block", marginBottom: 8, letterSpacing: "0.06em", textTransform: "uppercase" }}>
            Claim amount (optional)
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="1200"
            style={{ width: "100%", padding: "12px 14px", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, fontSize: 14, color: "#f1f5f9", fontFamily: FONT, background: "rgba(255,255,255,0.04)", outline: "none", boxSizing: "border-box" }}
          />
        </div>

        <button
          onClick={analyze}
          disabled={loading || !denial.trim()}
          style={{ width: "100%", padding: "15px", background: loading || !denial.trim() ? "rgba(255,255,255,0.05)" : "linear-gradient(135deg, #10b981, #059669)", color: loading || !denial.trim() ? "#334155" : "#fff", border: loading || !denial.trim() ? "1px solid rgba(255,255,255,0.06)" : "none", borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: loading || !denial.trim() ? "default" : "pointer", transition: "all 0.2s", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontFamily: FONT, boxShadow: loading || !denial.trim() ? "none" : "0 8px 25px rgba(16,185,129,0.3)" }}
        >
          {loading ? (
            <>
              <span style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,0.2)", borderTop: "2px solid #10b981", borderRadius: "50%", animation: "spin 0.8s linear infinite", display: "inline-block" }} />
              Fighting your denial...
            </>
          ) : "⚔️ Fight This Denial"}
        </button>
      </div>

      {error && <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: 12, padding: 16, color: "#f87171", fontSize: 14, marginBottom: 16 }}>{error}</div>}
      {result && <div>{parseResult(result)}</div>}
    </div>
  );
}
