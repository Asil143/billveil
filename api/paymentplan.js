module.exports = async function (req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const { hospital, amount, income, name } = req.body || {};
  if (!hospital || !amount) return res.status(400).json({ error: "Missing hospital or amount" });

  const patientName = name?.trim() || "the patient";
  const incomeStr = income?.trim() ? `Monthly income: $${income}` : "";

  const prompt = `You are a medical billing advocate. Generate a payment plan negotiation letter and strategy for this patient.

Hospital/Provider: ${hospital}
Amount Owed: $${amount}
Patient: ${patientName}
${incomeStr}

Write your response in this exact format:

LETTER:
[Complete letter requesting a 0% interest payment plan — include hardship language, proposed monthly payment amount (suggest 1-2% of balance or $50/month minimum whichever is greater), request for written confirmation, and reference to hospital financial assistance policies]

NEGOTIATION STRATEGY:
[3-4 tactics to get the best payment plan terms — asking for interest waiver, prompt-pay discount, balance reduction before setting up plan]

WHAT TO ASK FOR:
[Specific asks in priority order: charity care first, then balance reduction, then 0% payment plan, minimum monthly payment]

YOUR LEVERAGE:
[Why the hospital will negotiate — collection costs, bad debt write-offs, IRS requirements for nonprofit hospitals, state laws]

RED FLAGS TO AVOID:
[Medical credit cards (CareCredit deferred interest), collection referral threats, signing away rights, paying before disputing]

IF SENT TO COLLECTIONS:
[What changes once a bill goes to collections and how to handle it differently]`;

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
