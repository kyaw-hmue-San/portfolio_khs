import { useState } from "react";
import { motion } from "motion/react";
import { Mail, Github, Linkedin, Send, ArrowUpRight } from "lucide-react";

function Reveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.56, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span style={{
      fontFamily: "Inter, sans-serif",
      fontSize: "11px",
      fontWeight: 600,
      letterSpacing: "0.14em",
      textTransform: "uppercase",
      color: "rgba(245,158,11,0.65)",
    }}>
      {children}
    </span>
  );
}

const LINKS = [
  {
    Icon: Mail,
    label: "Email",
    value: "Available on request",
    sub: "Best way to reach me",
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.08)",
    border: "rgba(245,158,11,0.18)",
    textColor: "rgba(251,191,36,0.85)",
  },
  {
    Icon: Github,
    label: "GitHub",
    value: "Source shared selectively",
    sub: "Code & contributions",
    color: "rgba(255,255,255,0.7)",
    bg: "rgba(255,255,255,0.04)",
    border: "rgba(255,255,255,0.1)",
    textColor: "rgba(255,255,255,0.7)",
  },
  {
    Icon: Linkedin,
    label: "LinkedIn",
    value: "Profile link to add",
    sub: "Professional profile",
    color: "#3b82f6",
    bg: "rgba(59,130,246,0.08)",
    border: "rgba(59,130,246,0.2)",
    textColor: "rgba(147,197,253,0.85)",
  },
];

type FormState = "idle" | "success";

export function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<FormState>("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Demo form only; no real submission is sent.
    setStatus("success");
    setTimeout(() => {
      setStatus("idle");
      setForm({ name: "", email: "", message: "" });
    }, 3500);
  };

  return (
    <section id="contact" className="py-28 px-6">
      <div className="max-w-6xl mx-auto">

        <Reveal>
          <div className="flex flex-col gap-3 mb-14">
            <SectionLabel>Let's connect</SectionLabel>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2rem, 5vw, 2.8rem)", fontWeight: 700, color: "rgba(255,255,255,0.93)", lineHeight: 1.12 }}>
              Contact
            </h2>
            <p style={{ fontFamily: "Inter, sans-serif", fontSize: "15px", color: "rgba(255,255,255,0.42)", lineHeight: 1.7, maxWidth: "440px" }}>
              Have an opportunity, a project, or just want to talk engineering? I'd love to hear from you.
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">

          {/* Links */}
          <div className="lg:col-span-2 flex flex-col gap-3">
            {LINKS.map(({ Icon, label, value, sub, color, bg, border, textColor }, i) => (
              <Reveal key={label} delay={i * 0.07}>
                <a
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className="group flex items-center gap-4 rounded-2xl p-5 transition-all duration-200"
                  style={{ border: `1px solid ${border}`, background: bg }}
                  onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)"}
                  onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.transform = "translateY(0)"}
                >
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.07)" }}
                  >
                    <Icon size={19} style={{ color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p style={{ fontFamily: "Inter, sans-serif", fontSize: "10.5px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)", marginBottom: "2px" }}>
                      {label}
                    </p>
                    <p style={{ fontFamily: "Inter, sans-serif", fontSize: "14px", fontWeight: 500, color: textColor }}>
                      {value}
                    </p>
                    <p style={{ fontFamily: "Inter, sans-serif", fontSize: "11.5px", color: "rgba(255,255,255,0.25)" }}>
                      {sub}
                    </p>
                  </div>
                  <ArrowUpRight size={14} style={{ color: "rgba(255,255,255,0.2)", flexShrink: 0 }} className="group-hover:text-white/50 transition-colors" />
                </a>
              </Reveal>
            ))}

            <Reveal delay={0.24}>
              <div
                className="rounded-2xl p-5"
                style={{ border: "1px solid rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.02)" }}
              >
                <p style={{ fontFamily: "Inter, sans-serif", fontSize: "13px", lineHeight: 1.68, color: "rgba(255,255,255,0.35)", fontStyle: "italic" }}>
                  "I usually respond within 24 hours. Whether it's an
                  opportunity or a question about one of my projects, don't
                  hesitate to reach out."
                </p>
              </div>
            </Reveal>
          </div>

          {/* Form */}
          <Reveal delay={0.12} className="lg:col-span-3">
            <div
              className="rounded-2xl h-full"
              style={{ border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.02)" }}
            >
              <form onSubmit={handleSubmit} className="p-7 flex flex-col gap-5">
                <p style={{ fontFamily: "Inter, sans-serif", fontSize: "15px", fontWeight: 600, color: "rgba(255,255,255,0.82)" }}>
                  Send a message
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { key: "name", label: "Your name", placeholder: "Jane Smith", type: "text" },
                    { key: "email", label: "Your email", placeholder: "jane@company.com", type: "email" },
                  ].map(({ key, label, placeholder, type }) => (
                    <div key={key} className="flex flex-col gap-1.5">
                      <label style={{ fontFamily: "Inter, sans-serif", fontSize: "12px", fontWeight: 550, color: "rgba(255,255,255,0.35)" }}>
                        {label}
                      </label>
                      <input
                        required
                        type={type}
                        placeholder={placeholder}
                        value={(form as any)[key]}
                        onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                        className="w-full rounded-xl px-4 py-2.5 transition-all duration-200 focus:outline-none"
                        style={{
                          fontFamily: "Inter, sans-serif", fontSize: "14px",
                          background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
                          color: "rgba(255,255,255,0.8)",
                        }}
                        onFocus={(e) => {
                          e.currentTarget.style.borderColor = "rgba(245,158,11,0.35)";
                          e.currentTarget.style.background = "rgba(245,158,11,0.03)";
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                          e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                        }}
                      />
                    </div>
                  ))}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label style={{ fontFamily: "Inter, sans-serif", fontSize: "12px", fontWeight: 550, color: "rgba(255,255,255,0.35)" }}>
                    Message
                  </label>
                  <textarea
                    required
                    rows={6}
                    placeholder="Tell me about the opportunity, project, or just say hello..."
                    value={form.message}
                    onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                    className="w-full rounded-xl px-4 py-3 resize-none transition-all duration-200 focus:outline-none"
                    style={{
                      fontFamily: "Inter, sans-serif", fontSize: "14px", lineHeight: 1.6,
                      background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
                      color: "rgba(255,255,255,0.8)",
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = "rgba(245,158,11,0.35)";
                      e.currentTarget.style.background = "rgba(245,158,11,0.03)";
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                      e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                    }}
                  />
                </div>

                <div className="flex items-center gap-4">
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                    style={{
                      fontFamily: "Inter, sans-serif", fontSize: "14px", fontWeight: 600,
                      background: "linear-gradient(135deg, #f59e0b, #fcd34d)",
                      color: "#07090f",
                      boxShadow: "0 0 24px rgba(245,158,11,0.22)",
                    }}
                  >
                    <Send size={14} />
                    Send message
                  </button>

                  {status === "success" && (
                    <motion.span
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0 }}
                      style={{ fontFamily: "Inter, sans-serif", fontSize: "13px", color: "rgba(52,211,153,0.8)" }}
                    >
                      Sent. I'll be in touch.
                    </motion.span>
                  )}
                </div>

                <p style={{ fontFamily: "Inter, sans-serif", fontSize: "11.5px", color: "rgba(255,255,255,0.2)" }}>
                  This is a demo form. To contact me, please use the links on the left.
                </p>
              </form>
            </div>
          </Reveal>

        </div>
      </div>
    </section>
  );
}
