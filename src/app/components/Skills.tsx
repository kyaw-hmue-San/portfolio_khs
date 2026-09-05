import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { motion, useReducedMotion } from "motion/react";
import { Braces, ChevronLeft, ChevronRight, Code2, Database, Map, Smartphone, Wrench } from "lucide-react";

function Reveal({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.52, delay, ease: [0.21, 0.47, 0.32, 0.98] }} className={className}>
      {children}
    </motion.div>
  );
}

interface SkillCategory {
  label: string;
  eyebrow: string;
  description: string;
  color: string;
  background: string;
  border: string;
  icon: typeof Code2;
  skills: string[];
}

const CATEGORIES: SkillCategory[] = [
  {
    label: "Languages & Foundations",
    eyebrow: "Core development",
    description: "The languages and web fundamentals behind my software projects and coursework.",
    color: "#f59e0b",
    background: "rgba(245,158,11,0.06)",
    border: "rgba(245,158,11,0.2)",
    icon: Braces,
    skills: ["TypeScript", "JavaScript", "Java", "SQL", "HTML", "CSS"],
  },
  {
    label: "Frontend & Mobile",
    eyebrow: "User experiences",
    description: "Responsive interfaces for the web and cross-platform mobile applications.",
    color: "#10b981",
    background: "rgba(16,185,129,0.055)",
    border: "rgba(16,185,129,0.19)",
    icon: Smartphone,
    skills: ["React", "Next.js", "Tailwind CSS", "Responsive Design", "React Native", "Expo"],
  },
  {
    label: "Backend & Databases",
    eyebrow: "Systems & data",
    description: "APIs, authentication, server-side applications, and persistent data storage.",
    color: "#3b82f6",
    background: "rgba(59,130,246,0.055)",
    border: "rgba(59,130,246,0.19)",
    icon: Database,
    skills: ["Node.js", "Express", "Spring Boot", "REST APIs", "PostgreSQL", "MySQL", "MongoDB", "Prisma ORM", "Firebase", "JWT Authentication"],
  },
  {
    label: "Data & Geospatial",
    eyebrow: "Analysis & mapping",
    description: "Foundational analysis and geographic communication using real datasets.",
    color: "#8b5cf6",
    background: "rgba(139,92,246,0.06)",
    border: "rgba(139,92,246,0.2)",
    icon: Map,
    skills: ["QGIS", "Map Visualization", "Spatial Data Preparation", "Basic Spatial Analysis", "Data Cleaning", "Exploratory Data Analysis", "Data Visualization"],
  },
];

const TOOLS = ["Git & GitHub", "Docker", "DigitalOcean", "Linux / CLI", "Vite", "Socket.io", "OpenAI API"];
const CURRENTLY_DEEPENING = ["System design", "Automated testing", "CI/CD & deployment", "AI integration & RAG"];

