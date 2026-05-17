import Groq from "groq-sdk";

const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { bill } = req.body;
  if (!bill) return res.status(400).json({ error: "No bill provided" });

  try {
    const message = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      max_tokens: 1200,
      messages: [
        {
          role: "system",
          content: "You are BillVeil, an expert medical billing advocate with deep knowledge of CPT codes, Medicare allowable rates, hospital chargemasters, the No Surprises Act (2022), balance billing protections, and ERISA appeal rights. You give direct, specific, actionable advice that saves Americans real money. Always reference Medicare rates as the fair price benchmark. Be specific with dollar amounts."
        },
        {
          role: "user",
          content: `A patient needs help understanding this medical bill or charge: "${bill}"

IMPORTANT: Do NOT use markdown (no ##, no **, no bullet points with *). Use plain text only with the EXACT section headers below, nothing else before them:

Respond in this EXACT format with these EXACT section headers:

WHAT IS THIS:
[2-3 sentences in plain English. What the service is, why it's done, and how common it is. Zero medical jargon.]

FAIR PRICE:
[Use Medicare allowable rate as the fair benchmark. Example format: "Medicare pays approximately $X for this. A fair out-of-pocket price is $X–$X. Anything above $X is likely inflated."]

VERDICT:
[Exactly one of these three: FAIR PRICE | POSSIBLY OVERCHARGED | SIGNIFICANTLY OVERCHARGED]

WHY:
[2-3 sentences. If overcharged, state the exact markup (e.g. "This is 8x the Medicare rate"). Mention the No Surprises Act if this was an out-of-network or surprise bill. Be specific.]

WHAT TO DO:
1. [Call the billing department and request a complete itemized bill in writing. By law they must provide one within 30 days.]
2. [Say exactly this: "I'd like to pay the Medicare allowable rate of approximately $X. Can you adjust my bill to that amount?" Most hospitals will negotiate.]
3. [If they refuse: file a complaint at consumerfinance.gov/complaint (CFPB) and your state insurance commissioner. Hospitals fear regulators.]

MONEY YOU COULD SAVE:
[Specific dollar estimate based on the difference between the charged amount and Medicare rate. Example: "Negotiating to Medicare rates could save you $X–$X on this charge alone."]`
        }
      ],
    });

    res.json({ result: message.choices[0].message.content });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Analysis failed" });
  }
};
