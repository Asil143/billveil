module.exports = async function (req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const { bill, situation } = req.body || {};
  if (!bill) return res.status(400).json({ error: "Missing bill description" });

  const prompt = `You are a healthcare law expert specializing in the No Surprises Act (2022) and surprise medical billing protections. Analyze whether this bill may violate federal surprise billing laws.

Bill/Situation: ${bill}
Additional context: ${situation || "None provided"}

Write your response in this exact format:

VERDICT:
[One of: LIKELY VIOLATES NO SURPRISES ACT | POSSIBLY VIOLATES | DOES NOT APPEAR TO VIOLATE | NEED MORE INFORMATION]

WHAT THE NO SURPRISES ACT SAYS:
[Plain-English explanation of which specific protections apply to this situation]

WHY THIS BILL MAY BE ILLEGAL:
[Specific reasons this bill may violate the law — be precise about which provisions]

YOUR PROTECTIONS:
[Exactly what the patient is legally protected from in this scenario]

WHAT TO DO RIGHT NOW:
[Step-by-step action plan — who to call, what to say, official complaint channels]

HOW TO DISPUTE IT:
[Exact dispute process — Independent Dispute Resolution, state insurance commissioner, CMS complaint]

KEY DEADLINES:
[Time-sensitive deadlines the patient must not miss]

Be specific about which parts of the No Surprises Act apply (emergency services, air ambulance, out-of-network at in-network facilities, etc.).`;

  try {
    const resp = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${process.env.GROQ_API_KEY}` },
      body: JSON.stringify({ model: "llama-3.3-70b-versatile", messages: [{ role: "user", content: prompt }], temperature: 0.3, max_tokens: 1300 }),
    });
    if (!resp.ok) { const err = await resp.json().catch(() => ({})); return res.status(500).json({ error: err.error?.message || "AI request failed" }); }
    const data = await resp.json();
    res.json({ result: data.choices[0].message.content });
  } catch (err) { res.status(500).json({ error: err.message }); }
};
