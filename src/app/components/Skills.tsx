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

const TECH_KEYS = [
  { name: "React", icon: "/tech_svgs/react.svg", color: "#61dafb", context: "Web interfaces and application state", projects: "Ahnyar House · E-Learning System" },
  { name: "TypeScript", icon: "/tech_svgs/typescript.svg", color: "#3178c6", context: "Primary language across full-stack and mobile work", projects: "Ahnyar House · CosmicCraft · Anchor Mobile" },
  { name: "JavaScript", icon: "/tech_svgs/javascript.svg", color: "#f7df1e", context: "Interactive web foundations and application logic", projects: "Portfolio and web projects" },
  { name: "Next.js", icon: "/tech_svgs/nextjs.svg", color: "#f5f5f5", context: "Full-stack React applications and routed experiences", projects: "CosmicCraft" },
  { name: "Node.js", icon: "/tech_svgs/nodejs.svg", color: "#68a063", context: "Server-side JavaScript services and tooling", projects: "Full-stack applications" },
  { name: "Express", icon: "/tech_svgs/express.svg", color: "#d1d5db", context: "REST APIs, middleware, and backend routing", projects: "Ahnyar House" },
  { name: "PostgreSQL", icon: "/tech_svgs/postgresql.svg", color: "#4f8fca", context: "Relational modeling and production data", projects: "Ahnyar House" },
  { name: "MongoDB", icon: "/tech_svgs/mongodb.svg", color: "#47a248", context: "Document data for flexible application features", projects: "CosmicCraft" },
  { name: "Java", icon: "/tech_svgs/java.svg", color: "#ed8b00", context: "Object-oriented development and backend coursework", projects: "E-Learning System" },
  { name: "Spring Boot", icon: "/tech_svgs/springboot.svg", color: "#6db33f", context: "Structured Java services and REST APIs", projects: "E-Learning System" },
  { name: "Tailwind CSS", icon: "/tech_svgs/tailwindcss.svg", color: "#38bdf8", context: "Responsive interfaces and reusable visual systems", projects: "Web applications" },
  { name: "React Native", icon: "/tech_svgs/reactnative.svg", color: "#61dafb", context: "Cross-platform mobile application development", projects: "Anchor Mobile" },
  { name: "GitHub", icon: "/tech_svgs/github.svg", color: "#f3f4f6", context: "Version control, collaboration, and project delivery", projects: "Across my development workflow" },
  { name: "Docker", icon: "/tech_svgs/docker.svg", color: "#2496ed", context: "Consistent environments and deployment preparation", projects: "E-Learning System" },
  { name: "QGIS", icon: "/tech_svgs/qgis.svg", color: "#93b023", context: "Map design, spatial data preparation, and analysis", projects: "Geospatial work · maps coming soon" },
  { name: "SQL", icon: "/tech_svgs/sql.svg", color: "#60a5fa", context: "Queries, relational thinking, and data exploration", projects: "Ahnyar House · E-Learning System" },
];

const LEARNING = [
  { title: "System Design", note: "Designing scalable services, boundaries, and reliable data flows." },
  { title: "Automated Testing", note: "Building confidence with focused unit, integration, and UI tests." },
  { title: "CI/CD", note: "Improving repeatable builds, checks, and production deployment workflows." },
  { title: "AI Integration & RAG", note: "Creating useful AI features grounded in trusted application data." },
];

function TechBoard() {
  const { t } = useTranslation();
  const [active, setActive] = useState(TECH_KEYS[0]);
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
              className={`tech-key ${active.name === tech.name ? "is-selected" : ""}`}
              style={{ "--key-accent": tech.color } as CSSProperties}
              aria-label={`${tech.name}: ${tech.context}`}
              aria-pressed={active.name === tech.name}
              onMouseEnter={() => setActive(tech)}
              onFocus={() => setActive(tech)}
              onClick={() => setActive(tech)}
            >
              <span className="tech-key-face">
                <img className="tech-key-icon" src={tech.icon} alt="" aria-hidden="true" />
                <span className="tech-key-name">{tech.name}</span>
              </span>
            </button>
          ))}
        </div>
        <aside className="tech-info-panel" aria-live="polite">
          <span className="tech-info-icon" style={{ "--key-accent": active.color } as CSSProperties}>
            <img src={active.icon} alt="" aria-hidden="true" />
          </span>
          <div>
            <p className="tech-info-label">{t("skills.selected")}</p>
            <h3>{active.name}</h3>
            <p>{active.context}</p>
            <span>{active.projects}</span>
          </div>
        </aside>
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
        <Reveal delay={0.08}><TechBoard /></Reveal>
        <Reveal delay={0.16} className="mt-10"><LearningCarousel /></Reveal>
      </div>
    </section>
  );
}
