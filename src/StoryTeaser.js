'use client';
import { useRouter } from "next/navigation";
import { stories } from "./learnStories";

const FONT = "'Inter', system-ui, sans-serif";

const TOOL_TO_STORY = {
  surprisebill: "surprise-billing",
  denial: "denied-claim-appeal",
  negotiate: "negotiate-hospital-bill",
  eob: "eob-explained",
  debtrights: "medical-debt-collectors",
  charitycare: "charity-care",
  genericdrug: "generic-drug-savings",
  priorauth: "prior-auth",
  itemization: "itemization-request",
  dispute: "dispute-letter",
  paymentplan: "payment-plan",
  erurgent: "er-vs-urgent-care",
  cptlookup: "cpt-code-lookup",
  creditcard: "medical-credit-card",
  insplan: "insurance-plan-decoder",
};

export default function StoryTeaser({ tool }) {
  const router = useRouter();
  const slug = TOOL_TO_STORY[tool];
  if (!slug) return null;

  const story = stories.find(s => s.slug === slug && s.status === "live");
  if (!story) return null;

  return (
    <div style={{ marginTop: 32, marginBottom: 8 }}>
      <div style={{ fontSize: 10, fontWeight: 700, color: "#334155", letterSpacing: "0.12em", marginBottom: 12 }}>
        REAL STORY
      </div>
      <button
        onClick={() => router.push(`/learn/${story.slug}`)}
        style={{
          width: "100%", textAlign: "left", cursor: "pointer", fontFamily: FONT,
          background: "rgba(255,255,255,0.02)",
          border: `1px solid rgba(255,255,255,0.08)`,
          borderLeft: `3px solid ${story.color}`,
          borderRadius: 14, padding: "18px 20px",
          transition: "all 0.18s",
        }}
        onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.14)"; }}
        onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.02)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 40, height: 40, background: story.color + "18", border: `1px solid ${story.color}30`, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>
            {story.emoji}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 11, color: "#475569", fontWeight: 600, marginBottom: 3 }}>
              {story.character.name}, {story.character.age} · {story.character.role}
            </div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#f1f5f9", lineHeight: 1.4, marginBottom: 4 }}>
              {story.title}
            </div>
            <div style={{ fontSize: 12, color: "#64748b" }}>{story.hook}</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8, flexShrink: 0 }}>
            {story.savingsTag && (
              <div style={{ fontSize: 11, fontWeight: 800, color: "#10b981", background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.25)", padding: "3px 10px", borderRadius: 10, whiteSpace: "nowrap" }}>
                {story.savingsTag}
              </div>
            )}
            <div style={{ fontSize: 12, fontWeight: 700, color: story.color }}>Read story →</div>
          </div>
        </div>
      </button>
    </div>
  );
}
