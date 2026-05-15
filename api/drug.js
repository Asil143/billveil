const Groq = require("groq-sdk");

const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

module.exports = async function (req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { drug, price } = req.body;
  if (!drug) return res.status(400).json({ error: "No drug provided" });

  try {
    const message = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      max_tokens: 1000,
      messages: [{
        role: "user",
        content: `You are a drug pricing expert helping Americans find fair prices for their medications.

Drug: "${drug}"
${price ? `What they were charged: $${price}` : ""}

Respond in this exact format:

WHAT IS THIS DRUG:
[Plain English explanation of what this drug is and what it treats. 2 sentences max.]

FAIR PRICE RANGE:
[What this drug should realistically cost. Give specific dollar amounts for generic and brand name.]

COST PLUS DRUGS PRICE:
[Estimate the Mark Cuban Cost Plus Drugs price for this medication if available. Be specific.]

CHEAPEST OPTIONS:
[List 3-4 specific ways to get this drug cheaper: GoodRx, generic version, Cost Plus Drugs, pharmacy discount programs, manufacturer coupons. Include estimated prices.]

VERDICT:
[One of: FAIR PRICE | POSSIBLY OVERCHARGED | SIGNIFICANTLY OVERCHARGED]

MONEY YOU COULD SAVE:
[Specific dollar amount they could save by switching to the cheapest option.]

WHAT TO DO:
[3 numbered action steps to get this drug at the lowest possible price right now.]`,
      }],
    });
    res.json({ result: message.choices[0].message.content });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to analyze drug price" });
  }
};
