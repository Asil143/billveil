module.exports = async function (req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const { hospital, state, income, household, name } = req.body || {};
  if (!hospital || !state) return res.status(400).json({ error: "Missing hospital or state" });

  const patientName = name?.trim() || "the patient";
  const incomeStr = income?.trim() ? `Annual household income: $${income}` : "";
  const householdStr = household?.trim() ? `Household size: ${household}` : "";

  const prompt = `You are a medical billing advocate specializing in hospital charity care and financial assistance programs. Help this patient access charity care.

Hospital: ${hospital}
State: ${state}
Patient: ${patientName}
${incomeStr}
${householdStr}

Write your response in this exact format:

ELIGIBILITY ESTIMATE:
[Based on income and household size, estimate if they likely qualify — reference federal poverty level percentages that most hospital charity care programs use: 100-400% FPL]

WHAT NONPROFIT HOSPITALS MUST OFFER:
[IRS 501c3 requirements — hospitals must have financial assistance policies, cannot use extraordinary collection actions, must provide plain language summaries]

HOW TO APPLY:
[Step-by-step application process — what to ask for, what documents to gather, who to contact at the billing department]

APPLICATION LETTER:
[A ready-to-use letter requesting charity care application materials, referencing the hospital's legal obligation and the patient's situation]

DOCUMENTS TO GATHER:
[Specific list of documents typically required: tax returns, pay stubs, bank statements, proof of expenses]

IF THEY SAY NO:
[How to appeal a charity care denial — internal appeal, state attorney general complaint, IRS Form 13909 for 501c3 violations]

OTHER PROGRAMS TO APPLY FOR:
[Medicaid, state programs, hospital payment plans, NeedyMeds, RxAssist — what to apply for simultaneously]`;

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
