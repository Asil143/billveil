'use client';
import { useState, useMemo } from "react";

const FONT = "'Inter', system-ui, sans-serif";

const TERMS = [
  // Billing Terms
  { term: "Chargemaster (CDM)", category: "Billing", def: "The full list of every service, supply, and medication a hospital charges. These 'list prices' are often 3–10x higher than what anyone actually pays. Always demand a discount from chargemaster prices." },
  { term: "CPT Code", category: "Billing", def: "Current Procedural Terminology — the 5-digit standardized code for every medical procedure. CPT 99214 = a complex office visit; CPT 80053 = comprehensive metabolic panel. Check your bill for these codes." },
  { term: "ICD-10 Code", category: "Billing", def: "International Classification of Diseases code — identifies the diagnosis or reason for the visit. Insurance uses this to decide coverage. A wrong ICD code can cause unnecessary denials." },
  { term: "EOB (Explanation of Benefits)", category: "Billing", def: "Document from your insurer showing what was billed, what they paid, and what you owe. NOT a bill — you should wait for an actual bill from the provider before paying. The EOB is your audit trail." },
  { term: "Balance Billing", category: "Billing", def: "When an out-of-network provider bills you for the difference between their charge and what your insurer paid. Largely banned for emergency care and in-network facility visits by the No Surprises Act (2022)." },
  { term: "Upcoding", category: "Billing", def: "Billing fraud where a provider submits a code for a more expensive service than was actually performed. E.g., billing for a 60-minute complex visit when only 20 minutes occurred. Common and often hard to detect — request your chart notes." },
  { term: "Unbundling", category: "Billing", def: "Billing each component of a procedure separately to generate higher total charges, when guidelines require they be billed together. Also a form of overbilling — check for multiple CPT codes that should be bundled." },
  { term: "Observation Status vs. Inpatient Admission", category: "Billing", def: "Critical distinction for Medicare patients. 'Observation status' means you're technically outpatient even if you sleep in the hospital — affecting what Part B vs. Part A covers and your SNF eligibility. Always ask: 'Am I admitted or under observation?'" },
  { term: "Itemized Bill", category: "Billing", def: "A complete line-by-line breakdown of every charge, showing CPT codes, quantities, and individual prices. You are legally entitled to request one. Studies show 80% of itemized bills contain errors. Always request this before paying." },
  { term: "Facility Fee", category: "Billing", def: "An additional fee charged when your doctor practices at a hospital-owned clinic or outpatient center. These fees can add $100–$500+ to an otherwise routine visit. Ask before scheduling if your doctor is 'hospital-based.'" },
  // Insurance Terms
  { term: "Deductible", category: "Insurance", def: "The amount you pay out-of-pocket before insurance starts paying. E.g., $2,000 deductible means you pay the first $2,000 in covered services each year. Preventive care is typically free before the deductible." },
  { term: "Copay", category: "Insurance", def: "A fixed dollar amount you pay for a covered service (e.g., $30 for a primary care visit). Copays usually don't count toward your deductible but do count toward your out-of-pocket maximum." },
  { term: "Coinsurance", category: "Insurance", def: "Your percentage share of costs after the deductible is met. E.g., 20% coinsurance on a $1,000 claim means you pay $200. This continues until you hit your out-of-pocket maximum." },
  { term: "Out-of-Pocket Maximum", category: "Insurance", def: "The most you'll pay in a plan year for covered services. Once hit, insurance covers 100%. In 2024, the ACA cap is $9,450 individual / $18,900 family for marketplace plans. Does NOT include premiums." },
  { term: "Premium", category: "Insurance", def: "The monthly amount you pay to maintain insurance coverage, regardless of whether you use it. Does NOT count toward your deductible or out-of-pocket maximum." },
  { term: "In-Network vs. Out-of-Network", category: "Insurance", def: "In-network providers have a contract with your insurer and accept negotiated rates. Out-of-network providers can charge whatever they want — you pay far more, and balance billing may apply (with some protections under the No Surprises Act)." },
  { term: "Prior Authorization (Prior Auth)", category: "Insurance", def: "Insurer approval required BEFORE certain procedures, medications, or treatments. Without it, your insurer can deny the claim entirely. Always confirm prior auth requirements in advance. Denials can be appealed." },
  { term: "Step Therapy (Fail First)", category: "Insurance", def: "Policy requiring you to try and 'fail' cheaper treatments before the insurer will approve the recommended one. Commonly used for specialty drugs and mental health. Often overridable with a strong prior auth letter." },
  { term: "Formulary", category: "Insurance", def: "Your insurer's approved list of covered medications, organized into tiers (Tier 1 = cheapest generic, Tier 5 = most expensive specialty). If your drug isn't on the formulary, it may not be covered at all — check before filling." },
  { term: "COBRA", category: "Insurance", def: "Federal law allowing you to continue employer-sponsored health coverage after losing your job — but you pay 100% of the premium plus a 2% admin fee. Expensive but allows continuity of care. Compare vs. ACA marketplace options." },
  { term: "HDHP (High Deductible Health Plan)", category: "Insurance", def: "A plan with a higher deductible ($1,600+ individual in 2024) in exchange for lower monthly premiums. The key benefit: you can open an HSA (Health Savings Account) and save money tax-free for medical expenses." },
  { term: "FSA (Flexible Spending Account)", category: "Insurance", def: "Pre-tax account to pay for eligible medical expenses through your employer. 2024 limit: $3,200. Use-it-or-lose-it rule — up to $640 may roll over. Funds available at start of plan year even before contributed." },
  { term: "HSA (Health Savings Account)", category: "Insurance", def: "Tax-advantaged account for HDHP holders only. Triple tax benefit: pre-tax contributions, tax-free growth, tax-free withdrawals for medical. 2024 limits: $4,150 individual / $8,300 family. Rolls over forever — never expires." },
  { term: "Medigap (Medicare Supplement)", category: "Insurance", def: "Private insurance sold alongside Original Medicare (Parts A & B) to cover gaps like copays, coinsurance, and deductibles. Premiums vary widely. Cannot be used with Medicare Advantage plans." },
  { term: "ACA (Affordable Care Act / Obamacare)", category: "Insurance", def: "2010 law requiring marketplace plans to cover essential health benefits, prohibiting denial based on pre-existing conditions, and allowing children to stay on parents' plan to age 26. Establishes ACA subsidies based on income." },
  // Clinical / Administrative Terms
  { term: "Medicare Rate", category: "Clinical", def: "The amount the federal government pays for a procedure under the Medicare program. Considered a benchmark for fair pricing — most hospital charges are 3–10x the Medicare rate. Use it to evaluate if you're being overcharged." },
  { term: "Explanation of Benefits (EOB) vs. Bill", category: "Clinical", def: "An EOB from your insurer is NOT a bill. It tells you what was filed and what your estimated share is. Wait for an actual bill from the provider before paying — and compare it against your EOB for discrepancies." },
  { term: "Hospital Price Transparency Rule", category: "Clinical", def: "Federal rule (2021) requiring all hospitals to publish a machine-readable file of their prices for every service, including negotiated rates with insurers. Many hospitals don't comply — you can report violations to CMS." },
  { term: "Fair Market Price", category: "Clinical", def: "What a reasonable payer (like Medicare or a well-negotiated insurer) would pay for a service. Resources: Healthcare Bluebook, Fair Health Consumer, CMS hospital data. Use this as your target when negotiating." },
  { term: "Medical Debt Statute of Limitations", category: "Clinical", def: "The window of time a debt collector can sue you over medical debt, varying by state (typically 3–7 years). After this expires, the debt is 'time-barred.' Making a payment or acknowledging the debt in writing can restart the clock." },
  { term: "EMTALA", category: "Clinical", def: "Emergency Medical Treatment and Labor Act — federal law requiring any hospital with an ER that accepts Medicare to screen and stabilize emergency patients regardless of their ability to pay, insurance status, or immigration status." },
  { term: "No Surprises Act (2022)", category: "Clinical", def: "Federal law banning surprise medical bills from out-of-network emergency providers, out-of-network anesthesiologists/radiologists at in-network facilities, and air ambulances. Patients can only be charged in-network cost-sharing rates." },
  { term: "Charity Care / Financial Assistance Policy", category: "Clinical", def: "Every IRS 501(c)(3) nonprofit hospital must have a financial assistance policy (FAP) offering free or discounted care to patients who qualify. They cannot send bills to collections without first screening you for FAP eligibility." },
  { term: "Discharge Planning", category: "Clinical", def: "The process of preparing you to leave the hospital safely. You have the right to a discharge plan, to know your expected discharge date, to appeal a premature discharge, and to have a family member or representative involved." },
];

