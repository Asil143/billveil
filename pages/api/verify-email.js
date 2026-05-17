const emailKey = (e) =>
  e.toLowerCase().replace(/\./g, "_dot_").replace(/@/g, "_at_");

module.exports = async function (req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { email, ownerUid } = req.body || {};
  if (!email || !ownerUid) return res.status(400).json({ error: "Missing email or ownerUid" });

  const docId = emailKey(email);
  const url = `https://firestore.googleapis.com/v1/projects/billveil/databases/default/documents/email_verifications/${docId}`;

  try {
    const resp = await fetch(url, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fields: {
          verified: { booleanValue: true },
          email: { stringValue: email },
          ownerUid: { stringValue: ownerUid },
          verifiedAt: { timestampValue: new Date().toISOString() },
        },
      }),
    });

    if (!resp.ok) {
      const err = await resp.json().catch(() => ({}));
      return res.status(500).json({ error: err.error?.message || "Firestore write failed" });
    }

    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
