const Groq = require("groq-sdk");

const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

module.exports = async function (req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { denial, amount } = req.body;
  if (!denial) return res.status(400).json({ error: "No denial reason provided" });

  try {
    const message = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      max_tokens: 1600,
      messages: [
        {
          role: "system",
          content: "You are an insurance appeal specialist and patient rights expert. You have won hundreds of appeals against major insurers. You know ERISA Section 503, ACA Section 2719, the No Surprises Act, and state insurance laws inside out. You write appeal letters that insurance companies cannot easily dismiss. Your success rate is 73% — the national average for appealed denials."
        },
        {
          role: "user",
          content: `An insurance claim was denied. Help this patient fight back.

Denial reason: "${denial}"
${amount ? `Claim amount: $${amount}` : ""}

IMPORTANT: Do NOT use markdown (no ##, no **, no * bullets). Plain text only with the EXACT section headers below:

Respond in this EXACT format:

WHY THEY DENIED IT:
[2-3 sentences in plain English. What this denial reason actually means, and why insurers commonly use it — often as a first line of defense knowing most patients won't appeal.]

IS THIS DENIAL VALID:
[Exactly one of: LIKELY INVALID — APPEAL IMMEDIATELY | POSSIBLY INVALID — WORTH APPEALING | MAY BE VALID — HERE IS WHAT TO CHECK FIRST]

YOUR LEGAL RIGHTS:
1. [Specific right under ACA, ERISA, or No Surprises Act that applies to this denial]
2. [Right to external review by an Independent Review Organization (IRO) under ACA Section 2719]
3. [Right to a full explanation of denial in writing within specific timeframes under ERISA Section 503]

APPEAL LETTER:
[Write a complete, powerful internal appeal letter. Use placeholders: [Your Full Name], [Date], [Insurance Company Name], [Plan Name], [Member ID], [Claim Number], [Date of Service], [Provider Name], [Procedure/Service].

The letter must:
- State clearly this is a formal appeal under ERISA Section 503 / ACA Section 2719
- Cite the specific denial reason and why it is incorrect or unsupported
- Reference peer-reviewed medical guidelines or standard of care if relevant
- Demand a decision within 30 days (urgent) or 60 days (standard) per federal law
- State that if denied again, you will request external review by an IRO
- Mention that continued denial will be reported to the state insurance commissioner]

WHAT TO DO NEXT:
1. Send this appeal letter via certified mail with return receipt — creates a legal paper trail
2. Call the insurer's member services (number on your insurance card) and verbally confirm appeal submission
3. If denied again: request external review — insurers must pay for an Independent Review Organization under ACA
4. File a complaint with your state insurance commissioner (free, takes 15 minutes online)
5. Contact the CFPB at consumerfinance.gov/complaint — federal complaints get insurer attention fast

CHANCE OF SUCCESS:
[Realistic estimate with context. National data: 73% of appealed denials are overturned. Give the specific success rate for this type of denial if known, and what factors help.]`
        }
      ],
    });
    res.json({ result: message.choices[0].message.content });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to analyze denial" });
  }
};
