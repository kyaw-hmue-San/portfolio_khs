import { useRef, type ReactNode } from "react";
import { motion, useInView } from "motion/react";
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
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef);
  return (
    <section id="education" ref={sectionRef} data-animate={inView} className="education-section px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="academic-layout">
          <Reveal className="academic-intro">
            <span className="education-label">{t("educationSection.label")}</span>
            <h2>{t("educationSection.title")}<br /><em>{t("educationSection.accent")}</em></h2>
            <p>{t("educationSection.intro")}</p>
          </Reveal>

          <ol className="academic-timeline" aria-label={t("educationSection.aria")}>
            {EDUCATION.map(({ icon: Icon, ...item }, index) => (
              <li key={item.degree} className={index === 0 ? "is-current" : undefined}>
                <span className="academic-node" aria-hidden="true"><Icon size={18} /></span>
                <Reveal delay={0.08 + index * 0.08}>
                  <article className="academic-entry">
                    <div className="academic-entry-top">
                      <span className="academic-period">{t(item.period)}</span>
                      <span className="academic-status">{t(item.eyebrow)}</span>
                    </div>
                    <h3>{t(item.focus)}</h3>
                    <p className="academic-degree">{t(item.degree)}</p>
                    <div className="academic-school">
                      <span>{t(item.school)}</span>
                      <span>{t(item.location)}</span>
                    </div>
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
