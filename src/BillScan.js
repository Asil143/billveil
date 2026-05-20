'use client';
import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./AuthContext";
import axios from "axios";

const FONT = "'Inter', system-ui, sans-serif";

const SECTIONS = [
  { key: "PROVIDER", emoji: "🏥", color: "#60a5fa" },
  { key: "DATE OF SERVICE", emoji: "📅", color: "#a78bfa" },
  { key: "LINE ITEMS", emoji: "📋", color: "#fbbf24" },
  { key: "SUBTOTALS", emoji: "💰", color: "#34d399" },
  { key: "INSURANCE", emoji: "🛡️", color: "#60a5fa" },
  { key: "NOTES", emoji: "📌", color: "#94a3b8" },
];

function parse(text) {
  return SECTIONS.map((s, i) => {
    const m = text.match(new RegExp(`${s.key}:\\n([\\s\\S]*?)(?=\\n[A-Z][A-Z /]+:|$)`));
    const content = m ? m[1].trim() : null;
    if (!content || content === "Not visible") return null;
    return (
      <div key={s.key} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderLeft: `3px solid ${s.color}`, borderRadius: 12, padding: "14px 18px", marginBottom: 10, animation: "fadeUp 0.35s ease forwards", animationDelay: `${i * 0.06}s`, animationFillMode: "both" }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: s.color, letterSpacing: "0.12em", marginBottom: 6, textTransform: "uppercase" }}>{s.emoji} {s.key}</div>
        <div style={{ fontSize: 14, color: "#cbd5e1", lineHeight: 1.8, whiteSpace: "pre-line" }}>{content}</div>
      </div>
    );
  });
}

function extractAnalyzerText(text) {
  const m = text.match(/EXTRACTED TEXT FOR ANALYSIS:\n([\s\S]*?)$/);
  return m ? m[1].trim() : text.slice(0, 500);
}

async function compressImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        const MAX = 1280;
        let w = img.width, h = img.height;
        if (w > h && w > MAX) { h = Math.round((h * MAX) / w); w = MAX; }
        else if (h > MAX) { w = Math.round((w * MAX) / h); h = MAX; }
        const canvas = document.createElement("canvas");
        canvas.width = w; canvas.height = h;
        canvas.getContext("2d").drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL("image/jpeg", 0.85));
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}

async function convertPdfToImage(dataUrl) {
  const { getDocument, GlobalWorkerOptions } = await import("pdfjs-dist");
  GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

  const binary = atob(dataUrl.split(",")[1]);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);

  const pdf = await getDocument({ data: bytes }).promise;

  // Measure total pixels at scale 1 to calculate safe scale
  const pages = [];
  let totalPixelsAtOne = 0;
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const vp = page.getViewport({ scale: 1 });
    totalPixelsAtOne += vp.width * vp.height;
    pages.push(page);
  }

  // Groq limit is 33.18M pixels — stay under 30M to be safe
  const MAX_PIXELS = 30_000_000;
  const scale = Math.min(1.5, Math.sqrt(MAX_PIXELS / totalPixelsAtOne));

  const canvases = [];
  let totalHeight = 0;

  for (const page of pages) {
    const viewport = page.getViewport({ scale });
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(viewport.width);
    canvas.height = Math.round(viewport.height);
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    await page.render({ canvasContext: ctx, viewport }).promise;
    canvases.push(canvas);
    totalHeight += canvas.height;
  }

  const combined = document.createElement("canvas");
  combined.width = canvases[0].width;
  combined.height = totalHeight;
  const ctx = combined.getContext("2d");
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, combined.width, combined.height);
  let y = 0;
  for (const c of canvases) { ctx.drawImage(c, 0, y); y += c.height; }

  return combined.toDataURL("image/jpeg", 0.85);
}

