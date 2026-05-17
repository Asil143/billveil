module.exports = async function (req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const { expenses, accountType } = req.body || {};
  if (!expenses) return res.status(400).json({ error: "Missing expenses" });

  const acct = accountType || "HSA or FSA";

  const prompt = `You are a tax and benefits expert specializing in HSA (Health Savings Accounts) and FSA (Flexible Spending Accounts). Analyze these expenses.

Account Type: ${acct}
Expenses/Situation: ${expenses}

Write your response in this exact format:

ELIGIBLE EXPENSES:
[List each expense mentioned and whether it qualifies — YES/NO/PARTIAL with a one-line reason. Be specific.]

HIDDEN ELIGIBLE ITEMS YOU MAY BE MISSING:
[5-7 commonly overlooked expenses that ARE eligible — sunscreen SPF 15+, menstrual products, OTC medications without prescription (post-2020), telehealth, dental, vision, mental health]

NOT ELIGIBLE — COMMON MISTAKES:
[3-4 things people wrongly assume are covered — cosmetic procedures, gym memberships (usually no), vitamins (unless prescribed), teeth whitening]

HSA ADVANTAGES:
[Triple tax benefit explained simply — pre-tax contributions, tax-free growth, tax-free withdrawals for medical]

FSA RULES TO KNOW:
[Use-it-or-lose-it rules, grace periods, rollover limits, what happens if you leave your job]

HOW MUCH TO CONTRIBUTE:
[Strategy for estimating the right contribution amount based on their expenses]

PRO TIPS:
[2-3 advanced strategies — HSA as retirement account after 65, investing HSA funds, keeping receipts for future reimbursement]`;

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
