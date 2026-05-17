import { useState } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";

const FONT = "'Inter', system-ui, sans-serif";

const PARTS = [
  {
    part: "Part A",
    name: "Hospital Insurance",
    icon: "🏥",
    color: "#60a5fa",
    cost: "Free for most (paid via payroll taxes 40+ quarters)",
    covers: ["Inpatient hospital stays (days 1–60 free after $1,632 deductible in 2024)", "Skilled nursing facility care (days 1–20 free; days 21–100 with $204/day copay)", "Hospice care (free for qualifying terminal illness)", "Some home health care"],
    gotchas: ["Observation status vs. admission — you must be formally 'admitted' to count toward hospital days", "$1,632 deductible per benefit period (not per year)", "After 60 days: $408/day; after 90 days: $816/day from lifetime reserve"],
  },
  {
    part: "Part B",
    name: "Medical Insurance",
    icon: "🩺",
    color: "#34d399",
    cost: "$174.70/month standard premium in 2024 (higher if income >$103,000)",
    covers: ["Doctor visits and outpatient services", "Preventive services (annual wellness visit, screenings, vaccines)", "Durable medical equipment (wheelchair, CPAP, walker)", "Mental health services", "Ambulance services", "Some home health care", "Chemotherapy and dialysis"],
    gotchas: ["20% coinsurance after $240 annual deductible — no out-of-pocket limit without Medigap", "IRMAA surcharges for high earners (based on 2-year-old tax return)", "Late enrollment penalty: 10% per year if you delay without creditable coverage"],
  },
  {
    part: "Part C",
    name: "Medicare Advantage",
    icon: "🏦",
    color: "#fbbf24",
    cost: "Varies by plan ($0 to $100+/month, includes Part A & B benefits)",
    covers: ["Everything in Parts A and B", "Often includes dental, vision, and hearing", "Many plans include prescription drug coverage (Part D)", "Some plans include gym memberships (SilverSneakers)", "Out-of-pocket maximums (Original Medicare has none)"],
    gotchas: ["Must use in-network providers (HMO) or pay more (PPO)", "Prior authorization required for many services", "Plans can change coverage, premiums, and networks annually", "May not cover care outside your plan's service area", "Cannot use Medigap (supplemental) with Medicare Advantage"],
  },
  {
    part: "Part D",
    name: "Drug Coverage",
    icon: "💊",
    color: "#a78bfa",
    cost: "$55.50/month average premium in 2024 (varies widely by plan)",
    covers: ["Prescription medications on plan's formulary", "$2,000 out-of-pocket cap starting in 2025 (big change from 2024)", "Generic drugs typically very low copay ($0–$10)", "Vaccines covered under Part D (some now under Part B)"],
    gotchas: ["Each plan has its own formulary — check if your drugs are covered", "Late enrollment penalty: 1% per month if you delay without creditable coverage", "Formulary tiers determine your copay — tier 1 (generic) vs tier 5 (specialty)", "Extra Help program available for low-income beneficiaries ($0 or low copays)"],
  },
];

const ENROLLMENT_WINDOWS = [
  { title: "Initial Enrollment Period (IEP)", color: "#10b981", desc: "7-month window: 3 months before your 65th birthday, your birthday month, and 3 months after. Best time to enroll — no penalties.", icon: "🎂" },
  { title: "Special Enrollment Period (SEP)", color: "#60a5fa", desc: "If you have employer coverage when you turn 65, you get an 8-month SEP to enroll after coverage ends — NO penalty as long as you had creditable coverage.", icon: "💼" },
  { title: "General Enrollment Period (GEP)", color: "#fbbf24", desc: "January 1 – March 31 each year if you missed IEP/SEP. Coverage starts July 1. You'll likely face late enrollment penalties.", icon: "📅" },
  { title: "Annual Open Enrollment (AEP)", color: "#a78bfa", desc: "October 15 – December 7 each year. Change your Part D or Medicare Advantage plan. Changes take effect January 1.", icon: "🔄" },
];

const SECTIONS = [
  { key: "RECOMMENDATION", emoji: "✅", color: "#10b981" },
  { key: "WHAT IT COVERS", emoji: "📋", color: "#60a5fa" },
  { key: "WHAT YOU'LL PAY", emoji: "💰", color: "#34d399" },
  { key: "ENROLLMENT STEPS", emoji: "📝", color: "#fbbf24" },
  { key: "IMPORTANT WARNINGS", emoji: "⚠️", color: "#f87171" },
];

