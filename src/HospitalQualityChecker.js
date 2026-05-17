'use client';
import { useState } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";

const FONT = "'Inter', system-ui, sans-serif";

const RATING_SOURCES = [
  {
    name: "CMS Overall Hospital Quality Star Rating",
    icon: "⭐",
    color: "#10b981",
    description: "1–5 stars based on 46 quality measures across mortality, safety, readmission, patient experience, and timely care. The most comprehensive federal quality rating.",
    how: "Go to care.medicare.gov → Search by hospital name or ZIP → 'Compare hospitals' shows star ratings, individual measure breakdowns, and national comparisons.",
    url: "care.medicare.gov",
    weight: "High",
  },
  {
    name: "Leapfrog Hospital Safety Grade",
    icon: "🐸",
    color: "#34d399",
    description: "A–F letter grade focused specifically on patient safety: infections, surgical errors, and practices that prevent harm. 'A' grade hospitals have 50% fewer preventable deaths.",
    how: "Visit leapfroggroup.org → 'Find a Hospital' → Enter ZIP or hospital name → View safety grade and detailed measures.",
    url: "leapfroggroup.org",
    weight: "High — focuses on safety outcomes",
  },
  {
    name: "U.S. News Best Hospitals",
    icon: "📰",
    color: "#60a5fa",
    description: "Comprehensive national rankings for specialty care (cancer, cardiology, orthopedics, etc.) and best hospitals by state. Based on outcomes, patient experience, nurse staffing, and more.",
    how: "Visit health.usnews.com/best-hospitals → Search by hospital, specialty, or location.",
    url: "health.usnews.com/best-hospitals",
    weight: "High for specialty care",
  },
  {
    name: "HCAHPS Patient Experience Survey",
    icon: "📊",
    color: "#fbbf24",
    description: "Patient-reported experience scores included in CMS star ratings. Measures communication with nurses/doctors, staff responsiveness, cleanliness, pain management, and discharge information.",
    how: "Included in the CMS Star Rating at care.medicare.gov under 'Patient Experience' tab.",
    url: "care.medicare.gov",
    weight: "Moderate — captures what patients actually experienced",
  },
  {
    name: "Joint Commission Accreditation",
    icon: "🏅",
    color: "#a78bfa",
    description: "Independent accreditation verifying the hospital meets national standards for quality and safety. Over 4,000 hospitals are accredited. Look for 'Gold Seal of Approval.'",
    how: "Visit qualitycheck.org → Search for your hospital to verify accreditation status and any standard citations.",
    url: "qualitycheck.org",
    weight: "Baseline credibility check",
  },
  {
    name: "State Health Department Reports",
    icon: "🏛️",
    color: "#fb923c",
    description: "Many states publish hospital inspection reports, infection data, and complaint histories. May contain information not in federal databases.",
    how: "Search '[your state] health department hospital quality data' or visit your state health department website.",
    url: "Varies by state",
    weight: "Useful for local context",
  },
];

const RED_FLAGS = [
  { flag: "CMS 1–2 star rating", color: "#f87171" },
  { flag: "Leapfrog D or F grade", color: "#f87171" },
  { flag: "High readmission rates (patients returning within 30 days)", color: "#fbbf24" },
  { flag: "High hospital-acquired infection rates (C. diff, MRSA, CAUTI, CLABSI)", color: "#f87171" },
  { flag: "Below-average mortality rates for your specific condition", color: "#f87171" },
  { flag: "No Joint Commission accreditation", color: "#fbbf24" },
  { flag: "State inspection violations or consent orders", color: "#fbbf24" },
  { flag: "Low nurse staffing levels", color: "#fbbf24" },
  { flag: "Patient experience scores well below national average", color: "#fbbf24" },
];

const SECTIONS = [
  { key: "QUALITY SUMMARY", emoji: "⭐", color: "#10b981" },
  { key: "WHAT THE RATINGS MEAN", emoji: "📊", color: "#60a5fa" },
  { key: "WHERE TO RESEARCH", emoji: "🔍", color: "#fbbf24" },
  { key: "RED FLAGS TO WATCH", emoji: "🚨", color: "#f87171" },
  { key: "QUESTIONS TO ASK", emoji: "❓", color: "#a78bfa" },
];

