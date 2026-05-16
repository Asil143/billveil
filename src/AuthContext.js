import { createContext, useContext, useEffect, useState } from "react";
import {
  onAuthStateChanged, signOut,
  isSignInWithEmailLink, signInWithEmailLink,
  linkWithCredential, EmailAuthProvider,
} from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "./firebase";
import PhoneLogin from "./PhoneLogin";

const USE_LIMIT = 3;
const STORAGE_KEY = "bv_uses";

const emailKey = (email) =>
  email.toLowerCase().replace(/\./g, "_dot_").replace(/@/g, "_at_");

const AuthContext = createContext(null);

// Full-screen overlay shown when this device processes the email link
function EmailLinkScreen({ status }) {
  const isSuccess = status === "success";
  const isError = status === "error";
  const isPending = status === "pending";

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
        {isSuccess && "You can close this tab and go back to BillVeil on your other device. It will update automatically."}
        {isError && "The link may have expired or already been used. Please go back to BillVeil and request a new verification email."}
      </div>
      {isSuccess && (
        <div style={{
          marginTop: 32, padding: "14px 28px",
          background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.3)",
          borderRadius: 12, color: "#10b981", fontSize: 14, fontWeight: 600,
        }}>
          ✓ All done — you can close this tab
        </div>
      )}
    </div>
  );
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(undefined);
  const [uses, setUses] = useState(() => parseInt(localStorage.getItem(STORAGE_KEY) || "0", 10));
  const [showModal, setShowModal] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [emailVerified, setEmailVerified] = useState(false);
  const [emailJustVerified, setEmailJustVerified] = useState(false);
  // "pending" | "success" | "error" | null
  const [linkStatus, setLinkStatus] = useState(null);

  // Capture the email link URL synchronously before history is replaced
  const [pendingEmailLink] = useState(() =>
    isSignInWithEmailLink(auth, window.location.href) ? window.location.href : null
  );

  // Show overlay immediately if this is an email link landing
  useEffect(() => {
    if (pendingEmailLink) setLinkStatus("pending");
  }, [pendingEmailLink]);

  // On auth state change: reload user + check Firestore for email verification
  useEffect(() => {
    return onAuthStateChanged(auth, async (u) => {
      if (u) {
        try { await u.reload(); } catch {}
        setUser(auth.currentUser);

        try {
          const profile = localStorage.getItem(`bv_profile_${u.uid}`);
          const profileEmail = profile ? JSON.parse(profile)?.email : null;
          if (profileEmail) {
            const snap = await getDoc(doc(db, "email_verifications", emailKey(profileEmail)));
            if (snap.exists() && snap.data().verified) setEmailVerified(true);
          }
        } catch {}
      } else {
        setUser(null);
        setEmailVerified(false);
      }
    });
  }, []);

  // Handle email link click — works on ANY device, logged in or not
  useEffect(() => {
    if (!pendingEmailLink || user === undefined) return;

    const urlParams = new URL(pendingEmailLink).searchParams;
    const ownerUid = urlParams.get("uid");
    const email = localStorage.getItem("bv_pending_email") || urlParams.get("bvemail");

    if (!ownerUid || !email) {
      setLinkStatus("error");
      return;
    }

    window.history.replaceState({}, document.title, window.location.pathname);

    const process = async () => {
      try {
        if (auth.currentUser?.phoneNumber) {
          // Same device: link the email credential to the phone account
          const cred = EmailAuthProvider.credentialWithLink(email, pendingEmailLink);
          await linkWithCredential(auth.currentUser, cred);
          await auth.currentUser.reload();
        } else {
          // Different device: sign in with email link to get an authenticated session
          await signInWithEmailLink(auth, email, pendingEmailLink);
          // NOTE: write to Firestore BEFORE signing out — we need auth for the write
        }

        // Write verified status while authenticated
        await setDoc(doc(db, "email_verifications", emailKey(email)), {
          verified: true,
          email,
          ownerUid,
          verifiedAt: serverTimestamp(),
        });

        // Sign out the temporary email-link session if it wasn't the phone user
        if (!auth.currentUser?.phoneNumber) {
          await signOut(auth);
        }

        localStorage.removeItem("bv_pending_email");
        setEmailVerified(true);
        setEmailJustVerified(true);
        setLinkStatus("success");
      } catch (err) {
        console.error("Email link error:", err.code, err.message);
        setLinkStatus("error");
      }
    };

    process();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // Load profile data when user changes
  useEffect(() => {
    if (user?.uid) {
      try {
        const stored = localStorage.getItem(`bv_profile_${user.uid}`);
        setProfileData(stored ? JSON.parse(stored) : null);
      } catch { setProfileData(null); }
    } else {
      setProfileData(null);
    }
  }, [user]);

  const updateProfile = (data) => {
    if (!user?.uid) return;
    localStorage.setItem(`bv_profile_${user.uid}`, JSON.stringify(data));
    setProfileData(data);
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
  const clearEmailJustVerified = () => setEmailJustVerified(false);
  const usesLeft = user ? null : Math.max(0, USE_LIMIT - uses);

  const initials = (() => {
    const f = profileData?.firstName?.trim()?.[0]?.toUpperCase() || "";
    const l = profileData?.lastName?.trim()?.[0]?.toUpperCase() || "";
    return (f + l) || null;
  })();

  return (
    <AuthContext.Provider value={{
      user, consumeCredit, usesLeft, logout, showLoginModal,
      profileData, updateProfile, initials,
      emailVerified, emailJustVerified, clearEmailJustVerified,
    }}>
      {linkStatus ? (
        <EmailLinkScreen status={linkStatus} />
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