export default function MedicareNavigator() {
  const { consumeCredit, showLoginModal } = useAuth();
  const [activeTab, setActiveTab] = useState("guide");
  const [question, setQuestion] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState({});

  const ask = async () => {
    if (!question.trim()) return;
    if (!consumeCredit()) { showLoginModal(); return; }
    setLoading(true);
    setResult(null);
    setError(null);
    try {
      const r = await axios.post("/api/tools", { tool: "medicare", question });
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

  const toggle = (key) => setExpanded(e => ({ ...e, [key]: !e[key] }));

  const COMMON_QUESTIONS = [
    "Should I choose Medicare Advantage or Original Medicare?",
    "I'm still working at 65 — do I need to enroll in Medicare?",
    "How do I choose a Part D prescription drug plan?",
    "What is Medigap and do I need it?",
    "I missed enrollment — what are my penalties?",
  ];

  return (
    <div>
      <div style={{ textAlign: "center", marginBottom: 28 }}>
        <div style={{ fontSize: 36, marginBottom: 10 }}>🏛️</div>
        <h1 style={{ fontSize: "clamp(20px, 5vw, 28px)", fontWeight: 900, color: "#f1f5f9", marginBottom: 8, letterSpacing: "-0.02em" }}>Medicare Navigator</h1>
        <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.6, maxWidth: 460, margin: "0 auto" }}>
          Understand Medicare Parts A, B, C, and D — enrollment windows, costs, and how to choose the right coverage for your health needs.
        </p>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
        {[{id:"guide",label:"Medicare Guide"},{id:"enrollment",label:"Enrollment Timeline"},{id:"qa",label:"Ask AI"}].map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)} style={{ flex: 1, padding: "9px 12px", background: activeTab === t.id ? "rgba(16,185,129,0.12)" : "rgba(255,255,255,0.04)", border: `1px solid ${activeTab === t.id ? "rgba(16,185,129,0.3)" : "rgba(255,255,255,0.08)"}`, borderRadius: 10, color: activeTab === t.id ? "#10b981" : "#64748b", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: FONT }}>{t.label}</button>
        ))}
      </div>

      {activeTab === "guide" && (
        <div>
          {PARTS.map(p => (
            <div key={p.part} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, marginBottom: 14, overflow: "hidden" }}>
              <button onClick={() => toggle(p.part)} style={{ width: "100%", display: "flex", alignItems: "center", gap: 14, padding: "16px 18px", background: "none", border: "none", cursor: "pointer", fontFamily: FONT, textAlign: "left" }}>
                <div style={{ width: 40, height: 40, background: `${p.color}15`, border: `1px solid ${p.color}40`, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>{p.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
                    <span style={{ fontSize: 15, fontWeight: 800, color: "#f1f5f9" }}>{p.part}</span>
                    <span style={{ fontSize: 12, fontWeight: 600, color: p.color }}>— {p.name}</span>
                  </div>
                  <div style={{ fontSize: 12, color: "#64748b" }}>{p.cost}</div>
                </div>
                <span style={{ color: "#475569", fontSize: 14 }}>{expanded[p.part] ? "▲" : "▼"}</span>
              </button>
              {expanded[p.part] && (
                <div style={{ padding: "0 18px 18px" }}>
                  <div style={{ marginBottom: 14 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "#10b981", letterSpacing: "0.1em", marginBottom: 8, textTransform: "uppercase" }}>What it covers</div>
                    {p.covers.map((c, i) => <div key={i} style={{ display: "flex", gap: 8, marginBottom: 5 }}><span style={{ color: "#10b981" }}>✓</span><span style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.6 }}>{c}</span></div>)}
                  </div>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "#f87171", letterSpacing: "0.1em", marginBottom: 8, textTransform: "uppercase" }}>⚠️ Watch out for</div>
                    {p.gotchas.map((g, i) => <div key={i} style={{ display: "flex", gap: 8, marginBottom: 5 }}><span style={{ color: "#f87171" }}>!</span><span style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.6 }}>{g}</span></div>)}
                  </div>
                </div>
              )}
            </div>
          ))}
          <div style={{ background: "rgba(16,185,129,0.05)", border: "1px solid rgba(16,185,129,0.15)", borderRadius: 14, padding: "16px 18px", marginTop: 8 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#10b981", marginBottom: 8 }}>📞 Need official help?</div>
            <div style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.7 }}>
              • <strong style={{ color: "#f1f5f9" }}>Medicare helpline:</strong> 1-800-MEDICARE (1-800-633-4227)<br />
              • <strong style={{ color: "#f1f5f9" }}>SHIP counselors (free):</strong> shiptacenter.org — trained volunteers who give unbiased, free Medicare counseling<br />
              • <strong style={{ color: "#f1f5f9" }}>Medicare.gov:</strong> Plan finder tool, coverage comparison, drug plan lookup
            </div>
          </div>
        </div>
      )}

      {activeTab === "enrollment" && (
        <div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 20 }}>
            {ENROLLMENT_WINDOWS.map(w => (
              <div key={w.title} style={{ background: "rgba(255,255,255,0.02)", border: `1px solid ${w.color}25`, borderLeft: `3px solid ${w.color}`, borderRadius: 12, padding: "16px 20px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <span style={{ fontSize: 20 }}>{w.icon}</span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: w.color }}>{w.title}</span>
                </div>
                <div style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.7 }}>{w.desc}</div>
              </div>
            ))}
          </div>
          <div style={{ background: "rgba(248,113,113,0.06)", border: "1px solid rgba(248,113,113,0.2)", borderRadius: 14, padding: "16px 20px" }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#f87171", marginBottom: 10 }}>⚠️ Late Enrollment Penalties — These Never Go Away</div>
            <div style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.8 }}>
              <strong style={{ color: "#f1f5f9" }}>Part B:</strong> 10% premium increase per full 12-month period you delayed. This is permanent for life.<br />
              <strong style={{ color: "#f1f5f9" }}>Part D:</strong> 1% of national base beneficiary premium per month of delay. Also permanent.<br />
              <br />
              <strong style={{ color: "#fbbf24" }}>Exception:</strong> If you had "creditable" employer coverage (as good as Medicare), you don't pay penalties. Get a letter from your employer confirming creditable coverage when you retire.
            </div>
          </div>
        </div>
      )}

      {activeTab === "qa" && (
        <div>
          <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 20, marginBottom: 20 }}>
            <label style={{ fontSize: 11, fontWeight: 700, color: "#475569", display: "block", marginBottom: 10, letterSpacing: "0.06em", textTransform: "uppercase" }}>Ask a Medicare Question</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14 }}>
              {COMMON_QUESTIONS.map(q => (
                <button key={q} onClick={() => setQuestion(q)} style={{ padding: "4px 10px", background: question === q ? "rgba(16,185,129,0.12)" : "rgba(255,255,255,0.04)", border: `1px solid ${question === q ? "rgba(16,185,129,0.3)" : "rgba(255,255,255,0.08)"}`, borderRadius: 20, fontSize: 11, color: question === q ? "#10b981" : "#64748b", cursor: "pointer", fontFamily: FONT }}>{q}</button>
              ))}
            </div>
            <textarea value={question} onChange={e => setQuestion(e.target.value)} placeholder="Ask anything about Medicare — enrollment, costs, coverage, Part D, Medigap, Medicare Advantage..." style={{ width: "100%", height: 80, padding: "12px 14px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, fontSize: 14, color: "#f1f5f9", resize: "vertical", fontFamily: FONT, lineHeight: 1.6, boxSizing: "border-box", marginBottom: 14 }} />
            <button onClick={ask} disabled={loading || !question.trim()} style={{ width: "100%", padding: "13px", background: loading || !question.trim() ? "rgba(255,255,255,0.05)" : "linear-gradient(135deg, #10b981, #059669)", color: loading || !question.trim() ? "#334155" : "#fff", border: "none", borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: loading || !question.trim() ? "default" : "pointer", fontFamily: FONT, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, transition: "all 0.2s" }}>
              {loading ? <><span style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,0.15)", borderTop: "2px solid #10b981", borderRadius: "50%", animation: "spin 0.8s linear infinite", display: "inline-block" }} /> Getting answer...</> : "🏛️ Ask Medicare AI"}
            </button>
          </div>
          {error && <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: 12, padding: 16, color: "#f87171", fontSize: 14, marginBottom: 16 }}>{error}</div>}
          {result && (
            <div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: "#334155", letterSpacing: "0.12em" }}>ANSWER</div>
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
