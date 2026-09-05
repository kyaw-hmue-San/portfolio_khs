import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "motion/react";
import { Languages, Menu, Moon, Sun, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { LANGUAGES } from "../../i18n";
import { useTheme } from "../providers/ThemeProvider";

const NAV_ITEMS = [
  { key: "common.projects", id: "projects" },
  { key: "common.skills", id: "skills" },
  { key: "common.education", id: "education" },
  { key: "common.contact", id: "contact" },
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
  const { t, i18n } = useTranslation();
  const { resolvedTheme, toggleTheme } = useTheme();
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
              ? "var(--portfolio-nav-bg)"
              : "transparent",
            backdropFilter: elevated ? "blur(16px) saturate(180%)" : "none",
            borderBottom: elevated ? "1px solid rgb(var(--portfolio-ink-rgb) / 0.06)" : "1px solid transparent",
            boxShadow: elevated ? "0 1px 40px rgba(0,0,0,0.4)" : "none",
          }}
        >
          <div className="max-w-6xl mx-auto px-6 h-[68px] flex items-center justify-between">
            {/* Logo */}
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="flex items-center gap-3 group focus:outline-none"
              aria-label={t("common.backToTop")}
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-105"
                style={{
                  background: "linear-gradient(135deg, #f59e0b 0%, #fcd34d 100%)",
                  boxShadow: "0 0 16px rgba(245,158,11,0.3)",
                }}
              >
                <span style={{ fontFamily: "var(--portfolio-font-display)", fontSize: "15px", fontWeight: 700, color: "#07090f" }}>
                  K
                </span>
              </div>
              <div className="hidden sm:block">
                <p style={{ fontFamily: "var(--portfolio-font-sans)", fontSize: "14px", fontWeight: 600, color: "var(--portfolio-text-strong)", lineHeight: 1 }}>
                  {t("common.name")}
                </p>
                <p style={{ fontFamily: "var(--portfolio-font-sans)", fontSize: "11px", fontWeight: 400, color: "var(--portfolio-text-muted)", lineHeight: 1, marginTop: "3px" }}>
                  {t("common.role")}
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
                    fontFamily: "var(--portfolio-font-sans)",
                    fontSize: "13.5px",
                    fontWeight: active === item.id ? 500 : 400,
                    color: active === item.id ? "var(--portfolio-text-strong)" : "var(--portfolio-text-muted)",
                  }}
                  onMouseEnter={(e) => {
                    if (active !== item.id)
                      (e.currentTarget as HTMLElement).style.color = "var(--portfolio-text-secondary)";
                  }}
                  onMouseLeave={(e) => {
                    if (active !== item.id)
                      (e.currentTarget as HTMLElement).style.color = "var(--portfolio-text-muted)";
                  }}
                >
                  {t(item.key)}
                  {active === item.id && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-lg"
                      style={{ background: "rgb(var(--portfolio-ink-rgb) / 0.07)" }}
                      transition={{ type: "spring", duration: 0.4, bounce: 0.2 }}
                    />
                  )}
                </button>
              ))}
            </nav>

            {/* CTA + hamburger */}
            <div className="flex items-center gap-3">
              <div className="portfolio-nav-preferences">
                <button
                  type="button"
                  className="portfolio-theme-toggle"
                  onClick={toggleTheme}
                  aria-label={t("common.theme")}
                  title={t("common.theme")}
                >
                  {resolvedTheme === "dark" ? <Sun size={15} aria-hidden="true" /> : <Moon size={15} aria-hidden="true" />}
                </button>
                <label className="portfolio-language-select" title={t("common.language")}>
                  <Languages size={14} aria-hidden="true" />
                  <span className="sr-only">{t("common.language")}</span>
                  <select
                    value={(i18n.resolvedLanguage ?? "en").split("-")[0]}
                    onChange={(event) => {
                      const language = event.target.value;
                      window.localStorage.setItem("portfolio-language", language);
                      void i18n.changeLanguage(language);
                      document.documentElement.lang = language;
                    }}
                    aria-label={t("common.language")}
                  >
                    {LANGUAGES.map((language) => (
                      <option key={language.code} value={language.code}>{language.short}</option>
                    ))}
                  </select>
                </label>
              </div>
              <button
                onClick={() => scrollTo("contact")}
                className="hidden md:inline-flex items-center px-4 py-2 rounded-lg transition-all duration-200 hover:scale-[1.02] focus:outline-none"
                style={{
                  fontFamily: "var(--portfolio-font-sans)",
                  fontSize: "13px",
                  fontWeight: 600,
                  background: "linear-gradient(135deg, #f59e0b, #fcd34d)",
                  color: "#07090f",
                  boxShadow: "0 0 20px rgba(245,158,11,0.22)",
                }}
              >
                {t("common.hireMe")}
              </button>
              <button
                className="portfolio-icon-button md:hidden w-9 h-9 flex items-center justify-center rounded-lg transition-colors focus:outline-none"
                onClick={() => setOpen((v) => !v)}
                aria-label={open ? t("common.closeMenu") : t("common.openMenu")}
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
              background: "var(--portfolio-panel-bg)",
              border: "1px solid rgb(var(--portfolio-ink-rgb) / 0.08)",
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
                    fontFamily: "var(--portfolio-font-sans)",
                    fontSize: "15px",
                    fontWeight: 400,
                    color: active === item.id ? "var(--portfolio-text-strong)" : "var(--portfolio-text-secondary)",
                    background: active === item.id ? "rgb(var(--portfolio-ink-rgb) / 0.06)" : "transparent",
                  }}
                >
                  {active === item.id && (
                    <span className="w-1 h-4 rounded-full" style={{ background: "#f59e0b" }} />
                  )}
                  {t(item.key)}
                </button>
              ))}
              <div className="h-px mx-2 my-1" style={{ background: "rgb(var(--portfolio-ink-rgb) / 0.06)" }} />
              <button
                onClick={() => { scrollTo("contact"); setOpen(false); }}
                className="mx-2 mb-1 mt-0.5 py-3 rounded-xl transition-all"
                style={{
                  fontFamily: "var(--portfolio-font-sans)",
                  fontSize: "14px",
                  fontWeight: 600,
                  background: "linear-gradient(135deg, #f59e0b, #fcd34d)",
                  color: "#07090f",
                }}
              >
                {t("common.hireMe")}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
