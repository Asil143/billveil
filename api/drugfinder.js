module.exports = async function (req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { drug, dose, insurance } = req.body || {};
  if (!drug) return res.status(400).json({ error: "Missing drug name" });

  const doseStr = dose?.trim() ? ` ${dose}` : "";
  const insuranceStr = insurance?.trim() ? `Patient insurance: ${insurance}` : "Patient may be uninsured or underinsured.";

  const prompt = `You are a clinical pharmacist and drug pricing expert. A patient is trying to reduce the cost of their medication.

Drug: ${drug}${doseStr}
${insuranceStr}

Give them a complete cost-reduction plan.

Write your response in this exact format:

GENERIC EQUIVALENT:
[The exact generic name (INN), available doses, and whether a true generic exists. If it's already generic, say so and explain why it may still be expensive.]

HOW MUCH YOU COULD SAVE:
[Realistic dollar comparison — brand name price vs generic price per month at common pharmacies. Use real ballpark figures.]

BEST PHARMACY PRICES:
[Top 4-5 pharmacy options ranked by typical price — include big chains, warehouse stores, and online/mail-order options with approximate monthly costs]

DISCOUNT PROGRAMS:
[GoodRx, RxSaver, NeedyMeds, manufacturer patient assistance programs — which apply to this drug, what discount to expect, and exactly how to use them]

HOW TO ASK YOUR DOCTOR:
[Word-for-word script to ask the prescriber to switch to generic or prescribe the generic by name — include what to say if they push back]

MANUFACTURER COUPONS:
[Whether a manufacturer copay card exists for this drug, how to find it, eligibility restrictions (usually no government insurance), and typical savings]

THERAPEUTIC ALTERNATIVES:
[1-2 other drugs in the same class that are available as cheap generics and could work similarly — patient should ask their doctor about these]

Be specific with drug names, real prices, and real program names. This patient is trying to afford their medication.`;

  try {
    const resp = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3,
        max_tokens: 1400,
      }),
    });

    if (!resp.ok) {
      const err = await resp.json().catch(() => ({}));
      return res.status(500).json({ error: err.error?.message || "AI request failed" });
    }

    const data = await resp.json();
    res.json({ result: data.choices[0].message.content });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
