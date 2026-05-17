import { useState } from "react";

const FONT = "'Inter', system-ui, sans-serif";

const RIGHTS_SECTIONS = [
  {
    title: "Access Your Medical Records",
    icon: "📋",
    color: "#60a5fa",
    content: [
      "You have the right to inspect and receive a copy of your health information held by covered entities (doctors, hospitals, insurers, labs).",
      "They must respond within 30 days. They may ask for one 30-day extension if they notify you in writing.",
      "They can charge a reasonable, cost-based fee for copying — but cannot deny access because you owe them money.",
      "You can request records in electronic format if they maintain them electronically.",
      "They cannot require you to explain why you want your records.",
    ],
  },
  {
    title: "Correct Errors in Your Records",
    icon: "✏️",
    color: "#34d399",
    content: [
      "You can request an amendment to any information in your record that you believe is incorrect or incomplete.",
      "The provider has 60 days to respond (one 30-day extension allowed).",
      "If they deny your request, they must explain why and you may submit a written statement of disagreement to be permanently added to your file.",
      "If they agree, they must notify others who received the incorrect information.",
    ],
  },
  {
    title: "Know Who Accessed Your Records",
    icon: "👁️",
    color: "#a78bfa",
    content: [
      "You can request an 'Accounting of Disclosures' — a record of everyone who received your health information in the past 6 years, for purposes other than treatment, payment, or operations.",
      "Includes disclosures for research, legal proceedings, public health reporting, and law enforcement.",
      "The first accounting per year is free. Subsequent requests may have a reasonable fee.",
      "Submit your request in writing to the provider's Privacy Officer.",
    ],
  },
  {
    title: "Control How Your Information Is Used",
    icon: "🔒",
    color: "#fbbf24",
    content: [
      "You can request restrictions on how your information is used or disclosed for treatment, payment, and operations — though they aren't required to agree.",
      "Exception: if you pay for a service entirely out of pocket, you CAN require them not to share that information with your health plan.",
      "You can request confidential communications (e.g., calling you only at work, not home).",
      "You can opt out of the hospital directory — meaning staff won't confirm you're a patient to callers or visitors.",
    ],
  },
  {
    title: "Report Violations",
    icon: "🚨",
    color: "#f87171",
    content: [
      "File a complaint with the HHS Office for Civil Rights (OCR) at hhs.gov/hipaa/filing-a-complaint",
      "You must file within 180 days of when you knew (or should have known) of the violation.",
      "You can also complain directly to the covered entity — they cannot retaliate against you for filing.",
      "OCR can impose civil fines from $100 to $50,000 per violation (up to $1.9M per year per violation type).",
      "Criminal violations (selling data, using data for personal gain) can result in jail time.",
    ],
  },
];

