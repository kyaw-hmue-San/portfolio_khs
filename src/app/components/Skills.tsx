import { useContent, ContentStatus } from "../providers/ContentProvider";
import { useRef, useState, type CSSProperties, type MouseEvent, type ReactNode } from "react";
import { motion } from "motion/react";
import { useTranslation } from "react-i18next";

function Reveal({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.52, delay, ease: [0.21, 0.47, 0.32, 0.98] }} className={className}>
      {children}
    </motion.div>
  );
}


const LEARNING = [
  { title: "System Design", note: "Designing scalable services, boundaries, and reliable data flows." },
  { title: "Automated Testing", note: "Building confidence with focused unit, integration, and UI tests." },
  { title: "CI/CD", note: "Improving repeatable builds, checks, and production deployment workflows." },
  { title: "AI Integration & RAG", note: "Creating useful AI features grounded in trusted application data." },
];

function TechBoard() {
  const { t } = useTranslation();
  const { skills: TECH_KEYS } = useContent();
  const [activeId, setActiveId] = useState<string | null>(null);
  const active = TECH_KEYS.find(tech => tech.id === activeId) ?? TECH_KEYS[0];
  const boardRef = useRef<HTMLDivElement>(null);

  const moveBoard = (event: MouseEvent<HTMLDivElement>) => {
    const board = boardRef.current;
    if (!board || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const bounds = board.getBoundingClientRect();
    const pointerX = event.clientX - bounds.left;
    const pointerY = event.clientY - bounds.top;
    const normalizedX = pointerX / bounds.width - 0.5;
    const normalizedY = pointerY / bounds.height - 0.5;

    board.style.setProperty("--board-tilt-x", `${normalizedY * -3}deg`);
    board.style.setProperty("--board-tilt-y", `${normalizedX * 4}deg`);
    board.style.setProperty("--light-x", `${pointerX}px`);
    board.style.setProperty("--light-y", `${pointerY}px`);

    board.querySelectorAll<HTMLElement>(".tech-key").forEach((key) => {
      const keyBounds = key.getBoundingClientRect();
      const deltaX = event.clientX - (keyBounds.left + keyBounds.width / 2);
      const deltaY = event.clientY - (keyBounds.top + keyBounds.height / 2);
      const distance = Math.hypot(deltaX, deltaY);
      const strength = Math.max(0, 1 - distance / 170);
      key.style.setProperty("--magnet-x", `${deltaX * strength * 0.065}px`);
      key.style.setProperty("--magnet-y", `${deltaY * strength * 0.065}px`);
    });
  };

  const resetBoard = () => {
    const board = boardRef.current;
    if (!board) return;
    board.style.setProperty("--board-tilt-x", "0deg");
    board.style.setProperty("--board-tilt-y", "0deg");
    board.querySelectorAll<HTMLElement>(".tech-key").forEach((key) => {
      key.style.setProperty("--magnet-x", "0px");
      key.style.setProperty("--magnet-y", "0px");
    });
  };

  return (
    <div className="tech-board-shell" ref={boardRef} onMouseMove={moveBoard} onMouseLeave={resetBoard}>
      <p className="tech-board-hint">{t("skills.hint")}</p>
      <div className="tech-board-layout">
        <div className="tech-keyboard" aria-label={t("skills.toolkit")}>
          {TECH_KEYS.map((tech) => (
            <button
              key={tech.name}
              type="button"
              className={`tech-key ${active?.id === tech.id ? "is-selected" : ""}`}
              style={{ "--key-accent": tech.color } as CSSProperties}
              aria-label={`${tech.name}: ${tech.context}`}
              aria-pressed={active?.id === tech.id}
              onMouseEnter={() => setActiveId(tech.id)}
              onFocus={() => setActiveId(tech.id)}
              onClick={() => setActiveId(tech.id)}
            >
              <span className="tech-key-face">
                <img className="tech-key-icon" src={tech.icon || "/favicon.svg"} alt="" aria-hidden="true" />
                <span className="tech-key-name">{tech.name}</span>
              </span>
            </button>
          ))}
        </div>
        {active && <aside className="tech-info-panel" aria-live="polite">
          <span className="tech-info-icon" style={{ "--key-accent": active.color } as CSSProperties}>
            <img src={active.icon || "/favicon.svg"} alt="" aria-hidden="true" />
          </span>
          <div>
            <p className="tech-info-label">{t("skills.selected")}</p>
            <h3>{active.name}</h3>
            <p>{active.context}</p>
            <span>{active.projects}</span>
          </div>
        </aside>}
      </div>
    </div>
  );
}

function LearningCarousel() {
  const { t } = useTranslation();
  return (
    <div className="learning-orbit" aria-labelledby="learning-orbit-title">
      <div className="learning-orbit-heading">
        <span className="learning-orbit-status" aria-hidden="true" />
        <div>
          <h3 id="learning-orbit-title">{t("skills.learningTitle")}</h3>
          <p>{t("skills.learningSubtitle")}</p>
        </div>
      </div>
      <div className="learning-orbit-scene">
        <div className="learning-orbit-ring">
          {LEARNING.map((item, index) => (
            <article key={item.title} className="learning-orbit-card" tabIndex={0} style={{ "--card-angle": `${index * 90}deg` } as CSSProperties}>
              <span className="learning-orbit-number">0{index + 1}</span>
              <h4>{item.title}</h4>
              <p>{item.note}</p>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}

export function Skills() {
  const { t } = useTranslation();
  return (
    <section id="skills" className="py-24 sm:py-28 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <Reveal><header className="flex flex-col gap-3 mb-9"><span style={{ fontFamily: "var(--portfolio-font-sans)", fontSize: "11px", fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(245,158,11,0.65)" }}>{t("skills.label")}</span><h2 style={{ fontFamily: "var(--portfolio-font-display)", fontSize: "clamp(2rem, 5vw, 2.8rem)", fontWeight: 700, color: "var(--portfolio-text-strong)", lineHeight: 1.12 }}>{t("skills.title")}</h2><p style={{ fontFamily: "var(--portfolio-font-sans)", fontSize: "15px", color: "var(--portfolio-text-muted)", lineHeight: 1.7, maxWidth: "620px" }}>{t("skills.intro")}</p></header></Reveal>
        <ContentStatus /><Reveal delay={0.08}><TechBoard /></Reveal>
        <Reveal delay={0.16} className="mt-10"><LearningCarousel /></Reveal>
      </div>
    </section>
  );
}