const CATEGORIES = ["All", "Billing", "Insurance", "Clinical"];
const CATEGORY_COLORS = { Billing: "#fbbf24", Insurance: "#60a5fa", Clinical: "#34d399" };

export default function MedicalGlossary() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return TERMS.filter(t =>
      (category === "All" || t.category === category) &&
      (!q || t.term.toLowerCase().includes(q) || t.def.toLowerCase().includes(q))
    );
  }, [search, category]);

  return (
    <div>
      <div style={{ textAlign: "center", marginBottom: 28 }}>
        <div style={{ fontSize: 36, marginBottom: 10 }}>📚</div>
        <h1 style={{ fontSize: "clamp(20px, 5vw, 28px)", fontWeight: 900, color: "#f1f5f9", marginBottom: 8, letterSpacing: "-0.02em" }}>Medical Billing Glossary</h1>
        <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.6, maxWidth: 460, margin: "0 auto" }}>
          {TERMS.length} terms explained in plain English — billing codes, insurance jargon, and patient rights. Know what you're looking at before you pay.
        </p>
      </div>

      <div style={{ position: "relative", marginBottom: 14 }}>
        <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#475569", fontSize: 16 }}>🔍</span>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search terms (e.g. 'deductible', 'CPT', 'upcoding')" style={{ width: "100%", padding: "12px 14px 12px 40px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, fontSize: 14, color: "#f1f5f9", fontFamily: FONT, boxSizing: "border-box" }} />
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
        {CATEGORIES.map(c => (
          <button key={c} onClick={() => setCategory(c)} style={{ padding: "7px 14px", background: category === c ? "rgba(16,185,129,0.12)" : "rgba(255,255,255,0.04)", border: `1px solid ${category === c ? "rgba(16,185,129,0.3)" : "rgba(255,255,255,0.08)"}`, borderRadius: 20, color: category === c ? "#10b981" : "#64748b", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: FONT }}>
            {c} {c !== "All" && <span style={{ fontSize: 11, opacity: 0.7 }}>({TERMS.filter(t => t.category === c).length})</span>}
          </button>
        ))}
        <div style={{ marginLeft: "auto", fontSize: 12, color: "#334155", display: "flex", alignItems: "center" }}>{filtered.length} terms</div>
      </div>

      {filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: 32, color: "#475569", fontSize: 14 }}>No terms found for "{search}"</div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {filtered.map(t => (
            <div key={t.term} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: "14px 16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#f1f5f9" }}>{t.term}</div>
                <div style={{ fontSize: 10, fontWeight: 700, color: CATEGORY_COLORS[t.category] || "#64748b", background: `${CATEGORY_COLORS[t.category] || "#64748b"}15`, border: `1px solid ${CATEGORY_COLORS[t.category] || "#64748b"}30`, padding: "2px 8px", borderRadius: 20, letterSpacing: "0.06em", whiteSpace: "nowrap", marginLeft: 12, flexShrink: 0 }}>{t.category}</div>
              </div>
              <div style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.75 }}>{t.def}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
