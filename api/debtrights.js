module.exports = async function (req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { state, situation } = req.body || {};
  if (!state) return res.status(400).json({ error: "Missing state" });

  const situationStr = situation?.trim() || "general medical debt situation";

  const prompt = `You are a consumer rights attorney specializing in medical debt law. A patient in ${state} has the following situation: ${situationStr}

Explain their legal rights in plain English. Be specific to ${state} laws where they differ from federal law.

Write your response in this exact format:

YOUR KEY RIGHTS:
[4-5 of the most important federal and ${state}-specific rights this person has right now — be specific and actionable]

CREDIT REPORTING RULES:
[Exactly when and how medical debt can appear on credit reports — include the current federal rules (medical debt under $500 cannot be reported; 1-year grace period before reporting; removed from credit report if paid)]

STATUTE OF LIMITATIONS:
[How long collectors have to sue for medical debt in ${state} — be specific with the number of years and what happens after it expires]

DEBT COLLECTOR RULES:
[What debt collectors can and cannot do under FDCPA — calls, harassment, validation requirements, cease and desist rights]

HOSPITAL OBLIGATIONS:
[What ${state} hospitals are required to offer — charity care, financial assistance, payment plans, billing protections]

WHAT TO DO NOW:
[Step-by-step action plan specific to their situation — starting with the most urgent step]

MAGIC WORDS TO SAY:
[Exact phrases and written statements that trigger legal protections — debt validation request, cease and desist, charity care application request]

Be accurate, cite specific laws (FDCPA, No Surprises Act, ${state} statutes where known), and focus on practical actions over legal theory.`;

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
        max_tokens: 1400,
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
