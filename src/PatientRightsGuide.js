import { useState } from "react";
import { useNavigate } from "react-router-dom";

const FONT = "'Inter', system-ui, sans-serif";

const RIGHTS = [
  {
    category: "Emergency & Hospital Care",
    color: "#f87171",
    icon: "🚨",
    rights: [
      { title: "Right to Emergency Treatment (EMTALA)", body: "Any hospital with an ER that accepts Medicare must screen and stabilize you regardless of your ability to pay, insurance status, or immigration status. They cannot turn you away, delay treatment to verify insurance, or transfer you until you are stable. Violations can be reported to CMS." },
      { title: "Right to Refuse Treatment", body: "As a competent adult, you have the legal right to refuse any medical treatment, procedure, or medication — even life-saving ones. You can also withdraw consent for ongoing treatment. Hospitals must honor your decision and document it." },
      { title: "Right to Transfer to Another Hospital", body: "You can request transfer to another hospital at any time, even mid-treatment. If your condition is stable, the hospital must arrange a safe transfer. If unstable, they can only transfer if you request it with informed consent, or if the receiving hospital can provide higher-level care." },
      { title: "Right to a Patient Advocate", body: "You can bring a patient advocate, family member, or friend to your appointments and hospital stays. Many hospitals have a Patient Advocate or Patient Representative you can contact for free — they help resolve disputes and ensure your rights are respected." },
    ],
  },
  {
    category: "Billing & Financial Rights",
    color: "#fbbf24",
    icon: "💰",
    rights: [
      { title: "Right to an Itemized Bill", body: "Under HIPAA (45 CFR 164.524), you are entitled to a complete itemized bill showing every charge, CPT code, and service. The provider must give it to you within 30 days of your request. Use our Itemization Request tool to generate a formal demand letter." },
      { title: "No Surprise Billing Act (2022)", body: "As of January 1, 2022, you cannot be billed more than your in-network cost-sharing for: emergency services at any ER, non-emergency services at an in-network facility when you could not reasonably choose an in-network provider, and air ambulance services. Any additional billing violates federal law." },
      { title: "Right to Dispute a Bill", body: "You can dispute any medical bill at any time before or after paying. You are not legally required to pay a bill you believe is incorrect. Submit a written dispute to the billing department and the charge is placed 'on hold' during the investigation period." },
      { title: "Charity Care & Financial Assistance", body: "Every nonprofit hospital (IRS 501(c)(3)) is required by federal law to have a financial assistance policy (FAP). They must provide free or discounted care to patients who qualify, cannot send bills to collections without first screening for FAP eligibility, and must publish their policy plainly." },
      { title: "Right to a Payment Plan", body: "Hospitals are not required by federal law to offer payment plans, but most will — especially nonprofit hospitals. You have the right to negotiate the terms. Many states require hospitals to offer interest-free payment plans. Never pay a medical debt with a high-interest medical credit card without exploring this first." },
    ],
  },
  {
    category: "Insurance & Appeal Rights",
    color: "#60a5fa",
    icon: "📋",
    rights: [
      { title: "Right to Appeal an Insurance Denial", body: "Under the ACA (Section 2719) and ERISA Section 503, you have the right to appeal any insurance denial. Insurers must provide a written explanation of any denial. You have the right to an internal appeal (reviewed by the insurer) AND an independent external review by a third party — which is legally binding." },
      { title: "Right to External Review", body: "If your insurer denies your appeal, you can request an Independent External Review by an Independent Review Organization (IRO). The insurer must pay for this review, and the IRO's decision is binding. You must request this within 4 months of the final denial. 40–60% of external reviews overturn the insurer's decision." },
      { title: "Right to Prior Authorization Information", body: "If a service requires prior authorization, the insurer must provide the criteria they use to approve or deny it upon request. If denied, they must explain in writing specifically why it fails to meet criteria. You can request a 'peer-to-peer review' where your doctor speaks directly with the insurer's medical reviewer." },
      { title: "Mental Health Parity Rights", body: "Under the Mental Health Parity and Addiction Equity Act (MHPAEA), insurers cannot place more restrictions on mental health and substance use treatment than on physical health treatment. This includes visit limits, prior authorization requirements, and reimbursement rates. Violations can be reported to the DOL or state insurance commissioner." },
    ],
  },
  {
    category: "Medical Records Rights",
    color: "#a78bfa",
    icon: "📁",
    rights: [
      { title: "Right to Access Your Medical Records (HIPAA)", body: "Under HIPAA (45 CFR 164.524), you have the right to request and receive a copy of your medical records, including lab results, imaging, notes, and billing records. The provider must respond within 30 days (or 60 days with notice). They can charge a reasonable fee for copying but cannot deny access because you owe money." },
      { title: "Right to Amend Your Records", body: "If you believe information in your medical record is incorrect or incomplete, you can request an amendment. The provider has 60 days to respond. If they deny your request, they must explain why and you can submit a written statement of disagreement to be included in your file." },
      { title: "Right to Know Who Accessed Your Records", body: "You can request an 'Accounting of Disclosures' — a list of every entity that received your health information for non-treatment purposes in the past 6 years. This includes research, marketing, and government reporting. Request this in writing from the privacy officer." },
      { title: "Right to Report HIPAA Violations", body: "If you believe your health information was improperly disclosed, you can file a complaint with the HHS Office for Civil Rights (OCR) at hhs.gov/hipaa/filing-a-complaint within 180 days of the violation. Violations can result in fines from $100 to $50,000 per violation." },
    ],
  },
  {
    category: "Specific Protections",
    color: "#34d399",
    icon: "🛡️",
    rights: [
      { title: "Breast Cancer Treatment Act", body: "Federal law requires insurance plans that cover mastectomies to also cover: reconstructive surgery, prosthetics, and treatment for physical complications. Coverage must be equal to other surgical procedures. Any denial of these services violates federal law." },
      { title: "Newborn & Mothers' Health Protection Act", body: "Insurance plans cannot restrict hospital stays after childbirth to less than 48 hours (vaginal delivery) or 96 hours (C-section) without the attending physician's approval. Insurers cannot require pre-authorization for these minimum stays." },
      { title: "Genetic Information Nondiscrimination Act (GINA)", body: "Health insurers cannot use genetic information (test results, family history) to deny coverage, set premiums, or determine benefits. Employers cannot use genetic information in hiring, promotion, or employment decisions. This applies to group health plans and individual market plans." },
      { title: "Protection from Medical Debt Credit Reporting (2024)", body: "As of 2023–2024: medical debt under $500 cannot appear on credit reports. There is a 1-year grace period before medical debt can be reported. Paid medical debt must be removed from credit reports. The CFPB is actively enforcing rules limiting medical debt credit reporting." },
    ],
  },
];

