module.exports = async function (req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { procedure, diagnosis, insurance, doctor, name } = req.body || {};
  if (!procedure) return res.status(400).json({ error: "Missing procedure description" });

  const patientName = name?.trim() || "the patient";
  const insuranceName = insurance?.trim() || "the insurance company";
  const doctorName = doctor?.trim() || "the treating physician";
  const diagnosisStr = diagnosis?.trim() || "the patient's medical condition";

  const prompt = `You are a medical billing expert who specializes in writing successful prior authorization letters. Generate a complete, professional prior authorization appeal letter that insurance companies approve.

Patient: ${patientName}
Procedure/Treatment Requested: ${procedure}
Diagnosis/Reason: ${diagnosisStr}
Insurance Company: ${insuranceName}
Ordering Physician: ${doctorName}

Write the output in this exact format:

LETTER:
[A complete, formal prior authorization letter ready to submit. Include: date placeholder, patient info section, clinical justification, medical necessity statement, reference to clinical guidelines, request for expedited review if urgent, and closing with physician signature block]

KEY ARGUMENTS:
[3-4 bullet points of the strongest medical necessity arguments specific to this procedure and diagnosis]

SUPPORTING DOCUMENTS TO ATTACH:
[List of specific documents that strengthen this request — medical records, lab results, imaging, peer-reviewed studies, etc.]

WHAT TO EXPECT:
[Timeline: how long approval typically takes, what to do if denied, escalation path]

IF DENIED:
[Exact next steps — internal appeal, external review, state insurance commissioner contact, peer-to-peer review request]

Be specific, cite medical necessity standards, and write in the formal language that insurance reviewers expect. The letter should be ready to print and submit.`;

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
        max_tokens: 1500,
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
