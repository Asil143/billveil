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

function InfoRow({ label, value }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <div style={labelStyle}>{label}</div>
      <div style={{ fontSize: 14, color: value ? "#f1f5f9" : "#334155", fontWeight: value ? 500 : 400 }}>
        {value || "—"}
      </div>
    </div>
  );
}

const EMPTY = {
  firstName: "", middleName: "", lastName: "",
  dob: "", gender: "", street: "", city: "", state: "", zip: "",
  insuranceProvider: "",
};

export default function Profile() {
  const { user } = useAuth();
  const [form, setForm] = useState(EMPTY);
  const [draft, setDraft] = useState(EMPTY);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const uid = user?.uid;

  useEffect(() => {
    if (!uid) return;
    const stored = localStorage.getItem(`bv_profile_${uid}`);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setForm(parsed);
        setDraft(parsed);
      } catch {}
    }
  }, [uid]);

  const hasAnyData = Object.values(form).some((v) => v.trim?.() !== "");

  const set = (field) => (e) => setDraft((d) => ({ ...d, [field]: e.target.value }));

  const startEdit = () => {
    setDraft({ ...form });
    setEditing(true);
    setSaved(false);
  };

  const cancel = () => {
    setDraft({ ...form });
    setEditing(false);
  };

  const save = () => {
    if (!uid) return;
    setSaving(true);
    localStorage.setItem(`bv_profile_${uid}`, JSON.stringify(draft));
    setForm({ ...draft });
    setSaving(false);
    setSaved(true);
    setEditing(false);
    setTimeout(() => setSaved(false), 3000);
  };

  const inp = (field, extra = {}) => (
    <input
      value={draft[field]}
      onChange={set(field)}
      style={inputStyle}
      onFocus={(e) => (e.target.style.border = "1px solid rgba(16,185,129,0.5)")}
      onBlur={(e) => (e.target.style.border = "1px solid rgba(255,255,255,0.08)")}
      {...extra}
    />
  );

  const sel = (field, options) => (
    <select value={draft[field]} onChange={set(field)} style={{ ...inputStyle, cursor: "pointer" }}>
      <option value="">Select...</option>
      {options.map((o) => <option key={o} value={o}>{o}</option>)}
    </select>
  );

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: "#f1f5f9", marginBottom: 6, letterSpacing: "-0.02em" }}>
            My Profile
          </h2>
          <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.6 }}>
            Stored locally on your device. Never shared.
          </p>
        </div>
        {!editing && (
          <button
            onClick={startEdit}
            style={{ padding: "8px 18px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, color: "#94a3b8", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: FONT, display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}
          >
            ✏️ {hasAnyData ? "Edit Profile" : "Set Up Profile"}
          </button>
        )}
      </div>

      {saved && (
        <div style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.25)", borderRadius: 12, padding: "12px 16px", marginBottom: 16, fontSize: 14, color: "#10b981", fontWeight: 600 }}>
          ✓ Profile saved successfully
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

        {/* Personal info */}
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 24 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#10b981", letterSpacing: "0.12em", marginBottom: 18 }}>PERSONAL INFORMATION</div>

          {editing ? (
            <>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 12 }}>
                <Field label="First Name">{inp("firstName", { placeholder: "Jane" })}</Field>
                <Field label="Middle Name">{inp("middleName", { placeholder: "Optional" })}</Field>
                <Field label="Last Name">{inp("lastName", { placeholder: "Doe" })}</Field>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <Field label="Date of Birth">{inp("dob", { type: "date" })}</Field>
                <Field label="Gender">{sel("gender", GENDERS)}</Field>
              </div>
            </>
          ) : (
            <>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 16 }}>
                <InfoRow label="First Name" value={form.firstName} />
                <InfoRow label="Middle Name" value={form.middleName} />
                <InfoRow label="Last Name" value={form.lastName} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <InfoRow label="Date of Birth" value={form.dob} />
                <InfoRow label="Gender" value={form.gender} />
              </div>
            </>
          )}
        </div>

        {/* Address */}
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 24 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#10b981", letterSpacing: "0.12em", marginBottom: 18 }}>ADDRESS</div>

          {editing ? (
            <>
              <div style={{ marginBottom: 12 }}>
                <Field label="Street Address">{inp("street", { placeholder: "123 Main St" })}</Field>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr auto auto", gap: 12 }}>
                <Field label="City">{inp("city", { placeholder: "El Centro" })}</Field>
                <Field label="State">{sel("state", US_STATES)}</Field>
                <Field label="ZIP">{inp("zip", { placeholder: "92243", style: { ...inputStyle, width: 90 } })}</Field>
              </div>
            </>
          ) : (
            <>
              <div style={{ marginBottom: 16 }}>
                <InfoRow label="Street Address" value={form.street} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr auto auto", gap: 16 }}>
                <InfoRow label="City" value={form.city} />
                <InfoRow label="State" value={form.state} />
                <InfoRow label="ZIP" value={form.zip} />
              </div>
            </>
          )}
        </div>

        {/* Insurance */}
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 24 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#10b981", letterSpacing: "0.12em", marginBottom: 18 }}>INSURANCE</div>
          {editing ? (
            <Field label="Current Insurance Provider">{sel("insuranceProvider", INSURERS)}</Field>
          ) : (
            <InfoRow label="Current Insurance Provider" value={form.insuranceProvider} />
          )}
        </div>

        {/* Account */}
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 24 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#10b981", letterSpacing: "0.12em", marginBottom: 18 }}>ACCOUNT</div>
          <InfoRow label="Phone Number" value={user?.phoneNumber} />
        </div>

        {/* Edit mode action buttons */}
        {editing && (
          <div style={{ display: "flex", gap: 10 }}>
            <button
              onClick={cancel}
              style={{ flex: 1, padding: "14px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, color: "#64748b", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: FONT }}
            >
              Cancel
            </button>
            <button
              onClick={save}
              disabled={saving}
              style={{ flex: 2, padding: "14px", background: saving ? "rgba(255,255,255,0.05)" : "linear-gradient(135deg, #10b981, #059669)", color: saving ? "#475569" : "#fff", border: "none", borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: saving ? "default" : "pointer", fontFamily: FONT, boxShadow: saving ? "none" : "0 8px 28px rgba(16,185,129,0.35)" }}
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
