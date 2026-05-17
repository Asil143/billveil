import { useState } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";

const FONT = "'Inter', system-ui, sans-serif";

const EXAMPLES = [
  "My insurer requires prior auth for therapy but not for physical PT",
  "Limited to 30 therapy visits per year but no limit on physical health",
  "Out-of-network mental health covered at 0% but physical health at 70%",
  "Denied coverage for residential treatment for depression",
];

const SECTIONS = [
  { key: "YOUR COVERAGE RIGHTS", emoji: "⚖️", color: "#a78bfa" },
  { key: "WHAT TO LOOK FOR", emoji: "🔍", color: "#60a5fa" },
  { key: "HOW TO FIGHT BACK", emoji: "⚔️", color: "#f87171" },
  { key: "THE LAW ON YOUR SIDE", emoji: "📜", color: "#34d399" },
];

const VIOLATIONS = [
  { title: "Prior Auth Discrimination", desc: "Requiring pre-authorization for mental health/SUD treatment when equivalent physical treatments don't require it." },
  { title: "Visit Limits", desc: "Limiting therapy visits (e.g., 30/year) when there are no equivalent limits on physical health visits." },
  { title: "Step Therapy (Fail First)", desc: "Requiring patients to try cheaper treatments before more appropriate mental health care, when not required for physical conditions." },
  { title: "Reimbursement Disparities", desc: "Paying mental health providers at lower rates than physical health providers for equivalent services." },
  { title: "Network Inadequacy", desc: "Having far fewer in-network mental health providers than in-network physical health providers, forcing out-of-network use." },
  { title: "Different Deductibles/Cost-Sharing", desc: "Applying higher deductibles or copays to mental health services compared to medical/surgical services." },
];

