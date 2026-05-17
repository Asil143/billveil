import { useNavigate } from "react-router-dom";

const FONT = "'Inter', system-ui, sans-serif";

const RELATED = {
  analyzer:      ["dispute", "negotiate", "cptlookup", "charitycare"],
  dispute:       ["denial", "negotiate", "itemization", "patientrights"],
  denial:        ["dispute", "mentalparity", "patientrights", "casetracker"],
  negotiate:     ["dispute", "paymentplan", "charitycare", "casetracker"],
  eob:           ["insplan", "priorauth", "dispute", "cptlookup"],
  drug:          ["genericdrug", "hsafsa", "costestimate", "chronicdisease"],
  priorauth:     ["denial", "insplan", "eob", "patientrights"],
  debtrights:    ["dispute", "charitycare", "paymentplan", "patientrights"],
  secondopinion: ["costestimate", "hospitalquality", "providercheck", "insplan"],
  genericdrug:   ["drug", "hsafsa", "medtax", "chronicdisease"],
  insplan:       ["providercheck", "cobra", "hsafsa", "preventive"],
  surprisebill:  ["dispute", "patientrights", "debtrights", "denial"],
  itemization:   ["dispute", "cptlookup", "negotiate", "charitycare"],
  charitycare:   ["paymentplan", "debtrights", "dispute", "medtax"],
  paymentplan:   ["charitycare", "negotiate", "debtrights", "medtax"],
  creditcard:    ["paymentplan", "charitycare", "debtrights", "cobra"],
  hsafsa:        ["fsatracker", "medtax", "preventive", "drug"],
  providercheck: ["insplan", "costestimate", "secondopinion", "cobra"],
  costestimate:  ["cptlookup", "hospitalprice", "hospitalquality", "providercheck"],
  billscan:      ["dispute", "cptlookup", "itemization", "negotiate"],
  casetracker:   ["savings", "dispute", "denial", "hub"],
  savings:       ["casetracker", "hub", "medtax", "fsatracker"],
  concierge:     ["dispute", "denial", "drug", "services"],
  planoptimizer: ["insplan", "cobra", "insurance", "providercheck"],
  hospitalprice: ["costestimate", "hospitalquality", "negotiate", "cptlookup"],
  priceboard:    ["hospitalprice", "costestimate", "drug", "cptlookup"],
  hub:           ["casetracker", "savings", "dispute", "denial"],
  insurance:     ["cobra", "insplan", "preventive", "hsafsa"],
  profile:       ["hub", "savings", "casetracker"],
  cobra:         ["insurance", "insplan", "providercheck", "hsafsa"],
  cptlookup:     ["dispute", "itemization", "costestimate", "hospitalprice"],
  preventive:    ["insplan", "hsafsa", "providercheck", "secondopinion"],
  erurgent:      ["costestimate", "surprisebill", "patientrights", "cptlookup"],
  patientrights: ["hipaa", "mentalparity", "debtrights", "dispute"],
  hipaa:         ["patientrights", "dispute", "debtrights", "itemization"],
  mentalparity:  ["denial", "patientrights", "hipaa", "insplan"],
  medtax:        ["hsafsa", "fsatracker", "charitycare", "paymentplan"],
  fsatracker:    ["hsafsa", "medtax", "drug", "preventive"],
  medicare:      ["insplan", "providercheck", "preventive", "cobra"],
  veterans:      ["insplan", "patientrights", "charitycare", "cobra"],
  chronicdisease:["drug", "genericdrug", "hsafsa", "insplan"],
  glossary:      ["cptlookup", "eob", "insplan", "patientrights"],
  hospitalquality:["costestimate", "hospitalprice", "secondopinion", "erurgent"],
};

