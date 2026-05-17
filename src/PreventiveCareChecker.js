import { useState, useMemo } from "react";

const FONT = "'Inter', system-ui, sans-serif";

const SERVICES = [
  // Cancer Screenings
  { name: "Colorectal Cancer Screening", minAge: 45, maxAge: 75, sex: ["M","F"], category: "Cancer Screenings", frequency: "Varies by test", notes: "Colonoscopy every 10 years; annual stool test; or CT colonography every 5 years.", icon: "🔬" },
  { name: "Breast Cancer Screening (Mammography)", minAge: 40, maxAge: 74, sex: ["F"], category: "Cancer Screenings", frequency: "Every 1–2 years", notes: "USPSTF recommends starting at 40; more frequent or earlier if high risk or strong family history.", icon: "🔬" },
  { name: "Cervical Cancer Screening (Pap Smear)", minAge: 21, maxAge: 65, sex: ["F"], category: "Cancer Screenings", frequency: "Every 3 years (or 5 with HPV co-test)", notes: "Can stop after 65 with history of normal results and no history of high-grade lesion.", icon: "🔬" },
  { name: "Lung Cancer Screening (Low-dose CT)", minAge: 50, maxAge: 80, sex: ["M","F"], category: "Cancer Screenings", frequency: "Annually", notes: "Only for current or former heavy smokers (20+ pack-years, quit within 15 years).", icon: "🔬", smokerOnly: true },
  { name: "Skin Cancer Counseling", minAge: 6, maxAge: 24, sex: ["M","F"], category: "Cancer Screenings", frequency: "As needed", notes: "Counseling on minimizing UV exposure for fair-skinned patients ages 6 months–24 years.", icon: "☀️" },
  // Heart & Metabolic
  { name: "Blood Pressure Screening", minAge: 18, maxAge: 999, sex: ["M","F"], category: "Heart & Metabolic", frequency: "Every 1–2 years if normal", notes: "More frequent if elevated. Hypertension screening is one of the most important preventive measures.", icon: "❤️" },
  { name: "Cholesterol / Lipid Screening", minAge: 21, maxAge: 999, sex: ["M","F"], category: "Heart & Metabolic", frequency: "Every 5 years", notes: "Sooner for those with risk factors (diabetes, smoking, family history, obesity).", icon: "🩸" },
  { name: "Diabetes (Type 2) Screening", minAge: 35, maxAge: 70, sex: ["M","F"], category: "Heart & Metabolic", frequency: "Every 3 years", notes: "For overweight or obese adults. Earlier if high risk. Includes prediabetes screening.", icon: "🩸" },
  { name: "Obesity / Weight Screening & Counseling", minAge: 6, maxAge: 999, sex: ["M","F"], category: "Heart & Metabolic", frequency: "At every well visit", notes: "BMI calculation. Intensive behavioral counseling referral if obese.", icon: "📏" },
  { name: "Aspirin for CVD Prevention (discussion)", minAge: 40, maxAge: 59, sex: ["M","F"], category: "Heart & Metabolic", frequency: "One-time discussion", notes: "For adults 40–59 with 10%+ 10-year cardiovascular risk. Discuss with your doctor — not for everyone.", icon: "💊" },
  // Mental Health
  { name: "Depression Screening", minAge: 12, maxAge: 999, sex: ["M","F"], category: "Mental Health", frequency: "Annually", notes: "PHQ-2 or PHQ-9 questionnaire at your annual visit. Free under ACA preventive care.", icon: "🧠" },
  { name: "Anxiety Screening", minAge: 8, maxAge: 65, sex: ["F"], category: "Mental Health", frequency: "Annually", notes: "GAD-7 questionnaire. ACA mandates free coverage for anxiety screening for women and adolescents.", icon: "🧠" },
  { name: "Suicide Risk Screening", minAge: 12, maxAge: 999, sex: ["M","F"], category: "Mental Health", frequency: "Annually", notes: "ASQ (Ask Suicide-Screening Questions). Recommended for adolescents and adults in primary care.", icon: "🧠" },
  // Infections & STIs
  { name: "HIV Screening", minAge: 15, maxAge: 65, sex: ["M","F"], category: "Infections & STIs", frequency: "At least once", notes: "All adults 15–65 regardless of risk. More frequent testing if higher risk.", icon: "🦠" },
  { name: "Hepatitis C Screening", minAge: 18, maxAge: 79, sex: ["M","F"], category: "Infections & STIs", frequency: "Once (more if ongoing risk)", notes: "One-time test for adults 18–79. Born 1945–1965: definitely get tested.", icon: "🦠" },
  { name: "Hepatitis B Screening", minAge: 18, maxAge: 999, sex: ["M","F"], category: "Infections & STIs", frequency: "Once if at risk", notes: "For adults at increased risk of infection. Also recommended for pregnant women.", icon: "🦠" },
  { name: "STI Screening (Chlamydia & Gonorrhea)", minAge: 15, maxAge: 24, sex: ["F"], category: "Infections & STIs", frequency: "Annually", notes: "Sexually active women under 25. Older women at increased risk should also be screened.", icon: "🦠" },
  { name: "Syphilis Screening", minAge: 15, maxAge: 999, sex: ["M","F"], category: "Infections & STIs", frequency: "As appropriate", notes: "For adults and adolescents at increased risk.", icon: "🦠" },
  // Bone Health
  { name: "Osteoporosis Screening (DEXA)", minAge: 65, maxAge: 999, sex: ["F"], category: "Bone Health", frequency: "Every 1–2 years", notes: "Women 65+. Younger women at higher risk (low body weight, smoker, family history) may qualify sooner.", icon: "🦴" },
  // Pregnancy & Women's Health
  { name: "Gestational Diabetes Screening", minAge: 24, maxAge: 50, sex: ["F"], category: "Women's Health", frequency: "During pregnancy", notes: "Screening at 24–28 weeks gestation. Free under ACA for all pregnant women.", icon: "🤰" },
  { name: "BRCA Risk Assessment", minAge: 18, maxAge: 999, sex: ["F"], category: "Women's Health", frequency: "Once (if family history)", notes: "Counseling and BRCA genetic testing if personal or family history suggests increased risk.", icon: "🧬" },
  { name: "Well-Woman Annual Exam", minAge: 18, maxAge: 999, sex: ["F"], category: "Women's Health", frequency: "Annually", notes: "Full preventive visit — includes pelvic exam, counseling, and all age-appropriate screenings.", icon: "🏥" },
  // Men's Health
  { name: "Abdominal Aortic Aneurysm Screening", minAge: 65, maxAge: 75, sex: ["M"], category: "Men's Health", frequency: "Once", notes: "One-time ultrasound for men aged 65–75 who have ever smoked (≥100 cigarettes lifetime).", icon: "❤️", smokerOnly: true },
  // Lifestyle & Preventive
  { name: "Tobacco Cessation Counseling", minAge: 18, maxAge: 999, sex: ["M","F"], category: "Lifestyle", frequency: "At every visit (if smoker)", notes: "Free counseling sessions — up to 8 sessions per year covered under ACA for tobacco users.", icon: "🚭", smokerOnly: true },
  { name: "Alcohol Misuse Screening & Counseling", minAge: 18, maxAge: 999, sex: ["M","F"], category: "Lifestyle", frequency: "Annually", notes: "AUDIT-C questionnaire. Brief counseling if positive. Completely free under ACA.", icon: "🍺" },
  { name: "Healthy Diet & Physical Activity Counseling", minAge: 18, maxAge: 999, sex: ["M","F"], category: "Lifestyle", frequency: "As appropriate", notes: "For adults with cardiovascular disease risk factors. Intensive behavioral counseling covered.", icon: "🥗" },
  { name: "Vision Screening", minAge: 0, maxAge: 5, sex: ["M","F"], category: "Children's Health", frequency: "At well-child visits", notes: "Vision screening for children ages 0–5 at every well-child visit.", icon: "👁️" },
  // Vaccines
  { name: "Annual Flu Vaccine", minAge: 6, maxAge: 999, sex: ["M","F"], category: "Vaccines", frequency: "Every year", notes: "Updated annually for current strains. Everyone 6 months and older should get vaccinated.", icon: "💉" },
  { name: "COVID-19 Vaccine", minAge: 6, maxAge: 999, sex: ["M","F"], category: "Vaccines", frequency: "Per CDC schedule", notes: "Updated vaccines as CDC recommends. Free at most pharmacies and clinics.", icon: "💉" },
  { name: "Tdap / Td Vaccine (Tetanus/Pertussis)", minAge: 11, maxAge: 999, sex: ["M","F"], category: "Vaccines", frequency: "Tdap once; Td every 10 years", notes: "All adolescents and adults. Especially important during pregnancy (Tdap each pregnancy).", icon: "💉" },
  { name: "HPV Vaccine", minAge: 9, maxAge: 26, sex: ["M","F"], category: "Vaccines", frequency: "2–3 dose series", notes: "Recommended through age 26. Ages 27–45 may get it after discussing with doctor.", icon: "💉" },
  { name: "Shingles Vaccine (Shingrix)", minAge: 50, maxAge: 999, sex: ["M","F"], category: "Vaccines", frequency: "2-dose series", notes: "Two doses, 2–6 months apart. Highly effective (>90%). Recommended even if you had shingles.", icon: "💉" },
  { name: "Pneumococcal Vaccine", minAge: 65, maxAge: 999, sex: ["M","F"], category: "Vaccines", frequency: "1–2 doses", notes: "PCV20 (1 dose) or PCV15 + PPSV23 (2 doses). Protects against pneumonia, meningitis, bloodstream infections.", icon: "💉" },
];

