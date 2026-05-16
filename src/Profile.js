import { useState, useEffect } from "react";
import { useAuth } from "./AuthContext";

const FONT = "'Inter', system-ui, sans-serif";

const GENDERS = ["Prefer not to say", "Male", "Female", "Non-binary", "Other"];

const INSURERS = [
  "UnitedHealth", "Anthem / BCBS", "Aetna", "Cigna", "Humana",
  "Kaiser Permanente", "Centene", "Molina Healthcare", "CVS / Aetna",
  "Medicare", "Medicaid", "Tricare", "No insurance", "Other",
];

const US_STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA",
  "KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ",
  "NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT",
  "VA","WA","WV","WI","WY","DC",
];

const inputStyle = {
  width: "100%",
  padding: "11px 14px",
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: 10,
  fontSize: 14,
  color: "#f1f5f9",
  fontFamily: FONT,
  outline: "none",
  boxSizing: "border-box",
  transition: "border 0.2s",
};

const labelStyle = {
  fontSize: 11,
  fontWeight: 700,
  color: "#475569",
  display: "block",
  marginBottom: 6,
  letterSpacing: "0.06em",
  textTransform: "uppercase",
};

function Field({ label, children }) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      {children}
    </div>
  );
}

export default function Profile() {
  const { user } = useAuth();
  const [form, setForm] = useState({
    firstName: "", middleName: "", lastName: "",
    dob: "", gender: "", street: "", city: "", state: "", zip: "",
    insuranceProvider: "",
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const uid = user?.uid;

  useEffect(() => {
    if (!uid) return;
    const stored = localStorage.getItem(`bv_profile_${uid}`);
    if (stored) {
      try { setForm(JSON.parse(stored)); } catch {}
    }
  }, [uid]);

  const set = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    setSaved(false);
  };

  const save = () => {
    if (!uid) return;
    setSaving(true);
    localStorage.setItem(`bv_profile_${uid}`, JSON.stringify(form));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const inp = (field, extra = {}) => (
    <input
      value={form[field]}
      onChange={set(field)}
      style={inputStyle}
      onFocus={(e) => (e.target.style.border = "1px solid rgba(16,185,129,0.5)")}
      onBlur={(e) => (e.target.style.border = "1px solid rgba(255,255,255,0.08)")}
      {...extra}
    />
  );

  const sel = (field, options) => (
    <select
      value={form[field]}
      onChange={set(field)}
      style={{ ...inputStyle, cursor: "pointer" }}
    >
      <option value="">Select...</option>
      {options.map((o) => <option key={o} value={o}>{o}</option>)}
    </select>
  );

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: "#f1f5f9", marginBottom: 8, letterSpacing: "-0.02em" }}>
          My Profile
        </h2>
        <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.6 }}>
          Your information helps us give more accurate advice. Stored securely — never shared.
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 24 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#10b981", letterSpacing: "0.12em", marginBottom: 16 }}>PERSONAL INFORMATION</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 12 }}>
            <Field label="First Name">{inp("firstName", { placeholder: "Jane" })}</Field>
            <Field label="Middle Name">{inp("middleName", { placeholder: "Optional" })}</Field>
            <Field label="Last Name">{inp("lastName", { placeholder: "Doe" })}</Field>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Field label="Date of Birth">{inp("dob", { type: "date" })}</Field>
            <Field label="Gender">{sel("gender", GENDERS)}</Field>
          </div>
        </div>

        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 24 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#10b981", letterSpacing: "0.12em", marginBottom: 16 }}>ADDRESS</div>
          <div style={{ marginBottom: 12 }}>
            <Field label="Street Address">{inp("street", { placeholder: "123 Main St" })}</Field>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr auto auto", gap: 12 }}>
            <Field label="City">{inp("city", { placeholder: "El Centro" })}</Field>
            <Field label="State">{sel("state", US_STATES)}</Field>
            <Field label="ZIP">{inp("zip", { placeholder: "92243", style: { ...inputStyle, width: 90 } })}</Field>
          </div>
        </div>

        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 24 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#10b981", letterSpacing: "0.12em", marginBottom: 16 }}>INSURANCE</div>
          <Field label="Current Insurance Provider">{sel("insuranceProvider", INSURERS)}</Field>
        </div>

        <button
          onClick={save}
          disabled={saving}
          style={{ width: "100%", padding: "15px", background: saved ? "rgba(16,185,129,0.15)" : saving ? "rgba(255,255,255,0.05)" : "linear-gradient(135deg, #10b981, #059669)", color: saved ? "#10b981" : saving ? "#475569" : "#fff", border: saved ? "1px solid rgba(16,185,129,0.3)" : "none", borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: saving ? "default" : "pointer", fontFamily: FONT, transition: "all 0.2s", boxShadow: saved || saving ? "none" : "0 8px 28px rgba(16,185,129,0.35)" }}
        >
          {saved ? "✓ Profile saved!" : saving ? "Saving..." : "Save Profile"}
        </button>

        <div style={{ textAlign: "center", fontSize: 12, color: "#1e293b", paddingBottom: 8 }}>
          Account phone: {user?.phoneNumber}
        </div>
      </div>
    </div>
  );
}
