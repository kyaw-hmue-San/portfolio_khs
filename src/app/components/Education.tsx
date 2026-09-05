import type { ReactNode } from "react";
import { motion } from "motion/react";
import { BookOpen, GraduationCap } from "lucide-react";
import { useTranslation } from "react-i18next";

function Reveal({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.52, delay, ease: [0.21, 0.47, 0.32, 0.98] }} className={className}>
      {children}
    </motion.div>
  );
}

const EDUCATION = [
  {
    icon: GraduationCap,
    eyebrow: "educationSection.current",
    period: "educationSection.currentPeriod",
    degree: "educationSection.degree",
    focus: "educationSection.focus",
    school: "educationSection.university",
    location: "educationSection.location",
  },
  {
    icon: BookOpen,
    eyebrow: "educationSection.foundation",
    period: "educationSection.gedPeriod",
    degree: "educationSection.ged",
    focus: "educationSection.gedFocus",
    school: "educationSection.equivalency",
    location: "educationSection.completed",
  },
];

export function Education() {
  const { t } = useTranslation();
  return (
    <section id="education" className="education-section px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="education-layout">
          <Reveal className="education-intro">
            <span className="education-label">{t("educationSection.label")}</span>
            <h2>{t("educationSection.title")}<br /><em>{t("educationSection.accent")}</em></h2>
            <p>{t("educationSection.intro")}</p>
          </Reveal>

          <ol className="education-path" aria-label={t("educationSection.aria")}>
            {EDUCATION.map(({ icon: Icon, ...item }, index) => (
              <li key={item.degree}>
                <Reveal delay={0.08 + index * 0.08}>
                  <article className="education-card">
                    <div className="education-card-topline">
                      <span className="education-card-icon"><Icon size={17} aria-hidden="true" /></span>
                      <span className="education-eyebrow">{t(item.eyebrow)}</span>
                      <time>{t(item.period)}</time>
                    </div>
                    <div className="education-card-copy">
                      <h3>{t(item.degree)}</h3>
                      <p className="education-focus">{t(item.focus)}</p>
                      <p className="education-meta">{t(item.school)}<span aria-hidden="true">•</span>{t(item.location)}</p>
                    </div>
                    <span className="education-index" aria-hidden="true">0{index + 1}</span>
                  </article>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
