import { useState, useEffect } from "react";
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, orderBy, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";
import { useAuth } from "./AuthContext";

const FONT = "'Inter', system-ui, sans-serif";

const STATUS_CONFIG = {
  open: { label: "Open", color: "#60a5fa", bg: "rgba(96,165,250,0.12)" },
  in_progress: { label: "In Progress", color: "#fbbf24", bg: "rgba(251,191,36,0.12)" },
  appealed: { label: "Appealed", color: "#a78bfa", bg: "rgba(167,139,250,0.12)" },
  won: { label: "Won ✓", color: "#34d399", bg: "rgba(52,211,153,0.12)" },
  lost: { label: "Lost", color: "#f87171", bg: "rgba(248,113,113,0.12)" },
  closed: { label: "Closed", color: "#475569", bg: "rgba(71,85,105,0.12)" },
};

const STATUS_NEXT = {
  open: ["in_progress", "won", "lost", "closed"],
  in_progress: ["appealed", "won", "lost", "closed"],
  appealed: ["won", "lost", "closed"],
  won: ["closed"],
  lost: ["closed"],
  closed: [],
};

const CASE_TYPES = [
  { value: "dispute", label: "Dispute Letter" },
  { value: "denial", label: "Denial Appeal" },
  { value: "negotiate", label: "Negotiation" },
  { value: "charitycare", label: "Charity Care" },
  { value: "paymentplan", label: "Payment Plan" },
  { value: "surprisebill", label: "Surprise Bill" },
  { value: "other", label: "Other" },
];

