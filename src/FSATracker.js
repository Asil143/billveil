import { useState } from "react";
import { useNavigate } from "react-router-dom";

const FONT = "'Inter', system-ui, sans-serif";

const SPENDING_IDEAS = [
  { category: "Medical & Dental", items: ["Dental cleaning / checkup (~$100–$300)", "Glasses or contacts (~$150–$400)", "Eye exam (~$75–$200)", "Physical therapy session (~$75–$200)", "Chiropractor visit (~$50–$150)", "Specialist copays", "Blood work / lab tests"] },
  { category: "Over-the-Counter Products", items: ["Sunscreen SPF 15+ (eligible since 2020)", "Pain relievers (Tylenol, Advil, etc.)", "Allergy medication (Zyrtec, Claritin)", "Cold/flu medication", "Antacids (Tums, Pepcid)", "First aid supplies", "Menstrual products (pads, tampons, cups)"] },
  { category: "Mental Health", items: ["Therapy / counseling sessions", "Psychiatrist visits", "Mental health medication copays", "Addiction treatment programs"] },
  { category: "Medical Equipment", items: ["Blood pressure monitor (~$25–$80)", "Glucose meter and test strips", "Heating pad / TENS unit", "Compression stockings", "CPAP supplies", "Wheelchair / crutches rental"] },
  { category: "Other Eligible Expenses", items: ["Acupuncture sessions", "Hearing aids and batteries", "Fertility treatments / IVF", "Addiction cessation programs", "Medical transportation / mileage", "Prescribed weight loss program"] },
];

