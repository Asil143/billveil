module.exports = async function (req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { eob } = req.body || {};
  if (!eob) return res.status(400).json({ error: "Missing EOB text" });

  const prompt = `You are a medical billing expert specializing in Explanation of Benefits (EOB) documents. A patient has pasted their EOB below. Analyze it thoroughly and explain it in plain English.

EOB TEXT:
${eob}

Write your analysis in this exact format:

WHAT HAPPENED:
[In 2-3 plain-English sentences, explain what this EOB is about — what service, who provided it, and when]

INSURANCE PAID:
[Exactly what the insurance company paid, with dollar amount and why]

YOUR RESPONSIBILITY:
[What the patient owes and why — break down deductible, copay, coinsurance if present]

WHAT WAS WRITTEN OFF:
[Any amounts that were contractually adjusted/written off by the provider — the patient does NOT owe these]

RED FLAGS:
[Any discrepancies, unusual charges, or items that look wrong — if none, say "No red flags detected"]

WHAT TO DO NEXT:
[Specific action steps — should they pay, dispute, appeal, or wait? Be concrete]

APPEAL RIGHTS:
[What the patient can appeal and the key deadline to know about]

Be specific with dollar amounts from the EOB. If the EOB text is unclear or incomplete, work with what's provided and note any missing information.`;

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
        temperature: 0.3,
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
