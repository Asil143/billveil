import { useState } from "react";
import axios from "axios";

export default function App() {
  const [bill, setBill] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [tip, setTip] = useState(false);
  const [focused, setFocused] = useState(false);

  const analyzeBill = async () => {
    if (!bill.trim()) return;
    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const response = await axios.post("https://billveil-production.up.railway.app/analyze", { bill });
      setResult(response.data.result);
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const parseResult = (text) => {
    const sections = [
      { key: "WHAT IS THIS", emoji: "🔍", color: "#3b82f6", label: "What Is This" },
      { key: "FAIR PRICE", emoji: "💰", color: "#10b981", label: "Fair Price" },
      { key: "VERDICT", emoji: "⚖️", color: "#f59e0b", label: "Verdict" },
      { key: "WHY", emoji: "📋", color: "#6366f1", label: "Why" },
      { key: "WHAT TO DO", emoji: "✅", color: "#10b981", label: "What To Do" },
      { key: "MONEY YOU COULD SAVE", emoji: "💵", color: "#10b981", label: "Money You Could Save" },
    ];

    return sections.map((section) => {
      const regex = new RegExp(`${section.key}:\\n([\\s\\S]*?)(?=\\n[A-Z ]+:|$)`);
      const match = text.match(regex);
      const content = match ? match[1].trim() : null;

      if (!content) return null;

      const isVerdict = section.key === "VERDICT";
      const verdictColor = content.includes("SIGNIFICANTLY OVERCHARGED")
        ? "#ef4444"
        : content.includes("POSSIBLY OVERCHARGED")
        ? "#f59e0b"
        : "#10b981";
      const verdictBg = content.includes("SIGNIFICANTLY OVERCHARGED")
        ? "#fef2f2"
        : content.includes("POSSIBLY OVERCHARGED")
        ? "#fffbeb"
        : "#f0fdf4";

      return (
        <div
          key={section.key}
          style={{
            background: isVerdict ? verdictBg : "#fff",
            border: `1px solid ${isVerdict ? verdictColor + "40" : "#e5e7eb"}`,
            borderLeft: `4px solid ${isVerdict ? verdictColor : section.color}`,
            borderRadius: 10,
            padding: "18px 22px",
            marginBottom: 12,
            boxShadow: isVerdict
              ? `0 0 0 1px ${verdictColor}20`
              : "0 1px 3px rgba(0,0,0,0.04)",
          }}
        >
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: isVerdict ? verdictColor : section.color,
              letterSpacing: "0.1em",
              marginBottom: 10,
              textTransform: "uppercase",
            }}
          >
            {section.emoji} {section.label}
          </div>
          {isVerdict ? (
            <div
              style={{
                display: "inline-block",
                background: verdictColor,
                color: "#fff",
                padding: "6px 18px",
                borderRadius: 20,
                fontSize: 13,
                fontWeight: 800,
                letterSpacing: "0.05em",
              }}
            >
              {content}
            </div>
          ) : (
            <div
              style={{
                fontSize: 15,
                color: "#1f2937",
                lineHeight: 1.75,
                whiteSpace: "pre-line",
              }}
            >
              {content}
            </div>
          )}
        </div>
      );
    });
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f8fafc",
        fontFamily: "'Segoe UI', system-ui, sans-serif",
      }}
    >
      {/* Header */}
      <div
        style={{
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
          padding: "18px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 38,
              height: 38,
              background: "linear-gradient(135deg, #10b981, #059669)",
              borderRadius: 9,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 20,
            }}
          >
            🛡️
          </div>
          <div>
            <div
              style={{
                fontSize: 21,
                fontWeight: 800,
                color: "#fff",
                letterSpacing: "-0.02em",
              }}
            >
              BillVeil
            </div>
            <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 1 }}>
              See through every medical bill
            </div>
          </div>
        </div>
        <div
          style={{
            background: "rgba(16,185,129,0.15)",
            border: "1px solid rgba(16,185,129,0.3)",
            color: "#10b981",
            padding: "5px 14px",
            borderRadius: 20,
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.05em",
          }}
        >
          100% FREE
        </div>
      </div>

      {/* Stats bar */}
      <div
        style={{
          background: "#0f172a",
          borderBottom: "1px solid #1e293b",
          padding: "10px 24px",
        }}
      >
        <div
          style={{
            maxWidth: 680,
            margin: "0 auto",
            display: "flex",
            justifyContent: "center",
            gap: 40,
            flexWrap: "wrap",
          }}
        >
          {[
            { stat: "$935B", label: "overpaid yearly" },
            { stat: "80%", label: "bills have errors" },
            { stat: "10x", label: "hospital markups" },
          ].map(({ stat, label }) => (
            <div key={stat} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 15, fontWeight: 800, color: "#10b981" }}>
                {stat}
              </div>
              <div style={{ fontSize: 10, color: "#64748b", marginTop: 1 }}>
                {label}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 680, margin: "0 auto", padding: "36px 16px" }}>
        {/* Hero */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div
            style={{
              display: "inline-block",
              background: "#dcfce7",
              color: "#15803d",
              padding: "4px 14px",
              borderRadius: 20,
              fontSize: 11,
              fontWeight: 700,
              marginBottom: 14,
              letterSpacing: "0.06em",
            }}
          >
            AI-POWERED BILL ANALYSIS
          </div>
          <h1
            style={{
              fontSize: 32,
              fontWeight: 900,
              color: "#0f172a",
              marginBottom: 12,
              lineHeight: 1.2,
              letterSpacing: "-0.02em",
            }}
          >
            Is your medical bill fair?
          </h1>
          <p
            style={{
              fontSize: 16,
              color: "#64748b",
              lineHeight: 1.7,
              maxWidth: 520,
              margin: "0 auto",
            }}
          >
            Paste any charge, CPT code, or bill below. Our AI explains what it
            means, whether you are being overcharged, and exactly what to do.
          </p>
        </div>

        {/* Input card */}
        <div
          style={{
            background: "#fff",
            border: focused ? "1.5px solid #10b981" : "1.5px solid #e2e8f0",
            borderRadius: 14,
            padding: 24,
            marginBottom: 16,
            boxShadow: focused
              ? "0 0 0 4px rgba(16,185,129,0.08)"
              : "0 2px 8px rgba(0,0,0,0.06)",
            transition: "all 0.2s",
          }}
        >
          <label
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: "#374151",
              display: "block",
              marginBottom: 10,
            }}
          >
            Paste your bill, charge, or CPT code
          </label>
          <textarea
            value={bill}
            onChange={(e) => setBill(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder={`Examples:\n• CPT 99214 — $385\n• Emergency room visit — $4,200\n• Blood test 80053 — $189\n• Charged $250 for 2 Tylenol tablets`}
            style={{
              width: "100%",
              height: 130,
              padding: 14,
              border: "1px solid #e2e8f0",
              borderRadius: 8,
              fontSize: 14,
              color: "#1f2937",
              resize: "vertical",
              fontFamily: "inherit",
              lineHeight: 1.6,
              outline: "none",
              background: "#f8fafc",
              boxSizing: "border-box",
            }}
          />
          <button
            onClick={analyzeBill}
            disabled={loading || !bill.trim()}
            style={{
              width: "100%",
              marginTop: 12,
              padding: "15px",
              background:
                loading || !bill.trim()
                  ? "#cbd5e1"
                  : "linear-gradient(135deg, #0f172a, #1e293b)",
              color: loading || !bill.trim() ? "#94a3b8" : "#fff",
              border: "none",
              borderRadius: 10,
              fontSize: 15,
              fontWeight: 700,
              cursor: loading || !bill.trim() ? "default" : "pointer",
              transition: "all 0.2s",
              letterSpacing: "0.01em",
            }}
          >
            {loading ? "⏳ Analyzing your bill..." : "⚡ Analyze My Bill — Free"}
          </button>
        </div>

        {/* Error */}
        {error && (
          <div
            style={{
              background: "#fef2f2",
              border: "1px solid #fca5a5",
              borderRadius: 10,
              padding: 16,
              color: "#dc2626",
              fontSize: 14,
              marginBottom: 16,
            }}
          >
            {error}
          </div>
        )}

        {/* Results */}
        {result && (
          <div>
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: "#94a3b8",
                letterSpacing: "0.12em",
                marginBottom: 16,
                textTransform: "uppercase",
              }}
            >
              Analysis Results
            </div>
            {parseResult(result)}

            {/* Analyze another */}
            <button
              onClick={() => {
                setResult(null);
                setBill("");
                setTip(false);
              }}
              style={{
                width: "100%",
                marginTop: 4,
                marginBottom: 20,
                padding: "12px",
                background: "transparent",
                color: "#64748b",
                border: "1.5px solid #e2e8f0",
                borderRadius: 10,
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Analyze Another Bill
            </button>

            {/* Tip Jar */}
            {!tip ? (
              <div
                style={{
                  background: "linear-gradient(135deg, #fffbeb, #fef3c7)",
                  border: "1px solid #fde68a",
                  borderRadius: 14,
                  padding: 28,
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: 28, marginBottom: 10 }}>☕</div>
                <div
                  style={{
                    fontSize: 18,
                    fontWeight: 800,
                    color: "#92400e",
                    marginBottom: 6,
                  }}
                >
                  Did BillVeil help you?
                </div>
                <div
                  style={{
                    fontSize: 14,
                    color: "#78350f",
                    marginBottom: 20,
                    lineHeight: 1.6,
                  }}
                >
                  BillVeil is free forever. If we saved you money, consider a
                  small tip to keep us running.
                </div>
                <button
                  onClick={() => setTip(true)}
                  style={{
                    padding: "12px 32px",
                    background: "linear-gradient(135deg, #f59e0b, #d97706)",
                    color: "#fff",
                    border: "none",
                    borderRadius: 10,
                    fontSize: 15,
                    fontWeight: 700,
                    cursor: "pointer",
                    boxShadow: "0 4px 12px rgba(245,158,11,0.3)",
                  }}
                >
                  Leave a Tip ❤️
                </button>
              </div>
            ) : (
              <div
                style={{
                  background: "linear-gradient(135deg, #f0fdf4, #dcfce7)",
                  border: "1px solid #86efac",
                  borderRadius: 14,
                  padding: 28,
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: 36, marginBottom: 10 }}>🙏</div>
                <div
                  style={{
                    fontSize: 18,
                    fontWeight: 800,
                    color: "#15803d",
                    marginBottom: 6,
                  }}
                >
                  Thank you so much!
                </div>
                <div style={{ fontSize: 14, color: "#166534", lineHeight: 1.6 }}>
                  Your support keeps BillVeil free for every American who needs
                  it. You are part of the solution.
                </div>
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div
          style={{
            textAlign: "center",
            marginTop: 48,
            fontSize: 12,
            color: "#94a3b8",
            lineHeight: 2,
          }}
        >
          <div style={{ marginBottom: 4 }}>
            🔒 BillVeil does not store your medical information.
          </div>
          <div>Built for the 330 million Americans who deserve better.</div>
        </div>
      </div>
    </div>
  );
}
