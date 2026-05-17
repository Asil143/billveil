module.exports = async function (req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { image, mimeType } = req.body || {};
  if (!image) return res.status(400).json({ error: "Missing image data" });

  const prompt = `You are a medical bill data extraction expert. Extract all information from this medical bill image.

Return the extracted data in this exact format:

PROVIDER:
[Hospital or provider name, address if visible]

DATE OF SERVICE:
[Date(s) of service]

PATIENT:
[Patient name if visible]

ACCOUNT / CLAIM NUMBER:
[Account or claim number if visible]

LINE ITEMS:
[Each charge on its own line: Description | CPT Code | Amount — if CPT code not visible, write N/A]

SUBTOTALS:
[Billed amount, insurance paid, adjustments, patient balance — each on its own line]

INSURANCE:
[Insurance company name, plan, and any policy/group numbers if visible]

NOTES:
[Any important notices, due dates, payment instructions visible on the bill]

EXTRACTED TEXT FOR ANALYSIS:
[A clean summary paragraph combining all charges, perfect for pasting into a bill analyzer. Format: "Provider: X, Date: X, Services: [list each service and amount], Total billed: $X, Insurance paid: $X, Patient owes: $X"]

Extract every number, code, and charge visible. If something is unclear or not visible, write "Not visible".`;

  try {
    const resp = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "meta-llama/llama-4-scout-17b-16e-instruct",
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: prompt },
              {
                type: "image_url",
                image_url: {
                  url: `data:${mimeType || "image/jpeg"};base64,${image}`,
                },
              },
            ],
          },
        ],
        temperature: 0.1,
        max_tokens: 1500,
      }),
    });

    if (!resp.ok) {
      const err = await resp.json().catch(() => ({}));
      return res.status(500).json({ error: err.error?.message || "Vision AI request failed" });
    }

    const data = await resp.json();
    res.json({ result: data.choices[0].message.content });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports.config = {
  api: { bodyParser: { sizeLimit: "12mb" } },
};
