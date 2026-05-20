import Link from "next/link";

const FONT = "'Inter', system-ui, sans-serif";

function Section({ section }) {
  return (
    <div style={{ marginBottom: 40 }}>
      {section.h2 && (
        <h2 style={{ fontSize: "clamp(18px, 3.5vw, 24px)", fontWeight: 800, color: "#10b981", margin: "0 0 16px", lineHeight: 1.3 }}>
          {section.h2}
        </h2>
      )}
      {section.h3 && (
        <h3 style={{ fontSize: 17, fontWeight: 700, color: "#e2e8f0", margin: "0 0 12px" }}>
          {section.h3}
        </h3>
      )}
      {section.paragraphs && section.paragraphs.map((p, i) => (
        <p key={i} style={{ fontSize: 16, color: "#94a3b8", lineHeight: 1.8, margin: "0 0 16px" }}>{p}</p>
      ))}
      {section.bullets && (
        <ul style={{ margin: "0 0 16px", paddingLeft: 20 }}>
          {section.bullets.map((b, i) => (
            <li key={i} style={{ fontSize: 15, color: "#94a3b8", lineHeight: 1.75, marginBottom: 8 }}>{b}</li>
          ))}
        </ul>
      )}
      {section.paragraphs2 && section.paragraphs2.map((p, i) => (
        <p key={i} style={{ fontSize: 16, color: "#94a3b8", lineHeight: 1.8, margin: "0 0 16px" }}>{p}</p>
      ))}
      {section.tip && (
        <div style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.25)", borderRadius: 12, padding: "16px 20px", margin: "20px 0" }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#10b981", letterSpacing: "0.1em", marginBottom: 6 }}>PRO TIP</div>
          <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.7, margin: 0 }}>{section.tip}</p>
        </div>
      )}
      {section.cta && (
        <div style={{ margin: "24px 0", padding: "20px 24px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            {section.cta.note && <p style={{ fontSize: 13, color: "#475569", margin: "0 0 8px", lineHeight: 1.5 }}>{section.cta.note}</p>}
            <Link href={section.cta.href} style={{
              display: "inline-block", padding: "10px 20px",
              background: "linear-gradient(135deg, #10b981, #059669)",
              color: "#fff", borderRadius: 10, fontSize: 14, fontWeight: 700,
              textDecoration: "none"
            }}>
              {section.cta.label} →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default function BlogPost({ post }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.date,
    author: { "@type": "Organization", name: "BillVeil", url: "https://billveil.com" },
    publisher: { "@type": "Organization", name: "BillVeil", url: "https://billveil.com", logo: { "@type": "ImageObject", url: "https://billveil.com/icon-512.svg" } },
    mainEntityOfPage: { "@type": "WebPage", "@id": `https://billveil.com/blog/${post.slug}` },
  };

  const faqJsonLd = post.faq ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: post.faq.map(f => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  } : null;

  return (
    <div style={{ background: "#050810", minHeight: "100vh", fontFamily: FONT }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {faqJsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />}

      <div style={{ maxWidth: 760, margin: "0 auto", padding: "48px 20px 80px" }}>
        {/* Breadcrumb */}
        <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 32, fontSize: 13, color: "#334155" }}>
          <Link href="/" style={{ color: "#334155", textDecoration: "none" }}>Home</Link>
          <span>›</span>
          <Link href="/blog" style={{ color: "#334155", textDecoration: "none" }}>Blog</Link>
          <span>›</span>
          <span style={{ color: "#475569" }}>{post.category}</span>
        </div>

        {/* Header */}
        <header style={{ marginBottom: 40 }}>
          <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 16, flexWrap: "wrap" }}>
            <span style={{
              fontSize: 11, fontWeight: 700, padding: "3px 10px",
              background: `${post.categoryColor}15`, border: `1px solid ${post.categoryColor}35`,
              borderRadius: 20, color: post.categoryColor, letterSpacing: "0.04em"
            }}>
              {post.category}
            </span>
            <span style={{ fontSize: 13, color: "#334155" }}>{post.readTime}</span>
            <span style={{ fontSize: 13, color: "#334155" }}>·</span>
            <span style={{ fontSize: 13, color: "#334155" }}>
              {new Date(post.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
            </span>
          </div>

          <h1 style={{ fontSize: "clamp(24px, 5vw, 38px)", fontWeight: 900, letterSpacing: "-0.03em", color: "#f1f5f9", margin: "0 0 20px", lineHeight: 1.2 }}>
            {post.title}
          </h1>

          <p style={{ fontSize: 18, color: "#64748b", lineHeight: 1.7, margin: 0 }}>
            {post.intro}
          </p>
        </header>

        {/* Related tools */}
        {post.relatedTools && post.relatedTools.length > 0 && (
          <div style={{ background: "rgba(16,185,129,0.07)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: 14, padding: "20px 24px", marginBottom: 40 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#10b981", letterSpacing: "0.1em", marginBottom: 12 }}>FREE TOOLS FOR THIS TOPIC</div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {post.relatedTools.map(tool => (
                <Link key={tool.href} href={tool.href} style={{
                  fontSize: 13, fontWeight: 600, color: "#34d399",
                  background: "rgba(52,211,153,0.08)", border: "1px solid rgba(52,211,153,0.2)",
                  borderRadius: 8, padding: "6px 12px", textDecoration: "none"
                }}>
                  {tool.label} →
                </Link>
              ))}
            </div>
          </div>
        )}

        <hr style={{ border: "none", borderTop: "1px solid rgba(255,255,255,0.07)", marginBottom: 40 }} />

        {/* Article sections */}
        {post.sections.map((section, i) => (
          <Section key={i} section={section} />
        ))}

        {/* FAQ */}
        {post.faq && post.faq.length > 0 && (
          <div style={{ marginTop: 48 }}>
            <h2 style={{ fontSize: "clamp(18px, 3.5vw, 24px)", fontWeight: 800, color: "#10b981", margin: "0 0 24px" }}>
              Frequently Asked Questions
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {post.faq.map((item, i) => (
                <div key={i} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: "20px 24px" }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "#e2e8f0", marginBottom: 10 }}>{item.q}</div>
                  <div style={{ fontSize: 14, color: "#64748b", lineHeight: 1.75 }}>{item.a}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bottom CTA */}
        <div style={{ marginTop: 56, padding: "36px 32px", background: "rgba(16,185,129,0.07)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: 16, textAlign: "center" }}>
          <div style={{ fontSize: 20, fontWeight: 800, color: "#f1f5f9", marginBottom: 10 }}>
            Ready to take action?
          </div>
          <p style={{ fontSize: 15, color: "#64748b", lineHeight: 1.6, marginBottom: 24 }}>
            BillVeil has 44 free AI tools to analyze your bill, write letters, and fight back.
          </p>
          <Link href="/" style={{
            display: "inline-block", padding: "13px 32px",
            background: "linear-gradient(135deg, #10b981, #059669)",
            color: "#fff", borderRadius: 12, fontSize: 15, fontWeight: 700,
            textDecoration: "none", boxShadow: "0 8px 24px rgba(16,185,129,0.3)"
          }}>
            Try BillVeil Free →
          </Link>
        </div>

        {/* Back to blog */}
        <div style={{ marginTop: 32, textAlign: "center" }}>
          <Link href="/blog" style={{ fontSize: 14, color: "#334155", textDecoration: "none" }}>
            ← Back to all guides
          </Link>
        </div>
      </div>
    </div>
  );
}
