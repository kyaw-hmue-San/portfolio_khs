import { useRef, useState, type FormEvent } from "react";
import { Send } from "lucide-react";

export function InquiryForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [error, setError] = useState("");
  const sending = useRef(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sending.current) return;
    const form = event.currentTarget;
    const fields = Object.fromEntries(new FormData(form));
    sending.current = true;
    setStatus("sending");
    setError("");
    try {
      const base = (import.meta.env.VITE_CHAT_API_URL || "").replace(/\/$/, "");
      const response = await fetch(`${base}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fields),
        signal: AbortSignal.timeout(20000),
      });
      const result = await response.json();
      if (!response.ok || result.ok !== true) throw new Error(result.error || "Your message could not be sent. Please try again or email me directly.");
      form.reset();
      setStatus("success");
    } catch (error) {
      setError(error instanceof Error && error.name === "Error" ? error.message : "We couldn’t confirm delivery. Please try again later or email me directly.");
      setStatus("error");
    } finally { sending.current = false; }
  }

  return (
    <form className="inquiry-form" onSubmit={submit} aria-labelledby="inquiry-title" aria-busy={status === "sending"}>
      <h3 id="inquiry-title">Have a project in mind?</h3>
      <p className="inquiry-form-intro">Share your idea, an opportunity, or a question. I’d love to hear from you.</p>
      <div className="inquiry-fields">
        <label className="inquiry-field">
          <input name="name" autoComplete="name" placeholder=" " required maxLength={100} disabled={status === "sending"} />
          <span>Your name</span>
        </label>
        <label className="inquiry-field">
          <input name="email" type="email" autoComplete="email" placeholder=" " required maxLength={254} disabled={status === "sending"} />
          <span>Email address</span>
        </label>
        <label className="inquiry-field inquiry-field-wide">
          <input name="subject" placeholder=" " required maxLength={160} disabled={status === "sending"} />
          <span>Subject</span>
        </label>
        <label className="inquiry-field inquiry-field-wide">
          <textarea name="message" placeholder=" " required minLength={10} maxLength={5000} disabled={status === "sending"} />
          <span>Your message</span>
        </label>
      </div>
      <label className="inquiry-honeypot" aria-hidden="true">Leave this empty<input name="website" tabIndex={-1} autoComplete="off" /></label>
      <button className="inquiry-submit" type="submit" disabled={status === "sending"}><Send size={16} aria-hidden="true" />{status === "sending" ? "Sending…" : "Send Project Inquiry"}</button>
      <div className="inquiry-status" role="status" aria-live="polite">
        {status === "success" && "Your inquiry has been sent. Thank you for reaching out!"}
        {status === "error" && <>{error} <a href="mailto:kyawhmuesan@gmail.com">Email me directly</a></>}
      </div>
    </form>
  );
}
