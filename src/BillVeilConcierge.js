import { useState, useRef, useEffect } from "react";
import { useAuth } from "./AuthContext";
import axios from "axios";

const FONT = "'Inter', system-ui, sans-serif";

const SUGGESTIONS = [
  "My ER bill is $4,200 — is that fair?",
  "Insurance denied my MRI claim",
  "I need help writing a dispute letter",
  "What are my rights against a debt collector?",
  "Help me understand my Explanation of Benefits",
];

export default function BillVeilConcierge() {
  const { consumeCredit } = useAuth();
  const [messages, setMessages] = useState([{
    role: "assistant",
    content: "Hi! I'm your BillVeil medical billing assistant. Tell me about your situation — a confusing bill, a claim denial, an overcharge, anything. I'll help you understand it and fight back.\n\nWhat's going on with your bill?"
  }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const send = async (text) => {
    const msg = (text || input).trim();
    if (!msg || loading) return;
    if (!consumeCredit()) return;
    setInput("");
    const newMessages = [...messages, { role: "user", content: msg }];
    setMessages(newMessages);
    setLoading(true);
    try {
      const r = await axios.post("/api/tools", {
        tool: "concierge",
        messages: newMessages.map(m => ({ role: m.role, content: m.content })),
      });
      setMessages([...newMessages, { role: "assistant", content: r.data.result }]);
    } catch {
      setMessages([...newMessages, { role: "assistant", content: "Sorry, something went wrong. Please try again." }]);
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 160px)", minHeight: 480, maxHeight: 800 }}>
      <div style={{ textAlign: "center", marginBottom: 16, flexShrink: 0 }}>
        <h1 style={{ fontSize: "clamp(20px, 5vw, 28px)", fontWeight: 900, letterSpacing: "-0.03em", marginBottom: 4, color: "#f1f5f9" }}>
          BillVeil <span style={{ color: "#10b981", textShadow: "0 0 20px rgba(16,185,129,0.4)" }}>Concierge</span>
        </h1>
        <p style={{ fontSize: 13, color: "#64748b" }}>Just describe your situation. I handle everything.</p>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "4px 2px", marginBottom: 12 }}>
        {messages.map((m, i) => (
          <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start", marginBottom: 14, alignItems: "flex-start" }}>
            {m.role === "assistant" && (
              <div style={{ width: 30, height: 30, background: "linear-gradient(135deg, #10b981, #059669)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, flexShrink: 0, marginRight: 10, marginTop: 2, boxShadow: "0 0 10px rgba(16,185,129,0.3)" }}>🛡️</div>
            )}
            <div style={{
              maxWidth: "78%",
              padding: "12px 16px",
              borderRadius: m.role === "user" ? "18px 18px 4px 18px" : "4px 18px 18px 18px",
              background: m.role === "user" ? "linear-gradient(135deg, #10b981, #059669)" : "rgba(255,255,255,0.05)",
              border: m.role === "user" ? "none" : "1px solid rgba(255,255,255,0.09)",
              color: m.role === "user" ? "#fff" : "#cbd5e1",
              fontSize: 14,
              lineHeight: 1.75,
              whiteSpace: "pre-wrap",
              fontFamily: FONT,
              boxShadow: m.role === "user" ? "0 4px 16px rgba(16,185,129,0.25)" : "none",
            }}>
              {m.content}
            </div>
          </div>
        ))}

        {loading && (
          <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 14 }}>
            <div style={{ width: 30, height: 30, background: "linear-gradient(135deg, #10b981, #059669)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, flexShrink: 0 }}>🛡️</div>
            <div style={{ padding: "14px 18px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: "4px 18px 18px 18px", display: "flex", gap: 5, alignItems: "center" }}>
              {[0, 1, 2].map(i => (
                <span key={i} style={{ width: 7, height: 7, background: "#10b981", borderRadius: "50%", display: "inline-block", animation: `pulse 1.2s ease-in-out ${i * 0.22}s infinite` }} />
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {messages.length === 1 && !loading && (
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 10, flexShrink: 0 }}>
          {SUGGESTIONS.map(s => (
            <button
              key={s}
              onClick={() => send(s)}
              style={{ padding: "6px 13px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: 20, color: "#64748b", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: FONT, transition: "all 0.15s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(16,185,129,0.35)"; e.currentTarget.style.color = "#10b981"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.09)"; e.currentTarget.style.color = "#64748b"; }}
            >{s}</button>
          ))}
        </div>
      )}

      <div style={{ display: "flex", gap: 10, flexShrink: 0 }}>
        <textarea
          ref={inputRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Describe your billing situation... (Enter to send)"
          rows={2}
          style={{ flex: 1, padding: "12px 14px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 14, fontSize: 14, color: "#f1f5f9", resize: "none", fontFamily: FONT, lineHeight: 1.55 }}
        />
        <button
          onClick={() => send()}
          disabled={!input.trim() || loading}
          style={{ padding: "0 22px", background: !input.trim() || loading ? "rgba(255,255,255,0.05)" : "linear-gradient(135deg, #10b981, #059669)", color: !input.trim() || loading ? "#334155" : "#fff", border: "none", borderRadius: 14, fontSize: 22, cursor: !input.trim() || loading ? "default" : "pointer", flexShrink: 0, transition: "all 0.2s", boxShadow: !input.trim() || loading ? "none" : "0 4px 16px rgba(16,185,129,0.3)" }}
        >→</button>
      </div>
    </div>
  );
}
