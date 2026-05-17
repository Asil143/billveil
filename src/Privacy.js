'use client';
import { useRouter } from "next/navigation";
const FONT = "'Inter', system-ui, sans-serif";

const Section = ({ title, children }) => (
  <div style={{ marginBottom: 36 }}>
    <h2 style={{ fontSize: 16, fontWeight: 700, color: "#f1f5f9", marginBottom: 12 }}>{title}</h2>
    <div style={{ fontSize: 14, color: "#64748b", lineHeight: 1.9 }}>{children}</div>
  </div>
);

export default function Privacy() {
  const router = useRouter();
  return (
    <div style={{ minHeight: "100vh", background: "#050810", fontFamily: FONT, color: "#f1f5f9" }}>

      <div style={{ position: "sticky", top: 0, zIndex: 10, background: "rgba(5,8,16,0.9)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 24px", height: 60 }}>
        <button onClick={() => router.back()} style={{ background: "none", border: "none", color: "#64748b", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: FONT }}>← Back</button>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 26, height: 26, background: "linear-gradient(135deg, #10b981, #059669)", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>🛡️</div>
          <span style={{ fontSize: 15, fontWeight: 800, color: "#f1f5f9" }}>BillVeil</span>
        </div>
        <div style={{ width: 60 }} />
      </div>

      <div style={{ maxWidth: 680, margin: "0 auto", padding: "56px 24px 80px" }}>
        <div style={{ marginBottom: 48 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: "#10b981", letterSpacing: "0.14em", marginBottom: 14 }}>LEGAL</div>
          <h1 style={{ fontSize: "clamp(28px, 5vw, 40px)", fontWeight: 900, letterSpacing: "-0.03em", color: "#f1f5f9", marginBottom: 12 }}>Privacy Policy</h1>
          <p style={{ fontSize: 13, color: "#475569" }}>Last updated: January 2025</p>
        </div>

        <div style={{ background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: 14, padding: "20px 22px", marginBottom: 40 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#10b981", marginBottom: 8 }}>🔒 The short version</div>
          <div style={{ fontSize: 14, color: "#64748b", lineHeight: 1.75 }}>
            BillVeil does not store, sell, or share your medical information. Ever. What you paste into BillVeil is sent to our AI, analyzed, and immediately discarded. We do not log medical bill contents. We never sell data.
          </div>
        </div>

        <Section title="1. What information we collect">
          <p style={{ marginBottom: 10 }}><strong style={{ color: "#94a3b8" }}>Medical bill content:</strong> When you paste a bill or charge for analysis, that text is sent to our AI provider (Groq) to generate a response. It is not stored in any database, not logged, and not retained after the response is returned.</p>
          <p style={{ marginBottom: 10 }}><strong style={{ color: "#94a3b8" }}>Phone number:</strong> If you create a free account, we collect your phone number for authentication purposes only. It is stored securely via Firebase Authentication and is never shared with third parties.</p>
          <p><strong style={{ color: "#94a3b8" }}>Profile information:</strong> If you fill out your profile (name, address, insurance), this data is stored locally on your device using your browser's localStorage. It is never transmitted to our servers.</p>
        </Section>

        <Section title="2. What we do NOT collect">
          <ul style={{ paddingLeft: 20, display: "flex", flexDirection: "column", gap: 8 }}>
            <li>We do not store the contents of your medical bills</li>
            <li>We do not log or retain AI analysis results</li>
            <li>We do not collect your email address</li>
            <li>We do not use tracking cookies or advertising pixels</li>
            <li>We do not sell, rent, or share your data with any third parties for marketing</li>
            <li>We do not use your data to train AI models</li>
          </ul>
        </Section>

        <Section title="3. Third-party services">
          <p style={{ marginBottom: 10 }}><strong style={{ color: "#94a3b8" }}>Groq AI:</strong> Bill analysis text is sent to Groq's API to generate responses. Groq processes this data in accordance with their privacy policy. We do not send any personally identifying information alongside bill text.</p>
          <p><strong style={{ color: "#94a3b8" }}>Firebase (Google):</strong> We use Firebase Authentication to manage phone-based logins. Only your phone number is stored here. Firebase's privacy policy applies to this data.</p>
        </Section>

        <Section title="4. How we protect your information">
          <p>All data transmitted between your browser and our servers uses HTTPS encryption. Phone numbers and profile data are stored in Firebase (Firestore), protected by Google's enterprise security infrastructure. Bill analysis text is never stored — it is processed in memory and discarded after each response.</p>
        </Section>

        <Section title="5. Your rights">
          <p style={{ marginBottom: 10 }}>You can delete your account and all associated data (profile, cases) at any time by contacting us at hello@billveil.com. Since we do not store medical bill analysis content, there is no query history to delete.</p>
        </Section>

        <Section title="6. Children's privacy">
          <p>BillVeil is not directed at children under 13. We do not knowingly collect information from children under 13.</p>
        </Section>

        <Section title="7. Changes to this policy">
          <p>We may update this policy from time to time. We will post the updated date at the top of this page. Continued use of BillVeil after changes constitutes acceptance of the updated policy.</p>
        </Section>

        <Section title="8. Contact">
          <p>Questions about this policy? Email us at <a href="mailto:hello@billveil.com" style={{ color: "#10b981" }}>hello@billveil.com</a></p>
        </Section>

        <div style={{ marginTop: 48, padding: "20px 22px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, fontSize: 13, color: "#475569", lineHeight: 1.75 }}>
          <strong style={{ color: "#64748b" }}>Disclaimer:</strong> BillVeil provides general information and AI-generated analysis for educational purposes only. It does not constitute medical, legal, or financial advice. Always consult a qualified professional for specific guidance about your situation.
        </div>
      </div>
    </div>
  );
}
