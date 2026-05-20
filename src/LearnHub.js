'use client';
import { useState } from "react";
import { useRouter } from "next/navigation";
import { stories } from "./learnStories";

const FONT = "'Inter', system-ui, sans-serif";
const FILTERS = ["All", "Bills & Charges", "Insurance", "Drugs", "Debt & Rights", "Assistance"];
const liveStories = stories.filter(s => s.status === "live");

export default function LearnHub() {
  const router = useRouter();
  const [filter, setFilter] = useState("All");
  const visible = filter === "All" ? stories : stories.filter(s => s.category === filter);

  return (
    <div style={{ minHeight: "100vh", background: "#050810", fontFamily: FONT, color: "#f1f5f9" }}>
      <style>{`
        .learn-card { transition: all 0.18s; }
        .learn-card:hover { transform: translateY(-3px); box-shadow: 0 16px 48px rgba(0,0,0,0.5) !important; }
        .filter-btn:hover { border-color: rgba(16,185,129,0.4) !important; color: #10b981 !important; }
        @media (max-width: 640px) { .learn-grid { grid-template-columns: 1fr !important; } }
      `}</style>

      {/* Header */}
      <div style={{ background: "rgba(5,8,16,0.95)", borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "14px 20px", display: "flex", alignItems: "center", gap: 12 }}>
        <button onClick={() => router.push("/analyzer")} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 8, padding: 0 }}>
          <div style={{ width: 28, height: 28, background: "linear-gradient(135deg, #10b981, #059669)", borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15 }}>🛡️</div>
          <span style={{ fontSize: 16, fontWeight: 800, color: "#f1f5f9", letterSpacing: "-0.02em" }}>BillVeil</span>
        </button>
        <span style={{ color: "#1e293b", fontSize: 16 }}>/</span>
        <span style={{ fontSize: 14, fontWeight: 600, color: "#64748b" }}>Case Files</span>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "48px 20px 80px" }}>

        {/* Hero */}
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.25)", borderRadius: 20, padding: "5px 14px", fontSize: 12, fontWeight: 700, color: "#10b981", marginBottom: 20, letterSpacing: "0.06em" }}>
            📁 CASE FILES
          </div>
          <h1 style={{ fontSize: "clamp(28px, 6vw, 48px)", fontWeight: 900, lineHeight: 1.1, letterSpacing: "-0.03em", marginBottom: 16, color: "#f1f5f9" }}>
            Put yourself{" "}
            <span style={{ color: "#10b981", textShadow: "0 0 24px rgba(16,185,129,0.35)" }}>in the situation</span>
          </h1>
          <p style={{ fontSize: "clamp(15px, 3vw, 18px)", color: "#64748b", lineHeight: 1.7, maxWidth: 560, margin: "0 auto 12px" }}>
            Illustrative cases designed to show exactly how each tool works in real billing situations — step by step, from the problem to the resolution.
          </p>
          <p style={{ fontSize: 12, color: "#334155", marginBottom: 32 }}>
            These are scenario-based guides, not testimonials.
          </p>

          {/* Stats row */}
          <div style={{ display: "inline-flex", gap: 0, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, overflow: "hidden" }}>
            {[
              { n: `${liveStories.length}`, label: "Case files" },
              { n: `${stories.length}`, label: "Cases total" },
              { n: "44", label: "Tools covered" },
            ].map(({ n, label }, i) => (
              <div key={label} style={{ padding: "16px 28px", borderRight: i < 2 ? "1px solid rgba(255,255,255,0.06)" : "none", textAlign: "center" }}>
                <div style={{ fontSize: "clamp(18px, 4vw, 24px)", fontWeight: 900, color: "#10b981" }}>{n}</div>
                <div style={{ fontSize: 11, color: "#475569", marginTop: 2 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Filter */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center", marginBottom: 36 }}>
          {FILTERS.map(f => (
            <button key={f} className="filter-btn" onClick={() => setFilter(f)} style={{ padding: "7px 16px", background: filter === f ? "rgba(16,185,129,0.12)" : "rgba(255,255,255,0.04)", border: `1px solid ${filter === f ? "rgba(16,185,129,0.4)" : "rgba(255,255,255,0.08)"}`, borderRadius: 20, color: filter === f ? "#10b981" : "#64748b", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: FONT, transition: "all 0.15s" }}>
              {f}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="learn-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 20 }}>
          {visible.map((story, idx) => (
            <StoryCard key={story.slug} story={story} caseNumber={liveStories.indexOf(story) + 1} onClick={() => story.status === "live" && router.push(`/learn/${story.slug}`)} />
          ))}
        </div>

        {visible.length === 0 && (
          <div style={{ textAlign: "center", padding: "60px 20px", color: "#334155", fontSize: 15 }}>
            No cases in this category yet. Check back soon.
          </div>
        )}
      </div>
    </div>
  );
}

function StoryCard({ story, caseNumber, onClick }) {
  const isLive = story.status === "live";
  return (
    <div className={isLive ? "learn-card" : ""} onClick={onClick} style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${isLive ? "rgba(255,255,255,0.09)" : "rgba(255,255,255,0.05)"}`, borderTop: `3px solid ${isLive ? story.color : "rgba(255,255,255,0.06)"}`, borderRadius: 16, padding: 22, cursor: isLive ? "pointer" : "default", opacity: isLive ? 1 : 0.6, position: "relative", boxShadow: "0 4px 20px rgba(0,0,0,0.3)" }}>

      {!isLive && (
        <div style={{ position: "absolute", top: 16, right: 16, fontSize: 10, fontWeight: 700, color: "#475569", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)", padding: "3px 10px", borderRadius: 10, letterSpacing: "0.06em" }}>
          COMING SOON
        </div>
      )}

      {isLive && (
        <div style={{ fontSize: 10, fontWeight: 700, color: "#334155", letterSpacing: "0.1em", marginBottom: 10 }}>
          CASE #{String(caseNumber).padStart(3, "0")}
        </div>
      )}

      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 14 }}>
        <div style={{ width: 48, height: 48, background: story.color + "18", border: `1px solid ${story.color}30`, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, flexShrink: 0 }}>
          {story.emoji}
        </div>
        {isLive && story.savingsTag && (
          <div style={{ fontSize: 11, fontWeight: 800, color: "#10b981", background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.25)", padding: "4px 10px", borderRadius: 10 }}>
            {story.savingsTag}
          </div>
        )}
      </div>

      <div style={{ fontSize: 11, color: "#475569", fontWeight: 600, marginBottom: 6, letterSpacing: "0.04em" }}>
        {story.character.name}, {story.character.age} · {story.character.role}
      </div>

      <div style={{ fontSize: 15, fontWeight: 800, color: "#f1f5f9", lineHeight: 1.4, marginBottom: 10, letterSpacing: "-0.01em" }}>
        {story.title}
      </div>

      <div style={{ fontSize: 13, color: "#64748b", lineHeight: 1.6, marginBottom: 14 }}>
        {story.hook}
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: isLive ? 16 : 0 }}>
        {story.tags.map(tag => (
          <span key={tag} style={{ fontSize: 10, fontWeight: 600, color: "#334155", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", padding: "3px 8px", borderRadius: 8 }}>
            {tag}
          </span>
        ))}
      </div>

      {isLive && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 14 }}>
          <span style={{ fontSize: 12, color: "#475569", fontWeight: 600 }}>{story.toolLabel}</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: story.color }}>Open case →</span>
        </div>
      )}
    </div>
  );
}
