'use client';
import { useState, useRef, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "./AuthContext";
import axios from "axios";
import { trackEvent } from "./analytics";

const FONT = "'Inter', system-ui, sans-serif";

const HIDE_ON = ["/concierge"];

const QUICK_QUESTIONS = [
  "My bill looks too high — what do I do?",
  "How do I dispute a medical bill?",
  "Insurance denied my claim — can I appeal?",
  "What is a CPT code?",
  "Can I negotiate my hospital bill?",
  "What's free under the No Surprises Act?",
];


function ToolLink({ text, navigate }) {
  // parse [Tool Name](/path) style links from AI response
  const parts = [];
  const regex = /\[([^\]]+)\]\(\/([^)]+)\)/g;
  let last = 0;
  let m;
  while ((m = regex.exec(text)) !== null) {
    if (m.index > last) parts.push({ type: "text", content: text.slice(last, m.index) });
    parts.push({ type: "link", label: m[1], path: "/" + m[2] });
    last = m.index + m[0].length;
  }
  if (last < text.length) parts.push({ type: "text", content: text.slice(last) });

  if (parts.length === 0) return <span>{text}</span>;
  return (
    <span>
      {parts.map((p, i) =>
        p.type === "link" ? (
          <button
            key={i}
            onClick={() => navigate(p.path)}
            style={{ background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.3)", borderRadius: 6, color: "#10b981", fontSize: 12, fontWeight: 700, padding: "1px 8px", cursor: "pointer", fontFamily: FONT, margin: "0 2px" }}
          >
            {p.label} →
          </button>
        ) : (
          <span key={i}>{p.content}</span>
        )
      )}
    </span>
  );
}

