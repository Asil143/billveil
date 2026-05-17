module.exports = async function (req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const { plan } = req.body || {};
  if (!plan) return res.status(400).json({ error: "Missing plan text" });

  const prompt = `You are a health insurance expert. A patient has pasted their Summary of Benefits and Coverage (SBC) or plan details below. Decode it in plain English.

PLAN TEXT:
${plan}

Write your response in this exact format:

PLAN TYPE:
[HMO, PPO, EPO, HDHP — explain in one sentence what this means for them]

DEDUCTIBLE:
[Individual and family deductible — explain when it applies and when it resets]

OUT-OF-POCKET MAXIMUM:
[The most they will ever pay in a year — explain what counts toward it and what doesn't]

WHAT'S COVERED:
[Top 8-10 covered services with their cost-sharing — copay or coinsurance amounts in plain terms]

WHAT'S NOT COVERED:
[Key exclusions and limitations they need to know about]

IN-NETWORK vs OUT-OF-NETWORK:
[Explain the difference for THIS plan and what happens if they go out of network]

HIDDEN GOTCHAS:
[2-3 things buried in the fine print that could surprise them — prior auth requirements, referral rules, specialty tiers]

BOTTOM LINE:
[Is this a good plan? When is it a good deal and when should they be worried about costs?]

Be specific with dollar amounts from the plan text. Speak like a friend who happens to be an insurance expert.`;

  try {
    const resp = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${process.env.GROQ_API_KEY}` },
      body: JSON.stringify({ model: "llama-3.3-70b-versatile", messages: [{ role: "user", content: prompt }], temperature: 0.3, max_tokens: 1400 }),
    });
    if (!resp.ok) { const err = await resp.json().catch(() => ({})); return res.status(500).json({ error: err.error?.message || "AI request failed" }); }
    const data = await resp.json();
    res.json({ result: data.choices[0].message.content });
  } catch (err) { res.status(500).json({ error: err.message }); }
};
