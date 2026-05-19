import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { uid, phone, createdAt } = req.body || {};
  if (!uid) return res.status(400).json({ error: "Missing uid" });

  const { GMAIL_USER, GMAIL_APP_PASSWORD, ADMIN_EMAIL } = process.env;
  if (!GMAIL_USER || !GMAIL_APP_PASSWORD || !ADMIN_EMAIL) {
    return res.status(200).json({ ok: true, skipped: true });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: GMAIL_USER, pass: GMAIL_APP_PASSWORD },
    });

    await transporter.sendMail({
      from: `"BillVeil" <${GMAIL_USER}>`,
      to: ADMIN_EMAIL,
      subject: "🛡️ New BillVeil user signed up",
      html: `
        <div style="font-family:Inter,system-ui,sans-serif;background:#050810;color:#f1f5f9;padding:32px;border-radius:16px;max-width:480px;margin:0 auto">
          <div style="font-size:28px;margin-bottom:16px">🛡️</div>
          <h2 style="font-size:20px;font-weight:800;color:#10b981;margin:0 0 20px">New user signed up</h2>
          <table style="width:100%;border-collapse:collapse">
            <tr><td style="padding:8px 0;color:#64748b;font-size:13px">UID</td><td style="padding:8px 0;color:#f1f5f9;font-size:13px;font-family:monospace">${uid}</td></tr>
            <tr><td style="padding:8px 0;color:#64748b;font-size:13px">Phone</td><td style="padding:8px 0;color:#f1f5f9;font-size:13px">${phone || "—"}</td></tr>
            <tr><td style="padding:8px 0;color:#64748b;font-size:13px">Time</td><td style="padding:8px 0;color:#f1f5f9;font-size:13px">${createdAt || new Date().toISOString()}</td></tr>
          </table>
          <div style="margin-top:24px">
            <a href="https://billveil.com/admin" style="display:inline-block;padding:10px 20px;background:linear-gradient(135deg,#10b981,#059669);color:#fff;text-decoration:none;border-radius:10px;font-size:13px;font-weight:700">Open Admin Portal →</a>
          </div>
          <div style="margin-top:24px;font-size:11px;color:#334155">BillVeil · billveil.com</div>
        </div>
      `,
    });

    res.status(200).json({ ok: true });
  } catch (err) {
    console.error("Admin notify failed:", err.message);
    res.status(200).json({ ok: true, error: err.message });
  }
}
