import type { ReactNode } from "react";
import { motion } from "motion/react";
import { ArrowUpRight, Github, Linkedin, Mail } from "lucide-react";
import { useTranslation } from "react-i18next";

const EMAIL = "kyawhmuesan@gmail.com";

function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.52, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

const CONTACT_LINKS = [
  {
    Icon: Mail,
    labelKey: "contactSection.email",
    value: EMAIL,
    noteKey: "contactSection.emailNote",
    href: `mailto:${EMAIL}`,
    accent: "#f59e0b",
  },
  {
    Icon: Linkedin,
    labelKey: "contactSection.linkedin",
    value: "kyaw-hmue-san",
    noteKey: "contactSection.linkedinNote",
    href: "https://www.linkedin.com/in/kyaw-hmue-san-448a92270/",
    accent: "#60a5fa",
  },
  {
    Icon: Github,
    labelKey: "contactSection.github",
    value: "kyaw-hmue-San",
    noteKey: "contactSection.githubNote",
    href: "https://github.com/kyaw-hmue-San",
    accent: "rgb(var(--portfolio-ink-rgb) / 0.72)",
  },
];

export function Contact() {
  const { t } = useTranslation();
  return (
    <section id="contact" className="contact-section px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="contact-layout">
          <Reveal className="contact-intro">
            <span className="contact-label">{t("contactSection.label")}</span>
            <h2>
              {t("contactSection.title")}<br />
              <em>{t("contactSection.accent")}</em>
            </h2>
            <p>{t("contactSection.intro")}</p>
            <div className="contact-availability">
              <span aria-hidden="true" />
              {t("contactSection.available")}
            </div>
          </Reveal>

          <div className="contact-links">
            {CONTACT_LINKS.map(({ Icon, labelKey, value, noteKey, href, accent }, index) => (
              <Reveal key={labelKey} delay={0.07 + index * 0.07}>
                <a
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel={href.startsWith("http") ? "noreferrer" : undefined}
                  className="contact-link"
                >
                  <span className="contact-link-icon" style={{ color: accent }}>
                    <Icon size={19} aria-hidden="true" />
                  </span>
                  <span className="contact-link-copy">
                    <strong>{t(labelKey)}</strong>
                    <span>{value}</span>
                    <small>{t(noteKey)}</small>
                  </span>
                  <ArrowUpRight className="contact-link-arrow" size={16} aria-hidden="true" />
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
