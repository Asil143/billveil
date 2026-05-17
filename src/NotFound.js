'use client';
import { useRouter } from "next/navigation";

const FONT = "'Inter', system-ui, sans-serif";

const POPULAR = [
  { tab: "analyzer", emoji: "⚡", label: "Bill Analyzer" },
  { tab: "dispute", emoji: "✉️", label: "Dispute Letter" },
  { tab: "drug", emoji: "💊", label: "Drug Prices" },
  { tab: "denial", emoji: "⚔️", label: "Denial Fighter" },
  { tab: "cptlookup", emoji: "🔢", label: "CPT Code Lookup" },
  { tab: "services", emoji: "🛠️", label: "All 44 Tools" },
];

export default function NotFound() {
  const router = useRouter();

  return (
    <div style={{ minHeight: "100vh", background: "#050810", fontFamily: FONT, color: "#f1f5f9", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 20px", textAlign: "center" }}>
      <div style={{ fontSize: 64, marginBottom: 20 }}>🔍</div>
      <div style={{ fontSize: 11, fontWeight: 700, color: "#334155", letterSpacing: "0.14em", marginBottom: 14, textTransform: "uppercase" }}>404 — Page Not Found</div>
      <h1 style={{ fontSize: "clamp(26px, 6vw, 42px)", fontWeight: 900, letterSpacing: "-0.03em", marginBottom: 12, lineHeight: 1.15 }}>
        We couldn't find that page.
      </h1>
      <p style={{ fontSize: 15, color: "#64748b", lineHeight: 1.7, maxWidth: 420, margin: "0 auto 36px" }}>
        It may have moved or the link might be wrong. Here are the most useful places to start:
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 10, maxWidth: 620, width: "100%", marginBottom: 32 }}>
        {POPULAR.map(({ tab, emoji, label }) => (
          <button
            key={tab}
            onClick={() => router.push(`/${tab}`)}
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: "14px 16px", cursor: "pointer", fontFamily: FONT, display: "flex", alignItems: "center", gap: 10, transition: "all 0.2s", textAlign: "left" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(16,185,129,0.4)"; e.currentTarget.style.background = "rgba(16,185,129,0.06)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.background = "rgba(255,255,255,0.03)"; }}
          >
            <span style={{ fontSize: 22 }}>{emoji}</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#f1f5f9" }}>{label}</span>
          </button>
        ))}
      </div>

      <button
        onClick={() => router.push("/")}
        style={{ padding: "12px 28px", background: "linear-gradient(135deg, #10b981, #059669)", color: "#fff", border: "none", borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: FONT, boxShadow: "0 6px 20px rgba(16,185,129,0.35)" }}
      >
        ← Back to Homepage
      </button>
    </div>
  );
}
