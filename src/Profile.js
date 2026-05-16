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

const EMPTY = {
  firstName: "", middleName: "", lastName: "",
  dob: "", gender: "", email: "",
  street: "", city: "", state: "", zip: "",
  insuranceProvider: "",
};

const inp = (value, onChange, extra = {}) => (
  <input
    value={value}
    onChange={onChange}
    style={{
      width: "100%", padding: "11px 14px",
      background: "rgba(255,255,255,0.04)",
      border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: 10, fontSize: 14, color: "#f1f5f9",
      fontFamily: FONT, outline: "none", boxSizing: "border-box",
    }}
    onFocus={(e) => (e.target.style.borderColor = "rgba(16,185,129,0.5)")}
    onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.08)")}
    {...extra}
  />
);

const sel = (value, onChange, options) => (
  <select
    value={value}
    onChange={onChange}
    style={{
      width: "100%", padding: "11px 14px",
      background: "rgba(255,255,255,0.04)",
      border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: 10, fontSize: 14, color: "#f1f5f9",
      fontFamily: FONT, outline: "none", boxSizing: "border-box", cursor: "pointer",
    }}
  >
    <option value="">Select...</option>
    {options.map((o) => <option key={o} value={o}>{o}</option>)}
  </select>
);

const Label = ({ children, optional }) => (
  <div style={{ fontSize: 11, fontWeight: 700, color: "#475569", marginBottom: 6, letterSpacing: "0.06em", textTransform: "uppercase", display: "flex", alignItems: "center", gap: 6 }}>
    {children}
    {optional && <span style={{ fontSize: 10, fontWeight: 500, color: "#334155", textTransform: "none", letterSpacing: 0 }}>optional</span>}
  </div>
);

const InfoVal = ({ label, value, optional, badge }) => (
  <div>
    <Label optional={optional}>{label}</Label>
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <span style={{ fontSize: 14, color: value ? "#f1f5f9" : "#334155" }}>{value || "—"}</span>
      {badge}
    </div>
  </div>
);

const VerifiedBadge = ({ verified }) => (
  <span style={{
    display: "inline-flex", alignItems: "center", gap: 4,
    padding: "2px 8px", borderRadius: 20, fontSize: 10, fontWeight: 700,
    background: verified ? "rgba(16,185,129,0.1)" : "rgba(245,158,11,0.1)",
    border: verified ? "1px solid rgba(16,185,129,0.3)" : "1px solid rgba(245,158,11,0.3)",
    color: verified ? "#10b981" : "#fbbf24",
  }}>
    {verified ? "✓ Verified" : "Unverified"}
  </span>
);

const Divider = () => (
  <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", margin: "20px 0" }} />
);

