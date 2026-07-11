import { useEffect, useMemo, useState } from "react";
import type { ElementType, ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  ArrowUpRight,
  ExternalLink,
  Github,
  GraduationCap,
  Layers,
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
    sourceUrl: "https://github.com/RizzRioo06/hackathon_CareerMate_AlcholicHut",
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
    demoUrl: "https://anchor-2914.web.app/",
    sourceUrl: "https://github.com/kyaw-hmue-San/anchor_mobile",
  },
];

const ACCENT = {
  amber: {
    border: "rgba(245,158,11,0.18)",
    glow: "rgba(245,158,11,0.07)",
    tag: { bg: "rgba(245,158,11,0.1)", border: "rgba(245,158,11,0.18)", color: "rgba(251,191,36,0.82)" },
    dot: "#f59e0b",
    icon: "rgba(245,158,11,0.9)",
    iconBg: "rgba(245,158,11,0.1)",
  },
  emerald: {
    border: "rgba(16,185,129,0.18)",
    glow: "rgba(16,185,129,0.06)",
    tag: { bg: "rgba(16,185,129,0.1)", border: "rgba(16,185,129,0.18)", color: "rgba(52,211,153,0.82)" },
    dot: "#10b981",
    icon: "rgba(52,211,153,0.9)",
    iconBg: "rgba(16,185,129,0.1)",
  },
  blue: {
    border: "rgba(59,130,246,0.18)",
    glow: "rgba(59,130,246,0.06)",
    tag: { bg: "rgba(59,130,246,0.1)", border: "rgba(59,130,246,0.18)", color: "rgba(147,197,253,0.82)" },
    dot: "#3b82f6",
    icon: "rgba(147,197,253,0.9)",
    iconBg: "rgba(59,130,246,0.1)",
  },
  violet: {
    border: "rgba(139,92,246,0.18)",
    glow: "rgba(139,92,246,0.06)",
    tag: { bg: "rgba(139,92,246,0.1)", border: "rgba(139,92,246,0.18)", color: "rgba(196,181,253,0.82)" },
    dot: "#8b5cf6",
    icon: "rgba(196,181,253,0.9)",
    iconBg: "rgba(139,92,246,0.1)",
  },
};

