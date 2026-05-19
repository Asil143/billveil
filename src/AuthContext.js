'use client';
import { createContext, useContext, useEffect, useRef, useState } from "react";
import {
  onAuthStateChanged, signOut, deleteUser,
  isSignInWithEmailLink, signInWithEmailLink,
  linkWithCredential, EmailAuthProvider,
} from "firebase/auth";
import { doc, getDoc, setDoc, deleteDoc, collection, getDocs, onSnapshot, serverTimestamp } from "firebase/firestore";
import { trackEvent } from "./analytics";
import { auth, db } from "./firebase";
import PhoneLogin from "./PhoneLogin";

const USE_LIMIT = 3;
const STORAGE_KEY = "bv_uses";

const emailKey = (email) =>
  email.toLowerCase().replace(/\./g, "_dot_").replace(/@/g, "_at_");

const AuthContext = createContext(null);

function EmailLinkScreen({ status, errorCode, syncOk, syncError }) {
  const isSuccess = status === "success";
  const isError = status === "error";
  const isPending = status === "pending";

  const authErrors = ["auth/invalid-action-code", "auth/expired-action-code", "auth/user-disabled"];
  const isAuthError = authErrors.includes(errorCode);

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9999,
      background: "#050810", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      fontFamily: "'Inter', system-ui, sans-serif", padding: 32,
    }}>
      <div style={{ fontSize: 48, marginBottom: 24 }}>
        {isPending ? "⏳" : isSuccess ? "✅" : "❌"}
      </div>
      <div style={{ fontSize: 22, fontWeight: 800, color: "#f1f5f9", marginBottom: 12, textAlign: "center" }}>
        {isPending && "Verifying your email…"}
        {isSuccess && "Email verified!"}
        {isError && "Verification failed"}
      </div>
      <div style={{ fontSize: 15, color: "#64748b", textAlign: "center", lineHeight: 1.7, maxWidth: 320 }}>
        {isPending && "Please wait a moment."}
        {isSuccess && syncOk && "Your email is verified. Your other device will update automatically — you can close this tab."}
        {isSuccess && !syncOk && "Your email is verified on this device. Go to your other device and refresh the page to see the update."}
        {isError && isAuthError && "This link has expired or was already used. Go back to BillVeil, open your Profile, and tap Verify → to send a fresh link."}
        {isError && !isAuthError && "Something went wrong. Please try again."}
      </div>
      {isError && errorCode && (
        <div style={{ marginTop: 16, fontSize: 11, color: "#334155", fontFamily: "monospace" }}>
          {errorCode}
        </div>
      )}
      {isSuccess && (
        <div style={{
          marginTop: 32, padding: "14px 28px",
          background: syncOk ? "rgba(16,185,129,0.12)" : "rgba(245,158,11,0.1)",
          border: syncOk ? "1px solid rgba(16,185,129,0.3)" : "1px solid rgba(245,158,11,0.3)",
          borderRadius: 12,
          color: syncOk ? "#10b981" : "#f59e0b",
          fontSize: 14, fontWeight: 600, textAlign: "center",
        }}>
          {syncOk ? "✓ All done — you can close this tab" : "⚠ Refresh your other device to see verified status"}
          {!syncOk && syncError && (
            <div style={{ marginTop: 6, fontSize: 11, opacity: 0.7, fontFamily: "monospace", fontWeight: 400 }}>
              {syncError}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(undefined);
  const [uses, setUses] = useState(() => typeof window !== 'undefined' ? parseInt(localStorage.getItem(STORAGE_KEY) || "0", 10) : 0);
  const [showModal, setShowModal] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [emailVerified, setEmailVerified] = useState(false);
  const [emailJustVerified, setEmailJustVerified] = useState(false);
  const [linkStatus, setLinkStatus] = useState(null);   // null | "pending" | "success" | "error"
  const [linkErrorCode, setLinkErrorCode] = useState(null);
  const [linkSyncOk, setLinkSyncOk] = useState(false);
  const [linkSyncError, setLinkSyncError] = useState(null);

  const pendingEmailLink = typeof window !== 'undefined' && isSignInWithEmailLink(auth, window.location.href)
    ? window.location.href
    : null;

  // Process email link once on mount using a one-shot auth listener
  useEffect(() => {
    if (!pendingEmailLink) return;

    setLinkStatus("pending");
    window.history.replaceState({}, document.title, window.location.pathname);

    const urlParams = new URL(pendingEmailLink).searchParams;
    const ownerUid = urlParams.get("uid");
    const email = localStorage.getItem("bv_pending_email") || urlParams.get("bvemail");

    if (!ownerUid || !email) {
      setLinkErrorCode("missing-params");
      setLinkStatus("error");
      return;
    }

    const withTimeout = (promise, ms) =>
      Promise.race([promise, new Promise((_, reject) => setTimeout(() => reject(new Error("timeout")), ms))]);

    // Use processed flag + let to safely unsubscribe even if Firebase fires synchronously
    let processed = false;
    let unsub;
    unsub = onAuthStateChanged(auth, async (u) => {
      if (processed) return;
      processed = true;
      if (unsub) unsub();

      try {
        if (u?.phoneNumber) {
          // Same device as the logged-in phone user — link the credential
          try {
            const cred = EmailAuthProvider.credentialWithLink(email, pendingEmailLink);
            await withTimeout(linkWithCredential(u, cred), 15000);
            await u.reload();
          } catch (linkErr) {
            // Already linked from a previous attempt — still write Firestore record
            if (linkErr.code !== "auth/provider-already-linked") throw linkErr;
          }
        } else {
          // Different device — sign in temporarily to get write access
          await withTimeout(signInWithEmailLink(auth, email, pendingEmailLink), 15000);
        }

        // Write via our server — avoids Firestore SDK connection issues on mobile
        const currentUser = auth.currentUser;
        try {
          const resp = await fetch("/api/verify-email", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, ownerUid }),
          });
          if (!resp.ok) {
            const err = await resp.json().catch(() => ({}));
            throw new Error(err.error || `HTTP ${resp.status}`);
          }
          setLinkSyncOk(true);
        } catch (fsErr) {
          setLinkSyncOk(false);
          setLinkSyncError(fsErr.message || "unknown");
        }

        // Sign out the temporary session (not needed on same-device phone user)
        if (!currentUser?.phoneNumber) {
          await signOut(auth);
        }

        localStorage.removeItem("bv_pending_email");
        setLinkStatus("success");
      } catch (err) {
        console.error("Email link error:", err.code, err.message);
        setLinkErrorCode(err.code || err.message || "unknown");
        setLinkStatus("error");
      }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Main auth state listener — manages user session and email verification status
  useEffect(() => {
    return onAuthStateChanged(auth, async (u) => {
      if (pendingEmailLink) return; // email-link page handles its own auth flow
      if (u) {
        try { await u.reload(); } catch {}
        setUser(auth.currentUser);
        trackEvent(u.uid, "login", { method: "phone" });
        try {
          const profile = localStorage.getItem(`bv_profile_${u.uid}`);
          const profileEmail = profile ? JSON.parse(profile)?.email : null;
          if (profileEmail) {
            // Check 1: email linked directly to Firebase account (same-device verification)
            const isLinked = auth.currentUser?.providerData?.some(
              p => p.providerId === "password" && p.email?.toLowerCase() === profileEmail.toLowerCase()
            );
            if (isLinked) { setEmailVerified(true); return; }

            // Check 2: Firestore record (cross-device verification, on page refresh)
            try {
              const snap = await getDoc(doc(db, "email_verifications", emailKey(profileEmail)));
              if (snap.exists() && snap.data().verified) setEmailVerified(true);
            } catch {}
          }
        } catch {}
      } else {
        setUser(null);
        setEmailVerified(false);
      }
    });
  }, [pendingEmailLink]);

  // Real-time Firestore listener — detects cross-device verification automatically
  useEffect(() => {
    if (!user?.uid || emailVerified) return;
    const profileEmail = profileData?.email?.trim()?.toLowerCase();
    if (!profileEmail) return;

    const unsub = onSnapshot(
      doc(db, "email_verifications", emailKey(profileEmail)),
      (snap) => {
        if (snap.exists() && snap.data().verified) {
          setEmailVerified(true);
          setEmailJustVerified(true);
        }
      },
      () => {} // silently ignore permission errors (rules not set up yet)
    );
    return unsub;
  }, [user?.uid, emailVerified, profileData?.email]);

  // Load profile from Firestore when user logs in; migrate localStorage data if present
  useEffect(() => {
    if (!user?.uid) { setProfileData(null); return; }
    let cancelled = false;
    (async () => {
      try {
        const ref = doc(db, "users", user.uid);
        const snap = await getDoc(ref);
        if (cancelled) return;
        if (snap.exists()) {
          setProfileData(snap.data().profile || null);
        } else {
          // First-time login: migrate any existing localStorage data then clear it
          const legacy = localStorage.getItem(`bv_profile_${user.uid}`);
          const profile = legacy ? JSON.parse(legacy) : null;
          await setDoc(ref, {
            uid: user.uid,
            phone: user.phoneNumber || null,
            createdAt: serverTimestamp(),
            profile: profile || null,
          });
          if (legacy) localStorage.removeItem(`bv_profile_${user.uid}`);
          if (!cancelled) setProfileData(profile);
        }
      } catch { if (!cancelled) setProfileData(null); }
    })();
    return () => { cancelled = true; };
  }, [user]);

  const updateProfile = async (data) => {
    if (!user?.uid) return;
    setProfileData(data);
    try {
      await setDoc(doc(db, "users", user.uid), { profile: data }, { merge: true });
      trackEvent(user.uid, "profile_saved", { hasInsurance: !!data.insuranceProvider, hasAddress: !!data.street });
    } catch (err) {
      console.error("Profile save failed:", err);
    }

    // Reset verification if email changed to something not already linked
    const linkedEmail = auth.currentUser?.providerData
      ?.find(p => p.providerId === "password")?.email?.toLowerCase();
    const newEmail = data.email?.trim()?.toLowerCase();
    if (newEmail && newEmail !== linkedEmail) {
      setEmailVerified(false);
    }
  };

  const consumeCredit = () => {
    if (user) return true;
    if (uses < USE_LIMIT) {
      const next = uses + 1;
      localStorage.setItem(STORAGE_KEY, String(next));
      setUses(next);
      return true;
    }
    setShowModal(true);
    return false;
  };

  const showLoginModal = () => setShowModal(true);
  const logout = () => signOut(auth);

  const deleteAccount = async () => {
    if (!user) return;
    const uid = user.uid;
    try {
      const casesSnap = await getDocs(collection(db, "users", uid, "cases"));
      await Promise.all(casesSnap.docs.map((d) => deleteDoc(d.ref)));
    } catch {}
    try { await deleteDoc(doc(db, "users", uid)); } catch {}
    await deleteUser(auth.currentUser);
  };
  const clearEmailJustVerified = () => setEmailJustVerified(false);
  const usesLeft = user ? null : Math.max(0, USE_LIMIT - uses);

  const initials = (() => {
    const f = profileData?.firstName?.trim()?.[0]?.toUpperCase() || "";
    const l = profileData?.lastName?.trim()?.[0]?.toUpperCase() || "";
    return (f + l) || null;
  })();

  return (
    <AuthContext.Provider value={{
      user, consumeCredit, usesLeft, logout, deleteAccount, showLoginModal,
      profileData, updateProfile, initials,
      emailVerified, emailJustVerified, clearEmailJustVerified,
    }}>
      {linkStatus ? (
        <EmailLinkScreen status={linkStatus} errorCode={linkErrorCode} syncOk={linkSyncOk} syncError={linkSyncError} />
      ) : (
        children
      )}
      {showModal && (
        <PhoneLogin
          onClose={() => setShowModal(false)}
          onSuccess={() => setShowModal(false)}
        />
      )}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