export default function FloatingChat() {
  const pathname = usePathname();
  const router = useRouter();
  const { consumeCredit, showLoginModal } = useAuth();

  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hi! I'm BillVeil's AI assistant. I can answer any question about your medical bill, explain what something means, or point you to the right tool.\n\nWhat can I help you with?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [unread, setUnread] = useState(0);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const panelRef = useRef(null);

  const hidden = HIDE_ON.includes(pathname);

  useEffect(() => {
    if (open) {
      setUnread(0);
      setTimeout(() => inputRef.current?.focus(), 80);
    }
  }, [open]);

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading, open]);

  // close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        const btn = document.getElementById("bv-chat-btn");
        if (btn && btn.contains(e.target)) return;
        setOpen(false);
      }
    };
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const send = async (text) => {
    const msg = (text || input).trim();
    if (!msg || loading) return;
    if (!consumeCredit()) { showLoginModal(); return; }
    trackEvent(user?.uid || null, "chat_sent", { tool: "floating_chat" });
    setInput("");
    const newMessages = [...messages, { role: "user", content: msg }];
    setMessages(newMessages);
    setLoading(true);
    try {
      const r = await axios.post("/api/tools", {
        tool: "concierge",
        messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
        compact: true,
      });
      const reply = r.data.result;
      setMessages([...newMessages, { role: "assistant", content: reply }]);
      if (!open) setUnread((n) => n + 1);
    } catch {
      setMessages([...newMessages, { role: "assistant", content: "Something went wrong. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
  };

  if (hidden) return null;

  return (
    <>
      <style>{`
        @keyframes bv-slide-up { from { opacity: 0; transform: translateY(16px) scale(0.96); } to { opacity: 1; transform: translateY(0) scale(1); } }
        @keyframes bv-bounce { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }
        @keyframes bv-pulse { 0%,100% { opacity:1; } 50% { opacity:0.4; } }
        #bv-chat-btn:hover { transform: scale(1.08) !important; box-shadow: 0 12px 40px rgba(16,185,129,0.6) !important; }
        .bv-suggestion:hover { background: rgba(16,185,129,0.12) !important; border-color: rgba(16,185,129,0.35) !important; color: #10b981 !important; }
        .bv-send:hover:not(:disabled) { background: linear-gradient(135deg, #059669, #047857) !important; }
        .bv-msg-input:focus { outline: none; border-color: rgba(16,185,129,0.5) !important; box-shadow: 0 0 0 2px rgba(16,185,129,0.1) !important; }
        ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 2px; }
      `}</style>

      {/* Floating button */}
      <button
        id="bv-chat-btn"
        onClick={() => setOpen((v) => !v)}
        style={{
          position: "fixed", bottom: 24, right: 24, zIndex: 9998,
          width: 56, height: 56, borderRadius: "50%",
          background: open ? "#0d1526" : "linear-gradient(135deg, #10b981, #059669)",
          border: open ? "2px solid rgba(16,185,129,0.4)" : "none",
          color: "#fff", fontSize: 24, cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 8px 32px rgba(16,185,129,0.45)",
          transition: "all 0.25s", fontFamily: FONT,
        }}
        title="Ask BillVeil"
      >
        {open ? (
          <span style={{ fontSize: 20, color: "#10b981" }}>×</span>
        ) : (
          <span style={{ animation: "bv-bounce 3s ease-in-out infinite" }}>💬</span>
        )}
        {!open && unread > 0 && (
          <span style={{
            position: "absolute", top: 0, right: 0,
            width: 18, height: 18, background: "#f87171", borderRadius: "50%",
            fontSize: 10, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center",
            border: "2px solid #050810",
          }}>{unread}</span>
        )}
      </button>

      {/* Chat panel */}
      {open && (
        <div
          ref={panelRef}
          style={{
            position: "fixed", bottom: 92, right: 24, zIndex: 9997,
            width: "min(400px, calc(100vw - 32px))",
            height: "min(540px, calc(100vh - 120px))",
            background: "#0a0f1e",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 20,
            boxShadow: "0 24px 80px rgba(0,0,0,0.8), 0 0 0 1px rgba(16,185,129,0.1)",
            display: "flex", flexDirection: "column",
            animation: "bv-slide-up 0.25s ease forwards",
            overflow: "hidden",
          }}
        >
          {/* Header */}
          <div style={{
            padding: "14px 18px",
            background: "linear-gradient(135deg, rgba(16,185,129,0.12), rgba(5,150,105,0.06))",
            borderBottom: "1px solid rgba(255,255,255,0.07)",
            display: "flex", alignItems: "center", gap: 12, flexShrink: 0,
          }}>
            <div style={{ width: 34, height: 34, background: "linear-gradient(135deg, #10b981, #059669)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, boxShadow: "0 0 12px rgba(16,185,129,0.4)", flexShrink: 0 }}>🛡️</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: "#f1f5f9", letterSpacing: "-0.01em" }}>BillVeil Assistant</div>
              <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 2 }}>
                <span style={{ width: 6, height: 6, background: "#10b981", borderRadius: "50%", animation: "bv-pulse 2s ease-in-out infinite" }} />
                <span style={{ fontSize: 11, color: "#10b981", fontWeight: 600 }}>Online · 44 tools available</span>
              </div>
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              {messages.length > 1 && (
                <button
                  onClick={() => setMessages([messages[0]])}
                  title="Clear chat"
                  style={{ background: "none", border: "none", color: "#475569", fontSize: 13, cursor: "pointer", padding: "4px 8px", borderRadius: 6, fontFamily: FONT }}
                >
                  Clear
                </button>
              )}
              <button
                onClick={() => router.push("/concierge")}
                title="Open full chat"
                style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)", color: "#10b981", fontSize: 11, fontWeight: 700, cursor: "pointer", padding: "4px 10px", borderRadius: 8, fontFamily: FONT }}
              >
                Full chat ↗
              </button>
            </div>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: "auto", padding: "14px 14px 8px" }}>
            {messages.map((m, i) => (
              <div
                key={i}
                style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start", marginBottom: 12, alignItems: "flex-end", gap: 8 }}
              >
                {m.role === "assistant" && (
                  <div style={{ width: 26, height: 26, background: "linear-gradient(135deg, #10b981, #059669)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, flexShrink: 0 }}>🛡️</div>
                )}
                <div style={{
                  maxWidth: "82%",
                  padding: "10px 14px",
                  borderRadius: m.role === "user" ? "16px 16px 4px 16px" : "4px 16px 16px 16px",
                  background: m.role === "user"
                    ? "linear-gradient(135deg, #10b981, #059669)"
                    : "rgba(255,255,255,0.05)",
                  border: m.role === "assistant" ? "1px solid rgba(255,255,255,0.08)" : "none",
                  color: m.role === "user" ? "#fff" : "#cbd5e1",
                  fontSize: 13,
                  lineHeight: 1.7,
                  fontFamily: FONT,
                  boxShadow: m.role === "user" ? "0 4px 14px rgba(16,185,129,0.25)" : "none",
                }}>
                  {m.role === "assistant"
                    ? <ToolLink text={m.content} navigate={(p) => router.push(p)} />
                    : m.content
                  }
                </div>
              </div>
            ))}

            {loading && (
              <div style={{ display: "flex", alignItems: "flex-end", gap: 8, marginBottom: 12 }}>
                <div style={{ width: 26, height: 26, background: "linear-gradient(135deg, #10b981, #059669)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, flexShrink: 0 }}>🛡️</div>
                <div style={{ padding: "12px 16px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "4px 16px 16px 16px", display: "flex", gap: 4, alignItems: "center" }}>
                  {[0, 1, 2].map((j) => (
                    <span key={j} style={{ width: 6, height: 6, background: "#10b981", borderRadius: "50%", display: "inline-block", animation: `bv-pulse 1.2s ease-in-out ${j * 0.22}s infinite` }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Quick suggestions — only on first message */}
          {messages.length === 1 && !loading && (
            <div style={{ padding: "0 14px 10px", display: "flex", gap: 6, flexWrap: "wrap" }}>
              {QUICK_QUESTIONS.map((q) => (
                <button
                  key={q}
                  className="bv-suggestion"
                  onClick={() => send(q)}
                  style={{ padding: "5px 11px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: 20, color: "#64748b", fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: FONT, transition: "all 0.15s" }}
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div style={{ padding: "10px 14px 14px", borderTop: "1px solid rgba(255,255,255,0.07)", display: "flex", gap: 8, flexShrink: 0, background: "rgba(0,0,0,0.2)" }}>
            <textarea
              ref={inputRef}
              className="bv-msg-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Ask anything about your bill..."
              rows={1}
              style={{
                flex: 1, padding: "10px 12px",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 12, fontSize: 13, color: "#f1f5f9",
                resize: "none", fontFamily: FONT, lineHeight: 1.5,
                maxHeight: 80, overflow: "auto",
              }}
            />
            <button
              className="bv-send"
              onClick={() => send()}
              disabled={!input.trim() || loading}
              style={{
                padding: "0 16px",
                background: !input.trim() || loading ? "rgba(255,255,255,0.05)" : "linear-gradient(135deg, #10b981, #059669)",
                color: !input.trim() || loading ? "#334155" : "#fff",
                border: "none", borderRadius: 12, fontSize: 18,
                cursor: !input.trim() || loading ? "default" : "pointer",
                flexShrink: 0, transition: "all 0.2s",
                boxShadow: !input.trim() || loading ? "none" : "0 4px 14px rgba(16,185,129,0.3)",
              }}
            >→</button>
          </div>
        </div>
      )}
    </>
  );
}
