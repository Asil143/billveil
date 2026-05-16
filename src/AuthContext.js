import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signOut, isSignInWithEmailLink, linkWithCredential, EmailAuthProvider } from "firebase/auth";
import { auth } from "./firebase";
import PhoneLogin from "./PhoneLogin";

const USE_LIMIT = 3;
const STORAGE_KEY = "bv_uses";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(undefined);
  const [uses, setUses] = useState(() => parseInt(localStorage.getItem(STORAGE_KEY) || "0", 10));
  const [showModal, setShowModal] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [pendingEmailLink] = useState(() =>
    isSignInWithEmailLink(auth, window.location.href) ? window.location.href : null
  );

  useEffect(() => {
    return onAuthStateChanged(auth, (u) => setUser(u || null));
  }, []);

  // When user is ready and there's a pending email link, link the credential
  useEffect(() => {
    if (!pendingEmailLink || !user) return;
    const email = localStorage.getItem("bv_pending_email");
    if (!email) return;
    window.history.replaceState({}, document.title, window.location.pathname);
    const credential = EmailAuthProvider.credentialWithLink(email, pendingEmailLink);
    linkWithCredential(user, credential)
      .then(() => localStorage.removeItem("bv_pending_email"))
      .catch((err) => console.error("Email link error:", err.code, err.message));
  }, [user, pendingEmailLink]);

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
  const usesLeft = user ? null : Math.max(0, USE_LIMIT - uses);

  const initials = (() => {
    const f = profileData?.firstName?.trim()?.[0]?.toUpperCase() || "";
    const l = profileData?.lastName?.trim()?.[0]?.toUpperCase() || "";
    return (f + l) || null;
  })();

  return (
    <AuthContext.Provider value={{ user, consumeCredit, usesLeft, logout, showLoginModal, profileData, updateProfile, initials }}>
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
