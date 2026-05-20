'use client';

import { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import Landing from "./Landing";
import About from "./About";
import Privacy from "./Privacy";
import Terms from "./Terms";
import DisputeLetter from "./DisputeLetter";
import DrugComparator from "./DrugComparator";
import DenialFighter from "./DenialFighter";
import NegotiationScript from "./NegotiationScript";
import EOBExplainer from "./EOBExplainer";
import PriorAuthHelper from "./PriorAuthHelper";
import DebtRightsChecker from "./DebtRightsChecker";
import SecondOpinionFinder from "./SecondOpinionFinder";
import GenericDrugFinder from "./GenericDrugFinder";
import ServicesHub from "./ServicesHub";
import InsurancePlanDecoder from "./InsurancePlanDecoder";
import SurpriseBillingChecker from "./SurpriseBillingChecker";
import ItemizationRequest from "./ItemizationRequest";
import CharityCareFinder from "./CharityCareFinder";
import PaymentPlanNegotiator from "./PaymentPlanNegotiator";
import CreditCardWarning from "./CreditCardWarning";
import HSAFSAOptimizer from "./HSAFSAOptimizer";
import ProviderNetworkChecker from "./ProviderNetworkChecker";
import CostEstimator from "./CostEstimator";
import BillScan from "./BillScan";
import CaseTracker from "./CaseTracker";
import SavingsDashboard from "./SavingsDashboard";
import BillVeilConcierge from "./BillVeilConcierge";
import InsurancePlanOptimizer from "./InsurancePlanOptimizer";
import HospitalPriceLookup from "./HospitalPriceLookup";
import CommunityPriceBoard from "./CommunityPriceBoard";
import PersonalFinanceHub from "./PersonalFinanceHub";
import InsuranceFinder from "./InsuranceFinder";
import COBRACalculator from "./COBRACalculator";
import CPTCodeLookup from "./CPTCodeLookup";
import PreventiveCareChecker from "./PreventiveCareChecker";
import ERvsUrgentCare from "./ERvsUrgentCare";
import PatientRightsGuide from "./PatientRightsGuide";
import HIPAARightsGuide from "./HIPAARightsGuide";
import MentalHealthParityChecker from "./MentalHealthParityChecker";
import MedicalTaxCalculator from "./MedicalTaxCalculator";
import FSATracker from "./FSATracker";
import MedicareNavigator from "./MedicareNavigator";
import VeteransBenefitsGuide from "./VeteransBenefitsGuide";
import ChronicDiseasePlanner from "./ChronicDiseasePlanner";
import MedicalGlossary from "./MedicalGlossary";
import HospitalQualityChecker from "./HospitalQualityChecker";
import { useAuth } from "./AuthContext";
import Profile from "./Profile";
import { trackEvent } from "./analytics";
import ErrorBoundary from "./ErrorBoundary";
import NotFound from "./NotFound";
import RelatedTools from "./RelatedTools";
import EmailCapture from "./EmailCapture";
import StoryTeaser from "./StoryTeaser";

const EXAMPLES = [
  "CPT 99214 — $385",
  "ER visit — $4,200",
  "Blood test 80053 — $189",
  "MRI brain scan — $3,800",
  "Tylenol x2 — $45",
];

const FONT = "'Inter', system-ui, sans-serif";

const CSS = `
  * { box-sizing: border-box; margin: 0; padding: 0; }

  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.4; } }

  body { background: #050810; }

  .analyze-btn:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 16px 40px rgba(16,185,129,0.5) !important;
  }
  .analyze-btn:active:not(:disabled) { transform: translateY(0); }

  .chip:hover {
    background: rgba(16,185,129,0.12) !important;
    border-color: rgba(16,185,129,0.3) !important;
    color: #10b981 !important;
  }
  .chip.active {
    background: rgba(16,185,129,0.12) !important;
    border-color: rgba(16,185,129,0.3) !important;
    color: #10b981 !important;
  }

  .result-card { animation: fadeUp 0.35s ease forwards; }

  .reset-btn:hover { background: rgba(255,255,255,0.08) !important; color: #f1f5f9 !important; }

  textarea:focus, input:focus, select:focus { outline: none; border-color: rgba(16,185,129,0.5) !important; box-shadow: 0 0 0 3px rgba(16,185,129,0.08) !important; }

  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 3px; }

  @media (max-width: 640px) {
    .how-grid { grid-template-columns: 1fr !important; }
    .bv-about { display: none !important; }
    .bv-login { display: none !important; }
    .bv-credits { display: none !important; }
    .bv-nav-right { gap: 6px !important; }
  }
`;

const VALID_TABS = ["analyzer", "services", "dispute", "drug", "denial", "negotiate", "eob", "priorauth", "debtrights", "secondopinion", "genericdrug", "insplan", "surprisebill", "itemization", "charitycare", "paymentplan", "creditcard", "hsafsa", "providercheck", "costestimate", "billscan", "casetracker", "savings", "concierge", "planoptimizer", "hospitalprice", "priceboard", "hub", "insurance", "profile", "cobra", "cptlookup", "preventive", "erurgent", "patientrights", "hipaa", "mentalparity", "medtax", "fsatracker", "medicare", "veterans", "chronicdisease", "glossary", "hospitalquality"];

const TABS = [
  { id: "analyzer", emoji: "⚡", label: "Bill Analyzer" },
  { id: "services", emoji: "🛠️", label: "All Tools" },
  { id: "dispute", emoji: "✉️", label: "Dispute" },
  { id: "drug", emoji: "💊", label: "Drug Prices" },
  { id: "denial", emoji: "⚔️", label: "Denial Fighter" },
  { id: "concierge", emoji: "🤖", label: "AI Chat" },
];

export default function AppShell() {
  const { tab } = useParams();
  const router = useRouter();
  const { user, usesLeft, consumeCredit, logout, showLoginModal, initials, emailJustVerified, clearEmailJustVerified } = useAuth();

  const [bill, setBill] = useState(() => {
    if (typeof window === "undefined") return "";
    const saved = sessionStorage.getItem("bv_heroBill");
    if (saved) sessionStorage.removeItem("bv_heroBill");
    return saved || "";
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [tipDismissed] = useState(() => typeof window !== "undefined" && !!sessionStorage.getItem("bv_tip_dismissed"));
  const [tip, setTip] = useState(false);
  const [copied, setCopied] = useState(false);
  const [focused, setFocused] = useState(false);
  const autoAnalyzeRef = useRef(null);
  const accountMenuRef = useRef(null);
  const [showAccountMenu, setShowAccountMenu] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      if (accountMenuRef.current && !accountMenuRef.current.contains(e.target))
        setShowAccountMenu(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (!emailJustVerified) return;
    router.replace("/profile");
  }, [emailJustVerified, router]);

  // Track every tool page visit
  useEffect(() => {
    if (tab && tab !== "admin") trackEvent(user?.uid || null, "tool_viewed", { tool: tab });
  }, [tab, user?.uid]);

  useEffect(() => {
    if (tab !== "analyzer") return;
    const incoming = sessionStorage.getItem("bv_heroBill_pending");
    if (!incoming || incoming === autoAnalyzeRef.current) return;
    autoAnalyzeRef.current = incoming;
    sessionStorage.removeItem("bv_heroBill_pending");
    setBill(incoming);
    if (consumeCredit()) {
      setLoading(true);
      setResult(null);
      setError(null);
      axios.post("/api/analyze", { bill: incoming })
        .then(r => setResult(r.data.result))
        .catch(() => setError("Something went wrong. Please try again."))
        .finally(() => setLoading(false));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  if (!VALID_TABS.includes(tab)) return <NotFound />;

  const analyzeBill = async () => {
    if (!bill.trim()) return;
    if (!consumeCredit()) return;
    setLoading(true);
    setResult(null);
    setError(null);
    try {
      const response = await axios.post("/api/analyze", { bill });
      setResult(response.data.result);
      trackEvent(user?.uid || null, "bill_analyzed", { billLength: bill.length });
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const parseResult = (text) => {
    const sections = [
      { key: "WHAT IS THIS", emoji: "🔍", color: "#60a5fa", label: "What Is This" },
      { key: "FAIR PRICE", emoji: "💰", color: "#34d399", label: "Fair Price" },
      { key: "VERDICT", emoji: "⚖️", color: "#fbbf24", label: "Verdict" },
      { key: "WHY", emoji: "📋", color: "#a78bfa", label: "Why" },
      { key: "WHAT TO DO", emoji: "✅", color: "#34d399", label: "What To Do" },
      { key: "MONEY YOU COULD SAVE", emoji: "💵", color: "#34d399", label: "Money You Could Save" },
    ];

    const clean = text.replace(/\*\*/g, "").replace(/^#{1,3}\s*/gm, "");
    return sections.map((section, i) => {
      const regex = new RegExp(`(?:#{1,3}\\s*)?${section.key}:\\n([\\s\\S]*?)(?=\\n(?:#{1,3}\\s*)?[A-Z][A-Z ]+:|$)`);
      const match = clean.match(regex);
      const raw = match ? match[1].trim() : null;
      if (!raw) return null;
      const content = raw.trim();
      if (!content) return null;

      const isVerdict = section.key === "VERDICT";
      const verdictColor = content.includes("SIGNIFICANTLY OVERCHARGED")
        ? "#f87171" : content.includes("POSSIBLY OVERCHARGED")
        ? "#fbbf24" : "#34d399";
      const verdictBg = content.includes("SIGNIFICANTLY OVERCHARGED")
        ? "rgba(239,68,68,0.08)" : content.includes("POSSIBLY OVERCHARGED")
        ? "rgba(251,191,36,0.08)" : "rgba(52,211,153,0.08)";

      return (
        <div key={section.key} className="result-card" style={{ background: isVerdict ? verdictBg : "rgba(255,255,255,0.03)", border: `1px solid ${isVerdict ? verdictColor + "40" : "rgba(255,255,255,0.08)"}`, borderLeft: `3px solid ${isVerdict ? verdictColor : section.color}`, borderRadius: 12, padding: "20px 24px", marginBottom: 10, animationDelay: `${i * 0.08}s`, animationFillMode: "both" }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: isVerdict ? verdictColor : section.color, letterSpacing: "0.12em", marginBottom: 12, textTransform: "uppercase" }}>
            {section.emoji} {section.label}
          </div>
          {isVerdict ? (
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: verdictColor + "20", border: `1px solid ${verdictColor}50`, color: verdictColor, padding: "8px 20px", borderRadius: 24, fontSize: 14, fontWeight: 800, letterSpacing: "0.04em" }}>
              <span style={{ width: 8, height: 8, background: verdictColor, borderRadius: "50%", display: "inline-block" }} />
              {content}
            </div>
          ) : (
            <div style={{ fontSize: 15, color: "#cbd5e1", lineHeight: 1.8, whiteSpace: "pre-line" }}>{content}</div>
          )}
        </div>
      );
    });
  };

  return (
    <div style={{ minHeight: "100vh", background: "#050810", fontFamily: FONT, color: "#f1f5f9" }}>
      <style>{CSS}</style>

      {emailJustVerified && (
        <div style={{ position: "fixed", top: 16, left: "50%", transform: "translateX(-50%)", zIndex: 200, background: "#0d1f17", border: "1px solid rgba(16,185,129,0.4)", borderRadius: 14, padding: "14px 20px", display: "flex", alignItems: "center", gap: 12, boxShadow: "0 8px 32px rgba(0,0,0,0.5)", minWidth: 280, maxWidth: 420, fontFamily: FONT }}>
          <div style={{ width: 32, height: 32, background: "linear-gradient(135deg, #10b981, #059669)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>✓</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#10b981", marginBottom: 2 }}>Email verified!</div>
            <div style={{ fontSize: 12, color: "#64748b" }}>Your email address has been confirmed.</div>
          </div>
          <button onClick={clearEmailJustVerified} style={{ background: "none", border: "none", color: "#475569", fontSize: 18, cursor: "pointer", padding: "0 4px", lineHeight: 1 }}>×</button>
        </div>
      )}

      <div style={{ position: "sticky", top: 0, zIndex: 10, background: "rgba(5,8,16,0.9)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 20px 6px" }}>
          <button onClick={() => router.push("/")} style={{ display: "flex", alignItems: "center", gap: 10, background: "none", border: "none", cursor: "pointer", padding: 0 }}>
            <div style={{ width: 28, height: 28, background: "linear-gradient(135deg, #10b981, #059669)", borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, boxShadow: "0 0 12px rgba(16,185,129,0.4)" }}>🛡️</div>
            <span style={{ fontSize: 16, fontWeight: 800, letterSpacing: "-0.02em", color: "#f1f5f9", fontFamily: FONT }}>BillVeil</span>
          </button>
          <div className="bv-nav-right" style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button className="bv-about" onClick={() => router.push("/learn")} style={{ background: "none", border: "none", color: "#64748b", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: FONT }}>Case Files</button>
            <button className="bv-about" onClick={() => router.push("/about")} style={{ background: "none", border: "none", color: "#64748b", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: FONT }}>About</button>

            {user ? (
              <div style={{ position: "relative" }} ref={accountMenuRef}>
                <button onClick={() => setShowAccountMenu(!showAccountMenu)} style={{ width: 34, height: 34, borderRadius: "50%", background: "linear-gradient(135deg, #10b981, #059669)", border: "2px solid rgba(16,185,129,0.4)", color: "#fff", fontWeight: 800, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 12px rgba(16,185,129,0.35)" }}>
                  {initials || "👤"}
                </button>
                {showAccountMenu && (
                  <div style={{ position: "absolute", top: 42, right: 0, background: "#0d1526", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: 6, minWidth: 190, boxShadow: "0 16px 40px rgba(0,0,0,0.6)", zIndex: 100 }}>
                    <button onClick={() => { router.push("/profile"); setShowAccountMenu(false); }} style={{ width: "100%", padding: "9px 12px", background: "none", border: "none", color: "#94a3b8", fontSize: 13, fontWeight: 600, cursor: "pointer", textAlign: "left", fontFamily: FONT, borderRadius: 8, display: "block" }}>👤 My Profile</button>
                    <button onClick={() => { logout(); setShowAccountMenu(false); }} style={{ width: "100%", padding: "9px 12px", background: "none", border: "none", color: "#f87171", fontSize: 13, fontWeight: 600, cursor: "pointer", textAlign: "left", fontFamily: FONT, borderRadius: 8, display: "block" }}>Sign Out</button>
                  </div>
                )}
              </div>
            ) : (
              <>
                {usesLeft > 0 && (
                  <div className="bv-credits" style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#10b981", fontWeight: 600, background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.25)", padding: "4px 12px", borderRadius: 20 }}>
                    <span style={{ width: 6, height: 6, background: "#10b981", borderRadius: "50%", animation: "pulse 2s ease-in-out infinite" }} />
                    {usesLeft} {usesLeft === 1 ? "analysis" : "analyses"} left
                  </div>
                )}
                <button className="bv-login" onClick={showLoginModal} style={{ padding: "7px 14px", background: "none", border: "1px solid rgba(255,255,255,0.12)", color: "#94a3b8", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: FONT }}>Log In</button>
                <button onClick={showLoginModal} style={{ padding: "7px 14px", background: "linear-gradient(135deg, #10b981, #059669)", border: "none", color: "#fff", borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: FONT, boxShadow: "0 4px 12px rgba(16,185,129,0.35)" }}>Sign Up →</button>
              </>
            )}
          </div>
        </div>
        <div style={{ display: "flex", gap: 4, padding: "0 12px 10px", overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
          {TABS.map((t) => (
            <button key={t.id} onClick={() => router.push(`/${t.id}`)} style={{ padding: "7px 14px", background: tab === t.id ? "rgba(16,185,129,0.12)" : "transparent", border: `1px solid ${tab === t.id ? "rgba(16,185,129,0.3)" : "rgba(255,255,255,0.07)"}`, borderRadius: 8, color: tab === t.id ? "#10b981" : "#64748b", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: FONT, transition: "all 0.15s", whiteSpace: "nowrap", flexShrink: 0 }}>
              {t.emoji} {t.label}
            </button>
          ))}
        </div>
      </div>

      <EmailCapture trigger={!!result} />

      {tab === "services" && (
        <div style={{ maxWidth: 1400, margin: "0 auto", padding: "28px 24px 48px" }}>
          <ServicesHub />
        </div>
      )}

      <div style={{ maxWidth: 700, margin: "0 auto", padding: "28px 16px 48px" }}>
      <ErrorBoundary>
        {tab === "insplan" && <InsurancePlanDecoder />}
        {tab === "surprisebill" && <SurpriseBillingChecker />}
        {tab === "itemization" && <ItemizationRequest />}
        {tab === "charitycare" && <CharityCareFinder />}
        {tab === "paymentplan" && <PaymentPlanNegotiator />}
        {tab === "creditcard" && <CreditCardWarning />}
        {tab === "hsafsa" && <HSAFSAOptimizer />}
        {tab === "providercheck" && <ProviderNetworkChecker />}
        {tab === "costestimate" && <CostEstimator />}
        {tab === "billscan" && <BillScan />}
        {tab === "casetracker" && <CaseTracker />}
        {tab === "savings" && <SavingsDashboard />}
        {tab === "concierge" && <BillVeilConcierge />}
        {tab === "planoptimizer" && <InsurancePlanOptimizer />}
        {tab === "hospitalprice" && <HospitalPriceLookup />}
        {tab === "priceboard" && <CommunityPriceBoard />}
        {tab === "hub" && <PersonalFinanceHub />}
        {tab === "insurance" && <InsuranceFinder />}
        {tab === "dispute" && <DisputeLetter />}
        {tab === "drug" && <DrugComparator />}
        {tab === "denial" && <DenialFighter />}
        {tab === "negotiate" && <NegotiationScript />}
        {tab === "eob" && <EOBExplainer />}
        {tab === "priorauth" && <PriorAuthHelper />}
        {tab === "debtrights" && <DebtRightsChecker />}
        {tab === "secondopinion" && <SecondOpinionFinder />}
        {tab === "genericdrug" && <GenericDrugFinder />}
        {tab === "profile" && <Profile />}
        {tab === "cobra" && <COBRACalculator />}
        {tab === "cptlookup" && <CPTCodeLookup />}
        {tab === "preventive" && <PreventiveCareChecker />}
        {tab === "erurgent" && <ERvsUrgentCare />}
        {tab === "patientrights" && <PatientRightsGuide />}
        {tab === "hipaa" && <HIPAARightsGuide />}
        {tab === "mentalparity" && <MentalHealthParityChecker />}
        {tab === "medtax" && <MedicalTaxCalculator />}
        {tab === "fsatracker" && <FSATracker />}
        {tab === "medicare" && <MedicareNavigator />}
        {tab === "veterans" && <VeteransBenefitsGuide />}
        {tab === "chronicdisease" && <ChronicDiseasePlanner />}
        {tab === "glossary" && <MedicalGlossary />}
        {tab === "hospitalquality" && <HospitalQualityChecker />}

        {tab !== "analyzer" && tab !== "services" && tab !== "hub" && tab !== "savings" && tab !== "casetracker" && tab !== "profile" && (
          <>
            {/* <StoryTeaser tool={tab} /> — hidden until stories are ready */}
            <RelatedTools currentTab={tab} />
          </>
        )}
      </ErrorBoundary>

        {tab === "analyzer" && <>

        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <h1 style={{ fontSize: "clamp(22px, 6vw, 34px)", fontWeight: 900, lineHeight: 1.15, letterSpacing: "-0.03em", marginBottom: 8, color: "#f1f5f9" }}>
            Is your medical <span style={{ color: "#10b981", textShadow: "0 0 20px rgba(16,185,129,0.4)" }}>bill fair?</span>
          </h1>
          <p style={{ fontSize: "clamp(14px, 3vw, 16px)", color: "#64748b", lineHeight: 1.6, maxWidth: 460, margin: "0 auto 20px" }}>
            Americans overpay <strong style={{ color: "#94a3b8" }}>$935 billion</strong> yearly. Paste your bill and we'll tell you in seconds.
          </p>
          <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap" }}>
            {[{ stat: "$935B", label: "Overpaid yearly" }, { stat: "80%", label: "Bills have errors" }, { stat: "10x", label: "Hospital markups" }].map(({ stat, label }, i) => (
              <div key={stat} style={{ padding: "8px clamp(12px, 4vw, 24px)", borderRight: i < 2 ? "1px solid rgba(255,255,255,0.06)" : "none", textAlign: "center" }}>
                <div style={{ fontSize: "clamp(17px, 5vw, 24px)", fontWeight: 900, color: "#10b981", textShadow: "0 0 16px rgba(16,185,129,0.3)" }}>{stat}</div>
                <div style={{ fontSize: 11, color: "#475569", marginTop: 1 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: "rgba(255,255,255,0.03)", border: focused ? "1px solid rgba(16,185,129,0.4)" : "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 20, marginBottom: 20, boxShadow: focused ? "0 0 0 3px rgba(16,185,129,0.08)" : "none", transition: "all 0.2s" }}>
          <label style={{ fontSize: 11, fontWeight: 700, color: "#475569", display: "block", marginBottom: 10, letterSpacing: "0.06em", textTransform: "uppercase" }}>
            Paste your bill, charge, or CPT code
          </label>
          <textarea
            value={bill}
            onChange={(e) => setBill(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder="e.g. CPT 99214 — $385, or paste your full bill here..."
            style={{ width: "100%", height: 110, padding: 13, border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, fontSize: 14, color: "#f1f5f9", resize: "vertical", fontFamily: FONT, lineHeight: 1.6, background: "rgba(255,255,255,0.04)", boxSizing: "border-box" }}
          />
          <div style={{ marginTop: 12, marginBottom: 16 }}>
            <div style={{ fontSize: 10, fontWeight: 600, color: "#334155", marginBottom: 8, letterSpacing: "0.08em" }}>TRY AN EXAMPLE</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {EXAMPLES.map((ex) => (
                <button key={ex} className={`chip${bill === ex ? " active" : ""}`} onClick={() => setBill(ex)} style={{ padding: "5px 13px", background: "rgba(255,255,255,0.04)", color: "#64748b", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 24, fontSize: 12, fontWeight: 500, cursor: "pointer", transition: "all 0.15s", fontFamily: FONT }}>{ex}</button>
              ))}
            </div>
          </div>
          <button className="analyze-btn" onClick={analyzeBill} disabled={loading || !bill.trim()} style={{ width: "100%", padding: "15px", background: loading || !bill.trim() ? "rgba(255,255,255,0.05)" : "linear-gradient(135deg, #10b981, #059669)", color: loading || !bill.trim() ? "#334155" : "#fff", border: "none", borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: loading || !bill.trim() ? "default" : "pointer", transition: "all 0.2s", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, boxShadow: loading || !bill.trim() ? "none" : "0 8px 28px rgba(16,185,129,0.35)", fontFamily: FONT }}>
            {loading ? (<><span style={{ width: 17, height: 17, border: "2px solid rgba(255,255,255,0.15)", borderTop: "2px solid #10b981", borderRadius: "50%", animation: "spin 0.8s linear infinite", display: "inline-block" }} />Analyzing your bill...</>) : <>⚡ Analyze My Bill</>}
          </button>
        </div>

        {error && <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: 12, padding: 16, color: "#f87171", fontSize: 14, marginBottom: 16 }}>{error}</div>}

        {loading && (
          <div style={{ animation: "fadeUp 0.3s ease" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <div style={{ height: 10, width: 120, background: "rgba(255,255,255,0.06)", borderRadius: 6, animation: "pulse 1.5s ease-in-out infinite" }} />
              <div style={{ height: 28, width: 70, background: "rgba(255,255,255,0.04)", borderRadius: 8 }} />
            </div>
            {[{ w: "45%", lines: 2 }, { w: "60%", lines: 3 }, { w: "35%", lines: 2 }, { w: "55%", lines: 3 }, { w: "50%", lines: 2 }].map((s, i) => (
              <div key={i} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderLeft: "3px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: "20px 24px", marginBottom: 10 }}>
                <div style={{ height: 8, width: s.w, background: "rgba(255,255,255,0.07)", borderRadius: 4, marginBottom: 14, animation: `pulse 1.5s ease-in-out ${i * 0.1}s infinite` }} />
                {Array.from({ length: s.lines }).map((_, j) => (
                  <div key={j} style={{ height: 7, width: j === s.lines - 1 ? "70%" : "100%", background: "rgba(255,255,255,0.05)", borderRadius: 4, marginBottom: 8, animation: `pulse 1.5s ease-in-out ${(i + j) * 0.08}s infinite` }} />
                ))}
              </div>
            ))}
          </div>
        )}

        {!result && !loading && (
          <div style={{ marginTop: 40 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: "#334155", letterSpacing: "0.12em", textAlign: "center", marginBottom: 20 }}>HOW IT WORKS</div>
            <div className="how-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
              {[{ step: "01", title: "Paste your bill", desc: "Any charge, CPT code, or full bill. No formatting needed." }, { step: "02", title: "AI scans it", desc: "We compare against fair market rates and flag every overcharge." }, { step: "03", title: "Fight back", desc: "Get exact steps to dispute, negotiate, or demand a refund." }].map(({ step, title, desc }) => (
                <div key={step} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "20px 16px" }}>
                  <div style={{ fontSize: 26, fontWeight: 900, color: "#10b981", marginBottom: 10, textShadow: "0 0 16px rgba(16,185,129,0.3)" }}>{step}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#f1f5f9", marginBottom: 4 }}>{title}</div>
                  <div style={{ fontSize: 12, color: "#64748b", lineHeight: 1.7 }}>{desc}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {result && (
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: "#334155", letterSpacing: "0.12em" }}>ANALYSIS RESULTS</div>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => { navigator.clipboard.writeText(result); setCopied(true); setTimeout(() => setCopied(false), 2000); }} style={{ fontSize: 12, color: copied ? "#10b981" : "#64748b", background: "rgba(255,255,255,0.04)", border: `1px solid ${copied ? "rgba(16,185,129,0.3)" : "rgba(255,255,255,0.08)"}`, padding: "5px 12px", borderRadius: 8, cursor: "pointer", fontFamily: FONT, transition: "all 0.2s" }}>
                  {copied ? "✓ Copied" : "Copy"}
                </button>
                <ShareButton result={result} />
                <SavePdfButton result={result} bill={bill} />
                <button className="reset-btn" onClick={() => { setResult(null); setBill(""); setTip(false); }} style={{ fontSize: 12, color: "#64748b", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", padding: "5px 12px", borderRadius: 8, cursor: "pointer", fontFamily: FONT, transition: "all 0.2s" }}>← Analyze another</button>
              </div>
            </div>
            {parseResult(result)}
            {/* <StoryTeaser tool="analyzer" /> — hidden until stories are ready */}
            {!tipDismissed && !tip && (
              <div style={{ marginTop: 24, background: "rgba(245,158,11,0.05)", border: "1px solid rgba(245,158,11,0.15)", borderRadius: 16, padding: "24px 20px", position: "relative" }}>
                <button onClick={() => { sessionStorage.setItem("bv_tip_dismissed", "1"); setTip(true); }} style={{ position: "absolute", top: 12, right: 14, background: "none", border: "none", color: "#475569", fontSize: 18, cursor: "pointer", lineHeight: 1 }}>×</button>
                <div style={{ textAlign: "center", marginBottom: 18 }}>
                  <div style={{ fontSize: 24, marginBottom: 8 }}>☕</div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: "#fbbf24", marginBottom: 4 }}>Did BillVeil help you?</div>
                  <div style={{ fontSize: 13, color: "#64748b", lineHeight: 1.6 }}>Any tip goes directly to the developer — no platform fees.</div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  {[
                    { label: "Cash App", handle: "$AsilKamepalli", href: "https://cash.app/$AsilKamepalli", color: "#00d632", bg: "rgba(0,214,50,0.08)", border: "rgba(0,214,50,0.25)" },
                    { label: "PayPal", handle: "AsilKamepalli", href: "https://paypal.me/AsilKamepalli", color: "#009cde", bg: "rgba(0,156,222,0.08)", border: "rgba(0,156,222,0.25)" },
                    { label: "Venmo", handle: "@Asil-Kamepalli", href: "https://venmo.com/u/Asil-Kamepalli", color: "#008cff", bg: "rgba(0,140,255,0.08)", border: "rgba(0,140,255,0.25)" },
                    { label: "Chime", handle: "$Asil-Kamepalli", href: null, color: "#73cf2e", bg: "rgba(115,207,46,0.08)", border: "rgba(115,207,46,0.25)" },
                    { label: "Zelle", handle: "331-226-7117", href: null, color: "#6d1ed4", bg: "rgba(109,30,212,0.08)", border: "rgba(109,30,212,0.25)" },
                  ].map(({ label, handle, href, color, bg, border }) => (
                    href ? (
                      <a key={label} href={href} target="_blank" rel="noopener noreferrer" onClick={() => { sessionStorage.setItem("bv_tip_dismissed", "1"); setTip(true); }}
                        style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "12px 8px", background: bg, border: `1px solid ${border}`, borderRadius: 12, textDecoration: "none", cursor: "pointer" }}>
                        <span style={{ fontSize: 11, fontWeight: 700, color, marginBottom: 2 }}>{label}</span>
                        <span style={{ fontSize: 11, color: "#64748b" }}>{handle}</span>
                      </a>
                    ) : (
                      <button key={label} onClick={() => { navigator.clipboard.writeText(handle); sessionStorage.setItem("bv_tip_dismissed", "1"); setTip(true); }}
                        style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "12px 8px", background: bg, border: `1px solid ${border}`, borderRadius: 12, cursor: "pointer", fontFamily: FONT }}>
                        <span style={{ fontSize: 11, fontWeight: 700, color, marginBottom: 2 }}>{label}</span>
                        <span style={{ fontSize: 11, color: "#64748b" }}>{handle} — tap to copy</span>
                      </button>
                    )
                  ))}
                </div>
              </div>
            )}
            {tip && (
              <div style={{ marginTop: 24, background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: 16, padding: 28, textAlign: "center" }}>
                <div style={{ fontSize: 36, marginBottom: 10 }}>🙏</div>
                <div style={{ fontSize: 18, fontWeight: 800, color: "#10b981", marginBottom: 6 }}>Thank you so much!</div>
                <div style={{ fontSize: 14, color: "#64748b", lineHeight: 1.7 }}>Your support keeps BillVeil running for every American who needs it.</div>
              </div>
            )}
          </div>
        )}

        <div style={{ textAlign: "center", marginTop: 56, paddingTop: 28, borderTop: "1px solid rgba(255,255,255,0.05)", fontSize: 12, color: "#1e293b", lineHeight: 2.2 }}>
          <div>🔒 BillVeil does not store your medical information</div>
          <div>Built for the 330 million Americans who deserve better</div>
        </div>

        </>}
      </div>
    </div>
  );
}

function SavePdfButton({ result, bill }) {
  const save = () => {
    const sections = [
      { key: "WHAT IS THIS", label: "What Is This", color: "#1d4ed8" },
      { key: "FAIR PRICE", label: "Fair Price", color: "#065f46" },
      { key: "VERDICT", label: "Verdict", color: "#92400e" },
      { key: "WHY", label: "Why", color: "#4c1d95" },
      { key: "WHAT TO DO", label: "What To Do", color: "#065f46" },
      { key: "MONEY YOU COULD SAVE", label: "Money You Could Save", color: "#065f46" },
    ];
    const clean = result.replace(/\*\*/g, "").replace(/^#{1,3}\s*/gm, "");
    const parsed = sections.map(s => {
      const m = clean.match(new RegExp(`(?:#{1,3}\\s*)?${s.key}:\\n([\\s\\S]*?)(?=\\n(?:#{1,3}\\s*)?[A-Z][A-Z ]+:|$)`));
      return m ? { ...s, content: m[1].trim() } : null;
    }).filter(Boolean);

    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>BillVeil Analysis</title>
<style>
  body { font-family: Georgia, serif; max-width: 680px; margin: 40px auto; padding: 0 24px; color: #1e293b; }
  .header { border-bottom: 2px solid #10b981; padding-bottom: 16px; margin-bottom: 28px; }
  .logo { font-size: 22px; font-weight: 900; color: #10b981; letter-spacing: -0.02em; }
  .meta { font-size: 11px; color: #64748b; margin-top: 4px; }
  .bill-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px 18px; margin-bottom: 28px; font-family: monospace; font-size: 13px; color: #475569; white-space: pre-wrap; }
  .bill-label { font-size: 10px; font-weight: 700; color: #94a3b8; letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 8px; font-family: Georgia; }
  .section { border-left: 3px solid #10b981; padding: 16px 20px; margin-bottom: 14px; background: #f8fafc; border-radius: 0 8px 8px 0; page-break-inside: avoid; }
  .section-label { font-size: 10px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 8px; }
  .section-content { font-size: 14px; line-height: 1.8; color: #334155; white-space: pre-line; }
  .verdict-pill { display: inline-block; padding: 6px 18px; border-radius: 20px; font-size: 13px; font-weight: 700; letter-spacing: 0.04em; }
  .footer { margin-top: 40px; padding-top: 16px; border-top: 1px solid #e2e8f0; font-size: 11px; color: #94a3b8; line-height: 1.8; }
  @media print { body { margin: 20px; } }
</style></head><body>
<div class="header">
  <div class="logo">🛡️ BillVeil</div>
  <div class="meta">Medical Bill Analysis · ${new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })} · billveil.com</div>
</div>
${bill ? `<div class="bill-label">Bill Analyzed</div><div class="bill-box">${bill.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</div>` : ""}
${parsed.map(s => {
  const isVerdict = s.key === "VERDICT";
  const verdictColor = s.content.includes("SIGNIFICANTLY") ? "#dc2626" : s.content.includes("POSSIBLY") ? "#d97706" : "#059669";
  const verdictBg = s.content.includes("SIGNIFICANTLY") ? "#fef2f2" : s.content.includes("POSSIBLY") ? "#fffbeb" : "#f0fdf4";
  return `<div class="section" style="border-left-color:${s.color}">
  <div class="section-label" style="color:${s.color}">${s.label}</div>
  ${isVerdict
    ? `<div class="verdict-pill" style="background:${verdictBg};color:${verdictColor}">${s.content}</div>`
    : `<div class="section-content">${s.content.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</div>`}
</div>`;
}).join("")}
<div class="footer">
  <strong>Disclaimer:</strong> BillVeil provides informational analysis only. Results are based on Medicare allowable rates and publicly available pricing data. Always consult a healthcare professional or billing advocate for your specific situation.<br>
  BillVeil does not store your bill data. This document was generated locally in your browser.
</div>
</body></html>`;

    const w = window.open("", "_blank");
    w.document.write(html);
    w.document.close();
    w.onload = () => w.print();
  };

  return (
    <button onClick={save} style={{ fontSize: 12, color: "#64748b", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", padding: "5px 12px", borderRadius: 8, cursor: "pointer", fontFamily: "'Inter', system-ui, sans-serif", transition: "all 0.2s" }}>
      Save PDF
    </button>
  );
}

function ShareButton({ result }) {
  const [shared, setShared] = useState(false);

  const buildShareText = () => {
    const clean = result.replace(/\*\*/g, "").replace(/^#{1,3}\s*/gm, "");
    const verdictMatch = clean.match(/VERDICT:\n([\s\S]*?)(?=\n[A-Z][A-Z ]+:|$)/);
    const savingsMatch = clean.match(/MONEY YOU COULD SAVE:\n([\s\S]*?)(?=\n[A-Z][A-Z ]+:|$)/);
    const verdict = verdictMatch ? verdictMatch[1].trim().split("\n")[0] : null;
    const savings = savingsMatch ? savingsMatch[1].trim().split("\n")[0] : null;

    if (verdict?.includes("SIGNIFICANTLY OVERCHARGED")) {
      return `🚨 BillVeil just found I was SIGNIFICANTLY OVERCHARGED on my medical bill.${savings ? `\n\n💰 ${savings}` : ""}\n\nIt's 100% free → billveil.com`;
    } else if (verdict?.includes("POSSIBLY OVERCHARGED")) {
      return `⚠️ BillVeil flagged a possible overcharge on my medical bill.${savings ? `\n\n💰 ${savings}` : ""}\n\nCheck yours free → billveil.com`;
    }
    return `I just checked my medical bill with BillVeil — free AI that finds overcharges and tells you exactly how to fight back.\n\nbillveil.com`;
  };

  const share = async () => {
    const text = buildShareText();
    if (navigator.share) {
      try {
        await navigator.share({ text, url: "https://billveil.com" });
        setShared(true);
        setTimeout(() => setShared(false), 3000);
        return;
      } catch {}
    }
    const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    window.open(tweetUrl, "_blank", "width=600,height=400");
    setShared(true);
    setTimeout(() => setShared(false), 3000);
  };

  return (
    <button
      onClick={share}
      style={{ fontSize: 12, color: shared ? "#10b981" : "#64748b", background: shared ? "rgba(16,185,129,0.08)" : "rgba(255,255,255,0.04)", border: `1px solid ${shared ? "rgba(16,185,129,0.3)" : "rgba(255,255,255,0.08)"}`, padding: "5px 12px", borderRadius: 8, cursor: "pointer", fontFamily: "'Inter', system-ui, sans-serif", transition: "all 0.2s" }}
    >
      {shared ? "✓ Shared!" : "Share"}
    </button>
  );
}
