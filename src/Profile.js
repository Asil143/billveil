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
  background: "#f8fafc",
  border: "1px solid #e2e8f0",
  borderRadius: 10,
  fontSize: 14,
  color: "#0f172a",
  fontFamily: FONT,
  outline: "none",
  boxSizing: "border-box",
  transition: "border 0.2s",
};

const labelStyle = {
  fontSize: 11,
  fontWeight: 700,
  color: "#94a3b8",
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
      onFocus={(e) => (e.target.style.border = "1px solid #10b981")}
      onBlur={(e) => (e.target.style.border = "1px solid #e2e8f0")}
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
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: "#0f172a", marginBottom: 8, letterSpacing: "-0.02em" }}>
          My Profile
        </h2>
        <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.6 }}>
          Your information helps us give more accurate advice. Stored securely — never shared.
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

        {/* Name */}
        <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 16, padding: 24, boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
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

        {/* Address */}
        <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 16, padding: 24, boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
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

        {/* Insurance */}
        <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 16, padding: 24, boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#10b981", letterSpacing: "0.12em", marginBottom: 16 }}>INSURANCE</div>
          <Field label="Current Insurance Provider">{sel("insuranceProvider", INSURERS)}</Field>
        </div>

        {/* Save */}
        <button
          onClick={save}
          disabled={saving}
          style={{ width: "100%", padding: "15px", background: saved ? "#f0fdf4" : saving ? "#f1f5f9" : "linear-gradient(135deg, #10b981, #059669)", color: saved ? "#059669" : saving ? "#94a3b8" : "#fff", border: saved ? "1px solid #bbf7d0" : "none", borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: saving ? "default" : "pointer", fontFamily: FONT, transition: "all 0.2s", boxShadow: saved || saving ? "none" : "0 4px 16px rgba(16,185,129,0.3)" }}
        >
          {saved ? "✓ Profile saved!" : saving ? "Saving..." : "Save Profile"}
        </button>

        {/* Phone info */}
        <div style={{ textAlign: "center", fontSize: 12, color: "#94a3b8", paddingBottom: 8 }}>
          Account phone: {user?.phoneNumber}
        </div>
      </div>
    </div>
  );
}
