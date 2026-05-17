module.exports = async function (req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const { provider, insurance, procedure } = req.body || {};
  if (!provider || !insurance) return res.status(400).json({ error: "Missing provider or insurance" });

  const procedureStr = procedure?.trim() ? `Planned procedure/visit: ${procedure}` : "";

  const prompt = `You are a health insurance expert specializing in provider networks. Help this patient understand their network coverage situation.

Provider/Doctor: ${provider}
Insurance Plan: ${insurance}
${procedureStr}

Write your response in this exact format:

HOW TO VERIFY NETWORK STATUS:
[Step-by-step instructions to confirm if this provider is in-network — insurance website, member services number, and asking the provider's office directly. Explain why you must verify all three.]

IN-NETWORK vs OUT-OF-NETWORK COSTS:
[Plain-English explanation of what in-network and out-of-network means for THIS type of plan — HMO vs PPO vs EPO differences]

COST DIFFERENCE:
[Realistic estimate of how much more out-of-network could cost — typical in-network copay vs out-of-network coinsurance and balance billing risk]

HIDDEN RISKS:
[In-network facility but out-of-network doctor (anesthesiologist, radiologist, hospitalist) — how to protect against this]

WHAT TO ASK BEFORE YOUR APPOINTMENT:
[Exact questions to ask the provider's office AND your insurance company before any procedure or visit]

NO SURPRISES ACT PROTECTION:
[How the No Surprises Act (2022) protects you from unexpected out-of-network bills in certain situations]

IF YOU GET AN OUT-OF-NETWORK BILL:
[Step-by-step dispute process — network adequacy claims, balance billing protections, state insurance commissioner]`;

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
