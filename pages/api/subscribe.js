export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  if (req.method !== "POST") return res.status(405).end();

  const { email } = req.body || {};
  if (!email || !email.includes("@")) return res.status(400).json({ error: "Invalid email" });

  // Log to Vercel function logs — connect a real email service (Mailchimp, Loops, etc.) here later
  console.log(`[subscribe] ${new Date().toISOString()} — ${email}`);

  return res.status(200).json({ ok: true });
};
