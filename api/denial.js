const Groq = require("groq-sdk");

const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

module.exports = async function (req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { denial, amount } = req.body;
  if (!denial) return res.status(400).json({ error: "No denial reason provided" });

  try {
    const message = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      max_tokens: 1400,
      messages: [{
        role: "user",
        content: `You are an insurance appeal expert helping Americans fight wrongful claim denials.

Denial reason: "${denial}"
${amount ? `Claim amount: $${amount}` : ""}

Respond in this exact format:

WHY THEY DENIED IT:
[Explain in plain English what this denial reason means and why insurance companies commonly use it. 2-3 sentences.]

IS THIS DENIAL VALID:
[One of: LIKELY INVALID — APPEAL NOW | POSSIBLY INVALID — WORTH APPEALING | MAY BE VALID — HERE IS WHAT TO CHECK]

YOUR RIGHTS:
[List 3 specific legal rights the patient has under ACA, ERISA, or state law that apply to this denial. Be specific.]

APPEAL LETTER:
[Write a complete, firm appeal letter ready to send. Use placeholders: [Your Name], [Date], [Insurance Company], [Claim Number], [Service Date], [Provider Name]. Make it reference medical necessity, cite patient rights, and demand reconsideration within 30 days.]

WHAT TO DO NEXT:
[5 numbered action steps in order. Include: internal appeal, external review, state insurance commissioner complaint, CFPB complaint, and contacting a patient advocate.]

CHANCE OF SUCCESS:
[Realistic estimate of appeal success rate for this type of denial, and why.]`,
      }],
    });
    res.json({ result: message.choices[0].message.content });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to analyze denial" });
  }
};
