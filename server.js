const express = require("express");
const cors = require("cors");
const Groq = require("groq-sdk");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const client = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

app.post("/analyze", async (req, res) => {
  const { bill } = req.body;

  if (!bill) {
    return res.status(400).json({ error: "No bill provided" });
  }

  try {
    const message = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      max_tokens: 1000,
      messages: [
        {
          role: "user",
          content: `You are BillVeil, an expert medical billing advocate helping ordinary Americans understand their medical bills.

A user has shared this medical bill or charge:
"${bill}"

Analyze it and respond in this exact format:

WHAT IS THIS:
[Explain in plain English what this charge or bill is. No medical jargon. Like explaining to a friend.]

FAIR PRICE:
[What should this realistically cost based on fair market rates. Give a specific dollar range.]

VERDICT:
[One of these three: FAIR PRICE | POSSIBLY OVERCHARGED | SIGNIFICANTLY OVERCHARGED]

WHY:
[Explain in 2 to 3 simple sentences why you gave that verdict.]

WHAT TO DO:
[Give 3 specific action steps the patient can take right now. Number them 1, 2, 3.]

MONEY YOU COULD SAVE:
[Estimate how much they could potentially recover if overcharged. Be specific.]`,
        },
      ],
    });

    res.json({ result: message.choices[0].message.content });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Analysis failed" });
  }
});

const emailKey = (e) =>
  e.toLowerCase().replace(/\./g, "_dot_").replace(/@/g, "_at_");

// Phone calls this after email-link verification — server writes to Firestore reliably
app.post("/api/verify-email", async (req, res) => {
  const { email, ownerUid } = req.body;
  if (!email || !ownerUid) return res.status(400).json({ error: "Missing email or ownerUid" });

  const docId = emailKey(email);
  const url = `https://firestore.googleapis.com/v1/projects/billveil/databases/(default)/documents/email_verifications/${docId}`;

  try {
    const resp = await fetch(url, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fields: {
          verified: { booleanValue: true },
          email: { stringValue: email },
          ownerUid: { stringValue: ownerUid },
          verifiedAt: { timestampValue: new Date().toISOString() },
        },
      }),
    });

    if (!resp.ok) {
      const err = await resp.json().catch(() => ({}));
      return res.status(500).json({ error: err.error?.message || "Firestore write failed" });
    }

    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`BillVeil server running on port ${PORT}`);
});