export default function HospitalQualityChecker() {
  const { consumeCredit, showLoginModal } = useAuth();
  const [activeTab, setActiveTab] = useState("guide");
  const [hospital, setHospital] = useState("");
  const [procedure, setProcedure] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(null);

  const check = async () => {
    if (!hospital.trim()) return;
    if (!consumeCredit()) { showLoginModal(); return; }
    setLoading(true);
    setResult(null);
    setError(null);
    try {
      const r = await axios.post("/api/tools", { tool: "hospitalquality", hospital, procedure });
      setResult(r.data.result);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const parseResult = (text) => {
    const clean = text.replace(/\*\*/g, "").replace(/^#{1,3}\s*/gm, "");
    return SECTIONS.map((s, i) => {
      const regex = new RegExp(`${s.key}:\\n([\\s\\S]*?)(?=\\n[A-Z][A-Z/ &]+:|$)`);
      const match = clean.match(regex);
      const raw = match ? match[1].trim() : null;
      if (!raw) return null;
      const content = raw.trim();
      if (!content) return null;
      return (
        <div key={s.key} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderLeft: `3px solid ${s.color}`, borderRadius: 12, padding: "16px 20px", marginBottom: 10, animation: "fadeUp 0.35s ease forwards", animationDelay: `${i * 0.07}s`, animationFillMode: "both" }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: s.color, letterSpacing: "0.12em", marginBottom: 8, textTransform: "uppercase" }}>{s.emoji} {s.key}</div>
          <div style={{ fontSize: 14, color: "#cbd5e1", lineHeight: 1.75, whiteSpace: "pre-line" }}>{content}</div>
        </div>
      );
    });
  };

  return (
    <div>
      <div style={{ textAlign: "center", marginBottom: 28 }}>
        <div style={{ fontSize: 36, marginBottom: 10 }}>🏆</div>
        <h1 style={{ fontSize: "clamp(20px, 5vw, 28px)", fontWeight: 900, color: "#f1f5f9", marginBottom: 8, letterSpacing: "-0.02em" }}>Hospital Quality Checker</h1>
        <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.6, maxWidth: 460, margin: "0 auto" }}>
          Where you get care matters as much as what care you get. Check hospital safety grades, star ratings, infection rates, and surgical outcomes before you commit.
        </p>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
        {[{id:"guide",label:"Rating Sources"},{id:"redflags",label:"Red Flags"},{id:"check",label:"Research a Hospital"}].map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)} style={{ flex: 1, padding: "9px 12px", background: activeTab === t.id ? "rgba(16,185,129,0.12)" : "rgba(255,255,255,0.04)", border: `1px solid ${activeTab === t.id ? "rgba(16,185,129,0.3)" : "rgba(255,255,255,0.08)"}`, borderRadius: 10, color: activeTab === t.id ? "#10b981" : "#64748b", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: FONT }}>{t.label}</button>
        ))}
      </div>

      {activeTab === "guide" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {RATING_SOURCES.map(s => (
            <div key={s.name} style={{ background: "rgba(255,255,255,0.02)", border: `1px solid ${s.color}20`, borderLeft: `3px solid ${s.color}`, borderRadius: 14, padding: "18px 20px" }}>
              <div style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 10 }}>
                <span style={{ fontSize: 22, flexShrink: 0 }}>{s.icon}</span>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: s.color, marginBottom: 4 }}>{s.name}</div>
                  <div style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.65 }}>{s.description}</div>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: 8, padding: "10px 12px" }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: "#475569", letterSpacing: "0.08em", marginBottom: 4, textTransform: "uppercase" }}>How to use it</div>
                  <div style={{ fontSize: 12, color: "#64748b", lineHeight: 1.6 }}>{s.how}</div>
                </div>
                <div style={{ background: `${s.color}08`, borderRadius: 8, padding: "10px 12px" }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: s.color, letterSpacing: "0.08em", marginBottom: 4, textTransform: "uppercase" }}>Reliability</div>
                  <div style={{ fontSize: 12, color: "#64748b", lineHeight: 1.6 }}>{s.weight}</div>
                  <div style={{ fontSize: 11, color: "#10b981", marginTop: 4 }}>→ {s.url}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === "redflags" && (
        <div>
          <div style={{ background: "rgba(248,113,113,0.06)", border: "1px solid rgba(248,113,113,0.2)", borderRadius: 14, padding: "16px 20px", marginBottom: 20 }}>
            <div style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.7 }}>These warning signs don't necessarily mean you can't get good care at a hospital — but they should prompt you to ask hard questions, consider alternatives, or at minimum discuss them with your doctor.</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
            {RED_FLAGS.map(f => (
              <div key={f.flag} style={{ display: "flex", gap: 12, padding: "12px 16px", background: `${f.color}06`, border: `1px solid ${f.color}20`, borderRadius: 10, alignItems: "center" }}>
                <span style={{ fontSize: 18 }}>{f.color === "#f87171" ? "🚨" : "⚠️"}</span>
                <span style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.6 }}>{f.flag}</span>
              </div>
            ))}
          </div>
          <div style={{ background: "rgba(16,185,129,0.05)", border: "1px solid rgba(16,185,129,0.15)", borderRadius: 14, padding: "16px 18px" }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#10b981", marginBottom: 8 }}>✅ Green Flags</div>
            {["CMS 4–5 star rating","Leapfrog A grade","Low infection and readmission rates","High patient experience scores","Board-certified surgeons with high volume in your specific procedure","Magnet nursing designation (high nurse-to-patient ratios)","Accredited by Joint Commission with no recent citations"].map((g, i) => (
              <div key={i} style={{ display: "flex", gap: 8, marginBottom: 5 }}><span style={{ color: "#10b981" }}>✓</span><span style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.6 }}>{g}</span></div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "check" && (
        <div>
          <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 20, marginBottom: 20 }}>
            <label style={{ fontSize: 11, fontWeight: 700, color: "#475569", display: "block", marginBottom: 8, letterSpacing: "0.06em", textTransform: "uppercase" }}>Hospital Name</label>
            <input value={hospital} onChange={e => setHospital(e.target.value)} placeholder="e.g. 'Northwestern Memorial Hospital' or 'my local hospital in Phoenix, AZ'" style={{ width: "100%", padding: "10px 14px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, fontSize: 14, color: "#f1f5f9", fontFamily: FONT, boxSizing: "border-box", marginBottom: 14 }} />
            <label style={{ fontSize: 11, fontWeight: 700, color: "#475569", display: "block", marginBottom: 8, letterSpacing: "0.06em", textTransform: "uppercase" }}>Procedure / Condition (optional)</label>
            <input value={procedure} onChange={e => setProcedure(e.target.value)} placeholder="e.g. 'hip replacement', 'heart surgery', 'appendectomy'" style={{ width: "100%", padding: "10px 14px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, fontSize: 14, color: "#f1f5f9", fontFamily: FONT, boxSizing: "border-box", marginBottom: 14 }} />
            <button onClick={check} disabled={loading || !hospital.trim()} style={{ width: "100%", padding: "13px", background: loading || !hospital.trim() ? "rgba(255,255,255,0.05)" : "linear-gradient(135deg, #10b981, #059669)", color: loading || !hospital.trim() ? "#334155" : "#fff", border: "none", borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: loading || !hospital.trim() ? "default" : "pointer", fontFamily: FONT, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, transition: "all 0.2s" }}>
              {loading ? <><span style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,0.15)", borderTop: "2px solid #10b981", borderRadius: "50%", animation: "spin 0.8s linear infinite", display: "inline-block" }} /> Researching...</> : "🏆 Research This Hospital"}
            </button>
          </div>
          {error && <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: 12, padding: 16, color: "#f87171", fontSize: 14, marginBottom: 16 }}>{error}</div>}
          {result && (
            <div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: "#334155", letterSpacing: "0.12em" }}>QUALITY RESEARCH — {hospital.toUpperCase()}</div>
                <button onClick={() => { navigator.clipboard.writeText(result); setCopied(true); setTimeout(() => setCopied(false), 2000); }} style={{ fontSize: 12, color: copied ? "#10b981" : "#64748b", background: "rgba(255,255,255,0.04)", border: `1px solid ${copied ? "rgba(16,185,129,0.3)" : "rgba(255,255,255,0.08)"}`, padding: "4px 12px", borderRadius: 8, cursor: "pointer", fontFamily: FONT, transition: "all 0.2s" }}>{copied ? "✓ Copied" : "Copy"}</button>
              </div>
              {parseResult(result)}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
