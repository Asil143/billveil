import { useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import axios from "axios";

const FONT = "'Inter', system-ui, sans-serif";
const IS = { width: "100%", padding: "11px 14px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, fontSize: 14, color: "#f1f5f9", fontFamily: FONT, outline: "none", boxSizing: "border-box" };

const US_STATES = ["AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY","DC"];

// States with own exchanges (vs healthcare.gov)
const STATE_EXCHANGES = { CA:"coveredca.com", CO:"connectforhealthco.com", CT:"accesshealthct.com", DC:"dchealthlink.com", ID:"yourhealthidaho.org", KY:"kynect.ky.gov", MA:"mahealthconnector.org", MD:"marylandhealthconnection.gov", MN:"mnsure.org", NV:"nevadahealthlink.com", NJ:"getcoverednjhealth.gov", NM:"bewellnm.com", NY:"nystateofhealth.ny.gov", PA:"pennie.com", RI:"healthsourceri.com", VT:"healthconnect.vermont.gov", WA:"wahealthplanfinder.org" };

// States that have NOT expanded Medicaid (2024)
const NON_EXPANSION = new Set(["AL","FL","GA","KS","MS","SC","TN","TX","WI","WY"]);

// 2024 Federal Poverty Level
const FPL_TABLE = { 1:14580, 2:19720, 3:24860, 4:30000, 5:35140, 6:40280, 7:45420, 8:50560 };
const getFPL = (n) => n <= 8 ? FPL_TABLE[n] : FPL_TABLE[8] + (n - 8) * 5140;

const SITUATIONS = [
  { value: "employer_yes", label: "My job offers insurance", emoji: "🏢", desc: "Employer plan is available" },
  { value: "employer_no", label: "Job doesn't offer insurance", emoji: "💼", desc: "No employer coverage" },
  { value: "self_employed", label: "Self-employed / freelancer", emoji: "💻", desc: "Work for yourself" },
  { value: "unemployed", label: "Between jobs / unemployed", emoji: "🔍", desc: "Currently without coverage" },
  { value: "retired_under65", label: "Retired (under 65)", emoji: "🌅", desc: "Not yet Medicare-eligible" },
  { value: "age65plus", label: "65 or older", emoji: "⭐", desc: "Medicare-eligible" },
  { value: "student", label: "Student", emoji: "🎓", desc: "In school / on parent plan soon" },
];

const SECTIONS = [
  { key: "COVERAGE RECOMMENDATION", emoji: "🎯", color: "#10b981" },
  { key: "WHY THIS FITS YOU", emoji: "💡", color: "#60a5fa" },
  { key: "WHAT YOU'LL ACTUALLY PAY", emoji: "💰", color: "#34d399" },
  { key: "WHERE TO ENROLL", emoji: "🚀", color: "#fbbf24" },
  { key: "WHAT PLAN TYPE TO LOOK FOR", emoji: "📋", color: "#a78bfa" },
  { key: "WHAT TO LOOK FOR IN A PLAN", emoji: "✅", color: "#60a5fa" },
  { key: "SPECIAL PROGRAMS AVAILABLE", emoji: "⭐", color: "#10b981" },
  { key: "KEY DATES TO KNOW", emoji: "📅", color: "#f87171" },
];

function parseSections(text) {
  return SECTIONS.map((s, i) => {
    const m = text.match(new RegExp(`${s.key}:\\n([\\s\\S]*?)(?=\\n[A-Z][A-Z ']+:|$)`));
    const content = m ? m[1].trim() : null;
    if (!content) return null;
    const isRec = s.key === "COVERAGE RECOMMENDATION";
    return (
      <div key={s.key} style={{ background: isRec ? "rgba(16,185,129,0.05)" : "rgba(255,255,255,0.03)", border: `1px solid ${isRec ? "rgba(16,185,129,0.2)" : "rgba(255,255,255,0.08)"}`, borderLeft: `3px solid ${s.color}`, borderRadius: 12, padding: "16px 20px", marginBottom: 10, animation: "fadeUp 0.35s ease forwards", animationDelay: `${i * 0.06}s`, animationFillMode: "both" }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: s.color, letterSpacing: "0.12em", marginBottom: 8, textTransform: "uppercase" }}>{s.emoji} {s.key}</div>
        <div style={{ fontSize: 14, color: "#cbd5e1", lineHeight: 1.8, whiteSpace: "pre-line" }}>{content}</div>
      </div>
    );
  });
}

// Client-side eligibility determination
function getEligibility(form) {
  const { situation, familySize, income, state, age, numChildren } = form;
  const inc = parseFloat(income) || 0;
  const sz = parseInt(familySize) || 1;
  const ag = parseInt(age) || 30;
  const fpl = getFPL(sz);
  const fplPct = inc > 0 ? (inc / fpl) * 100 : 0;
  const isExpansion = !NON_EXPANSION.has(state);
  const results = [];

  // Medicare
  if (situation === "age65plus" || ag >= 65) {
    results.push({ program: "Medicare", color: "#60a5fa", badge: "You qualify", priority: 1, desc: "Federal health insurance for people 65+. Enroll at medicare.gov within 3 months of your 65th birthday." });
  }

  // Medicaid
  if (ag < 65) {
    if (isExpansion && fplPct > 0 && fplPct <= 138) {
      results.push({ program: "Medicaid", color: "#34d399", badge: "Likely eligible", priority: 1, desc: `At ${Math.round(fplPct)}% FPL, you likely qualify for free Medicaid in ${state}. Apply through your state Medicaid office or healthcare.gov.` });
    } else if (!isExpansion && fplPct > 0 && fplPct < 100) {
      results.push({ program: "Medicaid", color: "#fbbf24", badge: "Check eligibility", priority: 2, desc: `${state} hasn't expanded Medicaid. Eligibility rules are strict — check ${state} Medicaid agency for current rules.` });
    }
  }

  // CHIP for children
  const kids = parseInt(numChildren) || 0;
  if (kids > 0 && fplPct > 0 && fplPct <= 200) {
    results.push({ program: "CHIP (for your children)", color: "#34d399", badge: "Children may qualify", priority: 1, desc: "Children's Health Insurance Program covers kids in families that earn too much for Medicaid but can't afford private insurance. Apply at healthcare.gov." });
  }

  // ACA Marketplace
  if (ag < 65 && situation !== "age65plus" && situation !== "employer_yes") {
    if (fplPct >= 100 || inc === 0) {
      const withSubsidy = fplPct > 0 && fplPct <= 400;
      const highSubsidy = fplPct > 0 && fplPct <= 250;
      results.push({
        program: "ACA Marketplace",
        color: highSubsidy ? "#10b981" : withSubsidy ? "#34d399" : "#60a5fa",
        badge: highSubsidy ? "Strong subsidies available" : withSubsidy ? "Subsidies likely" : "Available",
        priority: highSubsidy ? 1 : 2,
        desc: withSubsidy ? `At ${Math.round(fplPct)}% FPL you may qualify for a Premium Tax Credit to lower your monthly cost. Compare plans at ${STATE_EXCHANGES[state] || "healthcare.gov"}.` : `Compare ACA plans at ${STATE_EXCHANGES[state] || "healthcare.gov"}. Plans available year-round if you have a qualifying life event.`,
      });
    }
  }

  // Employer plan
  if (situation === "employer_yes") {
    results.push({ program: "Employer Plan", color: "#a78bfa", badge: "Available", priority: 2, desc: "Employer plans are often the most cost-effective option since employers pay part of the premium. Compare cost to marketplace plans — sometimes marketplace is cheaper." });
  }

  return { results, fplPct: Math.round(fplPct), fpl };
}

// ACA subsidy estimate
function estimateSubsidy(form) {
  const { income, familySize, age } = form;
  const inc = parseFloat(income) || 0;
  const sz = parseInt(familySize) || 1;
  const ag = parseInt(age) || 35;
  if (!inc) return null;

  const fplPct = (inc / getFPL(sz)) * 100;
  if (fplPct < 100 || fplPct > 600) return null; // no subsidy calculation

  // Estimate benchmark Silver plan premium (national avg, age-adjusted)
  const ageFactor = ag < 30 ? 0.7 : ag < 40 ? 1.0 : ag < 50 ? 1.35 : ag < 60 ? 1.75 : 2.1;
  const spouseAddon = sz >= 2 ? 380 : 0;
  const kidsAddon = Math.min(Math.max(0, sz - 2), 3) * 190;
  const benchmark = Math.round(ageFactor * 450 + spouseAddon + kidsAddon);

  // ACA income cap pct
  let capPct;
  if (fplPct < 150) capPct = 0.0206;
  else if (fplPct < 200) capPct = 0.0309;
  else if (fplPct < 250) capPct = 0.0412;
  else if (fplPct < 300) capPct = 0.0618;
  else if (fplPct < 400) capPct = 0.0978;
  else capPct = 0.0912;

  const maxMonthlyYouPay = Math.round((inc * capPct) / 12);
  const subsidyPerMonth = Math.max(0, benchmark - maxMonthlyYouPay);
  const subsidyPerYear = subsidyPerMonth * 12;

  return { benchmark, maxMonthlyYouPay, subsidyPerMonth, subsidyPerYear, fplPct: Math.round(fplPct) };
}

const EMPTY = { situation: "", familySize: "1", numChildren: "0", income: "", state: "", age: "", healthNeeds: "", medications: "" };

export default function InsuranceFinder() {
  const { consumeCredit, profileData } = useAuth();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(EMPTY);
  const [result, setResult] = useState(null);
  const [eligibility, setEligibility] = useState(null);
  const [subsidy, setSubsidy] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  // Pre-fill from profile
  useEffect(() => {
    if (profileData) {
      setForm(f => ({
        ...f,
        state: profileData.state || f.state,
        age: profileData.dob ? String(Math.floor((Date.now() - new Date(profileData.dob)) / 31557600000)) : f.age,
      }));
    }
  }, [profileData]);

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }));

  const canAdvance = {
    1: !!form.situation,
    2: !!form.familySize && !!form.age,
    3: !!form.income && !!form.state,
    4: true,
  };

  const advance = () => {
    if (step === 3) {
      // Run client-side analysis before step 4
      const elig = getEligibility(form);
      const sub = estimateSubsidy(form);
      setEligibility(elig);
      setSubsidy(sub);
    }
    setStep(s => s + 1);
  };

  const runAI = async () => {
    if (!consumeCredit()) return;
    setLoading(true);
    setResult(null);
    setError(null);
    try {
      const r = await axios.post("/api/tools", {
        tool: "insurancefinder",
        ...form,
        fplPct: eligibility?.fplPct,
        eligiblePrograms: eligibility?.results?.map(r => r.program).join(", "),
        subsidyEstimate: subsidy ? `$${subsidy.subsidyPerMonth}/month ($${subsidy.subsidyPerYear}/year)` : "none calculated",
      });
      setResult(r.data.result);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => { setStep(1); setForm(EMPTY); setResult(null); setEligibility(null); setSubsidy(null); setError(null); };

  // Step progress indicator
  const STEP_LABELS = ["Situation", "Family", "Income & Location", "Health Needs"];

  return (
    <div>
      <div style={{ textAlign: "center", marginBottom: 28 }}>
        <h1 style={{ fontSize: "clamp(22px, 6vw, 32px)", fontWeight: 900, letterSpacing: "-0.03em", marginBottom: 8, color: "#f1f5f9" }}>
          Find your <span style={{ color: "#10b981", textShadow: "0 0 20px rgba(16,185,129,0.4)" }}>best coverage.</span>
        </h1>
        <p style={{ fontSize: 15, color: "#64748b", lineHeight: 1.6, maxWidth: 480, margin: "0 auto" }}>
          Answer 4 quick questions. We'll find what you qualify for, estimate your ACA subsidies, and tell you exactly where to enroll.
        </p>
      </div>

      {step <= 4 && (
        <div style={{ display: "flex", gap: 6, marginBottom: 24, alignItems: "center" }}>
          {STEP_LABELS.map((label, i) => (
            <div key={label} style={{ display: "flex", alignItems: "center", gap: 6, flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, flex: 1 }}>
                <div style={{ width: 22, height: 22, borderRadius: "50%", background: i + 1 < step ? "#10b981" : i + 1 === step ? "rgba(16,185,129,0.2)" : "rgba(255,255,255,0.06)", border: i + 1 === step ? "2px solid #10b981" : "none", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800, color: i + 1 < step ? "#fff" : i + 1 === step ? "#10b981" : "#334155", flexShrink: 0 }}>
                  {i + 1 < step ? "✓" : i + 1}
                </div>
                <span style={{ fontSize: 11, fontWeight: 600, color: i + 1 === step ? "#10b981" : i + 1 < step ? "#475569" : "#334155", display: "none", }}>{label}</span>
              </div>
              {i < STEP_LABELS.length - 1 && <div style={{ flex: 1, height: 1, background: i + 1 < step ? "rgba(16,185,129,0.4)" : "rgba(255,255,255,0.06)" }} />}
            </div>
          ))}
          <span style={{ fontSize: 11, color: "#475569", whiteSpace: "nowrap", marginLeft: 6 }}>Step {step} of 4</span>
        </div>
      )}

      {/* Step 1 — Situation */}
      {step === 1 && (
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 20 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#475569", letterSpacing: "0.08em", marginBottom: 16 }}>STEP 1 — YOUR SITUATION</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: "#f1f5f9", marginBottom: 16 }}>What's your current coverage situation?</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 10 }}>
            {SITUATIONS.map(s => (
              <button
                key={s.value}
                onClick={() => setForm(f => ({ ...f, situation: s.value }))}
                style={{ padding: "14px 16px", background: form.situation === s.value ? "rgba(16,185,129,0.1)" : "rgba(255,255,255,0.03)", border: `1px solid ${form.situation === s.value ? "rgba(16,185,129,0.4)" : "rgba(255,255,255,0.08)"}`, borderRadius: 12, cursor: "pointer", textAlign: "left", fontFamily: FONT, transition: "all 0.15s" }}
              >
                <div style={{ fontSize: 22, marginBottom: 6 }}>{s.emoji}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: form.situation === s.value ? "#10b981" : "#f1f5f9", marginBottom: 2 }}>{s.label}</div>
                <div style={{ fontSize: 11, color: "#475569" }}>{s.desc}</div>
              </button>
            ))}
          </div>
          <button onClick={advance} disabled={!canAdvance[1]} style={{ width: "100%", marginTop: 20, padding: 14, background: canAdvance[1] ? "linear-gradient(135deg, #10b981, #059669)" : "rgba(255,255,255,0.05)", color: canAdvance[1] ? "#fff" : "#334155", border: "none", borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: canAdvance[1] ? "pointer" : "default", fontFamily: FONT }}>
            Continue →
          </button>
        </div>
      )}

      {/* Step 2 — Family */}
      {step === 2 && (
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 20 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#475569", letterSpacing: "0.08em", marginBottom: 16 }}>STEP 2 — YOUR FAMILY</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 16 }}>
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: "#475569", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>Your Age *</label>
              <input type="number" value={form.age} onChange={set("age")} placeholder="e.g. 34" min="0" max="100" style={IS} />
            </div>
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: "#475569", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>Total People Needing Coverage *</label>
              <select value={form.familySize} onChange={set("familySize")} style={{ ...IS, cursor: "pointer" }}>
                {[1,2,3,4,5,6,7,8].map(n => <option key={n} value={n}>{n === 1 ? "Just me" : n === 2 ? "2 people (me + 1)" : `${n} people`}</option>)}
              </select>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: "#475569", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>Children in your household</label>
              <select value={form.numChildren} onChange={set("numChildren")} style={{ ...IS, cursor: "pointer" }}>
                {[0,1,2,3,4,5].map(n => <option key={n} value={n}>{n === 0 ? "No children" : `${n} child${n > 1 ? "ren" : ""}`}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: "#475569", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>Spouse / Partner age <span style={{ fontWeight: 400, textTransform: "none", color: "#334155" }}>optional</span></label>
              <input type="number" value={form.spouseAge || ""} onChange={e => setForm(f => ({ ...f, spouseAge: e.target.value }))} placeholder="e.g. 36" min="0" max="100" style={IS} />
            </div>
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
            <button onClick={() => setStep(1)} style={{ padding: "13px 20px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, color: "#64748b", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: FONT }}>← Back</button>
            <button onClick={advance} disabled={!canAdvance[2]} style={{ flex: 1, padding: 14, background: canAdvance[2] ? "linear-gradient(135deg, #10b981, #059669)" : "rgba(255,255,255,0.05)", color: canAdvance[2] ? "#fff" : "#334155", border: "none", borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: canAdvance[2] ? "pointer" : "default", fontFamily: FONT }}>
              Continue →
            </button>
          </div>
        </div>
      )}

      {/* Step 3 — Income & State */}
      {step === 3 && (
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 20 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#475569", letterSpacing: "0.08em", marginBottom: 16 }}>STEP 3 — INCOME &amp; LOCATION</div>
          <div style={{ background: "rgba(16,185,129,0.04)", border: "1px solid rgba(16,185,129,0.15)", borderRadius: 10, padding: "10px 14px", marginBottom: 16, fontSize: 12, color: "#64748b", lineHeight: 1.6 }}>
            🔒 Your income is only used to estimate your subsidies — it's never stored or shared.
          </div>
          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 11, fontWeight: 700, color: "#475569", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>Annual Household Income *</label>
            <div style={{ position: "relative" }}>
              <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#475569", fontSize: 14 }}>$</span>
              <input type="number" value={form.income} onChange={set("income")} placeholder="e.g. 48000" style={{ ...IS, paddingLeft: 26 }} />
            </div>
            <div style={{ fontSize: 11, color: "#334155", marginTop: 4 }}>Include wages, self-employment, Social Security, investments — all household income before taxes</div>
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 11, fontWeight: 700, color: "#475569", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>Your State *</label>
            <select value={form.state} onChange={set("state")} style={{ ...IS, cursor: "pointer" }}>
              <option value="">Select state...</option>
              {US_STATES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            {form.state && STATE_EXCHANGES[form.state] && (
              <div style={{ fontSize: 11, color: "#10b981", marginTop: 4 }}>✓ {form.state} has its own exchange: {STATE_EXCHANGES[form.state]}</div>
            )}
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={() => setStep(2)} style={{ padding: "13px 20px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, color: "#64748b", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: FONT }}>← Back</button>
            <button onClick={advance} disabled={!canAdvance[3]} style={{ flex: 1, padding: 14, background: canAdvance[3] ? "linear-gradient(135deg, #10b981, #059669)" : "rgba(255,255,255,0.05)", color: canAdvance[3] ? "#fff" : "#334155", border: "none", borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: canAdvance[3] ? "pointer" : "default", fontFamily: FONT }}>
              Continue →
            </button>
          </div>
        </div>
      )}

      {/* Step 4 — Health Needs */}
      {step === 4 && !result && (
        <div>
          {/* Instant eligibility result */}
          {eligibility && (
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: "#475569", letterSpacing: "0.1em", marginBottom: 12 }}>YOUR ELIGIBILITY — INSTANT RESULTS</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
                {eligibility.results.length === 0 ? (
                  <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: "14px 16px", fontSize: 13, color: "#64748b" }}>
                    Enter your income to see eligibility results.
                  </div>
                ) : eligibility.results.sort((a, b) => a.priority - b.priority).map(r => (
                  <div key={r.program} style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${r.color}30`, borderLeft: `3px solid ${r.color}`, borderRadius: 12, padding: "14px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                      <span style={{ fontSize: 14, fontWeight: 800, color: "#f1f5f9" }}>{r.program}</span>
                      <span style={{ fontSize: 10, fontWeight: 700, color: r.color, background: `${r.color}18`, border: `1px solid ${r.color}30`, padding: "2px 8px", borderRadius: 8 }}>{r.badge}</span>
                    </div>
                    <div style={{ fontSize: 12, color: "#64748b", lineHeight: 1.6 }}>{r.desc}</div>
                  </div>
                ))}
              </div>

              {/* Subsidy estimate */}
              {subsidy && subsidy.subsidyPerMonth > 0 && (
                <div style={{ background: "linear-gradient(135deg, rgba(16,185,129,0.08), rgba(5,150,105,0.04))", border: "1px solid rgba(16,185,129,0.25)", borderRadius: 14, padding: "18px 20px", marginBottom: 16 }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: "#10b981", letterSpacing: "0.1em", marginBottom: 12 }}>ACA SUBSIDY ESTIMATE</div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 10 }}>
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontSize: 11, color: "#475569", marginBottom: 4 }}>Benchmark plan cost</div>
                      <div style={{ fontSize: 20, fontWeight: 900, color: "#f87171" }}>${subsidy.benchmark}<span style={{ fontSize: 11, fontWeight: 600 }}>/mo</span></div>
                    </div>
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontSize: 11, color: "#475569", marginBottom: 4 }}>Your max payment</div>
                      <div style={{ fontSize: 20, fontWeight: 900, color: "#fbbf24" }}>${subsidy.maxMonthlyYouPay}<span style={{ fontSize: 11, fontWeight: 600 }}>/mo</span></div>
                    </div>
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontSize: 11, color: "#475569", marginBottom: 4 }}>Your subsidy</div>
                      <div style={{ fontSize: 20, fontWeight: 900, color: "#10b981" }}>${subsidy.subsidyPerMonth}<span style={{ fontSize: 11, fontWeight: 600 }}>/mo</span></div>
                    </div>
                  </div>
                  <div style={{ fontSize: 12, color: "#64748b", lineHeight: 1.6 }}>
                    At {subsidy.fplPct}% of the Federal Poverty Level — estimated <strong style={{ color: "#10b981" }}>${subsidy.subsidyPerYear.toLocaleString()} per year</strong> in subsidies. Actual amount depends on plans in your area. This is an estimate.
                  </div>
                </div>
              )}
              {subsidy && subsidy.subsidyPerMonth === 0 && subsidy.fplPct > 0 && (
                <div style={{ background: "rgba(96,165,250,0.06)", border: "1px solid rgba(96,165,250,0.2)", borderRadius: 12, padding: "12px 16px", marginBottom: 16, fontSize: 13, color: "#60a5fa" }}>
                  At {subsidy.fplPct}% FPL, ACA plans are available but premium subsidies may be limited. Cost-sharing reductions on Silver plans may still apply.
                </div>
              )}

              <div style={{ height: 1, background: "rgba(255,255,255,0.06)", marginBottom: 16 }} />
            </div>
          )}

          <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 20 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#475569", letterSpacing: "0.08em", marginBottom: 16 }}>STEP 4 — HEALTH NEEDS <span style={{ fontWeight: 400, textTransform: "none", color: "#334155" }}>optional — helps personalize your plan</span></div>
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 11, fontWeight: 700, color: "#475569", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>Any health conditions or ongoing care?</label>
              <textarea value={form.healthNeeds} onChange={set("healthNeeds")} placeholder="e.g. Type 2 diabetes, see cardiologist twice a year, expecting a baby, need mental health therapy..." style={{ ...IS, height: 75, resize: "vertical" }} />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 11, fontWeight: 700, color: "#475569", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>Regular medications?</label>
              <input value={form.medications} onChange={set("medications")} placeholder="e.g. Metformin, Lisinopril, birth control, insulin..." style={IS} />
            </div>
            {error && <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: 10, padding: "12px 14px", color: "#f87171", fontSize: 13, marginBottom: 14 }}>{error}</div>}
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setStep(3)} style={{ padding: "13px 20px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, color: "#64748b", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: FONT }}>← Back</button>
              <button onClick={runAI} disabled={loading} style={{ flex: 1, padding: 14, background: loading ? "rgba(255,255,255,0.05)" : "linear-gradient(135deg, #10b981, #059669)", color: loading ? "#334155" : "#fff", border: "none", borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: loading ? "default" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, fontFamily: FONT, boxShadow: loading ? "none" : "0 8px 28px rgba(16,185,129,0.35)" }}>
                {loading ? <><span style={{ width: 17, height: 17, border: "2px solid rgba(255,255,255,0.15)", borderTop: "2px solid #10b981", borderRadius: "50%", animation: "spin 0.8s linear infinite", display: "inline-block" }} />Finding your best plan...</> : "🎯 Get My Personalized Plan"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      {result && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: "#334155", letterSpacing: "0.12em" }}>YOUR INSURANCE PLAN</div>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => { navigator.clipboard.writeText(result); setCopied(true); setTimeout(() => setCopied(false), 2000); }} style={{ fontSize: 12, color: copied ? "#10b981" : "#64748b", background: "rgba(255,255,255,0.04)", border: `1px solid ${copied ? "rgba(16,185,129,0.3)" : "rgba(255,255,255,0.08)"}`, padding: "5px 12px", borderRadius: 8, cursor: "pointer", fontFamily: FONT }}>{copied ? "✓ Copied" : "Copy"}</button>
              <button onClick={reset} style={{ fontSize: 12, color: "#64748b", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", padding: "5px 12px", borderRadius: 8, cursor: "pointer", fontFamily: FONT }}>← Start Over</button>
            </div>
          </div>

          {/* Summary bar */}
          {eligibility && subsidy && subsidy.subsidyPerMonth > 0 && (
            <div style={{ background: "linear-gradient(135deg, rgba(16,185,129,0.08), rgba(5,150,105,0.04))", border: "1px solid rgba(16,185,129,0.25)", borderRadius: 14, padding: "14px 18px", marginBottom: 14, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
              <div style={{ fontSize: 13, color: "#10b981", fontWeight: 700 }}>💰 Estimated subsidy: <strong>${subsidy.subsidyPerMonth}/mo</strong> · You pay ~<strong>${subsidy.maxMonthlyYouPay}/mo</strong> for a Silver plan</div>
              <div style={{ fontSize: 11, color: "#475569" }}>{subsidy.fplPct}% FPL · Estimate only</div>
            </div>
          )}

          {parseSections(result)}

          {/* Marketplace quick links */}
          <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, padding: "16px 20px", marginTop: 16 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: "#334155", letterSpacing: "0.1em", marginBottom: 12 }}>ENROLLMENT RESOURCES</div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {[
                { label: form.state && STATE_EXCHANGES[form.state] ? `${form.state} Exchange` : "ACA Marketplace", url: form.state && STATE_EXCHANGES[form.state] ? `https://${STATE_EXCHANGES[form.state]}` : "https://healthcare.gov", color: "#10b981" },
                { label: "Medicaid / CHIP", url: "https://healthcare.gov/medicaid-chip", color: "#34d399" },
                { label: "Medicare", url: "https://medicare.gov", color: "#60a5fa" },
                { label: "Find a Navigator", url: "https://localhelp.healthcare.gov", color: "#a78bfa" },
              ].map(link => (
                <a key={link.label} href={link.url} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 14px", background: `${link.color}10`, border: `1px solid ${link.color}30`, borderRadius: 10, color: link.color, fontSize: 12, fontWeight: 700, textDecoration: "none", fontFamily: FONT }}>
                  {link.label} →
                </a>
              ))}
            </div>
            <div style={{ marginTop: 10, fontSize: 11, color: "#334155", lineHeight: 1.6 }}>
              Free help available — call 1-800-318-2596 (healthcare.gov) or use localhelp.healthcare.gov to find a certified enrollment navigator in your area.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
