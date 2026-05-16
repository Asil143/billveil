const Groq = require("groq-sdk");

const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

module.exports = async function (req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { drug, price } = req.body;
  if (!drug) return res.status(400).json({ error: "No drug provided" });

  try {
    const message = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      max_tokens: 1100,
      messages: [
        {
          role: "system",
          content: "You are a pharmaceutical pricing expert who helps Americans find the lowest legal price for their medications. You have deep knowledge of GoodRx pricing, Mark Cuban's Cost Plus Drugs (costplusdrugs.com), manufacturer patient assistance programs, pharmacy discount cards, and generic drug availability. Always give specific dollar amounts, not ranges where possible."
        },
        {
          role: "user",
          content: `Help this patient find the lowest price for their medication: "${drug}"
${price ? `They are currently paying: $${price}` : ""}

IMPORTANT: Do NOT use markdown (no ##, no **, no * bullets). Plain text only with the EXACT section headers below:

Respond in this EXACT format:

WHAT IS THIS DRUG:
[2 sentences max. What it treats, who typically takes it, and whether a generic is available.]

FAIR PRICE RANGE:
[What this drug should cost. Separate generic vs brand name prices. Reference actual market prices, not retail.]

COST PLUS DRUGS PRICE:
[Mark Cuban's Cost Plus Drugs price at costplusdrugs.com. If not listed there, say so and explain why (brand-only, controlled substance, etc).]

CHEAPEST OPTIONS:
[List 4 specific ways to get this cheaper, with approximate prices for each:
1. Generic version at [pharmacy] using GoodRx: ~$X
2. Cost Plus Drugs (costplusdrugs.com): ~$X
3. Manufacturer patient assistance program (if brand-name): free or reduced cost
4. [Another specific option like NeedyMeds, RxAssist, or 90-day supply discount]]

VERDICT:
[Exactly one of: FAIR PRICE | POSSIBLY OVERCHARGED | SIGNIFICANTLY OVERCHARGED]

MONEY YOU COULD SAVE:
[Specific monthly AND annual savings if they switch to the cheapest option. Be exact.]

WHAT TO DO:
1. [Go to goodrx.com right now, search "[drug name]", show the coupon to your pharmacist — takes 2 minutes]
2. [Check costplusdrugs.com — if listed, order online or transfer prescription]
3. [If brand-name only: go to [manufacturer] website and apply for their patient assistance program — many are free for qualifying patients]`
        }
      ],
    });
    res.json({ result: message.choices[0].message.content });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to analyze drug price" });
  }
};
