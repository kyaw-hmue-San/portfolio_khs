import { useContent, ContentStatus } from "../providers/ContentProvider";
import { useEffect, useMemo, useRef, useState } from "react";
import type { ElementType, ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useTranslation } from "react-i18next";
import {
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Github,
  GraduationCap,
  Layers,
  LockKeyhole,
  Rocket,
  Smartphone,
  X,
} from "lucide-react";

type Accent = "amber" | "emerald" | "blue" | "violet";

interface Project {
  id: string;
  title: string;
  category: string;
  summary: string;
  stack: string[];
  sections: {
    overview: string;
    problem: string;
    solution: string;
    architecture: string;
    decisions: string[];
    challenges: string[];
    contribution: string;
    learned: string;
    visuals: string[];
  };
  accent: Accent;
  icon: ElementType;
  featured?: boolean;
  coverImage?: string;
  coverAlt?: string;
  demoUrl?: string;
  sourceUrl?: string;
}
const PROJECT_ICONS = { Layers, Rocket, GraduationCap, Smartphone };

const ACCENT = {
  amber: {
    border: "rgba(245,158,11,0.18)",
    glow: "rgba(245,158,11,0.07)",
    tag: { bg: "rgba(245,158,11,0.1)", border: "rgba(245,158,11,0.18)", color: "var(--portfolio-amber-text)" },
    dot: "#f59e0b",
    icon: "rgba(245,158,11,0.9)",
    iconBg: "rgba(245,158,11,0.1)",
  },
  emerald: {
    border: "rgba(16,185,129,0.18)",
    glow: "rgba(16,185,129,0.06)",
    tag: { bg: "rgba(16,185,129,0.1)", border: "rgba(16,185,129,0.18)", color: "var(--portfolio-green-text)" },
    dot: "#10b981",
    icon: "var(--portfolio-green-text)",
    iconBg: "rgba(16,185,129,0.1)",
  },
  blue: {
    border: "rgba(59,130,246,0.18)",
    glow: "rgba(59,130,246,0.06)",
    tag: { bg: "rgba(59,130,246,0.1)", border: "rgba(59,130,246,0.18)", color: "var(--portfolio-blue-text)" },
    dot: "#3b82f6",
    icon: "var(--portfolio-blue-text)",
    iconBg: "rgba(59,130,246,0.1)",
  },
  violet: {
    border: "rgba(139,92,246,0.18)",
    glow: "rgba(139,92,246,0.06)",
    tag: { bg: "rgba(139,92,246,0.1)", border: "rgba(139,92,246,0.18)", color: "var(--portfolio-purple-text)" },
    dot: "#8b5cf6",
    icon: "var(--portfolio-purple-text)",
    iconBg: "rgba(139,92,246,0.1)",
  },
};

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return isMobile;
}

function TypewriterText({ text }: { text: string }) {
  const reduceMotion = useReducedMotion();
  const [shown, setShown] = useState(text);

  useEffect(() => {
    if (reduceMotion) {
      setShown(text);
      return;
    }

    setShown("");
    let index = 0;
    const timer = window.setInterval(() => {
      index += 1;
      setShown(text.slice(0, index));
      if (index >= text.length) window.clearInterval(timer);
    }, 16);

    return () => window.clearInterval(timer);
  }, [text, reduceMotion]);

  return <>{shown}</>;
}