const TOOL_META = {
  analyzer:       { emoji: "⚡", label: "Bill Analyzer", color: "#10b981" },
  dispute:        { emoji: "✉️", label: "Dispute Letter", color: "#f87171" },
  denial:         { emoji: "⚔️", label: "Denial Fighter", color: "#f87171" },
  negotiate:      { emoji: "📞", label: "Negotiation Script", color: "#f87171" },
  eob:            { emoji: "📋", label: "EOB Explainer", color: "#60a5fa" },
  drug:           { emoji: "💊", label: "Drug Price Comparator", color: "#34d399" },
  priorauth:      { emoji: "📝", label: "Prior Auth Helper", color: "#60a5fa" },
  debtrights:     { emoji: "⚖️", label: "Debt Rights Checker", color: "#f87171" },
  secondopinion:  { emoji: "🩺", label: "Second Opinion Finder", color: "#60a5fa" },
  genericdrug:    { emoji: "💊", label: "Generic Drug Finder", color: "#34d399" },
  insplan:        { emoji: "🏥", label: "Insurance Plan Decoder", color: "#60a5fa" },
  surprisebill:   { emoji: "🚨", label: "Surprise Billing Checker", color: "#f87171" },
  itemization:    { emoji: "📑", label: "Itemization Request", color: "#f87171" },
  charitycare:    { emoji: "🤝", label: "Charity Care Finder", color: "#f87171" },
  paymentplan:    { emoji: "💳", label: "Payment Plan Negotiator", color: "#f87171" },
  creditcard:     { emoji: "⚠️", label: "Medical Credit Card Warning", color: "#f87171" },
  hsafsa:         { emoji: "💰", label: "HSA / FSA Optimizer", color: "#60a5fa" },
  providercheck:  { emoji: "🔍", label: "Provider Network Checker", color: "#60a5fa" },
  costestimate:   { emoji: "🔮", label: "Cost Estimator", color: "#34d399" },
  billscan:       { emoji: "📸", label: "Bill Scan", color: "#10b981" },
  casetracker:    { emoji: "📊", label: "Case Tracker", color: "#a78bfa" },
  savings:        { emoji: "🏆", label: "Savings Dashboard", color: "#a78bfa" },
  concierge:      { emoji: "🤖", label: "AI Concierge", color: "#10b981" },
  planoptimizer:  { emoji: "📈", label: "Plan Optimizer", color: "#10b981" },
  hospitalprice:  { emoji: "🏥", label: "Hospital Price Lookup", color: "#34d399" },
  priceboard:     { emoji: "👥", label: "Community Price Board", color: "#34d399" },
  hub:            { emoji: "🗂️", label: "My Hub", color: "#a78bfa" },
  insurance:      { emoji: "🛡️", label: "Insurance Finder", color: "#10b981" },
  profile:        { emoji: "👤", label: "My Profile", color: "#a78bfa" },
  cobra:          { emoji: "🧮", label: "COBRA Calculator", color: "#34d399" },
  cptlookup:      { emoji: "🔢", label: "CPT Code Lookup", color: "#34d399" },
  preventive:     { emoji: "🩺", label: "Preventive Care Checker", color: "#60a5fa" },
  erurgent:       { emoji: "🏥", label: "ER vs. Urgent Care", color: "#34d399" },
  patientrights:  { emoji: "⚖️", label: "Patient Rights Guide", color: "#f87171" },
  hipaa:          { emoji: "🔒", label: "HIPAA Rights Guide", color: "#f87171" },
  mentalparity:   { emoji: "🧠", label: "Mental Health Parity", color: "#f87171" },
  medtax:         { emoji: "🧾", label: "Medical Tax Calculator", color: "#fb923c" },
  fsatracker:     { emoji: "⏰", label: "FSA Tracker", color: "#fb923c" },
  medicare:       { emoji: "🏛️", label: "Medicare Navigator", color: "#38bdf8" },
  veterans:       { emoji: "🎖️", label: "Veterans Benefits", color: "#38bdf8" },
  chronicdisease: { emoji: "🩺", label: "Chronic Disease Planner", color: "#38bdf8" },
  glossary:       { emoji: "📚", label: "Medical Glossary", color: "#a78bfa" },
  hospitalquality:{ emoji: "🏆", label: "Hospital Quality Checker", color: "#34d399" },
  services:       { emoji: "🛠️", label: "All Tools", color: "#10b981" },
};

export default function RelatedTools({ currentTab }) {
  const navigate = useNavigate();
  const tabs = (RELATED[currentTab] || []).slice(0, 4);
  if (tabs.length === 0) return null;

  return (
    <div style={{ marginTop: 40, paddingTop: 28, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
      <div style={{ fontSize: 10, fontWeight: 700, color: "#334155", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 14 }}>
        What to do next
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10 }}>
        {tabs.map((tab) => {
          const m = TOOL_META[tab];
          if (!m) return null;
          return (
            <button
              key={tab}
              onClick={() => navigate(`/${tab}`)}
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: "13px 14px", cursor: "pointer", fontFamily: FONT, display: "flex", alignItems: "center", gap: 10, transition: "all 0.2s", textAlign: "left" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = `${m.color}50`; e.currentTarget.style.background = `${m.color}08`; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.background = "rgba(255,255,255,0.03)"; }}
            >
              <span style={{ fontSize: 20, flexShrink: 0 }}>{m.emoji}</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#f1f5f9", flex: 1, lineHeight: 1.3 }}>{m.label}</span>
              <span style={{ fontSize: 14, color: m.color, flexShrink: 0 }}>→</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