export default function Profile() {
  const { user, profileData, updateProfile } = useAuth();
  const [draft, setDraft] = useState(EMPTY);
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (profileData) setDraft({ ...EMPTY, ...profileData });
  }, [profileData]);

  const form = profileData ? { ...EMPTY, ...profileData } : EMPTY;
  const hasAnyData = Object.values(form).some((v) => v.trim?.() !== "");

  const set = (field) => (e) => setDraft((d) => ({ ...d, [field]: e.target.value }));

  const startEdit = () => { setDraft({ ...EMPTY, ...form }); setEditing(true); setSaved(false); };
  const cancel = () => { setDraft({ ...EMPTY, ...form }); setEditing(false); };

  const save = () => {
    updateProfile(draft);
    setSaved(true);
    setEditing(false);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: "#f1f5f9", marginBottom: 6, letterSpacing: "-0.02em" }}>My Profile</h2>
          <p style={{ fontSize: 14, color: "#64748b" }}>Stored locally on your device. Never shared.</p>
        </div>
        {!editing && (
          <button onClick={startEdit} style={{ padding: "8px 18px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, color: "#94a3b8", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: FONT, flexShrink: 0 }}>
            ✏️ {hasAnyData ? "Edit Profile" : "Set Up Profile"}
          </button>
        )}
      </div>

      {saved && (
        <div style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.25)", borderRadius: 12, padding: "12px 16px", marginBottom: 16, fontSize: 14, color: "#10b981", fontWeight: 600 }}>
          ✓ Profile saved
        </div>
      )}

      {/* Single card for everything */}
      <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 18, padding: 28 }}>

        {/* Account / Verification section */}
        <div style={{ fontSize: 11, fontWeight: 700, color: "#10b981", letterSpacing: "0.12em", marginBottom: 18 }}>ACCOUNT</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <InfoVal
            label="Phone Number"
            value={user?.phoneNumber}
            badge={<VerifiedBadge verified={true} />}
          />
          {editing ? (
            <div>
              <Label optional>Email</Label>
              {inp(draft.email, set("email"), { type: "email", placeholder: "you@example.com" })}
            </div>
          ) : (
            <InfoVal
              label="Email"
              value={form.email}
              optional
              badge={form.email ? <VerifiedBadge verified={false} /> : null}
            />
          )}
        </div>

        <Divider />

        {/* Personal info */}
        <div style={{ fontSize: 11, fontWeight: 700, color: "#10b981", letterSpacing: "0.12em", marginBottom: 18 }}>PERSONAL INFORMATION</div>
        {editing ? (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 12 }}>
              <div><Label>First Name</Label>{inp(draft.firstName, set("firstName"), { placeholder: "Jane" })}</div>
              <div><Label optional>Middle Name</Label>{inp(draft.middleName, set("middleName"), { placeholder: "Optional" })}</div>
              <div><Label>Last Name</Label>{inp(draft.lastName, set("lastName"), { placeholder: "Doe" })}</div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div><Label>Date of Birth</Label>{inp(draft.dob, set("dob"), { type: "date" })}</div>
              <div><Label>Gender</Label>{sel(draft.gender, set("gender"), GENDERS)}</div>
            </div>
          </>
        ) : (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 16 }}>
              <InfoVal label="First Name" value={form.firstName} />
              <InfoVal label="Middle Name" value={form.middleName} optional />
              <InfoVal label="Last Name" value={form.lastName} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <InfoVal label="Date of Birth" value={form.dob} />
              <InfoVal label="Gender" value={form.gender} />
            </div>
          </>
        )}

        <Divider />

        {/* Address */}
        <div style={{ fontSize: 11, fontWeight: 700, color: "#10b981", letterSpacing: "0.12em", marginBottom: 18 }}>ADDRESS</div>
        {editing ? (
          <>
            <div style={{ marginBottom: 12 }}>
              <Label>Street Address</Label>
              {inp(draft.street, set("street"), { placeholder: "123 Main St" })}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 100px 90px", gap: 12 }}>
              <div><Label>City</Label>{inp(draft.city, set("city"), { placeholder: "El Centro" })}</div>
              <div><Label>State</Label>{sel(draft.state, set("state"), US_STATES)}</div>
              <div><Label>ZIP</Label>{inp(draft.zip, set("zip"), { placeholder: "92243" })}</div>
            </div>
          </>
        ) : (
          <>
            <div style={{ marginBottom: 16 }}>
              <InfoVal label="Street Address" value={form.street} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 100px 90px", gap: 16 }}>
              <InfoVal label="City" value={form.city} />
              <InfoVal label="State" value={form.state} />
              <InfoVal label="ZIP" value={form.zip} />
            </div>
          </>
        )}

        <Divider />

        {/* Insurance */}
        <div style={{ fontSize: 11, fontWeight: 700, color: "#10b981", letterSpacing: "0.12em", marginBottom: 18 }}>INSURANCE</div>
        {editing ? (
          <div><Label>Insurance Provider</Label>{sel(draft.insuranceProvider, set("insuranceProvider"), INSURERS)}</div>
        ) : (
          <InfoVal label="Insurance Provider" value={form.insuranceProvider} />
        )}
      </div>

      {/* Edit actions */}
      {editing && (
        <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
          <button onClick={cancel} style={{ flex: 1, padding: "14px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, color: "#64748b", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: FONT }}>
            Cancel
          </button>
          <button onClick={save} style={{ flex: 2, padding: "14px", background: "linear-gradient(135deg, #10b981, #059669)", color: "#fff", border: "none", borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: FONT, boxShadow: "0 8px 28px rgba(16,185,129,0.35)" }}>
            Save Changes
          </button>
        </div>
      )}
    </div>
  );
}
