'use client';
import { useState, useRef, useEffect } from "react";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from "./firebase";

const FONT = "'Inter', system-ui, sans-serif";

export default function PhoneLogin({ onClose, onSuccess }) {
  const [step, setStep] = useState("phone");
  const [phone, setPhone] = useState("");
  const [countryCode, setCountryCode] = useState("+1");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const confirmRef = useRef(null);
  const recaptchaRef = useRef(null);

  useEffect(() => {
    recaptchaRef.current = new RecaptchaVerifier(auth, "recaptcha-container", {
      size: "invisible",
    });
    return () => {
      try { recaptchaRef.current?.clear(); } catch {}
      recaptchaRef.current = null;
    };
  }, []);

  const sendOtp = async () => {
    const digits = phone.replace(/\D/g, "");
    if (digits.length < 7) { setError("Enter a valid phone number"); return; }
    setLoading(true);
    setError("");
    try {
      await recaptchaRef.current.render();
      const result = await signInWithPhoneNumber(auth, countryCode + digits, recaptchaRef.current);
      confirmRef.current = result;
      setStep("otp");
    } catch (err) {
      console.error(err);
      setError(err.message || "Could not send code. Please try again.");
      try { recaptchaRef.current?.clear(); } catch {}
      recaptchaRef.current = new RecaptchaVerifier(auth, "recaptcha-container", { size: "invisible" });
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (otp.length < 6) { setError("Enter the 6-digit code"); return; }
    setLoading(true);
    setError("");
    try {
      await confirmRef.current.confirm(otp);
      onSuccess();
    } catch (err) {
      console.error(err);
      setError("Wrong code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    padding: "13px 14px",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: 10,
    fontSize: 15,
    color: "#f1f5f9",
    fontFamily: FONT,
    outline: "none",
    boxSizing: "border-box",
  };

  const btnStyle = (disabled) => ({
    width: "100%",
    padding: "14px",
    background: disabled ? "rgba(255,255,255,0.05)" : "linear-gradient(135deg, #10b981, #059669)",
    color: disabled ? "#475569" : "#fff",
    border: "none",
    borderRadius: 12,
    fontSize: 15,
    fontWeight: 700,
    cursor: disabled ? "default" : "pointer",
    fontFamily: FONT,
    boxShadow: disabled ? "none" : "0 8px 28px rgba(16,185,129,0.35)",
    transition: "all 0.2s",
  });

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", backdropFilter: "blur(12px)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20, fontFamily: FONT }}>
      <div style={{ background: "#0a0f1e", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 20, padding: "36px 32px", width: "100%", maxWidth: 400, position: "relative", boxShadow: "0 24px 60px rgba(0,0,0,0.5)" }}>
        <button onClick={onClose} style={{ position: "absolute", top: 16, right: 16, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#475569", fontSize: 18, cursor: "pointer", lineHeight: 1, padding: "4px 9px", borderRadius: 8 }}>×</button>

        <div style={{ width: 48, height: 48, background: "linear-gradient(135deg, #10b981, #059669)", borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, marginBottom: 20, boxShadow: "0 0 24px rgba(16,185,129,0.4)" }}>🛡️</div>

        {step === "phone" ? (
          <>
            <div style={{ fontSize: 20, fontWeight: 800, color: "#f1f5f9", marginBottom: 6 }}>Create your account</div>
            <div style={{ fontSize: 14, color: "#64748b", lineHeight: 1.6, marginBottom: 28 }}>Sign up with your phone number. No passwords, no credit card — ever.</div>

            <label style={{ fontSize: 11, fontWeight: 700, color: "#475569", display: "block", marginBottom: 8, letterSpacing: "0.06em", textTransform: "uppercase" }}>Phone Number</label>
            <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
              <input value={countryCode} onChange={(e) => setCountryCode(e.target.value)} style={{ ...inputStyle, width: 70, textAlign: "center" }} />
              <input value={phone} onChange={(e) => setPhone(e.target.value)} onKeyDown={(e) => e.key === "Enter" && sendOtp()} placeholder="(555) 123-4567" type="tel" style={{ ...inputStyle, flex: 1 }} autoFocus />
            </div>

            {error && <div style={{ color: "#f87171", fontSize: 13, marginBottom: 14, background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 8, padding: "10px 12px" }}>{error}</div>}

            <button onClick={sendOtp} disabled={loading} style={btnStyle(loading)}>
              {loading ? "Sending..." : "Send Code →"}
            </button>

            <div style={{ textAlign: "center", fontSize: 12, color: "#334155", marginTop: 14 }}>
              One-time code via SMS. No spam.
            </div>
          </>
        ) : (
          <>
            <div style={{ fontSize: 20, fontWeight: 800, color: "#f1f5f9", marginBottom: 6 }}>Enter your code</div>
            <div style={{ fontSize: 14, color: "#64748b", marginBottom: 28 }}>Sent to {countryCode} {phone}</div>

            <label style={{ fontSize: 11, fontWeight: 700, color: "#475569", display: "block", marginBottom: 8, letterSpacing: "0.06em", textTransform: "uppercase" }}>6-Digit Code</label>
            <input
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
              onKeyDown={(e) => e.key === "Enter" && verifyOtp()}
              placeholder="123456"
              type="tel"
              maxLength={6}
              style={{ ...inputStyle, width: "100%", fontSize: 26, letterSpacing: "0.35em", textAlign: "center", marginBottom: 16, fontFamily: "monospace" }}
              autoFocus
            />

            {error && <div style={{ color: "#f87171", fontSize: 13, marginBottom: 14, background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 8, padding: "10px 12px" }}>{error}</div>}

            <button onClick={verifyOtp} disabled={loading || otp.length < 6} style={btnStyle(loading || otp.length < 6)}>
              {loading ? "Verifying..." : "Verify & Continue →"}
            </button>

            <button onClick={() => { setStep("phone"); setOtp(""); setError(""); }} style={{ width: "100%", marginTop: 10, padding: "10px", background: "none", border: "none", color: "#475569", fontSize: 13, cursor: "pointer", fontFamily: FONT }}>
              ← Change number
            </button>
          </>
        )}

        <div id="recaptcha-container" />
      </div>
    </div>
  );
}