function SkillCard({ category, active }: { category: SkillCategory; active: boolean }) {
  const Icon = category.icon;
  return (
    <article className={`skill-carousel-card h-full rounded-2xl p-5 sm:p-6 ${active ? "is-active" : ""}`} style={{ border: `1px solid ${category.border}`, background: category.background }}>
      <div className="flex items-start justify-between gap-5 mb-5">
        <div>
          <span style={{ fontFamily: "Inter, sans-serif", fontSize: "10px", fontWeight: 700, letterSpacing: "0.13em", textTransform: "uppercase", color: category.color }}>{category.eyebrow}</span>
          <h3 className="mt-2" style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.4rem, 3vw, 1.85rem)", fontWeight: 700, lineHeight: 1.2, color: "rgba(255,255,255,0.9)" }}>{category.label}</h3>
        </div>
        <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(255,255,255,0.045)", border: `1px solid ${category.border}` }}>
          <Icon size={19} aria-hidden="true" style={{ color: category.color }} />
        </div>
      </div>
      <p className="mb-5" style={{ fontFamily: "Inter, sans-serif", fontSize: "13px", lineHeight: 1.65, color: "rgba(255,255,255,0.4)", maxWidth: "530px" }}>{category.description}</p>
      <ul className="flex flex-wrap gap-2" aria-label={`${category.label} skills`}>
        {category.skills.map((skill) => (
          <li key={skill} className="rounded-lg px-3 py-2 transition-colors duration-200 hover:bg-white/[0.08]" style={{ fontFamily: "Inter, sans-serif", fontSize: "12.5px", fontWeight: 500, color: "rgba(255,255,255,0.61)", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>{skill}</li>
        ))}
      </ul>
    </article>
  );
}

function SupportingGroup({ title, items, learning = false }: { title: string; items: string[]; learning?: boolean }) {
  return (
    <div className="h-full rounded-2xl p-5 sm:p-6" style={{ border: learning ? "1px solid rgba(16,185,129,0.15)" : "1px solid rgba(255,255,255,0.07)", background: learning ? "rgba(16,185,129,0.025)" : "rgba(255,255,255,0.015)" }}>
      <div className="flex items-center gap-3 mb-5">
        {learning ? (
          <span className="relative flex h-2 w-2" aria-hidden="true"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-50" /><span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" /></span>
        ) : <Wrench size={14} aria-hidden="true" style={{ color: "rgba(255,255,255,0.4)" }} />}
        <h3 style={{ fontFamily: "Inter, sans-serif", fontSize: "11px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: learning ? "rgba(52,211,153,0.65)" : "rgba(255,255,255,0.42)" }}>{title}</h3>
      </div>
      <ul className="flex flex-wrap gap-2" aria-label={title}>
        {items.map((item) => (
          <li key={item} className="rounded-lg px-3 py-2" style={{ fontFamily: "Inter, sans-serif", fontSize: "12.5px", fontWeight: 500, color: learning ? "rgba(52,211,153,0.74)" : "rgba(255,255,255,0.48)", background: learning ? "rgba(16,185,129,0.07)" : "transparent", border: learning ? "1px solid rgba(16,185,129,0.15)" : "1px solid rgba(255,255,255,0.07)" }}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

export function Skills() {
  const reduceMotion = useReducedMotion();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [interactionStopped, setInteractionStopped] = useState(false);
  const pausedRef = useRef(false);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "center" });

  const syncSelection = useCallback(() => {
    if (emblaApi) setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    syncSelection();
    emblaApi.on("select", syncSelection);
    emblaApi.on("reInit", syncSelection);
    return () => {
      emblaApi.off("select", syncSelection);
      emblaApi.off("reInit", syncSelection);
    };
  }, [emblaApi, syncSelection]);

  useEffect(() => {
    if (!emblaApi || reduceMotion || interactionStopped) return;
    const timer = window.setInterval(() => {
      if (!pausedRef.current && !document.hidden) emblaApi.scrollNext();
    }, 5200);
    return () => window.clearInterval(timer);
  }, [emblaApi, interactionStopped, reduceMotion]);

  const useControls = (action: () => void) => {
    setInteractionStopped(true);
    action();
  };

  return (
    <section id="skills" className="py-24 sm:py-28 px-4 sm:px-6">
      <div className="max-w-6xl mx-auI to">
        <Reveal>
          <header className="flex flex-col gap-3 mb-10">
            <span style={{ fontFamily: "Inter, sans-serif", fontSize: "11px", fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(245,158,11,0.65)" }}>Capabilities</span>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2rem, 5vw, 2.8rem)", fontWeight: 700, color: "rgba(255,255,255,0.93)", lineHeight: 1.12 }}>Skills</h2>
            {/* <p style={{ fontFamily: "Inter, sans-serif", fontSize: "15px", color: "rgba(255,255,255,0.42)", lineHeight: 1.7, maxWidth: "640px" }}>A practical toolkit shaped by software projects, university coursework, and foundational work with data and geographic information systems.</p> */}
          </header>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="skill-carousel" role="region" aria-roledescription="carousel" aria-label="Technical skill categories" onMouseEnter={() => { pausedRef.current = true; }} onMouseLeave={() => { pausedRef.current = false; }} onFocusCapture={() => { pausedRef.current = true; }} onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) pausedRef.current = false; }} onPointerDown={() => { pausedRef.current = true; }} onPointerUp={() => { pausedRef.current = false; }}>
            <div className="skill-carousel-viewport" ref={emblaRef}>
              <div className="skill-carousel-track">
                {CATEGORIES.map((category, index) => (
                  <div className="skill-carousel-slide" key={category.label} role="group" aria-roledescription="slide" aria-label={`${index + 1} of ${CATEGORIES.length}: ${category.label}`} aria-hidden={selectedIndex !== index && !reduceMotion}>
                    <SkillCard category={category} active={selectedIndex === index} />
                  </div>
                ))}
              </div>
            </div>
            <div className="skill-carousel-controls mt-5 flex items-center justify-between gap-4">
              <p className="hidden sm:block text-xs" style={{ color: "rgba(255,255,255,0.28)" }}>Swipe or use the controls to explore</p>
              <div className="flex items-center gap-3 ml-auto">
                <button type="button" className="skill-carousel-arrow" onClick={() => useControls(() => emblaApi?.scrollPrev())} aria-label="Previous skill category"><ChevronLeft size={17} aria-hidden="true" /></button>
                <div className="flex items-center gap-2" aria-label="Choose a skill category">
                  {CATEGORIES.map((category, index) => (
                    <button key={category.label} type="button" className={`skill-carousel-dot ${selectedIndex === index ? "is-active" : ""}`} onClick={() => useControls(() => emblaApi?.scrollTo(index))} aria-label={`Show ${category.label}`} aria-current={selectedIndex === index ? "true" : undefined} />
                  ))}
                </div>
                <button type="button" className="skill-carousel-arrow" onClick={() => useControls(() => emblaApi?.scrollNext())} aria-label="Next skill category"><ChevronRight size={17} aria-hidden="true" /></button>
              </div>
            </div>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-8">
          <Reveal delay={0.18} className="h-full"><SupportingGroup title="Tools I work with" items={TOOLS} /></Reveal>
          <Reveal delay={0.23} className="h-full"><SupportingGroup title="Currently deepening" items={CURRENTLY_DEEPENING} learning /></Reveal>
        </div>
        {/* <Reveal delay={0.28}>
          <p className="mt-5" style={{ fontFamily: "Inter, sans-serif", fontSize: "11.5px", color: "rgba(255,255,255,0.22)", lineHeight: 1.6 }}>Skills are grouped by hands-on use rather than subjective percentages. Project case studies—and future map work—provide the supporting evidence.</p>
        </Reveal> */}
      </div>
    </section>
  );
}
