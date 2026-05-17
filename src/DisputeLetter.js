'use client';
import { useState } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";

const FONT = "'Inter', system-ui, sans-serif";

export default function DisputeLetter() {
  const [bill, setBill] = useState("");
  const [amount, setAmount] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  const { consumeCredit } = useAuth();

  const generate = async () => {
    if (!bill.trim()) return;
    if (!consumeCredit()) return;
    setLoading(true);
    setResult(null);
    setError(null);
    try {
      const response = await axios.post("/api/tools", { tool: "dispute", bill, amount });
      setResult(response.data.result);
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const copy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: "#f1f5f9", marginBottom: 8, letterSpacing: "-0.02em" }}>
          Dispute Letter Generator
        </h2>
        <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.6 }}>
          Describe the charge you want to dispute. We will write a professional letter you can send to the hospital or insurance company today.
        </p>
      </div>

      <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 24, marginBottom: 16 }}>
        <label style={{ fontSize: 11, fontWeight: 700, color: "#475569", display: "block", marginBottom: 10, letterSpacing: "0.06em", textTransform: "uppercase" }}>
          Describe the charge you are disputing
        </label>
        <textarea
          value={bill}
          onChange={(e) => setBill(e.target.value)}
          placeholder="e.g. I was charged $4,200 for an emergency room visit for a sprained ankle. The doctor spent 10 minutes with me."
          style={{ width: "100%", height: 110, padding: 14, border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, fontSize: 14, color: "#f1f5f9", resize: "vertical", fontFamily: FONT, lineHeight: 1.6, background: "rgba(255,255,255,0.04)", boxSizing: "border-box", outline: "none" }}
        />
        <div style={{ marginTop: 12 }}>
          <label style={{ fontSize: 11, fontWeight: 700, color: "#475569", display: "block", marginBottom: 8, letterSpacing: "0.06em", textTransform: "uppercase" }}>
            Amount being disputed (optional)
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="385"
            style={{ width: "100%", padding: "12px 14px", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, fontSize: 14, color: "#f1f5f9", fontFamily: FONT, background: "rgba(255,255,255,0.04)", outline: "none", boxSizing: "border-box" }}
          />
        </div>
        <button
          onClick={generate}
          disabled={loading || !bill.trim()}
          style={{ width: "100%", marginTop: 16, padding: "15px", background: loading || !bill.trim() ? "rgba(255,255,255,0.05)" : "linear-gradient(135deg, #10b981, #059669)", color: loading || !bill.trim() ? "#334155" : "#fff", border: "none", borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: loading || !bill.trim() ? "default" : "pointer", transition: "all 0.2s", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontFamily: FONT, boxShadow: loading || !bill.trim() ? "none" : "0 8px 28px rgba(16,185,129,0.35)" }}
        >
          {loading ? (
            <>
              <span style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,0.15)", borderTop: "2px solid #10b981", borderRadius: "50%", animation: "spin 0.8s linear infinite", display: "inline-block" }} />
              Writing your letter...
            </>
          ) : "✉️ Generate Dispute Letter"}
        </button>
      </div>

      {error && (
        <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: 12, padding: 16, color: "#f87171", fontSize: 14, marginBottom: 16 }}>
          {error}
        </div>
      )}

      {result && (
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: 16, padding: 24 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#10b981", letterSpacing: "0.1em" }}>YOUR DISPUTE LETTER</div>
            <button
              onClick={copy}
              style={{ padding: "6px 16px", background: copied ? "rgba(16,185,129,0.15)" : "rgba(255,255,255,0.06)", border: `1px solid ${copied ? "rgba(16,185,129,0.4)" : "rgba(255,255,255,0.1)"}`, color: copied ? "#10b981" : "#94a3b8", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: FONT, transition: "all 0.2s" }}
            >
              {copied ? "✓ Copied!" : "Copy Letter"}
            </button>
          </div>
          <div style={{ fontSize: 14, color: "#cbd5e1", lineHeight: 1.9, whiteSpace: "pre-line", fontFamily: "monospace" }}>
            {result}
          </div>
        </div>
      )}
    </div>
  );
}
