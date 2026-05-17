import { useState, useEffect } from "react";
import { collection, addDoc, onSnapshot, query, orderBy, serverTimestamp, limit } from "firebase/firestore";
import { db } from "./firebase";
import { useAuth } from "./AuthContext";

const FONT = "'Inter', system-ui, sans-serif";
const IS = { width: "100%", padding: "10px 13px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, fontSize: 14, color: "#f1f5f9", fontFamily: FONT, outline: "none", boxSizing: "border-box" };

const INSURANCE_TYPES = [
  { value: "employer", label: "Employer Insurance" },
  { value: "private", label: "Private / Marketplace" },
  { value: "medicare", label: "Medicare" },
  { value: "medicaid", label: "Medicaid" },
  { value: "uninsured", label: "Uninsured / Cash Pay" },
];

const INSURANCE_COLORS = {
  employer: "#60a5fa",
  private: "#a78bfa",
  medicare: "#34d399",
  medicaid: "#10b981",
  uninsured: "#fbbf24",
};

const US_STATES = ["AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY","DC"];

const EMPTY = { procedure: "", hospital: "", city: "", state: "", amount: "", insuranceType: "employer" };

function timeAgo(ts) {
  if (!ts) return "";
  const secs = Math.floor((Date.now() - ts.toMillis()) / 1000);
  if (secs < 60) return "just now";
  if (secs < 3600) return `${Math.floor(secs / 60)}m ago`;
  if (secs < 86400) return `${Math.floor(secs / 3600)}h ago`;
  return `${Math.floor(secs / 86400)}d ago`;
}

export default function CommunityPriceBoard() {
  const { user } = useAuth();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [stateFilter, setStateFilter] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const q = query(collection(db, "price_reports"), orderBy("createdAt", "desc"), limit(200));
    const unsub = onSnapshot(q, snap => {
      setReports(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
    return unsub;
  }, []);

  const submit = async () => {
    if (!form.procedure.trim() || !form.amount || saving) return;
    setSaving(true);
    try {
      await addDoc(collection(db, "price_reports"), {
        procedure: form.procedure.trim().toLowerCase(),
        procedureDisplay: form.procedure.trim(),
        hospital: form.hospital.trim(),
        city: form.city.trim(),
        state: form.state,
        amount: parseFloat(form.amount),
        insuranceType: form.insuranceType,
        uid: user?.uid || null,
        createdAt: serverTimestamp(),
      });
      setForm(EMPTY);
      setShowForm(false);
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
    } finally {
      setSaving(false);
    }
  };

  const filtered = reports.filter(r => {
    const matchSearch = !search || r.procedure?.includes(search.toLowerCase()) || r.procedureDisplay?.toLowerCase().includes(search.toLowerCase()) || r.hospital?.toLowerCase().includes(search.toLowerCase());
    const matchState = !stateFilter || r.state === stateFilter;
    return matchSearch && matchState;
  });

  const getMedian = (proc) => {
    const prices = reports.filter(r => r.procedure === proc.toLowerCase()).map(r => r.amount).sort((a, b) => a - b);
    if (!prices.length) return null;
    const mid = Math.floor(prices.length / 2);
    return prices.length % 2 ? prices[mid] : (prices[mid - 1] + prices[mid]) / 2;
  };

  return (
    <div>
      <div style={{ textAlign: "center", marginBottom: 28 }}>
        <h1 style={{ fontSize: "clamp(22px, 6vw, 32px)", fontWeight: 900, letterSpacing: "-0.03em", marginBottom: 8, color: "#f1f5f9" }}>
          Community <span style={{ color: "#10b981", textShadow: "0 0 20px rgba(16,185,129,0.4)" }}>Price Board</span>
        </h1>
        <p style={{ fontSize: 15, color: "#64748b", lineHeight: 1.6, maxWidth: 480, margin: "0 auto" }}>
          Real prices paid by real patients. What people actually paid near you — submitted anonymously.
        </p>
      </div>

      {submitted && (
        <div style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.25)", borderRadius: 12, padding: "12px 16px", marginBottom: 16, fontSize: 14, color: "#10b981", fontWeight: 600, display: "flex", alignItems: "center", gap: 8 }}>
          ✓ Thank you! Your price report helps other patients.
        </div>
      )}

      <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by procedure or hospital..."
          style={{ ...IS, flex: 1, minWidth: 200 }}
        />
        <select value={stateFilter} onChange={e => setStateFilter(e.target.value)} style={{ ...IS, width: "auto", cursor: "pointer" }}>
          <option value="">All states</option>
          {US_STATES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <button
          onClick={() => { setShowForm(!showForm); setForm(EMPTY); }}
          style={{ padding: "10px 20px", background: showForm ? "rgba(255,255,255,0.04)" : "linear-gradient(135deg, #10b981, #059669)", color: showForm ? "#64748b" : "#fff", border: showForm ? "1px solid rgba(255,255,255,0.08)" : "none", borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: FONT, flexShrink: 0 }}
        >
          {showForm ? "✕ Cancel" : "+ Share a Price"}
        </button>
      </div>

      {showForm && (
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 16, padding: 20, marginBottom: 20 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#475569", letterSpacing: "0.08em", marginBottom: 14 }}>SUBMIT A PRICE REPORT — All submissions are anonymous</div>
          <div style={{ marginBottom: 12 }}>
            <label style={{ fontSize: 11, fontWeight: 700, color: "#475569", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>Procedure / Service *</label>
            <input value={form.procedure} onChange={e => setForm(f => ({ ...f, procedure: e.target.value }))} placeholder="e.g. colonoscopy, MRI lumbar spine, knee replacement" style={IS} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: "#475569", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>Amount You Paid ($) *</label>
              <input type="number" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} placeholder="e.g. 1200" style={IS} />
            </div>
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: "#475569", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>Insurance Type</label>
              <select value={form.insuranceType} onChange={e => setForm(f => ({ ...f, insuranceType: e.target.value }))} style={{ ...IS, cursor: "pointer" }}>
                {INSURANCE_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: 12, marginBottom: 16 }}>
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: "#475569", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>Hospital / Facility <span style={{ fontWeight: 400, textTransform: "none", color: "#334155" }}>optional</span></label>
              <input value={form.hospital} onChange={e => setForm(f => ({ ...f, hospital: e.target.value }))} placeholder="e.g. Memorial Hospital" style={IS} />
            </div>
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: "#475569", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>City <span style={{ fontWeight: 400, textTransform: "none", color: "#334155" }}>optional</span></label>
              <input value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} placeholder="e.g. Dallas" style={IS} />
            </div>
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: "#475569", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>State</label>
              <select value={form.state} onChange={e => setForm(f => ({ ...f, state: e.target.value }))} style={{ ...IS, cursor: "pointer" }}>
                <option value="">—</option>
                {US_STATES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <button onClick={submit} disabled={!form.procedure.trim() || !form.amount || saving} style={{ width: "100%", padding: 13, background: !form.procedure.trim() || !form.amount || saving ? "rgba(255,255,255,0.05)" : "linear-gradient(135deg, #10b981, #059669)", color: !form.procedure.trim() || !form.amount || saving ? "#334155" : "#fff", border: "none", borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: !form.procedure.trim() || !form.amount || saving ? "default" : "pointer", fontFamily: FONT }}>
            {saving ? "Submitting..." : "👥 Submit Price Report"}
          </button>
        </div>
      )}

      {loading && <div style={{ textAlign: "center", padding: 40, color: "#334155", fontFamily: FONT }}>Loading prices...</div>}

      {!loading && filtered.length === 0 && (
        <div style={{ textAlign: "center", padding: "40px 20px" }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>👥</div>
          <div style={{ fontSize: 14, fontWeight: 600, color: "#475569", marginBottom: 6, fontFamily: FONT }}>{search || stateFilter ? "No results match your search" : "No prices reported yet"}</div>
          <div style={{ fontSize: 13, color: "#334155", fontFamily: FONT }}>Be the first to share what you paid — it helps thousands of patients.</div>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {filtered.map(r => {
          const insColor = INSURANCE_COLORS[r.insuranceType] || "#64748b";
          const insLabel = INSURANCE_TYPES.find(t => t.value === r.insuranceType)?.label || r.insuranceType;
          const median = getMedian(r.procedureDisplay || r.procedure);
          const isAboveMedian = median && r.amount > median * 1.2;
          const isBelowMedian = median && r.amount < median * 0.8;
          return (
            <div key={r.id} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: "16px 18px" }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#f1f5f9", marginBottom: 4 }}>{r.procedureDisplay || r.procedure}</div>
                  <div style={{ fontSize: 12, color: "#475569", display: "flex", gap: 10, flexWrap: "wrap" }}>
                    {r.hospital && <span>{r.hospital}</span>}
                    {(r.city || r.state) && <span>· {[r.city, r.state].filter(Boolean).join(", ")}</span>}
                    {r.createdAt && <span>· {timeAgo(r.createdAt)}</span>}
                  </div>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <div style={{ fontSize: 20, fontWeight: 900, color: isAboveMedian ? "#f87171" : isBelowMedian ? "#34d399" : "#f1f5f9", fontFamily: FONT }}>${r.amount?.toLocaleString()}</div>
                  {isAboveMedian && <div style={{ fontSize: 10, color: "#f87171", fontWeight: 700 }}>↑ above typical</div>}
                  {isBelowMedian && <div style={{ fontSize: 10, color: "#34d399", fontWeight: 700 }}>↓ below typical</div>}
                </div>
              </div>
              <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                <span style={{ fontSize: 10, fontWeight: 700, color: insColor, background: `${insColor}18`, border: `1px solid ${insColor}30`, padding: "2px 8px", borderRadius: 8 }}>{insLabel}</span>
                {median && <span style={{ fontSize: 11, color: "#475569" }}>Median for this procedure: <strong style={{ color: "#94a3b8" }}>${median.toLocaleString()}</strong></span>}
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length > 0 && (
        <div style={{ textAlign: "center", marginTop: 20, fontSize: 12, color: "#334155", fontFamily: FONT }}>
          {filtered.length} price report{filtered.length !== 1 ? "s" : ""} · All submissions are anonymous
        </div>
      )}
    </div>
  );
}
