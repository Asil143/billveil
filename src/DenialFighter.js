import { useState } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";

const FONT = "'Inter', system-ui, sans-serif";

const EXAMPLES = [
  "Not medically necessary",
  "Out of network provider",
  "Prior authorization required",
  "Experimental treatment",
  "Duplicate claim",
];

const STATES = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado",
  "Connecticut", "Delaware", "District of Columbia", "Florida", "Georgia",
  "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky",
  "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota",
  "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire",
  "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota",
  "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina",
  "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia",
  "Washington", "West Virginia", "Wisconsin", "Wyoming",
];

const getCommissionerUrl = (state) =>
  `https://www.google.com/search?q=${encodeURIComponent(state + " insurance commissioner file complaint online official")}+site:.gov`;

export default function DenialFighter() {
  const [denial, setDenial] = useState("");
  const [amount, setAmount] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  const [selectedState, setSelectedState] = useState("");
  const [externalLetter, setExternalLetter] = useState(null);
  const [externalLoading, setExternalLoading] = useState(false);
  const [externalCopied, setExternalCopied] = useState(false);
  const [actionsDone, setActionsDone] = useState({});

  const { consumeCredit } = useAuth();

  const analyze = async () => {
    if (!denial.trim()) return;
    if (!consumeCredit()) return;
    setLoading(true);
    setResult(null);
    setError(null);
    setExternalLetter(null);
    setActionsDone({});
    try {
      const response = await axios.post("/api/denial", { denial, amount });
      setResult(response.data.result);
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const generateExternalLetter = async () => {
    setExternalLoading(true);
    try {
      const response = await axios.post("/api/external-review", { denial, amount });
      setExternalLetter(response.data.result);
    } catch (err) {
      setError("Failed to generate letter. Please try again.");
    } finally {
      setExternalLoading(false);
    }
  };

  const copyAppeal = () => {
    if (!result) return;
    const match = result.match(/(?:#{1,3}\s*)?APPEAL LETTER:\n([\s\S]*?)(?=\n(?:#{1,3}\s*)?[A-Z][A-Z ]+:|$)/);
    const letter = match ? match[1].trim() : result;
    navigator.clipboard.writeText(letter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const copyExternal = () => {
    navigator.clipboard.writeText(externalLetter);
    setExternalCopied(true);
    setTimeout(() => setExternalCopied(false), 2000);
  };

  const markDone = (key) => setActionsDone((prev) => ({ ...prev, [key]: true }));

  const parseResult = (text) => {
    const sections = [
      { key: "WHY THEY DENIED IT", emoji: "🚫", color: "#ef4444", label: "Why They Denied It" },
      { key: "IS THIS DENIAL VALID", emoji: "⚖️", color: "#f59e0b", label: "Is This Denial Valid" },
      { key: "YOUR LEGAL RIGHTS", emoji: "📜", color: "#8b5cf6", label: "Your Legal Rights" },
      { key: "APPEAL LETTER", emoji: "✉️", color: "#10b981", label: "Appeal Letter" },
      { key: "WHAT TO DO NEXT", emoji: "✅", color: "#10b981", label: "What To Do Next" },
      { key: "CHANCE OF SUCCESS", emoji: "📊", color: "#3b82f6", label: "Chance of Success" },
    ];

    return sections.map((section, i) => {
      const regex = new RegExp(`(?:#{1,3}\\s*)?${section.key}:\\n([\\s\\S]*?)(?=\\n(?:#{1,3}\\s*)?[A-Z][A-Z ]+:|$)`);
      const match = text.match(regex);
      const raw = match ? match[1].trim() : null;
      if (!raw) return null;
      const content = raw.replace(/^#{1,3}\s*/gm, "").replace(/\*\*/g, "").trim();

      const isVerdict = section.key === "IS THIS DENIAL VALID";
      const isLetter = section.key === "APPEAL LETTER";
      const verdictColor = content.includes("LIKELY INVALID") ? "#10b981"
        : content.includes("POSSIBLY INVALID") ? "#f59e0b" : "#ef4444";
      const verdictBg = content.includes("LIKELY INVALID") ? "rgba(16,185,129,0.06)"
        : content.includes("POSSIBLY INVALID") ? "rgba(245,158,11,0.06)" : "rgba(239,68,68,0.06)";

      return (
        <div key={section.key} style={{ background: isVerdict ? verdictBg : "#ffffff", border: `1px solid ${isVerdict ? verdictColor + "40" : "#e2e8f0"}`, borderLeft: `3px solid ${isVerdict ? verdictColor : section.color}`, borderRadius: 12, padding: "18px 22px", marginBottom: 10, boxShadow: isVerdict ? "none" : "0 1px 3px rgba(0,0,0,0.04)", animation: "fadeUp 0.4s ease forwards", animationDelay: `${i * 0.07}s`, animationFillMode: "both" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: isVerdict ? verdictColor : section.color, letterSpacing: "0.12em", textTransform: "uppercase" }}>
              {section.emoji} {section.label}
            </div>
            {isLetter && (
              <button onClick={copyAppeal} style={{ padding: "5px 12px", background: copied ? "#f0fdf4" : "#f8fafc", border: `1px solid ${copied ? "#10b981" : "#e2e8f0"}`, color: copied ? "#059669" : "#64748b", borderRadius: 8, fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: FONT, transition: "all 0.2s" }}>
                {copied ? "✓ Copied!" : "Copy Letter"}
              </button>
            )}
          </div>
          {isVerdict ? (
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: verdictColor + "20", border: `1px solid ${verdictColor}50`, color: verdictColor, padding: "7px 18px", borderRadius: 24, fontSize: 13, fontWeight: 800 }}>
              <span style={{ width: 7, height: 7, background: verdictColor, borderRadius: "50%" }} />
              {content}
            </div>
          ) : (
            <div style={{ fontSize: 14, color: "#374151", lineHeight: 1.85, whiteSpace: "pre-line", fontFamily: isLetter ? "monospace" : FONT, background: isLetter ? "#f8fafc" : "transparent", padding: isLetter ? 14 : 0, borderRadius: isLetter ? 8 : 0, border: isLetter ? "1px solid #e2e8f0" : "none" }}>
              {content}
            </div>
          )}
        </div>
      );
    });
  };

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: "#0f172a", marginBottom: 8, letterSpacing: "-0.02em" }}>
          Insurance Denial Fighter
        </h2>
        <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.6 }}>
          Paste the reason your claim was denied. We analyze it, write your appeal letter, and help you take every action step.
        </p>
      </div>

      <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 16, padding: 24, marginBottom: 16, boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
        <label style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", display: "block", marginBottom: 10, letterSpacing: "0.06em", textTransform: "uppercase" }}>
          Denial reason from your insurance
        </label>
        <textarea
          value={denial}
          onChange={(e) => setDenial(e.target.value)}
          placeholder="e.g. Claim denied — service not medically necessary. Or paste the exact text from your denial letter."
          style={{ width: "100%", height: 110, padding: 14, border: "1px solid #e2e8f0", borderRadius: 10, fontSize: 14, color: "#0f172a", resize: "vertical", fontFamily: FONT, lineHeight: 1.6, background: "#f8fafc", boxSizing: "border-box", outline: "none" }}
        />

        <div style={{ marginTop: 10, marginBottom: 14 }}>
          <div style={{ fontSize: 10, fontWeight: 600, color: "#94a3b8", marginBottom: 7, letterSpacing: "0.08em" }}>COMMON DENIALS</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {EXAMPLES.map((ex) => (
              <button key={ex} onClick={() => setDenial(ex)} style={{ padding: "5px 12px", background: denial === ex ? "#f0fdf4" : "#f8fafc", color: denial === ex ? "#059669" : "#64748b", border: `1px solid ${denial === ex ? "#10b981" : "#e2e8f0"}`, borderRadius: 24, fontSize: 12, fontWeight: 500, cursor: "pointer", transition: "all 0.15s", fontFamily: FONT }}>
                {ex}
              </button>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", display: "block", marginBottom: 8, letterSpacing: "0.06em", textTransform: "uppercase" }}>
            Claim amount (optional)
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="1200"
            style={{ width: "100%", padding: "12px 14px", border: "1px solid #e2e8f0", borderRadius: 10, fontSize: 14, color: "#0f172a", fontFamily: FONT, background: "#f8fafc", outline: "none", boxSizing: "border-box" }}
          />
        </div>

        <button
          onClick={analyze}
          disabled={loading || !denial.trim()}
          style={{ width: "100%", padding: "15px", background: loading || !denial.trim() ? "#f1f5f9" : "linear-gradient(135deg, #10b981, #059669)", color: loading || !denial.trim() ? "#94a3b8" : "#fff", border: "none", borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: loading || !denial.trim() ? "default" : "pointer", transition: "all 0.2s", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontFamily: FONT, boxShadow: loading || !denial.trim() ? "none" : "0 4px 16px rgba(16,185,129,0.3)" }}
        >
          {loading ? (
            <>
              <span style={{ width: 16, height: 16, border: "2px solid #e2e8f0", borderTop: "2px solid #10b981", borderRadius: "50%", animation: "spin 0.8s linear infinite", display: "inline-block" }} />
              Fighting your denial...
            </>
          ) : "⚔️ Fight This Denial"}
        </button>
      </div>

      {error && <div style={{ background: "#fff5f5", border: "1px solid #fecaca", borderRadius: 12, padding: 16, color: "#ef4444", fontSize: 14, marginBottom: 16 }}>{error}</div>}

      {result && (
        <div>
          {parseResult(result)}

          {/* Action Center */}
          <div style={{ marginTop: 28, background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 16, padding: 24 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#059669", letterSpacing: "0.12em", marginBottom: 6 }}>ACTION CENTER</div>
            <p style={{ fontSize: 13, color: "#64748b", marginBottom: 20, lineHeight: 1.6 }}>
              Every step you can take right now. Work through them in order for the best chance of success.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>

              {/* Step 1 — Copy appeal letter */}
              <div
                onClick={() => { copyAppeal(); markDone("appeal"); }}
                style={{ background: actionsDone.appeal ? "#f0fdf4" : "#ffffff", border: `1px solid ${actionsDone.appeal ? "#10b981" : "#e2e8f0"}`, borderRadius: 12, padding: "16px 18px", cursor: "pointer", transition: "all 0.2s", display: "flex", alignItems: "center", gap: 14, boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}
              >
                <div style={{ fontSize: 24, flexShrink: 0 }}>{actionsDone.appeal ? "✅" : "✉️"}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: actionsDone.appeal ? "#059669" : "#0f172a", marginBottom: 3 }}>Step 1 — Copy & Send Internal Appeal Letter</div>
                  <div style={{ fontSize: 11, color: "#64748b" }}>Click to copy your AI-generated appeal letter. Send it to your insurance company via certified mail.</div>
                </div>
                <div style={{ fontSize: 12, color: actionsDone.appeal ? "#059669" : "#94a3b8", fontWeight: 600, flexShrink: 0 }}>{actionsDone.appeal ? "Done ✓" : "Copy →"}</div>
              </div>

              {/* Step 2 — External Review */}
              <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 12, padding: "16px 18px", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: externalLetter ? 16 : 0 }}>
                  <div style={{ fontSize: 24, flexShrink: 0 }}>{actionsDone.external ? "✅" : "🔍"}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: actionsDone.external ? "#059669" : "#0f172a", marginBottom: 3 }}>Step 2 — Request Independent External Review</div>
                    <div style={{ fontSize: 11, color: "#64748b" }}>If your internal appeal is denied, you have the right to an independent external review under federal law.</div>
                  </div>
                  <button
                    onClick={externalLetter ? () => { copyExternal(); markDone("external"); } : generateExternalLetter}
                    disabled={externalLoading}
                    style={{ padding: "7px 14px", background: externalLetter ? "#f0fdf4" : "#f8fafc", border: `1px solid ${externalLetter ? "#10b981" : "#e2e8f0"}`, color: externalLetter ? "#059669" : "#64748b", borderRadius: 8, fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: FONT, transition: "all 0.2s", whiteSpace: "nowrap", flexShrink: 0 }}
                  >
                    {externalLoading ? "Writing..." : externalCopied ? "✓ Copied!" : externalLetter ? "Copy Letter" : "Generate Letter"}
                  </button>
                </div>
                {externalLetter && (
                  <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 8, padding: 14, fontSize: 12, color: "#374151", lineHeight: 1.8, whiteSpace: "pre-line", fontFamily: "monospace", maxHeight: 200, overflowY: "auto" }}>
                    {externalLetter}
                  </div>
                )}
              </div>

              {/* Step 3 — State Commissioner */}
              <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 12, padding: "16px 18px", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 12 }}>
                  <div style={{ fontSize: 24, flexShrink: 0 }}>{actionsDone.state ? "✅" : "🏛️"}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: actionsDone.state ? "#059669" : "#0f172a", marginBottom: 3 }}>Step 3 — File State Insurance Commissioner Complaint</div>
                    <div style={{ fontSize: 11, color: "#64748b" }}>Select your state to go directly to your state's official complaint portal.</div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <select
                    value={selectedState}
                    onChange={(e) => setSelectedState(e.target.value)}
                    style={{ flex: 1, minWidth: 180, padding: "10px 12px", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 8, color: selectedState ? "#0f172a" : "#94a3b8", fontSize: 13, fontFamily: FONT, outline: "none", cursor: "pointer" }}
                  >
                    <option value="">Select your state...</option>
                    {STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                  {selectedState && (
                    <a
                      href={getCommissionerUrl(selectedState)}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => markDone("state")}
                      style={{ padding: "10px 16px", background: "linear-gradient(135deg, #10b981, #059669)", color: "#fff", borderRadius: 8, fontSize: 13, fontWeight: 700, textDecoration: "none", whiteSpace: "nowrap", display: "flex", alignItems: "center" }}
                    >
                      Find Portal →
                    </a>
                  )}
                </div>
              </div>

              {/* Step 4 — CFPB */}
              <a
                href="https://www.consumerfinance.gov/complaint/"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => markDone("cfpb")}
                style={{ textDecoration: "none", display: "block" }}
              >
                <div style={{ background: actionsDone.cfpb ? "#f0fdf4" : "#ffffff", border: `1px solid ${actionsDone.cfpb ? "#10b981" : "#e2e8f0"}`, borderRadius: 12, padding: "16px 18px", cursor: "pointer", transition: "all 0.2s", display: "flex", alignItems: "center", gap: 14, boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
                  <div style={{ fontSize: 24, flexShrink: 0 }}>{actionsDone.cfpb ? "✅" : "🏦"}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: actionsDone.cfpb ? "#059669" : "#0f172a", marginBottom: 3 }}>Step 4 — File CFPB Complaint</div>
                    <div style={{ fontSize: 11, color: "#64748b" }}>The Consumer Financial Protection Bureau investigates insurance disputes. Opens consumerfinance.gov →</div>
                  </div>
                  <div style={{ fontSize: 12, color: actionsDone.cfpb ? "#059669" : "#94a3b8", fontWeight: 600, flexShrink: 0 }}>{actionsDone.cfpb ? "Done ✓" : "Open →"}</div>
                </div>
              </a>

              {/* Step 5 — Patient Advocate */}
              <a
                href="https://www.patientadvocate.org/connect-with-services/find-a-case-manager/"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => markDone("advocate")}
                style={{ textDecoration: "none", display: "block" }}
              >
                <div style={{ background: actionsDone.advocate ? "#f0fdf4" : "#ffffff", border: `1px solid ${actionsDone.advocate ? "#10b981" : "#e2e8f0"}`, borderRadius: 12, padding: "16px 18px", cursor: "pointer", transition: "all 0.2s", display: "flex", alignItems: "center", gap: 14, boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
                  <div style={{ fontSize: 24, flexShrink: 0 }}>{actionsDone.advocate ? "✅" : "🤝"}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: actionsDone.advocate ? "#059669" : "#0f172a", marginBottom: 3 }}>Step 5 — Find a Free Patient Advocate</div>
                    <div style={{ fontSize: 11, color: "#64748b" }}>Patient Advocate Foundation provides free case managers who fight insurance denials for you. Opens patientadvocate.org →</div>
                  </div>
                  <div style={{ fontSize: 12, color: actionsDone.advocate ? "#059669" : "#94a3b8", fontWeight: 600, flexShrink: 0 }}>{actionsDone.advocate ? "Done ✓" : "Open →"}</div>
                </div>
              </a>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