export default function PatientRightsGuide() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState({});
  const [expandedCat, setExpandedCat] = useState({});

  const q = search.toLowerCase();
  const filtered = RIGHTS.map(cat => ({
    ...cat,
    rights: cat.rights.filter(r => !q || r.title.toLowerCase().includes(q) || r.body.toLowerCase().includes(q)),
  })).filter(cat => !q || cat.rights.length > 0 || cat.category.toLowerCase().includes(q));

  const toggle = (key) => setExpanded(e => ({ ...e, [key]: !e[key] }));
  const toggleCat = (cat) => setExpandedCat(e => ({ ...e, [cat]: !e[cat] }));

  return (
    <div>
      <div style={{ textAlign: "center", marginBottom: 28 }}>
        <div style={{ fontSize: 36, marginBottom: 10 }}>⚖️</div>
        <h1 style={{ fontSize: "clamp(20px, 5vw, 28px)", fontWeight: 900, color: "#f1f5f9", marginBottom: 8, letterSpacing: "-0.02em" }}>Patient Rights Guide</h1>
        <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.6, maxWidth: 460, margin: "0 auto" }}>
          Know your legal rights — from emergency care to billing disputes, insurance appeals to medical records. Use these to protect yourself.
        </p>
      </div>

      <div style={{ position: "relative", marginBottom: 24 }}>
        <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#475569", fontSize: 16 }}>🔍</span>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search rights (e.g. 'billing', 'records', 'appeal')" style={{ width: "100%", padding: "12px 14px 12px 40px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, fontSize: 14, color: "#f1f5f9", fontFamily: FONT, boxSizing: "border-box" }} />
      </div>

      {filtered.map(cat => (
        <div key={cat.category} style={{ marginBottom: 20 }}>
          <button onClick={() => toggleCat(cat.category)} style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: "14px 16px", cursor: "pointer", fontFamily: FONT, textAlign: "left", marginBottom: expandedCat[cat.category] !== false ? 0 : 0 }}>
            <span style={{ fontSize: 18 }}>{cat.icon}</span>
            <span style={{ flex: 1, fontSize: 14, fontWeight: 700, color: cat.color }}>{cat.category}</span>
            <span style={{ fontSize: 11, color: "#334155" }}>{cat.rights.length} right{cat.rights.length !== 1 ? "s" : ""}</span>
            <span style={{ color: "#475569", fontSize: 14 }}>{expandedCat[cat.category] === false ? "▼" : "▲"}</span>
          </button>

          {expandedCat[cat.category] !== false && (
            <div style={{ border: "1px solid rgba(255,255,255,0.07)", borderTop: "none", borderRadius: "0 0 12px 12px", overflow: "hidden" }}>
              {cat.rights.map((r, i) => (
                <div key={r.title} style={{ borderTop: i === 0 ? "none" : "1px solid rgba(255,255,255,0.05)" }}>
                  <button onClick={() => toggle(`${cat.category}-${r.title}`)} style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, background: "none", border: "none", padding: "14px 18px", cursor: "pointer", fontFamily: FONT, textAlign: "left" }}>
                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: cat.color, flexShrink: 0, opacity: 0.7 }} />
                    <span style={{ flex: 1, fontSize: 13, fontWeight: 700, color: "#f1f5f9" }}>{r.title}</span>
                    <span style={{ color: "#475569", fontSize: 13 }}>{expanded[`${cat.category}-${r.title}`] ? "▲" : "▼"}</span>
                  </button>
                  {expanded[`${cat.category}-${r.title}`] && (
                    <div style={{ padding: "0 18px 16px 38px", fontSize: 13, color: "#94a3b8", lineHeight: 1.8 }}>{r.body}</div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      <div style={{ marginTop: 32, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <button onClick={() => navigate("/dispute")} style={{ padding: "12px", background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.2)", color: "#f87171", borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: FONT }}>✉️ Write a Dispute Letter</button>
        <button onClick={() => navigate("/denial")} style={{ padding: "12px", background: "rgba(96,165,250,0.08)", border: "1px solid rgba(96,165,250,0.2)", color: "#60a5fa", borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: FONT }}>⚔️ Fight a Denial</button>
        <button onClick={() => navigate("/hipaa")} style={{ padding: "12px", background: "rgba(167,139,250,0.08)", border: "1px solid rgba(167,139,250,0.2)", color: "#a78bfa", borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: FONT }}>📁 HIPAA Rights Guide</button>
        <button onClick={() => navigate("/mentalparity")} style={{ padding: "12px", background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)", color: "#10b981", borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: FONT }}>🧠 Mental Health Parity</button>
      </div>
    </div>
  );
}
