module.exports = async function (req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { diagnosis, procedure, concern } = req.body || {};
  if (!diagnosis) return res.status(400).json({ error: "Missing diagnosis" });

  const procedureStr = procedure?.trim() ? `Recommended procedure: ${procedure}` : "";
  const concernStr = concern?.trim() ? `Patient concern: ${concern}` : "";

  const prompt = `You are a patient advocate and medical expert. A patient has received the following diagnosis and wants to seek a second opinion.

Diagnosis: ${diagnosis}
${procedureStr}
${concernStr}

Help them get the most out of a second opinion consultation.

Write your response in this exact format:

WHAT TO KNOW FIRST:
[2-3 sentences on why a second opinion matters for this specific diagnosis and what to realistically expect]

SPECIALIST TO SEE:
[Exactly what type of specialist they should seek for a second opinion — be specific about subspecialty, not just "a doctor"]

QUESTIONS TO ASK:
[8-10 specific, powerful questions to ask the second opinion doctor — tailored to this exact diagnosis and procedure]

RED FLAGS TO WATCH FOR:
[4-5 warning signs that something may be wrong with the original diagnosis or treatment plan — things a second doctor might catch]

HOW TO GET YOUR RECORDS:
[Step-by-step instructions to request medical records, imaging, pathology slides — include HIPAA rights and typical turnaround times]

WHAT TO BRING:
[Complete checklist of documents, images, test results, and information to bring to the second opinion appointment]

IF OPINIONS DIFFER:
[What to do if the two doctors disagree — how to decide, who else to consult, how to get a tiebreaker opinion]

Be specific to this diagnosis. Use real medical terms the patient can bring to their appointment. This could be a life-changing decision.`;

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
        temperature: 0.35,
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
