'use client';
import { useState, useEffect } from "react";
import { collection, getDocs, query, orderBy, doc, setDoc, deleteDoc, updateDoc } from "firebase/firestore";
import { db } from "./firebase";
import { useAuth } from "./AuthContext";

const FONT = "'Inter', system-ui, sans-serif";
const ADMIN_UID = process.env.NEXT_PUBLIC_ADMIN_UID;

const fmt = (ts) => {
  if (!ts) return "—";
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};
const fmtTime = (ts) => {
  if (!ts) return "—";
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  return d.toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
};

const Badge = ({ children, color = "#64748b" }) => (
  <span style={{ fontSize: 10, fontWeight: 700, color, background: color + "18", border: `1px solid ${color}30`, padding: "2px 8px", borderRadius: 10, letterSpacing: "0.06em", textTransform: "uppercase" }}>
    {children}
  </span>
);

const Stat = ({ label, value, color = "#10b981" }) => (
  <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: "20px 24px", flex: 1 }}>
    <div style={{ fontSize: 28, fontWeight: 900, color, marginBottom: 4 }}>{value}</div>
    <div style={{ fontSize: 12, color: "#64748b", fontWeight: 600 }}>{label}</div>
  </div>
);

const IS = { width: "100%", padding: "8px 10px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 8, fontSize: 13, color: "#f1f5f9", fontFamily: FONT, boxSizing: "border-box" };

const Btn = ({ onClick, color = "#64748b", bg = "rgba(255,255,255,0.05)", children, disabled }) => (
  <button onClick={onClick} disabled={disabled} style={{ padding: "5px 12px", background: bg, border: `1px solid ${color}30`, borderRadius: 7, color, fontSize: 12, fontWeight: 600, cursor: disabled ? "default" : "pointer", fontFamily: FONT, opacity: disabled ? 0.5 : 1 }}>
    {children}
  </button>
);

export default function AdminDashboard() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState(null);
  const [userCases, setUserCases] = useState({});
  const [loadingCases, setLoadingCases] = useState({});
  const [tab, setTab] = useState("users");

  // Edit/delete state
  const [editingUser, setEditingUser] = useState(null);   // uid being edited
  const [editDraft, setEditDraft] = useState({});         // draft profile fields
  const [savingUser, setSavingUser] = useState(null);
  const [deletingUser, setDeletingUser] = useState(null); // uid pending delete confirm
  const [editingCase, setEditingCase] = useState(null);   // { uid, caseId }
  const [caseDraft, setCaseDraft] = useState({});
  const [savingCase, setSavingCase] = useState(null);
  const [deletingCase, setDeletingCase] = useState(null); // { uid, caseId }

  const isAdmin = user?.uid === ADMIN_UID;

  useEffect(() => {
    if (!isAdmin) return;
    (async () => {
      try {
        const snap = await getDocs(query(collection(db, "users"), orderBy("createdAt", "desc")));
        setUsers(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (err) { setError(err.message); }
      finally { setLoading(false); }
    })();
  }, [isAdmin]);

  const loadCases = async (uid) => {
    if (userCases[uid]) return;
    setLoadingCases(p => ({ ...p, [uid]: true }));
    try {
      const snap = await getDocs(query(collection(db, "users", uid, "cases"), orderBy("createdAt", "desc")));
      setUserCases(p => ({ ...p, [uid]: snap.docs.map(d => ({ id: d.id, ...d.data() })) }));
    } catch { setUserCases(p => ({ ...p, [uid]: [] })); }
    finally { setLoadingCases(p => ({ ...p, [uid]: false })); }
  };

  const toggleExpand = (uid) => {
    if (expanded === uid) { setExpanded(null); return; }
    setExpanded(uid);
    loadCases(uid);
  };

  // ── User edit ──────────────────────────────────────────────────────────────
  const startEditUser = (u) => {
    setEditingUser(u.id);
    setEditDraft(u.profile || {});
  };
  const cancelEditUser = () => { setEditingUser(null); setEditDraft({}); };
  const saveUser = async (uid) => {
    setSavingUser(uid);
    try {
      await setDoc(doc(db, "users", uid), { profile: editDraft }, { merge: true });
      setUsers(prev => prev.map(u => u.id === uid ? { ...u, profile: editDraft } : u));
      setEditingUser(null);
    } catch (err) { alert("Save failed: " + err.message); }
    finally { setSavingUser(null); }
  };

  // ── User delete ────────────────────────────────────────────────────────────
  const confirmDeleteUser = async (uid) => {
    try {
      // Delete all cases first (Firestore won't auto-delete subcollections)
      const casesSnap = await getDocs(collection(db, "users", uid, "cases"));
      await Promise.all(casesSnap.docs.map(d => deleteDoc(d.ref)));
      await deleteDoc(doc(db, "users", uid));
      setUsers(prev => prev.filter(u => u.id !== uid));
      setUserCases(prev => { const n = { ...prev }; delete n[uid]; return n; });
      setDeletingUser(null);
      if (expanded === uid) setExpanded(null);
    } catch (err) { alert("Delete failed: " + err.message); }
  };

  // ── Case edit ──────────────────────────────────────────────────────────────
  const startEditCase = (uid, c) => {
    setEditingCase({ uid, caseId: c.id });
    setCaseDraft({ title: c.title || "", provider: c.provider || "", amount: c.amount || "", status: c.status || "", notes: c.notes || "" });
  };
  const cancelEditCase = () => { setEditingCase(null); setCaseDraft({}); };
  const saveCase = async () => {
    const { uid, caseId } = editingCase;
    setSavingCase(caseId);
    try {
      await updateDoc(doc(db, "users", uid, "cases", caseId), caseDraft);
      setUserCases(prev => ({
        ...prev,
        [uid]: prev[uid].map(c => c.id === caseId ? { ...c, ...caseDraft } : c),
      }));
      setEditingCase(null);
    } catch (err) { alert("Save failed: " + err.message); }
    finally { setSavingCase(null); }
  };

  // ── Case delete ────────────────────────────────────────────────────────────
  const confirmDeleteCase = async () => {
    const { uid, caseId } = deletingCase;
    try {
      await deleteDoc(doc(db, "users", uid, "cases", caseId));
      setUserCases(prev => ({ ...prev, [uid]: prev[uid].filter(c => c.id !== caseId) }));
      setDeletingCase(null);
    } catch (err) { alert("Delete failed: " + err.message); }
  };

  // ── Guards ─────────────────────────────────────────────────────────────────
  if (!user) return (
    <div style={{ textAlign: "center", padding: "60px 20px" }}>
      <div style={{ fontSize: 40, marginBottom: 16 }}>🔒</div>
      <div style={{ fontSize: 16, fontWeight: 700, color: "#64748b" }}>Sign in to access admin</div>
    </div>
  );

  if (!ADMIN_UID || ADMIN_UID === "REPLACE_WITH_YOUR_FIREBASE_UID") return (
    <div style={{ background: "rgba(245,158,11,0.06)", border: "1px solid rgba(245,158,11,0.25)", borderRadius: 16, padding: 28, fontFamily: FONT }}>
      <div style={{ fontSize: 14, fontWeight: 700, color: "#f59e0b", marginBottom: 8 }}>⚙️ Admin Setup Required</div>
      <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "12px 16px", marginBottom: 12 }}>
        <div style={{ fontSize: 11, color: "#475569", marginBottom: 4 }}>Your Firebase UID — add this to NEXT_PUBLIC_ADMIN_UID in Vercel:</div>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#f1f5f9", wordBreak: "break-all" }}>{user.uid}</div>
      </div>
    </div>
  );

  if (!isAdmin) return (
    <div style={{ textAlign: "center", padding: "60px 20px" }}>
      <div style={{ fontSize: 40, marginBottom: 16 }}>🚫</div>
      <div style={{ fontSize: 16, fontWeight: 700, color: "#64748b" }}>Access denied</div>
    </div>
  );

  const filtered = users.filter(u => {
    if (!search) return true;
    const q = search.toLowerCase();
    return u.phone?.includes(q) || u.profile?.firstName?.toLowerCase().includes(q) ||
      u.profile?.lastName?.toLowerCase().includes(q) || u.profile?.email?.toLowerCase().includes(q) ||
      u.profile?.insuranceProvider?.toLowerCase().includes(q);
  });

  const usersWithProfile = users.filter(u => u.profile?.firstName || u.profile?.email || u.profile?.insuranceProvider).length;
  const totalCasesLoaded = Object.values(userCases).reduce((n, c) => n + c.length, 0);

  return (
    <div style={{ fontFamily: FONT }}>
      {/* Delete user confirm modal */}
      {deletingUser && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 999, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div style={{ background: "#0d1526", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 16, padding: 28, maxWidth: 380, width: "100%" }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>⚠️</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#f1f5f9", marginBottom: 8 }}>Delete this user?</div>
            <div style={{ fontSize: 13, color: "#64748b", marginBottom: 24, lineHeight: 1.6 }}>
              This will permanently delete their Firestore profile and all their cases. Their Firebase Auth account will remain (use Firebase Console to remove that if needed).
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setDeletingUser(null)} style={{ flex: 1, padding: "10px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, color: "#94a3b8", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: FONT }}>Cancel</button>
              <button onClick={() => confirmDeleteUser(deletingUser)} style={{ flex: 1, padding: "10px", background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 10, color: "#f87171", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: FONT }}>Delete User</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete case confirm modal */}
      {deletingCase && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 999, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div style={{ background: "#0d1526", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 16, padding: 28, maxWidth: 340, width: "100%" }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#f1f5f9", marginBottom: 8 }}>Delete this case?</div>
            <div style={{ fontSize: 13, color: "#64748b", marginBottom: 24 }}>This cannot be undone.</div>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setDeletingCase(null)} style={{ flex: 1, padding: "10px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, color: "#94a3b8", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: FONT }}>Cancel</button>
              <button onClick={confirmDeleteCase} style={{ flex: 1, padding: "10px", background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 10, color: "#f87171", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: FONT }}>Delete Case</button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 900, color: "#f1f5f9", letterSpacing: "-0.02em", marginBottom: 4 }}>Admin Dashboard</h1>
          <div style={{ fontSize: 12, color: "#334155" }}>Only visible to you</div>
        </div>
        <Badge color="#10b981">Owner</Badge>
      </div>

      {/* Stats */}
      <div style={{ display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap" }}>
        <Stat label="Total Users" value={users.length} color="#10b981" />
        <Stat label="Have Profile" value={usersWithProfile} color="#60a5fa" />
        <Stat label="Cases Loaded" value={totalCasesLoaded} color="#a78bfa" />
        <Stat label="Last Joined" value={users[0] ? fmt(users[0].createdAt) : "—"} color="#f59e0b" />
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 6, marginBottom: 18 }}>
        {["users", "cases"].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{ padding: "7px 18px", background: tab === t ? "rgba(16,185,129,0.12)" : "rgba(255,255,255,0.04)", border: `1px solid ${tab === t ? "rgba(16,185,129,0.3)" : "rgba(255,255,255,0.08)"}`, borderRadius: 8, color: tab === t ? "#10b981" : "#64748b", fontSize: 13, fontWeight: 600, cursor: "pointer", textTransform: "capitalize" }}>
            {t}
          </button>
        ))}
      </div>

      {tab === "users" && (
        <>
          <div style={{ position: "relative", marginBottom: 16 }}>
            <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", fontSize: 14, pointerEvents: "none" }}>🔍</span>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by phone, name, email, or insurer…"
              style={{ width: "100%", padding: "10px 14px 10px 36px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: 10, fontSize: 13, color: "#f1f5f9", fontFamily: FONT, boxSizing: "border-box" }} />
          </div>

          {loading && <div style={{ color: "#475569", fontSize: 14, textAlign: "center", padding: 32 }}>Loading users…</div>}
          {error && <div style={{ color: "#f87171", fontSize: 13, padding: 16, background: "rgba(239,68,68,0.08)", borderRadius: 10 }}>Error: {error}</div>}
          {!loading && filtered.length === 0 && <div style={{ textAlign: "center", padding: 40, color: "#475569" }}>No users found</div>}

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {filtered.map((u, i) => {
              const p = u.profile || {};
              const name = [p.firstName, p.lastName].filter(Boolean).join(" ") || null;
              const isOpen = expanded === u.id;
              const isEditing = editingUser === u.id;
              const cases = userCases[u.id] || [];

              return (
                <div key={u.id} style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${isOpen ? "rgba(16,185,129,0.25)" : "rgba(255,255,255,0.07)"}`, borderRadius: 12, overflow: "hidden" }}>
                  {/* Row header */}
                  <div style={{ padding: "14px 18px", display: "flex", alignItems: "center", gap: 14 }}>
                    <div onClick={() => toggleExpand(u.id)} style={{ width: 36, height: 36, borderRadius: "50%", background: `hsl(${(i * 47) % 360}, 60%, 35%)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: "#fff", flexShrink: 0, cursor: "pointer" }}>
                      {name ? name[0].toUpperCase() : "?"}
                    </div>

                    <div onClick={() => toggleExpand(u.id)} style={{ flex: 1, minWidth: 0, cursor: "pointer" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2, flexWrap: "wrap" }}>
                        <span style={{ fontSize: 14, fontWeight: 700, color: "#f1f5f9" }}>{name || "No name"}</span>
                        {p.email && <span style={{ fontSize: 12, color: "#64748b" }}>{p.email}</span>}
                        {p.insuranceProvider && <Badge color="#60a5fa">{p.insuranceProvider === "Other" ? (p.insuranceOther || "Other") : p.insuranceProvider}</Badge>}
                      </div>
                      <div style={{ fontSize: 12, color: "#475569", display: "flex", gap: 12, flexWrap: "wrap" }}>
                        <span>📱 {u.phone || "—"}</span>
                        {p.state && <span>📍 {p.city ? `${p.city}, ` : ""}{p.state}</span>}
                        <span>📅 {fmt(u.createdAt)}</span>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div style={{ display: "flex", gap: 6, alignItems: "center", flexShrink: 0 }}>
                      {userCases[u.id] && <Badge color="#a78bfa">{userCases[u.id].length} cases</Badge>}
                      <Btn onClick={() => { if (!isOpen) setExpanded(u.id); startEditUser(u); }} color="#60a5fa" bg="rgba(96,165,250,0.08)">✏️ Edit</Btn>
                      <Btn onClick={() => setDeletingUser(u.id)} color="#f87171" bg="rgba(239,68,68,0.08)">🗑 Delete</Btn>
                      <span onClick={() => toggleExpand(u.id)} style={{ fontSize: 16, color: "#334155", cursor: "pointer", transform: isOpen ? "rotate(180deg)" : "none", display: "block", transition: "transform 0.2s" }}>⌄</span>
                    </div>
                  </div>

                  {/* Expanded panel */}
                  {isOpen && (
                    <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", padding: "16px 18px" }}>

                      {/* Edit form */}
                      {isEditing ? (
                        <div style={{ marginBottom: 20 }}>
                          <div style={{ fontSize: 11, fontWeight: 700, color: "#60a5fa", letterSpacing: "0.08em", marginBottom: 12, textTransform: "uppercase" }}>Edit Profile</div>
                          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 10, marginBottom: 14 }}>
                            {[
                              { key: "firstName", label: "First Name" },
                              { key: "lastName", label: "Last Name" },
                              { key: "email", label: "Email" },
                              { key: "dob", label: "Date of Birth", type: "date" },
                              { key: "gender", label: "Gender" },
                              { key: "insuranceProvider", label: "Insurance Provider" },
                              { key: "planName", label: "Plan Name" },
                              { key: "memberId", label: "Member ID" },
                              { key: "groupNumber", label: "Group Number" },
                              { key: "street", label: "Street" },
                              { key: "city", label: "City" },
                              { key: "state", label: "State" },
                              { key: "zip", label: "ZIP" },
                              { key: "primaryDoctor", label: "Primary Doctor" },
                            ].map(({ key, label, type }) => (
                              <div key={key}>
                                <div style={{ fontSize: 10, fontWeight: 700, color: "#334155", letterSpacing: "0.08em", marginBottom: 4, textTransform: "uppercase" }}>{label}</div>
                                <input
                                  type={type || "text"}
                                  value={editDraft[key] || ""}
                                  onChange={e => setEditDraft(d => ({ ...d, [key]: e.target.value }))}
                                  style={IS}
                                />
                              </div>
                            ))}
                          </div>
                          <div style={{ display: "flex", gap: 8 }}>
                            <Btn onClick={() => saveUser(u.id)} color="#10b981" bg="rgba(16,185,129,0.1)" disabled={savingUser === u.id}>
                              {savingUser === u.id ? "Saving…" : "✓ Save Changes"}
                            </Btn>
                            <Btn onClick={cancelEditUser} color="#64748b">Cancel</Btn>
                          </div>
                        </div>
                      ) : (
                        /* Read-only profile view */
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 12, marginBottom: 16 }}>
                          {[
                            { label: "Full Name", value: name },
                            { label: "Date of Birth", value: p.dob },
                            { label: "Gender", value: p.gender },
                            { label: "Email", value: p.email },
                            { label: "Phone", value: u.phone },
                            { label: "Insurance", value: p.insuranceProvider === "Other" ? p.insuranceOther : p.insuranceProvider },
                            { label: "Plan", value: p.planName },
                            { label: "Member ID", value: p.memberId },
                            { label: "Group #", value: p.groupNumber },
                            { label: "Address", value: [p.street, p.city, p.state, p.zip].filter(Boolean).join(", ") },
                            { label: "Primary Doctor", value: p.primaryDoctor },
                            { label: "HSA/FSA", value: p.hasHSA ? "Yes" : null },
                            { label: "Firebase UID", value: u.id },
                          ].map(({ label, value }) => value ? (
                            <div key={label}>
                              <div style={{ fontSize: 10, fontWeight: 700, color: "#334155", letterSpacing: "0.08em", marginBottom: 2, textTransform: "uppercase" }}>{label}</div>
                              <div style={{ fontSize: 13, color: "#94a3b8", wordBreak: "break-all" }}>{value}</div>
                            </div>
                          ) : null)}
                        </div>
                      )}

                      {/* Cases section */}
                      <div style={{ fontSize: 11, fontWeight: 700, color: "#334155", letterSpacing: "0.08em", marginBottom: 10, textTransform: "uppercase" }}>Cases</div>
                      {loadingCases[u.id] && <div style={{ fontSize: 13, color: "#475569" }}>Loading cases…</div>}
                      {!loadingCases[u.id] && cases.length === 0 && <div style={{ fontSize: 13, color: "#334155" }}>No cases tracked</div>}

                      {cases.map(c => {
                        const isCaseEditing = editingCase?.uid === u.id && editingCase?.caseId === c.id;
                        return (
                          <div key={c.id} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10, padding: "12px 14px", marginBottom: 8 }}>
                            {isCaseEditing ? (
                              <div>
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 10 }}>
                                  {[
                                    { key: "title", label: "Title" },
                                    { key: "provider", label: "Provider" },
                                    { key: "amount", label: "Amount ($)" },
                                    { key: "status", label: "Status (open/won/denied/appealing)" },
                                  ].map(({ key, label }) => (
                                    <div key={key}>
                                      <div style={{ fontSize: 10, fontWeight: 700, color: "#334155", letterSpacing: "0.08em", marginBottom: 4, textTransform: "uppercase" }}>{label}</div>
                                      <input value={caseDraft[key] || ""} onChange={e => setCaseDraft(d => ({ ...d, [key]: e.target.value }))} style={IS} />
                                    </div>
                                  ))}
                                  <div style={{ gridColumn: "1 / -1" }}>
                                    <div style={{ fontSize: 10, fontWeight: 700, color: "#334155", letterSpacing: "0.08em", marginBottom: 4, textTransform: "uppercase" }}>Notes</div>
                                    <textarea value={caseDraft.notes || ""} onChange={e => setCaseDraft(d => ({ ...d, notes: e.target.value }))} rows={3} style={{ ...IS, resize: "vertical" }} />
                                  </div>
                                </div>
                                <div style={{ display: "flex", gap: 8 }}>
                                  <Btn onClick={saveCase} color="#10b981" bg="rgba(16,185,129,0.1)" disabled={savingCase === c.id}>
                                    {savingCase === c.id ? "Saving…" : "✓ Save"}
                                  </Btn>
                                  <Btn onClick={cancelEditCase} color="#64748b">Cancel</Btn>
                                </div>
                              </div>
                            ) : (
                              <div>
                                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                                  <span style={{ fontSize: 13, fontWeight: 700, color: "#f1f5f9", flex: 1 }}>{c.title || "Untitled case"}</span>
                                  {c.status && <Badge color={c.status === "won" ? "#10b981" : c.status === "denied" ? "#f87171" : "#f59e0b"}>{c.status}</Badge>}
                                  {c.amount && <span style={{ fontSize: 12, color: "#10b981", fontWeight: 700 }}>${c.amount}</span>}
                                  <Btn onClick={() => startEditCase(u.id, c)} color="#60a5fa" bg="rgba(96,165,250,0.08)">✏️</Btn>
                                  <Btn onClick={() => setDeletingCase({ uid: u.id, caseId: c.id })} color="#f87171" bg="rgba(239,68,68,0.08)">🗑</Btn>
                                </div>
                                <div style={{ fontSize: 12, color: "#475569" }}>
                                  {c.provider && <span style={{ marginRight: 12 }}>🏥 {c.provider}</span>}
                                  <span>📅 {fmtTime(c.createdAt)}</span>
                                </div>
                                {c.notes && <div style={{ fontSize: 12, color: "#64748b", marginTop: 6, lineHeight: 1.6 }}>{c.notes}</div>}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {!loading && filtered.length > 0 && (
            <div style={{ textAlign: "center", fontSize: 12, color: "#334155", marginTop: 16 }}>
              Showing {filtered.length} of {users.length} users
            </div>
          )}
        </>
      )}

      {tab === "cases" && (
        <div>
          {Object.entries(userCases).map(([uid, cases]) => {
            const u = users.find(x => x.id === uid);
            const name = [u?.profile?.firstName, u?.profile?.lastName].filter(Boolean).join(" ") || u?.phone || uid;
            return cases.length > 0 ? (
              <div key={uid} style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#64748b", marginBottom: 8 }}>{name}</div>
                {cases.map(c => (
                  <div key={c.id} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10, padding: "12px 16px", marginBottom: 8, display: "flex", gap: 16, alignItems: "flex-start" }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: "#f1f5f9", marginBottom: 4 }}>{c.title || "Untitled"}</div>
                      <div style={{ fontSize: 12, color: "#475569" }}>{c.provider} · {fmtTime(c.createdAt)}</div>
                      {c.notes && <div style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>{c.notes}</div>}
                    </div>
                    <div style={{ flexShrink: 0, display: "flex", gap: 6, alignItems: "center" }}>
                      {c.amount && <div style={{ fontSize: 14, fontWeight: 700, color: "#10b981" }}>${c.amount}</div>}
                      {c.status && <Badge color={c.status === "won" ? "#10b981" : c.status === "denied" ? "#f87171" : "#f59e0b"}>{c.status}</Badge>}
                      <Btn onClick={() => { setTab("users"); setExpanded(uid); loadCases(uid); startEditCase(uid, c); }} color="#60a5fa" bg="rgba(96,165,250,0.08)">✏️</Btn>
                      <Btn onClick={() => setDeletingCase({ uid, caseId: c.id })} color="#f87171" bg="rgba(239,68,68,0.08)">🗑</Btn>
                    </div>
                  </div>
                ))}
              </div>
            ) : null;
          })}
          {Object.keys(userCases).length === 0 && (
            <div style={{ textAlign: "center", color: "#334155", padding: 32, fontSize: 13 }}>
              Open the Users tab and expand any user to load their cases here.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
