const Groq = require("groq-sdk");

const client = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

module.exports = async function (req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { bill } = req.body;

  if (!bill) {
    return res.status(400).json({ error: "No bill provided" });
  }

  try {
    const message = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      max_tokens: 1000,
      messages: [
        {
          role: "user",
          content: `You are BillVeil, an expert medical billing advocate helping ordinary Americans understand their medical bills.

A user has shared this medical bill or charge:
"${bill}"

Analyze it and respond in this exact format:

WHAT IS THIS:
[Explain in plain English what this charge or bill is. No medical jargon. Like explaining to a friend.]

FAIR PRICE:
[What should this realistically cost based on fair market rates. Give a specific dollar range.]

VERDICT:
[One of these three: FAIR PRICE | POSSIBLY OVERCHARGED | SIGNIFICANTLY OVERCHARGED]

WHY:
[Explain in 2 to 3 simple sentences why you gave that verdict.]

WHAT TO DO:
[Give 3 specific action steps the patient can take right now. Number them 1, 2, 3.]

MONEY YOU COULD SAVE:
[Estimate how much they could potentially recover if overcharged. Be specific.]`,
        },
      ],
    });

    res.json({ result: message.choices[0].message.content });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Analysis failed" });
  }
};
