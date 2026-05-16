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

  // Action Center state
  const [selectedState, setSelectedState] = useState("");
  const [externalLetter, setExternalLetter] = useState(null);
  const [externalLoading, setExternalLoading] = useState(false);
  const [externalCopied, setExternalCopied] = useState(false);
  const [actionsDone, setActionsDone] = useState({});

  const { useCredit } = useAuth();

  const analyze = async () => {
    if (!denial.trim()) return;
    if (!useCredit()) return;
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
      { key: "WHY THEY DENIED IT", emoji: "🚫", color: "#f87171", label: "Why They Denied It" },
      { key: "IS THIS DENIAL VALID", emoji: "⚖️", color: "#fbbf24", label: "Is This Denial Valid" },
      { key: "YOUR LEGAL RIGHTS", emoji: "📜", color: "#a78bfa", label: "Your Legal Rights" },
      { key: "APPEAL LETTER", emoji: "✉️", color: "#10b981", label: "Appeal Letter" },
      { key: "WHAT TO DO NEXT", emoji: "✅", color: "#34d399", label: "What To Do Next" },
      { key: "CHANCE OF SUCCESS", emoji: "📊", color: "#60a5fa", label: "Chance of Success" },
    ];

    return sections.map((section, i) => {
      const regex = new RegExp(`(?:#{1,3}\\s*)?${section.key}:\\n([\\s\\S]*?)(?=\\n(?:#{1,3}\\s*)?[A-Z][A-Z ]+:|$)`);
      const match = text.match(regex);
      const raw = match ? match[1].trim() : null;
      if (!raw) return null;
      const content = raw.replace(/^#{1,3}\s*/gm, "").replace(/\*\*/g, "").trim();

      const isVerdict = section.key === "IS THIS DENIAL VALID";
      const isLetter = section.key === "APPEAL LETTER";
      const verdictColor = content.includes("LIKELY INVALID") ? "#34d399"
        : content.includes("POSSIBLY INVALID") ? "#fbbf24" : "#f87171";

      return (
        <div key={section.key} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderLeft: `3px solid ${isVerdict ? verdictColor : section.color}`, borderRadius: 12, padding: "18px 22px", marginBottom: 10, animation: "fadeUp 0.4s ease forwards", animationDelay: `${i * 0.07}s`, animationFillMode: "both" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: isVerdict ? verdictColor : section.color, letterSpacing: "0.12em", textTransform: "uppercase" }}>
              {section.emoji} {section.label}
            </div>
            {isLetter && (
              <button onClick={copyAppeal} style={{ padding: "5px 12px", background: copied ? "rgba(16,185,129,0.15)" : "rgba(255,255,255,0.06)", border: `1px solid ${copied ? "rgba(16,185,129,0.4)" : "rgba(255,255,255,0.1)"}`, color: copied ? "#10b981" : "#94a3b8", borderRadius: 8, fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: FONT, transition: "all 0.2s" }}>
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
            <div style={{ fontSize: 14, color: "#cbd5e1", lineHeight: 1.85, whiteSpace: "pre-line", fontFamily: isLetter ? "monospace" : FONT }}>
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
        <h2 style={{ fontSize: 22, fontWeight: 800, color: "#f1f5f9", marginBottom: 8, letterSpacing: "-0.02em" }}>
          Insurance Denial Fighter
        </h2>
        <p style={{ fontSize: 14, color: "#475569", lineHeight: 1.6 }}>
          Paste the reason your claim was denied. We analyze it, write your appeal letter, and help you take every action step.
        </p>
      </div>

      <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 24, marginBottom: 16 }}>
        <label style={{ fontSize: 11, fontWeight: 700, color: "#64748b", display: "block", marginBottom: 10, letterSpacing: "0.06em", textTransform: "uppercase" }}>
          Denial reason from your insurance
        </label>
        <textarea
          value={denial}
          onChange={(e) => setDenial(e.target.value)}
          placeholder="e.g. Claim denied — service not medically necessary. Or paste the exact text from your denial letter."
          style={{ width: "100%", height: 110, padding: 14, border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, fontSize: 14, color: "#f1f5f9", resize: "vertical", fontFamily: FONT, lineHeight: 1.6, background: "rgba(255,255,255,0.04)", boxSizing: "border-box", outline: "none" }}
        />

        <div style={{ marginTop: 10, marginBottom: 14 }}>
          <div style={{ fontSize: 10, fontWeight: 600, color: "#334155", marginBottom: 7, letterSpacing: "0.08em" }}>COMMON DENIALS</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {EXAMPLES.map((ex) => (
              <button key={ex} onClick={() => setDenial(ex)} style={{ padding: "5px 12px", background: denial === ex ? "rgba(16,185,129,0.15)" : "rgba(255,255,255,0.04)", color: denial === ex ? "#10b981" : "#64748b", border: `1px solid ${denial === ex ? "rgba(16,185,129,0.4)" : "rgba(255,255,255,0.08)"}`, borderRadius: 24, fontSize: 12, fontWeight: 500, cursor: "pointer", transition: "all 0.15s", fontFamily: FONT }}>
                {ex}
              </button>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 11, fontWeight: 700, color: "#64748b", display: "block", marginBottom: 8, letterSpacing: "0.06em", textTransform: "uppercase" }}>
            Claim amount (optional)
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="1200"
            style={{ width: "100%", padding: "12px 14px", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, fontSize: 14, color: "#f1f5f9", fontFamily: FONT, background: "rgba(255,255,255,0.04)", outline: "none", boxSizing: "border-box" }}
          />
        </div>

        <button
          onClick={analyze}
          disabled={loading || !denial.trim()}
          style={{ width: "100%", padding: "15px", background: loading || !denial.trim() ? "rgba(255,255,255,0.05)" : "linear-gradient(135deg, #10b981, #059669)", color: loading || !denial.trim() ? "#334155" : "#fff", border: loading || !denial.trim() ? "1px solid rgba(255,255,255,0.06)" : "none", borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: loading || !denial.trim() ? "default" : "pointer", transition: "all 0.2s", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontFamily: FONT, boxShadow: loading || !denial.trim() ? "none" : "0 8px 25px rgba(16,185,129,0.3)" }}
        >
          {loading ? (
            <>
              <span style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,0.2)", borderTop: "2px solid #10b981", borderRadius: "50%", animation: "spin 0.8s linear infinite", display: "inline-block" }} />
              Fighting your denial...
            </>
          ) : "⚔️ Fight This Denial"}
        </button>
      </div>

      {error && <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: 12, padding: 16, color: "#f87171", fontSize: 14, marginBottom: 16 }}>{error}</div>}

      {result && (
        <div>
          {parseResult(result)}

          {/* Action Center */}
          <div style={{ marginTop: 28, background: "rgba(16,185,129,0.04)", border: "1px solid rgba(16,185,129,0.15)", borderRadius: 16, padding: 24 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#10b981", letterSpacing: "0.12em", marginBottom: 6 }}>ACTION CENTER</div>
            <p style={{ fontSize: 13, color: "#475569", marginBottom: 20, lineHeight: 1.6 }}>
              Every step you can take right now. Work through them in order for the best chance of success.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>

              {/* Step 1 — Copy appeal letter */}
              <div
                onClick={() => { copyAppeal(); markDone("appeal"); }}
                style={{ background: actionsDone.appeal ? "rgba(16,185,129,0.1)" : "rgba(255,255,255,0.03)", border: `1px solid ${actionsDone.appeal ? "rgba(16,185,129,0.3)" : "rgba(255,255,255,0.08)"}`, borderRadius: 12, padding: "16px 18px", cursor: "pointer", transition: "all 0.2s", display: "flex", alignItems: "center", gap: 14 }}
              >
                <div style={{ fontSize: 24, flexShrink: 0 }}>{actionsDone.appeal ? "✅" : "✉️"}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: actionsDone.appeal ? "#10b981" : "#f1f5f9", marginBottom: 3 }}>Step 1 — Copy & Send Internal Appeal Letter</div>
                  <div style={{ fontSize: 11, color: "#475569" }}>Click to copy your AI-generated appeal letter. Send it to your insurance company via certified mail.</div>
                </div>
                <div style={{ fontSize: 12, color: actionsDone.appeal ? "#10b981" : "#64748b", fontWeight: 600, flexShrink: 0 }}>{actionsDone.appeal ? "Done ✓" : "Copy →"}</div>
              </div>

              {/* Step 2 — External Review */}
              <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: "16px 18px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: externalLetter ? 16 : 0 }}>
                  <div style={{ fontSize: 24, flexShrink: 0 }}>{actionsDone.external ? "✅" : "🔍"}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: actionsDone.external ? "#10b981" : "#f1f5f9", marginBottom: 3 }}>Step 2 — Request Independent External Review</div>
                    <div style={{ fontSize: 11, color: "#475569" }}>If your internal appeal is denied, you have the right to an independent external review under federal law.</div>
                  </div>
                  <button
                    onClick={externalLetter ? () => { copyExternal(); markDone("external"); } : generateExternalLetter}
                    disabled={externalLoading}
                    style={{ padding: "7px 14px", background: externalLetter ? "rgba(16,185,129,0.15)" : "rgba(255,255,255,0.06)", border: `1px solid ${externalLetter ? "rgba(16,185,129,0.3)" : "rgba(255,255,255,0.1)"}`, color: externalLetter ? "#10b981" : "#94a3b8", borderRadius: 8, fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: FONT, transition: "all 0.2s", whiteSpace: "nowrap", flexShrink: 0 }}
                  >
                    {externalLoading ? "Writing..." : externalCopied ? "✓ Copied!" : externalLetter ? "Copy Letter" : "Generate Letter"}
                  </button>
                </div>
                {externalLetter && (
                  <div style={{ background: "rgba(0,0,0,0.2)", borderRadius: 8, padding: 14, fontSize: 12, color: "#94a3b8", lineHeight: 1.8, whiteSpace: "pre-line", fontFamily: "monospace", maxHeight: 200, overflowY: "auto" }}>
                    {externalLetter}
                  </div>
                )}
              </div>

              {/* Step 3 — State Commissioner */}
              <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: "16px 18px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 12 }}>
                  <div style={{ fontSize: 24, flexShrink: 0 }}>{actionsDone.state ? "✅" : "🏛️"}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: actionsDone.state ? "#10b981" : "#f1f5f9", marginBottom: 3 }}>Step 3 — File State Insurance Commissioner Complaint</div>
                    <div style={{ fontSize: 11, color: "#475569" }}>Select your state to go directly to your state's official complaint portal.</div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <select
                    value={selectedState}
                    onChange={(e) => setSelectedState(e.target.value)}
                    style={{ flex: 1, minWidth: 180, padding: "10px 12px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: selectedState ? "#f1f5f9" : "#475569", fontSize: 13, fontFamily: FONT, outline: "none", cursor: "pointer" }}
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
                <div style={{ background: actionsDone.cfpb ? "rgba(16,185,129,0.1)" : "rgba(255,255,255,0.03)", border: `1px solid ${actionsDone.cfpb ? "rgba(16,185,129,0.3)" : "rgba(255,255,255,0.08)"}`, borderRadius: 12, padding: "16px 18px", cursor: "pointer", transition: "all 0.2s", display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{ fontSize: 24, flexShrink: 0 }}>{actionsDone.cfpb ? "✅" : "🏦"}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: actionsDone.cfpb ? "#10b981" : "#f1f5f9", marginBottom: 3 }}>Step 4 — File CFPB Complaint</div>
                    <div style={{ fontSize: 11, color: "#475569" }}>The Consumer Financial Protection Bureau investigates insurance disputes. Opens consumerfinance.gov →</div>
                  </div>
                  <div style={{ fontSize: 12, color: actionsDone.cfpb ? "#10b981" : "#64748b", fontWeight: 600, flexShrink: 0 }}>{actionsDone.cfpb ? "Done ✓" : "Open →"}</div>
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
                <div style={{ background: actionsDone.advocate ? "rgba(16,185,129,0.1)" : "rgba(255,255,255,0.03)", border: `1px solid ${actionsDone.advocate ? "rgba(16,185,129,0.3)" : "rgba(255,255,255,0.08)"}`, borderRadius: 12, padding: "16px 18px", cursor: "pointer", transition: "all 0.2s", display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{ fontSize: 24, flexShrink: 0 }}>{actionsDone.advocate ? "✅" : "🤝"}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: actionsDone.advocate ? "#10b981" : "#f1f5f9", marginBottom: 3 }}>Step 5 — Find a Free Patient Advocate</div>
                    <div style={{ fontSize: 11, color: "#475569" }}>Patient Advocate Foundation provides free case managers who fight insurance denials for you. Opens patientadvocate.org →</div>
                  </div>
                  <div style={{ fontSize: 12, color: actionsDone.advocate ? "#10b981" : "#64748b", fontWeight: 600, flexShrink: 0 }}>{actionsDone.advocate ? "Done ✓" : "Open →"}</div>
                </div>
              </a>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
