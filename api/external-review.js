const Groq = require("groq-sdk");

const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

module.exports = async function (req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { denial, amount } = req.body;
  if (!denial) return res.status(400).json({ error: "No denial provided" });

  try {
    const message = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      max_tokens: 1000,
      messages: [{
        role: "user",
        content: `Write a formal External Review Request letter for a patient whose insurance claim was denied.

Denial reason: "${denial}"
${amount ? `Claim amount: $${amount}` : ""}

Write a complete, ready-to-send letter requesting an Independent External Review under the ACA (Affordable Care Act). Use these placeholders: [Your Full Name], [Your Address], [Your Phone], [Your Email], [Date], [Insurance Company Name], [Plan Name], [Member ID], [Claim Number], [Service Date], [Provider Name], [State].

The letter should:
- Reference the patient's right to external review under ACA Section 2719
- State that the internal appeal has been exhausted or that this is an urgent care request
- Request assignment to an Independent Review Organization (IRO)
- Include a deadline of 4 months from the denial date as required by law
- Be firm, professional, and cite specific legal rights
- Mention that failure to comply will be reported to the state insurance commissioner

Format it as a complete, professional letter.`,
      }],
    });
    res.json({ result: message.choices[0].message.content });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to generate letter" });
  }
};
