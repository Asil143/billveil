'use client';
import { Component } from "react";

const FONT = "'Inter', system-ui, sans-serif";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { crashed: false };
  }

  static getDerivedStateFromError() {
    return { crashed: true };
  }

  render() {
    if (this.state.crashed) {
      return (
        <div style={{ minHeight: "100vh", background: "#050810", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: FONT, padding: 32, textAlign: "center" }}>
          <div style={{ fontSize: 40, marginBottom: 20 }}>🛡️</div>
          <div style={{ fontSize: 20, fontWeight: 800, color: "#f1f5f9", marginBottom: 10 }}>Something went wrong</div>
          <div style={{ fontSize: 14, color: "#64748b", marginBottom: 28, maxWidth: 320, lineHeight: 1.7 }}>
            An unexpected error occurred. Your data is safe — refresh the page to continue.
          </div>
          <button
            onClick={() => window.location.reload()}
            style={{ padding: "12px 28px", background: "linear-gradient(135deg, #10b981, #059669)", color: "#fff", border: "none", borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: FONT }}
          >
            Refresh Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
