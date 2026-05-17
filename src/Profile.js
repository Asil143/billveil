import { useState, useRef, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { sendSignInLinkToEmail } from "firebase/auth";
import { auth } from "./firebase";
import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase";

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

const STATE_MAP = {
  "Alabama":"AL","Alaska":"AK","Arizona":"AZ","Arkansas":"AR","California":"CA",
  "Colorado":"CO","Connecticut":"CT","Delaware":"DE","Florida":"FL","Georgia":"GA",
  "Hawaii":"HI","Idaho":"ID","Illinois":"IL","Indiana":"IN","Iowa":"IA",
  "Kansas":"KS","Kentucky":"KY","Louisiana":"LA","Maine":"ME","Maryland":"MD",
  "Massachusetts":"MA","Michigan":"MI","Minnesota":"MN","Mississippi":"MS",
  "Missouri":"MO","Montana":"MT","Nebraska":"NE","Nevada":"NV","New Hampshire":"NH",
  "New Jersey":"NJ","New Mexico":"NM","New York":"NY","North Carolina":"NC",
  "North Dakota":"ND","Ohio":"OH","Oklahoma":"OK","Oregon":"OR","Pennsylvania":"PA",
  "Rhode Island":"RI","South Carolina":"SC","South Dakota":"SD","Tennessee":"TN",
  "Texas":"TX","Utah":"UT","Vermont":"VT","Virginia":"VA","Washington":"WA",
  "West Virginia":"WV","Wisconsin":"WI","Wyoming":"WY","District of Columbia":"DC",
};

const rateKey = (uid) => `bv_verify_rate_${uid}`;
const canSendVerification = (uid) => {
  const today = new Date().toISOString().slice(0, 10);
  try {
    const raw = localStorage.getItem(rateKey(uid));
    const r = raw ? JSON.parse(raw) : null;
    return !r || r.date !== today || r.count < 3;
  } catch { return true; }
};
const recordVerificationSend = (uid) => {
  const today = new Date().toISOString().slice(0, 10);
  try {
    const raw = localStorage.getItem(rateKey(uid));
    const r = raw ? JSON.parse(raw) : null;
    const count = r?.date === today ? r.count + 1 : 1;
    localStorage.setItem(rateKey(uid), JSON.stringify({ date: today, count }));
  } catch {}
};

const EMPTY = {
  firstName: "", middleName: "", lastName: "", dob: "", gender: "",
  insuranceProvider: "", insuranceOther: "", planName: "", memberId: "", groupNumber: "",
  email: "",
  street: "", city: "", state: "", zip: "",
  primaryDoctor: "", hasHSA: false,
};

const toProperCase = (str) =>
  str.replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());

const IS = {
  width: "100%", padding: "11px 14px",
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: 10, fontSize: 14, color: "#f1f5f9",
  fontFamily: FONT, outline: "none", boxSizing: "border-box",
};
const onFo = (e) => (e.target.style.borderColor = "rgba(16,185,129,0.5)");
const onBl = (e) => (e.target.style.borderColor = "rgba(255,255,255,0.08)");

const Label = ({ children, optional }) => (
  <div style={{ fontSize: 11, fontWeight: 700, color: "#475569", marginBottom: 6, letterSpacing: "0.06em", textTransform: "uppercase", display: "flex", alignItems: "center", gap: 6 }}>
    {children}
    {optional && <span style={{ fontSize: 10, fontWeight: 500, color: "#334155", textTransform: "none", letterSpacing: 0 }}>optional</span>}
  </div>
);

const InfoRow = ({ label, value, optional, right }) => (
  <div>
    <Label optional={optional}>{label}</Label>
    <div style={{ display: "flex", alignItems: "center", gap: 8, minHeight: 22, flexWrap: "wrap" }}>
      <span style={{ fontSize: 14, color: value ? "#f1f5f9" : "#334155" }}>{value || "—"}</span>
      {right}
    </div>
  </div>
);

