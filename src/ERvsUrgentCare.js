import { useState } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";

const FONT = "'Inter', system-ui, sans-serif";

const ER_EMERGENCIES = [
  "Chest pain or pressure",
  "Difficulty breathing or shortness of breath",
  "Signs of stroke: face drooping, arm weakness, speech difficulty (act FAST)",
  "Severe allergic reaction (swollen throat, hives with breathing difficulty)",
  "Uncontrolled or severe bleeding",
  "Head injury with loss of consciousness",
  "Seizures (especially first-time or prolonged)",
  "Sudden severe headache ('worst headache of your life')",
  "Suspected broken bone with visible deformity",
  "Poisoning or overdose",
  "Severe abdominal pain",
  "High fever (>103°F / 39.4°C) with stiff neck or rash",
  "Coughing or vomiting blood",
  "Major trauma or injury",
];

const COST_DATA = [
  { setting: "Emergency Room", range: "$1,200 – $3,000+", withIns: "$250 – $500 copay", icon: "🚨", color: "#f87171", bg: "rgba(248,113,113,0.06)", border: "rgba(248,113,113,0.2)", note: "+ deductible if not met" },
  { setting: "Urgent Care Center", range: "$150 – $350", withIns: "$30 – $80 copay", icon: "⚡", color: "#fbbf24", bg: "rgba(251,191,36,0.06)", border: "rgba(251,191,36,0.2)", note: "Network varies — verify first" },
  { setting: "Primary Care / Family Doctor", range: "$150 – $300", withIns: "$20 – $50 copay", icon: "🩺", color: "#60a5fa", bg: "rgba(96,165,250,0.06)", border: "rgba(96,165,250,0.2)", note: "Same-day appts often available" },
  { setting: "Telehealth Visit", range: "$40 – $99", withIns: "$0 – $30", icon: "📱", color: "#10b981", bg: "rgba(16,185,129,0.06)", border: "rgba(16,185,129,0.2)", note: "Many insurers cover $0 copay" },
];

const SECTIONS = [
  { key: "RECOMMENDATION", emoji: "🏥", color: "#10b981" },
  { key: "SAFETY NOTE", emoji: "⚠️", color: "#fbbf24" },
  { key: "COST COMPARISON", emoji: "💰", color: "#34d399" },
  { key: "RIGHTS & TIPS", emoji: "⚖️", color: "#60a5fa" },
];

