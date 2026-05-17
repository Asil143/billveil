import { useState } from "react";
import { useNavigate } from "react-router-dom";

const FONT = "'Inter', system-ui, sans-serif";

const FPL_2024 = { 1: 15060, 2: 20440, 3: 25820, 4: 31200, 5: 36580, 6: 41960, 7: 47340, 8: 52720 };
const fpl = (n) => n <= 8 ? FPL_2024[n] : FPL_2024[8] + (n - 8) * 5380;

const acaCap = (fplPct) => {
  if (fplPct < 150) return 0;
  if (fplPct < 200) return 0 + 0.02 * (fplPct - 150) / 50;
  if (fplPct < 250) return 0.02 + 0.02 * (fplPct - 200) / 50;
  if (fplPct < 300) return 0.04 + 0.02 * (fplPct - 250) / 50;
  if (fplPct < 400) return 0.06 + 0.025 * (fplPct - 300) / 100;
  return 0.0912;
};

const NON_EXPANSION = new Set(["AL", "FL", "GA", "KS", "MS", "SC", "TN", "TX", "WI", "WY"]);

const STATES = ["AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY","DC"];

export default function COBRACalculator() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ cobraPremium: "", income: "", familySize: "1", state: "", months: "6" });
  const [result, setResult] = useState(null);

  const upd = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const calculate = () => {
    const cobra = parseFloat(form.cobraPremium);
    const income = parseFloat(form.income);
    const months = parseInt(form.months);
    const n = parseInt(form.familySize);
    const state = form.state.toUpperCase();
    if (!cobra || !income || !n) return;

    const povertyLine = fpl(n);
    const fplPct = (income / povertyLine) * 100;
    const capPct = acaCap(fplPct);
    const maxMonthlyACA = (income * capPct) / 12;
    const cobraTotal = cobra * months;
    const acaTotal = maxMonthlyACA * months;
    const savings = cobraTotal - acaTotal;
    const medicaidEligible = fplPct <= 138 && !NON_EXPANSION.has(state);
    const chipEligible = n >= 2 && fplPct <= 200;

    let recommendation, recommendationColor;
    if (medicaidEligible) {
      recommendation = "You likely qualify for FREE Medicaid. Skip COBRA — apply at your state's Medicaid office immediately. Losing job coverage is an automatic qualifying event, so you're eligible to enroll right now.";
      recommendationColor = "#34d399";
    } else if (fplPct < 400 && maxMonthlyACA < cobra) {
      recommendation = `ACA Marketplace coverage would save you ~$${Math.round(savings / months).toLocaleString()}/month ($${Math.round(savings).toLocaleString()} total over ${months} months). Visit Healthcare.gov now — job loss is a special enrollment event giving you 60 days.`;
      recommendationColor = "#10b981";
    } else {
      recommendation = "COBRA may be your most cost-effective option at your income level. Consider COBRA especially if you're mid-treatment, near your deductible, or need to keep specific providers. Run the numbers on Healthcare.gov to confirm.";
      recommendationColor = "#fbbf24";
    }

    setResult({ cobra, income, months, n, fplPct, maxMonthlyACA, cobraTotal, acaTotal, savings, medicaidEligible, chipEligible, recommendation, recommendationColor, state, capPct });
  };

  const inputStyle = { width: "100%", padding: "10px 12px 10px 28px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, fontSize: 14, color: "#f1f5f9", fontFamily: FONT, boxSizing: "border-box" };
  const selectStyle = { width: "100%", padding: "10px 12px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, fontSize: 14, color: "#f1f5f9", fontFamily: FONT, cursor: "pointer", boxSizing: "border-box" };
  const labelStyle = { fontSize: 11, fontWeight: 700, color: "#475569", display: "block", marginBottom: 6, letterSpacing: "0.06em", textTransform: "uppercase" };

  return (
    <div>
      <div style={{ textAlign: "center", marginBottom: 28 }}>
        <div style={{ fontSize: 36, marginBottom: 10 }}>🧮</div>
        <h1 style={{ fontSize: "clamp(20px, 5vw, 28px)", fontWeight: 900, color: "#f1f5f9", marginBottom: 8, letterSpacing: "-0.02em" }}>COBRA vs. Marketplace</h1>
        <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.6, maxWidth: 460, margin: "0 auto" }}>
          Lost your job? Find out if free or subsidized coverage beats your COBRA premium — most people can save hundreds per month.
        </p>
      </div>

      <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 20, marginBottom: 20 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
          <div>
            <label style={labelStyle}>Monthly COBRA Premium</label>
            <div style={{ position: "relative" }}>
              <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#64748b", fontSize: 14 }}>$</span>
              <input value={form.cobraPremium} onChange={e => upd("cobraPremium", e.target.value)} placeholder="850" type="number" min="0" style={inputStyle} />
            </div>
          </div>
          <div>
            <label style={labelStyle}>Annual Household Income</label>
            <div style={{ position: "relative" }}>
              <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#64748b", fontSize: 14 }}>$</span>
              <input value={form.income} onChange={e => upd("income", e.target.value)} placeholder="45000" type="number" min="0" style={inputStyle} />
            </div>
          </div>
          <div>
            <label style={labelStyle}>Household Size</label>
            <select value={form.familySize} onChange={e => upd("familySize", e.target.value)} style={selectStyle}>
              {[1,2,3,4,5,6,7,8].map(n => <option key={n} value={n} style={{ background: "#0d1526" }}>{n} {n === 1 ? "person" : "people"}</option>)}
            </select>
          </div>
          <div>
            <label style={labelStyle}>State</label>
            <select value={form.state} onChange={e => upd("state", e.target.value)} style={selectStyle}>
              <option value="" style={{ background: "#0d1526" }}>Select state...</option>
              {STATES.map(s => <option key={s} value={s} style={{ background: "#0d1526" }}>{s}</option>)}
            </select>
          </div>
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={labelStyle}>How many months do you need coverage?</label>
          <div style={{ display: "flex", gap: 8 }}>
            {["1","3","6","12","18"].map(m => (
              <button key={m} onClick={() => upd("months", m)} style={{ flex: 1, padding: "8px 4px", background: form.months === m ? "rgba(16,185,129,0.12)" : "rgba(255,255,255,0.04)", border: `1px solid ${form.months === m ? "rgba(16,185,129,0.3)" : "rgba(255,255,255,0.08)"}`, borderRadius: 8, color: form.months === m ? "#10b981" : "#64748b", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: FONT }}>{m}mo</button>
            ))}
          </div>
        </div>

        <button onClick={calculate} disabled={!form.cobraPremium || !form.income} style={{ width: "100%", padding: "13px", background: !form.cobraPremium || !form.income ? "rgba(255,255,255,0.05)" : "linear-gradient(135deg, #10b981, #059669)", color: !form.cobraPremium || !form.income ? "#334155" : "#fff", border: "none", borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: !form.cobraPremium || !form.income ? "default" : "pointer", fontFamily: FONT, transition: "all 0.2s" }}>
          🧮 Calculate My Options
        </button>
      </div>

      {result && (
        <div style={{ animation: "fadeUp 0.35s ease forwards" }}>
          <div style={{ background: `${result.recommendationColor}10`, border: `1px solid ${result.recommendationColor}30`, borderLeft: `3px solid ${result.recommendationColor}`, borderRadius: 14, padding: "18px 20px", marginBottom: 16 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: result.recommendationColor, letterSpacing: "0.12em", marginBottom: 8, textTransform: "uppercase" }}>🏆 Recommendation</div>
            <div style={{ fontSize: 14, color: "#cbd5e1", lineHeight: 1.75 }}>{result.recommendation}</div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
            <div style={{ background: "rgba(248,113,113,0.06)", border: "1px solid rgba(248,113,113,0.2)", borderRadius: 14, padding: 18 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#f87171", letterSpacing: "0.1em", marginBottom: 12, textTransform: "uppercase" }}>COBRA</div>
              <div style={{ fontSize: 28, fontWeight: 900, color: "#f1f5f9", marginBottom: 4 }}>${Math.round(result.cobra).toLocaleString()}<span style={{ fontSize: 14, color: "#64748b", fontWeight: 400 }}>/mo</span></div>
              <div style={{ fontSize: 12, color: "#64748b", marginBottom: 12 }}>Full premium + 2% admin fee</div>
              <div style={{ fontSize: 13, color: "#94a3b8", background: "rgba(255,255,255,0.04)", borderRadius: 8, padding: "8px 12px" }}>
                {result.months} months total:<br />
                <strong style={{ color: "#f87171", fontSize: 15 }}>${Math.round(result.cobraTotal).toLocaleString()}</strong>
              </div>
            </div>

            <div style={{ background: result.medicaidEligible ? "rgba(52,211,153,0.06)" : "rgba(16,185,129,0.06)", border: `1px solid ${result.medicaidEligible ? "rgba(52,211,153,0.2)" : "rgba(16,185,129,0.2)"}`, borderRadius: 14, padding: 18 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#10b981", letterSpacing: "0.1em", marginBottom: 12, textTransform: "uppercase" }}>{result.medicaidEligible ? "Medicaid (Free)" : "ACA Marketplace"}</div>
              {result.medicaidEligible ? (
                <>
                  <div style={{ fontSize: 28, fontWeight: 900, color: "#34d399", marginBottom: 4 }}>$0<span style={{ fontSize: 14, color: "#64748b", fontWeight: 400 }}>/mo</span></div>
                  <div style={{ fontSize: 12, color: "#64748b", marginBottom: 12 }}>Free at {Math.round(result.fplPct)}% FPL</div>
                  <div style={{ fontSize: 13, color: "#94a3b8", background: "rgba(255,255,255,0.04)", borderRadius: 8, padding: "8px 12px" }}>
                    {result.months} months total:<br />
                    <strong style={{ color: "#34d399", fontSize: 15 }}>$0</strong>
                  </div>
                </>
              ) : (
                <>
                  <div style={{ fontSize: 28, fontWeight: 900, color: "#f1f5f9", marginBottom: 4 }}>~${Math.round(result.maxMonthlyACA).toLocaleString()}<span style={{ fontSize: 14, color: "#64748b", fontWeight: 400 }}>/mo</span></div>
                  <div style={{ fontSize: 12, color: "#64748b", marginBottom: 12 }}>Max at {Math.round(result.fplPct)}% FPL ({(result.capPct * 100).toFixed(1)}% of income)</div>
                  <div style={{ fontSize: 13, color: "#94a3b8", background: "rgba(255,255,255,0.04)", borderRadius: 8, padding: "8px 12px" }}>
                    {result.months} months total:<br />
                    <strong style={{ color: result.acaTotal < result.cobraTotal ? "#10b981" : "#fbbf24", fontSize: 15 }}>${Math.round(result.acaTotal).toLocaleString()}</strong>
                  </div>
                </>
              )}
            </div>
          </div>

          {(result.savings > 0 || result.medicaidEligible) && (
            <div style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: 12, padding: "14px 18px", marginBottom: 16, textAlign: "center" }}>
              <div style={{ fontSize: 12, color: "#64748b", marginBottom: 2 }}>Potential savings by switching</div>
              <div style={{ fontSize: 30, fontWeight: 900, color: "#10b981" }}>${result.medicaidEligible ? Math.round(result.cobraTotal).toLocaleString() : Math.round(result.savings).toLocaleString()}</div>
              <div style={{ fontSize: 12, color: "#64748b" }}>over {result.months} months (~${result.medicaidEligible ? Math.round(result.cobra) : Math.round(result.savings / result.months)}/month)</div>
            </div>
          )}

          <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: 18, marginBottom: 16 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#64748b", letterSpacing: "0.12em", marginBottom: 14, textTransform: "uppercase" }}>Next Steps</div>
            {(result.medicaidEligible ? [
              "Apply for Medicaid immediately at your state's benefits portal — job loss is an automatic qualifying event",
              "You have 60 days from job loss to enroll without penalty",
              "You don't need to elect COBRA first — go straight to Medicaid",
              result.chipEligible ? "Children in your household may qualify for CHIP even if you don't qualify for Medicaid" : null,
            ] : [
              "You have 60 days from job loss to enroll in an ACA marketplace plan (special enrollment period)",
              "Visit Healthcare.gov (or your state's exchange) to compare actual subsidized plans in your county",
              "The ACA cost shown is a cap estimate — actual subsidized plans near you may cost even less",
              "If you're mid-treatment: COBRA keeps your exact plan and providers — factor that into your decision",
              "Consider CHIP if you have children under 19 — often free up to 200–300% FPL",
            ]).filter(Boolean).map((s, i) => (
              <div key={i} style={{ display: "flex", gap: 12, marginBottom: 10 }}>
                <div style={{ width: 22, height: 22, background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.3)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#10b981", flexShrink: 0 }}>{i + 1}</div>
                <div style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.65, paddingTop: 2 }}>{s}</div>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
            <button onClick={() => navigate("/insurance")} style={{ flex: 1, padding: "11px", background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.25)", color: "#10b981", borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: FONT }}>Find All Insurance Options →</button>
            <button onClick={() => navigate("/services")} style={{ padding: "11px 16px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#64748b", borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: FONT }}>All Tools</button>
          </div>

          <div style={{ padding: 14, background: "rgba(251,191,36,0.05)", border: "1px solid rgba(251,191,36,0.15)", borderRadius: 10 }}>
            <div style={{ fontSize: 11, color: "#64748b", lineHeight: 1.7 }}>⚠️ <strong style={{ color: "#94a3b8" }}>Disclaimer:</strong> ACA costs are estimated from 2024 FPL data and income cap percentages. Actual marketplace premiums vary by county, age, plan tier, and insurer. Always verify final costs at Healthcare.gov or with a certified navigator before making a decision.</div>
          </div>
        </div>
      )}
    </div>
  );
}
