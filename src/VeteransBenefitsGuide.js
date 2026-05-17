import { useState } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";

const FONT = "'Inter', system-ui, sans-serif";

const PRIORITY_GROUPS = [
  { group: "Group 1", color: "#34d399", desc: "Veterans with service-connected disabilities rated 50%+ OR determined unemployable. Free care and meds for SC conditions." },
  { group: "Group 2", color: "#60a5fa", desc: "Veterans with SC disabilities rated 30–40%. Free SC care, low copays for non-SC." },
  { group: "Group 3", color: "#a78bfa", desc: "Former POWs, Purple Heart recipients, veterans with SC disability 10–20%, veterans discharged for SC disability." },
  { group: "Group 4", color: "#fbbf24", desc: "Veterans receiving increased pension due to need for regular aid and attendance." },
  { group: "Group 5", color: "#fb923c", desc: "Non-SC veterans who receive VA pension or meet income/asset thresholds. Minimal or no copays." },
  { group: "Group 6", color: "#f87171", desc: "Veterans with SC conditions being treated, World War I veterans, some combat veterans." },
  { group: "Groups 7–8", color: "#64748b", desc: "Veterans who don't meet above criteria. Enrolled based on income thresholds. Copays apply." },
];

const BENEFITS = [
  {
    title: "VA Health Care",
    icon: "🏥",
    color: "#10b981",
    desc: "Comprehensive health coverage including primary care, mental health, dental (limited), vision, prescriptions, and specialty care — often at little or no cost.",
    eligibility: "Most veterans who served 24+ continuous months of active duty. Some exceptions for discharges due to SC conditions or service-connected injuries.",
    action: "Apply at va.gov/health-care/apply or call 1-877-222-8387",
  },
  {
    title: "VA Disability Compensation",
    icon: "💰",
    color: "#fbbf24",
    desc: "Tax-free monthly payment for conditions caused or worsened by military service. Ranges from $165/month (10%) to $3,757+/month (100%) in 2024.",
    eligibility: "Veterans with a service-connected disability rating from the VA.",
    action: "File a claim at va.gov/disability/file-disability-claim-form-21-526ez",
  },
  {
    title: "CHAMPVA (for Dependents)",
    icon: "👨‍👩‍👧",
    color: "#60a5fa",
    desc: "Healthcare program covering spouses and children of veterans rated 100% P&T disabled, or who died from a service-connected condition.",
    eligibility: "Spouses and children of Veterans rated 100% Permanent & Total (P&T) or who died in service or from a SC condition.",
    action: "Apply at va.gov/COMMUNITYCARE/programs/dependents/champva",
  },
  {
    title: "Veterans Pension",
    icon: "📋",
    color: "#a78bfa",
    desc: "Needs-based monthly payment for wartime veterans with limited income and net worth. Separate from disability compensation.",
    eligibility: "Wartime veteran (90+ days service with at least 1 day during wartime), low income/net worth, 65+ or permanently and totally disabled.",
    action: "Apply at va.gov/pension/apply-for-veteran-pension-form-21p-527ez",
  },
  {
    title: "Caregiver Support",
    icon: "🤝",
    color: "#f472b6",
    desc: "The Program of Comprehensive Assistance for Family Caregivers (PCAFC) provides monthly stipend, healthcare coverage, and respite care for caregivers of eligible post-9/11 veterans.",
    eligibility: "Veterans who were discharged on or after 9/11/2001 with a serious injury requiring personal care services.",
    action: "Apply at va.gov/family-member-benefits/comprehensive-assistance-for-family-caregivers",
  },
  {
    title: "Community Care Network (CCN)",
    icon: "🌐",
    color: "#34d399",
    desc: "Allows eligible veterans to receive care from community (non-VA) providers when VA can't provide timely or local care. VA pays the bill.",
    eligibility: "VA-enrolled veterans who meet distance, wait time, or specific clinical criteria.",
    action: "Contact your VA facility or call 1-866-606-8198 to request a community care referral.",
  },
];

const SECTIONS = [
  { key: "ELIGIBILITY", emoji: "✅", color: "#34d399" },
  { key: "BENEFITS YOU QUALIFY FOR", emoji: "💰", color: "#10b981" },
  { key: "HOW TO APPLY", emoji: "📝", color: "#60a5fa" },
  { key: "MAXIMIZING YOUR BENEFITS", emoji: "🏆", color: "#fbbf24" },
];

