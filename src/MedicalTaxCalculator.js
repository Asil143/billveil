'use client';
import { useState } from "react";

const FONT = "'Inter', system-ui, sans-serif";

const QUALIFIED_EXPENSES = [
  { category: "Doctor & Hospital Visits", items: ["Doctor office visits (copays and out-of-pocket)", "Emergency room visits", "Hospital stays and surgery", "Specialist visits (cardiologist, oncologist, etc.)", "Mental health and therapy sessions", "Inpatient treatment programs"] },
  { category: "Dental & Vision", items: ["Dental treatments (fillings, extractions, crowns)", "Braces and orthodontic treatment", "Prescription eyeglasses and contact lenses", "Eye exams", "LASIK eye surgery", "Hearing aids and batteries"] },
  { category: "Medications & Medical Equipment", items: ["Prescription medications", "Insulin (no prescription required)", "Prescribed over-the-counter medications", "Medical equipment (wheelchair, crutches, CPAP)", "Blood pressure monitors and glucose meters", "Medical alert bracelet/device"] },
  { category: "Mental Health & Addiction", items: ["Psychologist and psychiatrist visits", "Addiction treatment and rehab programs", "In-patient mental health care", "Prescribed psychiatric medications"] },
  { category: "Long-Term Care", items: ["Long-term care insurance premiums (age-based limits)", "Nursing home care (if primarily for medical)", "In-home medical care by a licensed nurse", "Adult day care (if for medical reasons)"] },
  { category: "Other Qualifying Costs", items: ["Ambulance services", "Fertility treatments and IVF", "Guide dog and service animal costs", "Medical mileage to/from appointments ($0.21/mile in 2024)", "Weight-loss programs prescribed for obesity/hypertension (not general wellness)", "Smoking cessation programs (if prescribed)"] },
];

const NOT_QUALIFIED = [
  "Health club / gym memberships (not prescribed)",
  "Cosmetic surgery and procedures",
  "Vitamins and supplements (unless prescribed)",
  "Teeth whitening",
  "Funeral expenses",
  "Electrolysis / hair removal",
  "Illegal drugs or treatments",
  "Maternity clothes",
  "Nursing care for healthy newborn",
  "Health insurance premiums paid with pre-tax dollars (HSA/FSA/employer plan)",
];