const VerifiedBadge = () => (
  <span style={{
    display: "inline-flex", alignItems: "center", gap: 4, padding: "2px 9px",
    borderRadius: 20, fontSize: 10, fontWeight: 700, flexShrink: 0,
    background: "rgba(16,185,129,0.1)",
    border: "1px solid rgba(16,185,129,0.3)",
    color: "#10b981",
  }}>
    ✓ Verified
  </span>
);

const Divider = () => <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", margin: "22px 0" }} />;

const SectionTitle = ({ children }) => (
  <div style={{ fontSize: 11, fontWeight: 700, color: "#10b981", letterSpacing: "0.12em", marginBottom: 18 }}>
    {children}
  </div>
);

const formatSuggestion = (item) => {
  const a = item.address;
  const street = [a.house_number, a.road].filter(Boolean).join(" ");
  const city = a.city || a.town || a.village || a.municipality || a.county || "";
  const state = STATE_MAP[a.state] || a.state || "";
  const zip = a.postcode?.split("-")[0] || "";
  return [street, city, state, zip].filter(Boolean).join(", ");
};

export default function Profile() {
  const { user, profileData, updateProfile, emailVerified } = useAuth();
  const [draft, setDraft] = useState(EMPTY);
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [verifyStatus, setVerifyStatus] = useState(null);
  const debounceRef = useRef(null);
  const pollRef = useRef(null);

  const form = { ...EMPTY, ...(profileData || {}) };
  const hasAnyData = Object.entries(form).some(([k, v]) => k !== "hasHSA" ? String(v).trim() !== "" : v);
  const isEmailVerified = emailVerified && !!form.email;

  const emailLockDate = form.emailLockedUntil ? new Date(form.emailLockedUntil) : null;
  const emailLocked = isEmailVerified && emailLockDate && new Date() < emailLockDate;
  const emailUnlockDate = emailLockDate?.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

  const hasPersonalInfo = !!(form.firstName || form.lastName || form.dob || form.gender || form.middleName);
  const hasInsurance = !!(form.insuranceProvider || form.planName || form.memberId || form.groupNumber);
  const hasAddress = !!(form.street || form.city || form.state || form.zip);
  const hasHealthcare = !!(form.primaryDoctor || form.hasHSA);

  // Poll Firestore every 4s after sending verification link
  const startPolling = (email) => {
    clearInterval(pollRef.current);
    pollRef.current = setInterval(async () => {
      try {
        const key = email.toLowerCase().replace(/\./g, "_dot_").replace(/@/g, "_at_");
        const snap = await getDoc(doc(db, "email_verifications", key));
        if (snap.exists() && snap.data().verified) {
          clearInterval(pollRef.current);
          setVerifyStatus("confirmed");
          window.location.reload(); // reload to pick up fresh auth state
        }
      } catch {}
    }, 4000);
  };

  useEffect(() => () => clearInterval(pollRef.current), []);

  useEffect(() => {
    if (isEmailVerified && form.email && profileData && !profileData.emailLockedUntil) {
      const lockUntil = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
      updateProfile({ ...profileData, emailLockedUntil: lockUntil });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEmailVerified, profileData?.emailLockedUntil]);

  const set = (field) => (e) => setDraft((d) => ({ ...d, [field]: e.target.value }));

  const startEdit = () => { setDraft({ ...EMPTY, ...form }); setEditing(true); setSaved(false); setVerifyStatus(null); };
  const cancel = () => { setEditing(false); setSuggestions([]); };
  const save = () => {
    const toSave = { ...draft };
    if (draft.email?.trim()?.toLowerCase() !== form.email?.trim()?.toLowerCase()) {
      delete toSave.emailLockedUntil;
    }
    updateProfile(toSave);
    setSaved(true);
    setEditing(false);
    setSuggestions([]);
    setTimeout(() => setSaved(false), 3000);
  };

  // Address autocomplete
  const handleStreetChange = (e) => {
    const value = e.target.value;
    setDraft((d) => ({ ...d, street: value }));
    setSuggestions([]);
    clearTimeout(debounceRef.current);
    if (value.length < 5) return;
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(value)}&format=json&addressdetails=1&limit=5&countrycodes=us`,
          { headers: { "Accept-Language": "en" } }
        );
        const data = await res.json();
        setSuggestions(data.filter((d) => d.address?.road));
      } catch {}
    }, 450);
  };

  const pickAddress = (item) => {
    const a = item.address;
    setDraft((d) => ({
      ...d,
      street: [a.house_number, a.road].filter(Boolean).join(" "),
      city: a.city || a.town || a.village || a.municipality || a.county || "",
      state: STATE_MAP[a.state] || a.state || "",
      zip: a.postcode?.split("-")[0] || "",
    }));
    setSuggestions([]);
  };

  // ZIP → city + state auto-fill
  const handleZipChange = async (e) => {
    const zip = e.target.value.replace(/\D/g, "").slice(0, 5);
    setDraft((d) => ({ ...d, zip }));
    if (zip.length === 5) {
      try {
        const res = await fetch(`https://api.zippopotam.us/us/${zip}`);
        if (res.ok) {
          const data = await res.json();
          setDraft((d) => ({
            ...d, zip,
            city: data.places[0]["place name"],
            state: data.places[0]["state abbreviation"],
          }));
        }
      } catch {}
    }
  };

  // Email verification via Firebase Email Link
  const sendVerification = async () => {
    if (!canSendVerification(user.uid)) {
      setVerifyStatus("rate-limited");
      return;
    }
    setVerifyStatus("sending");
    try {
      await sendSignInLinkToEmail(auth, form.email, {
        url: `${window.location.origin}/?uid=${encodeURIComponent(user.uid)}&bvemail=${encodeURIComponent(form.email)}`,
        handleCodeInApp: true,
      });
      localStorage.setItem("bv_pending_email", form.email);
      recordVerificationSend(user.uid);
      setVerifyStatus("sent");
      startPolling(form.email);
    } catch (err) {
      console.error("Email verify:", err.code, err.message);
      setVerifyStatus("error");
    }
  };

  const inp = (field, extra = {}) => (
    <input value={draft[field]} onChange={set(field)} style={IS} onFocus={onFo} onBlur={onBl} {...extra} />
  );

  const sel = (field, options) => (
    <select value={draft[field]} onChange={set(field)} style={{ ...IS, cursor: "pointer" }}>
      <option value="">Select...</option>
      {options.map((o) => <option key={o} value={o}>{o}</option>)}
    </select>
  );

  return (
    <div>
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

      <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 18, padding: 28 }}>

        {/* 1 — PERSONAL INFO */}
        {(editing || hasPersonalInfo) && <>
          <SectionTitle>PERSONAL INFORMATION</SectionTitle>
          {editing ? (
            <>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 12 }}>
                <div><Label>First Name</Label>{inp("firstName", { placeholder: "Jane" })}</div>
                <div><Label optional>Middle Name</Label>{inp("middleName", { placeholder: "Optional" })}</div>
                <div><Label>Last Name</Label>{inp("lastName", { placeholder: "Doe" })}</div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div><Label>Date of Birth</Label>{inp("dob", { type: "date" })}</div>
                <div><Label>Gender</Label>{sel("gender", GENDERS)}</div>
              </div>
            </>
          ) : (
            <>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 16 }}>
                <InfoRow label="First Name" value={form.firstName} />
                <InfoRow label="Middle Name" value={form.middleName} optional />
                <InfoRow label="Last Name" value={form.lastName} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <InfoRow label="Date of Birth" value={form.dob} />
                <InfoRow label="Gender" value={form.gender} />
              </div>
            </>
          )}
          {(editing || hasInsurance) && <Divider />}
        </>}

        {/* 2 — INSURANCE */}
        {(editing || hasInsurance) && <>
          <SectionTitle>INSURANCE</SectionTitle>
          {editing ? (
            <>
              <div style={{ marginBottom: 12 }}>
                <Label>Insurance Provider</Label>
                {sel("insuranceProvider", INSURERS)}
                {draft.insuranceProvider === "Other" && (
                  <input
                    value={draft.insuranceOther}
                    onChange={(e) => setDraft((d) => ({ ...d, insuranceOther: toProperCase(e.target.value) }))}
                    placeholder="Type your insurance company name"
                    style={{ ...IS, marginTop: 8 }}
                    onFocus={onFo}
                    onBlur={onBl}
                    autoFocus
                  />
                )}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
                <div><Label optional>Plan Name</Label>{inp("planName", { placeholder: "e.g. PPO Gold" })}</div>
                <div><Label optional>Member ID</Label>{inp("memberId", { placeholder: "e.g. W123456789" })}</div>
              </div>
              <div>
                <Label optional>Group Number</Label>
                {inp("groupNumber", { placeholder: "e.g. 78234" })}
              </div>
            </>
          ) : (
            <>
              <div style={{ marginBottom: 16 }}>
                <InfoRow label="Insurance Provider" value={form.insuranceProvider === "Other" ? form.insuranceOther || "Other" : form.insuranceProvider} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                <InfoRow label="Plan Name" value={form.planName} optional />
                <InfoRow label="Member ID" value={form.memberId} optional />
              </div>
              <InfoRow label="Group Number" value={form.groupNumber} optional />
            </>
          )}
          <Divider />
        </>}

        {/* 3 — CONTACT & VERIFICATION */}
        <SectionTitle>CONTACT &amp; VERIFICATION</SectionTitle>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: editing ? 12 : 16 }}>

          {/* Phone — always verified */}
          <div>
            <Label>Phone Number</Label>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 2 }}>
              <span style={{ fontSize: 14, color: "#f1f5f9" }}>{user?.phoneNumber || "—"}</span>
              <VerifiedBadge />
            </div>
            <div style={{ marginTop: 5, fontSize: 11, color: "#475569" }}>🔒 Cannot be changed</div>
          </div>

          {/* Email */}
          {editing ? (
            <div>
              <Label optional>Email Address</Label>
              {emailLocked ? (
                <>
                  <div style={{ ...IS, cursor: "not-allowed", color: "#64748b", display: "flex", alignItems: "center", gap: 8 }}>
                    🔒 {form.email}
                  </div>
                  <div style={{ marginTop: 6, fontSize: 11, color: "#475569", lineHeight: 1.6 }}>
                    Locked until {emailUnlockDate}.{" "}
                    <a href="mailto:support@billveil.com" style={{ color: "#10b981", textDecoration: "none" }}>Contact Support</a>
                    {" "}to change it early.
                  </div>
                </>
              ) : (
                inp("email", { type: "email", placeholder: "you@example.com" })
              )}
            </div>
          ) : (
            <div>
              <Label optional>Email Address</Label>
              {form.email ? (
                <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginTop: 2 }}>
                  <span style={{ fontSize: 14, color: "#f1f5f9" }}>{form.email}</span>
                  {isEmailVerified ? (
                    <VerifiedBadge />
                  ) : verifyStatus === "confirmed" ? (
                    <span style={{ fontSize: 11, color: "#10b981", fontWeight: 600 }}>✓ Verified! Refreshing…</span>
                  ) : verifyStatus === "sent" ? (
                    <span style={{ fontSize: 11, color: "#64748b", fontWeight: 600 }}>Link sent — waiting for you to click it…</span>
                  ) : verifyStatus === "error" ? (
                    <button onClick={sendVerification} style={{ fontSize: 11, fontWeight: 700, color: "#f87171", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: 8, padding: "3px 10px", cursor: "pointer", fontFamily: FONT }}>
                      Failed — retry →
                    </button>
                  ) : verifyStatus === "rate-limited" ? (
                    <span style={{ fontSize: 11, color: "#f87171", fontWeight: 600 }}>3/day limit reached</span>
                  ) : (
                    <button onClick={sendVerification} disabled={verifyStatus === "sending"} style={{ fontSize: 11, fontWeight: 700, color: "#f59e0b", background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.3)", borderRadius: 8, padding: "3px 10px", cursor: "pointer", fontFamily: FONT }}>
                      {verifyStatus === "sending" ? "Sending..." : "Verify →"}
                    </button>
                  )}
                </div>
              ) : (
                <div style={{ marginTop: 4 }}>
                  <button onClick={startEdit} style={{ fontSize: 12, fontWeight: 600, color: "#10b981", background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: 8, padding: "5px 12px", cursor: "pointer", fontFamily: FONT }}>
                    + Add &amp; Verify Email
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {(editing || hasAddress) && <Divider />}

        {/* 4 — ADDRESS */}
        {(editing || hasAddress) && <>
          <SectionTitle>ADDRESS</SectionTitle>
          {editing ? (
            <>
              <div style={{ marginBottom: 12, position: "relative" }}>
                <Label>Street Address</Label>
                <input
                  value={draft.street}
                  onChange={handleStreetChange}
                  placeholder="Start typing your address…"
                  style={IS}
                  onFocus={onFo}
                  onBlur={(e) => { onBl(e); setTimeout(() => setSuggestions([]), 200); }}
                  autoComplete="off"
                />
                {suggestions.length > 0 && (
                  <div style={{ position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0, background: "#0d1526", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 10, zIndex: 50, overflow: "hidden", boxShadow: "0 8px 32px rgba(0,0,0,0.5)" }}>
                    {suggestions.map((s, i) => (
                      <button key={i} onMouseDown={() => pickAddress(s)}
                        style={{ width: "100%", padding: "10px 14px", background: "none", border: "none", borderBottom: i < suggestions.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none", color: "#94a3b8", fontSize: 13, textAlign: "left", cursor: "pointer", fontFamily: FONT, display: "block" }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.05)")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
                      >
                        📍 {formatSuggestion(s)}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 110px 100px", gap: 12 }}>
                <div><Label>City</Label>{inp("city", { placeholder: "City" })}</div>
                <div><Label>State</Label>{sel("state", US_STATES)}</div>
                <div>
                  <Label>ZIP</Label>
                  <input value={draft.zip} onChange={handleZipChange} placeholder="12345" maxLength={5} style={IS} onFocus={onFo} onBlur={onBl} />
                </div>
              </div>
              <div style={{ marginTop: 8, fontSize: 11, color: "#334155" }}>💡 Type your street address to auto-fill city, state &amp; ZIP — or enter ZIP alone to auto-fill city &amp; state</div>
            </>
          ) : (
            <>
              <div style={{ marginBottom: 16 }}>
                <InfoRow label="Street Address" value={form.street} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 110px 100px", gap: 16 }}>
                <InfoRow label="City" value={form.city} />
                <InfoRow label="State" value={form.state} />
                <InfoRow label="ZIP" value={form.zip} />
              </div>
            </>
          )}
          {(editing || hasHealthcare) && <Divider />}
        </>}

        {/* 5 — HEALTHCARE DETAILS */}
        {(editing || hasHealthcare) && <>
          <SectionTitle>HEALTHCARE DETAILS</SectionTitle>
          {editing ? (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div>
                <Label optional>Primary Care Doctor</Label>
                {inp("primaryDoctor", { placeholder: "Dr. Smith" })}
              </div>
              <div style={{ display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
                <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", padding: "11px 14px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10 }}>
                  <input
                    type="checkbox"
                    checked={draft.hasHSA}
                    onChange={(e) => setDraft((d) => ({ ...d, hasHSA: e.target.checked }))}
                    style={{ width: 16, height: 16, accentColor: "#10b981", cursor: "pointer" }}
                  />
                  <span style={{ fontSize: 14, color: "#94a3b8" }}>I have an HSA / FSA account</span>
                </label>
              </div>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <InfoRow label="Primary Care Doctor" value={form.primaryDoctor} optional />
              <div>
                <Label optional>HSA / FSA</Label>
                <span style={{ fontSize: 14, color: form.hasHSA ? "#10b981" : "#334155" }}>
                  {form.hasHSA ? "✓ Has HSA/FSA account" : "—"}
                </span>
              </div>
            </div>
          )}
        </>}

      </div>

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
