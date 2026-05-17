module.exports = async function (req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const { hospital, date, amount, name } = req.body || {};
  if (!hospital) return res.status(400).json({ error: "Missing hospital name" });

  const patientName = name?.trim() || "the patient";
  const dateStr = date?.trim() || "the date of service";
  const amountStr = amount?.trim() ? `$${amount}` : "the billed amount";

  const prompt = `You are a medical billing expert. Generate a formal itemized bill request letter and explain why this matters.

Patient: ${patientName}
Hospital/Provider: ${hospital}
Date of Service: ${dateStr}
Amount Billed: ${amountStr}

Write your response in this exact format:

LETTER:
[Complete, formal letter requesting a fully itemized bill. Include: patient name/date of birth placeholder, account number placeholder, date of service, specific request for itemized bill with CPT codes, ICD codes, and line-item charges, HIPAA rights reference, 30-day response request, and patient signature block]

WHY THIS MATTERS:
[3-4 specific things an itemized bill commonly reveals that summary bills hide — duplicate charges, phantom charges, upcoding, services never received]

WHAT TO LOOK FOR:
[When you get the itemized bill — specific red flags to check: duplicate line items, charges for discharge day, facility fees, medication markups, observation vs admission status]

IF THEY REFUSE:
[Patient's legal rights to receive an itemized bill — HIPAA, state laws, and what to do if the hospital refuses or delays]

SEND IT TO:
[Specific guidance on where and how to send — certified mail, fax, and who to address it to at the hospital]`;

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
