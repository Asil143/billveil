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
  { key: "OPENING", emoji: "👋", color: "#60a5fa", label: "Opening" },
  { key: "KEY POINTS TO MAKE", emoji: "💪", color: "#34d399", label: "Key Points to Make" },
  { key: "WHAT TO ASK FOR", emoji: "🎯", color: "#fbbf24", label: "What to Ask For" },
  { key: "IF THEY SAY NO", emoji: "🛡️", color: "#f87171", label: "If They Say No" },
  { key: "ESCALATION", emoji: "📈", color: "#a78bfa", label: "Escalation" },
  { key: "FOLLOW-UP", emoji: "📋", color: "#34d399", label: "Follow-Up" },
  { key: "PRO TIPS", emoji: "💡", color: "#f59e0b", label: "Pro Tips" },
];

function parseScript(text) {
  return SECTIONS.map((section, i) => {
    const regex = new RegExp(`${section.key}:\\n([\\s\\S]*?)(?=\\n[A-Z][A-Z ]+:|$)`);
    const match = clean.match(regex);
    const content = match ? match[1].trim() : null;
    if (!content) return null;
    return (
      <div key={section.key} style={{ background: "rgba(255,255,255,0.03)", border: `1px solid rgba(255,255,255,0.08)`, borderLeft: `3px solid ${section.color}`, borderRadius: 12, padding: "18px 20px", marginBottom: 10, animation: "fadeUp 0.35s ease forwards", animationDelay: `${i * 0.07}s`, animationFillMode: "both" }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: section.color, letterSpacing: "0.12em", marginBottom: 10, textTransform: "uppercase" }}>
          {section.emoji} {section.label}
        </div>
        <div style={{ fontSize: 14, color: "#cbd5e1", lineHeight: 1.8, whiteSpace: "pre-line" }}>{content}</div>
      </div>
    );
  });
}

export default function NegotiationScript() {
  const { consumeCredit, profileData } = useAuth();
  const [bill, setBill] = useState("");
  const [amount, setAmount] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [focused, setFocused] = useState(null);

  const name = profileData?.firstName
    ? `${profileData.firstName} ${profileData.lastName || ""}`.trim()
    : "";

  const generate = async () => {
    if (!bill.trim()) return;
    if (!consumeCredit()) return;
    setLoading(true);
    setResult(null);
    setError(null);
    try {
      const res = await axios.post("/api/tools", { tool: "negotiate", bill, amount, name });
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
          Know exactly <span style={{ color: "#10b981", textShadow: "0 0 20px rgba(16,185,129,0.4)" }}>what to say.</span>
        </h1>
        <p style={{ fontSize: "clamp(14px, 3vw, 15px)", color: "#64748b", lineHeight: 1.6, maxWidth: 440, margin: "0 auto" }}>
          AI writes your word-for-word negotiation script. Call the billing department and get a lower bill.
        </p>
      </div>

      <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 20, marginBottom: 20 }}>
        <div style={{ marginBottom: 12 }}>
          <label style={{ fontSize: 11, fontWeight: 700, color: "#475569", display: "block", marginBottom: 6, letterSpacing: "0.06em", textTransform: "uppercase" }}>
            Describe your bill or charge
          </label>
          <textarea
            value={bill}
            onChange={(e) => setBill(e.target.value)}
            onFocus={() => setFocused("bill")}
            onBlur={() => setFocused(null)}
            placeholder="e.g. ER visit charge $4,200, CPT 99285 — or paste the line item from your bill"
            style={{ ...IS, height: 90, resize: "vertical", border: focused === "bill" ? "1px solid rgba(16,185,129,0.5)" : "1px solid rgba(255,255,255,0.08)" }}
          />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 11, fontWeight: 700, color: "#475569", display: "block", marginBottom: 6, letterSpacing: "0.06em", textTransform: "uppercase" }}>
            Amount billed <span style={{ fontWeight: 400, color: "#334155", textTransform: "none", letterSpacing: 0 }}>optional</span>
          </label>
          <input
            value={amount}
            onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ""))}
            onFocus={() => setFocused("amount")}
            onBlur={() => setFocused(null)}
            placeholder="e.g. 4200"
            style={{ ...IS, border: focused === "amount" ? "1px solid rgba(16,185,129,0.5)" : "1px solid rgba(255,255,255,0.08)" }}
          />
        </div>
        <button onClick={generate} disabled={loading || !bill.trim()} style={{ width: "100%", padding: "14px", background: loading || !bill.trim() ? "rgba(255,255,255,0.05)" : "linear-gradient(135deg, #10b981, #059669)", color: loading || !bill.trim() ? "#334155" : "#fff", border: "none", borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: loading || !bill.trim() ? "default" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, fontFamily: FONT, boxShadow: loading || !bill.trim() ? "none" : "0 8px 28px rgba(16,185,129,0.35)" }}>
          {loading ? (<><span style={{ width: 17, height: 17, border: "2px solid rgba(255,255,255,0.15)", borderTop: "2px solid #10b981", borderRadius: "50%", animation: "spin 0.8s linear infinite", display: "inline-block" }} />Writing your script...</>) : "📞 Generate My Negotiation Script"}
        </button>
      </div>

      {error && <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: 12, padding: 16, color: "#f87171", fontSize: 14, marginBottom: 16 }}>{error}</div>}

      {result && (
        <div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: "#334155", letterSpacing: "0.12em" }}>YOUR NEGOTIATION SCRIPT</div>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => { navigator.clipboard.writeText(result); setCopied(true); setTimeout(() => setCopied(false), 2000); }} style={{ fontSize: 12, color: copied ? "#10b981" : "#64748b", background: "rgba(255,255,255,0.04)", border: `1px solid ${copied ? "rgba(16,185,129,0.3)" : "rgba(255,255,255,0.08)"}`, padding: "5px 12px", borderRadius: 8, cursor: "pointer", fontFamily: FONT, transition: "all 0.2s" }}>
                {copied ? "✓ Copied" : "Copy"}
              </button>
              <button onClick={() => { setResult(null); setBill(""); setAmount(""); }} style={{ fontSize: 12, color: "#64748b", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", padding: "5px 12px", borderRadius: 8, cursor: "pointer", fontFamily: FONT }}>← New Script</button>
            </div>
          </div>
          <div style={{ background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: 12, padding: "12px 16px", marginBottom: 14, fontSize: 13, color: "#10b981", fontWeight: 600 }}>
            📞 Call the hospital billing department. Ask for a supervisor if the first rep can't help. Have this script open as you talk.
          </div>
          {parseScript(result)}
        </div>
      )}
    </div>
  );
}
