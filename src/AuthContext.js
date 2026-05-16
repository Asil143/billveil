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

// Firestore document key for an email — dots/@ replaced so it's a valid doc ID
const emailKey = (email) =>
  email.toLowerCase().replace(/\./g, "_dot_").replace(/@/g, "_at_");

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(undefined);
  const [uses, setUses] = useState(() => parseInt(localStorage.getItem(STORAGE_KEY) || "0", 10));
  const [showModal, setShowModal] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [emailVerified, setEmailVerified] = useState(false);
  const [emailJustVerified, setEmailJustVerified] = useState(false);

  // Capture the email link URL synchronously before history is replaced
  const [pendingEmailLink] = useState(() =>
    isSignInWithEmailLink(auth, window.location.href) ? window.location.href : null
  );

  // On auth state change: reload user + check Firestore for email verification
  useEffect(() => {
    return onAuthStateChanged(auth, async (u) => {
      if (u) {
        try { await u.reload(); } catch {}
        setUser(auth.currentUser);

        // Check profile email verification status in Firestore
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
    if (!pendingEmailLink || user === undefined) return; // wait for auth state

    const urlParams = new URL(pendingEmailLink).searchParams;
    const ownerUid = urlParams.get("uid");
    const email = localStorage.getItem("bv_pending_email") || urlParams.get("email");

    if (!ownerUid || !email) return;

    window.history.replaceState({}, document.title, window.location.pathname);

    const process = async () => {
      try {
        if (auth.currentUser?.phoneNumber) {
          // Same device: link the email credential to the phone account
          const cred = EmailAuthProvider.credentialWithLink(email, pendingEmailLink);
          await linkWithCredential(auth.currentUser, cred);
          await auth.currentUser.reload();
        } else {
          // Different device: sign in with email link just to consume the OTP
          await signInWithEmailLink(auth, email, pendingEmailLink);
          await signOut(auth); // sign back out — phone auth is the primary method
        }

        // Write verified status to Firestore under the email key
        await setDoc(doc(db, "email_verifications", emailKey(email)), {
          verified: true,
          email,
          ownerUid,
          verifiedAt: serverTimestamp(),
        });

        localStorage.removeItem("bv_pending_email");
        setEmailVerified(true);
        setEmailJustVerified(true);
      } catch (err) {
        console.error("Email link error:", err.code, err.message);
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
      {children}
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
