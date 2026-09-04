import type { ReactNode } from "react";
import { motion } from "motion/react";
import { BookOpen, GraduationCap } from "lucide-react";

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
    eyebrow: "Current chapter",
    period: "2024 — Present",
    degree: "Bachelor of Engineering",
    focus: "Software Engineering",
    school: "Mae Fah Luang University",
    location: "Chiang Rai, Thailand",
  },
  {
    icon: BookOpen,
    eyebrow: "Foundation",
    period: "January 2024",
    degree: "GED Diploma",
    focus: "General Educational Development",
    school: "High school equivalency",
    location: "Completed",
  },
];

export function Education() {
  return (
    <section id="education" className="education-section px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="education-layout">
          <Reveal className="education-intro">
            <span className="education-label">Education</span>
            <h2>Learning,<br /><em>applied.</em></h2>
            <p>
              My academic path gives me the fundamentals. Building real
              software is how I make them stick.
            </p>
          </Reveal>

          <ol className="education-path" aria-label="Academic background">
            {EDUCATION.map(({ icon: Icon, ...item }, index) => (
              <li key={item.degree}>
                <Reveal delay={0.08 + index * 0.08}>
                  <article className="education-card">
                    <div className="education-card-topline">
                      <span className="education-card-icon"><Icon size={17} aria-hidden="true" /></span>
                      <span className="education-eyebrow">{item.eyebrow}</span>
                      <time>{item.period}</time>
                    </div>
                    <div className="education-card-copy">
                      <h3>{item.degree}</h3>
                      <p className="education-focus">{item.focus}</p>
                      <p className="education-meta">{item.school}<span aria-hidden="true">•</span>{item.location}</p>
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
