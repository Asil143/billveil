module.exports = async function (req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const { card, amount, situation } = req.body || {};
  if (!situation && !card) return res.status(400).json({ error: "Missing information" });

  const prompt = `You are a consumer finance expert specializing in medical credit cards and deferred interest traps. Analyze this situation.

Card/Product: ${card || "medical credit card (unspecified)"}
Amount: ${amount ? `$${amount}` : "unspecified"}
Situation: ${situation || "General medical credit card inquiry"}

Write your response in this exact format:

RISK LEVEL:
[HIGH RISK | MEDIUM RISK | LOW RISK — one line explaining why]

HOW DEFERRED INTEREST WORKS:
[Plain-English explanation of the deferred interest trap — if not paid in full by promo end, ALL interest from day 1 is charged retroactively]

THE MATH:
[Show exactly how much extra they would pay if they don't pay in full by the promo period end — use their specific amount if provided]

SAFER ALTERNATIVES:
[4-5 specific better options: hospital payment plan (0% interest, required by many states), personal loan comparison, credit union options, charity care, payment plan negotiation]

RED FLAGS TO WATCH:
[Specific warning signs in the fine print — deferred vs waived interest, minimum payments that won't clear the balance, automatic enrollment in recurring charges]

IF YOU ALREADY SIGNED UP:
[Damage control — how to calculate payoff date, set up auto-pay for full balance, dispute deferred interest charges, contact CFPB]

YOUR RIGHTS:
[CFPB protections, Truth in Lending Act disclosures, how to file a complaint if misled]`;

  try {
    const resp = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${process.env.GROQ_API_KEY}` },
      body: JSON.stringify({ model: "llama-3.3-70b-versatile", messages: [{ role: "user", content: prompt }], temperature: 0.3, max_tokens: 1200 }),
    });
    if (!resp.ok) { const err = await resp.json().catch(() => ({})); return res.status(500).json({ error: err.error?.message || "AI request failed" }); }
    const data = await resp.json();
    res.json({ result: data.choices[0].message.content });
  } catch (err) { res.status(500).json({ error: err.message }); }
};
