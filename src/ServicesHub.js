import { useNavigate } from "react-router-dom";

const FONT = "'Inter', system-ui, sans-serif";

const CATEGORIES = [
  {
    label: "Fight Your Bill",
    color: "#f87171",
    icon: "⚔️",
    tools: [
      { tab: "dispute", emoji: "✉️", label: "Dispute Letter", desc: "Professional dispute letter ready to send to hospitals and insurers." },
      { tab: "denial", emoji: "⚔️", label: "Denial Fighter", desc: "Insurance denied your claim? We write the appeal and walk you through escalation." },
      { tab: "negotiate", emoji: "📞", label: "Negotiation Script", desc: "Word-for-word phone script to call billing and get a lower bill." },
      { tab: "debtrights", emoji: "⚖️", label: "Debt Rights Checker", desc: "Know your state-specific legal rights against medical debt collectors." },
    ],
  },
  {
    label: "Understand Your Coverage",
    color: "#60a5fa",
    icon: "📋",
    tools: [
      { tab: "eob", emoji: "📋", label: "EOB Explainer", desc: "Paste your Explanation of Benefits — we decode what you actually owe." },
      { tab: "priorauth", emoji: "📝", label: "Prior Auth Helper", desc: "Complete prior authorization letter, ready to print and submit." },
      { tab: "secondopinion", emoji: "🩺", label: "Second Opinion Finder", desc: "Which specialist to see, what questions to ask, red flags to watch for." },
    ],
  },
  {
    label: "Find Savings",
    color: "#34d399",
    icon: "💰",
    tools: [
      { tab: "drug", emoji: "💊", label: "Drug Price Comparator", desc: "Find the fair price and cheapest pharmacy for any medication." },
      { tab: "genericdrug", emoji: "💊", label: "Generic Drug Finder", desc: "Generic equivalent, discount programs, and a script to ask your doctor." },
    ],
  },
];

const COMING_SOON = [
  { emoji: "📸", label: "Bill Scan", desc: "Photo or PDF upload — auto-extracts bill data so you never have to type.", color: "#fbbf24" },
  { emoji: "🤝", label: "Charity Care Finder", desc: "Every nonprofit hospital must offer charity care. Find the program and apply.", color: "#34d399" },
  { emoji: "🚫", label: "No Surprises Act Checker", desc: "Check if your bill violates the No Surprises Act (2022) and auto-dispute it.", color: "#f87171" },
  { emoji: "🏥", label: "Hospital Price Lookup", desc: "Federal law requires hospitals to publish prices. Find what yours actually charges.", color: "#60a5fa" },
  { emoji: "👥", label: "Community Price Board", desc: "Crowdsourced real prices from patients. What people actually paid near you.", color: "#a78bfa" },
  { emoji: "🔮", label: "Pre-Treatment Estimator", desc: "Before any procedure — estimate real out-of-pocket and find the cheapest facility.", color: "#fbbf24" },
  { emoji: "🤖", label: "BillVeil Concierge", desc: "One AI chat that handles everything. Just describe your situation and talk.", color: "#10b981" },
  { emoji: "📊", label: "Case Tracker", desc: "Track every dispute with legal deadlines and automatic follow-up alerts.", color: "#f87171" },
  { emoji: "🏆", label: "Savings Dashboard", desc: "Your total savings, disputes won, and shareable savings card.", color: "#34d399" },
  { emoji: "🎯", label: "Bill Score", desc: "A single number showing your medical billing health and overpayment risk.", color: "#60a5fa" },
  { emoji: "📑", label: "Insurance Plan Decoder", desc: "Paste your Summary of Benefits — AI explains what your plan actually covers.", color: "#a78bfa" },
  { emoji: "💳", label: "HSA/FSA Optimizer", desc: "Find every expense that qualifies for HSA/FSA spending you might be missing.", color: "#fbbf24" },
  { emoji: "🗺️", label: "Provider Network Checker", desc: "Is your doctor in-network? What in vs out-of-network actually costs you.", color: "#60a5fa" },
  { emoji: "🏦", label: "Medical Credit Card Warning", desc: "CareCredit and Synchrony have deferred interest traps. Know before you sign.", color: "#f87171" },
  { emoji: "📬", label: "Itemization Request", desc: "Generate a letter demanding a fully itemized bill — reveals hidden charges.", color: "#34d399" },
];

