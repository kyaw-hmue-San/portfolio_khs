import { useCallback, useEffect, useMemo, useState } from "react";
import type { ElementType, ReactNode } from "react";
import useEmblaCarousel from "embla-carousel-react";
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
const PROJECTS: Project[] = [
  {
    id: "ahnyar-house",
    title: "Ahnyar House Restaurant Ordering System",
    category: "Main Full-Stack Restaurant Project",
    summary:
      "A restaurant operations system that connects QR ordering, admin order handling, stock, receipts, and deployment into one order lifecycle.",
    stack: ["React", "TypeScript", "Express", "PostgreSQL", "Prisma", "DigitalOcean"],
    sections: {
      overview:
        "Ahnyar House is my main engineering case study. I designed it as an operational system where customer ordering, admin handling, inventory context, and receipt output all depend on the same backend state.",
      problem:
        "Manual restaurant ordering creates duplicated work: staff repeat customer orders, admins re-check details, and stock visibility can drift from actual demand. The project needed a single source of truth for the order lifecycle.",
      solution:
        "The system separates customer-facing QR ordering from private admin workflows while keeping both sides connected through typed API boundaries and a relational data model.",
      architecture:
        "Customer screens send order intent through the frontend API layer, Express validates and persists the request, Prisma maps relational entities in PostgreSQL, and admin views consume the same order state for operational follow-up. Deployment preparation targets DigitalOcean with clearer environment and runtime separation.",
      decisions: [
        "Modeled orders, menu items, stock, settings, and receipt data as connected backend concerns instead of isolated UI states.",
        "Separated public customer routes from private admin assumptions to reduce accidental operational risk.",
        "Used TypeScript contracts and validation patterns to keep frontend state aligned with backend persistence.",
        "Included DigitalOcean deployment planning to force production-aware configuration instead of local-only assumptions.",
      ],
      challenges: [
        "Keeping the customer flow simple while preserving enough state for admin order review.",
        "Designing data relationships that support receipts, stock context, and future operational changes.",
        "Presenting the project publicly without allowing a live demo to create real restaurant orders.",
      ],
      contribution:
        "I owned the frontend flows, Express API design, Prisma/PostgreSQL modeling, authentication assumptions, deployment preparation, and public case-study presentation.",
      learned:
        "The main lesson was to reason from business process first. UI quality matters, but the system only feels reliable when state ownership, permissions, database relationships, and deployment constraints are coherent.",
      visuals: [
        "QR table entry -> customer cart -> checkout request -> Express API -> PostgreSQL order state -> admin review -> receipt output.",
        "Public case study uses screenshots for customer flow; private admin behavior remains source-controlled and non-public.",
      ],
    },
    accent: "amber",
    icon: Layers,
    featured: true,
    coverImage: "/projects/ahnyar-house-preview.webp",
    coverAlt: "Ahnyar House restaurant ordering interface shown on mobile devices",
    demoUrl: "https://anh-portfolio.onrender.com",
  },
  {
    id: "cosmiccraft",
    title: "CosmicCraft - AI Career Navigator",
    category: "Hackathon Project",
    summary:
      "A source-code hackathon project exploring structured AI workflows for career guidance, mock interviews, and profile writing.",
    stack: ["Next.js", "TypeScript", "OpenAI API", "MongoDB", "JWT"],
    sections: {
      overview:
        "CosmicCraft tested whether a career assistant could turn profile data into useful guidance across several AI-assisted workflows within a short hackathon timeline.",
      problem:
        "Career guidance, interview practice, and personal branding are usually split across different tools. The challenge was to unify those tasks without making one fragile, overloaded AI endpoint.",
      solution:
        "I treated each AI interaction as a separate intent with its own prompt boundary, input shape, and response expectation, so the system could remain understandable under hackathon time pressure.",
      architecture:
        "Profile and session data flow through the app into task-specific AI requests. MongoDB stores user context, while the application routes career guidance, interview feedback, and narrative generation through separate service paths.",
      decisions: [
        "Separated AI tasks by intent so prompts could evolve independently.",
        "Structured prompts around user context and target role rather than generic questions.",
        "Persisted profile data so AI responses could be generated from known state instead of repeated manual input.",
        "Kept the project source-code oriented after the event instead of pointing recruiters to a stale deployment.",
      ],
      challenges: [
        "Balancing speed and architecture during a hackathon.",
        "Keeping AI output predictable enough for a product-like interface.",
        "Avoiding generic model responses by shaping inputs and expected response formats.",
      ],
      contribution:
        "I contributed to product architecture, AI workflow design, frontend implementation, and source-code delivery for the hackathon submission.",
      learned:
        "Reliable AI UX depends less on calling a model and more on data shape, prompt scope, fallback behavior, and how clearly each workflow defines success.",
      visuals: [
        "Profile context -> task-specific prompt -> AI response -> structured career output.",
        "Separate paths for guidance, interview practice, opportunity scanning, and narrative writing.",
      ],
    },
    accent: "emerald",
    icon: Rocket,
    coverImage: "/projects/cosmiccraft-preview.webp",
    coverAlt: "CosmicCraft AI Career Navigator welcome screen in a browser window",
  },
  {
    id: "lms",
    title: "E-Learning Management System",
    category: "Online University Project",
    summary:
      "A relational LMS that maps courses, users, assessments, progress, rewards, and certificates into testable backend services.",
    stack: ["React", "Spring Boot", "Java", "MySQL", "Docker"],
    sections: {
      overview:
        "The LMS project connected software engineering, database systems, and web development coursework into one online academic platform.",
      problem:
        "Learning systems become hard to maintain when courses, modules, users, progress, and certificates are modeled informally. The project needed a normalized structure that could support multiple roles without duplicating data.",
      solution:
        "We designed domain-focused REST APIs backed by a relational MySQL schema, with role-aware flows for students, instructors, and administrators.",
      architecture:
        "React handles the client workflow, Spring Boot exposes resource-oriented APIs, Spring Security/JWT protects access, and MySQL stores normalized course, enrollment, quiz, badge, and certificate records.",
      decisions: [
        "Normalized enrollment, progress, assessment, and certificate data instead of embedding everything inside course records.",
        "Organized endpoints around domain resources so API behavior stayed easier to test.",
        "Separated student, instructor, and admin responsibilities at the backend layer.",
        "Used Docker to reduce setup differences between development environments.",
      ],
      challenges: [
        "Keeping a large academic domain understandable across many related tables.",
        "Designing APIs that matched database relationships without leaking unnecessary complexity to the UI.",
        "Coordinating frontend and backend changes in a team project context.",
      ],
      contribution:
        "I worked across backend structure, database schema planning, API behavior, and frontend integration as part of the university project.",
      learned:
        "This project made database-first design practical for me. Clear relationships and ownership make API design and frontend state much less fragile.",
      visuals: [
        "Users -> enrollments -> courses -> modules -> content -> progress.",
        "Quizzes, badges, and certificates reference course and student records through normalized relationships.",
      ],
    },
    accent: "blue",
    icon: GraduationCap,
    coverImage: "/projects/learnhub-preview.webp",
    coverAlt: "LearnHub e-learning platform landing page in a browser window",
    demoUrl: "https://lms-frontend-882950565528.us-central1.run.app/",
  },
  {
    id: "anchor-mobile",
    title: "Anchor Mobile",
    category: "React Native Mobile App",
    summary:
      "A private mobile app that coordinates authentication, local unlock, shared spaces, media, notifications, and location permissions.",
    stack: ["Expo", "React Native", "TypeScript", "Firebase", "Firestore"],
    sections: {
      overview:
        "Anchor Mobile explores the engineering complexity behind private mobile spaces, where local state, shared state, permissions, and backend rules all affect reliability.",
      problem:
        "A private couple-space app cannot assume constant permissions or perfect connectivity. Authentication, local unlock, storage, media upload, notifications, and location can each fail independently.",
      solution:
        "The app separates session, space, and theme state into providers, uses Firebase for shared data and authentication, and keeps local PIN unlock separate from account authentication.",
      architecture:
        "Expo/React Native manages the app shell, React Navigation reacts to auth and pairing state, Firebase Auth owns identity, Firestore stores spaces and shared records, Firebase Storage handles media, and AsyncStorage supports local unlock and settings.",
      decisions: [
        "Separated app providers so navigation could respond consistently to session and pairing state.",
        "Used one-use pairing codes and Firestore membership rules to control shared-space access.",
        "Kept quick PIN unlock local after sign-in to improve usability without replacing Firebase Auth.",
        "Designed web/native fallbacks for maps, media uploads, storage behavior, and permissions.",
      ],
      challenges: [
        "Coordinating local device state with shared Firestore state.",
        "Handling permission-dependent features without breaking the core app flow.",
        "Keeping web and native behavior consistent where platform APIs differ.",
      ],
      contribution:
        "I structured the app flow, navigation state, Firebase services, local unlock behavior, shared-space data model, and mobile permission handling.",
      learned:
        "The biggest lesson was mobile reliability. A good mobile app treats denied permissions, async storage, backend rules, and platform differences as normal states, not edge cases.",
      visuals: [
        "Firebase session -> local PIN gate -> active space -> main tabs.",
        "Shared records flow through Firestore; local preferences and unlock state stay on-device.",
      ],
    },
    accent: "violet",
    icon: Smartphone,
    coverImage: "/projects/anchor-preview-v2.webp",
    coverAlt: "Anchor mobile app onboarding and settings screens shown on two phones",
    demoUrl: "https://anchor-2914.web.app/",
  },
];

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
  open,
  selected,
  onSelect,
  onClose,
}: {
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
                {PROJECTS.map((project) => {
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
  const [selected, setSelected] = useState<Project>(PROJECTS[0]);
  const [panelOpen, setPanelOpen] = useState(false);
  const [selectedSlide, setSelectedSlide] = useState(0);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "center" });

  const syncSlide = useCallback(() => {
    if (emblaApi) setSelectedSlide(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    syncSlide();
    emblaApi.on("select", syncSlide);
    emblaApi.on("reInit", syncSlide);
    return () => {
      emblaApi.off("select", syncSlide);
      emblaApi.off("reInit", syncSlide);
    };
  }, [emblaApi, syncSlide]);

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

        <div className="project-carousel" role="region" aria-roledescription="carousel" aria-label={t("projects.title")}>
          <div className="project-carousel-viewport" ref={emblaRef}>
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
            <button type="button" className="project-carousel-arrow" onClick={() => emblaApi?.scrollPrev()} aria-label={t("projects.previous")}>
              <ChevronLeft size={17} aria-hidden="true" />
            </button>
            <div className="project-carousel-dots" aria-label={t("projects.choose")}>
              {PROJECTS.map((project, index) => (
                <button
                  key={project.id}
                  type="button"
                  className={`project-carousel-dot ${selectedSlide === index ? "is-active" : ""}`}
                  onClick={() => emblaApi?.scrollTo(index)}
                  aria-label={`Show ${project.title}`}
                  aria-current={selectedSlide === index ? "true" : undefined}
                />
              ))}
            </div>
            <button type="button" className="project-carousel-arrow" onClick={() => emblaApi?.scrollNext()} aria-label={t("projects.next")}>
              <ChevronRight size={17} aria-hidden="true" />
            </button>
          </div>
        </div>

      </div>

      <CaseStudyPanel
        open={panelOpen}
        selected={selected}
        onSelect={setSelected}
        onClose={() => setPanelOpen(false)}
      />
    </section>
  );
}