export default function MedicalTaxCalculator() {
  const [agi, setAgi] = useState("");
  const [expenses, setExpenses] = useState("");
  const [result, setResult] = useState(null);

  const calculate = () => {
    const agiNum = parseFloat(agi.replace(/,/g, ""));
    const expNum = parseFloat(expenses.replace(/,/g, ""));
    if (!agiNum || !expNum) return;

    const threshold = agiNum * 0.075;
    const deductible = Math.max(0, expNum - threshold);
    const taxSavings25 = deductible * 0.25;
    const taxSavings22 = deductible * 0.22;
    const taxSavings12 = deductible * 0.12;

    setResult({ agiNum, expNum, threshold, deductible, taxSavings25, taxSavings22, taxSavings12 });
  };

  return (
    <div>
      <div style={{ textAlign: "center", marginBottom: 28 }}>
        <div style={{ fontSize: 36, marginBottom: 10 }}>🧾</div>
        <h1 style={{ fontSize: "clamp(20px, 5vw, 28px)", fontWeight: 900, color: "#f1f5f9", marginBottom: 8, letterSpacing: "-0.02em" }}>Medical Tax Deduction Calculator</h1>
        <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.6, maxWidth: 460, margin: "0 auto" }}>
          If your medical expenses exceed 7.5% of your income, the excess is deductible on Schedule A. Find out how much you can deduct.
        </p>
      </div>

      <div style={{ background: "rgba(16,185,129,0.05)", border: "1px solid rgba(16,185,129,0.15)", borderRadius: 14, padding: "14px 18px", marginBottom: 20 }}>
        <div style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.7 }}>
          <strong style={{ color: "#10b981" }}>How it works:</strong> You can only deduct medical expenses that exceed 7.5% of your Adjusted Gross Income (AGI). You must itemize deductions on Schedule A (not take the standard deduction) — worth doing if your total itemized deductions exceed the standard deduction ($14,600 single / $29,200 married filing jointly in 2024).
        </div>
      </div>

      <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 20, marginBottom: 20 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 16 }}>
          <div>
            <label style={{ fontSize: 11, fontWeight: 700, color: "#475569", display: "block", marginBottom: 6, letterSpacing: "0.06em", textTransform: "uppercase" }}>Adjusted Gross Income (AGI)</label>
            <div style={{ position: "relative" }}>
              <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#64748b", fontSize: 14 }}>$</span>
              <input value={agi} onChange={e => setAgi(e.target.value)} type="number" placeholder="65000" min="0" style={{ width: "100%", padding: "10px 12px 10px 24px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, fontSize: 14, color: "#f1f5f9", fontFamily: FONT, boxSizing: "border-box" }} />
            </div>
            <div style={{ fontSize: 11, color: "#334155", marginTop: 4 }}>Line 11 of Form 1040</div>
          </div>
          <div>
            <label style={{ fontSize: 11, fontWeight: 700, color: "#475569", display: "block", marginBottom: 6, letterSpacing: "0.06em", textTransform: "uppercase" }}>Total Medical Expenses Paid</label>
            <div style={{ position: "relative" }}>
              <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#64748b", fontSize: 14 }}>$</span>
              <input value={expenses} onChange={e => setExpenses(e.target.value)} type="number" placeholder="8500" min="0" style={{ width: "100%", padding: "10px 12px 10px 24px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, fontSize: 14, color: "#f1f5f9", fontFamily: FONT, boxSizing: "border-box" }} />
            </div>
            <div style={{ fontSize: 11, color: "#334155", marginTop: 4 }}>Out-of-pocket only, not reimbursed</div>
          </div>
        </div>
        <button onClick={calculate} disabled={!agi || !expenses} style={{ width: "100%", padding: "13px", background: !agi || !expenses ? "rgba(255,255,255,0.05)" : "linear-gradient(135deg, #10b981, #059669)", color: !agi || !expenses ? "#334155" : "#fff", border: "none", borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: !agi || !expenses ? "default" : "pointer", fontFamily: FONT, transition: "all 0.2s" }}>
          🧾 Calculate Deduction
        </button>
      </div>

      {result && (
        <div style={{ animation: "fadeUp 0.35s ease forwards" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 16 }}>
            <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: 16, textAlign: "center" }}>
              <div style={{ fontSize: 11, color: "#64748b", marginBottom: 6 }}>7.5% Threshold</div>
              <div style={{ fontSize: 20, fontWeight: 900, color: "#fbbf24" }}>${Math.round(result.threshold).toLocaleString()}</div>
            </div>
            <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: 16, textAlign: "center" }}>
              <div style={{ fontSize: 11, color: "#64748b", marginBottom: 6 }}>Your Expenses</div>
              <div style={{ fontSize: 20, fontWeight: 900, color: "#f1f5f9" }}>${Math.round(result.expNum).toLocaleString()}</div>
            </div>
            <div style={{ background: result.deductible > 0 ? "rgba(16,185,129,0.08)" : "rgba(248,113,113,0.06)", border: `1px solid ${result.deductible > 0 ? "rgba(16,185,129,0.2)" : "rgba(248,113,113,0.2)"}`, borderRadius: 12, padding: 16, textAlign: "center" }}>
              <div style={{ fontSize: 11, color: "#64748b", marginBottom: 6 }}>Deductible Amount</div>
              <div style={{ fontSize: 20, fontWeight: 900, color: result.deductible > 0 ? "#10b981" : "#f87171" }}>${Math.round(result.deductible).toLocaleString()}</div>
            </div>
          </div>

          {result.deductible > 0 ? (
            <>
              <div style={{ background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: 14, padding: 18, marginBottom: 16 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#10b981", letterSpacing: "0.1em", marginBottom: 12, textTransform: "uppercase" }}>💰 Estimated Tax Savings</div>
                <div style={{ fontSize: 13, color: "#64748b", marginBottom: 10 }}>Your tax savings depend on your marginal tax bracket:</div>
                {[{rate:"12%",val:result.taxSavings12},{rate:"22%",val:result.taxSavings22},{rate:"24–25%",val:result.taxSavings25}].map(b => (
                  <div key={b.rate} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                    <span style={{ fontSize: 13, color: "#94a3b8" }}>{b.rate} tax bracket</span>
                    <span style={{ fontSize: 14, fontWeight: 700, color: "#10b981" }}>~${Math.round(b.val).toLocaleString()} saved</span>
                  </div>
                ))}
              </div>
              <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: 18 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#64748b", letterSpacing: "0.1em", marginBottom: 12, textTransform: "uppercase" }}>Next Steps</div>
                {["Compare your total itemized deductions vs. the standard deduction ($14,600 single / $29,200 married joint in 2024)","Only claim this deduction if itemizing saves you more than the standard deduction","Report deductible medical expenses on Schedule A (Form 1040), Line 1–4","Keep all receipts, EOBs, and Explanation of Benefits statements for 3 years","Do not include amounts reimbursed by insurance, FSA, or HSA"].map((s, i) => (
                  <div key={i} style={{ display: "flex", gap: 12, marginBottom: 8 }}>
                    <div style={{ width: 20, height: 20, background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.3)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: "#10b981", flexShrink: 0 }}>{i + 1}</div>
                    <div style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.65, paddingTop: 2 }}>{s}</div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div style={{ background: "rgba(248,113,113,0.06)", border: "1px solid rgba(248,113,113,0.2)", borderRadius: 14, padding: 18 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#f87171", marginBottom: 8 }}>No Deduction Available</div>
              <div style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.75 }}>
                Your medical expenses (${result.expNum.toLocaleString()}) don't exceed 7.5% of your AGI (${Math.round(result.threshold).toLocaleString()}). You'd need <strong style={{ color: "#f1f5f9" }}>${Math.round(result.threshold - result.expNum).toLocaleString()} more</strong> in qualifying medical expenses to get a deduction.
                <br /><br />
                Consider: if you have upcoming medical procedures, paying them before year-end could push you over the threshold.
              </div>
            </div>
          )}
        </div>
      )}

      <div style={{ marginTop: 28 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#334155", letterSpacing: "0.12em", marginBottom: 16, textTransform: "uppercase" }}>What Qualifies as a Medical Expense?</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {QUALIFIED_EXPENSES.map(cat => (
            <div key={cat.category} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: "14px 16px" }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#10b981", marginBottom: 8 }}>✅ {cat.category}</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4 }}>
                {cat.items.map((item, i) => (
                  <div key={i} style={{ fontSize: 12, color: "#64748b", lineHeight: 1.5 }}>• {item}</div>
                ))}
              </div>
            </div>
          ))}
          <div style={{ background: "rgba(248,113,113,0.04)", border: "1px solid rgba(248,113,113,0.15)", borderRadius: 12, padding: "14px 16px" }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#f87171", marginBottom: 8 }}>❌ Does NOT Qualify</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4 }}>
              {NOT_QUALIFIED.map((item, i) => (
                <div key={i} style={{ fontSize: 12, color: "#64748b", lineHeight: 1.5 }}>• {item}</div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 16, padding: 14, background: "rgba(251,191,36,0.05)", border: "1px solid rgba(251,191,36,0.15)", borderRadius: 10 }}>
        <div style={{ fontSize: 11, color: "#64748b", lineHeight: 1.7 }}>⚠️ This calculator provides estimates only. Consult a tax professional for personalized advice. Tax laws change annually.</div>
      </div>
    </div>
  );
}
