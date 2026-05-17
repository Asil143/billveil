module.exports = async function (req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { bill, amount, name } = req.body || {};
  if (!bill) return res.status(400).json({ error: "Missing bill description" });

  const patientName = name?.trim() || "the patient";
  const amountStr = amount ? `$${amount}` : "the billed amount";

  const prompt = `You are a medical billing negotiation expert. Generate a detailed, word-for-word phone script for a patient to call their hospital billing department and negotiate their bill.

Patient: ${patientName}
Bill / Charge: ${bill}
Amount Billed: ${amountStr}

Write the script in this exact format:

OPENING:
[Word-for-word opening statement to say when they answer]

KEY POINTS TO MAKE:
[3-4 specific, powerful leverage points the patient should raise — include facts about Medicare rates, hospital charity care, prompt-pay discounts, billing errors]

WHAT TO ASK FOR:
[Exact dollar target to negotiate toward and why — be specific]

IF THEY SAY NO:
[Word-for-word responses to the 3 most common pushbacks]

ESCALATION:
[What to say if the first rep can't help — who to ask for and exact wording]

FOLLOW-UP:
[What to do after the call — get it in writing, next steps]

PRO TIPS:
[2-3 insider tips specific to this type of bill]

Be specific, confident, and direct. Use real numbers and real leverage points.`;

  try {
    const resp = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.4,
        max_tokens: 1200,
      }),
    });

    if (!resp.ok) {
      const err = await resp.json().catch(() => ({}));
      return res.status(500).json({ error: err.error?.message || "AI request failed" });
    }

    const data = await resp.json();
    res.json({ result: data.choices[0].message.content });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
