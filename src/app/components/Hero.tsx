import { useEffect, useRef } from "react";
import { motion } from "motion/react";
import { ArrowDown, MapPin, Sparkles } from "lucide-react";

function scrollTo(id: string) {
  const el = document.getElementById(id);
  if (el) {
    const top = el.getBoundingClientRect().top + window.scrollY - 72;
    window.scrollTo({ top, behavior: "smooth" });
  }
}

function OrbitDot({ angle, radius, delay, size = 3, color = "rgba(245,158,11,0.5)" }: {
  angle: number; radius: number; delay: number; size?: number; color?: string;
}) {
  const x = radius * Math.cos((angle * Math.PI) / 180);
  const y = radius * Math.sin((angle * Math.PI) / 180);
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 1, 0.6, 1] }}
      transition={{ delay, duration: 2.5, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
      className="absolute rounded-full pointer-events-none"
      style={{
        width: size, height: size, background: color,
        top: "50%", left: "50%",
        transform: `translate(calc(${x}px - 50%), calc(${y}px - 50%))`,
        boxShadow: `0 0 ${size * 3}px ${color}`,
      }}
    />
  );
}

const TECH_PILLS = ["React", "TypeScript", "Next.js", "Node.js", "PostgreSQL", "OpenAI API"];
const OPEN_CHIPS = [
  { label: "Open to internships", color: "emerald" },
  { label: "Available now", color: "amber" },
];

