'use client';
import { useRouter } from "next/navigation";
import { stories } from "./learnStories";

const FONT = "'Inter', system-ui, sans-serif";

const SECTION_ICONS = {
  scene: "📋",
  confusion: "❓",
  education: "💡",
  steps: "🛠️",
  outcome: "✅",
};

export default function LearnStory({ story }) {
  const router = useRouter();

  const liveStories = stories.filter(s => s.status === "live");
  const caseNumber = liveStories.findIndex(s => s.slug === story.slug) + 1;
  const related = liveStories.filter(s => s.slug !== story.slug).slice(0, 3);

  return (
    <div style={{ minHeight: "100vh", background: "#050810", fontFamily: FONT, color: "#f1f5f9" }}>
      <style>{`
        .tool-cta:hover { transform: translateY(-2px); box-shadow: 0 16px 40px rgba(16,185,129,0.5) !important; }
        .back-link:hover { color: #10b981 !important; }
        .related-card:hover { border-color: rgba(255,255,255,0.15) !important; transform: translateY(-2px); }
      `}</style>

      {/* Header */}
      <div style={{ background: "rgba(5,8,16,0.95)", borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "14px 20px", display: "flex", alignItems: "center", gap: 12 }}>
        <button onClick={() => router.push("/analyzer")} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 8, padding: 0 }}>
          <div style={{ width: 28, height: 28, background: "linear-gradient(135deg, #10b981, #059669)", borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15 }}>🛡️</div>
          <span style={{ fontSize: 16, fontWeight: 800, color: "#f1f5f9", letterSpacing: "-0.02em" }}>BillVeil</span>
        </button>
        <span style={{ color: "#1e293b" }}>/</span>
        <button className="back-link" onClick={() => router.push("/learn")} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 14, fontWeight: 600, color: "#64748b", padding: 0, transition: "color 0.15s", fontFamily: FONT }}>Learn</button>
        <span style={{ color: "#1e293b" }}>/</span>
        <span style={{ fontSize: 13, color: "#334155", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 200 }}>{story.title}</span>
      </div>

      <div style={{ maxWidth: 720, margin: "0 auto", padding: "40px 20px 80px" }}>

        {/* Case File header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28, flexWrap: "wrap", gap: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: 10, padding: "6px 14px" }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: "#10b981", letterSpacing: "0.1em" }}>📁 CASE FILE #{String(caseNumber).padStart(3, "0")}</span>
          </div>
          <div style={{ fontSize: 11, color: "#334155", fontStyle: "italic" }}>
            Illustrative scenario — not a real person
          </div>
        </div>

        {/* Story header */}
        <div style={{ marginBottom: 40 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
            <div style={{ width: 56, height: 56, background: story.color + "18", border: `1px solid ${story.color}30`, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30 }}>
              {story.emoji}
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#475569", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 4 }}>
                {story.category}
              </div>
              <div style={{ fontSize: 12, color: "#64748b" }}>
                {story.character.name}, {story.character.age} · {story.character.role}
              </div>
            </div>
          </div>

          <h1 style={{ fontSize: "clamp(22px, 5vw, 34px)", fontWeight: 900, lineHeight: 1.2, letterSpacing: "-0.02em", marginBottom: 14, color: "#f1f5f9" }}>
            {story.title}
          </h1>

          <p style={{ fontSize: 17, color: "#64748b", lineHeight: 1.7, marginBottom: 20 }}>
            {story.hook}
          </p>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
            {story.savingsTag && (
              <div style={{ fontSize: 13, fontWeight: 800, color: "#10b981", background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.3)", padding: "5px 14px", borderRadius: 20 }}>
                {story.savingsTag}
              </div>
            )}
            {story.tags.map(tag => (
              <span key={tag} style={{ fontSize: 11, fontWeight: 600, color: "#94a3b8", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.14)", padding: "4px 10px", borderRadius: 10 }}>
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Story sections */}
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>

          <Section icon={SECTION_ICONS.scene} heading={story.story.scene.heading} color={story.color}>
            {story.story.scene.body.map((p, i) => <P key={i}>{p}</P>)}
          </Section>

          <Section icon={SECTION_ICONS.confusion} heading={story.story.confusion.heading} color="#f59e0b">
            {story.story.confusion.body.map((p, i) => <P key={i}>{p}</P>)}
          </Section>

          <Section icon={SECTION_ICONS.education} heading={story.story.education.heading} color="#60a5fa">
            {story.story.education.body.map((p, i) => <P key={i}>{p}</P>)}
          </Section>

          <Section icon={SECTION_ICONS.steps} heading={story.story.steps.heading} color="#a78bfa">
            <ol style={{ paddingLeft: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
              {story.story.steps.items.map((step, i) => (
                <li key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <div style={{ width: 24, height: 24, background: "rgba(167,139,250,0.15)", border: "1px solid rgba(167,139,250,0.3)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, color: "#a78bfa", flexShrink: 0, marginTop: 1 }}>
                    {i + 1}
                  </div>
                  <span style={{ fontSize: 15, color: "#cbd5e1", lineHeight: 1.7 }}>{step}</span>
                </li>
              ))}
            </ol>
          </Section>

          {/* Outcome */}
          <div style={{ background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.2)", borderLeft: "3px solid #10b981", borderRadius: 16, padding: "24px 28px", marginBottom: 4 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#10b981", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 14 }}>
              {SECTION_ICONS.outcome} {story.story.outcome.heading}
            </div>
            <p style={{ fontSize: 15, color: "#cbd5e1", lineHeight: 1.8, marginBottom: 16 }}>
              {story.story.outcome.body}
            </p>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.4)", borderRadius: 12, padding: "10px 20px", fontSize: 18, fontWeight: 900, color: "#10b981" }}>
              ✓ {story.story.outcome.highlight}
            </div>
          </div>
        </div>

        {/* Tool CTA */}
        <div style={{ marginTop: 40, background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: 20, padding: "28px 28px", textAlign: "center" }}>
          <div style={{ fontSize: 14, color: "#64748b", marginBottom: 8 }}>
            This tool was used to resolve this case
          </div>
          <div style={{ fontSize: 22, fontWeight: 900, color: "#f1f5f9", marginBottom: 20 }}>
            Try {story.toolLabel}
          </div>
          <button
            className="tool-cta"
            onClick={() => router.push(`/${story.tool}`)}
            style={{ padding: "14px 32px", background: "linear-gradient(135deg, #10b981, #059669)", color: "#fff", border: "none", borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: FONT, boxShadow: "0 8px 28px rgba(16,185,129,0.35)", transition: "all 0.2s" }}
          >
            Open {story.toolLabel} →
          </button>
          <div style={{ marginTop: 12, fontSize: 12, color: "#334155" }}>Free · No sign-up required to try</div>
        </div>

        {/* Related stories */}
        {related.length > 0 && (
          <div style={{ marginTop: 56 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#334155", letterSpacing: "0.12em", marginBottom: 20 }}>MORE CASE FILES</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {related.map(s => (
                <div
                  key={s.slug}
                  className="related-card"
                  onClick={() => router.push(`/learn/${s.slug}`)}
                  style={{ display: "flex", alignItems: "center", gap: 14, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: "14px 16px", cursor: "pointer", transition: "all 0.15s" }}
                >
                  <div style={{ width: 36, height: 36, background: s.color + "18", borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>{s.emoji}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#f1f5f9", marginBottom: 2 }}>{s.title}</div>
                    <div style={{ fontSize: 12, color: "#475569" }}>{s.character.name}, {s.character.age} · {s.savingsTag}</div>
                  </div>
                  <span style={{ color: "#334155", fontSize: 16, flexShrink: 0 }}>→</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Section({ icon, heading, color, children }) {
  return (
    <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderLeft: `3px solid ${color}`, borderRadius: 16, padding: "22px 24px", marginBottom: 4 }}>
      <div style={{ fontSize: 11, fontWeight: 700, color, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 14 }}>
        {icon} {heading}
      </div>
      {children}
    </div>
  );
}

function P({ children }) {
  return <p style={{ fontSize: 15, color: "#cbd5e1", lineHeight: 1.8, marginBottom: 12 }}>{children}</p>;
}
