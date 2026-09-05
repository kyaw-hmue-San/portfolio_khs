import { motion } from "motion/react";
import { CheckCircle2, MapPin } from "lucide-react";
import { useTranslation } from "react-i18next";

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
      fontFamily: "var(--portfolio-font-sans)",
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

export function EngineeringPhilosophy() {
  const { t } = useTranslation();
  const principles = t("about.principles", { returnObjects: true }) as string[];
  return (
    <section id="about" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <Reveal>
          <div className="flex items-center gap-5 mb-14">
            <h2 style={{
              fontFamily: "var(--portfolio-font-display)",
              fontSize: "clamp(2rem, 5vw, 2.8rem)",
              fontWeight: 700,
              color: "var(--portfolio-text-strong)",
              lineHeight: 1.1,
              whiteSpace: "nowrap",
            }}>
              {t("about.title")} <span style={{ color: "#f59e0b" }}>{t("about.titleAccent")}</span>
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
                  alt={t("about.photoAlt")}
                  loading="lazy"
                  decoding="async"
                />
                <div className="about-portrait-glow" aria-hidden="true" />
                <figcaption className="about-portrait-caption">
                  <span><MapPin size={13} aria-hidden="true" /> {t("about.basedIn")}</span>
                  <strong>{t("about.location")}</strong>
                </figcaption>
              </div>
            </figure>
          </Reveal>

          <Reveal delay={0.12}>
            <div className="flex flex-col gap-5">
              <SectionLabel>{t("about.label")}</SectionLabel>
              <div>
                <h3 style={{
                  fontFamily: "var(--portfolio-font-display)",
                  fontSize: "clamp(2rem, 5vw, 3.1rem)",
                  fontWeight: 700,
                  color: "var(--portfolio-text-strong)",
                  lineHeight: 1.1,
                  marginBottom: "8px",
                }}>
                  {t("common.name")}
                </h3>
                <p style={{ fontFamily: "var(--portfolio-font-sans)", fontSize: "15px", fontWeight: 650, color: "var(--portfolio-amber-text)", marginBottom: "18px" }}>
                  {t("about.subtitle")}
                </p>
              </div>

              <p style={{ fontFamily: "var(--portfolio-font-sans)", fontSize: "15.5px", lineHeight: 1.82, color: "var(--portfolio-text-secondary)", maxWidth: "650px" }}>
                {t("about.paragraph1")}
              </p>
              <p style={{ fontFamily: "var(--portfolio-font-sans)", fontSize: "15.5px", lineHeight: 1.82, color: "var(--portfolio-text-muted)", maxWidth: "650px" }}>
                {t("about.paragraph2")}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {principles.map((item) => (
                  <div key={item} className="flex gap-3 items-start">
                    <CheckCircle2 size={15} style={{ color: "rgba(245,158,11,0.75)", flexShrink: 0, marginTop: "3px" }} />
                    <span style={{ fontFamily: "var(--portfolio-font-sans)", fontSize: "13.5px", lineHeight: 1.6, color: "var(--portfolio-text-muted)" }}>
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