export function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Subtle particle field
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0, h = 0, animId = 0;
    const particles: { x: number; y: number; vx: number; vy: number; a: number; va: number; r: number }[] = [];

    const resize = () => {
      w = canvas.width = canvas.offsetWidth;
      h = canvas.height = canvas.offsetHeight;
    };

    const init = () => {
      particles.length = 0;
      const count = Math.min(40, Math.floor((w * h) / 28000));
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * w, y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.18, vy: (Math.random() - 0.5) * 0.18,
          a: Math.random(), va: (Math.random() - 0.5) * 0.004, r: Math.random() * 1.2 + 0.4,
        });
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (const p of particles) {
        p.x += p.vx; p.y += p.vy; p.a += p.va;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
        p.a = Math.max(0.05, Math.min(0.5, p.a));
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(245,158,11,${p.a * 0.4})`;
        ctx.fill();
      }
      // Connecting lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 140) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(245,158,11,${(1 - dist / 140) * 0.06})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      animId = requestAnimationFrame(draw);
    };

    resize();
    init();
    draw();

    const ro = new ResizeObserver(() => { resize(); init(); });
    ro.observe(canvas);
    return () => { cancelAnimationFrame(animId); ro.disconnect(); };
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden" aria-label="Introduction">
      {/* Canvas background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ opacity: 0.7 }}
      />

      {/* Gradient overlays */}
      <div className="absolute inset-0 pointer-events-none">
        <div style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(ellipse 70% 55% at 50% 0%, rgba(245,158,11,0.09) 0%, transparent 65%)",
        }} />
        <div style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(ellipse 50% 50% at 90% 90%, rgba(16,185,129,0.05) 0%, transparent 60%)",
        }} />
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: "25%",
          background: "linear-gradient(to bottom, transparent, #07090f)",
        }} />
      </div>

      {/* Main content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 pt-24 pb-16">
        <div className="max-w-3xl mx-auto w-full text-center">

          {/* Status badges */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-wrap items-center justify-center gap-2 mb-9"
          >
            {OPEN_CHIPS.map((chip) => (
              <span
                key={chip.label}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full"
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "11.5px",
                  fontWeight: 500,
                  border: chip.color === "emerald"
                    ? "1px solid rgba(16,185,129,0.2)"
                    : "1px solid rgba(245,158,11,0.2)",
                  background: chip.color === "emerald"
                    ? "rgba(16,185,129,0.07)"
                    : "rgba(245,158,11,0.07)",
                  color: chip.color === "emerald"
                    ? "rgba(52,211,153,0.85)"
                    : "rgba(251,191,36,0.85)",
                }}
              >
                <span className="relative flex h-1.5 w-1.5">
                  <span
                    className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60"
                    style={{ background: chip.color === "emerald" ? "#10b981" : "#f59e0b" }}
                  />
                  <span
                    className="relative inline-flex rounded-full h-1.5 w-1.5"
                    style={{ background: chip.color === "emerald" ? "#10b981" : "#f59e0b" }}
                  />
                </span>
                {chip.label}
              </span>
            ))}
          </motion.div>

          {/* Location */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex items-center justify-center gap-1.5 mb-5"
          >
            <MapPin size={12} style={{ color: "rgba(245,158,11,0.6)" }} />
            <span style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "12px",
              fontWeight: 500,
              color: "rgba(245,158,11,0.65)",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}>
              Mae Fah Luang University · Chiang Rai, Thailand
            </span>
          </motion.div>

          {/* Headline */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.28, ease: [0.21, 0.47, 0.32, 0.98] }}
          >
            <h1 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(3.4rem, 9vw, 7rem)",
              fontWeight: 700,
              lineHeight: 1.02,
              letterSpacing: "-0.02em",
              color: "rgba(255,255,255,0.94)",
              marginBottom: "0.2em",
            }}>
              Kyaw
              <br />
              <span style={{
                fontStyle: "italic",
                background: "linear-gradient(105deg, #f59e0b 0%, #fcd34d 50%, #f59e0b 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}>
                Hmue San.
              </span>
            </h1>
          </motion.div>

          {/* Sub-headline */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.42 }}
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "clamp(1rem, 2.2vw, 1.2rem)",
              fontWeight: 400,
              color: "rgba(255,255,255,0.48)",
              lineHeight: 1.65,
              maxWidth: "440px",
              margin: "1.4rem auto 0",
            }}
          >
            Software Engineering student interested in building clean, useful
            web applications and growing through real-world engineering work.
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.56 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-10"
          >
            <button
              onClick={() => scrollTo("projects")}
              className="group relative overflow-hidden px-7 py-3.5 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "14px",
                fontWeight: 600,
                background: "linear-gradient(135deg, #f59e0b, #fcd34d)",
                color: "#07090f",
                boxShadow: "0 0 32px rgba(245,158,11,0.28), 0 4px 16px rgba(0,0,0,0.3)",
              }}
            >
              View my work
            </button>
            <button
              onClick={() => scrollTo("contact")}
              className="px-7 py-3.5 rounded-xl transition-all duration-200 hover:border-white/20 hover:bg-white/[0.04]"
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "14px",
                fontWeight: 500,
                color: "rgba(255,255,255,0.62)",
                border: "1px solid rgba(255,255,255,0.1)",
                background: "transparent",
              }}
            >
              Get in touch
            </button>
          </motion.div>

          {/* Tech pills */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.78 }}
            className="flex flex-wrap items-center justify-center gap-2 mt-12"
          >
            <span style={{ fontFamily: "Inter, sans-serif", fontSize: "11px", color: "rgba(255,255,255,0.22)", marginRight: "4px" }}>
              Working with
            </span>
            {TECH_PILLS.map((t, i) => (
              <motion.span
                key={t}
                initial={{ opacity: 0, scale: 0.88 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.82 + i * 0.06, duration: 0.3 }}
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "11.5px",
                  fontWeight: 450,
                  color: "rgba(255,255,255,0.34)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  background: "rgba(255,255,255,0.025)",
                  borderRadius: "6px",
                  padding: "3px 10px",
                }}
              >
                {t}
              </motion.span>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.3, duration: 0.6 }}
        className="relative z-10 flex flex-col items-center pb-10 gap-2"
      >
        <button
          onClick={() => scrollTo("projects")}
          className="flex flex-col items-center gap-2 group focus:outline-none"
          aria-label="Scroll to projects"
        >
          <span style={{ fontFamily: "Inter, sans-serif", fontSize: "10.5px", letterSpacing: "0.12em", color: "rgba(255,255,255,0.22)", textTransform: "uppercase" }}>
            Scroll
          </span>
          <motion.div
            animate={{ y: [0, 5, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="group-hover:opacity-70 transition-opacity"
            style={{ color: "rgba(255,255,255,0.2)" }}
          >
            <ArrowDown size={14} />
          </motion.div>
        </button>
      </motion.div>
    </section>
  );
}
