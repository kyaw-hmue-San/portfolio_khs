import { motion } from "motion/react";
import { CheckCircle2, Database, GitBranch, Layout, Server } from "lucide-react";

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

const PRINCIPLES = [
  "I start from the real workflow before choosing the UI or database shape.",
  "I prefer explicit data ownership over clever state that becomes hard to debug.",
  "I design interfaces around the person using the system, not around screenshots.",
  "I keep learning by turning unclear parts of a project into smaller, testable decisions.",
];

const SYSTEM_POINTS = [
  { Icon: GitBranch, label: "Flow", text: "Map the user action to backend state." },
  { Icon: Database, label: "Data", text: "Model relationships before screens grow." },
  { Icon: Server, label: "Runtime", text: "Keep config and deployment assumptions visible." },
  { Icon: Layout, label: "Interface", text: "Make repeated work fast and understandable." },
];

export function EngineeringPhilosophy() {
  return (
    <section id="about" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <Reveal>
          <div className="flex items-center gap-5 mb-14">
            <h2 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(2rem, 5vw, 2.8rem)",
              fontWeight: 700,
              color: "rgba(255,255,255,0.94)",
              lineHeight: 1.1,
              whiteSpace: "nowrap",
            }}>
              About <span style={{ color: "#f59e0b" }}>Me</span>
            </h2>
            <div className="h-px flex-1" style={{ background: "linear-gradient(90deg, rgba(245,158,11,0.35), transparent)" }} />
          </div>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.25fr] gap-10 lg:gap-16 items-center">
          <Reveal delay={0.05}>
            <div
              className="rounded-3xl p-6 relative overflow-hidden"
              style={{
                border: "1px solid rgba(245,158,11,0.16)",
                background: "radial-gradient(ellipse 85% 70% at 0% 0%, rgba(245,158,11,0.08), transparent 65%), rgba(255,255,255,0.02)",
                boxShadow: "0 28px 80px rgba(0,0,0,0.28)",
              }}
            >
              <div className="grid grid-cols-2 gap-3">
                {SYSTEM_POINTS.map(({ Icon, label, text }, index) => (
                  <motion.div
                    key={label}
                    initial={{ opacity: 0, y: 14 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.42, delay: 0.1 + index * 0.05 }}
                    className="rounded-2xl p-4 min-h-[130px]"
                    style={{ border: "1px solid rgba(255,255,255,0.07)", background: "rgba(0,0,0,0.16)" }}
                  >
                    <Icon size={18} style={{ color: "rgba(251,191,36,0.82)", marginBottom: "18px" }} />
                    <p style={{ fontFamily: "Inter, sans-serif", fontSize: "13px", fontWeight: 700, color: "rgba(255,255,255,0.82)", marginBottom: "6px" }}>
                      {label}
                    </p>
                    <p style={{ fontFamily: "Inter, sans-serif", fontSize: "12px", lineHeight: 1.55, color: "rgba(255,255,255,0.38)" }}>
                      {text}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.12}>
            <div className="flex flex-col gap-5">
              <SectionLabel>Engineering Philosophy</SectionLabel>
              <div>
                <h3 style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "clamp(2rem, 5vw, 3.1rem)",
                  fontWeight: 700,
                  color: "rgba(255,255,255,0.94)",
                  lineHeight: 1.1,
                  marginBottom: "8px",
                }}>
                  Kyaw Hmue San
                </h3>
                <p style={{ fontFamily: "Inter, sans-serif", fontSize: "15px", fontWeight: 650, color: "rgba(251,191,36,0.82)", marginBottom: "18px" }}>
                  Software Engineering Student · Chiang Rai, Thailand
                </p>
              </div>

              <p style={{ fontFamily: "Inter, sans-serif", fontSize: "15.5px", lineHeight: 1.82, color: "rgba(255,255,255,0.52)", maxWidth: "650px" }}>
                I approach software as a system of tradeoffs. Before building screens,
                I try to understand the workflow, the data that needs to stay reliable,
                and the failure cases that would make the product frustrating to use.
              </p>
              <p style={{ fontFamily: "Inter, sans-serif", fontSize: "15.5px", lineHeight: 1.82, color: "rgba(255,255,255,0.48)", maxWidth: "650px" }}>
                I care about maintainable boundaries: clear API contracts, thoughtful
                database relationships, predictable state, and interfaces that reduce
                repeated work for real users. My projects are where I practice turning
                messy requirements into smaller decisions I can test, explain, and improve.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {PRINCIPLES.map((item) => (
                  <div key={item} className="flex gap-3 items-start">
                    <CheckCircle2 size={15} style={{ color: "rgba(245,158,11,0.75)", flexShrink: 0, marginTop: "3px" }} />
                    <span style={{ fontFamily: "Inter, sans-serif", fontSize: "13.5px", lineHeight: 1.6, color: "rgba(255,255,255,0.46)" }}>
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