const CATEGORY_COLORS = {
  "Cancer Screenings": "#f87171",
  "Heart & Metabolic": "#fb923c",
  "Mental Health": "#a78bfa",
  "Infections & STIs": "#60a5fa",
  "Bone Health": "#fbbf24",
  "Women's Health": "#f472b6",
  "Men's Health": "#34d399",
  "Lifestyle": "#10b981",
  "Children's Health": "#a78bfa",
  "Vaccines": "#06b6d4",
};

export default function PreventiveCareChecker() {
  const [age, setAge] = useState("");
  const [sex, setSex] = useState("");
  const [smoker, setSmoker] = useState(false);
  const [checked, setChecked] = useState({});

  const filtered = useMemo(() => {
    if (!age || !sex) return [];
    const a = parseInt(age);
    return SERVICES.filter(s =>
      s.sex.includes(sex.toUpperCase()) &&
      a >= s.minAge &&
      a <= s.maxAge &&
      (!s.smokerOnly || smoker)
    );
  }, [age, sex, smoker]);

  const grouped = useMemo(() => {
    const g = {};
    filtered.forEach(s => {
      if (!g[s.category]) g[s.category] = [];
      g[s.category].push(s);
    });
    return g;
  }, [filtered]);

  const categories = Object.keys(grouped);
  const totalChecked = Object.values(checked).filter(Boolean).length;
  const totalServices = filtered.length;

  const toggleCheck = (name) => setChecked(c => ({ ...c, [name]: !c[name] }));

  const hasInputs = age && sex;

  return (
    <div>
      <div style={{ textAlign: "center", marginBottom: 28 }}>
        <div style={{ fontSize: 36, marginBottom: 10 }}>🩺</div>
        <h1 style={{ fontSize: "clamp(20px, 5vw, 28px)", fontWeight: 900, color: "#f1f5f9", marginBottom: 8, letterSpacing: "-0.02em" }}>Free Preventive Care Checker</h1>
        <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.6, maxWidth: 460, margin: "0 auto" }}>
          Under the ACA, these services are 100% free with no copay, even before meeting your deductible. Find out what you're entitled to.
        </p>
      </div>

      <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 20, marginBottom: 24 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 16 }}>
          <div>
            <label style={{ fontSize: 11, fontWeight: 700, color: "#475569", display: "block", marginBottom: 8, letterSpacing: "0.06em", textTransform: "uppercase" }}>Your Age</label>
            <input value={age} onChange={e => setAge(e.target.value)} type="number" min="0" max="120" placeholder="Enter age" style={{ width: "100%", padding: "10px 14px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, fontSize: 14, color: "#f1f5f9", fontFamily: FONT, boxSizing: "border-box" }} />
          </div>
          <div>
            <label style={{ fontSize: 11, fontWeight: 700, color: "#475569", display: "block", marginBottom: 8, letterSpacing: "0.06em", textTransform: "uppercase" }}>Biological Sex</label>
            <div style={{ display: "flex", gap: 8 }}>
              {[{v:"M",l:"Male"},{v:"F",l:"Female"}].map(o => (
                <button key={o.v} onClick={() => setSex(o.v)} style={{ flex: 1, padding: "10px", background: sex === o.v ? "rgba(16,185,129,0.12)" : "rgba(255,255,255,0.04)", border: `1px solid ${sex === o.v ? "rgba(16,185,129,0.3)" : "rgba(255,255,255,0.08)"}`, borderRadius: 10, color: sex === o.v ? "#10b981" : "#64748b", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: FONT }}>{o.l}</button>
              ))}
            </div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button onClick={() => setSmoker(s => !s)} style={{ width: 20, height: 20, background: smoker ? "#10b981" : "rgba(255,255,255,0.04)", border: `1px solid ${smoker ? "#10b981" : "rgba(255,255,255,0.2)"}`, borderRadius: 4, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            {smoker && <span style={{ color: "#fff", fontSize: 12, fontWeight: 900 }}>✓</span>}
          </button>
          <span style={{ fontSize: 14, color: "#94a3b8", cursor: "pointer" }} onClick={() => setSmoker(s => !s)}>I currently smoke or have smoked (unlocks additional screenings)</span>
        </div>
      </div>

      {hasInputs && filtered.length === 0 && (
        <div style={{ textAlign: "center", padding: 32, color: "#475569", fontSize: 14 }}>No specific screenings found for your profile. At any age, you qualify for annual flu vaccine, depression screening, and alcohol screening.</div>
      )}

      {hasInputs && filtered.length > 0 && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#64748b", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 4 }}>Your Free Preventive Services</div>
              <div style={{ fontSize: 22, fontWeight: 900, color: "#10b981" }}>{totalServices} services covered — $0 out of pocket</div>
            </div>
            {totalServices > 0 && (
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 11, color: "#64748b" }}>Checked off</div>
                <div style={{ fontSize: 18, fontWeight: 800, color: totalChecked === totalServices ? "#34d399" : "#94a3b8" }}>{totalChecked}/{totalServices}</div>
              </div>
            )}
          </div>

          {categories.map(cat => (
            <div key={cat} style={{ marginBottom: 28 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: CATEGORY_COLORS[cat] || "#64748b", letterSpacing: "0.12em", textTransform: "uppercase" }}>{cat}</span>
                <div style={{ flex: 1, height: 1, background: `linear-gradient(to right, ${(CATEGORY_COLORS[cat] || "#64748b")}30, transparent)` }} />
                <span style={{ fontSize: 11, color: "#334155" }}>{grouped[cat].length} service{grouped[cat].length > 1 ? "s" : ""}</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {grouped[cat].map(s => (
                  <div key={s.name} onClick={() => toggleCheck(s.name)} style={{ background: checked[s.name] ? "rgba(16,185,129,0.06)" : "rgba(255,255,255,0.02)", border: `1px solid ${checked[s.name] ? "rgba(16,185,129,0.25)" : "rgba(255,255,255,0.07)"}`, borderRadius: 12, padding: "14px 16px", cursor: "pointer", display: "flex", gap: 14, alignItems: "flex-start", transition: "all 0.15s" }}>
                    <div style={{ width: 20, height: 20, background: checked[s.name] ? "#10b981" : "rgba(255,255,255,0.06)", border: `1px solid ${checked[s.name] ? "#10b981" : "rgba(255,255,255,0.2)"}`, borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
                      {checked[s.name] && <span style={{ color: "#fff", fontSize: 12, fontWeight: 900 }}>✓</span>}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8, marginBottom: 4 }}>
                        <div style={{ fontSize: 14, fontWeight: 700, color: checked[s.name] ? "#64748b" : "#f1f5f9", textDecoration: checked[s.name] ? "line-through" : "none" }}>{s.icon} {s.name}</div>
                        <div style={{ fontSize: 10, fontWeight: 700, color: "#10b981", background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)", padding: "2px 8px", borderRadius: 20, whiteSpace: "nowrap", flexShrink: 0 }}>FREE</div>
                      </div>
                      <div style={{ fontSize: 12, color: "#64748b", marginBottom: 4 }}><strong style={{ color: "#475569" }}>How often:</strong> {s.frequency}</div>
                      <div style={{ fontSize: 12, color: "#64748b", lineHeight: 1.6 }}>{s.notes}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div style={{ background: "rgba(96,165,250,0.05)", border: "1px solid rgba(96,165,250,0.15)", borderRadius: 14, padding: "18px 20px", marginTop: 16 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#60a5fa", letterSpacing: "0.1em", marginBottom: 8, textTransform: "uppercase" }}>⚠️ Important Note</div>
            <div style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.75 }}>
              These services must be billed as <strong style={{ color: "#f1f5f9" }}>preventive care</strong> (not diagnostic) to be free. If a doctor finds something during a screening and it becomes diagnostic, cost-sharing may apply. Always confirm with your insurer before your appointment that the visit will be coded as preventive.
            </div>
          </div>
        </div>
      )}

      {!hasInputs && (
        <div style={{ marginTop: 16, background: "rgba(16,185,129,0.04)", border: "1px solid rgba(16,185,129,0.12)", borderRadius: 14, padding: "20px", textAlign: "center" }}>
          <div style={{ fontSize: 14, color: "#475569", lineHeight: 1.7 }}>
            Enter your age and sex above to see your personalized list of <strong style={{ color: "#94a3b8" }}>100% free preventive services</strong> — no copay, no deductible, required by the Affordable Care Act.
          </div>
        </div>
      )}
    </div>
  );
}
