import { motion } from "motion/react";
import { Download, FileText, CheckCircle2 } from "lucide-react";

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.56, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
    >
      {children}
    </motion.div>
  );
}

const OPEN_TO = [
  "Full-stack internship roles",
  "Junior Software Engineer positions",
  "Remote or Thailand-based teams",
  "Teams working on real product workflows",
];

const RESUME_SECTIONS = ["Contact & links", "Education", "Technical skills", "Projects"];

export function Resume() {
  return (
    <section id="resume" className="py-28 px-6">
      <div className="max-w-6xl mx-auto">
        <Reveal>
          <div
            className="rounded-3xl relative overflow-hidden"
            style={{
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            {/* Background gradients */}
            <div style={{
              position: "absolute", inset: 0, pointerEvents: "none",
              background: "radial-gradient(ellipse 65% 80% at 100% 50%, rgba(245,158,11,0.06), transparent 65%), radial-gradient(ellipse 50% 50% at 0% 0%, rgba(16,185,129,0.04), transparent 60%), rgba(255,255,255,0.015)",
            }} />

            <div className="relative z-10 p-8 md:p-12 lg:p-16 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">

              {/* Left */}
              <div className="flex flex-col gap-7">
                <div>
                  <span style={{
                    display: "inline-flex", alignItems: "center", gap: "6px",
                    fontFamily: "Inter, sans-serif", fontSize: "11px", fontWeight: 600,
                    letterSpacing: "0.14em", textTransform: "uppercase",
                    color: "rgba(245,158,11,0.65)",
                    marginBottom: "16px",
                  }}>
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-60" />
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-amber-400" />
                    </span>
                    Open to opportunities
                  </span>

                  <h2 style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "clamp(1.8rem, 4vw, 2.6rem)",
                    fontWeight: 700,
                    color: "rgba(255,255,255,0.93)",
                    lineHeight: 1.15,
                    marginBottom: "12px",
                  }}>
                    Let's build something
                    <br />
                    <span style={{
                      fontStyle: "italic",
                      background: "linear-gradient(105deg, #f59e0b, #fcd34d)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}>
                      great together.
                    </span>
                  </h2>

                  <p style={{ fontFamily: "Inter, sans-serif", fontSize: "15px", lineHeight: 1.7, color: "rgba(255,255,255,0.44)" }}>
                    I'm actively looking for internships and junior roles where I can
                    work on maintainable systems, learn from experienced engineers,
                    and contribute with clear technical judgment.
                  </p>
                </div>

                <div className="flex flex-col gap-2.5">
                  {OPEN_TO.map((item) => (
                    <div key={item} className="flex items-center gap-3">
                      <CheckCircle2 size={14} style={{ color: "rgba(245,158,11,0.7)", flexShrink: 0 }} />
                      <span style={{ fontFamily: "Inter, sans-serif", fontSize: "14px", color: "rgba(255,255,255,0.52)" }}>
                        {item}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-1">
                  <a
                    href="#"
                    onClick={(e) => e.preventDefault()}
                    className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                    style={{
                      fontFamily: "Inter, sans-serif", fontSize: "14px", fontWeight: 600,
                      background: "linear-gradient(135deg, #f59e0b, #fcd34d)",
                      color: "#07090f",
                      boxShadow: "0 0 28px rgba(245,158,11,0.25), 0 4px 16px rgba(0,0,0,0.3)",
                    }}
                  >
                    <Download size={15} />
                    Download Resume
                  </a>
                  <a
                    href="#"
                    onClick={(e) => e.preventDefault()}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl transition-all duration-200 hover:border-white/16 hover:bg-white/[0.04]"
                    style={{
                      fontFamily: "Inter, sans-serif", fontSize: "14px", fontWeight: 500,
                      color: "rgba(255,255,255,0.5)", border: "1px solid rgba(255,255,255,0.1)",
                    }}
                  >
                    LinkedIn profile
                  </a>
                </div>
              </div>

              {/* Right: resume card preview */}
              <div className="flex items-center justify-center lg:justify-end">
                <div
                  className="w-full max-w-xs rounded-2xl overflow-hidden"
                  style={{
                    border: "1px solid rgba(255,255,255,0.1)",
                    background: "rgba(255,255,255,0.03)",
                    boxShadow: "0 32px 80px rgba(0,0,0,0.5)",
                  }}
                >
                  {/* Card header */}
                  <div className="px-6 py-5" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                    <div className="flex items-center gap-3 mb-4">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                        style={{ background: "rgba(245,158,11,0.12)", border: "1px solid rgba(245,158,11,0.2)" }}
                      >
                        <FileText size={18} style={{ color: "#f59e0b" }} />
                      </div>
                      <div>
                        <p style={{ fontFamily: "Inter, sans-serif", fontSize: "14px", fontWeight: 600, color: "rgba(255,255,255,0.85)" }}>
                          Kyaw Hmue San
                        </p>
                        <p style={{ fontFamily: "Inter, sans-serif", fontSize: "11.5px", color: "rgba(255,255,255,0.3)" }}>
                          Resume · PDF · 1 page
                        </p>
                      </div>
                    </div>
                    {/* Simulated text lines */}
                    <div className="flex flex-col gap-2">
                      {[80, 60, 70, 50].map((w, i) => (
                        <div key={i} className="h-[5px] rounded-full" style={{ width: `${w}%`, background: "rgba(255,255,255,0.07)" }} />
                      ))}
                    </div>
                  </div>

                  {/* Sections list */}
                  <div className="px-6 py-4 flex flex-col gap-2.5">
                    <p style={{ fontFamily: "Inter, sans-serif", fontSize: "10px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.2)", marginBottom: "2px" }}>
                      Includes
                    </p>
                    {RESUME_SECTIONS.map((s) => (
                      <div key={s} className="flex items-center gap-2.5">
                        <span className="w-1 h-1 rounded-full shrink-0" style={{ background: "rgba(245,158,11,0.6)" }} />
                        <span style={{ fontFamily: "Inter, sans-serif", fontSize: "13px", color: "rgba(255,255,255,0.42)" }}>
                          {s}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Footer */}
                  <div className="px-6 py-4" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                    <a
                      href="#"
                      onClick={(e) => e.preventDefault()}
                      className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl transition-all hover:scale-[1.02]"
                      style={{
                        fontFamily: "Inter, sans-serif", fontSize: "13px", fontWeight: 600,
                        background: "rgba(245,158,11,0.12)", border: "1px solid rgba(245,158,11,0.2)",
                        color: "rgba(251,191,36,0.8)",
                      }}
                    >
                      <Download size={13} />
                      Download PDF
                    </a>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
