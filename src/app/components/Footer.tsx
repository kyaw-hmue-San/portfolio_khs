import { ArrowUp } from "lucide-react";

const NAV_ITEMS = [
  { label: "Projects", id: "projects" },
  { label: "Skills", id: "skills" },
  { label: "Education", id: "education" },
  { label: "Resume", id: "resume" },
  { label: "Contact", id: "contact" },
];

function scrollTo(id: string) {
  const el = document.getElementById(id);
  if (el) {
    const top = el.getBoundingClientRect().top + window.scrollY - 72;
    window.scrollTo({ top, behavior: "smooth" });
  }
}

export function Footer() {
  return (
    <footer
      className="px-6 pb-10 pt-14"
      style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
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
                <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "15px", fontWeight: 700, color: "#07090f" }}>K</span>
              </div>
              <span style={{ fontFamily: "Inter, sans-serif", fontSize: "14px", fontWeight: 600, color: "rgba(255,255,255,0.7)" }}>
                Kyaw Hmue San
              </span>
            </div>
            <p style={{ fontFamily: "Inter, sans-serif", fontSize: "13px", lineHeight: 1.62, color: "rgba(255,255,255,0.28)" }}>
              Software Engineering student at Mae Fah Luang University, Thailand.
              Interested in thoughtful software, practical problem solving, and continuous learning.
            </p>
          </div>

          {/* Navigation */}
          <div className="flex flex-col gap-2">
            <p style={{ fontFamily: "Inter, sans-serif", fontSize: "10.5px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.22)", marginBottom: "4px" }}>
              Sections
            </p>
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className="text-left transition-colors focus:outline-none"
                style={{ fontFamily: "Inter, sans-serif", fontSize: "13.5px", color: "rgba(255,255,255,0.32)" }}
                onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.6)"}
                onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.32)"}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Back to top */}
          <div className="flex flex-col items-start md:items-end justify-between gap-4">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all hover:bg-white/5 focus:outline-none group"
              style={{
                fontFamily: "Inter, sans-serif", fontSize: "13px", fontWeight: 500,
                color: "rgba(255,255,255,0.35)", border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <ArrowUp size={13} className="group-hover:-translate-y-0.5 transition-transform" />
              Back to top
            </button>
            <p style={{ fontFamily: "Inter, sans-serif", fontSize: "12px", color: "rgba(255,255,255,0.18)", textAlign: "right" }}>
              Portfolio focused on learning and practical software work
            </p>
          </div>

        </div>

        <div style={{ height: "1px", background: "rgba(255,255,255,0.05)", marginBottom: "20px" }} />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <p style={{ fontFamily: "Inter, sans-serif", fontSize: "12px", color: "rgba(255,255,255,0.2)" }}>
            © 2026 Kyaw Hmue San. All rights reserved.
          </p>
          <p style={{ fontFamily: "Inter, sans-serif", fontSize: "12px", color: "rgba(255,255,255,0.2)" }}>
            Public portfolio · Personal projects and learning notes
          </p>
        </div>
      </div>
    </footer>
  );
}
