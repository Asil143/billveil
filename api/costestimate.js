module.exports = async function (req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const { procedure, insurance, location, deductible } = req.body || {};
  if (!procedure) return res.status(400).json({ error: "Missing procedure" });

  const insuranceStr = insurance?.trim() || "unspecified insurance";
  const locationStr = location?.trim() || "unspecified location";
  const deductibleStr = deductible?.trim() ? `Remaining deductible: $${deductible}` : "";

  const prompt = `You are a medical cost expert. Help this patient estimate what a procedure will actually cost them before they commit.

Procedure: ${procedure}
Insurance: ${insuranceStr}
Location: ${locationStr}
${deductibleStr}

Write your response in this exact format:

COST ESTIMATE:
[Realistic range of what this procedure typically costs — billed charge, Medicare rate, fair market rate, and typical patient out-of-pocket with insurance]

WHAT AFFECTS YOUR COST:
[5 specific factors that will change their actual cost — deductible status, facility type, in-network status, time of year, plan type]

QUESTIONS TO ASK YOUR INSURANCE BEFORE:
[6-8 specific questions to call member services and ask — pre-auth required? In-network facilities? What's my cost-sharing?]

HOW TO FIND CHEAPER OPTIONS:
[Specific ways to reduce cost — ambulatory surgery center vs hospital, different facility, negotiating cash price, timing relative to deductible]

PRICE TRANSPARENCY RESOURCES:
[Specific resources to research actual prices — Healthcare Bluebook, Fair Health Consumer, CMS hospital price transparency files, your state's all-payer database]

BEFORE YOU SCHEDULE:
[Checklist of things to do before committing — prior auth, in-network verification, get a cost estimate in writing, check if less expensive setting exists]

WATCH OUT FOR:
[Hidden costs that often surprise patients — facility fee, anesthesiology, pathology, post-procedure follow-up, assistant surgeon]`;

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