export default function HIPAARightsGuide() {
  const [tab, setTab] = useState("rights");
  const [copied, setCopied] = useState(false);
  const [formData, setFormData] = useState({ name: "", dob: "", provider: "", address: "", records: "all medical records", format: "electronic", date: "" });

  const upd = (k, v) => setFormData(f => ({ ...f, [k]: v }));

  const generateLetter = () => {
    return `[Your Name]: ${formData.name || "[Full Name]"}
[Your Address]
[City, State, ZIP]
[Your Phone]
[Your Email]

${formData.date || "[Today's Date]"}

Privacy Officer / Medical Records Department
${formData.provider || "[Provider/Hospital Name]"}
${formData.address || "[Provider Address]"}

RE: Request for Access to Medical Records Under HIPAA (45 CFR § 164.524)

Dear Privacy Officer:

This letter is a formal request for access to and copies of my medical records, as provided under the Health Insurance Portability and Accountability Act (HIPAA), 45 CFR § 164.524.

PATIENT INFORMATION:
Name: ${formData.name || "[Full Name]"}
Date of Birth: ${formData.dob || "[Date of Birth]"}
Medical Record Number: [Your Medical Record Number, if known]

RECORDS REQUESTED:
I am requesting: ${formData.records || "all medical records in your possession"}, including but not limited to: physician notes, discharge summaries, laboratory results, diagnostic imaging, operative reports, medication records, and billing records.

FORMAT:
I request the records in ${formData.format || "electronic format (e.g., PDF, CD, or secure patient portal access)"}.

LEGAL REQUIREMENTS:
Under HIPAA 45 CFR § 164.524, you are required to:
1. Provide access to requested records within 30 days
2. Charge only a reasonable, cost-based fee for copying
3. Not deny access because I owe you money
4. Provide records in my requested format if readily producible

RESPONSE DEADLINE:
Please respond within 30 days as required by law. If you require an extension, please notify me in writing within that 30-day period.

If you deny this request, please provide a written explanation of the legal basis for the denial as required by 45 CFR § 164.524(d).

Thank you for your prompt attention to this matter.

Sincerely,

${formData.name || "[Your Full Name]"}
[Signature]`;
  };

  const copyLetter = () => {
    navigator.clipboard.writeText(generateLetter());
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div>
      <div style={{ textAlign: "center", marginBottom: 28 }}>
        <div style={{ fontSize: 36, marginBottom: 10 }}>🔒</div>
        <h1 style={{ fontSize: "clamp(20px, 5vw, 28px)", fontWeight: 900, color: "#f1f5f9", marginBottom: 8, letterSpacing: "-0.02em" }}>HIPAA Rights Guide</h1>
        <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.6, maxWidth: 460, margin: "0 auto" }}>
          Your medical information belongs to you. Know your HIPAA rights — access records, correct errors, control your data, and report violations.
        </p>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
        {[{id:"rights",label:"Your Rights"},{id:"letter",label:"Records Request Letter"},{id:"report",label:"Report a Violation"}].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{ flex: 1, padding: "9px 12px", background: tab === t.id ? "rgba(16,185,129,0.12)" : "rgba(255,255,255,0.04)", border: `1px solid ${tab === t.id ? "rgba(16,185,129,0.3)" : "rgba(255,255,255,0.08)"}`, borderRadius: 10, color: tab === t.id ? "#10b981" : "#64748b", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: FONT }}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === "rights" && (
        <div>
          {RIGHTS_SECTIONS.map(s => (
            <div key={s.title} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderLeft: `3px solid ${s.color}`, borderRadius: 12, padding: "18px 20px", marginBottom: 14 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#f1f5f9", marginBottom: 12 }}>{s.icon} {s.title}</div>
              <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
                {s.content.map((item, i) => (
                  <li key={i} style={{ display: "flex", gap: 10, marginBottom: 8, alignItems: "flex-start" }}>
                    <span style={{ color: s.color, flexShrink: 0, marginTop: 4, fontSize: 8 }}>●</span>
                    <span style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.7 }}>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {tab === "letter" && (
        <div>
          <div style={{ background: "rgba(96,165,250,0.05)", border: "1px solid rgba(96,165,250,0.15)", borderRadius: 14, padding: 18, marginBottom: 20 }}>
            <div style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.7 }}>Fill in the details below to generate a ready-to-send HIPAA records request letter. Under the law, providers must respond within <strong style={{ color: "#f1f5f9" }}>30 days</strong>.</div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
            {[
              { k: "name", label: "Your Full Name", placeholder: "Jane Smith" },
              { k: "dob", label: "Date of Birth", placeholder: "MM/DD/YYYY" },
              { k: "provider", label: "Provider / Hospital Name", placeholder: "City General Hospital" },
              { k: "date", label: "Today's Date", placeholder: "June 1, 2025" },
            ].map(f => (
              <div key={f.k}>
                <label style={{ fontSize: 11, fontWeight: 700, color: "#475569", display: "block", marginBottom: 6, letterSpacing: "0.06em", textTransform: "uppercase" }}>{f.label}</label>
                <input value={formData[f.k]} onChange={e => upd(f.k, e.target.value)} placeholder={f.placeholder} style={{ width: "100%", padding: "10px 12px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, fontSize: 13, color: "#f1f5f9", fontFamily: FONT, boxSizing: "border-box" }} />
              </div>
            ))}
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 11, fontWeight: 700, color: "#475569", display: "block", marginBottom: 6, letterSpacing: "0.06em", textTransform: "uppercase" }}>Records You're Requesting</label>
            <input value={formData.records} onChange={e => upd("records", e.target.value)} placeholder="all medical records from [date range]" style={{ width: "100%", padding: "10px 12px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, fontSize: 13, color: "#f1f5f9", fontFamily: FONT, boxSizing: "border-box" }} />
          </div>
          <div style={{ marginBottom: 20 }}>
            <label style={{ fontSize: 11, fontWeight: 700, color: "#475569", display: "block", marginBottom: 8, letterSpacing: "0.06em", textTransform: "uppercase" }}>Preferred Format</label>
            <div style={{ display: "flex", gap: 8 }}>
              {["electronic","paper copy","CD/USB","patient portal"].map(f => (
                <button key={f} onClick={() => upd("format", f)} style={{ padding: "7px 12px", background: formData.format === f ? "rgba(16,185,129,0.12)" : "rgba(255,255,255,0.04)", border: `1px solid ${formData.format === f ? "rgba(16,185,129,0.3)" : "rgba(255,255,255,0.08)"}`, borderRadius: 8, color: formData.format === f ? "#10b981" : "#64748b", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: FONT }}>{f}</button>
              ))}
            </div>
          </div>
          <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: "16px 18px", marginBottom: 16 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#334155", letterSpacing: "0.1em", marginBottom: 10, textTransform: "uppercase" }}>Generated Letter Preview</div>
            <pre style={{ fontSize: 11, color: "#64748b", lineHeight: 1.7, whiteSpace: "pre-wrap", fontFamily: FONT, margin: 0, maxHeight: 220, overflowY: "auto" }}>{generateLetter()}</pre>
          </div>
          <button onClick={copyLetter} style={{ width: "100%", padding: "13px", background: copied ? "rgba(16,185,129,0.15)" : "linear-gradient(135deg, #10b981, #059669)", color: "#fff", border: "none", borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: FONT, transition: "all 0.2s" }}>
            {copied ? "✓ Copied to Clipboard!" : "📋 Copy Letter"}
          </button>
        </div>
      )}

      {tab === "report" && (
        <div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {[
              { title: "Step 1: File with HHS Office for Civil Rights", color: "#f87171", body: "Go to hhs.gov/hipaa/filing-a-complaint and submit an online complaint. You must file within 180 days of when you knew about the violation. The complaint is free. OCR may investigate and can impose civil fines.", cta: "File at HHS OCR (hhs.gov)" },
              { title: "Step 2: Complain Directly to the Covered Entity", color: "#fbbf24", body: "Write a formal complaint to the provider's Privacy Officer. They are required by law to have a complaints process and cannot retaliate against you for filing. Keep a copy of everything.", cta: "Use our Dispute Letter tool" },
              { title: "Step 3: Report to Your State Attorney General", color: "#60a5fa", body: "State AGs can bring civil actions for HIPAA violations that harm their residents. Find your state AG at naag.org. Some states have their own health privacy laws with additional protections.", cta: "naag.org" },
            ].map(s => (
              <div key={s.title} style={{ background: "rgba(255,255,255,0.02)", border: `1px solid ${s.color}30`, borderLeft: `3px solid ${s.color}`, borderRadius: 12, padding: "16px 20px" }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: s.color, marginBottom: 8 }}>{s.title}</div>
                <div style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.7, marginBottom: 10 }}>{s.body}</div>
                <div style={{ fontSize: 11, fontWeight: 600, color: "#64748b" }}>→ {s.cta}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 20, background: "rgba(167,139,250,0.06)", border: "1px solid rgba(167,139,250,0.2)", borderRadius: 12, padding: "14px 18px" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#a78bfa", letterSpacing: "0.1em", marginBottom: 8, textTransform: "uppercase" }}>Common HIPAA Violations</div>
            {["Provider shares information with employer without your consent","Hospital staff looks at records of a celebrity or someone they know","Your records were shared for marketing without your authorization","Insurer denies access to your records","Provider discusses your care in public areas where others can hear","Data breach that exposed your health information without proper notification"].map((v, i) => (
              <div key={i} style={{ display: "flex", gap: 8, marginBottom: 6, alignItems: "flex-start" }}>
                <span style={{ color: "#a78bfa", flexShrink: 0 }}>•</span>
                <span style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.6 }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
