'use client';
import { useState, useEffect } from "react";
import {
  getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged,
} from "firebase/auth";
import { collection, getDocs, query, orderBy, doc, setDoc, deleteDoc, updateDoc, limit } from "firebase/firestore";
import { app, db } from "./firebase";

const auth = getAuth(app);
const FONT = "'Inter', system-ui, sans-serif";
const ADMIN_UID = process.env.NEXT_PUBLIC_ADMIN_UID;

// ─── Helpers ────────────────────────────────────────────────────────────────

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

const Stat = ({ label, value, color = "#10b981" }) => (
  <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: 14, padding: "20px 24px", flex: 1, minWidth: 140 }}>
    <div style={{ fontSize: 28, fontWeight: 900, color, marginBottom: 4 }}>{value}</div>
    <div style={{ fontSize: 12, color: "#64748b", fontWeight: 600 }}>{label}</div>
  </div>
);

const Badge = ({ children, color = "#64748b" }) => (
  <span style={{ fontSize: 10, fontWeight: 700, color, background: color + "18", border: `1px solid ${color}30`, padding: "2px 8px", borderRadius: 10, letterSpacing: "0.06em", textTransform: "uppercase" }}>
    {children}
  </span>
);

const Btn = ({ onClick, color = "#64748b", bg = "rgba(255,255,255,0.05)", children, disabled }) => (
  <button onClick={onClick} disabled={disabled} style={{ padding: "5px 12px", background: bg, border: `1px solid ${color}30`, borderRadius: 7, color, fontSize: 12, fontWeight: 600, cursor: disabled ? "default" : "pointer", fontFamily: FONT, opacity: disabled ? 0.5 : 1 }}>
    {children}
  </button>
);

const IS = { width: "100%", padding: "8px 10px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 8, fontSize: 13, color: "#f1f5f9", fontFamily: FONT, boxSizing: "border-box" };

// ─── Login Screen ────────────────────────────────────────────────────────────

function AdminLogin({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const login = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      if (cred.user.uid !== ADMIN_UID) {
        await signOut(auth);
        setError("This account does not have admin access.");
        return;
      }
      onLogin(cred.user);
    } catch (err) {
      setError(
        err.code === "auth/invalid-credential" || err.code === "auth/wrong-password"
          ? "Incorrect email or password."
          : err.code === "auth/user-not-found"
          ? "No account found with that email."
          : err.code === "auth/too-many-requests"
          ? "Too many failed attempts. Try again later."
          : "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#050810", display: "flex", alignItems: "center", justifyContent: "center", padding: 20, fontFamily: FONT }}>
      <div style={{ width: "100%", maxWidth: 380 }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{ width: 52, height: 52, background: "linear-gradient(135deg, #10b981, #059669)", borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, margin: "0 auto 16px", boxShadow: "0 0 32px rgba(16,185,129,0.4)" }}>🛡️</div>
          <div style={{ fontSize: 20, fontWeight: 900, color: "#f1f5f9", letterSpacing: "-0.02em" }}>BillVeil Admin</div>
          <div style={{ fontSize: 13, color: "#334155", marginTop: 4 }}>Restricted access</div>
        </div>

        {/* Form */}
        <form onSubmit={login} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: 28 }}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 11, fontWeight: 700, color: "#475569", display: "block", marginBottom: 6, letterSpacing: "0.06em", textTransform: "uppercase" }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="admin@example.com"
              required
              autoFocus
              style={{ ...IS, padding: "12px 14px" }}
            />
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ fontSize: 11, fontWeight: 700, color: "#475569", display: "block", marginBottom: 6, letterSpacing: "0.06em", textTransform: "uppercase" }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              style={{ ...IS, padding: "12px 14px" }}
            />
          </div>

          {error && (
            <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 10, padding: "10px 14px", fontSize: 13, color: "#f87171", marginBottom: 16 }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !email || !password}
            style={{ width: "100%", padding: "13px", background: loading || !email || !password ? "rgba(255,255,255,0.05)" : "linear-gradient(135deg, #10b981, #059669)", color: loading || !email || !password ? "#334155" : "#fff", border: "none", borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: loading || !email || !password ? "default" : "pointer", fontFamily: FONT, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
          >
            {loading ? (
              <><span style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,0.15)", borderTop: "2px solid #10b981", borderRadius: "50%", animation: "spin 0.8s linear infinite", display: "inline-block" }} /> Signing in…</>
            ) : "Sign In →"}
          </button>

          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </form>

        <div style={{ textAlign: "center", marginTop: 20, fontSize: 12, color: "#1e293b" }}>
          <a href="/" style={{ color: "#334155", textDecoration: "none" }}>← Back to BillVeil</a>
        </div>
      </div>
    </div>
  );
}

