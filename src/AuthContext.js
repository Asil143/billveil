import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "./firebase";
import PhoneLogin from "./PhoneLogin";

const USE_LIMIT = 3;
const STORAGE_KEY = "bv_uses";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(undefined); // undefined = still loading
  const [uses, setUses] = useState(() => parseInt(localStorage.getItem(STORAGE_KEY) || "0", 10));
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    return onAuthStateChanged(auth, (u) => setUser(u || null));
  }, []);

  const useCredit = () => {
    // While Firebase is loading (user === undefined), treat as logged in to avoid false modal
    if (user !== null) return true;
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

  return (
    <AuthContext.Provider value={{ user, useCredit, usesLeft, logout, showLoginModal }}>
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
