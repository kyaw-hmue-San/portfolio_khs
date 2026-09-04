import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "motion/react";
import { Menu, X } from "lucide-react";

const NAV_ITEMS = [
  { label: "Projects", id: "projects" },
  { label: "Skills", id: "skills" },
  { label: "Education", id: "education" },
  { label: "Contact", id: "contact" },
];

function scrollTo(id: string) {
  const el = document.getElementById(id);
  if (el) {
    const offset = 72;
    const top = el.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: "smooth" });
  }
}
export function Navbar() {
  const [elevated, setElevated] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const lastY = useRef(0);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (y) => {
    setElevated(y > 24);
    if (y < 80) {
      setHidden(false);
    } else {
      setHidden(y > lastY.current + 4 && y > 200);
    }
    lastY.current = y;
  });

  // Track active section
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    NAV_ITEMS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -80 }}
        animate={{ y: hidden ? -80 : 0 }}
        transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
        className="fixed top-0 inset-x-0 z-50"
      >
        <div
          className="transition-all duration-500"
          style={{
            background: elevated
              ? "rgba(7, 9, 15, 0.88)"
              : "transparent",
            backdropFilter: elevated ? "blur(16px) saturate(180%)" : "none",
            borderBottom: elevated ? "1px solid rgba(255,255,255,0.06)" : "1px solid transparent",
            boxShadow: elevated ? "0 1px 40px rgba(0,0,0,0.4)" : "none",
          }}
        >
          <div className="max-w-6xl mx-auto px-6 h-[68px] flex items-center justify-between">
            {/* Logo */}
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="flex items-center gap-3 group focus:outline-none"
              aria-label="Back to top"
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-105"
                style={{
                  background: "linear-gradient(135deg, #f59e0b 0%, #fcd34d 100%)",
                  boxShadow: "0 0 16px rgba(245,158,11,0.3)",
                }}
              >
                <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "15px", fontWeight: 700, color: "#07090f" }}>
                  K
                </span>
              </div>
              <div className="hidden sm:block">
                <p style={{ fontFamily: "Inter, sans-serif", fontSize: "14px", fontWeight: 600, color: "rgba(255,255,255,0.9)", lineHeight: 1 }}>
                  Kyaw Hmue San
                </p>
                <p style={{ fontFamily: "Inter, sans-serif", fontSize: "11px", fontWeight: 400, color: "rgba(255,255,255,0.38)", lineHeight: 1, marginTop: "3px" }}>
                  Software Engineer
                </p>
              </div>
            </button>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-0.5">
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollTo(item.id)}
                  aria-current={active === item.id ? "location" : undefined}
                  className="relative px-3.5 py-2 rounded-lg transition-colors duration-150 focus:outline-none"
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: "13.5px",
                    fontWeight: active === item.id ? 500 : 400,
                    color: active === item.id ? "rgba(255,255,255,0.92)" : "rgba(255,255,255,0.44)",
                  }}
                  onMouseEnter={(e) => {
                    if (active !== item.id)
                      (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.7)";
                  }}
                  onMouseLeave={(e) => {
                    if (active !== item.id)
                      (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.44)";
                  }}
                >
                  {item.label}
                  {active === item.id && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-lg"
                      style={{ background: "rgba(255,255,255,0.07)" }}
                      transition={{ type: "spring", duration: 0.4, bounce: 0.2 }}
                    />
                  )}
                </button>
              ))}
            </nav>

            {/* CTA + hamburger */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => scrollTo("contact")}
                className="hidden md:inline-flex items-center px-4 py-2 rounded-lg transition-all duration-200 hover:scale-[1.02] focus:outline-none"
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "13px",
                  fontWeight: 600,
                  background: "linear-gradient(135deg, #f59e0b, #fcd34d)",
                  color: "#07090f",
                  boxShadow: "0 0 20px rgba(245,158,11,0.22)",
                }}
              >
                Hire me
              </button>
              <button
                className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg border border-white/8 text-white/50 hover:text-white/80 hover:border-white/16 transition-colors focus:outline-none"
                onClick={() => setOpen((v) => !v)}
                aria-label={open ? "Close navigation menu" : "Open navigation menu"}
                aria-expanded={open}
                aria-controls="mobile-navigation"
              >
                {open ? <X size={17} /> : <Menu size={17} />}
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="mobile-menu"
            id="mobile-navigation"
            initial={{ opacity: 0, y: -12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="fixed top-[76px] inset-x-4 z-50 rounded-2xl overflow-hidden md:hidden"
            style={{
              background: "rgba(13,17,28,0.97)",
              border: "1px solid rgba(255,255,255,0.08)",
              backdropFilter: "blur(20px)",
              boxShadow: "0 24px 64px rgba(0,0,0,0.6)",
            }}
          >
            <div className="p-3 flex flex-col gap-0.5">
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.id}
                  onClick={() => { scrollTo(item.id); setOpen(false); }}
                  className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-left transition-colors focus:outline-none"
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: "15px",
                    fontWeight: 400,
                    color: active === item.id ? "rgba(255,255,255,0.92)" : "rgba(255,255,255,0.55)",
                    background: active === item.id ? "rgba(255,255,255,0.06)" : "transparent",
                  }}
                >
                  {active === item.id && (
                    <span className="w-1 h-4 rounded-full" style={{ background: "#f59e0b" }} />
                  )}
                  {item.label}
                </button>
              ))}
              <div className="h-px mx-2 my-1" style={{ background: "rgba(255,255,255,0.06)" }} />
              <button
                onClick={() => { scrollTo("contact"); setOpen(false); }}
                className="mx-2 mb-1 mt-0.5 py-3 rounded-xl transition-all"
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "14px",
                  fontWeight: 600,
                  background: "linear-gradient(135deg, #f59e0b, #fcd34d)",
                  color: "#07090f",
                }}
              >
                Hire me
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