export default function MentalHealthParityChecker() {
  const { consumeCredit, showLoginModal } = useAuth();
  const [situation, setSituation] = useState("");
  const [state, setState] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  const check = async () => {
    if (!situation.trim()) return;
    if (!consumeCredit()) { showLoginModal(); return; }
    setLoading(true);
    setResult(null);
    setError(null);
    try {
      const r = await axios.post("/api/tools", { tool: "mentalparity", situation, state });
      setResult(r.data.result);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const parseResult = (text) => {
    return SECTIONS.map((s, i) => {
      const regex = new RegExp(`${s.key}:\\n([\\s\\S]*?)(?=\\n[A-Z][A-Z/ &]+:|$)`);
      const match = text.match(regex);
      const raw = match ? match[1].trim() : null;
      if (!raw) return null;
      const content = raw.replace(/\*\*/g, "").replace(/^#{1,3}\s*/gm, "").trim();
      if (!content) return null;
      return (
        <div key={s.key} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderLeft: `3px solid ${s.color}`, borderRadius: 12, padding: "16px 20px", marginBottom: 10, animation: "fadeUp 0.35s ease forwards", animationDelay: `${i * 0.07}s`, animationFillMode: "both" }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: s.color, letterSpacing: "0.12em", marginBottom: 8, textTransform: "uppercase" }}>{s.emoji} {s.key}</div>
          <div style={{ fontSize: 14, color: "#cbd5e1", lineHeight: 1.75, whiteSpace: "pre-line" }}>{content}</div>
        </div>
      );
    });
  };

  const STATES = ["AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY","DC"];

  return (
    <div>
      <div style={{ textAlign: "center", marginBottom: 28 }}>
        <div style={{ fontSize: 36, marginBottom: 10 }}>🧠</div>
        <h1 style={{ fontSize: "clamp(20px, 5vw, 28px)", fontWeight: 900, color: "#f1f5f9", marginBottom: 8, letterSpacing: "-0.02em" }}>Mental Health Parity Checker</h1>
        <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.6, maxWidth: 460, margin: "0 auto" }}>
          Federal law requires insurers to cover mental health and addiction treatment the same as physical health. Use this tool to find violations and fight back.
        </p>
      </div>

      <div style={{ background: "rgba(167,139,250,0.06)", border: "1px solid rgba(167,139,250,0.15)", borderRadius: 14, padding: "16px 20px", marginBottom: 20 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#a78bfa", letterSpacing: "0.1em", marginBottom: 10, textTransform: "uppercase" }}>Common Parity Violations — Is Your Insurer Doing This?</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {VIOLATIONS.map(v => (
            <div key={v.title} style={{ background: "rgba(255,255,255,0.03)", borderRadius: 10, padding: "10px 12px" }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#a78bfa", marginBottom: 4 }}>{v.title}</div>
              <div style={{ fontSize: 11, color: "#64748b", lineHeight: 1.6 }}>{v.desc}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 20, marginBottom: 20 }}>
        <label style={{ fontSize: 11, fontWeight: 700, color: "#475569", display: "block", marginBottom: 10, letterSpacing: "0.06em", textTransform: "uppercase" }}>Describe Your Mental Health Coverage Issue</label>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14 }}>
          {EXAMPLES.map(e => (
            <button key={e} onClick={() => setSituation(e)} style={{ padding: "4px 10px", background: situation === e ? "rgba(167,139,250,0.12)" : "rgba(255,255,255,0.04)", border: `1px solid ${situation === e ? "rgba(167,139,250,0.3)" : "rgba(255,255,255,0.08)"}`, borderRadius: 20, fontSize: 11, color: situation === e ? "#a78bfa" : "#64748b", cursor: "pointer", fontFamily: FONT }}>{e}</button>
          ))}
        </div>
        <textarea value={situation} onChange={e => setSituation(e.target.value)} placeholder="Describe what your insurer is doing — compare it to how they treat physical health conditions..." style={{ width: "100%", height: 100, padding: "12px 14px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, fontSize: 14, color: "#f1f5f9", resize: "vertical", fontFamily: FONT, lineHeight: 1.6, boxSizing: "border-box", marginBottom: 14 }} />
        <div style={{ display: "flex", gap: 12, marginBottom: 14 }}>
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: 11, fontWeight: 700, color: "#475569", display: "block", marginBottom: 6, letterSpacing: "0.06em", textTransform: "uppercase" }}>State (optional)</label>
            <select value={state} onChange={e => setState(e.target.value)} style={{ width: "100%", padding: "10px 12px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, fontSize: 14, color: "#f1f5f9", fontFamily: FONT, cursor: "pointer", boxSizing: "border-box" }}>
              <option value="" style={{ background: "#0d1526" }}>Select state (for state-specific laws)</option>
              {STATES.map(s => <option key={s} value={s} style={{ background: "#0d1526" }}>{s}</option>)}
            </select>
          </div>
        </div>
        <button onClick={check} disabled={loading || !situation.trim()} style={{ width: "100%", padding: "13px", background: loading || !situation.trim() ? "rgba(255,255,255,0.05)" : "linear-gradient(135deg, #a78bfa, #7c3aed)", color: loading || !situation.trim() ? "#334155" : "#fff", border: "none", borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: loading || !situation.trim() ? "default" : "pointer", fontFamily: FONT, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, transition: "all 0.2s" }}>
          {loading ? <><span style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,0.15)", borderTop: "2px solid #a78bfa", borderRadius: "50%", animation: "spin 0.8s linear infinite", display: "inline-block" }} /> Checking parity rights...</> : "🧠 Check My Rights"}
        </button>
      </div>

      {error && <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: 12, padding: 16, color: "#f87171", fontSize: 14, marginBottom: 16 }}>{error}</div>}

      {result && (
        <div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: "#334155", letterSpacing: "0.12em" }}>PARITY ANALYSIS</div>
            <button onClick={() => { navigator.clipboard.writeText(result); setCopied(true); setTimeout(() => setCopied(false), 2000); }} style={{ fontSize: 12, color: copied ? "#10b981" : "#64748b", background: "rgba(255,255,255,0.04)", border: `1px solid ${copied ? "rgba(16,185,129,0.3)" : "rgba(255,255,255,0.08)"}`, padding: "4px 12px", borderRadius: 8, cursor: "pointer", fontFamily: FONT, transition: "all 0.2s" }}>{copied ? "✓ Copied" : "Copy"}</button>
          </div>
          {parseResult(result)}
          <button onClick={() => { setResult(null); setSituation(""); }} style={{ marginTop: 8, padding: "8px 16px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, color: "#64748b", fontSize: 12, cursor: "pointer", fontFamily: FONT }}>← Check another issue</button>
        </div>
      )}
    </div>
  );
}
