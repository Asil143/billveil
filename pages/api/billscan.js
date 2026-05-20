// Import from internal path to avoid pdf-parse loading its test file on startup (crashes in Next.js)
const pdfParse = require("pdf-parse/lib/pdf-parse");

const STRUCTURE_PROMPT = (rawText) => `You are a medical bill data extraction expert. Below is raw text extracted from a medical bill PDF. Structure it into the exact format shown.

RAW TEXT:
${rawText}

Return ONLY this exact format (no extra commentary):

PROVIDER:
[Hospital or provider name, address if visible]

DATE OF SERVICE:
[Date(s) of service]

PATIENT:
[Patient name if visible]

ACCOUNT / CLAIM NUMBER:
[Account or claim number if visible]

LINE ITEMS:
[Each charge on its own line: Description | CPT Code | Amount — if CPT code not visible, write N/A]

SUBTOTALS:
[Billed amount, insurance paid, adjustments, patient balance — each on its own line]

INSURANCE:
[Insurance company name, plan, and any policy/group numbers if visible]

NOTES:
[Any important notices, due dates, payment instructions visible on the bill]

EXTRACTED TEXT FOR ANALYSIS:
[A clean summary paragraph: "Provider: X, Date: X, Services: [list each service and amount], Total billed: $X, Insurance paid: $X, Patient owes: $X"]

If something is not in the text, write "Not visible".`;

const IMAGE_PROMPT = `You are a medical bill data extraction expert. Extract all information from this medical bill image.

Return the extracted data in this exact format:

PROVIDER:
[Hospital or provider name, address if visible]

DATE OF SERVICE:
[Date(s) of service]

PATIENT:
[Patient name if visible]

ACCOUNT / CLAIM NUMBER:
[Account or claim number if visible]

LINE ITEMS:
[Each charge on its own line: Description | CPT Code | Amount — if CPT code not visible, write N/A]

SUBTOTALS:
[Billed amount, insurance paid, adjustments, patient balance — each on its own line]

INSURANCE:
[Insurance company name, plan, and any policy/group numbers if visible]

NOTES:
[Any important notices, due dates, payment instructions visible on the bill]

EXTRACTED TEXT FOR ANALYSIS:
[A clean summary paragraph combining all charges. Format: "Provider: X, Date: X, Services: [list each service and amount], Total billed: $X, Insurance paid: $X, Patient owes: $X"]

Extract every number, code, and charge visible. If something is unclear or not visible, write "Not visible".`;

async function scanPdf(base64) {
  const buffer = Buffer.from(base64, "base64");
  const { text } = await pdfParse(buffer);
  if (!text || text.trim().length < 20) {
    throw new Error("Could not extract text from this PDF. It may be a scanned image — try uploading a photo of the bill instead.");
  }

  const resp = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${process.env.GROQ_API_KEY}` },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: STRUCTURE_PROMPT(text.slice(0, 6000)) }],
      temperature: 0.1,
      max_tokens: 1500,
    }),
  });
  if (!resp.ok) {
    const err = await resp.json().catch(() => ({}));
    throw new Error(err.error?.message || "AI structuring failed");
  }
  const data = await resp.json();
  return data.choices[0].message.content;
}

async function scanImage(base64, mimeType) {
  const resp = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${process.env.GROQ_API_KEY}` },
    body: JSON.stringify({
      model: "meta-llama/llama-4-scout-17b-16e-instruct",
      messages: [{
        role: "user",
        content: [
          { type: "text", text: IMAGE_PROMPT },
          { type: "image_url", image_url: { url: `data:${mimeType || "image/jpeg"};base64,${base64}` } },
        ],
      }],
      temperature: 0.1,
      max_tokens: 1500,
    }),
  });
  if (!resp.ok) {
    const err = await resp.json().catch(() => ({}));
    throw new Error(err.error?.message || "Vision AI request failed");
  }
  const data = await resp.json();
  return data.choices[0].message.content;
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const { image, mimeType } = req.body || {};
  if (!image) return res.status(400).json({ error: "Missing file data" });
  try {
    const result = mimeType === "application/pdf"
      ? await scanPdf(image)
      : await scanImage(image, mimeType);
    res.json({ result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const config = {
  api: { bodyParser: { sizeLimit: "12mb" } },
};
