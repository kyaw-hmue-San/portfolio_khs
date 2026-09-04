import { motion } from "motion/react";
import { CheckCircle2, MapPin } from "lucide-react";

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
  "Understand the user's workflow before choosing the technology.",
  "Keep data models and API contracts clear and predictable.",
  "Build interfaces that make everyday tasks easier.",
  "Break unfamiliar problems into small steps I can test and improve.",
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

        <div className="about-philosophy-layout">
          <Reveal delay={0.05} className="about-portrait-reveal">
            <figure className="about-portrait">
              <div className="about-portrait-frame">
                <img
                  src="/about/kyaw-portrait.webp"
                  alt="Kyaw Hmue San relaxing outdoors in Chiang Rai"
                  loading="lazy"
                  decoding="async"
                />
                <div className="about-portrait-glow" aria-hidden="true" />
                <figcaption className="about-portrait-caption">
                  <span><MapPin size={13} aria-hidden="true" /> Based in</span>
                  <strong>Chiang Rai, Thailand</strong>
                </figcaption>
              </div>
            </figure>
          </Reveal>

          <Reveal delay={0.12}>
            <div className="flex flex-col gap-5">
              <SectionLabel>How I Build</SectionLabel>
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
                I enjoy building software that solves clear, practical problems. Before I
                start coding, I try to understand who will use the product, how information
                moves through it, and what could make the experience confusing.
              </p>
              <p style={{ fontFamily: "Inter, sans-serif", fontSize: "15.5px", lineHeight: 1.82, color: "rgba(255,255,255,0.48)", maxWidth: "650px" }}>
                I like working across both frontend and backend—from designing interfaces
                to shaping APIs and database models. Every project gives me a chance to turn
                an idea into useful features, learn from feedback, and improve how I build.
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
