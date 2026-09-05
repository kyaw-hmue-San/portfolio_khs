// Only the server can choose the recipient or access the delivery credential.
export async function deliverInquiry(body, { apiKey, from, to = "kyawhmuesan@gmail.com", fetchImpl = fetch } = {}) {
  if (!body || typeof body !== "object" || Array.isArray(body)) return { status: 400, body: { error: "Please complete all fields." } };
  if (body.website) return { status: 200, body: { ok: true } };
  const fields = {};
  for (const [key, max] of Object.entries({ name: 100, email: 254, subject: 160, message: 5000 })) {
    if (typeof body[key] !== "string" || !body[key].trim() || body[key].length > max) return { status: 400, body: { error: "Please complete all fields within the allowed lengths." } };
    fields[key] = body[key].trim();
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email) || /[\r\n]/.test(fields.name + fields.subject) || fields.message.length < 10) return { status: 400, body: { error: "Please enter a valid email and a message of at least 10 characters." } };
  if (!apiKey || !from) return { status: 503, body: { error: "The contact form is temporarily unavailable. Please email me directly." } };
  try {
    const response = await fetchImpl("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from, to: [to], reply_to: fields.email, subject: `Portfolio inquiry: ${fields.subject}`, text: `From: ${fields.name}\nEmail: ${fields.email}\n\n${fields.message}` }),
      signal: AbortSignal.timeout(15000),
    });
    const result = await response.json();
    if (!response.ok || !result.id) throw new Error("Delivery not confirmed");
    return { status: 200, body: { ok: true } };
  } catch {
    return { status: 502, body: { error: "We couldn’t confirm delivery. Please try again later or email me directly." } };
  }
}