export default function FSATracker() {
  const navigate = useNavigate();
  const [balance, setBalance] = useState("");
  const [deadline, setDeadline] = useState("");
  const [result, setResult] = useState(null);

  const calculate = () => {
    const bal = parseFloat(balance);
    const deadlineDate = new Date(deadline);
    if (!bal || isNaN(deadlineDate)) return;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    deadlineDate.setHours(23, 59, 59, 999);

    const daysLeft = Math.max(0, Math.ceil((deadlineDate - today) / (1000 * 60 * 60 * 24)));
    const dailyNeeded = daysLeft > 0 ? bal / daysLeft : bal;
    const weeklyNeeded = dailyNeeded * 7;

    let urgency, urgencyColor;
    if (daysLeft <= 14) { urgency = "CRITICAL"; urgencyColor = "#f87171"; }
    else if (daysLeft <= 30) { urgency = "URGENT"; urgencyColor = "#fbbf24"; }
    else if (daysLeft <= 60) { urgency = "ACT SOON"; urgencyColor = "#fb923c"; }
    else { urgency = "ON TRACK"; urgencyColor = "#10b981"; }

    setResult({ bal, daysLeft, dailyNeeded, weeklyNeeded, urgency, urgencyColor });
  };

  const today = new Date();
  const defaultDeadline = `${today.getFullYear()}-12-31`;

  return (
    <div>
      <div style={{ textAlign: "center", marginBottom: 28 }}>
        <div style={{ fontSize: 36, marginBottom: 10 }}>⏰</div>
        <h1 style={{ fontSize: "clamp(20px, 5vw, 28px)", fontWeight: 900, color: "#f1f5f9", marginBottom: 8, letterSpacing: "-0.02em" }}>FSA Use-It-or-Lose-It Tracker</h1>
        <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.6, maxWidth: 460, margin: "0 auto" }}>
          Don't let pre-tax dollars expire. Enter your FSA balance and deadline to see exactly how fast you need to spend — and get ideas for eligible expenses.
        </p>
      </div>

      <div style={{ background: "rgba(251,191,36,0.06)", border: "1px solid rgba(251,191,36,0.2)", borderRadius: 14, padding: "14px 18px", marginBottom: 20 }}>
        <div style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.7 }}>
          <strong style={{ color: "#fbbf24" }}>⚠️ FSA "Use-It-or-Lose-It" Rule:</strong> Unlike HSAs, FSA funds expire at year-end (some plans allow a $640 rollover or 2.5-month grace period in 2024). Any unspent balance is forfeited to your employer. Check your plan documents for the exact deadline.
        </div>
      </div>

      <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 20, marginBottom: 20 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 16 }}>
          <div>
            <label style={{ fontSize: 11, fontWeight: 700, color: "#475569", display: "block", marginBottom: 6, letterSpacing: "0.06em", textTransform: "uppercase" }}>Current FSA Balance</label>
            <div style={{ position: "relative" }}>
              <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#64748b", fontSize: 14 }}>$</span>
              <input value={balance} onChange={e => setBalance(e.target.value)} type="number" placeholder="850" min="0" style={{ width: "100%", padding: "10px 12px 10px 24px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, fontSize: 14, color: "#f1f5f9", fontFamily: FONT, boxSizing: "border-box" }} />
            </div>
          </div>
          <div>
            <label style={{ fontSize: 11, fontWeight: 700, color: "#475569", display: "block", marginBottom: 6, letterSpacing: "0.06em", textTransform: "uppercase" }}>Spending Deadline</label>
            <input value={deadline || defaultDeadline} onChange={e => setDeadline(e.target.value)} type="date" style={{ width: "100%", padding: "10px 12px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, fontSize: 14, color: "#f1f5f9", fontFamily: FONT, boxSizing: "border-box", colorScheme: "dark" }} />
          </div>
        </div>
        <button onClick={calculate} disabled={!balance} style={{ width: "100%", padding: "13px", background: !balance ? "rgba(255,255,255,0.05)" : "linear-gradient(135deg, #10b981, #059669)", color: !balance ? "#334155" : "#fff", border: "none", borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: !balance ? "default" : "pointer", fontFamily: FONT, transition: "all 0.2s" }}>
          ⏰ Calculate Spend Rate
        </button>
      </div>

      {result && (
        <div style={{ animation: "fadeUp 0.35s ease forwards", marginBottom: 24 }}>
          <div style={{ background: `${result.urgencyColor}10`, border: `1px solid ${result.urgencyColor}30`, borderLeft: `3px solid ${result.urgencyColor}`, borderRadius: 14, padding: "18px 20px", marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: result.urgencyColor, letterSpacing: "0.12em", textTransform: "uppercase" }}>Status: {result.urgency}</div>
              <div style={{ fontSize: 11, color: "#64748b" }}>{result.daysLeft} days remaining</div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 22, fontWeight: 900, color: "#f1f5f9" }}>${result.bal.toLocaleString()}</div>
                <div style={{ fontSize: 11, color: "#64748b" }}>Balance to spend</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 22, fontWeight: 900, color: result.urgencyColor }}>${Math.ceil(result.dailyNeeded)}</div>
                <div style={{ fontSize: 11, color: "#64748b" }}>Per day needed</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 22, fontWeight: 900, color: result.urgencyColor }}>${Math.ceil(result.weeklyNeeded)}</div>
                <div style={{ fontSize: 11, color: "#64748b" }}>Per week needed</div>
              </div>
            </div>
          </div>

          {result.daysLeft <= 30 && (
            <div style={{ background: "rgba(248,113,113,0.06)", border: "1px solid rgba(248,113,113,0.2)", borderRadius: 12, padding: 16, marginBottom: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#f87171", marginBottom: 8 }}>🚨 Fast Spending Ideas — Do These First</div>
              {["Schedule overdue dental work (cleaning, fillings)", "Order prescription eyeglasses or contacts online", "Buy a blood pressure monitor or glucose meter", "Stock up on eligible OTC items (allergy meds, sunscreen, pain relievers)", "Pre-pay for upcoming therapy or specialist appointments", "Buy a year's worth of contact lens solution and supplies"].map((s, i) => (
                <div key={i} style={{ display: "flex", gap: 8, marginBottom: 5 }}><span style={{ color: "#f87171" }}>→</span><span style={{ fontSize: 13, color: "#94a3b8" }}>{s}</span></div>
              ))}
            </div>
          )}
        </div>
      )}

      <div>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#334155", letterSpacing: "0.12em", marginBottom: 16, textTransform: "uppercase" }}>Eligible FSA Expenses — Spending Ideas</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {SPENDING_IDEAS.map(cat => (
            <div key={cat.category} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: "14px 16px" }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#10b981", marginBottom: 8 }}>✅ {cat.category}</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4 }}>
                {cat.items.map((item, i) => (
                  <div key={i} style={{ fontSize: 12, color: "#64748b", lineHeight: 1.5 }}>• {item}</div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginTop: 20, display: "flex", gap: 10 }}>
        <button onClick={() => navigate("/hsafsa")} style={{ flex: 1, padding: "11px", background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)", color: "#10b981", borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: FONT }}>HSA / FSA Optimizer →</button>
        <button onClick={() => navigate("/medtax")} style={{ flex: 1, padding: "11px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#64748b", borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: FONT }}>Medical Tax Calculator</button>
      </div>
    </div>
  );
}
