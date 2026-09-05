import { ArrowUp } from "lucide-react";
import { useTranslation } from "react-i18next";

const NAV_ITEMS = [
  { key: "common.projects", id: "projects" },
  { key: "common.skills", id: "skills" },
  { key: "common.education", id: "education" },
  { key: "common.contact", id: "contact" },
];

function scrollTo(id: string) {
  const el = document.getElementById(id);
  if (el) {
    const top = el.getBoundingClientRect().top + window.scrollY - 72;
    window.scrollTo({ top, behavior: "smooth" });
  }
}

export function Footer() {
  const { t } = useTranslation();
  return (
    <footer
      className="px-6 pb-10 pt-14"
      style={{ borderTop: "1px solid rgb(var(--portfolio-ink-rgb) / 0.05)" }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">

          {/* Brand */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2.5">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                style={{
                  background: "linear-gradient(135deg, #f59e0b, #fcd34d)",
                  boxShadow: "0 0 14px rgba(245,158,11,0.2)",
                }}
              >
                <span style={{ fontFamily: "var(--portfolio-font-display)", fontSize: "15px", fontWeight: 700, color: "#07090f" }}>K</span>
              </div>
              <span style={{ fontFamily: "var(--portfolio-font-sans)", fontSize: "14px", fontWeight: 600, color: "var(--portfolio-text-secondary)" }}>
                {t("common.name")}
              </span>
            </div>
            <p style={{ fontFamily: "var(--portfolio-font-sans)", fontSize: "13px", lineHeight: 1.62, color: "var(--portfolio-text-muted)" }}>
              {t("footer.bio")}
            </p>
          </div>

          {/* Navigation */}
          <div className="flex flex-col gap-2">
            <p style={{ fontFamily: "var(--portfolio-font-sans)", fontSize: "10.5px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--portfolio-text-faint)", marginBottom: "4px" }}>
              {t("footer.sections")}
            </p>
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className="text-left transition-colors focus:outline-none"
                style={{ fontFamily: "var(--portfolio-font-sans)", fontSize: "13.5px", color: "var(--portfolio-text-muted)" }}
                onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.color = "var(--portfolio-text-secondary)"}
                onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.color = "var(--portfolio-text-muted)"}
              >
                {t(item.key)}
              </button>
            ))}
          </div>

          {/* Back to top */}
          <div className="flex flex-col items-start md:items-end justify-between gap-4">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="portfolio-subtle-button flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all focus:outline-none group"
              style={{
                fontFamily: "var(--portfolio-font-sans)", fontSize: "13px", fontWeight: 500,
                color: "var(--portfolio-text-muted)", border: "1px solid rgb(var(--portfolio-ink-rgb) / 0.08)",
              }}
            >
              <ArrowUp size={13} className="group-hover:-translate-y-0.5 transition-transform" />
              {t("common.backToTop")}
            </button>
            <p style={{ fontFamily: "var(--portfolio-font-sans)", fontSize: "12px", color: "var(--portfolio-text-faint)", textAlign: "right" }}>
              {t("footer.note")}
            </p>
          </div>

        </div>

        <div style={{ height: "1px", background: "rgb(var(--portfolio-ink-rgb) / 0.05)", marginBottom: "20px" }} />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <p style={{ fontFamily: "var(--portfolio-font-sans)", fontSize: "12px", color: "var(--portfolio-text-faint)" }}>
            {t("footer.rights")}
          </p>
          <p style={{ fontFamily: "var(--portfolio-font-sans)", fontSize: "12px", color: "var(--portfolio-text-faint)" }}>
            {t("footer.public")}
          </p>
        </div>
      </div>
    </footer>
  );
}
