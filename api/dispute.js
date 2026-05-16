const Groq = require("groq-sdk");

const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

module.exports = async function (req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { bill, amount } = req.body;
  if (!bill) return res.status(400).json({ error: "No bill provided" });

  try {
    const message = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      max_tokens: 1400,
      messages: [
        {
          role: "system",
          content: "You are a medical billing advocate and patient rights attorney with 20 years of experience writing dispute letters that get results. You know exactly which laws to cite, which departments to contact, and what language makes hospitals and insurers take action. Your letters are firm, professional, and legally grounded."
        },
        {
          role: "user",
          content: `Write a powerful dispute letter for a patient with this situation: "${bill}"
${amount ? `Amount being disputed: $${amount}` : ""}

Use these placeholders where needed: [Your Full Name], [Your Address], [Your Phone], [Your Email], [Date], [Hospital/Provider Name], [Hospital Address], [Account Number], [Insurance Company Name].

Write a complete, ready-to-send letter that:
- Opens with a firm, confident statement of dispute
- Cites the patient's legal right to an itemized bill under 45 CFR 164.524
- References that studies show 80% of medical bills contain errors (BMJ, JAMA)
- Cites the No Surprises Act (2022) if applicable to surprise or out-of-network charges
- Demands a line-by-line itemized bill within 30 days
- Requests correction of any charges that exceed Medicare allowable rates
- States that unresolved disputes will be reported to: (1) the state insurance commissioner, (2) the CFPB at consumerfinance.gov/complaint, and (3) the HHS Office of Inspector General
- Sets a firm 30-day deadline for written response
- Is firm, professional, and specific — not threatening, but serious

Format as a real letter with proper spacing, date, recipient address, salutation, body paragraphs, and closing.`
        }
      ],
    });
    res.json({ result: message.choices[0].message.content });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to generate letter" });
  }
};