function SectionLabel({ children }: { children: ReactNode }) {
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

function Reveal({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) {
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

function ProjectActions({ project }: { project: Project }) {
  const { t } = useTranslation();
  const actionClass = "inline-flex items-center gap-1.5 px-3 py-2 rounded-lg transition-all";
  const actionStyle = {
    fontFamily: "var(--portfolio-font-sans)",
    fontSize: "12.5px",
    border: "1px solid rgb(var(--portfolio-ink-rgb) / 0.08)",
  };

  return (
    <div className="flex flex-wrap gap-2">
      {project.sourceUrl ? (
        <a
          href={project.sourceUrl}
          onClick={(e) => e.stopPropagation()}
          target="_blank"
          rel="noreferrer"
          className={`${actionClass} portfolio-subtle-button`}
          style={{ ...actionStyle, color: "var(--portfolio-text-secondary)" }}
        >
          <Github size={13} /> GitHub
        </a>
      ) : (
        <span
          className="inline-flex items-center gap-1.5 px-2 py-2"
          style={{ fontFamily: "var(--portfolio-font-sans)", fontSize: "11.5px", color: "var(--portfolio-text-muted)" }}
        >
          <LockKeyhole size={12} /> {t("projects.private")}
        </span>
      )}
      {project.demoUrl && (
        <a
          href={project.demoUrl}
          onClick={(e) => e.stopPropagation()}
          target="_blank"
          rel="noreferrer"
          className={`${actionClass} portfolio-subtle-button`}
          style={{ ...actionStyle, color: "var(--portfolio-text-secondary)" }}
        >
          <ExternalLink size={13} /> {t("projects.liveDemo")}
        </a>
      )}
    </div>
  );
}

function ProjectCard({
  project,
  delay,
  onOpen,
}: {
  project: Project;
  delay: number;
  onOpen: () => void;
}) {
  const { t } = useTranslation();
  const a = ACCENT[project.accent];
  const Icon = project.icon;

  return (
    <Reveal delay={delay} className="h-full">
      <button
        type="button"
        onClick={onOpen}
        className="project-card group text-left rounded-2xl h-full w-full transition-all duration-300 hover:-translate-y-0.5 focus:outline-none"
        style={{
          border: `1px solid ${project.featured ? a.border : "rgb(var(--portfolio-ink-rgb) / 0.07)"}`,
          background: `radial-gradient(ellipse 85% 55% at 0% 0%, ${project.featured ? a.glow : "transparent"}, transparent 62%), rgb(var(--portfolio-ink-rgb) / 0.02)`,
        }}
      >
        <div className="p-4 sm:p-6 flex flex-col gap-4 sm:gap-5 h-full">
          <div
            className={`project-card-visual ${project.coverImage ? "has-cover" : ""}`}
            style={{
              background: `radial-gradient(circle at 50% 42%, ${a.glow}, transparent 62%), rgb(var(--portfolio-ink-rgb) / 0.018)`,
              borderColor: project.featured ? a.border : "rgb(var(--portfolio-ink-rgb) / 0.07)",
            }}
          >
            <div className="project-card-mark">
              <span style={{ background: a.iconBg, borderColor: a.border }}>
                <Icon size={27} style={{ color: a.icon }} />
              </span>
              <p>{project.title}</p>
              {project.coverImage && <small>{t("projects.hoverPreview")}</small>}
            </div>
            {project.coverImage && (
              <img
                className="project-card-image"
                src={project.coverImage}
                alt={project.coverAlt ?? `${project.title} preview`}
                loading="lazy"
              />
            )}
          </div>

          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <span
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: a.iconBg, border: `1px solid ${a.border}` }}
              >
                <Icon size={18} style={{ color: a.icon }} />
              </span>
              <div className="min-w-0">
                <p style={{
                  fontFamily: "var(--portfolio-font-sans)",
                  fontSize: "10.5px",
                  fontWeight: 650,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "var(--portfolio-text-muted)",
                }}>
                  {project.category}
                </p>
                <h3
                  className="project-card-title mt-1 transition-colors"
                  style={{
                    fontFamily: "var(--portfolio-font-sans)",
                    fontSize: "17px",
                    fontWeight: 650,
                    color: "var(--portfolio-text-strong)",
                    lineHeight: 1.25,
                  }}
                >
                  {project.title}
                </h3>
              </div>
            </div>
            <ArrowUpRight
              size={16}
              className="shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              style={{ color: "var(--portfolio-text-muted)" }}
            />
          </div>

          <p className="project-card-summary" style={{
            fontFamily: "var(--portfolio-font-sans)",
            fontSize: "13.5px",
            lineHeight: 1.65,
            color: "var(--portfolio-text-muted)",
          }}>
            {project.summary}
          </p>

          <div className="flex flex-wrap gap-1.5 mt-auto">
            {project.stack.slice(0, 5).map((tech) => (
              <span
                key={tech}
                style={{
                  fontFamily: "var(--portfolio-font-sans)",
                  fontSize: "11px",
                  fontWeight: 500,
                  background: a.tag.bg,
                  border: `1px solid ${a.tag.border}`,
                  color: a.tag.color,
                  borderRadius: "6px",
                  padding: "3px 8px",
                }}
              >
                {tech}
              </span>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-1">
            <ProjectActions project={project} />
            <span
              className="project-card-case-link inline-flex transition-colors"
              style={{
                fontFamily: "var(--portfolio-font-sans)",
                fontSize: "12.5px",
                fontWeight: 600,
                color: "var(--portfolio-text-muted)",
              }}
            >
              {t("projects.readCaseStudy")}
            </span>
          </div>
        </div>
      </button>
    </Reveal>
  );
}

function DetailBlock({
  title,
  children,
  index,
}: {
  title: string;
  children: ReactNode;
  index: number;
}) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.section
      initial={reduceMotion ? false : { opacity: 0, y: 12 }}
      animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      transition={{ duration: 0.32, delay: index * 0.035 }}
      className="rounded-2xl p-5"
      style={{
        border: "1px solid rgb(var(--portfolio-ink-rgb) / 0.07)",
        background: "rgb(var(--portfolio-ink-rgb) / 0.025)",
      }}
    >
      <h4 style={{
        fontFamily: "var(--portfolio-font-sans)",
        fontSize: "11px",
        fontWeight: 700,
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        color: "var(--portfolio-text-muted)",
        marginBottom: "10px",
      }}>
        {title}
      </h4>
      <div style={{
        fontFamily: "var(--portfolio-font-sans)",
        fontSize: "14px",
        lineHeight: 1.72,
        color: "var(--portfolio-text-secondary)",
      }}>
        {children}
      </div>
    </motion.section>
  );
}

function CaseStudyContent({ project }: { project: Project }) {
  const { t } = useTranslation();
  const a = ACCENT[project.accent];
  const Icon = project.icon;

  const blocks = useMemo(() => [
    {
      title: t("projects.problem"),
      content: <p>{project.sections.problem}</p>,
    },
    {
      title: t("projects.role"),
      content: <p>{project.sections.contribution}</p>,
    },
    {
      title: t("projects.architecture"),
      content: <p>{project.sections.architecture}</p>,
    },
    {
      title: t("projects.outcome"),
      content: <p>{project.sections.solution}</p>,
    },
  ], [project, t]);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-start gap-4">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: a.iconBg, border: `1px solid ${a.border}` }}
        >
          <Icon size={20} style={{ color: a.icon }} />
        </div>
        <div>
          <p style={{
            fontFamily: "var(--portfolio-font-sans)",
            fontSize: "11px",
            fontWeight: 650,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "var(--portfolio-text-muted)",
            marginBottom: "8px",
          }}>
            {project.category}
          </p>
          <h3 style={{
            fontFamily: "var(--portfolio-font-display)",
            fontSize: "clamp(1.8rem, 5vw, 2.6rem)",
            fontWeight: 700,
            color: "var(--portfolio-text-strong)",
            lineHeight: 1.12,
          }}>
            <TypewriterText text={project.title} />
          </h3>
        </div>
      </div>

      <p style={{
        fontFamily: "var(--portfolio-font-sans)",
        fontSize: "15px",
        lineHeight: 1.75,
        color: "var(--portfolio-text-secondary)",
        maxWidth: "680px",
      }}>
        {project.summary}
      </p>

      <div className="flex flex-col gap-3 pb-1">
        <div className="flex flex-wrap gap-2">
          {project.stack.map((tech) => (
            <span
              key={tech}
              style={{
                fontFamily: "var(--portfolio-font-sans)",
                fontSize: "11.5px",
                fontWeight: 550,
                background: a.tag.bg,
                border: `1px solid ${a.tag.border}`,
                color: a.tag.color,
                borderRadius: "7px",
                padding: "4px 9px",
              }}
            >
              {tech}
            </span>
          ))}
        </div>
        <ProjectActions project={project} />
      </div>

      {blocks.map((block, index) => (
        <DetailBlock key={`${project.id}-${block.title}`} title={`${index + 1}. ${block.title}`} index={index}>
          {block.content}
        </DetailBlock>
      ))}
    </div>
  );
}

function CaseStudyPanel({
  projects,
  open,
  selected,
  onSelect,
  onClose,
}: {
  projects: Project[];
  open: boolean;
  selected: Project;
  onSelect: (project: Project) => void;
  onClose: () => void;
}) {
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  const reduceMotion = useReducedMotion();

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[80]"
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={reduceMotion ? undefined : { opacity: 0 }}
        >
          <button
            type="button"
            aria-label={t("projects.close")}
            onClick={onClose}
            className="absolute inset-0 w-full h-full cursor-default"
            style={{ background: "rgba(0,0,0,0.48)", backdropFilter: "blur(5px)" }}
          />

          <motion.aside
            role="dialog"
            aria-modal="true"
            drag={isMobile ? "y" : false}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={0.08}
            onDragEnd={(_, info) => {
              if (isMobile && info.offset.y > 120) onClose();
            }}
            initial={reduceMotion ? false : isMobile ? { y: "100%" } : { x: "100%" }}
            animate={isMobile ? { y: 0 } : { x: 0 }}
            exit={reduceMotion ? undefined : isMobile ? { y: "100%" } : { x: "100%" }}
            transition={{ duration: 0.34, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="absolute inset-x-2 bottom-2 h-[min(88dvh,760px)] rounded-2xl md:rounded-none md:inset-y-0 md:right-0 md:left-auto md:w-[min(860px,72vw)] md:h-auto overflow-hidden"
            style={{
              background: "var(--portfolio-panel-bg)",
              borderLeft: isMobile ? "none" : "1px solid rgb(var(--portfolio-ink-rgb) / 0.08)",
              boxShadow: "0 32px 90px rgba(0,0,0,0.55)",
            }}
          >
            <div className="h-full grid grid-cols-1 md:grid-cols-[230px_minmax(0,1fr)]">
              <div
                className="hidden md:flex flex-col gap-3 p-5"
                style={{ borderRight: "1px solid rgb(var(--portfolio-ink-rgb) / 0.06)" }}
              >
                <p style={{
                  fontFamily: "var(--portfolio-font-sans)",
                  fontSize: "10.5px",
                  fontWeight: 700,
                  letterSpacing: "0.13em",
                  textTransform: "uppercase",
                  color: "var(--portfolio-text-muted)",
                }}>
                  {t("projects.caseStudies")}
                </p>
                {projects.map((project) => {
                  const active = project.id === selected.id;
                  const a = ACCENT[project.accent];
                  return (
                    <button
                      key={project.id}
                      type="button"
                      onClick={() => onSelect(project)}
                      className="text-left rounded-xl p-3 transition-all"
                      style={{
                        border: active ? `1px solid ${a.border}` : "1px solid rgb(var(--portfolio-ink-rgb) / 0.06)",
                        background: active ? a.tag.bg : "rgb(var(--portfolio-ink-rgb) / 0.015)",
                      }}
                    >
                      <span style={{
                        display: "block",
                        fontFamily: "var(--portfolio-font-sans)",
                        fontSize: "10px",
                        fontWeight: 650,
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        color: active ? a.tag.color : "var(--portfolio-text-faint)",
                        marginBottom: "5px",
                      }}>
                        {project.category}
                      </span>
                      <span style={{
                        display: "block",
                        fontFamily: "var(--portfolio-font-sans)",
                        fontSize: "13px",
                        fontWeight: 600,
                        lineHeight: 1.35,
                        color: active ? "var(--portfolio-text-strong)" : "var(--portfolio-text-secondary)",
                      }}>
                        {project.title}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="min-h-0 flex flex-col">
                <div
                  className="flex items-center justify-between gap-3 p-4 md:p-5"
                  style={{ borderBottom: "1px solid rgb(var(--portfolio-ink-rgb) / 0.06)" }}
                >
                  <span className="md:hidden" style={{ fontFamily: "var(--portfolio-font-sans)", fontSize: "11px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--portfolio-text-muted)" }}>
                    {t("projects.mobileTitle")}
                  </span>
                  <span className="hidden md:block" style={{
                    fontFamily: "var(--portfolio-font-sans)",
                    fontSize: "11px",
                    color: "var(--portfolio-text-muted)",
                  }}>
                    {t("projects.panelHint")}
                  </span>
                  <button
                    type="button"
                    onClick={onClose}
                    className="portfolio-icon-button w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-colors"
                    style={{ border: "1px solid rgb(var(--portfolio-ink-rgb) / 0.08)", color: "var(--portfolio-text-secondary)" }}
                    aria-label={t("projects.close")}
                  >
                    <X size={16} />
                  </button>
                </div>

                <div className="overflow-y-auto p-4 sm:p-5 md:p-8">
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                      key={selected.id}
                      initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={reduceMotion ? undefined : { opacity: 0, y: -8 }}
                      transition={{ duration: 0.22 }}
                    >
                      <CaseStudyContent project={selected} />
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function Projects() {
  const { t } = useTranslation();
  const { projects: content, loading, error } = useContent();
  const PROJECTS = useMemo<Project[]>(() => content.map(project => ({ ...project, icon: PROJECT_ICONS[project.icon] || Layers })), [content]);
  const [selected, setSelected] = useState<Project | null>(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const [selectedSlide, setSelectedSlide] = useState(0);
  const viewportRef = useRef<HTMLDivElement>(null);
  const interactionUntil = useRef(0);
  const reduceMotion = useReducedMotion();

  const pauseForInteraction = () => { interactionUntil.current = performance.now() + 3000; };
  const goToSlide = (index: number) => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const slides = viewport.querySelectorAll<HTMLElement>(".project-carousel-slide");
    const slide = slides[(index + slides.length) % slides.length];
    if (!slide) return;
    pauseForInteraction();
    viewport.scrollTo({ left: viewport.scrollLeft + slide.getBoundingClientRect().left - viewport.getBoundingClientRect().left, behavior: reduceMotion ? "instant" : "smooth" });
  };

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    let frame = 0;
    let previous = 0;
    let position = viewport.scrollLeft;
    let direction = 1;
    let visible = false;
    let interacting = false;
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; });
    observer.observe(viewport);
    const pointerDown = () => { interacting = true; };
    const pointerUp = () => { interacting = false; pauseForInteraction(); };
    const syncSlide = () => {
      const slides = Array.from(viewport.querySelectorAll<HTMLElement>(".project-carousel-slide"));
      const center = viewport.getBoundingClientRect().left + viewport.clientWidth / 2;
      const distance = (slide: HTMLElement) => Math.abs(slide.getBoundingClientRect().left + slide.clientWidth / 2 - center);
      let nearest = 0;
      slides.forEach((slide, index) => {
        if (distance(slide) < distance(slides[nearest])) nearest = index;
      });
      setSelectedSlide(nearest);
    };
    const tick = (now: number) => {
      const elapsed = previous ? Math.min(now - previous, 50) : 0;
      previous = now;
      const paused = reduceMotion || panelOpen || !visible || document.hidden || interacting
        || viewport.matches(":hover") || viewport.contains(document.activeElement) || now < interactionUntil.current;
      if (!paused) {
        const max = viewport.scrollWidth - viewport.clientWidth;
        if (max > 0) {
          position = Math.max(0, Math.min(max, position + direction * elapsed * 0.035));
          viewport.scrollLeft = position;
          if (position >= max || position <= 0) { direction *= -1; interactionUntil.current = now + 1200; }
        }
      } else position = viewport.scrollLeft;
      frame = requestAnimationFrame(tick);
    };
    viewport.addEventListener("scroll", syncSlide, { passive: true });
    viewport.addEventListener("wheel", pauseForInteraction, { passive: true });
    viewport.addEventListener("pointerdown", pointerDown);
    window.addEventListener("pointerup", pointerUp);
    window.addEventListener("pointercancel", pointerUp);
    syncSlide();
    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      viewport.removeEventListener("scroll", syncSlide);
      viewport.removeEventListener("wheel", pauseForInteraction);
      viewport.removeEventListener("pointerdown", pointerDown);
      window.removeEventListener("pointerup", pointerUp);
      window.removeEventListener("pointercancel", pointerUp);
    };
  }, [PROJECTS.length, reduceMotion, panelOpen]);

  const openProject = (project: Project) => {
    setSelected(project);
    setPanelOpen(true);
  };

  return (
    <section id="projects" className="py-24 sm:py-28 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <Reveal>
          <div className="flex flex-col gap-3 mb-10 sm:mb-14">
            <SectionLabel>{t("projects.label")}</SectionLabel>
            <h2 style={{
              fontFamily: "var(--portfolio-font-display)",
              fontSize: "clamp(2rem, 5vw, 2.8rem)",
              fontWeight: 700,
              color: "var(--portfolio-text-strong)",
              lineHeight: 1.12,
            }}>
              {t("projects.title")}
            </h2>
            <p style={{
              fontFamily: "var(--portfolio-font-sans)",
              fontSize: "15px",
              color: "var(--portfolio-text-muted)",
              lineHeight: 1.7,
              maxWidth: "560px",
            }}>
              {t("projects.intro")}
            </p>
          </div>
        </Reveal>

        <ContentStatus />
        {!loading && !error && PROJECTS.length === 0 && <p style={{ color: "var(--portfolio-text-muted)" }}>New projects are on the way.</p>}
        {PROJECTS.length > 0 && <div className="project-carousel" role="region" aria-roledescription="carousel" aria-label={t("projects.title")}>
          <div className="project-carousel-viewport" ref={viewportRef} tabIndex={0} aria-label="Scroll projects horizontally">
            <div className="project-carousel-track">
              {PROJECTS.map((project, index) => (
                <div
                  className={`project-carousel-slide ${selectedSlide === index ? "is-active" : ""}`}
                  key={project.id}
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`${index + 1} of ${PROJECTS.length}: ${project.title}`}
                >
                  <ProjectCard project={project} delay={0.04 * index} onOpen={() => openProject(project)} />
                </div>
              ))}
            </div>
          </div>

          <div className="project-carousel-controls">
            <button type="button" className="project-carousel-arrow" onClick={() => goToSlide(selectedSlide - 1)} aria-label={t("projects.previous")}>
              <ChevronLeft size={17} aria-hidden="true" />
            </button>
            <div className="project-carousel-dots" aria-label={t("projects.choose")}>
              {PROJECTS.map((project, index) => (
                <button
                  key={project.id}
                  type="button"
                  className={`project-carousel-dot ${selectedSlide === index ? "is-active" : ""}`}
                  onClick={() => goToSlide(index)}
                  aria-label={`Show ${project.title}`}
                  aria-current={selectedSlide === index ? "true" : undefined}
                />
              ))}
            </div>
            <button type="button" className="project-carousel-arrow" onClick={() => goToSlide(selectedSlide + 1)} aria-label={t("projects.next")}>
              <ChevronRight size={17} aria-hidden="true" />
            </button>
          </div>
        </div>}

      </div>

      {selected && <CaseStudyPanel
        projects={PROJECTS}
        open={panelOpen}
        selected={selected}
        onSelect={setSelected}
        onClose={() => setPanelOpen(false)}
      />}
    </section>
  );
}
