import { motion } from "motion/react";
import { GraduationCap, BookOpen, Globe, Code2, Users } from "lucide-react";

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

const COURSES = [
  "Data Structures & Algorithms",
  "Operating Systems",
  "Database Management Systems",
  "Computer Networks",
  "Software Engineering Principles",
  "Object-Oriented Programming",
  "Web Application Development",
  "Discrete Mathematics",
  "Software Testing & QA",
  "System Analysis & Design",
];

const ACTIVITIES = [
  {
    Icon: Code2,
    title: "Personal Projects",
    desc: "Building outside the classroom to close the gap between theory and production-level engineering.",
  },
  {
    Icon: BookOpen,
    title: "Self-Directed Learning",
    desc: "Courses, technical books, and engineering blogs used to stay current with modern practices.",
  },
  {
    Icon: Users,
    title: "Collaborative Work",
    desc: "Group projects and pair programming sessions that deepened skills in communication and code review.",
  },
];

export function Education() {
  return (
    <section id="education" className="py-28 px-6">
      <div className="max-w-6xl mx-auto">

        <Reveal>
          <div className="flex flex-col gap-3 mb-14">
            <SectionLabel>Background</SectionLabel>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2rem, 5vw, 2.8rem)", fontWeight: 700, color: "rgba(255,255,255,0.93)", lineHeight: 1.12 }}>
              Education
            </h2>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">

          {/* Degree card */}
          <Reveal delay={0.06} className="lg:col-span-3">
            <div
              className="rounded-2xl h-full"
              style={{
                border: "1px solid rgba(245,158,11,0.18)",
                background: "radial-gradient(ellipse 70% 50% at 0% 0%, rgba(245,158,11,0.07), transparent 65%), rgba(255,255,255,0.02)",
              }}
            >
              <div className="p-8 flex flex-col gap-7">
                {/* Header */}
                <div className="flex items-start gap-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.2)" }}
                  >
                    <GraduationCap size={22} style={{ color: "#f59e0b" }} />
                  </div>
                  <div className="flex flex-col gap-1">
                    <span style={{ fontFamily: "Inter, sans-serif", fontSize: "10.5px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(245,158,11,0.5)" }}>
                      Bachelor of Engineering
                    </span>
                    <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.35rem", fontWeight: 700, color: "rgba(255,255,255,0.9)", lineHeight: 1.25 }}>
                      Software Engineering
                    </h3>
                    <p style={{ fontFamily: "Inter, sans-serif", fontSize: "14px", color: "rgba(255,255,255,0.42)" }}>
                      Mae Fah Luang University
                    </p>
                  </div>
                </div>

                {/* Meta row */}
                <div className="flex flex-wrap gap-2">
                  <span style={{
                    fontFamily: "Inter, sans-serif", fontSize: "12px", fontWeight: 500,
                    background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.2)",
                    color: "rgba(251,191,36,0.75)", borderRadius: "6px", padding: "4px 10px",
                  }}>
                    In progress
                  </span>
                  <span style={{
                    fontFamily: "Inter, sans-serif", fontSize: "12px", fontWeight: 500,
                    background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
                    color: "rgba(255,255,255,0.38)", borderRadius: "6px", padding: "4px 10px",
                  }}>
                    Chiang Rai, Thailand
                  </span>
                </div>

                {/* Divider */}
                <div style={{ height: "1px", background: "rgba(255,255,255,0.06)" }} />

                {/* Coursework */}
                <div>
                  <p style={{ fontFamily: "Inter, sans-serif", fontSize: "10.5px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)", marginBottom: "12px" }}>
                    Relevant coursework
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {COURSES.map((c) => (
                      <span key={c} style={{
                        fontFamily: "Inter, sans-serif", fontSize: "12px",
                        background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)",
                        color: "rgba(255,255,255,0.42)", borderRadius: "6px", padding: "3px 10px",
                      }}>
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Right column */}
          <div className="lg:col-span-2 flex flex-col gap-4">

            {/* Activities */}
            {ACTIVITIES.map(({ Icon, title, desc }, i) => (
              <Reveal key={title} delay={0.1 + i * 0.07}>
                <div
                  className="rounded-2xl p-5 flex gap-4"
                  style={{
                    border: "1px solid rgba(255,255,255,0.07)",
                    background: "rgba(255,255,255,0.02)",
                  }}
                >
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
                  >
                    <Icon size={16} style={{ color: "rgba(255,255,255,0.38)" }} />
                  </div>
                  <div>
                    <p style={{ fontFamily: "Inter, sans-serif", fontSize: "14px", fontWeight: 550, color: "rgba(255,255,255,0.78)", marginBottom: "4px" }}>
                      {title}
                    </p>
                    <p style={{ fontFamily: "Inter, sans-serif", fontSize: "13px", lineHeight: 1.62, color: "rgba(255,255,255,0.38)" }}>
                      {desc}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}

            {/* Origin card */}
            <Reveal delay={0.32}>
              <div
                className="rounded-2xl p-5 flex flex-col gap-4"
                style={{
                  border: "1px solid rgba(255,255,255,0.07)",
                  background: "rgba(255,255,255,0.02)",
                }}
              >
                <div className="flex items-center gap-2.5">
                  <Globe size={14} style={{ color: "rgba(255,255,255,0.28)" }} />
                  <span style={{ fontFamily: "Inter, sans-serif", fontSize: "10.5px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)" }}>
                    Background
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span style={{ fontFamily: "Inter, sans-serif", fontSize: "12px", fontWeight: 700, color: "rgba(251,191,36,0.8)", letterSpacing: "0.08em" }}>MM</span>
                  <div>
                    <p style={{ fontFamily: "Inter, sans-serif", fontSize: "14.5px", fontWeight: 600, color: "rgba(255,255,255,0.8)" }}>
                      From Myanmar
                    </p>
                    <p style={{ fontFamily: "Inter, sans-serif", fontSize: "12px", color: "rgba(255,255,255,0.32)" }}>
                      Studying & living in Thailand
                    </p>
                  </div>
                </div>
                <p style={{ fontFamily: "Inter, sans-serif", fontSize: "13px", lineHeight: 1.65, color: "rgba(255,255,255,0.36)", fontStyle: "italic" }}>
                  Navigating a new country and language while pursuing engineering
                  has sharpened my adaptability and my appetite for continuous learning
                  more than any single course.
                </p>
              </div>
            </Reveal>

          </div>
        </div>
      </div>
    </section>
  );
}