export default function BillScan() {
  const { consumeCredit } = useAuth();
  const router = useRouter();
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);
  const dropRef = useRef(null);

  const [preview, setPreview] = useState(null);
  const [fileName, setFileName] = useState("");
  const [isPdf, setIsPdf] = useState(false);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [dragging, setDragging] = useState(false);

  const handleFile = useCallback(async (file) => {
    if (!file) return;
    const pdf = file.type === "application/pdf";
    const img = file.type.startsWith("image/");
    if (!pdf && !img) {
      setError("Please upload an image (JPG, PNG, HEIC) or a PDF file.");
      return;
    }
    setError(null);
    setResult(null);
    setFileName(file.name);
    setIsPdf(pdf);
    if (pdf) {
      setLoading(true);
      try {
        const dataUrl = await new Promise((res, rej) => {
          const reader = new FileReader();
          reader.onload = (e) => res(e.target.result);
          reader.onerror = rej;
          reader.readAsDataURL(file);
        });
        const imageDataUrl = await convertPdfToImage(dataUrl);
        setPreview(imageDataUrl);
      } catch (e) {
        setError("Could not process this PDF. Try uploading a photo of the bill instead.");
      } finally {
        setLoading(false);
      }
    } else {
      try {
        const dataUrl = await compressImage(file);
        setPreview(dataUrl);
      } catch {
        setError("Could not read the image. Please try another file.");
      }
    }
  }, []);

  const onFileChange = (e) => handleFile(e.target.files?.[0]);

  const onDrop = useCallback((e) => {
    e.preventDefault();
    setDragging(false);
    handleFile(e.dataTransfer.files?.[0]);
  }, [handleFile]);

  const scan = async () => {
    if (!preview || !consumeCredit()) return;
    setLoading(true);
    setResult(null);
    setError(null);
    try {
      const base64 = preview.split(",")[1];
      const mimeType = preview.split(";")[0].split(":")[1];
      const r = await axios.post("/api/billscan", { image: base64, mimeType });
      setResult(r.data.result);
    } catch (err) {
      setError(err.response?.data?.error || "Scan failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const goToAnalyzer = () => {
    if (!result) return;
    const extracted = extractAnalyzerText(result);
    sessionStorage.setItem("bv_heroBill_pending", extracted);
    router.push("/analyzer");
  };

  const reset = () => {
    setPreview(null);
    setResult(null);
    setError(null);
    setFileName("");
    setIsPdf(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (cameraInputRef.current) cameraInputRef.current.value = "";
  };

  return (
    <div>
      <div style={{ textAlign: "center", marginBottom: 28 }}>
        <h1 style={{ fontSize: "clamp(22px, 6vw, 32px)", fontWeight: 900, letterSpacing: "-0.03em", marginBottom: 8, color: "#f1f5f9" }}>
          Scan your <span style={{ color: "#10b981", textShadow: "0 0 20px rgba(16,185,129,0.4)" }}>medical bill.</span>
        </h1>
        <p style={{ fontSize: 15, color: "#64748b", lineHeight: 1.6, maxWidth: 460, margin: "0 auto" }}>
          Upload a photo or PDF — AI reads every charge, CPT code, and amount automatically.
        </p>
      </div>

      {!preview ? (
        <div
          ref={dropRef}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          style={{ border: `2px dashed ${dragging ? "rgba(16,185,129,0.6)" : "rgba(255,255,255,0.12)"}`, borderRadius: 18, padding: "48px 24px", textAlign: "center", background: dragging ? "rgba(16,185,129,0.05)" : "rgba(255,255,255,0.02)", transition: "all 0.2s", cursor: "pointer" }}
          onClick={() => fileInputRef.current?.click()}
        >
          <div style={{ fontSize: 48, marginBottom: 16 }}>📂</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: "#f1f5f9", marginBottom: 8 }}>Drop your bill here</div>
          <div style={{ fontSize: 13, color: "#64748b", marginBottom: 24 }}>JPG, PNG, HEIC, WebP — or <strong style={{ color: "#10b981" }}>PDF</strong></div>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <button
              onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
              style={{ padding: "10px 24px", background: "linear-gradient(135deg, #10b981, #059669)", color: "#fff", border: "none", borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: FONT }}
            >
              📂 Choose File or PDF
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); cameraInputRef.current?.click(); }}
              style={{ padding: "10px 24px", background: "rgba(255,255,255,0.06)", color: "#94a3b8", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: FONT }}
            >
              📷 Take Photo
            </button>
          </div>
          <input ref={fileInputRef} type="file" accept="image/*,.pdf,application/pdf" onChange={onFileChange} style={{ display: "none" }} />
          <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" onChange={onFileChange} style={{ display: "none" }} />
        </div>
      ) : (
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 20, marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
            <div style={{ fontSize: 13, color: "#64748b", fontWeight: 600, display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 16 }}>{isPdf ? "📄" : "🖼️"}</span> {fileName || "bill file"}
            </div>
            <button onClick={reset} style={{ fontSize: 12, color: "#64748b", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", padding: "4px 10px", borderRadius: 8, cursor: "pointer", fontFamily: FONT }}>✕ Remove</button>
          </div>
          {isPdf ? (
            <div style={{ background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: 12, padding: "24px 20px", textAlign: "center", marginBottom: 16 }}>
              <div style={{ fontSize: 40, marginBottom: 8 }}>📄</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#f1f5f9", marginBottom: 4 }}>{fileName}</div>
              <div style={{ fontSize: 12, color: "#64748b" }}>PDF ready — AI will extract all charges</div>
            </div>
          ) : (
            <img src={preview} alt="Bill preview" style={{ width: "100%", maxHeight: 320, objectFit: "contain", borderRadius: 10, background: "rgba(0,0,0,0.3)", marginBottom: 16 }} />
          )}
          {!result && (
            <button
              onClick={scan}
              disabled={loading}
              style={{ width: "100%", padding: 14, background: loading ? "rgba(255,255,255,0.05)" : "linear-gradient(135deg, #10b981, #059669)", color: loading ? "#334155" : "#fff", border: "none", borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: loading ? "default" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, fontFamily: FONT, boxShadow: loading ? "none" : "0 8px 28px rgba(16,185,129,0.35)" }}
            >
              {loading
                ? <><span style={{ width: 17, height: 17, border: "2px solid rgba(255,255,255,0.15)", borderTop: "2px solid #10b981", borderRadius: "50%", animation: "spin 0.8s linear infinite", display: "inline-block" }} />Reading your bill...</>
                : isPdf ? "📄 Scan Bill from PDF" : "📸 Scan This Bill"}
            </button>
          )}
        </div>
      )}

      {error && (
        <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: 12, padding: 16, color: "#f87171", fontSize: 14, marginBottom: 16 }}>
          {error}
        </div>
      )}

      {result && (
        <div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: "#334155", letterSpacing: "0.12em" }}>BILL SCAN RESULTS</div>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => { navigator.clipboard.writeText(result); setCopied(true); setTimeout(() => setCopied(false), 2000); }} style={{ fontSize: 12, color: copied ? "#10b981" : "#64748b", background: "rgba(255,255,255,0.04)", border: `1px solid ${copied ? "rgba(16,185,129,0.3)" : "rgba(255,255,255,0.08)"}`, padding: "5px 12px", borderRadius: 8, cursor: "pointer", fontFamily: FONT }}>{copied ? "✓ Copied" : "Copy"}</button>
              <button onClick={reset} style={{ fontSize: 12, color: "#64748b", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", padding: "5px 12px", borderRadius: 8, cursor: "pointer", fontFamily: FONT }}>← Scan Another</button>
            </div>
          </div>

          <button
            onClick={goToAnalyzer}
            style={{ width: "100%", padding: "14px", background: "linear-gradient(135deg, #10b981, #059669)", color: "#fff", border: "none", borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: FONT, marginBottom: 16, boxShadow: "0 8px 28px rgba(16,185,129,0.35)", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
          >
            ⚡ Analyze This Bill for Overcharges →
          </button>

          <div style={{ background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: 12, padding: "12px 16px", marginBottom: 14, fontSize: 13, color: "#10b981", fontWeight: 600 }}>
            📋 Bill successfully scanned. Review the data below, then click Analyze to check for overcharges.
          </div>

          {parse(result)}
        </div>
      )}
    </div>
  );
}
