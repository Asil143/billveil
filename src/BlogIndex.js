'use client';
import { blogPosts } from "./blogPosts";
import Link from "next/link";

const FONT = "'Inter', system-ui, sans-serif";

export default function BlogIndex() {
  return (
    <div style={{ background: "#050810", minHeight: "100vh", fontFamily: FONT }}>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "60px 20px 80px" }}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.15em", color: "#10b981", marginBottom: 12 }}>GUIDES & RESOURCES</div>
          <h1 style={{ fontSize: "clamp(28px, 6vw, 48px)", fontWeight: 900, letterSpacing: "-0.03em", color: "#f1f5f9", margin: "0 0 16px" }}>
            Medical Billing <span style={{ color: "#10b981" }}>Guides</span>
          </h1>
          <p style={{ fontSize: 17, color: "#64748b", lineHeight: 1.6, maxWidth: 560, margin: "0 auto" }}>
            Plain-language guides to understanding, disputing, and reducing medical bills — written by people who've been there.
          </p>
        </div>

        <div style={{ display: "grid", gap: 20 }}>
          {blogPosts.map(post => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              style={{ textDecoration: "none" }}
            >
              <div style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 16,
                padding: "28px 32px",
                cursor: "pointer",
                transition: "border-color 0.2s, background 0.2s",
              }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = "rgba(16,185,129,0.35)";
                  e.currentTarget.style.background = "rgba(16,185,129,0.04)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                  e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                }}
              >
                <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 10, flexWrap: "wrap" }}>
                  <span style={{
                    fontSize: 11, fontWeight: 700, padding: "3px 10px",
                    background: `${post.categoryColor}15`,
                    border: `1px solid ${post.categoryColor}35`,
                    borderRadius: 20, color: post.categoryColor,
                    letterSpacing: "0.04em"
                  }}>
                    {post.category}
                  </span>
                  <span style={{ fontSize: 12, color: "#334155" }}>{post.readTime}</span>
                  <span style={{ fontSize: 12, color: "#334155" }}>·</span>
                  <span style={{ fontSize: 12, color: "#334155" }}>{new Date(post.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span>
                </div>
                <h2 style={{ fontSize: "clamp(16px, 3vw, 20px)", fontWeight: 800, color: "#f1f5f9", margin: "0 0 10px", lineHeight: 1.3 }}>
                  {post.title}
                </h2>
                <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.65, margin: 0 }}>
                  {post.description}
                </p>
                <div style={{ marginTop: 16, fontSize: 13, fontWeight: 700, color: "#10b981" }}>
                  Read guide →
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div style={{ marginTop: 60, padding: "32px", background: "rgba(16,185,129,0.07)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: 16, textAlign: "center" }}>
          <div style={{ fontSize: 18, fontWeight: 800, color: "#f1f5f9", marginBottom: 8 }}>Ready to fight your bill?</div>
          <p style={{ fontSize: 14, color: "#64748b", marginBottom: 20, lineHeight: 1.6 }}>
            BillVeil has 44 free AI tools to analyze bills, write appeal letters, find charity care, and more.
          </p>
          <Link href="/" style={{
            display: "inline-block", padding: "12px 28px",
            background: "linear-gradient(135deg, #10b981, #059669)",
            color: "#fff", borderRadius: 12, fontSize: 15, fontWeight: 700,
            textDecoration: "none", boxShadow: "0 8px 24px rgba(16,185,129,0.3)"
          }}>
            Try the Free Tools →
          </Link>
        </div>
      </div>
    </div>
  );
}
