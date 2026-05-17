'use client';
import { useState, useEffect } from "react";
import { collection, getDocs, query, orderBy, doc, getDoc } from "firebase/firestore";
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

  const isAdmin = user?.uid === ADMIN_UID;

  useEffect(() => {
    if (!isAdmin) return;
    (async () => {
      try {
        const snap = await getDocs(query(collection(db, "users"), orderBy("createdAt", "desc")));
        const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        setUsers(list);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [isAdmin]);

  const loadCases = async (uid) => {
    if (userCases[uid]) return;
    setLoadingCases(p => ({ ...p, [uid]: true }));
    try {
      const snap = await getDocs(query(collection(db, "users", uid, "cases"), orderBy("createdAt", "desc")));
      setUserCases(p => ({ ...p, [uid]: snap.docs.map(d => ({ id: d.id, ...d.data() })) }));
    } catch {
      setUserCases(p => ({ ...p, [uid]: [] }));
    } finally {
      setLoadingCases(p => ({ ...p, [uid]: false }));
    }
  };

  const toggleExpand = (uid) => {
    if (expanded === uid) { setExpanded(null); return; }
    setExpanded(uid);
    loadCases(uid);
  };

  // Not logged in or wrong user
  if (!user) {
    return (
      <div style={{ textAlign: "center", padding: "60px 20px", color: "#475569" }}>
        <div style={{ fontSize: 40, marginBottom: 16 }}>🔒</div>
        <div style={{ fontSize: 16, fontWeight: 700, color: "#64748b" }}>Sign in to access admin</div>
      </div>
    );
  }

  // Show UID so owner can copy it and set NEXT_PUBLIC_ADMIN_UID
  if (!ADMIN_UID || ADMIN_UID === "REPLACE_WITH_YOUR_FIREBASE_UID") {
    return (
      <div style={{ background: "rgba(245,158,11,0.06)", border: "1px solid rgba(245,158,11,0.25)", borderRadius: 16, padding: 28, fontFamily: FONT }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: "#f59e0b", marginBottom: 8 }}>⚙️ Admin Setup Required</div>
        <p style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.75, marginBottom: 16 }}>
          Set <code style={{ background: "rgba(255,255,255,0.06)", padding: "1px 6px", borderRadius: 4 }}>NEXT_PUBLIC_ADMIN_UID</code> in your <code style={{ background: "rgba(255,255,255,0.06)", padding: "1px 6px", borderRadius: 4 }}>.env</code> file to your Firebase UID.
        </p>
        <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "12px 16px" }}>
          <div style={{ fontSize: 11, color: "#475569", marginBottom: 4 }}>Your Firebase UID (copy this):</div>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#f1f5f9", letterSpacing: "0.03em", wordBreak: "break-all" }}>{user.uid}</div>
        </div>
        <p style={{ fontSize: 12, color: "#475569", marginTop: 12 }}>
          Add <code style={{ background: "rgba(255,255,255,0.06)", padding: "1px 6px", borderRadius: 4 }}>NEXT_PUBLIC_ADMIN_UID={user.uid}</code> to your .env file, then redeploy.
        </p>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div style={{ textAlign: "center", padding: "60px 20px", color: "#475569" }}>
        <div style={{ fontSize: 40, marginBottom: 16 }}>🚫</div>
        <div style={{ fontSize: 16, fontWeight: 700, color: "#64748b" }}>Access denied</div>
      </div>
    );
  }

  const filtered = users.filter(u => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      u.phone?.includes(q) ||
      u.profile?.firstName?.toLowerCase().includes(q) ||
      u.profile?.lastName?.toLowerCase().includes(q) ||
      u.profile?.email?.toLowerCase().includes(q) ||
      u.profile?.insuranceProvider?.toLowerCase().includes(q)
    );
  });

  const totalCasesLoaded = Object.values(userCases).reduce((n, c) => n + c.length, 0);
  const usersWithProfile = users.filter(u => u.profile?.firstName || u.profile?.email || u.profile?.insuranceProvider).length;

  return (
    <div style={{ fontFamily: FONT }}>
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
        <Stat label="Cases Tracked" value={totalCasesLoaded} color="#a78bfa" />
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
          {/* Search */}
          <div style={{ position: "relative", marginBottom: 16 }}>
            <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", fontSize: 14, pointerEvents: "none" }}>🔍</span>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by phone, name, email, or insurer…"
              style={{ width: "100%", padding: "10px 14px 10px 36px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: 10, fontSize: 13, color: "#f1f5f9", fontFamily: FONT, boxSizing: "border-box" }}
            />
          </div>

          {loading && <div style={{ color: "#475569", fontSize: 14, textAlign: "center", padding: 32 }}>Loading users…</div>}
          {error && <div style={{ color: "#f87171", fontSize: 13, padding: 16, background: "rgba(239,68,68,0.08)", borderRadius: 10 }}>Error: {error}</div>}

          {!loading && filtered.length === 0 && (
            <div style={{ textAlign: "center", padding: 40, color: "#475569" }}>No users found</div>
          )}

          {/* User list */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {filtered.map((u, i) => {
              const p = u.profile || {};
              const name = [p.firstName, p.lastName].filter(Boolean).join(" ") || null;
              const isOpen = expanded === u.id;
              const cases = userCases[u.id] || [];

              return (
                <div key={u.id} style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${isOpen ? "rgba(16,185,129,0.25)" : "rgba(255,255,255,0.07)"}`, borderRadius: 12, overflow: "hidden", transition: "all 0.2s" }}>
                  {/* Row */}
                  <button
                    onClick={() => toggleExpand(u.id)}
                    style={{ width: "100%", padding: "14px 18px", background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 14, textAlign: "left", fontFamily: FONT }}
                  >
                    {/* Avatar */}
                    <div style={{ width: 36, height: 36, borderRadius: "50%", background: `hsl(${(i * 47) % 360}, 60%, 35%)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: "#fff", flexShrink: 0 }}>
                      {name ? name[0].toUpperCase() : "?"}
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
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

                    <div style={{ display: "flex", gap: 8, alignItems: "center", flexShrink: 0 }}>
                      {userCases[u.id] && <Badge color="#a78bfa">{userCases[u.id].length} cases</Badge>}
                      <span style={{ fontSize: 16, color: "#334155", transition: "transform 0.2s", transform: isOpen ? "rotate(180deg)" : "none", display: "block" }}>⌄</span>
                    </div>
                  </button>

                  {/* Expanded detail */}
                  {isOpen && (
                    <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", padding: "16px 18px" }}>
                      {/* Profile grid */}
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

                      {/* Cases */}
                      <div style={{ fontSize: 11, fontWeight: 700, color: "#334155", letterSpacing: "0.08em", marginBottom: 10, textTransform: "uppercase" }}>Cases</div>
                      {loadingCases[u.id] && <div style={{ fontSize: 13, color: "#475569" }}>Loading cases…</div>}
                      {!loadingCases[u.id] && cases.length === 0 && <div style={{ fontSize: 13, color: "#334155" }}>No cases tracked</div>}
                      {cases.map(c => (
                        <div key={c.id} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10, padding: "10px 14px", marginBottom: 8 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                            <span style={{ fontSize: 13, fontWeight: 700, color: "#f1f5f9" }}>{c.title || "Untitled case"}</span>
                            {c.status && <Badge color={c.status === "won" ? "#10b981" : c.status === "denied" ? "#f87171" : "#f59e0b"}>{c.status}</Badge>}
                            {c.amount && <span style={{ fontSize: 12, color: "#10b981", fontWeight: 700 }}>${c.amount}</span>}
                          </div>
                          <div style={{ fontSize: 12, color: "#475569" }}>
                            {c.provider && <span style={{ marginRight: 12 }}>🏥 {c.provider}</span>}
                            <span>📅 {fmtTime(c.createdAt)}</span>
                          </div>
                          {c.notes && <div style={{ fontSize: 12, color: "#64748b", marginTop: 6, lineHeight: 1.6 }}>{c.notes}</div>}
                        </div>
                      ))}
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
          <div style={{ fontSize: 13, color: "#475569", marginBottom: 16 }}>
            Expand a user above to load their cases, or click a user to drill in.
          </div>
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
                    <div style={{ flexShrink: 0 }}>
                      {c.amount && <div style={{ fontSize: 14, fontWeight: 700, color: "#10b981" }}>${c.amount}</div>}
                      {c.status && <Badge color={c.status === "won" ? "#10b981" : c.status === "denied" ? "#f87171" : "#f59e0b"}>{c.status}</Badge>}
                    </div>
                  </div>
                ))}
              </div>
            ) : null;
          })}
          {Object.keys(userCases).length === 0 && (
            <div style={{ textAlign: "center", color: "#334155", padding: 32, fontSize: 13 }}>
              Open the Users tab and click any user to load their cases here.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