export default function ERvsUrgentCare() {
  const { consumeCredit, showLoginModal } = useAuth();
  const [symptoms, setSymptoms] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showEmergency, setShowEmergency] = useState(false);
  const [copied, setCopied] = useState(false);

  const assess = async () => {
    if (!symptoms.trim()) return;
    if (!consumeCredit()) { showLoginModal(); return; }
    setLoading(true);
    setResult(null);
    setError(null);
    try {
      const r = await axios.post("/api/tools", { tool: "erurgent", symptoms });
      setResult(r.data.result);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const parseResult = (text) => {
    return SECTIONS.map((s, i) => {
      const regex = new RegExp(`${s.key}:\\n([\\s\\S]*?)(?=\\n[A-Z][A-Z &]+:|$)`);
      const match = text.match(regex);
      const raw = match ? match[1].trim() : null;
      if (!raw) return null;
      const content = raw.replace(/\*\*/g, "").replace(/^#{1,3}\s*/gm, "").trim();
      if (!content) return null;
      const isRec = s.key === "RECOMMENDATION";
      const isER = content.toUpperCase().includes("EMERGENCY");
      const recColor = isER ? "#f87171" : "#10b981";
      return (
        <div key={s.key} style={{ background: isRec && isER ? "rgba(248,113,113,0.06)" : "rgba(255,255,255,0.03)", border: `1px solid ${isRec && isER ? "rgba(248,113,113,0.2)" : "rgba(255,255,255,0.08)"}`, borderLeft: `3px solid ${isRec ? recColor : s.color}`, borderRadius: 12, padding: "16px 20px", marginBottom: 10, animation: "fadeUp 0.35s ease forwards", animationDelay: `${i * 0.07}s`, animationFillMode: "both" }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: isRec ? recColor : s.color, letterSpacing: "0.12em", marginBottom: 8, textTransform: "uppercase" }}>{s.emoji} {s.key}</div>
          <div style={{ fontSize: 14, color: "#cbd5e1", lineHeight: 1.75, whiteSpace: "pre-line" }}>{content}</div>
        </div>
      );
    });
  };

  return (
    <div>
      <div style={{ textAlign: "center", marginBottom: 28 }}>
        <div style={{ fontSize: 36, marginBottom: 10 }}>🏥</div>
        <h1 style={{ fontSize: "clamp(20px, 5vw, 28px)", fontWeight: 900, color: "#f1f5f9", marginBottom: 8, letterSpacing: "-0.02em" }}>ER vs. Urgent Care Guide</h1>
        <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.6, maxWidth: 460, margin: "0 auto" }}>
          The wrong choice can cost you thousands. Describe your symptoms and we'll tell you where to go — and what it will cost at each option.
        </p>
      </div>

      {/* Always go to ER banner */}
      <div style={{ background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.25)", borderRadius: 14, padding: "16px 20px", marginBottom: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: showEmergency ? 14 : 0 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#f87171" }}>🚨 Always go to the ER for these symptoms</div>
          <button onClick={() => setShowEmergency(v => !v)} style={{ background: "none", border: "none", color: "#64748b", fontSize: 13, cursor: "pointer", fontFamily: FONT }}>{showEmergency ? "Hide ▲" : "Show ▼"}</button>
        </div>
        {showEmergency && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
            {ER_EMERGENCIES.map(e => (
              <div key={e} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                <span style={{ color: "#f87171", flexShrink: 0, marginTop: 1 }}>•</span>
                <span style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.5 }}>{e}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Cost comparison (always visible) */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: "#334155", letterSpacing: "0.12em", marginBottom: 12, textTransform: "uppercase" }}>Cost Comparison — No Insurance vs. With Insurance</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 10 }}>
          {COST_DATA.map(c => (
            <div key={c.setting} style={{ background: c.bg, border: `1px solid ${c.border}`, borderRadius: 12, padding: "14px 16px" }}>
              <div style={{ fontSize: 18, marginBottom: 8 }}>{c.icon}</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: c.color, marginBottom: 6 }}>{c.setting}</div>
              <div style={{ fontSize: 12, color: "#94a3b8", marginBottom: 4 }}>Without insurance: <strong style={{ color: "#f1f5f9" }}>{c.range}</strong></div>
              <div style={{ fontSize: 12, color: "#94a3b8", marginBottom: 6 }}>With insurance: <strong style={{ color: "#10b981" }}>{c.withIns}</strong></div>
              <div style={{ fontSize: 11, color: "#475569" }}>{c.note}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Symptom assessment */}
      <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 20, marginBottom: 20 }}>
        <label style={{ fontSize: 11, fontWeight: 700, color: "#475569", display: "block", marginBottom: 10, letterSpacing: "0.06em", textTransform: "uppercase" }}>Describe Your Symptoms</label>
        <textarea
          value={symptoms}
          onChange={e => setSymptoms(e.target.value)}
          placeholder="e.g. 'I have a 101°F fever and sore throat since yesterday' or 'sprained my ankle, can still put weight on it'"
          style={{ width: "100%", height: 90, padding: "12px 14px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, fontSize: 14, color: "#f1f5f9", resize: "vertical", fontFamily: FONT, lineHeight: 1.6, boxSizing: "border-box", marginBottom: 14 }}
        />
        <button onClick={assess} disabled={loading || !symptoms.trim()} style={{ width: "100%", padding: "13px", background: loading || !symptoms.trim() ? "rgba(255,255,255,0.05)" : "linear-gradient(135deg, #10b981, #059669)", color: loading || !symptoms.trim() ? "#334155" : "#fff", border: "none", borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: loading || !symptoms.trim() ? "default" : "pointer", fontFamily: FONT, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, transition: "all 0.2s" }}>
          {loading ? <><span style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,0.15)", borderTop: "2px solid #10b981", borderRadius: "50%", animation: "spin 0.8s linear infinite", display: "inline-block" }} /> Assessing...</> : "🏥 Get Guidance"}
        </button>
      </div>

      {error && <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: 12, padding: 16, color: "#f87171", fontSize: 14, marginBottom: 16 }}>{error}</div>}

      {result && (
        <div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: "#334155", letterSpacing: "0.12em" }}>ASSESSMENT</div>
            <button onClick={() => { navigator.clipboard.writeText(result); setCopied(true); setTimeout(() => setCopied(false), 2000); }} style={{ fontSize: 12, color: copied ? "#10b981" : "#64748b", background: "rgba(255,255,255,0.04)", border: `1px solid ${copied ? "rgba(16,185,129,0.3)" : "rgba(255,255,255,0.08)"}`, padding: "4px 12px", borderRadius: 8, cursor: "pointer", fontFamily: FONT, transition: "all 0.2s" }}>{copied ? "✓ Copied" : "Copy"}</button>
          </div>
          {parseResult(result)}
          <button onClick={() => { setResult(null); setSymptoms(""); }} style={{ marginTop: 8, padding: "8px 16px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, color: "#64748b", fontSize: 12, cursor: "pointer", fontFamily: FONT }}>← Assess different symptoms</button>
        </div>
      )}

      <div style={{ marginTop: 24, padding: 14, background: "rgba(251,191,36,0.05)", border: "1px solid rgba(251,191,36,0.15)", borderRadius: 10 }}>
        <div style={{ fontSize: 11, color: "#64748b", lineHeight: 1.7 }}>⚠️ <strong style={{ color: "#94a3b8" }}>Medical Disclaimer:</strong> This tool provides general cost and care guidance only — it is not medical advice. When in doubt, go to the ER. Under EMTALA, every emergency room must treat you regardless of ability to pay.</div>
      </div>
    </div>
  );
}