const SECTION_TITLES = [
  "Overview",
  "Problem",
  "Solution",
  "Architecture",
  "Engineering Decisions",
  "Challenges",
  "My Contribution",
  "Lessons Learned",
  "Technologies",
  "Screenshots or Diagrams",
  "GitHub / Live Demo",
];

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
  return (
    <div className="flex flex-wrap gap-2">
      <a
        href={project.sourceUrl ?? "#"}
        onClick={(e) => {
          e.stopPropagation();
          if (!project.sourceUrl) e.preventDefault();
        }}
        target={project.sourceUrl ? "_blank" : undefined}
        rel={project.sourceUrl ? "noreferrer" : undefined}
        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg transition-all hover:bg-white/[0.04]"
        style={{
          fontFamily: "Inter, sans-serif",
          fontSize: "12.5px",
          color: project.sourceUrl ? "rgba(255,255,255,0.62)" : "rgba(255,255,255,0.28)",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <Github size={13} />
        {project.sourceUrl ? "GitHub" : "Source Private"}
      </a>
      <a
        href={project.demoUrl ?? "#"}
        onClick={(e) => {
          e.stopPropagation();
          if (!project.demoUrl) e.preventDefault();
        }}
        target={project.demoUrl ? "_blank" : undefined}
        rel={project.demoUrl ? "noreferrer" : undefined}
        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg transition-all hover:bg-white/[0.04]"
        style={{
          fontFamily: "Inter, sans-serif",
          fontSize: "12.5px",
          color: project.demoUrl ? "rgba(255,255,255,0.62)" : "rgba(255,255,255,0.28)",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <ExternalLink size={13} />
        {project.demoUrl ? "Live Demo" : "Demo Private"}
      </a>
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
  const a = ACCENT[project.accent];
  const Icon = project.icon;

  return (
    <Reveal delay={delay}>
      <button
        type="button"
        onClick={onOpen}
        className="group text-left rounded-2xl h-full w-full transition-all duration-300 hover:-translate-y-0.5 focus:outline-none"
        style={{
          border: `1px solid ${project.featured ? a.border : "rgba(255,255,255,0.07)"}`,
          background: `radial-gradient(ellipse 85% 55% at 0% 0%, ${project.featured ? a.glow : "transparent"}, transparent 62%), rgba(255,255,255,0.02)`,
        }}
      >
        <div className="p-6 flex flex-col gap-5 h-full">
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
                  fontFamily: "Inter, sans-serif",
                  fontSize: "10.5px",
                  fontWeight: 650,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.28)",
                }}>
                  {project.category}
                </p>
                <h3
                  className="mt-1 transition-colors group-hover:text-white"
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: "17px",
                    fontWeight: 650,
                    color: "rgba(255,255,255,0.88)",
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
              style={{ color: "rgba(255,255,255,0.28)" }}
            />
          </div>

          <p style={{
            fontFamily: "Inter, sans-serif",
            fontSize: "13.5px",
            lineHeight: 1.65,
            color: "rgba(255,255,255,0.46)",
          }}>
            {project.summary}
          </p>

          <div className="flex flex-wrap gap-1.5 mt-auto">
            {project.stack.slice(0, 6).map((tech) => (
              <span
                key={tech}
                style={{
                  fontFamily: "Inter, sans-serif",
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

          <div className="flex items-center justify-between gap-3 pt-1">
            <ProjectActions project={project} />
            <span
              className="inline-flex transition-colors group-hover:text-white/70"
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "12.5px",
                fontWeight: 600,
                color: "rgba(255,255,255,0.36)",
              }}
            >
              Read Case Study
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
        border: "1px solid rgba(255,255,255,0.07)",
        background: "rgba(255,255,255,0.025)",
      }}
    >
      <h4 style={{
        fontFamily: "Inter, sans-serif",
        fontSize: "11px",
        fontWeight: 700,
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        color: "rgba(255,255,255,0.32)",
        marginBottom: "10px",
      }}>
        {title}
      </h4>
      <div style={{
        fontFamily: "Inter, sans-serif",
        fontSize: "14px",
        lineHeight: 1.72,
        color: "rgba(255,255,255,0.55)",
      }}>
        {children}
      </div>
    </motion.section>
  );
}

function CaseStudyContent({ project }: { project: Project }) {
  const a = ACCENT[project.accent];
  const Icon = project.icon;

  const blocks = useMemo(() => [
    {
      title: "Overview",
      content: <p>{project.sections.overview}</p>,
    },
    {
      title: "Problem",
      content: <p>{project.sections.problem}</p>,
    },
    {
      title: "Solution",
      content: <p>{project.sections.solution}</p>,
    },
    {
      title: "Architecture",
      content: <p>{project.sections.architecture}</p>,
    },
    {
      title: "Engineering Decisions",
      content: (
        <ul className="flex flex-col gap-2">
          {project.sections.decisions.map((item) => (
            <li key={item} className="flex gap-3">
              <span className="w-1.5 h-1.5 rounded-full mt-[9px] shrink-0" style={{ background: a.dot }} />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      ),
    },
    {
      title: "Challenges",
      content: (
        <ul className="flex flex-col gap-2">
          {project.sections.challenges.map((item) => (
            <li key={item} className="flex gap-3">
              <span className="w-1.5 h-1.5 rounded-full mt-[9px] shrink-0" style={{ background: a.dot }} />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      ),
    },
    {
      title: "My Contribution",
      content: <p>{project.sections.contribution}</p>,
    },
    {
      title: "Lessons Learned",
      content: <p>{project.sections.learned}</p>,
    },
    {
      title: "Technologies",
      content: (
        <div className="flex flex-wrap gap-2">
          {project.stack.map((tech) => (
            <span
              key={tech}
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "12px",
                fontWeight: 550,
                background: a.tag.bg,
                border: `1px solid ${a.tag.border}`,
                color: a.tag.color,
                borderRadius: "7px",
                padding: "5px 10px",
              }}
            >
              {tech}
            </span>
          ))}
        </div>
      ),
    },
    {
      title: "Screenshots or Diagrams",
      content: (
        <div className="grid grid-cols-1 gap-3">
          {project.sections.visuals.map((item) => (
            <div
              key={item}
              className="rounded-xl p-4"
              style={{
                border: "1px solid rgba(255,255,255,0.07)",
                background: "rgba(0,0,0,0.16)",
                color: "rgba(255,255,255,0.48)",
              }}
            >
              {item}
            </div>
          ))}
        </div>
      ),
    },
    {
      title: "GitHub / Live Demo",
      content: <ProjectActions project={project} />,
    },
  ], [a.dot, a.tag.bg, a.tag.border, a.tag.color, project]);

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
            fontFamily: "Inter, sans-serif",
            fontSize: "11px",
            fontWeight: 650,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.3)",
            marginBottom: "8px",
          }}>
            {project.category}
          </p>
          <h3 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(1.8rem, 5vw, 2.6rem)",
            fontWeight: 700,
            color: "rgba(255,255,255,0.94)",
            lineHeight: 1.12,
          }}>
            <TypewriterText text={project.title} />
          </h3>
        </div>
      </div>

      <p style={{
        fontFamily: "Inter, sans-serif",
        fontSize: "15px",
        lineHeight: 1.75,
        color: "rgba(255,255,255,0.5)",
        maxWidth: "680px",
      }}>
        {project.summary}
      </p>

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
            aria-label="Close case study"
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
            className="absolute inset-0 md:inset-y-0 md:right-0 md:left-auto md:w-[min(900px,76vw)] overflow-hidden"
            style={{
              background: "rgba(8,11,18,0.98)",
              borderLeft: isMobile ? "none" : "1px solid rgba(255,255,255,0.08)",
              boxShadow: "0 32px 90px rgba(0,0,0,0.55)",
            }}
          >
            <div className="h-full grid grid-cols-1 md:grid-cols-[230px_minmax(0,1fr)]">
              <div
                className="hidden md:flex flex-col gap-3 p-5"
                style={{ borderRight: "1px solid rgba(255,255,255,0.06)" }}
              >
                <p style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "10.5px",
                  fontWeight: 700,
                  letterSpacing: "0.13em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.28)",
                }}>
                  Case Studies
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
                        border: active ? `1px solid ${a.border}` : "1px solid rgba(255,255,255,0.06)",
                        background: active ? a.tag.bg : "rgba(255,255,255,0.015)",
                      }}
                    >
                      <span style={{
                        display: "block",
                        fontFamily: "Inter, sans-serif",
                        fontSize: "10px",
                        fontWeight: 650,
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        color: active ? a.tag.color : "rgba(255,255,255,0.25)",
                        marginBottom: "5px",
                      }}>
                        {project.category}
                      </span>
                      <span style={{
                        display: "block",
                        fontFamily: "Inter, sans-serif",
                        fontSize: "13px",
                        fontWeight: 600,
                        lineHeight: 1.35,
                        color: active ? "rgba(255,255,255,0.86)" : "rgba(255,255,255,0.52)",
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
                  style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
                >
                  <div className="md:hidden flex gap-2 overflow-x-auto pr-2">
                    {PROJECTS.map((project) => {
                      const active = project.id === selected.id;
                      const a = ACCENT[project.accent];
                      return (
                        <button
                          key={project.id}
                          type="button"
                          onClick={() => onSelect(project)}
                          className="shrink-0 rounded-full px-3 py-1.5"
                          style={{
                            fontFamily: "Inter, sans-serif",
                            fontSize: "11px",
                            fontWeight: 650,
                            border: active ? `1px solid ${a.border}` : "1px solid rgba(255,255,255,0.08)",
                            color: active ? a.tag.color : "rgba(255,255,255,0.42)",
                            background: active ? a.tag.bg : "rgba(255,255,255,0.02)",
                          }}
                        >
                          {project.title}
                        </button>
                      );
                    })}
                  </div>
                  <span className="hidden md:block" style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: "11px",
                    color: "rgba(255,255,255,0.28)",
                  }}>
                    Click a project on the left to switch without closing this panel.
                  </span>
                  <button
                    type="button"
                    onClick={onClose}
                    className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-colors hover:bg-white/[0.06]"
                    style={{ border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.55)" }}
                    aria-label="Close case study"
                  >
                    <X size={16} />
                  </button>
                </div>

                <div className="overflow-y-auto p-5 md:p-8">
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
  const [selected, setSelected] = useState<Project>(PROJECTS[0]);
  const [panelOpen, setPanelOpen] = useState(false);

  const openProject = (project: Project) => {
    setSelected(project);
    setPanelOpen(true);
  };

  return (
    <section id="projects" className="py-28 px-6">
      <div className="max-w-6xl mx-auto">
        <Reveal>
          <div className="flex flex-col gap-3 mb-14">
            <SectionLabel>Selected work</SectionLabel>
            <h2 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(2rem, 5vw, 2.8rem)",
              fontWeight: 700,
              color: "rgba(255,255,255,0.93)",
              lineHeight: 1.12,
            }}>
              Projects
            </h2>
            <p style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "15px",
              color: "rgba(255,255,255,0.42)",
              lineHeight: 1.7,
              maxWidth: "560px",
            }}>
              Short previews for scanning. Open a case study to inspect the problem,
              architecture, tradeoffs, contribution, and lessons learned.
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
          {PROJECTS.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              delay={0.05 * index}
              onOpen={() => openProject(project)}
            />
          ))}
        </div>

        <Reveal delay={0.15}>
          <div className="flex justify-center">
            <button
              type="button"
              onClick={() => openProject(PROJECTS[0])}
              className="inline-flex items-center gap-1.5 group transition-colors"
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "13.5px",
                color: "rgba(255,255,255,0.36)",
              }}
              onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.62)"}
              onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.36)"}
            >
              Open Ahnyar House case study
              <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>
          </div>
        </Reveal>
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
