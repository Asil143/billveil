'use client';
import { useState, useEffect } from "react";

const FONT = "'Inter', system-ui, sans-serif";
const STORAGE_KEY = "bv_email_captured";

export default function EmailCapture({ trigger }) {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | sending | done | error

  useEffect(() => {
    if (!trigger) return;
    if (sessionStorage.getItem(STORAGE_KEY)) return;
    const t = setTimeout(() => setShow(true), 1800);
    return () => clearTimeout(t);
  }, [trigger]);

  const dismiss = () => {
    sessionStorage.setItem(STORAGE_KEY, "1");
    setShow(false);
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !email.includes("@")) return;
    setStatus("sending");
    try {
      await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      setStatus("done");
      sessionStorage.setItem(STORAGE_KEY, "1");
      setTimeout(() => setShow(false), 2800);
    } catch {
      setStatus("error");
    }
  };

  if (!show) return null;

  return (
    <>
      <style>{`
        @keyframes ec-slide { from { opacity: 0; transform: translateY(100%); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
      <div style={{
        position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 8000,
        background: "rgba(10,15,30,0.98)", backdropFilter: "blur(20px)",
        borderTop: "1px solid rgba(16,185,129,0.25)",
        padding: "16px 20px",
        animation: "ec-slide 0.35s ease forwards",
        fontFamily: FONT,
      }}>
        <div style={{ maxWidth: 560, margin: "0 auto", display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
          <button onClick={dismiss} style={{ position: "absolute", top: 10, right: 14, background: "none", border: "none", color: "#475569", fontSize: 20, cursor: "pointer", lineHeight: 1 }}>×</button>

          {status === "done" ? (
            <div style={{ flex: 1, textAlign: "center", padding: "6px 0" }}>
              <div style={{ fontSize: 20, marginBottom: 4 }}>✅</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#10b981" }}>You're in! We'll keep you updated.</div>
            </div>
          ) : (
            <>
              <div style={{ flex: 1, minWidth: 180 }}>
                <div style={{ fontSize: 13, fontWeight: 800, color: "#f1f5f9", marginBottom: 3 }}>
                  🔔 Get billing alerts & updates
                </div>
                <div style={{ fontSize: 12, color: "#64748b", lineHeight: 1.5 }}>
                  New tools, law changes, and tips to fight back — delivered free.
                </div>
              </div>
              <form onSubmit={submit} style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  style={{ padding: "9px 13px", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 10, fontSize: 13, color: "#f1f5f9", fontFamily: FONT, width: 190 }}
                />
                <button
                  type="submit"
                  disabled={status === "sending"}
                  style={{ padding: "9px 18px", background: "linear-gradient(135deg, #10b981, #059669)", color: "#fff", border: "none", borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: FONT, whiteSpace: "nowrap" }}
                >
                  {status === "sending" ? "..." : "Notify me"}
                </button>
              </form>
              {status === "error" && (
                <div style={{ width: "100%", fontSize: 12, color: "#f87171", textAlign: "center" }}>Something went wrong. Please try again.</div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
