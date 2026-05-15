const Groq = require("groq-sdk");

const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

module.exports = async function (req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { bill, amount } = req.body;
  if (!bill) return res.status(400).json({ error: "No bill provided" });

  try {
    const message = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      max_tokens: 1200,
      messages: [{
        role: "user",
        content: `You are a medical billing advocate. Write a professional, firm dispute letter for a patient.

Bill or charge being disputed: "${bill}"
${amount ? `Amount: $${amount}` : ""}

Write a complete, ready-to-send dispute letter. Use these placeholders where needed: [Your Full Name], [Your Address], [Your Phone], [Your Email], [Date], [Hospital/Provider Name], [Hospital Address], [Account Number], [Insurance Company Name].

The letter should:
- Be firm but professional
- Reference the patient's right to an itemized bill
- Cite that 80% of medical bills contain errors
- Request a full review and correction
- Set a 30-day deadline for response
- Mention that unresolved disputes will be escalated to the state insurance commissioner and CFPB

Format it as a real letter with proper spacing. Make it powerful and specific.`,
      }],
    });
    res.json({ result: message.choices[0].message.content });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to generate letter" });
  }
};
