import { useState } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";

const FONT = "'Inter', system-ui, sans-serif";

const EXAMPLES = ["Metformin 500mg", "Lisinopril 10mg", "Atorvastatin 20mg", "Ozempic 1mg", "Adderall 20mg"];

export default function DrugComparator() {
  const [drug, setDrug] = useState("");
  const [price, setPrice] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { consumeCredit } = useAuth();

  const analyze = async () => {
    if (!drug.trim()) return;
    if (!consumeCredit()) return;
    setLoading(true);
    setResult(null);
    setError(null);
    try {
      const response = await axios.post("/api/drug", { drug, price });
      setResult(response.data.result);
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const parseResult = (text) => {
    const sections = [
      { key: "WHAT IS THIS DRUG", emoji: "💊", color: "#60a5fa", label: "What Is This Drug" },
      { key: "FAIR PRICE RANGE", emoji: "💰", color: "#34d399", label: "Fair Price Range" },
      { key: "COST PLUS DRUGS PRICE", emoji: "🏭", color: "#a78bfa", label: "Cost Plus Drugs Price" },
      { key: "CHEAPEST OPTIONS", emoji: "🔍", color: "#34d399", label: "Cheapest Options" },
      { key: "VERDICT", emoji: "⚖️", color: "#fbbf24", label: "Verdict" },
      { key: "MONEY YOU COULD SAVE", emoji: "💵", color: "#34d399", label: "Money You Could Save" },
      { key: "WHAT TO DO", emoji: "✅", color: "#34d399", label: "What To Do" },
    ];

    return sections.map((section, i) => {
      const regex = new RegExp(`(?:#{1,3}\\s*)?${section.key}:\\n([\\s\\S]*?)(?=\\n(?:#{1,3}\\s*)?[A-Z][A-Z ]+:|$)`);
      const match = text.match(regex);
      const raw = match ? match[1].trim() : null;
      if (!raw) return null;
      const content = raw.replace(/^#{1,3}\s*/gm, "").replace(/\*\*/g, "").trim();

      const isVerdict = section.key === "VERDICT";
      const verdictColor = content.includes("SIGNIFICANTLY OVERCHARGED") ? "#f87171"
        : content.includes("POSSIBLY OVERCHARGED") ? "#fbbf24" : "#34d399";
      const verdictBg = content.includes("SIGNIFICANTLY OVERCHARGED") ? "rgba(239,68,68,0.08)"
        : content.includes("POSSIBLY OVERCHARGED") ? "rgba(251,191,36,0.08)" : "rgba(52,211,153,0.08)";

      return (
        <div key={section.key} style={{ background: isVerdict ? verdictBg : "rgba(255,255,255,0.03)", border: `1px solid ${isVerdict ? verdictColor + "40" : "rgba(255,255,255,0.08)"}`, borderLeft: `3px solid ${isVerdict ? verdictColor : section.color}`, borderRadius: 12, padding: "18px 22px", marginBottom: 10, animation: "fadeUp 0.4s ease forwards", animationDelay: `${i * 0.07}s`, animationFillMode: "both" }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: isVerdict ? verdictColor : section.color, letterSpacing: "0.12em", marginBottom: 10, textTransform: "uppercase" }}>
            {section.emoji} {section.label}
          </div>
          {isVerdict ? (
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: verdictColor + "20", border: `1px solid ${verdictColor}50`, color: verdictColor, padding: "7px 18px", borderRadius: 24, fontSize: 13, fontWeight: 800 }}>
              <span style={{ width: 7, height: 7, background: verdictColor, borderRadius: "50%" }} />
              {content}
            </div>
          ) : (
            <div style={{ fontSize: 14, color: "#cbd5e1", lineHeight: 1.8, whiteSpace: "pre-line" }}>{content}</div>
          )}
        </div>
      );
    });
  };

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: "#f1f5f9", marginBottom: 8, letterSpacing: "-0.02em" }}>
          Drug Price Comparator
        </h2>
        <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.6 }}>
          Enter any medication. We will show you the fair price, the cheapest place to get it, and how much you could save.
        </p>
      </div>

      <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 24, marginBottom: 16 }}>
        <label style={{ fontSize: 11, fontWeight: 700, color: "#475569", display: "block", marginBottom: 10, letterSpacing: "0.06em", textTransform: "uppercase" }}>
          Drug name
        </label>
        <input
          value={drug}
          onChange={(e) => setDrug(e.target.value)}
          placeholder="e.g. Metformin 500mg, Ozempic, Lisinopril 10mg"
          style={{ width: "100%", padding: "13px 14px", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, fontSize: 14, color: "#f1f5f9", fontFamily: FONT, background: "rgba(255,255,255,0.04)", outline: "none", boxSizing: "border-box" }}
        />

        <div style={{ marginTop: 10, marginBottom: 14 }}>
          <div style={{ fontSize: 10, fontWeight: 600, color: "#334155", marginBottom: 7, letterSpacing: "0.08em" }}>COMMON EXAMPLES</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {EXAMPLES.map((ex) => (
              <button key={ex} onClick={() => setDrug(ex)} style={{ padding: "5px 12px", background: drug === ex ? "rgba(16,185,129,0.12)" : "rgba(255,255,255,0.04)", color: drug === ex ? "#10b981" : "#64748b", border: `1px solid ${drug === ex ? "rgba(16,185,129,0.3)" : "rgba(255,255,255,0.08)"}`, borderRadius: 24, fontSize: 12, fontWeight: 500, cursor: "pointer", transition: "all 0.15s", fontFamily: FONT }}>
                {ex}
              </button>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 11, fontWeight: 700, color: "#475569", display: "block", marginBottom: 8, letterSpacing: "0.06em", textTransform: "uppercase" }}>
            What you were charged (optional)
          </label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="45"
            style={{ width: "100%", padding: "12px 14px", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, fontSize: 14, color: "#f1f5f9", fontFamily: FONT, background: "rgba(255,255,255,0.04)", outline: "none", boxSizing: "border-box" }}
          />
        </div>

        <button
          onClick={analyze}
          disabled={loading || !drug.trim()}
          style={{ width: "100%", padding: "15px", background: loading || !drug.trim() ? "rgba(255,255,255,0.05)" : "linear-gradient(135deg, #10b981, #059669)", color: loading || !drug.trim() ? "#334155" : "#fff", border: "none", borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: loading || !drug.trim() ? "default" : "pointer", transition: "all 0.2s", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontFamily: FONT, boxShadow: loading || !drug.trim() ? "none" : "0 8px 28px rgba(16,185,129,0.35)" }}
        >
          {loading ? (
            <>
              <span style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,0.15)", borderTop: "2px solid #10b981", borderRadius: "50%", animation: "spin 0.8s linear infinite", display: "inline-block" }} />
              Comparing prices...
            </>
          ) : "💊 Compare Drug Prices"}
        </button>
      </div>

      {error && <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: 12, padding: 16, color: "#f87171", fontSize: 14, marginBottom: 16 }}>{error}</div>}
      {result && <div>{parseResult(result)}</div>}
    </div>
  );
}