// ─── Dashboard ───────────────────────────────────────────────────────────────

function Dashboard({ adminUser, onLogout }) {
  const [tab, setTab] = useState("users");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState(null);
  const [userCases, setUserCases] = useState({});
  const [loadingCases, setLoadingCases] = useState({});
  const [events, setEvents] = useState([]);
  const [eventsLoading, setEventsLoading] = useState(false);

  // Edit/delete state
  const [editingUser, setEditingUser] = useState(null);
  const [editDraft, setEditDraft] = useState({});
  const [savingUser, setSavingUser] = useState(null);
  const [deletingUser, setDeletingUser] = useState(null);
  const [editingCase, setEditingCase] = useState(null);
  const [caseDraft, setCaseDraft] = useState({});
  const [savingCase, setSavingCase] = useState(null);
  const [deletingCase, setDeletingCase] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const snap = await getDocs(query(collection(db, "users"), orderBy("createdAt", "desc")));
        setUsers(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (err) { setError(err.message); }
      finally { setLoading(false); }
    })();
  }, []);

  useEffect(() => {
    if (tab !== "analytics" || events.length > 0) return;
    setEventsLoading(true);
    (async () => {
      try {
        const snap = await getDocs(query(collection(db, "analytics"), orderBy("ts", "desc"), limit(500)));
        setEvents(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch {}
      finally { setEventsLoading(false); }
    })();
  }, [tab, events.length]);

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

  const startEditUser = (u) => { setEditingUser(u.id); setEditDraft(u.profile || {}); };
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

  const confirmDeleteUser = async (uid) => {
    try {
      const casesSnap = await getDocs(collection(db, "users", uid, "cases"));
      await Promise.all(casesSnap.docs.map(d => deleteDoc(d.ref)));
      await deleteDoc(doc(db, "users", uid));
      setUsers(prev => prev.filter(u => u.id !== uid));
      setUserCases(prev => { const n = { ...prev }; delete n[uid]; return n; });
      setDeletingUser(null);
      if (expanded === uid) setExpanded(null);
    } catch (err) { alert("Delete failed: " + err.message); }
  };

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
      setUserCases(prev => ({ ...prev, [uid]: prev[uid].map(c => c.id === caseId ? { ...c, ...caseDraft } : c) }));
      setEditingCase(null);
    } catch (err) { alert("Save failed: " + err.message); }
    finally { setSavingCase(null); }
  };
  const confirmDeleteCase = async () => {
    const { uid, caseId } = deletingCase;
    try {
      await deleteDoc(doc(db, "users", uid, "cases", caseId));
      setUserCases(prev => ({ ...prev, [uid]: prev[uid].filter(c => c.id !== caseId) }));
      setDeletingCase(null);
    } catch (err) { alert("Delete failed: " + err.message); }
  };

  const filtered = users.filter(u => {
    if (!search) return true;
    const q = search.toLowerCase();
    return u.phone?.includes(q) || u.profile?.firstName?.toLowerCase().includes(q) ||
      u.profile?.lastName?.toLowerCase().includes(q) || u.profile?.email?.toLowerCase().includes(q) ||
      u.profile?.insuranceProvider?.toLowerCase().includes(q);
  });

  const usersWithProfile = users.filter(u => u.profile?.firstName || u.profile?.email || u.profile?.insuranceProvider).length;
  const totalCasesLoaded = Object.values(userCases).reduce((n, c) => n + c.length, 0);

  const ACTION_LABELS = {
    tool_viewed: { label: "Tool Viewed", color: "#60a5fa", icon: "👁" },
    bill_analyzed: { label: "Bill Analyzed", color: "#10b981", icon: "🔍" },
    login: { label: "Login", color: "#a78bfa", icon: "🔑" },
    profile_saved: { label: "Profile Saved", color: "#f59e0b", icon: "👤" },
    case_created: { label: "Case Created", color: "#f87171", icon: "📋" },
    chat_sent: { label: "Chat Sent", color: "#38bdf8", icon: "💬" },
  };

  return (
    <div style={{ minHeight: "100vh", background: "#050810", fontFamily: FONT }}>
      {/* Confirm modals */}
      {deletingUser && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", zIndex: 999, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div style={{ background: "#0d1526", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 16, padding: 28, maxWidth: 380, width: "100%" }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>⚠️</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#f1f5f9", marginBottom: 8 }}>Delete this user?</div>
            <div style={{ fontSize: 13, color: "#64748b", marginBottom: 24, lineHeight: 1.6 }}>Permanently deletes their Firestore profile and all cases. Firebase Auth account stays (remove separately if needed).</div>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setDeletingUser(null)} style={{ flex: 1, padding: 10, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, color: "#94a3b8", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: FONT }}>Cancel</button>
              <button onClick={() => confirmDeleteUser(deletingUser)} style={{ flex: 1, padding: 10, background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 10, color: "#f87171", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: FONT }}>Delete User</button>
            </div>
          </div>
        </div>
      )}
      {deletingCase && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", zIndex: 999, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div style={{ background: "#0d1526", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 16, padding: 28, maxWidth: 340, width: "100%" }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#f1f5f9", marginBottom: 8 }}>Delete this case?</div>
            <div style={{ fontSize: 13, color: "#64748b", marginBottom: 24 }}>This cannot be undone.</div>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setDeletingCase(null)} style={{ flex: 1, padding: 10, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, color: "#94a3b8", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: FONT }}>Cancel</button>
              <button onClick={confirmDeleteCase} style={{ flex: 1, padding: 10, background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 10, color: "#f87171", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: FONT }}>Delete Case</button>
            </div>
          </div>
        </div>
      )}

      {/* Top nav */}
      <div style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "14px 28px", display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(0,0,0,0.3)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 32, height: 32, background: "linear-gradient(135deg, #10b981, #059669)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>🛡️</div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 800, color: "#f1f5f9" }}>BillVeil Admin</div>
            <div style={{ fontSize: 11, color: "#334155" }}>{adminUser.email}</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <a href="/" target="_blank" rel="noreferrer" style={{ fontSize: 12, color: "#475569", textDecoration: "none", padding: "6px 12px", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8 }}>View Site ↗</a>
          <button onClick={onLogout} style={{ fontSize: 12, color: "#f87171", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 8, padding: "6px 14px", cursor: "pointer", fontFamily: FONT, fontWeight: 600 }}>Sign Out</button>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 24px" }}>
        {/* Stats */}
        <div style={{ display: "flex", gap: 12, marginBottom: 28, flexWrap: "wrap" }}>
          <Stat label="Total Users" value={users.length} color="#10b981" />
          <Stat label="Have Profile" value={usersWithProfile} color="#60a5fa" />
          <Stat label="Cases Loaded" value={totalCasesLoaded} color="#a78bfa" />
          <Stat label="Events Tracked" value={events.length || "—"} color="#f59e0b" />
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 6, marginBottom: 24, borderBottom: "1px solid rgba(255,255,255,0.06)", paddingBottom: 16 }}>
          {["users", "cases", "analytics"].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{ padding: "8px 20px", background: tab === t ? "rgba(16,185,129,0.12)" : "none", border: `1px solid ${tab === t ? "rgba(16,185,129,0.3)" : "transparent"}`, borderRadius: 8, color: tab === t ? "#10b981" : "#64748b", fontSize: 13, fontWeight: 600, cursor: "pointer", textTransform: "capitalize", fontFamily: FONT }}>
              {t === "users" ? `👥 Users (${users.length})` : t === "cases" ? `📋 Cases` : `📊 Analytics`}
            </button>
          ))}
        </div>

        {/* ── USERS TAB ── */}
        {tab === "users" && (
          <>
            <div style={{ position: "relative", marginBottom: 16 }}>
              <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", fontSize: 14, pointerEvents: "none" }}>🔍</span>
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by phone, name, email, or insurer…"
                style={{ width: "100%", padding: "11px 14px 11px 38px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: 10, fontSize: 13, color: "#f1f5f9", fontFamily: FONT, boxSizing: "border-box" }} />
            </div>
            {loading && <div style={{ color: "#475569", textAlign: "center", padding: 40 }}>Loading users…</div>}
            {error && <div style={{ color: "#f87171", padding: 16, background: "rgba(239,68,68,0.08)", borderRadius: 10 }}>Error: {error}</div>}
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
                    <div style={{ padding: "14px 18px", display: "flex", alignItems: "center", gap: 14 }}>
                      <div onClick={() => toggleExpand(u.id)} style={{ width: 38, height: 38, borderRadius: "50%", background: `hsl(${(i * 47) % 360}, 55%, 35%)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 700, color: "#fff", flexShrink: 0, cursor: "pointer" }}>
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
                          <span>📅 Joined {fmt(u.createdAt)}</span>
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: 6, alignItems: "center", flexShrink: 0 }}>
                        {userCases[u.id] && <Badge color="#a78bfa">{userCases[u.id].length} cases</Badge>}
                        <Btn onClick={() => { if (!isOpen) setExpanded(u.id); startEditUser(u); }} color="#60a5fa" bg="rgba(96,165,250,0.08)">✏️ Edit</Btn>
                        <Btn onClick={() => setDeletingUser(u.id)} color="#f87171" bg="rgba(239,68,68,0.08)">🗑 Delete</Btn>
                        <span onClick={() => toggleExpand(u.id)} style={{ fontSize: 16, color: "#334155", cursor: "pointer", transform: isOpen ? "rotate(180deg)" : "none", display: "block", transition: "transform 0.2s" }}>⌄</span>
                      </div>
                    </div>

                    {isOpen && (
                      <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", padding: "16px 18px" }}>
                        {isEditing ? (
                          <div style={{ marginBottom: 20 }}>
                            <div style={{ fontSize: 11, fontWeight: 700, color: "#60a5fa", letterSpacing: "0.08em", marginBottom: 12, textTransform: "uppercase" }}>Edit Profile</div>
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 10, marginBottom: 14 }}>
                              {["firstName","lastName","email","dob","gender","insuranceProvider","planName","memberId","groupNumber","street","city","state","zip","primaryDoctor"].map(key => (
                                <div key={key}>
                                  <div style={{ fontSize: 10, fontWeight: 700, color: "#334155", letterSpacing: "0.08em", marginBottom: 4, textTransform: "uppercase" }}>{key}</div>
                                  <input type={key === "dob" ? "date" : "text"} value={editDraft[key] || ""} onChange={e => setEditDraft(d => ({ ...d, [key]: e.target.value }))} style={IS} />
                                </div>
                              ))}
                            </div>
                            <div style={{ display: "flex", gap: 8 }}>
                              <Btn onClick={() => saveUser(u.id)} color="#10b981" bg="rgba(16,185,129,0.1)" disabled={savingUser === u.id}>{savingUser === u.id ? "Saving…" : "✓ Save"}</Btn>
                              <Btn onClick={cancelEditUser} color="#64748b">Cancel</Btn>
                            </div>
                          </div>
                        ) : (
                          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 12, marginBottom: 16 }}>
                            {[
                              { label: "Full Name", value: name },
                              { label: "DOB", value: p.dob }, { label: "Gender", value: p.gender },
                              { label: "Email", value: p.email }, { label: "Phone", value: u.phone },
                              { label: "Insurance", value: p.insuranceProvider === "Other" ? p.insuranceOther : p.insuranceProvider },
                              { label: "Plan", value: p.planName }, { label: "Member ID", value: p.memberId },
                              { label: "Group #", value: p.groupNumber },
                              { label: "Address", value: [p.street, p.city, p.state, p.zip].filter(Boolean).join(", ") },
                              { label: "Doctor", value: p.primaryDoctor }, { label: "HSA/FSA", value: p.hasHSA ? "Yes" : null },
                              { label: "UID", value: u.id },
                            ].map(({ label, value }) => value ? (
                              <div key={label}>
                                <div style={{ fontSize: 10, fontWeight: 700, color: "#334155", letterSpacing: "0.08em", marginBottom: 2, textTransform: "uppercase" }}>{label}</div>
                                <div style={{ fontSize: 13, color: "#94a3b8", wordBreak: "break-all" }}>{value}</div>
                              </div>
                            ) : null)}
                          </div>
                        )}

                        <div style={{ fontSize: 11, fontWeight: 700, color: "#334155", letterSpacing: "0.08em", marginBottom: 10, textTransform: "uppercase" }}>Cases</div>
                        {loadingCases[u.id] && <div style={{ fontSize: 13, color: "#475569" }}>Loading…</div>}
                        {!loadingCases[u.id] && cases.length === 0 && <div style={{ fontSize: 13, color: "#334155" }}>No cases</div>}
                        {cases.map(c => {
                          const isCaseEditing = editingCase?.uid === u.id && editingCase?.caseId === c.id;
                          return (
                            <div key={c.id} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10, padding: "12px 14px", marginBottom: 8 }}>
                              {isCaseEditing ? (
                                <div>
                                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 10 }}>
                                    {["title","provider","amount","status"].map(key => (
                                      <div key={key}>
                                        <div style={{ fontSize: 10, fontWeight: 700, color: "#334155", letterSpacing: "0.08em", marginBottom: 4, textTransform: "uppercase" }}>{key}</div>
                                        <input value={caseDraft[key] || ""} onChange={e => setCaseDraft(d => ({ ...d, [key]: e.target.value }))} style={IS} />
                                      </div>
                                    ))}
                                    <div style={{ gridColumn: "1/-1" }}>
                                      <div style={{ fontSize: 10, fontWeight: 700, color: "#334155", letterSpacing: "0.08em", marginBottom: 4, textTransform: "uppercase" }}>Notes</div>
                                      <textarea value={caseDraft.notes || ""} onChange={e => setCaseDraft(d => ({ ...d, notes: e.target.value }))} rows={3} style={{ ...IS, resize: "vertical" }} />
                                    </div>
                                  </div>
                                  <div style={{ display: "flex", gap: 8 }}>
                                    <Btn onClick={saveCase} color="#10b981" bg="rgba(16,185,129,0.1)" disabled={savingCase === c.id}>{savingCase === c.id ? "Saving…" : "✓ Save"}</Btn>
                                    <Btn onClick={cancelEditCase} color="#64748b">Cancel</Btn>
                                  </div>
                                </div>
                              ) : (
                                <div>
                                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                                    <span style={{ fontSize: 13, fontWeight: 700, color: "#f1f5f9", flex: 1 }}>{c.title || "Untitled"}</span>
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

        {/* ── CASES TAB ── */}
        {tab === "cases" && (
          <div>
            {Object.entries(userCases).map(([uid, cases]) => {
              const u = users.find(x => x.id === uid);
              const name = [u?.profile?.firstName, u?.profile?.lastName].filter(Boolean).join(" ") || u?.phone || uid;
              return cases.length > 0 ? (
                <div key={uid} style={{ marginBottom: 24 }}>
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
                        <Btn onClick={() => setDeletingCase({ uid, caseId: c.id })} color="#f87171" bg="rgba(239,68,68,0.08)">🗑</Btn>
                      </div>
                    </div>
                  ))}
                </div>
              ) : null;
            })}
            {Object.keys(userCases).length === 0 && (
              <div style={{ textAlign: "center", color: "#334155", padding: 40, fontSize: 13 }}>Go to Users tab and expand any user to load their cases.</div>
            )}
          </div>
        )}

        {/* ── ANALYTICS TAB ── */}
        {tab === "analytics" && (() => {
          const actionCounts = {};
          const toolCounts = {};
          const uniqueUsers = new Set();
          const today = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" });
          let todayCount = 0;

          events.forEach(e => {
            if (e.uid) uniqueUsers.add(e.uid);
            actionCounts[e.action] = (actionCounts[e.action] || 0) + 1;
            if (e.tool) toolCounts[e.tool] = (toolCounts[e.tool] || 0) + 1;
            if (e.ts) {
              const day = (e.ts.toDate ? e.ts.toDate() : new Date(e.ts)).toLocaleDateString("en-US", { month: "short", day: "numeric" });
              if (day === today) todayCount++;
            }
          });

          const topTools = Object.entries(toolCounts).sort((a, b) => b[1] - a[1]).slice(0, 15);
          const maxCount = topTools[0]?.[1] || 1;

          return (
            <div>
              {eventsLoading && <div style={{ color: "#475569", textAlign: "center", padding: 40 }}>Loading analytics…</div>}
              {!eventsLoading && (
                <>
                  <div style={{ display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap" }}>
                    <Stat label="Total Events" value={events.length} color="#10b981" />
                    <Stat label="Unique Users" value={uniqueUsers.size} color="#60a5fa" />
                    <Stat label="Today" value={todayCount} color="#a78bfa" />
                    <Stat label="Bill Analyses" value={actionCounts["bill_analyzed"] || 0} color="#f59e0b" />
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 24 }}>
                    {/* Actions */}
                    <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "20px 22px" }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: "#334155", letterSpacing: "0.1em", marginBottom: 16, textTransform: "uppercase" }}>Events by Action</div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                        {Object.entries(ACTION_LABELS).map(([action, { label, color, icon }]) => (
                          <div key={action} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <span style={{ fontSize: 16 }}>{icon}</span>
                            <span style={{ fontSize: 13, color: "#64748b", flex: 1 }}>{label}</span>
                            <span style={{ fontSize: 16, fontWeight: 800, color }}>{actionCounts[action] || 0}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Top tools */}
                    <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "20px 22px" }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: "#334155", letterSpacing: "0.1em", marginBottom: 16, textTransform: "uppercase" }}>Most Used Tools</div>
                      {topTools.length === 0 && <div style={{ fontSize: 13, color: "#334155" }}>No data yet</div>}
                      {topTools.map(([tool, count]) => (
                        <div key={tool} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                          <div style={{ fontSize: 12, color: "#64748b", width: 120, flexShrink: 0 }}>{tool}</div>
                          <div style={{ flex: 1, background: "rgba(255,255,255,0.04)", borderRadius: 4, height: 8, overflow: "hidden" }}>
                            <div style={{ width: `${(count / maxCount) * 100}%`, height: "100%", background: "linear-gradient(90deg, #10b981, #059669)", borderRadius: 4 }} />
                          </div>
                          <div style={{ fontSize: 12, fontWeight: 700, color: "#10b981", width: 28, textAlign: "right" }}>{count}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Activity feed */}
                  <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "20px 22px" }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "#334155", letterSpacing: "0.1em", marginBottom: 14, textTransform: "uppercase" }}>Recent Activity (last 100)</div>
                    <div style={{ maxHeight: 500, overflowY: "auto" }}>
                      {events.slice(0, 100).map(e => {
                        const cfg = ACTION_LABELS[e.action] || { label: e.action, color: "#475569", icon: "•" };
                        const u = users.find(x => x.id === e.uid);
                        const displayName = u ? ([u.profile?.firstName, u.profile?.lastName].filter(Boolean).join(" ") || u.phone) : (e.uid ? e.uid.slice(0, 8) + "…" : "Guest");
                        return (
                          <div key={e.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                            <span style={{ fontSize: 14, flexShrink: 0 }}>{cfg.icon}</span>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <span style={{ fontSize: 12, fontWeight: 600, color: cfg.color }}>{cfg.label}</span>
                              {e.tool && <span style={{ fontSize: 11, color: "#475569", marginLeft: 6 }}>→ {e.tool}</span>}
                              <span style={{ fontSize: 11, color: "#334155", marginLeft: 8 }}>by {displayName}</span>
                            </div>
                            <div style={{ fontSize: 11, color: "#334155", flexShrink: 0 }}>{fmtTime(e.ts)}</div>
                          </div>
                        );
                      })}
                      {events.length === 0 && <div style={{ color: "#334155", fontSize: 13 }}>No events yet.</div>}
                    </div>
                  </div>
                </>
              )}
            </div>
          );
        })()}
      </div>
    </div>
  );
}

// ─── Root export ─────────────────────────────────────────────────────────────

export default function AdminApp() {
  const [adminUser, setAdminUser] = useState(undefined); // undefined = loading

  useEffect(() => {
    return onAuthStateChanged(auth, (u) => {
      if (u && u.uid === ADMIN_UID) setAdminUser(u);
      else setAdminUser(null);
    });
  }, []);

  const handleLogout = async () => { await signOut(auth); setAdminUser(null); };

  if (adminUser === undefined) {
    return (
      <div style={{ minHeight: "100vh", background: "#050810", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 32, height: 32, border: "3px solid rgba(255,255,255,0.08)", borderTop: "3px solid #10b981", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!adminUser) return <AdminLogin onLogin={setAdminUser} />;
  return <Dashboard adminUser={adminUser} onLogout={handleLogout} />;
}
