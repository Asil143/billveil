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
      const response = await axios.post("/api/dispute", { bill, amount });
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
        <h2 style={{ fontSize: 22, fontWeight: 800, color: "#0f172a", marginBottom: 8, letterSpacing: "-0.02em" }}>
          Dispute Letter Generator
        </h2>
        <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.6 }}>
          Describe the charge you want to dispute. We will write a professional letter you can send to the hospital or insurance company today.
        </p>
      </div>

      <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 16, padding: 24, marginBottom: 16, boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
        <label style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", display: "block", marginBottom: 10, letterSpacing: "0.06em", textTransform: "uppercase" }}>
          Describe the charge you are disputing
        </label>
        <textarea
          value={bill}
          onChange={(e) => setBill(e.target.value)}
          placeholder="e.g. I was charged $4,200 for an emergency room visit for a sprained ankle. The doctor spent 10 minutes with me."
          style={{ width: "100%", height: 110, padding: 14, border: "1px solid #e2e8f0", borderRadius: 10, fontSize: 14, color: "#0f172a", resize: "vertical", fontFamily: FONT, lineHeight: 1.6, background: "#f8fafc", boxSizing: "border-box", outline: "none" }}
        />
        <div style={{ marginTop: 12 }}>
          <label style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", display: "block", marginBottom: 8, letterSpacing: "0.06em", textTransform: "uppercase" }}>
            Amount being disputed (optional)
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="385"
            style={{ width: "100%", padding: "12px 14px", border: "1px solid #e2e8f0", borderRadius: 10, fontSize: 14, color: "#0f172a", fontFamily: FONT, background: "#f8fafc", outline: "none", boxSizing: "border-box" }}
          />
        </div>
        <button
          onClick={generate}
          disabled={loading || !bill.trim()}
          style={{ width: "100%", marginTop: 16, padding: "15px", background: loading || !bill.trim() ? "#f1f5f9" : "linear-gradient(135deg, #10b981, #059669)", color: loading || !bill.trim() ? "#94a3b8" : "#fff", border: "none", borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: loading || !bill.trim() ? "default" : "pointer", transition: "all 0.2s", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontFamily: FONT, boxShadow: loading || !bill.trim() ? "none" : "0 4px 16px rgba(16,185,129,0.3)" }}
        >
          {loading ? (
            <>
              <span style={{ width: 16, height: 16, border: "2px solid #e2e8f0", borderTop: "2px solid #10b981", borderRadius: "50%", animation: "spin 0.8s linear infinite", display: "inline-block" }} />
              Writing your letter...
            </>
          ) : "✉️ Generate Dispute Letter"}
        </button>
      </div>

      {error && (
        <div style={{ background: "#fff5f5", border: "1px solid #fecaca", borderRadius: 12, padding: 16, color: "#ef4444", fontSize: 14, marginBottom: 16 }}>
          {error}
        </div>
      )}

      {result && (
        <div style={{ background: "#ffffff", border: "1px solid #bbf7d0", borderRadius: 16, padding: 24, boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#10b981", letterSpacing: "0.1em" }}>YOUR DISPUTE LETTER</div>
            <button
              onClick={copy}
              style={{ padding: "6px 16px", background: copied ? "#f0fdf4" : "#f8fafc", border: `1px solid ${copied ? "#10b981" : "#e2e8f0"}`, color: copied ? "#059669" : "#64748b", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: FONT, transition: "all 0.2s" }}
            >
              {copied ? "✓ Copied!" : "Copy Letter"}
            </button>
          </div>
          <div style={{ fontSize: 14, color: "#374151", lineHeight: 1.9, whiteSpace: "pre-line", fontFamily: "monospace", background: "#f8fafc", padding: 16, borderRadius: 10, border: "1px solid #e2e8f0" }}>
            {result}
          </div>
        </div>
      )}
    </div>
  );
}
