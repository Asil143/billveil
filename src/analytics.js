'use client';
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";

/**
 * trackEvent(uid, action, meta)
 * Writes one document to analytics/{auto-id}. Never throws — tracking
 * must never crash the app.
 *
 * action examples:
 *   "tool_viewed"      meta: { tool }
 *   "tool_completed"   meta: { tool, resultLength }
 *   "login"            meta: { method: "phone" }
 *   "profile_saved"    meta: {}
 *   "case_created"     meta: { status, hasAmount }
 *   "bill_analyzed"    meta: { billLength }
 *   "billscan_used"    meta: {}
 *   "chat_sent"        meta: {}
 */
export const trackEvent = async (uid, action, meta = {}) => {
  try {
    await addDoc(collection(db, "analytics"), {
      uid: uid || null,
      action,
      ...meta,
      ts: serverTimestamp(),
    });
  } catch {}
};
