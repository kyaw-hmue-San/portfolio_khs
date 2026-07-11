import { motion } from "motion/react";

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

interface Skill { name: string; proficiency: number; note?: string }
interface Category { label: string; color: string; colorDim: string; skills: Skill[] }

const CATEGORIES: Category[] = [
  {
    label: "Languages",
    color: "#f59e0b",
    colorDim: "rgba(245,158,11,0.15)",
    skills: [
      { name: "TypeScript", proficiency: 85, note: "primary language" },
      { name: "JavaScript", proficiency: 85 },
      { name: "Java", proficiency: 60, note: "coursework" },
      { name: "SQL", proficiency: 78 },
      { name: "C / C++", proficiency: 45, note: "fundamentals" },
    ],
  },
  {
    label: "Frontend",
    color: "#10b981",
    colorDim: "rgba(16,185,129,0.15)",
    skills: [
      { name: "React", proficiency: 82 },
      { name: "Vite", proficiency: 78 },
      { name: "Next.js", proficiency: 70 },
      { name: "Tailwind CSS", proficiency: 88 },
      { name: "React Native", proficiency: 68 },
      { name: "HTML & CSS", proficiency: 74, note: "strong foundation" },
      { name: "Responsive Design", proficiency: 84 },
    ],
  },
  {
    label: "Backend & Data",
    color: "#3b82f6",
    colorDim: "rgba(59,130,246,0.15)",
    skills: [
      { name: "Node.js / Express", proficiency: 78 },
      { name: "Spring Boot", proficiency: 62 },
      { name: "PostgreSQL", proficiency: 72 },
      { name: "MySQL", proficiency: 70 },
      { name: "Prisma ORM", proficiency: 70 },
      { name: "REST API Design", proficiency: 80 },
      { name: "MongoDB", proficiency: 64 },
      { name: "Firebase", proficiency: 66 },
    ],
  },
  {
    label: "Tooling & Infra",
    color: "#8b5cf6",
    colorDim: "rgba(139,92,246,0.15)",
    skills: [
      { name: "Git & GitHub", proficiency: 84 },
      { name: "Docker", proficiency: 62 },
      { name: "DigitalOcean", proficiency: 60 },
      { name: "Linux / CLI", proficiency: 72 },
      { name: "Socket.io", proficiency: 60 },
      { name: "JWT Auth", proficiency: 65 },
      { name: "Capacitor Android", proficiency: 58 },
      { name: "Expo", proficiency: 64 },
      { name: "OpenAI API", proficiency: 62 },
    ],
  },
];

const CURRENTLY_EXPLORING = [
  { name: "System design", color: "rgba(245,158,11,0.12)", border: "rgba(245,158,11,0.2)", text: "rgba(251,191,36,0.75)" },
  { name: "Testing strategy", color: "rgba(245,158,11,0.12)", border: "rgba(245,158,11,0.2)", text: "rgba(251,191,36,0.75)" },
  { name: "Deployment workflow", color: "rgba(16,185,129,0.1)", border: "rgba(16,185,129,0.2)", text: "rgba(52,211,153,0.75)" },
  { name: "Mobile app packaging", color: "rgba(16,185,129,0.1)", border: "rgba(16,185,129,0.2)", text: "rgba(52,211,153,0.75)" },
  { name: "Restaurant operations UX", color: "rgba(59,130,246,0.1)", border: "rgba(59,130,246,0.2)", text: "rgba(147,197,253,0.75)" },
];

function SkillRow({ skill, color, i }: { skill: Skill; color: string; i: number }) {
  return (
    <div className="grid grid-cols-[112px_1fr_auto] items-center gap-3">
      <span
        className="text-right"
        style={{
          fontFamily: "Inter, sans-serif",
          fontSize: "12px",
          color: "rgba(255,255,255,0.52)",
        }}
      >
        {skill.name}
      </span>
      <div className="h-[3px] rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
        <motion.div
          className="h-full rounded-full"
          initial={{ width: 0 }}
          whileInView={{ width: `${skill.proficiency}%` }}
          viewport={{ once: true }}
          transition={{ duration: 0.75, delay: 0.04 * i, ease: [0.21, 0.47, 0.32, 0.98] }}
          style={{ background: color }}
        />
      </div>
      <span
        className="hidden sm:block"
        style={{
          fontFamily: "Inter, sans-serif",
          fontSize: "10px",
          color: "rgba(255,255,255,0.18)",
          width: "86px",
        }}
      >
        {skill.note ?? ""}
      </span>
    </div>
  );
}

export function Skills() {
  return (
    <section id="skills" className="py-28 px-6">
      <div className="max-w-6xl mx-auto">
        <Reveal>
          <div className="flex flex-col gap-3 mb-12">
            <SectionLabel>Capabilities</SectionLabel>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2rem, 5vw, 2.8rem)", fontWeight: 700, color: "rgba(255,255,255,0.93)", lineHeight: 1.12 }}>
              Skills
            </h2>
            <p style={{ fontFamily: "Inter, sans-serif", fontSize: "15px", color: "rgba(255,255,255,0.42)", lineHeight: 1.7, maxWidth: "520px" }}>
              My current stack is shaped by coursework, personal projects, and
              hands-on practice across frontend, backend, data, and deployment.
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
          {CATEGORIES.map((cat, ci) => (
            <Reveal key={cat.label} delay={ci * 0.06}>
              <div
                className="rounded-2xl p-6 flex flex-col gap-5"
                style={{
                  border: "1px solid rgba(255,255,255,0.07)",
                  background: "rgba(255,255,255,0.02)",
                }}
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-1.5 h-5 rounded-full" style={{ background: cat.color, opacity: 0.85 }} />
                  <span style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: "11px",
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: cat.color,
                    opacity: 0.82,
                  }}>
                    {cat.label}
                  </span>
                </div>
                <div className="flex flex-col gap-3">
                  {cat.skills.map((s, i) => (
                    <SkillRow key={s.name} skill={s} color={cat.color} i={i} />
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.25}>
          <div
            className="rounded-2xl p-6"
            style={{
              border: "1px solid rgba(255,255,255,0.07)",
              background: "rgba(255,255,255,0.015)",
            }}
          >
            <div className="flex items-center gap-3 mb-5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-50" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
              </span>
              <span style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "rgba(52,211,153,0.6)",
              }}>
                Currently exploring
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {CURRENTLY_EXPLORING.map((item) => (
                <span
                  key={item.name}
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: "12px",
                    fontWeight: 520,
                    background: item.color,
                    border: `1px solid ${item.border}`,
                    color: item.text,
                    borderRadius: "8px",
                    padding: "5px 10px",
                  }}
                >
                  {item.name}
                </span>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