export default function ServicesHub() {
  const navigate = useNavigate();

  return (
    <div>
      <div style={{ textAlign: "center", marginBottom: 36 }}>
        <h1 style={{ fontSize: "clamp(22px, 6vw, 32px)", fontWeight: 900, lineHeight: 1.15, letterSpacing: "-0.03em", marginBottom: 8, color: "#f1f5f9" }}>
          Your medical billing <span style={{ color: "#10b981", textShadow: "0 0 20px rgba(16,185,129,0.4)" }}>arsenal.</span>
        </h1>
        <p style={{ fontSize: "clamp(13px, 3vw, 15px)", color: "#64748b", lineHeight: 1.6, maxWidth: 460, margin: "0 auto" }}>
          Every tool you need to understand, fight, and reduce your medical bills — in one place.
        </p>
      </div>

      {/* Active tools by category */}
      {CATEGORIES.map((cat) => (
        <div key={cat.label} style={{ marginBottom: 32 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
            <span style={{ fontSize: 16 }}>{cat.icon}</span>
            <div style={{ fontSize: 11, fontWeight: 700, color: cat.color, letterSpacing: "0.12em", textTransform: "uppercase" }}>{cat.label}</div>
            <div style={{ flex: 1, height: 1, background: `linear-gradient(to right, ${cat.color}30, transparent)` }} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 12 }}>
            {cat.tools.map((tool) => (
              <button
                key={tool.tab}
                onClick={() => navigate(`/${tool.tab}`)}
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: "18px 20px", cursor: "pointer", textAlign: "left", fontFamily: FONT, transition: "all 0.2s", display: "flex", alignItems: "flex-start", gap: 14 }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = `${cat.color}60`; e.currentTarget.style.background = `${cat.color}08`; e.currentTarget.style.transform = "translateY(-2px)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.background = "rgba(255,255,255,0.03)"; e.currentTarget.style.transform = "translateY(0)"; }}
              >
                <div style={{ fontSize: 26, flexShrink: 0, marginTop: 2 }}>{tool.emoji}</div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#f1f5f9", marginBottom: 4 }}>{tool.label}</div>
                  <div style={{ fontSize: 12, color: "#64748b", lineHeight: 1.65 }}>{tool.desc}</div>
                </div>
                <div style={{ marginLeft: "auto", fontSize: 16, color: cat.color, flexShrink: 0, alignSelf: "center", paddingLeft: 8 }}>→</div>
              </button>
            ))}
          </div>
        </div>
      ))}

      {/* Coming Soon */}
      <div style={{ marginTop: 48, paddingTop: 32, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#334155", letterSpacing: "0.12em", textTransform: "uppercase" }}>Coming Soon</div>
          <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.05)" }} />
          <div style={{ fontSize: 10, color: "#334155", fontWeight: 600 }}>{COMING_SOON.length} features in development</div>
        </div>
        <p style={{ fontSize: 12, color: "#334155", marginBottom: 20 }}>We're building these next. Vote with your wallet — tips fund development.</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 10 }}>
          {COMING_SOON.map((item) => (
            <div key={item.label} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 12, padding: "14px 16px", display: "flex", alignItems: "flex-start", gap: 12, opacity: 0.7 }}>
              <div style={{ fontSize: 20, flexShrink: 0 }}>{item.emoji}</div>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#94a3b8" }}>{item.label}</div>
                  <div style={{ fontSize: 9, fontWeight: 700, color: item.color, background: `${item.color}18`, border: `1px solid ${item.color}30`, padding: "1px 6px", borderRadius: 8, letterSpacing: "0.06em" }}>SOON</div>
                </div>
                <div style={{ fontSize: 11, color: "#475569", lineHeight: 1.6 }}>{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