export default function VeteransBenefitsGuide() {
  const { consumeCredit, showLoginModal } = useAuth();
  const [activeTab, setActiveTab] = useState("guide");
  const [question, setQuestion] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  const ask = async () => {
    if (!question.trim()) return;
    if (!consumeCredit()) { showLoginModal(); return; }
    setLoading(true);
    setResult(null);
    setError(null);
    try {
      const r = await axios.post("/api/tools", { tool: "veterans", question });
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

  const COMMON_QUESTIONS = [
    "How do I increase my disability rating?",
    "What's covered under VA dental benefits?",
    "Can I use both VA benefits and Medicare?",
    "How do I appeal a VA disability denial?",
    "What are my PACT Act benefits (burn pit exposure)?",
  ];

  return (
    <div>
      <div style={{ textAlign: "center", marginBottom: 28 }}>
        <div style={{ fontSize: 36, marginBottom: 10 }}>🎖️</div>
        <h1 style={{ fontSize: "clamp(20px, 5vw, 28px)", fontWeight: 900, color: "#f1f5f9", marginBottom: 8, letterSpacing: "-0.02em" }}>Veterans Benefits Guide</h1>
        <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.6, maxWidth: 460, margin: "0 auto" }}>
          Navigate VA health benefits, disability compensation, CHAMPVA, pension, and community care — and make sure you're getting everything you've earned.
        </p>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
        {[{id:"guide",label:"Benefits Overview"},{id:"priority",label:"Priority Groups"},{id:"qa",label:"Ask AI"}].map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)} style={{ flex: 1, padding: "9px 12px", background: activeTab === t.id ? "rgba(16,185,129,0.12)" : "rgba(255,255,255,0.04)", border: `1px solid ${activeTab === t.id ? "rgba(16,185,129,0.3)" : "rgba(255,255,255,0.08)"}`, borderRadius: 10, color: activeTab === t.id ? "#10b981" : "#64748b", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: FONT }}>{t.label}</button>
        ))}
      </div>

      {activeTab === "guide" && (
        <div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {BENEFITS.map(b => (
              <div key={b.title} style={{ background: "rgba(255,255,255,0.02)", border: `1px solid ${b.color}20`, borderLeft: `3px solid ${b.color}`, borderRadius: 14, padding: "18px 20px" }}>
                <div style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 10 }}>
                  <span style={{ fontSize: 24, flexShrink: 0 }}>{b.icon}</span>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: b.color, marginBottom: 4 }}>{b.title}</div>
                    <div style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.7 }}>{b.desc}</div>
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 12 }}>
                  <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: 8, padding: "10px 12px" }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: "#475569", letterSpacing: "0.08em", marginBottom: 4, textTransform: "uppercase" }}>Who qualifies</div>
                    <div style={{ fontSize: 12, color: "#64748b", lineHeight: 1.6 }}>{b.eligibility}</div>
                  </div>
                  <div style={{ background: `${b.color}08`, borderRadius: 8, padding: "10px 12px" }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: b.color, letterSpacing: "0.08em", marginBottom: 4, textTransform: "uppercase" }}>How to apply</div>
                    <div style={{ fontSize: 12, color: "#64748b", lineHeight: 1.6 }}>{b.action}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 20, background: "rgba(16,185,129,0.05)", border: "1px solid rgba(16,185,129,0.15)", borderRadius: 14, padding: "16px 18px" }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#10b981", marginBottom: 8 }}>📞 Free Help Navigating VA Benefits</div>
            <div style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.75 }}>
              • <strong style={{ color: "#f1f5f9" }}>VSO (Veterans Service Organizations):</strong> Free claims assistance from DAV, VFW, American Legion, or similar<br />
              • <strong style={{ color: "#f1f5f9" }}>VA.gov:</strong> va.gov — apply for all benefits online<br />
              • <strong style={{ color: "#f1f5f9" }}>Veterans Crisis Line:</strong> Call 988, press 1 (24/7)<br />
              • <strong style={{ color: "#f1f5f9" }}>PACT Act (2022):</strong> Expanded eligibility for veterans exposed to burn pits and toxic exposures
            </div>
          </div>
        </div>
      )}

      {activeTab === "priority" && (
        <div>
          <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: "14px 18px", marginBottom: 20 }}>
            <div style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.7 }}>VA health care assigns veterans to priority groups 1–8. Your group determines your copays and access. Group 1 gets the most benefits; Group 8 has the most restrictions. Your group can change as your situation changes.</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {PRIORITY_GROUPS.map(p => (
              <div key={p.group} style={{ background: "rgba(255,255,255,0.02)", border: `1px solid ${p.color}25`, borderRadius: 12, padding: "14px 16px", display: "flex", gap: 14, alignItems: "flex-start" }}>
                <div style={{ width: 56, height: 32, background: `${p.color}15`, border: `1px solid ${p.color}40`, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <span style={{ fontSize: 12, fontWeight: 800, color: p.color }}>{p.group.replace("Group ", "PG")}</span>
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: p.color, marginBottom: 4 }}>{p.group}</div>
                  <div style={{ fontSize: 12, color: "#64748b", lineHeight: 1.65 }}>{p.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "qa" && (
        <div>
          <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 20, marginBottom: 20 }}>
            <label style={{ fontSize: 11, fontWeight: 700, color: "#475569", display: "block", marginBottom: 10, letterSpacing: "0.06em", textTransform: "uppercase" }}>Ask About Veterans Benefits</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14 }}>
              {COMMON_QUESTIONS.map(q => (
                <button key={q} onClick={() => setQuestion(q)} style={{ padding: "4px 10px", background: question === q ? "rgba(16,185,129,0.12)" : "rgba(255,255,255,0.04)", border: `1px solid ${question === q ? "rgba(16,185,129,0.3)" : "rgba(255,255,255,0.08)"}`, borderRadius: 20, fontSize: 11, color: question === q ? "#10b981" : "#64748b", cursor: "pointer", fontFamily: FONT }}>{q}</button>
              ))}
            </div>
            <textarea value={question} onChange={e => setQuestion(e.target.value)} placeholder="Ask about your VA benefits, disability rating, appeals, coverage, or eligibility..." style={{ width: "100%", height: 80, padding: "12px 14px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, fontSize: 14, color: "#f1f5f9", resize: "vertical", fontFamily: FONT, lineHeight: 1.6, boxSizing: "border-box", marginBottom: 14 }} />
            <button onClick={ask} disabled={loading || !question.trim()} style={{ width: "100%", padding: "13px", background: loading || !question.trim() ? "rgba(255,255,255,0.05)" : "linear-gradient(135deg, #10b981, #059669)", color: loading || !question.trim() ? "#334155" : "#fff", border: "none", borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: loading || !question.trim() ? "default" : "pointer", fontFamily: FONT, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, transition: "all 0.2s" }}>
              {loading ? <><span style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,0.15)", borderTop: "2px solid #10b981", borderRadius: "50%", animation: "spin 0.8s linear infinite", display: "inline-block" }} /> Getting answer...</> : "🎖️ Ask Veterans Benefits AI"}
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
