import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "BillVeil — AI-powered medical bill transparency. 44 free tools.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#050810",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, sans-serif",
          padding: 80,
        }}
      >
        {/* glow */}
        <div style={{ position: "absolute", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(16,185,129,0.15) 0%, transparent 70%)", top: "50%", left: "50%", transform: "translate(-50%,-50%)", display: "flex" }} />

        <div style={{ fontSize: 72, marginBottom: 24, display: "flex" }}>🛡️</div>

        <div style={{ fontSize: 80, fontWeight: 900, color: "#f1f5f9", letterSpacing: "-3px", marginBottom: 16, display: "flex" }}>
          BillVeil
        </div>

        <div style={{ fontSize: 34, fontWeight: 700, color: "#10b981", marginBottom: 24, display: "flex" }}>
          See Through Every Medical Bill
        </div>

        <div style={{ fontSize: 22, color: "#64748b", textAlign: "center", maxWidth: 760, lineHeight: 1.5, display: "flex" }}>
          44 free AI tools to analyze bills, fight denials &amp; stop overcharges
        </div>

        <div style={{ display: "flex", gap: 40, marginTop: 48 }}>
          {[
            { stat: "$935B", label: "Overpaid yearly" },
            { stat: "80%", label: "Bills have errors" },
            { stat: "44", label: "Free tools" },
          ].map(({ stat, label }) => (
            <div key={stat} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div style={{ fontSize: 36, fontWeight: 900, color: "#10b981", display: "flex" }}>{stat}</div>
              <div style={{ fontSize: 14, color: "#475569", marginTop: 4, display: "flex" }}>{label}</div>
            </div>
          ))}
        </div>

        <div style={{ position: "absolute", bottom: 40, fontSize: 16, color: "#1e293b", display: "flex" }}>
          billveil.com
        </div>
      </div>
    ),
    { ...size }
  );
}