const IS = { width: "100%", padding: "10px 13px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, fontSize: 14, color: "#f1f5f9", fontFamily: FONT, outline: "none", boxSizing: "border-box" };

function DeadlineBadge({ deadline }) {
  if (!deadline) return null;
  const days = Math.ceil((new Date(deadline) - new Date()) / 86400000);
  const color = days < 0 ? "#f87171" : days <= 7 ? "#fbbf24" : "#64748b";
  const label = days < 0 ? `${Math.abs(days)}d overdue` : days === 0 ? "Due today" : `${days}d left`;
  return (
    <span style={{ fontSize: 10, fontWeight: 700, color, background: `${color}18`, border: `1px solid ${color}30`, padding: "2px 8px", borderRadius: 8, flexShrink: 0 }}>
      ⏱ {label}
    </span>
  );
}

const EMPTY_FORM = { title: "", type: "dispute", hospital: "", amountBilled: "", deadline: "", notes: "" };

export default function CaseTracker() {
  const { user, showLoginModal } = useAuth();
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [expandedId, setExpandedId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    const q = query(collection(db, "users", user.uid, "cases"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      setCases(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
    return unsub;
  }, [user]);

  const addCase = async () => {
    if (!form.title.trim() || saving) return;
    setSaving(true);
    try {
      await addDoc(collection(db, "users", user.uid, "cases"), {
        ...form,
        amountBilled: parseFloat(form.amountBilled) || 0,
        amountSaved: 0,
        status: "open",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      setForm(EMPTY_FORM);
      setShowForm(false);
    } finally {
      setSaving(false);
    }
  };

  const updateStatus = async (id, status) => {
    await updateDoc(doc(db, "users", user.uid, "cases", id), { status, updatedAt: serverTimestamp() });
  };

  const updateSaved = async (id, amountSaved) => {
    const val = parseFloat(amountSaved);
    if (isNaN(val)) return;
    await updateDoc(doc(db, "users", user.uid, "cases", id), { amountSaved: val, updatedAt: serverTimestamp() });
  };

  const deleteCase = async (id) => {
    await deleteDoc(doc(db, "users", user.uid, "cases", id));
    setDeleteConfirm(null);
    if (expandedId === id) setExpandedId(null);
  };

  if (!user) {
    return (
      <div style={{ textAlign: "center", padding: "60px 20px" }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>📊</div>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: "#f1f5f9", marginBottom: 8 }}>Case Tracker</h2>
        <p style={{ fontSize: 14, color: "#64748b", marginBottom: 24, lineHeight: 1.6 }}>Track every dispute, appeal, and negotiation — with deadlines and outcomes. Log in to get started.</p>
        <button onClick={showLoginModal} style={{ padding: "12px 28px", background: "linear-gradient(135deg, #10b981, #059669)", color: "#fff", border: "none", borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: FONT }}>Log In to Track Cases</button>
      </div>
    );
  }

  return (
    <div>
      <div style={{ textAlign: "center", marginBottom: 28 }}>
        <h1 style={{ fontSize: "clamp(22px, 6vw, 32px)", fontWeight: 900, letterSpacing: "-0.03em", marginBottom: 8, color: "#f1f5f9" }}>
          Case <span style={{ color: "#10b981", textShadow: "0 0 20px rgba(16,185,129,0.4)" }}>Tracker</span>
        </h1>
        <p style={{ fontSize: 15, color: "#64748b", lineHeight: 1.6, maxWidth: 460, margin: "0 auto" }}>
          Track every dispute, appeal, and negotiation — with deadlines and outcomes.
        </p>
      </div>

      <button
        onClick={() => { setShowForm(!showForm); setForm(EMPTY_FORM); }}
        style={{ width: "100%", padding: 14, background: showForm ? "rgba(255,255,255,0.04)" : "linear-gradient(135deg, #10b981, #059669)", color: showForm ? "#64748b" : "#fff", border: showForm ? "1px solid rgba(255,255,255,0.08)" : "none", borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: FONT, marginBottom: 16, boxShadow: showForm ? "none" : "0 8px 28px rgba(16,185,129,0.3)" }}
      >
        {showForm ? "✕ Cancel" : "+ Add New Case"}
      </button>

      {showForm && (
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 16, padding: 20, marginBottom: 20 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#475569", letterSpacing: "0.08em", marginBottom: 16 }}>NEW CASE</div>
          <div style={{ marginBottom: 12 }}>
            <label style={{ fontSize: 11, fontWeight: 700, color: "#475569", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>Case Title *</label>
            <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. ER visit overcharge dispute" style={IS} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: "#475569", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>Type</label>
              <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))} style={{ ...IS, cursor: "pointer" }}>
                {CASE_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: "#475569", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>Hospital / Provider</label>
              <input value={form.hospital} onChange={e => setForm(f => ({ ...f, hospital: e.target.value }))} placeholder="e.g. Memorial Hospital" style={IS} />
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: "#475569", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>Amount Billed ($)</label>
              <input type="number" value={form.amountBilled} onChange={e => setForm(f => ({ ...f, amountBilled: e.target.value }))} placeholder="e.g. 4200" style={IS} />
            </div>
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: "#475569", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>Deadline (optional)</label>
              <input type="date" value={form.deadline} onChange={e => setForm(f => ({ ...f, deadline: e.target.value }))} style={{ ...IS, colorScheme: "dark" }} />
            </div>
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 11, fontWeight: 700, color: "#475569", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>Notes (optional)</label>
            <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} placeholder="Reference numbers, contacts, what you sent..." style={{ ...IS, height: 70, resize: "vertical" }} />
          </div>
          <button onClick={addCase} disabled={!form.title.trim() || saving} style={{ width: "100%", padding: 13, background: !form.title.trim() || saving ? "rgba(255,255,255,0.05)" : "linear-gradient(135deg, #10b981, #059669)", color: !form.title.trim() || saving ? "#334155" : "#fff", border: "none", borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: !form.title.trim() || saving ? "default" : "pointer", fontFamily: FONT }}>
            {saving ? "Saving..." : "📊 Add Case"}
          </button>
        </div>
      )}

      {loading && <div style={{ textAlign: "center", padding: 40, color: "#334155" }}>Loading cases...</div>}

      {!loading && cases.length === 0 && !showForm && (
        <div style={{ textAlign: "center", padding: "40px 20px" }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>📋</div>
          <div style={{ fontSize: 15, fontWeight: 600, color: "#475569", marginBottom: 6 }}>No cases yet</div>
          <div style={{ fontSize: 13, color: "#334155", lineHeight: 1.6 }}>Click "Add New Case" to start tracking your first dispute or appeal.</div>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {cases.map(c => {
          const sc = STATUS_CONFIG[c.status] || STATUS_CONFIG.open;
          const isExpanded = expandedId === c.id;
          const typeLabel = CASE_TYPES.find(t => t.value === c.type)?.label || c.type;
          const nextStatuses = STATUS_NEXT[c.status] || [];
          return (
            <div key={c.id} style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${isExpanded ? "rgba(16,185,129,0.25)" : "rgba(255,255,255,0.08)"}`, borderRadius: 14, overflow: "hidden", transition: "border-color 0.2s" }}>
              <button
                onClick={() => setExpandedId(isExpanded ? null : c.id)}
                style={{ width: "100%", padding: "16px 18px", background: "none", border: "none", cursor: "pointer", textAlign: "left", fontFamily: FONT, display: "flex", alignItems: "center", gap: 12 }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 4 }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: "#f1f5f9" }}>{c.title}</span>
                    <span style={{ fontSize: 10, fontWeight: 700, color: sc.color, background: sc.bg, border: `1px solid ${sc.color}30`, padding: "2px 8px", borderRadius: 8 }}>{sc.label}</span>
                    <DeadlineBadge deadline={c.deadline} />
                  </div>
                  <div style={{ fontSize: 12, color: "#475569", display: "flex", gap: 12, flexWrap: "wrap" }}>
                    <span>{typeLabel}</span>
                    {c.hospital && <span>· {c.hospital}</span>}
                    {c.amountBilled > 0 && <span>· Billed: ${c.amountBilled.toLocaleString()}</span>}
                    {c.amountSaved > 0 && <span style={{ color: "#10b981" }}>· Saved: ${c.amountSaved.toLocaleString()}</span>}
                  </div>
                </div>
                <span style={{ fontSize: 18, color: "#334155", flexShrink: 0, transform: isExpanded ? "rotate(90deg)" : "rotate(0)", transition: "transform 0.2s" }}>›</span>
              </button>

              {isExpanded && (
                <div style={{ padding: "0 18px 18px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                  {c.notes && (
                    <div style={{ fontSize: 13, color: "#64748b", lineHeight: 1.7, padding: "12px 0", borderBottom: "1px solid rgba(255,255,255,0.05)", marginBottom: 14, whiteSpace: "pre-wrap" }}>{c.notes}</div>
                  )}

                  {c.status === "won" && (
                    <div style={{ marginBottom: 14 }}>
                      <label style={{ fontSize: 11, fontWeight: 700, color: "#475569", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>Amount Saved ($)</label>
                      <div style={{ display: "flex", gap: 8 }}>
                        <input
                          type="number"
                          defaultValue={c.amountSaved || ""}
                          placeholder="How much did you save?"
                          style={{ ...IS, flex: 1 }}
                          id={`saved-${c.id}`}
                        />
                        <button onClick={() => updateSaved(c.id, document.getElementById(`saved-${c.id}`).value)} style={{ padding: "10px 16px", background: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.25)", borderRadius: 10, color: "#34d399", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: FONT, flexShrink: 0 }}>Save</button>
                      </div>
                    </div>
                  )}

                  {nextStatuses.length > 0 && (
                    <div style={{ marginBottom: 14 }}>
                      <div style={{ fontSize: 10, fontWeight: 700, color: "#334155", letterSpacing: "0.08em", marginBottom: 8 }}>UPDATE STATUS</div>
                      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                        {nextStatuses.map(s => {
                          const ns = STATUS_CONFIG[s];
                          return (
                            <button key={s} onClick={() => updateStatus(c.id, s)} style={{ padding: "6px 14px", background: ns.bg, border: `1px solid ${ns.color}40`, borderRadius: 8, color: ns.color, fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: FONT }}>
                              → {ns.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {deleteConfirm === c.id ? (
                    <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                      <span style={{ fontSize: 12, color: "#f87171", flex: 1 }}>Delete this case permanently?</span>
                      <button onClick={() => deleteCase(c.id)} style={{ padding: "6px 14px", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 8, color: "#f87171", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: FONT }}>Yes, Delete</button>
                      <button onClick={() => setDeleteConfirm(null)} style={{ padding: "6px 14px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, color: "#64748b", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: FONT }}>Cancel</button>
                    </div>
                  ) : (
                    <button onClick={() => setDeleteConfirm(c.id)} style={{ padding: "6px 14px", background: "none", border: "1px solid rgba(239,68,68,0.15)", borderRadius: 8, color: "#475569", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: FONT }}>Delete Case</button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
