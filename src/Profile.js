import { useState, useEffect } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "./firebase";
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
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.1)",
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
  color: "#64748b",
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
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [dbError, setDbError] = useState(null);

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    getDoc(doc(db, "users", user.uid))
      .then((snap) => {
        if (snap.exists()) setForm((f) => ({ ...f, ...snap.data() }));
      })
      .catch((err) => {
        console.error("Firestore read error:", err);
        setDbError(err.message || "Could not load profile. Check console for details.");
      })
      .finally(() => setLoading(false));
  }, [user]);

  const set = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    setSaved(false);
  };

  const save = async () => {
    setSaving(true);
    await setDoc(doc(db, "users", user.uid), form, { merge: true });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: 80 }}>
        <span style={{ width: 24, height: 24, border: "2px solid rgba(255,255,255,0.1)", borderTop: "2px solid #10b981", borderRadius: "50%", animation: "spin 0.8s linear infinite", display: "inline-block" }} />
      </div>
    );
  }

  if (dbError) {
    return (
      <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: 12, padding: 20, color: "#f87171", fontSize: 14, lineHeight: 1.7 }}>
        <strong>Could not load profile:</strong><br />{dbError}
      </div>
    );
  }

  const inp = (field, extra = {}) => (
    <input
      value={form[field]}
      onChange={set(field)}
      style={inputStyle}
      onFocus={(e) => (e.target.style.border = "1px solid rgba(16,185,129,0.5)")}
      onBlur={(e) => (e.target.style.border = "1px solid rgba(255,255,255,0.1)")}
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
        <h2 style={{ fontSize: 22, fontWeight: 800, color: "#f1f5f9", marginBottom: 8, letterSpacing: "-0.02em" }}>
          My Profile
        </h2>
        <p style={{ fontSize: 14, color: "#475569", lineHeight: 1.6 }}>
          Your information helps us give more accurate advice. Stored securely — never shared.
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

        {/* Name */}
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

        {/* Address */}
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

        {/* Insurance */}
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 24 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#10b981", letterSpacing: "0.12em", marginBottom: 16 }}>INSURANCE</div>
          <Field label="Current Insurance Provider">{sel("insuranceProvider", INSURERS)}</Field>
        </div>

        {/* Save */}
        <button
          onClick={save}
          disabled={saving}
          style={{ width: "100%", padding: "15px", background: saved ? "rgba(16,185,129,0.15)" : saving ? "rgba(255,255,255,0.05)" : "linear-gradient(135deg, #10b981, #059669)", color: saved ? "#10b981" : saving ? "#475569" : "#fff", border: saved ? "1px solid rgba(16,185,129,0.3)" : "none", borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: saving ? "default" : "pointer", fontFamily: FONT, transition: "all 0.2s", boxShadow: saved || saving ? "none" : "0 8px 25px rgba(16,185,129,0.3)" }}
        >
          {saved ? "✓ Profile saved!" : saving ? "Saving..." : "Save Profile"}
        </button>

        {/* Phone info */}
        <div style={{ textAlign: "center", fontSize: 12, color: "#1e293b", paddingBottom: 8 }}>
          Account phone: {user?.phoneNumber}
        </div>
      </div>
    </div>
  );
}
